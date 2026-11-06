# AGENTS.md — Panduan untuk agen AI & anggota tim SILEMBUR

Dokumen ini dibaca **sebelum** menulis kode apa pun di repo ini, baik oleh manusia maupun agen AI/asisten koding.

## 1. Proyek

SILEMBUR (Sistem Informasi Lembur): aplikasi mobile pelaporan kerusakan fasilitas umum di satu kota (Kota Bandung).
Tiga peran: **Pelapor** (masyarakat), **Admin** (verifikator), **Pemda** (pemerintah daerah).
Tugas Besar IF2150 RPL K02-G03, milestone 9 (implementasi). Deadline: **Rabu, 11 Nov 2026 21.50 WIB**.

## 2. Sumber kebenaran (urut prioritas)

1. `src/docs/KEPUTUSAN.md` — penyesuaian resmi atas SKPL/DPPL (gap G1–G15). Menang bila bertentangan dengan dokumen lain.
2. `src/docs/API.md` — kontrak endpoint & bentuk data. Wajib dipatuhi; ubah hanya bersama pemakainya.
3. `docs/M8/K02_G03_DPPL2.md` — kelas, algoritma (Algo-001..012), query (Q-001..013), rancangan layar (I-01..I-10).
4. `docs/M5/K02_G03_SKPL.md` — kebutuhan KF01–KF24, KNF01–KNF05, skenario UC01–UC08.
5. `docs/M9/KXX_GYY_Implementasi.md` bagian A — aturan penilaian implementasi.

Dokumen pendukung: `src/docs/ARCHITECTURE.md`, `src/docs/DATABASE.md` (ERD), `src/docs/CONVENTIONS.md`, `src/docs/tasks/P1..P5.md`.

## 3. Stack & perintah

| Bagian | Teknologi |
| :--- | :--- |
| Mobile (View) | Expo SDK 58, React Native 0.88, Expo Router, JavaScript — `src/mobile` |
| Server (Controller + Model) | Node.js 24, Express 5, `pg` (SQL mentah), zod, multer, JWT — `src/server` |
| Basis data | PostgreSQL 18 via `src/docker-compose.yml` |
| Bersama | `src/shared/constants.js` (status, kategori, peran, transisi, aturan) |

Semua perintah dari folder `src/`:
```bash
npm install                 # sekali, workspace shared + server + mobile
npm run db:up               # PostgreSQL 18 (Docker)
npm run db:migrate          # jalankan migrasi baru
npm run db:seed             # isi ulang data fiktif (akun uji, kata sandi: silembur123)
npm run dev:server          # API di http://localhost:3000/api
npm run dev:mobile          # Expo; buka di Expo Go / emulator
npm test                    # test server (Vitest, DB silembur_test)
```
Tambah dependensi mobile **selalu** dengan `npx expo install <paket>` dari `src/mobile` (bukan `npm install`) agar versinya cocok dengan SDK.
Tambah dependensi server: `npm install <paket> -w server`.

## 4. Peta kode

```
src/shared/constants.js               STATUS, TRANSISI_STATUS, KATEGORI, BOBOT_KATEGORI, PERAN, ATURAN, PESAN
src/server/src/routes/index.js        SEMUA endpoint sudah terdaftar (stub 501 menyebut pemiliknya)
src/server/src/controllers/           5 controller DPPL + Auth, Notifikasi, Referensi
src/server/src/models/index.js        peta kelas DPPL (C01..C11) -> fungsi model
src/server/src/models/<kelas>/*.js    fungsi model, dipecah per pemilik
src/server/src/middleware/            autentikasi (wajibLogin, wajibPeran), validasi (zod), upload, errorHandler
src/server/src/adapters/              cloudStorageAdapter, googleMapsAdapter (+ fallback offline)
src/server/src/db/                    pool + withTransaction, migrate, seed, migrations/*.sql
src/server/tests/                     Vitest + supertest; helpers.js (loginSebagai, auth)
src/mobile/src/app/                   rute Expo Router: login, warga/, admin/, pemda/ (hanya re-export layar)
src/mobile/src/features/<fitur>/      isi layar per fitur  <- tempat kerja utama di mobile
src/mobile/src/api/                   pembungkus HTTP per fitur; client.js (token, timeout 5 dtk)
src/mobile/src/components/ui|map      UI kit & peta (PetaPilih, PetaTampil)
```

## 5. Kepemilikan (anti-bentrok)

| Pemilik | Fitur | Server | Mobile |
| :--- | :--- | :--- | :--- |
| P1 | Fondasi, auth, integrasi Google, **UC07** duplikat | `DuplikatController`, `models/konfirmasiDuplikat`, `AuthController`, `models/pengguna`, `middleware`, `adapters`, `db`, `routes`, `app.js` | `features/duplikat`, `features/akun`, `app/**`, `api/client.js`, `auth`, `components/map`, `components/navigasi` |
| P2 | **UC01** buat & revisi laporan | `controllers/laporan/buat.js`, `models/laporan/buat.js`, `models/lokasi`, `models/fasilitas/cocokkan.js` | `features/pelaporan`, `api/laporan.js` |
| P3 | **UC04, UC05**, notifikasi pelapor, UI kit | `controllers/laporan/publik.js`, `laporan/saya.js`, `NotifikasiController`, `models/laporan/publik.js`, `saya.js`, `models/riwayatStatus`, `models/notifikasi/inbox.js` | `features/warga`, `api/warga.js`, `components/ui`, `theme`, `utils/format.js` |
| P4 | **UC02** verifikasi, skor, kirim notifikasi | `VerifikasiController`, `models/laporan/verifikasi.js`, `models/verifikasi`, `models/skorPrioritas`, `models/notifikasi/kirim.js` | `features/verifikasi`, bagian P4 `api/admin.js` |
| P5 | **UC03, UC06, UC08**, update status pemda, profiling | `PrioritasController`, `FasilitasController`, `models/laporan/prioritas.js`, `models/fasilitas/berulang.js`, `riwayat.js` | `features/prioritas`, `features/fasilitas`, `api/pemda.js` |

