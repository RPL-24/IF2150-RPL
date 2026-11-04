// C13 AkunController
const config = require('../config/env');
const Akun = require('../models/Akun');
const SesiLogin = require('../models/SesiLogin');
const Kriptografi = require('../pendukung/Kriptografi');
const Otorisasi = require('../pendukung/Otorisasi');

const PESAN_LOGIN = Object.freeze({
  ISIAN_KOSONG: 'Surel dan kata sandi wajib diisi.',
  KREDENSIAL_SALAH: 'Surel atau kata sandi salah.',
  BELUM_TERVERIFIKASI: 'Akun belum terverifikasi. Masukkan kode verifikasi yang dikirim ke surel Anda.',
  AKUN_DIBLOKIR: 'Akun Anda ditangguhkan oleh admin karena melanggar ketentuan penggunaan.',
});

function gagalLogin(kodePesan) {
  return { berhasil: false, kodePesan, pesan: PESAN_LOGIN[kodePesan] };
}

class AkunController {
  // Algo-006 (KF03, KF08, KF10, KF11, KF53)
  static async login(email, kataSandi) {
    if (typeof email !== 'string' || typeof kataSandi !== 'string' || !email.trim() || !kataSandi) {
      return gagalLogin('ISIAN_KOSONG');
    }

    const akun = await AkunController.cariAkunByEmail(email);
    if (akun === null) return gagalLogin('KREDENSIAL_SALAH');

    if (!(await AkunController.verifikasiKataSandi(kataSandi, akun.kataSandiHash))) {
      return gagalLogin('KREDENSIAL_SALAH');
    }

    const status = await AkunController.cekStatusAkun(akun.idAkun);
    if (status === Akun.STATUS.BELUM_TERVERIFIKASI) return gagalLogin('BELUM_TERVERIFIKASI');
    if (status === Akun.STATUS.DIBLOKIR) return gagalLogin('AKUN_DIBLOKIR');

    const sesi = await AkunController.buatSesiLogin(akun.idAkun);
    return { berhasil: true, token: sesi.token, peran: akun.peran };
  }

  static async cariAkunByEmail(email) {
    return Akun.cariByEmail(email);
  }

  // KF10
  static async verifikasiKataSandi(kataSandi, kataSandiHash) {
    return Kriptografi.cocokkanHash(kataSandi, kataSandiHash);
  }

  static async cekStatusAkun(idAkun) {
    const akun = await Akun.cariById(idAkun);
    return akun === null ? null : akun.getStatusAkun();
  }

  // KF11: sesi berlaku paling lama DURASI_SESI_JAM (bawaan 24 jam)
  static async buatSesiLogin(idAkun) {
    const token = SesiLogin.buatToken(idAkun);
    const waktuMulai = new Date();
    const waktuKedaluwarsa = new Date(waktuMulai.getTime() + config.durasiSesiJam * 60 * 60 * 1000);
    await SesiLogin.simpan(idAkun, token, waktuMulai, waktuKedaluwarsa);
    return new SesiLogin({ idAkun, token, waktuMulai, waktuKedaluwarsa, statusAktif: true });
  }

  // KF12
  static async logout(token) {
    if ((await Otorisasi.verifikasiToken(token)) === null) return false;
    await AkunController.cabutSesi(token);
    return true;
  }

  static async cabutSesi(token) {
    await SesiLogin.nonaktifkan(token);
  }

  static async getIdAkunDariSesi(token) {
    const sesi = await Otorisasi.verifikasiToken(token);
    return sesi === null ? null : sesi.getIdAkun();
  }
}

module.exports = AkunController;
