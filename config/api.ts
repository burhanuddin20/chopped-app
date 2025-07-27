// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000'  // Development
    : 'https://api.chopped.app', // Production (replace with your actual API URL)
  
  // API endpoints
  ENDPOINTS: {
    ANALYZE: '/analyze',
    HEALTH: '/health',
  },
  
  // Request timeouts
  TIMEOUT: 30000, // 30 seconds
  
  // File upload settings
  UPLOAD: {
    MAX_FILES: 4,
    MIN_FILES: 2,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => {
  return __DEV__;
};