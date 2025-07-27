import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { getPlans, upgradeUser, getUserStatus, UserStatus } from '../services/analysisService';

interface Plan {
  name: string;
  price: number;
  features: {
    basicAnalysis: boolean;
    detailedSuggestions: boolean;
    progressTracking: boolean;
    exportResults: boolean;
    priorityProcessing: boolean;
  };
  limits: {
    maxImagesPerAnalysis: number;
    maxAnalysesPerMonth: number;
    maxImageSizeMB: number;
  };
}

export default function UpgradeScreen({ navigation }) {
  const [plans, setPlans] = useState<{ free: Plan; premium: Plan } | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, userData] = await Promise.all([
        getPlans(),
        getUserStatus()
      ]);
      setPlans(plansData.plans);
      setUserStatus(userData);
    } catch (error) {
      console.error('Error loading upgrade data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!userStatus) return;

    setIsUpgrading(true);
    try {
      const result = await upgradeUser(userStatus.userId, 'premium');
      
      if (result.success) {
        Alert.alert(
          'Upgrade Successful!',
          'Welcome to Premium! You now have access to all advanced features.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Reload user status and go back
                loadData();
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Upgrade Failed', result.message);
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      Alert.alert('Upgrade Failed', 'There was an error processing your upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const FeatureItem = ({ feature, included, premium }: { feature: string; included: boolean; premium?: boolean }) => (
    <View style={styles.featureItem}>
      <Text style={[styles.featureIcon, { color: included ? theme.colors.success : theme.colors.textMuted }]}>
        {included ? '✓' : '✗'}
      </Text>
      <Text style={[styles.featureText, { color: included ? theme.colors.text : theme.colors.textMuted }]}>
        {feature}
      </Text>
      {premium && included && (
        <Text style={styles.premiumBadge}>PRO</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plans) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load plans</Text>
          <Button
            title="Try Again"
            onPress={loadData}
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
          <Text style={styles.title}>Choose Your Plan</Text>
        </View>

        {/* Current Status */}
        {userStatus && (
          <Card style={styles.statusCard}>
            <Text style={styles.statusTitle}>
              Current Plan: {userStatus.subscription === 'premium' ? '🌟 Premium' : '📱 Free'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {userStatus.usage.remainingAnalyses} analyses remaining this month
            </Text>
          </Card>
        )}

        {/* Plans Comparison */}
        <View style={styles.plansContainer}>
          {/* Free Plan */}
          <Card style={[styles.planCard, styles.freePlan]}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plans.free.name}</Text>
              <Text style={styles.planPrice}>$0</Text>
              <Text style={styles.planPeriod}>Forever</Text>
            </View>

            <View style={styles.featuresList}>
              <FeatureItem feature="Basic Analysis" included={plans.free.features.basicAnalysis} />
              <FeatureItem feature="Detailed Suggestions" included={plans.free.features.detailedSuggestions} premium />
              <FeatureItem feature="Progress Tracking" included={plans.free.features.progressTracking} premium />
              <FeatureItem feature="Export Results" included={plans.free.features.exportResults} premium />
              <FeatureItem feature="Priority Processing" included={plans.free.features.priorityProcessing} premium />
            </View>

            <View style={styles.limitsSection}>
              <Text style={styles.limitsTitle}>Limits:</Text>
              <Text style={styles.limitText}>• {plans.free.limits.maxImagesPerAnalysis} images per analysis</Text>
              <Text style={styles.limitText}>• {plans.free.limits.maxAnalysesPerMonth} analyses per month</Text>
              <Text style={styles.limitText}>• {plans.free.limits.maxImageSizeMB}MB max file size</Text>
            </View>

            <Button
              title="Current Plan"
              onPress={() => {}}
              variant="outline"
              disabled
              style={styles.planButton}
            />
          </Card>

          {/* Premium Plan */}
          <Card style={[styles.planCard, styles.premiumPlan]}>
            <View style={styles.premiumBadgeContainer}>
              <Text style={styles.recommendedBadge}>RECOMMENDED</Text>
            </View>
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plans.premium.name}</Text>
              <Text style={styles.planPrice}>${plans.premium.price}</Text>
              <Text style={styles.planPeriod}>per month</Text>
            </View>

            <View style={styles.featuresList}>
              <FeatureItem feature="Basic Analysis" included={plans.premium.features.basicAnalysis} />
              <FeatureItem feature="Detailed Suggestions" included={plans.premium.features.detailedSuggestions} premium />
              <FeatureItem feature="Progress Tracking" included={plans.premium.features.progressTracking} premium />
              <FeatureItem feature="Export Results" included={plans.premium.features.exportResults} premium />
              <FeatureItem feature="Priority Processing" included={plans.premium.features.priorityProcessing} premium />
            </View>

            <View style={styles.limitsSection}>
              <Text style={styles.limitsTitle}>Limits:</Text>
              <Text style={styles.limitText}>• {plans.premium.limits.maxImagesPerAnalysis} images per analysis</Text>
              <Text style={styles.limitText}>• {plans.premium.limits.maxAnalysesPerMonth} analyses per month</Text>
              <Text style={styles.limitText}>• {plans.premium.limits.maxImageSizeMB}MB max file size</Text>
            </View>

            <Button
              title={userStatus?.subscription === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
              onPress={userStatus?.subscription === 'premium' ? undefined : handleUpgrade}
              variant="primary"
              disabled={userStatus?.subscription === 'premium' || isUpgrading}
              style={styles.planButton}
            />
            
            {isUpgrading && (
              <View style={styles.upgradingOverlay}>
                <ActivityIndicator size="small" color={theme.colors.text} />
                <Text style={styles.upgradingText}>Processing...</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Premium Benefits */}
        <Card style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>🌟 Premium Benefits</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💡</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Detailed Insights</Text>
              <Text style={styles.benefitDescription}>
                Get specific product recommendations, style trends, and professional tips
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📊</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Progress Tracking</Text>
              <Text style={styles.benefitDescription}>
                Track your improvement over time with detailed analytics
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Priority Processing</Text>
              <Text style={styles.benefitDescription}>
                Faster analysis times and priority support
              </Text>
            </View>
          </View>
        </Card>

        {/* FAQ */}
        <Card style={styles.faqCard}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>Yes, you can cancel your subscription at any time with no penalties.</Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What happens to my data?</Text>
            <Text style={styles.faqAnswer}>Your analysis history is preserved even if you downgrade to free.</Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>Yes! Try Premium features with your first analysis upgrade.</Text>
          </View>
        </Card>
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
    marginTop: theme.spacing.lg,
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
  statusCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  statusTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  plansContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  planCard: {
    position: 'relative',
  },
  freePlan: {
    borderColor: theme.colors.border,
  },
  premiumPlan: {
    borderColor: theme.colors.accent,
    borderWidth: 2,
  },
  premiumBadgeContainer: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 1,
  },
  recommendedBadge: {
    backgroundColor: theme.colors.accent,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  planName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  planPeriod: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  featuresList: {
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    width: 20,
  },
  featureText: {
    ...theme.typography.body,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: theme.colors.accent,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  limitsSection: {
    marginBottom: theme.spacing.lg,
  },
  limitsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  limitText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  planButton: {
    width: '100%',
  },
  upgradingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  upgradingText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  benefitsCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  benefitsTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  benefitDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  faqCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  faqTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  faqItem: {
    marginBottom: theme.spacing.lg,
  },
  faqQuestion: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  faqAnswer: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});