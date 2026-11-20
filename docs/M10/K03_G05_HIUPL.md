<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## *Nama Perangkat Lunak*
### *LawHub*

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | G05 |

| NIM | Nama |
|---|---|
| 13525057 | Raya Medina Farrelin |
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525108 | Khasya Nurul Amini |
| 13525150 | Livy Chandra |
| 13525138 | Cathrine Angel Siburian |

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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan uraian ringkas mengenai isi dokumen, tujuan pembuatan dokumen HIUPL ini, dan siapa saja target pembacanya.

## 1.2 Lingkup Masalah
LawHub merupakan platform layanan konsultasi hukum digital yang dikembangkan untuk memperluas akses bantuan hukum bagi masyarakat Indonesia, di tengah tingginya angka sengketa dan konflik hukum yang belum terselesaikan serta terbatasnya kanal konsultasi hukum yang interaktif dan efisien. Berbeda dari laman bantuan hukum yang sudah ada dan umumnya berfokus pada forum tanya jawab terbuka, LawHub menghadirkan dua fitur utama, yaitu HaloLaw untuk konsultasi hukum on-demand secara langsung dengan mitra pengacara melalui chat, dan SearchLaw untuk membantu masyarakat menemukan dasar hukum yang relevan dengan kasus yang dihadapi, sehingga proses konsultasi hukum menjadi lebih cepat, transparan, dan mudah diakses oleh berbagai kalangan.

## 1.3 Definisi, Istilah, dan Singkatan

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |

## 1.4 Aturan Penomoran

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |

## 1.5 Referensi
Daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L ini adalah SKPL, APL, DPPL, dan Implementasi.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.
Pada dokumen ini terdapat 5 bab. Bab 1 membahas pendahuluan dengan subbab berupa tujuan penulisan dokumen, lingkup masalah, definisi istilah dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen. Kemudian, bab 2 membahas deskripsi umum perangkat lunak dengan memaparkan gambaran menyeluruh mengenai perangkat lunak LawHub yang dikembangkan beserta cakupan fungsionalitasnya. Bab 3 membahas implementasi dengan rincian realisasi teknis sistem yang mencakup lingkungan implementasi, implementasi modul, implementasi antarmuka, serta berkas pendukung lainnya. Selanjutnya, bab 4 membahas hasil pengujian dengan rincian strategi dan kedalaman pengujian kelas, hasil pengujian unit kelas, pengujian integrasi, pengujian use case, pengujian kebutuhan non-fungsional (KNF), serta tangkapan layar dan bukti hasil pengujian. Terakhir, bab 5 memetakan tabel traceability.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram [Nama P/L]</i>
</p>

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | 	Laptop/komputer dengan prosesor minimal Intel Core i3 atau setara, RAM minimal 4 GB, dan ruang penyimpanan tersedia minimal 1 GB |
| *Operating System* | Windows 10 atau lebih baru dan macOS 12 atau lebih baru |
| *Bahasa Pemrograman* | JavaScript (CommonJS) di atas Node.js (minimal v20) |
| *Framework/Library* | Express 5.3.0, EJS 7.0.2, Socket.IO 4.8.4, express-session 1.19.0, connect-flash 0.1.1, express-validator 7.3.2, multer 2.5.0, bcryptjs 3.0.3, dotenv 18.0.9, modul bawaan crypto (AES-256). Sisi klien: HTML, CSS, JavaScript biasa, font Public Sans. |
| *DBMS* | SQLite (better-sqlite3 13.0.3), berkas db/lawhub.db |
| *Development Tools* | Visual Studio Code, Git dan GitHub, nodemon 3.1.14, Postman, Figma, draw.io |
| *Testing Tools* | Pengujian manual lewat browser, Chrome DevTools (tab Network) untuk waktu respons, dan Postman untuk API. |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | RegistrasiMasyarakatPage | src/views/auth/registrasi-masyarakat.ejs | server.js |
| 2 | C02 | LoginMasyarakatPage | src/views/auth/login-masyarakat.ejs | server.js |
| 3 | C03 | BerandaPage | src/views/masyarakat/beranda.ejs, src/views/mitra/beranda.ejs | server.js |
| 4 | C04 | RegistrasiMitraPage | src/views/auth/registrasi-mitra.ejs | server.js |
| 5 | C05 | LoginMitraPage | src/views/auth/login.ejs | server.js |
| 6 | C07 | VerifikasiMitraPage | src/views/admin/verifikasi.ejs, src/views/admin/verifikasi2.ejs | server.js |
| 7 | C08 | EditProfilMitraPage | src/views/mitra/EditProfilMitraPage.ejs | server.js |
| 8 | C09 | EditDokumenLegalitasPage | src/views/mitra/EditDokumenLegalitasPage.ejs | server.js |
| 9 | C10 | SearchLawPage | src/views/searchLaw.ejs | server.js |
| 10 | C11 | DaftarMitraPengacaraPage | src/views/halolaw/daftar-mitra.ejs | server.js |
| 11 | C12 | PemilihanJadwalKonsultasiPage | src/views/konsultasi/jadwal.ejs, src/public/js/konsultasi-jadwal.js | server.js |
| 12 | C13 | KonfirmasiKonsultasiPage | src/views/konsultasi/konfirmasi.ejs, src/views/konsultasi/pengajuan.ejs | server.js |
| 13 | C14 | ChatKonsultasiPage | src/views/konsultasi/chat.ejs, src/public/js/konsultasi-chat.js | server.js |
| 14 | C15 | UlasanPage | src/views/transaksi/ulasan.ejs | server.js |
| 15 | C16 | LaporanAkunPage / LaporanUlasanPage | src/views/laporan/form.ejs (mode akun) | server.js |
| 16 | C17 | LaporanUlasanPage | src/views/laporan/form.ejs (mode ulasan) | server.js |
| 17 | C18 | TinjauanPage | src/views/admin/laporan.ejs | server.js |
| 18 | C19 | HistoryPage | src/views/transaksi/riwayat-list.ejs, src/views/transaksi/riwayat-chat.ejs | server.js |
| 19 | C20 | LiveChatMasyarakatPage | src/views/livechat/masyarakat.ejs, src/public/js/livechat.js | server.js |
| 20 | C21 | LiveChatAdminPage | src/views/livechat/admin.ejs | server.js |
| 21 | C22 | PembayaranPage | src/views/transaksi/pembayaran.ejs | server.js |
| 22 | C23 | PencairanDanaPage | src/views/transaksi/pencairan.ejs | server.js |
| 23 | C24 | RegistrasiMasyarakatController | src/controllers/RegistrasiController.js | server.js |
| 24 | C25 | AutentikasiController | src/controllers/AuthController.js | server.js |
| 25 | C26 | RegistrasiMitraController | src/controllers/RegistrasiController.js | server.js |
| 26 | C27 | VerifikasiMitraController | src/controllers/VerifikasiMitraController.js | server.js |
| 27 | C28 | ProfilMitraController | src/controllers/ProfilMitraController.js | server.js |
| 28 | C29 | SearchLawController | src/routes/searchLaw.js | server.js |
| 29 | C30 | PencarianMitraController | src/controllers/PencarianMitraController.js | server.js |
| 30 | C31 | PenjadwalanKonsultasiController | src/controllers/PenjadwalanKonsultasiController.js | server.js |
| 31 | C32 | SesiKonsultasiController | src/controllers/SesiKonsultasiController.js | server.js |
| 32 | C33 | UlasanController | src/controllers/UlasanController.js | server.js |
| 33 | C34 | LaporanController | src/controllers/LaporanController.js | server.js |
| 34 | C35 | ModerasiAkunController | src/controllers/ModerasiAkunController.js | server.js |
| 35 | C36 | RiwayatController | src/controllers/RiwayatController.js | server.js |
| 36 | C37 | LiveChatController | src/controllers/LiveChatController.js, src/socket/livechat.js | server.js |
| 37 | C38 | PembayaranController | src/controllers/PembayaranController.js, src/services/PaymentGateway.js | server.js |
| 38 | C39 | PencairanDanaController | src/controllers/PencairanController.js | server.js |
| 39 | C40 | Masyarakat | src/models/Masyarakat.js | server.js |
| 40 | C41 | MitraPengacara | src/models/MitraPengacara.js | server.js |
| 41 | C42 | Admin | src/models/Akun.js | server.js |
| 42 | C43 | Kasus | src/models/Kasus.js | server.js |
| 43 | C44 | DasarHukum | src/models/DasarHukum.js | server.js |
| 44 | C45 | DokumenLegalitas | src/models/DokumenLegalitas.js | server.js |
| 45 | C46 | SesiKonsultasi | src/models/SesiKonsultasi.js, src/socket/konsultasi.js | server.js |
| 46 | C47 | Ulasan / Laporan | src/models/Ulasan.js | server.js |
| 47 | C48 | Laporan | src/models/Laporan.js | server.js |
| 48 | C49 | Pembayaran | src/models/Pembayaran.js | server.js |
| 49 | C50 | LiveChat | src/models/LiveChat.js | server.js |
| 50 | C51 | PencairanDana | src/models/PencairanDana.js | server.js |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | UI-01 | Registrasi Masyarakat | src/views/auth/registrasi-masyarakat.ejs | - |
| 2 | UI-02 | Login Masyarakat | src/views/auth/login-masyarakat.ejs | - |
| 3 | UI-03 | Beranda Masyarakat | src/views/masyarakat/beranda.ejs | - |
| 4 | UI-04 | searchLaw | src/views/searchLaw.ejs | - |
| 5 | UI-05 | HaloLaw Form Kasus | src/views/halolaw/form-kasus.ejs | - |
| 6 | UI-06 | HaloLaw List Mitra |src/views/halolaw/daftar-mitra.ejs | - |
| 7 | UI-07 | HaloLaw List Mitra Kosong | src/views/halolaw/daftar-mitra.ejs | - |
| 8 | UI-08 | Pemilihan Jadwal Konsultasi | src/views/konsultasi/jadwal.ejs| - |
| 9 | UI-09 | Pembayaran | src/views/transaksi/pembayaran.ejs | - |
| 10 | UI-10 | Chat Konsultasi Masyarakat | src/views/konsultasi/chat.ejs | - |
| 11 | UI-11 | Chat Konsultasi Mitra Pengacara | src/views/konsultasi/chat.ejs | - |
| 12 | UI-12 | Form Ulasan | src/views/transaksi/ulasan.ejs | - |
| 13 | UI-13 | History Chat  | src/views/transaksi/riwayat-chat.ejs | - |
| 14 | UI-14 | List History Chat Masyarakat | src/views/transaksi/riwayat-list.ejs | - |
| 15 | UI-15 | List History Chat Mitra | src/views/transaksi/riwayat-list.ejs | - |
| 16 | UI-16 | Live Chat Masyarakat | src/views/livechat/masyarakat.ejs | - |
| 17 | UI-17 | Live Chat Admin | src/views/livechat/admin.ejs | - |
| 18 | UI-18 | Registrasi Mitra | src/views/auth/registrasi-mitra.ejs | - |
| 19 | UI-19 | Login Mitra | src/views/auth/login.ejs | - |
| 20 | UI-20 | Landing Page | src/views/landing.ejs | - |
| 21 | UI-21 | Verifikasi Mitra Lanjutan | src/views/admin/verifikasi-detail.ejs | - |
| 22 | UI-22 | Tinjauan Laporan | src/views/admin/laporan.ejs | - |
| 23 | UI-23 | Verifikasi Mitra | src/views/admin/verifikasi.ejs | - |
| 24 | UI-24 | Laporkan Ulasan | src/views/laporan/form.ejs| - |
| 25 | UI-25 | Laporkan Akun | src/views/laporan/form.ejs | - |
| 26 | UI-26 | Pencairan Dana	| src/views/transaksi/pencairan.ejs | - |
| 27 | UI-27 | Edit Dokumen Legalitas Mitra | src/views/mitra/EditDokumenLegalitasPage.ejs | - |
| 28 | UI-28 | Edit Profil Mitra	| src/views/mitra/EditProfilMitraPage.ejs| - |
| 29 | UI-29 | Konfirmasi Konsultasi | src/views/konsultasi/konfirmasi.ejs | - |
| 30 | UI-30 | List Pengajuan |	src/views/konsultasi/pengajuan.ejs | - |
| 31 | UI-31 | Beranda Mitra | src/views/mitra/beranda.ejs | - |
| 32 | UI-32 | Status Verifikasi Mitra | src/views/mitra/status-registrasi.ejs | - |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | src/server.js| File utama untuk menjalankan server aplikasi LawHub menggunakan Express dan menginisialisasi koneksi serta layanan yang diperlukan. |
| 2 | src/package.json | Menyimpan konfigurasi proyek Node.js, daftar dependency, serta script untuk menjalankan aplikasi dan menginisialisasi database. |
| 3 | src/package-lock.json | Mengunci versi dependency yang digunakan agar instalasi package konsisten di lingkungan pengembangan. |
| 4 | src/.env.example | Menyediakan contoh konfigurasi env variable yang diperlukan oleh aplikasi. |
| 5 | src/db/database.js | Mengatur koneksi aplikasi dengan basis data SQLite. |
| 6 | src/db/schema.sql | Mendefinisikan struktur tabel dan skema basis data yang digunakan oleh LawHub.|
| 7 | src/db/init.js | Menginisialisasi basis data dengan menjalankan skema tabel yang telah didefinisikan. |
| 8 | src/db/dataPasal.js | Menyediakan data pasal hukum yang digunakan dalam fitur SearchLaw. |
| 9 | src/db/seed-konsultasi.js	| Menyediakan data awal (seed) yang berkaitan dengan fitur konsultasi.|
| 10 | src/db/seed-transaksi.js	| Menyediakan data awal (seed) yang berkaitan dengan transaksi.|
| 11 | src/routes/auth.js |Mendefinisikan routing untuk proses autentikasi dan registrasi pengguna. |
| 12 | src/routes/admin.js | Mendefinisikan routing untuk fitur dan aktivitas Admin. |
| 13 | src/routes/halolaw.js | Mendefinisikan routing untuk fitur HaloLaw, termasuk pengajuan kasus dan pencarian mitra. |
| 14 |src/routes/konsultasi.js | Mendefinisikan routing untuk proses penjadwalan, pengajuan, dan sesi konsultasi.|
| 15 | src/routes/laporan.js | Mendefinisikan routing untuk proses pelaporan akun maupun ulasan. |
| 16 |src/routes/masyarakat.js | Mendefinisikan routing untuk halaman dan aktivitas pengguna Masyarakat. |
| 17 | src/routes/mitra.js | Mendefinisikan routing untuk halaman dan aktivitas Mitra Pengacara.|
| 18 | src/routes/searchLaw.js	| Mendefinisikan routing untuk fitur pencarian dasar hukum SearchLaw.|
| 19 | src/routes/transaksi.js | Mendefinisikan routing untuk pembayaran, pencairan dana, dan riwayat transaksi. |
| 20 | src/middleware/auth.js | Mengatur middleware autentikasi dan pembatasan akses berdasarkan status atau peran pengguna.|
| 21 | src/middleware/upload.js | Mengatur proses unggah berkas yang dibutuhkan dalam aplikasi, seperti dokumen legalitas dan bukti pendukung kasus.|
| 22 | src/middleware/validasi.js | Menangani validasi data masukan pengguna sebelum diproses lebih lanjut oleh aplikasi. |
| 23 | src/services/PaymentGateway.js | Menyediakan layanan adapter untuk menghubungkan proses pembayaran dengan payment gateway. |
| 24 | src/socket/konsultasi.js | Mengatur komunikasi real-time menggunakan Socket.IO untuk sesi chat konsultasi.|
| 25 | src/socket/livechat.js | Mengatur komunikasi real-time menggunakan Socket.IO pada fitur Live Chat antara Masyarakat dan Admin.|
| 26 | src/utils/Format.js | Menyediakan fungsi utilitas untuk pemformatan data yang digunakan oleh aplikasi.|
| 27 | src/public/css/style.css | Menyimpan stylesheet utama untuk mengatur tampilan umum aplikasi LawHub. |
| 28 | src/public/css/konsultasi.css | Mengatur tampilan antarmuka pada fitur konsultasi.|
| 29 | src/public/css/laporan.css | Mengatur tampilan antarmuka pada fitur pelaporan.|
| 30 | src/public/css/livechat.css | Mengatur tampilan antarmuka pada fitur Live Chat. |
| 31 | src/public/js/login.js | Menyediakan fungsi JavaScript pada halaman login. |
| 32 | src/public/js/konsultasi-chat.js | Menangani interaksi sisi client pada fitur chat konsultasi.|
| 33 | src/public/js/konsultasi-jadwal.js | Menangani interaksi sisi client pada pemilihan jadwal konsultasi.|
| 34 | src/public/js/livechat.js |	Menangani interaksi sisi client pada fitur Live Chat.|
| 35 | src/public/img/LawHub.png | Menyimpan aset gambar logo LawHub yang digunakan pada antarmuka aplikasi.|
| 36 | src/public/fonts/ | Menyimpan berkas font Public Sans beserta lisensinya untuk digunakan pada antarmuka aplikasi.|
| 37 | src/uploads/ | Direktori penyimpanan berkas yang diunggah oleh pengguna melalui aplikasi.|
| ... | *...* | *...* |



