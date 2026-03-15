/**
 * PrimaryButton Component
 * Primary action button for main user interactions
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: SPACING.md },
    md: { height: 48, paddingHorizontal: SPACING.lg },
    lg: { height: 56, paddingHorizontal: SPACING.xl },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.card} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: SPACING.md },
    md: { height: 48, paddingHorizontal: SPACING.lg },
    lg: { height: 56, paddingHorizontal: SPACING.xl },
  };

  return (
    <TouchableOpacity
      style={[
        styles.secondaryButton,
        sizeStyles[size],
        disabled && styles.secondaryDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

interface TextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TextButton: React.FC<TextButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => (
  <TouchableOpacity
    style={[styles.textButton, disabled && styles.textDisabled, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.textButtonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  disabled: {
    backgroundColor: COLORS.text.tertiary,
    opacity: 0.6,
  },
  text: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  secondaryDisabled: {
    borderColor: COLORS.text.tertiary,
    opacity: 0.6,
  },
  secondaryText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
  textButton: {
    padding: SPACING.base,
  },
  textDisabled: {
    opacity: 0.6,
  },
  textButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
});
