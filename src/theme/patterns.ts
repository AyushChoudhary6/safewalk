/**
 * Design System Patterns
 * Reusable style patterns and utilities for consistent design
 */

import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../theme';

/**
 * Card Styles - For all card-like containers
 */
export const cardStyles = StyleSheet.create({
  // Standard elevated card
  elevated: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  // Subtle card with minimal shadow
  subtle: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Filled card with surface background
  filled: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  // Outlined card (no fill)
  outlined: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
});

/**
 * Container Styles - For layout containers
 */
export const containerStyles = StyleSheet.create({
  // Safe area with standard padding
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Padded container
  padded: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  // Compact padding
  compact: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  // Centered container
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Section Styles - For content sections
 */
export const sectionStyles = StyleSheet.create({
  // Standard section with border
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.lg,
  },
  // Section with background
  withBackground: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  // Divider line
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
});

/**
 * Badge Styles - For status badges
 */
export const badgeStyles = StyleSheet.create({
  // Success badge
  success: {
    backgroundColor: COLORS.safe + '15',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  // Warning badge
  warning: {
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  // Danger badge
  danger: {
    backgroundColor: COLORS.danger + '15',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
});

/**
 * Icon Container Styles - For icon backgrounds
 */
export const iconContainerStyles = StyleSheet.create({
  // Small icon container
  small: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Medium icon container
  medium: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Large icon container
  large: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Circular icon container
  circular: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Input Styles - For form inputs
 */
export const inputStyles = StyleSheet.create({
  // Standard input container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
  },
  // Input field
  field: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    color: COLORS.text.primary,
  },
  // Focused input
  focused: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  // Error input
  error: {
    borderColor: COLORS.danger,
    borderWidth: 1.5,
  },
});

/**
 * List Item Styles - For list items
 */
export const listItemStyles = StyleSheet.create({
  // Standard list item
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // List item with padding
  padded: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  // Divider between items
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.lg,
    marginRight: SPACING.lg,
  },
});

/**
 * Text Label Styles - For form labels
 */
export const labelStyles = StyleSheet.create({
  // Required field indicator
  required: {
    color: COLORS.danger,
    fontWeight: '700',
    marginLeft: 2,
  },
  // Helper text
  helper: {
    color: COLORS.text.tertiary,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  // Error text
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});

/**
 * State Indicator Styles - For status indicators
 */
export const stateIndicatorStyles = StyleSheet.create({
  // Loading indicator
  loading: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  // Success indicator
  success: {
    backgroundColor: COLORS.safe + '15',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  // Error indicator
  error: {
    backgroundColor: COLORS.danger + '15',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  // Warning indicator
  warning: {
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
});

/**
 * Spacing Utilities - Quick spacing helpers
 */
export const spacingUtils = {
  // Margins
  marginTop: (value: number) => ({ marginTop: value }),
  marginBottom: (value: number) => ({ marginBottom: value }),
  marginHorizontal: (value: number) => ({ marginHorizontal: value }),
  marginVertical: (value: number) => ({ marginVertical: value }),
  
  // Paddings
  paddingTop: (value: number) => ({ paddingTop: value }),
  paddingBottom: (value: number) => ({ paddingBottom: value }),
  paddingHorizontal: (value: number) => ({ paddingHorizontal: value }),
  paddingVertical: (value: number) => ({ paddingVertical: value }),
  
  // Common combinations
  gap: (value: number) => ({ gap: value }),
};

/**
 * Flex Utilities - Quick flex helpers
 */
export const flexUtils = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  flex05: {
    flex: 0.5,
  },
});