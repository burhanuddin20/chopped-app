// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_ENDPOINT = `${API_BASE_URL}/analyze`;

// Types for the analysis response
export interface AnalysisResult {
  score: number;
  breakdown: {
    face: number;
    hair: number;
    skin: number;
    style: number;
    body: number;
  };
  suggestions: {
    face: string;
    hair: string;
    skin: string;
    style: string;
    body: string;
  };
  subscription?: string;
  usage?: {
    analysesThisMonth: number;
    maxAnalysesPerMonth: number;
    remainingAnalyses: number;
  };
  premiumInsights?: {
    productRecommendations: string[];
    styleTrends: string[];
    improvementTimeline: string;
    professionalTips: string[];
  };
}

// User subscription types
export interface UserStatus {
  userId: string;
  subscription: 'free' | 'premium';
  subscriptionData: {
    startDate: string;
    endDate: string | null;
    plan: string;
  };
  usage: {
    analysesThisMonth: number;
    maxAnalysesPerMonth: number;
    remainingAnalyses: number;
  };
  limits: {
    maxImagesPerAnalysis: number;
    maxImageSizeMB: number;
  };
  features: {
    basicAnalysis: boolean;
    detailedSuggestions: boolean;
    progressTracking: boolean;
    exportResults: boolean;
    priorityProcessing: boolean;
  };
}

// Plan information
export interface Plan {
  name: string;
  price: number;
  features: {
    basicAnalysis: boolean;
    detailedSuggestions: boolean;
    progressTracking: boolean;
    exportResults: boolean;
    priorityProcessing: boolean;
  };
  limits: {
    maxImagesPerAnalysis: number;
    maxAnalysesPerMonth: number;
    maxImageSizeMB: number;
  };
}

export interface PlansResponse {
  plans: {
    free: Plan;
    premium: Plan;
  };
}

// Mock data for development
const mockAnalysisResult: AnalysisResult = {
  score: 78,
  breakdown: {
    face: 18,
    hair: 16,
    skin: 15,
    style: 14,
    body: 15,
  },
  suggestions: {
    face: "Great facial symmetry! Consider a hairstyle that adds height to balance your face shape.",
    hair: "A fade haircut or short textured sides would enhance your jawline definition.",
    skin: "Your skin looks healthy. Consider a gentle exfoliator twice a week for even smoother texture.",
    style: "Opt for more structured fits on top to broaden your shoulders and improve proportions.",
    body: "Improving posture would make your silhouette stronger and more confident.",
  },
  subscription: 'free',
  usage: {
    analysesThisMonth: 1,
    maxAnalysesPerMonth: 3,
    remainingAnalyses: 2
  }
};

// Mock premium analysis result
const mockPremiumAnalysisResult: AnalysisResult = {
  ...mockAnalysisResult,
  subscription: 'premium',
  usage: {
    analysesThisMonth: 1,
    maxAnalysesPerMonth: 50,
    remainingAnalyses: 49
  },
  premiumInsights: {
    productRecommendations: [
      "Consider a high-quality facial cleanser for better skin health",
      "Invest in a good hair styling product for better hold",
      "Try a vitamin C serum for brighter skin"
    ],
    styleTrends: [
      "Current trends favor natural, well-groomed looks",
      "Minimalist styling is very popular this season",
      "Sustainable fashion choices are gaining popularity"
    ],
    improvementTimeline: "You can see significant improvements within 2-3 weeks of consistent routine",
    professionalTips: [
      "Schedule regular grooming appointments",
      "Invest in quality basics over trendy pieces",
      "Consider consulting with a personal stylist"
    ]
  }
};

// Generate a unique user ID (in production, this would come from authentication)
function generateUserId(): string {
  const storedId = localStorage.getItem('chopped_user_id');
  if (storedId) return storedId;
  
  const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('chopped_user_id', newId);
  return newId;
}

/**
 * Get user subscription status and usage
 * @param userId - User identifier
 * @returns Promise<UserStatus>
 */
