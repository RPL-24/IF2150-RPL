// Seluruh konfigurasi ITBELI dibaca dari environment variable di satu tempat ini,
// supaya tidak ada nilai yang di-hardcode di Controller maupun Model.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function angka(nama, bawaan) {
  const nilai = process.env[nama];
  return nilai === undefined || nilai === '' ? bawaan : Number(nilai);
}

module.exports = {
  port: angka('PORT', 3000),

  db: {
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || 'localhost',
    port: angka('DB_PORT', 5432),
    user: process.env.DB_USER || 'itbeli',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'itbeli',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: angka('SMTP_PORT', 1025),
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASS || undefined,
    pengirim: process.env.SUREL_PENGIRIM || 'ITBELI <no-reply@itbeli.local>',
  },

  bcryptSaltRounds: angka('BCRYPT_SALT_ROUNDS', 10),
  durasiSesiJam: angka('DURASI_SESI_JAM', 24),
  durasiKodeMenit: angka('DURASI_KODE_MENIT', 15),
  kunciEnkripsiPesan: process.env.KUNCI_ENKRIPSI_PESAN,
};
