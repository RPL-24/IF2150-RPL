/**
 * Root Stack Navigator Aplikasi CariUang
 * Traceability: UC01 (Mendaftarkan Jasa), Antarmuka UI-16 (Daftar Penyedia Jasa)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigation';
import { ServiceRegistrationView } from '../views/service/ServiceRegistrationView';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        name="ServiceRegistration"
        component={ServiceRegistrationView}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
