/**
 * I-08 Laporan Terverifikasi — UC03, UC06. Pemilik: P5.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-08). Tugas: src/docs/tasks/P5.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function PrioritasScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-08"
      judul="Laporan Terverifikasi"
      pemilik="P5"
      useCase="UC03, UC06"
      tugas={[
        'Dropdown wilayah + filter kategori (GET /referensi)',
        'PetaTampil titik laporan',
        'Daftar urut skor tertinggi + aksi Diproses/Selesai',
        'Kosong: Belum ada laporan',
        'FasilitasBerulangPreview di bagian atas',
      ]}
    />
  );
}
