import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { pulihkanSesi, type Pengguna } from '@/api';
import { StatusBar } from '@/components';
import { PenyediaSesi } from '@/lib/sesi';
import { berkasFont, warna } from '@/theme';

// Keep the splash screen up until Plus Jakarta Sans has loaded and the stored session is checked.
SplashScreen.preventAutoHideAsync();

/** Root navigator: entry screen, the Mahasiswa tab group, and the Administrator stack. */
export default function RootLayout() {
  const [fontSiap, galatFont] = useFonts(berkasFont);
  // `undefined` while checking; then the restored user or `null`.
  const [sesiAwal, setSesiAwal] = useState<Pengguna | null>();
  // If font loading fails, carry on with the system font rather than a blank screen.
  const siap = (fontSiap || !!galatFont) && sesiAwal !== undefined;

  useEffect(() => {
    pulihkanSesi().then(setSesiAwal);
  }, []);

  useEffect(() => {
    if (siap) SplashScreen.hideAsync();
  }, [siap]);

  if (!siap) return null;

  return (
    <PenyediaSesi awal={sesiAwal}>
      <StatusBar />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.latar } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(mahasiswa)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="komponen" />
      </Stack>
    </PenyediaSesi>
  );
}
