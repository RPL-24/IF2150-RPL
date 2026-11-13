# MahaSehat: Mental Health Monitoring App for Students

Aplikasi berbasis web responsif (*Model-View-Controller*) untuk pemantauan berkala kesehatan mental pelajar dan mahasiswa, dilengkapi dengan *daily check-in* terenkripsi AES-256, visualisasi statistik perkembangan emosi & pola tidur, deteksi dini kondisi darurat bagi orang tua/wali, serta pencarian dan penjadwalan konsultasi dengan tenaga kesehatan profesional terdekat.

---

## 1. Teknologi yang Digunakan

| Komponen | Teknologi & Versi |
| :--- | :--- |
| **Runtime & Backend** | Node.js 20 atau lebih baru, Express.js v4.19+ |
| **Basis Data (DBMS)** | PostgreSQL 15+ (`pg` v8.12+) |
| **Frontend (View)** | HTML5, CSS3, Vanilla JavaScript (Responsive Web UI) |
| **Keamanan & Otentikasi** | JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Enkripsi Jurnal AES-256 (`crypto`) |
| **Layanan Eksternal** | Web Geolocation API & Haversine (jarak nakes), Nodemailer (SMTP opsional) |
| **Penjadwalan** | `node-cron` v4.6+ (evaluasi notifikasi darurat harian) |
| **Pengujian** | Jest v29.7+, Supertest v7.0+ |

---

## 2. Prasyarat dan Instalasi

### Prasyarat
1. **Node.js** versi 20 LTS atau lebih baru (`node -v`).
2. **PostgreSQL** versi 15+ yang sedang berjalan secara lokal (atau URI PostgreSQL cloud seperti Supabase/Neon).

### Langkah Instalasi
```bash
# 1. Masuk ke direktori kode sumber
cd src

# 2. Instal seluruh dependensi sesuai package-lock.json
npm ci
```

---

## 3. Konfigurasi Basis Data & Environment Variable

1. Salin berkas `.env.example` menjadi `.env` di dalam folder `src/`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan konfigurasi koneksi PostgreSQL pada `.env` (contoh default lokal):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mahasehat_db
   JWT_SECRET=isi_dengan_teks_acak_minimal_32_karakter
   AES_SECRET_KEY=isi_dengan_teks_acak_32_karakter
   ```
   `JWT_SECRET` dan `AES_SECRET_KEY` wajib diisi; aplikasi menolak membuat token atau mengenkripsi data tanpa keduanya. Variabel `SMTP_*` dan `EMERGENCY_CRON` opsional: tanpa SMTP, tautan konfirmasi/reset dicetak ke log server. Nilai acak dapat dibuat dengan:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Buat database `mahasehat_db` di PostgreSQL (jika belum ada), lalu jalankan inisialisasi skema beserta *seed data* awal:
   ```bash
   npm run db:seed
   ```
   *(Catatan: `npm run db:init` hanya untuk database kosong; `schema.sql` belum idempotent dan tidak menghapus tabel lama. Jika tabel sudah ada, cukup jalankan `npm start`.)*

---

## 4. Cara Menjalankan Aplikasi & Pengujian

```bash
# Menjalankan server dalam mode produksi/normal
npm start

# Menjalankan server dalam mode pengembangan (auto-reload)
npm run dev

# Menjalankan unit test
npm test
```

Suite integrasi basis data berjalan bila `TEST_DATABASE_URL` diisi; tanpa variabel itu 4 suite di-skip (isi database uji akan dikosongkan saat test berjalan).

Evaluasi notifikasi darurat (UC08) berjalan otomatis setiap hari sesuai `EMERGENCY_CRON`. Untuk menjalankannya sekali tanpa menunggu jadwal, misalnya saat uji dengan akun `citra.pelajar@mahasehat.id` dan wali `ratna.wali@mahasehat.id`:

```bash
npm run job:darurat
```

Buka **`http://localhost:3000`**; alamat `/` diarahkan ke halaman masuk. Halaman lain bisa dibuka lewat `http://localhost:3000/views/<NamaHalaman>.html`.