<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C01 | RegistrasiMasyarakatPage | Sedang | Halaman berfungsi sebagai form registrasi dan meneruskan data ke proses registrasi. Validasi utama dan penyimpanan dilakukan oleh controller/model. | INT-TC01, INT-TC02 |
| C02 | LoginMasyarakatPage | Sedang | Halaman menerima kredensial dan mengirimkannya ke proses autentikasi; pemeriksaan sandi, status akun, dan pembentukan sesi dilakukan oleh controller. | INT-TC05, INT-TC06, INT-TC07, INT-TC08 |
| C04 | RegistrasiMitraPage | Sedang | Halaman mengumpulkan data mitra dan dokumen legalitas; aturan dokumen wajib, duplikasi akun, dan penyimpanan ditangani di backend. | INT-TC03, INT-TC04 |
| C05 | LoginMitraPage | Sedang | Halaman login mitra memakai alur autentikasi bersama. Pengujian yang tersedia mencakup penolakan peran yang salah dan login mitra yang belum terverifikasi, belum skenario login mitra terverifikasi secara khusus. | INT-TC07, INT-TC09 |
| C06 | StatusVerifikasiMitraPage | Tidak perlu | Halaman terutama menampilkan status dan tahapan verifikasi dari data backend; tidak memiliki aturan bisnis mandiri yang perlu diuji terpisah. | INT-TC54, INT-TC55 |
| C07 | VerifikasiMitraPage | Sedang | Halaman menyediakan tampilan dan input keputusan admin; validasi keputusan dan perubahan status dilakukan oleh controller/model. | INT-TC10, INT-TC11 |
| C08 | EditProfilMitraPage | Sedang | Halaman mengumpulkan perubahan profil. Pemeriksaan data dan penyimpanan profil dikerjakan oleh backend. | INT-TC12, INT-TC13 |
| C09 | EditDokumenLegalitasPage | Sedang | Halaman menjadi antarmuka unggah/perubahan dokumen; validasi format, penyimpanan berkas, dan perubahan data ditangani middleware/controller/model. | INT-TC16, INT-TC17 |
| C10 | SearchLawPage | Sedang | Halaman menerima kata kunci dan menampilkan hasil pencarian. Proses query dijalankan oleh route/backend. | INT-TC18, INT-TC19 |
| C11 | DaftarMitraPengacaraPage | Sedang | Halaman menampilkan daftar mitra dan filter pencarian; penyaringan berdasarkan kasus, tag, dan rating didelegasikan ke backend/model. | INT-TC20, INT-TC21, INT-TC22 |
| C12 | PemilihanJadwalKonsultasiPage | Sedang | Halaman memilih mitra, tanggal, dan slot waktu. Ketersediaan slot dan pencegahan pemesanan ganda diproses oleh controller/model. | INT-TC23, INT-TC24 |
| C13 | KonfirmasiKonsultasiPage | Sedang | Halaman mengirim keputusan terima/tolak dan catatan mitra; validasi catatan dan transisi status sesi dikerjakan oleh backend. | INT-TC25, INT-TC26, INT-TC27 |
| C14 | ChatKonsultasiPage | Sedang | Halaman menjadi klien chat real-time dan meneruskan pesan melalui Socket.IO; otorisasi sesi, status pembayaran, enkripsi, dan penyimpanan dikelola di sisi server/model. | INT-TC28, INT-TC29, INT-TC30 |
| C15 | UlasanPage | Sedang | Halaman menyediakan form rating dan teks ulasan; syarat sesi selesai, batas nilai, dan penyimpanan ulasan divalidasi backend. | INT-TC35, INT-TC36, INT-TC37 |
| C16 | LaporanAkunPage / LaporanUlasanPage | Sedang | Kedua halaman merupakan form pelaporan. Validasi target, deskripsi, dan keterkaitan laporan dengan ulasan dijalankan oleh controller/model. | INT-TC43, INT-TC44, INT-TC52, INT-TC53 |
| C18 | TinjauanPage | Sedang | Halaman menampilkan laporan dan mengirim keputusan admin; validasi status laporan serta tindakan moderasi didelegasikan ke backend. | INT-TC45, INT-TC46, INT-TC47 |
| C19 | HistoryPage | Sedang | Halaman menampilkan riwayat dan detail sesi. Pengambilan data serta pemeriksaan kepemilikan riwayat dilakukan oleh controller/model. | INT-TC38, INT-TC39 |
| C20 | LiveChatMasyarakatPage | Sedang | Halaman masyarakat menjadi antarmuka untuk memulai dan mengakhiri live chat serta bertukar pesan; pengelolaan sesi dilakukan oleh controller/socket. | INT-TC48, INT-TC50 |
| C21 | LiveChatAdminPage | Sedang | Halaman admin menampilkan antrean, menerima chat, dan mengakhiri sesi; pengelolaan antrean dan status dikerjakan oleh controller/socket. | INT-TC48, INT-TC49 |
| C22 | PembayaranPage | Sedang | Halaman mengumpulkan metode dan data pembayaran. Validasi, perhitungan biaya, pemanggilan gateway, dan perubahan status dilakukan di backend. | INT-TC31, INT-TC32, INT-TC33 |
| C23 | PencairanDanaPage | Sedang | Halaman mengumpulkan rekening dan nominal pencairan; validasi saldo, pemrosesan gateway, dan pencatatan transaksi dilakukan di backend. | INT-TC40, INT-TC41 |
| C24 | RegistrasiMasyarakatController | Mendalam | Memuat validasi registrasi, pemeriksaan email/username duplikat, hashing kata sandi, dan penyimpanan akun. Implementasi registrasi masyarakat berada di `RegistrasiController.js`. | INT-TC01, INT-TC02 |
| C25 | AutentikasiController | Mendalam | Memuat pemeriksaan kredensial, hashing/verifikasi sandi, pembatasan peran, status akun, dan pembentukan/penghapusan sesi. | INT-TC05, INT-TC06, INT-TC07, INT-TC08, INT-TC09, INT-TC51 |
| C26 | RegistrasiMitraController | Mendalam | Memvalidasi dokumen wajib dan akun duplikat, melakukan hashing sandi, membersihkan berkas unggahan saat gagal, serta menyimpan akun beserta dokumennya. Implementasinya berbagi `RegistrasiController.js` dengan C24. | INT-TC03, INT-TC04 |
| C27 | VerifikasiMitraController | Mendalam | Memvalidasi ID dan keputusan verifikasi, mewajibkan catatan saat penolakan, serta mengubah status verifikasi dan validitas dokumen. | INT-TC10, INT-TC11 |
| C29 | SearchLawController | Sedang | Implementasi pencarian berada pada handler di `routes/searchLaw.js`; handler membersihkan kata kunci, menjalankan query, dan mengirim hasil ke halaman tanpa algoritma bisnis yang kompleks. | INT-TC18, INT-TC19 |
| C30 | PencarianMitraController | Mendalam | Memuat aturan pemilihan kasus, normalisasi tag, filter keahlian/rating, dan pencarian mitra sesuai kriteria. | INT-TC20, INT-TC21, INT-TC22 |
| C31 | PenjadwalanKonsultasiController | Mendalam | Memvalidasi tanggal/waktu dan mitra, memeriksa slot yang tersedia, serta mencegah pemesanan slot yang sudah terisi. | INT-TC23, INT-TC24 |
| C32 | SesiKonsultasiController | Mendalam | Mengatur hak akses peserta sesi, validasi terima/tolak, catatan penolakan, transisi status sesi, akses chat, dan pengakhiran sesi. | INT-TC25, INT-TC26, INT-TC27, INT-TC28, INT-TC29, INT-TC30 |
| C33 | UlasanController | Mendalam | Memastikan sesi milik pengguna dan telah selesai, mencegah ulasan ganda, memvalidasi rating/teks, serta menyimpan ulasan. | INT-TC35, INT-TC36, INT-TC37 |
| C34 | LaporanController | Mendalam | Memvalidasi peran dan target terlapor, deskripsi pelanggaran, serta hubungan laporan dengan ulasan sebelum menyimpan laporan. | INT-TC43, INT-TC44, INT-TC52, INT-TC53 |
| C35 | ModerasiAkunController | Mendalam | Memproses keputusan admin, memvalidasi laporan yang masih menunggu, memperbarui status laporan, dan menjalankan pemblokiran akun. | INT-TC45, INT-TC46, INT-TC47 |
| C36 | RiwayatController | Mendalam | Mengambil riwayat berdasarkan peran dan memeriksa kepemilikan sesi sebelum mengizinkan pengguna melihat detail/isi chat. | INT-TC38, INT-TC39 |
| C37 | LiveChatController | Sedang | Mengorkestrasi tampilan antrean, status standby admin, dan penutupan chat dengan mendelegasikan pengelolaan data ke model serta notifikasi ke Socket.IO. | INT-TC48, INT-TC49, INT-TC50 |
| C38 | PembayaranController | Mendalam | Memvalidasi sesi dan metode pembayaran, menghitung biaya, memanggil payment gateway, serta menangani hasil pembayaran dan perubahan status/saldo. | INT-TC31, INT-TC32, INT-TC33, INT-TC34 |
| C39 | PencairanDanaController | Mendalam | Memvalidasi rekening dan nominal, memastikan saldo mencukupi, memanggil gateway, serta mencatat hasil pencairan dan perubahan saldo. | INT-TC40, INT-TC41 |
| C40 | Masyarakat | Tidak perlu | Model masyarakat terutama menyimpan dan memeriksa data akun; tidak ditemukan algoritma atau aturan bisnis kompleks di model ini. Perilakunya diuji tidak langsung melalui alur registrasi dan penggunaan fitur masyarakat. | INT-TC01, INT-TC02, INT-TC05, INT-TC20, INT-TC21, INT-TC43, INT-TC44 |
| C41 | MitraPengacara | Mendalam | Model memuat transaksi registrasi mitra, pencarian dengan filter status/tag/rating, perubahan profil/status, dan pemeriksaan bentrok jadwal. | INT-TC03, INT-TC04, INT-TC10, INT-TC11, INT-TC12, INT-TC13, INT-TC14, INT-TC15, INT-TC20, INT-TC22, INT-TC54, INT-TC55, INT-TC56, INT-TC57 |
| C42 | Admin | Tidak perlu | Admin berperan sebagai data/identitas pengguna. Operasi login, verifikasi, moderasi, dan balasan chat diimplementasikan pada controller serta handler terkait, bukan sebagai logika pada model Admin tersendiri. | INT-TC11, INT-TC45, INT-TC46, INT-TC47, INT-TC48, INT-TC49, INT-TC51 |
| C43 | Kasus | Sedang | Model menyediakan operasi simpan, ubah, dan ambil kasus dengan pembatasan kepemilikan; logikanya berupa operasi basis data sederhana yang dipanggil controller. | INT-TC20, INT-TC21, INT-TC22 |
| C44 | DasarHukum | Sedang | Model menyediakan pencarian kata kunci dan pencarian berdasarkan ID dengan query sederhana. Namun, model `DasarHukum.js` tidak ditemukan dipakai oleh alur aktif; `INT-TC18–INT-TC19` menguji handler `/searchlaw` terhadap tabel `Peraturan`, bukan model ini. | - |
| C45 | DokumenLegalitas | Mendalam | Mengelola metadata dokumen, penyimpanan/perubahan dokumen legalitas, reset validitas, dan penghapusan berkas lama sehingga konsistensi file dan basis data perlu diperhatikan. | INT-TC03, INT-TC04, INT-TC11, INT-TC16, INT-TC17 |
| C46 | SesiKonsultasi | Mendalam | Memuat logika inti konsultasi: penyusunan slot, pencegahan bentrok, pembuatan sesi, kedaluwarsa permintaan, perubahan status, validasi pembayaran, enkripsi pesan, izin chat, dan waktu mulai/selesai. | INT-TC23, INT-TC24, INT-TC25, INT-TC26, INT-TC27, INT-TC28, INT-TC29, INT-TC30, INT-TC33, INT-TC35, INT-TC36, INT-TC37, INT-TC38, INT-TC39 |
| C47 | Ulasan / Laporan | Mendalam | Mewakili dua domain yang memiliki aturan bisnis: penyimpanan ulasan dan perhitungan rating, serta pembuatan/pemrosesan laporan pelanggaran. | INT-TC35, INT-TC36, INT-TC37, INT-TC43, INT-TC44, INT-TC45, INT-TC46, INT-TC47, INT-TC52, INT-TC53 |
| C48 | Laporan | Mendalam | Mengelola pembuatan, pemeriksaan status, dan detail laporan serta mendukung alur moderasi yang membatasi pemrosesan ulang laporan. | INT-TC43, INT-TC44, INT-TC45, INT-TC46, INT-TC47, INT-TC52, INT-TC53 |
| C49 | Pembayaran | Mendalam | Memuat perhitungan subtotal/pajak/total, pencatatan hasil transaksi, serta perubahan status pembayaran sesi dan saldo mitra secara transaksional. | INT-TC31, INT-TC32, INT-TC33, INT-TC34 |
| C50 | LiveChat | Mendalam | Mengelola pembuatan sesi live chat, antrean, ketersediaan admin, penugasan admin, penyimpanan pesan, dan transisi status sesi. | INT-TC48, INT-TC49, INT-TC50 |
| C51 | PencairanDana | Mendalam | Memuat pencatatan pencairan dan pengurangan saldo secara transaksional dengan pemeriksaan kecukupan saldo agar saldo tidak menjadi negatif. | INT-TC40, INT-TC41 |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: *[tuliskan perintah, mis. `pytest src/tests/`]*.

