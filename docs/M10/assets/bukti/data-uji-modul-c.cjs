// docs/M10/assets/bukti/data-uji-modul-c.cjs
// Data uji untuk pengujian use case Modul C (UC13–UC15) pada ITBELI lokal.
// Membutuhkan akun dari `npm run db:seed` (penjual.uji, pembeli.uji, diblokir.uji; kata sandi ujicoba123).
//
// Jalankan dari folder src/:
//   node ../docs/M10/assets/bukti/data-uji-modul-c.cjs            isi ulang data uji Modul C
//   node ../docs/M10/assets/bukti/data-uji-modul-c.cjs --kosongkan  sembunyikan SEMUA listing Tersedia (UC13 Alt 1)
//   node ../docs/M10/assets/bukti/data-uji-modul-c.cjs --pulihkan   kembalikan listing yang disembunyikan --kosongkan
//   node ../docs/M10/assets/bukti/data-uji-modul-c.cjs --hapus      hapus data uji Modul C beserta fotonya
//
// Hanya untuk basis data pengembangan lokal. Setiap listing uji ditandai akhiran PENANDA pada deskripsinya.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', '..', '..', 'src');
const db = require(path.join(SRC, 'config', 'db'));
const DIR_UPLOADS = path.join(SRC, 'uploads');
const DIR_PRODUK = path.join(__dirname, 'produk');
const PENANDA = ' (data uji Modul C)';
const MENIT = 60 * 1000;

// [judul, harga, kategori, lokasi, foto]
const LISTING_PENJUAL = [
  ['Jas Praktikum Kimia Lab Dasar', 75000, 'Jas praktikum', 'Labtek V', []],
  ['Jas Praktikum Biologi Ukuran M', 120000, 'Jas praktikum', 'Labtek V', []],
  ['Jas Praktikum Ukuran L Hampir Baru', 160000, 'Jas praktikum', 'Labtek V', []],
  ['Jas Praktikum Fisika Dasar', 90000, 'Jas praktikum', 'Labtek VI', []],
  ['Buku Introduction to Algorithms', 185000, 'Buku kuliah', 'Perpustakaan Pusat', ['buku-algoritma.jpeg']],
  ['Buku Kalkulus Purcell Jilid 1', 65000, 'Buku kuliah', 'Labtek V', []],
  ['Buku Fisika Dasar Halliday', 80000, 'Buku kuliah', 'Labtek VI', []],
  ['Buku Kimia Dasar Chang', 70000, 'Buku kuliah', 'Labtek X', []],
  ['Kalkulator Casio fx-991ID Plus', 150000, 'Kalkulator', 'Labtek V', []],
  ['Kalkulator Casio fx-570ES', 95000, 'Kalkulator', 'Gedung Oktagon', []],
  ['Kalkulator Grafik TI-84', 450000, 'Kalkulator', 'Labtek VI', []],
  ['Gelas Ukur 100 mL Set', 40000, 'Alat laboratorium', 'Labtek X', []],
  ['Pipet Tetes dan Rak Tabung', 35000, 'Alat laboratorium', 'Labtek X', []],
  ['Kacamata Lab Pelindung', 30000, 'Alat laboratorium', 'Labtek V', []],
  ['Jaket Himpunan HMIF Ukuran L', 110000, 'Jaket himpunan', 'Gedung Oktagon', []],
  ['Jaket Himpunan HME Ukuran M', 100000, 'Jaket himpunan', 'Gerbang Belakang', []],
  ['Kipas Angin Meja Bekas Kos', 85000, 'Perlengkapan kos', 'Gerbang Belakang', []],
  ['Rice Cooker Mini 0,8 L', 120000, 'Perlengkapan kos', 'Gerbang Belakang', []],
  ['Lampu Belajar LED', 45000, 'Perlengkapan kos', 'Perpustakaan Pusat', []],
  ['Rak Buku Lipat', 60000, 'Perlengkapan kos', 'Gerbang Belakang', []],
  ['Earbuds Bluetooth Bekas Pakai', 130000, 'Perlengkapan kos', 'Labtek V', ['earbuds.jpeg']],
  ['Paket HP Android dan Earbuds', 950000, 'Perlengkapan kos', 'Labtek VI', ['hape.jpeg', 'earbuds.jpeg', 'buku-algoritma.jpeg']],
];

async function idAkun(email) {
  const { rows } = await db.query('SELECT id_akun FROM akun WHERE LOWER(email) = LOWER($1)', [email]);
  if (!rows[0]) throw new Error(`Akun ${email} belum ada. Jalankan "npm run db:seed" dulu.`);
  return rows[0].id_akun;
}

async function hapusDataUji() {
  const { rows } = await db.query('SELECT id_barang FROM barang WHERE deskripsi_kondisi LIKE $1', [`%${PENANDA}`]);
  for (const { id_barang: id } of rows) {
    fs.rmSync(path.join(DIR_UPLOADS, id), { recursive: true, force: true });
  }
  await db.query('DELETE FROM barang WHERE deskripsi_kondisi LIKE $1', [`%${PENANDA}`]);
  return rows.length;
}

