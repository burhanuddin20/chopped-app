import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from '../config/auth';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = AUTH_CONFIG.GOOGLE.CLIENT_ID;
const GOOGLE_REDIRECT_URI = AUTH_CONFIG.GOOGLE.REDIRECT_URI;

// Apple OAuth configuration
const APPLE_CLIENT_ID = AUTH_CONFIG.APPLE.CLIENT_ID;
const APPLE_REDIRECT_URI = AUTH_CONFIG.APPLE.REDIRECT_URI;

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Google Sign In
  async signInWithGoogle(): Promise<User | null> {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      if (result.type === 'success') {
        const user = await this.handleGoogleAuthResult(result);
        if (user) {
          await this.saveUser(user);
          this.user = user;
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return null;
    }
  }

  // Apple Sign In
  async signInWithApple(): Promise<User | null> {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: APPLE_CLIENT_ID,
        scopes: ['name', 'email'],
        redirectUri: APPLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          response_mode: 'form_post',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
      });

      if (result.type === 'success') {
        const user = await this.handleAppleAuthResult(result);
        if (user) {
          await this.saveUser(user);
          this.user = user;
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return null;
    }
  }

  private async handleGoogleAuthResult(result: AuthSession.AuthSessionResult): Promise<User | null> {
    if (result.type !== 'success') return null;

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: result.params.code,
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const userInfo = await userResponse.json();

      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google' as const,
      };
    } catch (error) {
      console.error('Error handling Google auth result:', error);
      return null;
    }
  }

  private async handleAppleAuthResult(result: AuthSession.AuthSessionResult): Promise<User | null> {
    if (result.type !== 'success') return null;

    try {
      // For Apple, you'll need to implement token exchange with your backend
      // This is a simplified version - you'll need to add your backend integration
      
      // For now, return a mock user
      return {
        id: 'apple_user_' + Date.now(),
        email: 'user@example.com', // You'll get this from Apple
        name: 'Apple User', // You'll get this from Apple
        provider: 'apple' as const,
      };
    } catch (error) {
      console.error('Error handling Apple auth result:', error);
      return null;
    }
  }

  // Save user to AsyncStorage
  private async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  // Load user from AsyncStorage
  async loadUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        this.user = JSON.parse(userString);
        return this.user;
      }
      return null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
      this.user = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }
}

export default AuthService.getInstance(); 