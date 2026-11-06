import { useRouter } from 'expo-router';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import LogOut from 'lucide-react-native/icons/log-out';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Server from 'lucide-react-native/icons/server';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Muatan } from '@/lib/muatan';
import { jarak, warna } from '@/theme';
import { GridMenu, type ItemMenu } from '@/views/beranda/GridMenu';
import { KartuStatusLayanan, type StatusLayanan } from '@/views/beranda/KartuStatusLayanan';
import { KepalaBeranda } from '@/views/beranda/KepalaBeranda';

/** I-03-04: management tiles and the screens they open (`HomeView.bukaMenu`). */
const MENU: ItemMenu[] = [
  { ikon: Calendar, judul: 'Jadwal Konsultan', keterangan: 'Tambah dan ubah slot', tujuan: '/admin/jadwal' },
  { ikon: CircleQuestionMark, judul: 'Kelola FAQ', keterangan: 'Tambah, ubah, hapus', tujuan: '/admin/faq' },
  { ikon: MessageSquare, judul: 'Umpan Balik', keterangan: 'Tanggapi masukan', tujuan: '/admin/umpan-balik' },
  { ikon: Server, judul: 'Status Server', keterangan: 'Pantau uptime', tujuan: '/admin/status' },
];

// TODO(#4): replace with GET /api/status/website and /api/status/server once #16 is merged.
const PRATINJAU: Muatan<StatusLayanan> = {
  status: 'siap',
  data: {
    website: { statusUptime: true, waktuCek: new Date(Date.now() - 5 * 60_000).toISOString() },
    server: { statusUptime: true, waktuCek: new Date(Date.now() - 5 * 60_000).toISOString() },
  },
};

/** I-03 Beranda Administrator (`HomeView.tampilkanBeranda('administrator')`). */
export default function BerandaAdministrator() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const muatUlang = () => {}; // TODO(#4): refetch

  // TODO(#3): call POST /api/auth/logout (SesiAutentikasi.logout) and clear the token first.
  const keluar = () => router.replace('/');

  return (
    <ScrollView style={styles.layar} contentContainerStyle={[styles.isi, { paddingTop: top + jarak.md }]}>
      <KepalaBeranda atas="Panel Administrator" judul="Halo, Admin" ikon={LogOut} labelIkon="Keluar" onIkon={keluar} />
      <KartuStatusLayanan status={PRATINJAU} onBuka={() => router.push('/admin/status')} onCobaLagi={muatUlang} />
      <GridMenu judul="Kelola" menu={MENU} kolom={2} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingBottom: jarak.xl, gap: jarak.md },
});
