<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## *antri.in*
<img alt="Contoh Arsitektur MVC" src="./assets/Logo_Antri_in.png" width="70%"><br>

### Untuk: *Angel*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *01* |
| Kelompok | *10*  |

| NIM | Nama |
|---|---|
| *13525145* | *Muhammad Nur Fikri Hariyawan* |
| *13525085* | *Bayu Palamarta Wirawan*       |
| *13525133* | *Chatima Anandakhorita*        |
| *13525148* | *Athallah Nanda Andita*        |
| *13525091* | *Muhammad Fauzi Muharam*       |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

<br>

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini melanjutkan **Deskripsi Perancangan Perangkat Lunak**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

<br>

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen ini bertujuan untuk menjabarkan rancangan perangkat lunak antri.in yang mencakup pendahuluan, perancangan arsitektur, realisasi setiap use case melalui sequence diagram dan diagram kelas, serta keterkaitan kelas perancangan dengan use case. Dokumen ini akan digunakan oleh kelompok Ducklings sebagai acuan dalam pengembangan, serta asisten dosen dan dosen sebagai acuan dalam penilaian.

## 1.2 Lingkup Masalah
Fenomena makanan viral memicu antrean panjang berjam-jam yang membebani pelanggan, karena mereka harus datang lebih awal, menunggu di lokasi, dan mengantre tanpa informasi stok menu maupun estimasi waktu tunggu, ditambah proses pemesanan dan pembayaran di kasir yang memakan waktu 2-5 menit per transaksi. Aplikasi pesan-antar seperti GoFood, GrabFood, dan ShopeeFood pun hanya berfokus pada pengantaran dan tidak membatasi kuota transaksi per rentang waktu, sehingga restoran kewalahan saat pesanan online dan pelanggan fisik datang bersamaan. Celah utamanya adalah belum adanya integrasi antara pemantauan antrean real-time, pengaturan slot waktu, serta pemesanan dan pembayaran awal, sehingga antri.in hadir untuk menghapus waktu berpikir di kasir, meratakan kedatangan pelanggan berbasis kuota jam, dan memberi kebebasan bagi konsumen selama menunggu. Dari fenomena tersebut perangkat lunak bernama antri.in yang akan kami kembangkan merupakan sistem pemesanan makanan viral dengan antrean digital berbasis web yang bertujuan agar pengguna tidak perlu mengantri secara langsung pada restoran. Sistem ini memungkinkan pengguna untuk mencari restoran makanan viral, melihat informasi makanan dan restoran, melakukan pemesanan, memantau antrean dan estimasi pesanan akan selesai, serta fitur booking tempat jika pengguna memutuskan untuk dine-in. Cara kerja dari aplikasi berbasis web ini adalah pertama pengguna memilih restoran yang tersedia, kemudian pengguna dapat membaca informasi mengenai makanan yang terdapat di restoran tersebut. Jika sudah, pengguna dapat memilih makanan yang akan dibeli dan lanjut ke proses pembayaran. Ketika pengguna sudah membayar, barulah akan mendapatkan nomor antrian dan estimasi pesanan selesai sehingga pengguna dapat memperkirakan waktu kedatangan.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *DPPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *US* | *Singkatan dari User Story.* |
| *A* | *Singkatan dari Aktivitas.* |
| *R* | *Singkatan dari Requirement.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *C* | *Singkatan dari Class.* |
| *EARS* | *Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji.* |
| *AC* | *Singkatan dari Aktor.* |
| *Algo* | *Singkatan dari Algoritma.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *User Story* | *USXX* | Mulai dari 01, 02, dan seterusnya |
| *Kebutuhan Fungsional* | *KFXX* | Mulai dari 01, 02, dan seterusnya |
| *Kebutuhan Non-Fungsional* | *KNFXX* | Mulai dari 01, 02, dan seterusnya |
| *Aktivitas* | *AXX* | Mulai dari 01, 02, dan seterusnya |
| *Use Case* | *UCXX* | Mulai dari 01, 02, dan seterusnya |
| *Kelas* | *CXX* | Mulai dari 01, 02, dan seterusnya |
| *Requirement* | *RXX* | Mulai dari 01, 02, dan seterusnya |
| *Aktor* | *ACXX* | Mulai dari 01, 02, dan seterusnya |
| *Algoritma* | *Algo-XX* | Mulai dari 01, 02, dan seterusnya |
| *...* | *...* |

## 1.5 Referensi
Cantumkan dokumentasi P/L yang dirujuk oleh dokumen ini, **minimal dokumen SKPL dan APL**. Tambahkan buku, panduan, atau dokumentasi lain apabila digunakan.

SKPL
APL
Pressman, R. S., _Software Engineering: A Practitioner's Approach_, _8th Edition_, McGraw-Hill, 2015.  
Sommerville, I., _Software Engineering_, _10th Edition_, Pearson, 2016.  
Larman, C., _Applying UML and Patterns: An Introduction to Object-Oriented Analysis and Design and Iterative Development_, _3rd Edition_, Prentice Hall, 2004.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | *Lokal (localhost)* |
| *Client* | *Google Chrome* |
| *DBMS* | *PostgreSQL 15+* |
| *OS* | *Windows 11* |
| *Bahasa Pemrograman* | *Typescript* |
| *API* | *REST API* |
| *filing system* | *NTFS* |
| *Code Editor / IDE* | *Visual Studio Code* |
| *Package Manager* | *npm* |
| *Version Control* | *Git* |
| *API Testing Tool* | *Postman* |
| *Database Management Tool* | *pgAdmin* |

## 2.2 Style/Pattern Arsitektur Acuan

Tentukan *architectural style* atau *pattern* yang menjadi acuan aplikasi, misalnya *layered architecture*, *client-server*, *repository*, *pipe and filter*, atau MVC (*Model-View-Controller*).


Gunakan hasil **BAB 1 Style/Pattern Arsitektur Acuan pada dokumen APL**, termasuk alasan pemilihan dan gambar penerapannya pada P/L kelompok. Gunakan komponen aplikasi sendiri pada gambar, bukan hanya contoh pola umum.

Style yang dipilih adalah Architectural Style MVC. Pola arsitektur ini memisahkan aplikasi menjadi 3 komponen utama, yaitu Model, View, dan Controller. Model berperan sebagai representasi data dan logika bisnis, View sebagai pengatur tampilan informasi kepada pengguna, dan Controller berperan sebagai penghubung Model dan View.

Alasan Pemilihan:
1. Berdasarkan jenis pengguna:
- Pelanggan: Dengan MVC, View pelanggan dapat diperbaiki berulang kali tanpa menyentuh logika pemesanan atau pembayaran. Selain itu, informasi sensitif seperti rekening dan e-wallet hanya diakses lewat Controller, tidak langsung oleh View.
- Restoran: Karena Model menjadi sumber data tunggal, perubahan dari sisi restoran secara otomatis tersedia untuk View pelanggan tanpa menduplikasi data.
- Admin: View admin berupa panel kerja yang berbeda dari antarmuka pelanggan, sehingga bisa dikembangkan sendiri.
  
2. Berdasarkan alur proses bisnis: 
- Data antrean yang sama muncul di HalamanStatusAntrean (pelanggan) dan DashboardAntreanPage (restoran). Dengan MVC, perubahan di Model (misalnya setelah dequeue) dapat memperbarui kedua View sekaligus.
- Aplikasi membutuhkan proses validasi yang cukup kompleks. Dengan MVC, proses bisnis yang kompleks bisa dipisahkan dengan antarmuka supaya tidak terlalu menganggu tampilan.
- MVC memudahkan pengembangan fitur yang berbeda seperti registrasi restoran, pencarian restoran, booking, pre-order, pembayaran, dan pengelolaan antrean.

3. Berdasarkan KF dan KNF:
- Pemisahan peran pengguna (KF21, KF15, KF19, KF20)
Sistem melayani tiga aktor (pelanggan, restoran, admin) dengan fitur yang berbeda. Dalam MVC, setiap aktor dapat dilayani oleh Controller dan View terpisah (misalnya PelangganController, RestoranController, AdminController), sementara Model tetap dipakai bersama. Hal ini mempermudah pengaturan hak akses dan alur registrasi/login/logout.

- Banyak tampilan dari data yang sama (KF01, KF02, KF03, KF13)
Data restoran, antrean, dan pesanan ditampilkan ke beberapa pihak dan di beberapa halaman. MVC memungkinkan satu Model menyediakan data yang sama untuk View yang berbeda tanpa menduplikasi logika.

- Pembaruan antrean yang saling terhubung (KF04, KF08, KF17, KF18)
Ketika restoran melakukan dequeue atau mengubah kuota, tampilan pelanggan harus ikut diperbarui. Pola Model sebagai sumber data tunggal dan View yang menyesuaikan diri terhadap perubahan Model cocok untuk menjaga sinkronisasi ini.

- Logika bisnis yang kompleks dan terpusat (KF05, KF06, KF07, KF09, KF10)
Pemeriksaan stok, dua mode pemesanan (booking dan pre-order), validasi reservasi maksimal seminggu sebelumnya, serta penyimpanan tiket antrean merupakan aturan bisnis. Dalam MVC, aturan ini ditempatkan di Model/Controller, bukan di tampilan, sehingga mudah diuji dan diubah.

- Response time (KNF02, KNF09, KNF12)
Pemisahan lapisan membuat Model dapat dioptimalkan secara mandiri tanpa memengaruhi View, sehingga target 1 detik untuk menampilkan restoran dan 10 detik untuk konfirmasi pembayaran lebih mudah dicapai.

- Reliability (KNF03, KNF06, KNF10, KNF14)
Nomor antrean unik, pencegahan pemesanan meja ganda, konfirmasi semua pembayaran, dan pencegahan double-charge adalah aturan integritas data. Dengan MVC, aturan ini dipusatkan di Model sehingga konsisten, apa pun Controller atau View yang memanggilnya.

- Security (KNF08)
Privasi nomor rekening dan e-wallet dapat dijaga dengan memastikan View tidak pernah mengakses data sensitif secara langsung. Seluruh akses melewati Controller yang melakukan otorisasi dan validasi, dan Model yang mengelola enkripsi atau penyamaran data.

- Availability (KNF01, KNF05, KNF07, KNF11)
Fitur yang harus tersedia setiap saat seperti daftar restoran, nomor antrean, dan pendaftaran dapat dipelihara dan diperbarui per komponen.

- Ergonomy (KNF04, KNF13)
Antarmuka yang minimalis dan mudah digunakan membutuhkan iterasi desain tampilan yang sering. Karena View terpisah dari logika, desain UI dapat diubah tanpa menyentuh logika bisnis.

