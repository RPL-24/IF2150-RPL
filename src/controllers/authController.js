const crypto = require('crypto');
const db = require('../config/db');
const AppError = require('../utils/AppError');
const Pengguna = require('../models/Pengguna');
const Pelajar = require('../models/Pelajar');
const OrangTuaWali = require('../models/OrangTuaWali');
const TenagaKesehatan = require('../models/TenagaKesehatan');
const RiwayatKesehatan = require('../models/RiwayatKesehatan');
const { encryptAES256 } = require('../utils/encryption');
const { hariIni, hitungUsia, tanggalValid } = require('../utils/waktu');
const { kirim } = require('../utils/respon');
const { kirimEmailKonfirmasiWali } = require('../utils/mailer');

const PERAN = {
  pelajar: 'Pelajar',
  orangtuawali: 'OrangTuaWali',
  tenagakesehatan: 'TenagaKesehatan',
};

const POLA_NAMA = /^[a-zA-Z\s]+$/;
const POLA_TELEPON = /^08[0-9]{8,12}$/;
const MIN_PANJANG_SANDI = 8;
const USIA_DEWASA = 18;

function teks(nilai) {
  return String(nilai ?? '').trim();
}

/** Algo-C11-01: memeriksa kelengkapan dan format data registrasi. */
function validasiRegistrasi(body) {
  const data = {
    nama: teks(body.nama),
    email: teks(body.email).toLowerCase(),
    telepon: teks(body.telepon),
    role: teks(body.role).toLowerCase(),
    password: String(body.password ?? ''),
    konfirmasi: String(body.confirm_password ?? ''),
    tanggalLahir: teks(body.tanggal_lahir),
    riwayatKesehatan: teks(body.riwayat_kesehatan),
    emailWali: teks(body.email_orang_tua).toLowerCase(),
    jenisTenagaKesehatan: teks(body.jenis_tenaga_kesehatan),
    lokasi: teks(body.lokasi),
    nomorStr: teks(body.nomor_str),
  };

  const peran = PERAN[data.role];
  if (!peran) {
    throw new AppError(400, 'Role pengguna tidak dikenal.');
  }
  if (data.nama.length < 2) {
    throw new AppError(400, 'Nama minimal terdiri dari 2 karakter.');
  }
  if (!POLA_NAMA.test(data.nama)) {
    throw new AppError(400, 'Nama hanya boleh berisi huruf.');
  }
  if (!Pengguna.POLA_EMAIL.test(data.email)) {
    throw new AppError(400, 'Format email tidak valid.');
  }
  if (!POLA_TELEPON.test(data.telepon)) {
    throw new AppError(400, 'Nomor telepon harus diawali 08 dan terdiri dari 10-14 digit angka.');
  }
  if (data.password.length < MIN_PANJANG_SANDI) {
    throw new AppError(400, 'Kata sandi minimal 8 karakter.');
  }
  if (data.konfirmasi !== '' && data.konfirmasi !== data.password) {
    throw new AppError(400, 'Konfirmasi kata sandi tidak cocok.');
  }

  if (peran === 'Pelajar') {
    if (!tanggalValid(data.tanggalLahir)) {
      throw new AppError(400, 'Tanggal lahir tidak valid.');
    }
    if (data.riwayatKesehatan === '') {
      throw new AppError(400, 'Riwayat kesehatan wajib diisi.');
    }
    if (data.emailWali !== '' && !Pengguna.POLA_EMAIL.test(data.emailWali)) {
      throw new AppError(400, 'Format email orang tua/wali tidak valid.');
    }
    if (hitungUsia(data.tanggalLahir, hariIni()) < USIA_DEWASA && data.emailWali === '') {
      throw new AppError(400, 'Email orang tua/wali wajib diisi untuk pelajar di bawah 18 tahun.');
    }
  }

  if (peran === 'TenagaKesehatan') {
    if (data.jenisTenagaKesehatan === '') {
      throw new AppError(400, 'Jenis tenaga kesehatan wajib diisi.');
    }
    if (data.lokasi === '') {
      throw new AppError(400, 'Lokasi praktik wajib diisi.');
    }
  }

  return { ...data, peran };
}

/** Algo-C11-02: menyimpan akun baru dan mengirimkan konfirmasi registrasi. */
async function daftar(req, res) {
  const data = validasiRegistrasi(req.body);

  if (await Pengguna.findByEmail(data.email)) {
    throw new AppError(409, 'Email sudah terdaftar.');
  }

  const passwordHash = await Pengguna.hashPassword(data.password);
  const perluKonfirmasi =
    data.peran === 'Pelajar' && hitungUsia(data.tanggalLahir, hariIni()) < USIA_DEWASA;
  const tokenKonfirmasi = perluKonfirmasi ? crypto.randomBytes(32).toString('hex') : null;
  const statusAkun = perluKonfirmasi ? 'Belum Terverifikasi' : 'Aktif';

  let idPengguna;
  try {
    idPengguna = await db.withTransaction(async (client) => {
      const id = await Pengguna.tambah(client, {
        email: data.email,
        passwordHash,
        role: data.peran,
        statusAkun,
        tokenKonfirmasi,
      });

      if (data.peran === 'Pelajar') {
        const idPelajar = await Pelajar.tambah(client, {
          idPengguna: id,
          nama: data.nama,
          tanggalLahir: data.tanggalLahir,
          nomorTelepon: data.telepon,
          emailWali: data.emailWali || null,
        });
        await new RiwayatKesehatan(encryptAES256(data.riwayatKesehatan)).simpan(client, idPelajar);
      } else if (data.peran === 'OrangTuaWali') {
        const idWali = await OrangTuaWali.tambah(client, {
          idPengguna: id,
          nama: data.nama,
          email: data.email,
          nomorTelepon: data.telepon,
        });
        await Pelajar.hubungkanKeWali(client, {
          idWali,
          email: data.email,
          nomorTelepon: data.telepon,
        });
      } else {
        await TenagaKesehatan.tambah(client, {
          idPengguna: id,
          nama: data.nama,
          email: data.email,
          nomorTelepon: data.telepon,
          jenisTenagaKesehatan: data.jenisTenagaKesehatan,
          nomorStr: data.nomorStr || null,
          lokasi: data.lokasi,
        });
      }

      return id;
    });
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError(409, 'Email sudah terdaftar.');
    }
    throw err;
  }

  if (perluKonfirmasi) {
    try {
      await kirimEmailKonfirmasiWali({
        emailWali: data.emailWali,
        namaPelajar: data.nama,
        token: tokenKonfirmasi,
      });
    } catch (err) {
      console.error('[Registrasi] Gagal mengirim e-mail konfirmasi:', err.message);
    }
  }

  return kirim(
    res,
    201,
    perluKonfirmasi
      ? 'Registrasi berhasil. Menunggu konfirmasi orang tua/wali.'
      : 'Registrasi berhasil. Akun Anda sudah aktif.',
    { idPengguna, email: data.email, role: data.peran, statusAkun }
  );
}

module.exports = { daftar };
