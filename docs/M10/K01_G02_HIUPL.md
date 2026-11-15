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

> **Status draf (dihapus sebelum tag `v10.0`).** Kerangka ini disusun Ghaniyul sebagai koordinator. Setiap anggota hanya mengisi bagian bertanda *Diisi (nama)* miliknya, tanpa mengubah urutan atau judul bab, supaya penggabungan tidak bentrok. Pembagian lengkap ada pada rencana pembagian tugas M10. Bagian yang sudah terisi: BAB 1, Subbab 3.2 sampai 3.4, dan seluruh bagian Modul E pada BAB 4 dan BAB 5. Dua hal pada draf ini masih usulan dan perlu disepakati kelompok: prefiks `AK-XX` untuk antarmuka antarkomponen (Subbab 1.4) dan pembagian blok nomor test case integrasi.

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
| Antarmuka antarkomponen | AK-XX | Baru pada dokumen ini. Dibedakan dari I-XX karena I-XX sudah dipakai DPPL untuk layar. Blok nomor per modul: A memakai AK-01 sampai AK-09, B AK-10 sampai AK-19, C AK-20 sampai AK-29, D AK-30 sampai AK-39, E AK-40 sampai AK-49 |
| Test Case Unit | CXX-UTYY | XX adalah nomor kelas, YY nomor urut test case pada kelas tersebut. ID ditulis di awal judul test Jest, misalnya `C20-UT21 [Normal] buatLaporan: ...`, sehingga keluaran *test runner* langsung cocok dengan Subbab 4.2 |
| Test Case Integrasi | INT-TCYY | YY adalah nomor urut. Blok nomor per modul: A INT-TC01 sampai INT-TC19, B INT-TC20 sampai INT-TC39, C INT-TC40 sampai INT-TC59, D INT-TC60 sampai INT-TC79, E INT-TC80 sampai INT-TC99 |
| Test Case Use Case | UCXX-TCYY | XX adalah nomor use case, YY nomor urut test case pada use case tersebut |
| Test Case KNF | KNFXX-TCYY | XX adalah nomor KNF, YY nomor urut test case pada KNF tersebut |
| Berkas bukti | `assets/bukti/<ID pengujian>.<png atau txt>` | Satu berkas per ID pengujian atau per kelompok ID yang berbagi satu keluaran *test runner* |

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

> *Diisi I Made Adi (Modul C).* *System overview* dan *use case diagram*, dapat diringkas dari SKPL BAB 2 dan BAB 4. Diagram use case terakhir ada di `docs/M5/assets/diagram/Diagram_UseCase_M4.jpg`; salin ke `docs/M10/assets/` bila dipakai.

<p align="center">
<img alt="Use Case Diagram ITBELI" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram ITBELI</i>
</p>

<br>

---

# BAB 3: Implementasi

ITBELI adalah aplikasi web Node.js. Kode JavaScript dijalankan langsung oleh Node.js di server dan oleh peramban di klien, sehingga tidak ada berkas *executable* hasil kompilasi. Kolom *Nama File Executable* pada Tabel 3.2 sampai 3.4 diisi `-`; aplikasi dijalankan dengan `npm start` dari folder `src/`, yang menjalankan `node server.js`. Perubahan terhadap DPPL tercatat pada Tabel B.1 laporan Implementasi Tugas 9.

## 3.1 Lingkungan Implementasi

> *Diisi Dhanesworo (Modul A).* Harus konsisten dengan DPPL Subbab 2.1 dan Tabel B.1 laporan Implementasi (perubahan ke PostgreSQL lokal, Mailpit, Vercel, Neon, dan Vercel Blob). Cantumkan juga Jest 30 dan Supertest 7 sebagai alat uji.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | |
| *Operating System* | |
| *Bahasa Pemrograman* | |
| *Framework/Library* | |
| *DBMS* | |
| *Development Tools* | |
| *Testing Tools* | |

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
| 29 | C29 | Barang (Operasi katalog diuji Modul C, operasi lain diuji Modul E) | `src/models/Barang.js`, `src/models/ListingPenjual.js` (`kunci`, `update`, `setStatus`) | - |
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
| 18 | `src/tests/unit/*.test.js` | Test unit Jest (20 berkas) |
| 19 | `src/tests/integration/*.test.js` | Test API dengan Supertest (8 berkas); basis data diganti tiruan, sehingga tidak dihitung sebagai pengujian integrasi pada Subbab 4.3 |
| 20 | `docs/M10/assets/skrip/tabel-uji-unit.js` | Menyusun baris Tabel 4.2 dari keluaran Jest |
| 21 | `docs/M9/assets/profiling/*` | Skrip pengisi data uji dan pengukuran katalog dari Tugas 9 |

<br>

---

# BAB 4: Hasil Pengujian

Pengujian dilakukan pada kode di tag `v9.0` (commit `485af76`). Hasil aktual ditulis dari pengamatan saat test dijalankan. Kesimpulan diisi `Pass` atau `Fail`; untuk `Fail` dicantumkan penyebab dan usulan perbaikannya. Test yang belum dijalankan ditandai *Belum dijalankan* dan tidak dihitung sebagai `Pass`.

