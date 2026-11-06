/**
 * Opsi navigasi bersama (tab bawah & header stack). Pemilik: P1.
 */
import { Ionicons } from '@expo/vector-icons';
import { warna } from '../../theme/tokens';

export const opsiTab = {
  headerShown: false,
  tabBarActiveTintColor: warna.primer,
  tabBarInactiveTintColor: warna.teksLembut,
  tabBarStyle: { backgroundColor: warna.permukaan },
};

/** Buat opsi satu tab: ikonTab('home') -> ikon Ionicons "home" / "home-outline". */
export const ikonTab = (nama) => ({
  tabBarIcon: ({ color, size, focused }) => (
    <Ionicons name={focused ? nama : `${nama}-outline`} size={size} color={color} />
  ),
});

export const opsiStack = {
  headerTintColor: warna.primer,
  headerTitleStyle: { color: warna.teks },
  headerStyle: { backgroundColor: warna.permukaan },
  contentStyle: { backgroundColor: warna.latar },
  headerBackTitle: 'Kembali',
};
