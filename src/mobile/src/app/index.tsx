import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Banner, Teks, Tombol } from '@/components';
import { jarak, sudut, ukuran, warna } from '@/theme';

/**
 * Demo login (issue #3): lets assistants sign in as the seeded accounts
 * without a Google account. Shown only when EXPO_PUBLIC_MODE_DEMO=1.
 */
const MODE_DEMO = process.env.EXPO_PUBLIC_MODE_DEMO === '1';

/** I-01 Masuk (`LoginView`). */
export default function Masuk() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  // I-01-06: set when Google validation fails (UC-11 alternative scenario 1).
  const [gagal] = useState(false);

  // TODO(#3): open Google authorization, send the code to POST /api/auth/google
  // (LoginView.isiLoginPage -> AuthController.kirimData), then route by `peran`.
  const masukGoogle = () => {};

  // TODO(#3): log in as the seeded account through the backend's demo mode.
  const masukDemo = (peran: 'mahasiswa' | 'administrator') =>
    router.replace(peran === 'mahasiswa' ? '/beranda' : '/admin');

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
        {gagal && <Banner jenis="galat">Masuk dengan Google gagal. Silakan coba lagi.</Banner>}
        <Tombol judul="Masuk dengan Google" varian="google" onPress={masukGoogle} />
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
                onPress={() => masukDemo('mahasiswa')}
                style={styles.tombolDemo}
              />
              <Tombol
                judul="Administrator"
                varian="sekunder"
                onPress={() => masukDemo('administrator')}
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