Satu cacat ditemukan selama pengujian unit Modul E dan langsung diperbaiki setelah buktinya disimpan: C11-UT04 gagal pada `v9.0` dan lulus setelah commit `f8e7224`. Selain perbaikan itu, kode yang diuji sama dengan `v9.0`.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Kelas bertingkat **Mendalam** memuat logika bisnis, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Kelas bertingkat **Sedang** hanya mengoordinasikan atau mendelegasikan proses. Kelas bertingkat **Tidak perlu** tidak memuat logika dan teruji tidak langsung lewat test case use case.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C01 | HalamanOtentikasi | *Diisi Dhanesworo (Modul A)* | | |
| C02 | HalamanProfil | *Diisi Dhanesworo (Modul A)* | | |
| C03 | HalamanListingPenjual | *Diisi Nazhif (Modul B)* | | |
| C04 | FormulirBarang | *Diisi Nazhif (Modul B)* | | |
| C05 | HalamanKatalog | *Diisi I Made Adi (Modul C)* | | |
| C06 | KartuProduk | *Diisi I Made Adi (Modul C)* | | |
| C07 | HalamanDetailBarang | *Diisi I Made Adi (Modul C)* | | |
| C08 | HalamanPercakapan | *Diisi Sulthan (Modul D)* | | |
| C09 | PanelNotifikasi | *Diisi Sulthan (Modul D)* | | |
| C10 | FormulirLaporan | Sedang | Mengoordinasikan formulir I-12 dan memanggil `POST /api/laporan`. Validasi isian dan bukti di sisi klien hanya mempercepat umpan balik; aturan yang mengikat diulang di C20 | C10-UT01 sampai C10-UT08, UC19-TC01 sampai UC19-TC04 |
| C11 | DasborAdmin | Sedang | Mengoordinasikan tampilan I-13 dan I-14 serta memanggil `/api/admin/*`. Satu-satunya aturan, urutan status, sama dengan aturan di C36 yang diuji mendalam | C11-UT01 sampai C11-UT06, UC20-TC01 sampai UC24-TC01 |
| C12 | HalamanDokumenLegal | *Diisi Dhanesworo (Modul A)* | | |
| C13 | AkunController | *Diisi Dhanesworo (Modul A)* | | |
| C14 | BarangController | *Diisi Nazhif (Modul B)* | | |
| C15 | KatalogController | *Diisi I Made Adi (Modul C)* | | |
| C16 | PencarianController | *Diisi I Made Adi (Modul C)* | | |
| C17 | FilterController | *Diisi I Made Adi (Modul C)* | | |
| C18 | PercakapanController | *Diisi Sulthan (Modul D)* | | |
| C19 | NotifikasiController | *Diisi Sulthan (Modul D)* | | |
| C20 | LaporanController | Mendalam | Validasi data dan bukti laporan (KF43, KF44), privasi laporan percakapan (KF37), dan transaksi Algo-021 | C20-UT01 sampai C20-UT23, INT-TC80, INT-TC81 |
| C21 | ModerasiController | Mendalam | Otorisasi admin (KF56), aturan urutan status, serta transaksi Algo-022, Algo-023, dan Algo-024 | C21-UT01 sampai C21-UT42, INT-TC82 sampai INT-TC86, INT-TC88 |
| C22 | DokumenLegalController | *Diisi Dhanesworo (Modul A)* | | |
| C23 | Akun | *Diisi Dhanesworo (Modul A)* | | |
| C24 | Pembeli | *Diisi Dhanesworo (Modul A)* | | |
| C25 | Penjual | *Diisi Dhanesworo (Modul A)* | | |
| C26 | Admin | *Diisi Dhanesworo (Modul A)* | | |
| C27 | TokenVerifikasi | *Diisi Dhanesworo (Modul A)* | | |
| C28 | SesiLogin | *Diisi Dhanesworo (Modul A)* | | |
| C29 | Barang | Mendalam | Kueri katalog Algo-032 dengan pencarian, filter, urutan, dan paginasi, serta perubahan status massal saat akun diblokir | C29-UT01 sampai C29-UT12 (Modul E), test operasi katalog oleh Modul C |
| C30 | FotoBarang | Mendalam | Validasi format dan ukuran foto (KF23, KF24) | C30-UT01 sampai C30-UT07 |
| C31 | Kategori | *Diisi Nazhif (Modul B)* | | |
| C32 | LokasiCOD | *Diisi Nazhif (Modul B)* | | |
| C33 | Percakapan | *Diisi Sulthan (Modul D)* | | |
| C34 | Pesan | *Diisi Sulthan (Modul D)* | | |
| C35 | Notifikasi | *Diisi Sulthan (Modul D)* | | |
| C36 | Laporan | Mendalam | Aturan transisi status penanganan (KF47) dan statistik per status | C36-UT01 sampai C36-UT13, INT-TC82 |
| C37 | BuktiLaporan | Mendalam | Validasi lampiran wajib Algo-056 (KF44) | C37-UT01 sampai C37-UT07, INT-TC80 |
| C38 | LogAudit | Sedang | Hanya menyusun kueri INSERT tanpa aturan. Sifat hanya-tambah (KF49) dibuktikan lewat ketiadaan operasi ubah dan hapus | C38-UT01 sampai C38-UT05, KNF02-TC02, KNF02-TC03 |
| C39 | LogAdmin | Sedang | Hanya menyusun kueri INSERT dan SELECT tanpa aturan | C39-UT01 sampai C39-UT06, KNF02-TC01 |
| C40 | DokumenLegal | *Diisi Dhanesworo (Modul A)* | | |
| C41 | Otorisasi | *Diisi Dhanesworo (Modul A)* | | |
| C42 | Kriptografi | *Diisi Dhanesworo (Modul A)* | | |
| C43 | SurelAdapter | *Diisi Dhanesworo (Modul A)* | | |
| C44 | PushNotifikasiAdapter | *Diisi Sulthan (Modul D)* | | |
| C45 | PenyimpananBerkas | Mendalam | Integrasi dengan sistem berkas dan Vercel Blob, termasuk penghapusan berkas yang sempat tersimpan saat unggahan gagal | C45-UT01 sampai C45-UT06, 8 test mode Vercel Blob (`PenyimpananBerkasBlob.test.js`), INT-TC85, INT-TC86, INT-TC87 |
| - | ListingService | *Diisi Nazhif (Modul B)* | | |
| - | ListingPenjual | *Diisi Nazhif (Modul B)* | | |
| - | LanggananPush | *Diisi Sulthan (Modul D)* | | |
| - | SsoController | *Diisi Dhanesworo (Modul A)* | | |

## 4.2 Pengujian Unit Kelas

Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, dan harus mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utamanya.

Cara menjalankan unit test, dari folder `src/` setelah `npm ci`:

```bash
npm test                                  # seluruh test
npx jest --coverage                       # test beserta laporan coverage per berkas
npx jest --runInBand --json --outputFile=hasil-jest.json
node ../docs/M10/assets/skrip/tabel-uji-unit.js hasil-jest.json C20 C21   # baris Tabel 4.2 dari hasil Jest
```

Lokasi file test: `src/tests/unit/` untuk test unit dan `src/tests/integration/` untuk test API. Test unit memakai tiruan untuk basis data dan layanan luar, sehingga tidak memerlukan PostgreSQL. Kelas View (C01 sampai C12) adalah skrip peramban; test-nya memuat skrip tersebut dengan objek `document`, `window`, dan `Api` tiruan, tanpa dependensi tambahan.

Kolom *Hasil Pengujian* dan *Kesimpulan* pada tabel Modul E disusun oleh `tabel-uji-unit.js` dari keluaran Jest pada 15 November 2026, bukan ditulis tangan. Pada saat itu seluruh 470 test di 28 suite lulus.

### 4.2.1 Modul A: Akun dan Otentikasi

> *Diisi Dhanesworo.* Satu subbagian `#### Kelas CXX Nama` untuk setiap kelas bertingkat Mendalam atau Sedang di antara: C01 HalamanOtentikasi, C02 HalamanProfil, C12 HalamanDokumenLegal, C13 AkunController, C22 DokumenLegalController, C23 Akun, C24 Pembeli, C25 Penjual, C26 Admin, C27 TokenVerifikasi, C28 SesiLogin, C40 DokumenLegal, C41 Otorisasi, C42 Kriptografi, C43 SurelAdapter, SsoController. Ikuti pola Modul E pada Subbab 4.2.5, termasuk Tabel ringkasan cakupan untuk kelas Mendalam.

### 4.2.2 Modul B: Listing Penjual

> *Diisi Nazhif.* Satu subbagian `#### Kelas CXX Nama` untuk setiap kelas bertingkat Mendalam atau Sedang di antara: C03 HalamanListingPenjual, C04 FormulirBarang, C14 BarangController, C31 Kategori, C32 LokasiCOD, ListingService, ListingPenjual. Ikuti pola Modul E pada Subbab 4.2.5, termasuk Tabel ringkasan cakupan untuk kelas Mendalam.

### 4.2.3 Modul C: Katalog dan Pencarian

> *Diisi I Made Adi.* Satu subbagian `#### Kelas CXX Nama` untuk setiap kelas bertingkat Mendalam atau Sedang di antara: C05 HalamanKatalog, C06 KartuProduk, C07 HalamanDetailBarang, C15 KatalogController, C16 PencarianController, C17 FilterController. Ikuti pola Modul E pada Subbab 4.2.5, termasuk Tabel ringkasan cakupan untuk kelas Mendalam.

### 4.2.4 Modul D: Percakapan dan Notifikasi

> *Diisi Sulthan.* Satu subbagian `#### Kelas CXX Nama` untuk setiap kelas bertingkat Mendalam atau Sedang di antara: C08 HalamanPercakapan, C09 PanelNotifikasi, C18 PercakapanController, C19 NotifikasiController, C33 Percakapan, C34 Pesan, C35 Notifikasi, C44 PushNotifikasiAdapter, LanggananPush. Ikuti pola Modul E pada Subbab 4.2.5, termasuk Tabel ringkasan cakupan untuk kelas Mendalam.

### 4.2.5 Modul E: Laporan dan Moderasi

Sebelas kelas Modul E diuji dengan 135 test unit. Seluruhnya lulus pada keluaran terakhir. Satu test, C11-UT04, gagal pada kode tag `v9.0` dan menemukan cacat yang sudah diperbaiki. Operasi katalog C29 Barang (`getKatalog`, `getDetailKatalog`) diuji Modul C pada Subbab 4.2.3, sehingga *coverage* C29 pada tabel di bawah belum mencapai 70%.

Tabel 4.2.5. Ringkasan Coverage Kelas Modul E

