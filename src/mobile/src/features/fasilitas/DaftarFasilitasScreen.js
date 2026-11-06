/**
 * I-09 Daftar Fasilitas — UC06, UC08. Pemilik: P5.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-09). Tugas: src/docs/tasks/P5.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function DaftarFasilitasScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-09"
      judul="Daftar Fasilitas"
      pemilik="P5"
      useCase="UC06, UC08"
      tugas={[
        'Pencarian keyword (cariFasilitas)',
        'Filter: semua / kerusakan berulang',
        'Tidak ditemukan: peringatan sesuai skenario UC08 alt 1',
        'Ketuk -> fasilitas/[id]',
      ]}
    />
  );
}
