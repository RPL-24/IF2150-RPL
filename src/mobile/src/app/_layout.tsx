import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { StatusBar } from '@/components';
import { berkasFont, warna } from '@/theme';

// Keep the splash screen up until Plus Jakarta Sans has loaded.
SplashScreen.preventAutoHideAsync();

/** Root navigator: entry screen, the Mahasiswa tab group, and the Administrator stack. */
export default function RootLayout() {
  const [fontSiap, galatFont] = useFonts(berkasFont);

  useEffect(() => {
    if (fontSiap || galatFont) SplashScreen.hideAsync();
  }, [fontSiap, galatFont]);

  // If loading fails, carry on with the system font rather than a blank screen.
  if (!fontSiap && !galatFont) return null;

  return (
    <>
      <StatusBar />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.latar } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(mahasiswa)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="komponen" />
      </Stack>
    </>
  );
}
