const bcrypt = require('bcryptjs');
const db = require('../config/db');

const BCRYPT_COST = 12;
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KOLOM = 'id_pengguna, username, email, password_hash, role, status_akun, versi_token';

/** C01 - Kelas abstrak data akun milik ketiga aktor. */
class Pengguna {
  constructor(baris) {
    this.idPengguna = baris.id_pengguna;
    this.username = baris.username;
    this.email = baris.email;
    this.password = baris.password_hash;
    this.role = baris.role;
    this.statusAkun = baris.status_akun;
    this.versiToken = baris.versi_token;
  }

  /** Membentuk objek subkelas sesuai role (Algo-C01-01). */
  static dariBaris(baris) {
    /* eslint-disable global-require */
    const kelas = {
      Pelajar: () => require('./Pelajar'),
      OrangTuaWali: () => require('./OrangTuaWali'),
      TenagaKesehatan: () => require('./TenagaKesehatan'),
    }[baris.role]();
    return new kelas(baris);
  }

  /** Algo-C01-01, Q-C01-01 */
  static async findByUsernameOrEmail(usernameOrEmail) {
    const kunci = String(usernameOrEmail ?? '').trim().toLowerCase();
    if (kunci === '') {
      return null;
    }
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM pengguna WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1;`,
      [kunci]
    );
    return rows[0] ? Pengguna.dariBaris(rows[0]) : null;
  }

  /** Algo-C01-02, Q-C01-02 */
  static async findByEmail(email) {
    const kunci = String(email ?? '').trim().toLowerCase();
    if (!POLA_EMAIL.test(kunci)) {
      return null;
    }
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM pengguna WHERE LOWER(email) = $1 LIMIT 1;`,
      [kunci]
    );
    return rows[0] ? Pengguna.dariBaris(rows[0]) : null;
  }

  static async findByTokenKonfirmasi(token, executor = db) {
    const { rows } = await executor.query(
      `SELECT ${KOLOM} FROM pengguna
       WHERE token_konfirmasi = $1 AND status_akun = 'Belum Terverifikasi';`,
      [token]
    );
    return rows[0] ? Pengguna.dariBaris(rows[0]) : null;
  }

  static async findByResetToken(tokenHash) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM pengguna WHERE reset_token = $1 AND reset_token_expires > NOW();`,
      [tokenHash]
    );
    return rows[0] ? Pengguna.dariBaris(rows[0]) : null;
  }

  static async tambah(executor, { email, passwordHash, role, statusAkun, tokenKonfirmasi = null }) {
    const { rows } = await executor.query(
      `INSERT INTO pengguna (username, email, password_hash, role, status_akun, token_konfirmasi)
       VALUES ($1, $1, $2, $3, $4, $5) RETURNING id_pengguna;`,
      [email, passwordHash, role, statusAkun, tokenKonfirmasi]
    );
    return rows[0].id_pengguna;
  }

  static hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_COST);
  }

  /** Algo-C01-03 */
  async verifyPassword(password) {
    if (!password) {
      return false;
    }
    return bcrypt.compare(String(password), this.password);
  }

  getStatusAkun() {
    return this.statusAkun;
  }

  getRole() {
    return this.role;
  }

  /**
   * Algo-C01-04, Q-C01-03. Token reset dihapus dan versi token dinaikkan
   * sehingga tautan reset hanya berlaku sekali dan sesi lama berakhir.
   */
  async setPassword(newPassword) {
    const hashBaru = await Pengguna.hashPassword(newPassword);
    const { rowCount } = await db.query(
      `UPDATE pengguna
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, versi_token = versi_token + 1
       WHERE id_pengguna = $2;`,
      [hashBaru, this.idPengguna]
    );
    if (rowCount !== 1) {
      return false;
    }
    this.password = hashBaru;
    return true;
  }

  async simpanResetToken(tokenHash) {
    await db.query(
      `UPDATE pengguna SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour'
       WHERE id_pengguna = $2;`,
      [tokenHash, this.idPengguna]
    );
  }

  /** Mengubah status akun saat wali menyetujui atau menolak registrasi (Q-C11-03). */
  async ubahStatusKonfirmasi(statusBaru, executor = db) {
    await executor.query(
      `UPDATE pengguna SET status_akun = $1, token_konfirmasi = NULL WHERE id_pengguna = $2;`,
      [statusBaru, this.idPengguna]
    );
    this.statusAkun = statusBaru;
  }

  /** Mengakhiri seluruh sesi pengguna (KNF12). */
  static async akhiriSesiById(idPengguna) {
    await db.query('UPDATE pengguna SET versi_token = versi_token + 1 WHERE id_pengguna = $1;', [
      idPengguna,
    ]);
  }

  /** Data akun tanpa hash password, aman untuk dikirim ke klien. */
  toJSON() {
    const { password, versiToken, ...aman } = this;
    return aman;
  }
}

Pengguna.POLA_EMAIL = POLA_EMAIL;

module.exports = Pengguna;
