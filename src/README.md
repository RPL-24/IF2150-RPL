# Fajar Tech

Kerangka README Tugas 9. Rafiandhi menyatukan bagian dari tiap pemilik modul dan memfinalkannya pada Selasa 10 Nov.

## 1. Deskripsi

<!-- TODO(Rafiandhi, Min 8 Nov) -->

Aplikasi web pengelolaan air dan energi komunal untuk warga, teknisi, dan pengurus.

## 2. Teknologi dan versi

| Teknologi | Versi |
| --- | --- |
| Next.js | 16.4.5 |
| React | 19.3.1 |
| TypeScript | 6.0.3 |
| Prisma | 7.10.1 |
| PostgreSQL | 15 (Docker) |
| Jest | 30.5.2 |

## 3. Prasyarat

<!-- TODO(Rafiandhi, Min 8 Nov): versi Node.js minimum -->

- Node.js dan npm
- Docker dengan Docker Compose

## 4. Konfigurasi

<!-- TODO(Rafiandhi, Min 8 Nov): daftar variabel dari .env.example final -->

## 5. Cara menjalankan dan menguji

<!-- TODO(Rafiandhi, Min 8 Nov): langkah instalasi dan migrasi dari nol -->

Jalankan tes dari folder `src`:

```bash
npx jest
```

Letakkan tes tiap modul di `tests/<modul>/` dengan nama `*.test.ts` atau `*.test.tsx`. Tes memakai `describe`, `it`, dan `expect` yang diimpor dari `@jest/globals`. Tes komponen menambahkan docblock `@jest-environment jsdom` di baris pertama.

## 6. Akun uji

Seed membuat akun fiktif berikut. Password bawaannya `uji-fajar-123`, dan kamu bisa menggantinya lewat `SEED_PASSWORD`.

| Email | Peran | Status |
| --- | --- | --- |
| `warga@fajar.test` | Warga | DISETUJUI |
| `warga2@fajar.test` | Warga | DISETUJUI |
| `teknisi@fajar.test` | Teknisi | DISETUJUI |
| `pengurus@fajar.test` | Pengurus | DISETUJUI |
| `calon@fajar.test` | Warga | MENUNGGU |

## 7. Modul dan pembagian

| Modul | Pemilik | Use case |
| --- | --- | --- |
| Monitoring | Andro Irsa Syafiq | UC01, UC05, UC06 |
| Pemeliharaan | Muhammad Rafiandhi Suryadinata | UC08 |
| Akun | Muhammad Faiz Ramadhan | UC12, UC13, UC14 |
| Laporan gangguan | Rionaldo Casey Pandhitha | UC03, UC04, UC07 |
| Iuran | Raffi Fauzi Hermawan | UC02, UC09, UC10, UC11 |

### Monitoring dan telemetri

<!-- TODO(Andro) -->

### Pemeliharaan

Teknisi mencatat tindakan dan hasil perawatan di `/dashboard/teknisi/pemeliharaan` lewat `POST /api/pemeliharaan`. Server mengambil identitas teknisi dari sesi dan hanya menerima perangkat yang ditugaskan kepada teknisi itu.

### Akun

<!-- TODO(Faiz) -->

### Laporan gangguan

Warga mengirim dan memantau laporan gangguan, teknisi mengubah status tugasnya. Kode ada di `modules/laporan`, layar di `components/layar/LayarI05` sampai `LayarI07` (warga) dan `LayarI10`, `LayarI11` (teknisi).

| Use case | Layar | Rute API | Peran |
| --- | --- | --- | --- |
| UC03 kirim laporan | I-05 `/dashboard/warga/laporan/baru` | `POST /api/laporan` | Warga |
| UC04 daftar, detail, riwayat | I-06 `/dashboard/warga/laporan`, I-07 `/dashboard/warga/laporan/{id}` | `GET /api/laporan`, `GET /api/laporan/{id}`, `GET /api/laporan/{id}/riwayat` | Warga |
| UC07 daftar tugas, detail, ubah status | I-10 `/dashboard/teknisi/tugas`, I-11 `/dashboard/teknisi/tugas/{id}` | `GET /api/laporan/tugas`, `GET /api/laporan/tugas/{id}`, `PATCH /api/laporan/tugas/{id}/status` | Teknisi |

Aturan yang dijaga server:

- Identitas warga dan teknisi diambil dari sesi, bukan dari body atau URL.
- Pengiriman laporan memeriksa keanggotaan komunitas warga dari basis data setiap kali.
- Setiap pembacaan laporan warga memuat syarat pemilik, dan setiap pembacaan tugas memuat syarat penugasan. Laporan milik orang lain dan ID yang tidak ada sama-sama dibalas 404.
- Status hanya maju satu langkah: `MENUNGGU`, `SEDANG_DIPERBAIKI`, `SELESAI`. Lompat, mundur, dan status yang sama ditolak dengan 400 dan daftar `opsi.statusBerikutnya`.
- Status dan riwayat disimpan dalam satu transaksi. Bila salah satunya gagal atau status sudah berubah (409), tidak ada yang tersimpan.
- Foto pendukung belum didukung (belum ada unggah). Jenis gangguan dipilih dari daftar tetap di `modules/laporan/internal/validasi.ts`.

Menjalankan tes laporan:

```bash
npx jest tests/laporan
```

Uji transaksi status ke PostgreSQL sungguhan (butuh basis data yang sudah dimigrasi dan di-seed, tidak ikut `npx jest`):

```bash
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/fajartech npx tsx tests/laporan/transaksiStatus.db.ts
```

Coba lewat browser: masuk sebagai `warga@fajar.test`, kirim laporan di menu Lapor gangguan, lalu lihat di Laporan saya. Masuk sebagai `teknisi@fajar.test`, buka Tugas saya, dan klik Mulai perbaikan pada LAP-01. Dua laporan seed (LAP-01 dan LAP-02) ditugaskan ke teknisi itu.


### Iuran

<!-- TODO(Raffi) -->

## 8. Daftar tabel

`prisma/schema.prisma` mendefinisikan 18 tabel:

| Kelompok | Tabel |
| --- | --- |
| Akun | `akun`, `warga`, `teknisi`, `pengurus` |
| Perangkat | `perangkat`, `pembacaan_sensor`, `data_historis_kinerja`, `penugasan_perangkat`, `notifikasi` |
| Laporan | `laporan_gangguan`, `riwayat_status_laporan`, `penugasan_laporan` |
| Pemeliharaan | `catatan_pemeliharaan` |
| Iuran | `periode`, `data_pemakaian`, `aturan_tarif`, `tagihan`, `rekapitulasi` |
