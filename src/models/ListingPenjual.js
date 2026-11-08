// Operasi tambahan modul listing; kontrak Barang/FotoBarang milik modul lain tetap utuh.
const db = require('../config/db');
const Barang = require('./Barang');
const FotoBarang = require('./FotoBarang');
class ListingPenjual {
  static async transaksi(operasi) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const hasil = await operasi(client);
      await client.query('COMMIT');
      return hasil;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally { client.release(); }
  }
  static async kunci(id, client) {
    const { rows } = await client.query('SELECT * FROM barang WHERE id_barang=$1 FOR UPDATE', [id]);
    return Barang.dariBaris(rows[0]);
  }
  static async akunAktif(id, client = db) {
    const { rows } = await client.query('SELECT status_akun, status_blokir FROM akun WHERE id_akun=$1 FOR SHARE', [id]);
    return rows[0]?.status_akun === 'Terverifikasi' && !rows[0].status_blokir;
  }
  static async update(id, data, client) {
    await client.query(`UPDATE barang SET judul=$2, harga=$3, deskripsi_kondisi=$4,
      id_kategori=$5, id_lokasi=$6, waktu_ubah=now() WHERE id_barang=$1`,
    [id, data.judul, data.harga, data.deskripsiKondisi, data.idKategori, data.idLokasi]);
  }
  static async setStatus(id, pemilik, asal, tujuan, client) {
    const { rowCount } = await client.query(`UPDATE barang SET status=$4, waktu_ubah=now()
      WHERE id_barang=$1 AND id_penjual=$2 AND status=$3`, [id, pemilik, asal, tujuan]);
    return rowCount === 1;
  }
  static async galeri(id, foto, client) {
    await FotoBarang.hapus(id, client);
    for (const [i, f] of foto.entries()) {
      await FotoBarang.simpan(id, f.namaBerkas, f.format, f.ukuran, i + 1, f.pathBerkas, client);
    }
  }
}
module.exports = ListingPenjual;
