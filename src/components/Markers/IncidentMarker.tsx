/**
 * IncidentMarker Component
 * Visual representation of a reported incident on the map
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface IncidentMarkerProps {
  incidentType:
    | 'poor_lighting'
    | 'harassment'
    | 'theft'
    | 'unsafe_area'
    | 'other';
  severity: 'low' | 'moderate' | 'high';
  timestamp?: string;
  style?: ViewStyle;
}

const INCIDENT_CONFIG = {
  poor_lighting: {
    icon: 'lightbulb-off',
    label: 'Poor Lighting',
    color: COLORS.warning,
  },
  harassment: {
    icon: 'alert-circle',
    label: 'Harassment',
    color: COLORS.danger,
  },
  theft: {
    icon: 'lock-alert',
    label: 'Theft Report',
    color: COLORS.danger,
  },
  unsafe_area: {
    icon: 'shield-alert',
    label: 'Unsafe Area',
    color: COLORS.danger,
  },
  other: {
    icon: 'information',
    label: 'Incident',
    color: COLORS.warning,
  },
};

export const IncidentMarker: React.FC<IncidentMarkerProps> = ({
  incidentType,
  severity,
  timestamp,
  style,
}) => {
  const config = INCIDENT_CONFIG[incidentType];
  const severityColor = {
    low: COLORS.warning,
    moderate: COLORS.warning,
    high: COLORS.danger,
  }[severity];

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.marker,
          { backgroundColor: severityColor },
          SHADOWS.md,
        ]}
      >
        <MaterialCommunityIcons
          name={config.icon as any}
          size={20}
          color={COLORS.card}
        />
      </View>

      <View style={[styles.tooltip, SHADOWS.md]}>
        <Text style={styles.label}>{config.label}</Text>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  tooltip: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    minWidth: 120,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
});
