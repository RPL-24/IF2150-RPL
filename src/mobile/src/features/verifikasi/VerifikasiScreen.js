/**
 * I-06 Verifikasi Laporan — UC02. Pemilik: P4.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-06). Tugas: src/docs/tasks/P4.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function VerifikasiScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-06"
      judul="Verifikasi Laporan"
      pemilik="P4"
      useCase="UC02"
      tugas={[
        'Detail laporan (boleh tampil nama pelapor untuk admin)',
        'Pratinjau skor read-only (gap G3)',
        'Tombol Setujui, Tolak, Minta Revisi + catatan alasan',
        'Catatan wajib untuk Tolak/Revisi',
      ]}
    />
  );
}
