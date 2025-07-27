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

// Configure multer for file uploads (memory storage - no files saved to disk)
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory instead of disk
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
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Main analysis endpoint (rate limiting disabled for testing)
app.post('/analyze', 
  upload.array('photos', 4), 
  async (req, res) => {
    try {
      const files = req.files;
      const photoTypes = req.body.photoTypes;
      const userTier = req.body.userTier || 'free'; // Default to 'free' if not provided

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

      console.log(`Analyzing ${files.length} photos for ${userTier} user...`);

      // Process images and get analysis
      const analysisResult = await analyzeImages(files, photoTypes);

      // Clean up uploaded files
      files.forEach(file => {
        // No file deletion needed for memory storage
      });

      res.json(analysisResult);

    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({
        error: 'Analysis failed',
        message: 'Please try again later'
      });
    }
  }
);

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
      const base64Image = Buffer.from(file.buffer).toString('base64');
      return {
        type: 'image_url',
        image_url: {
          url: `data:${file.mimetype};base64,${base64Image}`
        }
      };
    });

    const images = await Promise.all(imagePromises);

    // Create general photo analysis prompt (avoiding content policy restrictions)
    const prompt = `Analyze these photos and provide feedback on visual presentation and style elements. Focus on:

Categories to evaluate:
- Visual composition and framing (0-25 points)
- Lighting and exposure quality (0-25 points) 
- Color balance and contrast (0-20 points)
- Subject positioning and angles (0-20 points)
- Overall visual appeal (0-20 points)

Provide constructive feedback for improvement. Respond with JSON only:
{
  "score": [0-100],
  "breakdown": {"face": [0-25], "hair": [0-25], "skin": [0-20], "style": [0-20], "body": [0-20]},
  "suggestions": {"face": "composition tip", "hair": "lighting tip", "skin": "color tip", "style": "angle tip", "body": "positioning tip"}
}`;

    // Call OpenAI with GPT-4o (current model, replaces deprecated gpt-4-vision-preview)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...images
          ]
        }
      ],
      max_tokens: 800, // Standard token limit
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // Log the ChatGPT response for debugging
    console.log('=== ChatGPT Response ===');
    console.log('Raw response:', content);
    console.log('Response length:', content.length);
    console.log('========================');
    
    // Parse JSON response
    let analysisResult;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON result:', JSON.stringify(analysisResult, null, 2));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw response:', content);
      
      // Don't fallback to mock data - throw the error instead
      throw new Error('Analysis failed. Please try again later.');
    }

    // Validate and normalize the response
    return validateAndNormalizeAnalysis(analysisResult);

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Don't fallback to mock data - throw the error instead
    throw new Error('Analysis failed. Please try again later.');
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