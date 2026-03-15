/**
 * SafeWalk Color Palette
 * Centralized color definitions for consistent theming
 */

export const COLORS = {
  // Primary Colors
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',

  // Safety Status Colors
  safe: '#22C55E',
  safeLight: '#86EFAC',
  safeDark: '#15803D',

  // Warning Colors
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  // Danger Colors
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerDark: '#DC2626',

  // Neutral Colors
  background: '#F9FAFB',
  card: '#FFFFFF',
  surface: '#F3F4F6',
  border: '#E5E7EB',

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    light: '#D1D5DB',
  },

  // Overlay/Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',

  // Status - Risk Levels
  riskLevel: {
    low: '#22C55E',      // Green
    moderate: '#F59E0B',  // Yellow
    high: '#EF4444',      // Red
  },

  // Gradients (for use with LinearGradient)
  gradient: {
    primary: ['#2563EB', '#3B82F6'],
    safe: ['#22C55E', '#86EFAC'],
    warning: ['#F59E0B', '#FBBF24'],
  },
};

// Semantic color aliases for common patterns
export const SEMANTIC_COLORS = {
  success: COLORS.safe,
  error: COLORS.danger,
  info: COLORS.primary,
  alert: COLORS.warning,
  disabled: COLORS.text.tertiary,
};
