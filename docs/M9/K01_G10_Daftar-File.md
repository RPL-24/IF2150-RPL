# Daftar File yang Di-push Setiap Anggota - antri.in (M9)

Seluruh kode antri.in sudah tersedia di branch referensi **`claude/charming-lovelace-xxr0nl`**. Dokumen ini membagi **setiap file** ke satu anggota sesuai pembagian tugas, supaya setiap anggota mem-*push* bagiannya sendiri lewat branch dan Pull Request masing-masing (ketentuan M9 A.1 dan A.6).

> **Penting**
> - **PR #1 jangan di-merge**, tutup saja. Kode masuk ke `main` lewat PR tiap anggota sesuai urutan di bawah.
> - Kode di branch referensi dibuat dengan bantuan AI (Claude). Setiap anggota **wajib mencatatnya** di `docs/K01_G10_AI-Usage.md` (A.6 butir 6), lalu memahami, menguji, dan mengembangkan bagiannya (lihat [`K01_G10_Pembagian-Tugas.md`](K01_G10_Pembagian-Tugas.md)).
> - Partner UC02 belum ditentukan. Ganti nama di bagian 3 setelah ditentukan.
> - **Iterasi 2** menambah 26 file (ditandai "iterasi 2" pada judul kelompok) dan mengubah sebagian file iterasi 1. Karena file diambil langsung dari branch referensi terbaru, perubahan iterasi 2 otomatis ikut ter-push oleh pemilik masing-masing file.

## Ringkasan

| No | Anggota | Bagian | Jumlah file | Branch |
| :--- | :--- | :--- | :---: | :--- |
| 1 | Muhammad Fauzi Muharam | Fondasi & penyatuan aplikasi, UC08, notifikasi, profil restoran | 49 | `chore/fondasi`, `feat/kelola-menu`, `feat/notifikasi`, `feat/profil-restoran`, `feat/penyatuan-app` |
| 2 | Bayu Palamarta Wirawan | Database & ERD, UC10-UC12, UC02 (pemesanan & riwayat) | 23 | `feat/database`, `feat/autentikasi`, `feat/pemesanan`, `feat/seed-data` |
| 3 | Partner UC02 (belum ditentukan) | UC02 (pembayaran & tiket), simulator antrean dummy | 15 | `feat/pembayaran`, `feat/simulasi` |
| 4 | Chatima Anandakhorita (Atim) | UC01, UC04, UC05 | 12 | `feat/pencarian`, `feat/mitra` |
| 5 | Muhammad Nur Fikri Hariyawan | UC03, UC06, UC07, UC09 | 12 | `feat/antrean` |
| 6 | Athallah Nanda Andita | UC13, UC14, UC15, ulasan & rating | 12 | `feat/keluhan`, `feat/ulasan` |

## Urutan push (gelombang)

Kode saling bergantung, jadi push dilakukan dalam 3 gelombang. Gelombang berikutnya dimulai setelah PR gelombang sebelumnya di-merge ke `main`.

| Gelombang | Isi | Siapa |
| :--- | :--- | :--- |
| **1. Fondasi** | Setup proyek, utilitas, kerangka UI, database | Fauzi, Bayu |
| **2. Fitur** | Model, controller, route, view, dan test setiap use case (boleh paralel) | Semua anggota |
| **3. Penyatuan** | Perakitan app & router, data contoh, README, laporan | Fauzi, Bayu |

Aplikasi baru bisa dijalankan dan `npm test` baru bisa lulus di `main` **setelah gelombang 3 selesai**, karena file perakitan (`routes/index.ts`, `app.ts`, `client/main.ts`) mengimpor semua modul. Selama gelombang 1-2, jalankan aplikasi lengkap dari branch referensi untuk mencoba dan mengambil tangkapan layar PR:

```bash
git fetch origin
git switch -c coba-lengkap origin/claude/charming-lovelace-xxr0nl
cd src && npm install && npm start
```

