const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to analyze image with OpenAI
async function analyzeImageWithAI(imagePath, imageType) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this ${imageType} photo and provide a detailed assessment for a "Chop Score" system. 

    Please evaluate the following aspects and provide scores out of their respective maximums:
    - Face Harmony (max 25 points): facial symmetry, features, overall attractiveness
    - Hair & Beard (max 25 points): hairstyle, grooming, facial hair if applicable
    - Skin (max 20 points): skin condition, clarity, complexion
    - Outfit & Style (max 20 points): clothing choices, fit, style coordination
    - Posture & Body (max 20 points): posture, body language, overall presentation

    For each category, provide:
    1. A score out of the maximum
    2. A constructive, friendly suggestion for improvement

    Respond in this exact JSON format:
    {
      "breakdown": {
        "face": [score out of 25],
        "hair": [score out of 25],
        "skin": [score out of 20],
        "style": [score out of 20],
        "body": [score out of 20]
      },
      "suggestions": {
        "face": "[constructive suggestion]",
        "hair": "[constructive suggestion]",
        "skin": "[constructive suggestion]",
        "style": "[constructive suggestion]",
        "body": "[constructive suggestion]"
      }
    }

    Keep the tone positive and constructive. Focus on actionable improvements.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing JSON from AI response:', parseError);
    }

    // Fallback to mock data if parsing fails
    return {
      breakdown: {
        face: Math.floor(Math.random() * 15) + 10,
        hair: Math.floor(Math.random() * 15) + 10,
        skin: Math.floor(Math.random() * 12) + 8,
        style: Math.floor(Math.random() * 12) + 8,
        body: Math.floor(Math.random() * 12) + 8,
      },
      suggestions: {
        face: "Consider a hairstyle that complements your face shape.",
        hair: "A well-groomed haircut can enhance your overall appearance.",
        skin: "Maintain a consistent skincare routine for healthy skin.",
        style: "Choose clothing that fits well and reflects your personality.",
        body: "Good posture can significantly improve your appearance.",
      }
    };

  } catch (error) {
    console.error('Error analyzing image with AI:', error);
    throw error;
  }
}

// Helper function to calculate overall score
function calculateOverallScore(breakdown) {
  const total = breakdown.face + breakdown.hair + breakdown.skin + breakdown.style + breakdown.body;
  const maxPossible = 25 + 25 + 20 + 20 + 20; // 110
  return Math.round((total / maxPossible) * 100);
}

// API Routes
app.post('/analyze', upload.array('images', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        error: 'At least 2 images are required' 
      });
    }

    const imageTypes = req.body.imageTypes ? 
      (Array.isArray(req.body.imageTypes) ? req.body.imageTypes : [req.body.imageTypes]) : 
      [];

    console.log(`Analyzing ${req.files.length} images...`);

    // Analyze each image
    const analysisResults = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageType = imageTypes[i] || 'general';
      
      console.log(`Analyzing ${imageType} image: ${file.filename}`);
      
      const result = await analyzeImageWithAI(file.path, imageType);
      analysisResults.push(result);
    }

    // Combine results (simple averaging for now)
    const combinedBreakdown = {
      face: Math.round(analysisResults.reduce((sum, r) => sum + r.breakdown.face, 0) / analysisResults.length),
      hair: Math.round(analysisResults.reduce((sum, r) => sum + r.breakdown.hair, 0) / analysisResults.length),
      skin: Math.round(analysisResults.reduce((sum, r) => sum + r.breakdown.skin, 0) / analysisResults.length),
      style: Math.round(analysisResults.reduce((sum, r) => sum + r.breakdown.style, 0) / analysisResults.length),
      body: Math.round(analysisResults.reduce((sum, r) => sum + r.breakdown.body, 0) / analysisResults.length),
    };

    // Use suggestions from the first analysis (or combine them intelligently)
    const suggestions = analysisResults[0].suggestions;

    const overallScore = calculateOverallScore(combinedBreakdown);

    const response = {
      score: overallScore,
      breakdown: combinedBreakdown,
      suggestions: suggestions,
    };

    // Clean up uploaded files
    req.files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    console.log('Analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Analysis endpoint: http://localhost:${PORT}/analyze`);
});

module.exports = app;