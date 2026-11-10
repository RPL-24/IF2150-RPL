-- Profiling UC06: query riwayat panel (Algo-039, Q-001) tanpa dan dengan indeks (id_panel, waktu).
--
-- Jalankan dari folder src setelah migrasi terpasang:
--   docker compose exec -T db psql -U fajartech_admin -d fajartech -f - < prisma/profiling/uc06-riwayat-panel.sql
--
-- Skrip membuat 10 panel fiktif PNL-PROF-01..10 dengan data per 5 menit selama 2025
-- (105.120 baris per panel, 1.051.200 baris total), mengukur Q-001, lalu menghapus data itu lagi.

\set ON_ERROR_STOP on
\pset pager off

\echo '== 1. Menyiapkan data profiling =='
DELETE FROM data_historis_kinerja WHERE id_panel LIKE 'PNL-PROF-%';
DELETE FROM perangkat WHERE id_perangkat LIKE 'PNL-PROF-%';

INSERT INTO perangkat (id_perangkat, jenis_perangkat, nama, lokasi, daya_watt, kapasitas)
SELECT format('PNL-PROF-%s', lpad(p::text, 2, '0')), 'PANEL_SURYA', format('Panel Profiling %s', p), 'Data fiktif profiling', 0, 3000
FROM generate_series(1, 10) AS p;

INSERT INTO data_historis_kinerja (id_data, id_panel, waktu, daya_dihasilkan, energi)
SELECT
  format('PROF-%s-%s', p, extract(epoch FROM t)::bigint),
  format('PNL-PROF-%s', lpad(p::text, 2, '0')),
  t,
  greatest(0, 3000 * sin(pi() * (extract(hour FROM t) - 6) / 12)),
  greatest(0, 0.25 * sin(pi() * (extract(hour FROM t) - 6) / 12))
FROM generate_series(1, 10) AS p,
     generate_series(timestamptz '2025-01-01 00:00+07', timestamptz '2025-12-31 23:55+07', interval '5 minutes') AS t;

ANALYZE data_historis_kinerja;
SELECT count(*) AS total_baris, pg_size_pretty(pg_total_relation_size('data_historis_kinerja')) AS ukuran_tabel
FROM data_historis_kinerja;

-- Q-001 untuk satu panel selama satu minggu (2.016 baris).
\set q 'SELECT * FROM data_historis_kinerja WHERE id_panel = ''PNL-PROF-03'' AND waktu BETWEEN ''2025-06-01 00:00+07'' AND ''2025-06-07 23:59:59+07'''

\echo '== 2. SEBELUM: tanpa indeks (id_panel, waktu) =='
BEGIN;
DROP INDEX data_historis_kinerja_id_panel_waktu_idx;
EXPLAIN (ANALYZE, BUFFERS) :q;  -- pemanasan cache
EXPLAIN (ANALYZE, BUFFERS) :q;
ROLLBACK;  -- indeks kembali utuh

\echo '== 3. SESUDAH: dengan indeks (id_panel, waktu) =='
EXPLAIN (ANALYZE, BUFFERS) :q;  -- pemanasan cache
EXPLAIN (ANALYZE, BUFFERS) :q;

\echo '== 4. Membersihkan data profiling =='
DELETE FROM data_historis_kinerja WHERE id_panel LIKE 'PNL-PROF-%';
DELETE FROM perangkat WHERE id_perangkat LIKE 'PNL-PROF-%';
VACUUM ANALYZE data_historis_kinerja;
