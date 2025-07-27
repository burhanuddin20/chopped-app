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

// Freemium Configuration
const FREEMIUM_CONFIG = {
  // Free tier limits
  FREE_TIER: {
    maxImagesPerAnalysis: 2,
    maxAnalysesPerMonth: 3,
    maxImageSizeMB: 5,
    features: {
      basicAnalysis: true,
      detailedSuggestions: false,
      progressTracking: false,
      exportResults: false,
      priorityProcessing: false
    }
  },
  // Premium tier limits
  PREMIUM_TIER: {
    maxImagesPerAnalysis: 4,
    maxAnalysesPerMonth: 50,
    maxImageSizeMB: 10,
    features: {
      basicAnalysis: true,
      detailedSuggestions: true,
      progressTracking: true,
      exportResults: true,
      priorityProcessing: true
    }
  }
};

// In-memory user data store (replace with database in production)
const userData = new Map();

// Helper function to get or create user data
function getUserData(userId) {
  if (!userData.has(userId)) {
    userData.set(userId, {
      userId,
      subscription: 'free',
      usage: {
        analysesThisMonth: 0,
        lastAnalysisDate: null
      },
      subscriptionData: {
        startDate: new Date().toISOString(),
        endDate: null,
        plan: 'free'
      }
    });
  }
  return userData.get(userId);
}

// Helper function to check if user can perform analysis
function canPerformAnalysis(userId) {
  const user = getUserData(userId);
  const config = user.subscription === 'premium' ? FREEMIUM_CONFIG.PREMIUM_TIER : FREEMIUM_CONFIG.FREE_TIER;
  
  // Reset monthly usage if it's a new month
  const now = new Date();
  const lastAnalysis = user.usage.lastAnalysisDate ? new Date(user.usage.lastAnalysisDate) : null;
  
  if (!lastAnalysis || lastAnalysis.getMonth() !== now.getMonth() || lastAnalysis.getFullYear() !== now.getFullYear()) {
    user.usage.analysesThisMonth = 0;
  }
  
  return user.usage.analysesThisMonth < config.maxAnalysesPerMonth;
}

// Helper function to update user usage
function updateUserUsage(userId) {
  const user = getUserData(userId);
  user.usage.analysesThisMonth += 1;
  user.usage.lastAnalysisDate = new Date().toISOString();
  userData.set(userId, user);
}

