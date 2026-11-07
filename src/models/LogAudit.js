// C38 LogAudit
// Seluruh operasi pada kelas ini hanya menambah catatan (append-only).
// LogAudit sengaja tidak menyediakan operasi untuk mengubah maupun menghapus
// catatan, sehingga rekam jejak yang telah tersimpan tidak dapat dimanipulasi (KF48, KF49).
const crypto = require('crypto');
const db = require('../config/db');

class LogAudit {
  constructor(data) {
    this.idLog = data.idLog;
    this.idLaporan = data.idLaporan;
    this.waktu = data.waktu;
    this.identitasAktor = data.identitasAktor;
    this.tindakan = data.tindakan;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idLog: baris.id_log,
      idLaporan: baris.id_laporan,
      waktu: baris.waktu,
      identitasAktor: baris.identitas_aktor,
      tindakan: baris.tindakan,
    });
  }

  // Algo-058: kueri SQL hanya-tambah untuk mencatat penerimaan laporan (KF48, KF49)
  static async catatPenerimaanLaporan(idLaporan, idPelapor, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuSekarang = new Date();
    await client.query(
      `INSERT INTO log_audit (id_log, id_laporan, waktu, identitas_aktor, tindakan)
       VALUES ($1, $2, $3, $4, 'Penerimaan laporan')`,
      [idBaru, idLaporan, waktuSekarang, idPelapor],
    );
  }

  // Algo-059: kueri SQL hanya-tambah untuk mencatat perubahan status laporan (KF48, KF49)
  static async catatPerubahanStatusLaporan(idLaporan, idAdmin, statusBaru, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuSekarang = new Date();
    const teksTindakan = `Perubahan status laporan menjadi ${statusBaru}`;
    await client.query(
      `INSERT INTO log_audit (id_log, id_laporan, waktu, identitas_aktor, tindakan)
       VALUES ($1, $2, $3, $4, $5)`,
      [idBaru, idLaporan, waktuSekarang, idAdmin, teksTindakan],
    );
  }

  // Algo-060: kueri SQL hanya-tambah untuk mencatat penghapusan listing (KF48, KF49)
  static async catatPenghapusanListing(idLaporan, idAdmin, idBarang, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuSekarang = new Date();
    const teksTindakan = `Penghapusan listing: ${idBarang}`;
    await client.query(
      `INSERT INTO log_audit (id_log, id_laporan, waktu, identitas_aktor, tindakan)
       VALUES ($1, $2, $3, $4, $5)`,
      [idBaru, idLaporan, waktuSekarang, idAdmin, teksTindakan],
    );
  }

  // Algo-061: kueri SQL hanya-tambah untuk mencatat pemblokiran akun (KF48, KF49)
  static async catatPemblokiranAkun(idLaporan, idAdmin, idAkun, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuSekarang = new Date();
    const teksTindakan = `Pemblokiran akun: ${idAkun}`;
    await client.query(
      `INSERT INTO log_audit (id_log, id_laporan, waktu, identitas_aktor, tindakan)
       VALUES ($1, $2, $3, $4, $5)`,
      [idBaru, idLaporan, waktuSekarang, idAdmin, teksTindakan],
    );
  }

  static async getRiwayatByLaporan(idLaporan) {
    const { rows } = await db.query(
      `SELECT id_log, id_laporan, waktu, identitas_aktor, tindakan
       FROM log_audit WHERE id_laporan = $1 ORDER BY waktu ASC`,
      [idLaporan],
    );
    return rows.map((b) => this.dariBaris(b));
  }
}

module.exports = LogAudit;
