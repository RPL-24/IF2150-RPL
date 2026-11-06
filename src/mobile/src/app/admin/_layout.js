// Navigasi peran ADMIN: tab bawah di (tabs)/, layar detail di atasnya sebagai stack. Pemilik: P1.
import { Stack } from 'expo-router';
import { opsiStack } from '../../components/navigasi/opsi';

export default function LayoutAdmin() {
  return (
    <Stack screenOptions={opsiStack}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="verifikasi/[id]" options={{ title: 'Verifikasi Laporan' }} />
      <Stack.Screen name="fasilitas/[id]" options={{ title: 'Detail Fasilitas' }} />
    </Stack>
  );
}
