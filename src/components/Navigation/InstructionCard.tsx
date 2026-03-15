import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface InstructionCardProps {
  instruction: string;
  distance: number;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({ instruction, distance }) => {
  return (
    <View style={[styles.container, SHADOWS.lg]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="arrow-u-left-top" size={32} color={COLORS.card} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.distanceText}>
          {distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`}
        </Text>
        <Text style={styles.instructionText} numberOfLines={2}>
          {instruction}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.base,
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
});
