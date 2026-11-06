import { useRouter, type Href } from 'expo-router';
import Bell from 'lucide-react-native/icons/bell';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import Clock from 'lucide-react-native/icons/clock';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Sun from 'lucide-react-native/icons/sun';
import Users from 'lucide-react-native/icons/users';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenuTile, Teks } from '@/components';
import type { Muatan } from '@/lib/muatan';
import { sapaan } from '@/lib/waktu';
import { jarak, sudut, ukuran, warna } from '@/theme';
import { KartuAfirmasi, type Afirmasi } from '@/views/beranda/KartuAfirmasi';
import { KartuSesi, type SesiBerikutnya } from '@/views/beranda/KartuSesi';

/** I-02-05: menu tiles and the screens they open (`HomeView.bukaMenu`). */
const MENU: { ikon: LucideIcon; judul: string; tujuan: Href }[] = [
  { ikon: Sun, judul: 'Afirmasi', tujuan: '/afirmasi' },
  { ikon: Clock, judul: 'Pengingat', tujuan: '/pengingat' },
  { ikon: Calendar, judul: 'Kalender', tujuan: '/kalender' },
  { ikon: Users, judul: 'Konsultasi', tujuan: '/konsultasi' },
  { ikon: CircleQuestionMark, judul: 'FAQ', tujuan: '/faq' },
  { ikon: MessageSquare, judul: 'Umpan Balik', tujuan: '/umpan-balik' },
];

const KOLOM = 3;

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

  const baris = [];
  for (let i = 0; i < MENU.length; i += KOLOM) baris.push(MENU.slice(i, i + KOLOM));

  return (
    <ScrollView style={styles.layar} contentContainerStyle={[styles.isi, { paddingTop: top + jarak.md }]}>
      <View style={styles.kepala}>
        <View style={styles.sapaan}>
          <Teks warna="teksSekunder">{sapaan()},</Teks>
          <Teks gaya="h2" numberOfLines={1}>
            {nama}
          </Teks>
        </View>
        {/* I-02-02: the notification list has no screen in BAB 6 yet. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifikasi"
          style={({ pressed }) => [styles.lonceng, pressed && { backgroundColor: warna.merahLembut }]}
        >
          <Bell size={22} color={warna.teks} />
        </Pressable>
      </View>

      <KartuAfirmasi afirmasi={afirmasi} onBuka={() => router.push('/afirmasi')} onCobaLagi={muatUlang} />
      <KartuSesi
        sesi={sesi}
        onBuka={() => router.push('/kalender')}
        onPesan={() => router.push('/konsultasi')}
        onCobaLagi={muatUlang}
      />

      <View style={styles.menu}>
        <Teks gaya="h3" accessibilityRole="header">
          Menu
        </Teks>
        {baris.map((isiBaris, i) => (
          <View key={i} style={styles.barisMenu}>
            {isiBaris.map((m) => (
              <MenuTile key={m.judul} ikon={m.ikon} judul={m.judul} onPress={() => router.push(m.tujuan)} />
            ))}
            {/* Keep tile widths equal on a short last row. */}
            {Array.from({ length: KOLOM - isiBaris.length }, (_, j) => (
              <View key={`kosong-${j}`} style={styles.pengisi} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingBottom: jarak.xl, gap: jarak.md },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: jarak.sm },
  sapaan: { flex: 1 },
  lonceng: {
    width: ukuran.tinggiKontrol,
    height: ukuran.tinggiKontrol,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.penuh,
  },
  menu: { gap: jarak.sm, marginTop: jarak.xs },
  barisMenu: { flexDirection: 'row', gap: jarak.sm },
  pengisi: { flex: 1 },
});
