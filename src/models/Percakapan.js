// C33 Percakapan
const crypto = require('crypto');
const db = require('../config/db');
const Pesan = require('./Pesan');

const KOLOM = `id_percakapan, id_pembeli, id_penjual, id_barang,
               waktu_dibuat, waktu_pembaruan_terakhir`;

class Percakapan {
  constructor(data) {
    this.idPercakapan = data.idPercakapan;
    this.idPembeli = data.idPembeli;
    this.idPenjual = data.idPenjual;
    this.idBarang = data.idBarang;
    this.waktuDibuat = data.waktuDibuat;
    this.waktuPembaruanTerakhir = data.waktuPembaruanTerakhir;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new Percakapan({
      idPercakapan: baris.id_percakapan,
      idPembeli: baris.id_pembeli,
      idPenjual: baris.id_penjual,
      idBarang: baris.id_barang,
      waktuDibuat: baris.waktu_dibuat,
      waktuPembaruanTerakhir: baris.waktu_pembaruan_terakhir,
    });
  }

  // KF32, KF35
  static async cariById(idPercakapan) {
    const { rows } = await db.query(`SELECT ${KOLOM} FROM percakapan WHERE id_percakapan = $1 LIMIT 1`, [
      idPercakapan,
    ]);
    return Percakapan.dariBaris(rows[0]);
  }

  // Algo-040 (KF31)
  static async cariByKombinasi(idBarang, idPembeli, idPenjual) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM percakapan
       WHERE id_barang = $1 AND id_pembeli = $2 AND id_penjual = $3
       LIMIT 1`,
      [idBarang, idPembeli, idPenjual],
    );
    return Percakapan.dariBaris(rows[0]);
  }

  // Algo-041 (KF31). ON CONFLICT menangani dua permintaan bersamaan untuk kombinasi yang sama.
  static async simpan(idBarang, idPembeli, idPenjual) {
    const waktuSekarang = new Date();
    const { rows } = await db.query(
      `INSERT INTO percakapan (${KOLOM})
       VALUES ($1, $2, $3, $4, $5, $5)
       ON CONFLICT (id_barang, id_pembeli, id_penjual) DO NOTHING
       RETURNING ${KOLOM}`,
      [crypto.randomUUID(), idPembeli, idPenjual, idBarang, waktuSekarang],
    );
    return Percakapan.dariBaris(rows[0]) || Percakapan.cariByKombinasi(idBarang, idPembeli, idPenjual);
  }

  // KF35: hanya pembeli dan penjual; admin pun bukan peserta
  cekPeserta(idAkun) {
    return idAkun != null && (idAkun === this.idPembeli || idAkun === this.idPenjual);
  }

  // Algo-046 (KF32, KF36): isi sudah terenkripsi sebelum sampai ke Model
  addPesan(idPengirim, isiPesanTerenkripsi) {
    return Pesan.simpanPesan(this.idPercakapan, idPengirim, isiPesanTerenkripsi);
  }

  // Algo-042 (KF33)
  async perbaruiWaktuTerakhir(waktu) {
    await db.query('UPDATE percakapan SET waktu_pembaruan_terakhir = $1 WHERE id_percakapan = $2', [
      waktu,
      this.idPercakapan,
    ]);
    this.waktuPembaruanTerakhir = waktu;
  }

  // Algo-043 (KF33)
  static async getDaftarPercakapanByPengguna(idAkun) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM percakapan
       WHERE id_pembeli = $1 OR id_penjual = $1
       ORDER BY waktu_pembaruan_terakhir DESC`,
      [idAkun],
    );
    return rows.map(Percakapan.dariBaris);
  }

  // Algo-044 (KF33)
  async getLawanBicara(idAkun) {
    const idLawan = idAkun === this.idPembeli ? this.idPenjual : this.idPembeli;
    const { rows } = await db.query('SELECT id_akun, nama FROM akun WHERE id_akun = $1', [idLawan]);
    return rows[0] ? { idAkun: rows[0].id_akun, nama: rows[0].nama } : null;
  }
}

module.exports = Percakapan;
