import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to show your current location on the map.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    Alert.alert('Error', 'Failed to request location permissions.');
    return false;
  }
};

export const getCurrentLocation = async (): Promise<Location.LocationObjectCoords | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    
    // DEV OVERRIDE: If the location is the emulator default (like San Francisco/US),
    // force it to somewhere in India (New Delhi) to prevent the OpenRouteService >6000km error.
    let coords = location.coords;
    if (coords.latitude > 30 && coords.longitude < -110) {
      console.log('Emulator detected: Re-routing default location to New Delhi, India.');
      coords = {
        ...coords,
        latitude: 28.6139,
        longitude: 77.2090
      };
    }
    
    return coords;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

export const startLocationUpdates = async (
  callback: (coords: Location.LocationObjectCoords) => void
): Promise<Location.LocationSubscription | null> => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        let coords = location.coords;
        if (coords.latitude > 30 && coords.longitude < -110) {
          coords = {
            ...coords,
            latitude: 28.6139,
            longitude: 77.2090
          };
        }
        callback(coords);
      }
    );
    return subscription;
  } catch (error) {
    console.error('Error starting location updates:', error);
    return null;
  }
};

export const startNavigationTracking = async (
  callback: (location: Location.LocationObject) => void
): Promise<Location.LocationSubscription | null> => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        let loc = { ...location };
        if (loc.coords.latitude > 30 && loc.coords.longitude < -110) {
          loc.coords = {
            ...loc.coords,
            latitude: 28.6139,
            longitude: 77.2090
          };
        }
        callback(loc);
      }
    );
    return subscription;
  } catch (error) {
    console.error('Error starting navigation tracking:', error);
    return null;
  }
};