Bersama (diubah hanya lewat PR kecil ke P1): `shared/constants.js`, `routes/index.js`, `models/index.js`, `migrations/001_init.sql`, `mobile/src/app/**`.
Migrasi baru: `NNN_deskripsi.sql`, rentang P1=1xx, P2=2xx, P3=3xx, P4=4xx, P5=5xx. Jangan ubah migrasi yang sudah di-merge.

## 6. Aturan domain yang tidak boleh dilanggar

- **Status laporan hanya berubah lewat `Laporan.ubahStatus(db, {...})`** (models/laporan/status.js). Fungsi ini memeriksa `TRANSISI_STATUS` dan mencatat `riwayat_status`. Jangan menulis `UPDATE laporan SET status_laporan` sendiri.
- Nilai status/kategori/keputusan selalu dari `@silembur/shared`, jangan mengetik string manual.
- **KNF02:** identitas pelapor (nama, email, id) hanya boleh muncul di respons endpoint `/admin/*`. Publik dan Pemda tidak pernah melihatnya.
- Laporan baru berstatus `Menunggu Verifikasi`; hanya `Terverifikasi`/`Diproses` yang masuk daftar prioritas pemda (KF08).
- Skor prioritas dihitung server (Algo-009), **bukan** diinput admin (gap G3).
- Operasi yang menulis > 1 tabel memakai `withTransaction` dari `db/pool.js`; fungsi model menerima `db` sebagai argumen pertama.
- SQL selalu berparameter (`$1`, `$2`, ...).
- Pesan pengguna Bahasa Indonesia; pesan skenario SKPL ada di `PESAN` (mis. "Belum ada laporan", "Tolong muat ulang halaman").
- Mobile tidak menghitung aturan bisnis; validasi di mobile hanya untuk UX (server tetap memvalidasi).

## 7. Cara mengerjakan satu fitur

1. Baca file tugasmu `src/docs/tasks/P<n>.md` dan bagian terkait di `API.md`.
2. Cari stub yang melempar `belumDiimplementasi('P<n>', ...)` (server) atau `<LayarBelumJadi pemilik="P<n>">` (mobile): itulah daftar pekerjaanmu.
3. Server dulu: model → controller → test (`server/tests/<fitur>.test.js`, pakai `helpers.js`). `npm test` harus hijau.
4. Lalu layar di `mobile/src/features/<fitur>/`, memakai `useApi`, UI kit, dan `api/<fitur>.js`. Tangani memuat/kosong/gagal.
5. Contoh pola lengkap yang sudah jadi: login (`AuthController.login` + `mobile/src/app/login.js`) dan test `server/tests/auth.test.js`.
6. Penyimpangan baru dari SKPL/DPPL → tambahkan baris di `src/docs/KEPUTUSAN.md` dan `docs/M9/K02_G03_Implementasi.md` B.1.

## 8. Git & keamanan repo (repo PUBLIC)

- Branch `feat/p<n>-<fitur>`, Conventional Commits (`feat(laporan): ...`), PR ke `main` + 1 reviewer. Detail: `src/docs/CONVENTIONS.md`.
- **Jangan** menambahkan trailer `Co-Authored-By` milik alat AI, dan jangan menyebut nama alat/vendor AI di commit, PR, maupun kode. Pencatatan penggunaan AI hanya di `docs/K02_G03_AI-Usage.md`, diisi oleh anggota tim.
- Jangan commit `.env`, kunci API, kredensial, `node_modules/`, `server/uploads/`. Data uji harus fiktif.
- Jangan mengubah folder milestone lama `docs/M1`–`docs/M8`.
- Agen AI: jangan commit/push tanpa diminta eksplisit oleh anggota yang menjalankanmu.

## 9. Catatan Expo (SDK 58)

- Expo berubah tiap SDK; jangan mengandalkan ingatan. Cek dokumen versi yang cocok: `https://docs.expo.dev/versions/v58.0.0/`.
- Rute ada di `src/mobile/src/app/` (Expo Router memakai `src/app` bila ada). Komponen non-rute di luar `src/app/`.
- `Stack` dari `expo-router`; tab bawah memakai `Tabs` dari `expo-router/js-tabs`.
- Expo Go hanya memuat modul native bawaannya. Paket native baru di luar SDK butuh development build (`npx expo run:android` atau EAS).
- `ios/` dan `android/` dihasilkan otomatis (tidak di-commit). Konfigurasi native lewat `app.json` + config plugin.
- Cek kesehatan dependensi: `npx expo-doctor` dari `src/mobile`.
