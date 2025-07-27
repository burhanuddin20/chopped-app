import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import AnalysisService, { AnalysisResult } from '../services/analysisService';

export default function AnalysisScreen({ navigation, route }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const spinValue = new Animated.Value(0);

  const steps = [
    'Analyzing facial features...',
    'Evaluating skin condition...',
    'Assessing hair and beard...',
    'Reviewing outfit and style...',
    'Calculating overall score...',
  ];

  useEffect(() => {
    // Start spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    // Check if we have analysis result from route params
    if (route.params?.analysisResult) {
      setAnalysisResult(route.params.analysisResult);
      // Navigate to results immediately
      setTimeout(() => {
        navigation.replace('Results', { analysisResult: route.params.analysisResult });
      }, 2000);
      return;
    }

    // Simulate progress for demo purposes
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            navigation.replace('MainApp');
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Update current step based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const newStep = Math.floor((progress / 100) * steps.length);
        return Math.min(newStep, steps.length - 1);
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      spinAnimation.stop();
    };
  }, [progress, route.params]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>CHOPPED</Text>
          </View>

          {/* Loading Animation */}
          <View style={styles.loadingSection}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
              <View style={styles.spinnerInner} />
            </Animated.View>
            
            <Text style={styles.loadingTitle}>Analyzing your appearance</Text>
            <Text style={styles.loadingSubtitle}>
              This may take a few seconds
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>

          {/* Current Step */}
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Current Step:</Text>
            <Text style={styles.currentStep}>{steps[currentStep]}</Text>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>While you wait:</Text>
            <Text style={styles.tip}>• Our AI is analyzing every detail</Text>
            <Text style={styles.tip}>• Results will be comprehensive</Text>
            <Text style={styles.tip}>• You'll get actionable feedback</Text>
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
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    ...theme.typography.h1,
    color: theme.colors.accent,
    letterSpacing: 2,
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  spinner: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.xl,
  },
  spinnerInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: theme.colors.accent,
    borderTopColor: 'transparent',
  },
  loadingTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  loadingSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.h3,
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  stepSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  stepTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  currentStep: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tipsSection: {
    alignItems: 'center',
  },
  tipsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tip: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
});