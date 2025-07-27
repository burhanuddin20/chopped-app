import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

interface BlurredOverlayProps {
  onUpgrade: () => void;
  message?: string;
}

export const BlurredOverlay: React.FC<BlurredOverlayProps> = ({
  onUpgrade,
  message = "Upgrade to Premium to unlock this feature",
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.primary]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Upgrade to Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    maxWidth: 200,
  },
  upgradeButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  buttonGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: theme.colors.background,
    textAlign: 'center',
  },
}); 