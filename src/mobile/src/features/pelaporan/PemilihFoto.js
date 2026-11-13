/**
 * I-04 O-0401 Upload foto: tombol Ambil Foto (kamera) dan Pilih Galeri + pratinjau. Pemilik: P2.
 */
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { beritahu } from '../../components/dialog/konfirmasi';
import { Tombol } from '../../components/ui';
import { huruf, jarak, radius, warna } from '../../theme/tokens';

const OPSI = { mediaTypes: ['images'], quality: 0.6 };

/**
 * @param {{ foto: { uri: string } | null, onUbah: (asset: { uri: string, mimeType?: string, fileName?: string }) => void,
 *           nonaktif?: boolean }} props
 */
export default function PemilihFoto({ foto, onUbah, nonaktif }) {
  const [memuat, setMemuat] = useState(null); // 'kamera' | 'galeri' | null

  async function pilih(sumber) {
    setMemuat(sumber);
    try {
      let hasil;
      if (sumber === 'kamera') {
        const izin = await ImagePicker.requestCameraPermissionsAsync();
        if (!izin.granted) {
          beritahu('Izin kamera ditolak', 'Izinkan akses kamera di pengaturan, atau pilih foto dari galeri.');
          return;
        }
        hasil = await ImagePicker.launchCameraAsync(OPSI);
      } else {
        hasil = await ImagePicker.launchImageLibraryAsync(OPSI);
      }
      if (!hasil.canceled && hasil.assets?.[0]) onUbah(hasil.assets[0]);
    } catch {
      beritahu('Foto gagal diambil', 'Coba lagi atau pilih foto dari galeri.');
    } finally {
      setMemuat(null);
    }
  }

  return (
    <View>
      {foto ? (
        <Image source={{ uri: foto.uri }} style={s.pratinjau} resizeMode="cover" accessibilityLabel="Pratinjau foto kerusakan" />
      ) : (
        <View style={[s.pratinjau, s.kosong]}>
          <Ionicons name="camera-outline" size={36} color={warna.teksLembut} />
          <Text style={[huruf.kecil, { marginTop: jarak.xs }]}>Belum ada foto kerusakan</Text>
        </View>
      )}
      <View style={s.baris}>
        <Tombol
          judul="Ambil Foto"
          ikon="camera"
          varian="sekunder"
          style={s.tombol}
          memuat={memuat === 'kamera'}
          nonaktif={nonaktif || memuat !== null}
          onPress={() => pilih('kamera')}
        />
        <Tombol
          judul="Pilih Galeri"
          ikon="images"
          varian="sekunder"
          style={s.tombol}
          memuat={memuat === 'galeri'}
          nonaktif={nonaktif || memuat !== null}
          onPress={() => pilih('galeri')}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  pratinjau: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.m, backgroundColor: warna.permukaanLembut },
  kosong: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: warna.garis, borderStyle: 'dashed' },
  baris: { flexDirection: 'row', gap: jarak.s, marginTop: jarak.m },
  tombol: { flex: 1 },
});
