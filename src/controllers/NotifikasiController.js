// C19 NotifikasiController - milik modul D.
const config = require('../config/env');
const SurelAdapter = require('../integrasi/SurelAdapter');

class NotifikasiController {
  // KF06
  static async kirimEmailVerifikasi(email, kode) {
    const isi = [
      'Halo,',
      '',
      `Kode verifikasi akun ITBELI Anda: ${kode}`,
      `Kode berlaku selama ${config.durasiKodeMenit} menit.`,
      '',
      'Jangan bagikan kode ini kepada siapa pun. Abaikan surel ini bila Anda tidak mendaftar di ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Kode Verifikasi ITBELI', isi);
  }

  // KF52: Menyusun surel pemberitahuan penghapusan listing yang melanggar aturan beserta alasannya dan mengirimkannya ke pemilik listing
  static async kirimPeringatanPenghapusan(idPemilik, email, judulBarang, alasan) {
    const isi = [
      'Halo,',
      '',
      `Listing barang Anda "${judulBarang || 'Tanpa Judul'}" telah dihapus oleh Tim Moderasi ITBELI karena terbukti melanggar ketentuan layanan.`,
      '',
      'Alasan penghapusan:',
      `${alasan}`,
      '',
      'Apabila Anda merasa ada kekeliruan atau ingin mengajukan banding, silakan hubungi tim bantuan ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Peringatan Penghapusan Listing ITBELI', isi);
  }

  // KF52: Menyusun surel pemberitahuan penangguhan/pemblokiran akun beserta rincian pelanggaran dan mengirimkannya ke alamat surel terdaftar pengguna
  static async kirimPesanPenangguhan(idAkun, email, alasan) {
    const isi = [
      'Halo,',
      '',
      'Akun ITBELI Anda telah ditangguhkan (diblokir) oleh Tim Moderasi karena pelanggaran ketentuan layanan.',
      '',
      'Alasan penangguhan:',
      `${alasan}`,
      '',
      'Seluruh listing aktif Anda telah dinonaktifkan dan sesi login Anda telah diakhiri. Jika Anda merasa ini merupakan kekeliruan, silakan hubungi tim bantuan ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Pemberitahuan Penangguhan Akun ITBELI', isi);
  }
}

module.exports = NotifikasiController;
