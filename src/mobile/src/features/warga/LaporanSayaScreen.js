/**
 * UC05 Laporan Saya — UC05. Pemilik: P3.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, UC05). Tugas: src/docs/tasks/P3.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function LaporanSayaScreen() {
  return (
    <LayarBelumJadi
      idLayar="UC05"
      judul="Laporan Saya"
      pemilik="P3"
      useCase="UC05"
      tugas={[
        'Daftar laporan milik pelapor (GET /laporan/saya)',
        'Kosong: Belum ada laporan',
        'Ketuk kartu -> /warga/laporan/[id]?mode=saya',
      ]}
    />
  );
}
