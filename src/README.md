# ITBELI

ITBELI adalah marketplace barang *preloved* untuk sivitas ITB. Pendaftaran hanya menerima surel `@itb.ac.id` dan baru aktif setelah kode verifikasi dimasukkan, sehingga setiap penjual dan pembeli adalah orang kampus. Penjual memasang listing dengan foto, harga, kategori, dan titik temu COD; pembeli mencari lewat katalog lalu bernegosiasi di ruang percakapan yang isinya terenkripsi. Admin menangani laporan pelanggaran lewat dasbor moderasi dan tidak punya akses ke isi percakapan.

Aplikasi ini adalah implementasi Tugas 9 IF2150 Rekayasa Perangkat Lunak, kelompok K01-G02. Rancangannya ada di `docs/M5` (SKPL), `docs/M6` (APL), dan `docs/M8` (DPPL); laporan implementasinya di `docs/M9/K01_G02_Implementasi.md`.

## Teknologi

| Bagian | Teknologi | Versi |
| :--- | :--- | :--- |
| Runtime | Node.js | 22 ke atas (diuji pada 22.19.0) |
| Server web | Express | 5.3.0 |
| Basis data | PostgreSQL | 16 (image `postgres:16-alpine`) |
| Akses basis data | `pg` (node-postgres), SQL ditulis langsung tanpa ORM | 8.23.1 |
| Hash kata sandi | `bcrypt` | 6.0.0 |
| Enkripsi pesan | AES-256-GCM dari modul `crypto` bawaan Node.js | bawaan |
| Unggah berkas | `multer` | 2.5.0 |
| Surel | `nodemailer`, dengan Mailpit sebagai SMTP lokal | 10.3.1; Mailpit v1.21 |
| Notifikasi push | `web-push` (VAPID) dan Service Worker | 3.6.7 |
| Konfigurasi | `dotenv` | 16.6.1 |
| Pengujian | Jest dan Supertest | 30.5.2 dan 7.3.1 |
| Antarmuka | HTML5, CSS3, dan JavaScript tanpa framework maupun langkah *build* | - |

Versi persis seluruh dependensi terkunci di `package-lock.json`. Arsitekturnya MVC di atas klien-server, sesuai DPPL: View berjalan di peramban, sedangkan Controller dan Model berjalan di server.

## Prasyarat

