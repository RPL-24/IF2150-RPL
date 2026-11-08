/**
 * Tombol "Masuk dengan Google" (SKPL 2.4 butir 1, I-01 O-0103). Pemilik: P1.
 *
 * Aktif hanya bila client ID OAuth untuk platform ini diisi di mobile/.env:
 *   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 * dan server mengisi GOOGLE_CLIENT_IDS dengan ID yang sama. Login Google di Android/iOS membutuhkan
 * development build (`npx expo run:android`), bukan Expo Go. Tanpa konfigurasi, tombol tampil nonaktif
 * dan pengguna masuk dengan email + kata sandi (gap G5).
 */
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Tombol } from '../components/ui';
import { useAuth } from './AuthContext';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
};

export const googleTersedia = Boolean(
  Platform.select({ android: CLIENT_ID.androidClientId, ios: CLIENT_ID.iosClientId, default: CLIENT_ID.webClientId }),
);

function TombolAktif({ onError, style }) {
  const { masukDenganGoogle } = useAuth();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(CLIENT_ID);
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    if (response?.type !== 'success') {
      if (response?.type === 'error') onError?.('Login Google gagal. Coba lagi.');
      return;
    }
    const idToken = response.params?.id_token;
    if (!idToken) {
      onError?.('Google tidak mengirimkan token login.');
      return;
    }
    setMemuat(true);
    masukDenganGoogle(idToken)
      .catch((err) => onError?.(err.message))
      .finally(() => setMemuat(false));
  }, [response, masukDenganGoogle, onError]);

  return (
    <Tombol
      judul="Masuk dengan Google"
      ikon="logo-google"
      varian="sekunder"
      nonaktif={!request}
      memuat={memuat}
      style={style}
      onPress={() => {
        onError?.('');
        promptAsync();
      }}
    />
  );
}

export default function TombolMasukGoogle({ onError, style }) {
  if (!googleTersedia) {
    return (
      <Tombol
        judul="Masuk dengan Google (belum dikonfigurasi)"
        ikon="logo-google"
        varian="sekunder"
        nonaktif
        style={style}
        onPress={() => {}}
      />
    );
  }
  return <TombolAktif onError={onError} style={style} />;
}
