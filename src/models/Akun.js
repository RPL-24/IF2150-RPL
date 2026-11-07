// C23 Akun
const crypto = require('crypto');
const db = require('../config/db');

const STATUS = Object.freeze({
  BELUM_TERVERIFIKASI: 'Belum Terverifikasi',
  TERVERIFIKASI: 'Terverifikasi',
  DIBLOKIR: 'Diblokir',
});

const PERAN = Object.freeze({
  PENGGUNA: 'Pengguna',
  ADMIN: 'Admin',
});

const KOLOM = `id_akun, nama, nim, email, kata_sandi_hash,
               status_akun, status_blokir, peran, setuju_kebijakan, waktu_daftar`;

class Akun {
  static STATUS = STATUS;
  static PERAN = PERAN;

  constructor(data) {
    this.idAkun = data.idAkun;
    this.nama = data.nama;
    this.nim = data.nim;
    this.email = data.email;
    this.kataSandiHash = data.kataSandiHash;
    this.statusAkun = data.statusAkun;
    this.statusBlokir = data.statusBlokir;
    this.peran = data.peran;
    this.setujuKebijakan = data.setujuKebijakan;
    this.waktuDaftar = data.waktuDaftar;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idAkun: baris.id_akun,
      nama: baris.nama,
      nim: baris.nim,
      email: baris.email,
      kataSandiHash: baris.kata_sandi_hash,
      statusAkun: baris.status_akun,
      statusBlokir: baris.status_blokir,
      peran: baris.peran,
      setujuKebijakan: baris.setuju_kebijakan,
      waktuDaftar: baris.waktu_daftar,
    });
  }

  // Algo-025: simpan akun baru, kembalikan idAkun (KF02, KF09)
  static async simpan(nama, nim, email, kataSandiHash, statusAkun, setujuKebijakan) {
    const idBaru = crypto.randomUUID();
    await db.query(
      `INSERT INTO akun (${KOLOM})
       VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8, now())`,
      [idBaru, nama, nim, email.trim().toLowerCase(), kataSandiHash, statusAkun, PERAN.PENGGUNA, setujuKebijakan],
    );
    return idBaru;
  }

  // Algo-026: cari akun berdasarkan surel (KF05, KF10)
  static async cariByEmail(email) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM akun WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email.trim()],
    );
    return this.dariBaris(rows[0]);
  }

  static async cariById(idAkun) {
    const { rows } = await db.query(`SELECT ${KOLOM} FROM akun WHERE id_akun = $1`, [idAkun]);
    return this.dariBaris(rows[0]);
  }

  // Kriteria kueri akun tidak diblokir untuk digabung ke kueri katalog (KF30, KF54)
  static getSyaratTidakDiblokir() {
    return { statusBlokir: false };
  }

  // KF53
  static async getStatusBlokir(idAkun) {
    const { rows } = await db.query('SELECT status_blokir FROM akun WHERE id_akun = $1', [idAkun]);
    return rows.length > 0 && rows[0].status_blokir === true;
  }

  // KF07, KF51
  async perbaruiStatusAkun(status, client = db) {
    const { rowCount } = await client.query('UPDATE akun SET status_akun = $1 WHERE id_akun = $2', [status, this.idAkun]);
    if (rowCount > 0) this.statusAkun = status;
    return rowCount > 0;
  }

  getStatusAkun() {
    return this.statusBlokir ? STATUS.DIBLOKIR : this.statusAkun;
  }

  // KF04
  getDataIdentitas() {
    return { nama: this.nama, email: this.email, nim: this.nim };
  }

  // KF51
  async blokir(client = db) {
    const { rowCount } = await client.query(
      'UPDATE akun SET status_akun = $1, status_blokir = true WHERE id_akun = $2',
      [STATUS.DIBLOKIR, this.idAkun],
    );
    if (rowCount > 0) {
      this.statusAkun = STATUS.DIBLOKIR;
      this.statusBlokir = true;
    }
    return rowCount > 0;
  }

  // KF51
  async bukaBlokir(client = db) {
    const { rowCount } = await client.query(
      'UPDATE akun SET status_akun = $1, status_blokir = false WHERE id_akun = $2',
      [STATUS.TERVERIFIKASI, this.idAkun],
    );
    if (rowCount > 0) {
      this.statusAkun = STATUS.TERVERIFIKASI;
      this.statusBlokir = false;
    }
    return rowCount > 0;
  }
}

module.exports = Akun;