Lokasi file test: *[path, mis. `src/tests/`]*.

### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** *[C02]*  
**Nama Kelas:** *[Pesanan]*  
**Tingkat:** *[Mendalam]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`hitungTotal(): Decimal`* | *Normal* | *Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1* | *Total = 25.000* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`hitungTotal(): Decimal`* | *Batas* | *Pesanan berisi tepat 1 item dengan jumlah 1* | *Total = harga item tersebut* | *[...]* | *Pass/Fail* |
| *C02-UT03* | *`hitungTotal(): Decimal`* | *Negatif* | *Pesanan tanpa item* | *Total = 0 atau melempar kesalahan sesuai rancangan* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas [Nama Kelas 2]

*[Ulangi pola 4.2.1 untuk setiap kelas bertingkat Mendalam atau Sedang.]*

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.
 
Cara menjalankan pengujian integrasi: `npm run test:integrasi` (dari folder `src/`).

Lokasi file test: `src/tests/integrasi/`.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| I-01 | RegistrasiController | Masyarakat, MitraPengacara, DokumenLegalitas (Model) | Controller - Model | INT-TC01, INT-TC02, INT-TC03, INT-TC04 |
| I-02 | AuthController | Akun (Model; tabel Masyarakat, MitraPengacara, Admin) | Controller - Model | INT-TC05, INT-TC06, INT-TC07, INT-TC51 |
| I-03 | VerifikasiMitraController | verifikasiMitra (Model) | Controller - Model | INT-TC10, INT-TC11 |
| I-04 | ProfilMitraController | MitraPengacara, JadwalKetersediaan, DokumenLegalitas (Model) | Controller - Model | INT-TC12 s.d. INT-TC17 |
| I-05 | Handler SearchLaw (`routes/searchLaw.js`) | Tabel Peraturan | Controller - Model | INT-TC18, INT-TC19 |
| I-06 | KasusController, PencarianMitraController | Kasus, MitraPengacara (Model) | Controller - Model | INT-TC20, INT-TC21, INT-TC22 |
| I-07 | PenjadwalanKonsultasiController | SesiKonsultasi (Model) | Controller - Model | INT-TC23, INT-TC24 |
| I-08 | SesiKonsultasiController | SesiKonsultasi (Model) | Controller - Model | INT-TC25, INT-TC26, INT-TC27 |
| I-09 | UlasanController | Ulasan, MitraPengacara (Model) | Controller - Model | INT-TC35, INT-TC36, INT-TC37 |
| I-10 | LaporanController | Laporan, Ulasan, Masyarakat, MitraPengacara (Model) | Controller - Model | INT-TC43, INT-TC44, INT-TC52, INT-TC53 |
| I-11 | ModerasiAkunController | Laporan (Model; termasuk status akun terlapor) | Controller - Model | INT-TC45, INT-TC46, INT-TC47 |
| I-12 | RiwayatController | Riwayat (Model) | Controller - Model | INT-TC38, INT-TC39 |
| I-13 | LiveChatController | LiveChat (Model) | Controller - Model | INT-TC49, INT-TC50 |
| I-14 | PembayaranController | Pembayaran (Model) | Controller - Model | INT-TC31, INT-TC33 |
| I-15 | PencairanController | PencairanDana (Model) | Controller - Model | INT-TC40, INT-TC41 |
| I-16 | Seluruh Model | Basis data SQLite (`better-sqlite3`) | Aplikasi - Basis data | INT-TC34, INT-TC42 |
| I-17 | PembayaranController | PaymentGateway dummy (`services/PaymentGateway.js`) | Aplikasi - Sistem eksternal | INT-TC32, INT-TC33 |
| I-18 | PencairanController | PaymentGateway dummy (`services/PaymentGateway.js`) | Aplikasi - Sistem eksternal | INT-TC40 |
| I-19 | Klien Socket.IO (browser) | `socket/konsultasi.js` → SesiKonsultasi, PesanChat | Klien - Server *real-time* (tambahan, tidak ada di DPPL) | INT-TC28, INT-TC29, INT-TC30 |
| I-20 | Klien Socket.IO (browser) | `socket/livechat.js` → LiveChat, PesanChat | Klien - Server *real-time* (tambahan, tidak ada di DPPL) | INT-TC48, INT-TC50 |
| I-21 | Middleware unggah (multer) | Folder `src/uploads/` | Aplikasi - *File system* (tambahan, tidak ada di DPPL) | INT-TC03, INT-TC04, INT-TC16, INT-TC17 |
| I-22 | `middleware/auth.js` | Basis data (status akun dan status verifikasi) | Middleware - Basis data (tambahan, tidak ada di DPPL) | INT-TC08, INT-TC09 |
| I-23 | StatusRegistrasiController (realisasi StatusVerifikasiMitraView → VerifikasiMitraController pada DPPL) | MitraPengacara, DokumenLegalitas (Model) | Controller - Model (tambahan, nama controller berbeda dari DPPL) | INT-TC54, INT-TC55 |
| I-24 | BerandaMitraController (realisasi BerandaView) | DashboardMitra (Model) | Controller - Model (tambahan, tidak ada di DPPL) | INT-TC56, INT-TC57 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | I-01 | Normal: registrasi masyarakat | `POST /registrasi-masyarakat` dengan nama, username `uji_int`, no. HP `81234567890`, email baru, sandi `rahasia123`, lalu baca tabel Masyarakat | Redirect ke `/login-masyarakat`; baris baru tersimpan, no. HP `+6281234567890`, sandi berupa hash bcrypt | Redirect 302 ke `/login-masyarakat`; baris tersimpan dengan no. HP `+6281234567890`; sandi berawalan `$2` (hash bcrypt), bukan teks asli | Pass |
| INT-TC02 | I-01 | Gagal: email sudah terdaftar | `POST /registrasi-masyarakat` memakai email `sisi@lawhub.test` | Status 400, pesan "Email sudah terdaftar", jumlah baris Masyarakat tetap | Status 400, pesan "Email sudah terdaftar" tampil, jumlah baris tidak bertambah | Pass |
| INT-TC03 | I-01, I-21 | Normal: registrasi mitra dengan 4 dokumen wajib | `POST /registrasi-mitra` (multipart) dengan data akun dan berkas PDF Ijazah, KTA, SIPA, BAS | Redirect ke `/login`; akun berstatus `menunggu`; 4 baris DokumenLegalitas; berkas fisik ada di `uploads/` | Redirect 302 ke `/login`; status `menunggu`; 4 baris dokumen (bas, ijazah, kta, sipa); keempat berkas ditemukan di `uploads/` | Pass |
| INT-TC04 | I-01, I-21 | Gagal: dokumen BAS tidak diunggah | `POST /registrasi-mitra` hanya dengan Ijazah, KTA, SIPA | Status 400, pesan "Dokumen BAS wajib diunggah", akun tidak dibuat, berkas yang sempat terunggah dihapus | Status 400, pesan tampil, akun tidak ada di basis data, tidak ada berkas baru yang tertinggal di `uploads/` | Pass |
| INT-TC05 | I-02 | Normal: login masyarakat | `POST /login-masyarakat` dengan `sisi@lawhub.test` / `sisi947`, lalu `GET /masyarakat` | Redirect ke `/masyarakat`; beranda dapat dibuka (200) | Redirect 302 ke `/masyarakat`; `GET /masyarakat` berstatus 200 | Pass |
| INT-TC06 | I-02 | Gagal: kata sandi salah | `POST /login-masyarakat` dengan sandi `salah-sandi` | Kembali ke halaman login dengan pesan "Email atau kata sandi salah"; tidak ada sesi login | Redirect ke `/login-masyarakat`, pesan tampil; `GET /masyarakat` diarahkan ke `/login` | Pass |
| INT-TC07 | I-02 | Gagal: akun mitra login di halaman masyarakat | `POST /login-masyarakat` dengan akun mitra `ami@lawhub.test` | Ditolak dengan pesan "Email terdaftar pada peran lain..." | Redirect ke `/login-masyarakat`, pesan tampil, tidak masuk | Pass |
| INT-TC08 | I-22 | Gagal: akun diblokir saat masih login | Login sebagai `rina`, lalu ubah `statusAkun` menjadi `diblokir` di basis data, lalu `GET /masyarakat` | Akses ditolak (403) dengan pesan "Akun Anda diblokir..." | Status 403, pesan "Akun Anda diblokir karena melanggar kebijakan sistem" | Pass |
| INT-TC09 | I-22 | Gagal: mitra belum terverifikasi membuka fitur konsultasi | Login mitra hasil INT-TC03 (status `menunggu`), lalu `GET /konsultasi/pengajuan` | Diarahkan ke `/mitra/status-verifikasi` | Login diarahkan ke `/mitra/status-verifikasi`; akses pengajuan juga diarahkan ke `/mitra/status-verifikasi` | Pass |
| INT-TC10 | I-03 | Gagal: admin menolak tanpa catatan | `POST /admin/verifikasi/:idMitra` dengan `keputusan=tolak`, `catatan` kosong (mitra fixture berstatus `menunggu`) | Ditolak sistem; status mitra tetap `menunggu` | Redirect kembali ke detail mitra; status tetap `menunggu` | Pass |
| INT-TC11 | I-03 | Normal: admin memverifikasi mitra | `POST /admin/verifikasi/:idMitra` dengan `keputusan=verifikasi` | Status mitra `terverifikasi`; validitas dokumen mitra menjadi 1 | Redirect ke `/admin/verifikasi`; status `terverifikasi`; seluruh dokumen mitra bervaliditas 1 | Pass |
| INT-TC12 | I-04 | Normal: mitra mengubah profil | `POST /mitra/profil/edit` (login `ami`) dengan nama firma baru, deskripsi, tag `pidana` | Data tersimpan pada tabel MitraPengacara | Redirect ke `/mitra/profil`; namaFirma, deskripsi, dan tagKeahlian di basis data sesuai masukan | Pass |
| INT-TC13 | I-04 | Gagal: deskripsi profil kosong | `POST /mitra/profil/edit` dengan deskripsi berisi spasi | Ditolak; data profil lama tidak berubah | Redirect ke `/mitra/profil/edit`; namaFirma dan tag tetap nilai lama | Pass |
| INT-TC14 | I-04 | Normal: menambah slot jadwal | `POST /mitra/jadwal` tanggal H+40, 08:00-10:00 | Satu baris baru pada JadwalKetersediaan | Satu baris tersimpan dengan waktu 08:00-10:00 | Pass |
| INT-TC15 | I-04 | Gagal: slot bertumpuk | `POST /mitra/jadwal` tanggal yang sama, 09:00-11:00 | Ditolak dengan pesan "Jam tersebut bertumpuk dengan slot lain."; tidak ada baris baru | Tetap 1 baris pada tanggal itu; pesan tampil di halaman profil | Pass |
| INT-TC16 | I-04, I-21 | Normal: unggah dokumen legalitas | `POST /mitra/dokumen` (multipart) dengan berkas PDF pada kolom SIPA | Baris DokumenLegalitas tersimpan (validitas 0), berkas ada di `uploads/`, status mitra kembali `menunggu` | Redirect ke `/mitra/profil`; baris SIPA tersimpan dengan validitas 0; berkas ada; status mitra `menunggu` | Pass |
| INT-TC17 | I-04, I-21 | Gagal: format dokumen tidak didukung | `POST /mitra/dokumen` dengan berkas `.txt` (text/plain) pada kolom KTP | Ditolak dengan pesan "Format dokumen tidak didukung."; tidak ada baris baru; berkas dihapus | Jumlah baris DokumenLegalitas tetap; tidak ada berkas tertinggal; pesan tampil | Pass |
| INT-TC18 | I-05 | Normal: pencarian peraturan | `GET /searchlaw?q=Pekerja Rumah Tangga` | Halaman memuat judul, nomor, dan tahun peraturan yang ada di tabel Peraturan | Status 200; judul dan "Nomor 2 Tahun 2026" tampil sesuai baris di basis data | Pass |
| INT-TC19 | I-05 | Gagal: kata kunci tidak cocok | `GET /searchlaw?q=zzqqxxkatakuncitidakada` | Pesan "Belum ada peraturan yang cocok dengan pencarianmu." tanpa kartu hasil | Status 200; pesan kosong tampil; tidak ada kartu hasil | Pass |
| INT-TC20 | I-06 | Normal: simpan kasus lalu cari mitra | `POST /halolaw` (login `sisi`) dengan deskripsi kasus dan tag `pidana`, lalu buka daftar mitra | Kasus tersimpan dengan kategori `pidana`; daftar memuat mitra bertag pidana dan tidak memuat mitra tanpa tag pidana | Kasus tersimpan; redirect ke `/halolaw/mitra?kasus=<id>`; Budi (pidana) tampil, Citra (perdata, administrasi) tidak tampil | Pass |
| INT-TC21 | I-06 | Gagal: deskripsi kasus terlalu pendek | `POST /halolaw` dengan deskripsi `pendek` | Status 400, pesan "Deskripsi kasus minimal 10 karakter."; kasus tidak tersimpan | Status 400, pesan tampil, jumlah baris Kasus tetap | Pass |
| INT-TC22 | I-06 | Gagal: tidak ada mitra yang sesuai | `GET /halolaw/mitra?q=namayangtidakada&terapkan=1` | Pesan "Tidak ada mitra pengacara yang sesuai." | Status 200, pesan tampil | Pass |
| INT-TC23 | I-07 | Normal: memilih jadwal kosong | Cek slot H+3 mitra Budi lewat `GET /konsultasi/jadwal/:idMitra/slot`, lalu `POST /konsultasi/jadwal/:idMitra` jam 14:00 | Sesi baru berstatus `menunggu tanggapan mitra`; slot 14:00 tidak lagi ditawarkan | Redirect ke `/konsultasi/saya`; sesi tersimpan dengan status tersebut; slot 14:00 hilang dari daftar slot | Pass |
| INT-TC24 | I-07 | Gagal: slot sudah dipesan orang lain | Akun `rina` memesan slot Budi yang sama (H+3, 14:00) | Ditolak; tidak terjadi dobel booking | Redirect kembali ke halaman jadwal; tetap hanya 1 sesi pada slot tersebut | Pass |
| INT-TC25 | I-08 | Gagal: menolak tanpa catatan | `POST /konsultasi/konfirmasi/:idSesi` (login `budi`) dengan `aksi=tolak`, catatan kosong | Ditolak; status sesi tetap `menunggu tanggapan mitra` | Redirect kembali ke halaman konfirmasi; status tidak berubah | Pass |
| INT-TC26 | I-08 | Normal: mitra menerima permintaan | `POST /konsultasi/konfirmasi/:idSesi` dengan `aksi=terima` | Status sesi `terjadwal` | Redirect ke `/konsultasi/pengajuan`; status `terjadwal` | Pass |
| INT-TC27 | I-08 | Gagal: menanggapi ulang permintaan | `POST /konsultasi/konfirmasi/:idSesi` dengan `aksi=tolak` pada sesi yang sudah `terjadwal` | Ditolak; status tetap `terjadwal` | Status tetap `terjadwal` | Pass |
| INT-TC28 | I-19 | Normal: chat konsultasi *real-time* | Fixture sesi `terjadwal` + `lunas` pada jam sekarang; masyarakat dan mitra terhubung ke namespace `/konsultasi`, `gabung`, lalu masyarakat `kirim_pesan` | Mitra menerima `pesan_baru` berisi teks asli; pesan tersimpan terenkripsi (`enc:v1:`); status sesi `berlangsung` dan waktu mulai tercatat | Mitra menerima teks asli; isi PesanChat berawalan `enc:v1:` dan tidak memuat teks asli; status `berlangsung`, `waktuMulai` terisi | Pass |
| INT-TC29 | I-19 | Gagal: sesi belum lunas | Fixture sesi `terjadwal` dengan `statusPembayaran = belum bayar`; masyarakat `gabung` lalu `kirim_pesan` | `pesan_error` "Pembayaran sesi konsultasi belum lunas..."; tidak ada pesan tersimpan | `pesan_error` diterima; jumlah PesanChat sesi tersebut 0 | Pass |
| INT-TC30 | I-19 | Gagal: koneksi tanpa login | Sambung ke `/konsultasi` tanpa cookie sesi | Koneksi ditolak "Harus login..." | `connect_error` dengan pesan "Harus login sebagai masyarakat atau mitra pengacara" | Pass |
| INT-TC31 | I-14 | Gagal: data kartu tidak valid | `POST /transaksi/pembayaran/:idSesi` dengan nomor kartu `1234` | Status 400 "Nomor kartu harus 16 digit"; tidak ada transaksi tercatat (gateway tidak dipanggil) | Status 400, pesan tampil, jumlah baris Pembayaran untuk sesi 0 | Pass |
| INT-TC32 | I-17 | Gagal: gateway menolak kartu | `POST /transaksi/pembayaran/:idSesi` dengan kartu `0000111122223333` | Status 402 "Pembayaran gagal: Kartu ditolak oleh bank penerbit"; transaksi tercatat `gagal`; sesi tidak lunas; saldo mitra tetap | Status 402, pesan tampil; baris Pembayaran berstatus `gagal`; sesi tidak lunas; saldo tidak berubah | Pass |
| INT-TC33 | I-14, I-17 | Normal: gateway menyetujui pembayaran | `POST /transaksi/pembayaran/:idSesi` dengan kartu `4111111111111111`, kadaluwarsa `12/29`, CVC `123` | Redirect ke `/konsultasi/saya`; transaksi `berhasil`; sesi `lunas`; saldo mitra +Rp70.000 | Server membalas **500 (Terjadi kesalahan pada server)**. Tidak ada baris Pembayaran, sesi tidak lunas, saldo tidak bertambah | **Fail.** Penyebab: pada `models/Pembayaran.js` fungsi `simpanHasil()` terdapat tanda `+` di awal baris query `UPDATE SesiKonsultasi ...` (masuk lewat commit `b9e63af`, PR #51). Tanda `+` mengubah teks query menjadi `NaN`, sehingga `db.prepare()` melempar `TypeError` dan transaksi dibatalkan. Akibatnya tidak ada pembayaran yang bisa berhasil, sehingga alur chat (UC12), ulasan (UC13), dan riwayat (UC18) juga tidak dapat dicapai secara normal. Usulan: hapus kedua tanda `+` tersebut. Pengujian ulang dengan perbaikan sementara memberikan hasil Pass |
| INT-TC34 | I-16 | Gagal: satu query di dalam transaksi gagal | Jalankan pembayaran seperti INT-TC33 (query kedua di dalam `db.transaction` gagal), lalu periksa tabel Pembayaran, SesiKonsultasi, dan saldo mitra | Data tetap konsisten: tidak ada perubahan sebagian (seluruh perubahan dibatalkan) | Baris Pembayaran yang sempat di-INSERT ikut dibatalkan; sesi tidak lunas; saldo tidak berubah | Pass |
| INT-TC35 | I-09 | Normal: kirim ulasan | Fixture sesi `selesai` dan `lunas`; `POST /transaksi/ulasan/:idSesi` skor 5 dan teks ulasan | Ulasan tersimpan; rating mitra = rata-rata skor ulasannya | Redirect ke `/transaksi/riwayat`; baris Ulasan tersimpan; rating mitra sama dengan rata-rata skor | Pass |
| INT-TC36 | I-09 | Gagal: rating kosong | `POST /transaksi/ulasan/:idSesi` dengan skor kosong | Status 400 "Rating wajib diisi (1-5 bintang)"; ulasan tidak tersimpan | Status 400, pesan tampil, tidak ada baris Ulasan | Pass |
| INT-TC37 | I-09 | Gagal: sesi belum selesai | `POST /transaksi/ulasan/:idSesi` pada sesi `terjadwal` | Ditolak; ulasan tidak tersimpan | Redirect ke `/transaksi/riwayat`; tidak ada baris Ulasan | Pass |
| INT-TC38 | I-12 | Normal: membuka detail riwayat konsultasi | Fixture sesi `lunas`; kirim pesan lewat socket, akhiri sesi, lalu `GET /transaksi/riwayat` dan `GET /transaksi/riwayat/:idSesi` | Sesi muncul di daftar riwayat; detail menampilkan isi chat yang dapat dibaca | Sesi muncul di daftar dan halaman detail terbuka (200), tetapi isi pesan tampil sebagai teks terenkripsi `enc:v1:...`, bukan teks asli | **Fail.** Penyebab: `models/Riwayat.js` fungsi `pesanSesi()` mengambil `PesanChat` langsung dari basis data tanpa memanggil `dekripsi()`, padahal pesan disimpan terenkripsi oleh `SesiKonsultasi.simpanPesan()`. Usulan: petakan hasil query dengan `dekripsi()` dari `models/SesiKonsultasi.js`, atau pakai `SesiKonsultasi.ambilPesan()`. Pengujian ulang dengan perbaikan sementara memberikan hasil Pass |
| INT-TC39 | I-12 | Gagal: membuka riwayat milik orang lain | Login `rina`, `GET /transaksi/riwayat/:idSesi` milik `sisi` | Status 404 "Riwayat tidak ditemukan" | Status 404, pesan tampil | Pass |
| INT-TC40 | I-15, I-18 | Normal: pencairan dana | `POST /transaksi/keuangan/cairkan` (login `ami`) nominal 100000 | Gateway menyetujui; PencairanDana tercatat `berhasil` ke rekening terdaftar; saldo berkurang 100.000 | Baris PencairanDana `berhasil` dengan rekening `BCA\|1234567890\|Ami Pengacara`; saldo berkurang tepat 100.000 | Pass |
| INT-TC41 | I-15 | Gagal: nominal melebihi saldo | `POST /transaksi/keuangan/cairkan` nominal = saldo + 1 | Ditolak "Saldo tidak mencukupi"; tidak ada pencairan tercatat; saldo tetap | Jumlah baris PencairanDana tetap; saldo tidak berubah; pesan tampil | Pass |
| INT-TC42 | I-16 | Normal: persistensi data | Matikan lalu nyalakan ulang server dengan basis data yang sama, lalu login dan buka `/transaksi/keuangan` | Data Ulasan dan PencairanDana tetap ada; aplikasi tetap dapat membaca data | Jumlah baris tidak berubah setelah restart; login berhasil dan halaman keuangan berstatus 200 | Pass |
| INT-TC43 | I-10 | Normal: melaporkan akun | `POST /laporan/buat` (login `sisi`) terhadap mitra Budi, kategori "Bahasa kasar", deskripsi | Laporan tersimpan berstatus `menunggu` | Redirect ke `/masyarakat`; baris Laporan tersimpan dengan peran dan status yang benar | Pass |
| INT-TC44 | I-10 | Gagal: deskripsi laporan kosong | `POST /laporan/buat` dengan deskripsi berisi spasi | Ditolak; laporan tidak tersimpan | Jumlah baris Laporan tetap | Pass |
| INT-TC45 | I-11 | Normal: admin memblokir akun terlapor | `POST /admin/laporan/:idLaporan/blokir` dengan catatan, lalu Budi mencoba login | Laporan `disetujui` beserta catatan; akun Budi `diblokir`; login Budi ditolak | Laporan `disetujui`, catatan tersimpan; statusAkun `diblokir`; login ditolak dengan pesan "Akun Anda diblokir" | Pass |
| INT-TC46 | I-11 | Gagal: memproses ulang laporan | `POST /admin/laporan/:idLaporan/tolak` pada laporan yang sudah disetujui | Ditolak "Laporan ini sudah pernah ditinjau sebelumnya."; status tetap | Status tetap `disetujui`; pesan tampil | Pass |
| INT-TC47 | I-11 | Normal: admin menolak laporan | Buat laporan terhadap Citra, lalu `POST /admin/laporan/:idLaporan/tolak` | Laporan `ditolak`; akun Citra tetap `aktif` | Status laporan `ditolak`; akun Citra `aktif` | Pass |
| INT-TC48 | I-20 | Normal: live chat masyarakat dan admin | Masyarakat dan admin terhubung ke Socket.IO; masyarakat `kirim_pesan`; admin `gabung_chat` lalu membalas | Sesi LiveChat dibuat (`menunggu`); admin menerima `admin:antrean_update`; balasan admin sampai ke masyarakat; status `berlangsung` dengan idAdmin terisi; 2 pesan tersimpan | Semua event diterima; LiveChat dibuat lalu berubah `berlangsung`, idAdmin terisi; 2 baris PesanChat | Pass |
| INT-TC49 | I-13 | Normal: admin menyelesaikan live chat | `POST /admin/livechat/:idChat/selesai` | Status `selesai`, waktu selesai tercatat | Redirect ke `/admin/livechat`; status `selesai`; `waktuChatSelesai` terisi | Pass |
| INT-TC50 | I-13, I-20 | Gagal: tidak ada admin standby | Admin menekan tombol standby (`POST /admin/livechat/standby`) sehingga tidak standby, lalu akun `tono` mengirim pesan live chat | Status admin tersimpan tidak standby (0); masyarakat menerima "Belum ada Admin yang standby saat ini."; sesi live chat tidak dibuat | statusStandby menjadi 0; `pesan_error` diterima; tidak ada baris LiveChat untuk `tono` | Pass |
| INT-TC51 | I-02 | Normal: login admin | `POST /login` dengan `admin@lawhub.test` / `admin123`, lalu `GET /admin/verifikasi` | Redirect ke `/admin`; halaman admin dapat dibuka | Redirect 302 ke `/admin`; `GET /admin/verifikasi` berstatus 200 | Pass |
| INT-TC52 | I-10 | Normal: mitra melaporkan ulasan (UC16) | Fixture ulasan dari `sisi` untuk mitra `ami`; `POST /laporan/buat` (login `ami`) dengan `idUlasan`, kategori, dan deskripsi | Laporan tersimpan dengan idUlasan, peran terlapor `masyarakat`, idTerlapor penulis ulasan, status `menunggu` | Redirect ke `/mitra`; baris Laporan tersimpan sesuai harapan | Pass |
| INT-TC53 | I-10 | Gagal: melaporkan ulasan milik mitra lain | `POST /laporan/buat` (login `ami`) dengan idUlasan milik mitra `dimas` | Ditolak "Ulasan tidak ditemukan atau Anda tidak memiliki akses"; laporan tidak tersimpan | Tidak ada baris Laporan untuk ulasan tersebut; pesan tampil | Pass |
| INT-TC54 | I-23 | Normal: cek status verifikasi mitra | `GET /status-verifikasi?username=ami` saat status mitra di basis data `menunggu` | Halaman status menampilkan langkah "Admin sedang memeriksa dokumenmu" dan "Hasil verifikasi belum tersedia." | Status 200; kedua teks tampil sesuai status di basis data | Pass |
| INT-TC55 | I-23 | Gagal: username mitra tidak terdaftar | `GET /status-verifikasi?username=tidak_ada` | Redirect ke `/login` dengan pesan "Username mitra tidak ditemukan." | Redirect 302 ke `/login`; pesan tampil | Pass |
| INT-TC56 | I-24 | Normal: dashboard mitra | Hitung jumlah sesi `menunggu` dan saldo mitra `ami` di basis data, lalu `GET /mitra` | Sapaan nama mitra; jumlah permintaan menunggu dan saldo sama dengan basis data | Status 200; "Halo, Ami Pengacara!", jumlah permintaan menunggu, dan saldo sesuai basis data | Pass |
| INT-TC57 | I-24 | Gagal: akun masyarakat membuka dashboard mitra | `GET /mitra` dengan sesi login `sisi` | Akses ditolak (403) "Akses ditolak" | Status 403, pesan tampil | Pass |
 
Hasil: 57 test case integrasi dijalankan pada 24 antarmuka, 55 Pass dan 2 Fail (INT-TC33 dan INT-TC38). 

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case Melakukan Registrasi Akun bagi Masyarakat

**ID Use Case:** UC01  
**Nama Use Case:** Melakukan Registrasi Akun bagi Masyarakat

**Tabel 4.4.1. Hasil Pengujian Use Case UC01**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC01-TC01 | KF01 | Normal | 1. Buka halaman registrasi Masyarakat. 2. Isi seluruh field wajib dengan data valid. 3. Klik tombol Daftar. | Nama: Raya Medina Farrelin; email: raya.test@lawhub.com ; username: rayalawhub; password: testRayalawhub; nomor HP: 081234567801 | Sistem memvalidasi data, membuat akun Masyarakat, lalu mengarahkan pengguna ke halaman pengguna.  |Sistem memvalidasi data, membuat akun Masyarakat, lalu mengarahkan pengguna ke login masyarakat. | Pass |
| UC01-TC02 | KF01 | Alternatif 1: Registrasi gagal |1. Buka halaman registrasi Masyarakat. 2. Isi formulir menggunakan email yang sudah terdaftar, lalu klik Daftar.  | Nama: Raya Medina Farrelin; email: raya.test@lawhub.com ; username: rayahub; password: 123 nomor HP: 081234567801 | Sistem menolak registrasi, menampilkan pesan email sudah terdaftar dan meminta pengguna memperbaiki input. | Sistem menolak registrasi, menampilkan pesan email sudah terdaftar dan meminta pengguna memperbaiki input. | Pass |

### 4.4.2 Use Case Melakukan Login bagi Masyarakat

**ID Use Case:** UC02  
**Nama Use Case:** Melakukan Login bagi Masyarakat

**Tabel 4.4.2. Hasil Pengujian Use Case UC02**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC02-TC01 | KF01, KF02 | Normal |1. Buka halaman login Masyarakat. 2. Masukkan email dan password akun Masyarakat yang sudah terdaftar. 3. Klik Login.  | email: raya.test@lawhub.com; password : testRayalawhub | Sistem memvalidasi kredensial dan mengarahkan Masyarakat ke halaman utama yang menyediakan pilihan SearchLaw dan HaloLaw.  | Sistem memvalidasi kredensial dan mengarahkan Masyarakat ke halaman utama yang menyediakan pilihan SearchLaw dan HaloLaw.  | Pass |
| UC02-TC02 | KF01, KF02 | Alternatif 1: Kredensial salah |1. Buka halaman login Masyarakat. 2. Masukkan email terdaftar dengan password yang salah. 3. Klik Login.  | email: raya.test@lawhub.com; password : testAmilawhub | Sistem menolak login dan menampilkan pesan kombinasi username/password salah pada form login. | Sistem menolak login dan menampilkan pesan kombinasi username/password salah pada form login, namun terdapat beberapa bug UI diaman error muncul kedalam dua container | Pass, namun terdapat beberapa bug UI|
| UC02-TC03 | KF01, KF02 | Alternatif 2: Akun tidak terdaftar | 1. Buka halaman login Masyarakat.2. Masukkan email yang belum pernah didaftarkan. 3. Klik Login.  | Email: unknown@example.com; password: LawHubTest#2026  | Sistem menampilkan pesan akun tidak ditemukan serta pilihan untuk mengedit input atau menuju halaman registrasi.  | Sistem hanya menampilkan pesan email atau kata sandi salah tanpa opsi menuju ke halaman registrasi | Fail |

### 4.4.3 Use Case Melakukan Registrasi Akun bagi Mitra Pengacara

**ID Use Case:** UC03  
**Nama Use Case:** Melakukan Registrasi Akun bagi Mitra Pengacara

**Tabel 4.4.3. Hasil Pengujian Use Case UC03**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC03-TC01 | KF03 | Normal | 1. Buka halaman registrasi Mitra. 2. Isi data diri/firma dan seluruh field wajib. 3. Unggah dokumen legalitas dengan format yang diterima aplikasi. 4. Klik Submit/Daftar. | nama :Budi Mitra Pengacara; email:budi.mitra@lawhub.com; username: BudiMitra; password: testBudilawhub; nama firma: Budi Jaya Makmur; dokumen: berkas PDF/JPG valid sesuai field aplikasi. | Sistem memvalidasi dan menyimpan data, membuat akun berstatus pending, serta menampilkan notifikasi bahwa pengajuan menunggu persetujuan admin.  | Sistem memvalidasi dan menyimpan data, serta menampilkan notifikasi bahwa pengajuan menunggu persetujuan admin.  | Pass |
| UC03-TC02 | KF03 | Alternatif 1: Gagal submit | 1. Buka halaman registrasi Mitra. 2. Kosongkan salah satu field wajib atau masukkan format data tidak valid. 3. Klik Submit/Daftar.  | Sistem menolak pengajuan dan menampilkan pesan pada field yang bermasalah agar diperbaiki.  | Sistem menolak pengajuan dan menampilkan pesan pada field yang bermasalah agar diperbaiki.| Pass |

### 4.4.4 Use Case Melakukan Login bagi Mitra Pengacara

**ID Use Case:** UC04  
**Nama Use Case:** Melakukan Login bagi Mitra Pengacara

**Tabel 4.4.4. Hasil Pengujian Use Case UC04**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC04-TC01 | KF03 | Normal | 1. Buka halaman login Mitra. 2. Masukkan kredensial akun Mitra yang sudah berstatus approved.3. Klik Login. | email: 'ami@lawhub.test', password: ami657 | Sistem memvalidasi kredensial dan mengarahkan Mitra ke halaman utama Mitra.  | Sistem memvalidasi kredensial dan mengarahkan Mitra ke Beranda Mitra | Pass |
| UC04-TC02 | KF03 | Alternatif 1: Kredensial Salah |1. Buka halaman login Mitra.2. Masukkan email akun Mitra yang terdaftar dengan password salah.3. Klik Login.  | email: 'ami@lawhub.test', password: ami123 | Sistem menolak login dan menampilkan pesan kombinasi username/password salah.  | Sistem menolak login dan menampilkan pesan kombinasi username/password salah pada form login, namun terdapat beberapa bug UI diaman error muncul kedalam dua container | Pass, ada bug di UI  |
| UC04-TC03 | KF03 | Alternatif 2: Akun tidak terdaftar |1. Buka halaman login Mitra.2. Masukkan email yang belum terdaftar.3. Klik Login dan amati pilihan yang muncul. | email: raya.mitra@lawhub.com password: raya123 | Sistem menampilkan pesan akun tidak ditemukan serta opsi mengedit input atau menuju halaman registrasi Mitra.  | Sistem hanya menampilkan pesan email atau kata sandi salah tanpa opsi menuju ke halaman registrasi  | Fail |
| UC04-TC04 | KF03 | Alternatif 3: Akun mitra belum/gagal terverifikasi | 1. Pastikan tersedia akun Mitra berstatus pending atau rejected.2. Buka halaman login Mitra.3. Masukkan kredensial akun tersebut.4. Klik Login.  | email:budi.mitra@lawhub.com; password:password: testBudilawhub | Sistem menolak akses, menampilkan informasi bahwa akun belum/tidak terverifikasi, dan mengarahkan pengguna kembali ke halaman login atau status registrasi. | Sistem hanya menampilkan pesan email atau kata sandi salah tanpa keterangan status  | Fail 
### 4.4.5 Use Case Melihat Status Registrasi Akun Mitra Pengacara

**ID Use Case:** UC05  
**Nama Use Case:** Melihat Status Registrasi Akun Mitra Pengacara

**Tabel 4.4.5. Hasil Pengujian Use Case UC05**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC05-TC01 | KF04 | Normal | 1. Buka halaman status registrasi/verifikasi Mitra.2. Masukkan atau akses akun Mitra yang pernah mendaftar.3. Periksa status yang ditampilkan.  | username: BudiMitra | Sistem menampilkan status verifikasi akun sesuai kondisi pengajuan: pending, approved, atau rejected |SIstem menampilkan tahapan pengajuan dokumen | Pass |
| UC05-TC02 | KF04 | Alternatif 1: Belum pernah mengajukan pendaftaran | 1. Buka halaman status registrasi Mitra menggunakan akun/email yang belum pernah mengajukan pendaftaran.2. Amati respons sistem.  | username: rayaMasyarakat | Sistem memberi informasi bahwa belum ada pengajuan registrasi.  | Sistem menampilkan warning sign bahwa username belum ditemukan/diajukan | Pass|
### 4.4.6 Use Case Memverifikasi Pendaftar Mitra Pengacara

**ID Use Case:** UC06  
**Nama Use Case:** Memverifikasi Pendaftar Mitra Pengacara

**Tabel 4.4.6. Hasil Pengujian Use Case UC06**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC06-TC01 | KF05 | Normal | 1. Login sebagai Admin.2. Buka menu verifikasi Mitra.3. Pilih pengajuan berstatus pending.4. Periksa detail data dan dokumen.5. Setujui pengajuan.  | Akun Mitra berstatus pending dengan dokumen lengkap dan valid; keputusan: approve.  | Sistem mengubah status Mitra menjadi approved dan mengirim/menampilkan notifikasi persetujuan. | Admin dapat memverifikasi dan melihat dokumen ajuan mitra | Pass |
| UC06-TC02 | KF05 | Alternatif 1: Admin meminta penambahan/revisi dokumen | 1. Login sebagai Admin.2. Buka pengajuan Mitra berstatus pending.3. Pilih tindakan meminta revisi/tambahan dokumen.4. Isi catatan revisi dan kirim. | Akun Mitra berstatus pending dengan dokumen lengkap dan kurang valid; keputusan:tolak. | Sistem mengubah status pengajuan menjadi status revisi/wajib perbaikan dan menyampaikan catatan revisi kepada Mitra.  | Admin dapat memberikan catatan dan muncul di rincian registarsi mitra | Pass |
| UC06-TC03 | KF05 | Alternatif 2: Dokumen tidak memenuhi syarat atau terindikasi pelanggaran | 1. Login sebagai Admin.2. Buka pengajuan Mitra pending dengan dokumen uji yang tidak valid/kedaluwarsa.3. Pilih tindakan menolak pengajuan.4. Masukkan alasan penolakan. | Akun Mitra berstatus pending dengan dokumen lengkap dan kurang valid; keputusan:tolak. | Sistem mengubah status pengajuan menjadi status revisi/wajib perbaikan dan menyampaikan catatan revisi kepada Mitra.  | Admin dapat memberikan catatan dan muncul di rincian registarsi mitra | Pass |
### 4.4.7 Use Case Verifikasi Akun Pengacara

**ID Use Case:** UC07  
**Nama Use Case:** Verifikasi Akun Pengacara

**Tabel 4.4.7. Hasil Pengujian Use Case UC07**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC07-TC01 | KF06, KF07 | Normal |1. Login sebagai Mitra.2. Buka halaman Edit Profil Firma.3. Periksa data profil dan dokumen yang tampil.4. Ubah deskripsi/tag profil lalu simpan.5. Jika tersedia, unggah/perbarui dokumen legalitas dan simpan.  | Deskripsi baru: Firma Bima memberikan layanan konsultasi hukum keluarga dan perdata; tag: Hukum Keluarga; dokumen: PDF/JPG valid bila diuji. | Sistem menampilkan data profil saat ini. Perubahan profil non-dokumen tersimpan; jika dokumen diperbarui, dokumen tersimpan dan status verifikasi dokumen kembali pending.  | Sistem menampilkan data profil saat ini. Perubahan profil non-dokumen tersimpan; jika dokumen diperbarui, dokumen tersimpan namun status verifikasi tidak berubah | Pass |

### 4.4.8 Use Case Melakukan Pencarian Pasal

**ID Use Case:** UC08  
**Nama Use Case:** Melakukan Pencarian Pasal

**Tabel 4.4.8. Hasil Pengujian Use Case UC08**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC08-TC01 | KF08 | Normal | 1. Login sebagai Masyarakat.2. Buka fitur SearchLaw.3. Masukkan minimal satu kata kunci.4. Tekan tombol Cari.  | keyword: permenkominfo | Sistem menampilkan daftar pasal yang relevan dengan kata kunci pencarian.  | Sistem menampilkan daftar pasal yang relevan dengan kata kunci pencarian.  | Pass |
| UC08-TC02 | KF08 | Alternatif 1: Tidak ada pasal yang sesuai |1. Buka fitur SearchLaw.2. Masukkan kata kunci acak yang tidak terdapat pada data pasal.3. Tekan Cari.  | keyword: narkoba | Sistem menampilkan pesan bahwa tidak ditemukan pasal yang sesuai dan menyarankan kata kunci lain.  |Sistem menampilkan pesan bahwa tidak ditemukan pasal yang sesuai dan menyarankan kata kunci lain. | Pass |
### 4.4.9 Use Case Melihat Daftar Pengacara

**ID Use Case:** UC09  
**Nama Use Case:** Melihat Daftar Pengacara

**Tabel 4.4.9. Hasil Pengujian Use Case UC09**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC09-TC01 | KF09 | Normal | 1. Login sebagai Masyarakat.2. Buka fitur HaloLaw/pencarian Mitra.3. Masukkan kata kunci kasus dan/atau pilih filter yang tersedia.4. Jalankan pencarian.  | Tag: Hukum Pidana|Sistem menampilkan daftar profil Mitra yang sesuai dengan kata kunci atau filter yang dipilih. | Sistem menampilkan daftar profil Mitra yang sesuai dengan kata kunci atau filter yang dipilih.  | Pass |
| UC09-TC02 | KF09 | Alternatif 1: Tidak ada mitra yang sesuai filter dan/atau keyword | 1. Buka fitur pencarian Mitra.2. Masukkan kata kunci atau kombinasi filter yang tidak cocok dengan Mitra mana pun.3. Jalankan pencarian. | tag Hukum perdata dan Hukum Administrasi negara | Sistem menampilkan pesan tidak ada Mitra Pengacara yang sesuai dan menyarankan perubahan/penghapusan filter atau kata kunci lain. | Sistem menampilkan pesan tidak ada Mitra Pengacara yang sesuai dan menyarankan perubahan/penghapusan filter atau kata kunci lain.  | Pass |
### 4.4.10 Use Case Memilih Mitra Pengacara untuk Sesi Konsultasi

**ID Use Case:** UC10  
**Nama Use Case:** Memilih Mitra Pengacara untuk Sesi Konsultasi

**Tabel 4.4.10. Hasil Pengujian Use Case UC10**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC10-TC01 | KF09 | Normal |1. Login sebagai Masyarakat.2. Cari dan pilih salah satu Mitra.3. Lihat jadwal ketersediaan.4. Pilih slot kosong.5. Isi ringkasan kasus jika diminta dan konfirmasi permintaan konsultasi.  | Deskripsi kasus dengan tag Hukum pidana | Sistem mengunci slot sementara, membuat permintaan konsultasi berstatus menunggu tanggapan Mitra, dan mengirim notifikasi/permintaan kepada Mitra.  | Sistem membuat permintaan konsultasi berstatus menunggu tanggapan Mitra, dan mengirim notifikasi/permintaan kepada Mitra | Pass |
| UC10-TC02 | KF09 | Alternatif 1: Semua jadwal penuh atau tidak sesuai kebutuhan masyarakat | 1. Login sebagai Masyarakat.2. Pilih Mitra yang seluruh slot jadwalnya penuh/tidak sesuai.3. Periksa respons halaman jadwal.  | Mitra: Mitra dengan seluruh slot penuh; atau gunakan data uji jadwal penuh. | Sistem menampilkan informasi bahwa tidak ada jadwal tersedia |Sistem menampilkan informasi bahwa tidak ada jadwal tersedia | Pass|
### 4.4.11 Use Case Menanggapi Sesi Konsultasi

**ID Use Case:** UC11  
**Nama Use Case:** Menanggapi Sesi Konsultasi

**Tabel 4.4.11. Hasil Pengujian Use Case UC11**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC11-TC01 | KF10 | Normal |1. Login sebagai Mitra yang menerima permintaan konsultasi.2. Buka daftar/notifikasi pengajuan konsultasi.3. Buka detail permintaan.4. Pilih Terima/Accept.  | Permintaan konsultasi berstatus menunggu tanggapan; keputusan: Terima.  | Sistem mengubah status sesi menjadi terjadwal, mempertahankan slot jadwal, dan mengirim konfirmasi kepada Masyarakat. | Sistem mengubah status sesi menjadi terjadwal, mempertahankan slot jadwal, dan mengirim konfirmasi kepada Masyarakat.  | Pass |
| UC11-TC02 | KF10 | Alternatif 1: Mitra menolak permintaan konsultasi |1. Login sebagai Mitra.2. Buka detail permintaan konsultasi yang menunggu tanggapan.3. Pilih Tolak/Reject.  | Permintaan konsultasi pending; keputusan: Tolak.  | Sistem membatalkan permintaan. | Sistem membatalkan permintaan.  | Pass  |
| UC11-TC03 | KF10 | Alternatif 2: Mitra tidak merespon dalam waktu tertentu | [Isi langkah pengujian sesuai skenario SKPL] | [Isi data uji] | [Isi reaksi sistem yang diharapkan sesuai SKPL] | [Isi hasil aktual setelah diuji] | [Pass/Fail] |

### 4.4.12 Use Case Melakukan Sesi Konsultasi

**ID Use Case:** UC12  
**Nama Use Case:** Melakukan Sesi Konsultasi

**Tabel 4.4.12. Hasil Pengujian Use Case UC12**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC12-TC01 | KF11 | Normal | 1. Pastikan permintaan konsultasi diterima dan pembayaran telah lunas jika aplikasi mensyaratkannya.2. Login sebagai Masyarakat dan Mitra pada dua browser/sesi berbeda.3. Buka ruang chat pada jadwal yang disepakati.4. Kirim pesan dari kedua pihak.5. Akhiri sesi melalui kontrol yang tersedia. | Pesan Masyarakat: Selamat siang, saya ingin berkonsultasi mengenai kasus saya.; pesan Mitra: Baik, silakan jelaskan kronologiny  | Sistem membuka sesi chat, mencatat waktu mulai, mengirim dan menyimpan pesan secara real-time, lalu menutup sesi dan mengubah status menjadi selesai ketika diakhiri.  | pembayaran gagal sehingga tidak bisa melakukan konsultasi | fail  |
| UC12-TC02 | KF11 | Alternatif 1: Sesi terputus/salah satu pihak tidak merespon | 1. Mulai sesi chat yang valid.2. Putuskan koneksi salah satu pihak atau biarkan tidak ada aktivitas.3. Amati status pada pihak yang masih aktif dan tunggu batas waktu sistem. |Kondisi uji: koneksi salah satu browser diputus / tidak mengirim pesan hingga melewati batas waktu.  |Sistem menampilkan status sesi tertunda/terputus dan menutup sesi otomatis jika batas waktu maksimum tercapai.  | fail | fail |

### 4.4.13 Use Case Memberi Ulasan, Feedback, dan/atau Rating

**ID Use Case:** UC13  
**Nama Use Case:** Memberi Ulasan, Feedback, dan/atau Rating

**Tabel 4.4.13. Hasil Pengujian Use Case UC13**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC13-TC01 | KF12 | Normal | 1. Login sebagai Masyarakat yang memiliki sesi konsultasi selesai.2. Buka halaman/formulir ulasan.3. Isi rating dan teks ulasan; lampirkan foto bila ingin menguji unggahan.4. Kirim ulasan. | - | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim. | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim. | Fail |
| UC13-TC02 | KF12 | Alternatif 1: Gagal mengirim ulasan | 1. Buka formulir lapor pelanggaran sebagai Masyarakat.2. Kosongkan kategori atau deskripsi.3. Klik Kirim. | Kategori: kosong; deskripsi: kosong  | Sistem menolak laporan dan menampilkan pesan bahwa field wajib harus dilengkapi. |  Karena pembayaran gagal tidak mengakses riwayat dan tidak bisa mensubmit ulasan | Fail |

### 4.4.14 Use Case Melaporkan Pelanggaran (Masyarakat)

**ID Use Case:** UC14  
**Nama Use Case:** Melaporkan Pelanggaran (Masyarakat)

**Tabel 4.4.14. Hasil Pengujian Use Case UC14**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC14-TC01 | KF13 | Normal | 1. Login sebagai Masyarakat yang memiliki sesi konsultasi terkait.2. Buka fitur lapor pelanggaran pada sesi tersebut. 3. Pilih kategori pelanggaran dan isi deskripsi.4. Lampirkan bukti bila tersedia.5. Kirim laporan.  | Kategori: Perilaku tidak profesional; deskripsi: Mitra mengirim pesan yang tidak berkaitan dengan konsultasi.; bukti: gambar/screenshot uji (jika field tersedia).  | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim.  | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim.  | Pass |
| UC14-TC02 | KF13 | Alternatif 1: Formulir laporan tidak lengkap |1. Buka formulir lapor pelanggaran sebagai Masyarakat.2. Kosongkan kategori atau deskripsi.3. Klik Kirim.  | Kategori: kosong; | Sistem menolak laporan dan menampilkan pesan bahwa field wajib harus dilengkapi.  |Sistem menolak laporan dan menampilkan pesan bahwa field wajib harus dilengkapi.  | Pass |

### 4.4.15 Use Case Melaporkan Pelanggaran (Mitra Pengacara)

**ID Use Case:** UC15  
**Nama Use Case:** Melaporkan Pelanggaran (Mitra Pengacara)

**Tabel 4.4.15. Hasil Pengujian Use Case UC15**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC15-TC01 | KF13 | Normal | 1. Login sebagai Mitra yang memiliki sesi konsultasi terkait.2. Buka fitur lapor pelanggaran pada sesi tersebut3. Pilih kategori dan isi deskripsi pelanggaran oleh Masyarakat.4. Lampirkan bukti bila tersedia.5. Kirim laporan.  | Kategori: Perilaku tidak pantas; deskripsi: Pengguna mengirim pesan yang mengandung ancaman.;  | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim.  | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim. | Pass  |
| UC15-TC02 | KF13 | Alternatif 1: Formulir laporan tidak lengkap |1. Buka formulir lapor pelanggaran sebagai Masyarakat.2. Kosongkan kategori atau deskripsi.3. Klik Kirim.  | Kategori: kosong; | Sistem menolak laporan dan menampilkan pesan bahwa field wajib harus dilengkapi.  |Sistem menolak laporan dan menampilkan pesan bahwa field wajib harus dilengkapi.  | Pass |

### 4.4.16 Use Case Melaporkan Ulasan

**ID Use Case:** UC16  
**Nama Use Case:** Melaporkan Ulasan

**Tabel 4.4.16. Hasil Pengujian Use Case UC16**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC16-TC01 | KF14 | Normal | 1. Login sebagai Mitra.2. Buka profil Mitra dan pilih ulasan yang akan dilaporkan3. Buka formulir laporan ulasan.4. Pilih alasan dan isi keterangan.5. Kirim laporan.  | Alasan: Ulasan tidak relevan; keterangan: Isi ulasan tidak berkaitan dengan sesi konsultasi yang dilakukan.  | Sistem menyimpan laporan berstatus menunggu tinjauan Admin dan menampilkan notifikasi laporan berhasil dikirim. | Karena  ulasan tidak bisa diberikan maka laporan ulasan tidak bisa diakses | Fail |
| UC16-TC02 | KF14 | Alternatif 1: Formulir laporan tidak lengkap | 1. Buka formulir laporan ulasan.2. Kosongkan alasan atau keterangan wajib.3. Klik Kirim.  | Alasan: kosong; keterangan: kosong.  | Sistem menampilkan pesan kesalahan dan meminta Mitra melengkapi formulir.  | Karena  ulasan tidak bisa diberikan maka laporan ulasan tidak bisa diakses | Fail |


### 4.4.17 Use Case Memblokir Akun

**ID Use Case:** UC17  
**Nama Use Case:** Memblokir Akun

**Tabel 4.4.17. Hasil Pengujian Use Case UC17**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC17-TC01 | KF15, KF16 | Normal |1. Login sebagai Admin.2. Buka daftar laporan masuk.3. Pilih laporan dan periksa detail/bukti.4. Nyatakan laporan valid dan pilih tindakan blokir akun.5. Konfirmasi tindakan. | Laporan uji yang valid; akun terlapor: akun dummy Masyarakat/Mitra; keputusan: setujui laporan dan blokir.  | Sistem memblokir akun terlapor, mengubah status akun menjadi diblokir, dan memberi notifikasi kepada akun terkait. Akun terblokir tidak dapat mengakses sistem.  | Sistem memblokir akun terlapor, mengubah status akun menjadi diblokir, dan memberi notifikasi kepada akun terkait. Akun terblokir tidak dapat mengakses sistem.| Pass\|
| UC17-TC02 | KF15, KF16 | Alternatif 1: Laporan tidak disetujui admin |1. Login sebagai Admin.2. Buka laporan masuk.3. Periksa detail laporan.4. Pilih tindakan menolak laporan/tidak memblokir akun. | Laporan uji dengan bukti tidak cukup; keputusan: tolak laporan.  | Sistem menutup laporan dengan status ditolak, tidak memblokir akun terlapor, dan memberi notifikasi hasil tinjauan kepada pelapor. | Sistem menutup laporan dengan status ditolak, tidak memblokir akun terlapor, dan memberi notifikasi hasil tinjauan kepada pelapor. | Pass  |

### 4.4.18 Use Case Melihat Riwayat Penanganan

**ID Use Case:** UC18  
**Nama Use Case:** Melihat Riwayat Penanganan

**Tabel 4.4.18. Hasil Pengujian Use Case UC18**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC18-TC01 | KF17 | Normal |1. Login sebagai Masyarakat.2. Buka fitur Live Chat.3. Ketik pertanyaan mengenai kendala teknis.4. Kirim pesan dan amati ruang chat. | Pesan: Saya mengalami kendala saat membuka halaman konsultasi. Mohon bantuannya. | Sistem meneruskan pesan ke Admin dan menampilkan percakapan/pesan pada Live Chat.  | [Isi hasil aktual setelah diuji] | [Pass/Fail] |
| UC18-TC02 | KF17 | Alternatif 1: Riwayat kosong | [Isi langkah pengujian sesuai skenario SKPL] | [Isi data uji] | [Isi reaksi sistem yang diharapkan sesuai SKPL] | [Isi hasil aktual setelah diuji] | [Pass/Fail] |

### 4.4.19 Use Case Menanyakan Masalah Teknis

**ID Use Case:** UC19  
**Nama Use Case:** Menanyakan Masalah Teknis

**Tabel 4.4.19. Hasil Pengujian Use Case UC19**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC19-TC01 | KF18 | Normal | 1. Login sebagai Masyarakat.2. Buka fitur Live Chat.3. Ketik pertanyaan mengenai kendala teknis.4. Kirim pesan dan amati ruang chat. | Pesan: Saya mengalami kendala saat membuka halaman konsultasi. Mohon bantuannya. | Sistem meneruskan pesan ke Admin dan menampilkan percakapan/pesan pada Live Chat.  | Sistem meneruskan pesan ke Admin dan menampilkan percakapan/pesan pada Live Chat. | Pass  | 

### 4.4.20 Use Case Menjawab Pertanyaan

**ID Use Case:** UC20  
**Nama Use Case:** Menjawab Pertanyaan

**Tabel 4.4.20. Hasil Pengujian Use Case UC20**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC20-TC01 | KF18 | Normal | 1. Pastikan Masyarakat telah mengirim pesan melalui Live Chat.2. Login sebagai Admin.3. Buka halaman Live Chat Admin dan pilih percakapan Masyarakat.4. Ketik jawaban dan kirim.5. Periksa tampilan pada sisi Masyarakat. | Pertanyaan Masyarakat: Saya mengalami kendala saat membuka halaman konsultasi.; jawaban Admin: Silakan muat ulang halaman dan coba masuk kembali. | Sistem mengirim jawaban Admin dan menampilkannya pada Live Chat Masyarakat secara real-time. | Sistem mengirim jawaban Admin dan menampilkannya pada Live Chat Masyarakat secara real-time. | Pass 


### 4.4.21 Use Case Membayar Biaya Sesi Konsultasi

**ID Use Case:** UC21  
**Nama Use Case:** Membayar Biaya Sesi Konsultasi

**Tabel 4.4.21. Hasil Pengujian Use Case UC21**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC21-TC01 | KF19 | Normal | 1. Login sebagai Masyarakat yang memiliki tagihan konsultasi.2. Buka ringkasan tagihan3. Pilih salah satu metode pembayaran digital yang tersedia.4. Lanjutkan ke halaman konfirmasi/payment gateway.5. Selesaikan pembayaran menggunakan alur sandbox jika tersedia.|Tagihan konsultasi yang belum lunas; metode: salah satu metode yang tersedia; transaksi: simulasi sukses/sandbox. |Sistem menerima respons pembayaran berhasil, mengubah status tagihan menjadi lunas, dan menampilkan notifikasi pembayaran berhasil.  | Pembayaran gagal | Fail |


### 4.4.22 Use Case Mencairkan Dana

**ID Use Case:** UC22  
**Nama Use Case:** Mencairkan Dana

**Tabel 4.4.22. Hasil Pengujian Use Case UC22**

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
|---|---|---|---|---|---|---|---|
| UC22-TC01 | KF20 | Normal | 1. Login sebagai Mitra yang memiliki saldo hasil pembayaran.2. Buka halaman dana/riwayat pembayaran yang diterima.3. Pilih opsi pencairan dana.4. Masukkan jumlah pencairan yang tidak melebihi saldo.5. Konfirmasi pengajuan pencairan.| Saldo tersedia: gunakan saldo akun uji; jumlah pencairan: Rp10.000 (atau nominal lebih kecil dari saldo); rekening tujuan: rekening dummy yang terdaftar pada akun uji.| Sistem menerima pengajuan pencairan, memprosesnya, dan menampilkan notifikasi pencairan berhasil/berhasil diajukan sesuai implementasi.  | Sistem menerima pengajuan pencairan, memprosesnya, dan menampilkan notifikasi pencairan berhasil/berhasil diajukan sesuai implementasi | Pass  |
| UC22-TC02 | KF20 | Alternatif 1: Pencairan ditolak | 1. Login sebagai Mitra yang memiliki saldo.2. Buka halaman pencairan dana.3. Masukkan nominal pencairan yang lebih besar daripada saldo tersedia.4. Kirim pengajuan.| Saldo tersedia: misalnya Rp10.000; jumlah pencairan: Rp100.000. | Sistem menolak pengajuan dan menampilkan pesan bahwa dana yang ingin dicairkan melebihi saldo saat ini, lalu meminta Mitra memasukkan nominal lain.| Sistem menolak pengajuan dan menampilkan pesan bahwa dana yang ingin dicairkan melebihi saldo saat ini, lalu meminta Mitra memasukkan nominal lain.|   Pass |


### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF01-TC01 | KNF01 | Response Time | Beranda dan riwayat tampil ≤ 2 detik setelah login | Chrome DevTools (Network, Disable cache) dan script knf-ukur.js, 5 kali ukur, ambil rata-rata | Rata-rata 0,082 detik, maks 0,116 detik | Pass |
| KNF02-TC01 | KNF02 | Response Time | Verifikasi mitra oleh admin ≤ 3 hari | Bandingkan waktuUnggah dokumen di DB dengan waktu admin memutuskan (dicatat dari screenshot halaman admin) | Sistem hanya menyimpan waktuUnggah. Waktu keputusan verifikasi tidak dicatat dan tidak ada pengingat batas 3 hari | Fail |
| KNF03-TC01 | KNF03 | Security | Dokumen legalitas tersimpan terenkripsi AES-256 | Inspeksi isi folder uploads/ (head -c 8), akses langsung URL /uploads/ tanpa login, dan inspeksi kode unggah (grep createCipheriv) | Enkripsi AES hanya ditemukan pada modul chat (SesiKonsultasi.js:175); kode unggah dokumen tidak mengenkripsi berkas | Fail |
| KNF04-TC01 | KNF04 | Response Time | Simpan dan tampil profil ≤ 3 detik | Chrome DevTools (Network, Disable cache) dan script knf-ukur.js, 5 kali ukur, ambil rata-rata | Rata-rata 0,013 detik, maks 0,028 detik | Pass | 
| KNF05-TC01 | KNF05 | Reliability | Pencarian diurutkan dengan ranking relevansi dan menampilkan semua hasil terkait | Inspeksi kode query SearchLaw, uji beberapa kata kunci, dan bandingkan jumlah hasil dengan SELECT COUNT(*) di DB | Query memakai LIKE di 5 kolom lalu ORDER BY tahun DESC, tanpa skor relevansi. Semua baris yang cocok memang ditampilkan (tanpa LIMIT) | Fail |
| KNF06-TC01 | KNF06 | Response Time | Hasil pencarian tampil ≤ 3 detik | Chrome DevTools (Network, Disable cache) dan script knf-ukur.js, 5 kali ukur dengan kata kunci berbeda, ambil rata-rata | Rata-rata 0,003 detik, maks 0,003 detik | Pass |
| KNF07-TC01 | KNF07 | Reliability | Sortir mitra memakai quick sort atau merge sort | Inspeksi kode (grep quick/merge dan potongan MitraPengacara.cari) dan uji hasil filter di /halolaw/mitra | Tidak ditemukan implementasi quick sort/merge sort; sortir mitra memakai ORDER BY pada query SQL (MitraPengacara.cari) | Fail |
| KNF08-TC01 | KNF08 | Response Time | Sortir dan filter mitra ≤ 3 detik | Chrome DevTools (Network, Disable cache) dan script knf-ukur.js, 5 kali ukur, ambil rata-rata | Halaman daftar mitra gagal ditampilkan dan menghasilkan HTTP 500 karena Controller tidak mengirimkan variabel kasus yang dibutuhkan oleh View EJS, sehingga terjadi error kasus is not defined | Fail |
| KNF09-TC01 | KNF09 | Ergonomy | Chat tanpa hambatan visualisasi | Uji manual dua akun (masyarakat dan mitra) di dua browser, tampilan desktop dan mode mobile (DevTools device toolbar) | Klien memanggil io('/konsultasi'), tetapi socket/konsultasi.js tidak pernah di-require di server.js. Namespace tidak terdaftar, jadi pesan tidak terkirim | Fail |
| KNF10-TC01 | KNF10 | Security | Percakapan terenkripsi end-to-end | Inspeksi kode, isi kolom isiPesan di tabel PesanChat (DB Browser for SQLite), dan frame WebSocket di DevTools | Pesan konsultasi dienkripsi AES-256-GCM sebelum disimpan, tapi kuncinya di server (CHAT_KEY atau SESSION_SECRET) dan pesan dikirim ke klien sebagai plaintext. Ini enkripsi at-rest, bukan end-to-end. Pesan live chat admin tidak dienkripsi | Fail |
| KNF11-TC01 | KNF11 | Availability | Fitur HaloLaw dan interaksi dengan mitra bisa diakses 24 jam | Pemantauan akses berkala dengan curl di beberapa jam berbeda, dan coba membuat pengajuan konsultasi di luar jam kerja | Halaman HaloLaw, daftar mitra, dan booking tidak dibatasi jam. Chat dibatasi jadwal sesi (izinChat) dan saat ini tidak berfungsi (lihat KNF09) | Fail |
| KNF12-TC01 | KNF12 | Availability | Mitra bisa menanggapi klien 24 jam | Uji menanggapi pengajuan di /konsultasi/pengajuan pada dua waktu berbeda (siang dan malam) dan inspeksi kode pembatasan jam | Route /konsultasi/konfirmasi/:idSesi tidak punya batas jam. Batas 30 menit hanya untuk pembatalan otomatis pengajuan | Pass |
| KNF13-TC01 | KNF13 | Availability | Pengajuan komunikasi lanjutan tersedia selama sesi aktif | Cari fitur di UI dan kode, uji chat pada sesi aktif dan sesi selesai | Tidak ditemukan fitur atau route “komunikasi lanjutan” | Fail |
| KNF14-TC01 | KNF14 | Reliability | Ulasan diperiksa regex untuk kata tidak pantas | Kirim ulasan berisi kata kasar (variasi huruf besar/kecil) dan ulasan normal, inspeksi kode UlasanController | UlasanController hanya memvalidasi skor 1–5 dan panjang ≤ 1000 karakter. Tidak ada regex atau filter kata | Fail |
| KNF15-TC01 | KNF15 | Security | Data pelapor hanya diketahui admin | Login sebagai terlapor dan cek halaman yang terbuka, bandingkan dengan tampilan admin | Nama dan email pelapor hanya ada di /admin/laporan yang dilindungi wajibAdmin. Tidak ada halaman laporan untuk terlapor | Pass |
| KNF16-TC01 | KNF16 | Response Time | Laporan pelanggaran diproses ≤ 3 hari | Bandingkan tanggalLaporan di DB dengan waktu admin meninjau (dicatat dari screenshot halaman admin) | Tabel Laporan hanya menyimpan tanggalLaporan. Tanggal peninjauan tidak dicatat dan tidak ada pengingat | Fail |
| KNF17-TC01 | KNF17 | Security | Data pelapor hanya diketahui admin | Akses /admin/laporan dengan akun non-admin dan login sebagai terlapor untuk cek halaman yang terbuka | Hasil sama dengan KNF15 | Pass |
| KNF18-TC01 | KNF18 | Response Time | Tinjauan pelanggaran ≤ 3 hari | Bandingkan tanggalLaporan di DB dengan waktu admin meninjau (dicatat dari screenshot halaman admin) | Hasil sama dengan KNF16 | Fail |
| KNF19-TC01 | KNF19 | Security | Riwayat konsultasi terenkripsi AES-256 dan hanya diakses mitra | Buka riwayat dengan akun masyarakat, mitra, dan akun lain, serta cek isi kolom isiPesan di PesanChat | Enkripsi AES-256-GCM ada di SesiKonsultasi, tetapi Riwayat.pesanSesi membaca PesanChat mentah tanpa dekripsi, jadi halaman riwayat menampilkan teks enc:v1:.... Riwayat juga bisa dibuka masyarakat, bukan hanya mitra | Fail |
| KNF20-TC01 | KNF20 | Response Time | Live chat dibalas ≤ 5 menit pada jam operasional | Uji manual dua akun, hitung selisih waktuKirim pesan dan balasan di tabel PesanChat | Pesan masyarakat langsung terkirim  | |
| KNF21-TC01 | KNF21 | Constraint | Dokumen yang diunggah wajib aktif atau tidak kadaluarsa | Unggah dokumen lalu cek validasi di form dan skema tabel DokumenLegalitas | Pencarian kata kunci kedaluwarsa/kadaluarsa/masaBerlaku/expired pada seluruh kode (*.js dan *.sql, di luar node_modules) hanya menemukan validasi tanggal kedaluwarsa kartu pembayaran dan pembatalan otomatis pengajuan sesi. Tidak ditemukan validasi atau kolom masa berlaku untuk dokumen legalitas yang diunggah. Skema tabel DokumenLegalitas hanya memiliki kolom validitas (0/1) dan waktuUnggah | Fail |
| KNF22-TC01 | KNF22 | Constraint | Hasil pencarian hanya dari satu sumber data | Inspeksi kode SearchLaw, perbandingan dengan isi tabel Peraturan, dan tab Network (hanya request ke localhost) | Tidak ada pemanggilan sumber luar pada SearchLaw; query hanya ke tabel Peraturan di database | Pass |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| INT-TC01 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC01 Normal: registrasi masyarakat tersimpan di basis data dengan sandi ter-hash (90 ms)`. Hasil: **Pass**. |
| INT-TC02 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC02 Gagal: registrasi dengan email yang sudah terdaftar ditolak dan tidak menambah baris (6 ms)`. Hasil: **Pass**. |
| INT-TC03 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC03 Normal: registrasi mitra menyimpan akun berstatus menunggu, 4 dokumen, dan berkasnya (80 ms)`. Hasil: **Pass**. |
| INT-TC04 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC04 Gagal: registrasi mitra tanpa dokumen BAS ditolak, tidak ada akun, berkas unggahan dihapus (207 ms)`. Hasil: **Pass**. |
| INT-TC05 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC05 Normal: login masyarakat dengan kredensial benar membuat sesi dan membuka beranda (115 ms)`. Hasil: **Pass**. |
| INT-TC06 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC06 Gagal: login dengan kata sandi salah tidak membuat sesi (99 ms)`. Hasil: **Pass**. |
| INT-TC07 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC07 Gagal: akun mitra login di halaman masyarakat ditolak karena peran tidak sesuai (72 ms)`. Hasil: **Pass**. |
| INT-TC08 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC08 Gagal: akun yang diblokir saat masih login langsung kehilangan akses (75 ms)`. Hasil: **Pass**. |
| INT-TC09 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC09 Gagal: mitra yang belum terverifikasi tidak bisa membuka halaman pengajuan konsultasi (72 ms)`. Hasil: **Pass**. |
| INT-TC10 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC10 Gagal: penolakan tanpa catatan ditolak sistem, status mitra tidak berubah (2 ms)`. Hasil: **Pass**. |
| INT-TC11 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC11 Normal: admin memverifikasi mitra, status akun dan validitas dokumen diperbarui (3 ms)`. Hasil: **Pass**. |
| INT-TC12 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC12 Normal: mitra mengubah profil, data tersimpan di tabel MitraPengacara (2 ms)`. Hasil: **Pass**. |
| INT-TC13 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC13 Gagal: profil dengan deskripsi kosong ditolak, data lama tidak berubah (2 ms)`. Hasil: **Pass**. |
| INT-TC14 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC14 Normal: mitra menambah slot jadwal, baris baru tersimpan di JadwalKetersediaan (14 ms)`. Hasil: **Pass**. |
| INT-TC15 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC15 Gagal: slot yang bertumpuk dengan slot lain ditolak, tidak ada baris baru (8 ms)`. Hasil: **Pass**. |
| INT-TC16 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC16 Normal: unggah dokumen legalitas tersimpan (basis data dan berkas) dan status kembali menunggu (8 ms)`. Hasil: **Pass**. |
| INT-TC17 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC17 Gagal: unggah dokumen berformat .txt ditolak, tidak tersimpan, berkas dihapus (210 ms)`. Hasil: **Pass**. |
| INT-TC18 | `tests/integrasi/03-searchlaw-halolaw.test.js`: `✓ INT-TC18 Normal: pencarian dengan kata kunci mengembalikan peraturan yang tersimpan di basis data (7 ms)`. Hasil: **Pass**. |
| INT-TC19 | `tests/integrasi/03-searchlaw-halolaw.test.js`: `✓ INT-TC19 Gagal: kata kunci yang tidak cocok menampilkan pesan hasil kosong (2 ms)`. Hasil: **Pass**. |
| INT-TC20 | `tests/integrasi/03-searchlaw-halolaw.test.js`: `✓ INT-TC20 Normal: kasus tersimpan lalu daftar mitra difilter sesuai tag kasus (6 ms)`. Hasil: **Pass**. |
| INT-TC21 | `tests/integrasi/03-searchlaw-halolaw.test.js`: `✓ INT-TC21 Gagal: deskripsi kasus kurang dari 10 karakter ditolak dan tidak tersimpan (3 ms)`. Hasil: **Pass**. |
| INT-TC22 | `tests/integrasi/03-searchlaw-halolaw.test.js`: `✓ INT-TC22 Gagal: filter yang tidak dipenuhi mitra mana pun menampilkan pesan kosong (2 ms)`. Hasil: **Pass**. |
| INT-TC23 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC23 Normal: memilih slot kosong membuat sesi berstatus menunggu tanggapan mitra (21 ms)`. Hasil: **Pass**. |
| INT-TC24 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC24 Gagal: slot yang sudah dipesan orang lain ditolak (tidak terjadi dobel booking) (2 ms)`. Hasil: **Pass**. |
| INT-TC25 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC25 Gagal: penolakan tanpa catatan ditolak sistem, status sesi tidak berubah (2 ms)`. Hasil: **Pass**. |
| INT-TC26 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC26 Normal: mitra menerima permintaan, status sesi menjadi terjadwal (2 ms)`. Hasil: **Pass**. |
| INT-TC27 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC27 Gagal: permintaan yang sudah ditanggapi tidak bisa ditanggapi ulang (2 ms)`. Hasil: **Pass**. |
| INT-TC28 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC28 Normal: pesan terkirim real-time ke mitra dan tersimpan terenkripsi di basis data (383 ms)`. Hasil: **Pass**. |
| INT-TC29 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC29 Gagal: sesi yang belum lunas tidak bisa membuka chat dan pesan tidak tersimpan (5 ms)`. Hasil: **Pass**. |
| INT-TC30 | `tests/integrasi/04-konsultasi.test.js`: `✓ INT-TC30 Gagal: koneksi socket tanpa login ditolak (3 ms)`. Hasil: **Pass**. |
| INT-TC31 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC31 Gagal: data kartu tidak valid ditolak sebelum dikirim ke gateway, tidak ada transaksi tercatat (81 ms)`. Hasil: **Pass**. |
| INT-TC32 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC32 Gagal: gateway menolak kartu, transaksi tercatat gagal, sesi tidak lunas, saldo mitra tetap (5 ms)`. Hasil: **Pass**. |
| INT-TC33 | `tests/integrasi/05-transaksi.test.js`: `✕ INT-TC33 Normal: gateway menyetujui, transaksi tercatat berhasil, sesi lunas, saldo mitra bertambah (5 ms)`. Hasil: **Fail**.<br>Pesan galat test runner: `Expected: 302` / `Received: 500` pada `expect(res.status).toBe(302)` (`tests/integrasi/05-transaksi.test.js:71`). Server membalas HTTP 500 saat pembayaran dengan kartu `4111111111111111`. |
| INT-TC34 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC34 Gagal: bila satu query di dalam transaksi gagal, seluruh perubahan dibatalkan (rollback) (4 ms)`. Hasil: **Pass**. |
| INT-TC35 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC35 Normal: ulasan sesi yang selesai tersimpan dan rating mitra dihitung ulang (5 ms)`. Hasil: **Pass**. |
| INT-TC36 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC36 Gagal: ulasan tanpa rating ditolak dan tidak tersimpan (4 ms)`. Hasil: **Pass**. |
| INT-TC37 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC37 Gagal: ulasan untuk sesi yang belum selesai ditolak (3 ms)`. Hasil: **Pass**. |
| INT-TC38 | `tests/integrasi/05-transaksi.test.js`: `✕ INT-TC38 Normal: riwayat sesi menampilkan isi chat yang dapat dibaca (bukan teks terenkripsi) (397 ms)`. Hasil: **Fail**.<br>Pesan galat test runner: `expect(received).not.toContain("enc:v1:")` gagal (`tests/integrasi/05-transaksi.test.js:150`). Halaman `/transaksi/riwayat/:idSesi` menampilkan isi pesan sebagai `enc:v1:H5E/VWCsgrslwC/L:...` di dalam `<div class="bubble saya">`, bukan teks asli. |
| INT-TC39 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC39 Gagal: masyarakat lain tidak dapat membuka riwayat sesi milik orang lain (3 ms)`. Hasil: **Pass**. |
| INT-TC40 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC40 Normal: pencairan disetujui gateway, tercatat berhasil, saldo mitra berkurang (2 ms)`. Hasil: **Pass**. |
| INT-TC41 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC41 Gagal: nominal melebihi saldo ditolak, tidak ada pencairan tercatat, saldo tetap (5 ms)`. Hasil: **Pass**. |
| INT-TC42 | `tests/integrasi/05-transaksi.test.js`: `✓ INT-TC42 Normal: data tetap ada setelah server dimatikan dan dinyalakan ulang (538 ms)`. Hasil: **Pass**. |
| INT-TC43 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC43 Normal: laporan pelanggaran akun tersimpan berstatus menunggu (4 ms)`. Hasil: **Pass**. |
| INT-TC44 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC44 Gagal: laporan tanpa deskripsi ditolak dan tidak tersimpan (2 ms)`. Hasil: **Pass**. |
| INT-TC45 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC45 Normal: admin menyetujui laporan, akun terlapor diblokir dan tidak bisa login (76 ms)`. Hasil: **Pass**. |
| INT-TC46 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC46 Gagal: laporan yang sudah ditinjau tidak dapat diproses ulang (4 ms)`. Hasil: **Pass**. |
| INT-TC47 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC47 Normal: admin menolak laporan, status ditolak dan akun terlapor tetap aktif (5 ms)`. Hasil: **Pass**. |
| INT-TC48 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC48 Normal: pesan masyarakat membuat sesi live chat, admin menerima dan membalas secara real-time (15 ms)`. Hasil: **Pass**. |
| INT-TC49 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC49 Normal: admin menyelesaikan sesi live chat, status tersimpan selesai (2 ms)`. Hasil: **Pass**. |
| INT-TC50 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC50 Gagal: saat tidak ada admin standby, pesan ditolak dan sesi live chat tidak dibuat (4 ms)`. Hasil: **Pass**. |
| INT-TC51 | `tests/integrasi/01-autentikasi.test.js`: `✓ INT-TC51 Normal: login admin (tabel Admin) membuka halaman admin (73 ms)`. Hasil: **Pass**. |
| INT-TC52 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC52 Normal: mitra melaporkan ulasan pada profilnya, laporan tersimpan dengan idUlasan (74 ms)`. Hasil: **Pass**. |
| INT-TC53 | `tests/integrasi/06-laporan-livechat.test.js`: `✓ INT-TC53 Gagal: mitra tidak dapat melaporkan ulasan milik mitra lain (91 ms)`. Hasil: **Pass**. |
| INT-TC54 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC54 Normal: cek status verifikasi dengan username menampilkan status dari basis data (3 ms)`. Hasil: **Pass**. |
| INT-TC55 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC55 Gagal: username mitra yang tidak terdaftar ditolak dengan pesan (3 ms)`. Hasil: **Pass**. |
| INT-TC56 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC56 Normal: dashboard mitra menampilkan ringkasan yang sesuai dengan basis data (9 ms)`. Hasil: **Pass**. |
| INT-TC57 | `tests/integrasi/02-mitra.test.js`: `✓ INT-TC57 Gagal: akun masyarakat tidak dapat membuka dashboard mitra (89 ms)`. Hasil: **Pass**. |
| **UC01-TC01** | ![UC01-TC01](assets/UC01-TC01.png) |
| **UC01-TC02** | ![UC01-TC02](assets/UC01-TC02.png) |
| **UC02-TC01** | ![UC02-TC01](assets/UC02-TC01.png) |
| **UC02-TC02** | ![UC02-TC02](assets/UC02-TC02.png) |
| **UC02-TC03** | ![UC02-TC03](assets/UC02-TC03.png) |
| **UC03-TC01** | ![UC03-TC01](assets/UC03-TC01.png) |
| **UC03-TC02** | ![UC03-TC02](assets/UC03-TC02.png) |
| **UC04-TC01** | ![UC04-TC01](assets/UC04-TC01.png) |
| **UC04-TC02** | ![UC04-TC02](assets/UC04-TC02.png) |
| **UC04-TC03** | ![UC04-TC03](assets/UC04-TC03.png) |
| **UC05-TC01** | ![UC05-TC01](assets/UC05-TC01.png) |
| **UC05-TC02** | ![UC05-TC02](assets/UC05-TC02.png) |
| **UC06-TC01** | ![UC06-TC01](assets/UC06-TC01.png) |
| **UC06-TC02** | ![UC06-TC02](assets/UC06-TC02.png) |
| **UC06-TC03** | ![UC06-TC03](assets/UC06-TC03.png) |
| **UC07-TC01** | ![UC07-TC01](assets/UC07-TC01.png) |
| **UC08-TC01** | ![UC08-TC01](assets/UC08-TC01.png) |
| **UC08-TC02** | ![UC08-TC02](assets/UC08-TC02.png) |
| **UC09-TC01** | ![UC09-TC01](assets/UC09-TC01.png) |
| **UC09-TC02** | ![UC09-TC02](assets/UC09-TC02.png) |
| **UC10-TC01** | ![UC10-TC01](assets/UC10-TC01.png) |
| **UC10-TC02** | ![UC10-TC02](assets/UC10-TC02.png) |
| **UC11-TC01** | ![UC11-TC01](assets/UC11-TC01.png) |
| **UC11-TC02** | ![UC11-TC02](assets/UC11-TC02.png) |
| **UC12-TC01** | ![UC12-TC01](assets/UC12-TC01.png) |
| **UC13-TC01** | ![UC13-TC01](assets/UC13-TC01.png) |
| **UC13-TC02** | ![UC13-TC02](assets/UC13-TC02.png) |
| **UC14-TC02** | ![UC14-TC02](assets/UC14-TC02.png) |
| **UC15-TC01** | ![UC15-TC01](assets/UC15-TC01.png) |
| **UC15-TC02** | ![UC15-TC02](assets/UC15-TC02.png) |
| **UC17-TC01** | ![UC17-TC01](assets/UC17-TC01.png) |
| **UC17-TC02** | ![UC17-TC02](assets/UC17-TC02.png) |
| **UC19-TC01** | ![UC19-TC01](assets/UC19-TC01.png) |
| **UC20-TC01** | ![UC20-TC01](assets/UC20-TC01.png) |
| **UC22-TC01** | ![UC22-TC01](assets/UC22-TC01.png) |
| **UC22-TC02** | ![UC22-TC02](assets/UC22-TC02.png) |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |
