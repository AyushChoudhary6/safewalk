/**
 * NavigationModeScreen
 * Active navigation display
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/Map/MapView';
import {
  DistanceCard,
  InstructionCard,
} from '../components';
import { startNavigationTracking } from '../services/locationService';
import { calculateDistance } from '../utils/routeUtils';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';
import * as Location from 'expo-location';
import { fetchRoute } from '../services/mapsService';

interface NavigationModeScreenProps {
  route?: any;
  onComplete?: () => void;
  onEmergency?: () => void;
  onCancel?: () => void;
}

// Navigation States
type NavState = 'IDLE' | 'ROUTE_PREVIEW' | 'NAVIGATING' | 'ARRIVED';

export const NavigationModeScreen: React.FC<NavigationModeScreenProps> = ({
  route,
  onComplete,
  onEmergency,
  onCancel,
}) => {
  const mapRef = useRef<MapView>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  const [navState, setNavState] = useState<NavState>('NAVIGATING');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(
    route?.origin || null
  );
  
  // Route Data
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number; longitude: number}[]>(
    route?.coordinates || []
  );
  const [routeSteps, setRouteSteps] = useState<any[]>(route?.steps || []);
  
  // Progress Data
  const [distanceRemaining, setDistanceRemaining] = useState<number>(route?.distance || 0);
  const [timeRemaining, setTimeRemaining] = useState<number>(route?.duration ? route.duration / 60 : 0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [heading, setHeading] = useState(0);
  
  // Recalculating flag
  const [isRerouting, setIsRerouting] = useState(false);

  const [closestIndex, setClosestIndex] = useState(0);

  // Setup location tracking
  useEffect(() => {
    let mounted = true;
    
    const startTracking = async () => {
      const sub = await startNavigationTracking((loc) => {
        if (!mounted) return;
        
        const coords = loc.coords;
        setCurrentLocation(coords);
        if (coords.heading !== null && coords.heading >= 0) {
          setHeading(coords.heading);
        }
        
        handleLocationUpdate(coords);
      });
      if (mounted) {
        locationSubRef.current = sub;
      } else {
        sub?.remove();
      }
    };

    startTracking();

    return () => {
      mounted = false;
      if (locationSubRef.current) {
        locationSubRef.current.remove();
      }
    };
  }, [routeCoordinates]); // Re-bind if route changes

  // Update map camera when location or heading changes
  useEffect(() => {
    if (navState === 'NAVIGATING' && currentLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: currentLocation,
        zoom: 18,
        pitch: 45,
        heading: heading,
      }, { duration: 1000 });
    }
  }, [currentLocation, heading, navState]);

  const handleLocationUpdate = async (coords: Location.LocationObjectCoords) => {
    if (routeCoordinates.length === 0 || isRerouting) return;

    // 1. Find the closest point on the route polyline
    let minDistance = Infinity;
    let foundIndex = 0;

    for (let i = 0; i < routeCoordinates.length; i++) {
      const dist = calculateDistance(coords, routeCoordinates[i]);
      if (dist < minDistance) {
        minDistance = dist;
        foundIndex = i;
      }
    }
    setClosestIndex(foundIndex);

    // 2. Check if we need to reroute (> 50 meters away)
    if (minDistance > 0.05) { 
      // Reroute
      handleReroute(coords);
      return;
    }

    // 3. Update distance & time remaining
    // Calculate distance from closest index to end
    let remainingDist = 0;
    for (let i = foundIndex; i < routeCoordinates.length - 1; i++) {
        remainingDist += calculateDistance(routeCoordinates[i], routeCoordinates[i+1]);
    }
    setDistanceRemaining(remainingDist);
    
    // Estimate remaining time based on original avg speed or default 50km/h for car
    const speedKmH = route?.mode === 'foot-walking' ? 5 : route?.mode === 'cycling-regular' ? 15 : 40;
    setTimeRemaining((remainingDist / speedKmH) * 60);

    // 4. Update Current Step
    if (routeSteps.length > 0 && currentStepIndex < routeSteps.length) {
      const step = routeSteps[currentStepIndex];
      // step.way_points is [start_idx, end_idx]
      const stepEndIndex = step.way_points[1];
      
      if (foundIndex >= stepEndIndex) {
        // Move to next step
        setCurrentStepIndex(prev => prev + 1);
      }
    }

    // 5. Arrived logic
    if (remainingDist < 0.02) { // less than 20 meters
      setNavState('ARRIVED');
      Alert.alert('Arrived', 'You have reached your destination!', [
        { text: 'OK', onPress: () => onComplete && onComplete() }
      ]);
    }
  };

  const handleReroute = async (currentLoc: Location.LocationObjectCoords) => {
    if (!route?.destination || isRerouting) return;
    setIsRerouting(true);
    
    try {
      const mode = route.mode || 'driving-car';
      const newRoute = await fetchRoute(currentLoc, route.destination, mode);
      
      if (!newRoute.error && newRoute.coordinates.length > 0) {
        setRouteCoordinates(newRoute.coordinates);
        setRouteSteps(newRoute.steps || []);
        setCurrentStepIndex(0);
        setDistanceRemaining(newRoute.distance);
        setTimeRemaining(newRoute.duration / 60);
      }
    } catch (e) {
      console.warn('Rerouting failed', e);
    } finally {
      setIsRerouting(false);
    }
  };

  const recenterMap = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: currentLocation,
        zoom: 18,
        pitch: 45,
        heading: heading,
      }, { duration: 1000 });
    }
  };

  const currentInstruction = routeSteps.length > currentStepIndex 
    ? routeSteps[currentStepIndex]
    : { instruction: 'Continue on route', distance: distanceRemaining * 1000 };

  const activeRouteCoords = useMemo(() => {
    return routeCoordinates.slice(closestIndex);
  }, [routeCoordinates, closestIndex]);

  const pastRouteCoords = useMemo(() => {
    return routeCoordinates.slice(0, closestIndex + 1);
  }, [routeCoordinates, closestIndex]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false} 
        showsMyLocationButton={false}
        showsCompass={false}
        initialCamera={{
          center: currentLocation || route?.origin || { latitude: 37.7749, longitude: -122.4194 },
          zoom: 18,
          pitch: 45,
          heading: heading,
          altitude: 0,
        }}
      >
        {/* Completed Route (Faded) */}
        {pastRouteCoords.length > 1 && (
          <Polyline
            coordinates={pastRouteCoords}
            strokeWidth={6}
            strokeColor="#B0B0B0"
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Active Route */}
        {activeRouteCoords.length > 1 && (
          <Polyline
            coordinates={activeRouteCoords}
            strokeWidth={6}
            strokeColor="#4A90E2"
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* User Marker (Rotated by heading) */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={heading}
          >
            <View style={styles.userMarkerIndicator}>
              <MaterialCommunityIcons name="navigation" size={32} color="#4A90E2" />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {route?.destination && (
          <Marker coordinate={route.destination}>
            <View style={styles.destMarker}>
               <MaterialCommunityIcons name="map-marker" size={32} color="#E24A4A" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top Instruction Card */}
      {isRerouting ? (
        <View style={styles.reroutingCard}>
          <Text style={styles.reroutingText}>Rerouting...</Text>
        </View>
      ) : (
        <InstructionCard
          instruction={currentInstruction.instruction}
          distance={currentInstruction.distance}
        />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={recenterMap}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.fab, styles.sosFab]} onPress={onEmergency}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Distance Card */}
      <View style={styles.bottomCardContainer}>
        <DistanceCard
          distanceRemaining={distanceRemaining}
          timeRemaining={timeRemaining}
          onEndNavigation={() => onCancel && onCancel()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  userMarkerIndicator: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 140, // Above DistanceCard
    gap: 16,
  },
  fab: {
    backgroundColor: COLORS.card,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sosFab: {
    backgroundColor: COLORS.danger,
  },
  sosText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  reroutingCard: {
    backgroundColor: COLORS.warning,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.base,
    marginTop: 60,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  reroutingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: TYPOGRAPHY.sizes.lg,
  },
});
