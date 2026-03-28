/**
 * CustomMapPin
 * Branded map marker that replaces the default react-native-maps pin.
 * Pass `type` to get the right icon and color automatically.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PinType =
  | 'user'         // current user location
  | 'destination'  // route end point
  | 'THEFT'
  | 'HARASSMENT'
  | 'POOR_LIGHTING'
  | 'ASSAULT'
  | 'SUSPICIOUS_ACTIVITY';

interface PinConfig {
  emoji: string;
  bg: string;
  border: string;
}

const PIN_CONFIG: Record<PinType, PinConfig> = {
  user: { emoji: '🔵', bg: '#EFF6FF', border: '#2563EB' },
  destination: { emoji: '📍', bg: '#FFF1F2', border: '#EF4444' },
  THEFT: { emoji: '🔓', bg: '#FFF7ED', border: '#F97316' },
  HARASSMENT: { emoji: '⚠️', bg: '#FFF7ED', border: '#F97316' },
  POOR_LIGHTING: { emoji: '💡', bg: '#FEFCE8', border: '#EAB308' },
  ASSAULT: { emoji: '🚨', bg: '#FFF1F2', border: '#EF4444' },
  SUSPICIOUS_ACTIVITY: { emoji: '👁', bg: '#F5F3FF', border: '#7C3AED' },
};

interface Props {
  type: PinType;
  /** Shown below the pin bubble — keep short, e.g. "Theft" */
  label?: string;
}

export const CustomMapPin: React.FC<Props> = ({ type, label }) => {
  const cfg = PIN_CONFIG[type] ?? PIN_CONFIG['destination'];

  return (
    <View style={styles.wrapper}>
      {/* Pin bubble */}
      <View style={[styles.bubble, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
      {/* Tail */}
      <View style={[styles.tail, { borderTopColor: cfg.border }]} />
      {/* Optional label */}
      {label ? (
        <View style={[styles.labelBadge, { borderColor: cfg.border }]}>
          <Text style={[styles.labelText, { color: cfg.border }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: {
    fontSize: 18,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  labelBadge: {
    marginTop: 2,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});