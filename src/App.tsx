
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import type { Session } from '@supabase/supabase-js';

import { supabase } from './services/supabase';

import type { RootStackParamList } from './navigation/types';

import LoginPage from './views/LoginPage';
import RegistrationPage from './views/RegistrationPage';
import ResetPasswordPage from './views/ResetPasswordPage';
import HomePage from './views/HomePage';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authEventReceived = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        authEventReceived = true;
        setSession(nextSession);
        setLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error(
          'Gagal mengambil session:',
          error.message,
        );
      }

      if (!authEventReceived) {
        setSession(data.session);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F7F5',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#168343"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#F4F7F5',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomePage}
            options={{ title: 'Pross' }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#F4F7F5',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegistrationPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
