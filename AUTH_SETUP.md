# Authentication Setup Guide

This guide will help you set up Google and Apple authentication for your Chopped app.

## 🚀 Quick Start

### 1. Update Configuration

Edit `config/auth.ts` and replace the placeholder values:

```typescript
export const AUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: "your-actual-google-client-id",
    REDIRECT_URI: "chopped-app://auth",
  },
  APPLE: {
    CLIENT_ID: "your-actual-apple-client-id",
    REDIRECT_URI: "chopped-app://auth",
  },
};
```

### 2. Update Bundle Identifiers

Edit `app.json` and replace the bundle identifiers:

```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.choppedapp"
  },
  "android": {
    "package": "com.yourcompany.choppedapp"
  }
}
```

## 🔧 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Set application type to **Mobile application**
4. Add your package name: `com.yourcompany.choppedapp`
5. Copy the **Client ID**

### Step 3: Update Configuration

Replace `YOUR_GOOGLE_CLIENT_ID` in `config/auth.ts` with your actual Client ID.

## 🍎 Apple OAuth Setup

### Step 1: Apple Developer Account

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create an **App ID**
3. Enable **Sign In with Apple** capability

### Step 2: Create Services ID

1. Go to **Certificates, Identifiers & Profiles**
2. Create a **Services ID**
3. Configure the redirect URI: `chopped-app://auth`
4. Copy the **Client ID**

### Step 3: Update Configuration

Replace `YOUR_APPLE_CLIENT_ID` in `config/auth.ts` with your actual Client ID.

## 📱 Testing

### Development Testing

1. Run `npm start` to start the development server
2. Press `i` for iOS simulator or `a` for Android emulator
3. Test the authentication buttons on the welcome screen

### Production Testing

1. Build your app: `expo build:ios` or `expo build:android`
2. Test on real devices

## 🔒 Security Notes

- Never commit your actual OAuth credentials to version control
- Use environment variables for production builds
- Consider implementing a backend for token validation
- Add proper error handling for authentication failures

## 🛠️ Customization

### Styling

The authentication buttons use the modern neon theme. You can customize them in:

- `components/Button.tsx` - Button styling
- `screens/WelcomeScreen.tsx` - Welcome screen layout

### User Data

After successful authentication, user data is stored in AsyncStorage. You can access it via:

```typescript
import { useAuth } from "../contexts/AuthContext";

const { user, signOut } = useAuth();
```

### Error Handling

The authentication service includes error handling. You can customize error messages in:

- `services/authService.ts` - Authentication logic
- `screens/WelcomeScreen.tsx` - User-facing error messages

## 📚 Additional Resources

- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
