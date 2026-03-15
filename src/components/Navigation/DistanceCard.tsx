import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface DistanceCardProps {
  distanceRemaining: number; // in km
  timeRemaining: number; // in minutes
  onEndNavigation: () => void;
}

export const DistanceCard: React.FC<DistanceCardProps> = ({
  distanceRemaining,
  timeRemaining,
  onEndNavigation,
}) => {
  // calculate time components
  const hours = Math.floor(timeRemaining / 60);
  const minutes = Math.floor(timeRemaining % 60);
  const timeString = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  // calculate ETA
  const now = new Date();
  const arrival = new Date(now.getTime() + timeRemaining * 60000);
  let arrivalHours = arrival.getHours();
  const ampm = arrivalHours >= 12 ? 'PM' : 'AM';
  arrivalHours = arrivalHours % 12 || 12;
  const arrivalMinutes = arrival.getMinutes().toString().padStart(2, '0');
  const arrivalTime = `${arrivalHours}:${arrivalMinutes} ${ampm}`;

  return (
    <View style={[styles.container, SHADOWS.lg]}>
      <View style={styles.metricsContainer}>
        <Text style={styles.timeRemainingText}>{timeString}</Text>
        <Text style={styles.detailsText}>
          {distanceRemaining.toFixed(1)} km • ETA {arrivalTime}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.endButton} onPress={onEndNavigation}>
        <MaterialCommunityIcons name="close" size={32} color={COLORS.card} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40, // accounting for safe area bottom mostly
  },
  metricsContainer: {
    flex: 1,
  },
  timeRemainingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22C55E', // Safe green for time
  },
  detailsText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  endButton: {
    backgroundColor: COLORS.danger,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