---

## 5. Akun Uji (Test Accounts)

Seluruh akun uji pada `seed.sql` menggunakan kata sandi yang sama: **`Password123!`**

| Peran (Role) | Email / Username | Password | Status Akun | Keterangan Skenario Uji |
| :--- | :--- | :--- | :--- | :--- |
| **Pelajar (Dewasa)** | `budi.pelajar@mahasehat.id` | `Password123!` | `Aktif` | Memiliki riwayat check-in 5 hari, terhubung ke Wali `WALI-001` |
| **Pelajar (Skenario Darurat)** | `citra.pelajar@mahasehat.id` | `Password123!` | `Aktif` | Mood rendah 3 hari beruntun lalu tidak check-in lagi, terhubung ke Wali `WALI-002` (UC08) |
| **Pelajar (< 18 Thn)** | `andi.siswa@mahasehat.id` | `Password123!` | `Belum Terverifikasi` | Menunggu konfirmasi wali (`TOKEN-WALI-ANDI-2026` untuk uji UC02), belum terhubung ke wali |
| **Orang Tua / Wali** | `santoso.wali@mahasehat.id` | `Password123!` | `Aktif` | Memantau laporan Budi tanpa melihat teks jurnal pribadi (KNF02) |
| **Orang Tua / Wali (Skenario Darurat)** | `ratna.wali@mahasehat.id` | `Password123!` | `Aktif` | Wali Citra, penerima notifikasi darurat (UC08) |
| **Tenaga Kesehatan (Psikolog)** | `siti.psikolog@mahasehat.id` | `Password123!` | `Aktif` | Klinik Kesehatan Mental Tenang (memiliki pengajuan `JDW-003` untuk uji UC07) |
| **Tenaga Kesehatan (Psikiater)** | `hendra.psikiater@mahasehat.id` | `Password123!` | `Aktif` | Unit Psikiatri RS Harapan Sehat |
| **Tenaga Kesehatan (Psikolog)** | `nadia.psikolog@mahasehat.id` | `Password123!` | `Aktif` | Pusat Konseling Remaja Cerah, punya slot `JDW-007` |

Akun lain yang mungkin ada di DB (dibuat manual saat pengujian) tidak dijamin memakai password tersebut.

---

## 6. Struktur Folder (`src/`) & Arsitektur MVC

```text
src/
├── config/
│   ├── db.js                  # Pool koneksi PostgreSQL & helper transaksi (withTransaction)
│   ├── schema.sql             # Definisi DDL 9 tabel utama & indeks (C01-C09)
│   ├── seed.sql               # Data uji fiktif untuk seluruh role
│   └── initDb.js              # Skrip migrasi & seeder otomatis
├── models/                    # Komponen Model (<<entity>> C01 - C09, NotifikasiDarurat)
├── controllers/               # Controller: auth, check-in, konsultasi, laporan, nakes, notifikasi, password
├── routes/                    # Definisi endpoint REST API per modul
│   ├── index.js               # Router utama (/api/*)
│   ├── authRoutes.js
│   ├── checkInRoutes.js
│   ├── konsultasiRoutes.js
│   ├── reportRoutes.js
│   ├── tenagaKesehatanRoutes.js
│   └── emergencyRoutes.js
├── jobs/                      # Job terjadwal: evaluasi notifikasi darurat harian (node-cron)
├── middleware/
│   └── authMiddleware.js      # Verifikasi JWT & otorisasi berbasis Role (KNF02)
├── utils/
│   ├── encryption.js          # Enkripsi & dekripsi AES-256-CBC (KNF01)
│   ├── distance.js            # Validasi koordinat & Haversine Formula (UC05)
│   ├── waktu.js               # Tanggal zona Asia/Jakarta
│   ├── respon.js              # Bentuk respons API seragam { success, message, data }
│   ├── kirimEmail.js          # E-mail notifikasi darurat; cetak ke log bila SMTP_HOST kosong
│   ├── mailer.js              # E-mail konfirmasi wali & reset password
│   └── AppError.js            # Galat dengan kode status HTTP
├── frontend/                  # Komponen View (<<boundary>>): views/*.html, css, js, dan assets/
├── public/                    # Berkas statis tambahan
├── tests/                     # Pengujian otomatis (Jest & Supertest)
├── app.js                     # Konfigurasi aplikasi Express
└── server.js                  # Entrypoint HTTP server
```

