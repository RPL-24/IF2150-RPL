import { Tabs } from 'expo-router';

import { warna } from '@/theme';

/**
 * Mahasiswa navigation: the five tabs from DPPL BAB 6 (Beranda, Kalender,
 * Konsultasi, Pengingat, FAQ). The other Mahasiswa screens are tab routes
 * with `href: null`, so they keep the tab bar but get no tab button.
 * Icons and styling come with the TabBar component.
 */
export default function MahasiswaLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: warna.merah, tabBarInactiveTintColor: warna.teksSekunder }}>
      <Tabs.Screen name="beranda" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="kalender" options={{ title: 'Kalender' }} />
      <Tabs.Screen name="konsultasi" options={{ title: 'Konsultasi' }} />
      <Tabs.Screen name="pengingat" options={{ title: 'Pengingat' }} />
      <Tabs.Screen name="faq" options={{ title: 'FAQ' }} />
      <Tabs.Screen name="afirmasi" options={{ href: null }} />
      <Tabs.Screen name="sesi" options={{ href: null }} />
      <Tabs.Screen name="pertanyaan" options={{ href: null }} />
      <Tabs.Screen name="umpan-balik" options={{ href: null }} />
    </Tabs>
  );
}
