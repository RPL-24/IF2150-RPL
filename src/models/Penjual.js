// C25 Penjual
const db = require('../config/db');
const Akun = require('./Akun');

class Penjual extends Akun {
  // Algo-027: identitas publik penjual untuk kartu produk dan detail listing (KF17)
  static async getIdentitas(idPenjual) {
    const { rows } = await db.query(
      'SELECT id_akun, nama, email, status_akun FROM akun WHERE id_akun = $1',
      [idPenjual],
    );
    if (rows.length === 0) return null;
    return {
      idPenjual: rows[0].id_akun,
      namaPenjual: rows[0].nama,
      emailPenjual: rows[0].email,
      statusVerifikasi: rows[0].status_akun,
    };
  }
}

module.exports = Penjual;
