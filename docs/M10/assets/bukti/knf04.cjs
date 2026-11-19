// docs/M10/assets/bukti/knf04.cjs
// KNF04 Scalability: "Sistem harus mampu menampung seluruh akun sivitas ITB beserta aktivitas mereka."
//
// Target terukur (usulan Modul C, perlu disepakati tim sesuai keputusan K6):
//   - Basis data menampung 40.000 akun (pembulatan ke atas dari 28.650 mahasiswa ITB menurut
//     THE World University Rankings 2025, ditambah ±1.760 dosen dari rasio 16,3 mahasiswa per staf,
//     tenaga kependidikan, dan pertumbuhan) dan 120.000 listing (rata-rata 3 listing per akun) beserta 360.000 foto.
//   - Pada data tersebut, Barang.getKatalog (kode asli `src/models/Barang.js`) untuk enam skenario katalog dan
//     pencarian memiliki median ≤ 200 ms dan waktu maksimum ≤ 500 ms, serta pencarian akun berdasarkan surel
//     (pemeriksaan pendaftaran dan login) median ≤ 50 ms.
//
// Skrip ini membuat basis data TERPISAH `itbeli_knf04` (data pengembangan tidak tersentuh), mengisinya,
// lalu mengukur. Jalankan dari folder src/ dengan PostgreSQL Docker menyala:
//   node ../docs/M10/assets/bukti/knf04.cjs 2>&1 | tee ../docs/M10/assets/bukti/KNF04-TC01.txt
// Setelah selesai, basis data uji boleh dihapus:
//   docker compose exec db dropdb -U itbeli itbeli_knf04
const path = require('path');
const fs = require('fs');
const os = require('os');

const SRC = path.join(__dirname, '..', '..', '..', '..', 'src');
require(path.join(SRC, 'node_modules', 'dotenv')).config({ path: path.join(SRC, '.env') });
const { Client, Pool } = require(path.join(SRC, 'node_modules', 'pg'));

const NAMA_DB = 'itbeli_knf04';
const J_AKUN = 40000;
const J_BARANG = 120000;
const N = Number(process.env.N) || 30;
const TARGET_MEDIAN_MS = 200;
const TARGET_MAKS_MS = 500;
const TARGET_AKUN_MS = 50;

const koneksi = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'itbeli',
  password: process.env.DB_PASSWORD,
};

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const ms = (mulai) => Number(process.hrtime.bigint() - mulai) / 1e6;

