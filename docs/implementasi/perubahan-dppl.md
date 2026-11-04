# Perubahan Implementasi terhadap DPPL

Catat setiap bagian implementasi yang berbeda dari DPPL (`docs/M8/K03_G07_DPPL2.md`). Dipakai untuk laporan B.1.

| No | Bagian DPPL | Rancangan di DPPL | Implementasi | Alasan | PIC |
|---|---|---|---|---|---|
| 1 | C03 Lokasi | Tidak ada operasi `dalamWilayah()` | Operasi baru `Lokasi.dalamWilayah()`: cek titik di dalam polygon batas Kota Bandung (`src/lib/batas-wilayah.ts`, dari OpenStreetMap via Nominatim, disederhanakan ±300 m) dengan algoritma ray casting | Dibutuhkan untuk validasi "Lokasi di luar daerah penanganan" (I01-13) dan validasi koordinat data seed | F (Dipta) |
| 2 | Controller (C17–C23) | Tidak ada controller autentikasi; UC01–UC06 tidak mencakup masuk/daftar/keluar | Controller baru `AuthController` (`src/server/controllers/AuthController.ts`) dengan operasi `masuk()`, `daftar()`, `keluar()` memakai Supabase Auth email + password; validasi input di `src/lib/validasi-auth.ts`. Akun baru selalu ber-role `warga` | Dibutuhkan agar sistem bisa membedakan aktor (Warga, Tim Administrasi, Eksekutor Lapangan) dan membatasi akses halaman serta aksi per aktor | F (Dipta) |
| 3 | Bab 6 I02-06 / I02-11 (warna status) | Warna hanya disebut untuk Diterima (biru), Dikerjakan (kuning), Berhasil (hijau) | `STATUS_WARNA` di `src/lib/constants.ts` menambah warna merah untuk status Ditolak | I02-06 meminta warna berbeda untuk setiap status, tetapi warna Ditolak tidak disebut | F (Dipta) |
| 4 | C02 Laporan (tahap penanganan) | Tidak ada label tahap penanganan | `TAHAP_LABEL` di `src/lib/constants.ts`: "Menunggu eksekusi", "Menunggu evaluasi" | Kolom `tahap` ada di skema untuk membedakan sub-tahap status Dikerjakan; labelnya diturunkan dari nama enum karena tidak disebut di DPPL | F (Dipta) |
