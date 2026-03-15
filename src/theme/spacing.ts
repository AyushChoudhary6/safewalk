/**
 * SafeWalk Spacing System
 * Consistent spacing tokens for layout
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

// Border radius tokens
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadows (iOS-style)
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Z-index values
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  modal: 100,
  toast: 1000,
  tooltip: 1100,
};
