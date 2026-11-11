// Mengisi data uji fiktif. Aman dijalankan berulang.
//   npm run db:seed
const crypto = require('crypto');
const db = require('../config/db');
const Kriptografi = require('../pendukung/Kriptografi');
const DOKUMEN_LEGAL = require('./seedDokumenLegal');

// Kata sandi seluruh akun uji. Data fiktif, boleh dicantumkan di README.
const KATA_SANDI_UJI = 'ujicoba123';

const AKUN_UJI = [
  { nama: 'Admin Uji', nim: '13500001', email: 'admin.uji@itb.ac.id', status: 'Terverifikasi', blokir: false, peran: 'Admin' },
  { nama: 'Penjual Uji', nim: '13500002', email: 'penjual.uji@itb.ac.id', status: 'Terverifikasi', blokir: false, peran: 'Pengguna' },
  { nama: 'Pembeli Uji', nim: '13500003', email: 'pembeli.uji@itb.ac.id', status: 'Terverifikasi', blokir: false, peran: 'Pengguna' },
  { nama: 'Diblokir Uji', nim: '13500004', email: 'diblokir.uji@itb.ac.id', status: 'Diblokir', blokir: true, peran: 'Pengguna' },
  { nama: 'Belum Verifikasi Uji', nim: '13500005', email: 'belum.uji@itb.ac.id', status: 'Belum Terverifikasi', blokir: false, peran: 'Pengguna' },
];

async function seedAkun() {
  const hash = await Kriptografi.hash(KATA_SANDI_UJI);
  for (const a of AKUN_UJI) {
    await db.query(
      `INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash,
                         status_akun, status_blokir, peran, setuju_kebijakan, waktu_daftar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, now())
       ON CONFLICT ((LOWER(email))) DO NOTHING`,
      [crypto.randomUUID(), a.nama, a.nim, a.email, hash, a.status, a.blokir, a.peran],
    );
  }
  console.log(`Akun uji siap (${AKUN_UJI.length} akun, kata sandi: ${KATA_SANDI_UJI}).`);
}

// Dijalankan ulang akan memperbarui isi dokumen dengan versi yang sama.
async function seedDokumenLegal() {
  for (const d of DOKUMEN_LEGAL) {
    await db.query(
      `INSERT INTO dokumen_legal (id_dokumen, jenis_dokumen, judul, isi, klausa_privasi_pesan,
                                  versi, tanggal_berlaku, status_publikasi, tautan)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
       ON CONFLICT (jenis_dokumen, versi) DO UPDATE
       SET judul = EXCLUDED.judul, isi = EXCLUDED.isi, klausa_privasi_pesan = EXCLUDED.klausa_privasi_pesan,
           tanggal_berlaku = EXCLUDED.tanggal_berlaku, tautan = EXCLUDED.tautan`,
      [crypto.randomUUID(), d.jenis, d.judul, d.isi, d.klausa, d.versi, d.tanggalBerlaku, d.tautan],
    );
  }
  console.log(`Dokumen legal siap (${DOKUMEN_LEGAL.length} dokumen).`);
}

async function main() {
  await seedAkun();
  await seedDokumenLegal();
}

main()
  .catch((galat) => {
    console.error('Gagal mengisi data uji:', galat.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
