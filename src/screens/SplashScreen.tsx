/**
 * SplashScreen
 * Initial loading screen with app branding
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.();
    });
  }, [fadeAnim, onComplete]);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="shield-check"
            size={80}
            color={COLORS.card}
          />
        </View>

        <Text style={styles.appName}>SafeWalk</Text>
        <Text style={styles.tagline}>Safer routes powered by community</Text>

        <ActivityIndicator
          color={COLORS.card}
          size="large"
          style={styles.loader}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: '700',
    color: COLORS.card,
    marginBottom: SPACING.md,
  },
  tagline: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.card,
    opacity: 0.9,
    marginBottom: SPACING.xxxl,
  },
  loader: {
    marginTop: SPACING.xxl,
  },
});