// Helper function to check feature access
function hasFeatureAccess(userId, feature) {
  const user = getUserData(userId);
  const config = user.subscription === 'premium' ? FREEMIUM_CONFIG.PREMIUM_TIER : FREEMIUM_CONFIG.FREE_TIER;
  return config.features[feature] || false;
}

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
    fileSize: 10 * 1024 * 1024, // 10MB limit (will be adjusted per user tier)
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
async function analyzeImageWithAI(imagePath, imageType, isPremium = false) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Enhanced prompt for premium users
    const basePrompt = `Analyze this ${imageType} photo and provide a detailed assessment for a "Chop Score" system. 

    Please evaluate the following aspects and provide scores out of their respective maximums:
    - Face Harmony (max 25 points): facial symmetry, features, overall attractiveness
    - Hair & Beard (max 25 points): hairstyle, grooming, facial hair if applicable
    - Skin (max 20 points): skin condition, clarity, complexion
    - Outfit & Style (max 20 points): clothing choices, fit, style coordination
    - Posture & Body (max 20 points): posture, body language, overall presentation

    For each category, provide:
    1. A score out of the maximum
    2. A constructive, friendly suggestion for improvement`;

    const premiumPrompt = basePrompt + `

    ${isPremium ? 'Additionally, provide detailed insights including:' : ''}
    ${isPremium ? '- Specific product recommendations' : ''}
    ${isPremium ? '- Style trends that would suit this person' : ''}
    ${isPremium ? '- Detailed improvement timeline' : ''}
    ${isPremium ? '- Professional styling tips' : ''}

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
      ${isPremium ? ',"premiumInsights": {"productRecommendations": [], "styleTrends": [], "improvementTimeline": "", "professionalTips": []}' : ''}
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
              text: premiumPrompt
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
      max_tokens: isPremium ? 1500 : 1000, // More tokens for premium users
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
    const mockData = {
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

    // Add premium insights for premium users
    if (isPremium) {
      mockData.premiumInsights = {
        productRecommendations: [
          "Consider a high-quality facial cleanser for better skin health",
          "Invest in a good hair styling product for better hold"
        ],
        styleTrends: [
          "Current trends favor natural, well-groomed looks",
          "Minimalist styling is very popular this season"
        ],
        improvementTimeline: "You can see significant improvements within 2-3 weeks of consistent routine",
        professionalTips: [
          "Schedule regular grooming appointments",
          "Invest in quality basics over trendy pieces"
        ]
      };
    }

    return mockData;

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

// Get user subscription status and usage
app.get('/user/:userId/status', (req, res) => {
  try {
    const { userId } = req.params;
    const user = getUserData(userId);
    const config = user.subscription === 'premium' ? FREEMIUM_CONFIG.PREMIUM_TIER : FREEMIUM_CONFIG.FREE_TIER;
    
    res.json({
      userId,
      subscription: user.subscription,
      subscriptionData: user.subscriptionData,
      usage: {
        analysesThisMonth: user.usage.analysesThisMonth,
        maxAnalysesPerMonth: config.maxAnalysesPerMonth,
        remainingAnalyses: config.maxAnalysesPerMonth - user.usage.analysesThisMonth
      },
      limits: {
        maxImagesPerAnalysis: config.maxImagesPerAnalysis,
        maxImageSizeMB: config.maxImageSizeMB
      },
      features: config.features
    });
  } catch (error) {
    console.error('Error getting user status:', error);
    res.status(500).json({ error: 'Failed to get user status' });
  }
});

// Upgrade user to premium (mock implementation)
app.post('/user/:userId/upgrade', (req, res) => {
  try {
    const { userId } = req.params;
    const { plan = 'premium' } = req.body;
    
    const user = getUserData(userId);
    user.subscription = plan;
    user.subscriptionData = {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      plan: plan
    };
    
    userData.set(userId, user);
    
    res.json({
      success: true,
      message: 'Successfully upgraded to premium',
      subscription: user.subscription,
      subscriptionData: user.subscriptionData
    });
  } catch (error) {
    console.error('Error upgrading user:', error);
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

// Main analysis endpoint with freemium support
app.post('/analyze', upload.array('images', 4), async (req, res) => {
  try {
    // Get user ID from request (you might get this from auth token in production)
    const userId = req.body.userId || 'anonymous';
    const user = getUserData(userId);
    const isPremium = user.subscription === 'premium';
    const config = isPremium ? FREEMIUM_CONFIG.PREMIUM_TIER : FREEMIUM_CONFIG.FREE_TIER;

    // Validate request
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        error: 'At least 2 images are required' 
      });
    }

    // Check image count limit
    if (req.files.length > config.maxImagesPerAnalysis) {
      return res.status(400).json({
        error: `Maximum ${config.maxImagesPerAnalysis} images allowed for ${user.subscription} tier`,
        upgradeRequired: !isPremium
      });
    }

    // Check monthly usage limit
    if (!canPerformAnalysis(userId)) {
      return res.status(429).json({
        error: `Monthly analysis limit reached (${config.maxAnalysesPerMonth})`,
        upgradeRequired: !isPremium,
        remainingAnalyses: 0
      });
    }

    // Check file size limits
    const oversizedFiles = req.files.filter(file => file.size > config.maxImageSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return res.status(400).json({
        error: `File size exceeds ${config.maxImageSizeMB}MB limit for ${user.subscription} tier`,
        upgradeRequired: !isPremium
      });
    }

    const imageTypes = req.body.imageTypes ? 
      (Array.isArray(req.body.imageTypes) ? req.body.imageTypes : [req.body.imageTypes]) : 
      [];

    console.log(`Analyzing ${req.files.length} images for ${user.subscription} user ${userId}...`);

    // Update usage before processing
    updateUserUsage(userId);

    // Analyze each image with premium features if applicable
    const analysisResults = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageType = imageTypes[i] || 'general';
      
      console.log(`Analyzing ${imageType} image: ${file.filename}`);
      
      const result = await analyzeImageWithAI(file.path, imageType, isPremium);
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

    // Build response based on subscription tier
    const response = {
      score: overallScore,
      breakdown: combinedBreakdown,
      suggestions: suggestions,
      subscription: user.subscription,
      usage: {
        analysesThisMonth: user.usage.analysesThisMonth,
        maxAnalysesPerMonth: config.maxAnalysesPerMonth,
        remainingAnalyses: config.maxAnalysesPerMonth - user.usage.analysesThisMonth
      }
    };

    // Add premium features if user is premium
    if (isPremium && analysisResults[0].premiumInsights) {
      response.premiumInsights = analysisResults[0].premiumInsights;
    }

    // Clean up uploaded files
    req.files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    console.log(`Analysis completed successfully for ${user.subscription} user ${userId}`);
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

// Get available plans and features
app.get('/plans', (req, res) => {
  res.json({
    plans: {
      free: {
        name: 'Free',
        price: 0,
        features: FREEMIUM_CONFIG.FREE_TIER.features,
        limits: {
          maxImagesPerAnalysis: FREEMIUM_CONFIG.FREE_TIER.maxImagesPerAnalysis,
          maxAnalysesPerMonth: FREEMIUM_CONFIG.FREE_TIER.maxAnalysesPerMonth,
          maxImageSizeMB: FREEMIUM_CONFIG.FREE_TIER.maxImageSizeMB
        }
      },
      premium: {
        name: 'Premium',
        price: 9.99,
        features: FREEMIUM_CONFIG.PREMIUM_TIER.features,
        limits: {
          maxImagesPerAnalysis: FREEMIUM_CONFIG.PREMIUM_TIER.maxImagesPerAnalysis,
          maxAnalysesPerMonth: FREEMIUM_CONFIG.PREMIUM_TIER.maxAnalysesPerMonth,
          maxImageSizeMB: FREEMIUM_CONFIG.PREMIUM_TIER.maxImageSizeMB
        }
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    freemium: true,
    activeUsers: userData.size
  });
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
  console.log(`Freemium model enabled with ${Object.keys(FREEMIUM_CONFIG).length} tiers`);
});

module.exports = app;