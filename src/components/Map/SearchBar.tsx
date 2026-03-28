/**
 * SearchBar Component
 * Google Maps-inspired search input component with smooth interactions
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/TabNavigator';
import React, { useRef } from 'react';
import {
    StyleSheet,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
    Image,
    Text,
    Animated,
} from 'react-native';
import { ANIMATION_TIMING, BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  editable?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChangeText,
  onClear,
  onFocus,
  style,
  inputStyle,
  editable = true,
}) => {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    // Expand SearchBar on focus with smooth animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: ANIMATION_TIMING.sm,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: ANIMATION_TIMING.sm,
        useNativeDriver: false,
      }),
    ]).start();

    onFocus?.();
  };

  const handleBlur = () => {
    // Shrink SearchBar on blur
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: ANIMATION_TIMING.sm,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: ANIMATION_TIMING.sm,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHADOWS.sm.shadowOpacity as number, SHADOWS.lg.shadowOpacity as number],
  });

  const containerScale = {
    transform: [{ scale: scaleAnim }],
  };

  const containerShadow = {
    shadowOpacity,
  };

  return (
    <Animated.View style={[styles.container, style, containerScale, containerShadow, SHADOWS.sm]}>
      <View style={styles.contentContainer}>
        <Ionicons
          name="search"
          size={18}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />

        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          selectionColor={COLORS.accent}
        />

        {value.length > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={COLORS.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileTab')}
        style={styles.profileButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.profileAvatarContainer}>
          <Text style={styles.profileAvatarText}>👤</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
  },
  clearButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  profileButton: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  profileAvatarText: {
    fontSize: 18,
  },
});
