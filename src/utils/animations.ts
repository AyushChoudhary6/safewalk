/**
 * Animation Utilities
 * Reusable animation configurations and helpers for smooth interactions
 */

import { Animated } from 'react-native';
import { ANIMATION_TIMING } from '../theme';

/**
 * Quick fade-in animation
 */
export const createFadeInAnimation = (duration: number = ANIMATION_TIMING.md) => {
  const anim = new Animated.Value(0);
  
  const start = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { anim, start };
};

/**
 * Slide up animation (from bottom)
 */
export const createSlideUpAnimation = (duration: number = ANIMATION_TIMING.lg) => {
  const translateY = new Animated.Value(100);
  const opacity = new Animated.Value(0);

  const start = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { translateY, opacity, start };
};

/**
 * Scale animation (grow/shrink)
 */
export const createScaleAnimation = (duration: number = ANIMATION_TIMING.sm) => {
  const scale = new Animated.Value(0.9);

  const animateTo = (toValue: number = 1) => {
    Animated.spring(scale, {
      toValue,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return { scale, animateTo };
};

/**
 * Pulse animation (for attention)
 */
export const createPulseAnimation = () => {
  const opacity = new Animated.Value(1);

  const start = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: ANIMATION_TIMING.lg,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_TIMING.lg,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return { opacity, start };
};

/**
 * Color animation (interpolate between colors)
 */
export const createColorAnimation = (duration: number = ANIMATION_TIMING.md) => {
  const progress = new Animated.Value(0);

  const animateTo = (toValue: number = 1) => {
    Animated.timing(progress, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  };

  return { progress, animateTo };
};

/**
 * Bounce animation
 */
export const createBounceAnimation = () => {
  const translateY = new Animated.Value(0);

  const start = () => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: -10,
        duration: ANIMATION_TIMING.sm,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { translateY, start };
};

/**
 * Shimmer/Loading animation (for skeleton screens)
 */
export const createShimmerAnimation = () => {
  const shimmerValue = new Animated.Value(0);

  const start = () => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  };

  return { shimmerValue, start };
};

/**
 * Combined fade and scale animation (common pattern)
 */
export const createFadeScaleAnimation = (duration: number = ANIMATION_TIMING.md) => {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.9);

  const start = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const reset = () => {
    opacity.setValue(0);
    scale.setValue(0.9);
  };

  return { opacity, scale, start, reset };
};
