<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## *ITBELI*

<p align="center">
<img alt="Logo ITBELI" src="./assets/logo-itbeli.svg" width="320">
</p>

### Untuk: *Mikhael Andrian Yonatan*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *G02*  |
| Nama Kelompok | *Indeks A* |

| NIM | Nama |
|---|---|
| *13525124* | *Sulthan Dhiyazka Suwandi* |
| *13525034* | *Dhanesworo Muhammad Datiputro* |
| *13525115* | *Nazhif Hilmi Kistijantoro* |
| *13525121* | *I Made Adi Kusuma Ardana* |
| *13525106* | *Ghaniyul Amri Caulava* |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| | |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen ini melaporkan hasil implementasi dan pengujian ITBELI. Bagian implementasi mendaftar kelas, layar, dan berkas lain yang dibangun pada Tugas 9 beserta lokasinya di repositori. Bagian pengujian memuat test case tingkat unit, integrasi, use case, dan kebutuhan non-fungsional, lengkap dengan hasil aktual dan buktinya, lalu merunut setiap kebutuhan fungsional ke test case yang memverifikasinya. Seluruh pengujian dijalankan pada kode di tag `v9.0` (commit `485af76`), yaitu rilis terakhir Tugas 9.

Pembaca utama dokumen ini adalah asisten IF2150 yang menilai Tugas 10. Anggota kelompok memakainya untuk mengetahui kebutuhan mana yang sudah terbukti terpenuhi dan test mana yang gagal beserta usulan perbaikannya.

## 1.2 Lingkup Masalah

ITBELI adalah aplikasi web jual beli barang *preloved* khusus sivitas ITB. Hanya akun dengan surel berakhiran `itb.ac.id` yang dapat mendaftar dan masuk, sehingga penjual dan pembeli saling dapat ditelusuri identitasnya. Penjual membuat listing berfoto, pembeli mencari dan menyaring katalog, keduanya bernegosiasi lewat ruang percakapan yang isinya terenkripsi, lalu bertemu langsung di lokasi COD di kampus; ITBELI tidak menangani pembayaran. Admin menangani laporan pelanggaran dengan menghapus listing atau memblokir akun. ITBELI berhubungan dengan beberapa sistem di luarnya: server SMTP untuk kode verifikasi dan pemberitahuan moderasi (Mailpit saat lokal), Google untuk masuk dengan akun Google ITB, *push service* peramban untuk Web Push, serta Neon dan Vercel Blob bila aplikasi di-*deploy* ke Vercel.

## 1.3 Definisi, Istilah, dan Singkatan

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| P/L | Perangkat Lunak |
| SKPL | Spesifikasi Kebutuhan Perangkat Lunak (Tugas 5) |
| APL | Arsitektur Perangkat Lunak (Tugas 6) |
| DPPL | Deskripsi Perancangan Perangkat Lunak (Tugas 7, revisi Tugas 8) |
| HIUPL | Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen ini |
| KF | Kebutuhan Fungsional |
| KNF | Kebutuhan Non-Fungsional |
| UC | *Use Case* |
| TC | *Test Case*, satu kasus uji untuk satu skenario |
| UT | *Unit Test*, test case tingkat kelas atau operasi |
| INT | *Integration Test*, test case yang menguji interaksi antarkomponen |
| AK | Antarmuka antarKomponen, yaitu titik interaksi antarkomponen yang diuji pada Subbab 4.3 |
| *Boundary* | Kasus uji pada nilai batas masukan, misalnya tepat 5 MB untuk batas ukuran berkas |
| *Coverage* | Persentase baris atau cabang kode yang dieksekusi oleh pengujian |
| *Mock* (tiruan) | Pengganti sebuah komponen di dalam test, misalnya kueri basis data yang mengembalikan data buatan |
| *Preloved* | Barang bekas yang masih layak pakai |
| Listing | Iklan satu barang yang dijual, berisi judul, harga, kategori, lokasi COD, deskripsi, dan foto |
| COD | *Cash on Delivery*, pembayaran tunai saat penjual dan pembeli bertemu |
| Sivitas ITB | Mahasiswa, dosen, dan tenaga kependidikan ITB |
| Token sesi | Kode acak 64 karakter yang dikirim peramban pada header `Authorization` untuk membuktikan sesi login |
| Jest | Kerangka uji JavaScript yang dipakai untuk test unit dan test API |
| Supertest | Pustaka untuk mengirim permintaan HTTP ke aplikasi Express di dalam test |
| Mailpit | Server SMTP lokal yang menangkap surel keluar dan menampilkannya di `http://localhost:8025` |
| MVC | *Model-View-Controller*, pola arsitektur ITBELI sesuai DPPL Subbab 2.2 |

## 1.4 Aturan Penomoran

Penomoran kebutuhan, use case, kelas, dan layar sama dengan SKPL dan DPPL. ID pengujian baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| Kebutuhan Fungsional | KFXX | Sesuai SKPL, KF01 sampai KF56 |
| Kebutuhan Non-Fungsional | KNFXX | Sesuai SKPL, KNF01 sampai KNF04 |
| Use Case | UCXX | Sesuai SKPL, UC01 sampai UC24 |
| Kelas | CXX | Sesuai DPPL Tabel 4.1, C01 sampai C45 |
| Antarmuka layar | I-XX | Sesuai DPPL, I-01 sampai I-15 |
| Antarmuka antarkomponen | AK-XX | Baru pada dokumen ini, bernomor urut. Dibedakan dari I-XX karena I-XX sudah dipakai DPPL untuk layar |
| Test Case Unit | CXX-UTYY | XX adalah nomor kelas, YY nomor urut test case pada kelas tersebut. ID ditulis di awal judul test Jest, misalnya `C20-UT21 [Normal] buatLaporan: ...`, sehingga keluaran *test runner* langsung cocok dengan Subbab 4.2 |
| Test Case Integrasi | INT-TCYY | YY adalah nomor urut test case integrasi. Test berada di `src/tests/db/` dan memuat ID yang sama di awal judulnya |
| Test Case Use Case | UCXX-TCYY | XX adalah nomor use case, YY nomor urut test case pada use case tersebut |
| Test Case KNF | KNFXX-TCYY | XX adalah nomor KNF, YY nomor urut test case pada KNF tersebut |
| Berkas bukti | `docs/M10/assets/bukti/` | Satu berkas per ID pengujian, per kelas, atau per modul untuk keluaran *test runner* yang dipakai bersama |

## 1.5 Referensi

1. Kelompok G02. *K01_G02_SKPL: Spesifikasi Kebutuhan Perangkat Lunak ITBELI*. `docs/M5/K01_G02_SKPL.md`.
2. Kelompok G02. *K01_G02_APL: Arsitektur Perangkat Lunak ITBELI*. `docs/M6/K01_G02_APL.md`.
3. Kelompok G02. *K01_G02_DPPL2: Deskripsi Perancangan Perangkat Lunak ITBELI, revisi*. `docs/M8/K01_G02_DPPL2.md`.
4. Kelompok G02. *K01_G02_Implementasi: Laporan Implementasi ITBELI (Tugas 9)*. `docs/M9/K01_G02_Implementasi.md`.
5. Kelompok G02. *README aplikasi ITBELI*. `src/README.md`.
6. Jest. *Getting Started* dan *Configuring Jest*. https://jestjs.io/docs/getting-started
7. Supertest. https://github.com/ladjs/supertest
8. Express 5. https://expressjs.com/
9. PostgreSQL 16 Documentation. https://www.postgresql.org/docs/16/
10. node-postgres. https://node-postgres.com/
11. Mailpit Documentation. https://mailpit.axllent.org/docs/

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)

BAB 1 menjelaskan tujuan, lingkup, istilah, dan aturan penomoran dokumen. BAB 2 memberi gambaran umum ITBELI beserta *use case diagram*-nya. BAB 3 mendaftar lingkungan implementasi, kelas, layar, dan berkas lain yang dibangun. BAB 4 melaporkan pengujian dari tingkat kelas sampai kebutuhan non-fungsional, termasuk test yang gagal dan usulan perbaikannya. BAB 5 merunut setiap KF dan KNF ke kelas, berkas, dan test case yang memverifikasinya.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bab ini diringkas dari BAB 2 dan Subbab 4.3 SKPL, lalu disesuaikan dengan keadaan implementasi pada tag `v9.0` sebagaimana dicatat pada Tabel B.1 laporan implementasi M9.

**ITBELI** adalah aplikasi web *marketplace* barang *preloved* khusus sivitas ITB. Aplikasi ini mempertemukan mahasiswa yang ingin melepas barang bekas layak pakai dengan mahasiswa lain yang membutuhkannya dalam satu katalog terpusat, sebagai pengganti grup percakapan dan *marketplace* umum yang tersebar. Pendaftaran dan masuk hanya dapat dilakukan dengan surel berdomain ITB, sehingga setiap pihak yang bertransaksi dapat dipastikan merupakan anggota sivitas ITB. Satu akun dapat berperan bergantian sebagai penjual dan pembeli.

Penjual membuat listing berisi foto, judul, harga, deskripsi kondisi, kategori, dan lokasi titik temu COD, mengelola listing miliknya, dan menandai barang yang sudah laku sebagai terjual. Pembeli menjelajahi katalog, mencari dan menyaring listing, membuka detailnya, lalu menghubungi penjual melalui percakapan di dalam aplikasi untuk menyepakati harga serta waktu dan tempat COD. Admin meninjau laporan pengguna terhadap listing atau akun yang bermasalah, lalu menghapus listing atau memblokir akun yang terbukti melanggar. Isi percakapan antarpengguna disimpan terenkripsi dan tidak dapat dibaca admin.

Tabel 2.1. Pengguna ITBELI

| Pengguna | Peran dalam Sistem | Use Case |
| :--- | :--- | :--- |
| Pembeli | Sivitas ITB terverifikasi yang mencari dan menghubungi penjual | UC01 s.d. UC06, UC13 s.d. UC19 |
| Penjual | Sivitas ITB terverifikasi yang memasarkan barang; secara teknis memakai akun yang sama dengan Pembeli | UC01 s.d. UC12, UC15, UC17 s.d. UC19 |
| Admin | Pengelola platform yang menangani laporan dan moderasi | UC03, UC04, UC20 s.d. UC24 |

## Batasan dan Keterkaitan dengan Sistem Lain

ITBELI hanya memfasilitasi tahap sebelum transaksi. Pembayaran dan serah terima barang dilakukan secara luring melalui COD di kampus, sehingga ITBELI tidak terhubung dengan *payment gateway* maupun layanan logistik. ITBELI juga tidak menjamin kondisi atau keaslian barang yang ditawarkan.

Untuk menjalankan fungsinya, ITBELI bergantung pada beberapa sistem di luarnya. Gambar 2.1 menunjukkan batas tersebut. Setiap sistem eksternal memiliki padanan lokal yang dipakai saat pengembangan dan pengujian M10, dan padanan daring yang dipakai pada versi `https://itbeli.vercel.app` (M9 B.1 No. 39 dan 40).

```mermaid
flowchart LR
    P([Pembeli / Penjual]) -->|HTTP lewat peramban| A
    D([Admin]) -->|HTTP lewat peramban| A
    subgraph ITBELI [Sistem ITBELI]
        A[Aplikasi web Express<br/>View, Controller, Model]
    end
    A <-->|SQL| DB[(PostgreSQL<br/>Docker lokal / Neon)]
    A -->|simpan dan hapus foto| FS[(Penyimpanan berkas<br/>disk lokal / Vercel Blob)]
    A -->|kode verifikasi dan<br/>pemberitahuan moderasi| SMTP[Server SMTP<br/>Mailpit / Gmail SMTP]
    A <-->|OAuth 2.0 + PKCE| G[Google OAuth<br/>masuk dengan akun ITB]
    A -->|Web Push VAPID| WP[Push service peramban]
    P -. "pembayaran dan serah terima COD<br/>(di luar sistem)" .- P
```

<p align="center">
<i>Gambar 2.1. Batas Sistem ITBELI dan Keterkaitannya dengan Sistem Lain</i>
</p>

Tabel 2.2. Sistem Eksternal yang Terhubung dengan ITBELI

| Sistem Eksternal | Kegunaan | Lokal (pengembangan dan pengujian) | Daring |
| :--- | :--- | :--- | :--- |
| PostgreSQL | Penyimpanan seluruh data akun, listing, percakapan, laporan, dan log | PostgreSQL 16 melalui Docker Compose | Neon |
| Penyimpanan berkas | Foto listing dan bukti laporan | Folder `src/uploads/` | Vercel Blob |
| Server SMTP | Kode verifikasi berbatas waktu 15 menit dan pemberitahuan tindakan moderasi | Mailpit | Gmail SMTP |
| Google OAuth 2.0 | Masuk dengan akun Google ITB (tambahan pada M9 B.1 No. 41) | Kredensial uji bila diisi | Belum aktif (M9 B.3 No. 15) |
| Push service peramban | Notifikasi pesan baru saat aplikasi tidak dibuka (KF34) | Chrome pada `localhost` | Chrome pada domain Vercel |

## Use Case Diagram

<p align="center">
<img alt="Use Case Diagram ITBELI" src="./assets/use-case-itbeli.jpg" width="90%">
</p>
<p align="center">
<i>Gambar 2.2. Use Case Diagram ITBELI</i>
</p>

Gambar 2.2 adalah *use case diagram* dari SKPL Subbab 4.3. Seluruh use case kecuali Mendaftar Akun mensyaratkan pengguna sudah masuk (UC03), sebagaimana dinyatakan pada catatan di diagram. Pembeli dan Penjual berbagi use case akun, katalog, percakapan, dan pelaporan, sedangkan pengelolaan listing hanya dilakukan Penjual dan seluruh use case moderasi hanya dilakukan Admin. Use case dikelompokkan ke dalam lima modul yang menjadi dasar pembagian pengujian pada BAB 4:

