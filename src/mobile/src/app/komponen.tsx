import { useRouter } from 'expo-router';
import CalendarClock from 'lucide-react-native/icons/calendar-clock';
import MessageSquare from 'lucide-react-native/icons/message-square';
import Send from 'lucide-react-native/icons/send';
import Server from 'lucide-react-native/icons/server';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar, AreaTeks, Banner, IsianTeks, Lencana, MenuTile, Teks, Tombol } from '@/components';
import { jarak, teks, warna, type GayaTeks } from '@/theme';

/**
 * Development gallery showing every shared component (issue #2 "done when").
 * TabBar is shown on the Mahasiswa screens and StatusBar is set in the root
 * layout. Not linked from the real app once LoginView replaces the entry screen.
 */
export default function Komponen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [memuat, setMemuat] = useState(false);

  return (
    <View style={styles.layar}>
      <AppBar judul="Galeri Komponen" onKembali={router.back} />
      <ScrollView contentContainerStyle={[styles.isi, { paddingBottom: bottom + jarak.xl }]}>
        <Bagian judul="Teks">
          {(Object.keys(teks) as GayaTeks[]).map((g) => (
            <Teks key={g} gaya={g}>
              {g}: Sehati untuk mahasiswa
            </Teks>
          ))}
        </Bagian>

        <Bagian judul="Tombol">
          <Tombol judul="Utama" />
          <Tombol judul="Sekunder" varian="sekunder" />
          <Tombol judul="Masuk dengan Google" varian="google" />
          <Tombol judul="Teks" varian="teks" />
          <Tombol judul="Dengan ikon" ikon={Send} />
          <Tombol
            judul="Memuat"
            memuat={memuat}
            onPress={() => {
              setMemuat(true);
              setTimeout(() => setMemuat(false), 1500);
            }}
          />
          <Tombol judul="Nonaktif" disabled />
        </Bagian>

        <Bagian judul="IsianTeks dan AreaTeks">
          <IsianTeks
            label="Email kampus"
            placeholder="nim@std.stei.itb.ac.id"
            keterangan="Gunakan email ITB."
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <IsianTeks label="Dengan galat" defaultValue="bukan-email" galat="Format email tidak valid." />
          <AreaTeks label="Pertanyaan" placeholder="Tulis pertanyaanmu di sini" />
        </Bagian>

        <Bagian judul="Banner">
          <Banner jenis="galat" judul="Gagal memuat">
            Periksa koneksi internet lalu coba lagi.
          </Banner>
          <Banner jenis="sukses">Sesi konsultasi berhasil dipesan.</Banner>
          <Banner jenis="info">Afirmasi harian dikirim setiap pukul 07.00.</Banner>
        </Bagian>

        <Bagian judul="Lencana">
          <View style={styles.baris}>
            <Lencana label="Dipesan" jenis="info" />
            <Lencana label="Selesai" jenis="sukses" />
            <Lencana label="Menunggu" jenis="peringatan" />
            <Lencana label="Dibatalkan" jenis="merah" />
            <Lencana label="Netral" />
          </View>
        </Bagian>

        <Bagian judul="MenuTile">
          <View style={styles.baris}>
            <MenuTile ikon={CalendarClock} judul="Jadwal" keterangan="Kelola slot konsultan" />
            <MenuTile ikon={MessageSquare} judul="Umpan Balik" keterangan="Tanggapi masukan" />
          </View>
          <MenuTile ikon={Server} judul="Status Server" />
        </Bagian>

        <Bagian judul="AppBar (gelap)">
          {/* Zero insets: this demo bar sits mid-page, not under the status bar. */}
          <SafeAreaInsetsContext.Provider value={tanpaInset}>
            <AppBar judul="Beranda Administrator" varian="gelap" />
          </SafeAreaInsetsContext.Provider>
        </Bagian>
      </ScrollView>
    </View>
  );
}

const tanpaInset = { top: 0, right: 0, bottom: 0, left: 0 };

function Bagian({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <View style={styles.bagian}>
      <Teks gaya="h2">{judul}</Teks>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: jarak.md, gap: jarak.xxl },
  bagian: { gap: jarak.sm },
  baris: { flexDirection: 'row', flexWrap: 'wrap', gap: jarak.xs },
});
