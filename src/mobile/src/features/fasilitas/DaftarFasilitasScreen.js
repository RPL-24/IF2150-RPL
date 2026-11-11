import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { pemdaApi } from '../../api/pemda';

export default function DaftarFasilitasScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [hanyaBerulang, setHanyaBerulang] = useState(false);
  const [pesan, setPesan] = useState('');

  const prefixRoute = pathname.startsWith('/admin') ? '/admin' : '/pemda';

  const cari = async () => {
    setLoading(true);
    try {
      const res = await pemdaApi.daftarFasilitas({ q: keyword, berulang: hanyaBerulang ? 'true' : undefined });
      setData(res.data || []);
      setPesan(res.pesan || '');
    } catch (err) {
      setPesan('Tolong muat ulang halaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cari();
  }, [hanyaBerulang]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Cari fasilitas / wilayah..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={cari}
        />
        <TouchableOpacity style={styles.btnCari} onPress={cari}>
          <Text style={styles.btnCariText}>Cari</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterTab}>
        <TouchableOpacity
          style={[styles.tab, !hanyaBerulang && styles.tabActive]}
          onPress={() => setHanyaBerulang(false)}
        >
          <Text style={[styles.tabText, !hanyaBerulang && styles.tabTextActive]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, hanyaBerulang && styles.tabActive]}
          onPress={() => setHanyaBerulang(true)}
        >
          <Text style={[styles.tabText, hanyaBerulang && styles.tabTextActive]}>Kerusakan Berulang</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#0066CC" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>{pesan || 'Tidak ada data fasilitas'}</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`${prefixRoute}/fasilitas/${item.id}`)}
            >
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.sub}>{item.lokasi} - {item.wilayah}</Text>
              {item.kandidatEvaluasi && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Berulang: {item.jumlahKerusakanBerulang}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  searchBox: { flexDirection: 'row', marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 4, paddingHorizontal: 12, height: 40 },
  btnCari: { backgroundColor: '#0066CC', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 4, marginLeft: 8 },
  btnCariText: { color: '#FFF', fontWeight: 'bold' },
  filterTab: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#E0E0E0', borderRadius: 4, marginHorizontal: 2 },
  tabActive: { backgroundColor: '#0066CC' },
  tabText: { fontSize: 12, color: '#333' },
  tabTextActive: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8 },
  nama: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
  badge: { marginTop: 6, backgroundColor: '#FFE5E5', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, color: '#D32F2F', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});