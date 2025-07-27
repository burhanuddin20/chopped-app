import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      <Text style={[styles.label, disabled && styles.disabledText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  checked: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
}); 