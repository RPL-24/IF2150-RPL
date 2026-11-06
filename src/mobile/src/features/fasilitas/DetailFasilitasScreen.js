/**
 * I-10 Detail Fasilitas — UC06, UC08. Pemilik: P5.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-10). Tugas: src/docs/tasks/P5.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function DetailFasilitasScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-10"
      judul="Detail Fasilitas"
      pemilik="P5"
      useCase="UC06, UC08"
      tugas={[
        'Detail fasilitas + jumlah kerusakan berulang',
        'Daftar laporan yang menunjuk fasilitas',
        'Riwayat status gabungan (tanpa identitas pelapor)',
        'Pemda: Perbarui status laporan (Diproses/Selesai)',
      ]}
    />
  );
}
