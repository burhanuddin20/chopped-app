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

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  // Analyze uploaded photos
  async analyzePhotos(photos: PhotoData[]): Promise<AnalysisResult> {
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
        // Don't set Content-Type header - let fetch set it automatically for FormData
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Analysis failed. Please try again later. (Error: ${response.status})`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      return result;
    } catch (error) {
      console.error('Analysis API error:', error);
      // Don't fallback to mock data - throw the error instead
      throw new Error('Analysis failed. Please try again later.');
    }
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

export default AnalysisService.getInstance();