import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Checkbox } from '../components/Checkbox';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isAgeVerified) {
      Alert.alert('Age Verification Required', 'Please confirm that you are 18 or older to continue.');
      return;
    }
    
    try {
      await signInWithGoogle();
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleAppleSignIn = async () => {
    if (!isAgeVerified) {
      Alert.alert('Age Verification Required', 'Please confirm that you are 18 or older to continue.');
      return;
    }
    
    try {
      await signInWithApple();
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    }
  };

  const handleContinueWithoutAuth = () => {
    if (!isAgeVerified) {
      Alert.alert('Age Verification Required', 'Please confirm that you are 18 or older to continue.');
      return;
    }
    
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        {/* Animated background elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.neonCircle, styles.neonCircle1]} />
          <View style={[styles.neonCircle, styles.neonCircle2]} />
          <View style={[styles.neonCircle, styles.neonCircle3]} />
        </View>

        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Card style={styles.logoCard}>
              <Text style={styles.logo}>CHOPPED</Text>
            </Card>
            <Text style={styles.tagline}>Don't be chopped</Text>
            <Text style={styles.subtitle}>
              Get AI-powered feedback to level up your appearance
            </Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="secondary"
              size="large"
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            />
            
            <Button
              title="Continue with Apple"
              onPress={handleAppleSignIn}
              variant="secondary"
              size="large"
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            />
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <Button
              title="Continue as guest"
              onPress={handleContinueWithoutAuth}
              variant="primary"
              size="large"
              style={styles.button}
              disabled={isLoading}
            />
            
            {/* Age Verification Checkbox */}
            <View style={styles.ageVerificationContainer}>
              <Checkbox
                checked={isAgeVerified}
                onToggle={() => setIsAgeVerified(!isAgeVerified)}
                label="I confirm that I am 18 years of age or older"
              />
            </View>
            
            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  neonCircle: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    opacity: 0.3,
  },
  neonCircle1: {
    backgroundColor: theme.colors.primary,
    top: height * 0.2,
    left: width * 0.1,
  },
  neonCircle2: {
    backgroundColor: theme.colors.accent,
    top: height * 0.6,
    right: width * 0.1,
  },
  neonCircle3: {
    backgroundColor: theme.colors.secondary,
    bottom: height * 0.1,
    left: width * 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCard: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900' as const,
    lineHeight: 48,
    color: theme.colors.accent,
    letterSpacing: 3,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 38,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonSection: {
    width: '100%',
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.accent,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: theme.colors.accent,
    marginHorizontal: theme.spacing.md,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  ageVerificationContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});