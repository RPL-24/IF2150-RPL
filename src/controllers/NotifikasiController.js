// C19 NotifikasiController – milik modul D.
// Sementara baru berisi kirimEmailVerifikasi yang dibutuhkan modul A.
// TODO(modul-D): kirimNotifikasi, kirimPushNotifikasi, kirimPeringatanPenghapusan, kirimPesanPenangguhan
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
}

module.exports = NotifikasiController;
