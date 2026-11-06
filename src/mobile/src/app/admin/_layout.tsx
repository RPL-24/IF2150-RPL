import { Redirect, Stack } from 'expo-router';

import { useSesi } from '@/lib/sesi';

/** Administrator navigation: Beranda Administrator and the four management screens. */
export default function AdminLayout() {
  const { pengguna } = useSesi();
  // Signed out, or a Mahasiswa: I-01 sends them to the right place.
  if (pengguna?.peran !== 'administrator') return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="jadwal" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="umpan-balik" />
      <Stack.Screen name="status" />
    </Stack>
  );
}
