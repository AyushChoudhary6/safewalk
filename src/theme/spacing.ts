/**
 * SafeWalk Spacing System
 * Consistent spacing tokens for layout - following Material Design 3
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

// Predefined padding/margin combinations
export const PADDING = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  card: SPACING.base, // 16px for cards
  base: SPACING.base,
  lg: SPACING.lg,
  xl: SPACING.xl,
  xxl: SPACING.xxl,
};

// Border radius tokens - Modern rounded corners
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Enhanced Shadows - Google Material Design 3 style
export const SHADOWS = {
  // Subtle shadow for cards
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Small shadow
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  // Medium shadow
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Large shadow for floating elements
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  // Extra large shadow for modals
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Z-index values for layering
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 100,
  toast: 1000,
  tooltip: 1100,
};

// Animation timing (in milliseconds)
export const ANIMATION_TIMING = {
  xs: 150,      // Very quick interactions
  sm: 200,      // Quick interactions
  md: 300,      // Standard transitions
  lg: 500,      // Smooth transitions
  xl: 800,      // Long animations
};

// Line heights for typography
export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};
