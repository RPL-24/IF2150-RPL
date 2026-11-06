import AddProductPage from './views/AddProductPage';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

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
import NotificationPage from './views/NotificationPage';
import IzinNotifikasiPage from './views/IzinNotifikasiPage';
import ProductDetailPage from './views/ProductDetailPage';
import {
  pushNotificationUI as pushUI,
  type DataNotifikasi,
} from './services/PushNotificationUI';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function bukaDariNotifikasi(data: DataNotifikasi) {
  if (!navigationRef.isReady()) return;
  if (data.tipe === 'kerugian' && data.idProduk) {
    navigationRef.navigate('ProductDetail', { idProduk: data.idProduk });
  } else {
    navigationRef.navigate('Home');
  }
}

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

  useEffect(() => {
    if (!session) return;
    let aktif = true;
    pushUI.inisialisasi().catch((e) => console.warn('Gagal menyiapkan notifikasi:', e));
    const berhenti = pushUI.onClickNotification(bukaDariNotifikasi);
    pushUI.ambilKetukanTerakhir().then((data) => {
      if (aktif && data !== null) bukaDariNotifikasi(data);
    });
    return () => {
      aktif = false;
      berhenti();
    };
  }, [session]);

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
    <NavigationContainer ref={navigationRef}>
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

          <Stack.Screen
            name="AddProduct"
            component={AddProductPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Notifikasi"
            component={NotificationPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="IzinNotifikasi"
            component={IzinNotifikasiPage}
            options={{ title: 'Izin notifikasi' }}
          />

          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailPage}
            options={{ title: 'Detail Produk' }}
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