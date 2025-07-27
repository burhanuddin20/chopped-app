import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { AnalysisResult, saveAnalysisResult } from '../services/analysisService';

interface ScoreSection {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  color: string;
  suggestion: string;
}

export default function ResultsScreen({ navigation, route }) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sections, setSections] = useState<ScoreSection[]>([]);

  useEffect(() => {
    // Get analysis result from navigation params or use mock data
    const result = route.params?.analysisResult || null;
    setAnalysisResult(result);

    if (result) {
      const scoreSections: ScoreSection[] = [
        {
          id: 'face',
          name: 'Face Harmony',
          score: result.breakdown.face,
          maxScore: 25,
          icon: '😊',
          color: theme.colors.success,
          suggestion: result.suggestions.face,
        },
        {
          id: 'hair',
          name: 'Hair & Beard',
          score: result.breakdown.hair,
          maxScore: 25,
          icon: '💇‍♂️',
          color: theme.colors.warning,
          suggestion: result.suggestions.hair,
        },
        {
          id: 'skin',
          name: 'Skin',
          score: result.breakdown.skin,
          maxScore: 20,
          icon: '✨',
          color: theme.colors.accent,
          suggestion: result.suggestions.skin,
        },
        {
          id: 'style',
          name: 'Outfit & Style',
          score: result.breakdown.style,
          maxScore: 20,
          icon: '👔',
          color: theme.colors.success,
          suggestion: result.suggestions.style,
        },
        {
          id: 'body',
          name: 'Posture & Body',
          score: result.breakdown.body,
          maxScore: 20,
          icon: '💪',
          color: theme.colors.warning,
          suggestion: result.suggestions.body,
        },
      ];
      setSections(scoreSections);
    }
  }, [route.params]);

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
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      navigation.navigate('Feedback', { 
        sectionId,
        sectionName: section.name,
        suggestion: section.suggestion,
        score: section.score,
        maxScore: section.maxScore,
      });
    }
  };

  const handleSaveResults = async () => {
    if (!analysisResult) return;

    try {
      await saveAnalysisResult(analysisResult);
      Alert.alert(
        'Results Saved',
        'Your analysis results have been saved to your history.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Save Failed',
        'There was an error saving your results. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNewAnalysis = () => {
    navigation.navigate('Upload');
  };

  if (!analysisResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Chop Score</Text>
          <Text style={styles.subtitle}>Here's how you did</Text>
        </View>

        {/* Overall Score Card */}
        <Card style={styles.overallScoreCard}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreEmoji}>{getScoreEmoji(analysisResult.score)}</Text>
            <Text style={[styles.overallScore, { color: getScoreColor(analysisResult.score) }]}>
              {analysisResult.score}
            </Text>
            <Text style={styles.scoreLabel}>out of 100</Text>
          </View>
          <Text style={styles.scoreMessage}>
            {analysisResult.score >= 80 ? 'Excellent! You\'re looking sharp!' :
             analysisResult.score >= 70 ? 'Good job! Room for improvement.' :
             analysisResult.score >= 60 ? 'Not bad! Let\'s level up.' :
             'Time for a glow up! Check the feedback below.'}
          </Text>
        </Card>

        {/* Score Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Score Breakdown</Text>
          <Text style={styles.breakdownSubtitle}>
            Tap any section to see detailed feedback
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
                    <Text style={styles.sectionScore}>
                      {section.score}/{section.maxScore}
                    </Text>
                  </View>
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
                </View>
                
                {/* Suggestion Preview */}
                <View style={styles.suggestionPreview}>
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {section.suggestion}
                  </Text>
                </View>
                
                <Button
                  title="View Full Feedback"
                  onPress={() => handleViewFeedback(section.id)}
                  variant="outline"
                  size="small"
                  style={styles.feedbackButton}
                />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Save Results"
            onPress={handleSaveResults}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="New Analysis"
            onPress={handleNewAnalysis}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.h2,
    color: theme.colors.text,
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
  suggestionPreview: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  suggestionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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