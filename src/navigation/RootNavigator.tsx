/**
 * Root Navigator
 * Top-level navigation orchestration
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
    LoginScreen,
    NavigationModeScreen,
    PremiumScreen,
    ReportIncidentScreen,
} from '../screens';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  NavigationMode: { route?: any };
  ReportIncident: undefined;
  Premium: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
        initialRouteName="Main"
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        
        <Stack.Screen
          name="Auth"
          options={{ animationEnabled: false }}
        >
          {() => <LoginScreen />}
        </Stack.Screen>

        <Stack.Screen
          name="NavigationMode"
          options={{
            animationEnabled: true,
            presentation: 'fullScreenModal',
          }}
        >
              {({ route }) => (
                <NavigationModeScreen
                  route={route.params?.route}
                  onComplete={() => {
                    /* Handle walk complete */
                  }}
                  onEmergency={() => {
                    /* Handle emergency */
                  }}
                  onCancel={() => {
                    /* Handle cancel */
                  }}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="ReportIncident"
              options={{
                animationEnabled: true,
                presentation: 'modal',
              }}
            >
              {() => (
                <ReportIncidentScreen
                  onSubmit={() => {
                    /* Handle report submit */
                  }}
                  onCancel={() => {
                    /* Handle cancel */
                  }}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Premium"
              options={{
                animationEnabled: true,
                presentation: 'modal',
              }}
            >
              {() => (
                <PremiumScreen
                  onSubscribe={() => {
                    /* Handle subscription */
                  }}
                  onCancel={() => {
                    /* Handle cancel */
                  }}
                />
              )}
            </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
