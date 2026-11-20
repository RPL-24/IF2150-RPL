# Profiling RPC `cari_laporan_duplikat`

Bahan laporan B.2.1 (Profiling dan Optimasi). Issue: #104.

## Tujuan

RPC `cari_laporan_duplikat(p_lat, p_lng, p_kategori)` dipanggil `LaporanController.kirimLaporan()` setiap kali warga mengirim laporan (KF05: laporan aktif sekategori dalam radius ≤ 20 m). Query ini menghitung haversine dan makin berat seiring jumlah laporan bertambah, jadi dipilih sebagai fitur yang diprofil.

Acceptance criteria issue #104:

- [x] Uji performa `cari_laporan_duplikat` dengan dataset besar (±10.000 laporan) → skrip [`benchmark-cari-duplikat.sql`](benchmark-cari-duplikat.sql).
- [x] Catat metrik awal dengan `EXPLAIN ANALYZE` → bagian [Hasil](#hasil). Rencana awal ternyata **Index Scan lewat `laporan_status_tahap_idx`**, bukan Seq Scan; lihat [catatan](#catatan-terhadap-acceptance-criteria).
- [x] Optimasi index (kategori, status) + penyaringan bounding box sebelum haversine → migration [`20261110140216_index_cari_duplikat.sql`](../../../supabase/migrations/20261110140216_index_cari_duplikat.sql); bounding box sudah ada di RPC sejak migration `20261107155512_trigger_status.sql`.
- [x] Catat metrik sesudah optimasi + tabel perbandingan → bagian [Hasil](#hasil).

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

Dijalankan di: Supabase SQL Editor (project LaporKota), PostgreSQL 17, 10 November 2026. Dataset: 10.000 laporan dummy + data seed, n = 50.

| Titik | Metode | Scan | Median (ms) | p95 (ms) | Percepatan (x) | Rows removed by filter |
|---|---|---|---|---|---|---|
| Pusat kota | 1 naif | Index Scan (`laporan_status_tahap_idx`) | 1,662 | 1,688 | 1,0 | 5.144 |
| Pusat kota | 2 RPC tanpa index | Index Scan (`laporan_status_tahap_idx`) | 1,733 | 1,765 | 1,0 | 5.144 |
| Pusat kota | 3 RPC + index | Index Scan (`laporan_cari_duplikat_idx`) | 0,333 | 0,352 | 5,0 | 0 |
| Pinggir kota | 1 naif | Index Scan (`laporan_status_tahap_idx`) | 1,648 | 1,673 | 1,0 | 5.144 |
| Pinggir kota | 2 RPC tanpa index | Index Scan (`laporan_status_tahap_idx`) | 1,707 | 1,741 | 1,0 | 5.144 |
| Pinggir kota | 3 RPC + index | Index Scan (`laporan_cari_duplikat_idx`) | 0,334 | 0,352 | 4,9 | 0 |
| Ada duplikat | 1 naif | Index Scan (`laporan_status_tahap_idx`) | 1,680 | 1,702 | 1,0 | 5.141 |
| Ada duplikat | 2 RPC tanpa index | Index Scan (`laporan_status_tahap_idx`) | 1,738 | 1,759 | 1,0 | 5.141 |
| Ada duplikat | 3 RPC + index | Index Scan (`laporan_cari_duplikat_idx`) | 0,350 | 0,367 | 4,8 | 1 |

Median dan p95 metode 2/3 adalah waktu pemanggilan RPC (end-to-end di server); kolom scan dan rows removed untuk metode 2/3 berasal dari EXPLAIN isi RPC.

Cek hasil (`id_tiket` naif = RPC + index):

| Titik | Naif | RPC + index | Cocok |
|---|---|---|---|
| Pusat kota | (kosong) | (kosong) | YA |
| Pinggir kota | (kosong) | (kosong) | YA |
| Ada duplikat | BENCH-D1, BENCH-D2, BENCH-D3 | BENCH-D1, BENCH-D2, BENCH-D3 | YA |

Cuplikan EXPLAIN sebelum (metode 1, titik ada duplikat):

```
Sort (actual time=1.653..1.653 rows=3 loops=1)
  Sort Key: (('12742000'::double precision * asin(LEAST('1'::double precision, sqrt((power(sin((radians((l.latitude - '-6.902'::double precision)) / '2'::double precision)), '2'::double precision) + (('0.992753147757843'::double precision * cos(radians(l.latitude))) * power(sin((radians((l.longitude - '107.635'::double precision)) / '2'::double precision)), '2'::double precision))))))))
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=586
  ->  Index Scan using laporan_status_tahap_idx on laporan l (actual time=0.959..1.648 rows=3 loops=1)
        Index Cond: (status = ANY ('{diterima,dikerjakan}'::status_laporan[]))
        Filter: ((kategori = 'jalan_berlubang'::kategori_kerusakan) AND (('12742000'::double precision * asin(LEAST('1'::double precision, sqrt((power(sin((radians((latitude - '-6.902'::double precision)) / '2'::double precision)), '2'::double precision) + (('0.992753147757843'::double precision * cos(radians(latitude))) * power(sin((radians((longitude - '107.635'::double precision)) / '2'::double precision)), '2'::double precision))))))) <= '20'::double precision))
        Rows Removed by Filter: 5141
        Buffers: shared hit=586
Planning Time: 0.135 ms
Execution Time: 1.680 ms
```

Cuplikan EXPLAIN sesudah (isi RPC + index, titik ada duplikat):

```
Sort (actual time=0.027..0.027 rows=3 loops=1)
  Sort Key: (('12742000'::double precision * asin(LEAST('1'::double precision, sqrt((power(sin((radians((l.latitude - $1)) / '2'::double precision)), '2'::double precision) + ((cos(radians($1)) * cos(radians(l.latitude))) * power(sin((radians((l.longitude - $2)) / '2'::double precision)), '2'::double precision))))))))
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=3
  ->  Index Scan using laporan_cari_duplikat_idx on laporan l (actual time=0.020..0.023 rows=3 loops=1)
        Index Cond: ((kategori = $3) AND (latitude >= ($1 - '0.0003'::double precision)) AND (latitude <= ($1 + '0.0003'::double precision)) AND (longitude >= ($2 - ('0.0003'::double precision / cos(radians($1))))) AND (longitude <= ($2 + ('0.0003'::double precision / cos(radians($1))))))
        Filter: (('12742000'::double precision * asin(LEAST('1'::double precision, sqrt((power(sin((radians((latitude - $1)) / '2'::double precision)), '2'::double precision) + ((cos(radians($1)) * cos(radians(latitude))) * power(sin((radians((longitude - $2)) / '2'::double precision)), '2'::double precision))))))) <= '20'::double precision)
        Rows Removed by Filter: 1
        Buffers: shared hit=3
Planning Time: 0.012 ms
Execution Time: 0.062 ms
```

### Analisis

1. **±5× end-to-end, ±27× di dalam query.** Waktu pemanggilan RPC turun dari ±1,7 ms menjadi ±0,33–0,35 ms (4,8–5,0×). Waktu query di dalam RPC turun lebih jauh: EXPLAIN naif 1,680 ms → EXPLAIN isi RPC + index 0,062 ms (±27×). Selisih ±0,28 ms antara 0,062 ms dan 0,350 ms adalah overhead pemanggilan fungsi (menyiapkan dan merencanakan isi fungsi SQL setiap kali dipanggil), yang tidak dipengaruhi index. Setelah optimasi, overhead ini menjadi bagian terbesar dari waktu RPC.
2. **Buffers 586 → 3.** Sebelum index, query membaca 586 blok (seluruh laporan aktif); sesudahnya cukup 3 blok (halaman index + baris di dalam kotak). Jumlah blok ini bergantung pada data, bukan pada kecepatan server, jadi menjadi bukti yang paling stabil.
3. **"RPC tanpa index" sama lambatnya dengan naif** (1,707–1,738 ms vs 1,648–1,680 ms, rows removed sama). Tanpa index pada koordinat, kondisi kotak hanya menjadi `Filter` yang dicek per baris setelah baris dibaca, jadi jumlah baris yang dibaca tidak berkurang. Sedikit lebih lambat karena overhead pemanggilan fungsi. Bounding box baru berguna setelah ada index yang bisa memakai rentangnya sebagai `Index Cond`.
4. **Hasil tetap benar.** Ketiga titik menghasilkan `id_tiket` yang sama antara query naif dan RPC + index; 4 laporan jebakan (ditolak, kategori lain, 25 m, sudah berhasil) tidak ikut.

### Catatan terhadap acceptance criteria

Issue #104 meminta metrik awal berupa *sequential scan time*. Di Supabase, rencana sebelum optimasi **bukan Seq Scan**, melainkan **Index Scan lewat `laporan_status_tahap_idx`** (index `(status, tahap)` dari skema awal) dengan `Index Cond` hanya pada status. Index itu tidak membatasi kategori maupun koordinat, sehingga query tetap memindai **semua laporan aktif**: 5.141 baris dibaca lalu dibuang oleh `Filter` (kategori + haversine), untuk mendapatkan 3 baris. Secara biaya, ini setara pemindaian penuh atas laporan aktif. Angka "sebelum" di atas adalah waktu pemindaian tersebut, bukan Seq Scan pada seluruh tabel.

### Kenapa lebih cepat

- **Sebelum**: index yang ada hanya `(status, tahap)`. Planner memakai Index Scan `laporan_status_tahap_idx` untuk mengambil semua laporan aktif, lalu menghitung haversine (sin, cos, asin, sqrt) untuk **setiap** baris tersebut dan membuang hampir semuanya (*rows removed by filter* 5.141–5.144). Kotak di metode 2 tidak mengurangi jumlah baris yang dibaca karena tidak ada index pada koordinat.
- **Sesudah**: index `(kategori, latitude, longitude)` membuat planner memakai **Index Scan** dengan rentang: `kategori = $3` dan rentang latitude menentukan potongan index yang dibaca, lalu rentang longitude dicek di dalam index. Hanya baris di dalam kotak ±33 m yang dibaca dari tabel dan dihitung haversine-nya, sehingga *rows removed by filter* tinggal 0–beberapa baris.
- Kerja per panggilan tidak lagi bergantung pada jumlah total laporan, melainkan pada kepadatan laporan di sekitar titik.
- Partial index (`where status in ('diterima','dikerjakan')`) tidak memuat laporan ditolak/berhasil yang terus bertambah, jadi index tetap kecil dan biaya insert kecil.
