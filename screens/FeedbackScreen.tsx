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
  const { sectionId, sectionName, suggestion, score, maxScore } = route.params;

  // Get section details based on sectionId
  const getSectionDetails = (id: string) => {
    const sections = {
      face: {
        icon: '😊',
        color: theme.colors.success,
        tips: [
          'Good lighting can dramatically improve facial appearance',
          'Regular grooming habits make a big difference',
          'Confidence in your natural features is key'
        ]
      },
      hair: {
        icon: '💇‍♂️',
        color: theme.colors.warning,
        tips: [
          'Invest in quality hair products',
          'Find a good barber and stick with them',
          'Regular maintenance is essential'
        ]
      },
      skin: {
        icon: '✨',
        color: theme.colors.accent,
        tips: [
          'Consistency is key with skincare',
          'Less is often more - don\'t overdo products',
          'Good sleep improves skin quality'
        ]
      },
      style: {
        icon: '👔',
        color: theme.colors.success,
        tips: [
          'Fit is more important than brand',
          'Build a capsule wardrobe with versatile pieces',
          'Accessories can make a big difference'
        ]
      },
      body: {
        icon: '💪',
        color: theme.colors.warning,
        tips: [
          'Good posture makes you look taller and more confident',
          'Regular exercise improves overall appearance',
          'Mindfulness about body language is important'
        ]
      }
    };
    return sections[id] || sections.face;
  };

  const sectionDetails = getSectionDetails(sectionId);

  // Create feedback data from real analysis results
  const currentFeedback: FeedbackData = {
    id: sectionId,
    name: sectionName || 'Analysis',
    score: score || 0,
    maxScore: maxScore || 25,
    icon: sectionDetails.icon,
    color: sectionDetails.color,
    feedback: suggestion || 'No specific feedback available for this section.',
    suggestions: [
      suggestion || 'Consider working on this aspect of your appearance.',
      'Regular maintenance and care can improve your score.',
      'Small changes can make a big difference over time.',
      'Focus on consistency in your routine.'
    ],
    tips: sectionDetails.tips
  };

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
            title="Back to Results"
            onPress={() => navigation.goBack()}
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