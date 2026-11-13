# SILEMBUR — Sistem Informasi Lembur

Aplikasi mobile (Android & iOS) untuk melaporkan kerusakan fasilitas umum (jalan berlubang, lampu jalan mati, pohon
tumbang) di Kota Bandung. Masyarakat mengirim laporan berisi foto, lokasi GPS, dan deskripsi; admin memverifikasi;
pemerintah daerah menerima daftar laporan terverifikasi yang terurut berdasarkan skor prioritas. Laporan duplikat bisa
digabung dan riwayat kerusakan per fasilitas bisa ditelusuri.

Tugas Besar IF2150 Rekayasa Perangkat Lunak — Kelas K02, Kelompok G03.

## Teknologi

| Bagian | Teknologi & versi |
| :--- | :--- |
| Aplikasi mobile | Expo SDK 58 (React Native 0.88, React 19.3), Expo Router 58, JavaScript |
| Server API | Node.js 24, Express 5, node-postgres 8, zod 4, multer 2, jsonwebtoken 9 |
| Basis data | PostgreSQL 18 (Docker) |
| Pengujian | Vitest 5 + Supertest 7 |
| Layanan eksternal (opsional) | Google Maps Platform, Google Sign-In, Google Cloud Storage — semuanya punya fallback lokal |

