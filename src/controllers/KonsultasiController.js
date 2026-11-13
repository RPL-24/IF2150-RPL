const Pelajar = require('../models/Pelajar');
const TenagaKesehatan = require('../models/TenagaKesehatan');
const JadwalKonsultasi = require('../models/JadwalKonsultasi');
const AppError = require('../utils/AppError');
const db = require('../config/db');
const { kirim, tanganiAsync } = require('../utils/respon');

const STATUS_DIIZINKAN = ['Disetujui', 'Rescheduled'];

function idJadwalDari(req) {
  return String(req.params.id || '').trim();
}

/** Pastikan jadwal ada dan memang milik tenaga kesehatan yang sedang masuk. */
async function jadwalMilikNakes(req) {
  const jadwal = await JadwalKonsultasi.findById(idJadwalDari(req));
  if (!jadwal) {
    throw new AppError(404, 'Jadwal konsultasi tidak ditemukan.');
  }
  if (jadwal.idTenagaKesehatan !== req.user.idProfil) {
    throw new AppError(403, 'Jadwal ini bukan milik Anda.');
  }
  return jadwal;
}

/** UC06 - pelajar mengajukan janji pada satu slot tenaga kesehatan. */
exports.ajukan = tanganiAsync(async (req, res) => {
  const pelajar = await Pelajar.findByIdPengguna(req.user.idPengguna);
  if (!pelajar) {
    throw new AppError(404, 'Profil pelajar tidak ditemukan.');
  }

  const idJadwal = String((req.body && req.body.id_jadwal) || '').trim();
  const keluhan = String((req.body && req.body.keluhan) || '').trim();
  if (idJadwal === '') {
    throw new AppError(400, 'Pilih slot konsultasi terlebih dahulu.');
  }
  if (keluhan.length < 10) {
    throw new AppError(400, 'Keluhan minimal 10 karakter.');
  }

  const jadwal = await JadwalKonsultasi.findById(idJadwal);
  if (!jadwal) {
    throw new AppError(404, 'Jadwal konsultasi tidak ditemukan.');
  }
  if (jadwal.statusPengajuan !== 'Belum Diajukan') {
    throw new AppError(409, 'Slot ini sudah diajukan pelajar lain.');
  }

  const berhasil = await pelajar.ajukanKonsultasi(jadwal, keluhan);
  if (!berhasil) {
    throw new AppError(409, 'Slot sudah tidak tersedia. Pilih slot lain.');
  }

  return kirim(res, 201, 'Pengajuan konsultasi terkirim.', {
    idJadwal: jadwal.idJadwal,
    statusPengajuan: jadwal.statusPengajuan,
  });
});

/** Daftar pengajuan milik pelajar yang sedang masuk. */
exports.daftarSaya = tanganiAsync(async (req, res) => {
  const pelajar = await Pelajar.findByIdPengguna(req.user.idPengguna);
  if (!pelajar) {
    throw new AppError(404, 'Profil pelajar tidak ditemukan.');
  }
  const daftar = await JadwalKonsultasi.findByPelajar(pelajar.idPelajar);
  return kirim(res, 200, 'Daftar pengajuan konsultasi Anda.', daftar);
});

/** UC07 - daftar pengajuan yang masuk ke tenaga kesehatan. */
exports.daftarMasuk = tanganiAsync(async (req, res) => {
  const daftar = await JadwalKonsultasi.findPengajuanMasuk(req.user.idProfil);
  return kirim(res, 200, 'Daftar pengajuan konsultasi.', daftar);
});

/** Seluruh slot milik tenaga kesehatan, dipakai halaman manajemen dan dashboard. */
exports.daftarJadwal = tanganiAsync(async (req, res) => {
  const daftar = await JadwalKonsultasi.findByTenagaKesehatan(req.user.idProfil);
  return kirim(res, 200, 'Daftar jadwal konsultasi.', daftar);
});

/** UC07 - setujui pengajuan atau tandai sudah dijadwalkan ulang. */
exports.ubahStatus = tanganiAsync(async (req, res) => {
  const status = String((req.body && req.body.status) || '').trim();
  if (!STATUS_DIIZINKAN.includes(status)) {
    throw new AppError(400, 'Status yang diizinkan: Disetujui atau Rescheduled.');
  }
  const jadwal = await jadwalMilikNakes(req);
  await jadwal.updateStatus(status);
  return kirim(res, 200, `Status pengajuan diubah menjadi ${status}.`, {
    idJadwal: jadwal.idJadwal,
    statusPengajuan: jadwal.statusPengajuan,
  });
});

/** UC07 skenario alternatif 1 - jadwal ulang ke tanggal dan jam baru. */
exports.jadwalUlang = tanganiAsync(async (req, res) => {
  const jadwal = await jadwalMilikNakes(req);
  const tanggal = String((req.body && req.body.tanggal) || '').trim();
  const waktu = String((req.body && req.body.waktu) || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal) || !/^\d{2}:\d{2}$/.test(waktu)) {
    throw new AppError(400, 'Tanggal (YYYY-MM-DD) dan jam (HH:MM) wajib diisi.');
  }
  await jadwal.updateSchedule(tanggal, waktu);
  return kirim(res, 200, 'Jadwal konsultasi berhasil dipindahkan.', {
    idJadwal: jadwal.idJadwal,
    tanggal: jadwal.tanggal,
    waktu: jadwal.waktu,
    statusPengajuan: jadwal.statusPengajuan,
  });
});

/**
 * Tolak pengajuan: slot dikembalikan ke keadaan kosong agar bisa diajukan pelajar
 * lain. DPPL tidak mendefinisikan status "Ditolak", jadi statusnya kembali
 * "Belum Diajukan".
 */
exports.tolakPengajuan = tanganiAsync(async (req, res) => {
  const jadwal = await jadwalMilikNakes(req);
  await jadwal.tolakPengajuan();
  return kirim(res, 200, 'Pengajuan konsultasi berhasil ditolak.', {
    idJadwal: jadwal.idJadwal,
    statusPengajuan: jadwal.statusPengajuan,
  });
});