## Cara push (berlaku untuk semua)

Contoh untuk satu kelompok file. Ulangi untuk setiap kelompok/branch milikmu.

```bash
git fetch origin
git switch -c feat/pencarian origin/main                     # branch baru dari main terbaru
git checkout origin/claude/charming-lovelace-xxr0nl -- src/server/models/restoran.ts src/server/controllers/pencarianController.ts
git status                                                   # pastikan hanya file milikmu yang berubah
git commit -m "feat(pencarian): pencarian dan filter restoran (UC01)"
git push -u origin feat/pencarian
```

Setelah itu buka Pull Request `feat/...` → `main`, tautkan issue (`Closes #..`), dan minta 1 anggota lain me-review. Satu branch boleh berisi beberapa commit (satu commit per kelompok file di tabel). Dengan begitu riwayat commit lebih rapi dan aturan semantic commit terpenuhi.

---
## 1. Muhammad Fauzi Muharam: Fondasi & penyatuan aplikasi, UC08, notifikasi, profil restoran

### Gelombang 1: Fondasi proyek

Branch: `chore/fondasi` · Commit: `chore(setup): inisialisasi proyek TypeScript dan Express`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/package.json` | Daftar dependensi dan script npm (`start`, `dev`, `test`, `test:pg`, `profile`) | 38 |
| ☐ | `src/package-lock.json` | Versi pasti seluruh dependensi (dibuat otomatis oleh npm) | 2366 |
| ☐ | `src/tsconfig.json` | Konfigurasi TypeScript server dan test | 14 |
| ☐ | `src/tsconfig.client.json` | Konfigurasi TypeScript klien (hasil kompilasi ke `public/js`) | 14 |
| ☐ | `src/.gitignore` | Mengecualikan `node_modules/`, `data/`, `uploads/`, `.env`, `public/js/` | 6 |
| ☐ | `src/.env.example` | Contoh environment variable tanpa nilai rahasia | 31 |
| ☐ | `src/server/config.ts` | Membaca `.env` dan konfigurasi aturan bisnis (timeout, kuota, biaya layanan) | 42 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/package.json \
  src/package-lock.json \
  src/tsconfig.json \
  src/tsconfig.client.json \
  src/.gitignore \
  src/.env.example \
  src/server/config.ts
git rm src/.gitkeep                     # placeholder lama, tidak dipakai lagi
```
</details>

### Gelombang 1: Utilitas & middleware server

Branch: `chore/fondasi` · Commit: `feat(server): utilitas error, id, validasi, dan middleware`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/utils/errors.ts` | Kelas `AppError` dan helper error HTTP (400/401/403/404/409) | 16 |
| ☐ | `src/server/utils/ids.ts` | Pembuat ID, token sesi, dan format nomor antrean `A-001` | 15 |
| ☐ | `src/server/utils/validasi.ts` | Validasi umum: email, nomor HP, bilangan bulat | 18 |
| ☐ | `src/server/middleware/errorHandler.ts` | Mengubah error menjadi respons JSON | 20 |
| ☐ | `src/server/middleware/timing.ts` | Header `Server-Timing` dan log request lambat (profiling) | 21 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/utils/errors.ts \
  src/server/utils/ids.ts \
  src/server/utils/validasi.ts \
  src/server/middleware/errorHandler.ts \
  src/server/middleware/timing.ts
```
</details>

### Gelombang 1: Kerangka klien & tampilan