| ID Kelas | Berkas | Tingkat | Test | Baris | Cabang | Memenuhi ≥ 70%? |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| C10 | `views/js/FormulirLaporan.js` | Sedang | 8 | tidak terukur | tidak terukur | Tidak wajib (Sedang). Skrip dimuat lewat `vm`, sehingga tidak diinstrumentasi Jest |
| C11 | `views/js/DasborAdmin.js` | Sedang | 6 | 11,6% | 8,9% | Tidak wajib (Sedang) |
| C20 | `controllers/LaporanController.js` | Mendalam | 23 | 100% | 84,5% | Ya |
| C21 | `controllers/ModerasiController.js` | Mendalam | 42 | 100% | 88,0% | Ya |
| C29 | `models/Barang.js` | Mendalam | 12 | 51,5% | 46,0% | Belum. Baris yang belum teruji (126 sampai 195) adalah operasi katalog milik Modul C |
| C30 | `models/FotoBarang.js` | Mendalam | 7 | 100% | 77,8% | Ya |
| C36 | `models/Laporan.js` | Mendalam | 13 | 100% | 88,9% | Ya |
| C37 | `models/BuktiLaporan.js` | Mendalam | 7 | 100% | 73,3% | Ya |
| C38 | `models/LogAudit.js` | Sedang | 5 | 100% | 33,3% | Tidak wajib (Sedang) |
| C39 | `models/LogAdmin.js` | Sedang | 6 | 100% | 100% | Tidak wajib (Sedang) |
| C45 | `penyimpanan/PenyimpananBerkas.js` | Mendalam | 6 (+8 test Vercel Blob) | 100% | 73,3% | Ya |

Angka diambil dari `npx jest --coverage` pada keluaran yang tersimpan di `assets/bukti/coverage-modul-e.txt`.

#### Kelas C10 FormulirLaporan

**ID Kelas:** C10  
**Nama Kelas:** FormulirLaporan  
**Tingkat:** Sedang

Tabel 4.2.5.C10. Hasil Pengujian Unit Kelas C10 (8 test)

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

#### Kelas C11 DasborAdmin

**ID Kelas:** C11  
**Nama Kelas:** DasborAdmin  
**Tingkat:** Sedang

