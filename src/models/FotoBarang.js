// C30 FotoBarang
const crypto = require('crypto');
const db = require('../config/db');

class FotoBarang {
  constructor(data) {
    this.idFoto = data.idFoto;
    this.idBarang = data.idBarang;
    this.namaBerkas = data.namaBerkas;
    this.format = data.format;
    this.ukuran = data.ukuran !== undefined && data.ukuran !== null ? Number(data.ukuran) : 0;
    this.urutan = data.urutan;
    this.pathBerkas = data.pathBerkas;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idFoto: baris.id_foto,
      idBarang: baris.id_barang,
      namaBerkas: baris.nama_berkas,
      format: baris.format,
      ukuran: baris.ukuran !== undefined && baris.ukuran !== null ? Number(baris.ukuran) : 0,
      urutan: baris.urutan,
      pathBerkas: baris.path_berkas,
    });
  }

  // Validasi format file foto (JPG, PNG) (KF23, KF24)
  static validasiFormat(format) {
    if (!format) return false;
    const f = format.toLowerCase().replace(/^\./, '');
    return ['jpg', 'jpeg', 'png'].includes(f);
  }

  // Validasi batas ukuran maksimum 5MB (KF23, KF24)
  static validasiUkuran(ukuran) {
    const MAKS_UKURAN = 5 * 1024 * 1024; // 5 MB = 5.242.880 bytes
    return typeof ukuran === 'number' && ukuran > 0 && ukuran <= MAKS_UKURAN;
  }

  // Menyimpan rekaman metadata foto barang (KF23)
  static async simpan(idBarang, namaBerkas, format, ukuran, urutan, pathBerkas, client = db) {
    const idBaru = crypto.randomUUID();
    const { rowCount } = await client.query(
      `INSERT INTO foto_barang (
         id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [idBaru, idBarang, namaBerkas, format, ukuran, urutan, pathBerkas],
    );
    return rowCount > 0;
  }

  // Mengambil seluruh foto untuk sebuah listing diurutkan berdasarkan urutan (KF17)
  static async getGaleri(idBarang, client = db) {
    const { rows } = await client.query(
      `SELECT id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas
       FROM foto_barang WHERE id_barang = $1 ORDER BY urutan ASC`,
      [idBarang],
    );
    return rows.map((b) => this.dariBaris(b));
  }

  // Menghapus seluruh rekaman metadata foto milik listing barang dari tabel foto_barang (KF21, KF50)
  static async hapus(idBarang, client = db) {
    const { rowCount } = await client.query(
      `DELETE FROM foto_barang WHERE id_barang = $1`,
      [idBarang],
    );
    return rowCount >= 0;
  }
}

module.exports = FotoBarang;
