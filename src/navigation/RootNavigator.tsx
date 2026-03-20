/**
 * Root Navigator
 * Top-level navigation orchestration
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../services/firebaseService';

import {
    EmergencyContactsScreen,
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
  EmergencyContacts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />

            <Stack.Screen
              name="NavigationMode"
              options={{
                animationEnabled: true,
                presentation: 'fullScreenModal',
              }}
            >
              {({ route, navigation }) => (
                <NavigationModeScreen
                  route={route.params?.route}
                  onComplete={() => {
                    navigation.goBack();
                  }}
                  onEmergency={() => {
                    /* Handle emergency */
                  }}
                  onCancel={() => {
                    navigation.goBack();
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
              {({ navigation }) => (
                <ReportIncidentScreen
                  onSubmit={(incident) => {
                    navigation.goBack();
                  }}
                  onCancel={() => {
                    navigation.goBack();
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

            <Stack.Screen
              name="EmergencyContacts"
              options={{
                animationEnabled: true,
                presentation: 'card',
              }}
            >
              {() => <EmergencyContactsScreen />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            options={{ animationEnabled: false }}
          >
            {() => <LoginScreen />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
