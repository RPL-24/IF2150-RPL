import { Redirect, Tabs } from 'expo-router';
import Bell from 'lucide-react-native/icons/bell';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import House from 'lucide-react-native/icons/house';
import Users from 'lucide-react-native/icons/users';

import { TabBar } from '@/components';
import { useSesi } from '@/lib/sesi';

/**
 * Mahasiswa navigation: the five tabs from DPPL BAB 6 (Beranda, Kalender,
 * Konsultasi, Pengingat, FAQ). The other Mahasiswa screens are tab routes
 * with `href: null`, so they keep the tab bar but get no tab button.
 */
export default function MahasiswaLayout() {
  const { pengguna } = useSesi();
  // Signed out, or an Administrator: I-01 sends them to the right place.
  if (pengguna?.peran !== 'mahasiswa') return <Redirect href="/" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="beranda" options={{ title: 'Beranda', tabBarIcon: (p) => <House {...p} /> }} />
      <Tabs.Screen name="kalender" options={{ title: 'Kalender', tabBarIcon: (p) => <Calendar {...p} /> }} />
      <Tabs.Screen name="konsultasi" options={{ title: 'Konsultasi', tabBarIcon: (p) => <Users {...p} /> }} />
      <Tabs.Screen name="pengingat" options={{ title: 'Pengingat', tabBarIcon: (p) => <Bell {...p} /> }} />
      <Tabs.Screen name="faq" options={{ title: 'FAQ', tabBarIcon: (p) => <CircleQuestionMark {...p} /> }} />
      <Tabs.Screen name="afirmasi" options={{ href: null }} />
      <Tabs.Screen name="sesi" options={{ href: null }} />
      <Tabs.Screen name="pertanyaan" options={{ href: null }} />
      <Tabs.Screen name="umpan-balik" options={{ href: null }} />
    </Tabs>
  );
}
