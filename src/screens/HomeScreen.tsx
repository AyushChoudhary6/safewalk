import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LocationObjectCoords, LocationSubscription } from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, Marker, Polyline } from '../components/Map';
import { SearchBar } from '../components/Map/SearchBar';
import { IncidentMarker } from '../components/IncidentMarker';
import { PlaceData, PlaceDrawer } from '../components/PlaceDrawer';
import { RouteDrawer } from '../components/RouteDrawer';
import { Incident, mockIncidents } from '../data/mockIncidents';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getCurrentLocation, requestLocationPermissions, startLocationUpdates } from '../services/locationService';
// eslint-disable-next-line import/namespace
import { fetchLocationSuggestions, fetchRoute, LocationSuggestion, RouteProfile } from '../services/mapsService';
import { apiService } from '../services/apiService';
import { calculateRouteRisk, detectIncidentsOnRoute, RouteRiskCalculation, RouteSegment } from '../utils/routeIncidentDetector';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [routeParams, setRouteParams] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [routeMode, setRouteMode] = useState<RouteProfile>('driving-car');
  
  // Incident detection state
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);
  const [routeRiskInfo, setRouteRiskInfo] = useState<RouteRiskCalculation | null>(null);

  const mapRef = useRef<MapView>(null);
  const locationSubRef = useRef<LocationSubscription | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

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
      
      // Fetch nearby incidents from backend API
      await fetchNearbyIncidents(currentLoc);

      const sub = await startLocationUpdates((newLoc) => {
        setLocation(newLoc);
        // Fetch incidents whenever location updates
        fetchNearbyIncidents(newLoc);
      });
      locationSubRef.current = sub;
    } catch (error) {
      console.warn(error);
      Alert.alert('Error', 'Failed to retrieve location');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyIncidents = async (coords: LocationObjectCoords) => {
    try {
      const response = await apiService.getNearbyIncidents(
        coords.latitude,
        coords.longitude,
        500 // 500m radius
      );
      
      if (response.success && response.data) {
        // Transform API response to match Incident interface
        const incidents: Incident[] = response.data.map((incident: any) => ({
          id: incident.id,
          type: incident.type,
          latitude: incident.latitude,
          longitude: incident.longitude,
          severity: incident.severity || 3,
          timestamp: incident.createdAt,
          verified: incident.verificationCount > 0,
          verifiedCount: incident.verificationCount || 0,
          description: incident.description || '',
          isAnonymous: incident.isAnonymous ?? true,
        }));
        
        setActiveIncidents(incidents);
      } else {
        // If API fails, fallback to mock data
        console.warn('Failed to fetch incidents from API, using mock data');
        setActiveIncidents(mockIncidents);
      }
    } catch (error) {
      console.log('Backend not available, using mock data for nearby incidents (Network Error handled).');
      // Fallback to mock data on error
      setActiveIncidents(mockIncidents);
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
    if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
    }

    if (text.length > 2) {
      setSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
            const results = await fetchLocationSuggestions(text, location || undefined);
            setSuggestions(results);
            setShowSuggestions(true);
            setSearching(false);
        } catch (error) {
            console.log('Error fetching suggestions', error);
            setSuggestions([]);
            setSearching(false);
        }
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
    setRouteCoordinates([]);
    setRouteSegments([]);
    setActiveIncidents([]);
    setRouteRiskInfo(null);
    setRouteParams(null);
    
    try {
      const routeData = await fetchRoute(location, destLoc, safeMode);
      
      if (routeData.error || routeData.coordinates.length === 0) {
          const errorMsg = routeData.error || 'No route found. Please check your origin and destination.';
          Alert.alert('Route Error', errorMsg);
      } else {
          setRouteCoordinates(routeData.coordinates);

          // -------- LOG 10 SAMPLE COORDINATES ----------
          const n = routeData.coordinates.length;
          const sampledPoints = [];
          if (n <= 10) {
            sampledPoints.push(...routeData.coordinates);
          } else {
            for (let i = 0; i < 10; i++) {
              const index = Math.floor((i * (n - 1)) / 9);
              sampledPoints.push(routeData.coordinates[index]);
            }
          }
          console.log(`\n--- 10 Coordinate Pairs (Lat/Lng) between Origin and Destination ---`);
          const pairsArray = sampledPoints.map(pt => [pt.latitude, pt.longitude]);
          console.log(JSON.stringify(pairsArray));
          console.log(`-------------------------------------------------\n`);
          // ---------------------------------------------

          // Fetch incidents along the route from backend API
          try {
            const incidentsResponse = await apiService.getNearbyIncidents(
              (location.latitude + destLoc.latitude) / 2,
              (location.longitude + destLoc.longitude) / 2,
              1000 // 1km radius around route
            );

            let routeIncidents: Incident[] = [];
            
            if (incidentsResponse.success && incidentsResponse.data) {
              routeIncidents = incidentsResponse.data.map((incident: any) => ({
                id: incident.id,
                type: incident.type,
                latitude: incident.latitude,
                longitude: incident.longitude,
                severity: incident.severity || 3,
                timestamp: incident.createdAt,
                verified: incident.verificationCount > 0,
                verifiedCount: incident.verificationCount || 0,
                description: incident.description || '',
                isAnonymous: incident.isAnonymous ?? true,
              }));
            } else {
              // Fallback to mock data if API fails
              routeIncidents = mockIncidents;
            }

            // Detect which incidents are actually on the route
            const nearbyIncidents = detectIncidentsOnRoute(routeData.coordinates, routeIncidents, 200);
            const riskInfo = calculateRouteRisk(routeData.coordinates, nearbyIncidents, 200);
            
            setActiveIncidents(riskInfo.incidentsOnRoute);
            setRouteSegments(riskInfo.routeSegments);
            setRouteRiskInfo(riskInfo);
          } catch (error) {
            console.log('Backend not available, using mock data for route incidents.');
            // Fallback to mock data
            const nearbyIncidents = detectIncidentsOnRoute(routeData.coordinates, mockIncidents, 200);
            const riskInfo = calculateRouteRisk(routeData.coordinates, nearbyIncidents, 200);
            
            setActiveIncidents(riskInfo.incidentsOnRoute);
            setRouteSegments(riskInfo.routeSegments);
            setRouteRiskInfo(riskInfo);
          }

          setRouteParams({
              origin: location,
              destination: destLoc,
              mode: safeMode,
              coordinates: routeData.coordinates,
              distance: routeData.distance,
              duration: routeData.duration,
              steps: routeData.steps,
          });
      }
    } catch (error) {
      console.log('Route calculation crashed: ', error);
      Alert.alert('Error', 'Failed to calculate route and find details.');
    } finally {
      setSearching(false);
      
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([location, destLoc], {
          edgePadding: { top: 150, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }
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
          <>
            <Marker
              coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.005 }}
              title="Central Park"
              pinColor="green"
              onPress={() => setSelectedPlace({
                id: '1',
                name: 'Central Park',
                address: '123 Park Ave, New York, NY 10022',
                duration: '15 min',
                distance: '2.5 km',
                type: 'Park',
                photos: ['https://picsum.photos/400/400?random=4', 'https://picsum.photos/200/200?random=5', 'https://picsum.photos/200/200?random=6']
              })}
            />
            <Marker
              coordinate={{ latitude: location.latitude - 0.005, longitude: location.longitude - 0.005 }}
              title="City Coffee"
              pinColor="orange"
              onPress={() => setSelectedPlace({
                id: '2',
                name: 'City Coffee',
                address: '456 Cafe St, New York, NY 10021',
                duration: '5 min',
                distance: '0.8 km',
                type: 'Cafe',
                photos: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/200/200?random=3']
              })}
            />
          </>
        )}

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

        {/* Route rendering by Segments for risk highlighting */}
        {routeSegments.length > 0 ? (
          routeSegments.map((segment, index) => (
            <Polyline
              key={`segment-${index}`}
              coordinates={segment.coordinates}
              strokeWidth={5}
              strokeColor={segment.isDangerous ? "#EF4444" : "#2196F3"} 
            />
          ))
        ) : (
          routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#2196F3" 
            />
          )
        )}

        {/* Detected Crime Incidents */}
        {(activeIncidents.length > 0 ? activeIncidents : mockIncidents).map((incident) => (
          <React.Fragment key={`incident-${incident.id}`}>
            <Circle
              center={{ latitude: incident.latitude, longitude: incident.longitude }}
              radius={200}
              fillColor="rgba(239, 68, 68, 0.15)"
              strokeColor="rgba(239, 68, 68, 0.5)"
              strokeWidth={1}
            />
            <IncidentMarker incident={incident} />
          </React.Fragment>
        ))}
      </MapView>

      <View style={styles.topContainer}>
        

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search destination..."
            value={searchQuery}
            onChangeText={handleTextChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onClear={() => setSearchQuery('')}
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
    
      
      {!routeParams && (
          <PlaceDrawer
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            onDirections={(place) => {
              if (location) {
                calculateRoute({
                  latitude: location.latitude + 0.005,
                  longitude: location.longitude + 0.005
                }, routeMode);
              }
            }}
          />
        )}
        {routeParams && (
          <RouteDrawer
            distance={routeParams.distance}
            duration={routeParams.duration}
            incidents={activeIncidents}
            isVisible={!!routeParams}
            onIncidentPress={(incident) => {
              if (mapRef.current) {
                mapRef.current.animateCamera({
                  center: {
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                  },
                  zoom: 17,
                }, { duration: 1000 });
              }
            }}
          />
        )}
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
  bannerContainer: {
    marginBottom: 10,
    marginLeft: -16, // Counteract banner's default margin if needed to align
    marginRight: -16,
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
  routeCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '50%',
  },
});
