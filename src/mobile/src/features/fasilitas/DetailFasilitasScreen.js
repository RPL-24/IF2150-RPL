import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { pemdaApi } from '../../api/pemda';
import { STATUS, PESAN } from '@silembur/shared';

export default function DetailFasilitasScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const muatDetail = async () => {
    try {
      const res = await pemdaApi.detailFasilitas(id);
      setData(res);
    } catch (err) {
      Alert.alert('Gagal', PESAN.MUAT_ULANG || 'Gagal memuat detail fasilitas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    muatDetail();
  }, [id]);

  const handleUbahStatus = async (idLaporan, statusBaru) => {
    try {
      await pemdaApi.ubahStatus(idLaporan, { status: statusBaru, keterangan: `Diperbarui dari detail fasilitas` });
      Alert.alert('Sukses', `Status laporan berhasil menjadi ${statusBaru}`);
      muatDetail();
    } catch (err) {
      Alert.alert('Gagal', err.message || 'Gagal mengubah status');
    }
  };

  if (loading) return <ActivityIndicator color="#0066CC" style={{ marginTop: 20 }} />;
  if (!data || !data.fasilitas) return <Text style={styles.errorText}>{PESAN.FASILITAS_TIDAK_DITEMUKAN}</Text>;

  const renderLaporan = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.kategoriText}>{item.kategori}</Text>
      <Text style={styles.deskripsi}>{item.deskripsi}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      
      {/* Tombol aksi pemda untuk merubah status laporan dari detail fasilitas */}
      <View style={styles.aksiContainer}>
        {item.status === STATUS.TERVERIFIKASI && (
          <TouchableOpacity style={[styles.btn, styles.btnProses]} onPress={() => handleUbahStatus(item.id, STATUS.DIPROSES)}>
            <Text style={styles.btnText}>Proses</Text>
          </TouchableOpacity>
        )}
        {item.status === STATUS.DIPROSES && (
          <TouchableOpacity style={[styles.btn, styles.btnSelesai]} onPress={() => handleUbahStatus(item.id, STATUS.SELESAI)}>
            <Text style={styles.btnText}>Selesai</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderRiwayat = ({ item }) => (
    <View style={styles.riwayatCard}>
      <Text style={styles.riwayatTanggal}>{new Date(item.tanggal).toLocaleString()}</Text>
      <Text style={styles.riwayatStatus}>
        {item.statusLama ? `${item.statusLama} ➔ ` : ''}{item.statusBaru}
      </Text>
      <Text style={styles.riwayatDeskripsi}>{item.deskripsi}</Text>
    </View>
  );

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <Text style={styles.title}>{data.fasilitas.nama}</Text>
            <Text style={styles.sub}>{data.fasilitas.lokasi} - {data.fasilitas.wilayah}</Text>
            {data.fasilitas.kandidatEvaluasi && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Kerusakan Berulang: {data.fasilitas.jumlahKerusakanBerulang} kali</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Daftar Laporan ({data.laporan?.length || 0})</Text>
          {data.laporan?.map(lap => <React.Fragment key={`lap-${lap.id}`}>{renderLaporan({item: lap})}</React.Fragment>)}

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Riwayat Status Gabungan</Text>
          {data.riwayat?.length === 0 && <Text style={styles.emptyText}>Belum ada riwayat</Text>}
          {data.riwayat?.map(riw => <React.Fragment key={`riw-${riw.id}`}>{renderRiwayat({item: riw})}</React.Fragment>)}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F5F5' },
  headerCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  sub: { fontSize: 13, color: '#666', marginTop: 4 },
  badge: { marginTop: 8, backgroundColor: '#FFE5E5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 12, color: '#D32F2F', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  kategoriText: { fontWeight: 'bold', color: '#0066CC', marginBottom: 4 },
  deskripsi: { fontSize: 13, color: '#444', marginBottom: 6 },
  status: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  riwayatCard: { backgroundColor: '#FFF', padding: 10, borderRadius: 4, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#0066CC' },
  riwayatTanggal: { fontSize: 10, color: '#888' },
  riwayatStatus: { fontSize: 12, fontWeight: 'bold', marginTop: 2, color: '#222' },
  riwayatDeskripsi: { fontSize: 12, color: '#555', marginTop: 2 },
  errorText: { textAlign: 'center', marginTop: 20, color: '#D32F2F' },
  emptyText: { fontStyle: 'italic', color: '#888' },
  aksiContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginLeft: 8 },
  btnProses: { backgroundColor: '#FF9800' },
  btnSelesai: { backgroundColor: '#4CAF50' },
  btnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' }
});