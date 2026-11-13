const { randomUUID } = require('crypto');
const db = require('../config/db');
const Pengguna = require('./Pengguna');
const JadwalKonsultasi = require('./JadwalKonsultasi');

const KOLOM = `id_tenaga_kesehatan, id_fasilitas, nama, email, nomor_telepon,
  jenis_tenaga_kesehatan, nomor_str, lokasi`;

/** C04 - Subkelas Pengguna untuk psikolog atau psikiater. */
class TenagaKesehatan extends Pengguna {
  constructor(baris) {
    super(baris);
    this.idTenagaKesehatan = baris.id_tenaga_kesehatan;
    this.idFasilitas = baris.id_fasilitas;
    this.nama = baris.nama;
    this.nomorTelepon = baris.nomor_telepon;
    this.jenisTenagaKesehatan = baris.jenis_tenaga_kesehatan;
    this.nomorStr = baris.nomor_str;
    this.lokasi = baris.lokasi;
  }

  /** Algo-C04-01, Q-C04-01 */
  static async findAll() {
    const { rows } = await db.query(`SELECT ${KOLOM} FROM tenaga_kesehatan ORDER BY nama;`);
    return rows.map((baris) => new TenagaKesehatan(baris));
  }

  /** Algo-C04-02, Q-C04-02 */
  static async findById(idTenagaKesehatan) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM tenaga_kesehatan WHERE id_tenaga_kesehatan = $1;`,
      [idTenagaKesehatan]
    );
    return rows[0] ? new TenagaKesehatan(rows[0]) : null;
  }

  static async findByIdPengguna(idPengguna) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM tenaga_kesehatan WHERE id_pengguna = $1;`,
      [idPengguna]
    );
    return rows[0] ? new TenagaKesehatan(rows[0]) : null;
  }

  /**
   * Q-C20-01. LEFT JOIN agar tenaga kesehatan baru yang belum punya fasilitas tetap tampil.
   */
  static async findSemuaDenganFasilitas() {
    const { rows } = await db.query(
      `SELECT tk.id_tenaga_kesehatan, tk.nama, tk.jenis_tenaga_kesehatan, tk.lokasi AS lokasi_kerja,
              fk.id_fasilitas, fk.nama_fasilitas, fk.alamat, fk.lokasi, fk.estimasi_biaya
       FROM tenaga_kesehatan tk
       LEFT JOIN fasilitas_kesehatan fk ON tk.id_fasilitas = fk.id_fasilitas
       ORDER BY tk.nama;`
    );
    return rows;
  }

  /** Q-C20-02 */
  static async findDetailDenganFasilitas(idTenagaKesehatan) {
    const { rows } = await db.query(
      `SELECT tk.id_tenaga_kesehatan, tk.nama, tk.email, tk.nomor_telepon, tk.jenis_tenaga_kesehatan,
              tk.nomor_str, tk.lokasi AS lokasi_kerja, fk.id_fasilitas, fk.nama_fasilitas, fk.alamat,
              fk.lokasi, fk.estimasi_biaya
       FROM tenaga_kesehatan tk
       LEFT JOIN fasilitas_kesehatan fk ON tk.id_fasilitas = fk.id_fasilitas
       WHERE tk.id_tenaga_kesehatan = $1;`,
      [idTenagaKesehatan]
    );
    return rows[0] || null;
  }

  static async tambah(executor, data) {
    const idTenagaKesehatan = `NAKES-${randomUUID()}`;
    await executor.query(
      `INSERT INTO tenaga_kesehatan (id_tenaga_kesehatan, id_pengguna, id_fasilitas, nama, email,
         nomor_telepon, jenis_tenaga_kesehatan, nomor_str, lokasi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        idTenagaKesehatan,
        data.idPengguna,
        data.idFasilitas ?? null,
        data.nama,
        data.email,
        data.nomorTelepon,
        data.jenisTenagaKesehatan,
        data.nomorStr ?? null,
        data.lokasi,
      ]
    );
    return idTenagaKesehatan;
  }

  /** Algo-C04-03 */
  getProfil() {
    return `${this.nama} (${this.jenisTenagaKesehatan})\nE-mail: ${this.email}\nTelepon: ${this.nomorTelepon}`;
  }

  /** Algo-C04-04, Q-C04-03 */
  async getJadwalTersedia() {
    const { rows } = await db.query(
      `SELECT id_jadwal, id_tenaga_kesehatan, tanggal, waktu, status_ketersediaan, status_pengajuan,
              id_pelajar, keluhan
       FROM jadwal_konsultasi
       WHERE id_tenaga_kesehatan = $1 AND tanggal >= CURRENT_DATE
       ORDER BY tanggal, waktu;`,
      [this.idTenagaKesehatan]
    );
    return rows.map((baris) => new JadwalKonsultasi(baris)).filter((jadwal) => jadwal.isAvailable());
  }

  /** Perbarui identitas tenaga kesehatan. */
  async perbaruiProfil({ nama, nomorTelepon, email, jenisTenagaKesehatan, nomorStr, lokasi }, executor = db) {
    await executor.query(
      `UPDATE tenaga_kesehatan
          SET nama = $1, nomor_telepon = $2, email = $3,
              jenis_tenaga_kesehatan = COALESCE($4, jenis_tenaga_kesehatan),
              nomor_str = COALESCE($5, nomor_str),
              lokasi = COALESCE($6, lokasi)
        WHERE id_tenaga_kesehatan = $7;`,
      [nama, nomorTelepon, email, jenisTenagaKesehatan || null, nomorStr || null, lokasi || null, this.idTenagaKesehatan]
    );
    this.nama = nama;
    this.nomorTelepon = nomorTelepon;
    this.email = email;
  }

  /**
   * Perbarui tarif konsultasi. Tarif disimpan di fasilitas_kesehatan.estimasi_biaya,
   * jadi nakes harus terhubung ke sebuah fasilitas.
   * @returns {Promise<boolean>} true bila ada fasilitas yang diperbarui.
   */
  async setEstimasiBiaya(tarif, executor = db) {
    if (!this.idFasilitas) return false;
    const hasil = await executor.query(
      `UPDATE fasilitas_kesehatan
          SET estimasi_biaya = $1
        WHERE id_fasilitas = $2;`,
      [tarif, this.idFasilitas]
    );
    return hasil.rowCount > 0;
  }
}

module.exports = TenagaKesehatan;