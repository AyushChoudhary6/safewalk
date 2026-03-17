/**
 * Web-compatible Location Service
 * Uses browser's Geolocation API
 */

import { Alert } from 'react-native';

// Type definitions for web geolocation
export interface LocationObjectCoords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface LocationSubscription {
  remove: () => void;
}

/**
 * Request location permissions from the browser
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    if (!navigator.geolocation) {
      Alert.alert('Error', 'Geolocation is not supported by your browser');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            Alert.alert('Permission Denied', 'Location permission is required to show your current location on the map.');
          }
          resolve(false);
        }
      );
    });
  } catch (error) {
    console.error('Error checking location permissions:', error);
    Alert.alert('Error', 'Failed to check location permissions.');
    return false;
  }
};

/**
 * Get the current location from the browser
 */
export const getCurrentLocation = async (): Promise<LocationObjectCoords | null> => {
  try {
    if (!navigator.geolocation) {
      console.error('Geolocation is not available');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: null,
            speed: position.coords.speed,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          resolve(null);
        }
      );
    });
  } catch (error) {
    console.error('Error in getCurrentLocation:', error);
    return null;
  }
};

/**
 * Watch position changes from the browser
 */
export const startLocationUpdates = async (
  callback: (coords: LocationObjectCoords) => void
): Promise<LocationSubscription | null> => {
  try {
    if (!navigator.geolocation) {
      console.error('Geolocation is not available');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: null,
          speed: position.coords.speed,
        });
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return {
      remove: () => {
        navigator.geolocation.clearWatch(watchId);
      },
    };
  } catch (error) {
    console.error('Error starting location updates:', error);
    return null;
  }
};

/**
 * Start navigation tracking (more frequent updates)
 */
export const startNavigationTracking = async (
  callback: (location: { coords: LocationObjectCoords }) => void
): Promise<LocationSubscription | null> => {
  try {
    if (!navigator.geolocation) {
      console.error('Geolocation is not available');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: null,
            speed: position.coords.speed,
          },
        });
      },
      (error) => {
        console.error('Error in navigation tracking:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0,
      }
    );

    return {
      remove: () => {
        navigator.geolocation.clearWatch(watchId);
      },
    };
  } catch (error) {
    console.error('Error starting navigation tracking:', error);
    return null;
  }
};
