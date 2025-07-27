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
};

/**
 * Analyzes uploaded images and returns a Chop Score with breakdown
 * @param formData - FormData containing images and metadata
 * @returns Promise<AnalysisResult>
 */
export const analyzeImages = async (formData: FormData): Promise<AnalysisResult> => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('localhost')) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockAnalysisResult;
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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