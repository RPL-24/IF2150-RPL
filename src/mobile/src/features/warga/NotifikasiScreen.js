/**
 * O-0201 Notifikasi — UC02 (penerima). Pemilik: P3.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, O-0201). Tugas: src/docs/tasks/P3.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function NotifikasiScreen() {
  return (
    <LayarBelumJadi
      idLayar="O-0201"
      judul="Notifikasi"
      pemilik="P3"
      useCase="UC02 (penerima)"
      tugas={[
        'Daftar notifikasi hasil verifikasi + alasan',
        'Tandai dibaca saat dibuka',
        'Ketuk -> detail laporan saya',
      ]}
    />
  );
}
