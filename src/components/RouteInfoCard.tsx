/**
 * RouteInfoCard Component
 * Displays dynamic route information similar to Google Maps
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../theme';

interface RouteOption {
  duration: number;
  distance: number;
  trafficLevel?: 'low' | 'moderate' | 'heavy';
  isRecommended?: boolean;
}

interface RouteInfoCardProps {
  distance: number; // in kilometers
  duration: number; // in seconds
  trafficLevel?: 'low' | 'moderate' | 'heavy';
  mode: 'driving-car' | 'cycling-regular' | 'foot-walking';
  onStart?: () => void;
  onAddStops?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const getTrafficColor = (level?: string) => {
  switch (level) {
    case 'low':
      return '#22C55E'; // Green
    case 'moderate':
      return '#F59E0B'; // Orange
    case 'heavy':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
};

const getTrafficLabel = (level?: string) => {
  switch (level) {
    case 'low':
      return 'No traffic';
    case 'moderate':
      return 'Moderate traffic';
    case 'heavy':
      return 'Heavy traffic';
    default:
      return 'Traffic info unavailable';
  }
};

const getModeLabel = (mode: string) => {
  switch (mode) {
    case 'driving-car':
      return 'Drive';
    case 'cycling-regular':
      return 'Cycle';
    case 'foot-walking':
      return 'Walk';
    default:
      return 'Route';
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'driving-car':
      return 'car';
    case 'cycling-regular':
      return 'bike';
    case 'foot-walking':
      return 'walk';
    default:
      return 'map-marker';
  }
};

export const RouteInfoCard: React.FC<RouteInfoCardProps> = ({
  distance,
  duration,
  trafficLevel = 'low',
  mode,
  onStart,
  onAddStops,
  onSave,
  onCancel,
}) => {
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'drive' | 'details'>('drive');

  useEffect(() => {
    // Calculate arrival time
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + duration * 1000);
    const hours = arrivalDate.getHours();
    const minutes = arrivalDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    setArrivalTime(`${displayHours}:${minutes} ${ampm}`);
  }, [duration]);

  const minutes = Math.ceil(duration / 60);
  const trafficColor = getTrafficColor(trafficLevel);

  // Generate alternative routes with slight time variations
  const routes: RouteOption[] = [
    { duration, distance, trafficLevel, isRecommended: true },
    { duration: duration + 180, distance: distance + 0.5, trafficLevel: 'low' },
    { duration: duration + 300, distance: distance + 1.2, trafficLevel: 'low' },
  ];

  return (
    <View style={[styles.container, SHADOWS.lg]}>
      {/* Main Route Summary - Always visible */}
      <View style={styles.summarySection}>
        <View style={styles.mainContent}>
          <View style={styles.timeSection}>
            <Text style={styles.mainTime}>{minutes} min</Text>
            <Text style={styles.arrivalTime}>Arrive by {arrivalTime}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.trafficSection}>
            <View style={[styles.trafficDot, { backgroundColor: trafficColor }]} />
            <Text style={styles.trafficText}>{getTrafficLabel(trafficLevel)}</Text>
          </View>
        </View>

        {/* Recommended Badge */}
        {trafficLevel === 'low' && (
          <View style={styles.recommendedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'drive' && styles.activeTab]}
          onPress={() => setSelectedTab('drive')}
        >
          <MaterialCommunityIcons
            name={getModeIcon(mode)}
            size={18}
            color={selectedTab === 'drive' ? COLORS.primary : COLORS.text.secondary}
          />
          <Text style={[styles.tabText, selectedTab === 'drive' && styles.activeTabText]}>
            {getModeLabel(mode)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
          onPress={() => setSelectedTab('details')}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color={selectedTab === 'details' ? COLORS.primary : COLORS.text.secondary}
          />
          <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
            Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.contentSection}
        scrollEnabled={selectedTab === 'drive'}
        showsHorizontalScrollIndicator={false}
      >
        {selectedTab === 'drive' ? (
          <View>
            {/* Alternative Routes */}
            <View style={styles.routesContainer}>
              {routes.map((route, index) => (
                <TouchableOpacity key={index} style={styles.routeOption}>
                  <View style={styles.routeOptionContent}>
                    <View style={styles.routeTime}>
                      <Text style={styles.routeTimeText}>
                        {Math.ceil(route.duration / 60)} min
                      </Text>
                      {route.isRecommended && (
                        <Text style={styles.recommendedLabel}>Recommended</Text>
                      )}
                    </View>
                    <View style={styles.routeDetails}>
                      <Text style={styles.routeDistance}>{route.distance.toFixed(1)} km</Text>
                      <View
                        style={[
                          styles.trafficIndicator,
                          { backgroundColor: getTrafficColor(route.trafficLevel) },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Route Info Details */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="road" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>{distance.toFixed(2)} km</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="speedometer" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Avg Speed</Text>
                  <Text style={styles.infoValue}>
                    {mode === 'driving-car' ? '50 km/h' : mode === 'cycling-regular' ? '17 km/h' : '5 km/h'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Est. Time</Text>
                  <Text style={styles.infoValue}>{minutes} min</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="traffic-light" size={20} color={trafficColor} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Traffic</Text>
                  <Text style={[styles.infoValue, { color: trafficColor }]}>
                    {getTrafficLabel(trafficLevel)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Route Type</Text>
              <Text style={styles.detailValue}>{getModeLabel(mode)}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>Total Distance</Text>
              <Text style={styles.detailValue}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>Estimated Duration</Text>
              <Text style={styles.detailValue}>{minutes} minutes</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>Traffic Condition</Text>
              <Text style={[styles.detailValue, { color: trafficColor }]}>
                {getTrafficLabel(trafficLevel)}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>Arrival Time</Text>
              <Text style={styles.detailValue}>{arrivalTime}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.startButton]}
          onPress={onStart}
        >
          <MaterialCommunityIcons name="play-circle" size={20} color="white" />
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSmall}
          onPress={onAddStops}
        >
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSmall}
          onPress={onCancel}
        >
          <MaterialCommunityIcons name="close" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  summarySection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  timeSection: {
    flex: 1,
  },
  mainTime: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text.primary,
    lineHeight: 40,
  },
  arrivalTime: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: SPACING.md,
  },
  trafficSection: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  trafficText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    gap: 4,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  contentSection: {
    maxHeight: 300,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  routesContainer: {
    marginBottom: SPACING.md,
  },
  routeOption: {
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  recommendedLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDistance: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  trafficIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoGrid: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    gap: SPACING.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 2,
  },
  detailsContent: {
    paddingVertical: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonSmall: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