async function siapkanBasisData() {
  const admin = new Client({ ...koneksi, database: 'postgres' });
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS ${NAMA_DB} WITH (FORCE)`);
  await admin.query(`CREATE DATABASE ${NAMA_DB}`);
  await admin.end();
}

async function isi(pool) {
  const skema = fs.readFileSync(path.join(SRC, 'database', 'schema.sql'), 'utf8').replace(/^﻿/, '');
  await pool.query(skema);
  await pool.query('SELECT setseed(0.42)');
  // Akun: 2% diblokir, 1 admin
  await pool.query(`
    INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, peran, setuju_kebijakan, waktu_daftar)
    SELECT gen_random_uuid(), 'Pengguna ' || g, (13500000 + g)::text, 'uji' || g || '@itb.ac.id', repeat('x', 60),
           CASE WHEN g % 50 = 0 THEN 'Diblokir' ELSE 'Terverifikasi' END, g % 50 = 0,
           CASE WHEN g = 1 THEN 'Admin' ELSE 'Pengguna' END, true, now() - (random() * interval '300 days')
    FROM generate_series(1, ${J_AKUN}) g`);
  // Listing: 80% Tersedia, 15% Terjual, 5% Dinonaktifkan (sebaran sama dengan profiling M9)
  await pool.query(`
    WITH a AS (SELECT id_akun, row_number() OVER () AS n FROM akun),
    k AS (SELECT * FROM (VALUES
      (0,'Jas praktikum','Jas praktikum kimia'),(1,'Buku kuliah','Buku kalkulus Purcell'),(2,'Alat laboratorium','Multimeter digital'),
      (3,'Kalkulator','Kalkulator Casio fx-991'),(4,'Jaket himpunan','Jaket himpunan'),(5,'Perlengkapan kos','Meja belajar lipat')) v(i, kategori, benda)),
    l AS (SELECT * FROM (VALUES (0,'Labtek V'),(1,'Labtek VI'),(2,'Labtek X'),(3,'Gedung Oktagon'),(4,'Perpustakaan Pusat'),(5,'Gerbang Belakang')) v(i, lokasi)),
    s AS (SELECT * FROM (VALUES (0,'bekas satu semester'),(1,'kondisi mulus'),(2,'masih segel'),(3,'ada coretan sedikit'),(4,'ukuran L'),(5,'ukuran M'),(6,'lengkap dengan kotak'),(7,'jarang dipakai')) v(i, sifat))
    INSERT INTO barang (id_barang, id_penjual, judul, harga, deskripsi_kondisi, id_kategori, id_lokasi, status, waktu_unggah, waktu_ubah)
    SELECT gen_random_uuid(), a.id_akun, k.benda || ' ' || s.sifat || ' #' || g,
           (5 + floor(random() * 995))::int * 1000,
           'Dijual ' || lower(k.benda) || ', ' || s.sifat || '. ' || repeat('Barang terawat, dipakai selama kuliah di ITB, bisa COD di kampus Ganesha. ', 3),
           k.kategori, l.lokasi,
           CASE WHEN g % 20 = 0 THEN 'Dinonaktifkan' WHEN g % 20 < 4 THEN 'Terjual' ELSE 'Tersedia' END,
           t.w, t.w
    FROM generate_series(1, ${J_BARANG}) g
    JOIN a ON a.n = 1 + (g * 7919) % ${J_AKUN}
    JOIN k ON k.i = (g * 31) % 6
    JOIN l ON l.i = (g * 17) % 6
    JOIN s ON s.i = (g * 13) % 8
    CROSS JOIN LATERAL (SELECT now() - ((g * 0 + random()) * interval '180 days') AS w) t`);
  await pool.query(`
    INSERT INTO foto_barang (id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas)
    SELECT gen_random_uuid(), b.id_barang, 'foto' || u || '.jpg', 'jpg', 250000, u, '/uploads/' || b.id_barang || '/' || gen_random_uuid() || '.jpg'
    FROM barang b CROSS JOIN generate_series(0, 2) u`);
  await pool.query('VACUUM ANALYZE');
  const { rows } = await pool.query(`
    SELECT (SELECT count(*) FROM akun)::int AS akun,
           (SELECT count(*) FROM akun WHERE status_blokir)::int AS akun_diblokir,
           (SELECT count(*) FROM barang)::int AS barang,
           (SELECT count(*) FROM barang WHERE status = 'Tersedia')::int AS tersedia,
           (SELECT count(*) FROM foto_barang)::int AS foto,
           pg_size_pretty(pg_database_size(current_database())) AS ukuran_db,
           version() AS versi`);
  return rows[0];
}

async function ukur(pool) {
  const Barang = require(path.join(SRC, 'models', 'Barang.js'));
  const Pencarian = require(path.join(SRC, 'controllers', 'PencarianController.js'));
  const SKENARIO = [
    ['A katalog beranda (tanpa filter, terbaru, halaman 1)', {}],
    ['B cari "jas praktikum"', { daftarKata: Pencarian.siapkanPencarian('jas praktikum').daftarKata }],
    ['C kategori Kalkulator + harga 50.000-200.000 + termurah', { kategori: 'Kalkulator', hargaMin: 50000, hargaMaks: 200000, urut: 'termurah' }],
    ['D katalog halaman 500 (offset 9.980)', { offset: 9980 }],
    ['E cari kata yang tidak ada', { daftarKata: ['zzzqqq'] }],
    ['F cari "kalkulator" + lokasi Labtek V + termahal', { daftarKata: ['kalkulator'], lokasi: 'Labtek V', urut: 'termahal' }],
  ];
  const hasil = [];
  for (const [nama, kriteria] of SKENARIO) {
    const k = { batas: 20, offset: 0, ...kriteria };
    for (let i = 0; i < 3; i += 1) await Barang.getKatalog(k, pool); // pemanasan
    const waktu = [];
    let r;
    for (let i = 0; i < N; i += 1) {
      const t0 = process.hrtime.bigint();
      r = await Barang.getKatalog(k, pool);
      waktu.push(ms(t0));
    }
    hasil.push({ nama, total: r.total, kembali: r.daftar.length, median: median(waktu), maks: Math.max(...waktu), min: Math.min(...waktu) });
  }

  // Pencarian akun berdasarkan surel, kueri yang sama dengan Akun.cariByEmail (indeks akun_email_unik)
  const waktuAkun = [];
  for (let i = 0; i < N; i += 1) {
    const surel = `uji${1 + Math.floor(Math.random() * J_AKUN)}@itb.ac.id`;
    const t0 = process.hrtime.bigint();
    await pool.query('SELECT * FROM akun WHERE LOWER(email) = LOWER($1) LIMIT 1', [surel]);
    waktuAkun.push(ms(t0));
  }
  const rencanaAkun = await pool.query("EXPLAIN SELECT * FROM akun WHERE LOWER(email) = LOWER('uji123@itb.ac.id') LIMIT 1");
  return { hasil, akun: { median: median(waktuAkun), maks: Math.max(...waktuAkun) }, rencanaAkun: rencanaAkun.rows.map((b) => b['QUERY PLAN']) };
}

(async () => {
  console.log(`===== KNF04-TC01 Scalability (${new Date().toISOString()}) =====`);
  console.log(`Mesin: ${os.cpus()[0].model}, ${os.cpus().length} thread, RAM ${(os.totalmem() / 2 ** 30).toFixed(1)} GB; Node ${process.version}; N=${N} pengukuran per skenario`);
  await siapkanBasisData();
  const pool = new Pool({ ...koneksi, database: NAMA_DB, max: 1 });
  const t0 = process.hrtime.bigint();
  const data = await isi(pool);
  console.log(`\nPengisian data selesai dalam ${(ms(t0) / 1000).toFixed(1)} detik:`);
  console.log(`  akun ${data.akun} (diblokir ${data.akun_diblokir}), listing ${data.barang} (Tersedia ${data.tersedia}), foto ${data.foto}, ukuran basis data ${data.ukuran_db}`);
  console.log(`  ${data.versi}`);

  const { hasil, akun, rencanaAkun } = await ukur(pool);
  console.log(`\nTarget: median ≤ ${TARGET_MEDIAN_MS} ms dan maksimum ≤ ${TARGET_MAKS_MS} ms per skenario katalog; pencarian akun median ≤ ${TARGET_AKUN_MS} ms\n`);
  console.log('| Skenario | Total cocok | Dikembalikan | Median (ms) | Min (ms) | Maks (ms) | Memenuhi |');
  console.log('| :--- | ---: | ---: | ---: | ---: | ---: | :---: |');
  let semua = true;
  for (const h of hasil) {
    const ok = h.median <= TARGET_MEDIAN_MS && h.maks <= TARGET_MAKS_MS;
    semua = semua && ok;
    console.log(`| ${h.nama} | ${h.total} | ${h.kembali} | ${h.median.toFixed(1)} | ${h.min.toFixed(1)} | ${h.maks.toFixed(1)} | ${ok ? 'Ya' : 'Tidak'} |`);
  }
  const okAkun = akun.median <= TARGET_AKUN_MS;
  semua = semua && okAkun && data.akun >= J_AKUN && data.barang >= J_BARANG;
  console.log(`| G cari akun berdasarkan surel (acak dari ${J_AKUN}) | 1 | 1 | ${akun.median.toFixed(1)} | - | ${akun.maks.toFixed(1)} | ${okAkun ? 'Ya' : 'Tidak'} |`);
  console.log(`\nRencana kueri akun: ${rencanaAkun.join(' / ')}`);
  console.log(`\nKESIMPULAN: ${semua ? 'PASS' : 'FAIL'}`);
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