| Modul | Use Case |
| :--- | :--- |
| A. Akun dan Otentikasi | UC01 Mendaftar Akun, UC02 Memverifikasi Surel, UC03 Masuk ke Sistem, UC04 Keluar dari Sistem, UC05 Melihat Profil Akun, UC06 Melihat Kebijakan Privasi dan Ketentuan Penggunaan |
| B. Listing Penjual | UC07 Membuat Listing, UC08 Melihat Daftar Listing Milik Sendiri, UC09 Mengubah Listing, UC10 Menghapus Listing, UC11 Menandai Listing Terjual, UC12 Membatalkan Penandaan Terjual |
| C. Katalog dan Pencarian | UC13 Melihat Katalog Listing, UC14 Mencari dan Menyaring Listing, UC15 Melihat Detail Listing |
| D. Percakapan dan Notifikasi | UC16 Menghubungi Penjual, UC17 Mengirim Pesan dalam Percakapan, UC18 Melihat Daftar Percakapan |
| E. Laporan dan Moderasi | UC19 Mengirimkan Laporan, UC20 Melihat dan Menyaring Daftar Laporan, UC21 Mengubah Status Penanganan Laporan, UC22 Menghapus Listing yang Dilaporkan, UC23 Memblokir Akun Pengguna, UC24 Membuka Blokir Akun Pengguna |

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti Subbab 2.1 DPPL dengan tiga perubahan yang sudah dicatat pada Tabel B.1 laporan implementasi M9. Pertama, PostgreSQL berjalan lokal melalui Docker, bukan pada Supabase (B.1 No. 1). Kedua, berkas unggahan disimpan di disk lokal atau Vercel Blob, bukan Supabase Storage (B.1 No. 13, 40). Ketiga, server lokal memakai HTTP tanpa mkcert (B.1 No. 14). Versi daring di-*deploy* ke Vercel dengan basis data Neon (B.1 No. 39).

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | Pengembangan dan pengujian: laptop anggota, salah satunya Lenovo 80T2 (Intel Core i7-7500U 2,70 GHz, 2 core/4 thread, RAM 12 GB) yang dipakai untuk pengujian Modul A. Versi daring: satu Vercel Function di region Singapura (`sin1`) |
| *Operating System* | Pengembangan: Windows 10 Home 64-bit (build 19045) dan Windows 11. Kontainer basis data: Alpine Linux (image `postgres:16-alpine`). Klien: peramban berbasis Chromium, diuji pada Google Chrome 157 |
| *Bahasa Pemrograman* | JavaScript pada Node.js 22 ke atas (`engines: >=22`; pengujian M10 memakai Node.js 25.6.1, profiling M9 memakai 22.19), HTML5, CSS3, dan JavaScript pada peramban, serta SQL (PostgreSQL) |
| *Framework/Library* | Express 5.3.0, pg 8.23.1, bcrypt 6.0.0, nodemailer 10.3.1, multer 2.5.0, web-push 3.6.7, @vercel/blob 2.9.0, dotenv 16.6.1. Tanpa *framework* front-end |
| *DBMS* | PostgreSQL 16.15 melalui Docker Compose (`src/docker-compose.yml`) untuk lokal dan pengujian, serta PostgreSQL terkelola Neon (Singapura) untuk versi daring |
| *Development Tools* | Visual Studio Code 1.146, Git 2.37 dan GitHub (branch, *pull request*, issue tracker #48), npm, Docker Desktop dengan Docker Compose 5.2, Mailpit 1.21.8 (server SMTP lokal), Vercel CLI, Chrome DevTools, PlantUML dan draw.io |
| *Testing Tools* | Jest 30.5.2 (unit test, test integrasi, dan *coverage* istanbul lewat `--coverage`), Supertest 7.3.1 (permintaan HTTP ke aplikasi Express), PostgreSQL 16 dan Mailpit sungguhan untuk test integrasi (`npm run test:db`), `psql` untuk inspeksi tabel, Playwright Core 1.56 dengan Google Chrome untuk menjalankan skenario use case dan mengambil tangkapan layar, serta `EXPLAIN ANALYZE` untuk profiling |

## 3.2 Implementasi Modul

Seluruh 45 kelas pada DPPL Tabel 4.1 sudah diimplementasikan. C31 Kategori dan C32 LokasiCOD digabung menjadi satu daftar tetap. Empat unit tambahan di bagian bawah tabel tidak ada di DPPL, tetapi ikut menyusun aplikasi dan sudah tercatat pada laporan Implementasi.

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | HalamanOtentikasi | `src/views/js/HalamanOtentikasi.js` | - |
| 2 | C02 | HalamanProfil | `src/views/js/HalamanProfil.js` | - |
| 3 | C03 | HalamanListingPenjual | `src/views/js/HalamanListingPenjual.js`, `src/views/js/ListingUI.js` | - |
| 4 | C04 | FormulirBarang | `src/views/js/FormulirBarang.js`, `src/views/js/DetailListingPenjual.js` | - |
| 5 | C05 | HalamanKatalog | `src/views/js/HalamanKatalog.js`, `src/views/js/layoutKatalog.js` | - |
| 6 | C06 | KartuProduk (Kartu listing pada Listing Saya dan profil dibuat `ListingUI.kartu` dan `HalamanProfil.buatKartu` (Implementasi B.1 No. 10)) | `src/views/js/KartuProduk.js` | - |
| 7 | C07 | HalamanDetailBarang | `src/views/js/HalamanDetailBarang.js` | - |
| 8 | C08 | HalamanPercakapan | `src/views/js/HalamanPercakapan.js` | - |
| 9 | C09 | PanelNotifikasi | `src/views/js/PanelNotifikasi.js`, `src/views/sw.js` | - |
| 10 | C10 | FormulirLaporan | `src/views/js/FormulirLaporan.js` | - |
| 11 | C11 | DasborAdmin | `src/views/js/DasborAdmin.js` | - |
| 12 | C12 | HalamanDokumenLegal | `src/views/js/HalamanDokumenLegal.js` | - |
| 13 | C13 | AkunController | `src/controllers/AkunController.js`, `src/routes/akunRoutes.js` | - |
| 14 | C14 | BarangController (Logika dipindah ke `ListingService` (Implementasi B.1 No. 16)) | `src/controllers/BarangController.js`, `src/routes/barangRoutes.js` | - |
| 15 | C15 | KatalogController | `src/controllers/KatalogController.js`, `src/routes/katalogRoutes.js` | - |
| 16 | C16 | PencarianController | `src/controllers/PencarianController.js` | - |
| 17 | C17 | FilterController | `src/controllers/FilterController.js` | - |
| 18 | C18 | PercakapanController | `src/controllers/PercakapanController.js`, `src/routes/percakapanRoutes.js` | - |
| 19 | C19 | NotifikasiController | `src/controllers/NotifikasiController.js`, `src/routes/notifikasiRoutes.js` | - |
| 20 | C20 | LaporanController | `src/controllers/LaporanController.js`, `src/routes/laporanRoutes.js` | - |
| 21 | C21 | ModerasiController | `src/controllers/ModerasiController.js`, `src/routes/moderasiRoutes.js` | - |
| 22 | C22 | DokumenLegalController | `src/controllers/DokumenLegalController.js`, `src/routes/dokumenLegalRoutes.js` | - |
| 23 | C23 | Akun | `src/models/Akun.js` | - |
| 24 | C24 | Pembeli | `src/models/Pembeli.js` | - |
| 25 | C25 | Penjual | `src/models/Penjual.js` | - |
| 26 | C26 | Admin | `src/models/Admin.js` | - |
| 27 | C27 | TokenVerifikasi | `src/models/TokenVerifikasi.js` | - |
| 28 | C28 | SesiLogin | `src/models/SesiLogin.js` | - |
| 29 | C29 | Barang (operasi listing pemilik diuji Modul B, operasi katalog diuji Modul C, operasi moderasi diuji Modul E) | `src/models/Barang.js`, `src/models/ListingPenjual.js` (`kunci`, `update`, `setStatus`) | - |
| 30 | C30 | FotoBarang | `src/models/FotoBarang.js`, `src/models/ListingPenjual.js` (`galeri`) | - |
| 31 | C31 | Kategori (Daftar tetap, digabung dengan C32 (Implementasi B.1 No. 19)) | `src/models/ReferensiListing.js` (`kategori`) | - |
| 32 | C32 | LokasiCOD (Daftar tetap, digabung dengan C31 (Implementasi B.1 No. 19)) | `src/models/ReferensiListing.js` (`lokasi`) | - |
| 33 | C33 | Percakapan | `src/models/Percakapan.js` | - |
| 34 | C34 | Pesan | `src/models/Pesan.js` | - |
| 35 | C35 | Notifikasi | `src/models/Notifikasi.js` | - |
| 36 | C36 | Laporan | `src/models/Laporan.js` | - |
| 37 | C37 | BuktiLaporan | `src/models/BuktiLaporan.js` | - |
| 38 | C38 | LogAudit | `src/models/LogAudit.js` | - |
| 39 | C39 | LogAdmin | `src/models/LogAdmin.js` | - |
| 40 | C40 | DokumenLegal | `src/models/DokumenLegal.js` | - |
| 41 | C41 | Otorisasi | `src/pendukung/Otorisasi.js` | - |
| 42 | C42 | Kriptografi | `src/pendukung/Kriptografi.js` | - |
| 43 | C43 | SurelAdapter | `src/integrasi/SurelAdapter.js` | - |
| 44 | C44 | PushNotifikasiAdapter | `src/integrasi/PushNotifikasiAdapter.js` | - |
| 45 | C45 | PenyimpananBerkas | `src/penyimpanan/PenyimpananBerkas.js` | - |
| 46 | - | ListingService (Aturan bisnis listing yang dipindah dari C14 (Implementasi B.1 No. 16)) | `src/services/ListingService.js` | - |
| 47 | - | ListingPenjual (Transaksi dan penguncian baris untuk C29 dan C30 (Implementasi B.1 No. 16, 18)) | `src/models/ListingPenjual.js` | - |
| 48 | - | LanggananPush (Langganan Web Push per peramban untuk C44 (Implementasi B.1 No. 27)) | `src/models/LanggananPush.js` | - |
| 49 | - | SsoController (Masuk dengan Google lewat OAuth 2.0 dan PKCE (Implementasi B.1 No. 41)) | `src/controllers/SsoController.js` | - |

## 3.3 Implementasi Antarmuka

Kelima belas layar pada DPPL sudah diimplementasikan. I-04 dan I-05 memakai halaman yang sama dengan kriteria pencarian pada *query string*. Dua halaman tambahan tercantum di bagian bawah tabel.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Masuk (*Login*) | `src/views/pages/masuk.html`, `src/views/js/HalamanOtentikasi.js`, `src/views/js/TombolSSO.js` | - |
| 2 | I-02 | Daftar Akun | `src/views/pages/daftar.html`, `src/views/js/HalamanOtentikasi.js` | - |
| 3 | I-03 | Verifikasi Surel | `src/views/pages/verifikasi.html`, `src/views/js/HalamanOtentikasi.js` | - |
| 4 | I-04 | Katalog | `src/views/pages/katalog.html`, `src/views/js/HalamanKatalog.js`, `src/views/js/KartuProduk.js` | - |
| 5 | I-05 | Hasil Pencarian dan Filter | `src/views/pages/katalog.html` dengan kriteria pada *query string*, `src/views/js/HalamanKatalog.js` | - |
| 6 | I-06 | Detail Barang | `src/views/pages/barang.html`, `src/views/js/HalamanDetailBarang.js` | - |
| 7 | I-07 | Formulir Listing | `src/views/pages/listing-form.html`, `src/views/js/FormulirBarang.js` | - |
| 8 | I-08 | Listing Saya | `src/views/pages/listing-saya.html`, `src/views/js/HalamanListingPenjual.js`, `src/views/js/ListingUI.js` | - |
| 9 | I-09 | Profil Akun | `src/views/pages/profil.html`, `src/views/js/HalamanProfil.js` | - |
| 10 | I-10 | Percakapan | `src/views/pages/percakapan.html`, `src/views/js/HalamanPercakapan.js` | - |
| 11 | I-11 | Panel Notifikasi | `src/views/js/PanelNotifikasi.js` (dipasang ke *topbar* setiap halaman) | - |
| 12 | I-12 | Formulir Laporan | `src/views/pages/laporan-form.html`, `src/views/pages/laporan.html` (pengalihan), `src/views/js/FormulirLaporan.js` | - |
| 13 | I-13 | Dasbor Admin: Daftar Laporan | `src/views/pages/admin-laporan.html`, `src/views/js/DasborAdmin.js` | - |
| 14 | I-14 | Dasbor Admin: Detail Laporan | `src/views/pages/admin-detail.html` (termasuk dialog konfirmasi moderasi), `src/views/js/DasborAdmin.js` | - |
| 15 | I-15 | Dokumen Legal | `src/views/pages/legal.html`, `src/views/js/HalamanDokumenLegal.js` | - |
| 16 | - | Detail Listing untuk Pemilik (Implementasi B.1 No. 21) | `src/views/pages/detail.html`, `src/views/js/DetailListingPenjual.js` | - |
| 17 | - | Lengkapi Data Akun Google (Implementasi B.1 No. 41) | `src/views/pages/lengkapi-sso.html`, `src/views/js/HalamanLengkapiSSO.js` | - |

## 3.4 File Lain

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `src/server.js` | Titik masuk aplikasi; menjalankan server Express pada `PORT` (bawaan 3000) |
| 2 | `src/app.js` | Menyusun aplikasi Express: route `/api/*`, penyajian berkas View, dan penanganan galat |
| 3 | `src/config/env.js` | Membaca seluruh variabel lingkungan di satu tempat, dengan nilai bawaan untuk variabel angka |
| 4 | `src/config/db.js` | *Pool* koneksi PostgreSQL; hanya dipakai kelas Model |
| 5 | `src/database/schema.sql` | Skema seluruh tabel dan indeks, aman dijalankan berulang |
| 6 | `src/database/init.js` | Menjalankan `schema.sql` (`npm run db:init`) |
| 7 | `src/database/seed.js` | Mengisi lima akun uji dan dokumen legal (`npm run db:seed`, `npm run db:seed-legal`) |
| 8 | `src/database/seedDokumenLegal.js` | Isi Kebijakan Privasi dan Ketentuan Penggunaan versi 1.0 |
| 9 | `src/routes/*.js` | Pemetaan HTTP ke Controller (41 endpoint `/api/*`); berkas route milik C13 sampai C22 juga tercantum pada Tabel 3.2 |
| 10 | `src/views/js/api.js`, `src/views/js/Kerangka.js` | Pemanggil API dengan token sesi, serta kerangka halaman (*topbar* dan *sidebar*) bersama |
| 11 | `src/views/css/*.css` | Token warna dan huruf (`tokens.css`) serta gaya komponen dan halaman |
| 12 | `src/views/ikon/*`, `src/views/favicon.*`, `src/views/*.png`, `src/views/site.webmanifest` | Logo ITBELI, favicon, dan ikon aplikasi web |
| 13 | `src/mockup/*` | Rancangan antarmuka statis I-01 sampai I-15 yang menjadi acuan tampilan |
| 14 | `src/docker-compose.yml` | PostgreSQL 16 dan Mailpit untuk menjalankan aplikasi secara lokal |
| 15 | `src/.env.example` | Daftar variabel lingkungan tanpa nilai rahasia |
| 16 | `src/package.json`, `src/package-lock.json` | Dependensi dan perintah `npm` (start, dev, test, db:init, db:seed, db:seed-legal) |
| 17 | `src/vercel.json`, `src/.vercelignore`, `src/scripts/salinStatis.js` | Konfigurasi deploy Vercel dan penyalinan berkas View ke `public/` |
| 18 | `src/tests/unit/*.test.js` | Test unit Jest (22 berkas) |
| 19 | `src/tests/integration/*.test.js` | Test API dengan Supertest (8 berkas); basis data diganti tiruan, sehingga tidak dihitung sebagai pengujian integrasi pada Subbab 4.3 |
| 20 | `src/tests/db/*.test.js`, `src/tests/db/siapkanBasisData.js`, `src/tests/db/lingkunganUji.js`, `src/jest.db.config.js` | Test integrasi dengan PostgreSQL, disk, dan Mailpit nyata (`npm run test:db`); basis data `itbeli_uji` dibuat ulang setiap putaran |
| 21 | `docs/M10/assets/bukti/*-modul-b.*`, `docs/M10/assets/bukti/modul-b.test.js` | Skrip dan konfigurasi pengujian Modul B, termasuk skrip peramban untuk tangkapan layar use case |
| 22 | `docs/M10/assets/skrip/tabel-uji-unit.js` | Menyusun baris Tabel 4.2 dari keluaran Jest |
| 23 | `docs/M9/assets/profiling/*` | Skrip pengisi data uji dan pengukuran katalog dari Tugas 9 |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

Pengujian dijalankan pada 15 November 2026 terhadap kode tag `v9.0` (`485af76`). Folder `src/` di luar `src/tests/`, `src/jest.db.config.js`, dan `src/package.json` (skrip `test:db`) tidak berubah sejak tag tersebut.

Pembagian pengujian mengikuti pembagian modul pada Tabel B.4 dokumen Implementasi (Tugas 9): Modul A Akun dan Otentikasi (UC01 sampai UC06), Modul B Listing Penjual (UC07 sampai UC12), Modul C Katalog dan Pencarian (UC13 sampai UC15), Modul D Percakapan dan Notifikasi (UC16 sampai UC18), dan Modul E Laporan dan Moderasi (UC19 sampai UC24).

Pengujian UC07–UC12 dilaksanakan pada 19 November 2026 terhadap kode produksi tag `v9.0` (`485af76`), menggunakan basis data uji `itbeli_modulb_20261119_uji`.

Pengujian unit Modul E dijalankan pada 15 November 2026 dan diulang pada 19 November 2026 setelah digabung dengan pekerjaan Modul A dan B. Test integrasi dan test use case Modul E dijalankan pada 19 November 2026, pertama terhadap kode tag `v9.0`, lalu diulang setelah perbaikan. Pengujian Modul E menemukan lima cacat. Bukti kegagalan pada `v9.0` disimpan lebih dulu, baru kemudian kodenya diperbaiki.

Tabel 4.0. Cacat Modul E yang Ditemukan Selama Pengujian

| No | Test case yang gagal pada `v9.0` | Cacat | Perbaikan | Commit |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C11-UT04, UC21-TC02 | `onClickUbahStatus` dan tiga cabang `konfirmasiTindakan` memanggil `this.memuatStatistik()`, padahal metodenya bernama `muatStatistik`. Status tersimpan di server, tetapi kartu statistik dan daftar di I-13 tidak diperbarui dan muncul TypeError | Keempat pemanggilan diganti dengan nama yang benar | `f8e7224` |
| 2 | UC23-TC01, C21-UT43, C11-UT07, C11-UT08 | Detail laporan tidak membawa akun yang dilaporkan, sehingga tombol "Blokir Akun" di I-14 mengirim ID pelapor. Pada pengujian, `pembeli.uji` (pelapor) yang terblokir, sedangkan `penjual.uji` tetap aktif | `getDetailLaporan` kini menyertakan `terlapor`, yaitu pemilik listing atau lawan bicara pelapor pada laporan percakapan, lewat operasi baru `cariAkunTerlapor`. Tombol memakai ID tersebut dan menampilkan galat bila terlapor tidak diketahui | `1711d55` |
| 3 | UC24-TC01 | Tombol "Buka Blokir" memakai sasaran yang sama dengan cacat 2, sehingga log admin mencatat BUKA_BLOKIR untuk pelapor | Ikut diperbaiki bersama cacat 2 | `1711d55` |
| 4 | UC20-TC03, C11-UT09 | Akun bukan admin yang membuka `/admin-laporan` dialihkan ke `/masuk`, padahal SKPL UC20 alternatif 1 meminta pengalihan ke beranda | `tampilkanAksesDitolak` mengalihkan ke `/` bila pengguna sudah masuk dan ke `/masuk` bila belum | `1711d55` |
| 5 | UC19-TC02 | Ruang percakapan (I-10) tidak punya tombol "Laporkan", sehingga laporan atas percakapan hanya dapat dibuat dengan mengetik alamat formulir | Tombol "Laporkan" ditambahkan di kepala ruang percakapan dan membuka `/laporan-form?objek=<idPercakapan>&jenis=Percakapan` | `05bb773` |

Perbaikan nomor 2 sampai 5 mengubah `src/controllers/ModerasiController.js`, `src/views/js/DasborAdmin.js`, `src/views/js/HalamanPercakapan.js`, dan `src/views/pages/percakapan.html`. Dua berkas terakhir milik Modul D, dan perubahannya hanya menambah satu tombol beserta satu metode yang mengisi alamatnya. Unit test C11-UT07 sampai C11-UT09 dan C21-UT43 ditulis setelah cacat ini ditemukan; keempatnya gagal pada kode `v9.0` dan lulus setelah perbaikan. Di luar berkas tersebut, kode yang diuji Modul E sama dengan `v9.0`.

Pengujian unit dan integrasi Modul C (C15, C16, C17, dan operasi katalog C29) dilaksanakan pada 19 November 2026 terhadap kode produksi tag `v9.0` (`485af76`); yang ditambahkan hanya berkas di `src/tests/`.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C01 | HalamanOtentikasi | Sedang | Memuat validasi formulir sisi klien (domain surel, NIM, kekuatan kata sandi, persetujuan kebijakan, panjang kode) sebelum memanggil API. Validasi yang menentukan tetap diulang di C13 | C01-UT01 s.d. C01-UT06, INT-TC12 |
| C02 | HalamanProfil | Tidak perlu | Hanya menampilkan hasil `GET /api/akun/profil` dan tautan Kebijakan Privasi, tanpa aturan bisnis | UC05-TC01, UC04-TC01 |
| C12 | HalamanDokumenLegal | Tidak perlu | Hanya merender judul, bagian, dan klausul dari `GET /api/dokumen-legal/:jenis` | UC06-TC01 |
| C13 | AkunController | Mendalam | Memuat validasi pendaftaran, pembuatan dan pemeriksaan kode verifikasi, aturan status akun saat login, serta pembuatan dan pencabutan sesi (Algo-002 s.d. Algo-006) | C13-UT01 s.d. C13-UT51, INT-TC01, INT-TC02, INT-TC05 s.d. INT-TC08, INT-TC12 |
| C22 | DokumenLegalController | Sedang | Mendelegasikan ke DokumenLegal, ditambah penyaringan jenis dokumen terhadap daftar tetap | C22-UT01 s.d. C22-UT05, INT-TC10 |
| C23 | Akun | Mendalam | Memuat aturan status (status blokir mengalahkan status verifikasi), normalisasi surel, serta perubahan status blokir dan verifikasi di basis data | C23-UT01 s.d. C23-UT21, INT-TC01, INT-TC02, INT-TC08 |
| C24 | Pembeli | Tidak perlu | Turunan C23 tanpa atribut dan operasi tambahan | - |
| C25 | Penjual | Sedang | Hanya satu kueri identitas publik (`getIdentitas`, Algo-027) tanpa aturan, dan belum dipanggil modul lain (B.5 M9) | C25-UT01, C25-UT02 |
| C26 | Admin | Mendalam | Keamanan: `verifikasiPeran` (Algo-028) menentukan akses seluruh fungsi moderasi (KF56) | C26-UT01 s.d. C26-UT03, INT-TC09 |
| C27 | TokenVerifikasi | Mendalam | Memuat aturan kecocokan kode, batas waktu 15 menit, dan perubahan status pakai Aktif, Terpakai, dan Hangus | C27-UT01 s.d. C27-UT11, INT-TC01, INT-TC05, INT-TC06 |
| C28 | SesiLogin | Mendalam | Keamanan: pembangkitan token sesi, masa berlaku 24 jam, dan pencabutan sesi | C28-UT01 s.d. C28-UT08, INT-TC07, INT-TC08 |
| C40 | DokumenLegal | Sedang | Kueri versi terbaru yang terbit dan berlaku, selebihnya *getter* atribut | C40-UT01 s.d. C40-UT03, INT-TC10 |
| C41 | Otorisasi | Mendalam | Keamanan: pemeriksaan token sesi dan peran admin untuk seluruh *endpoint* yang memerlukan login (Algo-064, Algo-065) | C41-UT01 s.d. C41-UT13, INT-TC07 s.d. INT-TC09 |
| C42 | Kriptografi (bagian `hash` dan `cocokkanHash`) | Mendalam | Keamanan: hash bcrypt kata sandi (Algo-066, Algo-067). Bagian AES-256-GCM diklasifikasikan oleh Modul D | C42-UT01 s.d. C42-UT04, KNF03-TC02 |
| C43 | SurelAdapter | Mendalam | Integrasi eksternal ke server SMTP, termasuk penanganan kegagalan kirim | C43-UT01 s.d. C43-UT04, INT-TC03, INT-TC04 |
| SSO (tanpa ID DPPL) | SsoController | Mendalam | Kelas tambahan B.1 No. 41. Keamanan dan integrasi eksternal: OAuth 2.0 dengan PKCE, pemeriksaan *state*, klaim `id_token`, domain surel, dan *cookie* bertanda tangan HMAC | SSO-UT01 s.d. SSO-UT30, INT-TC11 |
| C03 | HalamanListingPenjual | Sedang | Mengoordinasikan pemuatan daftar, pengelompokan tab, dialog konfirmasi, dan penerusan aksi hapus/status | C03-UT01 s.d. C03-UT03; UC08-TC01; UC10-TC01 s.d. UC12-TC03 |
| C04 | FormulirBarang | Mendalam | Validasi isian/foto sisi klien, batas 1–5 foto dan 5 MB, pengurutan foto, serta pengiriman formulir | C04-UT01 s.d. C04-UT06; UC07-TC01 s.d. UC07-TC03; UC09-TC01 s.d. UC09-TC04 |
| C06 | KartuProduk | Tidak perlu | Objek View dengan satu fungsi `KartuProduk.buat(barang)` yang hanya merakit kartu katalog (foto utama, harga, judul, lokasi COD, kategori, nama penjual) dan tautan ke detail, tanpa aturan bisnis (M9 B.5). Kartu pada Listing Saya dibuat `ListingUI.kartu`, bukan C06 (M9 B.1 No. 10) | UC13-TC01, UC14-TC01 |
| C14 | BarangController | Mendalam | Validasi server, kepemilikan, penyimpanan/pengubahan/penghapusan, serta aturan transisi status | C14-UT01 s.d. C14-UT18; INT-TC13 s.d. INT-TC23 |
| C29 | Barang | Mendalam | Query listing pemilik, transaksi, penguncian baris, dan pembaruan status atomik. Operasi katalog umum dan moderasi tetap menjadi bagian modul terkait. Modul E menguji perubahan status massal saat akun diblokir dan dipulihkan | C29-UT01 s.d. C29-UT04; INT-TC13 s.d. INT-TC23; C29-UT05 s.d. C29-UT16 (Modul E); INT-TC27, INT-TC29 |
| C30 | FotoBarang | Mendalam | Batas ukuran/format, metadata foto, urutan galeri, dan penghapusan metadata. Modul E menambah kasus batas dan negatif validasi | C30-UT01 s.d. C30-UT03; INT-TC13, INT-TC15, INT-TC21, INT-TC23; C30-UT04 s.d. C30-UT10 (Modul E); INT-TC30 |
| C31 | Kategori | Sedang | Pada implementasi menjadi daftar tetap `ReferensiListing.kategori`; validasi keanggotaan didelegasikan ke `validasiData` (M9 B.1 No. 19) | C31-UT01, C14-UT03, UC07-TC01 |
| C32 | LokasiCOD | Sedang | Pada implementasi menjadi daftar tetap `ReferensiListing.lokasi`; validasi keanggotaan didelegasikan ke `validasiData` (M9 B.1 No. 19) | C32-UT01, C14-UT03, UC07-TC01 |
| C45 | PenyimpananBerkas | Mendalam | Menulis dan menghapus berkas foto; merupakan komponen bersama. Bukti Modul B saat ini mencakup integrasi disk lokal, belum unit/coverage kelas lengkap atau integrasi Blob nyata. Unit test dan coverage kelas, termasuk mode Vercel Blob, dilengkapi Modul E pada Subbab 4.2.29 | C14-UT12; INT-TC13, INT-TC21, INT-TC23; C45-UT01 s.d. C45-UT06, 8 test mode Vercel Blob (`PenyimpananBerkasBlob.test.js`); INT-TC24, INT-TC30, INT-TC31, INT-TC32 |
| C10 | FormulirLaporan | Sedang | Mengoordinasikan formulir I-12 dan memanggil `POST /api/laporan`. Validasi isian dan bukti di sisi klien hanya mempercepat umpan balik; aturan yang mengikat diulang di C20 | C10-UT01 sampai C10-UT08, UC19-TC01 sampai UC19-TC04 |
| C11 | DasborAdmin | Sedang | Mengoordinasikan tampilan I-13 dan I-14 serta memanggil `/api/admin/*`. Satu-satunya aturan, urutan status, sama dengan aturan di C36 yang diuji mendalam | C11-UT01 sampai C11-UT09, UC20-TC01 sampai UC24-TC01 |
| C20 | LaporanController | Mendalam | Validasi data dan bukti laporan (KF43, KF44), privasi laporan percakapan (KF37), dan transaksi Algo-021 | C20-UT01 sampai C20-UT23, INT-TC24, INT-TC25 |
| C21 | ModerasiController | Mendalam | Otorisasi admin (KF56), aturan urutan status, serta transaksi Algo-022, Algo-023, dan Algo-024 | C21-UT01 sampai C21-UT45, INT-TC26 sampai INT-TC31, INT-TC33, INT-TC34 |
| C36 | Laporan | Mendalam | Aturan transisi status penanganan (KF47) dan statistik per status | C36-UT01 sampai C36-UT13, INT-TC26 |
| C37 | BuktiLaporan | Mendalam | Validasi lampiran wajib Algo-056 (KF44) | C37-UT01 sampai C37-UT07, INT-TC24 |
| C38 | LogAudit | Sedang | Hanya menyusun kueri INSERT tanpa aturan. Sifat hanya-tambah (KF49) dibuktikan lewat ketiadaan operasi ubah dan hapus | C38-UT01 sampai C38-UT05, KNF02-TC02, KNF02-TC03 |
| C39 | LogAdmin | Sedang | Hanya menyusun kueri INSERT dan SELECT tanpa aturan | C39-UT01 sampai C39-UT06, KNF02-TC01 |
| C15 | KatalogController | Mendalam | Alur inti UC13 s.d. UC15: menyusun kriteria dari C16 dan C17, menghitung total halaman (KF28), memberi pesan hasil kosong (KF29), galat 404 pada detail, dan penanda `milikSendiri` (Algo-013) | C15-UT01 s.d. C15-UT11, INT-TC35 s.d. INT-TC45 |
| C16 | PencarianController | Mendalam | Mengolah masukan bebas pengguna: normalisasi NFKC, huruf kecil, perapian spasi, batas 100 karakter dan 5 kata (KF25, Algo-014) | C16-UT01 s.d. C16-UT11, INT-TC37 |
| C17 | FilterController | Mendalam | Gerbang validasi seluruh parameter katalog (harga, kategori, lokasi, urutan, halaman) dan perhitungan offset paginasi (KF26 s.d. KF28, Algo-015) | C17-UT01 s.d. C17-UT14, INT-TC38, INT-TC39, INT-TC41, INT-TC45 |
| C29 (operasi katalog) | Barang: `getKatalog`, `getDetailKatalog` | Mendalam | SQL dinamis berparameter, peloloskan pola `ILIKE`, klausa urutan dari daftar tetap, serta aturan hanya listing "Tersedia" milik akun tidak diblokir (KF17, KF25 s.d. KF30, Algo-032). Operasi C29 lainnya diklasifikasikan Modul B | C29-UT17 s.d. C29-UT27, INT-TC35 s.d. INT-TC43 |
| C05 | HalamanKatalog | Sedang | Memuat validasi rentang harga sisi klien, penyimpanan kriteria di URL, dan pemilihan keadaan kosong; aturan yang menentukan tetap divalidasi ulang di C17 | C05-UT01 s.d. C05-UT06; UC13-TC01, UC13-TC02, UC14-TC01 s.d. UC14-TC03 |
| C07 | HalamanDetailBarang | Sedang | Memilih tombol aksi menurut pemilik dan status listing, serta menolak ID listing yang bukan UUID sebelum memanggil API | C07-UT01 s.d. C07-UT05; UC15-TC01 s.d. UC15-TC04 |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: `cd src && npm test`. Test integrasi dengan komponen nyata pada Subbab 4.3 dijalankan terpisah dengan `cd src && docker compose up -d && npm run test:db`. *Coverage* diukur dengan `npx jest --runInBand --coverage`.

Lokasi file test: `src/tests/unit/` (unit test), `src/tests/integration/` (test API dengan Supertest; kueri basis data diganti tiruan), dan `src/tests/db/` (test integrasi dengan PostgreSQL dan Mailpit sungguhan). Setiap nama test diawali ID pengujiannya. Untuk test berparameter (`test.each`), satu ID mencakup seluruh masukan pada barisnya.

### 4.2.1 Kelas HalamanOtentikasi

**ID Kelas:** C01  
**Nama Kelas:** HalamanOtentikasi  
**Tingkat:** Sedang

Skrip View dijalankan di konteks `vm` Node.js dengan DOM, `Api`, dan penyimpanan peramban tiruan (`src/tests/unit/HalamanOtentikasi.test.js`).

Tabel 4.2.1. Hasil Pengujian Unit Kelas C01

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C01-UT01 | `kirimFormulirPendaftaran(nama, nim, email, kataSandi, setujuKebijakan): void` | Normal | "Mahasiswa Uji", "13599999", "uji@itb.ac.id", "rahasia123", `true`; API membalas sukses | `POST /api/akun/daftar` dipanggil dengan kelima isian, lalu diarahkan ke `/verifikasi?email=uji%40itb.ac.id` | API dipanggil dengan isian yang sama dan alamat berubah ke `/verifikasi?email=uji%40itb.ac.id` | Pass |
| C01-UT02 | `kirimFormulirPendaftaran(...)` | Negatif | Surel "uji@gmail.com", NIM "135ab", kata sandi "pendek1" | API tidak dipanggil; galat tampil di isian surel, NIM, dan kata sandi | API tidak dipanggil; ketiga galat isian tampil sesuai pesannya | Pass |
| C01-UT03 | `kirimFormulirPendaftaran(...)` | Negatif | Isian valid, `setujuKebijakan = false` | API tidak dipanggil; pesan "Anda harus menyetujui Kebijakan Privasi dan Ketentuan Penggunaan." | API tidak dipanggil; pesan tersebut tampil | Pass |
| C01-UT04 | `kirimFormulirLogin(email, kataSandi): void` | Normal | "uji@itb.ac.id", "rahasia123"; API membalas token "tkn" | Sesi disimpan (`Api.simpanSesi`) dan diarahkan ke beranda `/` | `simpanSesi("tkn", "Pengguna", "uji@itb.ac.id")` dipanggil dan alamat menjadi `/` | Pass |
| C01-UT05 | `kirimFormulirLogin(...)` | Negatif | "uji@gmail.com" | API tidak dipanggil; pesan domain ITB tampil | API tidak dipanggil; pesan memuat "itb.ac.id" | Pass |
| C01-UT06 | `kirimKodeVerifikasi(email, kode): void` | Batas | Kode "12345" (5 digit) | API tidak dipanggil; pesan "Masukkan 6 digit kode verifikasi." | API tidak dipanggil; pesan tersebut tampil | Pass |

### 4.2.2 Kelas AkunController

**ID Kelas:** C13  
**Nama Kelas:** AkunController  
**Tingkat:** Mendalam

Model, Kriptografi, dan NotifikasiController diganti tiruan (`jest.spyOn`) agar setiap aturan diuji terpisah (`src/tests/unit/AkunController.test.js`).

Tabel 4.2.2. Hasil Pengujian Unit Kelas C13

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C13-UT01 | `validasiDomainEmail(email): Boolean` | Normal | "uji@itb.ac.id", "uji@mahasiswa.itb.ac.id", "13525034@std.stei.itb.ac.id" | `true` | `true` untuk ketiga masukan | Pass |
| C13-UT02 | `validasiDomainEmail(email)` | Batas | "UJI@ITB.AC.ID", "␣␣uji@itb.ac.id␣␣", "uji@MAHASISWA.ITB.AC.ID", "uji@sub-domain.itb.ac.id" | `true` | `true` untuk keempat masukan | Pass |
| C13-UT03 | `validasiDomainEmail(email)` | Negatif | 13 masukan: @gmail.com, @itb.ac.id.com, @itb.ac.id.palsu.com, @bukanitb.ac.id, @itbxac.id, @.itb.ac.id, @mahasiswa..itb.ac.id, @-mahasiswa.itb.ac.id, uji@itb.ac.id@gmail.com, "@itb.ac.id", "", `null`, 12345 | `false` | `false` untuk ke-13 masukan | Pass |
| C13-UT04 | `validasiKelengkapanFormulir(...): Boolean` | Normal | Semua isian terisi, kebijakan disetujui | `true` | `true` | Pass |
| C13-UT05 | `validasiKelengkapanFormulir(...)` | Batas | Nama "", NIM berisi spasi saja, kata sandi `undefined` | `false` | `false` untuk ketiganya | Pass |
| C13-UT06 | `validasiKelengkapanFormulir(...)` | Negatif | Semua terisi, `setujuKebijakan = false` | `false` | `false` | Pass |
| C13-UT07 | `daftarAkun(nama, nim, email, kataSandi, setujuKebijakan): Boolean` | Normal | " Mahasiswa Uji ", "13599999", "Uji@ITB.ac.id", "rahasia123", `true` | `{ berhasil: true, email: "uji@itb.ac.id", surelTerkirim: true }`; akun disimpan "Belum Terverifikasi" dengan hash; kata sandi asli tidak diteruskan ke Model; kode 6 digit berlaku 15 menit dikirim | Sesuai seluruhnya; argumen `Akun.simpan` tidak memuat "rahasia123" dan selisih kedaluwarsa token tepat 15 menit | Pass |
| C13-UT08 | `daftarAkun(...)` | Batas | Surel subdomain "uji@mahasiswa.itb.ac.id" dan "13525034@std.stei.itb.ac.id" | Pendaftaran berhasil | `berhasil: true` untuk keduanya | Pass |
| C13-UT09 | `daftarAkun(...)` | Negatif | `setujuKebijakan = false` | `KEBIJAKAN_BELUM_DISETUJUI`, `Akun.simpan` tidak dipanggil | Sesuai | Pass |
| C13-UT10 | `daftarAkun(...)` | Negatif | Nama berisi spasi saja | `FORMULIR_TIDAK_LENGKAP` | `FORMULIR_TIDAK_LENGKAP` | Pass |
| C13-UT11 | `daftarAkun(...)` | Negatif | "uji@gmail.com" | `DOMAIN_TIDAK_VALID` | `DOMAIN_TIDAK_VALID` | Pass |
| C13-UT12 | `daftarAkun(...)` | Negatif | "uji@itb.ac.id.palsu.com" | `DOMAIN_TIDAK_VALID` | `DOMAIN_TIDAK_VALID` | Pass |
| C13-UT13 | `daftarAkun(...)` | Negatif | NIM "135ab" | `NIM_TIDAK_VALID` | `NIM_TIDAK_VALID` | Pass |
| C13-UT14 | `daftarAkun(...)` | Batas | Kata sandi "pendek1" (7 karakter), "hanyahuruf", "12345678" | `KATA_SANDI_LEMAH` | `KATA_SANDI_LEMAH` untuk ketiganya | Pass |
| C13-UT15 | `daftarAkun(...)` | Negatif | Surel sudah dimiliki akun lain | `SUREL_TERDAFTAR`, `Akun.simpan` tidak dipanggil | Sesuai | Pass |
| C13-UT16 | `daftarAkun(...)` | Batas | Pengiriman surel gagal | Akun tetap dibuat, `surelTerkirim: false` | `berhasil: true, surelTerkirim: false` | Pass |
| C13-UT17 | `daftarAkun(...)` | Batas | `Akun.simpan` melempar galat kode `23505` (dua pendaftaran bersamaan) | `SUREL_TERDAFTAR` | `SUREL_TERDAFTAR` | Pass |
| C13-UT18 | `daftarAkun(...)` | Negatif | `Akun.simpan` melempar galat lain (kode `08006`, koneksi putus) | Galat diteruskan ke pemanggil | *Promise* ditolak dengan pesan "koneksi putus" | Pass |
| C13-UT19 | `verifikasiAkun(email, kode): Boolean` | Normal | Akun "Belum Terverifikasi", kode " 123456 " cocok dan belum kedaluwarsa | `berhasil: true`; token ditandai terpakai; status menjadi "Terverifikasi" | `{ berhasil: true, idAkun: "akun-1", peran: "Pengguna" }`; `tandaiTerpakai` dan `perbaruiStatusAkun("Terverifikasi")` dipanggil | Pass |
| C13-UT20 | `verifikasiAkun(...)` | Negatif | Kode "" | `KODE_KOSONG` | `KODE_KOSONG` | Pass |
| C13-UT21 | `verifikasiAkun(...)` | Negatif | Surel tidak terdaftar | `AKUN_TIDAK_DITEMUKAN` | `AKUN_TIDAK_DITEMUKAN` | Pass |
| C13-UT22 | `verifikasiAkun(...)` | Negatif | Akun sudah "Terverifikasi" | `SUDAH_TERVERIFIKASI` | `SUDAH_TERVERIFIKASI` | Pass |
| C13-UT23 | `verifikasiAkun(...)` | Negatif | Akun diblokir | `AKUN_DIBLOKIR` | `AKUN_DIBLOKIR` | Pass |
| C13-UT24 | `verifikasiAkun(...)` | Negatif | Tidak ada token aktif | `KODE_TIDAK_ADA` | `KODE_TIDAK_ADA` | Pass |
| C13-UT25 | `verifikasiAkun(...)` | Negatif | Kode "654321" tidak cocok | `KODE_SALAH`, status akun tidak diubah | Sesuai; `perbaruiStatusAkun` tidak dipanggil | Pass |
| C13-UT26 | `verifikasiAkun(...)` | Batas | Kode cocok, kedaluwarsa 1 menit lalu | `KODE_KEDALUWARSA` | `KODE_KEDALUWARSA` | Pass |
| C13-UT27 | `kirimUlangKode(email): Boolean` | Normal | Akun "Belum Terverifikasi" dengan dua token aktif lama | Kedua token lama hangus, satu token baru dibuat dan dikirim, `berhasil: true` | `tandaiHangus` dipanggil pada kedua token, `TokenVerifikasi.simpan` sekali, surel berisi kode baru | Pass |
| C13-UT28 | `kirimUlangKode(email)` | Negatif | Surel tidak terdaftar | `AKUN_TIDAK_DITEMUKAN` | `AKUN_TIDAK_DITEMUKAN` | Pass |
| C13-UT29 | `kirimUlangKode(email)` | Negatif | Akun sudah terverifikasi | `SUDAH_TERVERIFIKASI` | `SUDAH_TERVERIFIKASI` | Pass |
| C13-UT30 | `kirimUlangKode(email)` | Negatif | SMTP gagal | `GAGAL_KIRIM_SUREL` | `GAGAL_KIRIM_SUREL` | Pass |
| C13-UT31 | `login(email, kataSandi): Map<String, Any>` | Normal | Kredensial benar, akun Admin terverifikasi | `berhasil: true`, token 64 karakter hex, peran "Admin", sesi berlaku 24 jam | Sesuai; selisih `waktuKedaluwarsa - waktuMulai` = 24 jam | Pass |
| C13-UT32 | `login(...)` | Batas | ("", "rahasia123"), ("uji@itb.ac.id", ""), (123, "rahasia123"), (`undefined`, `undefined`) | `ISIAN_KOSONG` | `ISIAN_KOSONG` untuk keempatnya | Pass |
| C13-UT33 | `login(...)` | Negatif | Surel tidak terdaftar | `KREDENSIAL_SALAH` | `KREDENSIAL_SALAH` | Pass |
| C13-UT34 | `login(...)` | Negatif | Kata sandi salah | `KREDENSIAL_SALAH` dengan pesan yang sama seperti surel tidak terdaftar | "Surel atau kata sandi salah." | Pass |
| C13-UT35 | `login(...)` | Negatif | Akun "Belum Terverifikasi" | `BELUM_TERVERIFIKASI` | `BELUM_TERVERIFIKASI` | Pass |
| C13-UT36 | `login(...)` | Negatif | Akun diblokir | `AKUN_DIBLOKIR`, sesi tidak dibuat | Sesuai; `SesiLogin.simpan` tidak dipanggil | Pass |
| C13-UT37 | `logout(token): Boolean` | Normal | Token sesi valid | `true`, sesi dinonaktifkan | `true`; `SesiLogin.nonaktifkan("tkn")` dipanggil | Pass |
| C13-UT38 | `logout(token)` | Negatif | Token tidak valid | `false`, tidak ada sesi yang dicabut | Sesuai | Pass |
| C13-UT39 | `getProfil(token): Map<String, Any>` | Normal | Token valid milik akun dengan satu listing | Nama, NIM, surel, status, peran, dan daftar listing; tanpa `kataSandiHash` | Sesuai; `Barang.getListingPenjual("akun-1")` dipanggil | Pass |
| C13-UT40 | `getProfil(token)` | Negatif | Token tidak valid | `null` | `null` | Pass |
| C13-UT41 | `getTautanDokumenLegal(): String` | Normal | Kebijakan Privasi berlaku tersedia | "/legal?jenis=kebijakan-privasi" | Sesuai | Pass |
| C13-UT42 | `getTautanDokumenLegal()` | Negatif | Belum ada dokumen berlaku | `null` | `null` | Pass |
| C13-UT43 | `buatKodeVerifikasi(idAkun): String` | Batas | Bilangan acak 42 | Kode "000042" (nol di depan dipertahankan), status "Aktif", berlaku 15 menit | Sesuai | Pass |
| C13-UT44 | `hanguskanKodeLama(idAkun): void` | Batas | Tidak ada token aktif | Tidak ada token yang dihanguskan | `tandaiHangus` tidak dipanggil | Pass |
| C13-UT45 | `cekStatusAkun(idAkun): String` | Normal, Negatif | Akun terverifikasi; akun diblokir; akun tidak ada | "Terverifikasi"; "Diblokir"; `null` | Sesuai | Pass |
| C13-UT46 | `getIdAkunDariSesi(token): String` | Normal, Negatif | Token valid; token tidak valid | "akun-1"; `null` | Sesuai | Pass |
| C13-UT47 | `masukDenganSso(email)` | Normal | Surel belum terdaftar | `{ berhasil: true, akunBaru: true }`, tanpa sesi | Sesuai | Pass |
| C13-UT48 | `masukDenganSso(email)` | Batas | Akun "Belum Terverifikasi" | Akun diverifikasi, hash kata sandi lama diganti, sesi dibuat | Sesuai | Pass |
| C13-UT49 | `masukDenganSso(email)` | Negatif | Akun diblokir; akun Admin | `AKUN_DIBLOKIR`; `SSO_ADMIN_DILARANG`; tanpa sesi | Sesuai | Pass |
| C13-UT50 | `daftarAkunSso(nama, nim, email, setujuKebijakan)` | Normal | "Budi", "13500001", "budi@itb.ac.id", `true` | Akun "Terverifikasi" dengan kata sandi acak 64 hex, peran "Pengguna" | Sesuai | Pass |
| C13-UT51 | `daftarAkunSso(...)` | Negatif | Kebijakan tidak disetujui; NIM kosong; NIM "135ab"; surel gmail.com | `KEBIJAKAN_BELUM_DISETUJUI`; `FORMULIR_TIDAK_LENGKAP`; `NIM_TIDAK_VALID`; `DOMAIN_TIDAK_VALID` | Sesuai; `Akun.simpan` tidak dipanggil | Pass |

Tabel 4.2.2b. Ringkasan Cakupan Kelas C13

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `daftarAkun()`, `validasiKelengkapanFormulir()`, `validasiDomainEmail()`, `cekKeunikanEmail()`, `hashKataSandi()`, `buatKodeVerifikasi()`, `getTautanDokumenLegal()`, `verifikasiAkun()`, `validasiKodeVerifikasi()`, `cekKedaluwarsaKode()`, `hanguskanKodeLama()`, `kirimUlangKode()`, `login()`, `cariAkunByEmail()`, `verifikasiKataSandi()`, `cekStatusAkun()`, `buatSesiLogin()`, `logout()`, `cabutSesi()`, `getProfil()`, `getIdAkunDariSesi()`, `getDaftarBarangAkun()`, ditambah `masukDenganSso()` dan `daftarAkunSso()` (B.1 No. 41) |
| Operasi yang diuji | Seluruhnya. Diuji langsung: `daftarAkun`, `validasiKelengkapanFormulir`, `validasiDomainEmail`, `buatKodeVerifikasi`, `getTautanDokumenLegal`, `verifikasiAkun`, `hanguskanKodeLama`, `kirimUlangKode`, `login`, `cekStatusAkun`, `logout`, `getProfil`, `getIdAkunDariSesi`, `masukDenganSso`, `daftarAkunSso`. Diuji melalui operasi pemanggilnya: `cekKeunikanEmail` dan `hashKataSandi` (C13-UT07, UT15), `validasiKodeVerifikasi` dan `cekKedaluwarsaKode` (C13-UT19, UT25, UT26), `cariAkunByEmail`, `verifikasiKataSandi`, dan `buatSesiLogin` (C13-UT31 s.d. UT36), `cabutSesi` (C13-UT37), `getDaftarBarangAkun` (C13-UT39) |
| ID Algoritma yang tercakup | Algo-002, Algo-003, Algo-004, Algo-005, Algo-006 |
| Coverage (wajib ≥ 70%) | 98,34% baris / 94,5% cabang (pernyataan 96,1%, fungsi 100%), Jest `--coverage`; bukti `coverage-modul-a.txt` pada 4.6 |

### 4.2.3 Kelas DokumenLegalController

**ID Kelas:** C22  
**Nama Kelas:** DokumenLegalController  
**Tingkat:** Sedang

Tabel 4.2.3. Hasil Pengujian Unit Kelas C22

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | `getDokumen(jenis): DokumenLegal` | Normal | "kebijakan-privasi", "ketentuan-penggunaan" | Jenis diteruskan ke `DokumenLegal.getVersiTerbaru` | Diteruskan untuk kedua jenis | Pass |
| C22-UT02 | `getDokumen(jenis)` | Negatif | "kebijakan-rahasia", "../../etc", "", `undefined`, "kebijakan-privasi' OR '1'='1" | `null` tanpa kueri ke basis data | `null`; `getVersiTerbaru` tidak dipanggil untuk kelima masukan | Pass |
| C22-UT03 | `getDokumen(jenis)` | Negatif | Jenis valid, belum ada versi berlaku | `null` | `null` | Pass |
| C22-UT04 | `getKlausaPrivasi(): String` | Normal | Kebijakan Privasi berlaku memuat klausul | Teks klausul privasi percakapan | Sesuai | Pass |
| C22-UT05 | `getKlausaPrivasi()` | Negatif | Kebijakan Privasi belum tersedia | `null` | `null` | Pass |

### 4.2.4 Kelas Akun

**ID Kelas:** C23  
**Nama Kelas:** Akun  
**Tingkat:** Mendalam

Kueri `db.query` diganti tiruan untuk memeriksa SQL, parameter, dan pemetaan hasil (`src/tests/unit/ModelAkun.test.js`). Perilaku SQL terhadap PostgreSQL sungguhan diuji pada INT-TC01, INT-TC02, dan INT-TC08.

Tabel 4.2.4. Hasil Pengujian Unit Kelas C23

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C23-UT01 | `simpan(nama, nim, email, kataSandiHash, statusAkun, setujuKebijakan): String` | Normal | Surel " Uji@ITB.ac.id " | UUID baru; surel disimpan "uji@itb.ac.id"; peran "Pengguna" | UUID 36 karakter; parameter kueri sesuai | Pass |
| C23-UT02 | `simpan(...)` | Negatif | Basis data melempar galat `23505` | Galat diteruskan ke pemanggil | Ditolak dengan `code: "23505"` | Pass |
| C23-UT03 | `cariByEmail(email): Akun` | Normal | Basis data mengembalikan satu baris | Objek `Akun` dengan atribut terpetakan | Sesuai | Pass |
| C23-UT04 | `cariByEmail(email)` | Batas | "␣␣Uji@ITB.ac.id␣" | Kueri `LOWER(email) = LOWER($1)` dengan surel yang sudah di-*trim* | Sesuai | Pass |
| C23-UT05 | `cariByEmail(email)` | Negatif | Surel tidak terdaftar | `null` | `null` | Pass |
| C23-UT06 | `cariById(idAkun): Akun` | Normal | "akun-1" | Objek `Akun` milik "akun-1" | Sesuai | Pass |
| C23-UT07 | `cariById(idAkun)` | Negatif | ID tidak ada | `null` | `null` | Pass |
| C23-UT08 | `perbaruiStatusAkun(status): Boolean` | Normal | "Terverifikasi", 1 baris diperbarui | `true`, atribut objek berubah | Sesuai | Pass |
| C23-UT09 | `perbaruiStatusAkun(status)` | Negatif | 0 baris diperbarui | `false`, atribut tetap | Sesuai | Pass |
| C23-UT10 | `getStatusAkun(): String` | Normal | Tidak diblokir, status "Terverifikasi" / "Belum Terverifikasi" | Status apa adanya | Sesuai | Pass |
| C23-UT11 | `getStatusAkun()` | Batas | Status "Terverifikasi" tetapi `statusBlokir = true` | "Diblokir" | "Diblokir" | Pass |
| C23-UT12 | `getDataIdentitas(): Map<String, String>` | Normal | Objek dengan hash dan peran | Hanya nama, surel, dan NIM | Sesuai | Pass |
| C23-UT13 | `getSyaratTidakDiblokir(): Map<String, Any>` | Normal | - | `{ statusBlokir: false }` | Sesuai | Pass |
| C23-UT14 | `getStatusBlokir(idAkun): Boolean` | Normal | Akun diblokir | `true` | `true` | Pass |
| C23-UT15 | `getStatusBlokir(idAkun)` | Negatif | Akun aktif; akun tidak ada | `false`; `false` | Sesuai | Pass |
| C23-UT16 | `blokir(): Boolean` | Normal | Klien transaksi diberikan, 1 baris diperbarui | `true`; status "Diblokir"; kueri lewat klien transaksi, bukan *pool* | Sesuai | Pass |
| C23-UT17 | `blokir()` | Negatif | 0 baris diperbarui | `false`, atribut tetap | Sesuai | Pass |
| C23-UT18 | `bukaBlokir(): Boolean` | Normal | 1 baris diperbarui | `true`; status "Terverifikasi", `statusBlokir = false` | Sesuai | Pass |
| C23-UT19 | `bukaBlokir()` | Negatif | 0 baris diperbarui | `false`, atribut tetap | Sesuai | Pass |
| C23-UT20 | `perbaruiKataSandiHash(hash)` (B.1 No. 41) | Normal | Hash baru, 1 baris diperbarui | `true`, atribut berubah | Sesuai | Pass |
| C23-UT21 | `perbaruiKataSandiHash(hash)` | Negatif | 0 baris diperbarui | `false`, atribut tetap | Sesuai | Pass |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C23

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan()`, `cariByEmail()`, `cariById()`, `perbaruiStatusAkun()`, `getStatusAkun()`, `getDataIdentitas()`, `getSyaratTidakDiblokir()`, `getStatusBlokir()`, `blokir()`, `bukaBlokir()`, ditambah `perbaruiKataSandiHash()` |
| Operasi yang diuji | Seluruhnya |
| ID Algoritma yang tercakup | Algo-025, Algo-026 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang (sebelumnya 54,2% / 16,7%); bukti `coverage-modul-a.txt` |

### 4.2.5 Kelas Penjual

**ID Kelas:** C25  
**Nama Kelas:** Penjual  
**Tingkat:** Sedang

Tabel 4.2.5. Hasil Pengujian Unit Kelas C25

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C25-UT01 | `getIdentitas(idPenjual): Map<String, Any>` | Normal | "akun-1" ada | `{ idPenjual, namaPenjual, emailPenjual, statusVerifikasi }` | Sesuai | Pass |
| C25-UT02 | `getIdentitas(idPenjual)` | Negatif | ID tidak ada | `null` | `null` | Pass |

### 4.2.6 Kelas Admin

**ID Kelas:** C26  
**Nama Kelas:** Admin  
**Tingkat:** Mendalam

Tabel 4.2.6. Hasil Pengujian Unit Kelas C26

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C26-UT01 | `verifikasiPeran(idAkun): Boolean` | Normal | Kueri menghitung 1 akun | `true`; kueri menyaring `peran = 'Admin'` dan `status_blokir = false` | Sesuai | Pass |
| C26-UT02 | `verifikasiPeran(idAkun)` | Negatif | Kueri menghitung 0 akun (pengguna biasa, admin diblokir, atau ID tidak ada) | `false` | `false` | Pass |
| C26-UT03 | Pewarisan dari C23 | Batas | `Admin.dariBaris` dengan peran "Admin" | Objek `Admin` sekaligus `Akun`, operasi C23 dapat dipakai | Sesuai | Pass |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C26

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `verifikasiPeran()` |
| Operasi yang diuji | `verifikasiPeran()`; kasus admin diblokir dan pengguna biasa terhadap tabel sungguhan diuji pada INT-TC09 |
| ID Algoritma yang tercakup | Algo-028 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang (sebelumnya 60,0%); bukti `coverage-modul-a.txt` |

### 4.2.7 Kelas TokenVerifikasi

**ID Kelas:** C27  
**Nama Kelas:** TokenVerifikasi  
**Tingkat:** Mendalam

Tabel 4.2.7. Hasil Pengujian Unit Kelas C27

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C27-UT01 | `simpan(idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai): Boolean` | Normal | Kode "012345", berlaku 15 menit, "Aktif" | `true`, ID token UUID, parameter sesuai | Sesuai | Pass |
| C27-UT02 | `simpan(...)` | Negatif | 0 baris tersimpan | `false` | `false` | Pass |
| C27-UT03 | `cariTokenAktif(idAkun): TokenVerifikasi` | Normal | Satu baris token | Objek `TokenVerifikasi` terpetakan | Sesuai | Pass |
| C27-UT04 | `cariTokenAktif(idAkun)` | Negatif | Tidak ada token aktif | `null`; kueri menyaring "Aktif" dan mengurutkan `waktu_buat DESC` | Sesuai | Pass |
| C27-UT05 | `cocokkanKode(kodeInput): Boolean` | Normal | "012345" | `true` | `true` | Pass |
| C27-UT06 | `cocokkanKode(kodeInput)` | Batas | " 012345 "; "12345" (nol di depan hilang) | `true`; `false` | Sesuai | Pass |
| C27-UT07 | `cocokkanKode(kodeInput)` | Negatif | "012346"; angka 12345; `undefined` | `false` | `false` untuk ketiganya | Pass |
| C27-UT08 | `sudahKedaluwarsa(): Boolean` | Normal | Kedaluwarsa 1 menit lagi | `false` | `false` | Pass |
| C27-UT09 | `sudahKedaluwarsa()` | Batas | Kedaluwarsa 1 detik lalu | `true` | `true` | Pass |
| C27-UT10 | `tandaiTerpakai(): void` | Normal | Token "Aktif" | Status "Terpakai" di basis data dan objek | Sesuai | Pass |
| C27-UT11 | `tandaiHangus(): void` | Normal | Token "Aktif" | Status "Hangus" di basis data dan objek | Sesuai | Pass |

Tabel 4.2.7b. Ringkasan Cakupan Kelas C27

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan()`, `cariTokenAktif()`, `cocokkanKode()`, `sudahKedaluwarsa()`, `tandaiTerpakai()`, `tandaiHangus()` |
| Operasi yang diuji | Seluruhnya |
| ID Algoritma yang tercakup | Algo-029 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang (sebelumnya 69,6% / 75,0%); bukti `coverage-modul-a.txt` |

### 4.2.8 Kelas SesiLogin

**ID Kelas:** C28  
**Nama Kelas:** SesiLogin  
**Tingkat:** Mendalam

Tabel 4.2.8. Hasil Pengujian Unit Kelas C28

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C28-UT01 | `buatToken(idAkun): String` | Normal | Dipanggil dua kali | 64 karakter hex, keduanya berbeda | Sesuai | Pass |
| C28-UT02 | `simpan(idAkun, token, waktuMulai, waktuKedaluwarsa): Boolean` | Normal | Sesi 24 jam | `true`, sesi disimpan dengan `status_aktif = true` | Sesuai | Pass |
| C28-UT03 | `simpan(...)` | Negatif | 0 baris tersimpan | `false` | `false` | Pass |
| C28-UT04 | `cariSesiAktif(token): SesiLogin` | Normal | Satu baris sesi | Objek `SesiLogin` terpetakan | Sesuai | Pass |
| C28-UT05 | `cariSesiAktif(token)` | Negatif | Token tidak aktif atau kedaluwarsa | `null`; kueri menyaring `status_aktif = true` dan `waktu_kedaluwarsa > now()` | Sesuai | Pass |
| C28-UT06 | `getIdAkun(): String` | Normal | Sesi milik "akun-1" | "akun-1" | Sesuai | Pass |
| C28-UT07 | `nonaktifkan(token): void` | Normal | "tkn" | `UPDATE ... SET status_aktif = false WHERE token = $1` | Sesuai | Pass |
| C28-UT08 | `nonaktifkanByAkun(idAkun): void` | Normal, Batas | Tanpa klien; dengan klien transaksi | Semua sesi aktif akun dinonaktifkan; dengan klien, kueri lewat klien tersebut | Sesuai | Pass |

Tabel 4.2.8b. Ringkasan Cakupan Kelas C28

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatToken()`, `simpan()`, `cariSesiAktif()`, `getIdAkun()`, `nonaktifkan()`, `nonaktifkanByAkun()` |
| Operasi yang diuji | Seluruhnya |
| ID Algoritma yang tercakup | Algo-030, Algo-031 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang (sebelumnya 73,7% / 33,3%); bukti `coverage-modul-a.txt` |

### 4.2.9 Kelas DokumenLegal

**ID Kelas:** C40  
**Nama Kelas:** DokumenLegal  
**Tingkat:** Sedang

Tabel 4.2.9. Hasil Pengujian Unit Kelas C40

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C40-UT01 | `getVersiTerbaru(jenis): DokumenLegal` | Normal | Satu baris Kebijakan Privasi versi 1.0 | Objek `DokumenLegal` dengan judul, versi, dan klausul | Sesuai | Pass |
| C40-UT02 | `getVersiTerbaru(jenis)` | Negatif | Tidak ada versi berlaku | `null`; kueri menyaring terbit dan `tanggal_berlaku <= CURRENT_DATE`, diurutkan terbaru | Sesuai | Pass |
| C40-UT03 | `getTautan(): String`, `getIsi(): String` | Normal | Dokumen dengan tautan dan isi | Tautan dan isi apa adanya | Sesuai | Pass |

### 4.2.10 Kelas Otorisasi

**ID Kelas:** C41  
**Nama Kelas:** Otorisasi  
**Tingkat:** Mendalam

Tabel 4.2.10. Hasil Pengujian Unit Kelas C41

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C41-UT01 | `ambilToken(req)` | Normal, Negatif | Header "Bearer abc123"; "bearer abc123", "Basic abc123", "Bearer", "", tanpa header | "abc123"; `null` untuk lima lainnya | Sesuai | Pass |
| C41-UT02 | `verifikasiToken(token): SesiLogin` | Normal | Token sesi aktif | Objek `SesiLogin` | Sesuai | Pass |
| C41-UT03 | `verifikasiToken(token)` | Batas | `null`, `undefined`, "", "␣␣␣" | `null` tanpa kueri ke basis data | Sesuai | Pass |
| C41-UT04 | `verifikasiToken(token)` | Negatif | Token tidak dikenal, nonaktif, atau kedaluwarsa | `null` | `null` | Pass |
| C41-UT05 | `verifikasiAdmin(token): SesiLogin` | Normal | Sesi milik admin | Objek sesi | Sesuai | Pass |
| C41-UT06 | `verifikasiAdmin(token)` | Negatif | Sesi tidak valid | `null` tanpa memeriksa peran | Sesuai | Pass |
| C41-UT07 | `verifikasiAdmin(token)` | Negatif | Sesi milik pengguna biasa | `null` | `null` | Pass |
| C41-UT08 | `wajibLogin(req, res, next)` | Normal | "Bearer tkn" valid | `req.akun` dan `req.token` terisi, `next()` dipanggil | Sesuai | Pass |
| C41-UT09 | `wajibLogin(...)` | Negatif | Tanpa header | HTTP 401 "Silakan masuk terlebih dahulu.", `next()` tidak dipanggil | Sesuai | Pass |
| C41-UT10 | `wajibAdmin(req, res, next)` | Normal | Token admin | `next()` dengan `req.akun` terisi | Sesuai | Pass |
| C41-UT11 | `wajibAdmin(...)` | Negatif | Belum masuk | HTTP 401 | Sesuai | Pass |
| C41-UT12 | `wajibAdmin(...)` | Negatif | Masuk sebagai pengguna biasa | HTTP 403 "Akses hanya untuk admin." | Sesuai | Pass |
| C41-UT13 | `wajibAdmin(...)` | Batas | Token admin | Sesi dicari tepat satu kali ke basis data | Sesuai | Pass |

Tabel 4.2.10b. Ringkasan Cakupan Kelas C41

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `verifikasiToken()`, `verifikasiAdmin()`, ditambah `ambilToken()`, `wajibLogin()`, `wajibAdmin()` (B.5 M9) |
| Operasi yang diuji | Seluruhnya |
| ID Algoritma yang tercakup | Algo-064, Algo-065 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang; bukti `coverage-modul-a.txt` |

### 4.2.11 Kelas Kriptografi (bagian hash kata sandi)

**ID Kelas:** C42  
**Nama Kelas:** Kriptografi  
**Tingkat:** Mendalam

Baris C42-UT01 s.d. C42-UT04 mencakup `hash` dan `cocokkanHash` milik Modul A. Pengujian `enkripsi` dan `dekripsi` diisi Modul D dengan ID lanjutan mulai C42-UT05.

Tabel 4.2.11. Hasil Pengujian Unit Kelas C42

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C42-UT01 | `hash(teks): String` | Normal | "rahasia123", 4 round | Hash bcrypt berawalan `$2b$04$`, tidak sama dengan teks asli | Sesuai | Pass |
| C42-UT02 | `hash(teks)` | Batas | Teks yang sama di-*hash* dua kali | Dua hash berbeda (salt acak) | Sesuai | Pass |
| C42-UT03 | `cocokkanHash(teks, hash): Boolean` | Normal, Negatif | "rahasia123" dan "rahasia124" terhadap hash "rahasia123" | `true`; `false` | Sesuai | Pass |
| C42-UT04 | `cocokkanHash(teks, hash)` | Negatif | Teks `null`; hash `null` | `false` | `false` untuk keduanya | Pass |

Tabel 4.2.11b. Ringkasan Cakupan Kelas C42

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `hash()`, `cocokkanHash()`, `enkripsi()`, `dekripsi()` |
| Operasi yang diuji | `hash()`, `cocokkanHash()` (Modul A); `enkripsi()`, `dekripsi()` oleh Modul D |
| ID Algoritma yang tercakup | Algo-066, Algo-067 |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang untuk seluruh berkas `Kriptografi.js`; bukti `coverage-modul-a.txt` |

### 4.2.12 Kelas SurelAdapter

**ID Kelas:** C43  
**Nama Kelas:** SurelAdapter  
**Tingkat:** Mendalam

Transport nodemailer diganti tiruan (`jest.mock`). Pengiriman ke server SMTP sungguhan diuji pada INT-TC03 dan INT-TC04.

Tabel 4.2.12. Hasil Pengujian Unit Kelas C43

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C43-UT01 | `kirimSurel(tujuan, subjek, isi): Boolean` | Normal | "uji@itb.ac.id", "Kode Verifikasi ITBELI", "Kode: 123456" | `true`; `sendMail` menerima pengirim, tujuan, subjek, dan isi yang sama | Sesuai | Pass |
| C43-UT02 | `kirimSurel(...)` | Negatif | SMTP menolak (`ECONNREFUSED`) | `false` tanpa melempar galat; galat dicatat beserta alamat tujuan | Sesuai | Pass |
| C43-UT03 | Konstruktor `SurelAdapter(hostSmtp, portSmtp, alamatPengirim)` | Batas | Port 465, 587, 1025 | `secure: true` hanya untuk 465 | Sesuai | Pass |
| C43-UT04 | Konstruktor | Normal, Negatif | Tanpa nama pengguna; dengan "pengguna"/"sandi" | `auth` tidak dipasang; `auth: { user, pass }` | Sesuai | Pass |

Tabel 4.2.12b. Ringkasan Cakupan Kelas C43

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `kirimSurel()` |
| Operasi yang diuji | `kirimSurel()` dan konstruktor |
| ID Algoritma yang tercakup | - (tidak ada algoritma C43 pada DPPL) |
| Coverage (wajib ≥ 70%) | 100% baris / 100% cabang (sebelumnya 61,5% / 50,0%); bukti `coverage-modul-a.txt` |

### 4.2.13 Kelas SsoController

**ID Kelas:** - (kelas tambahan B.1 No. 41, diberi awalan ID pengujian SSO)  
**Nama Kelas:** SsoController  
**Tingkat:** Mendalam

Pengujian berjalan lewat rute `/api/akun/sso/*` dengan Supertest. Permintaan ke Google dan model Akun/SesiLogin diganti tiruan (`src/tests/integration/SsoAPI.test.js`). Penolakan oleh *token endpoint* Google sungguhan diuji pada INT-TC11.

Tabel 4.2.13. Hasil Pengujian Unit Kelas SsoController

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SSO-UT01 | `penyediaAktif()` | Normal, Negatif | Kredensial Google terisi; kosong | `google: true`; `google: false` | Sesuai | Pass |
| SSO-UT02 | `mulai(nama)` | Normal | `GET /sso/google/mulai` | 302 ke `accounts.google.com/o/oauth2/v2/auth` dengan `client_id`, `redirect_uri`, `scope`, `state` ≥ 30 karakter, PKCE `S256`, `hd=itb.ac.id`; *cookie* state HttpOnly, SameSite=Lax, Max-Age 600 | Sesuai | Pass |
| SSO-UT03 | `mulai(nama)` | Batas | Dua permintaan berturut-turut | Nilai `state` berbeda | Sesuai | Pass |
| SSO-UT04 | `mulai(nama)` | Negatif | Penyedia "facebook", "microsoft", "\_\_proto\_\_", "constructor" | 404 JSON | Sesuai | Pass |
| SSO-UT05 | `mulai(nama)` | Negatif | Kredensial Google kosong | 404 JSON | Sesuai | Pass |
| SSO-UT06 | `tukarKode(...)` | Normal | Callback dengan kode dan state benar | POST ke `oauth2.googleapis.com/token` dengan `client_secret` dan `code_verifier` yang SHA-256-nya sama dengan `code_challenge` | Sesuai | Pass |
| SSO-UT07 | `periksaKlaim(...)` | Batas | Surel "…@std.stei.itb.ac.id" berhuruf besar | Diterima, surel dinormalkan huruf kecil | Sesuai | Pass |
| SSO-UT08 | `selesaikan(...)` | Negatif | State query berbeda dengan *cookie* | `STATE_TIDAK_VALID`, penyedia tidak dihubungi | Sesuai | Pass |
| SSO-UT09 | `selesaikan(...)` | Negatif | State kosong | `STATE_TIDAK_VALID` | Sesuai | Pass |
| SSO-UT10 | `selesaikan(...)` | Negatif | Tanpa *cookie* state | `STATE_TIDAK_VALID` | Sesuai | Pass |
| SSO-UT11 | `selesaikan(...)` | Negatif | *Cookie* state milik penyedia lain | `STATE_TIDAK_VALID` | Sesuai | Pass |
| SSO-UT12 | `selesaikan(...)` | Negatif | `error=access_denied` | `DITOLAK_PENYEDIA` | Sesuai | Pass |
| SSO-UT13 | `periksaKlaim(...)` | Negatif | 8 klaim: surel gmail.com, itb.ac.id.palsu.com, tanpa surel, `email_verified` false, `email_verified` "true" (string), `aud` lain, `iss` lain, token kedaluwarsa | `DOMAIN_TIDAK_VALID`, `SUREL_BELUM_TERVERIFIKASI`, atau `TOKEN_TIDAK_VALID`; tanpa sesi | Sesuai untuk kedelapan klaim | Pass |
| SSO-UT14 | `tukarKode(...)` | Negatif | *Token endpoint* membalas HTTP 400 | `PERTUKARAN_GAGAL` | Sesuai | Pass |
| SSO-UT15 | `tukarKode(...)` | Negatif | Jaringan putus | `PERTUKARAN_GAGAL` | Sesuai | Pass |
| SSO-UT16 | `selesaikan(...)` | Normal | Akun lama terverifikasi | Sesi dibuat, redirect `/katalog`, token dititipkan di *cookie* singkat, *cookie* state dihapus | Sesuai | Pass |
| SSO-UT17 | `selesaikan(...)` | Batas | Akun "Belum Terverifikasi" | Menjadi "Terverifikasi" dan hash kata sandi lama diganti | Sesuai | Pass |
| SSO-UT18 | `selesaikan(...)`, `profilSementara(...)` | Normal | Surel belum terdaftar | *Cookie* profil HttpOnly bertanda tangan (Max-Age 900), redirect `/lengkapi-sso`, belum ada akun atau sesi | Sesuai | Pass |
| SSO-UT19 | `selesaikan(...)` | Negatif | Akun diblokir | Ditolak `AKUN_DIBLOKIR` | Sesuai | Pass |
| SSO-UT20 | `selesaikan(...)` | Negatif | Akun Admin | Ditolak `SSO_ADMIN_DILARANG` | Sesuai | Pass |
| SSO-UT21 | `lengkapi(...)` | Normal | NIM "13599999" dan persetujuan | 201, akun "Terverifikasi" dengan kata sandi acak 64 hex, sesi dibuat, *cookie* profil dihapus | Sesuai | Pass |
| SSO-UT22 | `lengkapi(...)` | Negatif | NIM "abc"; NIM kosong; kebijakan tidak disetujui | 400 `NIM_TIDAK_VALID`; `FORMULIR_TIDAK_LENGKAP`; `KEBIJAKAN_BELUM_DISETUJUI` | Sesuai | Pass |
| SSO-UT23 | `lengkapi(...)` | Negatif | Tanpa *cookie* profil | 401 | Sesuai | Pass |
| SSO-UT24 | `periksaTandatangan(nilai)` | Negatif | Isi *cookie* profil diubah (surel diganti) | Ditolak | Sesuai | Pass |
| SSO-UT25 | `periksaTandatangan(nilai)` | Negatif | Ditandatangani kunci lain | Ditolak | Sesuai | Pass |
| SSO-UT26 | `periksaTandatangan(nilai)` | Batas | Tanda tangan benar, lewat 15 menit | Ditolak | Sesuai | Pass |
| SSO-UT27 | `bacaCookie(...)`, `periksaTandatangan(...)` | Negatif | *Cookie* berformat sampah | Ditolak tanpa galat server | Sesuai | Pass |
| SSO-UT28 | `lengkapi(...)` | Negatif | Surel sudah terdaftar saat melengkapi | 409, akun tidak disimpan | Sesuai | Pass |
| SSO-UT29 | `selesaikan(...)` | Negatif | `KUNCI_SSO` tidak diatur, akun baru | Redirect `/masuk?sso_galat=KONFIGURASI_SALAH`, bukan HTTP 500 | Sesuai | Pass |
| SSO-UT30 | `ambilKredensial(nama)` | Negatif | Callback saat kredensial Google kosong | 404 | Sesuai | Pass |

Tabel 4.2.13b. Ringkasan Cakupan Kelas SsoController

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | Tidak ada pada DPPL (kelas tambahan). Operasi pada kode: `ambilKredensial()`, `penyediaAktif()`, `alamatKembali()`, `mulai()`, `selesaikan()`, `tukarKode()`, `bacaKlaim()`, `periksaKlaim()`, `profilSementara()`, `lengkapi()`, `tandatangani()`, `periksaTandatangan()`, `bacaCookie()` |
| Operasi yang diuji | Seluruhnya, lewat rute `/api/akun/sso/*` |
| ID Algoritma yang tercakup | - (tidak ada pada DPPL) |
| Coverage (wajib ≥ 70%) | 98,14% baris / 92,47% cabang (pernyataan 94,77%, fungsi 100%); bukti `coverage-modul-a.txt` |

### 4.2.14 Kelas HalamanListingPenjual

**ID Kelas:** C03  
**Nama Kelas:** HalamanListingPenjual  
**Tingkat:** Sedang

Cara menjalankan unit test UC07–UC12: `node docs/M10/assets/bukti/jalankan-unit-modul-b.cjs` dari root proyek.

Lokasi file test: `docs/M10/assets/bukti/modul-b.test.js`.

Tabel 4.2.14. Hasil Pengujian Unit Kelas C03

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C03-UT01 | `muat()` | Normal | API membalas satu listing Tersedia | Daftar disimpan, render dipanggil, indikator memuat disembunyikan | Ketiganya terpenuhi | Pass |
| C03-UT02 | `muat()` | Negatif | API menolak dengan `jaringan gagal` | Pesan tampil, render tidak dipanggil | Pesan diteruskan dan render tidak dipanggil | Pass |
| C03-UT03 | `mulai()`, `render()`, `aksi()` | Normal, Negatif | Muat daftar, konfirmasi hapus/status, status berubah sebelum aksi, API gagal | GET daftar; DELETE/PATCH sesuai aksi; status usang dimuat ulang; galat diteruskan | Semua pemeriksaan sesuai; konfirmasi diuji melalui callback tiruan | Pass |

### 4.2.15 Kelas FormulirBarang

**ID Kelas:** C04  
**Nama Kelas:** FormulirBarang  
**Tingkat:** Mendalam

Tabel 4.2.15. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C04-UT01 | `tambahFoto()`, `pindah()` | Normal, Batas, Negatif | 1 lalu 5 foto, tepat 5 MB; tambah foto keenam; 0 byte, >5 MB, PDF; pindah urutan valid/tidak valid | Maksimum 5 foto; berkas salah tidak ditambahkan; urutan hanya berubah untuk indeks sah | Seluruh assertion sesuai | Pass |
| C04-UT02 | `validasi()`, `error()` | Normal, Negatif | Isian lengkap dan satu foto; judul kosong; tanpa foto | Lengkap diterima; isian/foto kosong ditolak dan ditandai | `true`, `false`, `false` sesuai kondisi | Pass |
| C04-UT03 | `data()`, `simpan()` | Normal | Data valid dengan satu foto lama; API tiruan sukses | FormData dikirim; pesan disimpan; diarahkan ke detail sesuai implementasi M9 | POST, FormData, dan tujuan `/detail?id=id` sesuai kontrak implementasi | Pass |
| C04-UT04 | `simpan()` | Negatif | API menolak `server gagal` | Galat tampil, tombol kembali aktif | Sesuai; `busy=false`, tombol aktif | Pass |
| C04-UT05 | `batal()` | Normal, Negatif | Formulir bersih; formulir memiliki perubahan belum disimpan | Bersih langsung kembali; perubahan meminta konfirmasi | Tujuan `/listing-saya` dan pemanggilan konfirmasi sesuai | Pass |
| C04-UT06 | `mulai()`, `renderFoto()`, `preview()` | Normal, Negatif | Formulir baru; ubah dengan data dan foto lama; API gagal | Referensi/prefill/foto tampil, tombol aktif; kegagalan ditampilkan | Seluruh pemeriksaan sesuai | Pass |

Tabel 4.2.15b. Ringkasan Cakupan Kelas C04

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `bukaFormulir()`, `tampilkanFormulir()`, `suntingIsian()`, `pilihFoto()`, `validasiTipeData()`, `validasiFotoSisiKlien()`, `validasiIsianWajib()`, `tandaiIsianKosong()`, `tolakPratinjau()`, `kirimFormulir()`, `onClickUpdate()`, `arahkanKeDetail()`, `tampilkanNotifikasi()` |
| Operasi yang diuji | `mulai`, `tambahFoto`, `pindah`, `renderFoto`, `data`, `preview`, `error`, `validasi`, `simpan`, `batal` |
| ID Algoritma yang tercakup | - |
| Coverage (wajib ≥ 70%) | **95,45% baris / 63,63% cabang**; bukti `unit-modul-b.txt` |

### 4.2.16 Kelas BarangController

**ID Kelas:** C14  
**Nama Kelas:** BarangController  
**Tingkat:** Mendalam

Aturan bisnis C14 diimplementasikan pada `ListingService` sesuai Tabel B.5 dokumen Implementasi (Tugas 9).

Tabel 4.2.16. Hasil Pengujian Unit Kelas C14

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C14-UT01 | `validasiData()` | Normal | Judul berspasi, harga `120000` | Judul di-trim, harga menjadi angka | `Jas kimia`, 120000 | Pass |
| C14-UT02 | `validasiData()` | Batas | Judul 80 karakter, deskripsi 1000; harga 0,01 dan 9.999.999.999,99 | Semua diterima | Seluruh batas diterima | Pass |
| C14-UT03 | `validasiData()` | Negatif | Isian kosong, judul 81/deskripsi 1001, kategori/lokasi asing, delapan harga salah | Ditolak dengan galat validasi | Seluruh masukan ditolak | Pass |
| C14-UT04 | `validasiFoto()` | Normal, Batas | Signature PNG/JPEG sah; metadata ukuran 1 byte dan tepat 5 MB | Format/ukuran diterima sesuai pemeriksaan kode | Diterima. Ini pemeriksaan metadata/signature, bukan pengujian decoder gambar | Pass |
| C14-UT05 | `validasiFoto()` | Negatif | 0 byte, >5 MB, ekstensi/MIME/signature tidak sesuai | Ditolak | Seluruh masukan ditolak | Pass |
| C14-UT06 | `get()` | Normal | Pemilik sah, listing dan galeri tersedia | Data, foto, referensi dikembalikan | Sesuai | Pass |
| C14-UT07 | `get()` / pemeriksaan kepemilikan | Negatif | Listing tidak ada, pemilik lain, Dinonaktifkan | 404, 403, 409; galeri tidak dibaca | Ketiga galat sesuai | Pass |
| C14-UT08 | `simpan()` (buat) | Normal, Batas | Satu dan lima foto; urutan sah | Pemilik dari sesi, data/foto diteruskan untuk disimpan | Pemilik dan jumlah galeri sesuai | Pass |
| C14-UT09 | `simpan()` | Negatif | JSON urutan salah, 0/6 entri, duplikat, bukan array/string | 400 | Seluruh variasi menghasilkan 400 | Pass |
| C14-UT10 | `simpan()` | Negatif | Akun tidak aktif, foto asing atau unggahan tidak dirujuk urutan | 403 untuk akun; 400 untuk foto/urutan | Sesuai | Pass |
| C14-UT11 | `simpan()` (ubah) | Normal | Satu foto baru, satu dipertahankan, satu dibuang | Data diperbarui, urutan baru sesuai, berkas lama terbuang dihapus | Urutan baru/lama dan penghapusan sesuai | Pass |
| C14-UT12 | `simpan()` | Negatif | Storage mengembalikan null; database gagal setelah unggah | 500 untuk storage; galat DB diteruskan; foto baru dibersihkan | Sesuai, termasuk pemanggilan penghapusan foto baru | Pass |
| C14-UT13 | `hapus()` | Normal | Pemilik sah dan satu foto | Hapus listing, lalu berkas fotonya | Kedua operasi dipanggil dengan ID/path yang sesuai | Pass |
| C14-UT14 | `hapus()` | Negatif | Akun tidak aktif atau bukan pemilik | 403; operasi hapus tidak dipanggil | Sesuai | Pass |
| C14-UT15 | `status()` | Normal | Tersedia → Terjual dan Terjual → Tersedia | Transisi diteruskan dengan ID pemilik/status asal | Kedua transisi sesuai | Pass |
| C14-UT16 | `status()` | Negatif | Status sama, akun tidak aktif, bukan pemilik, status usang | 400, 403, 403, 409 | Seluruh hasil sesuai | Pass |
| C14-UT17 | Ketujuh handler C14 | Normal | Referensi, daftar, detail pemilik, buat, ubah, hapus, status | Parameter diteruskan sesuai sesi; buat menghasilkan 201 | Semua handler dijalankan; parameter dan 201 sesuai | Pass |
| C14-UT18 | `buatBarang()` | Negatif | Service menolak | Galat diteruskan ke Express | Promise ditolak dengan galat yang sama | Pass |

Tabel 4.2.16b. Ringkasan Cakupan Kelas C14

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getDataFormulir()`, `buatBarang()`, `getIdPenjualDariSesi()`, `validasiKelengkapanIsian()`, `validasiFoto()`, `simpanFoto()`, `terbitkanKeKatalog()`, `getListingSaya()`, `getBarang()`, `updateBarang()`, `verifikasiKepemilikan()`, `siapkanPenghapusan()`, `deleteBarang()`, `siapkanPerubahanStatus()`, `ubahStatusBarang()` |
| Operasi yang diuji | Ketujuh handler; `ListingService.get/simpan/hapus/status`, `validasiData`, `validasiFoto`, fungsi kepemilikan; middleware sesi diuji melalui 26 test awal dan integrasi nyata |
| ID Algoritma yang tercakup | Algo-007 s.d. Algo-012, dengan pemetaan implementasi M9 B.5 |
| Coverage (wajib ≥ 70%) | **BarangController 100% baris / 100% cabang; ListingService 100% baris / 92,94% cabang**. Bukti `unit-modul-b.txt` |

### 4.2.17 Kelas Barang

**ID Kelas:** C29  
**Nama Kelas:** Barang  
**Tingkat:** Mendalam

Tabel 4.2.17. Hasil Pengujian Unit Kelas C29

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C29-UT01 | `dariBaris`, `cariById`, `getListingPenjual`, `getStatus` | Normal, Negatif | Baris harga string, foto utama, baris null, objek tanpa status | Mapping angka/foto sesuai; null tetap null; status bawaan Tersedia | Sesuai | Pass |
| C29-UT02 | `simpan`, `hapus` | Normal, Negatif | Client query tiruan; penghapusan satu/nol baris | ID hasil INSERT; hasil hapus true/false | Sesuai | Pass |
| C29-UT03 | `ListingPenjual.transaksi` | Normal, Negatif | Callback sukses dan melempar galat | BEGIN–COMMIT atau BEGIN–ROLLBACK; koneksi selalu dilepas | Sesuai; release dipanggil dua kali | Pass |
| C29-UT04 | `kunci`, `akunAktif`, `update`, `setStatus` | Normal, Negatif | Baris ada/tidak ada, akun terverifikasi/diblokir, update status satu/nol baris | Mapping/otorisasi sesuai; status atomik true hanya untuk satu baris | Sesuai | Pass |

Tabel 4.2.17b. Ringkasan Cakupan Kelas C29

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan()`, `cariById()`, `getListingPenjual()`, `getStatus()`, `setStatus()`, `getKatalog()`, `hapus()`, `nonaktifkanByPemilik()`, `pulihkanKatalog()` |
| Operasi yang diuji | `simpan`, `cariById`, `getListingPenjual`, `getStatus`, `hapus`; `setStatus` pada `ListingPenjual`, bersama `transaksi`, `kunci`, `akunAktif`, `update` (M9 B.1 No. 18) |
| ID Algoritma yang tercakup | Algo-033; dampak status terhadap hasil katalog diperiksa secara integrasi, tanpa memperluas pengujian ke fitur pencarian/filter UC13–UC15 |
| Coverage (wajib ≥ 70%) | **ListingPenjual 100% baris / 66,66% cabang. Barang.js 45,58% baris / 36% cabang untuk seluruh berkas**. Nilai Barang.js belum mencapai 70%; operasi katalog umum/detail dan moderasi pada berkas bersama tidak diuji ulang dalam pekerjaan UC07–UC12. Pemenuhan coverage kelas bersama secara keseluruhan belum dapat diklaim |

Tabel 4.2.17c. Hasil Pengujian Unit Kelas C29 oleh Modul E (12 test)

Modul E menguji operasi C29 yang dipakai moderasi dan kasus batas yang belum tercakup C29-UT01 s.d. C29-UT04. Test berada di `src/tests/unit/BarangModel.test.js` dan dijalankan oleh `npm test`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C29-UT05 | `konstruktor dan dariBaris` | Normal | data dan baris basis data | objek Barang dengan harga numerik | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT06 | `simpan` | Normal | data listing | INSERT dan mengembalikan idBarang | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT07 | `cariById` | Normal | id barang yang ada | objek Barang | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT08 | `hapus` | Normal | id barang yang ada | DELETE, true | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT09 | `nonaktifkanByPemilik` | Normal | listing Tersedia milik akun | Dinonaktifkan (KF54) | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT10 | `pulihkanKatalog` | Normal | listing Dinonaktifkan milik akun | Tersedia (UC24) | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT11 | `getStatus` | Normal | objek Barang berstatus Terjual | "Terjual" | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT12 | `konstruktor` | Batas | data tanpa status dan tanpa harga | status Tersedia dan harga 0 | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT13 | `cariById` | Negatif | id barang tidak ada | null | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT14 | `hapus` | Negatif | id barang tidak ada (0 baris terhapus) | false | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT15 | `getListingPenjual` | Normal | listing Tersedia dan Terjual milik penjual | objek Barang beserta fotoUtama | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT16 | `nonaktifkanByPemilik` | Batas | penjual tanpa listing Tersedia (0 baris berubah) | tetap true | Sesuai dengan hasil yang diharapkan | Pass |

*Coverage* `Barang.js` dari `npm test` (tanpa test Modul B yang dijalankan terpisah): 51,47% baris, 46% cabang. Baris yang belum teruji (126 s.d. 195) adalah `getKatalog` dan `getDetailKatalog` milik Modul C.

### 4.2.18 Kelas FotoBarang

**ID Kelas:** C30  
**Nama Kelas:** FotoBarang  
**Tingkat:** Mendalam

Tabel 4.2.18. Hasil Pengujian Unit Kelas C30

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C30-UT01 | `validasiFormat`, `validasiUkuran` | Normal, Batas, Negatif | jpg/.JPEG/png dan pdf/kosong; 1 byte, tepat 5 MB, 0/negatif/>5 MB/string | Format sah dan ukuran (0, 5 MB] diterima; lainnya ditolak | Seluruh masukan sesuai | Pass |
| C30-UT02 | `dariBaris`, `simpan`, `getGaleri`, `hapus` | Normal, Negatif | Mapping null/ukuran string; INSERT satu/nol baris; SELECT galeri; DELETE | Mapping dan hasil true/false sesuai; query galeri memakai urutan | Sesuai dengan kontrak model | Pass |
| C30-UT03 | `ListingPenjual.galeri` | Normal, Batas | Dua foto disimpan ulang | Metadata lama dihapus; foto bernomor urut 1, 2 | Kedua nomor urut sesuai | Pass |

Tabel 4.2.18b. Ringkasan Cakupan Kelas C30

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiFormat()`, `validasiUkuran()`, `simpan()`, `getGaleri()`, `perbaruiGaleri()`, `getFotoUtama()`, `hapus()` |
| Operasi yang diuji | Operasi fisik FotoBarang; `perbaruiGaleri` dipetakan ke `ListingPenjual.galeri`, foto utama diambil subquery `Barang.getListingPenjual` (M9 B.1 No. 18) |
| ID Algoritma yang tercakup | Algo-034; padanan foto utama Algo-035 diperiksa melalui kueri listing |
| Coverage (wajib ≥ 70%) | **FotoBarang 100% baris / 72,22% cabang**; bukti `unit-modul-b.txt` |

Tabel 4.2.18c. Hasil Pengujian Unit Kelas C30 oleh Modul E (7 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C30-UT04 | `validasiFormat` | Normal | jpg, .JPEG, png, pdf, exe, kosong | hanya jpg, jpeg, dan png yang true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT05 | `validasiUkuran` | Batas | 1 KB, tepat 5 MB, 5 MB + 1 byte, 0, negatif | hanya 1 KB dan tepat 5 MB yang true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT06 | `simpan` | Normal | metadata foto | INSERT ke foto_barang, true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT07 | `getGaleri` | Normal | id barang | daftar foto urut menurut kolom urutan | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT08 | `hapus` | Normal | id barang | DELETE seluruh metadata foto | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT09 | `validasiFormat` | Negatif | null atau "gif" | false (".PNG" tetap diterima) | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT10 | `validasiUkuran` | Negatif | ukuran berupa teks "100" atau undefined | false | Sesuai dengan hasil yang diharapkan | Pass |

*Coverage* `FotoBarang.js` dari `npm test`: 100% baris, 77,77% cabang.

### 4.2.19 Kelas Kategori

**ID Kelas:** C31  
**Nama Kelas:** Kategori  
**Tingkat:** Sedang

Tabel 4.2.19. Hasil Pengujian Unit Kelas C31

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C31-UT01 | Daftar kategori dan validasi keanggotaan | Normal, Negatif | Baca enam kategori implementasi; kirim kategori bebas | Enam pilihan tersedia; masukan bebas ditolak | Sesuai kontrak implementasi. Kecocokan nama kategori dengan SKPL dinilai terpisah pada UC07-TC01 | Pass |

### 4.2.20 Kelas LokasiCOD

**ID Kelas:** C32  
**Nama Kelas:** LokasiCOD  
**Tingkat:** Sedang

Tabel 4.2.20. Hasil Pengujian Unit Kelas C32

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C32-UT01 | Daftar lokasi dan validasi keanggotaan | Normal, Negatif | Baca enam lokasi; kirim lokasi bebas | Enam pilihan tersedia; masukan bebas ditolak | Sesuai | Pass |

Unit test dan *coverage* C45 dilaporkan Modul E pada Subbab 4.2.29; jalur penyimpanan foto pada disk lokal juga diuji melalui INT-TC13, INT-TC21, dan INT-TC23.

### 4.2.21 Kelas FormulirLaporan

**ID Kelas:** C10
**Nama Kelas:** FormulirLaporan
**Tingkat:** Sedang

Tabel 4.2.21. Hasil Pengujian Unit Kelas C10 (8 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C10-UT01 | `validasiIsianWajib` | Normal | objek, kategori, alasan, dan satu bukti terisi | true | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT02 | `validasiIsianWajib` | Negatif | alasan hanya berisi spasi | false | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT03 | `validasiIsianWajib` | Negatif | belum ada bukti tangkapan layar | false | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT04 | `unggahBukti` | Normal | satu PNG dan satu JPG di bawah 5 MB | keduanya masuk daftar bukti | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT05 | `unggahBukti` | Negatif | berkas 6 MB dan berkas .gif | keduanya ditolak dengan pesan galat | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT06 | `unggahBukti` | Batas | tujuh berkas sah | hanya lima pertama yang disimpan | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT07 | `kirimLaporan` | Negatif | pengguna belum masuk | pesan galat dan tidak ada permintaan ke /api/laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C10-UT08 | `kirimLaporan` | Normal | isian lengkap | POST /api/laporan berisi objek, kategori, alasan, jenis objek, dan bukti | Sesuai dengan hasil yang diharapkan | Pass |

*Coverage* tidak terukur karena skrip peramban dimuat lewat modul `vm` Node.js, yang tidak diinstrumentasi Jest. C10 bertingkat Sedang, sehingga tidak terikat batas 70%.

### 4.2.22 Kelas DasborAdmin

**ID Kelas:** C11
**Nama Kelas:** DasborAdmin
**Tingkat:** Sedang

Tabel 4.2.22. Hasil Pengujian Unit Kelas C11 (9 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C11-UT01 | `validasiTransisiStatus` | Normal | Baru ke Diproses, Diproses ke Selesai, Baru ke Selesai | true | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT02 | `validasiTransisiStatus` | Negatif | Selesai ke Baru, Diproses ke Baru, status tidak dikenal | false | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT03 | `onClickUbahStatus` | Negatif | di halaman detail, laporan Selesai diubah ke Diproses | pesan galat, API tidak dipanggil | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT04 | `onClickUbahStatus` | Normal | dari daftar laporan I-13, detail belum dibuka | PATCH terkirim, statistik dan daftar dimuat ulang | Pada kode tag `v9.0`: TypeError `this.memuatStatistik is not a function`, statistik dan daftar tidak dimuat ulang. Setelah perbaikan pada commit `f8e7224`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |
| C11-UT05 | `konfirmasiTindakan` | Negatif | alasan kosong atau hanya spasi | pesan galat, tidak ada tindakan moderasi terkirim | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT06 | `escapeHtml` | Normal | alasan laporan berisi tag &lt;script&gt; | karakter HTML diubah menjadi entitas | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT07 | `pasangEventListenersDetail` | Normal | detail laporan dengan pelapor `pelapor-1` dan terlapor `penjual-1`, lalu tombol Blokir dan Buka Blokir diklik | `onClickBlokirAkun` dan `onClickBukaBlokir` menerima `penjual-1` | Pada `v9.0` keduanya menerima `pelapor-1`. Setelah commit `1711d55`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |
| C11-UT08 | `onClickBlokirAkun`, `onClickBukaBlokir` | Negatif | terlapor tidak diketahui (`null`) | pesan galat, dialog konfirmasi tidak dibuka, `targetIdAkun` tetap null | Pada `v9.0` dialog konfirmasi tetap dibuka dengan sasaran pelapor. Setelah commit `1711d55`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |
| C11-UT09 | `tampilkanAksesDitolak` | Normal | pengguna bukan admin yang sudah masuk, lalu pengguna yang belum masuk | peringatan "Akses Ditolak", lalu dialihkan ke `/` untuk yang sudah masuk dan ke `/masuk` untuk yang belum | Pada `v9.0` keduanya dialihkan ke `/masuk`. Setelah commit `1711d55`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |

*Coverage* `DasborAdmin.js`: 18,75% baris. C11 bertingkat Sedang, sehingga tidak terikat batas 70%.

**Cacat yang ditemukan (C11-UT04).** Setelah status laporan diubah dari daftar laporan I-13, `onClickUbahStatus` memanggil `this.memuatStatistik()`, padahal nama metodenya `muatStatistik`. Akibatnya muncul TypeError setelah server berhasil menyimpan status baru, sehingga kartu statistik dan daftar laporan tidak diperbarui sampai halaman dimuat ulang. Pemanggilan yang sama ada di tiga cabang `konfirmasiTindakan`. Perbaikan pada commit `f8e7224` mengganti keempat pemanggilan dengan nama yang benar. Keluaran sebelum perbaikan tersimpan di `C11-UT04-gagal-sebelum-perbaikan.txt`.

**Cacat yang ditemukan (C11-UT07 sampai C11-UT09).** Ketiga test ini ditulis setelah UC20-TC03, UC23-TC01, dan UC24-TC01 gagal pada `v9.0` (Subbab 4.4). Tombol Blokir dan Buka Blokir mengambil ID dari `detailLaporan.pelapor`, dan `onClickBlokirAkun` mengisi sasaran kosong dengan ID pelapor. Perbaikan pada commit `1711d55` memakai `detailLaporan.terlapor` dan menghentikan tindakan bila akun itu tidak diketahui. Pada commit yang sama, `tampilkanAksesDitolak` membedakan pengguna yang sudah masuk dari yang belum.

### 4.2.23 Kelas LaporanController

**ID Kelas:** C20
**Nama Kelas:** LaporanController
**Tingkat:** Mendalam

Tabel 4.2.23. Hasil Pengujian Unit Kelas C20 (23 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C20-UT01 | `validasiDataLaporan` | Normal | objek, kategori Penipuan, dan alasan terisi | true | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT02 | `validasiDataLaporan` | Negatif | objek yang dilaporkan kosong | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT03 | `validasiDataLaporan` | Negatif | kategori di luar tiga pilihan | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT04 | `validasiDataLaporan` | Batas | alasan kosong atau hanya spasi | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT05 | `validasiBukti` | Negatif | tanpa berkas bukti | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT06 | `validasiBukti` | Batas | satu berkas melebihi 5 MB | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT07 | `validasiBukti` | Negatif | berkas bukan JPG atau PNG | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT08 | `validasiBukti` | Normal | JPG dan PNG berukuran di bawah 5 MB | true | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT09 | `susunMetadataPercakapan` | Normal | ID percakapan dan pelapor | metadata tanpa isi pesan (KF37) | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT10 | `buatLaporan` | Negatif | token tidak sah | TIDAK_TEROTENTIKASI | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT11 | `buatLaporan` | Negatif | objek yang dilaporkan kosong | DATA_TIDAK_LENGKAP | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT12 | `buatLaporan` | Negatif | data lengkap tanpa bukti | BUKTI_TIDAK_VALID | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT13 | `validasiBukti` | Batas | satu PNG berukuran tepat 5 MB (5.242.880 byte) | true | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT14 | `validasiDataLaporan` | Batas | data null atau bukan objek | false | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT15 | `getIdPelaporDariSesi` | Normal | token sesi aktif | idAkun pemilik sesi | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT16 | `getIdPelaporDariSesi` | Negatif | token tidak sah atau kedaluwarsa | null | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT17 | `simpanBukti` | Normal | dua berkas | BuktiLaporan.simpan dipanggil dua kali dengan path dari PenyimpananBerkas | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT18 | `simpanBukti` | Negatif | PenyimpananBerkas gagal (null) | melempar galat dan tidak menyimpan metadata | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT19 | `simpanLaporan` | Normal | data laporan | diteruskan ke Laporan.simpanLaporanBaru dan mengembalikan idLaporan | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT20 | `catatLogAudit` | Normal | idLaporan dan idPelapor | LogAudit.catatPenerimaanLaporan dipanggil | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT21 | `buatLaporan` | Normal | data dan bukti sah | satu transaksi (BEGIN, laporan, bukti, log audit, COMMIT), status Baru | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT22 | `buatLaporan` | Negatif | penyimpanan bukti gagal di tengah transaksi | ROLLBACK, GALAT_SERVER, koneksi tetap dilepas | Sesuai dengan hasil yang diharapkan | Pass |
| C20-UT23 | `buatLaporan` | Normal | laporan terhadap percakapan | metadata hanya berisi ID dan waktu, tanpa isi pesan (KF37) | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.23b. Ringkasan Cakupan Kelas C20

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatLaporan`, `getIdPelaporDariSesi`, `validasiDataLaporan`, `susunMetadataPercakapan`, `validasiBukti`, `simpanBukti`, `simpanLaporan`, `catatLogAudit` |
| Operasi yang diuji | Kedelapan operasi |
| ID Algoritma yang tercakup | Algo-021 |
| Coverage (wajib ≥ 70%) | 100% baris, 84,48% cabang. Alat: Jest `--coverage`. Bukti: `coverage-modul-e.txt` |

### 4.2.24 Kelas ModerasiController

**ID Kelas:** C21
**Nama Kelas:** ModerasiController
**Tingkat:** Mendalam

Tabel 4.2.24. Hasil Pengujian Unit Kelas C21 (45 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C21-UT01 | `otorisasiAdmin` | Normal | token sesi admin | idAdmin | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT02 | `otorisasiAdmin` | Negatif | token bukan admin atau tidak sah | null (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT03 | `getAllLaporan` | Normal | admin sah | seluruh laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT04 | `getAllLaporan` | Negatif | bukan admin | null (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT05 | `filterByStatus` | Normal | status "Baru" | hanya laporan Baru (KF46) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT06 | `filterByStatus` | Batas | status "Semua" | seluruh laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT07 | `filterByStatus` | Negatif | bukan admin | null (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT08 | `getDetailLaporan` | Normal | laporan yang ada | laporan, pelapor, bukti, dan riwayat audit | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT09 | `getDetailLaporan` | Negatif | laporan tidak ditemukan | null | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT10 | `getDetailLaporan` | Negatif | bukan admin | null (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT11 | `getStatistik` | Normal | admin sah | jumlah laporan per status | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT12 | `ubahStatusLaporan` | Normal | Baru ke Diproses | status diperbarui dan log audit dicatat (KF47, KF48) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT13 | `ubahStatusLaporan` | Negatif | status tujuan tidak sah | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT14 | `ubahStatusLaporan` | Normal | Diproses ke Selesai | true | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT15 | `ubahStatusLaporan` | Negatif | laporan tidak ditemukan | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT16 | `ubahStatusLaporan` | Negatif | transisi mundur Selesai ke Diproses | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT17 | `ubahStatusLaporan` | Negatif | bukan admin | false (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT18 | `ubahStatusLaporan` | Normal | Baru ke Diproses, kueri log_audit diperiksa | teks tindakan tertulis satu kali (KF48) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT19 | `ubahStatusLaporan` | Batas | status sama dengan status sekarang | true tanpa menulis laporan maupun log audit | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT20 | `catatLogAudit` | Normal | tindakan perubahan status | hanya status yang diteruskan ke LogAudit | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT21 | `catatLogAudit` | Normal | awalan "Penghapusan listing:" dan "Pemblokiran akun:" | operasi LogAudit yang sesuai | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT22 | `hapusListingDilaporkan` | Normal | admin sah dan alasan terisi | listing dan foto dihapus, laporan Selesai, log audit dan admin dicatat, surel terkirim (Algo-022) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT23 | `hapusListingDilaporkan` | Negatif | bukan admin | false (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT24 | `hapusListingDilaporkan` | Batas | alasan kosong atau hanya spasi | false (KF55) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT25 | `hapusListingDilaporkan` | Negatif | listing tidak ditemukan | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT26 | `hapusListingDilaporkan` | Normal | tanpa idLaporan | listing terhapus tanpa mengubah laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT27 | `hapusListingDilaporkan` | Negatif | galat basis data di tengah transaksi | ROLLBACK dan galat dilempar | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT28 | `blokirAkun` | Normal | admin sah dan alasan terisi | akun diblokir, listing dinonaktifkan, sesi dicabut, laporan Selesai, log dicatat, surel terkirim (Algo-023) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT29 | `blokirAkun` | Negatif | bukan admin | false (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT30 | `blokirAkun` | Batas | alasan kosong atau hanya spasi | false (KF55) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT31 | `blokirAkun` | Negatif | akun sasaran tidak ditemukan | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT32 | `blokirAkun` | Normal | tanpa idLaporan | akun diblokir tanpa mengubah laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT33 | `blokirAkun` | Negatif | galat basis data di tengah transaksi | ROLLBACK dan galat dilempar | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT34 | `bukaBlokirAkun` | Normal | admin sah | blokir dibuka, listing dipulihkan, log admin dicatat (Algo-024) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT35 | `bukaBlokirAkun` | Negatif | bukan admin | false (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT36 | `bukaBlokirAkun` | Negatif | akun sasaran tidak ditemukan | false | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT37 | `bukaBlokirAkun` | Batas | alasan kosong | memakai alasan bawaan pada log admin | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT38 | `bukaBlokirAkun` | Negatif | galat basis data di tengah transaksi | ROLLBACK dan galat dilempar | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT39 | `pulihkanListingPengguna` | Normal | id akun | Barang.pulihkanKatalog dipanggil dengan klien transaksi | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT40 | `getStatistik` | Negatif | pemohon bukan admin | null tanpa membaca tabel laporan (KF56) | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT41 | `catatLogAdmin` | Normal | tindakan admin | diteruskan ke LogAdmin.catatTindakan dengan klien yang sama | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT42 | `nonaktifkanListingPengguna` | Normal | id akun | Barang.nonaktifkanByPemilik dipanggil dengan klien transaksi | Sesuai dengan hasil yang diharapkan | Pass |
| C21-UT43 | `getDetailLaporan` | Normal | laporan `pelapor-1` atas listing milik `penjual-1` | `pelapor` berisi `pelapor-1`, `terlapor` berisi akun `penjual-1` beserta status blokirnya | Pada `v9.0` hasilnya tidak memuat `terlapor`. Setelah commit `1711d55`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |
| C21-UT44 | `cariAkunTerlapor` | Normal | laporan atas percakapan yang dibuat pembeli | akun penjual, yaitu lawan bicara pelapor | Sesuai dengan hasil yang diharapkan (operasi baru pada commit `1711d55`) | Pass |
| C21-UT45 | `cariAkunTerlapor` | Negatif | objek bukan UUID; objek UUID yang listing maupun percakapannya sudah tidak ada | null; untuk objek bukan UUID tabel barang tidak dibaca | Sesuai dengan hasil yang diharapkan (operasi baru pada commit `1711d55`) | Pass |

Tabel 4.2.24b. Ringkasan Cakupan Kelas C21

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `otorisasiAdmin`, `getAllLaporan`, `filterByStatus`, `getDetailLaporan`, `ubahStatusLaporan`, `hapusListingDilaporkan`, `blokirAkun`, `nonaktifkanListingPengguna`, `bukaBlokirAkun`, `pulihkanListingPengguna`, `catatLogAdmin`, `catatLogAudit` |
| Operasi yang diuji | Kedua belas operasi, ditambah `getStatistik` (Implementasi B.1 No. 31) dan `cariAkunTerlapor` (ditambahkan pada perbaikan `1711d55`) |
| ID Algoritma yang tercakup | Algo-022, Algo-023, Algo-024 |
| Coverage (wajib ≥ 70%) | 100% baris, 87,5% cabang. Alat: Jest `--coverage`. Bukti: `coverage-modul-e.txt` |

### 4.2.25 Kelas Laporan

**ID Kelas:** C36
**Nama Kelas:** Laporan
**Tingkat:** Mendalam

Tabel 4.2.25. Hasil Pengujian Unit Kelas C36 (13 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C36-UT01 | `dariBaris` | Normal | baris snake_case dari basis data | objek Laporan camelCase | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT02 | `filterByStatus` | Negatif | status di luar Baru, Diproses, Selesai | [] tanpa kueri | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT03 | `updateStatusPenanganan` | Negatif | status tujuan "Batal" | false | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT04 | `validasiTransisiStatus` | Batas | alur maju, status sama, alur mundur, status tidak dikenal, null | hanya alur maju dan status sama yang true | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT05 | `simpanLaporanBaru` | Normal | data laporan | INSERT dengan status awal Baru, mengembalikan id laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT06 | `getAllLaporan` | Normal | dua baris di basis data | dua objek Laporan, terbaru lebih dulu | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT07 | `filterByStatus` | Normal | status Diproses | kueri WHERE status_penanganan = Diproses | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT08 | `getDetailLaporan` | Normal | id laporan yang ada | objek Laporan | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT09 | `getDetailLaporan` | Negatif | id laporan tidak ada | null | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT10 | `updateStatusPenanganan` | Normal | status Selesai, satu baris berubah | true dan waktu perubahan ikut disimpan | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT11 | `updateStatusPenanganan` | Negatif | id laporan tidak ada (0 baris berubah) | false | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT12 | `getStatistikStatus` | Normal | 5 Baru, 2 Diproses, 9 Selesai | jumlah per status dan Total 16 | Sesuai dengan hasil yang diharapkan | Pass |
| C36-UT13 | `getStatistikStatus` | Batas | belum ada laporan | semua status 0 dan Total 0 | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.25b. Ringkasan Cakupan Kelas C36

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpanLaporanBaru`, `getAllLaporan`, `filterByStatus`, `getDetailLaporan`, `updateStatusPenanganan` |
| Operasi yang diuji | Kelima operasi, ditambah `validasiTransisiStatus` dan `getStatistikStatus` |
| ID Algoritma yang tercakup | Algo-051 sampai Algo-055 |
| Coverage (wajib ≥ 70%) | 100% baris, 88,88% cabang. Alat: Jest `--coverage`. Bukti: `coverage-modul-e.txt` |

### 4.2.26 Kelas BuktiLaporan

**ID Kelas:** C37
**Nama Kelas:** BuktiLaporan
**Tingkat:** Mendalam

Tabel 4.2.26. Hasil Pengujian Unit Kelas C37 (7 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C37-UT01 | `validasiLampiranWajib` | Normal | satu berkas tidak kosong | true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT02 | `validasiLampiranWajib` | Batas | berkas berukuran 0 byte | false | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT03 | `dariBaris` | Normal | baris bukti_laporan | objek BuktiLaporan | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT04 | `validasiLampiranWajib` | Negatif | null, bukan array, atau array kosong | false | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT05 | `validasiLampiranWajib` | Batas | satu berkas berukuran 1 byte | true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT06 | `simpan` | Normal | metadata berkas bukti | INSERT ke bukti_laporan, true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT07 | `cariByLaporan` | Normal | id laporan | daftar bukti milik laporan tersebut | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.26b. Ringkasan Cakupan Kelas C37

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiLampiranWajib`, `simpan` |
| Operasi yang diuji | Kedua operasi, ditambah `cariByLaporan` |
| ID Algoritma yang tercakup | Algo-056, Algo-057 |
| Coverage (wajib ≥ 70%) | 100% baris, 73,33% cabang. Alat: Jest `--coverage`. Bukti: `coverage-modul-e.txt` |

### 4.2.27 Kelas LogAudit

**ID Kelas:** C38
**Nama Kelas:** LogAudit
**Tingkat:** Sedang

Tabel 4.2.27. Hasil Pengujian Unit Kelas C38 (5 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C38-UT01 | `dariBaris` | Normal | baris log_audit | objek LogAudit | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT02 | `struktur kelas` | Negatif | cari operasi update, edit, hapus, delete | tidak ada satu pun (KF48, KF49) | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT03 | `empat operasi catat` | Normal | id laporan, aktor, dan objek | tiap operasi menjalankan satu INSERT ke log_audit dengan teks tindakan yang benar | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT04 | `getRiwayatByLaporan` | Normal | id laporan | riwayat urut dari yang paling lama | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT05 | `catatPenerimaanLaporan` | Normal | dipanggil tanpa klien transaksi | memakai koneksi bawaan db | Sesuai dengan hasil yang diharapkan | Pass |

### 4.2.28 Kelas LogAdmin

**ID Kelas:** C39
**Nama Kelas:** LogAdmin
**Tingkat:** Sedang

Tabel 4.2.28. Hasil Pengujian Unit Kelas C39 (6 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C39-UT01 | `catatTindakan` | Normal | tindakan BLOKIR_AKUN beserta alasan | INSERT ke log_admin dengan seluruh nilai | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT02 | `catatTindakan` | Normal | dipanggil dengan klien transaksi | klien itu yang dipakai, bukan koneksi bawaan | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT03 | `catatTindakan` | Negatif | basis data menolak INSERT | galat diteruskan ke pemanggil agar transaksi dibatalkan | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT04 | `getAllLog` | Normal | dua baris | dua objek LogAdmin, terbaru lebih dulu | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT05 | `dariBaris` | Batas | baris kosong (undefined) | null | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT06 | `struktur kelas` | Negatif | cari operasi update, ubah, hapus, delete | tidak ada satu pun (KF55) | Sesuai dengan hasil yang diharapkan | Pass |

### 4.2.29 Kelas PenyimpananBerkas

**ID Kelas:** C45
**Nama Kelas:** PenyimpananBerkas
**Tingkat:** Mendalam

Tabel 4.2.29. Hasil Pengujian Unit Kelas C45 (6 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C45-UT01 | `simpan lalu hapus` | Normal | satu berkas buffer | tersimpan di /uploads/&lt;idObjek&gt;/ lalu terhapus, hasil true | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT02 | `simpan` | Normal | berkas sementara multer di disk | disalin ke folder objek dan berkas sementara dihapus | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT03 | `simpan` | Negatif | berkas kedua tanpa buffer maupun path | null, berkas pertama yang sempat tertulis dihapus | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT04 | `simpan` | Batas | daftar berkas kosong atau bukan array | [] tanpa membuat folder | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT05 | `hapus` | Normal | path /uploads/ yang ada dan yang sudah tidak ada | berkas yang ada terhapus, hasil true | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT06 | `hapus` | Batas | daftar kosong atau null | true tanpa menyentuh disk | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.29b. Ringkasan Cakupan Kelas C45

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan`, `hapus` |
| Operasi yang diuji | Kedua operasi, pada mode disk lokal (C45-UT01 s.d. C45-UT06) dan mode Vercel Blob (8 test di `PenyimpananBerkasBlob.test.js`) |
| ID Algoritma yang tercakup | Algo-072, Algo-073 |
| Coverage (wajib ≥ 70%) | 100% baris, 73,33% cabang. Alat: Jest `--coverage`. Bukti: `coverage-modul-e.txt` |

<br>

### 4.2.30 Kelas KatalogController

**ID Kelas:** C15  
**Nama Kelas:** KatalogController  
**Tingkat:** Mendalam

Barang (C29) diganti tiruan; C16 dan C17 dipakai apa adanya (`src/tests/unit/KatalogController.test.js`).

Tabel 4.2.30. Hasil Pengujian Unit Kelas C15

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C15-UT01 | `getProduk(req, res)` | Normal | Query kosong (katalog UC13); Barang membalas 1 listing | `getKatalog` dipanggil dengan urutan "terbaru", batas 20, offset 0; status 200 tanpa pesan; paginasi `{halaman: 1, totalHalaman: 1, totalItem: 1, ukuranHalaman: 20}` | Argumen dan paginasi sama persis; status 200; `pesan` tidak ada | Pass |
| C15-UT02 | `getProduk(req, res)` | Normal | `q = "  Jas PRAKTIKUM "`, kategori "Jas praktikum", harga 50000–150000, lokasi "Labtek V", urut "termurah", halaman 2; total 45 | `daftarKata ["jas","praktikum"]`, harga berupa angka, offset 20; paginasi 2 dari 3 halaman; `kriteria.kataKunci = "jas praktikum"` | Sesuai seluruhnya | Pass |
| C15-UT03 | `getProduk(req, res)` | Batas | Total 0, 20, 21, 40, 41 listing | Total halaman 1, 1, 2, 2, 3 | 1, 1, 2, 2, 3 | Pass |
| C15-UT04 | `getProduk(req, res)` | Negatif | `q = "tidakada"`; Barang membalas daftar kosong | Daftar `[]`, total halaman 1, pesan "Barang tidak ditemukan." (KF29) | Sesuai | Pass |
| C15-UT05 | `getProduk(req, res)` | Batas | Halaman 5 dengan total 21 listing | Offset 80; status 200 dengan daftar kosong dan pesan "Barang tidak ditemukan.", bukan galat | Offset 80; status 200; `paginasi {halaman: 5, totalHalaman: 2}` | Pass |
| C15-UT06 | `getProduk(req, res)` | Negatif | `hargaMin = 200000`, `hargaMaks = 50000` | Galat berstatus 400; `getKatalog` tidak dipanggil | Galat 400; `getKatalog` dipanggil 0 kali | Pass |
| C15-UT07 | `getProduk(req, res)` | Negatif | `getKatalog` melempar "koneksi putus" | Galat diteruskan ke penangan galat | Promise ditolak dengan galat "koneksi putus" | Pass |
| C15-UT08 | `getDetailProduk(req, res)` | Normal | ID listing milik penjual lain, dibuka pembeli | Status 200; data listing dengan `milikSendiri = false`; `getDetailKatalog` dipanggil dengan ID tersebut | Sesuai | Pass |
| C15-UT09 | `getDetailProduk(req, res)` | Normal | Dibuka oleh pemilik listing (UC15 Alternatif 1) | `milikSendiri = true` | `true` | Pass |
| C15-UT10 | `getDetailProduk(req, res)` | Batas | Permintaan tanpa `req.akun` | `milikSendiri = false` | `false` | Pass |
| C15-UT11 | `getDetailProduk(req, res)` | Negatif | `getDetailKatalog` membalas `null` (UC15 Alternatif 2) | Galat 404 "Listing tidak ditemukan atau sudah tidak tersedia." | Galat 404 dengan pesan tersebut | Pass |

Tabel 4.2.30b. Ringkasan Cakupan Kelas C15

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getProduk()`, `paginasi()`, `urutkanHasil()` |
| Operasi yang diuji | `getProduk`, `getDetailProduk` (tambahan untuk UC15). `paginasi` dan `urutkanHasil` pindah ke C17 dan C29 (M9 B.1 No. 22, 24) dan diuji di sana |
| ID Algoritma yang tercakup | Algo-013 |
| Coverage (wajib ≥ 70%) | `KatalogController.js` 100% baris, 100% cabang, 100% fungsi |

### 4.2.31 Kelas PencarianController

**ID Kelas:** C16  
**Nama Kelas:** PencarianController  
**Tingkat:** Mendalam

Fungsi murni tanpa basis data (`src/tests/unit/PencarianController.test.js`).

Tabel 4.2.31. Hasil Pengujian Unit Kelas C16

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C16-UT01 | `normalisasiKataKunci(kataKunci): String` | Normal | `"  Meja   BELAJAR  "` | `"meja belajar"` | `"meja belajar"` | Pass |
| C16-UT02 | `normalisasiKataKunci(kataKunci)` | Negatif | `undefined`, `null`, `"   "` | `""` untuk ketiganya | `""` | Pass |
| C16-UT03 | `normalisasiKataKunci(kataKunci)` | Batas | 500 huruf "a" | Dipotong menjadi 100 karakter | Panjang 100 | Pass |
| C16-UT04 | `normalisasiKataKunci(kataKunci)` | Batas | Tepat 100 huruf "b" | Tidak berubah | Sama dengan masukan | Pass |
| C16-UT05 | `normalisasiKataKunci(kataKunci)` | Batas | `"ＭＥＪＡ"` + spasi ideografis + `"Belajar"` | `"meja belajar"` (normalisasi NFKC) | `"meja belajar"` | Pass |
| C16-UT06 | `normalisasiKataKunci(kataKunci)` | Batas | `"Diskon 50%_baru"` | `%` dan `_` tetap ada: `"diskon 50%_baru"` | `"diskon 50%_baru"` | Pass |
| C16-UT07 | `pecahKataKunci(kataKunciNormal): List` | Normal | `"meja meja belajar"` | `["meja", "belajar"]` | `["meja", "belajar"]` | Pass |
| C16-UT08 | `pecahKataKunci(kataKunciNormal)` | Batas | `"a b c d e f g"` | 5 kata pertama | `["a","b","c","d","e"]` | Pass |
| C16-UT09 | `pecahKataKunci(kataKunciNormal)` | Negatif | `""` | `[]` | `[]` | Pass |
| C16-UT10 | `siapkanPencarian(kataKunci)` | Normal | `" Kalkulator  Casio "` | `{kataKunci: "kalkulator casio", daftarKata: ["kalkulator","casio"]}` | Sesuai | Pass |
| C16-UT11 | `siapkanPencarian(kataKunci)` | Negatif | `undefined` (katalog tanpa pencarian) | `{kataKunci: "", daftarKata: []}` | Sesuai | Pass |

Tabel 4.2.31b. Ringkasan Cakupan Kelas C16

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `cocokkanKataKunci()`, `normalisasiKataKunci()` |
| Operasi yang diuji | `normalisasiKataKunci`, `pecahKataKunci`, `siapkanPencarian` (mewujudkan `cocokkanKataKunci`, M9 B.1 No. 23). Pencocokan `ILIKE` diuji pada C29-UT19, C29-UT20, dan INT-TC37 |
| ID Algoritma yang tercakup | Algo-014 |
| Coverage (wajib ≥ 70%) | `PencarianController.js` 100% baris, 100% cabang, 100% fungsi |

### 4.2.32 Kelas FilterController

**ID Kelas:** C17  
**Nama Kelas:** FilterController  
**Tingkat:** Mendalam

Fungsi murni tanpa basis data (`src/tests/unit/FilterController.test.js`).

Tabel 4.2.32. Hasil Pengujian Unit Kelas C17

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C17-UT01 | `validasiFilter(query): Map` | Normal | `{}` dan tanpa argumen | Kategori, lokasi, dan harga `null`; urut "terbaru"; halaman 1 | Sesuai untuk keduanya | Pass |
| C17-UT02 | `validasiFilter(query)` | Normal | Kategori "Kalkulator", lokasi "Labtek V", harga "10000"–"50000", urut "TERMURAH", halaman "3" | Harga menjadi angka, urut "termurah", halaman 3 | Sesuai | Pass |
| C17-UT03 | `validasiFilter(query)` | Negatif | Harga minimum 200000, maksimum 50000 (UC14 Alternatif 2) | Galat "Harga minimum tidak boleh lebih besar dari harga maksimum." | Galat dengan pesan tersebut | Pass |
| C17-UT04 | `validasiFilter(query)` | Batas | Minimum = maksimum = 50000; minimum = maksimum = 0 | Diterima | Diterima, nilai 50000 dan 0 | Pass |
| C17-UT05 | `validasiFilter(query)` | Negatif | `hargaMin "-1"`, `hargaMaks "murah"`, `hargaMaks "Infinity"` | Ketiganya ditolak "... harus berupa angka tidak negatif." | Ketiganya ditolak | Pass |
| C17-UT06 | `validasiFilter(query)` | Negatif | Urut "acak" dan "harga; DROP TABLE barang" | Ditolak dengan pesan urutan | Keduanya ditolak | Pass |
| C17-UT07 | `validasiFilter(query)` | Batas | Urut `" Termahal "` | "termahal" | "termahal" | Pass |
| C17-UT08 | `validasiFilter(query)` | Negatif | Halaman "0", "-1", "1.5", "dua" | Keempatnya ditolak "Nomor halaman harus bilangan bulat mulai dari 1." | Keempatnya ditolak | Pass |
| C17-UT09 | `validasiFilter(query)` | Batas | Kategori dan lokasi tepat 50 karakter | Diterima | Diterima | Pass |
| C17-UT10 | `validasiFilter(query)` | Batas | Kategori atau lokasi 51 karakter | Ditolak "Kategori tidak valid." / "Lokasi COD tidak valid." | Keduanya ditolak dengan pesan tersebut | Pass |
| C17-UT11 | `validasiFilter(query)` | Negatif | Urut "acak" | Galat berstatus HTTP 400 | `status = 400` | Pass |
| C17-UT12 | `hitungPaginasi(halaman, ukuranHalaman)` | Normal | Halaman 1 | `{batas: 20, offset: 0}` (KF28) | Sesuai | Pass |
| C17-UT13 | `hitungPaginasi(halaman, ukuranHalaman)` | Normal | Halaman 3 | `{batas: 20, offset: 40}` | Sesuai | Pass |
| C17-UT14 | `hitungPaginasi(halaman, ukuranHalaman)` | Batas | Halaman 2, ukuran 5 | `{batas: 5, offset: 5}` | Sesuai | Pass |

Tabel 4.2.32b. Ringkasan Cakupan Kelas C17

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `filterCategory()`, `filterPrice()`, `filterLocation()`, `validasiParameterFilter()` |
| Operasi yang diuji | `validasiFilter` (mewujudkan `validasiParameterFilter`) dan `hitungPaginasi`. `filterCategory`, `filterPrice`, dan `filterLocation` menjadi klausa `WHERE` di `Barang.getKatalog` (M9 B.1 No. 23) dan diuji pada C29-UT21, C29-UT22, INT-TC38 |
| ID Algoritma yang tercakup | Algo-015 |
| Coverage (wajib ≥ 70%) | `FilterController.js` 100% baris, 100% cabang, 100% fungsi |

Catatan: `validasiFilter` tidak membatasi nomor halaman dari atas. Dampaknya terlihat pada INT-TC45 (Subbab 4.3).

### 4.2.33 Kelas Barang (operasi katalog)

**ID Kelas:** C29  
**Nama Kelas:** Barang (`getKatalog`, `getDetailKatalog`)  
**Tingkat:** Mendalam

Lanjutan Subbab 4.2.17 untuk operasi katalog Modul C. Klien basis data diganti tiruan yang merekam teks SQL dan parameternya (`src/tests/unit/BarangKatalog.test.js`); pengujian dengan PostgreSQL sungguhan ada pada INT-TC35 s.d. INT-TC43.

Tabel 4.2.33. Hasil Pengujian Unit Kelas C29 (operasi katalog)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C29-UT17 | `getKatalog(kriteria, client)` | Normal | Kriteria kosong | Kueri COUNT dan data memuat `b.status = $1` dan `a.status_blokir = FALSE`; urutan `b.waktu_unggah DESC`; parameter `["Tersedia", 20, 0]` | Sesuai | Pass |
| C29-UT18 | `getKatalog(kriteria, client)` | Normal | Satu baris dengan harga `"150000.00"`, foto utama, nama penjual | Objek `Barang` dengan harga 150000, `fotoUtama`, `namaPenjual`; total 1 | Sesuai | Pass |
| C29-UT19 | `getKatalog(kriteria, client)` | Normal | `daftarKata ["jas", "praktikum"]` | Dua syarat `(b.judul ILIKE $n OR b.deskripsi_kondisi ILIKE $n)` digabung AND; parameter `"%jas%"`, `"%praktikum%"` (KF25) | Sesuai | Pass |
| C29-UT20 | `getKatalog(kriteria, client)` | Batas | `daftarKata ["50%", "a_b", "c\d"]` | Parameter `"%50\%%"`, `"%a\_b%"`, `"%c\\d%"` (karakter pola diloloskan) | Sesuai | Pass |
| C29-UT21 | `getKatalog(kriteria, client)` | Normal | Kategori, lokasi, harga 50000–200000 | Empat syarat `WHERE` berparameter `$2` s.d. `$5` (KF26) | Sesuai | Pass |
| C29-UT22 | `getKatalog(kriteria, client)` | Batas | `hargaMin = 0` | Syarat `b.harga >= $2` tetap dipakai dengan nilai 0 | Sesuai | Pass |
| C29-UT23 | `getKatalog(kriteria, client)` | Normal | Urut "termurah" dan "termahal" | `ORDER BY b.harga ASC, ...` dan `ORDER BY b.harga DESC, ...` (KF27) | Sesuai | Pass |
| C29-UT24 | `getKatalog(kriteria, client)` | Negatif | Urut `"b.harga; DROP TABLE barang"` | Jatuh ke urutan "terbaru"; teks masukan tidak muncul di SQL | Sesuai; SQL tidak memuat "DROP TABLE" | Pass |
| C29-UT25 | `getKatalog(kriteria, client)` | Normal | Kategori, batas 20, offset 40 | `LIMIT $3 OFFSET $4` dengan parameter 20 dan 40 (KF28) | Sesuai | Pass |
| C29-UT26 | `getDetailKatalog(idBarang, client)` | Normal | Baris listing "Terjual" dengan dua foto | Syarat `b.status IN ($2, $3)` dan akun tidak diblokir; parameter `["b1", "Tersedia", "Terjual"]`; `daftarFoto` berurutan dan `penjual {idAkun, nama}` (KF17) | Sesuai | Pass |
| C29-UT27 | `getDetailKatalog(idBarang, client)` | Negatif | Kueri membalas nol baris | `null` | `null` | Pass |

Tabel 4.2.33b. Ringkasan Cakupan Kelas C29

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | Lihat Tabel 4.2.17b. Bagian Modul C: `getKatalog()`; `getDetailKatalog()` ditambahkan untuk UC15 (M9 B.1 No. 24) |
| Operasi yang diuji | `getKatalog`, `getDetailKatalog` |
| ID Algoritma yang tercakup | Algo-032 |
| Coverage (wajib ≥ 70%) | `Barang.js` (seluruh berkas, `npx jest --coverage` pada seluruh unit test setelah digabung dengan test Modul E, 586 test) **100% baris, 86% cabang, 100% fungsi**. Cabang yang belum tercakup berada di konstruktor dan `dariBaris` (baris 46–57) serta nilai bawaan parameter pada baris 116, 174, dan 219. Angka ini menggantikan 45,58% pada Tabel 4.2.17b dan 51,47% pada catatan Tabel 4.2.17c, yang keduanya diukur tanpa C29-UT17 s.d. C29-UT27 |

<br>

### 4.2.34 Kelas HalamanKatalog

**ID Kelas:** C05  
**Nama Kelas:** HalamanKatalog  
**Tingkat:** Sedang

Skrip View dijalankan di konteks `vm` Node.js dengan DOM, `Api`, `history`, dan `location` tiruan, bersama `ListingUI.js` yang asli (`src/tests/unit/ViewKatalog.test.js`).

Tabel 4.2.34. Hasil Pengujian Unit Kelas C05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C05-UT01 | `terapkan(kriteriaBaru): void` | Normal | `q` "jas", kategori "Jas praktikum", harga 50000–150000, urut "termurah"; API membalas 1 listing | `history.pushState` ke `/katalog?q=jas&kategori=Jas+praktikum&hargaMin=50000&hargaMaks=150000&urut=termurah`; `GET /api/katalog` dengan query yang sama; formulir terisi kategori tersebut | Sesuai | Pass |
| C05-UT02 | `terapkan(kriteriaBaru): void` | Negatif | Harga minimum 200000, maksimum 50000 | Pesan "Harga minimum tidak boleh lebih besar dari harga maksimum." tampil; URL tidak berubah; API tidak dipanggil | Pesan tampil; `pushState` dan `Api.kirim` dipanggil 0 kali | Pass |
| C05-UT03 | `keQuery(kriteria): String` | Normal | `{halaman: 2, q: "  meja ", kategori: "", lokasi: "   ", urut: "terbaru"}` dan `{}` | `"q=meja&urut=terbaru&halaman=2"` dan `""` | Sesuai | Pass |
| C05-UT04 | `render(data): void` | Normal | 20 listing dari total 24 pada halaman 1 | 20 kartu, "24 barang ditemukan", keadaan kosong tersembunyi, navigasi "Halaman 1 dari 2", Sebelumnya nonaktif, Berikutnya aktif | Sesuai | Pass |
| C05-UT05 | `render(data): void` | Negatif | Daftar kosong, total 0 | Keadaan kosong "Barang tidak ditemukan" tampil; navigasi tersembunyi | Sesuai | Pass |
| C05-UT06 | `render(data): void` | Batas | Daftar kosong, total 24, halaman 5 | "Halaman tidak tersedia" dan "Katalog hanya memiliki 2 halaman." | Sesuai | Pass |

### 4.2.35 Kelas HalamanDetailBarang

**ID Kelas:** C07  
**Nama Kelas:** HalamanDetailBarang  
**Tingkat:** Sedang

Diuji dengan konteks `vm` yang sama (`src/tests/unit/ViewKatalog.test.js`).

Tabel 4.2.35. Hasil Pengujian Unit Kelas C07

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C07-UT01 | `renderAksi(barang): void` | Normal | Listing Tersedia, `milikSendiri = false` | Tombol "Kirim pesan", tautan Laporkan ke `/laporan-form?objek=<id>&jenis=Listing`, kotak pesan tampil | Sesuai | Pass |
| C07-UT02 | `renderAksi(barang): void` | Normal | `milikSendiri = true` (UC15 Alternatif 1) | Hanya "Ini listing milik Anda." dan tautan "Ubah Listing" ke `/listing-form?id=<id>`; kotak pesan tersembunyi | Sesuai; tidak ada tombol Hapus atau Tandai Terjual (bandingkan UC15-TC02) | Pass |
| C07-UT03 | `renderAksi(barang): void` | Batas | Listing Terjual (UC15 Alternatif 3) | "Barang ini sudah terjual."; tidak ada "Kirim pesan"; kotak pesan tersembunyi | Sesuai | Pass |
| C07-UT04 | `mulai(): void` | Negatif | `?id=bukan-uuid` | API tidak dipanggil; pesan "ID listing tidak valid."; detail tidak dirender | Sesuai | Pass |
| C07-UT05 | `mulai(): void` | Negatif | ID sah; API membalas 404 "Listing tidak ditemukan atau sudah tidak tersedia." | `GET /api/katalog/<id>` dipanggil; pesan server ditampilkan | Sesuai | Pass |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Test integrasi dengan komponen nyata berada di `src/tests/db/` (Modul A: `ModulA.test.js`) dan dijalankan dengan `npm run test:db`. Sebelum test berjalan, `globalSetup` membuat ulang basis data `itbeli_uji` dari `database/schema.sql` dan mengisi dokumen legal versi 1.0, sehingga data pengembangan tidak tersentuh. Seluruh komponen nyata, tanpa *mock*: PostgreSQL 16.15 (Docker), Mailpit 1.21.8 sebagai server SMTP yang kotak masuknya dibaca lewat API-nya, dan *token endpoint* Google.

DPPL tidak memiliki daftar antarmuka antarkomponen, sehingga daftar berikut disusun dari dependensi kelas pada Tabel 4.1 DPPL. Awalan `AK-XX` dipakai karena `I-XX` sudah dipakai DPPL untuk layar.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| AK-01 | AkunController (C13) | Akun, TokenVerifikasi, SesiLogin (C23, C27, C28) | Controller - Model | INT-TC01, INT-TC02, INT-TC05, INT-TC06, INT-TC07 |
| AK-02 | Akun, Admin, TokenVerifikasi, SesiLogin (C23, C26, C27, C28) | PostgreSQL (tabel `akun`, `token_verifikasi`, `sesi_login`) | Aplikasi - Basis data | INT-TC01, INT-TC02, INT-TC06, INT-TC08, INT-TC09 |
| AK-03 | Otorisasi (C41) | SesiLogin (C28), Admin (C26) | Pendukung - Model | INT-TC07, INT-TC08, INT-TC09 |
| AK-04 | NotifikasiController (C19) melalui SurelAdapter (C43) | Server SMTP (Mailpit lokal; Gmail SMTP pada versi daring) | Aplikasi - Sistem eksternal | INT-TC03, INT-TC04 |
| AK-05 | SsoController | Google OAuth 2.0 (`oauth2.googleapis.com/token`) | Aplikasi - Sistem eksternal | INT-TC11 |
| AK-06 | DokumenLegalController (C22) | DokumenLegal (C40) dan tabel `dokumen_legal` | Controller - Model - Basis data | INT-TC10 |
| AK-07 | HalamanOtentikasi dan HalamanProfil (C01, C02) melalui HTTP `/api/akun/*` | `akunRoutes` dan AkunController (C13) | View - Controller | INT-TC12 |
| AK-08 | BarangController (C14) | ListingService, Barang dan ListingPenjual (C29) | Controller - Service - Model | INT-TC13 s.d. INT-TC23 |
| AK-09 | Barang, FotoBarang, ListingPenjual (C29, C30) | PostgreSQL (`barang`, `foto_barang`, serta akun/sesi fixture) | Aplikasi - Basis data | INT-TC13 s.d. INT-TC23 |
| AK-10 | ListingService | PenyimpananBerkas (C45), disk lokal | Aplikasi - Penyimpanan berkas | INT-TC13, INT-TC21, INT-TC23 |
| AK-11 | LaporanController (C20) | Laporan, BuktiLaporan, LogAudit (C36, C37, C38) | Controller - Model | INT-TC24, INT-TC25, INT-TC31 |
| AK-12 | Laporan, BuktiLaporan, LogAudit, LogAdmin (C36, C37, C38, C39) | PostgreSQL (tabel `laporan`, `bukti_laporan`, `log_audit`, `log_admin`) | Aplikasi - Basis data | INT-TC24 s.d. INT-TC30 |
| AK-13 | ModerasiController (C21) | Akun, SesiLogin, Barang, FotoBarang, Laporan, LogAudit, LogAdmin (C23, C28, C29, C30, C36, C38, C39) | Controller - Model | INT-TC26 s.d. INT-TC30 |
| AK-14 | LaporanController dan ModerasiController (C20, C21) melalui PenyimpananBerkas (C45) | Folder `src/uploads/` di disk | Aplikasi - Penyimpanan berkas | INT-TC24, INT-TC30, INT-TC31 |
| AK-15 | PenyimpananBerkas (C45) | Vercel Blob | Aplikasi - Sistem eksternal | INT-TC32 |
| AK-16 | ModerasiController (C21) melalui NotifikasiController dan SurelAdapter (C19, C43) | Server SMTP (penangkap SMTP lokal pada pengujian Modul E; Gmail SMTP pada versi daring) | Aplikasi - Sistem eksternal | INT-TC33 |
| AK-17 | FormulirLaporan dan DasborAdmin (C10, C11) melalui HTTP `/api/laporan` dan `/api/admin/*` | `laporanRoutes`, `moderasiRoutes`, LaporanController, ModerasiController (C20, C21) | View - Controller | INT-TC31, INT-TC34 |
| AK-8 | KatalogController (C15) | PencarianController (C16), FilterController (C17), Barang (C29) | Controller - Model | INT-TC35 s.d. INT-TC43, INT-TC45 |
| AK-9 | Barang (C29): `getKatalog`, `getDetailKatalog` | PostgreSQL (tabel `barang`, `akun`, `foto_barang`) | Aplikasi - Basis data | INT-TC35 s.d. INT-TC43, INT-TC45 |
| AK-10 | Klien HTTP (dipakai C05 HalamanKatalog dan C07 HalamanDetailBarang) ke `/api/katalog` | `katalogRoutes`, Otorisasi (C41), dan KatalogController (C15) | View - Controller | INT-TC35 s.d. INT-TC45 |
| *[AK-XX]* | *[Komponen asal]* | *[Komponen tujuan]* | *[Jenis batas]* | *[ID test case]* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | AK-01, AK-02 | Normal: daftar akun | `daftarAkun(" Mahasiswa Uji ", "13599999", <SUREL.ACAK@ITB.AC.ID>, "rahasia123", true)`, lalu baca langsung tabel `akun` dan `token_verifikasi` | Satu baris akun "Belum Terverifikasi", surel huruf kecil, peran "Pengguna", hash bcrypt 60 karakter tanpa teks asli; satu token "Aktif" 6 digit berlaku 15 menit | Baris akun dan token sesuai; hash cocok dengan pola `$2b$10$` + 53 karakter; selisih `waktu_kedaluwarsa - waktu_buat` = 900.000 ms | Pass |
| INT-TC02 | AK-01, AK-02 | Gagal: surel ganda beda huruf besar/kecil | Daftar dengan surel S, lalu dengan surel S berhuruf besar lewat Controller dan langsung lewat `Akun.simpan` | Controller mengembalikan `SUREL_TERDAFTAR`; `Akun.simpan` ditolak indeks unik `akun_email_unik` (kode 23505); tetap satu baris | Sesuai; jumlah baris untuk surel tersebut tetap 1 | Pass |
| INT-TC03 | AK-04 | Normal: kirim kode verifikasi | Daftar akun, lalu baca kotak masuk Mailpit lewat `GET /api/v1/search` | Surel dari no-reply@itbeli.local ke alamat pendaftar, subjek "Kode Verifikasi ITBELI", kode di surel sama dengan kode di tabel, memuat "Kode berlaku selama 15 menit." | Sesuai; tangkapan layar Mailpit pada 4.6 | Pass |
| INT-TC04 | AK-04 | Gagal: server SMTP tidak dapat dihubungi | `SurelAdapter` diarahkan ke 127.0.0.1 port 1, lalu `kirimSurel(...)` | `false` tanpa melempar galat | `false`; galat `ECONNREFUSED` tercatat di log | Pass |
| INT-TC05 | AK-01, AK-02 | Normal: verifikasi dengan kode dari surel | Ambil kode dari Mailpit, `verifikasiAkun(email, kode)`, lalu ulangi dengan kode yang sama | Akun "Terverifikasi", token "Terpakai"; percobaan kedua ditolak | Status akun "Terverifikasi", token `["Terpakai"]`; percobaan kedua `SUDAH_TERVERIFIKASI` | Pass |
| INT-TC06 | AK-01, AK-02 | Gagal lalu pulih: kode kedaluwarsa dan kirim ulang | Mundurkan `waktu_kedaluwarsa` token 1 detik, verifikasi dengan kode lama, `kirimUlangKode`, verifikasi dengan kode baru dari surel kedua | Kode lama `KODE_KEDALUWARSA` tanpa mengubah status; token lama "Hangus", token baru "Aktif"; kode baru diterima | Sesuai; urutan status token `["Hangus", "Aktif"]`; verifikasi kode baru `berhasil: true` | Pass |
| INT-TC07 | AK-01, AK-02, AK-03 | Normal: login dan logout | `login` akun terverifikasi, baca tabel `sesi_login`, `Otorisasi.verifikasiToken`, `logout`, periksa lagi | Sesi aktif berlaku 24 jam dan dikenali Otorisasi; setelah logout `status_aktif = false` dan token ditolak | Selisih masa berlaku 86.400.000 ms; `getIdAkun()` sesuai; setelah logout `status_aktif = false` dan `verifikasiToken` mengembalikan `null` | Pass |
| INT-TC08 | AK-02, AK-03 | Gagal: sesi kedaluwarsa dan akun diblokir | Mundurkan satu sesi; blokir akun dan cabut sesi dalam satu transaksi (`BEGIN`, `blokir(klien)`, `nonaktifkanByAkun(id, klien)`, `COMMIT`); login ulang | Sesi kedaluwarsa ditolak; sesi lama tidak berlaku; `status_blokir = true`; login `AKUN_DIBLOKIR` | Sesuai | Pass |
| INT-TC09 | AK-02, AK-03 | Normal dan gagal: peran admin | Sisipkan admin aktif, admin diblokir, dan pengguna; panggil `Admin.verifikasiPeran` dan `Otorisasi.verifikasiAdmin` | `true` hanya untuk admin aktif; `verifikasiAdmin` mengembalikan sesi admin dan `null` untuk pengguna | `true`, `false`, `false`; sesi admin dikembalikan, pengguna `null` | Pass |
| INT-TC10 | AK-06 | Normal: dokumen legal berlaku | Tambah versi 1.1 belum terbit dan versi 2.0 berlaku 30 hari lagi, lalu `getDokumen("kebijakan-privasi")`, `getKlausaPrivasi()`, `getTautanDokumenLegal()`, `getDokumen("bukan-jenis")` | Versi 1.0 (berlaku 2026-11-01); klausul "tidak dapat diakses admin maupun pengembang"; tautan "/legal?jenis=kebijakan-privasi"; jenis lain `null` | Sesuai | Pass |
| INT-TC11 | AK-05 | Gagal: Google menolak pertukaran kode | `mulai("google")` dengan *client* uji, lalu `selesaikan` dengan state benar dan kode tidak sah, sehingga permintaan sungguhan dikirim ke *token endpoint* Google | URL otorisasi mengarah ke `accounts.google.com`; Google membalas 4xx; hasil `PERTUKARAN_GAGAL`; jumlah sesi tidak bertambah | Sesuai; log mencatat "token endpoint membalas 4xx" dari Google | Pass |
| INT-TC12 | AK-07 | Normal: alur HTTP lengkap | `POST /api/akun/daftar`, kode dari Mailpit, `POST /verifikasi`, `GET /profil`, `POST /logout`, `GET /profil` | 201, 200 dengan token, profil berisi identitas tanpa hash, logout 200, profil sesudahnya 401 | Sesuai | Pass |
| INT-TC13 | AK-08, AK-09, AK-10 | Normal: buat listing (UC07) | POST multipart: Buku Introduction to Algorithms, Rp120.000, kategori Buku kuliah, Labtek V, satu PNG; baca DB dan disk | 201, pemilik sesuai sesi, status Tersedia, satu metadata dan berkas foto | 201; status Tersedia; satu foto; berkas benar-benar ada | Pass |
| INT-TC14 | AK-08, AK-09 | Normal: daftar pemilik (UC08) | GET `/api/barang/saya` dengan sesi penjual pertama | Daftar hanya milik akun sesi dan memuat listing baru | 200; seluruh ID pemilik sesuai sesi; listing baru ditemukan | Pass |
| INT-TC15 | AK-08, AK-09 | Normal: ubah listing (UC09) | PUT judul Buku Introduction to Algorithms Edisi Ketiga dan harga 90.000, pertahankan ID foto lama; baca DB | Perubahan tersimpan, foto lama tetap dipakai | 200; DB judul Buku Introduction to Algorithms Edisi Ketiga, harga 90000 | Pass |
| INT-TC16 | AK-08, AK-09 | Negatif: bukan pemilik (UC09, UC10) | GET/PUT/DELETE listing penjual pertama memakai sesi penjual kedua | Seluruhnya 403; data listing tidak berubah | [403, 403, 403]; harga tetap 90000 | Pass |
| INT-TC17 | AK-08, AK-09 | Normal: tandai terjual (UC11) | PATCH Tersedia → Terjual; baca status DB, katalog, dan daftar pemilik | Terjual, hilang dari katalog, tetap ada di riwayat pemilik | 200; Terjual; katalog tidak memuat ID; daftar pemilik memuatnya sebagai Terjual | Pass |
| INT-TC18 | AK-08, AK-09 | Negatif: penandaan ganda (UC11) | Ulang PATCH dengan status asal Tersedia ketika DB sudah Terjual | Konflik 409; status tidak berubah | 409; tetap Terjual | Pass |
| INT-TC19 | AK-08, AK-09 | Normal: batal terjual (UC12) | PATCH Terjual → Tersedia; baca DB dan katalog | Tersedia dan kembali tampil di katalog | 200; Tersedia; ID ditemukan di katalog | Pass |
| INT-TC20 | AK-08, AK-09 | Negatif: pembatalan ganda (UC12) | Ulang PATCH dengan status asal Terjual ketika DB sudah Tersedia | Konflik 409; status tidak berubah | 409; tetap Tersedia | Pass |
| INT-TC21 | AK-08, AK-09, AK-10 | Batas: lima foto (UC07) | POST listing dengan lima PNG dan urutan baru:0 s.d. baru:4 | Diterima, lima metadata foto | 201; jumlah metadata foto = 5 | Pass |
| INT-TC22 | AK-08, AK-09 | Negatif: data/foto tidak sah (UC07) | POST judul kosong, tanpa foto, lalu enam foto | Seluruhnya 400 | [400, 400, 400] | Pass |
| INT-TC23 | AK-08, AK-09, AK-10 | Normal: hapus permanen (UC10) | DELETE listing; periksa barang, metadata foto, dan path berkas | Listing/metadata/berkas hilang | 200; barang null; metadata = 0; berkas tidak ada | Pass |
| INT-TC24 | AK-11, AK-12, AK-14 | Normal: laporan baru tersimpan | `LaporanController.buatLaporan` dengan token sesi akun uji, data lengkap, dan satu PNG; baca tabel dan disk langsung | Satu baris `laporan` berstatus Baru milik pelapor, satu `bukti_laporan` yang menunjuk berkas berisi PNG yang sama di disk, dan satu `log_audit` "Penerimaan laporan" | Satu baris `laporan` berstatus Baru milik pelapor dengan jenis Penipuan; satu `bukti_laporan` yang berkasnya di disk identik byte per byte dengan PNG masukan; `log_audit` berisi tepat satu catatan "Penerimaan laporan" oleh pelapor | Pass |
| INT-TC25 | AK-11, AK-12 | Gagal: penyimpanan bukti gagal di tengah transaksi | Bukti PNG lolos validasi tetapi tidak membawa isi, sehingga PenyimpananBerkas gagal menulis | `GALAT_SERVER`; tidak ada baris `laporan` maupun `log_audit` baru untuk pelapor (transaksi dibatalkan) | `GALAT_SERVER`; 0 baris `laporan` dan 0 baris `log_audit` untuk pelapor | Pass |
| INT-TC26 | AK-12, AK-13 | Normal: ubah status laporan | `ubahStatusLaporan` Baru ke Diproses dengan token admin, lalu coba mundur ke Baru | Status Diproses dan `waktu_perubahan` bertambah; percobaan mundur ditolak; `log_audit` berisi tepat "Penerimaan laporan" dan "Perubahan status laporan menjadi Diproses" | Status Diproses dan `waktu_perubahan` lebih baru dari sebelumnya; percobaan mundur ke Baru mengembalikan `false`; `log_audit` berisi tepat dua catatan dengan urutan yang diharapkan, catatan kedua oleh admin | Pass |
| INT-TC27 | AK-12, AK-13 | Normal: blokir akun | Penjual dengan dua listing Tersedia dan satu sesi aktif diblokir dari sebuah laporan | Akun Diblokir, kedua listing Dinonaktifkan, sesi tidak aktif, laporan Selesai, `log_admin` BLOKIR_AKUN beserta alasan, `log_audit` "Pemblokiran akun", login ulang ditolak | `status_akun` Diblokir dan `status_blokir` true; kedua listing Dinonaktifkan; 0 sesi aktif; laporan Selesai; `log_admin` BLOKIR_AKUN "Penipuan berulang" oleh admin; `log_audit` memuat "Pemblokiran akun: &lt;idAkun&gt;"; login ulang `AKUN_DIBLOKIR` | Pass |
| INT-TC28 | AK-12, AK-13 | Gagal: galat di tengah blokir akun | Blokir dengan ID laporan yang tidak ada, sehingga INSERT `log_audit` melanggar *foreign key* setelah akun dan listing sempat diubah | Galat dilempar; akun tidak diblokir, listing tetap Tersedia, sesi tetap aktif, tidak ada `log_admin` | Galat dilempar; `status_blokir` tetap false, listing tetap Tersedia, satu sesi masih aktif, dan 0 baris `log_admin` untuk akun tersebut | Pass |
| INT-TC29 | AK-12, AK-13 | Normal: buka blokir akun | Blokir penjual (listing hilang dari katalog), lalu `bukaBlokirAkun` dengan alasan | Akun Terverifikasi, listing kembali muncul pada `Barang.getKatalog`, `log_admin` berisi BLOKIR_AKUN lalu BUKA_BLOKIR beserta alasannya | Selama akun diblokir listing tidak ada di `Barang.getKatalog`; setelah buka blokir akun Terverifikasi, listing kembali di katalog, dan `log_admin` berisi BLOKIR_AKUN lalu BUKA_BLOKIR "Banding diterima" | Pass |
| INT-TC30 | AK-12, AK-13, AK-14 | Normal: hapus listing yang dilaporkan | Listing berfoto dua (berkas nyata di disk) dihapus lewat `hapusListingDilaporkan` | Baris `barang` dan `foto_barang` hilang, kedua berkas foto hilang dari disk, `log_admin` HAPUS_LISTING beserta alasan | 0 baris `barang` dan `foto_barang` untuk listing tersebut; kedua berkas foto tidak ada lagi di disk; `log_admin` HAPUS_LISTING "Barang palsu" | Pass |
| INT-TC31 | AK-11, AK-14, AK-17 | Normal: unggah bukti lewat HTTP | `POST /api/laporan` multipart berisi satu PNG ke aplikasi Express | 201; `path_berkas` berpola `/uploads/<idLaporan>/<UUID>.png` dan berkas dapat diunduh lewat `/uploads` dengan isi sama | 201; `path_berkas` cocok dengan pola; unduhan lewat `/uploads` membalas 200 dengan isi identik dengan PNG yang dikirim | Pass |
| INT-TC32 | AK-15 | Normal: simpan dan hapus di Vercel Blob | `simpan` lalu `hapus` dengan token *store* uji (`BLOB_TOKEN_UJI`) | URL publik menjawab 200 setelah `simpan` dan 404 setelah `hapus` | *Tidak dijalankan: belum ada token store Vercel Blob khusus uji; test otomatis dilewati bila `BLOB_TOKEN_UJI` kosong* | - (tidak dijalankan) |
| INT-TC33 | AK-16 | Normal: surel penangguhan | Blokir akun dengan alasan "Menjual barang terlarang", lalu baca kotak masuk server SMTP uji (`/api/v1/search`) | Satu surel berjudul "Pemberitahuan Penangguhan Akun ITBELI" ke alamat akun, memuat alasannya | Surel berjudul "Pemberitahuan Penangguhan Akun ITBELI" diterima di alamat akun, dan teksnya memuat "Menjual barang terlarang" | Pass |
| INT-TC34 | AK-17 | Normal dan gagal: akses route admin | `GET /api/admin/laporan` dengan token admin, lalu dengan token pengguna biasa | 200 berisi daftar laporan untuk admin; 403 untuk pengguna biasa (KF56) | Admin 200 dengan daftar laporan yang tidak kosong; pengguna biasa 403 | Pass |
| INT-TC35 | AK-8, AK-9, AK-10 | Normal dan batas: paginasi katalog (UC13, KF28) | 25 listing "Tersedia" dengan waktu unggah berbeda pada satu kategori; `GET /api/katalog?kategori=...` halaman 1 dan 2 | Halaman 1 berisi 20 listing, terbaru lebih dulu; halaman 2 berisi 5 sisanya; tidak ada listing ganda; total 25, 2 halaman | Halaman 1: 20 listing, "Barang 25" s.d. "Barang 06"; halaman 2: "Barang 05" s.d. "Barang 01"; irisan kosong; paginasi `{totalItem: 25, totalHalaman: 2}` | Pass |
| INT-TC36 | AK-8, AK-9, AK-10 | Normal: aturan tampil katalog dan pemblokiran (UC13 Alternatif 2, KF30) | Listing Tersedia, Terjual, Dinonaktifkan, milik akun yang sudah diblokir, dan milik penjual lain; lalu `UPDATE akun SET status_blokir = TRUE` untuk penjual lain dan muat ulang katalog | Sebelum: hanya dua listing Tersedia milik akun aktif. Sesudah: listing milik akun yang baru diblokir hilang | Sebelum: ["Tersedia B", "Tersedia A"], total 2. Sesudah: ["Tersedia A"], total 1 | Pass |
| INT-TC37 | AK-8, AK-9, AK-10 | Normal dan batas: pencarian kata kunci (UC14, KF25) | `q = "JAS praktikum"` terhadap "Jas Praktikum Kimia", "Jas Himpunan" (deskripsi memuat "praktikum"), "Jas Hujan"; lalu `q = "50%"` terhadap "Diskon 50% Buku" dan "Buku 500 Soal" | Cocok tanpa peka huruf besar pada judul atau deskripsi, setiap kata harus muncul; `%` dicocokkan apa adanya | ["Jas Himpunan", "Jas Praktikum Kimia"]; `kataKunci = "jas praktikum"`; pencarian "50%" hanya ["Diskon 50% Buku"] | Pass |
| INT-TC38 | AK-8, AK-9, AK-10 | Normal dan batas: filter gabungan (UC14, KF26) | Harga 49999, 50000, 150000, 150001 di Labtek V dan satu listing di Labtek VI; filter kategori, harga 50000–150000, lokasi Labtek V | Hanya harga 50000 dan 150000 (batas inklusif) di Labtek V | ["Harga 150000", "Harga 50000"] | Pass |
| INT-TC39 | AK-8, AK-9, AK-10 | Normal: pengurutan (UC14, KF27) | Data INT-TC38 dengan `urut = termurah` dan `urut = termahal` | Harga naik dan harga turun | [49999, 50000, 100000, 150000, 150001] dan kebalikannya | Pass |
| INT-TC40 | AK-8, AK-9, AK-10 | Negatif: tidak ada hasil (UC14 Alternatif 1, KF29) | `q = "zzzqqq"` pada kategori kosong | 200 dengan daftar kosong, total 0, 1 halaman, pesan "Barang tidak ditemukan." | Sesuai | Pass |
| INT-TC41 | AK-8, AK-10 | Negatif: parameter tidak sah (UC14 Alternatif 2) | `hargaMin = 200000, hargaMaks = 50000`; lalu `urut = acak` | 400 `{sukses: false, pesan: "Harga minimum tidak boleh lebih besar dari harga maksimum."}`; urutan tidak dikenal juga 400 | 400 dengan isi tersebut; 400 | Pass |
| INT-TC42 | AK-8, AK-9, AK-10 | Normal: detail listing (UC15, UC15 Alternatif 1, KF17) | Listing "Kalkulator Casio fx-991" Rp150.000 di Labtek VI dengan dua foto yang disisipkan terbalik (urutan 1 lalu 0); dibuka pembeli dan pemilik | Seluruh atribut, identitas penjual, foto urut 0 lalu 1; `milikSendiri` false untuk pembeli dan true untuk pemilik | Sesuai; urutan foto [foto urutan 0, foto urutan 1] | Pass |
| INT-TC43 | AK-8, AK-9, AK-10 | Normal dan negatif: detail dengan status khusus (UC15 Alternatif 2 dan 3) | Detail listing Terjual, Dinonaktifkan, milik akun diblokir, UUID acak, dan ID "bukan-uuid" | Terjual 200 berstatus "Terjual"; tiga berikutnya 404 "Listing tidak ditemukan atau sudah tidak tersedia."; ID tidak sah 400 | 200 "Terjual"; 404, 404, 404 dengan pesan tersebut; 400 | Pass |
| INT-TC44 | AK-10 | Negatif: tanpa sesi login | `GET /api/katalog` tanpa token dan dengan token palsu; `GET /api/katalog/:id` tanpa token | Ketiganya 401 | 401, 401, 401 | Pass |
| INT-TC45 | AK-8, AK-9, AK-10 | Batas: nomor halaman sangat besar | `halaman = 100000`, lalu `halaman = 99999999999999999999` | Halaman 100000: 200 dengan daftar kosong. Halaman 99999999999999999999: ditolak 400 atau dibalas daftar kosong, bukan galat server | Halaman 100000: 200, daftar kosong. Halaman 99999999999999999999: **500** "Terjadi galat pada server."; log PostgreSQL `invalid input syntax for type bigint: "2e+21"` (kode 22P02) | Fail |
| *[INT-TCYY]* | *[AK-XX]* | *[...]* | *[...]* | *[...]* | *[Hasil aktual]* | *Pass/Fail* |

Skenario berhasil masuk lewat Google belum dapat diuji dengan Google sungguhan karena `GOOGLE_CLIENT_ID` belum diatur, baik di lingkungan lokal maupun di versi daring (`/api/akun/sso/penyedia` membalas `google: false`). Alur tersebut diuji dengan *token endpoint* tiruan pada SSO-UT06 dan SSO-UT16 s.d. SSO-UT21.

INT-TC13 s.d. INT-TC23 menggunakan PostgreSQL dan penyimpanan disk lokal tanpa mock. Hasil aktual dilampirkan pada Subbab 4.6.

INT-TC24 s.d. INT-TC34 (Modul E) berada di `src/tests/db/ModulE.test.js` dan dijalankan dengan `npm run test:db` pada 19 November 2026. Lingkungannya berbeda dari Modul A karena laptop penguji Modul E tidak memakai Docker. PostgreSQL 16.15 dari paket Ubuntu dijalankan di WSL. Mailpit tidak dapat dipakai karena `mailpit.exe` diblokir kebijakan Application Control Windows di laptop tersebut, sehingga server SMTP diganti penangkap SMTP lokal berbasis Node.js (`docs/M10/assets/skrip/penangkap-smtp.cjs`). Penangkap itu menerima surel lewat protokol SMTP di port 1025 dan menyediakan dua endpoint pencarian yang sama dengan Mailpit (`/api/v1/search` dan `/api/v1/message/:id`), sehingga aplikasi tetap mengirim surel sungguhan melalui SurelAdapter dan test tidak perlu diubah. Hasilnya 10 test lulus dan 1 dilewati (INT-TC32). Keluaran lengkap ada di `integrasi-modul-e.txt`.

INT-TC35 s.d. INT-TC45 berada di `src/tests/db/ModulC.test.js` dan berjalan melalui HTTP (Supertest ke aplikasi Express) sampai PostgreSQL 16 tanpa mock. Karena basis data uji dipakai bersama modul lain, setiap putaran memakai kategori unik sehingga jumlah dan urutan hasil tidak terpengaruh data modul lain.

**Penyebab INT-TC45 gagal:** `FilterController.bacaHalaman` menerima bilangan bulat berapa pun besarnya. `Number("99999999999999999999")` menjadi 1e20 sehingga offset (1e20 − 1) × 20 dikirim pustaka `pg` sebagai teks `"2e+21"`, yang ditolak PostgreSQL karena bukan bilangan `bigint`. Galat tersebut tidak ditangani sehingga pengguna menerima 500. **Usulan perbaikan:** beri batas atas nomor halaman di `bacaHalaman` (misalnya `Number.isSafeInteger(halaman * UKURAN_HALAMAN)`) dan balas 400 "Nomor halaman tidak valid." bila dilampaui, lalu tambahkan kasus batas tersebut ke C17-UT08. Kode `v9.0` tidak diubah selama pengujian.

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

Pengujian dijalankan pada ITBELI lokal (`http://localhost:3100`) dengan PostgreSQL dan Mailpit dari `docker-compose.yml` serta data `npm run db:seed`. Langkah pada peramban dijalankan dengan Google Chrome 157 melalui Playwright, dan setiap tangkapan layar diambil dari layar tersebut. Kode verifikasi dibaca dari kotak masuk Mailpit, sedangkan status akun, token, dan sesi diperiksa langsung di basis data. Kata sandi akun seed adalah "ujicoba123".

### 4.4.1 Use Case Mendaftar Akun

**ID Use Case:** UC01  
**Nama Use Case:** Mendaftar Akun

Tabel 4.4.1. Hasil Pengujian Use Case UC01

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC01-TC01 | KF01, KF02, KF06, KF09, KF13 | Normal | 1. Buka `/daftar`.<br>2. Isi nama, NIM, surel, dan kata sandi.<br>3. Centang persetujuan Kebijakan Privasi dan Ketentuan Penggunaan.<br>4. Klik "Buat Akun".<br>5. Buka surel di Mailpit, masukkan 6 digit kode di halaman verifikasi, lalu klik "Verifikasi". | Nama: Dhanesworo Uji<br>NIM: 13525034<br>Surel: uc01.tc01@mahasiswa.itb.ac.id<br>Kata sandi: Rahasia2026 | Formulir memuat nama, NIM, surel, kata sandi, dan persetujuan beserta tautan kebijakan. Akun dibuat "Belum Terverifikasi", kata sandi tersimpan sebagai hash, kode berlaku 15 menit dikirim ke surel, dan pengguna diarahkan ke halaman verifikasi. Setelah kode dimasukkan, pengguna masuk ke sistem | Formulir tampil dengan kotak persetujuan bertautan Kebijakan Privasi dan Ketentuan Penggunaan. Setelah "Buat Akun", halaman pindah ke `/verifikasi?email=uc01.tc01%40mahasiswa.itb.ac.id`. Di basis data akun berstatus "Belum Terverifikasi" dengan hash `$2b$10$...` (60 karakter). Surel "Kode Verifikasi ITBELI" diterima dengan kode yang sama dengan tabel, berlaku 15 menit. Setelah kode dimasukkan, pengguna diarahkan ke `/katalog` dan status akun menjadi "Terverifikasi" | Pass |
| UC01-TC02 | KF05 | Alternatif 1: Domain surel tidak valid | 1. Buka `/daftar`.<br>2. Isi formulir dengan surel non-ITB dan centang persetujuan.<br>3. Klik "Buat Akun". | Surel: uc01.tc02@gmail.com<br>NIM: 13525034<br>Kata sandi: Rahasia2026 | Pendaftaran gagal, tetap di halaman pendaftaran, pesan galat meminta surel berdomain ITB | Tetap di `/daftar`. Di bawah isian surel tampil "Gunakan surel ITB yang berakhiran itb.ac.id, misalnya @itb.ac.id atau @mahasiswa.itb.ac.id." Tidak ada akun dengan surel tersebut di basis data | Pass |
| UC01-TC03 | KF05 | Alternatif 2: Surel sudah terdaftar | 1. Buka `/daftar`.<br>2. Isi formulir dengan surel milik akun yang sudah ada (huruf besar/kecil berbeda) dan centang persetujuan.<br>3. Klik "Buat Akun". | Surel: Penjual.Uji@itb.ac.id<br>NIM: 13525099<br>Kata sandi: Rahasia2026 | Pembuatan akun gagal dan muncul peringatan bahwa surel sudah terdaftar, dengan arahan masuk atau memakai surel lain | Tetap di `/daftar`. Kotak galat dan isian surel menampilkan "Surel sudah terdaftar. Silakan masuk atau gunakan surel lain." beserta tautan "Masuk". Jumlah akun penjual.uji@itb.ac.id tetap 1 | Pass |

### 4.4.2 Use Case Memverifikasi Surel

**ID Use Case:** UC02  
**Nama Use Case:** Memverifikasi Surel

Tabel 4.4.2. Hasil Pengujian Use Case UC02

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF06, KF07 | Normal | 1. Daftar akun baru lewat `/daftar` sampai diarahkan ke halaman verifikasi.<br>2. Salin kode dari surel di Mailpit ke enam kotak kode.<br>3. Klik "Verifikasi". | Surel: uc02.tc01@itb.ac.id<br>Kode: 6 digit dari surel | Halaman menampilkan kolom kode, hitung mundur 15 menit, dan opsi kirim ulang. Kode benar dan belum kedaluwarsa mengubah status menjadi "Terverifikasi" dan mengarahkan ke halaman utama | Halaman verifikasi menampilkan "Kode berlaku 14:59" dan tombol "Kirim ulang kode" (nonaktif selama hitung mundur). Setelah "Verifikasi", pengguna diarahkan ke `/katalog` dengan token sesi tersimpan. Di basis data akun "Terverifikasi" dan token "Terpakai" | Pass |
| UC02-TC02 | KF07 | Alternatif 1: Kode tidak valid | 1. Daftar akun baru sampai halaman verifikasi.<br>2. Masukkan kode yang berbeda dari kode di surel.<br>3. Klik "Verifikasi". | Surel: uc02.tc02@itb.ac.id<br>Kode: 939646 (kode surel + 1) | Status akun tidak berubah dan pesan galat kode tidak valid tampil | Tampil "Kode verifikasi salah." dan tetap di halaman verifikasi. Akun tetap "Belum Terverifikasi", token tetap "Aktif" | Pass |
| UC02-TC03 | KF06, KF07 | Alternatif 1: Kode kedaluwarsa | 1. Daftar akun baru sampai halaman verifikasi.<br>2. Lewati batas 15 menit dengan memundurkan `waktu_buat` 16 menit dan `waktu_kedaluwarsa` 1 menit di tabel `token_verifikasi`.<br>3. Masukkan kode yang benar dari surel, klik "Verifikasi". | Surel: uc02.tc03@itb.ac.id<br>Kode: 6 digit dari surel | Status akun tidak berubah dan pesan galat kode kedaluwarsa tampil, dengan arahan meminta kode baru | Tampil "Kode verifikasi sudah kedaluwarsa. Minta kode baru." Akun tetap "Belum Terverifikasi" | Pass |
| UC02-TC04 | KF06, KF08 | Alternatif 2: Meminta pengiriman ulang kode | 1. Buka `/verifikasi?email=uc02.tc03@itb.ac.id` (akun dari UC02-TC03 yang kodenya kedaluwarsa).<br>2. Klik "Kirim ulang kode".<br>3. Masukkan kode dari surel baru, klik "Verifikasi". | Surel: uc02.tc03@itb.ac.id | Kode lama hangus, kode baru berbatas 15 menit dikirim, hitung mundur diatur ulang, dan kode baru dapat dipakai | Tombol "Kirim ulang kode" aktif. Setelah diklik tampil "✓ Kode verifikasi baru telah dikirim." dan hitung mundur kembali ke 14:58. Kotak masuk berisi 2 surel. Token di basis data: lama "Hangus" dan baru "Aktif", masing-masing 15 menit. Kode baru diterima dan pengguna diarahkan ke `/katalog`; akun "Terverifikasi" | Pass |

### 4.4.3 Use Case Masuk ke Sistem (Login)

**ID Use Case:** UC03  
**Nama Use Case:** Masuk ke Sistem (*Login*)

Tabel 4.4.3. Hasil Pengujian Use Case UC03

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC03-TC01 | KF03, KF10, KF11 | Normal | 1. Buka `/masuk`.<br>2. Isi surel dan kata sandi.<br>3. Klik "Masuk". | Surel: pembeli.uji@itb.ac.id<br>Kata sandi: ujicoba123 | Pengguna masuk dengan sesi bertoken berlaku paling lama 24 jam, diarahkan ke beranda, dan navigasi berubah sesuai peran | Diarahkan ke `/katalog` dengan menu profil di *top bar*. Token 64 karakter tersimpan dengan peran "Pengguna". Di tabel `sesi_login` sesi aktif berlaku tepat 24 jam | Pass |
| UC03-TC02 | KF10 | Alternatif 1: Kredensial tidak sesuai | 1. Buka `/masuk`.<br>2. Isi surel terdaftar dengan kata sandi salah.<br>3. Klik "Masuk". | Surel: pembeli.uji@itb.ac.id<br>Kata sandi: SalahSandi99 | Login ditolak dengan pesan surel atau kata sandi salah | Tampil "Surel atau kata sandi salah.", tetap di `/masuk`, tidak ada token tersimpan | Pass |
| UC03-TC03 | KF08 | Alternatif 2: Akun belum terverifikasi | 1. Buka `/masuk`.<br>2. Isi kredensial akun yang belum diverifikasi.<br>3. Klik "Masuk". | Surel: belum.uji@itb.ac.id<br>Kata sandi: ujicoba123 | Login ditolak dan tersedia pintasan untuk mengirim ulang kode | Tampil "Akun belum terverifikasi. Masukkan kode verifikasi yang dikirim ke surel Anda." dengan tautan "Verifikasi sekarang" menuju halaman verifikasi yang memuat tombol kirim ulang. Tidak ada token tersimpan | Pass |
| UC03-TC04 | KF53 | Alternatif 3: Akun sedang diblokir | 1. Buka `/masuk`.<br>2. Isi kredensial akun yang diblokir admin.<br>3. Klik "Masuk". | Surel: diblokir.uji@itb.ac.id<br>Kata sandi: ujicoba123 | Login ditolak dengan pesan penangguhan | Tampil "Akun Anda ditangguhkan oleh admin karena melanggar ketentuan penggunaan.", tidak ada token tersimpan | Pass |

### 4.4.4 Use Case Keluar dari Sistem (Logout)

**ID Use Case:** UC04  
**Nama Use Case:** Keluar dari Sistem (*Logout*)

Tabel 4.4.4. Hasil Pengujian Use Case UC04

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC04-TC01 | KF12 | Normal | 1. Masuk sebagai Pembeli Uji.<br>2. Buka menu profil, halaman `/profil`.<br>3. Klik "Keluar" pada panel Pengaturan akun.<br>4. Coba pakai token lama ke `GET /api/akun/profil`. | Surel: pembeli.uji@itb.ac.id<br>Kata sandi: ujicoba123 | Sesi aktif dicabut di server dan token lokal dihapus, lalu pengguna diarahkan ke halaman login | Diarahkan ke `/masuk`; `localStorage` tidak lagi berisi token; di tabel `sesi_login` sesi tersebut `status_aktif = false`; token lama ditolak dengan HTTP 401 | Pass |

### 4.4.5 Use Case Melihat Profil Akun

**ID Use Case:** UC05  
**Nama Use Case:** Melihat Profil Akun

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC05-TC01 | KF04, KF39 | Normal | 1. Masuk sebagai Penjual Uji yang memiliki satu listing.<br>2. Pilih menu profil.<br>3. Lihat panel "Pengaturan akun". | Surel: penjual.uji@itb.ac.id<br>Kata sandi: ujicoba123<br>Listing: "Jas Lab Kimia Ukuran M", Rp85.000 | Halaman profil menampilkan nama, NIM, surel, dan daftar listing milik akun; pengaturan akun memuat tautan Kebijakan Privasi | Tampil "Penjual Uji", "13500002 · penjual.uji@itb.ac.id", status "Terverifikasi", 1 listing tersedia, dan kartu "Jas Lab Kimia Ukuran M" Rp85.000 (Labtek V · Jas praktikum). Panel "Pengaturan akun" langsung terbuka tanpa perlu diklik dan memuat tautan "Kebijakan Privasi" ke `/legal?jenis=kebijakan-privasi` | Pass |

### 4.4.6 Use Case Melihat Kebijakan Privasi dan Ketentuan Penggunaan

**ID Use Case:** UC06  
**Nama Use Case:** Melihat Kebijakan Privasi dan Ketentuan Penggunaan

Tabel 4.4.6. Hasil Pengujian Use Case UC06

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC06-TC01 | KF13, KF38, KF39 | Normal | 1. Buka `/daftar`.<br>2. Klik tautan "Kebijakan Privasi" pada kotak persetujuan.<br>3. Baca halaman yang terbuka. | - | Dokumen kebijakan tampil penuh, dengan klausul bahwa isi percakapan pribadi tidak dapat diakses admin maupun pengembang ditampilkan menonjol | Tab baru `/legal?jenis=kebijakan-privasi` menampilkan "Kebijakan Privasi", "Versi 1.0 · Berlaku sejak 1 November 2026", 7 bagian dengan daftar isi, dan kotak klausul yang kalimat pertamanya dicetak tebal: "Isi percakapan tidak dapat diakses admin maupun pengembang." | Pass |

### 4.4.7 Use Case Membuat Listing

**ID Use Case:** UC07  
**Nama Use Case:** Membuat Listing

Pengujian UC07–UC12 menggunakan Chrome melalui Playwright pada `http://localhost:3117`, dengan dua akun penjual sebagai pemilik dan bukan pemilik. Data uji memakai nama/deskripsi sesuai foto produk, harga awal Rp120.000, lokasi "Labtek V", dan satu JPEG sah. Buku memakai kategori Buku kuliah; listing lainnya memakai pilihan Perlengkapan kos yang tersedia pada aplikasi.

Tabel 4.4.7. Hasil Pengujian Use Case UC07

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC07-TC01 | KF15, KF16, KF19, KF23 | Normal | Buka `/listing-form`; periksa isian/pilihan kategori; isi data normal dan unggah JPEG; klik Publikasikan; periksa status listing dan tujuan navigasi | Judul Buku Introduction to Algorithms, data normal, satu JPEG | Formulir sesuai KF15 dan enam kategori SKPL; listing Tersedia diterbitkan; diarahkan ke Listing Saya sesuai skenario SKPL | Listing berhasil dibuat Tersedia dan membuka `/detail?id=...`, bukan `/listing-saya`. Pilihan implementasi: Jas praktikum, Buku kuliah, Alat laboratorium, Kalkulator, Jaket himpunan, Perlengkapan kos; berbeda dari daftar SKPL (antara lain Buku dan diktat, Elektronik, Pakaian dan jaket himpunan, Lain-lain). Penyimpanan normal diverifikasi INT-TC13. Perbedaan tujuan/nilai referensi sudah tercatat pada M9 B.1 No. 19 dan 21, tetapi belum mengubah dasar harapan SKPL | Fail — daftar kategori dan tujuan navigasi berbeda dari SKPL. Perbaikan: sesuaikan keduanya dengan SKPL dan uji ulang |
| UC07-TC02 | KF18 | Alternatif 1: formulir tidak lengkap | Buka formulir baru; biarkan isian/foto kosong; klik Publikasikan | Isian kosong, tanpa foto | Publikasi ditolak; kolom wajib diberi penanda dan pesan | Tetap di formulir; judul `aria-invalid=true`; pesan minimal satu foto tampil; penyimpanan tidak dilakukan | Pass |
| UC07-TC03 | KF23, KF24 | Alternatif 2: unggahan melanggar ketentuan | Isi formulir; secara bergantian pilih PDF, JPEG >5 MB, dan enam JPEG; tekan Publikasikan | PDF, 5 MB + 1 byte, enam berkas | Berkas salah ditolak, pesan sesuai ketentuan, listing tidak tersimpan | PDF/berkas besar memunculkan "Foto harus JPG/PNG, maksimum 5 MB per foto."; enam foto memunculkan "Maksimum 5 foto. Hapus foto terlebih dahulu."; formulir tetap terbuka tanpa foto sah | Pass |

### 4.4.8 Use Case Melihat Daftar Listing Milik Sendiri

**ID Use Case:** UC08  
**Nama Use Case:** Melihat Daftar Listing Milik Sendiri

Tabel 4.4.8. Hasil Pengujian Use Case UC08

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC08-TC01 | KF20, KF42 | Normal | Buka `/listing-saya`; lihat kartu fixture dan jumlah tab; pindah ke tab Terjual lalu kembali Tersedia | Sesi pemilik dan listing Earbuds ATARU | Daftar milik akun sesi ditampilkan per status; tab riwayat tersedia | Kartu fixture tampil beserta status; tab Tersedia/Terjual dapat dipilih. Jumlah pada kedua tab mengikuti fixture dalam DB uji dan tercatat pada JSON hasil pengujian. Isi riwayat Terjual diverifikasi UC11-TC01 dan INT-TC17, isolasi pemilik pada INT-TC14 | Pass |

### 4.4.9 Use Case Mengubah Listing

**ID Use Case:** UC09  
**Nama Use Case:** Mengubah Listing

Tabel 4.4.9. Hasil Pengujian Use Case UC09

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC09-TC01 | KF21, KF22, KF23 | Normal | Buka formulir ubah fixture; periksa prefill; ubah harga; pertahankan foto; Simpan Perubahan | Samsung Galaxy Z Flip; harga 120000 → 90000 | Data lama terisi; perubahan sah tersimpan; halaman detail menampilkan hasil baru | Judul terisi Samsung Galaxy Z Flip; harga aktual 90000; diarahkan ke `/detail?id=...`. Penggantian/urutan foto diuji terisolasi pada C14-UT11 dan C30-UT03 | Pass |
| UC09-TC02 | KF18, KF21 | Alternatif 1: kolom wajib dikosongkan | Kosongkan judul lalu Simpan; periksa data lama; isi kembali judul lalu Simpan | Judul kosong, kemudian Samsung Galaxy Z Flip Pink | Kosong ditolak tanpa mengubah data; setelah diperbaiki perubahan disimpan | Judul ditandai tidak valid; data lama tetap Samsung Galaxy Z Flip; setelah dilengkapi judul menjadi Samsung Galaxy Z Flip Pink | Pass |
| UC09-TC03 | KF21, KF23, KF24 | Alternatif 2: foto tidak sah saat pengubahan | Buka formulir dengan foto lama; ubah harga menjadi 80000; pilih PDF; tanpa memperbaiki unggahan, klik Simpan; tunggu respons PUT dan baca ulang data | Foto lama sah; PDF; harga awal 90000 | PDF ditolak dan seluruh penyimpanan ditahan sampai unggahan diperbaiki; harga tetap 90000 | Pesan penolakan PDF tampil, tetapi Simpan mengirim PUT dan menyimpan harga **80000** dengan foto lama. Halaman berpindah ke detail; nilai lama tidak dipertahankan sebagaimana skenario alternatif SKPL | Fail — kesalahan unggahan tidak menghalangi penyimpanan. Perbaikan: cegah submit sampai kesalahan unggahan diperbaiki, lalu uji ulang |
| UC09-TC04 | KF22 | Alternatif 3: bukan pemilik | Dengan sesi akun kedua, buka URL ubah fixture akun pertama; coba PUT langsung dengan data valid | ID listing akun pertama, token akun kedua | Formulir tidak dapat dipakai, server menolak perubahan, data tetap | Tombol Simpan dinonaktifkan dan pesan bukan pemilik tampil; PUT menghasilkan 403; harga tidak berubah. Screenshot penolakan ada pada UC09-TC04-akses.png | Pass |

### 4.4.10 Use Case Menghapus Listing

**ID Use Case:** UC10  
**Nama Use Case:** Menghapus Listing

Tabel 4.4.10. Hasil Pengujian Use Case UC10

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC10-TC01 | KF21, KF22 | Normal | Pada kartu Paket Burger dan Kentang, pilih Hapus; baca dialog permanen; konfirmasi Hapus Listing; baca ulang ID | Listing pemilik | Listing terhapus dan hilang dari daftar; foto/metadata ikut dibersihkan | Dialog dapat dikonfirmasi; kartu hilang; GET ID menghasilkan 404. Penghapusan metadata dan berkas fisik dibuktikan INT-TC23 | Pass |
| UC10-TC02 | KF21 | Alternatif 1: batal konfirmasi | Pilih Hapus pada fixture yang sama, lalu Batal; muat ulang/periksa ID | Listing pemilik | Dialog ditutup; listing tetap ada | Dialog ditutup; GET tetap sukses dan kartu masih tampil | Pass |
| UC10-TC03 | KF22 | Alternatif 2: bukan pemilik | Kirim DELETE ID fixture memakai token akun kedua; buka lagi daftar pemilik | Token bukan pemilik | Ditolak; listing utuh | HTTP 403; GET pemilik tetap sukses; kartu masih tampil | Pass |

### 4.4.11 Use Case Menandai Listing Terjual

**ID Use Case:** UC11  
**Nama Use Case:** Menandai Listing Terjual

Tabel 4.4.11. Hasil Pengujian Use Case UC11

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC11-TC01 | KF40, KF42 | Normal | Buka tab Tersedia; klik Tandai Terjual pada Paket Burger dan Kentang; konfirmasi; buka tab Terjual; baca status aktual | Listing Tersedia milik pemohon | Berubah Terjual, masuk riwayat, tidak muncul pada katalog | Status aktual Terjual; kartu ada di tab riwayat. Ketidakhadiran pada katalog diverifikasi dengan komponen nyata pada INT-TC17 | Pass |
| UC11-TC02 | KF40 | Alternatif 1: batal dialog | Pada listing Tersedia, klik Tandai Terjual lalu Batal | Listing Tersedia | Status tetap Tersedia | Dialog ditutup; status aktual tetap Tersedia | Pass |
| UC11-TC03 | KF40, KF42 | Alternatif 2: tampilan usang, sudah Terjual | Muat kartu Tersedia; ubah ke Terjual lewat permintaan lain; klik Tandai Terjual pada kartu lama | Tampilan lama dan DB Terjual | Tidak ada perubahan ganda; tampilan disegarkan sesuai status aktual | Dialog aksi tidak dibuka; status tetap Terjual; toast "Status listing berubah. Silakan pilih aksi kembali." tampil. Redaksi pesan berbeda dari contoh SKPL, tetapi konflik status ditangani; server menolak PATCH usang pada INT-TC18 | Pass |

### 4.4.12 Use Case Membatalkan Penandaan Terjual

**ID Use Case:** UC12  
**Nama Use Case:** Membatalkan Penandaan Terjual

Tabel 4.4.12. Hasil Pengujian Use Case UC12

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC12-TC01 | KF41, KF42 | Normal | Buka tab Terjual; klik Batalkan Terjual; konfirmasi; buka tab Tersedia; baca status aktual | Listing Terjual milik pemohon | Menjadi Tersedia dan kembali tampil pada katalog | Status aktual Tersedia; kartu kembali ke tab Tersedia. Kemunculan kembali pada katalog diperiksa melalui INT-TC19 | Pass |
| UC12-TC02 | KF41, KF42 | Alternatif 1: batal dialog | Klik Batalkan Terjual, kemudian Batal pada dialog | Listing Terjual | Status tetap Terjual dan riwayat tidak berubah | Dialog ditutup; status aktual tetap Terjual | Pass |
| UC12-TC03 | KF41, KF42 | Alternatif 2: tampilan usang, sudah Tersedia | Muat kartu Terjual; pulihkan ke Tersedia lewat permintaan lain; klik Batalkan Terjual dari kartu lama | Tampilan lama dan DB Tersedia | Tidak ada pembatalan ganda; status aktual dipertahankan | Dialog aksi tidak dibuka; status tetap Tersedia; toast penyegaran status tampil. Penolakan PATCH usang diverifikasi INT-TC20 | Pass |

### 4.4.13 Use Case Melihat Katalog Listing

**ID Use Case:** UC13  
**Nama Use Case:** Melihat Katalog Listing

Pengujian UC13 s.d. UC15 dilaksanakan pada 19 November 2026 secara manual di Google Chrome terhadap ITBELI lokal (`http://localhost:3000`, `npm run dev`) dari kode tag `v9.0`, dengan PostgreSQL dan Mailpit dari `docker-compose.yml`. Data disiapkan dengan `npm run db:init`, `npm run db:seed`, dan skrip `docs/M10/assets/bukti/data-uji-modul-c.cjs`, yang membuat 22 listing Tersedia milik Penjual Uji, 1 listing Terjual, 1 listing Dinonaktifkan, dan 1 listing milik akun Diblokir Uji. Basis data lokal juga memuat 2 listing Tersedia milik Penjual Uji dari pengujian sebelumnya, sehingga katalog awal berisi 24 listing. Pengujian dilakukan sebagai Pembeli Uji, kecuali yang disebut lain. Kesimpulan `Pass` diberikan bila seluruh perilaku pada skenario SKPL terjadi; perbedaan yang hanya menyangkut bentuk tampilan dicatat pada kolom hasil.

Tabel 4.4.13. Hasil Pengujian Use Case UC13

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC13-TC01 | KF28, KF30 | Normal | 1. Masuk sebagai Pembeli Uji dan buka `/katalog`.<br>2. Periksa kartu dan navigasi halaman di bagian bawah.<br>3. Klik "Berikutnya".<br>4. Klik salah satu kartu. | Tanpa kata kunci dan filter; 24 listing Tersedia, ditambah listing Terjual, Dinonaktifkan, dan milik akun diblokir | Hanya listing Tersedia milik akun tidak diblokir, urut terbaru, maksimum 20 per halaman; kartu memuat foto utama, judul, harga, kategori, dan lokasi COD; ada navigasi antarhalaman (nomor halaman, Sebelumnya, Berikutnya) dan jumlah total; "Berikutnya" memuat 20 listing berikutnya, menyorot halaman aktif, dan kembali ke atas; kartu membuka detail | Tampil "24 barang ditemukan". Halaman 1 berisi 20 kartu dengan foto utama atau "Belum ada foto", harga, judul, lokasi COD, kategori, dan nama penjual; di bawahnya "‹ Sebelumnya" (nonaktif), "Halaman 1 dari 2", "Berikutnya ›". Setelah "Berikutnya", URL menjadi `?halaman=2`, halaman kembali ke atas, tampil 4 kartu dan "Halaman 2 dari 2". Listing Terjual, Dinonaktifkan, dan milik akun diblokir tidak muncul di kedua halaman. Klik kartu "Earbuds Bluetooth Bekas Pakai" membuka detailnya. Navigasi tidak memuat tombol nomor halaman; halaman aktif ditunjukkan dengan teks "Halaman X dari Y" | Pass |
| UC13-TC02 | KF30 | Alternatif 1: Katalog masih kosong | 1. Jalankan `node ../docs/M10/assets/bukti/data-uji-modul-c.cjs --kosongkan`.<br>2. Muat ulang `/katalog`.<br>3. Jalankan `--pulihkan`. | Seluruh 25 listing Tersedia disembunyikan sementara | Tidak ada kartu dan navigasi; keadaan kosong dengan pesan "Belum ada barang yang tersedia saat ini" beserta ajakan membuat listing pertama | Tidak ada kartu dan tidak ada navigasi halaman. Yang tampil adalah "Barang tidak ditemukan", "Coba kata kunci lain atau ubah filter pencarian.", dan tombol "Hapus pencarian & filter"; tidak ada ajakan membuat listing. Setelah `--pulihkan`, 25 listing kembali Tersedia.<br>**Penyebab:** `HalamanKatalog.render` (C05) memakai keadaan kosong yang sama untuk katalog tanpa listing dan untuk hasil pencarian kosong.<br>**Usulan perbaikan:** bila daftar kosong dan tidak ada kata kunci maupun filter aktif, tampilkan "Belum ada barang yang tersedia saat ini" dan tombol "Jual Barang" ke `/listing-form` | Fail |
| UC13-TC03 | KF30, KF54 | Alternatif 2: Listing menjadi tidak tersedia saat katalog dibuka | 1. Sebagai Pembeli Uji, buka `/katalog`.<br>2. Di jendela lain, masuk sebagai Penjual Uji, buka Listing Saya, lalu klik "Terjual" pada "Kalkulator Casio fx-570ES".<br>3. Muat ulang katalog pembeli. | Listing "Kalkulator Casio fx-570ES" diubah menjadi Terjual | Setelah dimuat ulang, listing tersebut tidak lagi ditampilkan dan jumlah total diperbarui | Sebelum: "24 barang ditemukan" dan "Kalkulator Casio fx-570ES" tampil di halaman 1. Penjual menerima notifikasi "Listing ditandai terjual". Setelah dimuat ulang: "23 barang ditemukan" dan kalkulator tersebut tidak tampil. Kasus pemblokiran akun penjual diverifikasi melalui INT-TC36 | Pass |

### 4.4.14 Use Case Mencari dan Menyaring Listing

**ID Use Case:** UC14  
**Nama Use Case:** Mencari dan Menyaring Listing

Tabel 4.4.14. Hasil Pengujian Use Case UC14

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC14-TC01 | KF25, KF26, KF27, KF28 | Normal | 1. Ketik "jas praktikum" di kolom cari, tekan Enter.<br>2. Pada panel Filter pilih kategori, lokasi, dan rentang harga, klik "Terapkan".<br>3. Ubah Urutkan menjadi "Harga terendah". | Kata kunci "jas praktikum"; kategori Jas praktikum; lokasi Labtek V; Rp50.000–Rp150.000 | Listing yang judul/deskripsinya memuat kata kunci tanpa peka huruf besar, dengan jumlah hasil; hanya listing yang memenuhi semua kriteria, kembali ke halaman 1, ada penanda (chip) setiap filter aktif; urut dari termurah tanpa mengubah kata kunci dan filter; kriteria dipertahankan antarhalaman | Langkah 1: "4 barang ditemukan untuk “jas praktikum”", yaitu keempat listing jas praktikum. Langkah 2: URL memuat seluruh kriteria tanpa `halaman`; tampil "2 barang ditemukan" (Jas Praktikum Biologi Ukuran M Rp120.000 dan Jas Praktikum Kimia Lab Dasar Rp75.000); "Jas Praktikum Ukuran L" (Rp160.000) dan "Jas Praktikum Fisika Dasar" (Labtek VI) tidak tampil. Tidak ada chip; filter aktif terlihat dari nilai di panel Filter dan URL. Langkah 3: URL `urut=termurah`, urutan menjadi Rp75.000 lalu Rp120.000, kata kunci dan filter tetap. Hasil hanya satu halaman sehingga langkah 4 tidak dapat diamati di antarmuka; konsistensi antarhalaman diverifikasi INT-TC35 dan C15-UT02 | Pass |
| UC14-TC02 | KF29 | Alternatif 1: Tidak ada barang yang cocok | 1. Pilih kategori Kalkulator dan isi harga maksimum, klik "Terapkan".<br>2. Klik tombol pada pesan kosong. | Kategori Kalkulator; harga maksimum Rp10.000 | Tidak ada kartu; pesan "Barang tidak ditemukan" dengan saran mengganti kata kunci atau melonggarkan filter dan tombol "Hapus Semua Filter"; tombol mengosongkan filter dan kata kunci lalu menampilkan katalog penuh dari halaman 1 urut terbaru | URL `?kategori=Kalkulator&hargaMaks=10000&urut=terbaru`; tidak ada kartu; tampil "Barang tidak ditemukan", "Coba kata kunci lain atau ubah filter pencarian.", dan tombol "Hapus pencarian & filter". Setelah tombol diklik, URL kembali ke `/katalog`, panel filter kosong dengan urutan Terbaru, dan tampil "23 barang ditemukan" dari halaman 1. Label tombol berbeda dari SKPL, fungsinya sama | Pass |
| UC14-TC03 | KF26 | Alternatif 2: Rentang harga tidak masuk akal | 1. Isi harga minimum dan maksimum terbalik, klik "Terapkan".<br>2. Perbaiki rentang, klik "Terapkan". | Rp200.000–Rp50.000, lalu Rp50.000–Rp200.000 | Filter ditahan, kedua kolom harga diberi penanda merah, pesan "Harga minimum tidak boleh melebihi harga maksimum"; setelah diperbaiki, filter diterapkan dan hasil tampil | Langkah 1: URL tetap `/katalog` dan daftar tetap "23 barang ditemukan"; muncul kotak pesan merah "Harga minimum tidak boleh lebih besar dari harga maksimum." di atas daftar. Kolom harga tidak diberi penanda merah. Langkah 2: URL `?hargaMin=50000&hargaMaks=200000&urut=terbaru` dan tampil "17 barang ditemukan", seluruhnya berharga Rp50.000–Rp200.000 | Pass |

### 4.4.15 Use Case Melihat Detail Listing

**ID Use Case:** UC15  
**Nama Use Case:** Melihat Detail Listing

Tabel 4.4.15. Hasil Pengujian Use Case UC15

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC15-TC01 | KF17 | Normal | 1. Buka detail listing dari katalog.<br>2. Baca informasi.<br>3. Klik thumbnail, tombol panah, dan foto utama.<br>4. Klik nama penjual. | Listing "Paket HP Android dan Earbuds" dengan 3 foto | Galeri seluruh foto (carousel dan thumbnail), judul, harga, deskripsi kondisi, kategori, lokasi COD, nama penjual bertautan ke profilnya, tombol "Hubungi Penjual" dan "Laporkan"; klik thumbnail membuka foto ukuran penuh (lightbox) dengan navigasi maju-mundur; klik nama penjual membuka profil penjual | Tampil 3 foto dengan thumbnail dan panah kiri/kanan, judul, Rp950.000, "Diunggah 19 November 2026 di Labtek VI", ketersediaan Tersedia, kategori Perlengkapan kos, deskripsi, "Penjual Uji", tombol "Kirim pesan" beserta kotak pesan, dan ikon Laporkan. Klik thumbnail atau panah hanya mengganti foto utama; klik foto utama tidak membuka lightbox. Nama penjual berupa teks dan tidak dapat diklik.<br>**Penyebab:** lightbox dan profil penjual belum diimplementasikan (M9 B.1 No. 26); profil publik memerlukan endpoint baru.<br>**Usulan perbaikan:** tambahkan lightbox pada `HalamanDetailBarang.renderGaleri` (C07), endpoint profil publik penjual memakai `Penjual.getIdentitas`, dan tautan dari nama penjual | Fail |
| UC15-TC02 | KF17 | Alternatif 1: Pengguna adalah pemilik listing | Masuk sebagai Penjual Uji, buka detail listing miliknya | Listing "Paket HP Android dan Earbuds" milik Penjual Uji | Informasi tetap lengkap; tombol "Hubungi Penjual" diganti "Ubah Listing", "Hapus Listing", dan "Tandai Terjual" | Informasi tampil lengkap; tombol kirim pesan, kotak pesan, dan ikon Laporkan tidak tampil. Tampil "Ini listing milik Anda." dan hanya tombol "Ubah Listing"; "Hapus Listing" dan "Tandai Terjual" tidak ada.<br>**Penyebab:** `HalamanDetailBarang.renderAksi` (C07) hanya membuat tombol "Ubah Listing" untuk pemilik.<br>**Usulan perbaikan:** tambahkan tombol "Hapus Listing" dan "Tandai Terjual" yang memakai endpoint Listing Saya (`DELETE` dan `PATCH /api/barang/:id`) | Fail |
| UC15-TC03 | KF17 | Alternatif 2: Listing sudah dihapus atau tidak ditemukan | Buka detail dengan ID listing yang tidak ada, lalu ID listing berstatus Dinonaktifkan | UUID acak; listing "Listing Dinonaktifkan Uji" | Detail tidak dirender; pemberitahuan "Listing tidak ditemukan atau telah dihapus" dengan tombol kembali ke katalog utama | Untuk kedua ID, detail tidak dirender dan hanya tampil kotak pesan merah "Listing tidak ditemukan atau sudah tidak tersedia.". Pemberitahuan tidak memuat tombol kembali; kembali ke katalog dilakukan lewat ikon Katalog di bilah navigasi atas, yang membuka `/katalog` ("23 barang ditemukan") | Pass |
| UC15-TC04 | KF17 | Alternatif 3: Listing sudah berstatus Terjual | Buka detail listing berstatus Terjual | Listing "Buku Statistika Walpole (sudah terjual)" | Informasi tetap tampil sebagai arsip, label "Terjual" menonjol di atas, tombol "Hubungi Penjual" dinonaktifkan | Tampil label "Terjual" di atas judul, Rp90.000, Labtek V, ketersediaan "Terjual", kategori, deskripsi, dan penjual. Tombol "Kirim pesan" dan kotak pesan tidak tampil; diganti teks "Barang ini sudah terjual.". Ikon Laporkan tetap ada | Pass |

### 4.4.16 Use Case Menghubungi Penjual

**ID Use Case:** UC16  
**Nama Use Case:** Menghubungi Penjual

> *Diisi Sulthan (Modul D)*: 4 skenario pada SKPL Subbab 4.4.16.

### 4.4.17 Use Case Mengirim Pesan dalam Percakapan

**ID Use Case:** UC17  
**Nama Use Case:** Mengirim Pesan dalam Percakapan

> *Diisi Sulthan (Modul D)*: 2 skenario pada SKPL Subbab 4.4.17.

### 4.4.18 Use Case Melihat Daftar Percakapan

**ID Use Case:** UC18  
**Nama Use Case:** Melihat Daftar Percakapan

> *Diisi Sulthan (Modul D)*: 1 skenario pada SKPL Subbab 4.4.18.

### 4.4.19 Use Case Mengirimkan Laporan

**ID Use Case:** UC19  
**Nama Use Case:** Mengirimkan Laporan

Pengujian UC19 sampai UC24 dijalankan pada 19 November 2026 dengan skrip `docs/M10/assets/skrip/uji-use-case-modul-e.cjs`, memakai Playwright Core 1.65.1 dan Google Chrome 157. Aplikasi berjalan di `http://localhost:3000` dengan basis data yang dibuat ulang lalu diisi `npm run db:init` dan `npm run db:seed`, PostgreSQL 16.15 di WSL, dan penangkap SMTP lokal yang sama dengan Subbab 4.3. Skrip menyiapkan tiga listing milik `penjual.uji` lewat API, menjalankan langkah pengujian di peramban, mengambil tangkapan layar, lalu memeriksa basis data dan kotak masuk. Untuk UC20, dua laporan tambahan dibuat lewat API dan status laporan diatur supaya daftar memuat ketiga status.

Pengujian dijalankan dua kali: terhadap kode `v9.0` (tangkapan layar berakhiran `-v9.0`) dan setelah perbaikan pada Tabel 4.0. Bila hasil kedua putaran berbeda, kolom Hasil Pengujian mencatat keduanya. Hasil setiap pemeriksaan tersimpan di `use-case-modul-e-v9.0.json` dan `use-case-modul-e-perbaikan.json`.

Tabel 4.4.19. Hasil Pengujian Use Case UC19

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC19-TC01 | KF43, KF44, KF48 | Normal | 1. Masuk sebagai `pembeli.uji`.<br>2. Buka detail listing milik `penjual.uji`, tekan "Laporkan".<br>3. Pilih "Penipuan", isi alasan, lampirkan satu PNG, tekan "Kirim Laporan".<br>4. Masuk sebagai `admin.uji`, buka laporan tersebut di I-14. | Kategori: "Penipuan"<br>Alasan: "Penjual meminta transfer di muka sebelum bertemu"<br>Bukti: satu PNG (278 KB) | Notifikasi "Laporan berhasil dikirim". Laporan muncul berstatus Baru dengan bukti yang dapat dibuka, dan riwayat penanganan berisi "Penerimaan laporan" | Notifikasi "Laporan berhasil dikirim dan akan segera ditinjau admin." tampil. Di I-14 laporan berstatus Baru dengan satu gambar bukti, dan riwayat penanganan berisi "Penerimaan laporan". Hasil sama pada `v9.0` dan setelah perbaikan | Pass |
| UC19-TC02 | KF37, KF43 | Normal (laporan dari percakapan) | 1. Masuk sebagai `pembeli.uji`, buka percakapan dengan `penjual.uji`, tekan "Laporkan".<br>2. Isi kategori, alasan, dan bukti, lalu kirim.<br>3. Buka laporan tersebut sebagai `admin.uji`. | Kategori: "Konten tidak pantas"<br>Alasan: "Meminta transfer ke rekening pribadi"<br>Bukti: satu PNG | Objek laporan berupa ID percakapan. Detail laporan tidak memuat isi pesan apa pun | Pada `v9.0` I-10 tidak memiliki tombol "Laporkan" (0 elemen), sehingga formulir dibuka lewat alamat `/laporan-form?objek=<idPercakapan>&jenis=Percakapan`. Formulir menampilkan pemberitahuan privasi, objek laporan berupa ID percakapan, dan isi pesan tidak muncul di I-14 maupun di baris `laporan`. Setelah commit `05bb773` tombol "Laporkan" tampil di kepala ruang percakapan dan membuka formulir yang sama; pemeriksaan lain tetap sesuai | Fail pada `v9.0`, Pass setelah perbaikan |
| UC19-TC03 | KF43 | Alternatif 1: alasan dikosongkan | Isi formulir laporan tanpa alasan, lampirkan bukti, tekan "Kirim Laporan" | Alasan: kosong<br>Bukti: satu PNG | Pengiriman dihentikan, kolom alasan diberi penanda merah, dan muncul galat bahwa alasan dan bukti wajib diisi | Pengiriman dihentikan dengan galat "Alasan dan sedikitnya satu bukti tangkapan layar (JPG/PNG) wajib diisi.", kolom alasan bergaris merah, dan jumlah laporan atas objek tetap 0 | Pass |
| UC19-TC04 | KF44 | Alternatif 1: bukti tidak dilampirkan | Isi kategori dan alasan tanpa melampirkan bukti, tekan "Kirim Laporan" | Alasan: "Penjual tidak datang ke lokasi COD"<br>Bukti: tidak ada | Pengiriman dihentikan dan muncul galat bahwa bukti tangkapan layar wajib dilampirkan | Pengiriman dihentikan dengan galat yang sama, dan jumlah laporan atas objek tetap 0 | Pass |

### 4.4.20 Use Case Melihat dan Menyaring Daftar Laporan

**ID Use Case:** UC20  
**Nama Use Case:** Melihat dan Menyaring Daftar Laporan

Tabel 4.4.20. Hasil Pengujian Use Case UC20

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC20-TC01 | KF45 | Normal | 1. Masuk sebagai `admin.uji`.<br>2. Buka `/admin-laporan`. | Empat laporan: dua Baru, satu Diproses, satu Selesai | Tabel menampilkan semua laporan beserta pelapor, objek, kategori, waktu, dan status, serta kartu jumlah per status | Tabel memuat 4 laporan dengan kolom objek, kategori, pelapor, tanggal, dan status. Kartu jumlah: Baru 2, Diproses 1, Selesai 1, total 4 | Pass |
| UC20-TC02 | KF46 | Normal (penyaringan) | Pada `/admin-laporan`, pilih status "Baru" pada penyaring | Status: Baru | Hanya laporan berstatus Baru yang tampil | Tampil 2 baris, keduanya berstatus Baru | Pass |
| UC20-TC03 | KF56 | Alternatif 1: akses oleh akun bukan admin | 1. Masuk sebagai `pembeli.uji`.<br>2. Buka `/admin-laporan` langsung dari bilah alamat. | URL: `/admin-laporan` | Akses ditolak dengan peringatan "Akses Ditolak" dan pengguna dialihkan ke beranda | Peringatan "Akses Ditolak: Anda harus masuk menggunakan akun Admin untuk mengakses Dasbor Moderasi." muncul. Pada `v9.0` pengguna lalu dialihkan ke `/masuk` walaupun sudah masuk. Setelah commit `1711d55` pengguna dialihkan ke beranda (`/`, yang meneruskan ke `/katalog`) | Fail pada `v9.0`, Pass setelah perbaikan |

### 4.4.21 Use Case Mengubah Status Penanganan Laporan

**ID Use Case:** UC21  
**Nama Use Case:** Mengubah Status Penanganan Laporan

Tabel 4.4.21. Hasil Pengujian Use Case UC21

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC21-TC01 | KF47, KF48, KF49 | Normal | 1. Masuk sebagai `admin.uji`, buka detail laporan berstatus Baru.<br>2. Ubah status menjadi "Diproses", simpan. | Status: Baru ke Diproses | Status dan waktu perubahan diperbarui, riwayat penanganan bertambah "Perubahan status laporan menjadi Diproses", dan pilihan status mundur tidak dapat dipilih | Status menjadi Diproses dan waktu perubahan berubah, riwayat bertambah "Perubahan status laporan menjadi Diproses", dan pilihan Baru dinonaktifkan pada menu status | Pass |
| UC21-TC02 | KF47, KF48 | Normal (lewat daftar I-13) | Pada `/admin-laporan`, ubah status sebuah laporan lewat menu status di barisnya | Status: Diproses ke Selesai | Status tersimpan, baris dan kartu jumlah per status langsung diperbarui tanpa memuat ulang halaman | Pada `v9.0` status Selesai tersimpan di server, tetapi muncul TypeError `this.memuatStatistik is not a function` dan kartu Selesai tetap 1. Setelah commit `f8e7224` kartu Selesai berubah dari 1 menjadi 2 tanpa memuat ulang halaman dan tanpa galat JavaScript | Fail pada `v9.0`, Pass setelah perbaikan |

### 4.4.22 Use Case Menghapus Listing yang Dilaporkan

**ID Use Case:** UC22  
**Nama Use Case:** Menghapus Listing yang Dilaporkan

Tabel 4.4.22. Hasil Pengujian Use Case UC22

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC22-TC01 | KF48, KF50, KF52, KF55, KF56 | Normal | 1. Masuk sebagai `admin.uji`, buka detail laporan atas listing `penjual.uji`.<br>2. Tekan "Hapus Listing", isi alasan, konfirmasi.<br>3. Buka katalog dan kotak masuk server SMTP uji. | Alasan: "Barang palsu" | Listing hilang dari katalog dan detailnya tidak dapat dibuka, surel peringatan berisi alasan masuk ke `penjual.uji`, laporan menjadi Selesai, dan tindakan tercatat di log admin serta log audit | `GET /api/katalog/:id` untuk listing tersebut membalas 404, surel "Peringatan Penghapusan Listing ITBELI" berisi alasan masuk ke `penjual.uji`, laporan menjadi Selesai, `log_admin` mencatat HAPUS_LISTING "Barang palsu", dan `log_audit` bertambah "Penghapusan listing: &lt;idBarang&gt;". Hasil sama pada `v9.0` dan setelah perbaikan | Pass |

### 4.4.23 Use Case Memblokir Akun Pengguna

**ID Use Case:** UC23  
**Nama Use Case:** Memblokir Akun Pengguna

Tabel 4.4.23. Hasil Pengujian Use Case UC23

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC23-TC01 | KF48, KF51, KF52, KF53, KF54, KF55, KF56 | Normal | 1. Masuk sebagai `penjual.uji` di peramban kedua.<br>2. Di peramban pertama, masuk sebagai `admin.uji`, buka detail laporan atas `penjual.uji`, tekan "Blokir Akun", isi alasan, konfirmasi.<br>3. Muat ulang peramban kedua, lalu coba masuk lagi sebagai `penjual.uji`.<br>4. Buka katalog dan kotak masuk server SMTP uji. | Alasan: "Penipuan berulang" | Status akun menjadi Diblokir, sesi di peramban kedua berakhir, login ulang ditolak dengan pesan penangguhan, seluruh listing `penjual.uji` hilang dari katalog dan pencarian, surel penangguhan berisi alasan terkirim, dan tindakan tercatat di log admin serta log audit | Pada `v9.0` yang terblokir justru `pembeli.uji` (pelapor). `penjual.uji` tetap aktif: sesi lamanya masih diterima (200), login ulang berhasil, listing Samsung masih tampil di katalog, tidak ada surel ke penjual, dan `log_admin` mencatat BLOKIR_AKUN untuk `pembeli.uji`. Setelah commit `1711d55` `penjual.uji` berstatus Diblokir, sesi lamanya ditolak (401) dan halamannya berpindah ke `/masuk` setelah dimuat ulang, login ulang ditolak (403 `AKUN_DIBLOKIR`) dengan pesan "Akun Anda ditangguhkan oleh admin karena melanggar ketentuan penggunaan.", listingnya hilang dari katalog dan pencarian, surel "Pemberitahuan Penangguhan Akun ITBELI" berisi alasan diterima, dan `log_admin` mencatat BLOKIR_AKUN "Penipuan berulang" untuk `penjual.uji`. Catatan log audit pemblokiran diperiksa pada INT-TC27 | Fail pada `v9.0`, Pass setelah perbaikan |

### 4.4.24 Use Case Membuka Blokir Akun Pengguna

**ID Use Case:** UC24  
**Nama Use Case:** Membuka Blokir Akun Pengguna

Tabel 4.4.24. Hasil Pengujian Use Case UC24

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC24-TC01 | KF51, KF54, KF55, KF56 | Normal | 1. Lanjutan UC23-TC01: sebagai `admin.uji`, tekan "Buka Blokir" untuk `penjual.uji`, isi alasan, konfirmasi.<br>2. Masuk sebagai `penjual.uji`, lalu buka katalog. | Alasan: "Banding diterima" | Login `penjual.uji` berhasil, listing yang tadi dinonaktifkan kembali tampil di katalog, dan log admin mencatat BUKA_BLOKIR beserta alasannya | Pada `v9.0` login `penjual.uji` berhasil dan listingnya tampil, tetapi hanya karena akun itu tidak pernah terblokir (lihat UC23-TC01), dan `log_admin` mencatat BUKA_BLOKIR untuk `pembeli.uji`. Setelah commit `1711d55` login `penjual.uji` berhasil (200), listing Samsung kembali tampil di katalog, dan `log_admin` mencatat BUKA_BLOKIR "Banding diterima" untuk `penjual.uji` | Fail pada `v9.0`, Pass setelah perbaikan |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF03-TC01 | KNF03 | Security | 100% percobaan daftar dan masuk dengan surel di luar domain itb.ac.id (termasuk domain tiruan) ditolak, surel itb.ac.id dan subdomainnya diterima, dan 0 akun berdomain non-ITB di tabel `akun` | 11 permintaan HTTP ke `POST /api/akun/daftar` dan `POST /api/akun/login` (8 surel non-ITB atau tiruan, 3 surel ITB), lalu inspeksi tabel `akun` dengan `psql`. Masuk dengan Google diuji pada SSO-UT13 | 11 dari 11 sesuai harapan. 8 surel non-ITB ditolak saat daftar (400 `DOMAIN_TIDAK_VALID`) dan saat masuk (401). 3 surel ITB diterima (201), tetapi tetap tidak dapat masuk (403 `BELUM_TERVERIFIKASI`) sebelum diverifikasi. Akun berdomain non-ITB: 0 dari 23 | Pass |
| KNF03-TC02 | KNF03 | Security | 100% nilai `kata_sandi_hash` berupa hash bcrypt (60 karakter, cost ≥ 10) dan 0 nilai sama dengan kata sandi teks asli | Inspeksi tabel `akun` dengan `psql`: pola `^\$2[aby]\$\d{2}\$.{53}$` dan perbandingan dengan kata sandi uji "ujicoba123" dan "Rahasia2026" | 23 dari 23 hash bcrypt `$2b$10$` sepanjang 60 karakter; 0 nilai sama dengan teks asli | Pass |
| KNF03-TC03 | KNF03 | Security | Isi pesan di tabel `pesan` tidak memuat teks asli, termasuk setelah *base64* didekode; peserta dapat membaca pesannya, akun admin yang bukan peserta ditolak | Pembeli Uji mengirim pesan lewat `POST /api/percakapan/:id/pesan`, penjual dan admin membacanya lewat `GET /api/percakapan/:id`, lalu tabel `pesan` diinspeksi dengan `psql` (berkoordinasi dengan Modul D) | Kolom `isi_pesan_terenkripsi` berisi teks *base64* 140 karakter yang tidak memuat teks asli, baik sebelum maupun setelah didekode. Penjual menerima teks asli (200), sedangkan admin ditolak (403 "Anda bukan peserta percakapan ini.") | Pass |
| KNF01-TC01 | KNF01 | Usability/Ergonomy | Setiap responden yang belum pernah memakai ITBELI menyelesaikan empat tugas inti tanpa bantuan dalam total < 600 detik: T1 daftar dan aktifkan akun, T2 temukan barang dengan filter dan buka detailnya, T3 hubungi penjual, T4 pasang barang berfoto dan temukan di Listing Saya. Mencakup pengelolaan listing yang semula direncanakan Modul B | Observasi 5 mahasiswa ITB angkatan 2025 dari 5 jurusan yang belum pernah memakai ITBELI, 20 November 2026, di ITBELI lokal (kode `v9.0`, data uji Modul C, Chrome Incognito, kode verifikasi lewat Mailpit). Tugas diberikan sebagai tujuan, bukan langkah; waktu dicatat dengan stopwatch per tugas; pengamat tidak menunjukkan tombol atau langkah; kuesioner kemudahan 1–5 setelah sesi. Instrumen dan formulir pada bukti KNF01-TC01 | Waktu total R1–R5: 417, 360, 444, 357, 420 detik (median 417, maksimum 444). 20 dari 20 tugas selesai mandiri, tanpa kesalahan tercatat. Rata-rata durasi T1 164, T2 88, T3 48, T4 100 detik; skor kemudahan rata-rata 3,95 (terendah T1 dan T2, 3,6). Pertanyaan responden hanya tentang cara menerima kode verifikasi dan batas ukuran foto; keduanya menyangkut pengaturan uji dan aturan isian sehingga tidak dihitung bantuan. Kelima responden menyebut penantian kode verifikasi sebagai bagian paling membingungkan. Usulan perbaikan: I-03 menjelaskan ke mana dan kapan kode dikirim; I-07 menampilkan batas foto sebelum berkas dipilih | Pass |
| KNF02-TC01 | KNF02 | Maintainability | Setiap tindakan moderasi (hapus listing, blokir, buka blokir) menghasilkan satu baris `log_admin` yang lengkap: pelaku, jenis, objek, waktu, dan alasan | Setelah UC22-TC01, UC23-TC01, dan UC24-TC01, jalankan `SELECT id_admin, jenis_tindakan, objek_ditindak, waktu, alasan FROM log_admin ORDER BY waktu` | 3 baris `log_admin`: HAPUS_LISTING "Barang palsu", BLOKIR_AKUN "Penipuan berulang", dan BUKA_BLOKIR "Banding diterima". Kelima kolom terisi di setiap baris, baik pada `v9.0` maupun setelah perbaikan | Pass |
| KNF02-TC02 | KNF02 | Maintainability | Penerimaan laporan dan setiap tindak lanjutnya tercatat di `log_audit` dan dapat dibaca admin pada riwayat penanganan I-14 | Setelah UC19-TC01 dan UC21-TC01, bandingkan isi `log_audit` untuk laporan tersebut dengan riwayat yang tampil di I-14 | Riwayat penanganan I-14 memuat ketiga catatan `log_audit` laporan tersebut dengan urutan yang sama: "Penerimaan laporan", "Perubahan status laporan menjadi Diproses", dan "Penghapusan listing: &lt;idBarang&gt;" | Pass |
| KNF02-TC03 | KNF02 | Maintainability | Catatan log audit dan log admin tidak dapat diubah atau dihapus melalui aplikasi (KF49) | Periksa operasi kelas C38 dan C39 (C38-UT02, C39-UT06) serta seluruh 41 endpoint pada `src/routes/*.js` | Tidak ada operasi maupun endpoint untuk mengubah atau menghapus `log_audit` dan `log_admin`; C38-UT02 dan C39-UT06 lulus. Perlindungan ini hanya di tingkat aplikasi: pengguna basis data `itbeli` masih dapat menjalankan UPDATE atau DELETE langsung | Pass |
| KNF02-TC04 | KNF02 | Maintainability | Hanya admin yang dapat membaca laporan dan riwayatnya | Panggil `GET /api/admin/laporan/:id` dengan token admin dan token pengguna biasa | Token admin 200 dengan laporan dan riwayatnya; token pengguna biasa 403. Rancangan yang sama juga lulus pada INT-TC34 | Pass |
| KNF04-TC01 | KNF04 | Scalability | Basis data menampung 40.000 akun (pembulatan ke atas dari 28.650 mahasiswa ITB menurut THE World University Rankings 2025 ditambah ±1.760 dosen dari rasio 16,3 mahasiswa per staf, tenaga kependidikan, dan pertumbuhan) serta 120.000 listing (rata-rata 3 per akun) dengan 360.000 foto. Pada data tersebut, `Barang.getKatalog` untuk enam skenario katalog dan pencarian memiliki median ≤ 200 ms dan maksimum ≤ 500 ms, serta pencarian akun berdasarkan surel median ≤ 50 ms. Angka target diusulkan Modul C (keputusan K6) | Skrip `docs/M10/assets/bukti/knf04.cjs` membuat basis data terpisah `itbeli_knf04` pada PostgreSQL 16.15 (Docker), mengisinya dengan data sintetis (2% akun diblokir; listing 80% Tersedia, 15% Terjual, 5% Dinonaktifkan), lalu memanggil `Barang.getKatalog` dari kode `v9.0` sebanyak 30 kali per skenario setelah 3 kali pemanasan, dan mengukur waktunya dengan `process.hrtime`. Mesin: Intel Core i5-13420H, 12 thread, RAM 14,8 GB, Node.js 22.22.1 | Data terisi dalam 22,7 detik: 40.000 akun (800 diblokir), 120.000 listing (96.000 Tersedia), 360.000 foto, ukuran basis data 208 MB. Median/maksimum (ms): A katalog beranda 28,6/32,1; B cari "jas praktikum" 36,7/49,2; C kategori Kalkulator + harga + termurah 40,8/48,3; D halaman 500 (offset 9.980) 115,9/129,6; E kata yang tidak ada 1,6/2,6; F cari "kalkulator" + Labtek V + termahal 66,4/90,3; G cari akun berdasarkan surel 0,4/1,1 (memakai *index scan* `akun_email_unik`). Seluruh skenario memenuhi target. Skenario F menghasilkan 0 listing karena pola data sintetis tidak pernah memasangkan kategori Kalkulator dengan Labtek V, sehingga skenario itu mengukur kueri pencarian yang harus memeriksa seluruh kandidat. Pengujian ini mengukur waktu kueri basis data, belum beban banyak pengguna bersamaan melalui HTTP | Pass |
| *[KNFXX-TCYY]* | *[KNFXX]* | *[Parameter]* | *[Target terukur]* | *[Metode dan alat]* | *[Hasil aktual]* | *Pass/Fail* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Seluruh berkas bukti berada di `docs/M10/assets/bukti/`.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| C01-UT01 – C01-UT06 | [C01-UT.txt](assets/bukti/C01-UT.txt) |
| C13-UT01 – C13-UT51 | [C13-UT.txt](assets/bukti/C13-UT.txt) |
| C22-UT01 – C22-UT05 | [C22-UT.txt](assets/bukti/C22-UT.txt) |
| C23-UT01 – C23-UT21 | [C23-UT.txt](assets/bukti/C23-UT.txt) |
| C25-UT01 – C25-UT02 | [C25-UT.txt](assets/bukti/C25-UT.txt) |
| C26-UT01 – C26-UT03 | [C26-UT.txt](assets/bukti/C26-UT.txt) |
| C27-UT01 – C27-UT11 | [C27-UT.txt](assets/bukti/C27-UT.txt) |
| C28-UT01 – C28-UT08 | [C28-UT.txt](assets/bukti/C28-UT.txt) |
| C40-UT01 – C40-UT03 | [C40-UT.txt](assets/bukti/C40-UT.txt) |
| C41-UT01 – C41-UT13 | [C41-UT.txt](assets/bukti/C41-UT.txt) |
| C42-UT01 – C42-UT04 | [C42-UT.txt](assets/bukti/C42-UT.txt) |
| C43-UT01 – C43-UT04 | [C43-UT.txt](assets/bukti/C43-UT.txt) |
| SSO-UT01 – SSO-UT30 | [SSO-UT.txt](assets/bukti/SSO-UT.txt) |
| C13, C23, C26, C27, C28, C41, C42, C43, SsoController (coverage) | [coverage-modul-a.txt](assets/bukti/coverage-modul-a.txt) |
| INT-TC01 – INT-TC12 | [INT-TC.txt](assets/bukti/INT-TC.txt) |
| INT-TC03 | <img src="assets/bukti/INT-TC03.png" width="600"> |
| UC01-TC01 | <img src="assets/bukti/UC01-TC01.png" width="600"><br><img src="assets/bukti/UC01-TC01-hasil.png" width="600"> |
| UC01-TC02 | <img src="assets/bukti/UC01-TC02.png" width="600"> |
| UC01-TC03 | <img src="assets/bukti/UC01-TC03.png" width="600"> |
| UC02-TC01 | <img src="assets/bukti/UC02-TC01.png" width="600"><br><img src="assets/bukti/UC02-TC01-hasil.png" width="600"> |
| UC02-TC02 | <img src="assets/bukti/UC02-TC02.png" width="600"> |
| UC02-TC03 | <img src="assets/bukti/UC02-TC03.png" width="600"> |
| UC02-TC04 | <img src="assets/bukti/UC02-TC04.png" width="600"> |
| UC03-TC01 | <img src="assets/bukti/UC03-TC01.png" width="600"> |
| UC03-TC02 | <img src="assets/bukti/UC03-TC02.png" width="600"> |
| UC03-TC03 | <img src="assets/bukti/UC03-TC03.png" width="600"> |
| UC03-TC04 | <img src="assets/bukti/UC03-TC04.png" width="600"> |
| UC04-TC01 | <img src="assets/bukti/UC04-TC01.png" width="600"><br><img src="assets/bukti/UC04-TC01-hasil.png" width="600"> |
| UC05-TC01 | <img src="assets/bukti/UC05-TC01.png" width="600"> |
| UC06-TC01 | <img src="assets/bukti/UC06-TC01.png" width="600"> |
| KNF03-TC01 | [KNF03-TC01.txt](assets/bukti/KNF03-TC01.txt) |
| KNF03-TC02 | [KNF03-TC02.txt](assets/bukti/KNF03-TC02.txt) |
| KNF03-TC03 | [KNF03-TC03.txt](assets/bukti/KNF03-TC03.txt) |
| C03-UT01 s.d. C03-UT03 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C04-UT01 s.d. C04-UT06 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C14-UT01 s.d. C14-UT18 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C29-UT01 s.d. C29-UT04 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C30-UT01 s.d. C30-UT03 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C31-UT01 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C32-UT01 | [Hasil unit test](assets/bukti/unit-modul-b.txt) |
| C04, C14, C29, C30 (coverage) | [Laporan coverage per berkas](assets/bukti/unit-modul-b.txt) |
| INT-TC13 s.d. INT-TC23 | [Hasil pengujian integrasi](assets/bukti/integrasi-modul-b.json) |
| UC07-TC01 | <img src="assets/bukti/UC07-TC01.png" width="600"> |
| UC07-TC02 | <img src="assets/bukti/UC07-TC02.png" width="600"> |
| UC07-TC03 | <img src="assets/bukti/UC07-TC03.png" width="600"> |
| UC08-TC01 | <img src="assets/bukti/UC08-TC01.png" width="600"> |
| UC09-TC01 | <img src="assets/bukti/UC09-TC01.png" width="600"> |
| UC09-TC02 | <img src="assets/bukti/UC09-TC02.png" width="600"> |
| UC09-TC03 | <img src="assets/bukti/UC09-TC03.png" width="600"> |
| UC09-TC04 | <img src="assets/bukti/UC09-TC04-akses.png" width="600"><br><img src="assets/bukti/UC09-TC04.png" width="600"> |
| UC10-TC01 | <img src="assets/bukti/UC10-TC01.png" width="600"> |
| UC10-TC02 | <img src="assets/bukti/UC10-TC02.png" width="600"> |
| UC10-TC03 | <img src="assets/bukti/UC10-TC03.png" width="600"> |
| UC11-TC01 | <img src="assets/bukti/UC11-TC01.png" width="600"> |
| UC11-TC02 | <img src="assets/bukti/UC11-TC02.png" width="600"> |
| UC11-TC03 | <img src="assets/bukti/UC11-TC03.png" width="600"> |
| UC12-TC01 | <img src="assets/bukti/UC12-TC01.png" width="600"> |
| UC12-TC02 | <img src="assets/bukti/UC12-TC02.png" width="600"> |
| UC12-TC03 | <img src="assets/bukti/UC12-TC03.png" width="600"> |
| KNF04-TC01 | [KNF04-TC01.txt](assets/bukti/KNF04-TC01.txt) · skrip [knf04.cjs](assets/bukti/knf04.cjs) |
| KNF01-TC01 | [KNF01-TC01.md](assets/bukti/KNF01-TC01.md) (rekap 5 responden, catatan pengamat, usulan perbaikan) |
| C10-UT01 s.d. C45-UT06 (141 test Modul E, termasuk C29-UT05 s.d. C29-UT16 dan C30-UT04 s.d. C30-UT10) | [unit-modul-e.txt](assets/bukti/unit-modul-e.txt) |
| C20, C21, C29, C30, C36, C37, C45 (coverage Modul E) | [coverage-modul-e.txt](assets/bukti/coverage-modul-e.txt) |
| C11-UT04 (sebelum perbaikan) | [C11-UT04-gagal-sebelum-perbaikan.txt](assets/bukti/C11-UT04-gagal-sebelum-perbaikan.txt) |
| INT-TC24 s.d. INT-TC34 | [integrasi-modul-e.txt](assets/bukti/integrasi-modul-e.txt) |
| UC19-TC01 | <img src="assets/bukti/UC19-TC01-kirim.png" width="600"><br><img src="assets/bukti/UC19-TC01-admin.png" width="600"> |
| UC19-TC02 | Pada `v9.0`:<br><img src="assets/bukti/UC19-TC02-percakapan-v9.0.png" width="600"><br>Setelah perbaikan:<br><img src="assets/bukti/UC19-TC02-percakapan.png" width="600"><br><img src="assets/bukti/UC19-TC02-admin.png" width="600"> |
| UC19-TC03 | <img src="assets/bukti/UC19-TC03.png" width="600"> |
| UC19-TC04 | <img src="assets/bukti/UC19-TC04.png" width="600"> |
| UC20-TC01 | <img src="assets/bukti/UC20-TC01.png" width="600"> |
| UC20-TC02 | <img src="assets/bukti/UC20-TC02.png" width="600"> |
| UC20-TC03 | Pada `v9.0`:<br><img src="assets/bukti/UC20-TC03-v9.0.png" width="600"><br>Setelah perbaikan:<br><img src="assets/bukti/UC20-TC03.png" width="600"> |
| UC21-TC01 | <img src="assets/bukti/UC21-TC01.png" width="600"> |
| UC21-TC02 | Pada `v9.0`:<br><img src="assets/bukti/UC21-TC02-v9.0.png" width="600"><br>Setelah perbaikan:<br><img src="assets/bukti/UC21-TC02.png" width="600"> |
| UC22-TC01 | <img src="assets/bukti/UC22-TC01-admin.png" width="600"><br><img src="assets/bukti/UC22-TC01-katalog.png" width="600"> |
| UC23-TC01 | Pada `v9.0`:<br><img src="assets/bukti/UC23-TC01-admin-v9.0.png" width="600"><br><img src="assets/bukti/UC23-TC01-penjual-v9.0.png" width="600"><br>Setelah perbaikan:<br><img src="assets/bukti/UC23-TC01-admin.png" width="600"><br><img src="assets/bukti/UC23-TC01-penjual.png" width="600"><br><img src="assets/bukti/UC23-TC01-login.png" width="600"> |
| UC24-TC01 | Pada `v9.0`:<br><img src="assets/bukti/UC24-TC01-admin-v9.0.png" width="600"><br><img src="assets/bukti/UC24-TC01-katalog-v9.0.png" width="600"><br>Setelah perbaikan:<br><img src="assets/bukti/UC24-TC01-admin.png" width="600"><br><img src="assets/bukti/UC24-TC01-katalog.png" width="600"> |
| UC19-TC01 s.d. UC24-TC01, KNF02-TC01, KNF02-TC02, KNF02-TC04 (hasil setiap pemeriksaan) | [use-case-modul-e-v9.0.json](assets/bukti/use-case-modul-e-v9.0.json), [use-case-modul-e-perbaikan.json](assets/bukti/use-case-modul-e-perbaikan.json) |
| Skrip uji use case dan penangkap SMTP Modul E | [uji-use-case-modul-e.cjs](assets/skrip/uji-use-case-modul-e.cjs), [penangkap-smtp.cjs](assets/skrip/penangkap-smtp.cjs) |
| KNF02-TC03 | Keluaran C38-UT02 dan C39-UT06 pada [unit-modul-e.txt](assets/bukti/unit-modul-e.txt) |
| KNF02-TC02 | <img src="assets/bukti/KNF02-TC02.png" width="600"> |
| KNF02-TC01, KNF02-TC04 | Pemeriksaan `KNF02-TC01` dan `KNF02-TC04` pada [use-case-modul-e-perbaikan.json](assets/bukti/use-case-modul-e-perbaikan.json) |
| C15-UT01 s.d. C15-UT11 | [unit-modul-c.txt](assets/bukti/unit-modul-c.txt) |
| C16-UT01 s.d. C16-UT11 | [unit-modul-c.txt](assets/bukti/unit-modul-c.txt) |
| C17-UT01 s.d. C17-UT14 | [unit-modul-c.txt](assets/bukti/unit-modul-c.txt) |
| C29-UT17 s.d. C29-UT27 | [unit-modul-c.txt](assets/bukti/unit-modul-c.txt) |
| C05-UT01 s.d. C05-UT06, C07-UT01 s.d. C07-UT05 | [view-modul-c.txt](assets/bukti/view-modul-c.txt) |
| C15, C16, C17, C29 (coverage) | [coverage-modul-c.txt](assets/bukti/coverage-modul-c.txt) |
| INT-TC35 s.d. INT-TC45 | [int-modul-c.txt](assets/bukti/int-modul-c.txt) |
| UC13-TC01 | <img src="assets/bukti/UC13-TC01.png" width="600"><br><img src="assets/bukti/UC13-TC01-navigasi.png" width="600"><br><img src="assets/bukti/UC13-TC01-hasil.png" width="600"><br><img src="assets/bukti/UC13-TC01-detail.png" width="600"> |
| UC13-TC02 | <img src="assets/bukti/UC13-TC02.png" width="600"><br><img src="assets/bukti/UC13-TC02-terminal.png" width="600"> |
| UC13-TC03 | <img src="assets/bukti/UC13-TC03.png" width="600"><br><img src="assets/bukti/UC13-TC03-sebelum.png" width="600"><br><img src="assets/bukti/UC13-TC03-penjual.png" width="600"><br><img src="assets/bukti/UC13-TC03-hasil.png" width="600"> |
| UC14-TC01 | <img src="assets/bukti/UC14-TC01.png" width="600"><br><img src="assets/bukti/UC14-TC01-filter.png" width="600"><br><img src="assets/bukti/UC14-TC01-hasil.png" width="600"> |
| UC14-TC02 | <img src="assets/bukti/UC14-TC02.png" width="600"><br><img src="assets/bukti/UC14-TC02-hasil.png" width="600"> |
| UC14-TC03 | <img src="assets/bukti/UC14-TC03.png" width="600"><br><img src="assets/bukti/UC14-TC03-hasil.png" width="600"> |
| UC15-TC01 | <img src="assets/bukti/UC15-TC01.png" width="600"><br><img src="assets/bukti/UC15-TC01-galeri.png" width="600"><br><img src="assets/bukti/UC15-TC01-hasil.png" width="600"> |
| UC15-TC02 | <img src="assets/bukti/UC15-TC02.png" width="600"> |
| UC15-TC03 | <img src="assets/bukti/UC15-TC03.png" width="600"><br><img src="assets/bukti/UC15-TC03-nonaktif.png" width="600"><br><img src="assets/bukti/UC15-TC03-hasil.png" width="600"> |
| UC15-TC04 | <img src="assets/bukti/UC15-TC04.png" width="600"> |
| UC13-TC01 s.d. UC15-TC04 (penyiapan data) | [data-uji-modul-c.cjs](assets/bukti/data-uji-modul-c.cjs) |
| *[ID pengujian]* | *[Bukti hasil pengujian]* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KF01 | KNF03, KNF04 | UC01 | C01 - HalamanOtentikasi<br>C13 - AkunController | `src/views/pages/daftar.html`<br>`src/views/js/HalamanOtentikasi.js` | UC01-TC01 | C01-UT01 |
| KF02 | KNF03, KNF04 | UC01 | C13 - AkunController<br>C23 - Akun | `src/controllers/AkunController.js`<br>`src/models/Akun.js`<br>`src/routes/akunRoutes.js` | UC01-TC01 | C13-UT07, C23-UT01, INT-TC01, INT-TC12 |
| KF03 | KNF03, KNF04 | UC03 | C01 - HalamanOtentikasi<br>C13 - AkunController<br>C28 - SesiLogin<br>C41 - Otorisasi | `src/views/pages/masuk.html`<br>`src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js`<br>`src/models/SesiLogin.js` | UC03-TC01 | C01-UT04, C13-UT31, INT-TC07, KNF03-TC01 |
| KF04 | KNF03, KNF04 | UC05 | C02 - HalamanProfil<br>C13 - AkunController<br>C23 - Akun | `src/views/pages/profil.html`<br>`src/views/js/HalamanProfil.js`<br>`src/controllers/AkunController.js`<br>`src/routes/akunRoutes.js` | UC05-TC01 | C13-UT39, C13-UT40, C23-UT12, INT-TC12 |
| KF05 | KNF03, KNF04 | UC01 | C01 - HalamanOtentikasi<br>C13 - AkunController<br>C23 - Akun | `src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js`<br>`src/models/Akun.js`<br>`src/database/schema.sql` (indeks `akun_email_unik`) | UC01-TC02, UC01-TC03 | C01-UT02, C13-UT01 s.d. C13-UT03, C13-UT11, C13-UT12, C13-UT15, C13-UT17, C23-UT04, INT-TC02, KNF03-TC01 |
| KF06 | KNF03 | UC01<br>UC02 | C13 - AkunController<br>C19 - NotifikasiController<br>C27 - TokenVerifikasi<br>C43 - SurelAdapter | `src/controllers/AkunController.js`<br>`src/controllers/NotifikasiController.js`<br>`src/models/TokenVerifikasi.js`<br>`src/integrasi/SurelAdapter.js` | UC01-TC01, UC02-TC01, UC02-TC03, UC02-TC04 | C13-UT07, C13-UT26, C13-UT43, C27-UT01, C27-UT08, C27-UT09, C43-UT01, INT-TC01, INT-TC03, INT-TC06 |
| KF07 | KNF03 | UC01<br>UC02 | C01 - HalamanOtentikasi<br>C13 - AkunController<br>C23 - Akun<br>C27 - TokenVerifikasi | `src/views/pages/verifikasi.html`<br>`src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js`<br>`src/models/TokenVerifikasi.js` | UC01-TC01, UC02-TC01, UC02-TC02, UC02-TC03 | C01-UT06, C13-UT19 s.d. C13-UT26, C23-UT08, C27-UT05 s.d. C27-UT07, C27-UT10, INT-TC05 |
| KF08 | KNF03 | UC02<br>UC03 | C01 - HalamanOtentikasi<br>C13 - AkunController<br>C27 - TokenVerifikasi | `src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js`<br>`src/models/TokenVerifikasi.js` | UC02-TC04, UC03-TC03 | C13-UT27 s.d. C13-UT30, C13-UT35, C13-UT44, C27-UT11, INT-TC06 |
| KF09 | KNF03 | UC01 | C13 - AkunController<br>C42 - Kriptografi | `src/pendukung/Kriptografi.js`<br>`src/controllers/AkunController.js` | UC01-TC01 | C42-UT01, C42-UT02, C13-UT07, INT-TC01, KNF03-TC02 |
| KF10 | KNF03 | UC03 | C13 - AkunController<br>C42 - Kriptografi | `src/pendukung/Kriptografi.js`<br>`src/controllers/AkunController.js` | UC03-TC01, UC03-TC02 | C42-UT03, C42-UT04, C13-UT34, INT-TC07 |
| KF11 | KNF03 | UC03 | C13 - AkunController<br>C28 - SesiLogin<br>C41 - Otorisasi | `src/models/SesiLogin.js`<br>`src/pendukung/Otorisasi.js`<br>`src/controllers/AkunController.js` | UC03-TC01 | C13-UT31, C28-UT01 s.d. C28-UT05, C41-UT02 s.d. C41-UT04, INT-TC07, INT-TC08 |
| KF12 | KNF03 | UC04 | C01 - HalamanOtentikasi<br>C13 - AkunController<br>C28 - SesiLogin | `src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js`<br>`src/models/SesiLogin.js` | UC04-TC01 | C13-UT37, C13-UT38, C28-UT07, INT-TC07, INT-TC12 |
| KF13 | KNF03 | UC01<br>UC06 | C01 - HalamanOtentikasi<br>C12 - HalamanDokumenLegal<br>C13 - AkunController<br>C22 - DokumenLegalController<br>C40 - DokumenLegal | `src/views/pages/daftar.html`<br>`src/views/pages/legal.html`<br>`src/views/js/HalamanDokumenLegal.js`<br>`src/controllers/DokumenLegalController.js`<br>`src/models/DokumenLegal.js` | UC01-TC01, UC06-TC01 | C13-UT41, C13-UT42, C22-UT01 s.d. C22-UT03, C40-UT01 s.d. C40-UT03, INT-TC10 |
| KF14 | KNF03 | UC01 | C01 - HalamanOtentikasi<br>C13 - AkunController | `src/views/js/HalamanOtentikasi.js`<br>`src/controllers/AkunController.js` | - (bukan skenario SKPL UC01) | C01-UT03, C13-UT04 s.d. C13-UT06, C13-UT09, C13-UT51 |
| KF38 | KNF03 | UC06 | C12 - HalamanDokumenLegal<br>C22 - DokumenLegalController<br>C40 - DokumenLegal | `src/views/js/HalamanDokumenLegal.js`<br>`src/controllers/DokumenLegalController.js`<br>`src/database/seedDokumenLegal.js` | UC06-TC01 | C22-UT04, C22-UT05, C40-UT01, INT-TC10 |
| KF39 | KNF03 | UC05<br>UC06<br>UC16, UC17 | C01 - HalamanOtentikasi<br>C02 - HalamanProfil<br>C08 - HalamanPercakapan<br>C13 - AkunController | `src/views/pages/daftar.html`<br>`src/views/pages/profil.html`<br>`src/views/pages/percakapan.html` | UC05-TC01, UC06-TC01, test case UC16 dan UC17 (Modul D) | C13-UT41, INT-TC10 |
| KF15 | KNF01 | UC07 | C04 - FormulirBarang<br>C14 - BarangController<br>C31 - Kategori<br>C32 - LokasiCOD | `src/views/pages/listing-form.html`<br>`src/views/js/FormulirBarang.js`<br>`src/controllers/BarangController.js`<br>`src/models/ReferensiListing.js` | UC07-TC01 | C04-UT06, C14-UT17, C31-UT01, C32-UT01; KNF01-TC01 |
| KF16 | KNF01 | UC07 | C04 - FormulirBarang<br>C14 - BarangController<br>C25 - Penjual<br>C28 - SesiLogin<br>C29 - Barang<br>C30 - FotoBarang<br>C41 - Otorisasi<br>C45 - PenyimpananBerkas | `src/services/ListingService.js`<br>`src/models/Barang.js`<br>`src/models/ListingPenjual.js`<br>`src/models/FotoBarang.js`<br>`src/routes/barangRoutes.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC07-TC01 | C14-UT08, C29-UT02, C30-UT02; INT-TC13, INT-TC21; KNF01-TC01 |
| KF18 | - | UC07, UC09 | C04 - FormulirBarang<br>C14 - BarangController<br>C29 - Barang | `src/views/js/FormulirBarang.js`<br>`src/services/ListingService.js` | UC07-TC02, UC09-TC02 | C04-UT02, C14-UT03, C14-UT09; INT-TC22 |
| KF19 | - | UC07, UC09 | C04 - FormulirBarang<br>C14 - BarangController<br>C31 - Kategori | `src/models/ReferensiListing.js`<br>`src/services/ListingService.js`<br>`src/views/js/FormulirBarang.js` | UC07-TC01 | C31-UT01, C14-UT03, C04-UT06 |
| KF20 | - | UC08 | C03 - HalamanListingPenjual<br>C06 - KartuProduk<br>C14 - BarangController<br>C25 - Penjual<br>C28 - SesiLogin<br>C29 - Barang<br>C41 - Otorisasi | `src/views/pages/listing-saya.html`<br>`src/views/js/HalamanListingPenjual.js`<br>`src/views/js/ListingUI.js`<br>`src/controllers/BarangController.js`<br>`src/models/Barang.js` | UC08-TC01 | C03-UT01, C03-UT02, C14-UT17, C29-UT01; INT-TC14 |
| KF21 | - | UC09, UC10 | C03 - HalamanListingPenjual<br>C04 - FormulirBarang<br>C14 - BarangController<br>C25 - Penjual<br>C29 - Barang<br>C30 - FotoBarang<br>C31 - Kategori<br>C32 - LokasiCOD<br>C45 - PenyimpananBerkas | `src/services/ListingService.js`<br>`src/models/ListingPenjual.js`<br>`src/models/Barang.js`<br>`src/models/FotoBarang.js`<br>`src/views/js/FormulirBarang.js`<br>`src/views/js/HalamanListingPenjual.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC09-TC01, UC09-TC02, UC09-TC03, UC10-TC01, UC10-TC02 | C04-UT03, C04-UT04, C14-UT11 s.d. C14-UT14, C29-UT02, C29-UT03, C30-UT03; INT-TC15, INT-TC23 |
| KF22 | - | UC09, UC10 | C03 - HalamanListingPenjual<br>C04 - FormulirBarang<br>C14 - BarangController<br>C25 - Penjual<br>C28 - SesiLogin<br>C29 - Barang<br>C41 - Otorisasi | `src/routes/barangRoutes.js`<br>`src/services/ListingService.js`<br>`src/models/ListingPenjual.js`<br>`src/pendukung/Otorisasi.js` | UC09-TC04, UC10-TC03 | C14-UT07, C14-UT10, C14-UT14; INT-TC16 |
| KF23 | - | UC07, UC09 | C04 - FormulirBarang<br>C14 - BarangController<br>C30 - FotoBarang<br>C45 - PenyimpananBerkas | `src/views/js/FormulirBarang.js`<br>`src/routes/barangRoutes.js`<br>`src/services/ListingService.js`<br>`src/models/FotoBarang.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC07-TC01, UC07-TC03, UC09-TC01, UC09-TC03 | C04-UT01, C14-UT04, C14-UT05, C14-UT08, C30-UT01; INT-TC13, INT-TC21, INT-TC22 |
| KF24 | - | UC07, UC09 | C04 - FormulirBarang<br>C14 - BarangController<br>C30 - FotoBarang | `src/views/js/FormulirBarang.js`<br>`src/routes/barangRoutes.js`<br>`src/services/ListingService.js`<br>`src/models/FotoBarang.js` | UC07-TC03, UC09-TC03 | C04-UT01, C14-UT05, C14-UT09, C30-UT01; INT-TC22 |
| KF40 | KNF01 | UC11 | C03 - HalamanListingPenjual<br>C14 - BarangController<br>C25 - Penjual<br>C28 - SesiLogin<br>C29 - Barang<br>C41 - Otorisasi | `src/views/js/HalamanListingPenjual.js`<br>`src/services/ListingService.js`<br>`src/models/ListingPenjual.js` | UC11-TC01, UC11-TC02, UC11-TC03 | C03-UT03, C14-UT15, C14-UT16, C29-UT04; INT-TC17, INT-TC18; KNF01-TC01 |
| KF41 | KNF01 | UC12 | C03 - HalamanListingPenjual<br>C14 - BarangController<br>C25 - Penjual<br>C28 - SesiLogin<br>C29 - Barang<br>C41 - Otorisasi | `src/views/js/HalamanListingPenjual.js`<br>`src/services/ListingService.js`<br>`src/models/ListingPenjual.js` | UC12-TC01, UC12-TC02, UC12-TC03 | C03-UT03, C14-UT15, C14-UT16, C29-UT04; INT-TC19, INT-TC20; KNF01-TC01 |
| KF42 | - | UC08, UC11, UC12 | C03 - HalamanListingPenjual<br>C06 - KartuProduk<br>C14 - BarangController<br>C29 - Barang | `src/views/js/HalamanListingPenjual.js`<br>`src/views/js/ListingUI.js`<br>`src/models/Barang.js`<br>`src/models/ListingPenjual.js` | UC08-TC01; UC11-TC01, UC11-TC03; UC12-TC01, UC12-TC02, UC12-TC03 | C29-UT01, C29-UT04; INT-TC17 s.d. INT-TC20 |
| KF17 | KNF01 | UC15 | C07 - HalamanDetailBarang<br>C15 - KatalogController<br>C29 - Barang | `src/views/pages/barang.html`<br>`src/views/js/HalamanDetailBarang.js`<br>`src/controllers/KatalogController.js`<br>`src/routes/katalogRoutes.js`<br>`src/models/Barang.js` | UC15-TC01, UC15-TC02, UC15-TC03, UC15-TC04 | C15-UT08 s.d. C15-UT11, C29-UT26, C29-UT27; INT-TC42, INT-TC43 |
| KF25 | KNF01 | UC14 | C05 - HalamanKatalog<br>C16 - PencarianController<br>C29 - Barang | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/views/js/layoutKatalog.js`<br>`src/controllers/PencarianController.js`<br>`src/models/Barang.js` | UC14-TC01 | C16-UT01 s.d. C16-UT11, C15-UT02, C29-UT19, C29-UT20; INT-TC37 |
| KF26 | KNF01 | UC14 | C05 - HalamanKatalog<br>C17 - FilterController<br>C29 - Barang | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/controllers/FilterController.js`<br>`src/models/Barang.js` | UC14-TC01, UC14-TC03 | C17-UT01 s.d. C17-UT05, C17-UT09, C17-UT10, C15-UT06, C29-UT21, C29-UT22; INT-TC38, INT-TC41 |
| KF27 | KNF01 | UC14 | C05 - HalamanKatalog<br>C17 - FilterController<br>C29 - Barang | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/controllers/FilterController.js`<br>`src/models/Barang.js` | UC14-TC01 | C17-UT06, C17-UT07, C29-UT23, C29-UT24; INT-TC39 |
| KF28 | - | UC13, UC14 | C05 - HalamanKatalog<br>C06 - KartuProduk<br>C15 - KatalogController<br>C17 - FilterController<br>C29 - Barang | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/views/js/KartuProduk.js`<br>`src/controllers/KatalogController.js`<br>`src/routes/katalogRoutes.js`<br>`src/controllers/FilterController.js`<br>`src/models/Barang.js` | UC13-TC01, UC14-TC01 | C15-UT01, C15-UT03, C15-UT05, C17-UT08, C17-UT12 s.d. C17-UT14, C29-UT17, C29-UT25; INT-TC35, INT-TC45 |
| KF29 | - | UC14 | C05 - HalamanKatalog<br>C15 - KatalogController | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/controllers/KatalogController.js` | UC14-TC02 | C15-UT04; INT-TC40 |
| KF30 | KNF01 | UC13, UC14 | C05 - HalamanKatalog<br>C15 - KatalogController<br>C29 - Barang | `src/views/pages/katalog.html`<br>`src/views/js/HalamanKatalog.js`<br>`src/controllers/KatalogController.js`<br>`src/routes/katalogRoutes.js`<br>`src/models/Barang.js` | UC13-TC01, UC13-TC02, UC13-TC03 | C29-UT17, C29-UT26, C29-UT27; INT-TC36, INT-TC43 |
| KF37 | - | UC19 | C20 - LaporanController<br>C10 - FormulirLaporan<br>C08 - HalamanPercakapan | `src/controllers/LaporanController.js`<br>`src/views/js/FormulirLaporan.js`<br>`src/views/js/HalamanPercakapan.js`<br>`src/views/pages/percakapan.html` | UC19-TC02 | C20-UT09, C20-UT23 |
| KF43 | - | UC19 | C10 - FormulirLaporan<br>C20 - LaporanController | `src/views/js/FormulirLaporan.js`<br>`src/controllers/LaporanController.js` | UC19-TC01, UC19-TC02, UC19-TC03 | C10-UT01, C10-UT02, C20-UT01 sampai C20-UT04, C20-UT11, C20-UT14 |
| KF44 | - | UC19 | C10 - FormulirLaporan<br>C20 - LaporanController<br>C37 - BuktiLaporan<br>C45 - PenyimpananBerkas | `src/controllers/LaporanController.js`<br>`src/models/BuktiLaporan.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC19-TC01, UC19-TC04 | C10-UT03 sampai C10-UT06, C20-UT05 sampai C20-UT08, C20-UT12, C20-UT13, C20-UT17, C20-UT18, C37-UT01 sampai C37-UT07, C45-UT01 sampai C45-UT06, INT-TC24, INT-TC31, INT-TC32 |
| KF45 | KNF02 | UC20 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/views/js/DasborAdmin.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC20-TC01 | C21-UT03, C21-UT08, C21-UT11, C36-UT06, C36-UT08, C36-UT12, C36-UT13 |
| KF46 | - | UC20 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC20-TC02 | C21-UT05, C21-UT06, C36-UT02, C36-UT07 |
| KF47 | - | UC21 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/views/js/DasborAdmin.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC21-TC01, UC21-TC02 | C11-UT01 sampai C11-UT04, C21-UT12 sampai C21-UT16, C21-UT19, C36-UT03, C36-UT04, C36-UT10, C36-UT11, INT-TC26 |
| KF48 | KNF02 | UC19<br>UC21<br>UC22<br>UC23 | C20 - LaporanController<br>C21 - ModerasiController<br>C38 - LogAudit | `src/controllers/LaporanController.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/LogAudit.js` | UC19-TC01, UC21-TC01, UC22-TC01, UC23-TC01 | C20-UT20, C20-UT21, C21-UT12, C21-UT18, C21-UT20, C21-UT21, C38-UT01, C38-UT03 sampai C38-UT05, INT-TC24, INT-TC26, INT-TC27, KNF02-TC02 |
| KF49 | KNF02 | UC21<br>UC22<br>UC23 | C38 - LogAudit | `src/models/LogAudit.js` | UC21-TC01 | C38-UT02, C21-UT19, KNF02-TC03 |
| KF50 | - | UC22 | C21 - ModerasiController<br>C29 - Barang<br>C30 - FotoBarang<br>C45 - PenyimpananBerkas | `src/controllers/ModerasiController.js`<br>`src/models/Barang.js`<br>`src/models/FotoBarang.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC22-TC01 | C21-UT22 sampai C21-UT27, C29-UT08, C29-UT14, C30-UT08, C45-UT05, INT-TC30 |
| KF51 | - | UC23<br>UC24 | C21 - ModerasiController<br>C23 - Akun<br>C11 - DasborAdmin | `src/controllers/ModerasiController.js`<br>`src/models/Akun.js`<br>`src/views/js/DasborAdmin.js` | UC23-TC01, UC24-TC01 | C11-UT07, C11-UT08, C21-UT28 sampai C21-UT38, C21-UT43 sampai C21-UT45, INT-TC27, INT-TC28, INT-TC29 |
| KF52 | - | UC22<br>UC23 | C21 - ModerasiController<br>C19 - NotifikasiController<br>C43 - SurelAdapter | `src/controllers/ModerasiController.js`<br>`src/controllers/NotifikasiController.js`<br>`src/integrasi/SurelAdapter.js` | UC22-TC01, UC23-TC01 | C21-UT22, C21-UT28, INT-TC33 |
| KF53 | KNF03 | UC03<br>UC23 | C21 - ModerasiController<br>C28 - SesiLogin<br>C13 - AkunController | `src/controllers/ModerasiController.js`<br>`src/models/SesiLogin.js`<br>`src/controllers/AkunController.js` | UC23-TC01 (dan UC03 milik Modul A) | C21-UT28, INT-TC27 |
| KF54 | - | UC13<br>UC23<br>UC24 | C21 - ModerasiController<br>C29 - Barang | `src/controllers/ModerasiController.js`<br>`src/models/Barang.js` | UC23-TC01, UC24-TC01 (dan UC13 milik Modul C) | C21-UT28, C21-UT34, C21-UT39, C21-UT42, C29-UT09, C29-UT10, C29-UT16, INT-TC27, INT-TC29 |
| KF55 | KNF02 | UC22<br>UC23<br>UC24 | C21 - ModerasiController<br>C39 - LogAdmin | `src/controllers/ModerasiController.js`<br>`src/models/LogAdmin.js` | UC22-TC01, UC23-TC01, UC24-TC01 | C21-UT24, C21-UT30, C21-UT37, C21-UT41, C39-UT01 sampai C39-UT06, KNF02-TC01, INT-TC29 |
| KF56 | KNF02 | UC20<br>UC21<br>UC22<br>UC23<br>UC24 | C21 - ModerasiController<br>C41 - Otorisasi<br>C11 - DasborAdmin | `src/controllers/ModerasiController.js`<br>`src/routes/moderasiRoutes.js`<br>`src/pendukung/Otorisasi.js`<br>`src/views/js/DasborAdmin.js` | UC20-TC03 | C11-UT09, C21-UT02, C21-UT04, C21-UT07, C21-UT10, C21-UT17, C21-UT23, C21-UT29, C21-UT35, C21-UT40, INT-TC34, KNF02-TC04 |
| *[KFXX]* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| KNF03 | Security | KF01 s.d. KF14, KF36, KF38, KF39 / UC01 s.d. UC06, UC16, UC17 | KNF03-TC01, KNF03-TC02, KNF03-TC03 |
| KNF01 | Usability/Ergonomy | KF01, KF02, KF06, KF07, KF15, KF16, KF17, KF25, KF26, KF31, KF32 / UC01, UC02, UC07, UC08, UC14, UC15, UC16, UC17 | KNF01-TC01 |
| KNF02 | Maintainability | KF45, KF48, KF49, KF55, KF56 / UC19 sampai UC24 | KNF02-TC01 sampai KNF02-TC04 |
| KNF04 | Scalability | KF01 s.d. KF05, KF25 s.d. KF28 / UC01, UC03, UC13, UC14 | KNF04-TC01 |
| *[KNFXX]* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
