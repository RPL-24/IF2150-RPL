/**
 * I-04 Buat Laporan — UC01. Pemilik: P2.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-04). Tugas: src/docs/tasks/P2.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function BuatLaporanScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-04"
      judul="Buat Laporan"
      pemilik="P2"
      useCase="UC01"
      tugas={[
        'Foto: Ambil Foto / Pilih Galeri (expo-image-picker)',
        'Kategori: 4 pilihan',
        'Lokasi: Gunakan Lokasi Saya (expo-location) atau geser pin (PetaPilih)',
        'Deskripsi maks 300 karakter',
        'Tombol Kirim terkunci sampai lengkap (validasiIsianFormulir)',
        'Mode revisi bila ada param id',
      ]}
    />
  );
}