<p align="center">
<img alt="Contoh Arsitektur MVC" src="./assets/diagram/MVC.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur MVC</i>
</p>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Identifikasi komponen, modul, atau subsistem penyusun aplikasi berdasarkan *pattern* yang telah ditetapkan. Jelaskan tanggung jawab masing-masing komponen. Pengelompokan dapat mengikuti lapisan arsitektur atau fungsi/peran komponen dalam sistem.

Dapat menyalin dari dokumen DPPL sebelumnya

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
| *ModelAkun*                 | *Model*                | *Menyimpan identitas dan kredensial pengguna (Pelanggan, Admin), hak akses (role), serta token dan status sesi login.*     |
| *ModelRestoran*               | *Model*                | *Menyimpan profil restoran mitra, status verifikasi dan keaktifan, dokumen perizinan, daftar menu beserta stok, serta konfigurasi kuota antrean dan kapasitas meja.*                                                       |
| *ModelAntrean*                | *Model*                | *Menyimpan antrean per restoran dan tiket antrean (nomor urut, tipe dine-in/takeaway, status, estimasi waktu tunggu).*                                      |                                      |
| *ModelPesanan*           | *Model*          | *Menyimpan keranjang sementara, data pesanan (mode, jumlah rombongan, jadwal booking, total harga, status), dan riwayat transaksi pembayaran.*                                             |
| *ModelKeluhan*         | *Model*          | *Menyimpan isi, waktu kirim, dan status keluhan pelanggan.*                                          |
| *AkunView*        | *View*          | *Halaman registrasi, login, profil, dan dialog konfirmasi logout untuk Pelanggan, Restoran, dan Admin.*                |
| *PencarianView*           | *View*          | *Halaman pencarian dan filter restoran, kartu ringkasan restoran, serta pesan hasil kosong.*                                                              |
| *PemesananView*                      | *View*               | *Halaman pemilihan menu dan mode layanan (dine-in, takeaway, booking), keranjang, checkout, pembayaran, dan konfirmasi tiket antrean.*                        |
| *StatusAntreanView*                   | *View*               | *Halaman pelanggan untuk melihat status antrean secara real-time dan menerima notifikasi pengambilan pesanan.*       |
| *MitraView*                     | *View*               | *Formulir pendaftaran mitra restoran (restoran) dan halaman peninjauan pengajuan (admin).*          |
| *KelolaAntreanView*                   | *View*               | *Dashboard antrean restoran, tombol dequeue, dan dialog konfirmasi dequeue.*                                |
| *PengaturanView*                    | *View*           | *Halaman restoran untuk mengatur kuota antrean, kapasitas meja, serta menu dan stok makanan.*                                                      |
| *KelolaRestoranView*       | *View* | *Halaman admin untuk melihat daftar restoran mitra dan dialog konfirmasi penghapusan restoran.* |
| *KeluhanView*                    | *View*    | *Formulir pengiriman keluhan (pelanggan) dan daftar keluhan (admin).*   |
| *AutentikasiController*                    | *Controller*    | *Registrasi akun, validasi kredensial, penerbitan token sesi, dan logout untuk semua peran.*   |
| *PencarianController*                    | *Controller*    | *Menjalankan pencarian dan filter restoran, mengambil preview menu dan status antrean.*   |
| *PemesananController*                    | *Controller*    | *Mengatur alur pemesanan: mencatat item ke keranjang, memvalidasi stok dan kuota meja, memvalidasi booking (maks. 7 hari), membuat pesanan, serta menerbitkan tiket antrean setelah pembayaran lunas.*   |
| *MetodePembayaranController*                    | *Controller*    | *Formulir pengiriman keluhan (pelanggan) dan daftar keluhan (admin).Membuat tagihan, memverifikasi status pembayaran, dan menangani timeout melalui PaymentGatewayAdapter.*   |
| *PemantauAntreanController*                    | *Controller*    | *Membaca data antrean dan mendorong pembaruan status antrean ke pelanggan secara real-time.*   |
| *PengajuanMitraController*                    | *Controller*    | *Memvalidasi dan menyimpan pengajuan mitra, serta memproses keputusan admin (setujui/tolak) dan memicu notifikasi email.*   |
| *KelolaAntreanController*                    | *Controller*    | *Menampilkan dashboard antrean, memproses dequeue manual maupun otomatis (timeout 30 menit), dan memperbarui antrean.*   |
| *PengaturanKuotaController*                    | *Controller*    | *Memvalidasi input dan menyimpan kuota antrean serta kapasitas meja, termasuk penutupan antrean sementara.*   |
| *KelolaMenuController*                    | *Controller*    | *Menambah, mengubah, menghapus menu, dan memperbarui stok.*   |
| *KelolaDataRestoranController*                    | *Controller*    | *Menonaktifkan dan menghapus data restoran beserta relasi menunya.*   |
| *KeluhanController*                    | *Controller*    | *Menerima dan menyimpan keluhan pelanggan serta menampilkan daftar keluhan kepada admin.*   |
| *PaymentGatewayAdapter*                    | *Integrasi Eksternal*    | *Penghubung ke Payment Gateway: mengirim permintaan transaksi dan menerima status lunas, gagal, atau kedaluwarsa. Penyedia dapat diganti tanpa mengubah controller.*   |
| *NotifikasiEmail*                    | *Integrasi Eksternal*    | *Mengirim email hasil verifikasi pendaftaran mitra (diterima/ditolak) melalui layanan email pihak ketiga.*   |
| *Payment Gateway*                    | *Sistem Eksternal*    | *Sistem pihak ketiga yang memvalidasi dan mengotorisasi pembayaran digital (penyedia belum ditentukan).*   |
| *Layanan Email*                    | *Sistem Eksternal*    | *Layanan pengiriman email pihak ketiga.*   |
| *BasisDataPostgreSQL*                    | *Pendukung*    | *Penyimpanan seluruh data transaksional dan operasional pada PostgreSQL 15+ di lingkungan sistem sendiri; diakses oleh seluruh komponen Model.*   |
| *...* | *...* | *...* |

## 2.4 Model Arsitektur Perangkat Lunak

Buat model arsitektur dalam bentuk satu atau lebih *view* yang memperlihatkan interaksi dan kolaborasi komponen, modul, serta subsistem dalam menjalankan fungsi sistem. Pilih notasi yang sesuai. Contoh *view*: *Logical View*, *Process View*, *Development View*, dan *Physical View*.

Gunakan hasil **BAB 3 Model Arsitektur Perangkat Lunak pada dokumen APL**. 

### 2.4.1 Logical View

Tuliskan secara singkat model arsitektur yang dipilih dan alasan model tersebut cocok untuk aplikasi.

Arsitektur aplikasi **antri.in** dibagi menjadi beberapa lapisan utama:
1. **Layer View (Antarmuka Pengguna)**
   - Berfungsi untuk menampilkan antarmuka interaktif kepada pengguna, baik untuk pelanggan, pengelola restoran, maupun pihak mitra.
   - **Komponen**: `AkunView`, `KeluhanView`, `StatusAntreanView`, `KelolaAntreanView`, `PemesananView`, `PencarianView`, `KelolaRestoranView`, `PengaturanView`, dan `MitraView`. Setiap komponen *view* menangani fungsi spesifik seperti melihat status antrean, pemesanan menu, hingga pendaftaran mitra baru.

2. **Layer Controller (Logika Bisnis & Kendali)**
   - Menerima input dari *View*, memproses alur kerja (*use case*), dan memperbarui data pada *Model*.
   - **Komponen**: `AutentikasiController`, `KeluhanController`, `PemantauAntreanController`, `KelolaAntreanController`, `PemesananController`, `MetodePembayaranController`, `PencarianController`, `KelolaDataRestoranController`, `PengaturanKuotaController`, `KelolaMenuController`, dan `PengajuanMitraController`.

3. **Layer Model (Domain Data & Aturan Bisnis)**
   - Mengelola data utama, status aplikasi, serta transaksi bisnis.
   - **Komponen**: 
     - `ModelAkun`: Mengelola sesi dan kredensial pengguna.
     - `ModelKeluhan`: Mengelola catatan keluhan dari pengguna.
     - `ModelAntrean`: Mengelola siklus antrean, nomor tiket, dan status penerbitan antrean.
     - `ModelPesanan`: Mengelola rincian transaksi dan pesanan pelanggan.
     - `ModelRestoran`: Mengelola data restoran, stok menu, kuota meja, dan status kemitraan.

4. **Integrasi Eksternal & Layer Pendukung (Infrastructure/Persistence)**
   - **Integrasi Eksternal**:
     - `PaymentGatewayAdapter` yang terhubung ke layanan *Payment Gateway* eksternal untuk pemrosesan transaksi.
     - `NotifikasiEmail` yang terhubung ke *Layanan Email* eksternal untuk pengiriman pesan notifikasi/konfirmasi.
   - **Pendukung (Database)**: `BasisDataPostgreSQL` digunakan untuk menyimpan data relasional bagi semua model data aplikasi.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/Logical View Block Diagram.png" width="100%">
</p>
<p align="center">
<i>Gambar 2. Logical View antri.in</i>
</p>

### 2.4.2 Process View

Process View dipilih karena antri.in memiliki tiga perilaku yang hanya terlihat saat sistem berjalan, yaitu pembayaran yang bersifat asinkron, pembaruan antrean secara *real-time*, dan proses yang dipicu oleh waktu. 

Komponen pada Tabel 2.1 berjalan di dalam proses berikut:
1. **Proses Klien (Google Chrome)**
   - Setiap pengguna yang sedang aktif, baik Pelanggan, Restoran, maupun Admin, menjalankan satu browser yang memuat komponen-komponen.
   - **Komponen**: `AkunView`, `PencarianView`, `PemesananView`, `KeluhanView`, `MitraView`, `KelolaAntreanView`, `PengaturanView`, `KelolaRestoranView`, dan `StatusAntreanView`.
