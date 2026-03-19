import { Point } from 'geojson';
import { Incident } from '../entities/Incident';

// Calculate haversine distance between two lat/lng points in meters
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Format a point for PostGIS ST_Point function
export const formatPointForGeoSpatial = (
  latitude: number,
  longitude: number
): string => {
  return `POINT(${longitude} ${latitude})`;
};

// Calculate safety score based on nearby incidents
export const calculateSafetyScore = (
  incidents: Incident[],
  radiusMeters: number = 500
): number => {
  if (incidents.length === 0) {
    return 10; // Maximum safety
  }

  // Score calculation:
  // - Start with 10 (maximum)
  // - Deduct points based on incident severity and count
  // - 1 high severity incident = -2 points
  // - 2-3 incidents = -1 to -3 points
  // - 4+ incidents = -4+ points

  let totalSeverity = 0;
  incidents.forEach((incident) => {
    totalSeverity += incident.severity;
  });

  const averageSeverity = totalSeverity / incidents.length;
  const incidentCountFactor = Math.min(incidents.length * 0.5, 4);
  const severityFactor = (averageSeverity / 5) * 4; // Normalize to 0-4

  const safetyScore = Math.max(1, 10 - incidentCountFactor - severityFactor);
  return Math.round(safetyScore * 100) / 100;
};

// Determine route color based on safety score
export const getSafetyRating = (safetyScore: number): 'green' | 'yellow' | 'red' => {
  if (safetyScore >= 7) return 'green';
  if (safetyScore >= 4) return 'yellow';
  return 'red';
};

// Create a buffer around a point (simplified for demonstration)
export const createBufferGeometry = (
  latitude: number,
  longitude: number,
  radiusMeters: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } => {
  // Approximate degrees to meters at equator
  const degreesPerMeter = 1 / 111320;

  return {
    minLat: latitude - radiusMeters * degreesPerMeter,
    maxLat: latitude + radiusMeters * degreesPerMeter,
    minLng: longitude - radiusMeters * degreesPerMeter,
    maxLng: longitude + radiusMeters * degreesPerMeter,
  };
};
