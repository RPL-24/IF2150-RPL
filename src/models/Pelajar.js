const { randomUUID } = require('crypto');
const db = require('../config/db');
const AppError = require('../utils/AppError');
const { parseCoordinates } = require('../utils/distance');
const Pengguna = require('./Pengguna');
const CheckIn = require('./CheckIn');

const KOLOM_CHECK_IN = `id_check_in, tanggal_check_in, skala_mood, jam_tidur, jam_bangun,
  pola_makan, pemicu_stres`;

/** C02 - Subkelas Pengguna untuk pelajar. */
class Pelajar extends Pengguna {
  constructor(baris) {
    super(baris);
    this.idPelajar = baris.id_pelajar;
    this.idWali = baris.id_wali;
    this.nama = baris.nama;
    this.lokasiSaatIni = baris.lokasi_saat_ini || '';
    this.statusDarurat = baris.status_darurat;
    this.tanggalLahir = baris.tanggal_lahir;
    this.nomorTelepon = baris.nomor_telepon;
    this.nomorTeleponWali = baris.nomor_telepon_wali;
    this.emailWali = baris.email_wali;
  }

  static async findById(idPelajar) {
    const { rows } = await db.query(
      `SELECT p.*, u.username, u.email, u.role, u.status_akun
       FROM pelajar p JOIN pengguna u ON u.id_pengguna = p.id_pengguna
       WHERE p.id_pelajar = $1;`,
      [idPelajar]
    );
    return rows[0] ? new Pelajar(rows[0]) : null;
  }

  static async findByIdPengguna(idPengguna, executor = db) {
    const { rows } = await executor.query(
      `SELECT p.*, u.username, u.email, u.role, u.status_akun
       FROM pelajar p JOIN pengguna u ON u.id_pengguna = p.id_pengguna
       WHERE p.id_pengguna = $1;`,
      [idPengguna]
    );
    return rows[0] ? new Pelajar(rows[0]) : null;
  }

  /** Seluruh pelajar berakun aktif, untuk evaluasi darurat harian. */
  static async findSemuaAktif() {
    const { rows } = await db.query(
      `SELECT p.*, u.username, u.email, u.role, u.status_akun
       FROM pelajar p JOIN pengguna u ON u.id_pengguna = p.id_pengguna
       WHERE u.status_akun = 'Aktif';`
    );
    return rows.map((baris) => new Pelajar(baris));
  }

  /**
   * Check-in terbaru seluruh pelajar aktif dalam satu query, dikelompokkan per id pelajar.
   * LATERAL memakai indeks (id_pelajar, tanggal_check_in) sehingga job harian tidak perlu satu query per pelajar.
   */
  static async getRiwayatTerbaruSemuaAktif(batas) {
    const { rows } = await db.query(
      `SELECT p.id_pelajar, c.*
       FROM pelajar p
       JOIN pengguna u ON u.id_pengguna = p.id_pengguna
       CROSS JOIN LATERAL (
         SELECT ${KOLOM_CHECK_IN} FROM check_in
         WHERE id_pelajar = p.id_pelajar ORDER BY tanggal_check_in DESC LIMIT $1
       ) c
       WHERE u.status_akun = 'Aktif';`,
      [batas]
    );
    const riwayat = new Map();
    rows.forEach((baris) => {
      if (!riwayat.has(baris.id_pelajar)) {
        riwayat.set(baris.id_pelajar, []);
      }
      riwayat.get(baris.id_pelajar).push(new CheckIn(baris));
    });
    return riwayat;
  }