2. **Proses Server Aplikasi (*localhost*, Windows 11)**
   - Satu proses server melayani banyak permintaan secara bersamaan dan terbagi menjadi empat unit eksekusi:
     - **Thread penanganan request REST**: setiap permintaan HTTP ditangani oleh satu *thread* secara sinkron. Komponen: `AutentikasiController`, `PencarianController`, `PemesananController`, `MetodePembayaranController`, `PengajuanMitraController`, `KeluhanController`, `KelolaAntreanController`, `PengaturanKuotaController`, `KelolaMenuController`, dan `KelolaDataRestoranController`.
     - **Kanal real-time**: koneksi yang tetap terbuka selama pelanggan memantau antrean, sehingga perubahan dapat didorong (*push*) tanpa pelanggan memuat ulang halaman. Komponen: `PemantauAntreanController`.
     - **Lapisan Model**: dipakai bersama oleh seluruh *thread*, sehingga akses ke data yang sama perlu dijaga dengan transaksi basis data. Komponen: `ModelAkun`, `ModelKeluhan`, `ModelPesanan`, `ModelRestoran`, dan `ModelAntrean`.
     - **Pekerja integrasi**: menangani komunikasi dengan sistem eksternal secara asinkron agar *request* pengguna tidak tertahan menunggu respons pihak luar. Komponen: `PaymentGatewayAdapter` dan `NotifikasiEmail`.

3. **Proses DBMS (PostgreSQL 15+)**
   - Proses terpisah yang menyimpan seluruh data secara persisten. **Komponen**: `BasisDataPostgreSQL`.

4. **Sistem Eksternal**
   - Proses di luar batas P/L yang berkomunikasi melalui pekerja integrasi. **Komponen**: *Payment Gateway* dan *Layanan Email*.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/Process View.png" width="100%">
</p>
<p align="center">
<i>Gambar 3. Process View antri.in</i>
</p>

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case 1

**ID Use Case:** *UC01*  
**Nama Use Case:** *Mencari dan filter resto*

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelanggan* | *Pelanggan* |
| 2 | *Restoran* | *Restoran* |
| 3 | *Menu* | *Menu* |
| 4 | *Antrean* | *Antrean* |
| 5 | *PencarianRestoPage* | *PencarianRestoPage* |
| 6 | *PencarianController* | *PencarianController* |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC01_Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 4. Sequence Diagram UC01</i>
</p>

- **Skenario Alternatif 1: Hasil Pencarian Tidak Ditemukan**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC01_Alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 5. Sequence Diagram UC01 - Hasil Pencarian Tidak Ditemukan</i>
</p>


### 3.1.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD_UC01.drawio.png" width="35%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas UC01</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.


## 3.2 Use Case 2

**ID Use Case:** *UC02*  
**Nama Use Case:** *Melakukan pemesanan dan pembayaran digital*

### 3.2.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.2. Identifikasi Kelas Use Case [UC02]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelanggan* | *Pelanggan* |
| 2 | *Menu* | *Menu* |
| 3 | *Keranjang* | *Keranjang* |
| 4 | *Pesanan* | *Pesanan* |
| 5 | *MetodePembayaranController* | *MetodePembayaranController* |
| 6 | *RiwayatTransaksi* | *RiwayatTransaksi* |
| 7 | *TiketAntrean* | *TiketAntrean* |
| ... | *...* | *...* |

### 3.2.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Normal.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 7. Sequence Diagram UC02 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Pre-Order Takeaway**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Alt1.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 8. Sequence Diagram UC02 - Pre-Order Takeaway</i>
</p>

- **Skenario Alternatif 2: Booking Tempat**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Normal.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 9. Sequence Diagram UC02 - Booking Tempat</i>
</p> <!-- SAMA DENGAN SKENARIO NORMAL!!! -->

- **Skenario Alternatif 3: Stok Menu Habis**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Alt3.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 10. Sequence Diagram UC02 - Stok Menu Habis</i>
</p> 

- **Skenario Alternatif 4: Batas Waktu Pembayaran Habis (Timeout) / Pembayaran Gagal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Alt 4.drawio.png" width="50%">
</p>
<p align="center">
<i>Gambar 11. Sequence Diagram UC02 - Batas Waktu Pembayaran Habis (Timeout) / Pembayaran Gagal</i>
</p>

- **Skenario Alternatif 5: Tanggal Booking Tidak Valid atau Kuota Jadwal Penuh**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC02_Alt5.png" width="50%">
</p>
<p align="center">
<i>Gambar 12. Sequence Diagram UC02 - Batas Waktu Pembayaran Habis (Timeout) / Pembayaran Gagal</i>
</p>

### 3.2.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD_UC02.png" width="35%">
</p>
<p align="center">
<i>Gambar 13. Diagram Kelas UC02</i>
</p>

<br>

## 3.3 Use Case 3

**ID Use Case:** *UC03*  
**Nama Use Case:** *Menampilkan Status Antrean*

### 3.3.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.3. Identifikasi Kelas Use Case [UC03]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *HalamanStatusAntrean* | *HalamanStatusAntrean* |
| 2 | *PemantauAntreanController* | *PemantauAntreanController* |
| 3 | *TiketAntrean* | *TiketAntrean* |
| 4 | *Antrean* | *Antrean* |
| 5 | *Pesanan* | *Pesanan* |
| 6 | *Pelanggan* | *Pelanggan* |
| ... | *...* | *...* |

### 3.3.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC03 Sequence Diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar 14. Sequence Diagram UC03</i>
</p>

### 3.3.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC03 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 15. Diagram Kelas UC03</i>
</p>

<br>

## 3.4 Use Case 4

**ID Use Case:** *UC04*  
**Nama Use Case:** *Pendaftaran Mitra Restoran Baru*

### 3.4.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.4. Identifikasi Kelas Use Case [UC04]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *RegistrasiRestoPage* | *RegistrasiRestoPage* |
| 2 | *PengajuanMitraController* | *PengajuanMitraController* |
| 3 | *Restoran* | *Restoran* |
| 4 | *DokumenVerifikasi* | *DokumenVerifikasi* |
| 5 | *Menu* | *Menu* |

### 3.4.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC04" src="./assets/diagram/UC04 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 16. Sequence Diagram UC04</i>
</p>

- **Skenario Alternatif 1: Data Form Tidak Lengkap atau Format Tidak Sesuai**

<p align="center">
<img alt="Sequence Diagram UC04 - Data Form Tidak Lengkap atau Format Tidak Sesuai" src="./assets/diagram/UC04 Sequence Diagram Alt 1.png" width="50%">
</p>
<p align="center">
<i>Gambar 17. Sequence Diagram UC04 - Data Form Tidak Lengkap atau Format Tidak Sesuai</i>
</p>

### 3.4.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Diagram Kelas UC04" src="./assets/diagram/UC04 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 18. Diagram Kelas UC04</i>
</p>

<br>

## 3.5 Use Case 5

**ID Use Case:** *UC05*  
**Nama Use Case:** *Memverifikasi Pendaftaran Restoran*

### 3.5.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.5. Identifikasi Kelas Use Case [UC05]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *VerifikasiRestoranPage* | *VerifikasiRestoranPage* |
| 2 | *PengajuanMitraController* | *PengajuanMitraController* |
| 3 | *Restoran* | *Restoran* |
| 4 | *DokumenVerifikasi* | *DokumenVerifikasi* |
| 5 | *Menu* | *Menu* |
| 6 | *Admin* | *Admin* |
| 7 | *NotifikasiEmail* | *NotifikasiEmail* |

### 3.5.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC05" src="./assets/diagram/UC05 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 19. Sequence Diagram UC05</i>
</p>

- **Skenario Alternatif 1: Pengajuan Pendaftaran Ditolak**

<p align="center">
<img alt="Sequence Diagram UC05 - Pengajuan Pendaftaran Ditolak" src="./assets/diagram/UC05 Sequence Diagram Alt 1.png" width="50%">
</p>
<p align="center">
<i>Gambar 20. Sequence Diagram UC05 - Pengajuan Pendaftaran Ditolak</i>
</p>

### 3.5.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Diagram Kelas UC05" src="./assets/diagram/UC05 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 21. Diagram Kelas UC05</i>
</p>

<br>


## 3.6 Use Case 6

**ID Use Case:** *UC06*  
**Nama Use Case:** *Mengelola Antrean*

### 3.6.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.6. Identifikasi Kelas Use Case [UC06]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelanggan* | *Pelanggan* |
| 2 | *Restoran* | *Restoran* |
| 3 | *Antrean* | *Antrean* |
| 4 | *Pesanan* | *Pesanan* |
| 5 | *TiketAntrean* | *TiketAntrean* |
| 6 | *KelolaAntreanController* | *KelolaAntreanController* |
| 7 | *KonfirmasiDequeuePage* | *KonfirmasiDequeuePage* |
| 8 | *KelolaAntreanPage* | *KelolaAntreanPage* |
| ... | *...* | *...* |

### 3.6.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS06-N.png" width="50%">
</p>
<p align="center">
<i>Gambar 22. Sequence Diagram UC06</i>
</p>

- **Skenario Alternatif 1: Restoran membatalkan dequeue**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS06-ALT1.png" width="50%">
</p>
<p align="center">
<i>Gambar 23. Sequence Diagram UC06 - Restoran membatalkan dequeue</i>
</p>

- **Skenario Alternatif 2: Pelanggan tidak hadir**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS06-ALT2.png" width="50%">
</p>
<p align="center">
<i>Gambar 24. Sequence Diagram UC06 - Pelanggan tidak hadir</i>
</p>

### 3.6.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD-06.png" width="35%">
</p>
<p align="center">
<i>Gambar 25. Diagram Kelas UC06</i>
</p>

<br>

## 3.7 Use Case 7

**ID Use Case:** *UC07*  
**Nama Use Case:** *Mengatur Kuota Antrean & Meja*

### 3.7.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.7. Identifikasi Kelas Use Case [UC07]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Kuota* | *Kuota* |
| 2 | *PengaturanKuotaController* | *PengaturanKuotaController* |
| 3 | *PengaturanKuotaPage* | *PengaturanKuotaPage* |
| 4 | *Restoran* | *Restoran* |
| ... | *...* | *...* |

### 3.7.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS07-N.png" width="50%">
</p>
<p align="center">
<i>Gambar 26. Sequence Diagram UC07</i>
</p>

- **Skenario Alternatif 1: Input Tidak Valid**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS07-ALT1.png" width="50%">
</p>
<p align="center">
<i>Gambar 27. Sequence Diagram UC07 - Input Tidak Valid</i>
</p>

- **Skenario Alternatif 2: Restoran Menutup Antrean Sementara**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS07-ALT2.png" width="50%">
</p>
<p align="center">
<i>Gambar 28. Sequence Diagram UC07 - Restoran Menutup Antrean Sementara</i>
</p>

### 3.7.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD-07.png" width="35%">
</p>
<p align="center">
<i>Gambar 29. Diagram Kelas UC07</i>
</p>

<br>

## 3.8 Use Case 8

**ID Use Case:** *UC08*  
**Nama Use Case:** *Mengelola Stok dan Menu Makanan*

