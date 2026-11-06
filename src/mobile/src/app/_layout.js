/**
 * Layout akar: penyedia login + gerbang peran. Pengguna diarahkan ke folder rute sesuai perannya:
 *   PELAPOR -> /warga, ADMIN -> /admin, PEMDA -> /pemda. Belum login -> /login.
 * Pemilik: P1.
 */
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PERAN } from '@silembur/shared';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import { TampilanMemuat } from '../components/ui';

const GRUP_PERAN = {
  [PERAN.PELAPOR]: 'warga',
  [PERAN.ADMIN]: 'admin',
  [PERAN.PEMDA]: 'pemda',
};

function GerbangPeran() {
  const { pengguna, memuat } = useAuth();
  const segmen = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (memuat) return;
    const grupSekarang = segmen[0];
    if (!pengguna) {
      if (grupSekarang !== 'login') router.replace('/login');
      return;
    }
    const grupBenar = GRUP_PERAN[pengguna.peran];
    if (grupSekarang !== grupBenar) router.replace(`/${grupBenar}`);
  }, [pengguna, memuat, segmen, router]);

  if (memuat) return <TampilanMemuat />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <GerbangPeran />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
