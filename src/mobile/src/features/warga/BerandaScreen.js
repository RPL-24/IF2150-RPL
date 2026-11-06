/**
 * I-02 Beranda — UC04. Pemilik: P3.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-02). Tugas: src/docs/tasks/P3.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function BerandaScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-02"
      judul="Beranda"
      pemilik="P3"
      useCase="UC04"
      tugas={[
        'Kartu ringkasan masuk/diproses/selesai (GET /laporan/ringkasan)',
        'Tab filter status + filter wilayah',
        'Daftar laporan publik tanpa identitas pelapor',
        'Ikon lonceng -> /warga/notifikasi dengan jumlah belum dibaca',
        'Kosong: Belum ada laporan; gagal >5 dtk: Tolong muat ulang halaman',
      ]}
    />
  );
}
