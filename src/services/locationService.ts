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
        callback(location.coords);
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
        callback(location);
      }
    );
    return subscription;
  } catch (error) {
    console.error('Error starting navigation tracking:', error);
    return null;
  }
};