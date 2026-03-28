/**
 * SafeWalk Color Palette
 * Modern, professional color system inspired by Google Maps
 * Centralized color definitions for consistent theming
 */

export const COLORS = {
  // Primary Colors - Modern Blue
  primary: '#1F2937',
  primaryLight: '#374151',
  primaryDark: '#111827',

  // Accent Color - Vibrant Blue for CTAs
  accent: '#2563EB',
  accentLight: '#3B82F6',
  accentDark: '#1D4ED8',

  // Safety Status Colors
  safe: '#10B981',
  safeLight: '#6EE7B7',
  safeDark: '#059669',

  // Warning Colors
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  // Danger/Risk Colors
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerDark: '#DC2626',

  // Critical Risk
  critical: '#DC2626',

  // Neutral Colors - Clean & Professional
  background: '#FFFFFF',
  backgroundAlt: '#F9FAFB',
  card: '#FFFFFF',
  surface: '#F3F4F6',
  surfaceLight: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Text Colors - Professional Hierarchy
  text: {
    primary: '#111827',      // Dark gray for primary text
    secondary: '#6B7280',    // Medium gray for secondary
    tertiary: '#9CA3AF',     // Light gray for tertiary
    light: '#D1D5DB',        // Very light gray
    inverse: '#FFFFFF',      // White on dark backgrounds
  },

  // Overlay/Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.65)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  overlayVeryLight: 'rgba(0, 0, 0, 0.05)',

  // Status - Risk Levels (inspired by Google Maps)
  riskLevel: {
    low: '#10B981',      // Green
    moderate: '#F59E0B',  // Orange/Yellow
    high: '#EF4444',      // Red
    critical: '#DC2626',  // Dark Red
  },

  // Map-related colors
  route: {
    safe: '#10B981',
    moderate: '#F59E0B',
    danger: '#EF4444',
  },

  // Gradients (for use with LinearGradient)
  gradient: {
    primary: ['#1F2937', '#374151'],
    accent: ['#2563EB', '#3B82F6'],
    safe: ['#10B981', '#6EE7B7'],
    warning: ['#F59E0B', '#FBBF24'],
    danger: ['#EF4444', '#FCA5A5'],
  },

  // States
  disabled: '#D1D5DB',
  divider: '#E5E7EB',
};

// Semantic color aliases for common patterns
export const SEMANTIC_COLORS = {
  success: COLORS.safe,
  error: COLORS.danger,
  warning: COLORS.warning,
  info: COLORS.accent,
  alert: COLORS.warning,
  disabled: COLORS.text.tertiary,
  primary: COLORS.primary,
  secondary: COLORS.text.secondary,
};
