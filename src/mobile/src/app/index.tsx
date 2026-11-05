import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Teks, Tombol } from '@/components';
import { jarak } from '@/theme';

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
      <Tombol judul="Masuk sebagai Mahasiswa" onPress={() => router.replace('/beranda')} style={styles.tombol} />
      <Tombol
        judul="Masuk sebagai Administrator"
        varian="sekunder"
        onPress={() => router.replace('/admin')}
        style={styles.tombol}
      />
      <Tombol judul="Lihat komponen" varian="teks" onPress={() => router.push('/komponen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: jarak.sm, padding: jarak.xl },
  ket: { marginBottom: jarak.sm },
  tombol: { alignSelf: 'stretch' },
});
