import { LocationObjectCoords, LocationSubscription } from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getCurrentLocation, requestLocationPermissions, startLocationUpdates } from '../services/locationService';
import { fetchLocationSuggestions, fetchRoute, LocationSuggestion, RouteProfile } from '../services/mapsService';

export const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [routeMode, setRouteMode] = useState<RouteProfile>('driving-car');
  
  const mapRef = useRef<MapView>(null);
  const locationSubRef = useRef<LocationSubscription | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupLocation();
    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
      }
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const setupLocation = async () => {
    try {
      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const currentLoc = await getCurrentLocation();
      if (!currentLoc) {
        Alert.alert('Error', 'Location not available');
        setLoading(false);
        return;
      }

      setLocation(currentLoc);
      centerMapOnLocation(currentLoc);

      const sub = await startLocationUpdates((newLoc) => {
        setLocation(newLoc);
      });
      locationSubRef.current = sub;
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to retrieve location');
    } finally {
      setLoading(false);
    }
  };

  const centerMapOnLocation = (locToCenter: LocationObjectCoords | null = location) => {
    if (locToCenter && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locToCenter.latitude,
        longitude: locToCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setSearching(true);
      searchTimeout.current = setTimeout(async () => {
        const results = await fetchLocationSuggestions(text, location || undefined);
        setSuggestions(results);
        setShowSuggestions(true);
        setSearching(false);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);
    }
  };

  const calculateRoute = async (destLoc: {latitude: number, longitude: number}, mode?: RouteProfile) => {
    if (!location) return;
    
    // Validate mode parameter - use default if not provided or invalid
    const validMode = mode || 'driving-car';
    const validProfiles: RouteProfile[] = ['driving-car', 'cycling-regular', 'foot-walking'];
    const safeMode = validProfiles.includes(validMode) ? validMode : 'driving-car';
    
    setSearching(true);
    setRouteCoordinates([]); // Clear previous route
    
    const { coordinates, error } = await fetchRoute(location, destLoc, safeMode);
    
    if (error || coordinates.length === 0) {
        const errorMsg = error || 'No route found. Please check your origin and destination.';
        Alert.alert('Route Error', errorMsg);
    } else {
        setRouteCoordinates(coordinates);
    }
    
    setSearching(false);
    
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([location, destLoc], {
        edgePadding: { top: 150, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  const handleSuggestionPress = async (suggestion: LocationSuggestion) => {
    Keyboard.dismiss();
    setSearchQuery(suggestion.label); 
    setShowSuggestions(false); 
    setDestination(suggestion.coordinates); 
    
    if (location) {
      calculateRoute(suggestion.coordinates, routeMode);
    } else {
      Alert.alert('Error', 'Your GPS location is not available yet.');
    }
  };

  const handleModeChange = (mode: RouteProfile) => {
    const validProfiles: RouteProfile[] = ['driving-car', 'cycling-regular', 'foot-walking'];
    if (!validProfiles.includes(mode)) {
      console.warn(`Invalid route profile: ${mode}, defaulting to driving-car`);
      mode = 'driving-car';
    }
    setRouteMode(mode);
    if (destination) {
      calculateRoute(destination, mode);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{marginTop: 10}}>Acquiring GPS Signal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false} 
      >
        {location && (
          <Marker
            coordinate={location}
            title="You are here"
            pinColor="blue"
          />
        )}
        
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="red"
          />
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="#2196F3" 
          />
        )}
      </MapView>

      <View style={styles.topContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleTextChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
          />
          {searching && (
            <View style={styles.loadingWrapper}>
               <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}
        </View>

        {/* Transportation Modes */}
        <View style={styles.modesContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, routeMode === 'driving-car' && styles.activeModeButton]}
            onPress={() => handleModeChange('driving-car')}
          >
            <Text style={routeMode === 'driving-car' ? styles.activeModeText : styles.modeText}>🚗 Car</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, routeMode === 'cycling-regular' && styles.activeModeButton]}
            onPress={() => handleModeChange('cycling-regular')}
          >
            <Text style={routeMode === 'cycling-regular' ? styles.activeModeText : styles.modeText}>🚲 Cycle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, routeMode === 'foot-walking' && styles.activeModeButton]}
            onPress={() => handleModeChange('foot-walking')}
          >
            <Text style={routeMode === 'foot-walking' ? styles.activeModeText : styles.modeText}>🚶 Walk</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsList}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem} 
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.suggestionSubtitle} numberOfLines={1}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, styles.recenterFab]} 
          onPress={() => centerMapOnLocation()}
        >
          <Text style={styles.fabIcon}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, styles.sosFab]} onPress={() => Alert.alert('SOS', 'Emergency services would be contacted!')}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loadingWrapper: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: '#2196F3',
  },
  modeText: {
    color: '#888',
    fontWeight: '600',
  },
  activeModeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestionsList: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 250,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  recenterFab: {
    backgroundColor: 'white',
  },
  fabIcon: {
    fontSize: 24,
  },
  sosFab: {
    backgroundColor: '#F44336', 
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
