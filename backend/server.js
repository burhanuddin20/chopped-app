const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI (optional - will fallback to mock data if not available)
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI API configured successfully');
  } else {
    console.log('OpenAI API key not found - will use mock data');
  }
} catch (error) {
  console.log('OpenAI initialization failed - will use mock data:', error.message);
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/analyze', upload.array('photos', 4), async (req, res) => {
  try {
    const files = req.files;
    const photoTypes = req.body.photoTypes;

    if (!files || files.length < 2) {
      return res.status(400).json({
        error: 'At least 2 photos are required for analysis'
      });
    }

    if (files.length > 4) {
      return res.status(400).json({
        error: 'Maximum 4 photos allowed'
      });
    }

    console.log(`Analyzing ${files.length} photos...`);

    // Process images and get analysis
    const analysisResult = await analyzeImages(files, photoTypes);

    // Clean up uploaded files
    files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    res.json(analysisResult);

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Clean up files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Image analysis function
async function analyzeImages(files, photoTypes) {
  try {
    // If OpenAI is not available, use mock data
    if (!openai) {
      console.log('Using mock analysis (OpenAI not available)');
      return generateMockAnalysis(files.length);
    }

    // Convert images to base64 for OpenAI
    const imagePromises = files.map(async (file) => {
      const imageBuffer = fs.readFileSync(file.path);
      const base64Image = imageBuffer.toString('base64');
      return {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      };
    });

    const images = await Promise.all(imagePromises);

    // Create analysis prompt
    const prompt = `Analyze these photos and provide a comprehensive appearance assessment. 

Please evaluate the following aspects and provide:
1. An overall "Chop Score" from 0-100
2. Breakdown scores for each category (face, hair, skin, style, body) that sum to the total score
3. Constructive, friendly suggestions for improvement

Categories to evaluate:
- Face Harmony (0-25 points): facial symmetry, features, expressions
- Hair & Beard (0-25 points): style, grooming, suitability
- Skin (0-20 points): complexion, texture, care
- Style (0-20 points): clothing choices, fit, coordination
- Body (0-20 points): posture, proportions, presentation

Guidelines:
- Be constructive and encouraging
- Focus on actionable improvements
- Keep tone friendly and supportive
- Consider the number and types of photos provided
- If certain photos are missing, note this in suggestions

Respond with a JSON object in this exact format:
{
  "score": [0-100],
  "breakdown": {
    "face": [0-25],
    "hair": [0-25], 
    "skin": [0-20],
    "style": [0-20],
    "body": [0-20]
  },
  "suggestions": {
    "face": "constructive suggestion for facial improvements",
    "hair": "constructive suggestion for hair/beard improvements", 
    "skin": "constructive suggestion for skin care",
    "style": "constructive suggestion for style improvements",
    "body": "constructive suggestion for posture/body improvements"
  }
}`;

    // Call OpenAI GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...images
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    let analysisResult;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw response:', content);
      
      // Fallback to mock data
      return generateMockAnalysis(files.length);
    }

    // Validate and normalize the response
    return validateAndNormalizeAnalysis(analysisResult);

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to mock analysis
    return generateMockAnalysis(files.length);
  }
}

// Validate and normalize analysis result
function validateAndNormalizeAnalysis(result) {
  const normalized = {
    score: Math.max(0, Math.min(100, result.score || 70)),
    breakdown: {
      face: Math.max(0, Math.min(25, result.breakdown?.face || 15)),
      hair: Math.max(0, Math.min(25, result.breakdown?.hair || 15)),
      skin: Math.max(0, Math.min(20, result.breakdown?.skin || 12)),
      style: Math.max(0, Math.min(20, result.breakdown?.style || 12)),
      body: Math.max(0, Math.min(20, result.breakdown?.body || 12)),
    },
    suggestions: {
      face: result.suggestions?.face || "Consider different angles and lighting to showcase your features.",
      hair: result.suggestions?.hair || "A fresh haircut or beard trim could enhance your look.",
      skin: result.suggestions?.skin || "A basic skincare routine could improve your complexion.",
      style: result.suggestions?.style || "Experiment with different clothing styles and fits.",
      body: result.suggestions?.body || "Good posture can significantly improve your appearance.",
    }
  };

  // Ensure breakdown sums to total score
  const currentSum = Object.values(normalized.breakdown).reduce((sum, score) => sum + score, 0);
  const adjustment = normalized.score - currentSum;
  
  if (Math.abs(adjustment) > 1) {
    // Distribute adjustment across categories
    const keys = Object.keys(normalized.breakdown);
    const adjustmentPerKey = Math.round(adjustment / keys.length);
    
    keys.forEach((key, index) => {
      if (index < Math.abs(adjustment)) {
        normalized.breakdown[key] += adjustment > 0 ? 1 : -1;
      }
    });
  }

  return normalized;
}

// Generate mock analysis for fallback
function generateMockAnalysis(photoCount) {
  const baseScore = 60 + (photoCount * 5);
  const randomVariation = Math.random() * 20 - 10;
  const totalScore = Math.max(0, Math.min(100, Math.round(baseScore + randomVariation)));

  const breakdown = {
    face: Math.round(totalScore * 0.25),
    hair: Math.round(totalScore * 0.20),
    skin: Math.round(totalScore * 0.15),
    style: Math.round(totalScore * 0.20),
    body: Math.round(totalScore * 0.20),
  };

  return {
    score: totalScore,
    breakdown,
    suggestions: {
      face: "Great facial features! Consider different lighting angles.",
      hair: "Your hair style suits you well. A trim could enhance it further.",
      skin: "Good skin condition. A moisturizer could add extra glow.",
      style: "Nice style choices. Experiment with different fits.",
      body: "Good posture! Standing tall makes a big difference.",
    }
  };
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Chopped API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});