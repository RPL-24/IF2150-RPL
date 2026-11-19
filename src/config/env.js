// Seluruh konfigurasi ITBELI dibaca dari environment variable di satu tempat ini,
// supaya tidak ada nilai yang di-hardcode di Controller maupun Model.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Nilai kosong atau bukan angka memakai nilai bawaan. Tanpa pemeriksaan ini, salah isi seperti
// DURASI_SESI_JAM=abc menjadi NaN dan waktu kedaluwarsa sesi menjadi tanggal yang tidak sah.
function angka(nama, bawaan) {
  const nilai = process.env[nama];
  if (nilai === undefined || nilai.trim() === '') return bawaan;
  const hasil = Number(nilai);
  if (!Number.isFinite(hasil)) {
    console.warn(`Nilai ${nama} bukan angka; memakai nilai bawaan ${bawaan}.`);
    return bawaan;
  }
  return hasil;
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

  // Masuk dengan Google (OAuth 2.0 Authorization Code). Penyedia tanpa kredensial dianggap nonaktif.
  sso: {
    urlDasar: (process.env.SSO_URL_DASAR || 'http://localhost:3000').replace(/\/+$/, ''),
    kunci: process.env.KUNCI_SSO,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Token Vercel Blob (C45 PenyimpananBerkas). Kosong saat lokal: berkas disimpan di src/uploads/.
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || undefined,

  // Kunci VAPID untuk Web Push (C44 PushNotifikasiAdapter, KF34)
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@itbeli.local',
  },
};
