/**
 * Safety Score Utility
 * Calculate and manage safety scores
 */

export interface SafetyScoreFactors {
  incidentCount: number;
  averageIncidentSeverity: number; // 0-1
  lightingQuality: number; // 0-1
  trafficVolume: number; // 0-1
  policePresence: number; // 0-1
  communityRating: number; // 0-1
}

/**
 * Calculate overall safety score (0-100)
 */
export const calculateSafetyScore = (factors: SafetyScoreFactors): number => {
  // Weight the factors
  const weights = {
    incidents: 0.3,
    lighting: 0.2,
    traffic: 0.2,
    police: 0.15,
    community: 0.15,
  };

  // Inverse incident score (fewer incidents = higher score)
  const incidentScore = Math.max(0, 100 - factors.incidentCount * 5);
  const severityScore = (1 - factors.averageIncidentSeverity) * 100;

  // Calculate weighted score
  const score =
    incidentScore * (weights.incidents * 0.5) +
    severityScore * (weights.incidents * 0.5) +
    factors.lightingQuality * 100 * weights.lighting +
    (1 - factors.trafficVolume) * 100 * weights.traffic +
    factors.policePresence * 100 * weights.police +
    factors.communityRating * 100 * weights.community;

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Get safety level based on score
 */
export const getSafetyLevel = (
  score: number
): 'low' | 'moderate' | 'high' => {
  if (score >= 70) return 'low';
  if (score >= 40) return 'moderate';
  return 'high';
};

/**
 * Get safety color based on level
 */
export const getSafetyColor = (level: 'low' | 'moderate' | 'high'): string => {
  const colors = {
    low: '#22C55E', // Green
    moderate: '#F59E0B', // Yellow
    high: '#EF4444', // Red
  };
  return colors[level];
};

/**
 * Get safety description
 */
export const getSafetyDescription = (
  level: 'low' | 'moderate' | 'high'
): string => {
  const descriptions = {
    low: 'This area is generally safe',
    moderate: 'Exercise caution in this area',
    high: 'High caution recommended in this area',
  };
  return descriptions[level];
};

/**
 * Adjust route based on safety preferences
 */
export const adjustRouteForSafety = (
  route: any,
  preferenceLevel: number // 0-1, where 1 is maximum safety
): any => {
  if (preferenceLevel > 0.7) {
    // Prefer well-lit, populated routes
    return { ...route, detourThreshold: 0.2 };
  }
  if (preferenceLevel < 0.3) {
    // Shortest route
    return { ...route, detourThreshold: 0.5 };
  }
  // Balanced
  return { ...route, detourThreshold: 0.35 };
};
