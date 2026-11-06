/**
 * I-05 Dashboard Admin — UC02, UC06. Pemilik: P4.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-05). Tugas: src/docs/tasks/P4.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function DashboardAdminScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-05"
      judul="Dashboard Admin"
      pemilik="P4"
      useCase="UC02, UC06"
      tugas={[
        'Daftar laporan Menunggu Verifikasi + pencarian',
        'Badge jumlah laporan baru',
        'Section FasilitasBerulangPreview (komponen P5)',
        'Ketuk kartu -> /admin/verifikasi/[id]',
      ]}
    />
  );
}
