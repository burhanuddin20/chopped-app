import { Platform } from 'react-native';
import { API_CONFIG, getApiUrl } from '../config/api';

export interface PhotoData {
  id: string;
  type: 'front' | 'side' | 'body';
  uri: string;
  label: string;
  description: string;
}

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

class AnalysisService {
  private static instance: AnalysisService;
  private baseUrl = API_CONFIG.BASE_URL;
  private useMockData = true; // Set to true to use mock data instead of API

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  // Analyze uploaded photos
  async analyzePhotos(photos: PhotoData[]): Promise<AnalysisResult> {
    if (this.useMockData) {
      return this.getMockAnalysisResult(photos);
    }

    try {
      const formData = new FormData();
      
      // Add photos to form data
      photos.forEach((photo, index) => {
        const photoFile = {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `${photo.type}_${index}.jpg`,
        } as any;
        
        formData.append('photos', photoFile);
        formData.append('photoTypes', photo.type);
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ANALYZE), {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Analysis API error:', error);
      // Fallback to mock data if API fails
      return this.getMockAnalysisResult(photos);
    }
  }

  // Generate mock analysis result based on uploaded photos
  private getMockAnalysisResult(photos: PhotoData[]): AnalysisResult {
    // Generate a realistic score based on number of photos
    const baseScore = 60 + (photos.length * 5); // More photos = higher base score
    const randomVariation = Math.random() * 20 - 10; // ±10 points
    const totalScore = Math.max(0, Math.min(100, Math.round(baseScore + randomVariation)));

    // Calculate breakdown scores that sum to total
    const breakdown = {
      face: Math.round((totalScore * 0.25) + (Math.random() * 10 - 5)),
      hair: Math.round((totalScore * 0.20) + (Math.random() * 10 - 5)),
      skin: Math.round((totalScore * 0.15) + (Math.random() * 10 - 5)),
      style: Math.round((totalScore * 0.20) + (Math.random() * 10 - 5)),
      body: Math.round((totalScore * 0.20) + (Math.random() * 10 - 5)),
    };

    // Normalize breakdown to sum to total score
    const currentSum = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    const adjustment = totalScore - currentSum;
    const keys = Object.keys(breakdown) as Array<keyof typeof breakdown>;
    const adjustmentPerKey = Math.round(adjustment / keys.length);
    
    keys.forEach((key, index) => {
      if (index < Math.abs(adjustment)) {
        breakdown[key] += adjustment > 0 ? 1 : -1;
      }
    });

    // Ensure all scores are within valid range
    Object.keys(breakdown).forEach((key) => {
      breakdown[key as keyof typeof breakdown] = Math.max(0, Math.min(25, breakdown[key as keyof typeof breakdown]));
    });

    return {
      score: totalScore,
      breakdown,
      suggestions: this.getMockSuggestions(totalScore, photos),
    };
  }

  // Generate contextual suggestions based on score and photos
  private getMockSuggestions(score: number, photos: PhotoData[]): AnalysisResult['suggestions'] {
    const hasFrontPhoto = photos.some(p => p.type === 'front');
    const hasSidePhoto = photos.some(p => p.type === 'side');
    const hasBodyPhoto = photos.some(p => p.type === 'body');

    const suggestions = {
      face: hasFrontPhoto 
        ? this.getFaceSuggestion(score)
        : "Upload a clear front-facing photo for better facial analysis.",
      hair: hasFrontPhoto || hasSidePhoto
        ? this.getHairSuggestion(score)
        : "Side profile photos help us analyze your hair and beard better.",
      skin: hasFrontPhoto
        ? this.getSkinSuggestion(score)
        : "Front-facing photos with good lighting help assess skin condition.",
      style: hasBodyPhoto
        ? this.getStyleSuggestion(score)
        : "Full body photos help us evaluate your overall style and fit.",
      body: hasBodyPhoto
        ? this.getBodySuggestion(score)
        : "Full body shots help us assess posture and body proportions.",
    };

    return suggestions;
  }

  private getFaceSuggestion(score: number): string {
    if (score >= 80) return "Excellent facial symmetry and features! Your face structure is well-balanced.";
    if (score >= 70) return "Good facial harmony. Consider experimenting with different angles in photos.";
    if (score >= 60) return "Nice features! Try different lighting to highlight your best angles.";
    return "Consider different facial expressions and angles to showcase your features better.";
  }

  private getHairSuggestion(score: number): string {
    if (score >= 80) return "Your hair and beard style complements your face shape perfectly!";
    if (score >= 70) return "Great hair choice! A slight trim could enhance the overall look.";
    if (score >= 60) return "Good hair style. Consider trying a fade or textured cut for more definition.";
    return "A new haircut or beard trim could significantly improve your appearance.";
  }

  private getSkinSuggestion(score: number): string {
    if (score >= 80) return "Your skin looks healthy and well-maintained!";
    if (score >= 70) return "Good skin condition. A gentle exfoliator twice a week could help.";
    if (score >= 60) return "Nice skin! Consider a daily moisturizer for extra glow.";
    return "A basic skincare routine with cleanser and moisturizer could improve skin texture.";
  }

  private getStyleSuggestion(score: number): string {
    if (score >= 80) return "Excellent style choices! Your outfit fits well and looks polished.";
    if (score >= 70) return "Great style! Try experimenting with different fits and colors.";
    if (score >= 60) return "Good style sense. Consider more structured fits for a sharper look.";
    return "Try more fitted clothing and experiment with different styles to enhance your look.";
  }

  private getBodySuggestion(score: number): string {
    if (score >= 80) return "Great posture and body proportions! You carry yourself well.";
    if (score >= 70) return "Good posture! Standing tall makes a big difference in photos.";
    if (score >= 60) return "Nice body language. Practice confident posture for better photos.";
    return "Improving posture and body awareness can significantly enhance your appearance.";
  }

  // Enable/disable mock data for testing
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  // Set API base URL
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

export default AnalysisService.getInstance();