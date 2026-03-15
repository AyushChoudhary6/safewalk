/**
 * Route Utilities
 * Route calculation and manipulation
 */

interface RouteSegment {
  start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
  safetyScore: number;
  distance: number;
}

/**
 * Split route into segments for detailed analysis
 */
export const segmentRoute = (
  waypoints: Array<{ latitude: number; longitude: number }>,
  segmentCount: number = 5
): RouteSegment[] => {
  if (waypoints.length < 2) return [];

  const segments: RouteSegment[] = [];
  const pointsPerSegment = Math.ceil(waypoints.length / segmentCount);

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(waypoints[i], waypoints[i + 1]);
  }

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segment: RouteSegment = {
      start: waypoints[i],
      end: waypoints[i + 1],
      safetyScore: Math.random() * 100,
      distance: calculateDistance(waypoints[i], waypoints[i + 1]),
    };
    segments.push(segment);
  }

  return segments;
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
  const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.latitude * (Math.PI / 180)) *
      Math.cos(point2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate overall route metrics
 */
export const calculateRouteMetrics = (
  segments: RouteSegment[]
): {
  totalDistance: number;
  averageSafetyScore: number;
  estimatedTime: number;
} => {
  if (segments.length === 0) {
    return {
      totalDistance: 0,
      averageSafetyScore: 0,
      estimatedTime: 0,
    };
  }

  const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
  const averageSafetyScore =
    segments.reduce((sum, seg) => sum + seg.safetyScore, 0) / segments.length;
  const estimatedTime = Math.ceil((totalDistance / 5) * 60); // Average walking speed: 5 km/h

  return {
    totalDistance,
    averageSafetyScore,
    estimatedTime,
  };
};

/**
 * Get route color based on safety
 */
export const getRouteColor = (safetyScore: number): string => {
  if (safetyScore >= 70) return '#22C55E'; // Green - Safe
  if (safetyScore >= 40) return '#F59E0B'; // Yellow - Moderate
  return '#EF4444'; // Red - High risk
};

/**
 * Interpolate intermediate points
 */
export const interpolateRoute = (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number },
  steps: number = 10
): Array<{ latitude: number; longitude: number }> => {
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const lat = start.latitude + (end.latitude - start.latitude) * fraction;
    const lon = start.longitude + (end.longitude - start.longitude) * fraction;

    points.push({ latitude: lat, longitude: lon });
  }

  return points;
};

/**
 * Extract high-risk segments
 */
export const getHighRiskSegments = (
  segments: RouteSegment[],
  threshold: number = 40
): RouteSegment[] => {
  return segments.filter((seg) => seg.safetyScore < threshold);
};
