import { useRouter } from 'expo-router';
import Bell from 'lucide-react-native/icons/bell';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import Clock from 'lucide-react-native/icons/clock';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Sun from 'lucide-react-native/icons/sun';
import Users from 'lucide-react-native/icons/users';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Muatan } from '@/lib/muatan';
import { sapaan } from '@/lib/waktu';
import { jarak, warna } from '@/theme';
import { GridMenu, type ItemMenu } from '@/views/beranda/GridMenu';
import { KartuAfirmasi, type Afirmasi } from '@/views/beranda/KartuAfirmasi';
import { KartuSesi, type SesiBerikutnya } from '@/views/beranda/KartuSesi';
import { KepalaBeranda } from '@/views/beranda/KepalaBeranda';

/** I-02-05: menu tiles and the screens they open (`HomeView.bukaMenu`). */
const MENU: ItemMenu[] = [
  { ikon: Sun, judul: 'Afirmasi', tujuan: '/afirmasi' },
  { ikon: Clock, judul: 'Pengingat', tujuan: '/pengingat' },
  { ikon: Calendar, judul: 'Kalender', tujuan: '/kalender' },
  { ikon: Users, judul: 'Konsultasi', tujuan: '/konsultasi' },
  { ikon: CircleQuestionMark, judul: 'FAQ', tujuan: '/faq' },
  { ikon: MessageSquare, judul: 'Umpan Balik', tujuan: '/umpan-balik' },
];

// TODO(#4): replace with data from the backend once #16 is merged:
//   nama from login (#3), afirmasi from GET /api/affirmation,
//   sesi from GET /api/sessions/next. Sample values follow the seed data.
const PRATINJAU: {
  nama: string;
  afirmasi: Muatan<Afirmasi | null>;
  sesi: Muatan<SesiBerikutnya | null>;
} = {
  nama: 'Mahasiswa Uji',
  afirmasi: {
    status: 'siap',
    data: {
      konten:
        'Hari ini kamu sudah melakukan yang terbaik. Tarik napas, dan beri dirimu ruang untuk beristirahat.',
      waktuKirim: '07:00',
    },
  },
  sesi: {
    status: 'siap',
    data: {
      waktu: '2026-11-09T03:00:00Z',
      waktuSelesai: '2026-11-09T04:00:00Z',
      nama: 'Dr. Raisa Wibowo, M.Psi.',
      spesialisasi: 'Psikologi Klinis',
    },
  },
};

/** I-02 Beranda Mahasiswa (`HomeView.tampilkanBeranda('mahasiswa')`). */
export default function BerandaMahasiswa() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { nama, afirmasi, sesi } = PRATINJAU;
  const muatUlang = () => {}; // TODO(#4): refetch

  return (
    <ScrollView style={styles.layar} contentContainerStyle={[styles.isi, { paddingTop: top + jarak.md }]}>
      {/* I-02-02: the notification list has no screen in BAB 6 yet. */}
      <KepalaBeranda atas={`${sapaan()},`} judul={nama} ikon={Bell} labelIkon="Notifikasi" />

      <KartuAfirmasi afirmasi={afirmasi} onBuka={() => router.push('/afirmasi')} onCobaLagi={muatUlang} />
      <KartuSesi
        sesi={sesi}
        onBuka={() => router.push('/kalender')}
        onPesan={() => router.push('/konsultasi')}
        onCobaLagi={muatUlang}
      />

      <GridMenu judul="Menu" menu={MENU} kolom={3} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingBottom: jarak.xl, gap: jarak.md },
});
