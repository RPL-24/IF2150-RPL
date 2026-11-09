import { useRouter } from 'expo-router';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import LogOut from 'lucide-react-native/icons/log-out';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Server from 'lucide-react-native/icons/server';
import { useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ambilStatusLayanan } from '@/api';
import { useMuatan } from '@/lib/muatan';
import { useSesi } from '@/lib/sesi';
import { jarak, warna } from '@/theme';
import { GridMenu, type ItemMenu } from '@/views/beranda/GridMenu';
import { KartuStatusLayanan } from '@/views/beranda/KartuStatusLayanan';
import { KepalaBeranda } from '@/views/beranda/KepalaBeranda';

/** I-03-04: management tiles and the screens they open (`HomeView.bukaMenu`). */
const MENU: ItemMenu[] = [
  { ikon: Calendar, judul: 'Jadwal Konsultan', keterangan: 'Tambah dan ubah slot', tujuan: '/admin/jadwal' },
  { ikon: CircleQuestionMark, judul: 'Kelola FAQ', keterangan: 'Tambah, ubah, hapus', tujuan: '/admin/faq' },
  { ikon: MessageSquare, judul: 'Umpan Balik', keterangan: 'Tanggapi masukan', tujuan: '/admin/umpan-balik' },
  { ikon: Server, judul: 'Status Server', keterangan: 'Pantau uptime', tujuan: '/admin/status' },
];

/** I-03 Beranda Administrator (`HomeView.tampilkanBeranda('administrator')`). */
export default function BerandaAdministrator() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const sesi = useSesi();
  const [status, muatUlangStatus] = useMuatan(ambilStatusLayanan);

  // SesiAutentikasi.logout: ends the session on the backend, clears it on the device,
  // and returns to I-01. The ref ignores repeated taps while the request is in flight.
  const sedangKeluar = useRef(false);
  const keluar = () => {
    if (sedangKeluar.current) return;
    sedangKeluar.current = true;
    void sesi.keluar().finally(() => {
      sedangKeluar.current = false;
    });
  };

  return (
    <ScrollView style={styles.layar} contentContainerStyle={[styles.isi, { paddingTop: top + jarak.md }]}>
      <KepalaBeranda atas="Panel Administrator" judul="Halo, Admin" ikon={LogOut} labelIkon="Keluar" onIkon={keluar} />
      <KartuStatusLayanan status={status} onBuka={() => router.push('/admin/status')} onCobaLagi={muatUlangStatus} />
      <GridMenu judul="Kelola" menu={MENU} kolom={2} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingBottom: jarak.xl, gap: jarak.md },
});
