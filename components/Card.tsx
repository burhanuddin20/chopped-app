import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  padding?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({ children, style, padding = 'medium' }) => {
  return (
    <View style={[styles.card, styles[padding], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  small: {
    padding: theme.spacing.md,
  },
  medium: {
    padding: theme.spacing.lg,
  },
  large: {
    padding: theme.spacing.xl,
  },
});