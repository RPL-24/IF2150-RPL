import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError, masukDemo, masukDenganGoogle, type Pengguna, type Peran } from '@/api';
import { Banner, Teks, Tombol } from '@/components';
import { useSesi } from '@/lib/sesi';
import { jarak, sudut, ukuran, warna } from '@/theme';

/**
 * Demo login (issue #3): lets assistants sign in as the seeded accounts
 * without a Google account. Shown only when EXPO_PUBLIC_MODE_DEMO=1.
 */
const MODE_DEMO = process.env.EXPO_PUBLIC_MODE_DEMO === '1';

/** I-01 Masuk (`LoginView`). */
export default function Masuk() {
  const { pengguna, masuk } = useSesi();
  const { top, bottom } = useSafeAreaInsets();
  // Which button is waiting for the backend, so only that one shows a spinner.
  const [memuat, setMemuat] = useState<'google' | Peran | null>(null);
  // I-01-06: message shown when Google validation fails (UC-11 alternative scenario 1).
  const [galat, setGalat] = useState<string | null>(null);

  const beranda = (peran: Peran) => (peran === 'mahasiswa' ? '/beranda' : '/admin');

  const coba = async (
    tombol: NonNullable<typeof memuat>,
    login: () => Promise<Pengguna | null>,
    pesanGagal: (e: unknown) => string,
  ) => {
    setGalat(null);
    setMemuat(tombol);
    try {
      const baru = await login();
      if (baru) masuk(baru); // re-renders into the <Redirect> below
    } catch (e) {
      // Network problems keep their own message.
      setGalat(e instanceof ApiError && e.status === 0 ? e.pesan : pesanGagal(e));
    } finally {
      setMemuat(null);
    }
  };

  // LoginView.isiLoginPage -> AuthController.kirimData (POST /api/auth/google).
  const masukGoogle = () =>
    coba('google', masukDenganGoogle, () => 'Masuk dengan Google gagal. Silakan coba lagi.');

  // POST /api/auth/demo; the backend must run with MODE_DEMO=1 and a seeded database.
  const masukSebagai = (peran: Peran) =>
    coba(peran, () => masukDemo(peran), (e) =>
      `Login demo gagal${e instanceof ApiError ? `: ${e.pesan}` : '.'} Pastikan backend berjalan dengan MODE_DEMO=1.`,
    );

  // Already signed in (restored at start or just logged in): go to I-02 or I-03.
  if (pengguna) return <Redirect href={beranda(pengguna.peran)} />;

  return (
    <View style={[styles.layar, { paddingTop: top + jarak.md, paddingBottom: bottom + jarak.md }]}>
      <View style={styles.tengah}>
        <View style={styles.bingkaiLogo}>
          <Image
            source={require('../../assets/sehati-logo.png')}
            style={styles.logo}
            accessibilityRole="image"
            accessibilityLabel="Logo Sehati"
          />
        </View>
        <Teks gaya="h1" accessibilityRole="header">
          Sehati
        </Teks>
        <Teks warna="teksSekunder" style={styles.rataTengah}>
          Teman sehat mental dan kesejahteraan mahasiswa
        </Teks>
      </View>

      <View style={styles.bawah}>
        {galat && <Banner jenis="galat">{galat}</Banner>}
        <Tombol judul="Masuk dengan Google" varian="google" onPress={masukGoogle} memuat={memuat === 'google'} disabled={memuat !== null} />
        <Teks gaya="keterangan" style={styles.rataTengah}>
          Gunakan akun Google kampus (std.stei.itb.ac.id atau mahasiswa.itb.ac.id). Akun dibuat otomatis saat
          pertama kali masuk.
        </Teks>

        {MODE_DEMO && (
          <View style={styles.demo}>
            <Teks gaya="label" warna="teksSekunder" style={styles.rataTengah}>
              Mode demo
            </Teks>
            <View style={styles.barisDemo}>
              <Tombol
                judul="Mahasiswa"
                varian="sekunder"
                onPress={() => masukSebagai('mahasiswa')}
                memuat={memuat === 'mahasiswa'}
                disabled={memuat !== null}
                style={styles.tombolDemo}
              />
              <Tombol
                judul="Administrator"
                varian="sekunder"
                onPress={() => masukSebagai('administrator')}
                memuat={memuat === 'administrator'}
                disabled={memuat !== null}
                style={styles.tombolDemo}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const UKURAN_LOGO = 150;

const styles = StyleSheet.create({
  layar: { flex: 1, paddingHorizontal: jarak.lg, backgroundColor: warna.latar },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: jarak.xs },
  bingkaiLogo: {
    width: UKURAN_LOGO,
    height: UKURAN_LOGO,
    marginBottom: jarak.sm,
    overflow: 'hidden',
    backgroundColor: warna.kartu,
    borderRadius: sudut.lg * 2,
    borderCurve: 'continuous',
  },
  logo: { width: '100%', height: '100%' },
  rataTengah: { textAlign: 'center' },
  bawah: { gap: jarak.sm },
  demo: {
    gap: jarak.xs,
    marginTop: jarak.xs,
    paddingTop: jarak.sm,
    borderTopColor: warna.garis,
    borderTopWidth: ukuran.garis,
  },
  barisDemo: { flexDirection: 'row', gap: jarak.sm },
  tombolDemo: { flex: 1 },
});
