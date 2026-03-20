import { Incident } from '../data/mockIncidents';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteSegment {
  coordinates: Coordinate[];
  isDangerous: boolean;
}

export interface RouteRiskCalculation {
  riskScore: number;
  riskLevel: 'Safe' | 'Moderate' | 'Dangerous';
  incidentsOnRoute: Incident[];
  routeSegments: RouteSegment[];
}

/**
 * Calculates distance between two coordinates using the Haversine formula
 * @returns distance in meters
 */
export const haversineDistance = (coords1: Coordinate, coords2: Coordinate): number => {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coords1.latitude * Math.PI) / 180;
  const lat2 = (coords2.latitude * Math.PI) / 180;
  const deltaLat = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
  const deltaLon = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Finds incidents that are within a specified radius of ANY point on the route
 */
export const detectIncidentsOnRoute = (
  routeCoordinates: Coordinate[],
  allIncidents: Incident[],
  radiusInMeters: number = 200
): Incident[] => {
  if (!routeCoordinates || routeCoordinates.length === 0) return [];

  const incidentsOnRoute: Incident[] = [];

  for (const incident of allIncidents) {
    const incidentPoint = { latitude: incident.latitude, longitude: incident.longitude };
    
    // Check if incident is close to any coordinate in the polyline
    for (const point of routeCoordinates) {
      const distance = haversineDistance(point, incidentPoint);
      if (distance <= radiusInMeters) {
        incidentsOnRoute.push(incident);
        break; // Once detected near the route, move to the next incident
      }
    }
  }

  return incidentsOnRoute;
};

/**
 * Evaluates the overall route risk score and structures segment data for rendering
 */
export const calculateRouteRisk = (
  routeCoordinates: Coordinate[],
  incidentsOnRoute: Incident[],
  radiusInMeters: number = 200
): RouteRiskCalculation => {
  // 1. Calculate Risk Score
  let riskScore = 0;
  incidentsOnRoute.forEach(incident => {
    riskScore += incident.severity;
  });

  let riskLevel: 'Safe' | 'Moderate' | 'Dangerous' = 'Safe';
  if (riskScore >= 7) {
    riskLevel = 'Dangerous';
  } else if (riskScore >= 3) {
    riskLevel = 'Moderate';
  }

  // 2. Compute Route Segments (Split into safe / dangerous polylines)
  if (routeCoordinates.length === 0) {
    return { riskScore, riskLevel, incidentsOnRoute, routeSegments: [] };
  }

  // If no incidents, the entire route is one safe segment
  if (incidentsOnRoute.length === 0) {
    return {
      riskScore,
      riskLevel,
      incidentsOnRoute,
      routeSegments: [{ coordinates: routeCoordinates, isDangerous: false }]
    };
  }

  const segments: RouteSegment[] = [];
  let currentSegment: Coordinate[] = [routeCoordinates[0]];
  
  const isPointDangerous = (point: Coordinate) => {
    return incidentsOnRoute.some(inc => 
      haversineDistance(point, { latitude: inc.latitude, longitude: inc.longitude }) <= radiusInMeters
    );
  };

  let currentlyDangerous = isPointDangerous(routeCoordinates[0]);

  for (let i = 1; i < routeCoordinates.length; i++) {
    const point = routeCoordinates[i];
    const pointDangerous = isPointDangerous(point);

    if (pointDangerous === currentlyDangerous) {
      currentSegment.push(point);
    } else {
      // Add the transition point to both segments so they connect visually
      currentSegment.push(point);
      segments.push({ coordinates: currentSegment, isDangerous: currentlyDangerous });
      
      currentSegment = [point];
      currentlyDangerous = pointDangerous;
    }
  }

  // push last segment if it has enough points to form a line
  if (currentSegment.length > 1) {
    segments.push({ coordinates: currentSegment, isDangerous: currentlyDangerous });
  }

  // Filter out any segments that somehow ended up with only 1 point
  const validSegments = segments.filter(seg => seg.coordinates.length > 1);

  return { riskScore, riskLevel, incidentsOnRoute, routeSegments: validSegments };
};
