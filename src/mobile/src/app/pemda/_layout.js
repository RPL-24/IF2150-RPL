// Navigasi peran PEMDA (pemerintah daerah): tab bawah di (tabs)/, layar detail di atasnya sebagai stack. Pemilik: P1.
import { Stack } from 'expo-router';
import { opsiStack } from '../../components/navigasi/opsi';

export default function LayoutPemda() {
  return (
    <Stack screenOptions={opsiStack}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="fasilitas/[id]" options={{ title: 'Detail Fasilitas' }} />
    </Stack>
  );
}
