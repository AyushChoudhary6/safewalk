/**
 * MapView Component
 * Wrapper for map display with common SafeWalk features
 * Note: Web-compatible version using View. Native maps can be added via react-native-maps later.
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../theme';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapViewComponentProps {
  initialRegion: any;
  userLocation?: Coordinate;
  markers?: Array<{
    id: string;
    coordinate: Coordinate;
    title?: string;
    description?: string;
    color?: string;
  }>;
  routePath?: Coordinate[];
  routeColor?: string;
  safeZones?: Array<{
    id: string;
    center: Coordinate;
    radius: number;
  }>;
  onMapPress?: (event: any) => void;
  style?: ViewStyle;
}

export const SafeWalkMapView: React.FC<MapViewComponentProps> = ({
  initialRegion,
  userLocation,
  markers = [],
  routePath = [],
  routeColor = COLORS.primary,
  safeZones = [],
  onMapPress,
  style,
}) => {
  // Placeholder map component - render as a simple view with map-like UI
  return (
    <View style={[styles.map, style]}>
      <View style={styles.mapContainer}>
        {/* Map gradient background */}
        <View style={styles.mapBackground} />
        
        {/* Map info */}
        <View style={styles.mapContent}>
          <MaterialCommunityIcons name="map" size={48} color={COLORS.primary} />
          <Text style={[TYPOGRAPHY.styles.body, { marginTop: SPACING.md, textAlign: 'center' }]}>
            Map View
          </Text>
          <Text 
            style={[
              TYPOGRAPHY.styles.caption,
              { marginTop: SPACING.sm, textAlign: 'center', color: COLORS.text.secondary }
            ]}
          >
            {markers.length > 0 ? `${markers.length} markers` : 'Ready for mapping'}
            {'\n'}
            {routePath.length > 0 ? `Route with ${routePath.length} points` : 'No active route'}
          </Text>
        </View>

        {/* Quick info badges */}
        <View style={styles.badgesContainer}>
          {userLocation && (
            <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
              <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 10, marginLeft: 4 }}>
                {userLocation.latitude.toFixed(2)},{userLocation.longitude.toFixed(2)}
              </Text>
            </View>
          )}
          {safeZones.length > 0 && (
            <View style={[styles.badge, { backgroundColor: COLORS.safe }]}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 10, marginLeft: 4 }}>{safeZones.length} zones</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D4E8F0',
  },
  mapContent: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    gap: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
});
