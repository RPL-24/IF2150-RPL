const db = require('../db/database');

// Daftar tabel akun
const DAFTAR_AKUN = [
  { peran: 'masyarakat', tabel: 'Masyarakat', kolomId: 'idMasyarakat', kolomSandi: 'sandi', kolomStatus: 'statusAkun' },
  { peran: 'mitra', tabel: 'MitraPengacara', kolomId: 'idMitra', kolomSandi: 'sandiMitra', kolomStatus: 'statusAkun' },
  { peran: 'admin', tabel: 'Admin', kolomId: 'idAdmin', kolomSandi: 'sandi', kolomStatus: "'aktif'" }
];

exports.cariByEmail = (email) => {
  for (const a of DAFTAR_AKUN) {
    const baris = db.prepare(
      `SELECT ${a.kolomId} AS id, nama, ${a.kolomSandi} AS sandi, ${a.kolomStatus} AS statusAkun
       FROM ${a.tabel} WHERE email = ?`
    ).get(email);
    if (baris) return { ...baris, peran: a.peran };
  }
  return null;
};