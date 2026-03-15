
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

/**
 * A handy fetch wrapper that forces a timeout to avoid hangs
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, fallbackTimeoutMs = 8000) => {
  const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => reject(new Error('Request Timeout')), fallbackTimeoutMs);
  });
  
  try {
    const response = await Promise.race([
      fetch(url, options),
      timeoutPromise
    ]);
    return response;
  } catch (error) {
    throw error;
  }
};

export type RouteProfile = 'driving-car' | 'cycling-regular' | 'foot-walking';

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  way_points: [number, number]; // [start, end] indices in coordinates array
}

export interface RouteInfo {
  coordinates: Coordinates[];
  distance: number; // in kilometers
  duration: number; // in seconds
  steps?: RouteStep[];
  error?: string;
  trafficLevel?: 'low' | 'moderate' | 'heavy';
}

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

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Location suggestions timeout')), 5000);
    });

    const fetchPromise = (async () => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    })();

    const data = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (data && data.features) {
      return data.features.map((f: any) => ({
        name: f.properties?.name || 'Unknown',
        label: f.properties?.label || f.properties?.name || 'Unknown Location',
        coordinates: {
          latitude: f.geometry?.coordinates?.[1] || 0,
          longitude: f.geometry?.coordinates?.[0] || 0,
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
 * Fetches the human-readable address for a given coordinate using OpenRouteService Reverse Geocoding
 * @param coordinates The coordinates to reverse geocode
 */
export const fetchAddressFromCoordinates = async (coordinates: Coordinates): Promise<string> => {
  try {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${OPENROUTE_API_KEY}&point.lon=${coordinates.longitude}&point.lat=${coordinates.latitude}`;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Reverse geocode timeout')), 5000);
    });

    const fetchPromise = (async () => {
      const response = await fetch(url);
      return await response.json();
    })();

    const data = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (data && data.features && data.features.length > 0) {
      return data.features[0].properties?.label || data.features[0].properties?.name || 'Unknown Location';
    }
    return 'Unknown Location';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Location address not found';
  }
};

/**
 * Fetches the route from OpenRouteService API with detailed information
 * @param origin Start coordinates
 * @param destination End coordinates
 * @param profile Transportation mode (driving-car, cycling-regular, foot-walking)
 * @returns Route information including coordinates, distance, duration, and traffic data
 */
export const fetchRoute = async (
  origin: Coordinates,
  destination: Coordinates,
  profile: RouteProfile = 'driving-car'
): Promise<RouteInfo> => {
  try {
    // Validate profile parameter to avoid undefined values
    const validProfiles: RouteProfile[] = ['driving-car', 'cycling-regular', 'foot-walking'];
    const safeProfile = (validProfiles.includes(profile) ? profile : 'driving-car') as RouteProfile;
    
    if (!safeProfile) {
      return { coordinates: [], distance: 0, duration: 0, error: `Invalid transportation profile: ${profile}` };
    }

    const url = `https://api.openrouteservice.org/v2/directions/${safeProfile}?api_key=${OPENROUTE_API_KEY}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;
    
    const response = await fetchWithTimeout(url, {}, 10000);
    const data = await response.json();

    console.log('Route API Response:', data);

    if (data.features && data.features.length > 0 && data.features[0].geometry) {
      // OpenRouteService returns coordinates as [longitude, latitude] pairs
      const geometryCoordinates = data.features[0].geometry.coordinates;
      
      if (!Array.isArray(geometryCoordinates) || geometryCoordinates.length === 0) {
        return { coordinates: [], distance: 0, duration: 0, error: 'No coordinates in route response' };
      }
      
      console.log(`Route fetched successfully with ${geometryCoordinates.length} points`);
      
      // Convert from [longitude, latitude] to {latitude, longitude} objects
      const coordinates = geometryCoordinates.map((coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      
      // Extract route properties
      const properties = data.features[0].properties;
      const distance = properties?.summary?.distance ? properties.summary.distance / 1000 : 0; // Convert to km
      let duration = properties?.summary?.duration ? properties.summary.duration : 0; // in seconds

      // Adjust duration based on real-world average speed (e.g. Google Maps estimates ~25km/h in cities with traffic)
      // OpenRouteService often assumes free-flow speed or higher speed limits where not accounting for intersections/traffic.
      if (safeProfile === 'driving-car') {
         // calculate an OpenRouteService implied speed (km/s)
         const impliedSpeedMps = distance / (duration || 1); // km / seconds
         
         // In reality, average city driving speed is around 20-30km/h
         const averageSpeedsKmph = {
            'driving-car': 23, 
            'cycling-regular': 12,
            'foot-walking': 4.5
         };

         // Calculate a realistic time based on distance over conservative real-world average speeds.
         // Ensure it doesn't drop below the absolute theoretical minimum computed by OpenRouteService!
         let adjustedSpeedKmph = 25; // Good realistic driving speed in moderate traffic
         
         // Apply heuristic: longer journeys might have more highways, so adjust speed somewhat
         if (distance > 30) adjustedSpeedKmph = 35;
         if (distance > 100) adjustedSpeedKmph = 60;
         
         const realisticMinimumSeconds = (distance / adjustedSpeedKmph) * 3600;
         duration = Math.max(duration, realisticMinimumSeconds);
      } else if (safeProfile === 'cycling-regular') {
         const realisticMinimumSeconds = (distance / 12) * 3600;
         duration = Math.max(duration, realisticMinimumSeconds);
      } else if (safeProfile === 'foot-walking') {
         const realisticMinimumSeconds = (distance / 4.5) * 3600;
         duration = Math.max(duration, realisticMinimumSeconds);
      }
      
      const steps = properties?.segments?.[0]?.steps?.map((step: any) => ({
        distance: step.distance,
        duration: step.duration,
        instruction: step.instruction,
        way_points: step.way_points,
      })) || [];

      // Estimate traffic level based on duration vs expected
      const expectedMinutesPerKm = safeProfile === 'driving-car' ? 2 : safeProfile === 'cycling-regular' ? 6 : 12;
      const expectedDuration = distance * expectedMinutesPerKm * 60; // in seconds
      const trafficRatio = expectedDuration > 0 ? duration / expectedDuration : 1;
      
      let trafficLevel: 'low' | 'moderate' | 'heavy' = 'low';
      if (trafficRatio > 2) trafficLevel = 'heavy';
      else if (trafficRatio > 1.3) trafficLevel = 'moderate';
      
      console.log(`Route: ${distance.toFixed(2)}km, ${Math.ceil(duration / 60)}min, Traffic: ${trafficLevel}`);
      
      return { coordinates, distance, duration, steps, trafficLevel };
    } else {
      // Robust error handling to avoid 'undefined' logs
      let errorMsg = 'Unknown OpenRouteService error';
      if (data.error) {
        errorMsg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
      } else if (data.info) {
        errorMsg = typeof data.info === 'string' ? data.info : JSON.stringify(data.info);
      }
      
      console.warn('OpenRouteService API Error:', errorMsg);
      return { coordinates: [], distance: 0, duration: 0, error: errorMsg };
    }
  } catch (error: any) {
    console.error('Error fetching route:', error);
    return { coordinates: [], distance: 0, duration: 0, error: error?.message || 'Network request failed' };
  }
};
