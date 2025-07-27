import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { BlurredOverlay } from '../components/BlurredOverlay';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';
import { useSubscription } from '../contexts/SubscriptionContext';
import { isFeatureEnabled } from '../config/featureFlags';
import { theme } from '../theme/theme';
import { AnalysisResult } from '../services/analysisService';

interface ScoreSection {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  color: string;
}

interface ResultsScreenProps {
  navigation: any;
  route?: {
    params?: {
      analysisResult?: AnalysisResult;
    };
  };
}

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
  const { isPremium, unlockPremium, isLoading } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Check if freemium features are enabled
  const freemiumEnabled = isFeatureEnabled('FREEMIUM_ENABLED');
  const upgradeModalEnabled = isFeatureEnabled('PREMIUM_UPGRADE_MODAL');
  const blurredOverlaysEnabled = isFeatureEnabled('BLURRED_OVERLAYS');

  // Load analysis result from route params
  useEffect(() => {
    if (route?.params?.analysisResult) {
      setAnalysisResult(route.params.analysisResult);
    }
  }, [route?.params]);

  // Use real data only - no fallbacks
  const overallScore = analysisResult?.score;
  
  // Only show sections if we have real data
  const sections: ScoreSection[] = analysisResult ? [
    {
      id: 'face',
      name: 'Face Harmony',
      score: analysisResult.breakdown.face,
      maxScore: 25,
      icon: '😊',
      color: theme.colors.success,
    },
    {
      id: 'hair',
      name: 'Hair & Beard',
      score: analysisResult.breakdown.hair,
      maxScore: 25,
      icon: '💇‍♂️',
      color: theme.colors.warning,
    },
    {
      id: 'skin',
      name: 'Skin',
      score: analysisResult.breakdown.skin,
      maxScore: 20,
      icon: '✨',
      color: theme.colors.accent,
    },
    {
      id: 'style',
      name: 'Outfit & Style',
      score: analysisResult.breakdown.style,
      maxScore: 20,
      icon: '👔',
      color: theme.colors.success,
    },
    {
      id: 'body',
      name: 'Posture & Body',
      score: analysisResult.breakdown.body,
      maxScore: 20,
      icon: '💪',
      color: theme.colors.warning,
    },
  ] : [];

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🔥';
    if (score >= 70) return '😎';
    if (score >= 60) return '👍';
    if (score >= 50) return '😐';
    return '😅';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 70) return theme.colors.accent;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const handleViewFeedback = (sectionId: string) => {
    // If freemium is disabled, always allow access
    if (!freemiumEnabled) {
      navigation.navigate('Feedback', { 
        sectionId,
        analysisResult,
        suggestion: analysisResult?.suggestions[sectionId as keyof typeof analysisResult.suggestions]
      });
      return;
    }

    if (!isPremium && upgradeModalEnabled) {
      setShowUpgradeModal(true);
      return;
    }
    navigation.navigate('Feedback', { 
      sectionId,
      analysisResult,
      suggestion: analysisResult?.suggestions[sectionId as keyof typeof analysisResult.suggestions]
    });
  };

  const handleUpgrade = async () => {
    setShowUpgradeModal(false);
    await unlockPremium();
  };

  const handleUpgradePress = () => {
    if (upgradeModalEnabled) {
      setShowUpgradeModal(true);
    }
  };

  // Determine if content should be shown based on freemium status
  const shouldShowPremiumContent = !freemiumEnabled || isPremium;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Chop Score</Text>
          <Text style={styles.subtitle}>Here's how you did</Text>
        </View>

        {/* Show message if no analysis result */}
        {!analysisResult ? (
          <Card style={styles.overallScoreCard}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreEmoji}>🤔</Text>
              <Text style={[styles.overallScore, { color: theme.colors.textSecondary }]}>
                No Analysis
              </Text>
              <Text style={styles.scoreLabel}>Upload photos to get started</Text>
            </View>
            <Text style={styles.scoreMessage}>
              Complete an analysis to see your Chop Score and detailed feedback.
            </Text>
          </Card>
        ) : (
          <>
            {/* Overall Score Card - Always Visible */}
            <Card style={styles.overallScoreCard}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreEmoji}>{getScoreEmoji(overallScore || 0)}</Text>
                <Text style={[styles.overallScore, { color: getScoreColor(overallScore || 0) }]}>
                  {overallScore || 0}
                </Text>
                <Text style={styles.scoreLabel}>out of 100</Text>
              </View>
              <Text style={styles.scoreMessage}>
                {overallScore >= 80 ? 'Excellent! You\'re looking sharp!' :
                 overallScore >= 70 ? 'Good job! Room for improvement.' :
                 overallScore >= 60 ? 'Not bad! Let\'s level up.' :
                 'Time for a glow up! Check the feedback below.'}
              </Text>
            </Card>

            {/* Score Breakdown */}
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>Score Breakdown</Text>
              <Text style={styles.breakdownSubtitle}>
                {shouldShowPremiumContent 
                  ? 'Tap any section to see detailed feedback'
                  : 'Upgrade to Premium to see detailed breakdown'
                }
              </Text>
            </View>

            {/* Section Cards */}
            <View style={styles.sectionsContainer}>
              {sections.map((section) => (
                <Card key={section.id} style={styles.sectionCard}>
                  <TouchableOpacity
                    style={styles.sectionContent}
                    onPress={() => handleViewFeedback(section.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>{section.icon}</Text>
                      <View style={styles.sectionInfo}>
                        <Text style={styles.sectionName}>{section.name}</Text>
                        {shouldShowPremiumContent && (
                          <Text style={styles.sectionScore}>
                            {section.score}/{section.maxScore}
                          </Text>
                        )}
                      </View>
                      {shouldShowPremiumContent && (
                        <View style={styles.sectionProgress}>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${(section.score / section.maxScore) * 100}%`,
                                  backgroundColor: section.color,
                                }
                              ]} 
                            />
                          </View>
                          <Text style={[styles.percentage, { color: section.color }]}>
                            {Math.round((section.score / section.maxScore) * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                    {shouldShowPremiumContent && (
                      <Button
                        title="View Feedback"
                        onPress={() => handleViewFeedback(section.id)}
                        variant="outline"
                        size="small"
                        style={styles.feedbackButton}
                      />
                    )}
                  </TouchableOpacity>
                  
                  {/* Blurred overlay for non-premium users */}
                  {!shouldShowPremiumContent && blurredOverlaysEnabled && (
                    <BlurredOverlay
                      onUpgrade={handleUpgradePress}
                      message="Upgrade to see detailed feedback"
                    />
                  )}
                </Card>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              {shouldShowPremiumContent && (
                <Button
                  title="Save Results"
                  onPress={() => {}}
                  variant="secondary"
                  size="large"
                  style={styles.actionButton}
                />
              )}
              <Button
                title="New Analysis"
                onPress={() => navigation.navigate('Upload')}
                variant="primary"
                size="large"
                style={styles.actionButton}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Premium Upgrade Modal */}
      {upgradeModalEnabled && (
        <PremiumUpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          isLoading={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  overallScoreCard: {
    margin: theme.spacing.lg,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  overallScore: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  scoreLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  scoreMessage: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  breakdownSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  breakdownTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  breakdownSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  sectionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  sectionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionContent: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionScore: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  sectionProgress: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  feedbackButton: {
    alignSelf: 'flex-end',
  },
  actionSection: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});