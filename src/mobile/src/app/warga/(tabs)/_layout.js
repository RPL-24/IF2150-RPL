// Tab bawah masyarakat (sesuai I-02 bottom nav: Beranda, Lapor, Profil + Laporan Saya). Pemilik: P1.
import { Tabs } from 'expo-router/js-tabs';
import { ikonTab, opsiTab } from '../../../components/navigasi/opsi';

export default function TabWarga() {
  return (
    <Tabs screenOptions={opsiTab}>
      <Tabs.Screen name="index" options={{ title: 'Beranda', ...ikonTab('home') }} />
      <Tabs.Screen name="lapor" options={{ title: 'Lapor', ...ikonTab('add-circle') }} />
      <Tabs.Screen name="saya" options={{ title: 'Laporan Saya', ...ikonTab('document-text') }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', ...ikonTab('person') }} />
    </Tabs>
  );
}
