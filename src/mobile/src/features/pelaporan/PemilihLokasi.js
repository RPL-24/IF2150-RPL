/**
 * I-04 O-0403 Peta lokasi kerusakan (KF03). Pemilik: P2.
 * - "Gunakan Lokasi Saya": GPS lewat expo-location -> sumber GPS.
 * - Izin ditolak / GPS mati / pengguna ingin mengoreksi: ketuk atau geser pin di peta -> sumber MANUAL.
 * Wilayah (kecamatan) & alamat ditentukan server dari koordinat (Algo-006).
 */
import { Ionicons } from '@expo/vector-icons';
import { SUMBER_LOKASI } from '@silembur/shared';
import * as Location from 'expo-location';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PetaPilih } from '../../components/map/Peta';
import { Tombol } from '../../components/ui';
import { huruf, jarak, radius, warna } from '../../theme/tokens';

const PESAN_MANUAL = 'Ketuk peta atau geser pin untuk menandai lokasi kerusakan.';

/**
 * @param {{ nilai: { latitude: number, longitude: number } | null, sumber: 'GPS'|'MANUAL',
 *           onUbah: (koordinat: { latitude: number, longitude: number }, sumber: 'GPS'|'MANUAL') => void,
 *           nonaktif?: boolean }} props
 */
export default function PemilihLokasi({ nilai, sumber, onUbah, nonaktif }) {
  const [mencari, setMencari] = useState(false);
  const [pesan, setPesan] = useState('');
  // PetaPilih memakai initialRegion: dipasang ulang agar peta berpindah ke titik GPS.
  const [versiPeta, setVersiPeta] = useState(0);

  async function gunakanLokasiSaya() {
    setMencari(true);
    setPesan('');
    try {
      const izin = await Location.requestForegroundPermissionsAsync();
      if (!izin.granted) {
        setPesan(`Izin lokasi ditolak. ${PESAN_MANUAL}`);
        return;
      }
      if (!(await Location.hasServicesEnabledAsync())) {
        setPesan(`GPS tidak aktif. ${PESAN_MANUAL}`);
        return;
      }
      const posisi = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      onUbah({ latitude: posisi.coords.latitude, longitude: posisi.coords.longitude }, SUMBER_LOKASI.GPS);
      setVersiPeta((v) => v + 1);
    } catch {
      setPesan(`Lokasi GPS tidak dapat dibaca. ${PESAN_MANUAL}`);
    } finally {
      setMencari(false);
    }
  }

  return (
    <View>
      <Tombol
        judul="Gunakan Lokasi Saya"
        ikon="locate"
        varian="sekunder"
        memuat={mencari}
        nonaktif={nonaktif}
        onPress={gunakanLokasiSaya}
        style={{ marginBottom: jarak.m }}
      />
      {pesan ? (
        <View style={s.peringatan}>
          <Ionicons name="alert-circle-outline" size={18} color={warna.peringatan} />
          <Text style={s.peringatanTeks}>{pesan}</Text>
        </View>
      ) : null}
      <View pointerEvents={nonaktif ? 'none' : 'auto'}>
        <PetaPilih
          key={versiPeta}
          nilai={nilai}
          onUbah={(koordinat) => onUbah(koordinat, SUMBER_LOKASI.MANUAL)}
        />
      </View>
      <Text style={[huruf.kecil, { marginTop: jarak.s }]}>
        {nilai
          ? `${nilai.latitude.toFixed(6)}, ${nilai.longitude.toFixed(6)} · ${
              sumber === SUMBER_LOKASI.GPS ? 'dari GPS' : 'dipilih di peta'
            }. Wilayah ditentukan otomatis dari titik ini.`
          : `Belum ada lokasi. Tekan "Gunakan Lokasi Saya" atau ${PESAN_MANUAL.charAt(0).toLowerCase()}${PESAN_MANUAL.slice(1)}`}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  peringatan: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: jarak.s,
    backgroundColor: warna.peringatanMuda,
    padding: jarak.m,
    borderRadius: radius.s,
    marginBottom: jarak.m,
  },
  peringatanTeks: { flex: 1, color: warna.peringatan, fontSize: 13 },
});