Tabel 4.2.5.C11. Hasil Pengujian Unit Kelas C11 (6 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C11-UT01 | `validasiTransisiStatus` | Normal | Baru ke Diproses, Diproses ke Selesai, Baru ke Selesai | true | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT02 | `validasiTransisiStatus` | Negatif | Selesai ke Baru, Diproses ke Baru, status tidak dikenal | false | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT03 | `onClickUbahStatus` | Negatif | di halaman detail, laporan Selesai diubah ke Diproses | pesan galat, API tidak dipanggil | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT04 | `onClickUbahStatus` | Normal | dari daftar laporan I-13, detail belum dibuka | PATCH terkirim, statistik dan daftar dimuat ulang | Pada kode tag `v9.0`: TypeError `this.memuatStatistik is not a function`, statistik dan daftar tidak dimuat ulang. Setelah perbaikan pada commit `f8e7224`: sesuai dengan hasil yang diharapkan | Fail pada `v9.0`, Pass setelah perbaikan |
| C11-UT05 | `konfirmasiTindakan` | Negatif | alasan kosong atau hanya spasi | pesan galat, tidak ada tindakan moderasi terkirim | Sesuai dengan hasil yang diharapkan | Pass |
| C11-UT06 | `escapeHtml` | Normal | alasan laporan berisi tag &lt;script&gt; | karakter HTML diubah menjadi entitas | Sesuai dengan hasil yang diharapkan | Pass |

**Cacat yang ditemukan (C11-UT04).** Setelah status laporan diubah dari daftar laporan I-13, `onClickUbahStatus` memanggil `this.memuatStatistik()`, padahal nama metodenya `muatStatistik`. Akibatnya muncul TypeError setelah server berhasil menyimpan status baru, sehingga kartu statistik dan daftar laporan tidak diperbarui sampai halaman dimuat ulang. Pemanggilan yang sama ada di tiga cabang `konfirmasiTindakan`. Perbaikan pada commit `f8e7224` mengganti keempat pemanggilan dengan nama yang benar. Keluaran sebelum perbaikan tersimpan di `assets/bukti/C11-UT04-gagal-sebelum-perbaikan.txt`.

#### Kelas C20 LaporanController

**ID Kelas:** C20  
**Nama Kelas:** LaporanController  
**Tingkat:** Mendalam

Tabel 4.2.5.C20. Hasil Pengujian Unit Kelas C20 (23 test)

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

Tabel 4.2.5.C20b. Ringkasan Cakupan Kelas C20

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatLaporan`, `getIdPelaporDariSesi`, `validasiDataLaporan`, `susunMetadataPercakapan`, `validasiBukti`, `simpanBukti`, `simpanLaporan`, `catatLogAudit` |
| Operasi yang diuji | Kedelapan operasi |
| ID Algoritma yang tercakup | Algo-021 |
| Coverage (wajib ≥ 70%) | 100% baris, 84,5% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C21 ModerasiController

**ID Kelas:** C21  
**Nama Kelas:** ModerasiController  
**Tingkat:** Mendalam

Tabel 4.2.5.C21. Hasil Pengujian Unit Kelas C21 (42 test)

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

Tabel 4.2.5.C21b. Ringkasan Cakupan Kelas C21

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `otorisasiAdmin`, `getAllLaporan`, `filterByStatus`, `getDetailLaporan`, `ubahStatusLaporan`, `hapusListingDilaporkan`, `blokirAkun`, `nonaktifkanListingPengguna`, `bukaBlokirAkun`, `pulihkanListingPengguna`, `catatLogAdmin`, `catatLogAudit` |
| Operasi yang diuji | Kedua belas operasi, ditambah `getStatistik` (Implementasi B.1 No. 31) |
| ID Algoritma yang tercakup | Algo-022, Algo-023, Algo-024 |
| Coverage (wajib ≥ 70%) | 100% baris, 88,0% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C29 Barang

**ID Kelas:** C29  
**Nama Kelas:** Barang  
**Tingkat:** Mendalam

Tabel 4.2.5.C29. Hasil Pengujian Unit Kelas C29 (12 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C29-UT01 | `konstruktor dan dariBaris` | Normal | data dan baris basis data | objek Barang dengan harga numerik | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT02 | `simpan` | Normal | data listing | INSERT dan mengembalikan idBarang | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT03 | `cariById` | Normal | id barang yang ada | objek Barang | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT04 | `hapus` | Normal | id barang yang ada | DELETE, true | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT05 | `nonaktifkanByPemilik` | Normal | listing Tersedia milik akun | Dinonaktifkan (KF54) | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT06 | `pulihkanKatalog` | Normal | listing Dinonaktifkan milik akun | Tersedia (UC24) | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT07 | `getStatus` | Normal | objek Barang berstatus Terjual | "Terjual" | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT08 | `konstruktor` | Batas | data tanpa status dan tanpa harga | status Tersedia dan harga 0 | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT09 | `cariById` | Negatif | id barang tidak ada | null | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT10 | `hapus` | Negatif | id barang tidak ada (0 baris terhapus) | false | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT11 | `getListingPenjual` | Normal | listing Tersedia dan Terjual milik penjual | objek Barang beserta fotoUtama | Sesuai dengan hasil yang diharapkan | Pass |
| C29-UT12 | `nonaktifkanByPemilik` | Batas | penjual tanpa listing Tersedia (0 baris berubah) | tetap true | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.5.C29b. Ringkasan Cakupan Kelas C29

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan`, `cariById`, `getListingPenjual`, `getStatus`, `setStatus`, `getKatalog`, `hapus`, `nonaktifkanByPemilik`, `pulihkanKatalog` |
| Operasi yang diuji | `simpan`, `cariById`, `getListingPenjual`, `getStatus`, `hapus`, `nonaktifkanByPemilik`, `pulihkanKatalog`. `getKatalog` diuji Modul C. `setStatus` berada di `ListingPenjual` (Implementasi B.1 No. 18) dan diuji Modul B |
| ID Algoritma yang tercakup | Algo-032 (Modul C), Algo-033 (Modul B) |
| Coverage (wajib ≥ 70%) | 51,5% baris, 46,0% cabang; belum memenuhi sampai test katalog Modul C masuk. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C30 FotoBarang

**ID Kelas:** C30  
**Nama Kelas:** FotoBarang  
**Tingkat:** Mendalam

Tabel 4.2.5.C30. Hasil Pengujian Unit Kelas C30 (7 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C30-UT01 | `validasiFormat` | Normal | jpg, .JPEG, png, pdf, exe, kosong | hanya jpg, jpeg, dan png yang true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT02 | `validasiUkuran` | Batas | 1 KB, tepat 5 MB, 5 MB + 1 byte, 0, negatif | hanya 1 KB dan tepat 5 MB yang true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT03 | `simpan` | Normal | metadata foto | INSERT ke foto_barang, true | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT04 | `getGaleri` | Normal | id barang | daftar foto urut menurut kolom urutan | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT05 | `hapus` | Normal | id barang | DELETE seluruh metadata foto | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT06 | `validasiFormat` | Negatif | null atau "gif" | false (".PNG" tetap diterima) | Sesuai dengan hasil yang diharapkan | Pass |
| C30-UT07 | `validasiUkuran` | Negatif | ukuran berupa teks "100" atau undefined | false | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.5.C30b. Ringkasan Cakupan Kelas C30

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiFormat`, `validasiUkuran`, `simpan`, `getGaleri`, `perbaruiGaleri`, `getFotoUtama`, `hapus` |
| Operasi yang diuji | `validasiFormat`, `validasiUkuran`, `simpan`, `getGaleri`, `hapus`. `perbaruiGaleri` berada di `ListingPenjual.galeri` (Modul B) dan `getFotoUtama` menjadi subkueri `foto_utama` pada C29 (Implementasi B.1 No. 18) |
| ID Algoritma yang tercakup | Algo-034 (Modul B), Algo-035 (lewat C29-UT11) |
| Coverage (wajib ≥ 70%) | 100% baris, 77,8% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C36 Laporan

**ID Kelas:** C36  
**Nama Kelas:** Laporan  
**Tingkat:** Mendalam

Tabel 4.2.5.C36. Hasil Pengujian Unit Kelas C36 (13 test)

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

Tabel 4.2.5.C36b. Ringkasan Cakupan Kelas C36

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpanLaporanBaru`, `getAllLaporan`, `filterByStatus`, `getDetailLaporan`, `updateStatusPenanganan` |
| Operasi yang diuji | Kelima operasi, ditambah `validasiTransisiStatus` dan `getStatistikStatus` |
| ID Algoritma yang tercakup | Algo-051 sampai Algo-055 |
| Coverage (wajib ≥ 70%) | 100% baris, 88,9% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C37 BuktiLaporan

**ID Kelas:** C37  
**Nama Kelas:** BuktiLaporan  
**Tingkat:** Mendalam

Tabel 4.2.5.C37. Hasil Pengujian Unit Kelas C37 (7 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C37-UT01 | `validasiLampiranWajib` | Normal | satu berkas tidak kosong | true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT02 | `validasiLampiranWajib` | Batas | berkas berukuran 0 byte | false | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT03 | `dariBaris` | Normal | baris bukti_laporan | objek BuktiLaporan | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT04 | `validasiLampiranWajib` | Negatif | null, bukan array, atau array kosong | false | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT05 | `validasiLampiranWajib` | Batas | satu berkas berukuran 1 byte | true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT06 | `simpan` | Normal | metadata berkas bukti | INSERT ke bukti_laporan, true | Sesuai dengan hasil yang diharapkan | Pass |
| C37-UT07 | `cariByLaporan` | Normal | id laporan | daftar bukti milik laporan tersebut | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.5.C37b. Ringkasan Cakupan Kelas C37

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiLampiranWajib`, `simpan` |
| Operasi yang diuji | Kedua operasi, ditambah `cariByLaporan` |
| ID Algoritma yang tercakup | Algo-056, Algo-057 |
| Coverage (wajib ≥ 70%) | 100% baris, 73,3% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

#### Kelas C38 LogAudit

**ID Kelas:** C38  
**Nama Kelas:** LogAudit  
**Tingkat:** Sedang

Tabel 4.2.5.C38. Hasil Pengujian Unit Kelas C38 (5 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C38-UT01 | `dariBaris` | Normal | baris log_audit | objek LogAudit | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT02 | `struktur kelas` | Negatif | cari operasi update, edit, hapus, delete | tidak ada satu pun (KF48, KF49) | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT03 | `empat operasi catat` | Normal | id laporan, aktor, dan objek | tiap operasi menjalankan satu INSERT ke log_audit dengan teks tindakan yang benar | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT04 | `getRiwayatByLaporan` | Normal | id laporan | riwayat urut dari yang paling lama | Sesuai dengan hasil yang diharapkan | Pass |
| C38-UT05 | `catatPenerimaanLaporan` | Normal | dipanggil tanpa klien transaksi | memakai koneksi bawaan db | Sesuai dengan hasil yang diharapkan | Pass |

#### Kelas C39 LogAdmin

**ID Kelas:** C39  
**Nama Kelas:** LogAdmin  
**Tingkat:** Sedang

Tabel 4.2.5.C39. Hasil Pengujian Unit Kelas C39 (6 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C39-UT01 | `catatTindakan` | Normal | tindakan BLOKIR_AKUN beserta alasan | INSERT ke log_admin dengan seluruh nilai | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT02 | `catatTindakan` | Normal | dipanggil dengan klien transaksi | klien itu yang dipakai, bukan koneksi bawaan | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT03 | `catatTindakan` | Negatif | basis data menolak INSERT | galat diteruskan ke pemanggil agar transaksi dibatalkan | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT04 | `getAllLog` | Normal | dua baris | dua objek LogAdmin, terbaru lebih dulu | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT05 | `dariBaris` | Batas | baris kosong (undefined) | null | Sesuai dengan hasil yang diharapkan | Pass |
| C39-UT06 | `struktur kelas` | Negatif | cari operasi update, ubah, hapus, delete | tidak ada satu pun (KF55) | Sesuai dengan hasil yang diharapkan | Pass |

#### Kelas C45 PenyimpananBerkas

**ID Kelas:** C45  
**Nama Kelas:** PenyimpananBerkas  
**Tingkat:** Mendalam

Tabel 4.2.5.C45. Hasil Pengujian Unit Kelas C45 (6 test)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C45-UT01 | `simpan lalu hapus` | Normal | satu berkas buffer | tersimpan di /uploads/&lt;idObjek&gt;/ lalu terhapus, hasil true | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT02 | `simpan` | Normal | berkas sementara multer di disk | disalin ke folder objek dan berkas sementara dihapus | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT03 | `simpan` | Negatif | berkas kedua tanpa buffer maupun path | null, berkas pertama yang sempat tertulis dihapus | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT04 | `simpan` | Batas | daftar berkas kosong atau bukan array | [] tanpa membuat folder | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT05 | `hapus` | Normal | path /uploads/ yang ada dan yang sudah tidak ada | berkas yang ada terhapus, hasil true | Sesuai dengan hasil yang diharapkan | Pass |
| C45-UT06 | `hapus` | Batas | daftar kosong atau null | true tanpa menyentuh disk | Sesuai dengan hasil yang diharapkan | Pass |

Tabel 4.2.5.C45b. Ringkasan Cakupan Kelas C45

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `simpan`, `hapus` |
| Operasi yang diuji | Kedua operasi, pada mode disk lokal (C45-UT01 sampai C45-UT06) dan mode Vercel Blob (8 test di `PenyimpananBerkasBlob.test.js`) |
| ID Algoritma yang tercakup | Algo-072, Algo-073 |
| Coverage (wajib ≥ 70%) | 100% baris, 73,3% cabang. Alat: Jest `--coverage`. Bukti: `assets/bukti/coverage-modul-e.txt` |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memakai komponen nyata: PostgreSQL 16 dan Mailpit dari `src/docker-compose.yml`, folder `src/uploads/` di disk, serta Vercel Blob untuk mode deploy. Test API yang sudah ada di `src/tests/integration/` tidak dihitung di sini karena mengganti kueri basis data dengan tiruan. Suite yang berjalan ke basis data nyata disiapkan Sulthan sesuai rencana pembagian tugas.

> *Status Modul E:* test case di bawah sudah dirancang, tetapi **belum dijalankan** karena suite PostgreSQL nyata belum tersedia dan mesin penulis tidak memiliki PostgreSQL atau Docker. Kolom hasil akan diisi setelah test dijalankan.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| AK-01 sampai AK-09 | *Diisi Dhanesworo (Modul A)* | | | |
| AK-10 sampai AK-19 | *Diisi Nazhif (Modul B)* | | | |
| AK-20 sampai AK-29 | *Diisi I Made Adi (Modul C)* | | | |
| AK-30 sampai AK-39 | *Diisi Sulthan (Modul D)* | | | |
| AK-40 | C20 LaporanController | C36 Laporan, C37 BuktiLaporan, C38 LogAudit | Controller - Model | INT-TC80, INT-TC81 |
| AK-41 | C36, C37, C38, C39 | PostgreSQL (tabel `laporan`, `bukti_laporan`, `log_audit`, `log_admin`) | Aplikasi - Basis data | INT-TC80 sampai INT-TC84 |
| AK-42 | C21 ModerasiController | C23 Akun, C28 SesiLogin, C29 Barang, C30 FotoBarang, C36, C38, C39 | Controller - Model | INT-TC82 sampai INT-TC85 |
| AK-43 | C20, C21 melalui C45 PenyimpananBerkas | Folder `src/uploads/` di disk | Aplikasi - Sistem berkas | INT-TC85, INT-TC86 |
| AK-44 | C45 PenyimpananBerkas | Vercel Blob | Aplikasi - Sistem eksternal | INT-TC87 |
| AK-45 | C21 melalui C19 NotifikasiController dan C43 SurelAdapter | Server SMTP (Mailpit) | Aplikasi - Sistem eksternal | INT-TC88 |
| AK-46 | C10 FormulirLaporan, C11 DasborAdmin | Route `/api/laporan` dan `/api/admin/*` | View - Controller (HTTP) | INT-TC89 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 sampai INT-TC79 | | *Diisi pemilik modul A sampai D sesuai blok nomor* | | | | |
| INT-TC80 | AK-40, AK-41 | Normal: laporan baru tersimpan | Panggil `LaporanController.buatLaporan` dengan token sesi akun uji yang sah, data lengkap, dan satu PNG, lalu baca tabel langsung dengan SQL | Satu baris `laporan` berstatus Baru, satu baris `bukti_laporan` yang menunjuk berkas yang ada di disk, dan satu baris `log_audit` bertindakan "Penerimaan laporan" | *Belum dijalankan* | - |
| INT-TC81 | AK-40, AK-41 | Gagal: penyimpanan bukti gagal di tengah transaksi | Sama dengan INT-TC80, tetapi folder unggahan dibuat tidak dapat ditulis | `buatLaporan` mengembalikan GALAT_SERVER dan tidak ada baris baru di ketiga tabel (transaksi dibatalkan) | *Belum dijalankan* | - |
| INT-TC82 | AK-41, AK-42 | Normal: ubah status laporan | Ubah laporan Baru menjadi Diproses lewat `ModerasiController.ubahStatusLaporan` dengan token admin | Kolom `status_penanganan` dan `waktu_perubahan` berubah, dan `log_audit` bertambah tepat satu baris "Perubahan status laporan menjadi Diproses" | *Belum dijalankan* | - |
| INT-TC83 | AK-41, AK-42 | Normal: blokir akun | Blokir akun penjual uji yang punya dua listing Tersedia dan satu sesi aktif, dengan ID laporan | `akun.status_blokir` true, kedua listing Dinonaktifkan, sesi `status_aktif` false, laporan Selesai, serta masing-masing satu baris di `log_admin` dan `log_audit` | *Belum dijalankan* | - |
| INT-TC84 | AK-41, AK-42 | Gagal: galat di tengah blokir akun | Blokir akun dengan ID laporan yang tidak ada, sehingga INSERT ke `log_audit` melanggar *foreign key* | Galat dilempar dan tidak satu pun tabel berubah: akun, listing, dan sesi tetap seperti semula | *Belum dijalankan* | - |
| INT-TC85 | AK-42, AK-43 | Normal: hapus listing yang dilaporkan | Hapus listing berfoto dua lewat `hapusListingDilaporkan` dengan alasan | Baris `barang` dan `foto_barang` hilang, kedua berkas foto hilang dari `src/uploads/`, `log_admin` mencatat HAPUS_LISTING | *Belum dijalankan* | - |
| INT-TC86 | AK-43 | Normal: unggah bukti ke disk | Kirim `POST /api/laporan` multipart dengan satu PNG ke server yang berjalan | Berkas ada di `src/uploads/<idLaporan>/` dengan nama UUID dan dapat diunduh lewat `/uploads/...` | *Belum dijalankan* | - |
| INT-TC87 | AK-44 | Normal: unggah dan hapus di Vercel Blob | Jalankan `PenyimpananBerkas.simpan` lalu `hapus` dengan `BLOB_READ_WRITE_TOKEN` milik *store* uji | URL publik dapat diunduh setelah `simpan` dan menjawab 404 setelah `hapus` | *Belum dijalankan* | - |
| INT-TC88 | AK-45 | Normal: surel penangguhan | Blokir akun dengan alasan "Penipuan berulang", lalu buka kotak masuk Mailpit (`GET http://localhost:8025/api/v1/messages`) | Satu surel ke alamat akun tersebut berjudul "Pemberitahuan Penangguhan Akun ITBELI" dan memuat alasannya | *Belum dijalankan* | - |
| INT-TC89 | AK-46 | Normal dan gagal: akses route admin | Panggil `GET /api/admin/laporan` dengan token admin, lalu dengan token pengguna biasa | 200 berisi daftar laporan untuk admin; 403 untuk pengguna biasa (KF56) | *Belum dijalankan* | - |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dijalankan manual pada aplikasi lokal dari tag `v9.0` dengan data dari `npm run db:seed`. Akun uji: `admin.uji@itb.ac.id`, `penjual.uji@itb.ac.id`, `pembeli.uji@itb.ac.id`, `diblokir.uji@itb.ac.id`, dan `belum.uji@itb.ac.id`, semuanya berkata sandi `ujicoba123`. Setiap skenario normal dan alternatif pada SKPL Subbab 4.4 punya minimal satu test case.

### 4.4.1 Use Case Mendaftar Akun

**ID Use Case:** UC01  
**Nama Use Case:** Mendaftar Akun

> *Diisi Dhanesworo (Modul A)*: 3 skenario pada SKPL Subbab 4.4.1.

### 4.4.2 Use Case Memverifikasi Surel

**ID Use Case:** UC02  
**Nama Use Case:** Memverifikasi Surel

> *Diisi Dhanesworo (Modul A)*: 3 skenario pada SKPL Subbab 4.4.2.

### 4.4.3 Use Case Masuk ke Sistem (Login)

**ID Use Case:** UC03  
**Nama Use Case:** Masuk ke Sistem (Login)

> *Diisi Dhanesworo (Modul A)*: 4 skenario pada SKPL Subbab 4.4.3.

### 4.4.4 Use Case Keluar dari Sistem (Logout)

**ID Use Case:** UC04  
**Nama Use Case:** Keluar dari Sistem (Logout)

> *Diisi Dhanesworo (Modul A)*: 1 skenario pada SKPL Subbab 4.4.4.

### 4.4.5 Use Case Melihat Profil Akun

**ID Use Case:** UC05  
**Nama Use Case:** Melihat Profil Akun

> *Diisi Dhanesworo (Modul A)*: 1 skenario pada SKPL Subbab 4.4.5.

### 4.4.6 Use Case Melihat Kebijakan Privasi dan Ketentuan Penggunaan

**ID Use Case:** UC06  
**Nama Use Case:** Melihat Kebijakan Privasi dan Ketentuan Penggunaan

> *Diisi Dhanesworo (Modul A)*: 1 skenario pada SKPL Subbab 4.4.6.

### 4.4.7 Use Case Membuat Listing

**ID Use Case:** UC07  
**Nama Use Case:** Membuat Listing

> *Diisi Nazhif (Modul B)*: 3 skenario pada SKPL Subbab 4.4.7.

### 4.4.8 Use Case Melihat Daftar Listing Milik Sendiri

**ID Use Case:** UC08  
**Nama Use Case:** Melihat Daftar Listing Milik Sendiri

> *Diisi Nazhif (Modul B)*: 1 skenario pada SKPL Subbab 4.4.8.

### 4.4.9 Use Case Mengubah Listing

**ID Use Case:** UC09  
**Nama Use Case:** Mengubah Listing

> *Diisi Nazhif (Modul B)*: 4 skenario pada SKPL Subbab 4.4.9.

### 4.4.10 Use Case Menghapus Listing

**ID Use Case:** UC10  
**Nama Use Case:** Menghapus Listing

> *Diisi Nazhif (Modul B)*: 3 skenario pada SKPL Subbab 4.4.10.

### 4.4.11 Use Case Menandai Listing Terjual

**ID Use Case:** UC11  
**Nama Use Case:** Menandai Listing Terjual

> *Diisi Nazhif (Modul B)*: 3 skenario pada SKPL Subbab 4.4.11.

### 4.4.12 Use Case Membatalkan Penandaan Terjual

**ID Use Case:** UC12  
**Nama Use Case:** Membatalkan Penandaan Terjual

> *Diisi Nazhif (Modul B)*: 3 skenario pada SKPL Subbab 4.4.12.

### 4.4.13 Use Case Melihat Katalog Listing

**ID Use Case:** UC13  
**Nama Use Case:** Melihat Katalog Listing

> *Diisi I Made Adi (Modul C)*: 3 skenario pada SKPL Subbab 4.4.13.

### 4.4.14 Use Case Mencari dan Menyaring Listing

**ID Use Case:** UC14  
**Nama Use Case:** Mencari dan Menyaring Listing

> *Diisi I Made Adi (Modul C)*: 3 skenario pada SKPL Subbab 4.4.14.

### 4.4.15 Use Case Melihat Detail Listing

**ID Use Case:** UC15  
**Nama Use Case:** Melihat Detail Listing

> *Diisi I Made Adi (Modul C)*: 4 skenario pada SKPL Subbab 4.4.15.

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

Tabel 4.4.19. Hasil Pengujian Use Case UC19

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC19-TC01 | KF43, KF44, KF48 | Normal | 1. Masuk sebagai `pembeli.uji`.<br>2. Buka detail listing milik `penjual.uji`, tekan "Laporkan".<br>3. Pilih "Penipuan", isi alasan, lampirkan satu PNG, tekan "Kirim Laporan".<br>4. Masuk sebagai `admin.uji`, buka laporan tersebut di I-14. | Alasan: "Penjual meminta transfer di muka"<br>Bukti: `bukti.png` (200 KB) | Notifikasi "Laporan berhasil dikirim". Laporan muncul berstatus Baru dengan bukti yang dapat dibuka, dan riwayat penanganan berisi "Penerimaan laporan" | *Belum dijalankan* | - |
| UC19-TC02 | KF37, KF43 | Normal (laporan dari percakapan) | 1. Masuk sebagai `pembeli.uji`, buka percakapan dengan `penjual.uji`, tekan "Laporkan".<br>2. Isi kategori, alasan, dan bukti, lalu kirim.<br>3. Buka laporan tersebut sebagai `admin.uji`. | Kategori: "Konten tidak pantas"<br>Bukti: satu PNG | Objek laporan berupa ID percakapan. Detail laporan tidak memuat isi pesan apa pun | *Belum dijalankan* | - |
| UC19-TC03 | KF43 | Alternatif 1: alasan dikosongkan | Isi formulir laporan tanpa alasan, lampirkan bukti, tekan "Kirim Laporan" | Alasan: kosong<br>Bukti: satu PNG | Pengiriman dihentikan, kolom alasan diberi penanda merah, dan muncul galat bahwa alasan dan bukti wajib diisi | *Belum dijalankan* | - |
| UC19-TC04 | KF44 | Alternatif 1: bukti tidak dilampirkan | Isi kategori dan alasan tanpa melampirkan bukti, tekan "Kirim Laporan" | Bukti: tidak ada | Pengiriman dihentikan dan muncul galat bahwa bukti tangkapan layar wajib dilampirkan | *Belum dijalankan* | - |

Catatan untuk penguji: dari pembacaan kode, layar Percakapan (I-10) belum punya tombol "Laporkan". Formulir laporan menerima `?objek=<idPercakapan>&jenis=Percakapan`, tetapi belum ada tautan ke sana. Bila terbukti saat pengujian, UC19-TC02 dicatat `Fail` dengan usulan menambah tombol Laporkan di kepala ruang percakapan; KF37 tetap dapat diperiksa dengan membuka alamat formulir tersebut secara langsung.

### 4.4.20 Use Case Melihat dan Menyaring Daftar Laporan

**ID Use Case:** UC20  
**Nama Use Case:** Melihat dan Menyaring Daftar Laporan

Tabel 4.4.20. Hasil Pengujian Use Case UC20

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC20-TC01 | KF45 | Normal | 1. Masuk sebagai `admin.uji`.<br>2. Buka `/admin-laporan`. | Minimal tiga laporan dengan status berbeda | Tabel menampilkan semua laporan beserta pelapor, objek, kategori, waktu, dan status, serta kartu jumlah per status | *Belum dijalankan* | - |
| UC20-TC02 | KF46 | Normal (penyaringan) | Pada `/admin-laporan`, pilih status "Baru" pada penyaring | Status: Baru | Hanya laporan berstatus Baru yang tampil | *Belum dijalankan* | - |
| UC20-TC03 | KF56 | Alternatif 1: akses oleh akun bukan admin | 1. Masuk sebagai `pembeli.uji`.<br>2. Buka `/admin-laporan` langsung dari bilah alamat. | URL: `/admin-laporan` | Akses ditolak dengan peringatan "Akses Ditolak" dan pengguna dialihkan ke beranda | *Belum dijalankan* | - |

Catatan untuk penguji: dari pembacaan kode, `DasborAdmin.tampilkanAksesDitolak` mengalihkan ke `/masuk`, bukan ke beranda seperti SKPL. Bila hal ini terlihat saat pengujian, UC20-TC03 dicatat `Fail` dengan usulan mengganti tujuan pengalihan.

### 4.4.21 Use Case Mengubah Status Penanganan Laporan

**ID Use Case:** UC21  
**Nama Use Case:** Mengubah Status Penanganan Laporan

Tabel 4.4.21. Hasil Pengujian Use Case UC21

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC21-TC01 | KF47, KF48, KF49 | Normal | 1. Masuk sebagai `admin.uji`, buka detail laporan berstatus Baru.<br>2. Ubah status menjadi "Diproses", simpan. | Status: Baru ke Diproses | Status dan waktu perubahan diperbarui, riwayat penanganan bertambah "Perubahan status laporan menjadi Diproses", dan pilihan status mundur tidak dapat dipilih | *Belum dijalankan* | - |
| UC21-TC02 | KF47, KF48 | Normal (lewat daftar I-13) | Pada `/admin-laporan`, ubah status sebuah laporan lewat menu status di barisnya | Status: Diproses ke Selesai | Status tersimpan, baris dan kartu jumlah per status langsung diperbarui tanpa memuat ulang halaman | *Belum dijalankan* | - |

### 4.4.22 Use Case Menghapus Listing yang Dilaporkan

**ID Use Case:** UC22  
**Nama Use Case:** Menghapus Listing yang Dilaporkan

Tabel 4.4.22. Hasil Pengujian Use Case UC22

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC22-TC01 | KF48, KF50, KF52, KF55, KF56 | Normal | 1. Masuk sebagai `admin.uji`, buka detail laporan atas listing `penjual.uji`.<br>2. Tekan "Hapus Listing", isi alasan, konfirmasi.<br>3. Buka katalog dan kotak masuk Mailpit. | Alasan: "Barang palsu" | Listing hilang dari katalog dan detailnya tidak dapat dibuka, surel peringatan berisi alasan masuk ke `penjual.uji`, laporan menjadi Selesai, dan tindakan tercatat di log admin serta log audit | *Belum dijalankan* | - |

### 4.4.23 Use Case Memblokir Akun Pengguna

**ID Use Case:** UC23  
**Nama Use Case:** Memblokir Akun Pengguna

Tabel 4.4.23. Hasil Pengujian Use Case UC23

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC23-TC01 | KF48, KF51, KF52, KF53, KF54, KF55, KF56 | Normal | 1. Masuk sebagai `penjual.uji` di peramban kedua.<br>2. Di peramban pertama, masuk sebagai `admin.uji`, buka detail laporan atas `penjual.uji`, tekan "Blokir Akun", isi alasan, konfirmasi.<br>3. Muat ulang peramban kedua, lalu coba masuk lagi sebagai `penjual.uji`.<br>4. Buka katalog dan kotak masuk Mailpit. | Alasan: "Penipuan berulang" | Status akun menjadi Diblokir, sesi di peramban kedua berakhir, login ulang ditolak dengan pesan penangguhan, seluruh listing `penjual.uji` hilang dari katalog dan pencarian, surel penangguhan berisi alasan terkirim, dan tindakan tercatat di log admin serta log audit | *Belum dijalankan* | - |

### 4.4.24 Use Case Membuka Blokir Akun Pengguna

**ID Use Case:** UC24  
**Nama Use Case:** Membuka Blokir Akun Pengguna

Tabel 4.4.24. Hasil Pengujian Use Case UC24

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC24-TC01 | KF51, KF54, KF55, KF56 | Normal | 1. Lanjutan UC23-TC01: sebagai `admin.uji`, tekan "Buka Blokir" untuk `penjual.uji`, isi alasan, konfirmasi.<br>2. Masuk sebagai `penjual.uji`, lalu buka katalog. | Alasan: "Banding diterima" | Login `penjual.uji` berhasil, listing yang tadi dinonaktifkan kembali tampil di katalog, dan log admin mencatat BUKA_BLOKIR beserta alasannya | *Belum dijalankan* | - |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF01-TC01 | KNF01 | Usability/Ergonomy | *Diisi I Made Adi (Modul C)* | | | |
| KNF02-TC01 | KNF02 | Maintainability | Setiap tindakan moderasi (hapus listing, blokir, buka blokir) menghasilkan satu baris `log_admin` yang lengkap: pelaku, jenis, objek, waktu, dan alasan | Setelah UC22-TC01, UC23-TC01, dan UC24-TC01, jalankan `SELECT id_admin, jenis_tindakan, objek_ditindak, waktu, alasan FROM log_admin ORDER BY waktu` | *Belum dijalankan* | - |
| KNF02-TC02 | KNF02 | Maintainability | Penerimaan laporan dan setiap tindak lanjutnya tercatat di `log_audit` dan dapat dibaca admin pada riwayat penanganan I-14 | Setelah UC19-TC01 dan UC21-TC01, bandingkan isi `log_audit` untuk laporan tersebut dengan riwayat yang tampil di I-14 | *Belum dijalankan* | - |
| KNF02-TC03 | KNF02 | Maintainability | Catatan log audit dan log admin tidak dapat diubah atau dihapus melalui aplikasi (KF49) | Periksa operasi kelas C38 dan C39 (C38-UT02, C39-UT06) serta seluruh 41 endpoint pada `src/routes/*.js` | Tidak ada operasi maupun endpoint untuk mengubah atau menghapus `log_audit` dan `log_admin`; C38-UT02 dan C39-UT06 lulus. Perlindungan ini hanya di tingkat aplikasi: pengguna basis data `itbeli` masih dapat menjalankan UPDATE atau DELETE langsung | Pass |
| KNF02-TC04 | KNF02 | Maintainability | Hanya admin yang dapat membaca laporan dan riwayatnya | Panggil `GET /api/admin/laporan/:id` dengan token admin dan token pengguna biasa | *Belum dijalankan* (rancangan sama dengan INT-TC89) | - |
| KNF03-TC01 | KNF03 | Security | *Diisi Dhanesworo (Modul A)* | | | |
| KNF04-TC01 | KNF04 | Scalability | *Diisi I Made Adi (Modul C)* | | | |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| Modul A sampai D | *Diisi pemilik modul* |
| C10-UT01 sampai C45-UT06 (135 test Modul E) | Keluaran `npx jest --verbose`: [`assets/bukti/unit-modul-e.txt`](./assets/bukti/unit-modul-e.txt) |
| C20, C21, C29, C30, C36, C37, C45 (coverage) | Laporan `npx jest --coverage`: [`assets/bukti/coverage-modul-e.txt`](./assets/bukti/coverage-modul-e.txt) |
| C11-UT04 (sebelum perbaikan) | Keluaran Jest pada kode `v9.0`: [`assets/bukti/C11-UT04-gagal-sebelum-perbaikan.txt`](./assets/bukti/C11-UT04-gagal-sebelum-perbaikan.txt) |
| INT-TC80 sampai INT-TC89 | *Belum ada; menunggu suite PostgreSQL nyata* |
| UC19-TC01 sampai UC24-TC01 | *Belum ada; menunggu pengujian manual di aplikasi lokal* |
| KNF02-TC03 | Keluaran C38-UT02 dan C39-UT06 pada `assets/bukti/unit-modul-e.txt` |
| KNF02-TC01, KNF02-TC02, KNF02-TC04 | *Belum ada* |

<br>

---

# BAB 5: Traceability

Setiap KF dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. Selama test case use case dan integrasi Modul E belum dijalankan, KF Modul E belum dapat dinyatakan terpenuhi.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KF01 | | UC01 | *Diisi Dhanesworo (Modul A)* | | | |
| KF02 | | UC01 | *Diisi Dhanesworo (Modul A)* | | | |
| KF03 | | UC03 | *Diisi Dhanesworo (Modul A)* | | | |
| KF04 | | UC05 | *Diisi Dhanesworo (Modul A)* | | | |
| KF05 | | UC01 | *Diisi Dhanesworo (Modul A)* | | | |
| KF06 | | UC01<br>UC02 | *Diisi Dhanesworo (Modul A)* | | | |
| KF07 | | UC02 | *Diisi Dhanesworo (Modul A)* | | | |
| KF08 | | UC02<br>UC03 | *Diisi Dhanesworo (Modul A)* | | | |
| KF09 | | UC01 | *Diisi Dhanesworo (Modul A)* | | | |
| KF10 | | UC03 | *Diisi Dhanesworo (Modul A)* | | | |
| KF11 | | UC03 | *Diisi Dhanesworo (Modul A)* | | | |
| KF12 | | UC04 | *Diisi Dhanesworo (Modul A)* | | | |
| KF13 | | UC01<br>UC06 | *Diisi Dhanesworo (Modul A)* | | | |
| KF14 | | UC01 | *Diisi Dhanesworo (Modul A)* | | | |
| KF15 | | UC07 | *Diisi Nazhif (Modul B)* | | | |
| KF16 | | UC07 | *Diisi Nazhif (Modul B)* | | | |
| KF17 | | UC15 | *Diisi I Made Adi (Modul C)* | | | |
| KF18 | | UC07<br>UC09 | *Diisi Nazhif (Modul B)* | | | |
| KF19 | | UC07<br>UC09 | *Diisi Nazhif (Modul B)* | | | |
| KF20 | | UC08 | *Diisi Nazhif (Modul B)* | | | |
| KF21 | | UC09<br>UC10 | *Diisi Nazhif (Modul B)* | | | |
| KF22 | | UC09<br>UC10 | *Diisi Nazhif (Modul B)* | | | |
| KF23 | | UC07<br>UC09 | *Diisi Nazhif (Modul B)* | | | |
| KF24 | | UC07<br>UC09 | *Diisi Nazhif (Modul B)* | | | |
| KF25 | | UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF26 | | UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF27 | | UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF28 | | UC13<br>UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF29 | | UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF30 | | UC13<br>UC14 | *Diisi I Made Adi (Modul C)* | | | |
| KF31 | | UC16 | *Diisi Sulthan (Modul D)* | | | |
| KF32 | | UC17 | *Diisi Sulthan (Modul D)* | | | |
| KF33 | | UC18 | *Diisi Sulthan (Modul D)* | | | |
| KF34 | | UC17<br>UC18 | *Diisi Sulthan (Modul D)* | | | |
| KF35 | | UC16<br>UC17<br>UC18 | *Diisi Sulthan (Modul D)* | | | |
| KF36 | | UC17 | *Diisi Sulthan (Modul D)* | | | |
| KF37 | - | UC19 | C20 - LaporanController<br>C10 - FormulirLaporan | `src/controllers/LaporanController.js`<br>`src/views/js/FormulirLaporan.js` | UC19-TC02 | C20-UT09, C20-UT23 |
| KF38 | | UC06 | *Diisi Dhanesworo (Modul A)* | | | |
| KF39 | | UC01<br>UC05<br>UC06<br>UC16<br>UC17 | *Diisi Dhanesworo (Modul A)* | | | |
| KF40 | | UC11 | *Diisi Nazhif (Modul B)* | | | |
| KF41 | | UC12 | *Diisi Nazhif (Modul B)* | | | |
| KF42 | | UC08<br>UC11<br>UC12<br>UC13 | *Diisi Nazhif (Modul B)* | | | |
| KF43 | - | UC19 | C10 - FormulirLaporan<br>C20 - LaporanController | `src/views/js/FormulirLaporan.js`<br>`src/controllers/LaporanController.js` | UC19-TC01, UC19-TC02, UC19-TC03 | C10-UT01, C10-UT02, C20-UT01 sampai C20-UT04, C20-UT11, C20-UT14 |
| KF44 | - | UC19 | C10 - FormulirLaporan<br>C20 - LaporanController<br>C37 - BuktiLaporan<br>C45 - PenyimpananBerkas | `src/controllers/LaporanController.js`<br>`src/models/BuktiLaporan.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC19-TC01, UC19-TC04 | C10-UT03 sampai C10-UT06, C20-UT05 sampai C20-UT08, C20-UT12, C20-UT13, C20-UT17, C20-UT18, C37-UT01 sampai C37-UT07, C45-UT01 sampai C45-UT06, INT-TC80, INT-TC86, INT-TC87 |
| KF45 | KNF02 | UC20 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/views/js/DasborAdmin.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC20-TC01 | C21-UT03, C21-UT08, C21-UT11, C36-UT06, C36-UT08, C36-UT12, C36-UT13 |
| KF46 | - | UC20 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC20-TC02 | C21-UT05, C21-UT06, C36-UT02, C36-UT07 |
| KF47 | - | UC21 | C11 - DasborAdmin<br>C21 - ModerasiController<br>C36 - Laporan | `src/views/js/DasborAdmin.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/Laporan.js` | UC21-TC01, UC21-TC02 | C11-UT01 sampai C11-UT04, C21-UT12 sampai C21-UT16, C21-UT19, C36-UT03, C36-UT04, C36-UT10, C36-UT11, INT-TC82 |
| KF48 | KNF02 | UC19<br>UC21<br>UC22<br>UC23 | C20 - LaporanController<br>C21 - ModerasiController<br>C38 - LogAudit | `src/controllers/LaporanController.js`<br>`src/controllers/ModerasiController.js`<br>`src/models/LogAudit.js` | UC19-TC01, UC21-TC01, UC22-TC01, UC23-TC01 | C20-UT20, C20-UT21, C21-UT12, C21-UT18, C21-UT20, C21-UT21, C38-UT01, C38-UT03 sampai C38-UT05, INT-TC80, INT-TC82, INT-TC83, KNF02-TC02 |
| KF49 | KNF02 | UC21<br>UC22<br>UC23 | C38 - LogAudit | `src/models/LogAudit.js` | UC21-TC01 | C38-UT02, C21-UT19, KNF02-TC03 |
| KF50 | - | UC22 | C21 - ModerasiController<br>C29 - Barang<br>C30 - FotoBarang<br>C45 - PenyimpananBerkas | `src/controllers/ModerasiController.js`<br>`src/models/Barang.js`<br>`src/models/FotoBarang.js`<br>`src/penyimpanan/PenyimpananBerkas.js` | UC22-TC01 | C21-UT22 sampai C21-UT27, C29-UT04, C29-UT10, C30-UT05, C45-UT05, INT-TC85 |
| KF51 | - | UC23<br>UC24 | C21 - ModerasiController<br>C23 - Akun | `src/controllers/ModerasiController.js`<br>`src/models/Akun.js` | UC23-TC01, UC24-TC01 | C21-UT28 sampai C21-UT38, INT-TC83, INT-TC84 |
| KF52 | - | UC22<br>UC23 | C21 - ModerasiController<br>C19 - NotifikasiController<br>C43 - SurelAdapter | `src/controllers/ModerasiController.js`<br>`src/controllers/NotifikasiController.js`<br>`src/integrasi/SurelAdapter.js` | UC22-TC01, UC23-TC01 | C21-UT22, C21-UT28, INT-TC88 |
| KF53 | KNF03 | UC03<br>UC23 | C21 - ModerasiController<br>C28 - SesiLogin<br>C13 - AkunController | `src/controllers/ModerasiController.js`<br>`src/models/SesiLogin.js`<br>`src/controllers/AkunController.js` | UC23-TC01 (dan UC03 milik Modul A) | C21-UT28, INT-TC83 |
| KF54 | - | UC13<br>UC23<br>UC24 | C21 - ModerasiController<br>C29 - Barang | `src/controllers/ModerasiController.js`<br>`src/models/Barang.js` | UC23-TC01, UC24-TC01 (dan UC13 milik Modul C) | C21-UT28, C21-UT34, C21-UT39, C21-UT42, C29-UT05, C29-UT06, C29-UT12, INT-TC83 |
| KF55 | KNF02 | UC22<br>UC23<br>UC24 | C21 - ModerasiController<br>C39 - LogAdmin | `src/controllers/ModerasiController.js`<br>`src/models/LogAdmin.js` | UC22-TC01, UC23-TC01, UC24-TC01 | C21-UT24, C21-UT30, C21-UT37, C21-UT41, C39-UT01 sampai C39-UT06, KNF02-TC01 |
| KF56 | KNF02 | UC20<br>UC21<br>UC22<br>UC23<br>UC24 | C21 - ModerasiController<br>C41 - Otorisasi<br>C11 - DasborAdmin | `src/controllers/ModerasiController.js`<br>`src/routes/moderasiRoutes.js`<br>`src/pendukung/Otorisasi.js` | UC20-TC03 | C21-UT02, C21-UT04, C21-UT07, C21-UT10, C21-UT17, C21-UT23, C21-UT29, C21-UT35, C21-UT40, INT-TC89, KNF02-TC04 |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| KNF01 | Usability/Ergonomy | *Diisi I Made Adi (Modul C)* | |
| KNF02 | Maintainability | KF45, KF48, KF49, KF55, KF56 / UC19 sampai UC24 | KNF02-TC01 sampai KNF02-TC04 |
| KNF03 | Security | *Diisi Dhanesworo (Modul A)* | |
| KNF04 | Scalability | *Diisi I Made Adi (Modul C)* | |

