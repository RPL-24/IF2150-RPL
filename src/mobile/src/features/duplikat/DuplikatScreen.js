/**
 * I-07 Gabungkan Laporan Duplikat — UC07. Pemilik: P1.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-07). Tugas: src/docs/tasks/P1.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function DuplikatScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-07"
      judul="Gabungkan Laporan Duplikat"
      pemilik="P1"
      useCase="UC07"
      tugas={[
        'Kelompok kandidat per fasilitas (GET /admin/duplikat/kandidat)',
        'Mode pilih (checkbox) setelah tekan Gabungkan Laporan',
        'Dialog peringatan Yakin/Tidak yakin (warning)',
        'Gabung -> refresh daftar; tampilkan induk + skor baru',
      ]}
    />
  );
}
