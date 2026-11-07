// C28 SesiLogin
const crypto = require('crypto');
const db = require('../config/db');

class SesiLogin {
  constructor(data) {
    this.idSesi = data.idSesi;
    this.idAkun = data.idAkun;
    this.token = data.token;
    this.waktuMulai = data.waktuMulai;
    this.waktuKedaluwarsa = data.waktuKedaluwarsa;
    this.statusAktif = data.statusAktif;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new SesiLogin({
      idSesi: baris.id_sesi,
      idAkun: baris.id_akun,
      token: baris.token,
      waktuMulai: baris.waktu_mulai,
      waktuKedaluwarsa: baris.waktu_kedaluwarsa,
      statusAktif: baris.status_aktif,
    });
  }

  // Token acak 256-bit; masa berlakunya ditentukan pemanggil saat simpan() (KF11)
  static buatToken(idAkun) {
    return crypto.randomBytes(32).toString('hex');
  }

  static async simpan(idAkun, token, waktuMulai, waktuKedaluwarsa) {
    const { rowCount } = await db.query(
      `INSERT INTO sesi_login (id_sesi, id_akun, token, waktu_mulai, waktu_kedaluwarsa, status_aktif)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [crypto.randomUUID(), idAkun, token, waktuMulai, waktuKedaluwarsa],
    );
    return rowCount > 0;
  }

  // Algo-030: sesi aktif yang belum kedaluwarsa (KF11)
  static async cariSesiAktif(token) {
    const { rows } = await db.query(
      `SELECT id_sesi, id_akun, token, waktu_mulai, waktu_kedaluwarsa, status_aktif
       FROM sesi_login
       WHERE token = $1 AND status_aktif = true AND waktu_kedaluwarsa > now()
       LIMIT 1`,
      [token],
    );
    return SesiLogin.dariBaris(rows[0]);
  }

  getIdAkun() {
    return this.idAkun;
  }

  // KF12
  static async nonaktifkan(token) {
    await db.query('UPDATE sesi_login SET status_aktif = false WHERE token = $1', [token]);
  }

  // Algo-031: cabut seluruh sesi akun yang diblokir (KF51, KF53)
  static async nonaktifkanByAkun(idAkun, client = db) {
    await client.query(
      'UPDATE sesi_login SET status_aktif = false WHERE id_akun = $1 AND status_aktif = true',
      [idAkun],
    );
  }
}

module.exports = SesiLogin;