Branch: `chore/fondasi` · Commit: `feat(ui): kerangka klien, komponen UI, dan gaya antarmuka`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/client/core/html.ts` | Template HTML aman (escape XSS) dan helper DOM | 52 |
| ☐ | `src/client/core/ui.ts` | Toast, dialog konfirmasi (I-04/I-15/I-21), format rupiah/tanggal, ikon | 203 |
| ☐ | `src/client/core/api.ts` | Pemanggil REST API dan langganan SSE | 62 |
| ☐ | `src/client/core/konfigurasi.ts` | Mengambil konfigurasi dari `GET /api/config` | 18 |
| ☐ | `src/client/views/layout.ts` | Navbar pelanggan dan sidebar restoran/admin | 94 |
| ☐ | `src/public/index.html` | Halaman HTML utama | 19 |
| ☐ | `src/public/css/style.css` | Seluruh gaya tampilan (mengikuti rancangan DPPL BAB 6) | 648 |
| ☐ | `src/public/img/logo.png` | Logo antri.in (PNG transparan) | - |
| ☐ | `src/public/img/favicon.svg` | Ikon tab browser | 1 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/client/core/html.ts \
  src/client/core/ui.ts \
  src/client/core/api.ts \
  src/client/core/konfigurasi.ts \
  src/client/views/layout.ts \
  src/public/index.html \
  src/public/css/style.css \
  src/public/img/logo.png \
  src/public/img/favicon.svg
```
</details>

### Gelombang 2: UC08 Kelola menu & stok

Branch: `feat/kelola-menu` · Commit: `feat(menu): kelola menu dan stok restoran (UC08)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/menu.ts` | Model `Menu` (C03): ambil, tambah, ubah, hapus menu, cek & kurangi stok | 111 |
| ☐ | `src/server/controllers/kelolaMenuController.ts` | `KelolaMenuController` (C24) + validasi input menu | 95 |
| ☐ | `src/server/routes/menu.ts` | Endpoint `/api/kelola/menu` | 23 |
| ☐ | `src/client/views/pengaturanMenuView.ts` | Layar I-17 Pengaturan Menu & Stok (`PengaturanMenuPage`, C23) | 130 |
| ☐ | `src/tests/menu.test.ts` | Test UC08 | 35 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/menu.ts \
  src/server/controllers/kelolaMenuController.ts \
  src/server/routes/menu.ts \
  src/client/views/pengaturanMenuView.ts \
  src/tests/menu.test.ts
```
</details>

### Gelombang 2: Notifikasi dalam aplikasi (iterasi 2)

Branch: `feat/notifikasi` · Commit: `feat(notifikasi): notifikasi dalam aplikasi`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/notifikasi.ts` | Model `Notifikasi`: kirim ke akun/pelanggan/restoran, daftar, tandai dibaca | 68 |
| ☐ | `src/server/controllers/notifikasiController.ts` | `NotifikasiController` | 26 |
| ☐ | `src/server/routes/notifikasi.ts` | Endpoint `/api/notifikasi` | 10 |
| ☐ | `src/client/views/notifikasiView.ts` | Ikon lonceng + panel notifikasi (navbar & sidebar) | 79 |
| ☐ | `src/tests/notifikasi.test.ts` | Test notifikasi | 43 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/notifikasi.ts \
  src/server/controllers/notifikasiController.ts \
  src/server/routes/notifikasi.ts \
  src/client/views/notifikasiView.ts \
  src/tests/notifikasi.test.ts
```
</details>

### Gelombang 2: Profil restoran & foto (iterasi 2)

Branch: `feat/profil-restoran` · Commit: `feat(restoran): profil restoran, foto restoran, dan foto menu`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/utils/unggah.ts` | Unggah & kirim gambar (foto restoran/menu, maks. 2 MB) | 42 |
| ☐ | `src/server/models/profilRestoran.ts` | Model profil restoran (deskripsi, alamat, jam buka, foto) | 49 |
| ☐ | `src/server/controllers/profilRestoranController.ts` | `ProfilRestoranController` + validasi jam buka | 62 |
| ☐ | `src/server/routes/profilRestoran.ts` | Endpoint `/api/kelola/profil`, foto restoran | 18 |
| ☐ | `src/client/views/profilRestoranView.ts` | Halaman Profil Restoran (panel restoran) | 71 |
| ☐ | `src/tests/profilRestoran.test.ts` | Test profil restoran & foto | 44 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/utils/unggah.ts \
  src/server/models/profilRestoran.ts \
  src/server/controllers/profilRestoranController.ts \
  src/server/routes/profilRestoran.ts \
  src/client/views/profilRestoranView.ts \
  src/tests/profilRestoran.test.ts
