// Mengisi basis data KOSONG dengan data sintetis untuk profiling katalog (5.000 akun, 50.000 listing, 150.000 foto).
// PERINGATAN: skrip ini menghapus seluruh isi schema public. Jalankan hanya pada basis data khusus profiling.
//   PGHOST=... PGPORT=... PGUSER=... PGPASSWORD=... PGDATABASE=... node isi-data-uji.js ../../../../src
const fs = require('fs'); const path = require('path'); const { Pool } = require('pg');
const SRC = process.argv[2];
const pool = new Pool(); // koneksi dari variabel lingkungan PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
const J_AKUN = 5000, J_BARANG = 50000;
(async () => {
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  const skema = fs.readFileSync(path.join(SRC, 'database', 'schema.sql'), 'utf8').replace(/^﻿/, '');
  await pool.query(skema);
  await pool.query('SELECT setseed(0.42)');
  // 5.000 akun, 2% diblokir
  await pool.query(`
    INSERT INTO akun (id_akun, nama, nim, email, kata_sandi_hash, status_akun, status_blokir, peran, setuju_kebijakan, waktu_daftar)
    SELECT gen_random_uuid(), 'Pengguna ' || g, (13500000 + g)::text, 'uji' || g || '@itb.ac.id', repeat('x', 60),
           CASE WHEN g % 50 = 0 THEN 'Diblokir' ELSE 'Terverifikasi' END, g % 50 = 0, 'Pengguna', true,
           now() - (random() * interval '300 days')
    FROM generate_series(1, ${J_AKUN}) g`);
  // 50.000 listing: 80% Tersedia, 15% Terjual, 5% Dinonaktifkan
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
  // 3 foto per listing
  await pool.query(`
    INSERT INTO foto_barang (id_foto, id_barang, nama_berkas, format, ukuran, urutan, path_berkas)
    SELECT gen_random_uuid(), b.id_barang, 'foto' || u || '.jpg', 'jpg', 250000, u, '/uploads/' || b.id_barang || '/' || gen_random_uuid() || '.jpg'
    FROM barang b CROSS JOIN generate_series(1, 3) u`);
  await pool.query('VACUUM ANALYZE');
  const r = await pool.query(`SELECT (SELECT count(*) FROM akun) akun, (SELECT count(*) FROM barang) barang,
    (SELECT count(*) FROM barang WHERE status='Tersedia') tersedia, (SELECT count(*) FROM foto_barang) foto,
    pg_size_pretty(pg_total_relation_size('barang')) ukuran_barang, version() v`);
  console.log(r.rows[0]);
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
