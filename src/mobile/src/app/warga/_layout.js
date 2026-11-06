// Navigasi peran PELAPOR (masyarakat): tab bawah di (tabs)/, layar detail di atasnya sebagai stack. Pemilik: P1.
import { Stack } from 'expo-router';
import { opsiStack } from '../../components/navigasi/opsi';

export default function LayoutWarga() {
  return (
    <Stack screenOptions={opsiStack}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="laporan/[id]" options={{ title: 'Detail Laporan' }} />
      <Stack.Screen name="revisi/[id]" options={{ title: 'Revisi Laporan' }} />
      <Stack.Screen name="notifikasi" options={{ title: 'Notifikasi' }} />
    </Stack>
  );
}