```
</details>

### Gelombang 3: Penyatuan aplikasi

Branch: `feat/penyatuan-app` · Commit: `feat(app): rakit controller, route, dan router klien`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/context.ts` | Tipe dependensi bersama controller dan pengguna yang login | 24 |
| ☐ | `src/server/routes/util.ts` | Helper route: pembungkus async, guard peran | 30 |
| ☐ | `src/server/routes/index.ts` | Membuat seluruh controller dan mendaftarkan route semua modul | 106 |
| ☐ | `src/server/app.ts` | Merakit aplikasi: basis data, adapter, controller, route, berkas statis | 67 |
| ☐ | `src/server/index.ts` | Titik masuk server + timer dequeue otomatis & timeout pembayaran | 16 |
| ☐ | `src/client/main.ts` | Router klien: daftar halaman, penjaga akses per peran | 175 |
| ☐ | `src/tests/api.test.ts` | Test hak akses REST API | 39 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/context.ts \
  src/server/routes/util.ts \
  src/server/routes/index.ts \
  src/server/app.ts \
  src/server/index.ts \
  src/client/main.ts \
  src/tests/api.test.ts
```
</details>

### Gelombang 3: Dokumentasi

Branch: `feat/penyatuan-app` · Commit: `docs(M9): README aplikasi dan laporan implementasi`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/README.md` | Dokumentasi menjalankan aplikasi (ketentuan A.5) | 264 |
| ☐ | `docs/M9/K01_G10_Implementasi.md` | Laporan M9 Bagian B | 312 |
| ☐ | `docs/M9/K01_G10_Form-Asistensi.md` | Form asistensi M9 (rename dari template `KXX_GYY_`) | 46 |
| ☐ | `docs/M9/K01_G10_Pembagian-Tugas.md` | Checklist tugas per anggota | 216 |
| ☐ | `docs/M9/K01_G10_Daftar-File.md` | Dokumen ini | - |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/README.md \
  docs/M9/K01_G10_Implementasi.md \
  docs/M9/K01_G10_Form-Asistensi.md \
  docs/M9/K01_G10_Pembagian-Tugas.md \
  docs/M9/K01_G10_Daftar-File.md
git rm docs/M9/KXX_GYY_Form-Asistensi.md docs/M9/KXX_GYY_Implementasi.md   # template lama diganti nama K01_G10_
```
</details>

---

## 2. Bayu Palamarta Wirawan: Database & ERD, UC10-UC12, UC02 (pemesanan & riwayat)

### Gelombang 1: Database

Branch: `feat/database` · Commit: `feat(db): skema basis data dan adapter PostgreSQL/PGlite`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/db/database.ts` | `BasisDataPostgreSQL`: adapter `pg` (PostgreSQL) dan PGlite, transaksi, migrasi | 87 |
| ☐ | `src/server/db/schema.sql` | Seluruh tabel (17 tabel) dan indeks | 244 |
| ☐ | `src/docker-compose.yml` | PostgreSQL 16 lokal (opsional) | 16 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/db/database.ts \
  src/server/db/schema.sql \
  src/docker-compose.yml
