/**
 * SafetyBadge Component
 * Visual indicator for safety status
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../theme';

interface SafetyBadgeProps {
  level: 'low' | 'moderate' | 'high';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({
  level,
  showLabel = true,
  size = 'md',
  style,
}) => {
  const config = {
    low: {
      color: COLORS.safe,
      label: 'Safe',
      emoji: '🟢',
    },
    moderate: {
      color: COLORS.warning,
      label: 'Caution',
      emoji: '🟡',
    },
    high: {
      color: COLORS.danger,
      label: 'Alert',
      emoji: '🔴',
    },
  };

  const sizeStyles = {
    sm: { minWidth: 60, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
    md: { minWidth: 80, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
    lg: { minWidth: 100, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.base },
  };

  const info = config[level];

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        { backgroundColor: `${info.color}20` },
        style,
      ]}
    >
      {showLabel && (
        <>
          <Text style={styles.emoji}>{info.emoji}</Text>
          <Text style={[styles.label, { color: info.color }]}>
            {info.label}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
  },
});
