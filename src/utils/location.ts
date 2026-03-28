import * as Location from 'expo-location';

/**
 * Requests location permissions and fetches the current device coordinates,
 * then returns a formatted Google Maps URL tracking that location.
 */
export const getCurrentLocationString = async (): Promise<string | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    const { latitude, longitude } = location.coords;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  } catch (error) {
    console.error('Error getting exact location for SOS:', error);
    return null;
  }
};