  /** Menyimpan profil pelajar pada transaksi registrasi (UC01). */
  static async tambah(executor, data) {
    const idPelajar = `PLJ-${randomUUID()}`;
    await executor.query(
      `INSERT INTO pelajar
         (id_pelajar, id_pengguna, id_wali, nama, tanggal_lahir, nomor_telepon, nomor_telepon_wali, email_wali)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        idPelajar,
        data.idPengguna,
        data.idWali ?? null,
        data.nama,
        data.tanggalLahir,
        data.nomorTelepon,
        data.nomorTeleponWali ?? null,
        data.emailWali ?? null,
      ]
    );
    return idPelajar;
  }

  /** Menghubungkan pelajar aktif yang mencantumkan kontak wali ini, beserta notifikasinya. */
  static async hubungkanKeWali(executor, { idWali, email, nomorTelepon }) {
    const { rows } = await executor.query(
      `UPDATE pelajar p SET id_wali = $1
       FROM pengguna u
       WHERE u.id_pengguna = p.id_pengguna AND u.status_akun = 'Aktif' AND p.id_wali IS NULL
         AND (LOWER(p.email_wali) = LOWER($2) OR p.nomor_telepon_wali = $3)
       RETURNING p.id_pelajar;`,
      [idWali, email, nomorTelepon]
    );
    const idPelajar = rows.map((baris) => baris.id_pelajar);
    if (idPelajar.length > 0) {
      await executor.query(
        'UPDATE notifikasi_darurat SET id_wali = $1 WHERE id_wali IS NULL AND id_pelajar = ANY($2);',
        [idWali, idPelajar]
      );
    }
    return idPelajar;
  }

  async setWali(idWali, executor = db) {
    await executor.query('UPDATE pelajar SET id_wali = $1 WHERE id_pelajar = $2;', [
      idWali,
      this.idPelajar,
    ]);
    this.idWali = idWali;
  }

  /** Algo-C02-01, Q-C02-01. Bila diberi batas, hanya check-in terbaru sejumlah batas itu. */
  async getCheckInHistory(batas = null) {
    const { rows } = await db.query(
      `SELECT ${KOLOM_CHECK_IN}, catatan_refleksi FROM check_in
       WHERE id_pelajar = $1 ORDER BY tanggal_check_in DESC LIMIT $2;`,
      [this.idPelajar, batas]
    );
    return rows.map((baris) => new CheckIn(baris));
  }

  /** Q-C03-02 dan Q-C17-01: tanpa kolom catatan_refleksi bila tidak diminta (KNF02). */
  async getCheckInSejak(tanggalAwal, { denganJurnal = false } = {}) {
    const kolom = denganJurnal ? `${KOLOM_CHECK_IN}, catatan_refleksi` : KOLOM_CHECK_IN;
    const { rows } = await db.query(
      `SELECT ${kolom} FROM check_in
       WHERE id_pelajar = $1 AND tanggal_check_in >= $2 ORDER BY tanggal_check_in DESC;`,
      [this.idPelajar, tanggalAwal]
    );
    return rows.map((baris) => new CheckIn(baris));
  }

  async getTanggalCheckInTerakhir() {
    const { rows } = await db.query(
      'SELECT MAX(tanggal_check_in) AS terakhir FROM check_in WHERE id_pelajar = $1;',
      [this.idPelajar]
    );
    return rows[0].terakhir;
  }

  /** Algo-C02-02, Q-C02-02 */
  async setCheckIn(checkIn) {
    const data = checkIn.getCheckInData();
    try {
      await db.query(
        `INSERT INTO check_in (id_check_in, id_pelajar, tanggal_check_in, skala_mood, jam_tidur,
           jam_bangun, pola_makan, pemicu_stres, catatan_refleksi)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
          data.idCheckIn,
          this.idPelajar,
          data.tanggalCheckIn,
          data.skalaMood,
          data.jamTidur,
          data.jamBangun,
          data.polaMakan,
          data.pemicuStres,
          data.catatanRefleksi,
        ]
      );
    } catch (err) {
      // Indeks unik (id_pelajar, tanggal_check_in): satu check-in per hari
      if (err.code === '23505') {
        throw new AppError(409, 'Anda sudah melakukan check-in hari ini.');
      }
      throw err;
    }
  }

  getLokasiSaatIni() {
    return this.lokasiSaatIni;
  }

  /** Algo-C02-03, Q-C02-03 */
  async setLokasiSaatIni(lokasi) {
    if (!parseCoordinates(lokasi)) {
      throw new AppError(400, 'Format lokasi tidak valid.');
    }
    await db.query('UPDATE pelajar SET lokasi_saat_ini = $1 WHERE id_pelajar = $2;', [
      lokasi,
      this.idPelajar,
    ]);
    this.lokasiSaatIni = lokasi;
  }

  /** Algo-C02-04, Q-C02-04 */
  async updateEmergencyStatus(status, executor = db) {
    if (this.statusDarurat === status) {
      return;
    }
    await executor.query('UPDATE pelajar SET status_darurat = $1 WHERE id_pelajar = $2;', [
      status,
      this.idPelajar,
    ]);
    this.statusDarurat = status;
  }

  /** Algo-C02-05 */
  async ajukanKonsultasi(jadwal, keluhan) {
    const isiKeluhan = String(keluhan ?? '').trim();
    if (isiKeluhan === '') {
      throw new AppError(400, 'Keluhan wajib diisi.');
    }
    if (!jadwal.isAvailable()) {
      return false;
    }
    return jadwal.reservasi(this.idPelajar, isiKeluhan);
  }

  /** Perbarui identitas pelajar yang tampil di profil dan konsultasi. */
  async perbaruiProfil({ nama, nomorTelepon }, executor = db) {
    // Email pelajar disimpan di tabel pengguna; tabel pelajar tidak punya kolom email.
    await executor.query(
      'UPDATE pelajar SET nama = $1, nomor_telepon = $2 WHERE id_pelajar = $3;',
      [nama, nomorTelepon, this.idPelajar]
    );
    this.nama = nama;
    this.nomorTelepon = nomorTelepon;
  }
}

module.exports = Pelajar;