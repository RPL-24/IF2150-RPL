// C35 Notifikasi
const crypto = require('crypto');
const db = require('../config/db');

class Notifikasi {
  constructor(data) {
    this.idNotifikasi = data.idNotifikasi;
    this.idAkun = data.idAkun;
    this.jenis = data.jenis;
    this.isi = data.isi;
    this.waktuKirim = data.waktuKirim;
    this.statusBaca = data.statusBaca;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new Notifikasi({
      idNotifikasi: baris.id_notifikasi,
      idAkun: baris.id_akun,
      jenis: baris.jenis,
      isi: baris.isi,
      waktuKirim: baris.waktu_kirim,
      statusBaca: baris.status_baca,
    });
  }

  // Algo-049 (KF34)
  static async simpan(idAkun, jenis, isi, waktuKirim = new Date(), statusBaca = false) {
    const { rowCount } = await db.query(
      `INSERT INTO notifikasi (id_notifikasi, id_akun, jenis, isi, waktu_kirim, status_baca)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [crypto.randomUUID(), idAkun, jenis, isi, waktuKirim, statusBaca],
    );
    return rowCount > 0;
  }

  // Algo-050 (KF34)
  static async hitungBelumDibaca(idAkun) {
    const { rows } = await db.query(
      'SELECT COUNT(*)::int AS jumlah FROM notifikasi WHERE id_akun = $1 AND status_baca = false',
      [idAkun],
    );
    return rows[0].jumlah;
  }
}

module.exports = Notifikasi;
