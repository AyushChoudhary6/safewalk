/**
 * RoutePolylineLabel Component
 * Displays time label on the route polyline like Google Maps
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING } from '../theme';

interface RoutePolylineLabelProps {
  duration: number; // in seconds
  distance: number; // in kilometers
  trafficLevel?: 'low' | 'moderate' | 'heavy';
}

const getTrafficColor = (level?: string) => {
  switch (level) {
    case 'low':
      return '#22C55E';
    case 'moderate':
      return '#F59E0B';
    case 'heavy':
      return '#EF4444';
    default:
      return '#2196F3';
  }
};

export const RoutePolylineLabel: React.FC<RoutePolylineLabelProps> = ({
  duration,
  distance,
  trafficLevel = 'low',
}) => {
  const minutes = Math.ceil(duration / 60);
  const backgroundColor = getTrafficColor(trafficLevel);

  return (
    <View style={[styles.label]}>
      <View style={[styles.labelContent, { backgroundColor }]}>
        <Text style={styles.labelTime}>{minutes} min</Text>
        <Text style={styles.labelDistance}>{distance.toFixed(1)} km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -12,
    alignItems: 'center',
    zIndex: 10,
  } as any,
  labelContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  labelTime: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  labelDistance: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    fontSize: 11,
  },
});
