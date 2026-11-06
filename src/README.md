# Pross

**Kenali biaya, jaga untung.**

Pross adalah aplikasi mobile yang dikembangkan untuk membantu pemilik
usaha mengelola informasi usaha dan mendukung pengelolaan biaya serta
keuntungan produk. Repository ini merupakan implementasi proyek IF2150
Rekayasa Perangkat Lunak Kelompok K02-G07.

> **Status implementasi saat ini:** tahap awal berfokus pada fondasi
> aplikasi, integrasi Supabase, registrasi akun, login menggunakan
> email/username, pengelolaan sesi, dan kerangka navigasi. Halaman Home
> dan Reset Password masih menjadi placeholder untuk integrasi fitur
> berikutnya. Jangan menganggap fitur yang masih direncanakan sudah
> tersedia hanya karena tercantum di dokumen perancangan.

------------------------------------------------------------------------

## Daftar Isi

- [1. Teknologi](#1-teknologi)
- [2. Prasyarat](#2-prasyarat)
- [3. Struktur Repository](#3-struktur-repository)
- [4. Menyiapkan Aplikasi di Komputer
  Baru](#4-menyiapkan-aplikasi-di-komputer-baru)
- [5. Menyiapkan Supabase](#5-menyiapkan-supabase)
- [6. Menjalankan Aplikasi](#6-menjalankan-aplikasi)
- [7. Menjalankan Pengujian](#7-menjalankan-pengujian)
- [8. Fitur dan Status Implementasi](#8-fitur-dan-status-implementasi)
- [9. Struktur Database](#9-struktur-database)
- [10. Alur Autentikasi](#10-alur-autentikasi)
- [11. Troubleshooting](#11-troubleshooting)
- [12. Panduan Kontribusi](#12-panduan-kontribusi)
- [13. Referensi](#13-referensi)

------------------------------------------------------------------------

## 1. Teknologi

| Bagian                  | Teknologi                     | Versi pada project                           |
|:------------------------|:------------------------------|:---------------------------------------------|
| Framework aplikasi      | Expo                          | `~58.0.22`                                   |
| UI mobile               | React Native                  | `0.88.1`                                     |
| UI library              | React                         | `19.3.0`                                     |
| Bahasa                  | TypeScript                    | `~6.0.3`                                     |
| Navigasi                | React Navigation              | `^7.5.1`                                     |
| Navigasi stack          | React Navigation Native Stack | `^7.21.0`                                    |
| Backend dan autentikasi | Supabase                      | Hosted Supabase project                      |
| Supabase client         | `@supabase/supabase-js`       | `^2.118.0`                                   |
| Penyimpanan sesi        | AsyncStorage                  | `2.2.0`                                      |
| Unit testing            | Vitest                        | `^5.0.5`                                     |
| Database                | PostgreSQL                    | Major version `17` pada konfigurasi Supabase |
| Edge Function runtime   | Deno                          | Major version `2` pada konfigurasi Supabase  |

Versi dependency di atas mengikuti `src/package.json`.
`src/package-lock.json` digunakan untuk mengunci versi dependency yang
terpasang.

### Platform

- **Target utama:** Android.
- **Development:** Expo Go atau Android Emulator.
- Script untuk iOS dan Web tersedia di `package.json`, tetapi target
  utama dan lingkungan implementasi pada dokumen perancangan adalah
  Android.

------------------------------------------------------------------------

## 2. Prasyarat

Sebelum memulai, siapkan:

1.  **Node.js** yang didukung Expo SDK 58. Gunakan Node.js `22.13.x`
    atau lebih baru pada jalur Node 22, Node.js `24.3.x` atau lebih baru
    pada jalur Node 24, atau Node.js 26 ke atas.
2.  **npm**, yang terpasang bersama Node.js.
3.  **Git** untuk mengambil repository.
4.  **Android** dengan Expo Go yang kompatibel atau Android Emulator.
5.  **Akun Supabase** untuk membuat atau mengakses project backend
    Pross.
6.  Koneksi internet.

Periksa instalasi Node.js dan npm:

``` bash
node --version
npm --version
git --version
```

Jika versi Node.js tidak sesuai, ganti ke versi yang didukung sebelum
menjalankan instalasi dependency.

------------------------------------------------------------------------

## 3. Struktur Repository

Repository dipisahkan menjadi dokumentasi proyek dan source code
aplikasi. Seluruh perintah npm pada README ini dijalankan dari folder
`src/`, yaitu folder tempat `package.json` berada.

``` text
IF2150-RPL-K02-G07/
│
├── docs/
│   ├── M5/                         # SKPL
│   ├── M6/                         # APL
│   ├── M8/                         # DPPL dan rancangan UI
│   └── M9/                         # Dokumentasi implementasi
│
└── src/
    ├── README.md                   # Panduan setup aplikasi ini
    ├── package.json
    ├── package-lock.json
    ├── app.json
    ├── tsconfig.json
    ├── .env.example
    ├── .gitignore
    ├── index.ts                    # Entry point aplikasi Expo
    ├── App.tsx                     # Root component dan session/navigation
    │
    ├── assets/                     # Logo dan aset visual
    ├── controllers/
    │   ├── AuthController.ts
    │   ├── MarginController.ts
    │   ├── margin.ts
    │   └── validators.ts
    ├── models/
    │   ├── BahanBaku.ts
    │   ├── PemilikUsaha.ts
    │   ├── Produk.ts
    │   ├── ResepBahan.ts
    │   └── pesan.ts
    ├── navigation/
    │   └── types.ts
    ├── services/
    │   └── supabase.ts
    ├── tests/
    │   ├── margin.test.ts
    │   ├── models.test.ts
    │   └── validators.test.ts
    ├── views/
    │   ├── AddProductPage.tsx
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   ├── RegistrationPage.tsx
    │   ├── ResetPasswordPage.tsx
    │   └── styles.ts
    │
    └── supabase/
        ├── config.toml
        ├── schema.sql
        ├── seed.sql
        ├── migrations/
        │   └── 20261103000000_produk_bahan_resep.sql
        └── functions/
            └── login-with-username/
                └── index.ts        # Entry point Edge Function
```

### Mengapa ada dua file `index.ts`?

Keduanya memang diperlukan dan memiliki fungsi berbeda.

| File                                                  | Fungsi                                                                                                         | Lingkungan eksekusi            |
|:------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------|:-------------------------------|
| `src/index.ts`                                        | Entry point aplikasi Expo. Mendaftarkan komponen `App` agar aplikasi mobile dapat dijalankan.                  | Expo / React Native            |
| `src/supabase/functions/login-with-username/index.ts` | Menangani request login dengan username, mencari email akun, lalu melakukan autentikasi melalui Supabase Auth. | Supabase Edge Functions / Deno |

Jangan menghapus atau menukar kedua file tersebut. `package.json`
menggunakan `"main": "index.ts"`, sehingga yang dimaksud sebagai entry
point aplikasi adalah `src/index.ts`.

### Tanggung jawab folder

| Folder/file    | Tanggung jawab                                                       |
|:---------------|:---------------------------------------------------------------------|
| `views/`       | Halaman dan komponen antarmuka pengguna.                             |
| `controllers/` | Alur aplikasi, validasi, dan penghubung View dengan Model/Service.   |
| `models/`      | Representasi entitas dan operasi data yang berkaitan dengan entitas. |
| `services/`    | Integrasi layanan eksternal, seperti Supabase client.                |
| `navigation/`  | Tipe dan konfigurasi navigasi antarlayar.                            |
| `tests/`       | Unit test.                                                           |
| `assets/`      | Logo, ikon, dan aset visual.                                         |
| `supabase/`    | SQL schema, konfigurasi Supabase CLI, dan Edge Functions.            |

Pola organisasi utama yang digunakan adalah **Model–View–Controller
(MVC)**.

------------------------------------------------------------------------

## 4. Menyiapkan Aplikasi di Komputer Baru

Ikuti langkah berikut secara berurutan. Langkah ini mengasumsikan
komputer belum memiliki source code Pross.

### 4.1 Clone repository

Buka terminal (PowerShell, CMD, atau terminal VS Code), lalu jalankan:

``` bash
git clone https://github.com/rafeldzin/IF2150-RPL-K02-G07.git
cd IF2150-RPL-K02-G07
```

Masuk ke folder aplikasi:

``` bash
cd src
```

**Penting:** jangan menjalankan `npx expo start` dari root repository.
`package.json` aplikasi berada di dalam `src/`.

### 4.2 Install dependency

Jalankan:

``` bash
npm ci
```

`npm ci` memasang dependency sesuai `package-lock.json`, sehingga hasil
instalasi lebih konsisten antaranggota.

Jika `npm ci` gagal karena `package-lock.json` tidak sinkron dengan
`package.json`, jangan langsung menghapus lockfile. Periksa perubahan
dependency terlebih dahulu dan koordinasikan pembaruannya dengan
kelompok.

### 4.3 Buat file environment `.env`

Buat `.env` lokal berdasarkan `.env.example`.

**PowerShell:**

``` powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

``` bash
cp .env.example .env
```

Buka file `.env`, lalu isi:

``` dotenv
EXPO_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

Nilai tersebut didapat dari project Supabase yang akan digunakan (lihat
[Bagian 5.1](#51-buat-atau-gunakan-project-supabase)).

Contoh di atas hanya menunjukkan format. Ganti placeholder dengan nilai
project sendiri.

#### Aturan keamanan `.env`

- `.env` hanya disimpan di komputer masing-masing dan **tidak boleh
  di-commit**.
- `.env.example` boleh di-commit karena hanya berisi nama variabel dan
  placeholder.
- `EXPO_PUBLIC_` berarti nilainya akan tersedia di bundle aplikasi.
  Karena itu, hanya masukkan Project URL dan Publishable Key.
- Jangan pernah memasukkan Supabase Secret Key, Service Role Key,
  database password, atau kredensial administrator ke `.env` aplikasi
  mobile.
- Secret untuk Edge Function disimpan di **Supabase Edge Function
  Secrets**, bukan di source code aplikasi.

Pastikan `.env` diabaikan Git:

``` bash
git check-ignore -v .env
```

Perintah tersebut harus menampilkan aturan `.gitignore` yang mengabaikan
file `.env`.

### 4.4 Periksa konfigurasi Expo

Dari folder `src/`, jalankan:

``` bash
npx expo-doctor
```

Perintah ini membantu memeriksa konsistensi konfigurasi dan dependency
Expo. Jika muncul masalah, baca pesan pemeriksaan dan selesaikan sebelum
melanjutkan.

------------------------------------------------------------------------

## 5. Menyiapkan Supabase

Aplikasi membutuhkan project Supabase yang menyediakan database,
autentikasi, dan Edge Function. Untuk kerja kelompok, gunakan project
pengembangan yang sudah disepakati agar seluruh anggota menguji backend
yang sama.

> Jika kelompok sudah memiliki project Supabase Pross, gunakan project
> tersebut. Jangan membuat project baru tanpa koordinasi karena database
> dan akun pengujian tiap project terpisah.

### 5.1 Buat atau gunakan project Supabase

1.  Buka [Supabase Dashboard](https://supabase.com/dashboard).
2.  Pilih project Pross milik kelompok atau buat project baru jika belum
    tersedia.
3.  Jika membuat project baru, tentukan nama project dan database
    password. Simpan database password di password manager atau tempat
    aman; jangan masukkan ke repository.
4.  Pilih region yang sesuai. Untuk pengguna di Indonesia, region Asia
    Tenggara seperti Singapore dapat dipertimbangkan.
5.  Tunggu sampai project selesai dibuat.

### 5.2 Ambil Project URL dan Publishable Key

Di dashboard project:

1.  Buka bagian **Project Settings → API Keys** atau menu **Connect**
    (nama menu dapat berubah).
2.  Salin **Project URL**.
3.  Salin **Publishable Key**.
4.  Masukkan keduanya ke `src/.env`:

``` dotenv
EXPO_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

Gunakan **Publishable Key**, bukan Secret Key. Jangan membagikan
database password atau Secret Key.

### 5.3 Konfigurasikan Email Authentication

Alur UC01 pada SKPL mengarahkan pengguna untuk dapat melanjutkan setelah
registrasi. Untuk skenario pengujian tersebut, konfigurasi project
Supabase kelompok saat ini menggunakan konfirmasi email nonaktif.

Di Supabase Dashboard:

1.  Buka **Authentication**.
2.  Masuk ke **Sign In / Providers**.
3.  Pilih provider **Email**.
4.  Matikan opsi **Confirm email**.
5.  Simpan perubahan.

Nama dan posisi menu dapat berubah mengikuti versi dashboard.

**Catatan:** nilai `enable_confirmations = false` pada
`supabase/config.toml` berlaku untuk konfigurasi Supabase lokal. Nilai
tersebut tidak otomatis mengubah project Supabase hosted. Pengaturan
pada dashboard hosted harus diperiksa secara terpisah.

Jika kelompok memutuskan mengaktifkan konfirmasi email, alur aplikasi
perlu menangani akun yang sudah dibuat tetapi belum memiliki session
karena email belum diverifikasi.

### 5.4 Jalankan SQL schema

File schema yang digunakan:

``` text
src/supabase/schema.sql
```

Cara menjalankannya:

1.  Buka Supabase Dashboard project Pross.
2.  Pilih **SQL Editor**.
3.  Buat query baru.
4.  Buka file `src/supabase/schema.sql` di VS Code.
5.  Salin seluruh isi file.
6.  Tempel ke SQL Editor.
7.  Klik **Run**.
8.  Pastikan query selesai tanpa error.

Setelah itu, periksa melalui **Table Editor** apakah tabel berikut sudah
tersedia:

``` text
public.tbl_pemilik_usaha
```

Schema tersebut membuat tabel profil pemilik usaha, unique index
username/email, RLS dan policy, trigger pembuatan profil setelah akun
Auth dibuat, serta function `account_exists`.

**Jangan membuat tabel dengan struktur berbeda secara manual.** Jika
schema mengalami perubahan, gunakan versi terbaru dari repository dan
koordinasikan perubahan database dengan kelompok.

### 5.5 Siapkan Supabase CLI

Edge Function disimpan di repository sehingga dapat di-deploy ulang oleh
anggota yang memiliki akses ke project.

Dari folder `src/`, jalankan:

``` bash
npx supabase login
```

Ikuti instruksi autentikasi CLI melalui browser atau token yang diminta.

Hubungkan folder lokal ke project Supabase:

``` bash
npx supabase link --project-ref <PROJECT_REF>
```

`PROJECT_REF` dapat dilihat dari Project URL. Untuk URL:

``` text
https://abcdefghijk.supabase.co
```

maka project reference-nya adalah:

``` text
abcdefghijk
```

Perintah `link` menghubungkan konfigurasi CLI lokal dengan project
remote. Perintah ini tidak otomatis menjalankan `schema.sql` yang ada di
repository.

### 5.6 Atur Edge Function Secrets

Edge Function login username membaca tiga environment variable:

| Nama environment variable | Sumber                                  | Keterangan                                                                  |
|---------------------------|:----------------------------------------|:----------------------------------------------------------------------------|
| `SUPABASE_URL`            | Disediakan oleh Supabase Edge Functions | URL project. Tidak perlu ditulis sebagai secret manual pada hosted project. |
| `PROSS_PUBLISHABLE_KEY`   | Edge Function Secrets                   | Publishable Key untuk client autentikasi di dalam function.                 |
| `PROSS_SECRET_KEY`        | Edge Function Secrets                   | Secret Key untuk query administratif ke tabel profil.                       |

Buka **Supabase Dashboard → Edge Functions → Secrets**, lalu pastikan
dua secret berikut tersedia:

- `PROSS_PUBLISHABLE_KEY`
- `PROSS_SECRET_KEY`

#### Format nilai secret harus sesuai kode

Implementasi Edge Function saat ini membaca dua nilai key dengan pola:

``` typescript
JSON.parse(Deno.env.get('PROSS_PUBLISHABLE_KEY')!)
JSON.parse(Deno.env.get('PROSS_SECRET_KEY')!)
```

Kemudian mengambil properti `.default`.

Karena itu, jika kode di repository masih menggunakan pola tersebut,
nilai yang disimpan di dashboard harus berupa JSON dengan properti
`default`, bukan key mentah.

Format nilai `PROSS_PUBLISHABLE_KEY`:

``` json
{"default":"<PUBLISHABLE_KEY_PROJECT_INI>"}
```

Format nilai `PROSS_SECRET_KEY`:

``` json
{"default":"<SECRET_KEY_PROJECT_INI>"}
```

Ganti placeholder dengan key dari project Supabase kelompok. Jangan
menyalin contoh placeholder sebagai nilai secret.

> **Peringatan:** `PROSS_SECRET_KEY` adalah kredensial rahasia dengan
> hak akses tinggi. Jangan memasukkannya ke `src/.env`,
> `EXPO_PUBLIC_...`, source code, screenshot, dokumentasi, atau commit
> Git. Hanya simpan di Edge Function Secrets.

Jika implementasi kode Edge Function diubah dan tidak lagi menggunakan
`JSON.parse(...).default`, format secret juga harus disesuaikan dengan
kode terbaru.

### 5.7 Deploy Edge Function login username

Function yang digunakan:

``` text
src/supabase/functions/login-with-username/index.ts
```

Dari folder `src/`, deploy dengan:

``` bash
npx supabase functions deploy login-with-username --no-verify-jwt
```

Opsi `--no-verify-jwt` diperlukan pada endpoint login ini karena
pengguna belum memiliki session ketika mengirim request login. Function
tetap memvalidasi input dan memeriksa password melalui Supabase Auth.

Setelah deployment berhasil:

1.  Buka **Supabase Dashboard → Edge Functions**.
2.  Pastikan function `login-with-username` muncul.
3.  Buka tab **Logs** untuk memeriksa error saat function dipanggil.
4.  Pastikan function menggunakan project yang sama dengan Project URL
    pada `.env`.

Jika source code function berubah, deploy ulang menggunakan perintah
yang sama.

**Jangan menonaktifkan verifikasi JWT secara umum untuk semua Edge
Function.** Pengaturan tanpa JWT ini hanya untuk endpoint login username
yang memang dipanggil sebelum pengguna memiliki session.

------------------------------------------------------------------------

## 6. Menjalankan Aplikasi

Pastikan terminal sedang berada di folder `src/` dan `.env` sudah diisi.

### 6.1 Jalankan development server

``` bash
npx expo start
```

Untuk membersihkan cache Metro:

``` bash
npx expo start -c
```

### 6.2 Jalankan di Android

**Menggunakan Expo Go:**

1.  Install Expo Go yang kompatibel dengan SDK proyek pada perangkat
    Android.
2.  Hubungkan komputer dan ponsel ke jaringan yang sama.
3.  Jalankan `npx expo start`.
4.  Scan QR code yang muncul di terminal/browser menggunakan Expo Go.
5.  Tunggu bundling selesai dan aplikasi terbuka.

**Menggunakan Android Emulator:**

1.  Pastikan Android Studio dan Android Emulator sudah terpasang.
2.  Jalankan emulator.
3.  Dari terminal `src/`, jalankan:

``` bash
npm run android
```

**Jika QR code tidak dapat dibuka:**

``` bash
npx expo start --tunnel
```

Mode tunnel dapat membantu ketika jaringan lokal tidak memungkinkan
perangkat mengakses development server secara langsung.

### 6.3 Perintah yang tersedia

Jalankan dari folder `src/`:

| Perintah           | Kegunaan                                                  |
|:-------------------|:----------------------------------------------------------|
| `npm start`        | Menjalankan Expo development server.                      |
| `npm run android`  | Menjalankan Expo dengan target Android.                   |
| `npm run ios`      | Menjalankan Expo dengan target iOS.                       |
| `npm run web`      | Menjalankan target Web.                                   |
| `npm run test`     | Menjalankan unit test Vitest.                             |
| `npx tsc --noEmit` | Memeriksa tipe TypeScript tanpa menghasilkan file output. |
| `npx expo-doctor`  | Memeriksa konfigurasi dan dependency Expo.                |

Untuk menghentikan development server, tekan `Ctrl + C` di terminal.

------------------------------------------------------------------------

## 7. Menjalankan Pengujian

### 7.1 Unit test

Unit test saat ini menggunakan Vitest dan berfokus pada fungsi validasi.

Jalankan:

``` bash
npm run test
```

File pengujian:

``` text
src/tests/validators.test.ts
```

Pengujian mencakup:

| Fungsi                       | Tujuan pengujian                                                               |
|:-----------------------------|:-------------------------------------------------------------------------------|
| `isDataLengkap`              | Memastikan input wajib terisi dan bukan hanya spasi.                           |
| `isPasswordKuat`             | Memastikan password memenuhi aturan minimal panjang dan kombinasi huruf/angka. |
| `isEmailValid`               | Memeriksa format dasar alamat email.                                           |
| `isKonfirmasiPasswordSesuai` | Memastikan password dan konfirmasi password sama.                              |

### 7.2 Type check

Jalankan:

``` bash
npx tsc --noEmit
```

Perintah ini memeriksa kesesuaian tipe TypeScript tanpa membuat file
hasil kompilasi.

### 7.3 Pengujian manual autentikasi

Setelah aplikasi berjalan dan Supabase telah disiapkan, lakukan skenario
berikut:

| No. | Skenario                                              | Hasil yang diharapkan                                                      |
|:----|:------------------------------------------------------|:---------------------------------------------------------------------------|
| 1   | Membuka aplikasi tanpa session                        | Halaman Login ditampilkan.                                                 |
| 2   | Membuka halaman Daftar                                | Form registrasi ditampilkan.                                               |
| 3   | Registrasi dengan data valid                          | Akun dibuat melalui Supabase Auth dan profil dibuat oleh trigger database. |
| 4   | Registrasi dengan input kosong                        | Pesan validasi ditampilkan.                                                |
| 5   | Registrasi dengan email tidak valid                   | Pesan validasi email ditampilkan.                                          |
| 6   | Registrasi dengan password lemah                      | Pesan validasi password ditampilkan.                                       |
| 7   | Registrasi dengan username/email yang sudah digunakan | Registrasi ditolak.                                                        |
| 8   | Login dengan email dan password benar                 | Pengguna berhasil masuk.                                                   |
| 9   | Login dengan username dan password benar              | Edge Function memetakan username ke email dan pengguna berhasil masuk.     |
| 10  | Login dengan password salah                           | Pesan kredensial tidak valid ditampilkan.                                  |
| 11  | Logout                                                | Session berakhir dan halaman Login ditampilkan kembali.                    |

Catat hasil pengujian dan simpan screenshot/video sebagai bukti
pengujian M9.

Unit test validator **tidak menggantikan** pengujian integrasi Supabase
dan pengujian manual pada Android.

------------------------------------------------------------------------

## 8. Fitur dan Status Implementasi

Status di bawah menggambarkan ruang lingkup implementasi awal pada
branch autentikasi. Perbarui bagian ini ketika fitur baru sudah di-merge
ke branch utama.

| Fitur/komponen                                                        | Implementasi                                                   | Status                                                                           |
|:----------------------------------------------------------------------|:---------------------------------------------------------------|:---------------------------------------------------------------------------------|
| Login menggunakan email                                               | `LoginPage.tsx`, `AuthController.ts`                           | Tersedia pada implementasi awal.                                                 |
| Login menggunakan username                                            | `LoginPage.tsx`, `AuthController.ts`, Edge Function            | Tersedia; membutuhkan Edge Function yang sudah di-deploy dan secrets yang benar. |
| Registrasi akun                                                       | `RegistrationPage.tsx`, `PemilikUsaha.ts`, `AuthController.ts` | Tersedia pada implementasi awal.                                                 |
| Validasi input autentikasi                                            | `validators.ts`                                                | Tersedia dan memiliki unit test.                                                 |
| Penyimpanan session                                                   | `services/supabase.ts`, `App.tsx`                              | Menggunakan AsyncStorage dan Supabase Auth.                                      |
| Logout                                                                | `AuthController.ts`                                            | Tersedia.                                                                        |
| Home/dashboard                                                        | `HomePage.tsx`                                                 | Placeholder; belum menjadi dashboard operasional lengkap.                        |
| Reset password                                                        | `ResetPasswordPage.tsx`                                        | Placeholder untuk integrasi lanjutan.                                            |
| Tambah produk beserta resep (UC03) | `AddProductPage.tsx`, `MarginController.ts`, `Produk.ts`, `BahanBaku.ts`, `ResepBahan.ts` | Tersedia; memiliki unit test. |
| Perhitungan HPP dan margin (UC04) | `MarginController.ts`, `margin.ts` | Tersedia; margin ditampilkan setelah produk disimpan. |
| Fitur operasional lainnya | Modul lanjutan | Mengikuti pembagian tugas anggota dan DPPL. |

------------------------------------------------------------------------

## 9. Struktur Database

### 9.1 Tabel `public.tbl_pemilik_usaha`

Tabel ini menyimpan profil pemilik usaha yang berelasi dengan pengguna
pada `auth.users` milik Supabase Auth.

| Kolom        | Tipe data     | Keterangan                                                                                      |
|:-------------|:--------------|:------------------------------------------------------------------------------------------------|
| `id`         | `uuid`        | Primary key sekaligus foreign key ke `auth.users(id)`, dengan `ON DELETE CASCADE`.              |
| `username`   | `text`        | Username pemilik usaha; wajib dan unik tanpa membedakan huruf besar/kecil melalui unique index. |
| `email`      | `text`        | Email akun; wajib dan unik tanpa membedakan huruf besar/kecil melalui unique index.             |
| `nama_usaha` | `text`        | Nama usaha; opsional.                                                                           |
| `no_telp`    | `text`        | Nomor telepon; opsional.                                                                        |
| `created_at` | `timestamptz` | Waktu pembuatan profil; default `now()`.                                                        |

Password **tidak disimpan** di tabel profil. Password dikelola oleh
Supabase Auth.

### 9.2 RLS dan policy

RLS diaktifkan pada `tbl_pemilik_usaha`.

Policy yang didefinisikan:

- **`baca data sendiri`**: pengguna dengan role `authenticated` hanya
  dapat membaca profil dengan `id` yang sama dengan `auth.uid()`.
- **`ubah data sendiri`**: pengguna hanya dapat memperbarui profil
  miliknya sendiri. Kondisi `USING` dan `WITH CHECK` membatasi `id` ke
  `auth.uid()`.

Role `authenticated` diberikan hak SQL `SELECT` dan `UPDATE` pada tabel
tersebut. RLS tetap menentukan baris mana yang boleh diakses.

### 9.3 Function dan trigger database

| Nama                                  | Jenis            | Kegunaan                                                                        |
|:--------------------------------------|:-----------------|:--------------------------------------------------------------------------------|
| `handle_new_user()`                   | Trigger function | Membuat profil pemilik usaha ketika akun baru dibuat di Supabase Auth.          |
| `on_auth_user_created`                | Trigger          | Memanggil `handle_new_user()` setelah insert pada `auth.users`.                 |
| `account_exists(p_username, p_email)` | SQL function     | Memeriksa apakah username atau email sudah terdaftar dan mengembalikan boolean. |

`auth.users` dikelola oleh Supabase Auth. Tabel tersebut bukan tabel
aplikasi yang dibuat manual oleh `schema.sql`.

### 9.4 Batas cakupan schema saat ini

`schema.sql` pada implementasi awal ini baru mendefinisikan tabel
`tbl_pemilik_usaha` beserta objek database pendukungnya. Tabel untuk
produk, bahan baku, resep, riwayat harga, notifikasi, dan modul bisnis
lainnya perlu ditambahkan sesuai kebutuhan fitur dan dokumen DPPL.

### 9.5 Tabel produk, bahan baku, dan resep

Didefinisikan pada `supabase/migrations/20261103000000_produk_bahan_resep.sql`. Migrasi ini bergantung pada `tbl_pemilik_usaha`.

| Tabel | Kolom utama | Keterangan |
|:--|:--|:--|
| `tbl_produk` | `id_produk`, `id_pemilik`, `nama_produk`, `tag`, `harga_jual`, `margin` | Nama produk unik per pemilik tanpa membedakan huruf besar/kecil; `margin` boleh negatif. |
| `tbl_bahan_baku` | `id_bahan`, `id_pemilik`, `nama_bahan`, `harga_beli` | Nama bahan unik per pemilik; `harga_beli` per satuan takaran. |
| `tbl_resep_bahan` | `id_produk`, `id_bahan`, `takaran` | Primary key gabungan `(id_produk, id_bahan)`; resep ikut terhapus bila produk dihapus. |

RLS diaktifkan pada ketiga tabel; pemilik hanya dapat mengakses datanya sendiri. Rumus: HPP = jumlah (takaran x harga beli), margin = harga jual - HPP.

`supabase/seed.sql` membuat data contoh bila akun `demo@pross.test` sudah ada.

------------------------------------------------------------------------

## 10. Alur Autentikasi

### 10.1 Registrasi

1.  Pengguna membuka `RegistrationPage`.
2.  Pengguna memasukkan username, email, password, dan konfirmasi
    password.
3.  `RegistrationPage` memeriksa kecocokan password dengan
    `isKonfirmasiPasswordSesuai`.
4.  `AuthController` memeriksa kelengkapan data, format email, kekuatan
    password, dan duplikasi akun.
5.  `PemilikUsaha.createUser()` memanggil `supabase.auth.signUp()`.
6.  Supabase Auth membuat akun di `auth.users`.
7.  Trigger `on_auth_user_created` menjalankan `handle_new_user()` untuk
    membuat profil di `tbl_pemilik_usaha`.

### 10.2 Login dengan email

1.  Pengguna memasukkan email dan password di `LoginPage`.
2.  `AuthController` mengenali identifier sebagai email.
3.  Aplikasi memanggil `supabase.auth.signInWithPassword()`.
4.  Jika kredensial valid, Supabase mengembalikan session.
5.  `App.tsx` mendeteksi perubahan session dan menampilkan Home.

### 10.3 Login dengan username

1.  Pengguna memasukkan username dan password.
2.  `AuthController` memanggil Edge Function `login-with-username`.
3.  Edge Function mencari email berdasarkan username di
    `tbl_pemilik_usaha`.
4.  Edge Function memvalidasi password melalui Supabase Auth.
5.  Jika berhasil, function mengembalikan access token dan refresh
    token.
6.  Aplikasi memanggil `supabase.auth.setSession()` untuk menyimpan
    session.
7.  `App.tsx` mendeteksi session dan menampilkan Home.

### 10.4 Pengelolaan session dan logout

Supabase client pada `services/supabase.ts` menggunakan AsyncStorage
dengan:

- `persistSession: true` agar session disimpan secara persisten.
- `autoRefreshToken: true` agar token diperbarui otomatis.
- `detectSessionInUrl: false` karena aplikasi utama berjalan di React
  Native.

`App.tsx` memeriksa session saat aplikasi dimulai dan mendengarkan
perubahan autentikasi. Logout memanggil `supabase.auth.signOut()`
melalui `AuthController`.

------------------------------------------------------------------------

## 11. Troubleshooting

### 11.1 `package.json` tidak ditemukan

Penyebab umum: perintah Expo dijalankan dari root repository.

Solusi:

``` bash
cd src
npx expo start
```

### 11.2 Dependency gagal dipasang

Pastikan Node.js sesuai dengan Expo SDK 58, lalu jalankan dari `src/`:

``` bash
npm ci
```

Jangan menghapus `package-lock.json` sebagai solusi pertama.

### 11.3 Error Supabase URL atau Publishable Key belum diatur

Periksa bahwa `src/.env` tersedia dan berisi:

``` dotenv
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Pastikan tidak ada salah ketik pada nama variabel. Setelah mengubah
`.env`, restart Expo:

``` bash
npx expo start -c
```

### 11.4 QR code tidak dapat dibuka di Expo Go

- Pastikan ponsel dan komputer berada pada jaringan yang sama.
- Pastikan Expo Go kompatibel dengan SDK proyek.
- Coba `npx expo start --tunnel`.
- Restart Metro dengan `npx expo start -c`.

### 11.5 Registrasi berhasil tetapi profil tidak muncul

Periksa:

1.  Tabel `public.tbl_pemilik_usaha` sudah dibuat.
2.  Trigger `on_auth_user_created` tersedia pada `auth.users`.
3.  Function `handle_new_user()` tersedia dan tidak error.
4.  Username dan email yang dimasukkan memenuhi constraint unik.

Periksa log dan hasil query database melalui Supabase Dashboard.

### 11.6 Login email berhasil, tetapi login username gagal

Periksa:

1.  Edge Function `login-with-username` sudah di-deploy.
2.  Function di-deploy ke project yang sama dengan Project URL pada
    `.env`.
3.  Secret `PROSS_PUBLISHABLE_KEY` dan `PROSS_SECRET_KEY` tersedia.
4.  Format secret sesuai cara parsing di file Edge Function.
5.  Username yang dicoba benar-benar tersedia di `tbl_pemilik_usaha`.
6.  Deploy menggunakan konfigurasi `--no-verify-jwt` untuk endpoint
    login ini.
7.  Buka **Edge Functions → Logs** untuk melihat error function.

### 11.7 Muncul error `supabaseKey is required`

Biasanya key tidak terbaca atau environment variable salah nama.

- Periksa nama variabel di `.env`.
- Periksa bahwa `services/supabase.ts` membaca
  `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Periksa bahwa Edge Function membaca `PROSS_PUBLISHABLE_KEY` dan
  `PROSS_SECRET_KEY`.
- Jangan mencampur nama environment variable client dan Edge Function.

### 11.8 Muncul error `ReferenceError: createClient is not defined`

Periksa import `createClient` pada file Edge Function:

``` typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
```

Setelah memperbaiki source code, deploy ulang function dan periksa Logs.

------------------------------------------------------------------------

## 12. Panduan Kontribusi

Agar pekerjaan antaranggota tetap terpisah dan mudah direview:

### 12.1 Mulai dari branch terbaru

``` bash
git switch main
git pull origin main
git switch -c feat/nama-fitur
```

Ganti `nama-fitur` sesuai fitur yang dikerjakan.

### 12.2 Ikuti arsitektur dan dokumen perancangan

Sebelum implementasi:

1.  Baca use case dan kelas terkait di SKPL/DPPL.
2.  Periksa sequence diagram dan class diagram pada DPPL2.
3.  Tentukan file View, Controller, Model, dan Service yang dibutuhkan.
4.  Hindari mengubah kontrak modul anggota lain tanpa koordinasi.
5.  Catat perubahan rancangan yang diperlukan untuk dokumentasi B.1 M9.

### 12.3 Tambahkan pengujian

Tambahkan atau perbarui unit test untuk logika yang dibuat. Jalankan:

``` bash
npm run test
npx tsc --noEmit
npx expo-doctor
```

Jika perubahan memengaruhi tampilan atau alur aplikasi, lakukan
pengujian manual di Android.

### 12.4 Gunakan semantic commit

Gunakan format:

``` text
<type>(<scope>): <deskripsi>
```

Contoh:

``` text
feat(product): add product registration flow
fix(auth): handle expired login session
test(product): add product validation tests
docs(readme): update setup instructions
```

### 12.5 Pull Request

Buat Pull Request menuju branch `main` kelompok. Sertakan:

- Ringkasan fitur/perubahan.
- ID use case atau kelas DPPL yang terkait.
- Daftar file/komponen yang diubah.
- Cara menjalankan atau menguji perubahan.
- Hasil test.
- Screenshot/video jika perubahan memengaruhi UI.
- Catatan konfigurasi Supabase atau environment variable baru (tanpa
  nilai rahasia).

Minta minimal satu anggota lain melakukan code review sebelum merge.

------------------------------------------------------------------------

## 13. Referensi

### Dokumen internal

- `docs/M5/` — Spesifikasi Kebutuhan Perangkat Lunak (SKPL).
- `docs/M6/` — Arsitektur Perangkat Lunak (APL).
- `docs/M8/` — Deskripsi Perancangan Perangkat Lunak (DPPL) dan
  rancangan UI.
- `docs/M9/` — Dokumentasi implementasi dan asistensi.

### Dokumentasi teknologi

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Expo — Environment
  Variables](https://docs.expo.dev/guides/environment-variables/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Edge Function
  Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Vitest](https://vitest.dev/guide/)

------------------------------------------------------------------------

**Pross — Kenali biaya, jaga untung.**