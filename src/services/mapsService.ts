
// OpenRouteService API Key
const OPENROUTE_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJlNmQwZDhiZDc0MTRlNDI4NTI2Y2IzNzdjZDZlMTdmIiwiaCI6Im11cm11cjY0In0=';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationSuggestion {
  name: string;
  label: string;
  coordinates: Coordinates;
}

export type RouteProfile = 'driving-car' | 'cycling-regular' | 'foot-walking';

/**
 * Fetches location suggestions using OpenRouteService Autocomplete
 * @param query The text to search for
 * @param focusLocation Optional coordinates to bias the search results closer to the user
 */
export const fetchLocationSuggestions = async (
  query: string, 
  focusLocation?: Coordinates
): Promise<LocationSuggestion[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    let url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${OPENROUTE_API_KEY}&text=${encodeURIComponent(query)}`;
    
    // Bias results towards the user's current location if available
    if (focusLocation) {
      url += `&focus.point.lon=${focusLocation.longitude}&focus.point.lat=${focusLocation.latitude}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features.map((f: any) => ({
        name: f.properties.name,
        label: f.properties.label || f.properties.name,
        coordinates: {
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

/**
 * Fetches the route from OpenRouteService API
 * @param origin Start coordinates
 * @param destination End coordinates
 * @param profile Transportation mode (driving-car, cycling-regular, foot-walking)
 * @returns Array of coordinates for the polyline, and any error message
 */
export const fetchRoute = async (
  origin: Coordinates,
  destination: Coordinates,
  profile: RouteProfile = 'driving-car'
): Promise<{ coordinates: Coordinates[], error?: string }> => {
  try {
    // Validate profile parameter to avoid undefined values
    const validProfiles: RouteProfile[] = ['driving-car', 'cycling-regular', 'foot-walking'];
    const safeProfile = (validProfiles.includes(profile) ? profile : 'driving-car') as RouteProfile;
    
    if (!safeProfile) {
      return { coordinates: [], error: `Invalid transportation profile: ${profile}` };
    }

    const url = `https://api.openrouteservice.org/v2/directions/${safeProfile}?api_key=${OPENROUTE_API_KEY}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('Route API Response:', data);

    if (data.features && data.features.length > 0 && data.features[0].geometry) {
      // OpenRouteService returns coordinates as [longitude, latitude] pairs
      const geometryCoordinates = data.features[0].geometry.coordinates;
      
      if (!Array.isArray(geometryCoordinates) || geometryCoordinates.length === 0) {
        return { coordinates: [], error: 'No coordinates in route response' };
      }
      
      console.log(`Route fetched successfully with ${geometryCoordinates.length} points`);
      
      // Convert from [longitude, latitude] to {latitude, longitude} objects
      const coordinates = geometryCoordinates.map((coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      
      return { coordinates };
    } else {
      // Robust error handling to avoid 'undefined' logs
      let errorMsg = 'Unknown OpenRouteService error';
      if (data.error) {
        errorMsg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
      } else if (data.info) {
        errorMsg = typeof data.info === 'string' ? data.info : JSON.stringify(data.info);
      }
      
      console.warn('OpenRouteService API Error:', errorMsg);
      return { coordinates: [], error: errorMsg };
    }
  } catch (error: any) {
    console.error('Error fetching route:', error);
    return { coordinates: [], error: error?.message || 'Network request failed' };
  }
};
