-- =========================================================================
-- Index untuk RPC cari_laporan_duplikat (KF05, issue #104)
-- Hasil profiling: docs/implementasi/profiling/README.md
-- =========================================================================

-- Tanpa index ini, RPC membaca semua laporan aktif (Seq/Bitmap Heap Scan) walau sudah memakai kotak
-- ±0.0003° sebelum haversine; index (status, tahap) yang ada tidak bisa membatasi koordinat.
--
-- Partial: hanya laporan aktif. Predikatnya SAMA PERSIS dengan WHERE di RPC
-- (status in ('diterima','dikerjakan')), syarat planner memakai partial index.
-- Laporan ditolak/berhasil (yang terus bertambah) tidak ikut di-index.
--
-- Urutan kolom: kategori (=) → latitude (rentang kotak, batas range scan)
-- → longitude (rentang kotak, dicek di dalam index sebelum membaca heap).
-- Haversine hanya dihitung untuk baris di dalam kotak.
create index laporan_cari_duplikat_idx on public.laporan (kategori, latitude, longitude)
  where status in ('diterima', 'dikerjakan');