- Node.js 22 atau lebih baru beserta npm.
- Docker Desktop (atau Docker Engine dengan plugin Compose) untuk PostgreSQL dan Mailpit. Bila tidak ingin memakai Docker, lihat bagian [Menjalankan tanpa Docker](#menjalankan-tanpa-docker).
- Peramban berbasis Chromium, misalnya Chrome atau Edge.

Tidak ada akun layanan pihak ketiga yang diperlukan.

## Instalasi dan Konfigurasi

Semua perintah dijalankan dari folder `src/`.

**1. Pasang dependensi.**

```bash
npm ci
```

**2. Buat berkas `.env` dari contohnya.**

```bash
cp .env.example .env
```

Di PowerShell, perintahnya `Copy-Item .env.example .env`.

**3. Isi dua nilai wajib di `.env`.** `DB_PASSWORD` boleh diisi apa saja, misalnya `itbeli-lokal`; nilai ini menjadi kata sandi PostgreSQL di dalam Docker. `KUNCI_ENKRIPSI_PESAN` harus 64 karakter hex, dan perintah berikut mencetak satu kunci yang siap ditempel:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4. Nyalakan PostgreSQL dan Mailpit.**

```bash
docker compose up -d
```

**5. Buat tabel.** Perintah ini menjalankan `database/schema.sql` dan aman diulang.

```bash
npm run db:init
```

**6. Isi data uji.** Seed membuat lima akun uji dan dua dokumen legal, juga aman diulang.

```bash
npm run db:seed
```

### Variabel lingkungan

| Variabel | Wajib | Bawaan | Kegunaan |
| :--- | :--- | :--- | :--- |
| `PORT` | tidak | `3000` | Port server web |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME` | tidak | `localhost`, `5432`, `itbeli`, `itbeli` | Koneksi PostgreSQL; nilai bawaannya cocok dengan `docker-compose.yml` |
| `DB_PASSWORD` | ya | - | Kata sandi PostgreSQL. Docker Compose menolak berjalan bila kosong |
| `DATABASE_URL` | tidak | - | *Connection string* PostgreSQL lain. Bila diisi, seluruh `DB_*` diabaikan |
| `SMTP_HOST`, `SMTP_PORT` | tidak | `localhost`, `1025` | Server SMTP; bawaannya mengarah ke Mailpit |
| `SMTP_USER`, `SMTP_PASS` | tidak | - | Kredensial SMTP, hanya untuk server SMTP sungguhan |
| `SUREL_PENGIRIM` | tidak | `ITBELI <no-reply@itbeli.local>` | Alamat pengirim surel |
| `BCRYPT_SALT_ROUNDS` | tidak | `10` | Biaya hash kata sandi |
| `DURASI_SESI_JAM` | tidak | `24` | Masa berlaku sesi login |
| `DURASI_KODE_MENIT` | tidak | `15` | Masa berlaku kode verifikasi |
| `KUNCI_ENKRIPSI_PESAN` | ya, untuk percakapan | - | Kunci AES-256-GCM, 64 karakter hex |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | tidak | - | Kunci Web Push. Bila kosong, notifikasi di dalam aplikasi tetap muncul dan hanya notifikasi push peramban yang dilewati. Pasangan kunci dibuat dengan `npx web-push generate-vapid-keys` |
| `BLOB_READ_WRITE_TOKEN` | hanya di Vercel | - | Token Vercel Blob. Bila diisi, foto listing dan bukti laporan disimpan ke Vercel Blob; bila kosong, disimpan di `uploads/` |

Berkas `.env` tidak ikut repository. Jangan meng-commit-nya.

## Menjalankan Aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`. Alamat itu mengalihkan ke katalog, dan katalog mengalihkan ke halaman masuk bila belum ada sesi. `npm run dev` memuat ulang server setiap kali berkas berubah; untuk menjalankan tanpa pemantauan berkas, pakai `npm start`.

Surel yang dikirim aplikasi, yaitu kode verifikasi pendaftaran serta pemberitahuan penghapusan listing dan pemblokiran akun, tidak keluar ke internet. Semuanya tertangkap Mailpit dan dapat dibaca di `http://localhost:8025`.

Untuk berhenti, tekan `Ctrl+C` pada server, lalu matikan layanan pendukung:

```bash
docker compose down
```

Data PostgreSQL tetap tersimpan di volume `itbeli-db`. Tambahkan `-v` pada perintah di atas bila ingin mulai dari basis data kosong.

### Menjalankan test

```bash
npm test
```

Ada 358 test dalam 24 suite (17 unit dan 7 integrasi). Test tidak memerlukan PostgreSQL maupun Mailpit karena kueri diganti tiruan, jadi perintah ini bisa dijalankan tepat setelah `npm ci`. Laporan cakupan dicetak dengan `npx jest --coverage`.

## Akun dan Data Uji

`npm run db:seed` membuat lima akun fiktif berikut. Kata sandi semuanya `ujicoba123`.

| Surel | Peran dan status | Dipakai untuk mencoba |
| :--- | :--- | :--- |
| `admin.uji@itb.ac.id` | Admin, terverifikasi | Dasbor laporan di `/admin-laporan` |
| `penjual.uji@itb.ac.id` | Pengguna, terverifikasi | Membuat dan mengelola listing |
| `pembeli.uji@itb.ac.id` | Pengguna, terverifikasi | Katalog, pencarian, percakapan, laporan |
| `diblokir.uji@itb.ac.id` | Pengguna, diblokir | Penolakan login akun terblokir, lalu buka blokir oleh admin |
| `belum.uji@itb.ac.id` | Pengguna, belum terverifikasi | Penolakan login sebelum verifikasi dan kirim ulang kode |

Seed tidak membuat listing, jadi katalog kosong pada awalnya. Urutan berikut melewati hampir semua fitur dalam beberapa menit:

1. Masuk sebagai `penjual.uji@itb.ac.id`, buka Listing Saya, lalu buat satu listing dengan minimal satu foto JPG atau PNG.
2. Di jendela penyamaran, masuk sebagai `pembeli.uji@itb.ac.id`. Cari listing tadi di katalog, buka detailnya, tekan Hubungi Penjual, dan kirim pesan.
3. Kembali ke jendela penjual: lonceng notifikasi menunjukkan satu pesan baru, dan balasan dapat dikirim dari `/percakapan`.
4. Dari jendela pembeli, tekan Laporkan pada detail listing, isi alasan, dan lampirkan satu tangkapan layar.
5. Masuk sebagai `admin.uji@itb.ac.id`, buka `/admin-laporan`, lalu ubah status laporan, hapus listing, atau blokir akun. Surel pemberitahuannya muncul di Mailpit.
6. Untuk mencoba pendaftaran, daftar dengan surel `@itb.ac.id` apa pun, ambil kode enam digit dari Mailpit, dan masukkan di halaman verifikasi.

## Modul, Fitur, dan Pembagian Anggota

| Modul | Use case | Fitur | Penanggung jawab |
| :--- | :--- | :--- | :--- |
| A. Akun dan Otentikasi | UC01 sampai UC06 | Daftar akun, verifikasi surel, login, logout, profil, dokumen legal; kerangka proyek, Otorisasi, dan seed | 13525034 Dhanesworo Muhammad Datiputro |
| B. Listing Penjual | UC07 sampai UC12 | Buat, lihat, ubah, dan hapus listing; tandai terjual dan batalkan; unggah 1 sampai 5 foto | 13525115 Nazhif Hilmi Kistijantoro |
| C. Katalog dan Pencarian | UC13 sampai UC15 | Katalog berpaginasi, pencarian kata kunci, filter kategori, harga, dan lokasi, pengurutan, detail listing | 13525121 I Made Adi Kusuma Ardana |
| D. Percakapan dan Notifikasi | UC16 sampai UC18 | Hubungi penjual, kirim pesan terenkripsi, daftar percakapan, notifikasi dalam aplikasi dan Web Push | 13525124 Sulthan Dhiyazka Suwandi |
| E. Laporan dan Moderasi | UC19 sampai UC24 | Kirim laporan dengan bukti, dasbor admin, ubah status laporan, hapus listing, blokir dan buka blokir akun, log audit | 13525106 Ghaniyul Amri Caulava |

### Halaman

| Alamat | Layar DPPL | Isi |
| :--- | :--- | :--- |
| `/masuk`, `/daftar`, `/verifikasi` | I-01, I-02, I-03 | Login, pendaftaran, verifikasi surel |
| `/katalog` | I-04, I-05 | Katalog dan hasil pencarian |
| `/barang?id=` | I-06 | Detail listing untuk pembeli |
| `/listing-form`, `/listing-saya`, `/detail?id=` | I-07, I-08 | Formulir listing, daftar listing sendiri, detail untuk pemilik |
| `/profil` | I-09 | Profil akun |
| `/percakapan` | I-10, I-11 | Percakapan; panel notifikasi ada pada lonceng di bilah atas |
| `/laporan-form` | I-12 | Formulir laporan |
| `/admin-laporan`, `/admin-detail?id=` | I-13, I-14 | Dasbor admin |
| `/legal` | I-15 | Kebijakan Privasi dan Ketentuan Penggunaan |

### Endpoint API

Semua endpoint berada di bawah `/api` dan mengembalikan JSON. Selain pendaftaran, verifikasi, login, tautan kebijakan, dan dokumen legal, setiap endpoint membutuhkan header `Authorization: Bearer <token>` dari hasil login; endpoint `/api/admin/*` hanya menerima akun admin.

| Awalan | Endpoint |
| :--- | :--- |
| `/api/akun` | `POST /daftar`, `POST /verifikasi`, `POST /kirim-ulang`, `POST /login`, `POST /logout`, `GET /profil`, `GET /tautan-kebijakan` |
| `/api/dokumen-legal` | `GET /:jenis` dengan jenis `kebijakan-privasi` atau `ketentuan-penggunaan` |
| `/api/barang` | `GET /formulir`, `GET /saya`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/status` |
| `/api/katalog` | `GET /` dengan parameter `q`, `kategori`, `hargaMin`, `hargaMaks`, `lokasi`, `urut`, `halaman`; `GET /:id` |
| `/api/percakapan` | `POST /`, `GET /`, `GET /:id`, `POST /:id/pesan` |
| `/api/notifikasi` | `GET /`, `GET /kunci-publik`, `PATCH /baca-semua`, `PATCH /:id/baca`, `POST /langganan-push` |
| `/api/laporan` | `POST /` |
| `/api/admin` | `GET /laporan`, `GET /laporan/statistik`, `GET /laporan/:id`, `PATCH /laporan/:id/status`, `DELETE /laporan/:id/barang/:idBarang`, `POST /akun/:idAkun/blokir`, `POST /akun/:idAkun/buka-blokir`, serta dua bentuk `POST /laporan/:id/akun/:idAkun/blokir` dan `.../buka-blokir` |

## Tabel Basis Data

Skema lengkapnya ada di [`database/schema.sql`](database/schema.sql). Seluruh kunci utama bertipe UUID yang dibuat aplikasi, dan seluruh waktu bertipe `TIMESTAMPTZ`.

| Tabel | Atribut | Catatan |
| :--- | :--- | :--- |
| `akun` | `id_akun`, `nama`, `nim`, `email`, `kata_sandi_hash`, `status_akun`, `status_blokir`, `peran`, `setuju_kebijakan`, `waktu_daftar` | `status_akun`: Belum Terverifikasi, Terverifikasi, Diblokir. `peran`: Pengguna, Admin. Surel unik tanpa membedakan huruf besar dan kecil |
| `sesi_login` | `id_sesi`, `id_akun`, `token`, `waktu_mulai`, `waktu_kedaluwarsa`, `status_aktif` | Token acak 64 karakter hex, unik |
| `token_verifikasi` | `id_token`, `id_akun`, `kode`, `waktu_buat`, `waktu_kedaluwarsa`, `status_pakai` | Kode 6 digit. `status_pakai`: Aktif, Terpakai, Hangus |
| `dokumen_legal` | `id_dokumen`, `jenis_dokumen`, `judul`, `isi`, `klausa_privasi_pesan`, `versi`, `tanggal_berlaku`, `status_publikasi`, `tautan` | Unik per pasangan `jenis_dokumen` dan `versi` |
| `barang` | `id_barang`, `id_penjual`, `judul`, `harga`, `deskripsi_kondisi`, `id_kategori`, `id_lokasi`, `status`, `waktu_unggah`, `waktu_ubah` | `status`: Tersedia, Terjual, Dinonaktifkan. `id_kategori` dan `id_lokasi` berisi nama pilihan dari `models/ReferensiListing.js` |
| `foto_barang` | `id_foto`, `id_barang`, `nama_berkas`, `format`, `ukuran`, `urutan`, `path_berkas` | Ikut terhapus saat listing dihapus |
| `percakapan` | `id_percakapan`, `id_pembeli`, `id_penjual`, `id_barang`, `waktu_dibuat`, `waktu_pembaruan_terakhir` | Satu ruang per kombinasi barang, pembeli, dan penjual. `id_barang` menjadi `NULL` bila listing dihapus |
| `pesan` | `id_pesan`, `id_percakapan`, `id_pengirim`, `isi_pesan_terenkripsi`, `waktu_kirim`, `status_baca` | Isi hanya tersimpan dalam bentuk terenkripsi |
| `notifikasi` | `id_notifikasi`, `id_akun`, `jenis`, `isi`, `waktu_kirim`, `status_baca` | Tidak pernah memuat isi pesan |
| `langganan_push` | `id`, `id_akun`, `endpoint`, `p256dh`, `auth` | Satu baris per peramban yang mengaktifkan notifikasi push |
| `laporan` | `id_laporan`, `id_pelapor`, `objek_dilaporkan`, `jenis_pelanggaran`, `teks_alasan`, `waktu_lapor`, `status_penanganan`, `waktu_perubahan` | `jenis_pelanggaran`: Penipuan, Konten tidak pantas, Bug atau masalah teknis. `status_penanganan`: Baru, Diproses, Selesai |
| `bukti_laporan` | `id_bukti`, `id_laporan`, `nama_berkas`, `path_berkas` | Tangkapan layar bukti |
| `log_audit` | `id_log`, `id_laporan`, `waktu`, `identitas_aktor`, `tindakan` | Riwayat penanganan laporan; aplikasi hanya menambah baris |
| `log_admin` | `id_log_admin`, `id_admin`, `jenis_tindakan`, `objek_ditindak`, `waktu`, `alasan` | Catatan tindakan moderasi admin |

Berkas foto listing dan bukti laporan tidak disimpan di basis data. Berkasnya ada di folder `uploads/`, dan tabel hanya menyimpan lokasinya.

## Struktur Folder

```
src/
  app.js, server.js       penyusunan aplikasi Express dan titik masuk server
  config/                 pembacaan .env dan pool koneksi PostgreSQL
  routes/                 pemetaan HTTP ke Controller
  controllers/            Controller (C13 sampai C22 pada DPPL)
  services/               aturan bisnis listing penjual
  models/                 Model (C23 sampai C40); hanya folder ini yang memuat SQL
  pendukung/              Otorisasi dan Kriptografi
  integrasi/              adapter surel dan Web Push
  penyimpanan/            penyimpanan berkas unggahan
  views/                  View: pages/ (HTML), js/, css/, dan sw.js
  database/               schema.sql, init.js, seed.js
  tests/                  unit/ dan integration/
  mockup/                 mockup HTML rancangan antarmuka dari DPPL
  uploads/                berkas unggahan, dibuat saat aplikasi berjalan
```

## Menjalankan tanpa Docker

Docker hanya dipakai untuk dua layanan pendukung, dan keduanya dapat diganti.

PostgreSQL 16 yang terpasang langsung di mesin, atau basis data PostgreSQL terkelola seperti Supabase, cukup dihubungkan lewat `DATABASE_URL` di `.env`:

```
DATABASE_URL=postgres://pengguna:katasandi@localhost:5432/itbeli
```

Basis datanya harus memakai *encoding* UTF-8. Setelah itu jalankan `npm run db:init` dan `npm run db:seed` seperti biasa. Pembuatan indeks pencarian memerlukan ekstensi `pg_trgm`; bila ekstensi itu tidak tersedia, `db:init` tetap berhasil dan pencarian hanya berjalan tanpa indeks.

Tanpa Mailpit, lima akun uji tetap bisa dipakai karena sudah terverifikasi oleh seed. Pendaftaran akun baru tetap tersimpan, tetapi kode verifikasinya tidak sampai ke mana pun sampai `SMTP_HOST` dan `SMTP_PORT` diarahkan ke server SMTP yang hidup.

## Deploy ke Vercel (opsional)

Aplikasi tetap dinilai dari cara menjalankan lokal di atas. Bagian ini hanya untuk menayangkan ITBELI secara daring di `https://<nama-proyek>.vercel.app`.

Di Vercel, aplikasi Express berjalan sebagai satu *serverless function*, sehingga ada empat perbedaan dari lokal:

| Bagian | Lokal | Vercel |
| :--- | :--- | :--- |
| Halaman, CSS, JS | Disajikan `express.static()` dari `views/` | `express.static()` diabaikan Vercel. `npm run salin-statis` menyalin `views/` ke `public/` saat build (diatur `vercel.json`) |
| Basis data | PostgreSQL di Docker | PostgreSQL terkelola, misalnya Neon dari Vercel Marketplace, lewat `DATABASE_URL` |
| Foto dan bukti laporan | Folder `uploads/` | Vercel Blob lewat `BLOB_READ_WRITE_TOKEN`, karena disk *serverless* tidak permanen |
| Surel | Mailpit | SMTP sungguhan, misalnya Gmail dengan *App Password* |

Langkahnya, dari folder `src/`:

1. Buat basis data Neon dan *store* Vercel Blob dari dashboard Vercel (**Storage**). `DATABASE_URL` dan `BLOB_READ_WRITE_TOKEN` akan tersedia untuk proyek tersebut.
2. Siapkan skema basis data produksi dari mesin lokal. **Jangan jalankan `db:seed`**, karena akun uji seperti `admin.uji@itb.ac.id` memakai kata sandi yang tertulis di README ini:
   ```bash
   DATABASE_URL="postgresql://...?sslmode=require" npm run db:init
   DATABASE_URL="postgresql://...?sslmode=require" npm run db:seed-legal
   ```
3. Deploy dengan Vercel CLI (`npm i -g vercel`). Jawab *directory* dengan `./`:
   ```bash
   vercel login
   vercel
   ```
4. Isi **Settings → Environment Variables** di proyek Vercel: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `KUNCI_ENKRIPSI_PESAN` (buat baru), `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS`, `SUREL_PENGIRIM`, dan bila perlu `VAPID_*`.
5. Rilis ke produksi dengan `vercel --prod`.

Batasannya: Vercel menolak permintaan lebih dari 4,5 MB, sehingga total foto dalam satu kali simpan listing harus di bawah ukuran itu. Server tidak berjalan terus-menerus, sehingga permintaan pertama setelah lama tidak dipakai bisa sedikit lebih lambat.

## Masalah yang Sering Muncul

- **`docker compose up` berhenti dengan pesan "Isi DB_PASSWORD di .env".** Berkas `.env` belum dibuat atau `DB_PASSWORD` masih kosong.
- **Mengirim atau membuka pesan menghasilkan galat server.** `KUNCI_ENKRIPSI_PESAN` kosong atau bukan 64 karakter hex. Isi nilainya, lalu jalankan ulang server.
- **`npm run db:init` gagal tersambung.** Kontainer PostgreSQL belum siap; tunggu beberapa detik setelah `docker compose up -d`, lalu ulangi. Periksa juga apakah port 5432 sudah dipakai PostgreSQL lain di mesin yang sama; bila ya, ubah `DB_PORT`.
- **Port 3000, 1025, atau 8025 sudah terpakai.** Ganti `PORT` di `.env` untuk aplikasi. Port Mailpit diatur di `docker-compose.yml`, dan `SMTP_PORT` harus mengikuti.
- **Kode verifikasi tidak datang.** Kode tidak dikirim ke kotak surat sungguhan. Lihat `http://localhost:8025`.
- **Tombol notifikasi push tidak muncul.** `VAPID_*` belum diisi. Fitur ini opsional.
- **Foto listing hilang setelah folder `uploads/` dihapus.** Berkas unggahan hanya ada di disk lokal dan tidak ikut repository.
