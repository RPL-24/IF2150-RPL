import { useRouter } from 'expo-router';
import Bell from 'lucide-react-native/icons/bell';
import Calendar from 'lucide-react-native/icons/calendar';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import Clock from 'lucide-react-native/icons/clock';
import LogOut from 'lucide-react-native/icons/log-out';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Sun from 'lucide-react-native/icons/sun';
import Users from 'lucide-react-native/icons/users';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ambilAfirmasi, ambilSesiBerikutnya } from '@/api';
import { useMuatan } from '@/lib/muatan';
import { useSesi } from '@/lib/sesi';
import { sapaan } from '@/lib/waktu';
import { jarak, warna } from '@/theme';
import { GridMenu, type ItemMenu } from '@/views/beranda/GridMenu';
import { KartuAfirmasi } from '@/views/beranda/KartuAfirmasi';
import { KartuSesi } from '@/views/beranda/KartuSesi';
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

/** I-02 Beranda Mahasiswa (`HomeView.tampilkanBeranda('mahasiswa')`). */
export default function BerandaMahasiswa() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { pengguna, keluar } = useSesi();
  const [afirmasi, muatUlangAfirmasi] = useMuatan(ambilAfirmasi);
  const [sesi, muatUlangSesi] = useMuatan(ambilSesiBerikutnya);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={[styles.isi, { paddingTop: top + jarak.md }]}>
      <KepalaBeranda
        atas={`${sapaan()},`}
        judul={pengguna?.nama ?? ''}
        aksi={[
          // I-02-02: the notification list has no screen in BAB 6 yet (M9 B.1 no. 3).
          { ikon: Bell, label: 'Notifikasi' },
          // Not in BAB 6: the only logout for a Mahasiswa (M9 B.1 no. 5).
          { ikon: LogOut, label: 'Keluar', onPress: () => void keluar() },
        ]}
      />

      <KartuAfirmasi afirmasi={afirmasi} onBuka={() => router.push('/afirmasi')} onCobaLagi={muatUlangAfirmasi} />
      <KartuSesi
        sesi={sesi}
        onBuka={() => router.push('/kalender')}
        onPesan={() => router.push('/konsultasi')}
        onCobaLagi={muatUlangSesi}
      />

      <GridMenu judul="Menu" menu={MENU} kolom={3} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingBottom: jarak.xl, gap: jarak.md },
});
