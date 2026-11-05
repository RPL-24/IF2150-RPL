import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Teks } from '@/components/Teks';
import { jarak, sudut, ukuran, warna } from '@/theme';

/**
 * Temporary entry point so both navigators can be reached during development.
 * Replaced by I-01 Masuk (LoginView) in issue #3, which routes by `peran`.
 */
export default function Masuk() {
  const router = useRouter();
  return (
    <View style={styles.wadah}>
      <Teks gaya="h1">Sehati</Teks>
      <Teks gaya="keterangan" style={styles.ket}>
        Layar masuk sementara (issue #3)
      </Teks>
      <Pressable style={styles.tombol} onPress={() => router.replace('/beranda')}>
        <Teks gaya="label" warna="inversi">
          Masuk sebagai Mahasiswa
        </Teks>
      </Pressable>
      <Pressable style={styles.tombol} onPress={() => router.replace('/admin')}>
        <Teks gaya="label" warna="inversi">
          Masuk sebagai Administrator
        </Teks>
      </Pressable>
    </View>
  );
}

// The buttons become Tombol in the components checkbox.
const styles = StyleSheet.create({
  wadah: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: jarak.sm, padding: jarak.xl },
  ket: { marginBottom: jarak.sm },
  tombol: {
    alignSelf: 'stretch',
    height: ukuran.tinggiKontrol,
    backgroundColor: warna.merah,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