```
</details>

### Gelombang 2: UC10-UC12 Autentikasi

Branch: `feat/autentikasi` · Commit: `feat(auth): registrasi, login, dan logout (UC10-UC12)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/akun.ts` | Model `Pengguna` (C25), `SesiPengguna` (C29), `Pelanggan` (C01), `Admin` (C14) | 201 |
| ☐ | `src/server/controllers/autentikasiController.ts` | `AutentikasiController` (C28): registrasi, login, sesi, logout, profil | 207 |
| ☐ | `src/server/middleware/auth.ts` | Validasi token di setiap request dan pembatasan peran | 42 |
| ☐ | `src/server/routes/autentikasi.ts` | Endpoint `/api/auth/*` | 15 |
| ☐ | `src/client/core/session.ts` | Penyimpanan token ("Ingat saya") | 54 |
| ☐ | `src/client/views/akunView.ts` | Layar I-01 Registrasi, I-02 Login, I-03 Profil, I-04 Konfirmasi keluar | 315 |
| ☐ | `src/tests/autentikasi.test.ts` | Test UC10-UC12 | 82 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/akun.ts \
  src/server/controllers/autentikasiController.ts \
  src/server/middleware/auth.ts \
  src/server/routes/autentikasi.ts \
  src/client/core/session.ts \
  src/client/views/akunView.ts \
  src/tests/autentikasi.test.ts
```
</details>

### Gelombang 2: UC02 Pemesanan (keranjang, mode layanan, booking)

Branch: `feat/pemesanan` · Commit: `feat(pemesanan): keranjang, mode layanan, dan booking (UC02)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/pesanan.ts` | Model `Pesanan` (C06), validasi jadwal booking 7 hari | 224 |
| ☐ | `src/server/controllers/pemesananController.ts` | `PemesananController`: cek stok, kuota, meja, booking, buat pesanan | 188 |
| ☐ | `src/server/routes/pemesanan.ts` | Endpoint `/api/pesanan`, `/api/tiket/:id`, slot booking | 12 |
| ☐ | `src/client/models/keranjang.ts` | Kelas `Keranjang` (C05) | 166 |
| ☐ | `src/client/views/pemesananView.ts` | Layar I-07 Keranjang & mode layanan, I-08 Pilih jadwal booking | 207 |
| ☐ | `src/client/views/riwayatPesananView.ts` | Halaman detail pesanan & bukti pembayaran (`#/pesanan/:id`) | 64 |
| ☐ | `src/tests/pemesanan.test.ts` | Test UC02 bagian pemesanan | 98 |
| ☐ | `src/tests/keranjang.test.ts` | Unit test kelas `Keranjang` | 64 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/pesanan.ts \
  src/server/controllers/pemesananController.ts \
  src/server/routes/pemesanan.ts \
  src/client/models/keranjang.ts \
  src/client/views/pemesananView.ts \
  src/client/views/riwayatPesananView.ts \
  src/tests/pemesanan.test.ts \
  src/tests/keranjang.test.ts
```
</details>

### Gelombang 3: Data contoh, helper test & ERD

Branch: `feat/seed-data` · Commit: `feat(db): data contoh, helper pengujian, dan ERD`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/db/seed.ts` | Data contoh fiktif dan akun uji | 247 |
| ☐ | `src/server/db/seed-cli.ts` | Perintah `npm run seed` | 9 |
| ☐ | `src/tests/helpers.ts` | Helper test bersama (app uji, login, dsb.) | 62 |
| ☐ | `docs/M9/K01_G10_ERD.md` | ERD basis data (Mermaid) | 234 |
| ☐ | `docs/M9/assets/diagram/ERD.png` | ERD versi gambar | - |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/db/seed.ts \
  src/server/db/seed-cli.ts \
  src/tests/helpers.ts \
  docs/M9/K01_G10_ERD.md \
  docs/M9/assets/diagram/ERD.png
```
</details>

---

## 3. Partner UC02 (belum ditentukan): UC02 (pembayaran & tiket), simulator antrean dummy

### Gelombang 2: UC02 Pembayaran, tiket & AntriPay Sandbox

Branch: `feat/pembayaran` · Commit: `feat(pembayaran): pembayaran digital dan tiket antrean (UC02)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/pembayaran.ts` | Tabel pembayaran (C07) dan `RiwayatTransaksi` (C08) | 105 |
| ☐ | `src/server/adapters/paymentGatewayAdapter.ts` | Antarmuka `PaymentGatewayAdapter` + tanda tangan HMAC notifikasi | 61 |
| ☐ | `src/server/controllers/metodePembayaranController.ts` | `MetodePembayaranController` (C07): tagihan, verifikasi, timeout, terbitkan tiket | 242 |
| ☐ | `src/server/routes/pembayaran.ts` | Endpoint `/api/pesanan/:id/pembayaran`, `/api/pembayaran/*` | 15 |
| ☐ | `src/client/views/pembayaranView.ts` | Layar I-09 Pembayaran (memantau status gateway), I-10 Tiket antrean | 213 |
| ☐ | `src/server/sandbox-pg/sandboxGateway.ts` | `SandboxPaymentGateway` (AntriPay): transaksi, QR, VA, kartu uji + OTP, refund, notifikasi HMAC | 252 |
| ☐ | `src/server/sandbox-pg/routes.ts` | Router halaman & API checkout `/pg/...` | 35 |
| ☐ | `src/client/pg/checkout.ts` | Halaman checkout AntriPay (e-wallet, VA, kartu, OTP) | 202 |
| ☐ | `src/public/pg/checkout.html` | HTML halaman checkout AntriPay | 18 |
| ☐ | `src/tests/pembayaran.test.ts` | Test pembayaran & AntriPay Sandbox (QR, VA, kartu, OTP, refund, webhook) | 156 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/pembayaran.ts \
  src/server/adapters/paymentGatewayAdapter.ts \
  src/server/controllers/metodePembayaranController.ts \
  src/server/routes/pembayaran.ts \
  src/client/views/pembayaranView.ts \
  src/server/sandbox-pg/sandboxGateway.ts \
  src/server/sandbox-pg/routes.ts \
  src/client/pg/checkout.ts \
  src/public/pg/checkout.html \
  src/tests/pembayaran.test.ts
```
</details>

### Gelombang 2: Simulator antrean dummy (iterasi 2)

Branch: `feat/simulasi` · Commit: `feat(simulasi): simulator antrean dummy`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/services/simulatorAntrean.ts` | `SimulatorAntrean`: pelanggan dummy memesan, restoran dummy melayani | 176 |
| ☐ | `src/server/controllers/simulasiController.ts` | `SimulasiController`: atur mode simulasi restoran | 43 |
| ☐ | `src/server/routes/simulasi.ts` | Endpoint `/api/kelola/simulasi` | 9 |
| ☐ | `src/client/views/simulasiView.ts` | Panel simulasi di dashboard antrean | 46 |
| ☐ | `src/tests/simulasi.test.ts` | Test simulator antrean dummy | 56 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/services/simulatorAntrean.ts \
  src/server/controllers/simulasiController.ts \
  src/server/routes/simulasi.ts \
  src/client/views/simulasiView.ts \
  src/tests/simulasi.test.ts
```
</details>

---

## 4. Chatima Anandakhorita (Atim): UC01, UC04, UC05

### Gelombang 2: UC01 Pencarian restoran

Branch: `feat/pencarian` · Commit: `feat(pencarian): pencarian dan filter restoran (UC01)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/restoran.ts` | Model `Restoran` (C02): pencarian, detail, buat, hapus (soft delete) | 218 |
| ☐ | `src/server/controllers/pencarianController.ts` | `PencarianController` (C35) | 39 |
| ☐ | `src/server/routes/pencarian.ts` | Endpoint `/api/restoran` | 7 |
| ☐ | `src/client/views/komponen.ts` | Kartu restoran & badge antrean/meja (dipakai I-05, I-16) | 35 |
| ☐ | `src/client/views/pencarianView.ts` | Layar I-05 Beranda & pencarian, I-06 Detail restoran & menu | 240 |
| ☐ | `src/tests/pencarian.test.ts` | Test UC01 | 36 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/restoran.ts \
  src/server/controllers/pencarianController.ts \
  src/server/routes/pencarian.ts \
  src/client/views/komponen.ts \
  src/client/views/pencarianView.ts \
  src/tests/pencarian.test.ts
```
</details>

### Gelombang 2: UC04-UC05 Pendaftaran & verifikasi mitra

Branch: `feat/mitra` · Commit: `feat(mitra): pendaftaran dan verifikasi mitra restoran (UC04, UC05)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/mitra.ts` | Data `PengajuanMitra` dan `DokumenVerifikasi` (C13) | 142 |
| ☐ | `src/server/adapters/notifikasiEmail.ts` | `NotifikasiEmail` (C15) | 36 |
| ☐ | `src/server/controllers/pengajuanMitraController.ts` | `PengajuanMitraController` (C12): validasi, simpan, setujui, tolak | 215 |
| ☐ | `src/server/routes/mitra.ts` | Endpoint `/api/mitra/*`, `/api/admin/pengajuan`, unggah dokumen | 48 |
| ☐ | `src/client/views/mitraView.ts` | Layar I-13 Pendaftaran mitra, I-18 Verifikasi pengajuan | 210 |
| ☐ | `src/tests/mitra.test.ts` | Test UC04-UC05 | 65 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/mitra.ts \
  src/server/adapters/notifikasiEmail.ts \
  src/server/controllers/pengajuanMitraController.ts \
  src/server/routes/mitra.ts \
  src/client/views/mitraView.ts \
  src/tests/mitra.test.ts
```
</details>

---

## 5. Muhammad Nur Fikri Hariyawan: UC03, UC06, UC07, UC09

### Gelombang 2: UC03, UC06, UC09 Antrean

Branch: `feat/antrean` · Commit: `feat(antrean): status antrean real-time, dashboard, dan dequeue (UC03, UC06, UC09)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/antrean.ts` | Model `Antrean` (C04) dan `TiketAntrean` (C09): dequeue, estimasi, status | 329 |
| ☐ | `src/server/realtime/eventBus.ts` | Kanal event perubahan antrean (untuk SSE) | 15 |
| ☐ | `src/server/controllers/pemantauAntreanController.ts` | `PemantauAntreanController` (C10): status tiket & SSE | 62 |
| ☐ | `src/server/controllers/kelolaAntreanController.ts` | `KelolaAntreanController` (C16): dashboard, dequeue, timer 30 menit | 138 |
| ☐ | `src/server/routes/antrean.ts` | Endpoint status antrean, stream SSE, `/api/kelola/antrean`, `/api/kelola/kuota` | 21 |
| ☐ | `src/client/views/statusAntreanView.ts` | Layar I-11 Status antrean (`HalamanStatusAntrean`, C11) | 133 |
| ☐ | `src/client/views/kelolaAntreanView.ts` | Layar I-14 Dashboard antrean, I-15 Konfirmasi dequeue | 140 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/antrean.ts \
  src/server/realtime/eventBus.ts \
  src/server/controllers/pemantauAntreanController.ts \
  src/server/controllers/kelolaAntreanController.ts \
  src/server/routes/antrean.ts \
  src/client/views/statusAntreanView.ts \
  src/client/views/kelolaAntreanView.ts
```
</details>

### Gelombang 2: UC07 Kuota & meja

Branch: `feat/antrean` · Commit: `feat(kuota): pengaturan kuota antrean dan kapasitas meja (UC07)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/kuota.ts` | Model `Kuota` (C20) | 37 |
| ☐ | `src/server/controllers/pengaturanKuotaController.ts` | `PengaturanKuotaController` (C21) | 56 |
| ☐ | `src/client/views/pengaturanKuotaView.ts` | Layar I-16 Pengaturan kuota & meja | 52 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/kuota.ts \
  src/server/controllers/pengaturanKuotaController.ts \
  src/client/views/pengaturanKuotaView.ts
```
</details>

### Gelombang 2: Test & profiling

Branch: `feat/antrean` · Commit: `test(antrean): pengujian antrean dan profiling dashboard`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/tests/antrean.test.ts` | Test UC03, UC06, UC07, UC09 | 141 |
| ☐ | `src/scripts/profile-dashboard.ts` | Skrip profiling (`npm run profile`, laporan B.2.1) | 94 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/tests/antrean.test.ts \
  src/scripts/profile-dashboard.ts
```
</details>

---

## 6. Athallah Nanda Andita: UC13, UC14, UC15, ulasan & rating

### Gelombang 2: UC13-UC14 Keluhan

Branch: `feat/keluhan` · Commit: `feat(keluhan): pengiriman dan penanggapan keluhan (UC13, UC14)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/keluhan.ts` | Model `Keluhan` (C30) | 80 |
| ☐ | `src/server/controllers/keluhanController.ts` | `KeluhanController` (C41) | 71 |
| ☐ | `src/client/views/keluhanView.ts` | Layar I-12 Formulir keluhan, I-19 Daftar keluhan | 155 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/keluhan.ts \
  src/server/controllers/keluhanController.ts \
  src/client/views/keluhanView.ts
```
</details>

### Gelombang 2: UC15 Hapus restoran

Branch: `feat/keluhan` · Commit: `feat(admin): kelola dan hapus restoran mitra (UC15)`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/controllers/kelolaDataRestoranController.ts` | `KelolaDataRestoranController` (C33) | 55 |
| ☐ | `src/server/routes/keluhan.ts` | Endpoint `/api/keluhan`, `/api/admin/keluhan`, `/api/admin/restoran` | 17 |
| ☐ | `src/client/views/kelolaRestoranView.ts` | Layar I-20 Kelola restoran, I-21 Konfirmasi hapus | 69 |
| ☐ | `src/tests/keluhan.test.ts` | Test UC13-UC15 | 70 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/controllers/kelolaDataRestoranController.ts \
  src/server/routes/keluhan.ts \
  src/client/views/kelolaRestoranView.ts \
  src/tests/keluhan.test.ts
```
</details>

### Gelombang 2: Ulasan & rating (iterasi 2)

Branch: `feat/ulasan` · Commit: `feat(ulasan): ulasan dan rating restoran`

| | File | Isi | Baris |
| :---: | :--- | :--- | ---: |
| ☐ | `src/server/models/ulasan.ts` | Model `Ulasan` + hitung ulang rating restoran | 61 |
| ☐ | `src/server/controllers/ulasanController.ts` | `UlasanController` | 52 |
| ☐ | `src/server/routes/ulasan.ts` | Endpoint ulasan restoran & pesanan | 9 |
| ☐ | `src/client/views/ulasanView.ts` | Komponen formulir & daftar ulasan | 64 |
| ☐ | `src/tests/ulasan.test.ts` | Test ulasan & rating | 61 |

<details><summary>Perintah checkout</summary>

```bash
git checkout origin/claude/charming-lovelace-xxr0nl -- \
  src/server/models/ulasan.ts \
  src/server/controllers/ulasanController.ts \
  src/server/routes/ulasan.ts \
  src/client/views/ulasanView.ts \
  src/tests/ulasan.test.ts
```
</details>

---

## Catatan

- Total ada 123 file. Setiap file hanya dimiliki satu orang, dan tidak ada file yang terlewat atau dobel.
- Beberapa file dipakai bersama. Contohnya `models/restoran.ts` (Atim) juga dipakai UC15 Athallah (`setSoftDelete`, `daftarUntukAdmin`), dan `client/core/ui.ts` (Fauzi) dipakai semua halaman. Kalau perlu mengubah file milik orang lain, lakukan lewat PR sendiri dan minta pemilik file me-review.
- `docs/M9/assets/foto-asistensi.jpg` tidak ada di daftar karena sudah ada di `main` dari asisten.
- Setelah gelombang 3: Fauzi menjalankan `npm install && npm test` di `main` (harus 68 test lulus), lalu membuat release tag `v9.0`.
