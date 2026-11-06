/**
 * I-03 Detail Laporan — UC04, UC05. Pemilik: P3.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, I-03). Tugas: src/docs/tasks/P3.md
 * Ganti seluruh isi komponen ini; route di src/app/ cukup me-re-export dan tidak perlu diubah.
 */
import { LayarBelumJadi } from '../../components/ui';

export default function DetailLaporanScreen() {
  return (
    <LayarBelumJadi
      idLayar="I-03"
      judul="Detail Laporan"
      pemilik="P3"
      useCase="UC04, UC05"
      tugas={[
        'Header: kode, status, kategori, tanggal',
        'Foto, lokasi + PetaTampil, deskripsi',
        'Riwayat penanganan HANYA untuk mode saya',
        'Mode saya + status Perlu Revisi: tombol Revisi -> /warga/revisi/[id]',
      ]}
    />
  );
}
