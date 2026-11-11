// C27 TokenVerifikasi
const crypto = require('crypto');
const db = require('../config/db');

const STATUS_PAKAI = Object.freeze({
  AKTIF: 'Aktif',
  TERPAKAI: 'Terpakai',
  HANGUS: 'Hangus',
});

class TokenVerifikasi {
  static STATUS_PAKAI = STATUS_PAKAI;

  constructor(data) {
    this.idToken = data.idToken;
    this.idAkun = data.idAkun;
    this.kode = data.kode;
    this.waktuBuat = data.waktuBuat;
    this.waktuKedaluwarsa = data.waktuKedaluwarsa;
    this.statusPakai = data.statusPakai;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new TokenVerifikasi({
      idToken: baris.id_token,
      idAkun: baris.id_akun,
      kode: baris.kode,
      waktuBuat: baris.waktu_buat,
      waktuKedaluwarsa: baris.waktu_kedaluwarsa,
      statusPakai: baris.status_pakai,
    });
  }

  // KF06
  static async simpan(idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai) {
    const { rowCount } = await db.query(
      `INSERT INTO token_verifikasi (id_token, id_akun, kode, waktu_buat, waktu_kedaluwarsa, status_pakai)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [crypto.randomUUID(), idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai],
    );
    return rowCount > 0;
  }

  // Algo-029: token aktif terbaru milik akun (KF07)
  static async cariTokenAktif(idAkun) {
    const { rows } = await db.query(
      `SELECT id_token, id_akun, kode, waktu_buat, waktu_kedaluwarsa, status_pakai
       FROM token_verifikasi
       WHERE id_akun = $1 AND status_pakai = $2
       ORDER BY waktu_buat DESC
       LIMIT 1`,
      [idAkun, STATUS_PAKAI.AKTIF],
    );
    return TokenVerifikasi.dariBaris(rows[0]);
  }

  // KF07
  cocokkanKode(kodeInput) {
    return typeof kodeInput === 'string' && kodeInput.trim() === this.kode;
  }

  // KF06, KF07
  sudahKedaluwarsa() {
    return new Date() > new Date(this.waktuKedaluwarsa);
  }

  // KF07: kode tidak dapat dipakai ulang
  async tandaiTerpakai() {
    await this.#ubahStatus(STATUS_PAKAI.TERPAKAI);
  }

  // Algo-005: kode lama hangus saat kode baru diminta
  async tandaiHangus() {
    await this.#ubahStatus(STATUS_PAKAI.HANGUS);
  }

  async #ubahStatus(status) {
    await db.query('UPDATE token_verifikasi SET status_pakai = $1 WHERE id_token = $2', [status, this.idToken]);
    this.statusPakai = status;
  }
}

module.exports = TokenVerifikasi;
