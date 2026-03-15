/**
 * Incident Types Constants
 */

export const INCIDENT_TYPES = {
  POOR_LIGHTING: 'poor_lighting',
  HARASSMENT: 'harassment',
  THEFT: 'theft',
  UNSAFE_AREA: 'unsafe_area',
  FELT_SAFE: 'felt_safe',
  OTHER: 'other',
} as const;

export const INCIDENT_TYPE_LABELS = {
  [INCIDENT_TYPES.POOR_LIGHTING]: 'Poor Lighting',
  [INCIDENT_TYPES.HARASSMENT]: 'Harassment',
  [INCIDENT_TYPES.THEFT]: 'Theft',
  [INCIDENT_TYPES.UNSAFE_AREA]: 'Unsafe Area',
  [INCIDENT_TYPES.FELT_SAFE]: 'Felt Safe',
  [INCIDENT_TYPES.OTHER]: 'Other',
};

export const INCIDENT_TYPE_ICONS = {
  [INCIDENT_TYPES.POOR_LIGHTING]: 'lightbulb-off',
  [INCIDENT_TYPES.HARASSMENT]: 'alert-circle',
  [INCIDENT_TYPES.THEFT]: 'lock-alert',
  [INCIDENT_TYPES.UNSAFE_AREA]: 'shield-alert',
  [INCIDENT_TYPES.FELT_SAFE]: 'check-circle',
  [INCIDENT_TYPES.OTHER]: 'information',
} as const;

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
} as const;

export const NEGATIVE_INCIDENTS = [
  INCIDENT_TYPES.POOR_LIGHTING,
  INCIDENT_TYPES.HARASSMENT,
  INCIDENT_TYPES.THEFT,
  INCIDENT_TYPES.UNSAFE_AREA,
];
