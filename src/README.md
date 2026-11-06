# Sehati

Sehati adalah aplikasi *mobile* pendukung kesehatan mental dan kesejahteraan mahasiswa. Mahasiswa dapat menerima afirmasi harian, mengatur pengingat kesehatan, melihat kalender terintegrasi, memesan sesi konsultasi, membaca FAQ, mengajukan pertanyaan, dan memberi umpan balik. Administrator mengelola jadwal konsultan, FAQ, umpan balik, dan memantau status server.

Arsitektur mengikuti DPPL (`docs/M8/K01_G04_DPPL2.md`): Client-Server + MVC, dengan aplikasi Expo (React Native) sebagai klien dan Hono di Cloudflare Workers + D1 sebagai server.

> Bagian bertanda **TODO** diisi oleh pemilik issue terkait sebelum rilis `v9.0`.

## Daftar Isi

1. [Teknologi](#1-teknologi)
2. [Struktur Folder](#2-struktur-folder)
3. [Prasyarat dan Instalasi](#3-prasyarat-dan-instalasi)
4. [Konfigurasi](#4-konfigurasi)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Akun dan Data Uji](#6-akun-dan-data-uji)
7. [Modul dan Pembagian Tugas](#7-modul-dan-pembagian-tugas)
8. [Basis Data](#8-basis-data)
9. [Panduan Pengembangan Mobile](#9-panduan-pengembangan-mobile)
10. [Panduan Pengembangan Backend](#10-panduan-pengembangan-backend)

## 1. Teknologi

### Mobile (`src/mobile`)

| Komponen | Versi |
|---|---|
| Node.js | 22.13+ (atau 24.3+, 26+) |
| npm | 10+ |
| Expo SDK | 58 (`expo ~58.0.23`) |
| React Native | 0.88.1 |
| React | 19.3.0 |
| TypeScript | ~6.0.3 |
| Expo Router | ~58.0.30 (navigasi berbasis file) |
| Plus Jakarta Sans | `@expo-google-fonts/plus-jakarta-sans` ^0.4.2 |
| Ikon | `lucide-react-native` ^1.69.0 + `react-native-svg` 15.16.0 |
| Linter | ESLint 9 + `eslint-config-expo` |

### Backend (`src/backend`)

| Komponen | Versi |
|---|---|
| [Bun](https://bun.com) | 1.4.x |
| Hono | ^4.13.16 (routing) |
| Drizzle ORM | ^0.45.4 |
| Drizzle Kit | ^0.31.11 (migrasi) |
| Cloudflare Workers | runtime (`wrangler` ^4.157.0) |
| Cloudflare D1 | SQLite terdistribusi di *edge* |
| Vitest | 5.1.0 (test) |
| Node.js | 20+ (hanya untuk `better-sqlite3`, dipakai harness test) |

> **Backend memakai `bun`, bukan `npm`.** Proyek *pin* ke Bun 1.4.x dengan `bun.lock`; `npm` mengabaikan lockfile itu dan dapat menghasilkan pohon dependensi berbeda. Mobile tetap memakai `npm` (`package-lock.json`), jadi kedua direktori memang punya lockfile masing-masing — jangan disatukan.

## 2. Struktur Folder

```
src/
  README.md               # dokumen ini
  mobile/                 # aplikasi Expo (klien)
    .env.example          # contoh environment variable
    app.json              # konfigurasi Expo (nama, ikon, splash, plugin)
    assets/               # ikon dan logo
    src/
      app/                # rute Expo Router (satu file = satu layar)
        _layout.tsx       # root: font, splash, Stack
        index.tsx         # I-01 Masuk (login Google dan mode demo)
        komponen.tsx      # galeri komponen untuk pengembangan
        (mahasiswa)/      # tab bar Mahasiswa: beranda, kalender, konsultasi, pengingat, faq (+ layar tersembunyi)
        admin/            # stack Administrator: index, jadwal, faq, umpan-balik, status
      components/         # komponen bersama dari Figma (Tombol, IsianTeks, Banner, ...)
      theme/              # token desain: warna, font, gaya teks, jarak, sudut
      api/                # klien HTTP ke backend, login, dan sesi (SecureStore)
      lib/                # sesi pengguna bersama (useSesi)
  backend/                # Cloudflare Worker (Hono + D1): REST API dan cron
    .env.example          # contoh CLOUDFLARE_* dan KUNCI_TOKEN
    .dev.vars             # rahasia lokal (tidak di-commit)
    wrangler.jsonc        # konfigurasi Worker, binding D1, cron
    drizzle.config.ts     # konfigurasi drizzle-kit dan Drizzle Studio
    migrations/           # SQL migrasi
    seed/seed.sql         # data uji lokal
    src/
      index.ts            # perakitan app, error envelope, /health, handler scheduled
      config.ts           # pembacaan env, konstanta, turunan nim
      db/
        schema.ts         # skema Drizzle (DPPL 5.37)
        queries.ts        # Q-001..Q-042
      lib/                # crypto, errors, google, http, validasi
      middleware/         # auth (verifikasiToken + requireRole)
      routes/             # satu file per sumber daya
      jobs/               # tugas cron (notifikasi, status)
    test/                 # suite Vitest dan harness D1
```

## 3. Prasyarat dan Instalasi

Prasyarat:

- Node.js 22.13 atau lebih baru, dan npm.
- Git.
- Untuk mencoba di ponsel: aplikasi **Expo Go** (App Store / Play Store). Ponsel dan komputer berada di jaringan Wi-Fi yang sama.
- Opsional: Android Studio (emulator Android). Simulator iOS hanya tersedia di macOS.
- Untuk backend: **Bun 1.4.x**.

Instalasi dependensi mobile:

```bash
cd src/mobile
npm install
```

Gunakan `npx expo install <paket>` (bukan `npm install <paket>`) saat menambah paket agar versinya cocok dengan Expo SDK 58.

Instalasi dependensi backend:

```bash
cd src/backend
bun install
```

Tidak perlu memasang `wrangler` secara global; ia tersedia lewat `node_modules` dengan `bun run`.

## 4. Konfigurasi

### Mobile

Salin contoh environment variable, lalu sesuaikan alamat backend:

```bash
cd src/mobile
cp .env.example .env
```

| Variabel | Keterangan |
|---|---|
| `EXPO_PUBLIC_API_URL` | Alamat dasar backend tanpa `/` di akhir. |
| `EXPO_PUBLIC_MODE_DEMO` | Isi `1` untuk menampilkan tombol "Mode demo" di layar Masuk (lihat bagian 6). Backend juga harus berjalan dengan `MODE_DEMO=1`. |

Nilai `EXPO_PUBLIC_API_URL` bergantung pada tempat aplikasi berjalan, karena `localhost` di ponsel berarti ponsel itu sendiri:

| Aplikasi berjalan di | Nilai |
|---|---|
| Ponsel fisik (Expo Go) | `http://<IP-LAN-komputer>:8787`, misalnya `http://192.168.1.10:8787` |
| Emulator Android | `http://10.0.2.2:8787` |
| Web atau simulator iOS di komputer yang sama | `http://localhost:8787` |
| Backend yang sudah di-*deploy* | `https://<nama-worker>.<subdomain>.workers.dev` |

File `.env` tidak di-*commit* (sudah ada di `.gitignore`). Variabel `EXPO_PUBLIC_*` ikut tertanam di aplikasi, jadi jangan isi rahasia apa pun di sana. Setelah mengubah `.env`, jalankan ulang `npx expo start`.

### Backend

Rahasia lokal dibaca `wrangler dev` dari `src/backend/.dev.vars` (tidak di-*commit*). Buat berkas itu berisi:

```ini
KUNCI_TOKEN=<hasil openssl rand -base64 32>
GOOGLE_CLIENT_ID=<oauth client id>
GOOGLE_CLIENT_SECRET=<oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
API_BASE_URL=http://localhost:8787
MODE_DEMO=1
```

| Variabel | Keterangan |
|---|---|
| `KUNCI_TOKEN` | Kunci AES-256-GCM untuk mengenkripsi *access/refresh token* Google di basis data (Algo-001, Algo-009). Wajib berukuran **tepat 32 byte** setelah di-*decode*. Bila hilang, token Google tersimpan tidak dapat dibaca sehingga pengguna harus login ulang. |
| `GOOGLE_CLIENT_ID` | Client id OAuth, dikirim saat penukaran kode dan penyegaran token (Algo-027). Bukan rahasia. |
| `GOOGLE_CLIENT_SECRET` | Client secret OAuth, diminta Google pada kedua alur tersebut. Karena itu penukaran kode dilakukan di server — nilai ini tidak boleh sampai ke aplikasi *mobile*. |
| `GOOGLE_REDIRECT_URI` | URL rute `/api/auth/google/callback` milik backend ini. Harus **sama persis** dengan yang didaftarkan di Google Cloud Console. Bila berbeda, Google membalas `redirect_uri_mismatch`. |
| `API_BASE_URL` | Alamat dasar yang diperiksa tugas *cron uptime* (Algo-021). Opsional; tanpa nilai ini pemeriksaan tercatat `down`. |
| `MODE_DEMO` | Isi `1` untuk mengaktifkan `POST /api/auth/demo`, yaitu login sebagai akun Mahasiswa atau Administrator hasil *seed* tanpa Google (untuk asisten yang menguji APK). Opsional; nilai lain atau kosong menonaktifkan rute (404). Basis data harus sudah di-*seed*. |

Untuk `.env` (dipakai `drizzle.config.ts`, bukan Worker) isi `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, dan `CLOUDFLARE_D1_TOKEN` — lihat `.env.example`. Variabel ini diperlukan untuk perintah yang lewat HTTP (Drizzle Studio *remote*, `db:migrate:remote`), terpisah dari sesi `wrangler login`.

Untuk produksi, rahasia dipasang lewat Wrangler, bukan `.dev.vars`:

```bash
bunx wrangler secret put KUNCI_TOKEN
bunx wrangler secret put GOOGLE_CLIENT_ID
bunx wrangler secret put GOOGLE_CLIENT_SECRET
bunx wrangler secret put GOOGLE_REDIRECT_URI
bunx wrangler secret put MODE_DEMO   # opsional, isi 1 untuk login demo
```

## 5. Menjalankan Aplikasi

### Mobile

Jalankan dari terminal interaktif (QR code tidak muncul jika terminal tidak interaktif):

```bash
cd src/mobile
npx expo start
```

Lalu pilih salah satu:

- **iPhone:** pindai QR code dengan aplikasi Kamera, lalu buka di Expo Go.
- **Android:** pindai QR code dari dalam Expo Go.
- **Emulator Android:** tekan `a` di terminal.
- Jika QR code tidak muncul, buka Expo Go dan masukkan URL secara manual: `exp://<IP-LAN-komputer>:8081`.

Jika ponsel tidak dapat terhubung (misalnya jaringan kampus memblokir antarperangkat), gunakan mode *tunnel*:

```bash
npx expo start --tunnel
```

Pemeriksaan kode:

```bash
npx tsc --noEmit   # cek tipe TypeScript
npx expo lint      # ESLint
```

Layar pertama adalah I-01 Masuk. Untuk mencoba aplikasi tanpa akun Google, gunakan tombol "Mode demo" (bagian 6).

### Backend

Siapkan basis data lokal D1 (tersimpan di `.wrangler/state/`, tidak di-*commit*), lalu jalankan server:

```bash
cd src/backend
bun run db:migrate:local   # terapkan migrasi ke D1 lokal
bun run db:seed:local      # isi data uji (idempoten, aman diulang)
bun run dev                # wrangler dev di http://localhost:8787
```

Pemeriksaan cepat:

```bash
curl http://localhost:8787/health
# {"ok":true,"latest":null}
```

Perintah lain:

```bash
bun run test             # vitest run
bun run test:watch
bun run typecheck        # tsc --noEmit (termasuk test/)
bun run db:generate      # drizzle-kit: schema.ts -> migrations/*.sql
bun run db:studio:local  # jelajahi D1 lokal (tanpa autentikasi)
bun run db:studio:remote # jelajahi D1 remote (butuh CLOUDFLARE_* di .env)
bun run deploy
```

Test berjalan terhadap basis data SQLite sungguhan: `test/harness.ts` menyediakan adaptor D1 in-process di atas `better-sqlite3` dan memutar ulang migrasi asli, sehingga batasan `CHECK`/`UNIQUE`/`FOREIGN KEY` benar-benar diuji. Panggilan Google dan Expo di-*stub*. Tidak perlu `.dev.vars`, jaringan, atau server yang berjalan.

### Rilis (APK)

**TODO (#6, Iqi):** cara membangun dan mengunduh APK rilis `v9.0`.

## 6. Akun dan Data Uji

### Backend

`seed/seed.sql` membuat dua akun dengan **token sesi siap pakai**, sehingga rute terautentikasi bisa dipanggil tanpa login Google:

| Akun | Peran | Header `Authorization` |
|---|---|---|
| `seed-usr-mhs` — Mahasiswa Uji | `mahasiswa` | `Bearer dev-token-mahasiswa` |
| `seed-usr-adm` — Administrator Uji | `administrator` | `Bearer dev-token-administrator` |

```bash
curl http://localhost:8787/api/me \
  -H 'Authorization: Bearer dev-token-mahasiswa'
```

Catatan:

- Token ini hanya untuk pengembangan dan tidak pernah berlaku pada Worker yang sudah di-*deploy*; keduanya hanya ada di `seed/seed.sql`.
- Akun hasil *seed* memakai `google_id` palsu, sehingga login Google sungguhan akan membuat akun **terpisah**. Gunakan token di atas bila hanya ingin mencoba API.
- Sesi kedaluwarsa setelah `BATAS_SESI` (30 hari); jalankan ulang `bun run db:seed:local` untuk menyegarkan.

Data lain yang ikut dibuat: 3 konsultan, deretan slot mendatang (`seed-jdw-*`, sebagian sudah terpesan), dan 3 entri FAQ.

### Mobile (login demo)

Login Google memerlukan OAuth client milik kelompok, sehingga untuk menguji aplikasi disediakan **login demo** yang masuk sebagai kedua akun *seed* di atas tanpa Google:

| Tombol di layar Masuk | Masuk sebagai | Diarahkan ke |
|---|---|---|
| **Mahasiswa** | `seed-usr-mhs` — Mahasiswa Uji (NIM 13599001) | I-02 Beranda Mahasiswa |
| **Administrator** | `seed-usr-adm` — Administrator Uji | I-03 Beranda Administrator |

Langkah:

1. Backend: isi `MODE_DEMO=1` di `src/backend/.dev.vars`, jalankan migrasi dan *seed* (`bun run db:migrate:local`, `bun run db:seed:local`), lalu jalankan `bun run dev -- --ip 0.0.0.0` agar dapat diakses dari ponsel.
2. Mobile: isi `EXPO_PUBLIC_MODE_DEMO=1` dan `EXPO_PUBLIC_API_URL=http://<IP-LAN-komputer>:8787` di `src/mobile/.env`, lalu jalankan ulang `npx expo start`.
3. Di layar Masuk, tekan **Mahasiswa** atau **Administrator** di bawah tulisan "Mode demo".

Catatan:

- Setiap login demo membuat sesi baru melalui `POST /api/auth/demo`, bukan memakai token `dev-token-*`. Sesi tersimpan di perangkat (`expo-secure-store`), sehingga aplikasi langsung membuka Beranda saat dibuka kembali sampai pengguna keluar atau sesi melewati 30 hari.
- Bila backend berjalan tanpa `MODE_DEMO=1`, rute login demo membalas 404 dan layar Masuk menampilkan pesan galat.
- Login Google sungguhan memerlukan `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `GOOGLE_REDIRECT_URI` (bagian 4). Google tidak menerima alamat IP LAN sebagai *redirect URI*, sehingga login Google dari ponsel memerlukan backend yang sudah di-*deploy* atau *tunnel* ber-HTTPS.

## 7. Modul dan Pembagian Tugas

| Issue | Modul / fitur | Use case | Anggota |
|---|---|---|---|
| #1 | Fondasi backend dan D1 (migrasi, seed, validasi, test) | | Daniel Charisma Christian (Dan) |
| #2 | Fondasi aplikasi Expo: navigasi, tema, komponen bersama, klien API | | Rifqi Irfan Indrawan (Iqi) |
| #3 | Autentikasi (Google + login demo, token terenkripsi) | UC-11 | Rifqi Irfan Indrawan (Iqi) |
| #4 | Beranda Mahasiswa dan Administrator | | Rifqi Irfan Indrawan (Iqi) |
| #5 | Registrasi token *push notification* | | Rifqi Irfan Indrawan (Iqi) |
| #6 | `src/README.md` dan rilis APK | | Rifqi Irfan Indrawan (Iqi) |
| #7 | Afirmasi harian | UC-01 | Farish Firstian Erifiawan (Farish) |
| #8 | Pengingat kesehatan | UC-02 | Farish Firstian Erifiawan (Farish) |
| #9 | Penjadwalan (*cron*) dan pengiriman *push* | | Farish Firstian Erifiawan (Farish) |
| #10 | FAQ, pencarian, dan pengajuan pertanyaan | UC-06, UC-07, UC-12 | Farish Firstian Erifiawan (Farish) |
| #11 | Kalender terintegrasi | UC-03 | Ausa Haadiyaan Mukhtar Yusuf (Ucup) |
| #12 | Pemesanan sesi konsultasi | UC-04 | Ausa Haadiyaan Mukhtar Yusuf (Ucup) |
| #13 | Kelola jadwal konsultan (Administrator) | UC-05 | Ausa Haadiyaan Mukhtar Yusuf (Ucup) |
| #14 | Status server | UC-10 | Daniel Charisma Christian (Dan) |
| #15 | Umpan balik dan *profiling* | UC-08, UC-09 | Daniel Charisma Christian (Dan) |

## 8. Basis Data

Skema D1 mengikuti DPPL bagian 5.37 (`docs/M8/K01_G04_DPPL2.md`). Definisi Drizzle ada di `src/backend/src/db/schema.ts`, SQL migrasi di `src/backend/migrations/`.

| Tabel | Isi | Kelas DPPL |
|---|---|---|
| `pengguna` | Akun; kolom `peran` membedakan `mahasiswa` dan `administrator` | C-01 `Pengguna`, C-03 `Administrator` |
| `mahasiswa` | `nim` (turunan email kampus, `NULL` bila bukan email kampus) | C-02 `Mahasiswa` |
| `sesi_autentikasi` | Token sesi, status `aktif`/`berakhir`, `token_push` perangkat | C-04 `SesiAutentikasi` |
| `token_google` | *Access/refresh token* Google, terenkripsi AES-256-GCM | C-34, C-08 |
| `daily_affirmation` | Konten afirmasi dan `waktu_kirim` (`HH:MM`) | C-05 `DailyAffirmation` |
| `reminder` | `jenis` (`makan`/`tidur`/`olahraga`) dan `waktu` (`HH:MM`) | C-06 `Reminder` |
| `notifikasi` | Riwayat notifikasi; tepat satu dari `id_affirmation`/`id_reminder` terisi | C-07 `Notifikasi` |
| `konsultan` | Nama dan spesialisasi konsultan | C-10 `Konsultan` |
| `jadwal_konsultasi` | Slot (`waktu`, `waktu_selesai`, `status`, `id_mahasiswa`) | C-11 `JadwalKonsultasi` |
| `faq` | Pasangan pertanyaan dan jawaban | C-12 `FAQ` |
| `pengajuan_pertanyaan` | Pertanyaan di luar FAQ | C-13 `PengajuanPertanyaan` |
| `umpan_balik` | Umpan balik, `tanggapan`, `id_administrator` | C-14 `UmpanBalik` |
| `status_server` | Satu baris per pemeriksaan, dibedakan `jenis` | C-15 `StatusServer` |

Konvensi: kunci utama `TEXT` (kecuali `status_server` yang `INTEGER` autoincrement), `DateTime` disimpan sebagai teks ISO 8601, `Time` sebagai `HH:MM`, boolean sebagai `INTEGER` 0/1. `KalenderGabungan` tidak punya tabel — dihitung saat dipakai dari event Google dan `jadwal_konsultasi`.

## 9. Panduan Pengembangan Mobile

Ringkasan konvensi untuk anggota yang mengerjakan layar:

- **Layar baru:** setiap layar sudah punya file *placeholder* di `src/mobile/src/app/` yang menampilkan ID layar (I-01 sampai I-15) dan nomor issue. Ganti isi file milik issue kalian.
- **Warna, font, dan jarak:** ambil dari `@/theme` (`warna`, `teks`, `jarak`, `sudut`, `ukuran`). Jangan menulis kode warna hex atau ukuran font langsung di layar.
- **Teks:** gunakan `<Teks gaya="h2">`, dengan gaya `h1`, `h2`, `h3`, `isi`, `isiTebal`, `keterangan`, `label`.
- **Komponen bersama** (`@/components`):

  | Komponen | Kegunaan |
  |---|---|
  | `Tombol` | Varian `utama`, `sekunder`, `google`, `teks`; mendukung `ikon`, `memuat`, `disabled`. |
  | `IsianTeks` / `AreaTeks` | Isian satu baris / banyak baris dengan `label`, `keterangan`, `galat`. |
  | `Banner` | Pesan `galat`, `sukses`, `info`. |
  | `Lencana` | Label status: `merah`, `sukses`, `info`, `peringatan`, `netral`. |
  | `AppBar` | Judul layar, tombol kembali (`onKembali`), varian `terang` / `gelap` (Administrator). |
  | `TabBar` | Tab bar Mahasiswa (sudah terpasang di `(mahasiswa)/_layout.tsx`). |
  | `MenuTile` | Kartu menu di Beranda Administrator. |
  | `StatusBar` | Status bar sistem (sudah terpasang di root layout). |

  Contoh semua komponen ada di `src/mobile/src/app/komponen.tsx`.
- **Ikon:** impor per ikon, misalnya `import House from 'lucide-react-native/icons/house';`. Mengimpor dari `'lucide-react-native'` langsung ikut membundel sekitar 1.600 ikon (+2,5 MB).
- **Memanggil backend:** gunakan klien di `@/api`:

  ```ts
  import { api, ApiError } from '@/api';

  try {
    const pengguna = await api.get<Pengguna>('/api/me');
  } catch (e) {
    if (e instanceof ApiError) {
      // e.status, e.kode (mis. 'SLOT_SUDAH_DIPESAN'), e.pesan (tampilkan di <Banner jenis="galat">)
    }
  }
  ```

  Klien otomatis mengirim `Authorization: Bearer <token>` setelah `aturToken(token)` dipanggil saat login, dan mengubah respons galat backend `{ error: { kode, pesan, detail } }` menjadi `ApiError`. Galat jaringan menghasilkan `kode` `JARINGAN_GAGAL` atau `BATAS_WAKTU`.

## 10. Panduan Pengembangan Backend

Rujukan lengkap: [`backend/README.md`](./backend/README.md).

### Permukaan API

| Method | Path | Peran |
|---|---|---|
| `GET` | `/api/auth/google/mulai?kembali=<deep link>` | publik |
| `GET` | `/api/auth/google/callback` | publik (dipanggil Google) |
| `POST` | `/api/auth/google` | publik |
| `POST` | `/api/auth/demo` | publik (hanya bila `MODE_DEMO=1`) |
| `POST` | `/api/auth/logout` | semua |
| `POST` | `/api/auth/device` | semua |
| `GET` | `/api/me` | semua |
| `GET` | `/api/affirmation` | mahasiswa |
| `PUT` | `/api/affirmation/time` | mahasiswa |
| `GET` | `/api/reminders` | mahasiswa |
| `PUT` | `/api/reminders/:jenis` | mahasiswa |
| `GET` | `/api/calendar` | mahasiswa |
| `GET` | `/api/consultants` | semua |
| `GET` | `/api/consultants/:id/slots` | semua |
| `GET` | `/api/sessions/next` | mahasiswa |
| `POST` | `/api/slots/:id/book` | mahasiswa |
| `POST` | `/api/slots` | administrator |
| `PATCH` | `/api/slots/:id` | administrator |
| `GET` | `/api/faq?q=` | semua |
| `POST` | `/api/faq` | administrator |
| `PUT` | `/api/faq/:id` | administrator |
| `DELETE` | `/api/faq/:id` | administrator |
| `POST` | `/api/questions` | mahasiswa |
| `POST` | `/api/feedback` | mahasiswa |
| `GET` | `/api/feedback` | administrator |
| `PUT` | `/api/feedback/:id/response` | administrator |
| `GET` | `/api/status/:jenis` | semua |
| `GET` | `/health` | publik |

Selain `/api/auth/google*` dan `/health`, semua rute memerlukan `Authorization: Bearer <token>`. Galat memakai satu amplop:

```json
{ "error": { "kode": "VALIDASI_GAGAL", "pesan": "...", "detail": null } }
```

Status: `400` body tidak valid · `401` belum terautentikasi · `403` peran salah · `404` tidak ditemukan · `409` konflik (slot terambil / jadwal bentrok) · `422` validasi gagal · `502` kegagalan layanan eksternal.

### Tugas terjadwal

Satu *cron trigger* `* * * * *` menjalankan:

- pengiriman afirmasi dan pengingat, mencatat notifikasi dan mengirim *push* Expo dalam batch maksimal 100 pesan, serta mengosongkan token yang dilaporkan `DeviceNotRegistered`
- pemeriksaan *uptime* `website` dan `server` (memerlukan `API_BASE_URL`)

Semua ini ada di handler `scheduled()`, bukan rute HTTP.

### Menambah endpoint

1. Tambahkan SQL baru di `src/backend/src/db/queries.ts` dengan anotasi id `Q-xxx` dari DPPL.
2. Tambahkan handler di `src/backend/src/routes/`, dijaga `auth` dan `requireRole(...)`.
3. Daftarkan di `src/backend/src/index.ts`.
4. Tambahkan suite di `src/backend/test/` lalu jalankan `bun run test`.

### Format commit

Repositori memakai [Conventional Commits](https://www.conventionalcommits.org/), dengan lingkup `mobile`, `backend`, `docs`, atau `chore`, misalnya `feat(backend): add auth routes`.
