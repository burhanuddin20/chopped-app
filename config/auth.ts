// OAuth Configuration
// Replace these with your actual OAuth credentials

export const AUTH_CONFIG = {
  // Google OAuth
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Get this from Google Cloud Console
    REDIRECT_URI: 'chopped-app://auth',
  },
  
  // Apple OAuth
  APPLE: {
    CLIENT_ID: 'YOUR_APPLE_CLIENT_ID', // Get this from Apple Developer Console
    REDIRECT_URI: 'chopped-app://auth',
  },
};

// Instructions for setting up OAuth:
// 
// 1. Google OAuth Setup:
//    - Go to https://console.cloud.google.com/
//    - Create a new project or select existing one
//    - Enable Google+ API
//    - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
//    - Set application type to "Mobile application"
//    - Add your package name (e.g., com.yourcompany.choppedapp)
//    - Copy the Client ID and replace YOUR_GOOGLE_CLIENT_ID above
//
// 2. Apple OAuth Setup:
//    - Go to https://developer.apple.com/
//    - Create an App ID
//    - Enable "Sign In with Apple" capability
//    - Create a Services ID
//    - Configure the redirect URI
//    - Copy the Client ID and replace YOUR_APPLE_CLIENT_ID above
//
// 3. Update app.json:
//    - Add your scheme: "scheme": "chopped-app"
//    - Add your bundle identifier 