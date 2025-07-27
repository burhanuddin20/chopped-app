import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { Card } from './Card';
import { theme } from '../theme/theme';

interface PremiumUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isLoading?: boolean;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  isLoading = false,
}) => {
  const features = [
    '🔍 Detailed feedback for each category',
    '📊 Complete score breakdown',
    '💡 Personalized improvement tips',
    '📈 Progress tracking over time',
    '🎯 Advanced analysis features',
    '💾 Save unlimited results',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[theme.colors.background, theme.colors.surface]}
            style={styles.gradient}
          >
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Unlock Premium</Text>
                <Text style={styles.subtitle}>
                  Get the full Chopped experience with detailed insights
                </Text>
              </View>

              {/* Features */}
              <Card style={styles.featuresCard}>
                <Text style={styles.featuresTitle}>What you'll get:</Text>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </Card>

              {/* Pricing */}
              <Card style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>Premium Access</Text>
                <Text style={styles.price}>$9.99</Text>
                <Text style={styles.pricingSubtitle}>One-time purchase</Text>
                <Text style={styles.pricingDescription}>
                  Unlock all features forever. No recurring payments.
                </Text>
              </Card>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Upgrade to Premium"
                  onPress={onUpgrade}
                  variant="primary"
                  size="large"
                  style={styles.upgradeButton}
                  loading={isLoading}
                  disabled={isLoading}
                />
                
                <Button
                  title="Maybe Later"
                  onPress={onClose}
                  variant="outline"
                  size="large"
                  style={styles.cancelButton}
                  disabled={isLoading}
                />
              </View>

              {/* Terms */}
              <Text style={styles.terms}>
                By purchasing, you agree to our Terms of Service and Privacy Policy.
                This is a one-time purchase with no recurring charges.
              </Text>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  featuresCard: {
    marginBottom: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  pricingCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: 36,
    fontWeight: '900' as const,
    lineHeight: 44,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  pricingSubtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  pricingDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: theme.spacing.lg,
  },
  upgradeButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    marginBottom: theme.spacing.md,
  },
  terms: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
}); 