import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>CHOPPED</Text>
            <Text style={styles.tagline}>Don't be chopped</Text>
            <Text style={styles.subtitle}>
              Get AI-powered feedback to level up your appearance
            </Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <Button
              title="Continue with Google"
              onPress={() => {}}
              variant="secondary"
              size="large"
              style={styles.button}
            />
            
            <Button
              title="Continue with Apple"
              onPress={() => {}}
              variant="secondary"
              size="large"
              style={styles.button}
            />
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <Button
              title="I'm 18+ – Continue"
              onPress={() => navigation.navigate('MainApp')}
              variant="primary"
              size="large"
              style={styles.button}
            />
            
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
  logo: {
    ...theme.typography.h1,
    color: theme.colors.accent,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
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
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});