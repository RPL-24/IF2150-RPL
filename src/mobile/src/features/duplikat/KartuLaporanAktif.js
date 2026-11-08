/**
 * Kartu laporan aktif untuk I-07 (O-0701 info laporan, O-0702 foto). Pemilik: P1.
 */
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { urlLengkap } from '../../api/client';
import { Kartu, LencanaStatus } from '../../components/ui';
import { huruf, jarak, radius, warna } from '../../theme/tokens';
import { judulLaporan, kodeLaporan, waktuRelatif } from '../../utils/format';

export default function KartuLaporanAktif({ laporan, modePilih, dipilih, onTekan }) {
  const { lokasi } = laporan;
  return (
    <Kartu onPress={modePilih ? onTekan : undefined} style={[s.kartu, dipilih && s.kartuDipilih]}>
      <View style={s.baris}>
        <Image source={{ uri: urlLengkap(laporan.foto) }} style={s.foto} accessibilityLabel="Foto kerusakan" />
        <View style={s.isi}>
          <Text style={huruf.label}>{kodeLaporan(laporan.id)} · {laporan.kategori}</Text>
          <Text style={s.judul} numberOfLines={2}>
            {judulLaporan({ kategori: laporan.kategori, alamat: lokasi?.alamat, wilayah: lokasi?.wilayah })}
          </Text>
          <View style={s.barisKecil}>
            <Ionicons name="location-outline" size={14} color={warna.teksLembut} />
            <Text style={huruf.kecil} numberOfLines={1}> {lokasi?.wilayah ?? '-'}</Text>
          </View>
          <Text style={huruf.kecil}>
            Dilaporkan {waktuRelatif(laporan.tanggalLaporan)} oleh {laporan.pelapor?.nama ?? '-'}
          </Text>
          <View style={{ marginTop: jarak.s }}>
            <LencanaStatus status={laporan.status} />
          </View>
        </View>
        {modePilih ? (
          <Ionicons
            name={dipilih ? 'checkbox' : 'square-outline'}
            size={28}
            color={dipilih ? warna.primer : warna.teksLembut}
            accessibilityLabel={dipilih ? 'Dipilih' : 'Belum dipilih'}
          />
        ) : null}
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  kartu: { borderWidth: 2, borderColor: 'transparent' },
  kartuDipilih: { borderColor: warna.primer, backgroundColor: warna.primerMuda },
  baris: { flexDirection: 'row', alignItems: 'flex-start', gap: jarak.m },
  foto: { width: 84, height: 96, borderRadius: radius.s, backgroundColor: warna.permukaanLembut },
  isi: { flex: 1 },
  judul: { ...huruf.isi, fontWeight: '700', marginVertical: 2 },
  barisKecil: { flexDirection: 'row', alignItems: 'center' },
});
