/**
 * Pratinjau fasilitas dengan kerusakan berulang untuk dashboard (UC06 langkah 1, KF14).
 * Dipasang di I-05 (Dashboard Admin, P4) dan I-08 (Prioritas, P5). Pemilik: P5.
 *
 * Kontrak props: { onLihatSemua: () => void }  -> tombol "Tampilkan lebih banyak" (UC06 langkah 2).
 * Isi: GET /fasilitas/berulang?limit=3; kosong -> PESAN.BELUM_ADA_FASILITAS_BERULANG.
 */
import { Text } from 'react-native';
import { Kartu, Tombol } from '../../components/ui';
import { huruf } from '../../theme/tokens';

export default function FasilitasBerulangPreview({ onLihatSemua }) {
  return (
    <Kartu>
      <Text style={huruf.subjudul}>Fasilitas kerusakan berulang</Text>
      <Text style={huruf.kecil}>Belum diimplementasi (P5, UC06)</Text>
      {onLihatSemua ? <Tombol judul="Tampilkan lebih banyak" varian="teks" onPress={onLihatSemua} /> : null}
    </Kartu>
  );
}
