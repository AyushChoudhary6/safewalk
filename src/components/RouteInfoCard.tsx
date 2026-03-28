/**
 * RouteInfoCard Component
 * Professional route information display inspired by Google Maps
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ANIMATION_TIMING, BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';

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
      return COLORS.riskLevel.low;
    case 'moderate':
      return COLORS.riskLevel.moderate;
    case 'heavy':
      return COLORS.riskLevel.high;
    default:
      return COLORS.text.secondary;
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Calculate arrival time
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + duration * 1000);
    const hours = arrivalDate.getHours();
    const minutes = arrivalDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    setArrivalTime(`${displayHours}:${minutes} ${ampm}`);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_TIMING.lg,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: false,
      }),
    ]).start();
  }, [duration]);

  const minutes = Math.ceil(duration / 60);
  const trafficColor = getTrafficColor(trafficLevel);

  // Generate alternative routes
  const routes: RouteOption[] = [
    { duration, distance, trafficLevel, isRecommended: true },
    { duration: duration + 180, distance: distance + 0.5, trafficLevel: 'low' },
    { duration: duration + 300, distance: distance + 1.2, trafficLevel: 'low' },
  ];

  const containerStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Animated.View style={[styles.container, SHADOWS.xl, containerStyle]}>
      {/* Handle Indicator */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      {/* Main Route Summary - Always visible */}
      <View style={styles.summarySection}>
        <View style={styles.mainContent}>
          <View style={styles.timeSection}>
            <Text style={styles.mainTime}>{minutes}</Text>
            <Text style={styles.mainUnit}>min</Text>
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
            <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.safe} />
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
            color={selectedTab === 'drive' ? COLORS.accent : COLORS.text.secondary}
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
            color={selectedTab === 'details' ? COLORS.accent : COLORS.text.secondary}
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
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === 'drive' ? (
          <View>
            {/* Alternative Routes */}
            <View style={styles.routesContainer}>
              {routes.map((route, index) => (
                <TouchableOpacity key={index} style={[
                  styles.routeOption,
                  route.isRecommended && styles.routeOptionRecommended
                ]}>
                  <View style={styles.routeOptionContent}>
                    <View style={styles.routeTime}>
                      <Text style={styles.routeTimeText}>
                        {Math.ceil(route.duration / 60)}
                      </Text>
                      <Text style={styles.routeTimeUnit}>min</Text>
                      {route.isRecommended && (
                        <View style={styles.recommendedBadgeSmall}>
                          <Text style={styles.recommendedLabelSmall}>Recommended</Text>
                        </View>
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

            {/* Route Info Details - Clean Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="road" size={18} color={COLORS.accent} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>{distance.toFixed(2)} km</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="speedometer" size={18} color={COLORS.accent} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Avg Speed</Text>
                  <Text style={styles.infoValue}>
                    {mode === 'driving-car' ? '50 km/h' : mode === 'cycling-regular' ? '17 km/h' : '5 km/h'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.accent} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Est. Time</Text>
                  <Text style={styles.infoValue}>{minutes} min</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={trafficColor} />
                </View>
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
              <View style={styles.detailLeft}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name={getModeIcon(mode)} size={16} color={COLORS.accent} />
                </View>
                <Text style={styles.detailLabel}>Route Type</Text>
              </View>
              <Text style={styles.detailValue}>{getModeLabel(mode)}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="map-marker-distance" size={16} color={COLORS.accent} />
                </View>
                <Text style={styles.detailLabel}>Total Distance</Text>
              </View>
              <Text style={styles.detailValue}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="timer" size={16} color={COLORS.accent} />
                </View>
                <Text style={styles.detailLabel}>Duration</Text>
              </View>
              <Text style={styles.detailValue}>{minutes} minutes</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="traffic-light" size={16} color={trafficColor} />
                </View>
                <Text style={styles.detailLabel}>Traffic</Text>
              </View>
              <Text style={[styles.detailValue, { color: trafficColor }]}>
                {getTrafficLabel(trafficLevel)}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons name="clock-check" size={16} color={COLORS.accent} />
                </View>
                <Text style={styles.detailLabel}>Arrival</Text>
              </View>
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
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="play-circle" size={18} color="white" style={styles.buttonIcon} />
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSmall}
          onPress={onAddStops}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={18} color={COLORS.accent} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSmall}
          onPress={onCancel}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="close" size={18} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  summarySection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  mainTime: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text.primary,
    lineHeight: 44,
  },
  mainUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  arrivalTime: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  divider: {
    width: 1,
    height: 70,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  trafficSection: {
    flex: 1,
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
    backgroundColor: COLORS.safe + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.safe,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.accent,
  },
  contentSection: {
    maxHeight: 300,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  routesContainer: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  routeOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  routeOptionRecommended: {
    backgroundColor: COLORS.accent + '08',
    borderColor: COLORS.accent,
  },
  routeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  routeTimeText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  routeTimeUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  recommendedBadgeSmall: {
    backgroundColor: COLORS.safe + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  recommendedLabelSmall: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.safe,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  routeDistance: {
    fontSize: 12,
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
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.xs,
    gap: SPACING.md,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  detailsContent: {
    paddingVertical: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  startButton: {
    backgroundColor: COLORS.accent,
  },
  startButtonText: {
    color: COLORS.text.inverse,
    fontWeight: '700',
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  actionButtonSmall: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.accent + '12',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    ...SHADOWS.xs,
  },
});
