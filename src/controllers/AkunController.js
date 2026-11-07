// C13 AkunController
const crypto = require('crypto');
const config = require('../config/env');
const Akun = require('../models/Akun');
const Barang = require('../models/Barang');
const DokumenLegal = require('../models/DokumenLegal');
const SesiLogin = require('../models/SesiLogin');
const TokenVerifikasi = require('../models/TokenVerifikasi');
const Kriptografi = require('../pendukung/Kriptografi');
const Otorisasi = require('../pendukung/Otorisasi');
const NotifikasiController = require('./NotifikasiController');

const DOMAIN_SUREL = /^[^\s@]+@itb\.ac\.id$/i;
const FORMAT_NIM = /^\d{1,20}$/;
// Mengikuti petunjuk I-02: minimal 8 karakter, memuat huruf dan angka.
const KATA_SANDI_KUAT = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const PESAN = Object.freeze({
  ISIAN_KOSONG: 'Surel dan kata sandi wajib diisi.',
  KREDENSIAL_SALAH: 'Surel atau kata sandi salah.',
  BELUM_TERVERIFIKASI: 'Akun belum terverifikasi. Masukkan kode verifikasi yang dikirim ke surel Anda.',
  AKUN_DIBLOKIR: 'Akun Anda ditangguhkan oleh admin karena melanggar ketentuan penggunaan.',

  FORMULIR_TIDAK_LENGKAP: 'Lengkapi nama, NIM, surel, dan kata sandi.',
  KEBIJAKAN_BELUM_DISETUJUI: 'Anda harus menyetujui Kebijakan Privasi dan Ketentuan Penggunaan.',
  DOMAIN_TIDAK_VALID: 'Gunakan surel berdomain @itb.ac.id.',
  NIM_TIDAK_VALID: 'NIM hanya boleh berisi angka.',
  KATA_SANDI_LEMAH: 'Kata sandi minimal 8 karakter dan memuat huruf serta angka.',
  SUREL_TERDAFTAR: 'Surel sudah terdaftar. Silakan masuk atau gunakan surel lain.',

  KODE_KOSONG: 'Masukkan 6 digit kode verifikasi.',
  AKUN_TIDAK_DITEMUKAN: 'Akun dengan surel tersebut tidak ditemukan.',
  SUDAH_TERVERIFIKASI: 'Akun sudah terverifikasi. Silakan masuk.',
  KODE_TIDAK_ADA: 'Tidak ada kode verifikasi yang aktif. Minta kode baru.',
  KODE_SALAH: 'Kode verifikasi salah.',
  KODE_KEDALUWARSA: 'Kode verifikasi sudah kedaluwarsa. Minta kode baru.',
  GAGAL_KIRIM_SUREL: 'Kode verifikasi gagal dikirim. Coba kirim ulang beberapa saat lagi.',
});

function gagal(kodePesan) {
  return { berhasil: false, kodePesan, pesan: PESAN[kodePesan] };
}

function teksTerisi(nilai) {
  return typeof nilai === 'string' && nilai.trim() !== '';
}

class AkunController {
  // ───────────── UC01 Mendaftar Akun ─────────────

  // Algo-002 (KF02, KF05, KF06, KF09, KF14)
  static async daftarAkun(nama, nim, email, kataSandi, setujuKebijakan) {
    if (setujuKebijakan !== true) return gagal('KEBIJAKAN_BELUM_DISETUJUI');
    if (!AkunController.validasiKelengkapanFormulir(nama, nim, email, kataSandi, setujuKebijakan)) {
      return gagal('FORMULIR_TIDAK_LENGKAP');
    }
    if (!AkunController.validasiDomainEmail(email)) return gagal('DOMAIN_TIDAK_VALID');
    if (!FORMAT_NIM.test(nim.trim())) return gagal('NIM_TIDAK_VALID');
    if (!KATA_SANDI_KUAT.test(kataSandi)) return gagal('KATA_SANDI_LEMAH');
    if (!(await AkunController.cekKeunikanEmail(email))) return gagal('SUREL_TERDAFTAR');

    const kataSandiHash = await AkunController.hashKataSandi(kataSandi);
    let idAkun;
    try {
      idAkun = await Akun.simpan(nama.trim(), nim.trim(), email, kataSandiHash, Akun.STATUS.BELUM_TERVERIFIKASI, true);
    } catch (galat) {
      // Dua pendaftaran dengan surel yang sama pada saat bersamaan (indeks unik akun_email_unik)
      if (galat.code === '23505') return gagal('SUREL_TERDAFTAR');
      throw galat;
    }

    const kode = await AkunController.buatKodeVerifikasi(idAkun);
    const surelTerkirim = await NotifikasiController.kirimEmailVerifikasi(email.trim(), kode);
    // Akun tetap dibuat walaupun surel gagal terkirim; pengguna dapat meminta kirim ulang di I-03.
    return { berhasil: true, email: email.trim().toLowerCase(), surelTerkirim };
  }

  // KF14
  static validasiKelengkapanFormulir(nama, nim, email, kataSandi, setujuKebijakan) {
    return [nama, nim, email, kataSandi].every(teksTerisi) && setujuKebijakan === true;
  }

  // KF05
  static validasiDomainEmail(email) {
    return typeof email === 'string' && DOMAIN_SUREL.test(email.trim());
  }

  // KF05
  static async cekKeunikanEmail(email) {
    return (await Akun.cariByEmail(email)) === null;
  }

  // KF09
  static async hashKataSandi(kataSandi) {
    return Kriptografi.hash(kataSandi);
  }