async function buatListing(idPenjual, [judul, harga, kategori, lokasi, foto], waktu, status = 'Tersedia') {
  const idBarang = crypto.randomUUID();
  await db.query(
    `INSERT INTO barang (id_barang, id_penjual, judul, harga, deskripsi_kondisi, id_kategori, id_lokasi,
                         status, waktu_unggah, waktu_ubah)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
    [idBarang, idPenjual, judul, harga, `Kondisi baik, masih layak pakai.${PENANDA}`, kategori, lokasi, status, waktu],
  );
  for (const [urutan, berkas] of foto.entries()) {
    const sumber = path.join(DIR_PRODUK, berkas);
    if (!fs.existsSync(sumber)) continue;
    const dir = path.join(DIR_UPLOADS, idBarang);
    fs.mkdirSync(dir, { recursive: true });
    const nama = `${urutan}-${berkas}`;
    fs.copyFileSync(sumber, path.join(dir, nama));
    await db.query(
      `INSERT INTO foto_barang (id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas)
       VALUES ($1, $2, $3, 'jpeg', $4, $5, $6)`,
      [crypto.randomUUID(), idBarang, berkas, fs.statSync(sumber).size, urutan, `/uploads/${idBarang}/${nama}`],
    );
  }
  return idBarang;
}

async function isi() {
  const penjual = await idAkun('penjual.uji@itb.ac.id');
  const diblokir = await idAkun('diblokir.uji@itb.ac.id');
  const lama = await hapusDataUji();

  const awal = Date.now() - LISTING_PENJUAL.length * MENIT;
  const hasil = {};
  for (const [i, data] of LISTING_PENJUAL.entries()) {
    hasil[data[0]] = await buatListing(penjual, data, new Date(awal + i * MENIT));
  }
  const terjual = await buatListing(
    penjual, ['Buku Statistika Walpole (sudah terjual)', 90000, 'Buku kuliah', 'Labtek V', []], new Date(awal - MENIT), 'Terjual',
  );
  const nonaktif = await buatListing(
    penjual, ['Listing Dinonaktifkan Uji', 50000, 'Buku kuliah', 'Labtek V', []], new Date(awal - 2 * MENIT), 'Dinonaktifkan',
  );
  const milikDiblokir = await buatListing(
    diblokir, ['Listing Milik Akun Diblokir', 50000, 'Buku kuliah', 'Labtek V', []], new Date(),
  );

  console.log(`Data uji lama dihapus: ${lama} listing.`);
  console.log(`Dibuat ${LISTING_PENJUAL.length} listing Tersedia milik penjual.uji, 1 Terjual, 1 Dinonaktifkan, 1 milik diblokir.uji.\n`);
  console.log('Tautan detail untuk pengujian UC15 (buka setelah masuk):');
  console.log(`  Normal, 3 foto      : http://localhost:3000/barang?id=${hasil['Paket HP Android dan Earbuds']}`);
  console.log(`  Terjual (Alt 3)     : http://localhost:3000/barang?id=${terjual}`);
  console.log(`  Dinonaktifkan       : http://localhost:3000/barang?id=${nonaktif}`);
  console.log(`  Milik akun diblokir : http://localhost:3000/barang?id=${milikDiblokir}`);
  console.log(`  Tidak ada (Alt 2)   : http://localhost:3000/barang?id=${crypto.randomUUID()}`);
}

async function kosongkan() {
  await db.query('CREATE TABLE IF NOT EXISTS uji_modul_c_cadangan (id_barang UUID PRIMARY KEY)');
  const { rowCount } = await db.query(
    `WITH disembunyikan AS (
       UPDATE barang SET status = 'Dinonaktifkan' WHERE status = 'Tersedia' RETURNING id_barang)
     INSERT INTO uji_modul_c_cadangan SELECT id_barang FROM disembunyikan ON CONFLICT DO NOTHING`,
  );
  console.log(`${rowCount} listing Tersedia disembunyikan sementara. Jalankan --pulihkan setelah UC13 Alternatif 1.`);
}

async function pulihkan() {
  await db.query('CREATE TABLE IF NOT EXISTS uji_modul_c_cadangan (id_barang UUID PRIMARY KEY)');
  const { rowCount } = await db.query(
    `UPDATE barang SET status = 'Tersedia' WHERE id_barang IN (SELECT id_barang FROM uji_modul_c_cadangan)`,
  );
  await db.query('DROP TABLE uji_modul_c_cadangan');
  console.log(`${rowCount} listing dikembalikan menjadi Tersedia.`);
}

async function main() {
  const mode = process.argv[2];
  if (mode === '--kosongkan') return kosongkan();
  if (mode === '--pulihkan') return pulihkan();
  if (mode === '--hapus') return console.log(`Dihapus: ${await hapusDataUji()} listing data uji Modul C.`);
  return isi();
}

main()
  .catch((galat) => {
    console.error('Gagal:', galat.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
