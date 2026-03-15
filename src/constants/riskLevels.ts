/**
 * Risk Levels Constants
 */

export const RISK_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
} as const;

export const RISK_LEVEL_COLORS = {
  [RISK_LEVELS.LOW]: '#22C55E',
  [RISK_LEVELS.MODERATE]: '#F59E0B',
  [RISK_LEVELS.HIGH]: '#EF4444',
} as const;

export const RISK_LEVEL_EMOJI = {
  [RISK_LEVELS.LOW]: '🟢',
  [RISK_LEVELS.MODERATE]: '🟡',
  [RISK_LEVELS.HIGH]: '🔴',
} as const;

export const RISK_LEVEL_DESCRIPTIONS = {
  [RISK_LEVELS.LOW]: 'This area is generally safe',
  [RISK_LEVELS.MODERATE]: 'Exercise caution in this area',
  [RISK_LEVELS.HIGH]: 'High caution recommended in this area',
} as const;

// Safety score thresholds
export const SAFETY_SCORE_THRESHOLDS = {
  SAFE_MIN: 70,
  MODERATE_MIN: 40,
  HIGH_MIN: 0,
} as const;
