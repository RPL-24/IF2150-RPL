import { Stack } from 'expo-router';

/** Administrator navigation: Beranda Administrator and the four management screens. */
export default function AdminLayout() {
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