### 3.8.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.8. Identifikasi Kelas Use Case [UC08]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Menu* | *Menu* |
| 2 | *PengaturanMenuPage* | *PengaturanMenuPage* |
| 3 | *KelolaMenuController* | *KelolaMenuController* |
| 4 | *Restoran* | *Restoran* |
| ... | *...* | *...* |

### 3.8.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS08-N.png" width="50%">
</p>
<p align="center">
<i>Gambar 30. Sequence Diagram UC08</i>
</p>

- **Skenario Alternatif 1: Restoran menambahkan menu baru**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS08-ALT1.png" width="50%">
</p>
<p align="center">
<i>Gambar 31. Sequence Diagram UC08 - Restoran menambahkan menu baru</i>
</p>

- **Skenario Alternatif 2: Restoran menghapus salah satu menu**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS08-ALT2.png" width="50%">
</p>
<p align="center">
<i>Gambar 32. Sequence Diagram UC08 - Restoran menghapus salah satu menu</i>
</p>

- **Skenario Alternatif 3: Stok makanan tidak cukup**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/DS08-ALT3.png" width="50%">
</p>
<p align="center">
<i>Gambar 33. Sequence Diagram UC08 - Stok makanan tidak cukup</i>
</p>

### 3.8.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD-08.png" width="35%">
</p>
<p align="center">
<i>Gambar 34. Diagram Kelas UC08</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.

Silahkan lanjutkan untuk  *use case* berikutnya dengan content yang sama dengan 3.1

<br>

## 3.09 Use Case 09

**ID Use Case:** *UC09*  
**Nama Use Case:** *Menampilkan Dashboard Antrean Restoran*

### 3.09.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.09. Identifikasi Kelas Use Case [UC09]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *DashboardAntreanPage* | *DashboardAntreanPage* |
| 2 | *KelolaAntreanController* | *KelolaAntreanController* |
| 3 | *Antrean* | *Antrean* |
| 4 | *TiketAntrean* | *TiketAntrean* |
| 5 | *Restoran* | *Restoran* |
| 6 | *Pesanan* | *Pesanan* |
| ... | *...* | *...* |

### 3.09.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC09_Sequence_Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 35. Sequence Diagram UC09</i>
</p>

- **Skenario Alternatif 1: Antrean Kosong saat Resto Baru Didaftarkan maupun Baru Buka**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC09_Sequence_Alternatif1.png" width="50%">
</p>
<p align="center">
<i>Gambar 36. Sequence Diagram UC09 - Antrean Kosong saat Resto Baru Didaftarkan maupun Baru Buka</i>
</p>


### 3.09.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC09_Class.png" width="35%">
</p>
<p align="center">
<i>Gambar 37. Diagram Kelas UC09</i>
</p>

<br>

## 3.10 Use Case 10

**ID Use Case:** *UC10*  
**Nama Use Case:** *Registrasi Akun*

### 3.10.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.10. Identifikasi Kelas Use Case [UC10]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *RegistrasiPage* | *RegistrasiPage* |
| 2 | *AutentikasiController* | *AutentikasiController* |
| 3 | *Pengguna* | *Pengguna* |
| 4 | *SesiPengguna* | *SesiPengguna* |
| 5 | *Pelanggan* | *Pelanggan* |
| 6 | *Admin* | *Admin* |
| 7 | *Restoran* | *Restoran* |
| ... | *...* | *...* |

### 3.10.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC10_Sequence_Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 38. Sequence Diagram UC10</i>
</p>

- **Skenario Alternatif 1: Email atau Nomor Telepon Sudah Terdaftar**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC10_Sequence_Alternatif1.png" width="50%">
</p>
<p align="center">
<i>Gambar 39. Sequence Diagram UC10 - Email atau Nomor Telepon Sudah Terdaftar</i>
</p>

- **Skenario Alternatif 2: ata Sandi Tidak Sesuai Kriteria Keamanan atau Konfirmasi Salah**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC10_Sequence_Alternatif2.png" width="50%">
</p>
<p align="center">
<i>Gambar 40. Sequence Diagram UC10 - ata Sandi Tidak Sesuai Kriteria Keamanan atau Konfirmasi Salah</i>
</p>

### 3.10.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC10_Class.png" width="35%">
</p>
<p align="center">
<i>Gambar 41. Diagram Kelas UC10</i>
</p>

<br>

## 3.11 Use Case 11

**ID Use Case:** *UC11*  
**Nama Use Case:** *Registrasi Akun*

### 3.11.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.11. Identifikasi Kelas Use Case [UC11]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *LoginPage* | *LoginPage* |
| 2 | *AutentikasiController* | *AutentikasiController* |
| 3 | *Pengguna* | *Pengguna* |
| 4 | *SesiPengguna* | *SesiPengguna* |
| ... | *...* | *...* |

### 3.11.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_Sequence_Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 42. Sequence Diagram UC11</i>
</p>

- **Skenario Alternatif 1: Kredensial Salah (Email atau Kata Sandi Tidak Cocok)**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_Sequence_Alternatif1.png" width="50%">
</p>
<p align="center">
<i>Gambar 43. Sequence Diagram UC11 - Kredensial Salah (Email atau Kata Sandi Tidak Cocok)</i>
</p>


### 3.11.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_Class.png" width="35%">
</p>
<p align="center">
<i>Gambar 44. Diagram Kelas UC11</i>
</p>

<br>

## 3.12 Use Case 12

**ID Use Case:** *UC12*  
**Nama Use Case:** *Keluar Akun*

### 3.12.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.12. Identifikasi Kelas Use Case [UC12]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *HalamanProfilePage* | *HalamanProfilePage* |
| 2 | *KonfirmasiLogoutPage* | *KonfirmasiLogoutPage* |
| 3 | *LoginPage* | *LoginPage* |
| 4 | *AutentikasiController* | *AutentikasiController* |
| 5 | *Pengguna* | *Pengguna* |
| 6 | *SesiPengguna* | *SesiPengguna* |
| ... | *...* | *...* |

### 3.12.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC12 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 45. Sequence Diagram UC12</i>
</p>

- **Skenario Alternatif 1: Aktor Membatalkan Keluar Akun**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC12 Sequence Diagram Alt 1.png" width="50%">
</p>
<p align="center">
<i>Gambar 46. Sequence Diagram UC12 - Aktor Membatalkan Keluar Akun</i>
</p>

### 3.12.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC12 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 47. Diagram Kelas UC12</i>
</p>

<br>

## 3.13 Use Case 13

**ID Use Case:** *UC13*  
**Nama Use Case:** *Penyampaian Keluhan Pelanggan*

### 3.13.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.13. Identifikasi Kelas Use Case [UC13]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *KeluhanFormPage* | *KeluhanFormPage* |
| 2 | *KeluhanController* | *KeluhanController* |
| 3 | *Keluhan* | *Keluhan* |
| 4 | *Pelanggan* | *Pelanggan* |

### 3.13.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC13" src="./assets/diagram/UC13 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 48. Sequence Diagram UC13</i>
</p>

### 3.13.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Diagram Kelas UC13" src="./assets/diagram/UC13 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 49. Diagram Kelas UC13</i>
</p>

<br>

## 3.14 Use Case 14

**ID Use Case:** *UC14*  
**Nama Use Case:** *Penanggapan Keluhan Pelanggan*

### 3.14.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.14. Identifikasi Kelas Use Case [UC14]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *KeluhanDashboardPage* | *KeluhanDashboardPage* |
| 2 | *KeluhanController* | *KeluhanController* |
| 3 | *Keluhan* | *Keluhan* |
| 4 | *Admin* | *Admin* |

### 3.14.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC14" src="./assets/diagram/UC14 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 50. Sequence Diagram UC14</i>
</p>

### 3.14.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Diagram Kelas UC14" src="./assets/diagram/UC14 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 51. Diagram Kelas UC14</i>
</p>

<br>



## 3.15 Use Case 15

**ID Use Case:** *UC15*  
**Nama Use Case:** *Penghapusan Restoran*

### 3.15.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.15. Identifikasi Kelas Use Case [UC15]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *DashboardKelolaRestoranPage* | *DashboardKelolaRestoranPage* |
| 2 | *KonfirmasiHapusRestoranPage* | *KonfirmasiHapusRestoranPage* |
| 3 | *KelolaDataRestoranController* | *KelolaDataRestoranController* |
| 4 | *Restoran* | *Restoran* |
| 5 | *Menu* | *Menu* |
| 6 | *Admin* | *Admin* |
| ... | *...* | *...* |

### 3.15.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC15 Sequence Diagram Normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 52. Sequence Diagram UC15</i>
</p>

- **Skenario Alternatif 1: Admin Membatalkan Proses Penghapusan Restoran**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC15 Sequence Diagram Alt 1.png" width="50%">
</p>
<p align="center">
<i>Gambar 53. Sequence Diagram UC15 - Admin Membatalkan Proses Penghapusan Restoran</i>
</p>

### 3.15.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC15 Class Diagram.png" width="35%">
</p>
<p align="center">
<i>Gambar 54. Diagram Kelas UC15</i>
</p>

<br>