  // Algo-003: kode 6 digit berlaku DURASI_KODE_MENIT (bawaan 15 menit) (KF06)
  static async buatKodeVerifikasi(idAkun) {
    const kode = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    const waktuBuat = new Date();
    const waktuKedaluwarsa = new Date(waktuBuat.getTime() + config.durasiKodeMenit * 60 * 1000);
    await TokenVerifikasi.simpan(idAkun, kode, waktuBuat, waktuKedaluwarsa, TokenVerifikasi.STATUS_PAKAI.AKTIF);
    return kode;
  }

  // KF13: tautan Kebijakan Privasi yang berlaku untuk formulir pendaftaran (I02-O06)
  static async getTautanDokumenLegal() {
    const kebijakan = await DokumenLegal.getVersiTerbaru(DokumenLegal.JENIS.KEBIJAKAN_PRIVASI);
    return kebijakan === null ? null : kebijakan.getTautan();
  }

  // ───────────── UC02 Memverifikasi Surel ─────────────

  // Algo-004 (KF07)
  static async verifikasiAkun(email, kode) {
    if (!teksTerisi(email) || !teksTerisi(kode)) return gagal('KODE_KOSONG');

    const akun = await Akun.cariByEmail(email);
    if (akun === null) return gagal('AKUN_TIDAK_DITEMUKAN');
    if (akun.getStatusAkun() === Akun.STATUS.TERVERIFIKASI) return gagal('SUDAH_TERVERIFIKASI');
    if (akun.getStatusAkun() === Akun.STATUS.DIBLOKIR) return gagal('AKUN_DIBLOKIR');

    const tokenVerifikasi = await TokenVerifikasi.cariTokenAktif(akun.idAkun);
    if (tokenVerifikasi === null) return gagal('KODE_TIDAK_ADA');
    if (!AkunController.validasiKodeVerifikasi(kode, tokenVerifikasi)) return gagal('KODE_SALAH');
    if (AkunController.cekKedaluwarsaKode(tokenVerifikasi)) return gagal('KODE_KEDALUWARSA');

    await tokenVerifikasi.tandaiTerpakai();
    await akun.perbaruiStatusAkun(Akun.STATUS.TERVERIFIKASI);
    return { berhasil: true, idAkun: akun.idAkun, peran: akun.peran };
  }

  static validasiKodeVerifikasi(kode, tokenVerifikasi) {
    return tokenVerifikasi.cocokkanKode(kode);
  }

  static cekKedaluwarsaKode(tokenVerifikasi) {
    return tokenVerifikasi.sudahKedaluwarsa();
  }

  static async hanguskanKodeLama(idAkun) {
    let tokenAktif;
    while ((tokenAktif = await TokenVerifikasi.cariTokenAktif(idAkun)) !== null) {
      await tokenAktif.tandaiHangus();
    }
  }

  // Algo-005 (KF08)
  static async kirimUlangKode(email) {
    if (!teksTerisi(email)) return gagal('AKUN_TIDAK_DITEMUKAN');

    const akun = await Akun.cariByEmail(email);
    if (akun === null) return gagal('AKUN_TIDAK_DITEMUKAN');
    if (akun.getStatusAkun() === Akun.STATUS.TERVERIFIKASI) return gagal('SUDAH_TERVERIFIKASI');
    if (akun.getStatusAkun() === Akun.STATUS.DIBLOKIR) return gagal('AKUN_DIBLOKIR');

    await AkunController.hanguskanKodeLama(akun.idAkun);
    const kodeBaru = await AkunController.buatKodeVerifikasi(akun.idAkun);
    if (!(await NotifikasiController.kirimEmailVerifikasi(akun.email, kodeBaru))) {
      return gagal('GAGAL_KIRIM_SUREL');
    }
    return { berhasil: true };
  }

  // ───────────── UC03 Login, UC04 Logout ─────────────

  // Algo-006 (KF03, KF08, KF10, KF11, KF53)
  static async login(email, kataSandi) {
    if (!teksTerisi(email) || typeof kataSandi !== 'string' || !kataSandi) return gagal('ISIAN_KOSONG');

    const akun = await AkunController.cariAkunByEmail(email);
    if (akun === null) return gagal('KREDENSIAL_SALAH');

    if (!(await AkunController.verifikasiKataSandi(kataSandi, akun.kataSandiHash))) {
      return gagal('KREDENSIAL_SALAH');
    }

    const status = await AkunController.cekStatusAkun(akun.idAkun);
    if (status === Akun.STATUS.BELUM_TERVERIFIKASI) return gagal('BELUM_TERVERIFIKASI');
    if (status === Akun.STATUS.DIBLOKIR) return gagal('AKUN_DIBLOKIR');

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

  // ───────────── UC05 Melihat Profil Akun ─────────────

  // KF04: identitas dan daftar listing akun yang sedang masuk; null bila sesi tidak valid
  static async getProfil(token) {
    const idAkun = await AkunController.getIdAkunDariSesi(token);
    if (idAkun === null) return null;

    const akun = await Akun.cariById(idAkun);
    if (akun === null) return null;

    return {
      ...akun.getDataIdentitas(),
      statusAkun: akun.getStatusAkun(),
      statusBlokir: akun.statusBlokir,
      peran: akun.peran,
      daftarBarang: await AkunController.getDaftarBarangAkun(idAkun),
    };
  }

  static async getDaftarBarangAkun(idAkun) {
    return Barang.getListingPenjual(idAkun);
  }
}

module.exports = AkunController;
