// C34 Pesan. Isi pesan selalu terenkripsi di lapisan ini (KF36); dekripsi dilakukan PercakapanController.
const crypto = require('crypto');
const db = require('../config/db');

const KOLOM = 'id_pesan, id_percakapan, id_pengirim, isi_pesan_terenkripsi, waktu_kirim, status_baca';

class Pesan {
  constructor(data) {
    this.idPesan = data.idPesan;
    this.idPercakapan = data.idPercakapan;
    this.idPengirim = data.idPengirim;
    this.isiPesanTerenkripsi = data.isiPesanTerenkripsi;
    this.waktuKirim = data.waktuKirim;
    this.statusBaca = data.statusBaca;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new Pesan({
      idPesan: baris.id_pesan,
      idPercakapan: baris.id_percakapan,
      idPengirim: baris.id_pengirim,
      isiPesanTerenkripsi: baris.isi_pesan_terenkripsi,
      waktuKirim: baris.waktu_kirim,
      statusBaca: baris.status_baca,
    });
  }

  // Algo-045 (KF32)
  static async getDaftarPesan(idPercakapan) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM pesan WHERE id_percakapan = $1 ORDER BY waktu_kirim ASC`,
      [idPercakapan],
    );
    return rows.map(Pesan.dariBaris);
  }

  // Algo-046 (KF32, KF36)
  static async simpanPesan(idPercakapan, idPengirim, isiPesanTerenkripsi) {
    const { rows } = await db.query(
      `INSERT INTO pesan (${KOLOM})
       VALUES ($1, $2, $3, $4, now(), false)
       RETURNING ${KOLOM}`,
      [crypto.randomUUID(), idPercakapan, idPengirim, isiPesanTerenkripsi],
    );
    return Pesan.dariBaris(rows[0]);
  }

  // Algo-047 (KF33)
  static async getCuplikanPesanTerakhir(idPercakapan) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM pesan WHERE id_percakapan = $1 ORDER BY waktu_kirim DESC LIMIT 1`,
      [idPercakapan],
    );
    return Pesan.dariBaris(rows[0]);
  }

  // Algo-048 (KF34)
  static async hitungPesanBelumDibaca(idPercakapan, idAkun) {
    const { rows } = await db.query(
      `SELECT COUNT(*)::int AS jumlah FROM pesan
       WHERE id_percakapan = $1 AND id_pengirim <> $2 AND status_baca = false`,
      [idPercakapan, idAkun],
    );
    return rows[0].jumlah;
  }
}

module.exports = Pesan;
