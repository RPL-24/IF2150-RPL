// Tab bawah admin (I-05 bottom bar: dashboard, laporan, notifikasi, profil). Pemilik: P1.
import { Tabs } from 'expo-router/js-tabs';
import { ikonTab, opsiTab } from '../../../components/navigasi/opsi';

export default function TabAdmin() {
  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', ...ikonTab('home') }} />
      <Tabs.Screen name="duplikat" options={{ title: 'Laporan Aktif', ...ikonTab('git-merge') }} />
      <Tabs.Screen name="fasilitas" options={{ title: 'Fasilitas', ...ikonTab('business') }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', ...ikonTab('person') }} />
    </Tabs>
  );
}