export const getUserStatus = async (userId?: string): Promise<UserStatus> => {
  try {
    const id = userId || generateUserId();
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('localhost')) {
      const isPremium = Math.random() > 0.7; // 30% chance of premium for demo
      
      return {
        userId: id,
        subscription: isPremium ? 'premium' : 'free',
        subscriptionData: {
          startDate: new Date().toISOString(),
          endDate: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
          plan: isPremium ? 'premium' : 'free'
        },
        usage: {
          analysesThisMonth: Math.floor(Math.random() * 3),
          maxAnalysesPerMonth: isPremium ? 50 : 3,
          remainingAnalyses: isPremium ? 50 - Math.floor(Math.random() * 3) : 3 - Math.floor(Math.random() * 3)
        },
        limits: {
          maxImagesPerAnalysis: isPremium ? 4 : 2,
          maxImageSizeMB: isPremium ? 10 : 5
        },
        features: {
          basicAnalysis: true,
          detailedSuggestions: isPremium,
          progressTracking: isPremium,
          exportResults: isPremium,
          priorityProcessing: isPremium
        }
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/${id}/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Error getting user status:', error);
    
    // Return default free tier as fallback
    return {
      userId: userId || generateUserId(),
      subscription: 'free',
      subscriptionData: {
        startDate: new Date().toISOString(),
        endDate: null,
        plan: 'free'
      },
      usage: {
        analysesThisMonth: 0,
        maxAnalysesPerMonth: 3,
        remainingAnalyses: 3
      },
      limits: {
        maxImagesPerAnalysis: 2,
        maxImageSizeMB: 5
      },
      features: {
        basicAnalysis: true,
        detailedSuggestions: false,
        progressTracking: false,
        exportResults: false,
        priorityProcessing: false
      }
    };
  }
};

/**
 * Upgrade user to premium (mock implementation)
 * @param userId - User identifier
 * @param plan - Plan to upgrade to
 * @returns Promise<{success: boolean, message: string}>
 */
export const upgradeUser = async (userId: string, plan: string = 'premium'): Promise<{success: boolean, message: string}> => {
  try {
    // For development, simulate successful upgrade
    if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('localhost')) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Successfully upgraded to premium!'
      };
    }

    const response = await fetch(`${API_BASE_URL}/user/${userId}/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success,
      message: result.message
    };

  } catch (error) {
    console.error('Error upgrading user:', error);
    return {
      success: false,
      message: 'Failed to upgrade. Please try again.'
    };
  }
};

/**
 * Get available plans and features
 * @returns Promise<PlansResponse>
 */
export const getPlans = async (): Promise<PlansResponse> => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('localhost')) {
      return {
        plans: {
          free: {
            name: 'Free',
            price: 0,
            features: {
              basicAnalysis: true,
              detailedSuggestions: false,
              progressTracking: false,
              exportResults: false,
              priorityProcessing: false
            },
            limits: {
              maxImagesPerAnalysis: 2,
              maxAnalysesPerMonth: 3,
              maxImageSizeMB: 5
            }
          },
          premium: {
            name: 'Premium',
            price: 9.99,
            features: {
              basicAnalysis: true,
              detailedSuggestions: true,
              progressTracking: true,
              exportResults: true,
              priorityProcessing: true
            },
            limits: {
              maxImagesPerAnalysis: 4,
              maxAnalysesPerMonth: 50,
              maxImageSizeMB: 10
            }
          }
        }
      };
    }

    const response = await fetch(`${API_BASE_URL}/plans`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Error getting plans:', error);
    
    // Return default plans as fallback
    return {
      plans: {
        free: {
          name: 'Free',
          price: 0,
          features: {
            basicAnalysis: true,
            detailedSuggestions: false,
            progressTracking: false,
            exportResults: false,
            priorityProcessing: false
          },
          limits: {
            maxImagesPerAnalysis: 2,
            maxAnalysesPerMonth: 3,
            maxImageSizeMB: 5
          }
        },
        premium: {
          name: 'Premium',
          price: 9.99,
          features: {
            basicAnalysis: true,
            detailedSuggestions: true,
            progressTracking: true,
            exportResults: true,
            priorityProcessing: true
          },
          limits: {
            maxImagesPerAnalysis: 4,
            maxAnalysesPerMonth: 50,
            maxImageSizeMB: 10
          }
        }
      }
    };
  }
};

/**
 * Analyzes uploaded images and returns a Chop Score with breakdown
 * @param formData - FormData containing images and metadata
 * @param userId - User identifier for freemium tracking
 * @returns Promise<AnalysisResult>
 */
export const analyzeImages = async (formData: FormData, userId?: string): Promise<AnalysisResult> => {
  try {
    const id = userId || generateUserId();
    
    // Add userId to formData
    formData.append('userId', id);
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('localhost')) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly return premium or free result for demo
      const isPremium = Math.random() > 0.7; // 30% chance of premium
      return isPremium ? mockPremiumAnalysisResult : mockAnalysisResult;
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: AnalysisResult = await response.json();
    return result;

  } catch (error) {
    console.error('Error in analyzeImages:', error);
    
    // Return mock data as fallback
    return mockAnalysisResult;
  }
};

/**
 * Saves analysis results to local storage
 * @param result - Analysis result to save
 */
export const saveAnalysisResult = async (result: AnalysisResult): Promise<void> => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const history = await AsyncStorage.default.getItem('analysisHistory');
    const historyArray = history ? JSON.parse(history) : [];
    
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      result,
    };
    
    historyArray.unshift(newEntry);
    
    // Keep only last 10 results
    const trimmedHistory = historyArray.slice(0, 10);
    
    await AsyncStorage.default.setItem('analysisHistory', JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving analysis result:', error);
  }
};

/**
 * Retrieves analysis history from local storage
 * @returns Promise<Array>
 */
export const getAnalysisHistory = async (): Promise<any[]> => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const history = await AsyncStorage.default.getItem('analysisHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting analysis history:', error);
    return [];
  }
};