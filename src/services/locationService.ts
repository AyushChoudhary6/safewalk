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
    return location.coords;
  } catch (error) {
    console.warn('Error getting current location (using fallback):', error);
    // Fallback to New Delhi coordinates
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };
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
        callback(location.coords);
      }
    );
    return subscription;
  } catch (error) {
    console.warn(\'Error starting location updates (ignoring on web):\', error.message);
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
        callback(location);
      }
    );
    return subscription;
  } catch (error) {
    console.error('Error starting navigation tracking:', error);
    return null;
  }
};