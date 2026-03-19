/**
 * SearchBar Component
 * Reusable search input component
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/TabNavigator';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
    Image,
    Text
} from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../theme';

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

  return (
    <View style={[styles.container, style]}>
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
        onFocus={onFocus}
        editable={editable}
        selectionColor={COLORS.primary}
      />

      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <MaterialCommunityIcons
            name="close-circle"
            size={18}
            color={COLORS.text.secondary}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={styles.profileButton}>
        <View style={styles.profileAvatarContainer}>
          <Text style={styles.profileAvatarText}>👤</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.base,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
  },
  clearButton: {
    padding: SPACING.sm,
  },
  profileButton: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20', // light primary
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  profileAvatarText: {
    fontSize: 16,
  },
});
