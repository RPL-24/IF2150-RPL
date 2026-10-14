<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## *antri.in*
### *[Logo Perangkat Lunak]*

### Untuk: *Angel*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
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
> Dokumen ini melanjutkan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)** dan **Arsitektur Perangkat Lunak (APL)**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

<br>

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan dengan ringkas tujuan dokumen DPPL ini dibuat dan siapa saja yang akan menggunakan dokumen ini.

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
| *...* | *...* |

## 1.5 Referensi
Cantumkan dokumentasi P/L yang dirujuk oleh dokumen ini, **minimal dokumen SKPL dan APL**. Tambahkan buku, panduan, atau dokumentasi lain apabila digunakan.

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

## 2.2 Style/Pattern Arsitektur Acuan

Tentukan *architectural style* atau *pattern* yang menjadi acuan aplikasi, misalnya *layered architecture*, *client-server*, *repository*, *pipe and filter*, atau MVC (*Model-View-Controller*).


Gunakan hasil **BAB 1 Style/Pattern Arsitektur Acuan pada dokumen APL**, termasuk alasan pemilihan dan gambar penerapannya pada P/L kelompok. Gunakan komponen aplikasi sendiri pada gambar, bukan hanya contoh pola umum.

<p align="center">
<img alt="Contoh Arsitektur MVC" src="./assets/diagram/MVC.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur MVC</i>
</p>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Identifikasi komponen, modul, atau subsistem penyusun aplikasi berdasarkan *pattern* yang telah ditetapkan. Jelaskan tanggung jawab masing-masing komponen. Pengelompokan dapat mengikuti lapisan arsitektur atau fungsi/peran komponen dalam sistem.

Ambil dari **Tabel 2.1 dokumen APL**, lalu kelompokkan berdasarkan lapisan (Model/View/Controller). Kolom **Jenis** diisi sesuai pattern, misalnya View, Controller, Model, Service, Repository. Satu komponen merepresentasikan saatu tanggung jawab utama yang jelas,

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

## 3.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01]</i>
</p>

- **Skenario Alternatif [Nomor]: [Nama Skenario]**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01] - [Nama skenario alternatif]</i>
</p>

### 3.1.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh_class-diagram2.jpg" width="35%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas [Nama Uce Case]</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.

## 3.2 Use Case XX

Silahkan lanjutkan untuk  *use case* berikutnya dengan content yang sama dengan 3.1

<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-class_diargam.png" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan [Nama P/L]</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *[C01]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *[C02]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *[C03]* | *[Nama kelas]* | *[Daftar atribut]* | *[Daftar metode/operasi]* |
| *...* | *...* | *...* | *...* |

<br>

---

# BAB 5: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| *...* | *...* |