---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD-Keseluruhan.png" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan antri.in</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *Pelanggan* | *pelangganId, nama, nomorAntrean, noHp, idAkun, email* | *getDetails(), cariRestoran(), pilihMenu(), pilihMetodeBayar(), konfirmasiPembayaran(), lihatStatusAntrean(), accountRegister(), kirimKeluhan()* |
| *C02* | *Restoran* | *restoranId, namaRestoran, kategori, ratingRerata, daftarUlasan, emailKontak, statusAktif* | *getDetailRestoran(), getMenu(), getAntrean(), ajukanPendaftaran(), getPengaturan(), getDaftarMenu(), showDashboard(), accountRegister(), setSoftDelete(), purgeData()* |
| *C03* | *Menu* | *menuId, namaMenu, harga, deskripsiMenu, stok* | *getInfoMenu(), cekStok(), kurangiStok(), tambahMenu(), updateStok(), updateInfoMenu(), isTersedia(), hapusMenu()* |
| *C04* | *Antrean* | *antreanId, restoranId, nomorDilayani, totalAntrean, estimasiWaktuTunggu, statusAntrean* | *getFrontCustomer(), getEstimasiWaktu(), getDetailAntrean(), updateStatus(), dequeueCustomer(), getPesananPreOrder(), getQueueStatus(), updateMenu()* |
| *C05* | *Keranjang* | *idKeranjang, daftarMenu, totalEstimasiHarga* | *tambahItem(), hapusItem(), hitungTotal(), kosongkanKeranjang()* |
| *C06* | *Pesanan* | *pesananId, modePemesanan, jumlahRombongan, tanggalBooking, slotWaktuBooking, totalHarga, statusPemesanan* | *validasiBooking(), buatTagihan(), batalkanPesanan(), updateStatus(), getDetailPesanan(), showOrderDetails()* |
| *C07* | *MetodePembayaranController* | *idPembayaran, tipePembayaran, batasWaktuBayar, statusPembayaran* | *buatTagihan(), verifikasiPembayaran(), cekTimeout()* |
| *C08* | *RiwayatTransaksi* | *idTransaksi, tanggalTransaksi, jumlahDibayar, statusPelunasan* | *catatLogTransaksi(), getBuktiPembayaran()* |
| *C09* | *TiketAntrean* | *idTiket, nomorUrut, tipeAntrean, waktuTerbit, statusAntrean, estimasiWaktuTunggu* | *generateNomorAntrean(), cetakRincianTiket(), getDetailTiket(), updateStatusTiket()* |
| *C10* | *PemantauAntreanController* | *antreanId* | *getStatusAntrean(), updateTampilanAntrean()* |
| *C11* | *HalamanStatusAntrean* | *antreanId, statusAntrean, sisaAntrean* | *tampilkanStatusAntrean(), renderData()* |
| *C12* | *PengajuanMitraController* | *idPengajuan, status, tglPengajuan, alasanPenolakan* | *validasiKelengkapan(), simpanPengajuan(), setujui(), tolak(alasan)* |
| *C13* | *DokumenVerifikasi* | *idDokumen, jenisDokumen* | *unggahDokumen(), validasiFormat()* |
| *C14* | *Admin* | *idAdmin, nama, emailAdmin* | 8tinjauPengajuan(), accountRegister(), lihatKeluhan(), konfirmasiPenghapusan()* |
| *C15* | *NotifikasiEmail* | *penerima, isiPesan, jenis* | *kirimEmail()* |
| *C16* | *KelolaAntreanController* | *timer* | *getAntrean(), processDequeue(), mulaiTimer()* |
| *C17* | *KonfirmasiDequeuePage* | *message* | *showConfirmationModal(), hideModal(), onConfirm(), onCancel()* |
| *C18* | *KelolaAntreanPage* | *queueListUI* | *displayDashboard(antrean: Antrean), dequeue()* |
| *C19* | *DashboardAntreanPage* | *daftarAntrean, statusAntrean* | *displayQueue(), updateQueueStatus()* |
| *C20* | *Kuota* | *kuotaMaksimum, kapasitasMeja, statusAntrean* | *updateKapasitas(), isAntreanTutup()* |
| *C21* | *PengaturanKuotaController* | *kuotaInput, mejaInput* | *displaySettings(), onSaveSettings(), showErrorPeringatan()* |
| *C22* | *PengaturanKuotaPage* | *inputKuota, inputMeja* | *handleViewSettings(), handleSaveSettings(), validateInput()* |
| *C23* | *PengaturanMenuPage* | *menuInput, stokInput, hargaInput* | *displayDaftarMenu(), showFormTambahMenu(), onSaveMenu(), onDeleteMenu()* |
| *C24* | *KelolaMenuController* | *menuData* | *handleFetchMenu(),  handleFetchMenuDetail(), handleAddMenu(), handleUpdateMenu(), handleDeleteMenu()* |
| *C25* | *Pengguna* | *username, password, idPengguna, email, role* | *validateAccount(), logout(), getUserInfo(), saveCredentials()* |
| *C26* | *HalamanProfilPage* | *idPengguna, namaUser* | *tekanTombolLogout()* |
| *C27* | *KonfirmasiLogoutPage* | *pesanKonfirmasi* | *konfirmasiYa(), konfirmasiBatal()* |
| *C28* | *AutentikasiController* | *akunId, username, password, tokenManager* | *createAccount(), validation(), processLogout(), handleSessionDeletion()* |
| *C29* | *SesiPengguna* | *idSesi, token, statusAktif* | *validateSession(), hapusSesi(), validateToken()* |
| *C30* | *Keluhan* | *idKeluhan, isiKeluhan, waktuKirim, status* | *simpanKeluhan(), updateStatusKeluhan()* |
| *C31* | *DashboardKelolaRestoranPage* | *daftarRestoran, kataKunci* | *pilihRestoran(), klikHapusRestoran()* |
| *C32* | *KonfirmasiHapusRestoranPage* | *restoranId, pesanPeringatan* | *setujuiPenghapusan(), batalHapus()* |
| *C33* | *KelolaDataRestoranController* | *restoranId* | *hapusDataRestoran(), nonaktifkanRelasiMenu()* |
| *C34* | *PencarianRestoPage* | *inputKataKunci, filterKategori, filterLokasi, daftarResto* | *renderHalamanPencarian(), onKetikInput(), onPilihFilter(), onClickTombolCari(), tampilkanDaftarRestoran(), tampilkanPesanKosong()* |
| *C35* | *PencarianController* | *kataKunci, filterSelected* | *cariRestoran(), terapkanFilter(), ambilStatusAntrean(), ambilPreviewMenu()* |
| *C36* | *VerifikasiRestoranPage* | *idPengajuan, berkasMitra* | *tampilkanDetailBerkas(), renderStatusVerifikasi()* |
| *C37* | *RegistrasiRestoPage* | *formResto, dokumenUpload* | 8renderFormRegistrasi(), onSubmitRegistrasi()* |
| *C38* | *RegistrasiPage* | *inputUsername, inputEmail, inputPassword* | *renderFormRegistrasi(), onSubmitRegister()* |
| *C39* | *LoginPage* | *inputUsername, inputPassword* | *renderFormLogin(), onSubmitLogin()* |
| *C40* | *KeluhanFormPage* | *inputKeluhan, waktuKirim* | *renderFormKeluhan(), onSubmitKeluhan()* |
| *C41* | *KeluhanController* | *daftarKeluhan* | *kirimKeluhan(), tampilkanKeluhan(), tanggapiKeluhan()* |
| *C42* | *KeluhanDashboardPage* | *listKeluhanUI* | *displayKeluhanList(), showDetailKeluhan()* |
| *...* | *...* | *...* | *...* |

---

# BAB 5: Perancangan Rinci Kelas

Bagian ini diisi dengan daftar seluruh kelas dalam tabel berikut:

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *Pelanggan* | *Pelanggan* |
| 2 | *Restoran* | *Restoran* |
| 3 | *Menu* | *Menu* |
| 4 | *Antrean* | *Antrean* |
| 5 | *Keranjang* | *Keranjang* |
| 6 | *Pesanan* | *Pesanan* |
| 7 | *MetodePembayaranController* | *MetodePembayaranController* |
| 8 | *RiwayatTransaksi* | *RiwayatTransaksi* |
| 9 | *TiketAntrean* | *TiketAntrean* |
| 10 | *PemantauAntreanController* | *PemantauAntreanController* |
| 11 | *HalamanStatusAntrean* | *HalamanStatusAntrean* |
| 12 | *PengajuanMitraController* | *PengajuanMitraController* |
| 13 | *DokumenVerifikasi* | *DokumenVerifikasi* |
| 14 | *Admin* | *Admin* |
| 15 | *NotifikasiEmail* | *NotifikasiEmail* |
| 16 | *KelolaAntreanController* | *KelolaAntreanController* |
| 17 | *KonfirmasiDequeuePage* | *KonfirmasiDequeuePage* |
| 18 | *KelolaAntreanPage* | *KelolaAntreanPage* |
| 19 | *DashboardAntreanPage* | *DashboardAntreanPage* |
| 20 | *Kuota* | *Kuota* |
| 21 | *PengaturanKuotaController* | *PengaturanKuotaController* |
| 22 | *PengaturanKuotaPage* | *PengaturanKuotaPage* |
| 23 | *PengaturanMenuPage* | *PengaturanMenuPage* |
| 24 | *KelolaMenuController* | *KelolaMenuController* |
| 25 | *Pengguna* | *Pengguna* |
| 26 | *HalamanProfilPage* | *HalamanProfilePage* |
| 27 | *KonfirmasiLogoutPage* | *KonfirmasiLogoutPage* |
| 28 | *AutentikasiController* | *AutentikasiController* |
| 29 | *SesiPengguna* | *SesiPengguna* |
| 30 | *Keluhan* | *Keluhan* |
| 31 | *DashboardKelolaRestoranPage* | *DashboardKelolaRestoranPage* |
| 32 | *KonfirmasiHapusRestoranPage* | *KonfirmasiHapusRestoranPage* |
| 33 | *KelolaDataRestoranController* | *KelolaDataRestoranController* |
| 34 | *PencarianRestoPage* | *PencarianRestoPage* |
| 35 | *PencarianController* | *PencarianController* |
| 36 | *VerifikasiRestoranPage* | *VerifikasiRestoranPage* |
| 37 | *RegistrasiRestoPage* | *RegistrasiRestoPage* |
| 38 | *RegistrasiPage* | *RegistrasiPage* |
| 39 | *LoginPage* | *LoginPage* |
| 40 | *KeluhanFormPage* | *KeluhanFormPage* |
| 41 | *KeluhanController* | *KeluhanController* |
| 42 | *KeluhanDashboardPage* | *KeluhanDashboardPage* |
| ... | *...* | *...* |

Untuk **setiap kelas**, identifikasi operasi berdasarkan tanggung jawab kelas beserta *visibility*-nya, serta atribut beserta *visibility* dan tipenya. Buat subbab tersendiri untuk setiap kelas.

## 5.1 Kelas [Nama Kelas 1]

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.1.1. Operasi Kelas [Nama Kelas 1]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.1.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.1.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.1.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.1.2 Algoritma/Query

