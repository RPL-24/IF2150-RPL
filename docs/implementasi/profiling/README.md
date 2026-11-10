# Profiling RPC `cari_laporan_duplikat`

Bahan laporan B.2.1 (Profiling dan Optimasi). Issue: #104.

## Tujuan

RPC `cari_laporan_duplikat(p_lat, p_lng, p_kategori)` dipanggil `LaporanController.kirimLaporan()` setiap kali warga mengirim laporan (KF05: laporan aktif sekategori dalam radius ≤ 20 m). Query ini menghitung haversine dan makin berat seiring jumlah laporan bertambah, jadi dipilih sebagai fitur yang diprofil.

Acceptance criteria issue #104:

- [x] Uji performa `cari_laporan_duplikat` dengan dataset besar (±10.000 laporan) → skrip [`benchmark-cari-duplikat.sql`](benchmark-cari-duplikat.sql).
- [ ] Catat metrik awal (sequential/bitmap scan) dengan `EXPLAIN ANALYZE` → bagian [Hasil](#hasil), **diisi dari SQL Editor**.
- [x] Optimasi index (kategori, status) + penyaringan bounding box sebelum haversine → migration [`20261110140216_index_cari_duplikat.sql`](../../../supabase/migrations/20261110140216_index_cari_duplikat.sql); bounding box sudah ada di RPC sejak migration `20261107155512_trigger_status.sql`.
- [ ] Catat metrik sesudah optimasi + tabel perbandingan → bagian [Hasil](#hasil), **diisi dari SQL Editor**.

## Yang dibandingkan

| Metode | Isi | Mewakili |
|---|---|---|
| 1 naif | Haversine ke **semua** laporan aktif sekategori, tanpa kotak, tanpa index baru | Implementasi langsung DPPL (`cekDuplikat()` menghitung jarak ke setiap laporan) |
| 2 RPC tanpa index | `public.cari_laporan_duplikat(...)` dengan kotak ±0.0003° (≈ 33 m) sebelum haversine, tanpa index baru | RPC sebelum issue ini |
| 3 RPC + index | RPC yang sama + index `laporan_cari_duplikat_idx` | Kondisi sesudah migration |

Index yang dipakai (partial, hanya laporan aktif):

```sql
create index laporan_cari_duplikat_idx on public.laporan (kategori, latitude, longitude)
  where status in ('diterima', 'dikerjakan');
```

Isi fungsi RPC **tidak diubah**: kotak sudah ada, yang kurang hanya index yang bisa memakainya.

### Kandidat index yang dipertimbangkan

Diuji di PGlite (PostgreSQL 18 versi WASM, data dan skrip yang sama). Angka waktu PGlite tidak dipakai untuk laporan, hanya jenis scan dan jumlah blok yang dibaca:

| Kandidat | Scan isi RPC | Blok dibaca (titik ada duplikat) | Baris dibuang filter | Ukuran index |
|---|---|---|---|---|
| `(kategori, status, latitude)` | Bitmap Heap Scan | 11 | 7 | 328 kB |
| partial `(kategori, latitude)` | Bitmap Heap Scan | 9 | 7 | 176 kB |
| **partial `(kategori, latitude, longitude)`** | **Index Scan** | **3** | **1** | 224 kB |
| partial `(latitude, longitude)` | Index Scan | 3 | 2 | 176 kB |

Dipilih `(kategori, latitude, longitude)` partial: rentang longitude ikut menjadi `Index Cond`, jadi baris di luar kotak dibuang di dalam index tanpa membaca tabel. Partial index lebih kecil dari index biasa karena laporan ditolak/berhasil tidak ikut di-index. Index `(status, tahap)` yang sudah ada tidak bisa membatasi koordinat.

## Cara menjalankan

1. Pastikan akun seed ada (`warga1@laporkota.test`, dari `npm run seed`).
2. Buka Supabase Dashboard → **SQL Editor** → New query.
3. Tempel **seluruh** isi [`benchmark-cari-duplikat.sql`](benchmark-cari-duplikat.sql), lalu **Run** sekali.
4. Hasil muncul sebagai **pesan error** (disengaja). Salin pesan itu ke bagian [Hasil](#hasil).

Skrip tidak mengubah database:

- Semua langkah ada di satu transaksi; skrip diakhiri `RAISE EXCEPTION` sehingga transaksi di-rollback (data dummy, drop/create index, statistik).
- Data dummy diberi `id_tiket` manual `BENCH-xxxxx`, jadi sequence nomor tiket tidak terpakai (`nextval` tidak ikut di-rollback).
- Klaim `service_role` membuat trigger laporan dilewati (`dari_service_role()`), jadi tidak ada riwayat/notifikasi.
- Pengaman: kalau statement ternyata dijalankan satu per satu (bukan satu transaksi), skrip berhenti sebelum insert.

Catatan: `DROP INDEX`/`CREATE INDEX` mengunci tabel `laporan` selama skrip berjalan (beberapa detik). Jalankan saat aplikasi tidak sedang dipakai. Kalau sesudahnya SQL Editor menampilkan "current transaction is aborted", jalankan `rollback;` sekali. [PERIKSA]

Isi skrip:

1. Insert 10.000 laporan dummy di bbox batas kota (lebih rapat di tengah), 5 kategori, status 30% diterima, 15% ditolak, 15% menunggu eksekusi, 5% menunggu evaluasi, 35% berhasil; pelapor = warga1.
2. Insert 7 laporan di sekitar titik "ada duplikat": 3 yang harus ditemukan (5, 12, 18 m) dan 4 jebakan (ditolak, kategori lain, 25 m, sudah berhasil). Lalu `ANALYZE`.
3. **Fase sebelum**: `DROP INDEX IF EXISTS laporan_cari_duplikat_idx`, ukur metode 1 dan 2.
4. **Fase sesudah**: `CREATE INDEX` (definisi sama dengan migration) + `ANALYZE`, ukur metode 3.
5. Setiap metode × titik: 1 kali pemanasan, lalu `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` sebanyak n = 50 kali → median dan p95 *Execution Time*.
6. Metode 2 dan 3 dipanggil sebagai `authenticated` dengan klaim warga1, seperti request dari aplikasi.

Titik uji (kategori `jalan_berlubang`): **pusat kota** (-6.9175, 107.6191, `PUSAT_PETA`), **pinggir kota** (-6.9300, 107.5600, dekat batas barat), **ada duplikat** (-6.9020, 107.6350).

## Cara membaca hasil

Pesan berisi tiga bagian:

1. **Tabel** `titik | metode | scan | median ms | p95 ms | percepatan (x) | rows removed by filter`
   - *scan*: node scan utama pada tabel `laporan`. Untuk metode 2/3 diambil dari EXPLAIN isi RPC (statement `PREPARE` dengan generic plan, sama seperti fungsi SQL saat dipanggil), karena EXPLAIN pemanggilan fungsi hanya menampilkan `Function Scan`.
   - *median/p95 ms*: waktu eksekusi di server (tanpa jaringan dan planning).
   - *percepatan*: median metode 1 ÷ median metode ini, pada titik yang sama.
   - *rows removed by filter*: baris yang sudah dibaca lalu dibuang. Makin kecil, makin sedikit kerja sia-sia.
2. **Cek hasil**: `id_tiket` metode 1 dan metode 3 harus sama (`cocok = YA`). Titik "ada duplikat" harus berisi `BENCH-D1,BENCH-D2,BENCH-D3`.
3. **Cuplikan EXPLAIN** teks: metode 1 (sebelum) dan isi RPC + index (sesudah) di titik "ada duplikat".

## Hasil

Dijalankan di: [ISI DARI SQL EDITOR: tanggal, project Supabase, versi PostgreSQL]. Dataset: 10.000 laporan dummy + data seed, n = 50.

| Titik | Metode | Scan | Median (ms) | p95 (ms) | Percepatan (x) | Rows removed by filter |
|---|---|---|---|---|---|---|
| Pusat kota | 1 naif | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | 1,0 | [ISI DARI SQL EDITOR] |
| Pusat kota | 2 RPC tanpa index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |
| Pusat kota | 3 RPC + index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |
| Pinggir kota | 1 naif | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | 1,0 | [ISI DARI SQL EDITOR] |
| Pinggir kota | 2 RPC tanpa index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |
| Pinggir kota | 3 RPC + index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |
| Ada duplikat | 1 naif | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | 1,0 | [ISI DARI SQL EDITOR] |
| Ada duplikat | 2 RPC tanpa index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |
| Ada duplikat | 3 RPC + index | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] | [ISI DARI SQL EDITOR] |

Cek hasil: [ISI DARI SQL EDITOR: cocok YA/TIDAK per titik].

Cuplikan EXPLAIN sebelum (metode 1, titik ada duplikat):

```
[ISI DARI SQL EDITOR]
```

Cuplikan EXPLAIN sesudah (isi RPC + index, titik ada duplikat):

```
[ISI DARI SQL EDITOR]
```

### Kenapa lebih cepat

- **Sebelum**: index yang ada hanya `(status, tahap)`. Planner membaca semua laporan aktif (Seq Scan atau Bitmap Heap Scan lewat `laporan_status_tahap_idx`), lalu menghitung haversine (sin, cos, asin, sqrt) untuk **setiap** baris tersebut dan membuang hampir semuanya (*rows removed by filter* ≈ jumlah laporan aktif). Kotak di metode 2 mengurangi jumlah haversine, tetapi tabel tetap dibaca seluruhnya karena tidak ada index pada koordinat.
- **Sesudah**: index `(kategori, latitude, longitude)` membuat planner memakai **Index Scan** dengan rentang: `kategori = $3` dan rentang latitude menentukan potongan index yang dibaca, lalu rentang longitude dicek di dalam index. Hanya baris di dalam kotak ±33 m yang dibaca dari tabel dan dihitung haversine-nya, sehingga *rows removed by filter* tinggal 0–beberapa baris.
- Kerja per panggilan tidak lagi bergantung pada jumlah total laporan, melainkan pada kepadatan laporan di sekitar titik.
- Partial index (`where status in ('diterima','dikerjakan')`) tidak memuat laporan ditolak/berhasil yang terus bertambah, jadi index tetap kecil dan biaya insert kecil.
