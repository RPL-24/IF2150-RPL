// LanggananPush: langganan Web Push per peramban, dipakai C44 PushNotifikasiAdapter (KF34).
// Kelas ini tidak ada di DPPL (dicatat di B.1).
const crypto = require('crypto');
const db = require('../config/db');

class LanggananPush {
  constructor(data) {
    this.id = data.id;
    this.idAkun = data.idAkun;
    this.endpoint = data.endpoint;
    this.p256dh = data.p256dh;
    this.auth = data.auth;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new LanggananPush({
      id: baris.id,
      idAkun: baris.id_akun,
      endpoint: baris.endpoint,
      p256dh: baris.p256dh,
      auth: baris.auth,
    });
  }

  // Upsert berdasarkan endpoint: peramban yang sama bisa berganti akun atau memperbarui kunci
  static async simpan(idAkun, endpoint, p256dh, auth) {
    const { rowCount } = await db.query(
      `INSERT INTO langganan_push (id, id_akun, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint) DO UPDATE
         SET id_akun = EXCLUDED.id_akun, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
      [crypto.randomUUID(), idAkun, endpoint, p256dh, auth],
    );
    return rowCount > 0;
  }

  static async getByAkun(idAkun) {
    const { rows } = await db.query(
      'SELECT id, id_akun, endpoint, p256dh, auth FROM langganan_push WHERE id_akun = $1',
      [idAkun],
    );
    return rows.map(LanggananPush.dariBaris);
  }

  static async hapusByEndpoint(endpoint) {
    const { rowCount } = await db.query('DELETE FROM langganan_push WHERE endpoint = $1', [endpoint]);
    return rowCount > 0;
  }
}

module.exports = LanggananPush;