*[Ulangi pola 5.1.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*

## 5.2 Kelas [Nama Kelas Berikutnya]

*[Ulangi pola 5.1: nama dan ID kelas, tabel operasi, tabel atribut, serta subbab algoritma/query untuk operasi penting jika diperlukan.]*

<br>

## 5.31 Kelas DashboardKelolaRestoranPage

**Nama Kelas:** *DashboardKelolaRestoranPage*  
**ID Kelas:** *C31*

Tabel 5.31.1. Operasi Kelas DashboardKelolaRestoranPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *pilihRestoran(restoranId: string): void* | *public* | Memilih restoran dari daftar restoran mitra. |
| *klikHapusRestoran(): void* | *public* | Membuka dialog konfirmasi penghapusan. |

Tabel 5.31.2. Atribut Kelas DashboardKelolaRestoranPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *daftarRestoran* | *private* | *Restoran[]* |
| *kataKunci* | *private* | *string* |

### 5.31.1 Algoritma/Query

**Nama Kelas:** *DashboardKelolaRestoranPage*  
**Nama Operasi:** *pilihRestoran(restoranId: string): void*  
**ID Algoritma:** *Algo-113*

```text
PROCEDURE pilihRestoran(restoranId)
    restoranTerpilih <- daftarRestoran.find(restoranId)
    sorotBaris(restoranTerpilih)
    aktifkanTombolHapus()
END PROCEDURE
```

### 5.31.2 Algoritma/Query

**Nama Kelas:** *DashboardKelolaRestoranPage*  
**Nama Operasi:** *klikHapusRestoran(): void*  
**ID Algoritma:** *Algo-114*

```text
PROCEDURE klikHapusRestoran()
    IF restoranTerpilih IS NULL THEN RETURN
    KonfirmasiHapusRestoranPage.tampilkan(restoranTerpilih.restoranId)
END PROCEDURE
```

---

## 5.32 Kelas KonfirmasiHapusRestoranPage

**Nama Kelas:** *KonfirmasiHapusRestoranPage*  
**ID Kelas:** *C32*

Tabel 5.32.1. Operasi Kelas KonfirmasiHapusRestoranPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *setujuiPenghapusan(): void* | *public* | Meneruskan persetujuan penghapusan ke controller. |
| *batalHapus(): void* | *public* | Membatalkan penghapusan dan menutup dialog. |

Tabel 5.32.2. Atribut Kelas KonfirmasiHapusRestoranPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *restoranId* | *private* | *string* |
| *pesanPeringatan* | *private* | *string* |

### 5.32.1 Algoritma/Query

**Nama Kelas:** *KonfirmasiHapusRestoranPage*  
**Nama Operasi:** *setujuiPenghapusan(): void*  
**ID Algoritma:** *Algo-115*

```text
PROCEDURE setujuiPenghapusan()
    sukses <- KelolaDataRestoranController.hapusDataRestoran(restoranId)
    tutupDialog()
    IF sukses THEN muatUlangDaftarRestoran() ELSE tampilkanError()
END PROCEDURE
```

### 5.32.2 Algoritma/Query

**Nama Kelas:** *KonfirmasiHapusRestoranPage*  
**Nama Operasi:** *batalHapus(): void*  
**ID Algoritma:** *Algo-116*

```text
PROCEDURE batalHapus()
    tutupDialog()               // data restoran tidak berubah
END PROCEDURE
```

---

## 5.33 Kelas KelolaDataRestoranController

**Nama Kelas:** *KelolaDataRestoranController*  
**ID Kelas:** *C33*

Tabel 5.33.1. Operasi Kelas KelolaDataRestoranController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *hapusDataRestoran(restoranId: string): boolean* | *public* | Menghapus data restoran setelah dikonfirmasi admin. |
| *nonaktifkanRelasiMenu(restoranId: string): void* | *public* | Menonaktifkan relasi menu restoran. |

Tabel 5.33.2. Atribut Kelas KelolaDataRestoranController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *restoranId* | *private* | *string* |

### 5.33.1 Algoritma/Query

**Nama Kelas:** *KelolaDataRestoranController*  
**Nama Operasi:** *hapusDataRestoran(restoranId: string): boolean*  
**ID Algoritma:** *Algo-117*

```text
FUNCTION hapusDataRestoran(restoranId) RETURNS boolean
    restoran <- Restoran.getDetailRestoran(restoranId)
    IF restoran IS NULL THEN RETURN false
    BEGIN TRANSACTION
        restoran.setSoftDelete()
        nonaktifkanRelasiMenu(restoranId)
        restoran.purgeData()
    COMMIT
    RETURN true
END FUNCTION
```

### 5.33.2 Algoritma/Query

**Nama Kelas:** *KelolaDataRestoranController*  
**Nama Operasi:** *nonaktifkanRelasiMenu(restoranId: string): void*  
**ID Algoritma:** *Algo-118*

```text
PROCEDURE nonaktifkanRelasiMenu(restoranId)
    UPDATE menu SET aktif = false, stok = 0 WHERE restoran_id = restoranId
END PROCEDURE
```

Tabel 5.33.2.1. Query Operasi nonaktifkanRelasiMenu

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-074* | `UPDATE menu SET aktif = false, stok = 0 WHERE restoran_id = $1;` | Menonaktifkan seluruh menu restoran. |

---

## 5.34 Kelas PencarianRestoPage

**Nama Kelas:** *PencarianRestoPage*  
**ID Kelas:** *C34*

Tabel 5.34.1. Operasi Kelas PencarianRestoPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *renderHalamanPencarian(): void* | *public* | Merender halaman pencarian dan filter. |
| *onKetikInput(teks: string): void* | *public* | Menangani input kata kunci. |
| *onPilihFilter(filter: object): void* | *public* | Menangani pemilihan filter kategori/lokasi. |
| *onClickTombolCari(): void* | *public* | Memicu pencarian ke controller. |
| *tampilkanDaftarRestoran(daftar: Restoran[]): void* | *public* | Menampilkan kartu ringkasan restoran. |
| *tampilkanPesanKosong(): void* | *public* | Menampilkan pesan bila hasil pencarian tidak ditemukan. |

Tabel 5.34.2. Atribut Kelas PencarianRestoPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *inputKataKunci* | *private* | *string* |
| *filterKategori* | *private* | *string* |
| *filterLokasi* | *private* | *string* |
| *daftarResto* | *private* | *Restoran[]* |

### 5.34.1 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *renderHalamanPencarian(): void*  
**ID Algoritma:** *Algo-119*

```text
PROCEDURE renderHalamanPencarian()
    renderKolomCari(); renderPilihanFilter(kategori, lokasi)
    tampilkanDaftarRestoran(daftarResto)
END PROCEDURE
```

### 5.34.2 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *onKetikInput(teks: string): void*  
**ID Algoritma:** *Algo-120*

```text
PROCEDURE onKetikInput(teks)
    inputKataKunci <- teks
END PROCEDURE
```

### 5.34.3 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *onPilihFilter(filter: object): void*  
**ID Algoritma:** *Algo-121*

```text
PROCEDURE onPilihFilter(filter)
    filterKategori <- filter.kategori
    filterLokasi   <- filter.lokasi
END PROCEDURE
```

### 5.34.4 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *onClickTombolCari(): void*  
**ID Algoritma:** *Algo-122*

```text
PROCEDURE onClickTombolCari()
    hasil <- PencarianController.cariRestoran(inputKataKunci)
    hasil <- PencarianController.terapkanFilter({kategori: filterKategori, lokasi: filterLokasi})
    daftarResto <- hasil
    IF hasil IS EMPTY THEN tampilkanPesanKosong()
    ELSE tampilkanDaftarRestoran(hasil)
END PROCEDURE
```

### 5.34.5 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *tampilkanDaftarRestoran(daftar: Restoran[]): void*  
**ID Algoritma:** *Algo-123*

```text
PROCEDURE tampilkanDaftarRestoran(daftar)
    FOR EACH r IN daftar DO
        renderKartu(r.namaRestoran, r.kategori, r.ratingRerata, r.statusAntrean, r.previewMenu)
    END FOR
END PROCEDURE
```

### 5.34.6 Algoritma/Query

**Nama Kelas:** *PencarianRestoPage*  
**Nama Operasi:** *tampilkanPesanKosong(): void*  
**ID Algoritma:** *Algo-124*

```text
PROCEDURE tampilkanPesanKosong()
    kosongkanDaftar()
    tampilkanPesan("Restoran tidak ditemukan")
END PROCEDURE
```

---

## 5.35 Kelas PencarianController

**Nama Kelas:** *PencarianController*  
**ID Kelas:** *C35*

Tabel 5.35.1. Operasi Kelas PencarianController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *cariRestoran(kataKunci: string): Restoran[]* | *public* | Mencari restoran aktif berdasarkan kata kunci. |
| *terapkanFilter(filter: object): Restoran[]* | *public* | Menerapkan filter kategori dan lokasi. |
| *ambilStatusAntrean(restoranId: string): StatusAntrean* | *public* | Mengambil status antrean untuk kartu restoran. |
| *ambilPreviewMenu(restoranId: string): Menu[]* | *public* | Mengambil pratinjau menu restoran. |

Tabel 5.35.2. Atribut Kelas PencarianController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *kataKunci* | *private* | *string* |
| *filterSelected* | *private* | *object* |

### 5.35.1 Algoritma/Query

**Nama Kelas:** *PencarianController*  
**Nama Operasi:** *cariRestoran(kataKunci: string): Restoran[]*  
**ID Algoritma:** *Algo-125*

```text
FUNCTION cariRestoran(kataKunci) RETURNS Restoran[]
    hasil <- SELECT * FROM restoran WHERE status_aktif = true AND nama_restoran ILIKE '%kataKunci%'
    FOR EACH r IN hasil DO
        r.statusAntrean <- ambilStatusAntrean(r.restoranId)
        r.previewMenu   <- ambilPreviewMenu(r.restoranId)
    END FOR
    RETURN hasil
END FUNCTION
```

Tabel 5.35.1.1. Query Operasi cariRestoran

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-075* | `SELECT * FROM restoran WHERE status_aktif = true AND nama_restoran ILIKE '%' \|\| $1 \|\| '%';` | Mencari restoran aktif berdasarkan nama. |

### 5.35.2 Algoritma/Query

**Nama Kelas:** *PencarianController*  
**Nama Operasi:** *terapkanFilter(filter: object): Restoran[]*  
**ID Algoritma:** *Algo-126*

```text
FUNCTION terapkanFilter(filter) RETURNS Restoran[]
    filterSelected <- filter
    RETURN SELECT * FROM restoran WHERE status_aktif = true
           AND (filter.kategori IS NULL OR kategori = filter.kategori)
           AND (filter.lokasi   IS NULL OR lokasi   = filter.lokasi)
           AND nama_restoran ILIKE '%kataKunci%'
END FUNCTION
```

Tabel 5.35.2.1. Query Operasi terapkanFilter

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-076* | `SELECT * FROM restoran WHERE status_aktif = true AND ($1::text IS NULL OR kategori = $1) AND ($2::text IS NULL OR lokasi = $2) AND nama_restoran ILIKE '%' \|\| $3 \|\| '%';` | Mencari restoran dengan filter kategori dan lokasi. |

### 5.35.3 Algoritma/Query

**Nama Kelas:** *PencarianController*  
**Nama Operasi:** *ambilStatusAntrean(restoranId: string): StatusAntrean*  
**ID Algoritma:** *Algo-127*

```text
FUNCTION ambilStatusAntrean(restoranId) RETURNS StatusAntrean
    status <- SELECT status_antrean FROM antrean WHERE restoran_id = restoranId
    IF status IS NULL THEN RETURN TERBUKA
    RETURN status
END FUNCTION
```

Tabel 5.35.3.1. Query Operasi ambilStatusAntrean

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-077* | `SELECT status_antrean, total_antrean, estimasi_waktu_tunggu FROM antrean WHERE restoran_id = $1;` | Mengambil status dan panjang antrean. |

### 5.35.4 Algoritma/Query

**Nama Kelas:** *PencarianController*  
**Nama Operasi:** *ambilPreviewMenu(restoranId: string): Menu[]*  
**ID Algoritma:** *Algo-128*

```text
FUNCTION ambilPreviewMenu(restoranId) RETURNS Menu[]
    RETURN SELECT nama_menu, harga, stok FROM menu WHERE restoran_id = restoranId LIMIT 3
END FUNCTION
```

Tabel 5.35.4.1. Query Operasi ambilPreviewMenu

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-078* | `SELECT nama_menu, harga, stok FROM menu WHERE restoran_id = $1 ORDER BY nama_menu LIMIT 3;` | Mengambil pratinjau tiga menu. |

---

## 5.36 Kelas VerifikasiRestoranPage

**Nama Kelas:** *VerifikasiRestoranPage*  
**ID Kelas:** *C36*

Tabel 5.36.1. Operasi Kelas VerifikasiRestoranPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanDetailBerkas(idPengajuan: string): void* | *public* | Menampilkan detail data dan dokumen pengajuan. |
| *renderStatusVerifikasi(status: StatusPengajuan): void* | *public* | Menampilkan status hasil verifikasi. |

Tabel 5.36.2. Atribut Kelas VerifikasiRestoranPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *idPengajuan* | *private* | *string* |
| *berkasMitra* | *private* | *DokumenVerifikasi[]* |

### 5.36.1 Algoritma/Query

**Nama Kelas:** *VerifikasiRestoranPage*  
**Nama Operasi:** *tampilkanDetailBerkas(idPengajuan: string): void*  
**ID Algoritma:** *Algo-129*

```text
PROCEDURE tampilkanDetailBerkas(idPengajuan)
    data <- Admin.tinjauPengajuan(idPengajuan)
    berkasMitra <- data.dokumen
    renderDetailRestoran(data.pengajuan); renderDaftarBerkas(berkasMitra)
    renderTombol("Setujui", "Tolak")
END PROCEDURE
```

### 5.36.2 Algoritma/Query

**Nama Kelas:** *VerifikasiRestoranPage*  
**Nama Operasi:** *renderStatusVerifikasi(status: StatusPengajuan): void*  
**ID Algoritma:** *Algo-130*

```text
PROCEDURE renderStatusVerifikasi(status)
    IF status = DISETUJUI THEN tampilkanPesan("Pengajuan disetujui")
    ELSE IF status = DITOLAK THEN tampilkanPesan("Pengajuan ditolak")
    ELSE tampilkanPesan("Menunggu verifikasi")
END PROCEDURE
```

---

## 5.37 Kelas RegistrasiRestoPage

**Nama Kelas:** *RegistrasiRestoPage*  
**ID Kelas:** *C37*

Tabel 5.37.1. Operasi Kelas RegistrasiRestoPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *renderFormRegistrasi(): void* | *public* | Merender formulir pendaftaran mitra restoran. |
| *onSubmitRegistrasi(): void* | *public* | Mengirim data formulir dan dokumen ke controller. |

Tabel 5.37.2. Atribut Kelas RegistrasiRestoPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *formResto* | *private* | *object* |
| *dokumenUpload* | *private* | *File[]* |

### 5.37.1 Algoritma/Query

**Nama Kelas:** *RegistrasiRestoPage*  
**Nama Operasi:** *renderFormRegistrasi(): void*  
**ID Algoritma:** *Algo-131*

```text
PROCEDURE renderFormRegistrasi()
    renderInput(namaRestoran, kategori, emailKontak, alamat)
    renderUnggahDokumen(dokumenUpload)
    renderTombol("Ajukan Pendaftaran")
END PROCEDURE
```

### 5.37.2 Algoritma/Query

**Nama Kelas:** *RegistrasiRestoPage*  
**Nama Operasi:** *onSubmitRegistrasi(): void*  
**ID Algoritma:** *Algo-132*

```text
PROCEDURE onSubmitRegistrasi()
    IF NOT PengajuanMitraController.validasiKelengkapan(formResto, dokumenUpload) THEN
        tampilkanError("Data tidak lengkap atau format tidak sesuai"); RETURN
    END IF
    idPengajuan <- PengajuanMitraController.simpanPengajuan(formResto)
    tampilkanPesan("Pengajuan terkirim, menunggu verifikasi admin")
END PROCEDURE
```

---

## 5.38 Kelas RegistrasiPage

**Nama Kelas:** *RegistrasiPage*  
**ID Kelas:** *C38*

Tabel 5.38.1. Operasi Kelas RegistrasiPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *renderFormRegistrasi(): void* | *public* | Merender formulir registrasi akun. |
| *onSubmitRegister(): void* | *public* | Mengirim data registrasi ke AutentikasiController. |

Tabel 5.38.2. Atribut Kelas RegistrasiPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *inputUsername* | *private* | *string* |
| *inputEmail* | *private* | *string* |
| *inputPassword* | *private* | *string* |

### 5.38.1 Algoritma/Query

**Nama Kelas:** *RegistrasiPage*  
**Nama Operasi:** *renderFormRegistrasi(): void*  
**ID Algoritma:** *Algo-133*

```text
PROCEDURE renderFormRegistrasi()
    renderInput(inputUsername, inputEmail, noHp, inputPassword, konfirmasiSandi)
    renderTombol("Daftar")
END PROCEDURE
```

### 5.38.2 Algoritma/Query

**Nama Kelas:** *RegistrasiPage*  
**Nama Operasi:** *onSubmitRegister(): void*  
**ID Algoritma:** *Algo-134*

```text
PROCEDURE onSubmitRegister()
    sukses <- AutentikasiController.createAccount({username: inputUsername,
              email: inputEmail, password: inputPassword, ...})
    IF sukses THEN arahkanKe(LoginPage)
    ELSE tampilkanError("Email/nomor telepon sudah terdaftar atau sandi tidak sesuai kriteria")
END PROCEDURE
```

---

## 5.39 Kelas LoginPage

**Nama Kelas:** *LoginPage*  
**ID Kelas:** *C39*

Tabel 5.39.1. Operasi Kelas LoginPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *renderFormLogin(): void* | *public* | Merender formulir login. |
| *onSubmitLogin(): void* | *public* | Mengirim kredensial ke AutentikasiController. |

Tabel 5.39.2. Atribut Kelas LoginPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *inputUsername* | *private* | *string* |
| *inputPassword* | *private* | *string* |

### 5.39.1 Algoritma/Query

**Nama Kelas:** *LoginPage*  
**Nama Operasi:** *renderFormLogin(): void*  
**ID Algoritma:** *Algo-135*

```text
PROCEDURE renderFormLogin()
    renderInput(inputUsername, inputPassword)
    renderTombol("Masuk")
END PROCEDURE
```

### 5.39.2 Algoritma/Query

**Nama Kelas:** *LoginPage*  
**Nama Operasi:** *onSubmitLogin(): void*  
**ID Algoritma:** *Algo-136*

```text
PROCEDURE onSubmitLogin()
    token <- AutentikasiController.validation(inputUsername, inputPassword)
    IF token IS NULL THEN tampilkanError("Email atau kata sandi salah"); RETURN
    simpanTokenDiKlien(token)
    arahkanKeBerandaSesuaiRole()
END PROCEDURE
```

---

## 5.40 Kelas KeluhanFormPage

**Nama Kelas:** *KeluhanFormPage*  
**ID Kelas:** *C40*

Tabel 5.40.1. Operasi Kelas KeluhanFormPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *renderFormKeluhan(): void* | *public* | Merender formulir pengiriman keluhan. |
| *onSubmitKeluhan(): void* | *public* | Mengirim isi keluhan ke KeluhanController. |

Tabel 5.40.2. Atribut Kelas KeluhanFormPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *inputKeluhan* | *private* | *string* |
| *waktuKirim* | *private* | *Date* |

### 5.40.1 Algoritma/Query

**Nama Kelas:** *KeluhanFormPage*  
**Nama Operasi:** *renderFormKeluhan(): void*  
**ID Algoritma:** *Algo-137*

```text
PROCEDURE renderFormKeluhan()
    renderTextArea(inputKeluhan)
    renderTombol("Kirim Keluhan")
END PROCEDURE
```

### 5.40.2 Algoritma/Query

**Nama Kelas:** *KeluhanFormPage*  
**Nama Operasi:** *onSubmitKeluhan(): void*  
**ID Algoritma:** *Algo-138*

```text
PROCEDURE onSubmitKeluhan()
    IF inputKeluhan IS EMPTY THEN tampilkanError("Isi keluhan wajib diisi"); RETURN
    waktuKirim <- now()
    sukses <- KeluhanController.kirimKeluhan(inputKeluhan, pelangganId)
    IF sukses THEN tampilkanPesan("Keluhan berhasil dikirim")
END PROCEDURE
```

---

## 5.41 Kelas KeluhanController

**Nama Kelas:** *KeluhanController*  
**ID Kelas:** *C41*

Tabel 5.41.1. Operasi Kelas KeluhanController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *kirimKeluhan(isi: string, pelangganId: string): boolean* | *public* | Menerima dan menyimpan keluhan pelanggan. |
| *tampilkanKeluhan(): Keluhan[]* | *public* | Mengambil daftar keluhan untuk admin. |
| *tanggapiKeluhan(idKeluhan: string, tanggapan: string): boolean* | *public* | Mencatat tanggapan admin dan memperbarui status keluhan. |

Tabel 5.41.2. Atribut Kelas KeluhanController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *daftarKeluhan* | *private* | *Keluhan[]* |

### 5.41.1 Algoritma/Query

**Nama Kelas:** *KeluhanController*  
**Nama Operasi:** *kirimKeluhan(isi: string, pelangganId: string): boolean*  
**ID Algoritma:** *Algo-139*

```text
FUNCTION kirimKeluhan(isi, pelangganId) RETURNS boolean
    IF isi IS EMPTY THEN RETURN false
    Keluhan.simpanKeluhan(isi, pelangganId)
    RETURN true
END FUNCTION
```

### 5.41.2 Algoritma/Query

**Nama Kelas:** *KeluhanController*  
**Nama Operasi:** *tampilkanKeluhan(): Keluhan[]*  
**ID Algoritma:** *Algo-140*

```text
FUNCTION tampilkanKeluhan() RETURNS Keluhan[]
    daftarKeluhan <- SELECT * FROM keluhan ORDER BY waktu_kirim DESC
    RETURN daftarKeluhan
END FUNCTION
```

Tabel 5.41.2.1. Query Operasi tampilkanKeluhan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-079* | `SELECT * FROM keluhan ORDER BY waktu_kirim DESC;` | Mengambil seluruh keluhan, terbaru lebih dulu. |

### 5.41.3 Algoritma/Query

**Nama Kelas:** *KeluhanController*  
**Nama Operasi:** *tanggapiKeluhan(idKeluhan: string, tanggapan: string): boolean*  
**ID Algoritma:** *Algo-141*

```text
FUNCTION tanggapiKeluhan(idKeluhan, tanggapan) RETURNS boolean
    IF tanggapan IS EMPTY THEN RETURN false
    UPDATE keluhan SET tanggapan = tanggapan WHERE id_keluhan = idKeluhan
    Keluhan(idKeluhan).updateStatusKeluhan(DITANGGAPI)
    RETURN true
END FUNCTION
```

Tabel 5.41.3.1. Query Operasi tanggapiKeluhan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-080* | `UPDATE keluhan SET tanggapan = $2 WHERE id_keluhan = $1;` | Menyimpan tanggapan admin. |

---

## 5.42 Kelas KeluhanDashboardPage

**Nama Kelas:** *KeluhanDashboardPage*  
**ID Kelas:** *C42*

Tabel 5.42.1. Operasi Kelas KeluhanDashboardPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *displayKeluhanList(daftar: Keluhan[]): void* | *public* | Menampilkan daftar keluhan kepada admin. |
| *showDetailKeluhan(idKeluhan: string): void* | *public* | Menampilkan detail satu keluhan. |

Tabel 5.42.2. Atribut Kelas KeluhanDashboardPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *listKeluhanUI* | *private* | *Keluhan[]* |

### 5.42.1 Algoritma/Query

**Nama Kelas:** *KeluhanDashboardPage*  
**Nama Operasi:** *displayKeluhanList(daftar: Keluhan[]): void*  
**ID Algoritma:** *Algo-142*

```text
PROCEDURE displayKeluhanList(daftar)
    listKeluhanUI <- daftar
    IF daftar IS EMPTY THEN tampilkanPesan("Belum ada keluhan")
    ELSE FOR EACH k IN daftar DO renderBaris(k.isiKeluhan, k.waktuKirim, k.status)
END PROCEDURE
```

### 5.42.2 Algoritma/Query

**Nama Kelas:** *KeluhanDashboardPage*  
**Nama Operasi:** *showDetailKeluhan(idKeluhan: string): void*  
**ID Algoritma:** *Algo-143*

```text
PROCEDURE showDetailKeluhan(idKeluhan)
    keluhan <- listKeluhanUI.find(idKeluhan)
    renderDetail(keluhan)
    renderFormTanggapan(onSubmit -> KeluhanController.tanggapiKeluhan)
END PROCEDURE
```

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka I-01

Masukkan versi awal prototipe antarmuka, dimana untuk setiap antarmuka/layar, tuliskan spesifikasi rinci objek yang ditampilkan dan reaksi sistem terhadap interaksi pengguna.

**Antarmuka:** *I-01*  
**Nama Layar:** *PencarianRestoPage*

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/PencarianRestoPage.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka I-01 - PencarianRestoPage</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka [ID Layar]

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *[ID objek]* | *[Jenis objek, misalnya Button, RTF Box, dll]* | *[String yang tampil pada layar]* | *[Reaksi sistem, layar tujuan, tautan, atau ID algoritma yang dijalankan]* |
| *[ID objek]* | *[Jenis objek]* | *[Konten yang ditampilkan]* | *[Reaksi sistem atau nama file terkait beserta deskripsi ringkasnya]* |
| *...* | *...* | *...* | *...* |


## 6.X Rancangan Antarmuka [ID Layar X]

*[Ulangi pola 6.1 untuk layar berikutnya sampai semua layar teridentifikasi]*

## 6.Y Rancangan Antarmuka Keseluruhan

Tuliskan daftar gambar seluruh antarmuka. Berikan ID unik untuk setiap tampilan dan gunakan ID yang sama pada subbab perancangan antarmuka masing-masing.

Tabel 6.Y. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| *[I-01]* | <img src="./assets/diagram/contoh-design.png" alt="Contoh Desain" width="400"> |
| *[I-02]* | *[Sisipkan gambar antarmuka I-02]* |
| *[I-XX]* | *[Sisipkan gambar antarmuka berikutnya]* |

<br>

---

# BAB 7: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *C01 - Pelanggan* | *UC01 - Mencari dan filter resto<br>UC02 - Melakukan pemesanan dan pembayaran digital<br>UC03 - Menampilkan Status Antrean<br>UC06 - Mengelola Antrian<br>UC10 - Registrasi Akun<br>UC13 - Penyampaian Keluhan Pelanggan* |
| *C02 - Restoran* | *UC01 - Mencari dan filter resto<br>UC04 - Pendaftaran Mitra Restoran Baru<br>UC06 - Mengelola Antrian<br>UC07 - Mengatur Kuota Antrean & Meja<br>UC08 - Mengelola Stok dan Menu Makanan<br>UC09 - Menampilkan Dashboard Antrean Restoran<br>UC10 - Registrasi Akun<br>UC15 - Penghapusan Restoran* |
| *C03 - Menu* | *UC01 - Mencari dan filter resto<br>UC02 - Melakukan pemesanan dan pembayaran digital<br>UC04 - Pendaftaran Mitra Restoran Baru<br>UC08 - Mengelola Stok dan Menu Makanan* |
| *C04 - Antrean* | *UC01 - Mencari dan filter resto<br>UC03 - Menampilkan Status Antrean<br>UC06 - Mengelola Antrian<br>UC09 - Menampilkan Dashboard Antrean Restoran* |
| *C05 - Keranjang* | *UC02 - Melakukan pemesanan dan pembayaran digital* |
| *C06 - Pesanan* | *UC02 - Melakukan pemesanan dan pembayaran digital<br>UC03 - Menampilkan Status Antrean<br>UC06 - Mengelola Antrian<br>UC09 - Menampilkan Dashboard Antrean Restoran* |
| *C07 - MetodePembayaranController* | *UC02 - Melakukan pemesanan dan pembayaran digital* |
| *C08 - RiwayatTransaksi* | *UC02 - Melakukan pemesanan dan pembayaran digital* |
| *C09 - TiketAntrean* | *UC02 - Melakukan pemesanan dan pembayaran digital<br>UC03 - Menampilkan Status Antrean<br>UC06 - Mengelola Antrian* |
| *C10 - PemantauAntreanController* | *UC03 - Menampilkan Status Antrean* |
| *C11 - HalamanStatusAntrean* | *UC03 - Menampilkan Status Antrean* |
| *C12 - PengajuanMitraController* | *UC04 - Pendaftaran Mitra Restoran Baru<br>UC05 - Memverifikasi Pendaftaran Restoran* |
| *C13 - DokumenVerifikasi* | *UC04 - Pendaftaran Mitra Restoran Baru* |
| *C14 - Admin* | *UC05 - Memverifikasi Pendaftaran Restoran<br>UC10 - Registrasi Akun<br>UC14 - Penanggapan Keluhan Pelanggan<br>UC15 - Penghapusan Restoran* |
| *C15 - NotifikasiEmail* | *UC05 - Memverifikasi Pendaftaran Restoran* |
| *C16 - KelolaAntreanController* | *UC06 - Mengelola Antrian* |
| *C17 - KonfirmasiDequeuePage* | *UC06 - Mengelola Antrian* |
| *C18 - KelolaAntreanPage* | *UC06 - Mengelola Antrian* |
| *C19 - DashboardAntreanPage* | *UC09 - Menampilkan Dashboard Antrean Restoran* |
| *C20 - Kuota* | *UC07 - Mengatur Kuota Antrean & Meja* |
| *C21 - PengaturanKuotaController* | *UC07 - Mengatur Kuota Antrean & Meja* |
| *C22 - PengaturanKuotaPage* | *UC07 - Mengatur Kuota Antrean & Meja* |
| *C23 - PengaturanMenuPage* | *UC08 - Mengelola Stok dan Menu Makanan* |
| *C24 - KelolaMenuController* | *UC08 - Mengelola Stok dan Menu Makanan* |
| *C25 - Pengguna* | *UC10 - Registrasi Akun<br>UC11 - Login Akun<br>UC12 - Keluar Akun* |
| *C26 - HalamanProfilPage* | *UC12 - Keluar Akun* |
| *C27 - KonfirmasiLogoutPage* | *UC12 - Keluar Akun* |
| *C28 - AutentikasiController* | *UC12 - Keluar Akun* |
| *C29 - SesiPengguna* | *UC12 - Keluar Akun* |
| *C30 - Keluhan* | *UC13 - Penyampaian Keluhan Pelanggan<br>UC14 - Penanggapan Keluhan Pelanggan* |
| *C31 - DashboardKelolaRestoranPage* | *UC15 - Penghapusan Restoran* |
| *C32 - KonfirmasiHapusRestoranPage* | *UC15 - Penghapusan Restoran* |
| *C33 - KelolaDataRestoranController* | *UC15 - Penghapusan Restoran* |
| *C34 - PencarianRestoPage* | *UC01 - Mencari dan filter resto* |
| *C35 - PencarianController* | *UC01 - Mencari dan filter resto* |
| *C36 - VerifikasiRestoranPage* | *UC05 - Memverifikasi Pendaftaran Restoran* |
| *C37 - RegistrasiRestoPage* | *UC04 - Pendaftaran Mitra Restoran Baru* |
| *C38 - RegistrasiPage* | *UC10 - Registrasi Akun* |
| *C39 - LoginPage* | *UC11 - Login Akun* |
| *C40 - KeluhanFormPage* | *UC13 - Penyampaian Keluhan Pelanggan* |
| *C41 - KeluhanController* | *UC13 - Penyampaian Keluhan Pelanggan<br>UC14 - Penanggapan Keluhan Pelanggan* |
| *C42 - KeluhanDashboardPage* | *UC14 - Penanggapan Keluhan Pelanggan* |
| *...* | *...* |