---

## 7. Daftar Modul/Fitur & Pembagian Tugas Anggota (K03-G04)

| NIM | Nama Anggota | Peran & Modul / Fitur yang Diimplementasikan | Use Case & Kelas DPPL Terkait |
| :--- | :--- | :--- | :--- |
| **13525021** | Haikal Muhammad Royyan | Backend autentikasi, model C01-C09, notifikasi darurat, scheduler, skema/seed, pengujian | UC01, UC02, UC08, UC09, UC10 (C01-C11, C24) |
| **13525066** | Cynthia Winda Wijaya | Registrasi, login, konfirmasi registrasi, pop-up notifikasi, pencarian nakes, check-in, routing konsultasi | UC01, UC02, UC03, UC05, UC08 (C10, C12, C13, C18, C25, C26) |
| **13525081** | Rendy Salastra Putra | Integrasi FE-BE, design system/auth layout, sidebar, manajemen konsultasi, setelan nakes dan orang tua/wali | UC06, UC07, C21-C23, C29 |
| **13525090** | Sophia Imelda Rogate Marpaung | Dashboard tiga peran, setelan awal, laporan kesehatan, reset password, aset | UC03, UC04 (C16, C28, C29) |
| **13525141** | Christabelcyne Costan | Backend check-in, backend laporan kesehatan, backend manajemen konsultasi | UC03, UC04, UC07 (C06, C07, C14, C17, C23) |

### Kontrak Endpoint API Tim (API Specification)

| Modul & Use Case | Method & Endpoint | Deskripsi | File Route |
| :--- | :--- | :--- | :--- |
| **Auth & Registrasi** (UC01, UC02, UC09, UC10) | `POST /api/auth/register`<br>`GET /api/auth/confirm/:token`<br>`POST /api/auth/confirm/:token`<br>`POST /api/auth/reject/:token`<br>`GET /api/auth/wali/menunggu`<br>`POST /api/auth/login`<br>`GET /api/auth/me`<br>`PATCH /api/auth/me`<br>`POST /api/auth/logout`<br>`POST /api/auth/forgot-password`<br>`POST /api/auth/reset-password` | Registrasi 3 role, konfirmasi/tolak wali, login JWT, profil, logout, reset password | `routes/authRoutes.js` |
| **Daily Check-In** (UC03) | `POST /api/check-in`<br>`GET /api/check-in/status`<br>`GET /api/check-in/history` | Simpan check-in (jurnal AES-256), status hari ini, dan riwayat | `routes/checkInRoutes.js` |
| **Statistik & Laporan** (UC04) | `GET /api/reports/summary`<br>`GET /api/reports/riwayat` | Ringkasan agregat 7/30/90 hari dan riwayat check-in pelajar | `routes/reportRoutes.js` |
| **Cari Nakes** (UC05) | `GET /api/tenaga-kesehatan`<br>`GET /api/tenaga-kesehatan/:id`<br>`PUT /api/tenaga-kesehatan/lokasi-pelajar`<br>`PATCH /api/tenaga-kesehatan/me/tarif` | Daftar nakes + jarak, detail profil dan slot, simpan lokasi/tarif | `routes/tenagaKesehatanRoutes.js` |
| **Pengajuan & Kelola Konsultasi** (UC06, UC07) | `POST /api/konsultasi`<br>`GET /api/konsultasi/saya`<br>`GET /api/konsultasi/masuk`<br>`GET /api/konsultasi/jadwal`<br>`PUT /api/konsultasi/:id/status`<br>`PUT /api/konsultasi/:id/jadwal`<br>`POST /api/konsultasi/:id/tolak` | Pelajar mengajukan; nakes melihat, menyetujui, menjadwalkan ulang, atau menolak | `routes/konsultasiRoutes.js` |
| **Notifikasi Darurat** (UC08) | `GET /api/emergency/wali`<br>`PUT /api/emergency/:id/confirm`<br>`PUT /api/emergency/:id/follow-up` | Daftar notifikasi aktif, konfirmasi diterima, tindak lanjut wali | `routes/emergencyRoutes.js` |

