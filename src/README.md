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

### Backend

**TODO (#1, Dan):** Hono, Cloudflare Workers, D1 (SQLite), Drizzle ORM, bun, beserta versinya.

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
        index.tsx         # layar masuk (sementara, diganti di #3)
        komponen.tsx      # galeri komponen untuk pengembangan
        (mahasiswa)/      # tab bar Mahasiswa: beranda, kalender, konsultasi, pengingat, faq (+ layar tersembunyi)
        admin/            # stack Administrator: index, jadwal, faq, umpan-balik, status
      components/         # komponen bersama dari Figma (Tombol, IsianTeks, Banner, ...)
      theme/              # token desain: warna, font, gaya teks, jarak, sudut
      api/                # klien HTTP ke backend
  backend/                # TODO (#1, Dan)
```

## 3. Prasyarat dan Instalasi

Prasyarat:

- Node.js 22.13 atau lebih baru, dan npm.
- Git.
- Untuk mencoba di ponsel: aplikasi **Expo Go** (App Store / Play Store). Ponsel dan komputer berada di jaringan Wi-Fi yang sama.
- Opsional: Android Studio (emulator Android). Simulator iOS hanya tersedia di macOS.

Instalasi dependensi mobile:

```bash
cd src/mobile
npm install
```

Gunakan `npx expo install <paket>` (bukan `npm install <paket>`) saat menambah paket agar versinya cocok dengan Expo SDK 58.

**TODO (#1, Dan):** instalasi backend.

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

Nilai `EXPO_PUBLIC_API_URL` bergantung pada tempat aplikasi berjalan, karena `localhost` di ponsel berarti ponsel itu sendiri:

| Aplikasi berjalan di | Nilai |
|---|---|
| Ponsel fisik (Expo Go) | `http://<IP-LAN-komputer>:8787`, misalnya `http://192.168.1.10:8787` |
| Emulator Android | `http://10.0.2.2:8787` |
| Web atau simulator iOS di komputer yang sama | `http://localhost:8787` |
| Backend yang sudah di-*deploy* | `https://<nama-worker>.<subdomain>.workers.dev` |

File `.env` tidak di-*commit* (sudah ada di `.gitignore`). Variabel `EXPO_PUBLIC_*` ikut tertanam di aplikasi, jadi jangan isi rahasia apa pun di sana. Setelah mengubah `.env`, jalankan ulang `npx expo start`.

### Backend

**TODO (#1, Dan):** variabel lingkungan (`wrangler`), pembuatan D1 lokal, migrasi, dan seed.

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

Selama pengembangan, layar masuk sementara berisi tombol untuk membuka navigasi Mahasiswa, navigasi Administrator, dan galeri komponen (`/komponen`).

### Backend

**TODO (#1, Dan):** menjalankan server lokal (`wrangler dev`, port 8787) dan test.

### Rilis (APK)

**TODO (#6, Iqi):** cara membangun dan mengunduh APK rilis `v9.0`.

## 6. Akun dan Data Uji

**TODO (#3, Iqi):** akun uji Mahasiswa dan Administrator (login demo tanpa akun Google pribadi).

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

Skema D1 mengikuti DPPL bagian 5.37 (`docs/M8/K01_G04_DPPL2.md`).

**TODO (#1, Dan):** daftar tabel beserta atributnya, atau tautan ke file migrasi.

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
