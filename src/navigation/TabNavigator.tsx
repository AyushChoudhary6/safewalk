/**
 * Tab Navigator
 * Bottom tab navigation for main app experience
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
    ActivityScreen,
    EscortScreen,
    HomeScreen,
    ProfileScreen,
    ReportIncidentScreen,
} from '../screens';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

export type TabParamList = {
  HomeTab: undefined;
  ReportTab: undefined;
  EscortTab: undefined;
  ActivityTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabScreens = [
  {
    name: 'HomeTab',
    component: HomeScreen,
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'ReportTab',
    component: ReportIncidentScreen,
    label: 'Report',
    icon: 'flag-outline',
    activeIcon: 'flag',
  },
  {
    name: 'EscortTab',
    component: EscortScreen,
    label: 'Escort',
    icon: 'shield-outline',
    activeIcon: 'shield',
  },
  {
    name: 'ActivityTab',
    component: ActivityScreen,
    label: 'Activity',
    icon: 'history',
    activeIcon: 'history',
  },
  {
    name: 'ProfileTab',
    component: ProfileScreen,
    label: 'Profile',
    icon: 'account-outline',
    activeIcon: 'account',
  },
];

export const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: [
          styles.tabBar,
          { height: 60 + insets.bottom, paddingBottom: insets.bottom || SPACING.sm }
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused, color, size }) => {
          const screenConfig = tabScreens.find((s) => s.name === route.name);
          if (!screenConfig) return null;

          return (
            <MaterialCommunityIcons
              name={
                focused ? screenConfig.activeIcon : screenConfig.icon
              }
              size={24}
              color={color}
            />
          );
        },
      })}
    >
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name as any}
          component={screen.component}
          options={{
            title: screen.label,
            tabBarTestID: `tab-${screen.name}`,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
  },
  tabBarItem: {
    paddingTop: SPACING.xs,
  },
  tabBarLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});
