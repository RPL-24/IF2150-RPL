// C39 LogAdmin
const crypto = require('crypto');
const db = require('../config/db');

class LogAdmin {
  constructor(data) {
    this.idLogAdmin = data.idLogAdmin;
    this.idAdmin = data.idAdmin;
    this.jenisTindakan = data.jenisTindakan;
    this.objekDitindak = data.objekDitindak;
    this.waktu = data.waktu;
    this.alasan = data.alasan;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idLogAdmin: baris.id_log_admin,
      idAdmin: baris.id_admin,
      jenisTindakan: baris.jenis_tindakan,
      objekDitindak: baris.objek_ditindak,
      waktu: baris.waktu,
      alasan: baris.alasan,
    });
  }

  // Algo-062: menyimpan rekaman tindakan moderasi admin ke tabel log_admin (KF55)
  static async catatTindakan(idAdmin, jenisTindakan, objekDitindak, alasan, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuSekarang = new Date();
    await client.query(
      `INSERT INTO log_admin (id_log_admin, id_admin, jenis_tindakan, objek_ditindak, waktu, alasan)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [idBaru, idAdmin, jenisTindakan, objekDitindak, waktuSekarang, alasan],
    );
  }

  static async getAllLog() {
    const { rows } = await db.query(
      `SELECT id_log_admin, id_admin, jenis_tindakan, objek_ditindak, waktu, alasan
       FROM log_admin ORDER BY waktu DESC`,
    );
    return rows.map((b) => this.dariBaris(b));
  }
}

module.exports = LogAdmin;
