// C29 Barang
const crypto = require('crypto');
const db = require('../config/db');

const STATUS = Object.freeze({
  TERSEDIA: 'Tersedia',
  TERJUAL: 'Terjual',
  DINONAKTIFKAN: 'Dinonaktifkan',
});

class Barang {
  static STATUS = STATUS;

  constructor(data) {
    this.idBarang = data.idBarang;
    this.idPenjual = data.idPenjual;
    this.judul = data.judul;
    this.harga = data.harga !== undefined && data.harga !== null ? Number(data.harga) : 0;
    this.deskripsiKondisi = data.deskripsiKondisi;
    this.idKategori = data.idKategori;
    this.idLokasi = data.idLokasi;
    this.status = data.status || STATUS.TERSEDIA;
    this.waktuUnggah = data.waktuUnggah;
    this.waktuUbah = data.waktuUbah;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idBarang: baris.id_barang,
      idPenjual: baris.id_penjual,
      judul: baris.judul,
      harga: baris.harga !== undefined && baris.harga !== null ? Number(baris.harga) : 0,
      deskripsiKondisi: baris.deskripsi_kondisi,
      idKategori: baris.id_kategori,
      idLokasi: baris.id_lokasi,
      status: baris.status,
      waktuUnggah: baris.waktu_unggah,
      waktuUbah: baris.waktu_ubah,
    });
  }

  // Menyimpan data listing barang baru (KF16)
  static async simpan(data, waktu = new Date(), client = db) {
    const idBaru = data.idBarang || crypto.randomUUID();
    const { rows } = await client.query(
      `INSERT INTO barang (
         id_barang, id_penjual, judul, harga, deskripsi_kondisi,
         id_kategori, id_lokasi, status, waktu_unggah, waktu_ubah
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id_barang`,
      [
        idBaru,
        data.idPenjual,
        data.judul,
        data.harga,
        data.deskripsiKondisi,
        data.idKategori || null,
        data.idLokasi || null,
        data.status || STATUS.TERSEDIA,
        waktu,
        waktu,
      ],
    );
    return rows[0].id_barang;
  }

  // Mengambil data lengkap satu listing barang berdasarkan idBarang (KF17)
  static async cariById(idBarang, client = db) {
    const { rows } = await client.query(
      `SELECT id_barang, id_penjual, judul, harga, deskripsi_kondisi,
              id_kategori, id_lokasi, status, waktu_unggah, waktu_ubah
       FROM barang WHERE id_barang = $1 LIMIT 1`,
      [idBarang],
    );
    return this.dariBaris(rows[0]);
  }

  // Seluruh listing milik penjual berstatus Tersedia dan Terjual, terbaru lebih dulu (KF20).
  // Foto utama (urutan terkecil) ikut diambil sebagai fotoUtama untuk kartu produk.
  static async getListingPenjual(idPenjual, client = db) {
    const { rows } = await client.query(
      `SELECT b.id_barang, b.id_penjual, b.judul, b.harga, b.deskripsi_kondisi,
              b.id_kategori, b.id_lokasi, b.status, b.waktu_unggah, b.waktu_ubah,
              (SELECT f.path_berkas FROM foto_barang f
               WHERE f.id_barang = b.id_barang ORDER BY f.urutan LIMIT 1) AS foto_utama
       FROM barang b
       WHERE b.id_penjual = $1 AND b.status IN ($2, $3)
       ORDER BY b.waktu_unggah DESC`,
      [idPenjual, STATUS.TERSEDIA, STATUS.TERJUAL],
    );
    return rows.map((baris) => {
      const barang = this.dariBaris(baris);
      barang.fotoUtama = baris.foto_utama;
      return barang;
    });
  }

  // Menghapus baris rekaman listing barang dari tabel barang pada basis data (KF21, KF50)
  static async hapus(idBarang, client = db) {
    const { rowCount } = await client.query(
      `DELETE FROM barang WHERE id_barang = $1`,
      [idBarang],
    );
    return rowCount > 0;
  }

  // Mengubah status seluruh barang milik pengguna yang diblokir menjadi "Dinonaktifkan" (KF54)
  static async nonaktifkanByPemilik(idPenjual, client = db) {
    const { rowCount } = await client.query(
      `UPDATE barang
       SET status = $1, waktu_ubah = now()
       WHERE id_penjual = $2 AND status = $3`,
      [STATUS.DINONAKTIFKAN, idPenjual, STATUS.TERSEDIA],
    );
    return rowCount >= 0;
  }

  // Memulihkan status barang milik pengguna yang blokirnya dibuka (UC24)
  static async pulihkanKatalog(idPenjual, client = db) {
    const { rowCount } = await client.query(
      `UPDATE barang
       SET status = $1, waktu_ubah = now()
       WHERE id_penjual = $2 AND status = $3`,
      [STATUS.TERSEDIA, idPenjual, STATUS.DINONAKTIFKAN],
    );
    return rowCount >= 0;
  }

  // Mengembalikan status barang
  getStatus() {
    return this.status;
  }
}

module.exports = Barang;
