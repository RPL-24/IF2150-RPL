import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Temporary entry point so both navigators can be reached during development.
 * Replaced by I-01 Masuk (LoginView) in issue #3, which routes by `peran`.
 */
export default function Masuk() {
  const router = useRouter();
  return (
    <View style={styles.wadah}>
      <Text style={styles.judul}>Sehati</Text>
      <Text style={styles.ket}>Layar masuk sementara (issue #3)</Text>
      <Pressable style={styles.tombol} onPress={() => router.replace('/beranda')}>
        <Text style={styles.label}>Masuk sebagai Mahasiswa</Text>
      </Pressable>
      <Pressable style={styles.tombol} onPress={() => router.replace('/admin')}>
        <Text style={styles.label}>Masuk sebagai Administrator</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  judul: { fontSize: 26, fontWeight: '800' },
  ket: { fontSize: 13, color: '#6B6B73', marginBottom: 12 },
  tombol: { alignSelf: 'stretch', backgroundColor: '#E10A1E', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  label: { color: '#FFFFFF', fontWeight: '600' },
});
