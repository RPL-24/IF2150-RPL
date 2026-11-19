// C26 Admin
const db = require('../config/db');
const Akun = require('./Akun');

class Admin extends Akun {
  // Algo-028: akun berperan Admin dan tidak diblokir (KF56)
  static async verifikasiPeran(idAkun) {
    const { rows } = await db.query(
      `SELECT COUNT(*)::int AS jumlah FROM akun
       WHERE id_akun = $1 AND peran = $2 AND status_blokir = false`,
      [idAkun, Akun.PERAN.ADMIN],
    );
    return rows[0].jumlah > 0;
  }
}

module.exports = Admin;
