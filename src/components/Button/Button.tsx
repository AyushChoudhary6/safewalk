/**
 * Button Components
 * Professional, modern button components with smooth interactions
 * Inspired by Material Design 3
 */

import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ANIMATION_TIMING, BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Primary Button - For main calls-to-action
 */
export const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: SPACING.lg },
    md: { height: 48, paddingHorizontal: SPACING.xl },
    lg: { height: 56, paddingHorizontal: SPACING.xl },
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          sizeStyles[size],
          disabled && styles.disabled,
          style,
          SHADOWS.md,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text.inverse} size="small" />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={iconSize}
                color={COLORS.text.inverse}
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Secondary Button - For secondary actions
 */
export const SecondaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: SPACING.lg },
    md: { height: 48, paddingHorizontal: SPACING.xl },
    lg: { height: 56, paddingHorizontal: SPACING.xl },
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          sizeStyles[size],
          disabled && styles.secondaryDisabled,
          style,
          SHADOWS.xs,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.accent} size="small" />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={iconSize}
                color={COLORS.accent}
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Danger Button - For destructive actions
 */
export const DangerButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: SPACING.lg },
    md: { height: 48, paddingHorizontal: SPACING.xl },
    lg: { height: 56, paddingHorizontal: SPACING.xl },
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.dangerButton,
          sizeStyles[size],
          disabled && styles.disabled,
          style,
          SHADOWS.md,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text.inverse} size="small" />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={iconSize}
                color={COLORS.text.inverse}
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface TextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Text Button - For minimal actions
 */
export const TextButton: React.FC<TextButtonProps> = ({
  title,
  onPress,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.textButton, disabled && styles.textDisabled, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={16}
            color={disabled ? COLORS.text.tertiary : COLORS.accent}
            style={styles.buttonIcon}
          />
        )}
        <Text style={[styles.textButtonText, disabled && styles.textDisabled, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  disabled: {
    backgroundColor: COLORS.text.tertiary,
    opacity: 0.5,
  },
  text: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent + '08',
  },
  secondaryDisabled: {
    borderColor: COLORS.text.tertiary,
    opacity: 0.5,
  },
  secondaryText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  textDisabled: {
    opacity: 0.5,
  },
  textButtonText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
});