---

## 8. Daftar Tabel Basis Data (Urut Berdasarkan Kelas DPPL C01–C09)

| ID Kelas DPPL | Nama Kelas Model | Nama Tabel PostgreSQL | Atribut Utama |
| :--- | :--- | :--- | :--- |
| **C01** | `Pengguna` | `pengguna` | `id_pengguna` (PK), `username`, `email`, `password_hash`, `role`, `status_akun`, `versi_token`, `token_konfirmasi`, `reset_token`, `reset_token_expires` |
| **C02** | `Pelajar` | `pelajar` | `id_pelajar` (PK), `id_pengguna` (FK), `id_wali` (FK), `nama`, `tanggal_lahir`, `nomor_telepon`, `nomor_telepon_wali`, `email_wali`, `lokasi_saat_ini`, `status_darurat` |
| **C03** | `OrangTuaWali` | `orang_tua_wali` | `id_wali` (PK), `id_pengguna` (FK), `nama`, `email`, `nomor_telepon` |
| **C04** | `TenagaKesehatan` | `tenaga_kesehatan` | `id_tenaga_kesehatan` (PK), `id_pengguna` (FK), `id_fasilitas` (FK), `nama`, `email`, `nomor_telepon`, `jenis_tenaga_kesehatan`, `nomor_str`, `lokasi` |
| **C05** | `RiwayatKesehatan` | `riwayat_kesehatan` | `id_riwayat` (PK), `id_pelajar` (FK), `riwayat_kesehatan` (Terenkripsi AES-256) |
| **C06** | `CheckIn` | `check_in` | `id_check_in` (PK), `id_pelajar` (FK), `tanggal_check_in` (unik per pelajar), `skala_mood`, `jam_tidur`, `jam_bangun`, `pola_makan`, `pemicu_stres`, `catatan_refleksi` (AES-256) |
| **C07** | `LaporanKesehatan` | *(Objek Komputasi)* | Dihitung dinamis dari agregasi tabel `check_in` melalui `evaluateThreshold()` & `detectEmergency()` (sesuai DPPL BAB 5.7) |
| **C08** | `FasilitasKesehatan` | `fasilitas_kesehatan` | `id_fasilitas` (PK), `nama_fasilitas`, `alamat`, `lokasi` (`lat,lng`), `estimasi_biaya` |
| **C09** | `JadwalKonsultasi` | `jadwal_konsultasi` | `id_jadwal` (PK), `id_tenaga_kesehatan` (FK), `id_pelajar` (FK), `tanggal`, `waktu`, `status_ketersediaan`, `status_pengajuan`, `keluhan` |
| **C24** | `NotifikasiDarurat` | `notifikasi_darurat` | `id` (PK), `id_pelajar` (FK), `id_wali` (FK, boleh kosong), `email_tujuan`, `ringkasan_kondisi`, `status`, `jumlah_percobaan`, `waktu_kirim`, `waktu_konfirmasi`, `status_tindak_lanjut`, `waktu_tindak_lanjut` |


