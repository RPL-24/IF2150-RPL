import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { pemdaApi } from '../../api/pemda';
import FasilitasBerulangPreview from '../fasilitas/FasilitasBerulangPreview';
import { STATUS } from '@silembur/shared';

export default function PrioritasScreen() {
  const router = useRouter();
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [wilayahFilter, setWilayahFilter] = useState('');
  const [keteranganInput, setKeteranganInput] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const muatData = async () => {
    setLoading(true);
    try {
      const res = await pemdaApi.prioritas({
        kategori: kategoriFilter || undefined,
        wilayah: wilayahFilter || undefined,
      });
      setLaporan(res.data || []);
    } catch (err) {
      Alert.alert('Gagal', 'Tolong muat ulang halaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    muatData();
  }, [kategoriFilter, wilayahFilter]);

  const handleUbahStatus = async (id, statusBaru) => {
    const ket = keteranganInput[id];
    if (!ket || ket.trim() === '') {
      Alert.alert('Peringatan', 'Keterangan penanganan wajib diisi');
      return;
    }

    setUpdatingId(id);
    try {
      await pemdaApi.ubahStatus(id, { status: statusBaru, keterangan: ket });
      Alert.alert('Sukses', `Status berhasil diperbarui menjadi ${statusBaru}`);
      setKeteranganInput((prev) => ({ ...prev, [id]: '' }));
      muatData();
    } catch (err) {
      Alert.alert('Gagal', err.message || 'Gagal mengubah status');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderHeader = () => (
    <View>
      <FasilitasBerulangPreview onLihatSemua={() => router.push('/pemda/fasilitas?berulang=true')} />
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Daftar Prioritas Laporan</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.kategoriText}>{item.kategori}</Text>
        <Text style={styles.skorText}>Skor: {item.skor?.nilai ?? 0}</Text>
      </View>

      <Text style={styles.deskripsi}>{item.deskripsi}</Text>
      <Text style={styles.lokasi}>{item.lokasi?.alamat || item.lokasi?.wilayah}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      <View style={styles.aksiContainer}>
        <TextInput
          style={styles.inputKet}
          placeholder="Tulis keterangan penanganan..."
          value={keteranganInput[item.id] || ''}
          onChangeText={(text) => setKeteranganInput({ ...keteranganInput, [item.id]: text })}
        />

        {updatingId === item.id ? (
          <ActivityIndicator color="#0066CC" />
        ) : (
          <View style={styles.buttonGroup}>
            {item.status === STATUS.TERVERIFIKASI && (
              <TouchableOpacity
                style={[styles.btn, styles.btnProses]}
                onPress={() => handleUbahStatus(item.id, STATUS.DIPROSES)}
              >
                <Text style={styles.btnText}>Mulai Tangani</Text>
              </TouchableOpacity>
            )}
            {item.status === STATUS.DIPROSES && (
              <TouchableOpacity
                style={[styles.btn, styles.btnSelesai]}
                onPress={() => handleUbahStatus(item.id, STATUS.SELESAI)}
              >
                <Text style={styles.btnText}>Tandai Selesai</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={laporan}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        !loading && <Text style={styles.emptyText}>Belum ada laporan</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F5F5', flexGrow: 1 },
  filterSection: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  card: { backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  kategoriText: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  skorText: { fontWeight: 'bold', color: '#D32F2F' },
  deskripsi: { fontSize: 13, color: '#555', marginBottom: 4 },
  lokasi: { fontSize: 12, color: '#888', marginBottom: 4 },
  status: { fontSize: 12, fontWeight: '600', color: '#0066CC', marginBottom: 8 },
  aksiContainer: { marginTop: 6, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8 },
  inputKet: { borderWidth: 1, borderColor: '#DDD', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnProses: { backgroundColor: '#FF9800' },
  btnSelesai: { backgroundColor: '#4CAF50' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});