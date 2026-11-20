import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
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
import * as Linking from 'expo-linking';

import { supabase } from './services/supabase';

import type { RootStackParamList } from './navigation/types';

import LoginPage from './views/LoginPage';
import RegistrationPage from './views/RegistrationPage';
import ResetPasswordPage from './views/ResetPasswordPage';
import HomePage from './views/HomePage';
import NotificationPage from './views/NotificationPage';
import IzinNotifikasiPage from './views/IzinNotifikasiPage';
import ProductDetailPage from './views/ProductDetailPage';
import ProfilePage from './views/ProfilePage';
import EditProductPage from './views/EditProductPage';
import PriceHistoryPage from './views/PriceHistoryPage';
import AddProductPage from './views/AddProductPage';
import SearchProductPage from './views/SearchProductPage';
import TrenBahanBakuPage from './views/TrenBahanBakuPage';
import {
  pushNotificationUI as pushUI,
  type DataNotifikasi,
} from './services/PushNotificationUI';
import {
  ResetPasswordController,
  bacaTautanReset,
} from './controllers/ResetPasswordController';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();
const resetController = new ResetPasswordController();

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
  const [modePemulihan, setModePemulihan] = useState(false);
  const urlTerakhir = useRef<string | null>(null);

  useEffect(() => {
    let authEventReceived = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        authEventReceived = true;
        setSession(nextSession);
        if (_event === 'SIGNED_OUT') {
          setModePemulihan(false);
        }
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
    if (!session || modePemulihan) return;
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
  }, [session, modePemulihan]);

  useEffect(() => {
    async function tanganiTautan(url: string | null) {
      if (!url || url === urlTerakhir.current) return;

      const tautan = bacaTautanReset(url);
      if (tautan.tipe === 'bukan-reset') return;
      urlTerakhir.current = url;

      if (tautan.tipe === 'galat') {
        Alert.alert('Tautan tidak valid', tautan.pesan);
        return;
      }

      setModePemulihan(true);
      const hasil = await resetController.terimaTautan(url);

      if (hasil.tipe === 'galat') {
        setModePemulihan(false);
        Alert.alert('Tautan tidak valid', hasil.pesan);
      }
    }
    Linking.getInitialURL().then((url) => {
      tanganiTautan(url);
    });

    const langganan = Linking.addEventListener('url', ({ url }) => {
      tanganiTautan(url);
    });

    return () => langganan.remove();
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
    <NavigationContainer ref={navigationRef}>
      {session && !modePemulihan ? (
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
            name="SearchProduct"
            component={SearchProductPage}
            options={{ title: 'Cari Produk' }}
          />

          <Stack.Screen
            name="TrenBahanBaku"
            component={TrenBahanBakuPage}
            options={{ title: 'Tren Bahan Baku' }}
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
          <Stack.Screen
            name="Profile"
            component={ProfilePage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          key={modePemulihan ? 'pemulihan' : 'auth'}
          initialRouteName={modePemulihan ? 'ResetPassword' : 'Login'}
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
            initialParams={{ mode: modePemulihan ? 'recovery' : 'request' }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}