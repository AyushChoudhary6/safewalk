/**
 * RouteCard Component
 * Card displaying route information with safety metrics
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface RouteCardProps {
  routeName: string;
  duration: number; // in minutes
  distance: number; // in km
  safetyScore: 'low' | 'moderate' | 'high';
  onPress?: () => void;
  onViewAlternatives?: () => void;
  isPrimary?: boolean;
  style?: ViewStyle;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  routeName,
  duration,
  distance,
  safetyScore,
  onPress,
  onViewAlternatives,
  isPrimary = false,
  style,
}) => {
  const safetyColors = {
    low: { color: COLORS.safe, label: 'Low Risk' },
    moderate: { color: COLORS.warning, label: 'Moderate Risk' },
    high: { color: COLORS.danger, label: 'High Risk' },
  };

  const riskInfo = safetyColors[safetyScore];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isPrimary && styles.primaryCard,
        SHADOWS.md,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.routeName}>{routeName}</Text>
          <View style={styles.badge}>
            <View
              style={[styles.safetyDot, { backgroundColor: riskInfo.color }]}
            />
            <Text style={styles.safetyLabel}>{riskInfo.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={COLORS.text.secondary}
          />
          <Text style={styles.detailText}>{duration} min</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={18}
            color={COLORS.text.secondary}
          />
          <Text style={styles.detailText}>{distance.toFixed(1)} km</Text>
        </View>
      </View>

      {onViewAlternatives && (
        <TouchableOpacity
          style={styles.alternativesButton}
          onPress={onViewAlternatives}
        >
          <Text style={styles.alternativesText}>View Alternatives</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  header: {
    marginBottom: SPACING.md,
  },
  titleContainer: {
    gap: SPACING.sm,
  },
  routeName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  safetyDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
  },
  safetyLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  details: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  alternativesButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  alternativesText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
