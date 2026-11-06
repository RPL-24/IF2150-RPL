// Tab bawah pemerintah daerah (I-08 bottom nav: Laporan, Fasilitas). Pemilik: P1.
import { Tabs } from 'expo-router/js-tabs';
import { ikonTab, opsiTab } from '../../../components/navigasi/opsi';

export default function TabPemda() {
  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen name="index" options={{ title: 'Laporan', ...ikonTab('compass') }} />
      <Tabs.Screen name="fasilitas" options={{ title: 'Fasilitas', ...ikonTab('business') }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', ...ikonTab('person') }} />
    </Tabs>
  );
}
