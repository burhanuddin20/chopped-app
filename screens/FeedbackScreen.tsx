import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

interface FeedbackData {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  color: string;
  feedback: string;
  suggestions: string[];
  tips: string[];
}

export default function FeedbackScreen({ navigation, route }) {
  const { sectionId } = route.params;

  // Mock feedback data - replace with real data later
  const feedbackData: Record<string, FeedbackData> = {
    face: {
      id: 'face',
      name: 'Face Harmony',
      score: 18,
      maxScore: 25,
      icon: '😊',
      color: theme.colors.success,
      feedback: 'Your facial features show good symmetry and proportion. The overall harmony is quite strong, with well-balanced features that work well together. Your jawline definition is particularly good, and your facial structure has a natural appeal.',
      suggestions: [
        'Consider a slightly shorter haircut to better frame your face',
        'Your eyebrows could use some grooming for better definition',
        'Try experimenting with different facial hair styles',
        'Consider skincare routine improvements for better complexion'
      ],
      tips: [
        'Good lighting can dramatically improve facial appearance',
        'Regular grooming habits make a big difference',
        'Confidence in your natural features is key'
      ]
    },
    hair: {
      id: 'hair',
      name: 'Hair & Beard',
      score: 16,
      maxScore: 25,
      icon: '💇‍♂️',
      color: theme.colors.warning,
      feedback: 'Your hair has good texture and volume, but the current style could be better suited to your face shape. The beard is well-maintained but could benefit from some styling adjustments to enhance your overall look.',
      suggestions: [
        'Try a fade or undercut to add more definition',
        'Consider a shorter beard style for better jawline definition',
        'Your hair could benefit from better product usage',
        'Regular trims will keep your style looking sharp'
      ],
      tips: [
        'Invest in quality hair products',
        'Find a good barber and stick with them',
        'Regular maintenance is essential'
      ]
    },
    skin: {
      id: 'skin',
      name: 'Skin',
      score: 15,
      maxScore: 20,
      icon: '✨',
      color: theme.colors.accent,
      feedback: 'Your skin has a good natural tone, but there are some areas that could benefit from improved care. The overall texture is decent, but with the right routine, you could achieve a more polished appearance.',
      suggestions: [
        'Start with a daily cleanser and moisturizer',
        'Consider adding a vitamin C serum to your routine',
        'Use sunscreen daily to prevent damage',
        'Stay hydrated for better skin health'
      ],
      tips: [
        'Consistency is key with skincare',
        'Less is often more - don\'t overdo products',
        'Good sleep improves skin quality'
      ]
    },
    outfit: {
      id: 'outfit',
      name: 'Outfit & Style',
      score: 14,
      maxScore: 20,
      icon: '👔',
      color: theme.colors.success,
      feedback: 'Your style shows good basics, but there\'s room for improvement in coordination and fit. The pieces you choose are generally appropriate, but better styling could elevate your overall appearance significantly.',
      suggestions: [
        'Focus on better-fitting clothes that complement your body type',
        'Learn to layer effectively for more sophisticated looks',
        'Invest in quality basics that will last',
        'Pay attention to color coordination'
      ],
      tips: [
        'Fit is more important than brand',
        'Build a capsule wardrobe with versatile pieces',
        'Accessories can make a big difference'
      ]
    },
    posture: {
      id: 'posture',
      name: 'Posture & Body',
      score: 15,
      maxScore: 20,
      icon: '💪',
      color: theme.colors.warning,
      feedback: 'Your posture is generally good, but there are some areas for improvement. Your body language shows confidence, but small adjustments could make you appear more polished and approachable.',
      suggestions: [
        'Practice standing with shoulders back and chest open',
        'Consider strength training to improve overall posture',
        'Be mindful of how you sit and walk',
        'Regular stretching can improve flexibility and posture'
      ],
      tips: [
        'Good posture makes you look taller and more confident',
        'Regular exercise improves overall appearance',
        'Mindfulness about body language is important'
      ]
    }
  };

  const currentFeedback = feedbackData[sectionId];

  if (!currentFeedback) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Feedback not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{currentFeedback.name}</Text>
        </View>

        {/* Score Card */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreIcon}>{currentFeedback.icon}</Text>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreText}>
                {currentFeedback.score}/{currentFeedback.maxScore}
              </Text>
              <Text style={styles.scorePercentage}>
                {Math.round((currentFeedback.score / currentFeedback.maxScore) * 100)}%
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(currentFeedback.score / currentFeedback.maxScore) * 100}%`,
                  backgroundColor: currentFeedback.color,
                }
              ]} 
            />
          </View>
        </Card>

        {/* Feedback Section */}
        <Card style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          <Text style={styles.feedbackText}>{currentFeedback.feedback}</Text>
        </Card>

        {/* Suggestions Section */}
        <Card style={styles.suggestionsCard}>
          <Text style={styles.sectionTitle}>Suggested Improvements</Text>
          {currentFeedback.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </Card>

        {/* Tips Section */}
        <Card style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          {currentFeedback.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.bulletPoint}>💡</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Save Feedback"
            onPress={() => {}}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="New Analysis"
            onPress={() => navigation.navigate('Upload')}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  scoreCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  scorePercentage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  suggestionsCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  tipsCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  feedbackText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    ...theme.typography.body,
    color: theme.colors.accent,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  suggestionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 22,
  },
  tipText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 22,
  },
  actionSection: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});