Arsitektur MVC di atas klien-server: lihat [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Prasyarat

- Node.js **24** dan npm 11
- Docker Desktop (untuk PostgreSQL 18)
- Untuk mencoba aplikasi: HP Android/iOS dengan aplikasi **Expo Go** (SDK 58) di jaringan Wi-Fi yang sama dengan laptop, **atau** emulator Android (Android Studio)

## Instalasi & konfigurasi

Semua perintah dijalankan dari folder `src/`.

```bash
npm install
cp server/.env.example server/.env
cp mobile/.env.example mobile/.env
npm run db:up
npm run db:migrate
npm run db:seed
```

Variabel penting (`server/.env`): `DATABASE_URL`, `JWT_SECRET`, `STORAGE_DRIVER` (`local`/`gcs`), `GOOGLE_MAPS_API_KEY` (kosong = wilayah offline).
Mobile (`mobile/.env`): `EXPO_PUBLIC_API_URL` — kosongkan agar otomatis memakai IP laptop; emulator Android pakai `http://10.0.2.2:3000`.

## Menjalankan

Terminal 1 — server API:
```bash
npm run dev:server
```
Terminal 2 — aplikasi mobile:
```bash
npm run dev:mobile
```
Pindai QR yang muncul dengan Expo Go (Android) atau Kamera (iOS), atau tekan `a` untuk emulator Android.
Jika HP tidak bisa terhubung ke API, izinkan Node.js melewati Windows Firewall untuk port 3000.

Menjalankan test (butuh `npm run db:up`):
```bash
npm test
```

### Jika Docker Desktop di Windows gagal start

Gejala: `docker` menggantung, atau log Docker Desktop berisi `dockerInference` / `engine.sock: The file cannot be accessed by the system`.
Alternatifnya, jalankan Docker Engine langsung di Ubuntu WSL. PostgreSQL tetap bisa diakses dari Windows di `localhost:5432`.

1. Pasang Docker Engine di Ubuntu WSL mengikuti [panduan resmi Docker untuk Ubuntu](https://docs.docker.com/engine/install/ubuntu/), lalu `sudo usermod -aG docker $USER` dan `sudo systemctl enable --now docker` (butuh `systemd=true` di `/etc/wsl.conf`).
2. Dari folder `src/` di Windows, pakai skrip versi WSL:
   ```bash
   npm run db:up:wsl
   ```
   Lalu lanjutkan `npm run db:migrate`, `npm run db:seed`, dan `npm test` seperti biasa.

### Menguji di PC dengan emulator Android (tanpa Android Studio)

Butuh ±5 GB ruang disk dan virtualisasi aktif (Windows Hypervisor Platform).

1. Unduh *command line tools* dari [developer.android.com/studio](https://developer.android.com/studio#command-tools), ekstrak ke `<SDK>\cmdline-tools\latest` (mis. `D:\Android\sdk`), lalu set `ANDROID_HOME=<SDK>`.
2. Pasang paket (nama paket berisi `;`, jadi tulis di file lalu pakai `--package_file`):
   ```bash
   sdkmanager --licenses
   ```
   ```bash
   sdkmanager platform-tools emulator --package_file=paket.txt
   ```
   dengan `paket.txt` berisi `system-images;android-35;google_apis;x86_64`.
3. Buat AVD (`avdmanager create avd -n silembur -k "system-images;android-35;google_apis;x86_64" -d pixel_7`), lalu jalankan `emulator -avd silembur`.
4. Jalankan server, lalu di `src/mobile` jalankan `npx expo start --android`. Bila Expo Go belum terpasang otomatis, pasang APK Expo Go SDK 58 dengan `adb install`, lalu buka `exp://127.0.0.1:8081` setelah `adb reverse tcp:8081 tcp:8081` dan `adb reverse tcp:3000 tcp:3000`.

## Integrasi Google (opsional)

Tanpa konfigurasi apa pun aplikasi berjalan penuh dengan fallback lokal. Isi variabel berikut bila ingin memakai layanan Google:

| Layanan | Konfigurasi | Tanpa konfigurasi |
| :--- | :--- | :--- |
| Google Geocoding (wilayah & alamat laporan) | `GOOGLE_MAPS_API_KEY` di `server/.env` | Kecamatan Bandung terdekat (offline) |
| Google Cloud Storage (foto laporan) | `STORAGE_DRIVER=gcs`, `GCS_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS` (path file service account, di luar repo). Bucket harus bisa dibaca publik. | Foto disimpan di `server/uploads/` |
| Google Sign-In (masyarakat) | `GOOGLE_CLIENT_IDS` di `server/.env` + `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` di `mobile/.env`. Butuh development build (`npx expo run:android`), tidak jalan di Expo Go. | Tombol Google nonaktif; masuk dengan email + kata sandi |
| Google Maps di APK Android | `GOOGLE_MAPS_ANDROID_API_KEY` saat build | Expo Go memakai kunci bawaannya; iOS memakai Apple Maps |

## Build APK (opsional)

Butuh akun Expo (gratis). Dari folder `src/mobile`, isi `EXPO_PUBLIC_API_URL` dengan alamat server yang bisa dijangkau HP, lalu:
```bash
npx eas-cli@latest build -p android --profile preview
```
Profil build ada di `mobile/eas.json`. Unduh APK dari tautan yang diberikan, lalu lampirkan di GitHub Release.

## Deploy uji coba (Render + Neon + Google Cloud Storage)

Server API di [Render](https://render.com) (paket gratis), basis data di [Neon](https://neon.tech) (paket gratis), foto di Google Cloud Storage.
Konfigurasi Render ada di `render.yaml` (root repo). **Jangan pernah meng-commit kunci, file service account, atau connection string** — repo ini publik; semua rahasia diisi lewat dashboard.

1. **Neon** — buat project (region Singapore), salin *connection string* (sudah berisi `sslmode=require`).
2. **Google Cloud Storage** — buat bucket (akses seragam), beri `allUsers` peran *Storage Object Viewer* agar foto bisa dibuka aplikasi, lalu buat *service account* berperan *Storage Object Admin* pada bucket itu dan unduh kunci JSON-nya.
3. **Render** — *New → Blueprint*, pilih repo ini; Render membaca `render.yaml` (branch `feat/implementation`). Isi variabel yang diminta:
   `DATABASE_URL` (dari Neon), `GCS_BUCKET`, dan opsional `GOOGLE_MAPS_API_KEY` (kosong = wilayah offline). `JWT_SECRET` dibuat otomatis oleh Render.
   Lalu di *Environment → Secret Files* unggah kunci JSON dengan nama `gcs-key.json`. Build otomatis menjalankan migrasi.
4. **Seed sekali** dari laptop (folder `src/`), mengarah ke Neon. Perintah ini **menghapus seluruh data** lalu mengisi ulang:
   ```bash
   DATABASE_URL="<connection string Neon>" npm run db:seed
   ```
   Foto contoh seed dibuat ulang otomatis oleh server setiap kali start, karena disk Render gratis tidak permanen.
5. Cek `https://<nama-service>.onrender.com/api/health` → `{"status":"ok",...}`.
6. **Aplikasi** — dengan Expo Go: jalankan `EXPO_PUBLIC_API_URL=https://<nama-service>.onrender.com npx expo start` dari `src/mobile`.
   Atau build APK profil `demo` (ganti URL di `mobile/eas.json` bila nama service berbeda dari `silembur-api`):
   ```bash
   npx eas-cli@latest build -p android --profile demo
   ```
   Agar peta tampil di APK, isi `GOOGLE_MAPS_ANDROID_API_KEY` di *Environment variables* project Expo (environment `preview`).

Catatan paket gratis Render: server tidur setelah ±15 menit tanpa permintaan dan butuh 30–60 detik untuk bangun, sedangkan aplikasi menunggu maksimal 5 detik ("Tolong muat ulang halaman"). **Buka `/api/health` beberapa menit sebelum demo.**

## Continuous Integration

Setiap push ke `main` dan setiap pull request menjalankan `.github/workflows/ci.yml`: test server dengan PostgreSQL 18, lalu bundle aplikasi Android dan iOS.

## Akun uji

Kata sandi semua akun: `silembur123` (data fiktif dari seed).

| Peran | Email |
| :--- | :--- |
| Masyarakat (Pelapor) | `warga1@silembur.test`, `warga2@silembur.test`, `warga3@silembur.test` |
| Admin | `admin@silembur.test` |
| Pemerintah Daerah | `pemda@silembur.test` |

## Modul & pembagian anggota

| Kode | Modul / fitur | Use case | Anggota |
| :--- | :--- | :--- | :--- |
| P1 | Fondasi, autentikasi, integrasi Google, gabung duplikat, CI | UC07 | Mochamad Fachri Alfaridzi (13525128) |
| P2 | Membuat & merevisi laporan | UC01 | Muhammad Pandu Pulunggana (13525059) |
| P3 | Laporan publik, laporan saya, notifikasi, UI kit | UC04, UC05 | Satya Radhityan Yahya (13525098) |
| P4 | Verifikasi admin, skor prioritas | UC02 | Kevin Lincoln Hutabarat (13525101) |
| P5 | Prioritas pemda, fasilitas berulang, riwayat fasilitas | UC03, UC06, UC08 | Muhammad Dhiya Rafi (13525035) |

## Basis data

8 tabel: `pengguna`, `fasilitas`, `laporan`, `lokasi`, `skor_prioritas`, `verifikasi`, `riwayat_status`, `notifikasi`.
ERD, atribut, dan pemetaan ke kelas DPPL: [docs/DATABASE.md](docs/DATABASE.md). Kontrak API: [docs/API.md](docs/API.md).

## Struktur folder

```
src/
  shared/      konstanta bersama (status, kategori, aturan bisnis)
  server/      API Express: routes -> controllers -> models (MVC), adapters, db, tests
  mobile/      aplikasi Expo: src/app (rute), src/features (layar), src/api, src/components
  docs/        arsitektur, API, ERD, keputusan desain, konvensi, tugas per anggota
```
