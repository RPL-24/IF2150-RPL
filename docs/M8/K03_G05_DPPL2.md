<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## LawHub
### <p align="center">
<img alt="Logo_LawHub" src="./assets/Logo_LawHub.png" width="70%">
</p>

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

Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini disusun untuk menjabarkan rancangan perangkat lunak LawHub, yaitu platform layanan konsultasi hukum digital yang menghadirkan fitur HaloLaw dan SearchLaw. Dokumen ini menerjemahkan kebutuhan yang telah ditetapkan pada Spesifikasi Kebutuhan Perangkat Lunak (SKPL) dan Arsitektur Perangkat Lunak (APL) menjadi rancangan yang siap diimplementasikan, mencakup rancangan arsitektur berbasis Model-View-Controller (MVC), identifikasi komponen, realisasi setiap use case melalui sequence diagram dan diagram kelas, diagram kelas keseluruhan, serta matriks kerunutan antara kelas perancangan dan use case.

Dokumen ini ditujukan bagi tim pengembang LawHub sebagai acuan dalam tahap implementasi dan pengujian, serta bagi dosen dan asisten mata kuliah IF2150 Rekayasa Perangkat Lunak sebagai bahan penilaian kesesuaian rancangan dengan kebutuhan yang telah ditetapkan.

## 1.2 Lingkup Masalah
LawHub merupakan platform layanan konsultasi hukum digital yang dikembangkan untuk memperluas akses bantuan hukum bagi masyarakat Indonesia, di tengah tingginya angka sengketa dan konflik hukum yang belum terselesaikan serta terbatasnya kanal konsultasi hukum yang interaktif dan efisien. Berbeda dari laman bantuan hukum yang sudah ada dan umumnya berfokus pada forum tanya jawab terbuka, LawHub menghadirkan dua fitur utama, yaitu HaloLaw untuk konsultasi hukum on-demand secara langsung dengan mitra pengacara melalui chat, dan SearchLaw untuk membantu masyarakat menemukan dasar hukum yang relevan dengan kasus yang dihadapi, sehingga proses konsultasi hukum menjadi lebih cepat, transparan, dan mudah diakses oleh berbagai kalangan.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *DPPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *UC* | *Singkatan dari Use Case.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Uce Case* | *UCXX* | |
| *Kelas* | *CXX* | |
| *...* | *...* |

## 1.5 Referensi
Cantumkan dokumentasi P/L yang dirujuk oleh dokumen ini, **minimal dokumen SKPL dan APL**. Tambahkan buku, panduan, atau dokumentasi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Tabel 2.1  Rancangan Lingkungan Implementasi

| Komponen | Spesifikasi | Keterangan |
| :--- | :--- | :--- |
| Server | Local | |
| Client | Chromium Based Browser | |
| DBMS | PostgreSQL  | |
| OS | Cross-platform (Windows/Linux/MacOS) melalui browser | |
| Development Tools | Visual Studio Code, Git dan GitHub, Node.js, React, Express, Socket.IO, Postman, Figma, draw.io |  Node.js dan Express untuk backend (MVC), React untuk frontend, Socket.IO untuk live chat, Postman untuk pengujian API  |
| Filing System |File system lokal pada server (folder uploads/) | |
| Bahasa Pemrograman | JavaScript | |


## 2.2 Style/Pattern Arsitektur Acuan

Architectural style atau pattern yang menjadi acuan untuk aplikasi LawHub yang kami kembangkan adalah MVC (Model-View-Controller). Pada MVC, view berperan untuk memperlihatkan antarmuka pada perangkat lunak. View menerima aksi atau masukan awal dari pengguna lalu meneruskan informasi ke controller. Pada LawHub, view direpresentasikan dengan kelas antarmuka seperti SearchLawpage, DaftarMitraPengacaraPage, dan ChatKonsultasiPage. Lalu, controller menjadi penghubung antara view dan model. Controller menerima permintaan pengguna dari view, memproses logika melalui model, dan mengembalikan view setelah data selesai diproses. Contoh controller pada LawHub adalah SesiKonsultasiController dan PencarianMitraController.Terakhir, model merupakan representasi struktur data dan state aplikasi. Model menerima masukan permintaan data yang diperlukan sesuai instruksi controller. Setelah itu, model melakukan operasi create, read, update, dan delete pada database. Selain itu, model juga dapat menyimpan informasi apabila diinstruksikan oleh database. Contoh model pada LawHub adalah Kasus, MitraPengacara, dan DasarHukum.

<p align="center">
<img alt="Arsitektur MVC" src="./assets/diagram/arsitektur-mvc-lawhub.webp" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur MVC LawHub</i>
</p>

MVC dipilih karena sesuai dengan karakteristik aplikasi Lawhub serta kebutuhan fungsional dan non-fungsional. Pada class diagram yang telah dibuat, LawHub telah memakai stereotype <<boundery>>, <<control>>, dan <<entity>> yang dapat langsung diadaptasi dengan rancangan arsitektur MVC tanpa perlu mengatur ulang struktur kelas. Selain itu, LawHub memiliki tiga aktor dengan antarmuka yang berbeda tetapi ketiganya dapat memanipulasi data yang sama. Dengan MVC, antarmuka untuk setiap peran dapat dikembangakn secara mandiri tanpa perlu memengaruhi logika di belakangnya. Kemudian, berdasarkan alur bisnis dan KF, fitur dengan algoritma pencarian membutuhkan pemisahan tugas antara view dan controller. View hanya memproses masukan pengguna, sementara logika pencariannya dijalankan oleh controller. Terakhir, MVC mendukung keamanan sistem saat mengenkripsi pesan karena dapat diisolasi pada controller dan model.


## 2.3 Identifikasi Komponen / Modul / Subsistem

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
RegistrasiView | View | Menampilkan formulir pendaftaran akun bagi masyarakat dan mitra pengacar, serta meneruskan input ke RegistrasiController. |
AutentikasiView | View | Menampilkan halaman login bagi masyarakat dan mitra pengacara untuk masuk sebagai akun terdaftar |
BerandaView | View | Menampilkan halaman utama setelah login. |
StatusVerifikasiMitraView | View | Menampilkan status terkini verifikasi akun kepada Mitra Pengacara, serta menampilkan dokumen pendaftar bagi Admin untuk ditinjau dan diverifikasi. |
EditProfilMitraPage | View |  Menampilkan formulir pengeditan profil/identitas firma serta pengunggahan dan pengeditan dokumen legalitas milik Mitra Pengacara. |
SearchLawView | View | Menampilkan hasil pencarian pasal berdasarkan kata kunci yang dimasukkan pengguna pada fitur SearchLaw. |
DaftarMitraPengacaraPage | View | Menampilkan daftar Mitra Pengacara lengkap dengan filter pencarian. |
KonsultasiView | View |  Menampilkan pemilihan Mitra Pengacara dan jadwal konsultasi, konfirmasi penerimaan konsultasi oleh Mitra Pengacara, serta ruang chat sesi konsultasi (HaloLaw) antara Masyarakat dan Mitra Pengacara. |
UlasanView | View | Menampilkan formulir pengisian ulasan, feedback, dan rating setelah sesi konsultasi selesai. |
LaporanView | View | Menampilkan formulir pelaporan pelanggaran akun (oleh Masyarakat maupun Mitra Pengacara) dan pelaporan ulasan yang dianggap tidak relevan (oleh Mitra Pengacara), serta halaman tinjauan laporan bagi Admin. |
HistoryView | View | Menampilkan riwayat kasus dan sesi konsultasi yang telah dilakukan Masyarakat maupun Mitra Pengacara. |
LiveChatAdminView | View | Menampilkan ruang live chat bagi Masyarakat untuk bertanya dan bagi Admin untuk menjawab pertanyaan. |
PembayaranView | View | Menampilkan pemilihan metode dan konfirmasi pembayaran sesi konsultasi. |
PencairanDanaView | View | Menampilkan formulir pengajuan pencairan dana bagi Mitra Pengacara. |
RegistrasiController | Controller | Mengatur alur pendaftaran akun baru, termasuk validasi data dan pembuatan akun Masyarakat, serta pendaftaran akun dan pengunggahan dokumen legalitas Mitra Pengacara untuk diverifikasi.
AutentikasiController | Controller | Mengelola proses log in dan verifikasi kredensial, dipakai bersama oleh Masyarakat maupun Mitra Pengacara. |
| VerifikasiMitraController | Controller | Mengelola proses verifikasi Mitra Pengacara, mencakup penampilan status bagi Mitra Pengacara maupun peninjauan dan penentuan status oleh Admin berdasarkan dokumen legalitas. |
| ProfilMitraController | Controller | Mengelola pembaruan profil dan dokumen legalitas Mitra Pengacara. |
| SearchLawController | Controller | Memproses permintaan pencarian pasal berdasarkan kata kunci pada basis data peraturan perundang-undangan dalam fitur SearchLaw. |
| PencarianMitraController | Controller | Memproses pencarian dan filter daftar Mitra Pengacara berdasarkan kasus yang dimasukkan Masyarakat dalam fitur HaloLaw. |
| KonsultasiController | Controller | Mengelola pemilihan Mitra Pengacara dan jadwal sesi konsultasi oleh Masyarakat, alur penerimaan sesi oleh Mitra Pengacara, serta berjalannya sesi konsultasi melalui chat yang baru dapat dimulai setelah pembayaran lunas. |
| UlasanController | Controller | Mengelola pengiriman ulasan, feedback, dan rating dari Masyarakat kepada Mitra Pengacara. |
| LaporanController | Controller | Mengatur alur pelaporan pelanggaran akun maupun ulasan (baik oleh Masyarakat maupun Mitra Pengacara), serta memproses tinjauan laporan dan eksekusi pemblokiran akun yang melanggar kebijakan oleh Admin. |
| RiwayatController | Controller | Mengambil dan menyusun data riwayat kasus/konsultasi yang telah dilakukan Masyarakat maupun Mitra Pengacara. |
| LiveChatController | Controller | Mengelola pengiriman dan penerimaan pesan live chat antara Masyarakat dan Admin. |
| PembayaranController | Controller | Memproses transaksi pembayaran sesi konsultasi melalui PaymentGatewayAdapter; pembayaran harus lunas sebagai syarat sebelum sesi chat dibuka. |
| PencairanDanaController | Controller | Memproses permintaan dan validasi pencairan dana Mitra Pengacara ke rekening terdaftar melalui PaymentGatewayAdapter, secara terpisah dan tidak otomatis setelah pembayaran diterima sistem. |
Masyarakat | Model | Menyimpan data akun Masyarakat yang mengajukan kasus, mencari pasal dan mitra, berkonsultasi, membayar, memberi ulasan, dan melapor. |
MitraPengacara | Model | Menyimpan data akun dan profil Mitra Pengacara, mencakup tag keahlian, status verifikasi, status ketersediaan, rating, saldo, dan rekening pencairan. |
Admin | Model | Menyimpan data akun Admin yang memverifikasi Mitra Pengacara, meninjau laporan, memblokir akun, dan melayani live chat. |
Kasus | Model | Menyimpan data kasus/kondisi Masyarakat yang menjadi dasar pencarian dan pemilihan Mitra Pengacara pada fitur HaloLaw, serta dikaitkan dengan sesi konsultasi dan riwayat penanganan. |
DasarHukum | Model | Menyimpan data peraturan dan perundang-undangan (pasal) yang menjadi basis data pencarian pada fitur SearchLaw. |
DokumenLegalitas | Model | Menyimpan berkas dan data legalitas yang diunggah Mitra Pengacara untuk keperluan verifikasi. |
SesiKonsultasi | Model | Menyimpan data sesi konsultasi antara Masyarakat dan Mitra Pengacara beserta status dan waktu mulai/selesai. |
Ulasan | Model | Menyimpan data ulasan berupa teks, foto, dan/atau rating yang diberikan Masyarakat setelah sesi konsultasi, dan ditampilkan pada profil Mitra Pengacara. |
Laporan | Model | Menyimpan data laporan pelanggaran akun maupun ulasan beserta status peninjauannya oleh Admin. |
Pembayaran | Model | Menyimpan data transaksi pembayaran sesi konsultasi, termasuk metode, jumlah, status, dan waktu transaksi. |
LiveChat | Model | Menyimpan data percakapan live chat antara Masyarakat dan Admin. |
| PencairanDana | Model | Menyimpan data transaksi pencairan dana Mitra Pengacara, termasuk jumlah, tanggal, status, dan rekening tujuan. |
| PaymentGatewayAdapter | Integrasi Eksternal | Mengirim permintaan otorisasi ke Payment Gateway pihak ketiga (dummy) untuk pembayaran sesi konsultasi maupun pencairan dana Mitra Pengacara, lalu meneruskan status transaksi ke PembayaranController dan PencairanDanaController. |
| Database | Penyimpanan Data | Menyimpan seluruh data Model secara persisten dan terpusat, diakses oleh seluruh Controller LawHub. |

## 2.4 Model Arsitektur Perangkat Lunak

*Architectural View* adalah bagaimana cara kita melihat/mendeskripsikan arsitektur sebuah sistem dari sudut pandang tertentu. Dalam perancangan arsitektur aplikasi, dibutuhkan *Architectural View* yang dapat mempermudah pemahaman dari proses aplikasi yang akan dikembangkan. Tujuan dari *Architectural View* adalah menjadi bahan komunikasi, pemisahan masalah, mempermudah analisis, dan pemandu saat eksekusi pengembangan sistem tersebut.

### 2.4.1 Logical View

Logical View dipilih karena bertujuan untuk menunjukkan interaksi dan alur pemrosesan antarkomponen arsitektur tingkat tinggi yang masing-masing dapat mewadahi satu atau lebih kelas fungsional. Selain itu, logical View juga mampu memvisualisasikan pemisahan fungsi  MVC, sehingga alur pemrosesan antar-aktor (Masyarakat, Pengacara, Admin) mudah dipahami.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/logical-view-LawHub.webp" width="100%">
</p>
<p align="center">
<i>Gambar 2. Diagram Logical View LawHub</i>
</p>

Diagram dibagi menjadi tiga jalur utama, yaitu View, Controller, dan Model, sesuai dengan penerapan pola arsitektur Model-View-Controller (MVC) yang telah ditetapkan pada BAB 1. Komponen Integrasi Eksternal (PaymentGatewayAdapter) diletakkan di luar jalur utama (sebelah kanan) karena komponen ini bertindak sebagai perantara komunikasi diluar dari sistem dan hanya dipanggil oleh Controller. Komponen Penyimpanan Data (Database) diletakkan di bagian paling bawah sebagai fondasi penyimpanan data keseluruhan.

Seluruh hubungan pada Gambar 2 memiliki hubungan antar komponen sebagai berikut:
1. **View → Controller:**
   - `RegistrasiView` meneruskan input pendaftaran ke `RegistrasiController`.
   - `AutentikasiView` dan `BerandaView` meneruskan permintaan login dan navigasi ke `AutentikasiController`.
   - `StatusVerifikasiMitraView` memanggil `VerifikasiMitraController` untuk peninjauan berkas pendaftaran mitra.
   - `EditProfilMitraPage` memanggil `ProfilMitraController` untuk pembaruan profil dan dokumen.
   - `SearchLawView` memanggil `SearchLawController` untuk pencarian pasal perundang-undangan.
   - `DaftarMitraPengacaraPage` memanggil `PencarianMitraController` untuk memfilter data pengacara.
   - `KonsultasiView` memanggil `KonsultasiController` untuk pemilihan jadwal, penerimaan sesi, dan ruang *chat*.
   - `UlasanView` memanggil `UlasanController` untuk pengiriman *feedback* dan *rating*.
   - `LaporanView` memanggil `LaporanController` untuk pelaporan pelanggaran akun atau ulasan.
   - `HistoryView` memanggil `RiwayatController` untuk memuat riwayat kasus dan transaksi.
   - `LiveChatAdminView` memanggil `LiveChatController` untuk layanan *support*.
   - `PembayaranView` memanggil `PembayaranController` untuk konfirmasi transaksi konsultasi.
   - `PencairanDanaView` memanggil `PencairanDanaController` untuk pengajuan pencairan saldo mitra.

2. **Controller → Model:**
   - `RegistrasiController` mengelola data pada Model `Masyarakat`, `MitraPengacara`, dan `DokumenLegalitas`.
   - `AutentikasiController` mengelola validasi kredensial pada Model `Masyarakat`, `MitraPengacara`, dan `Admin`.
   - `VerifikasiMitraController` dan `ProfilMitraController` mengolah data pada Model `MitraPengacara` dan `DokumenLegalitas`.
   - `SearchLawController` mengakses data pada Model `DasarHukum`.
   - `PencarianMitraController` dan `KonsultasiController` mengolah data pada Model `MitraPengacara`, `Kasus`, dan `SesiKonsultasi`.
   - `UlasanController` memperbarui data pada Model `Ulasan` dan `MitraPengacara`.
   - `LaporanController` mengolah data pada Model `Laporan`, `Ulasan`, `Masyarakat`, dan `MitraPengacara`.
   - `RiwayatController` mengambil data dari Model `SesiKonsultasi`, `Kasus`, dan `Pembayaran`.
   - `LiveChatController` mengelola komunikasi pada Model `LiveChat`, `Admin`, dan `Masyarakat`.
   - `PembayaranController` dan `PencairanDanaController` mengolah data transaksi pada Model `Pembayaran`, `SesiKonsultasi`, `PencairanDana`, dan `MitraPengacara`.

3. **Controller → Integrasi Eksternal:**
   - `PembayaranController` dan `PencairanDanaController` memanggil `PaymentGatewayAdapter` untuk mengirim permintaan otorisasi transaksi finansial dan meneruskan status hasilnya kembali ke sistem.

4. **Penyimpanan Data (Model → Database):**
   - Seluruh Model (`Masyarakat`, `MitraPengacara`, `Admin`, `Kasus`, `DasarHukum`, `DokumenLegalitas`, `SesiKonsultasi`, `Ulasan`, `Laporan`, `Pembayaran`, `LiveChat`, dan `PencairanDana`) akan disimpan datanya pada `Database`.

Gambar 2 adalah contoh *Logical View* dalam bentuk *block diagram*. Seluruh komponen pada Tabel 2.1 digambarkan dan dikelompokkan sesuai pola MVC (*View*, *Controller*, *Model*), ditambah komponen pendukung dan basis data. Sistem di luar P/L, seperti *Payment Gateway (dummy)*, digambarkan dengan garis putus-putus dan tidak perlu dimasukkan ke Tabel 2.1. Setiap garis diberi label: "Memanggil" untuk *View* yang memanggil *Controller*, "akses" untuk *Controller* yang mengakses *Model*, serta agregasi dan komposisi untuk hubungan antar-*Model*.

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

## 3.11 Use Case UC11

**ID Use Case:** UC11  
**Nama Use Case:** Menanggapi Sesi Konsultasi

### 3.11.1 Identifikasi Kelas

Tabel 3.11.1 Identifikasi Kelas Use Case [UC11]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | KonfirmasiKonsultasiPage | KonfirmasiKonsultasiPage |
| 2 | SesiKonsultasiController | SesiKonsultasiController |
| 3 | MitraPengacara | MitraPengacara |
| 4 | SesiKonsultasi | SesiKonsultasi |

### 3.11.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="SD 11" src="./assets/diagram/sequence-diagram-11.png" width="50%">
</p>
<p align="center">
<i>Gambar 35. Sequence Diagram [UC11]</i>
</p>

- **Skenario Alternatif 1: Mitra menolak permintaan konsultasi**

<p align="center">
<img alt="SD 11 alt 1" src="./assets/diagram/sequence-diagram-alt-11-1.png" width="50%">
</p>
<p align="center">
<i>Gambar 36. Sequence Diagram [UC11] - Mitra menolak permintaan konsultasi</i>
</p>

- **Skenario Alternatif 2: Mitra tidak merespon dalam waktu tertentu**

<p align="center">
<img alt="SD 11 alt 2" src="./assets/diagram/sequence-diagram-alt-11-2.png" width="50%">
</p>
<p align="center">
<i>Gambar 37. Sequence Diagram [UC11] - Mitra tidak merespon dalam waktu tertentu</i>
</p>

### 3.11.3 Diagram Kelas

<p align="center">
<img alt="DK 11" src="./assets/diagram/diagram-kelas-11.png" width="35%">
</p>
<p align="center">
<i>Gambar 38. Diagram Kelas Menanggapi Sesi Konsultasi</i>
</p>

## 3.12 Use Case UC12

**ID Use Case:** UC12
**Nama Use Case:** Melakukan Sesi Konsultasi

### 3.12.1 Identifikasi Kelas

Tabel 3.12.1 Identifikasi Kelas Use Case [UC12]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | ChatKonsultasiPage | ChatKonsultasiPage |
| 2 | SesiKonsultasiController | SesiKonsultasiController |
| 3 | Masyarakat | Masyarakat |
| 4 | MitraPengacara | MitraPengacara |
| 5 | Kasus | Kasus |
| 6 | SesiKonsultasi | SesiKonsultasi |
| 7 | Pembayaran | Pembayaran |

### 3.12.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="SD 12" src="./assets/diagram/sequence-diagram-12.png" width="50%">
</p>
<p align="center">
<i>Gambar 39. Sequence Diagram [UC12]</i>
</p>

- **Skenario Alternatif 1: Sesi terputus/salah satu pihak tidak merespon**

<p align="center">
<img alt="SD 12 alt 1" src="./assets/diagram/sequence-diagram-alt-12.png" width="50%">
</p>
<p align="center">
<i>Gambar 40. Sequence Diagram [UC12] - Sesi terputus/salah satu pihak tidak merespon</i>
</p>

### 3.12.3 Diagram Kelas

<p align="center">
<img alt="DK 12" src="./assets/diagram/diagram-kelas-12.png" width="35%">
</p>
<p align="center">
<i>Gambar 41. Diagram Kelas Melakukan Sesi Konsultasi</i>
</p>

## 3.13 Use Case UC13

**ID Use Case:** UC13
**Nama Use Case:** Memberi Ulasan, Feedback, dan/atau Rating

### 3.13.1 Identifikasi Kelas

Tabel 3.13.1 Identifikasi Kelas Use Case [UC13]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | UlasanPage | UlasanPage |
| 2 | UlasanController | UlasanController |
| 3 | Masyarakat | Masyarakat |
| 4 | Ulasan | Ulasan |

### 3.13.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="SD 13" src="./assets/diagram/sequence-diagram-13.png" width="50%">
</p>
<p align="center">
<i>Gambar 42. Sequence Diagram [UC13]</i>
</p>

- **Skenario Alternatif 1: Gagal mengirim ulasan**

<p align="center">
<img alt="SD 13 alt 1" src="./assets/diagram/sequence-diagram-alt-13.png" width="50%">
</p>
<p align="center">
<i>Gambar 43. Sequence Diagram [UC13] - Gagal mengirim ulasan</i>
</p>

### 3.13.3 Diagram Kelas

<p align="center">
<img alt="DK 13" src="./assets/diagram/diagram-kelas-13.png" width="35%">
</p>
<p align="center">
<i>Gambar 44. Diagram Kelas Memberi Ulasan, Feedback, dan/atau Rating</i>
</p>

## 3.14 Use Case UC14

**ID Use Case:** UC14
**Nama Use Case:** Melaporkan Pelanggaran Akun

### 3.14.1 Identifikasi Kelas

Tabel 3.14.1 Identifikasi Kelas Use Case [UC14]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | LaporanAkunPage | LaporanAkunPage |
| 2 | LaporanController | LaporanController |
| 3 | Masyarakat | Masyarakat |
| 4 | Laporan | Laporan |

### 3.14.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="SD 14" src="./assets/diagram/sequence-diagram-14.png" width="50%">
</p>
<p align="center">
<i>Gambar 45. Sequence Diagram [UC14]</i>
</p>

- **Skenario Alternatif 1: Formulir laporan tidak lengkap**

<p align="center">
<img alt="SD 14 alt 1" src="./assets/diagram/sequence-diagram-alt-14.png" width="50%">
</p>
<p align="center">
<i>Gambar 46. Sequence Diagram [UC14] - Formulir laporan tidak lengkap</i>
</p>

### 3.14.3 Diagram Kelas

<p align="center">
<img alt="DK 14" src="./assets/diagram/diagram-kelas-14.png" width="35%">
</p>
<p align="center">
<i>Gambar 47. Diagram Kelas Melaporkan Pelanggaran Akun</i>
</p>

## 3.15 Use Case UC15

**ID Use Case:** UC15
**Nama Use Case:** Melaporkan Pelanggaran

### 3.15.1 Identifikasi Kelas

Tabel 3.15.1 Identifikasi Kelas Use Case [UC15]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | LaporanAkunPage | LaporanAkunPage |
| 2 | LaporanController | LaporanController |
| 3 | Masyarakat | Masyarakat |
| 4 | Laporan | Laporan |
| 5 | Mitra Pengacara | Mitra Pengacara |

### 3.15.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="SD 15" src="./assets/diagram/sequence-diagram-15.png" width="50%">
</p>
<p align="center">
<i>Gambar 48. Sequence Diagram [UC15]</i>
</p>

- **Skenario Alternatif 1: Formulir laporan tidak lengkap**

<p align="center">
<img alt="SD 15 alt 1" src="./assets/diagram/sequence-diagram-alt-15.png" width="50%">
</p>
<p align="center">
<i>Gambar 49. Sequence Diagram [UC15] - Formulir laporan tidak lengkap</i>
</p>

### 3.15.3 Diagram Kelas

<p align="center">
<img alt="DK 15" src="./assets/diagram/diagram-kelas-15.png" width="35%">
</p>
<p align="center">
<i>Gambar 50. Diagram Kelas Melaporkan Pelanggara</i>
</p>

## 3.16 Use Case UC16

**ID Use Case:** UC16
**Nama Use Case:** Melaporkan Ulasan

### 3.16.1 Identifikasi Kelas

Tabel 3.16. Identifikasi Kelas Use Case [UC16]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | LaporanUlasanPage | LaporanView |
| 2 | LaporanController| LaporanController | 
| 3 | Laporan | Laporan |
| 4 | Ulasan | Alasan |

### 3.16.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC16" src="./assets/diagram/sequence-diagram-16.webp" width="50%">
</p>
<p align="center">
<i>Gambar 48. Sequence Diagram UC16</i>
</p>

- **Skenario Alternatif 1 : Formulir Laporan Tidak Lengkap**

<p align="center">
<img alt="Sequence Diagram UC16 Alternatif" src="./assets/diagram/sequence-diagram-alt-16.webp" width="50%">
</p>
<p align="center">
<i>Gambar 49. Sequence Diagram UC16 - formulir tidak lengkap</i>
</p>

### 3.16.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC16" src="./assets/diagram/diagram-kelas-16.webp" width="35%">
</p>
<p align="center">
<i>Gambar 50. Diagram Kelas Melaporkan Ulasan</i>
</p>

## 3.17 Use Case UC17

**ID Use Case:** UC17
**Nama Use Case:** Memblokir Akun

### 3.17.1 Identifikasi Kelas

Tabel 3.17. Identifikasi Kelas Use Case [UC17]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | TinjauanPage | LaporanView |
| 2 | ModerasiAkunController| LaporanController | 
| 3 | Admin | Admin |
| 4 | Laporan | Laporan |

### 3.17.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC17" src="./assets/diagram/sequence-diagram-17.webp" width="50%">
</p>
<p align="center">
<i>Gambar 51. Sequence Diagram UC17</i>
</p>

- **Skenario Alternatif 1 : Laporan Tidak Disetujui Admin**

<p align="center">
<img alt="Sequence Diagram UC17 Alternatif" src="./assets/diagram/sequence-diagram-alt-17.webp" width="50%">
</p>
<p align="center">
<i>Gambar 52. Sequence Diagram UC17 - laporan tidak disetujui admin</i>
</p>

### 3.17.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC17" src="./assets/diagram/diagram-kelas-17.webp" width="35%">
</p>
<p align="center">
<i>Gambar 53. Diagram Kelas Memblokir Akun</i>
</p>

## 3.18 Use Case UC18

**ID Use Case:** UC18
**Nama Use Case:** Melihat Riwayat Penanganan

### 3.18.1 Identifikasi Kelas

Tabel 3.18. Identifikasi Kelas Use Case [UC18]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HistoryPage | HistoryView |
| 2 | RiwayatController | RiwayatController |
| 3 | Masyarakat | Masyarakat | 
| 4 | MitraPengacara | MitraPengacara |
| 5 | Kasus | Kasus |
| 6 | SesiKonsultasi | SesiKonsultasi |

### 3.18.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC17" src="./assets/diagram/sequence-diagram-18.webp" width="50%">
</p>
<p align="center">
<i>Gambar 54. Sequence Diagram UC18</i>
</p>

- **Skenario Alternatif 1 : Laporan Tidak Disetujui Admin**

<p align="center">
<img alt="Sequence Diagram UC18 Alternatif" src="./assets/diagram/sequence-diagram-alt-18.webp" width="50%">
</p>
<p align="center">
<i>Gambar 55. Sequence Diagram UC18 - laporan tidak disetujui admin</i>
</p>

### 3.18.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC17" src="./assets/diagram/diagram-kelas-18.webp" width="35%">
</p>
<p align="center">
<i>Gambar 56. Diagram Kelas Melihat Riwayat Penanganan</i>
</p>

## 3.19 Use Case UC19

**ID Use Case:** UC19
**Nama Use Case:** Live Chat dengan Admin

### 3.19.1 Identifikasi Kelas

Tabel 3.19. Identifikasi Kelas Use Case [UC19 & UC20]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | LiveChatMasyarakatPage | LiveChatView | 
| 2 | LiveChatController | LiveChatController | 
| 3 | Masyarakat | Masyarakat |
| 4 | Admin | Admin |
| 5 | LiveChat | LiveChat |

### 3.19.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC19 & UC20" src="./assets/diagram/sequence-diagram-19-20.webp" width="50%">
</p>
<p align="center">
<i>Gambar 57. Sequence Diagram UC19 & UC20</i>
</p>

- **Skenario Alternatif 1 : Tidak Ada Admin yang Tersedia

<p align="center">
<img alt="Sequence Diagram UC19 Alternatif" src="./assets/diagram/sequence-diagram-alt-19-20.webp" width="50%">
</p>
<p align="center">
<i>Gambar 58. Sequence Diagram UC1 & UC20 - tidak ada admin yang standby</i>
</p>

### 3.19.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC19" src="./assets/diagram/diagram-kelas-19.webp" width="35%">
</p>
<p align="center">
<i>Gambar 59. Diagram Kelas Live Chat Masyarakat</i>
</p>

<p align="center">
<img alt="Diagram Kelas UC20" src="./assets/diagram/diagram-kelas-20.webp" width="35%">
</p>
<p align="center">
<i>Gambar 60. Diagram Kelas Live Chat Admin</i>
</p>

<br>


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

---

# BAB 5: Perancangan Rinci Kelas

Bagian ini diisi dengan daftar seluruh kelas dalam tabel berikut:

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| ... | *...* | *...* |

Untuk **setiap kelas**, identifikasi operasi berdasarkan tanggung jawab kelas beserta *visibility*-nya, serta atribut beserta *visibility* dan tipenya. Buat subbab tersendiri untuk setiap kelas.

## 5.1 Kelas RegistrasiMasyarakatPage

**Nama Kelas:** *RegistrasiMasyarakatPage*  
**ID Kelas:** *C01*

Tabel 5.1.1. Operasi Kelas RegistrasiMasyarakatPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *bukaFormRegistrasi(): void* | *public* | *menampilkan antarmuka formulir registrasi masyarakat.* |
| *submitRegistrasi(nama: String, nomorInduk: String, email: String, sandi: String): void* | *public* | *Mengirimkan data registrasi masyarakat ke controller untuk diproses.* |
| *tampilkanPesanSukses(): void* | *public* | *Menampilkan notifikasi bahwa registrasi akun berhasil.* |
| *tampilkanPesanError(pesan: String): void* | *public* | *Menampilkan notifikasi kesalahan input atau kegagalan registrasi.* |

Tabel 5.1.2. Atribut Kelas RegistrasiMasyarakatPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *tombolRegistrasi* | *private* | *Button* |
| *inputNama* | *private* | *String* |
| *inputNomorInduk* | *private* | *String* |
| *inputEmail* | *private* | *String* |
| *inputSandi* | *private* | *String* |


### 5.1.1 Algoritma/Query

**Nama Kelas:** *RegistrasiMasyarakatPage*  
**Nama Operasi:** *sumbitRegistrasi(nama: String, nomorInduk: String, email: String, sandi: String): void*  
**ID Algoritma:** *[Algo-001]*

```text
PROCEDURE submitRegistrasi(nama: String, nomorInduk: String, email: String, sandi: String)
    IF nama isEmpty OR nomorInduk isEmpty OR email isEmpty OR sandi isEmpty THEN
        tampilkanPesanError("Semua field formulir registrasi wajib diisi.")
        RETURN
    END IF

    berhasil <- RegistrasiMasyarakatController.buatAkun(nama, nomorInduk, email, sandi)
    IF berhasil = true THEN
        tampilkanPesanSukses()
    ELSE
        tampilkanPesanError("Registrasi gagal. Email sudah terdaftar atau kata sandi terlalu lemah.")
    END IF
END PROCEDURE
```


## 5.2 Kelas LoginMasyarakatPage

**Nama Kelas:** *LoginMasyarakatPage*  
**ID Kelas:** *C02*

Tabel 5.2.1. Operasi Kelas LoginMasyarakatPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *bukaFormLogin(): void* | *public* | *menampilkan antarmuka formulir login masyarakat.* |
| *submitVerifikasi(email: String, sandi: String): void* | *public* | *Mengirim kredensial login ke controller untuk diautentikasi.* |
| *arahkanKeBeranda(): void* | *public* | *Mengarahkan tampilan ke halaman beranda (BerandaPage / C03) setelah login berhasil.* |
| *tampilkanPesanError(pesan: String): void* | *public* | *Menampilkan notifikasi kegalalan login.* |

Tabel 5.2.2. Atribut Kelas LoginMasyarakatPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *tombolLogin* | *private* | *Button* |
| *inputKredensial* | *private* | *String* |

### 5.2.1 Algoritma/Query

**Nama Kelas:** *LoginMasyarakatPage*  
**Nama Operasi:** *sumbitVerifikasi(email: String, sandi: String): void*  
**ID Algoritma:** *[Algo-002]*

```text
PROCEDURE submitVerifikasi(email: String, sandi: String)
    IF email isEmpty OR sandi isEmpty THEN
        tampilkanPesanError("Email dan password wajib diisi.")
        RETURN
    END IF

    statusLogin <- AutentikasiController.validasiData(email, sandi)
    IF statusLogin = true THEN
        arahkanKeBeranda()
    ELSE
        tampilkanPesanError("Email/password salah atau akun tidak ditemukan.")
    END IF
END PROCEDURE
```


## 5.3 Kelas BerandaPage

**Nama Kelas:** *BerandaPage*  
**ID Kelas:** *C03*

Tabel 5.3.1. Operasi Kelas BerandaPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanBeranda(): void* | *public* | *Menampilkan halaman utama dengan pilihan fitur HaloLaw dan SearchLaw..* |
| *pilihFitur(namaFitur: String): void* | *public* | *Mengarahkan masyarakat ke modul fitur yang dipilih.* |

Tabel 5.3.2. Atribut Kelas BerandaPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *pilihanFitur* | *private* | *String* |

### 5.3.1 Algoritma/Query

**Nama Kelas:** *BerandaPage*  
**Nama Operasi:** *pilihFitur(namaFitur: String): void*  
**ID Algoritma:** *[Algo-003]*

```text
PROCEDURE pilihFitur(namaFitur: String)
    IF namaFitur = "HaloLaw" THEN
        arahkanKeLamanDaftarMitra()
    ELSE IF namaFitur = "SearchLaw" THEN
        arahkanKeLamanSearchLaw()
    ELSE
        tampilkanPesanError("Fitur tidak valid.")
    END IF
END PROCEDURE
```


## 5.4 Kelas RegistrasiMitraPage

**Nama Kelas:** *RegistrasiMitraPage*  
**ID Kelas:** *C04*

Tabel 5.4.1. Operasi Kelas RegistrasiMitraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *bukaFormRegistrasiMitra(): void* | *public* | *Menampilkan antarmuka pendaftaran akun dan pengunggahan berkas bagi mitra pengacara.* |
| *submitRegistrasi(nama: String, email: String, sandi: String, dokumen: File): void* | *public* | *Mengirimkan data registrasi dan dokumen legalitas mitra ke controller.* |

Tabel 5.4.2. Atribut Kelas RegistrasiMitraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *tombolRegistrasi* | *private* | *Button* |
| *inputDokumen* | *private* | *File* |

### 5.4.1 Algoritma/Query

**Nama Kelas:** *RegistrasiMitraPage*  
**Nama Operasi:** *submitRegistrasi(nama: String, email: String, sandi: String, dokumen: File): void*  
**ID Algoritma:** *[Algo-004]*

```text
PROCEDURE submitRegistrasi(nama: String, email: String, sandi: String, dokumen: File)
    IF nama isEmpty OR email isEmpty OR sandi isEmpty OR dokumen isNull THEN
        tampilkanPesanError("Semua field data diri dan berkas legalitas wajib diisi.")
        RETURN
    END IF

    berhasil <- RegistrasiMitraController.buatAkunBaru(nama, email, sandi, dokumen)
    IF berhasil = true THEN
        tampilkanNotifikasiPending() 
    ELSE
        tampilkanPesanError("Pendaftaran gagal. Periksa format berkas atau lengkapi field yang diminta.")
    END IF
END PROCEDURE
```


## 5.5 Kelas LoginMitraPage

**Nama Kelas:** *LoginMitraPage*  
**ID Kelas:** *C05*

Tabel 5.5.1. Operasi Kelas LoginMitraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *submitVerifikasi(email: String, sandi: String): void* | *public* | *Mengirimkan kredensial login mitra ke controller* |
| *tampilkanPesanError(pesan: String): void* | *public* | *Menampilkan peringatan kesalahan login atau status akun belum disetujui.* |

Tabel 5.5.2. Atribut Kelas LoginMitraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *tombolVerifikasi* | *private* | *Button* |
| *inputKredensial* | *private* | *String* |

### 5.5.1 Algoritma/Query

**Nama Kelas:** *LoginMitraPage*  
**Nama Operasi:** *submitVerifikasi(email: String, sandi: String): void*  
**ID Algoritma:** *[Algo-005]*

```text
PROCEDURE submitVerifikasi(email: String, sandi: String)
    IF email isEmpty OR sandi isEmpty THEN
        tampilkanPesanError("Email dan password wajib diisi.")
        RETURN
    END IF

    statusLogin <- AutentikasiController.validasiData(email, sandi)
    IF statusLogin = true THEN
        arahkanKeHalamanMitra()
    ELSE
        tampilkanPesanError("email/password salah atau akun mitra belum terverifikasi oleh Admin.")
    END IF
END PROCEDURE
```


## 5.6 Kelas StatusVerifikasiMitraPage

**Nama Kelas:** *StatusVerifikasiMitraPage*  
**ID Kelas:** *C06*

Tabel 5.6.1. Operasi Kelas StatusVerifikasiMitraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *infoStatus(idMitra: String): void* | *public* | *Meminta dan menampilkan status verifikasi akun pendaftaran mitra terkini.* |

Tabel 5.6.2. Atribut Kelas StatusVerifikasiMitraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *status* | *private* | *String* |

### 5.6.1 Algoritma/Query

**Nama Kelas:** *StatusVerifikasiMitraPage*  
**Nama Operasi:** *infoStatus(idMitra: String): void*  
**ID Algoritma:** *[Algo-006]*

```text
PROCEDURE infoStatus(idMitra: String)
    statusAkun <- VerifikasiMitraController.validasiData(idMitra)
    IF statusAkun IS NULL THEN
        tampilkanPesanError("Data pengajuan pendaftaran tidak ditemukan.")
    ELSE
        tampilkanStatusPadaLayar(statusAkun)
    END IF
END PROCEDURE
```


## 5.7 Kelas VerifikasiMitraPage

**Nama Kelas:** *VerifikasiMitraPage*  
**ID Kelas:** *C07*

Tabel 5.7.1. Operasi Kelas VerifikasiMitraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *ubahStatus(idMitra: String, statusBaru: String, catatan: String): void* | *public* | *Mengubah status verifikasi pendaftar mitra berdasarkan keputusan peninjauan admin.* |

Tabel 5.7.2. Atribut Kelas VerifikasiMitraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *status* | *private* | *String* |

### 5.7.1 Algoritma/Query

**Nama Kelas:** *VerifikasiMitraPage*  
**Nama Operasi:** *ubahStatus(idMitra: String, statusBaru: String, catatan: String): void*  
**ID Algoritma:** *[Algo-007]*

```text
PROCEDURE ubahStatus(idMitra: String, statusBaru: String, catatan: String)
    berhasil <- VerifikasiMitraController.updateStatusVerifikasi(idMitra, statusBaru, catatan)
    IF berhasil = true THEN
        tampilkanNotifikasi("Status verifikasi pendaftar berhasil diperbarui.")
        perbaruiDaftarPengajuanAdmin()
    ELSE
        tampilkanPesanError("Gagal memperbarui status verifikasi.")
    END IF
END PROCEDURE
```


## 5.8 Kelas EditProfilMitraPage

**Nama Kelas:** *EditProfilMitraPage*  
**ID Kelas:** *C08*

Tabel 5.8.1. Operasi Kelas EditProfilMitraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *validasiData(inputKredensial: String, tagKeahlian: String): Boolean* | *public* | *Memeriksa keabsahan data profil dan tag keahlian sebelum disimpan.* |

Tabel 5.8.2. Atribut Kelas EditProfilMitraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *inputKredensial* | *private* | *String* |

### 5.8.1 Algoritma/Query

**Nama Kelas:** *EditProfilMitraPage*  
**Nama Operasi:** *validasiData(inputKredensial: String, tagKeahlian: String): Boolean*  
**ID Algoritma:** *[Algo-008]*

```text
FUNCTION validasiData(inputKredensial: String, tagKeahlian: String): Boolean
    IF inputKredensial isEmpty THEN
        tampilkanPesanError("Deskripsi profil atau identitas tidak boleh kosong.")
        RETURN false
    END IF

    IF tagKeahlian isEmpty THEN
        tampilkanPesanError("Pilih minimal satu tag keahlian spesialisasi.")
        RETURN false
    END IF

    RETURN true
END FUNCTION
```


## 5.9 EditDokumenLegalitasPage

**Nama Kelas:** EditDokumenLegalitasPage
**ID Kelas:** C09

Tabel 5.9.1. Operasi Kelas EditDokumenLegalitasPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiData(inputDokumen: String): Boolean | public | Memeriksa dokumen legalitas yang diunggah mitra pengacara (tidak kosong, format dan ukuran sesuai ketentuan) sebelum dokumen diteruskan untuk disimpan dan diverifikasi ulang oleh admin. Mengembalikan true jika valid dan false jika tidak. |

Tabel 5.9.2. Atribut Kelas EditDokumenLegalitasPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| inputDokumen | private | String |

### 5.9.1 Algoritma/Query

**Nama Kelas:** EditDokumenLegalitasPage
**Nama Operasi:** validasiData(inputDokumen: String): Boolean
**ID Algoritma:** Algo-009

```text
FUNCTION validasiData(inputDokumen: String): Boolean
    IF inputDokumen IS NULL OR inputDokumen IS EMPTY THEN
        tampilkanPesanError("Dokumen legalitas belum dipilih.")
        RETURN false
    ELSE IF formatFile(inputDokumen) NOT IN FORMAT_DIIZINKAN THEN
        tampilkanPesanError("Format dokumen tidak didukung.")
        RETURN false
    ELSE IF ukuranFile(inputDokumen) > UKURAN_MAKS THEN
        tampilkanPesanError("Ukuran dokumen melebihi batas.")
        RETURN false
    ELSE
        RETURN true
    END IF
END FUNCTION
```


## 5.10 SearchLawPage

**Nama Kelas:** SearchLawPage
**ID Kelas:** C10

Tabel 5.10.1. Operasi Kelas SearchLawPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| cariPasal(kataKunci: String): void | public | Menerima kata kunci dari masyarakat saat tombol cari ditekan, meneruskannya ke SearchLawController, lalu menampilkan daftar pasal yang relevan atau pesan bahwa pasal tidak ditemukan. |

Tabel 5.10.2. Atribut Kelas SearchLawPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| tombolCari | private | Boolean |
| infoPasal | private | List<DasarHukum> |

### 5.10.1 Algoritma/Query

**Nama Kelas:** SearchLawPage
**Nama Operasi:** cariPasal(kataKunci: String): void
**ID Algoritma:** Algo-010

```text
PROCEDURE cariPasal(kataKunci: String)
    IF kataKunci IS NULL OR kataKunci IS EMPTY THEN
        tampilkanPesanError("Masukkan minimal satu kata kunci.")
    ELSE
        infoPasal <- SearchLawController.validasiData(kataKunci)
        IF infoPasal IS NULL OR infoPasal IS EMPTY THEN
            tampilkanPesanError("Tidak ditemukan pasal yang sesuai. Coba gunakan kata kunci lain.")
        ELSE
            tampilkanDaftarPasal(infoPasal)
        END IF
    END IF
END PROCEDURE
```


## 5.11 DaftarMitraPengacaraPage

**Nama Kelas:** DaftarMitraPengacaraPage
**ID Kelas:** C11

Tabel 5.11.1. Operasi Kelas DaftarMitraPengacaraPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| inputPencarian(kataKunciKasus: String, filterKeahlian: String): void | public | Menerima kata kunci kasus dan filter keahlian dari masyarakat, meneruskannya ke PencarianMitraController, lalu menampilkan hasilnya atau pesan bahwa tidak ada mitra yang sesuai. |
| tampilkanDaftarMitra(daftarMitra: List<MitraPengacara>): void | public | Menampilkan daftar mitra pengacara beserta profil dan ulasannya pada layar. |

Tabel 5.11.2. Atribut Kelas DaftarMitraPengacaraPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| kataKunciKasus | private | String |
| filterKeahlian | private | String |

### 5.11.1 Algoritma/Query

**Nama Kelas:** DaftarMitraPengacaraPage
**Nama Operasi:** inputPencarian(kataKunciKasus: String, filterKeahlian: String): void
**ID Algoritma:** Algo-011-1

```text
PROCEDURE inputPencarian(kataKunciKasus: String, filterKeahlian: String)
    daftarMitra <- PencarianMitraController.cariMitraSesuaiKasus(kataKunciKasus)
    IF filterKeahlian IS NOT NULL THEN
        daftarMitra <- PencarianMitraController.terapkanFilter(daftarMitra, filterKeahlian)
    END IF
    IF daftarMitra IS NULL OR daftarMitra IS EMPTY THEN
        tampilkanPesanError("Tidak ada mitra pengacara yang sesuai. Ubah atau hapus filter, atau gunakan kata kunci lain.")
    ELSE
        tampilkanDaftarMitra(daftarMitra)
    END IF
END PROCEDURE
```

**Nama Operasi:** tampilkanDaftarMitra(daftarMitra: List<MitraPengacara>): void
**ID Algoritma:** Algo-011-2

```text
PROCEDURE tampilkanDaftarMitra(daftarMitra: List<MitraPengacara>)
    FOR EACH mitra IN daftarMitra DO
        profil <- MitraPengacara.infoProfil(mitra.idMitra)
        ulasan <- Ulasan.infoDataUlasan(mitra.idMitra)
        tampilkanKartuMitra(profil, ulasan)
    END FOR
END PROCEDURE
```


## 5.12 PemilihanJadwalKonsultasiPage

**Nama Kelas:** PemilihanJadwalKonsultasiPage
**ID Kelas:** C12

Tabel 5.12.1. Operasi Kelas PemilihanJadwalKonsultasiPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| pilihMitra(pilihanMitra: String): void | public | Menyimpan mitra pengacara yang dipilih masyarakat ke atribut pilihanMitra, lalu menampilkan jadwal ketersediaan mitra tersebut atau pesan bahwa jadwal penuh. |
| pilihJadwal(pilihanTanggal: Date, pilihanWaktu: Time): void | public | Menyimpan jadwal yang dipilih ke atribut pilihanTanggal dan pilihanWaktu, lalu mengirim permintaan sesi konsultasi ke PenjadwalanKonsultasiController untuk mitra yang sudah dipilih. Menampilkan notifikasi jika berhasil, atau pesan error jika jadwal tidak tersedia. |

Tabel 5.12.2. Atribut Kelas PemilihanJadwalKonsultasiPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| pilihanMitra | private | String |
| pilihanTanggal | private | Date |
| pilihanWaktu | private | Time |

### 5.12.1 Algoritma/Query

**Nama Kelas:** PemilihanJadwalKonsultasiPage
**Nama Operasi:** pilihMitra(pilihanMitra: String): void
**ID Algoritma:** Algo-012-1

```text
PROCEDURE pilihMitra(pilihanMitra: String)
    jadwalTersedia <- PenjadwalanKonsultasiController.validasiJadwal(pilihanMitra)
    IF jadwalTersedia IS NULL OR jadwalTersedia IS EMPTY THEN
        tampilkanPesanError("Tidak ada jadwal tersedia. Silakan pilih mitra pengacara lain.")
    ELSE
        tampilkanJadwalTersedia(jadwalTersedia)
    END IF
END PROCEDURE
```

**Nama Operasi:** pilihJadwal(pilihanTanggal: Date, pilihanWaktu: Time): void
**ID Algoritma:** Algo-012-2

```text
PROCEDURE pilihJadwal(pilihanTanggal: Date, pilihanWaktu: Time)
    idMasyarakat <- ambilIdPenggunaLogin()
    berhasil <- PenjadwalanKonsultasiController.buatSesiKonsultasi(idMasyarakat, pilihanMitra, pilihanTanggal, pilihanWaktu)
    IF berhasil = true THEN
        tampilkanNotifikasi("Permintaan konsultasi berhasil dikirim. Menunggu tanggapan mitra pengacara.")
    ELSE
        tampilkanPesanError("Jadwal yang dipilih tidak tersedia. Silakan pilih jadwal lain.")
    END IF
END PROCEDURE
```


## 5.13 KonfirmasiKonsultasiPage

**Nama Kelas:** KonfirmasiKonsultasiPage
**ID Kelas:** C13

Tabel 5.13.1. Operasi Kelas KonfirmasiKonsultasiPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| klikKonfirmasi(terima: Boolean): Boolean | public | Mengirim tanggapan mitra pengacara (true = terima, false = tolak) beserta catatanKonfirmasi ke SesiKonsultasiController. Mengembalikan true jika tanggapan berhasil diproses. |
| tampilkanPermintaanJadwal(): void | public | Menampilkan detail permintaan sesi konsultasi (masyarakat, jadwal, ringkasan masalah) yang dibuka mitra pengacara dari notifikasi. |

Tabel 5.13.2. Atribut Kelas KonfirmasiKonsultasiPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| pilihanKonfirmasi | private | String |
| catatanKonfirmasi | private | String |

### 5.13.1 Algoritma/Query

**Nama Kelas:** KonfirmasiKonsultasiPage
**Nama Operasi:** klikKonfirmasi(terima: Boolean): Boolean
**ID Algoritma:** Algo-013-1

```text
FUNCTION klikKonfirmasi(terima: Boolean): Boolean
    idSesi <- ambilIdSesiDariNotifikasi()
    IF terima = true THEN
        pilihanKonfirmasi <- "terima"
        statusBaru <- "terjadwal"
    ELSE
        pilihanKonfirmasi <- "tolak"
        statusBaru <- "dibatalkan"
    END IF
    berhasil <- SesiKonsultasiController.prosesKonfirmasiJadwal(idSesi, statusBaru, catatanKonfirmasi)
    IF berhasil = true THEN
        tampilkanNotifikasi("Tanggapan permintaan konsultasi berhasil dikirim.")
    ELSE
        tampilkanPesanError("Gagal memproses tanggapan permintaan konsultasi.")
    END IF
    RETURN berhasil
END FUNCTION
```

Tabel 5.13.1. Query Operasi tampilkanDaftarMitra

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |


## 5.14 ChatKonsultasiPage

**Nama Kelas:** ChatKonsultasiPage
**ID Kelas:** C14

Tabel 5.14.1. Operasi Kelas ChatKonsultasiPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| kirimPesan(): void | public | Memastikan pembayaran sesi sudah lunas, lalu mengirim isi pesanInput (dan lampiranFile jika ada) ke SesiKonsultasiController dan menampilkan pesan terkini. |
| tampilkanPesanTerkini(): void | public | Mengambil dan menampilkan pesan terbaru pada sesi chat yang sedang aktif secara berurutan. |

Tabel 5.14.2. Atribut Kelas ChatKonsultasiPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| pesanInput | private | String |
| lampiranFile | private | String |

### 5.14.1 Algoritma/Query

**Nama Kelas:** ChatKonsultasiPage
**Nama Operasi:** kirimPesan(): void
**ID Algoritma:** Algo-014-1

```text
PROCEDURE kirimPesan()
    idSesi <- ambilIdSesiAktif()
    idPengirim <- ambilIdPenggunaLogin()
    lunas <- SesiKonsultasiController.validasiStatusPembayaran(idSesi)
    IF lunas = false THEN
        tampilkanPesanError("Pembayaran sesi konsultasi belum lunas. Chat belum dapat dibuka.")
    ELSE IF pesanInput IS EMPTY AND lampiranFile IS NULL THEN
        tampilkanPesanError("Pesan tidak boleh kosong.")
    ELSE
        SesiKonsultasiController.kelolaPesanChat(idSesi, idPengirim, pesanInput, lampiranFile)
        tampilkanPesanTerkini()
    END IF
END PROCEDURE
```

**Nama Operasi:** tampilkanPesanTerkini(): void
**ID Algoritma:** Algo-014-2

```text
PROCEDURE tampilkanPesanTerkini()
    idSesi <- ambilIdSesiAktif()
    daftarPesan <- SesiKonsultasiController.kelolaPesanChat(idSesi, NULL, NULL, NULL)
    FOR EACH pesan IN daftarPesan DO
        tampilkanBalonPesan(pesan)
    END FOR
    gulirKePesanTerbaru()
END PROCEDURE
```


## 5.15 UlasanPage

**Nama Kelas:** UlasanPage
**ID Kelas:** C15

Tabel 5.15.1. Operasi Kelas UlasanPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| isiFormUlasan(): void | public | Menampilkan formulir ulasan setelah sesi konsultasi selesai, lalu menyimpan isian masyarakat ke atribut inputRating dan inputTeksUlasan. |
| kirimUlasan(): Boolean | public | Memverifikasi isian formulir, meneruskan data ke UlasanController.simpanUlasanBaru() jika valid, lalu menampilkan notifikasi berhasil dikirim. Jika tidak valid, menampilkan pesan error pada field yang bermasalah dan mengembalikan false. |

Tabel 5.15.2. Atribut Kelas UlasanPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| inputRating | private | Integer |
| inputTeksUlasan | private | String |

### 5.15.1 Algoritma/Query

**Nama Kelas:** UlasanPage
**Nama Operasi:** isiFormUlasan(): void
**ID Algoritma:** Algo-015-1

```text
PROCEDURE isiFormUlasan()
    idSesi <- ambilIdSesiAktif()
    tampilkanFormulirUlasan(idSesi)
    inputRating <- nilai rating dari masyarakat
    inputTeksUlasan <- teks ulasan dari masyarakat
END PROCEDURE
```

**Nama Operasi:** kirimUlasan(): Boolean
**ID Algoritma:** Algo-015-2

```text
FUNCTION kirimUlasan(): Boolean
    idSesi <- ambilIdSesiAktif()
    IF inputRating IS NULL THEN
        tampilkanPesanError("Rating belum diisi.")
        RETURN false
    ELSE
        berhasil <- UlasanController.simpanUlasanBaru(idSesi, inputRating, inputTeksUlasan)
        IF berhasil = true THEN
            tampilkanNotifikasi("Ulasan berhasil dikirim.")
        ELSE
            tampilkanPesanError("Gagal mengirim ulasan.")
        END IF
        RETURN berhasil
    END IF
END FUNCTION
```


## 5.16 LaporanAkunPage

**Nama Kelas:** LaporanAkunPage
**ID Kelas:** C16

Tabel 5.16.1. Operasi Kelas LaporanAkunPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| isiFormLaporan(): void | public | Menampilkan formulir laporan pelanggaran (kategori pelanggaran, deskripsi, bukti pendukung) bagi masyarakat (UC14) dan menyimpan isiannya ke atribut kelas. |
| kirimLaporan(): Boolean | public | Memverifikasi kelengkapan formulir dan bukti, lalu membuat laporan baru melalui LaporanController (UC14). Menampilkan notifikasi berhasil atau pesan error, dan mengembalikan true jika laporan berhasil dibuat. |
| buatFormLaporan(): void | public | Menampilkan formulir laporan pelanggaran bagi mitra pengacara (UC15) dan menyimpan isiannya ke atribut kelas. |
| submitLaporan(): Boolean | public | Memverifikasi kelengkapan formulir dan meneruskannya ke LaporanController untuk diproses (UC15). Menampilkan notifikasi berhasil atau pesan error, dan mengembalikan true jika berhasil. |

Tabel 5.16.2. Atribut Kelas LaporanAkunPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| kategoriPelanggaran | private | String |
| teksAlasan | private | String |
| buktiLampiran | private | String |
| idLaporan | private | String |

### 5.16.1 Algoritma/Query

**Nama Kelas:** LaporanAkunPage
**Nama Operasi:** isiFormLaporan(): void
**ID Algoritma:** Algo-016-1

```text
PROCEDURE isiFormLaporan()
    tampilkanFormulirLaporan()
    kategoriPelanggaran <- kategori dari pelapor
    teksAlasan <- deskripsi dari pelapor
    buktiLampiran <- bukti dari pelapor
END PROCEDURE
```

**Nama Operasi:** kirimLaporan(): Boolean
**ID Algoritma:** Algo-016-2

```text
FUNCTION kirimLaporan(): Boolean
    idPelapor <- ambilIdPenggunaLogin()
    idTerlapor <- ambilIdTerlaporDariSesi()
    IF kategoriPelanggaran IS NULL OR teksAlasan IS NULL OR teksAlasan IS EMPTY THEN
        tampilkanPesanError("Lengkapi kategori pelanggaran dan deskripsi laporan.")
        RETURN false
    ELSE
        buktiValid <- LaporanController.validasiBuktiLaporan(buktiLampiran)
        IF buktiValid = false THEN
            tampilkanPesanError("Bukti pendukung tidak valid.")
            RETURN false
        ELSE
            idLaporan <- LaporanController.buatLaporanBaru(idPelapor, idTerlapor, kategoriPelanggaran, teksAlasan, buktiLampiran)
            IF idLaporan IS NULL THEN
                tampilkanPesanError("Gagal mengirim laporan.")
                RETURN false
            ELSE
                tampilkanNotifikasi("Laporan berhasil dikirim dan menunggu tinjauan admin.")
                RETURN true
            END IF
        END IF
    END IF
END FUNCTION
```

**Nama Operasi:** buatFormLaporan(): void
**ID Algoritma:** Algo-016-3

```text
PROCEDURE buatFormLaporan()
    tampilkanFormulirLaporan()
    kategoriPelanggaran <- kategori dari pelapor
    teksAlasan <- deskripsi dari pelapor
    buktiLampiran <- bukti dari pelapor
END PROCEDURE
```

**Nama Operasi:** submitLaporan(): Boolean
**ID Algoritma:** Algo-016-4

```text
FUNCTION submitLaporan(): Boolean
    idPelapor <- ambilIdPenggunaLogin()
    idTerlapor <- ambilIdTerlaporDariSesi()
    IF kategoriPelanggaran IS NULL OR teksAlasan IS NULL OR teksAlasan IS EMPTY THEN
        tampilkanPesanError("Lengkapi kategori pelanggaran dan deskripsi laporan.")
        RETURN false
    ELSE
        berhasil <- LaporanController.prosesLaporan(idPelapor, idTerlapor, kategoriPelanggaran, teksAlasan, buktiLampiran)
        IF berhasil = true THEN
            tampilkanNotifikasi("Laporan berhasil dikirim dan menunggu tinjauan admin.")
        ELSE
            tampilkanPesanError("Gagal mengirim laporan.")
        END IF
        RETURN berhasil
    END IF
END FUNCTION
```

## 5.30 Kelas PencarianMitraController

**Nama Kelas:** *PencarianMitraController*  
**ID Kelas:** *C30*

Tabel 5.30.1. Operasi Kelas PencarianMitraController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *cariMitraSesuaiKasus(idKasus: String, filterKeahlian: String): List<MitraPengacara>* | *public* | *Memproses pencarian dan mencocokkan mitra pengacara berdasarkan kategori kasus dan tag keahlian.* |
| *terapkanFilter(kategori: String, ratingMin: Float): List<MitraPengacara>* | *public* | *Menyaring daftar mitra berdasarkan kriteria filter tambahan.* |

Tabel 5.30.2. Atribut Kelas PencarianMitraController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |

### 5.30.1 Algoritma/Query

**Nama Kelas:** *PencarianMitraController*  
**Nama Operasi:** *cariMitraSesuaiKasus(idKasus: String, filterKeahlian: String): List<MitraPengacara>*  
**ID Algoritma:** *[Algo-030]*

```text
PROCEDURE ubahStatus(idMitra: String, statusBaru: String, catatan: String)
    berhasil <- VerifikasiMitraController.updateStatusVerifikasi(idMitra, statusBaru, catatan)
    IF berhasil = true THEN
        tampilkanNotifikasi("Status verifikasi pendaftar berhasil diperbarui.")
        perbaruiDaftarPengajuanAdmin()
    ELSE
        tampilkanPesanError("Gagal memperbarui status verifikasi.")
    END IF
END PROCEDURE
```

Tabel 5.30.1. Query Operasi -

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *-* | *-* | *Pengontrol meneruskan operasi pemanggilan data ke entitas Kasus dan MitraPengacara.* |


## 5.31 Kelas PenjadwalanKonsultasiController

**Nama Kelas:** *PenjadwalanKonsultasiController*  
**ID Kelas:** *C31*

Tabel 5.31.1. Operasi Kelas PenjadwalanKonsultasiController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *buatSesiKonsultasi(idMasyarakat: String, idMitra: String, tanggal: String, waktu: String, idKasus: String): Boolean* | *public* | *Membuat pengajuan jadwal konsultasi baru.* |
| *validasiJadwal(idMitra: String, tanggal: String, waktu: String): Boolean* | *public* | *Memeriksa ketersediaan jadwal mitra pada jam dan tanggal yang dipilih.* |

Tabel 5.31.2. Atribut Kelas PenjadwalanKonsultasiController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |

### 5.31.1 Algoritma/Query

**Nama Kelas:** *PenjadwalanKonsultasiController*  
**Nama Operasi:** *buatSesiKonsultasi(idMasyarakat: String, idMitra: String, tanggal: String, waktu: String, idKasus: String): Boolean*  
**ID Algoritma:** *[Algo-031-1]*

```text
FUNCTION buatSesiKonsultasi(idMasyarakat: String, idMitra: String, tanggal: String, waktu: String, idKasus: String): Boolean
    IF validasiJadwal(idMitra, tanggal, waktu) = false THEN
        RETURN false
    END IF

    sesiBaru <- SesiKonsultasi.simpanJadwalBaru(idMasyarakat, idMitra, tanggal, waktu, idKasus, "Menunggu Konfirmasi")
    IF sesiBaru IS NOT NULL THEN
        RETURN true
    END IF
    RETURN false
END FUNCTION
```

### 5.31.2 Algoritma/Query

**Nama Kelas:** *PenjadwalanKonsultasiController*  
**Nama Operasi:** *validasiJadwal(idMitra: String, tanggal: String, waktu: String): Boolean*  
**ID Algoritma:** *[Algo-031-2]*

```text
FUNCTION validasiJadwal(idMitra: String, tanggal: String, waktu: String): Boolean
    statusTersedia <- MitraPengacara.cekKetersediaanJadwal(idMitra, tanggal, waktu)
    RETURN statusTersedia
END FUNCTION
```


## 5.32 Kelas SesiKonsultasiController

**Nama Kelas:** *SesiKonsultasiController*  
**ID Kelas:** *C32*

Tabel 5.32.1. Operasi Kelas SesiKonsultasiController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *prosesKonfirmasiJadwal(idSesi: String, statusTerima: Boolean): Boolean* | *public* | *Memproses konfirmasi penerimaan/penolakan jadwal sesi oleh mitra.* |
| *perbaruiStatusSesi(idSesi: String, statusBaru: String): void* | *public* | *Memperbarui status siklus hidup sesi konsultasi.* |
| *kelolaPesanChat(idSesi: String, pesan: String, senderId: String): Boolean* | *public* | *Mengelola lalu lintas pengiriman pesan ruang konsultasi real-time.* |
| *validasiStatusPembayaran(idSesi: String): Boolean* | *public* | *Memastikan status pembayaran telah lunas sebelum membuka sesi chat.* |
| *akhiriSesiKonsultasi(idSesi: String): Boolean* | *public* | *Menutup sesi chat konsultasi dan mencatat waktu penyelesaian.* |

Tabel 5.32.2. Atribut Kelas SesiKonsultasiController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |

### 5.32.1 Algoritma/Query

**Nama Kelas:** *SesiKonsultasiController*  
**Nama Operasi:** *prosesKonfirmasiJadwal(idSesi: String, statusTerima: Boolean): Boolean*  
**ID Algoritma:** *[Algo-032]*

```text
FUNCTION prosesKonfirmasiJadwal(idSesi: String, statusTerima: Boolean): Boolean
    sesi <- SesiKonsultasi.getDetailSesi(idSesi)
    IF sesi IS NULL THEN
        RETURN false
    END IF

    IF statusTerima = true THEN
        SesiKonsultasi.aturStatusSesi(idSesi, "Terjadwal")
    ELSE
        SesiKonsultasi.aturStatusSesi(idSesi, "Ditolak")
    END IF

    RETURN true
END FUNCTION
```


## 5.33 Kelas UlasanController

**Nama Kelas:** *UlasanController*  
**ID Kelas:** *C33*

Tabel 5.33.1. Operasi Kelas UlasanController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *simpanUlasanBaru(idSesi: String, idMasyarakat: String, idMitra: String, rating: Integer, teks: String): Boolean* | *public* | *Menyimpan data ulasan baru dan memicu kalkulasi ulang skor rating mitra pengacara.* |
| *perbaruiRatingMitra(idMitra: String): void* | *public* | *Menghitung rerata skor rating mitra setelah ulasan baru ditambahkan.* |

Tabel 5.33.2. Atribut Kelas UlasanController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |

### 5.33.1 Algoritma/Query

**Nama Kelas:** *UlasanController*  
**Nama Operasi:** *simpanUlasanBaru(idSesi: String, idMasyarakat: String, idMitra: String, rating: Integer, teks: String): Boolean*  
**ID Algoritma:** *[Algo-033]*

```text
FUNCTION simpanUlasanBaru(idSesi: String, idMasyarakat: String, idMitra: String, rating: Integer, teks: String): Boolean
    IF rating < 1 OR rating > 5 THEN
        RETURN false
    END IF

    statusSimpan <- Ulasan.simpanDataUlasan(idSesi, idMasyarakat, idMitra, rating, teks)
    IF statusSimpan = true THEN
        perbaruiRatingMitra(idMitra)
        RETURN true
    END IF
    RETURN false
END FUNCTION
```


## 5.34 Kelas LaporanController

**Nama Kelas:** *LaporanController*  
**ID Kelas:** *C34*

Tabel 5.34.1. Operasi Kelas LaporanController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *buatLaporanBaru(idPelapor: String, idTerlapor: String, jenis: String, deskripsi: String, bukti: String): Boolean* | *public* | *Membuat entri laporan pelanggaran akun atau ulasan baru.* |
| *validasiBuktiLaporan(bukti: String): Boolean* | *public* | *Memerikasa berkas bukti yang dilampirkan pelapor.* |

Tabel 5.34.2. Atribut Kelas LaporanController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |

### 5.34.1 Algoritma/Query

**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *buatLaporanBaru(idPelapor: String, idTerlapor: String, jenis: String, deskripsi: String, bukti: String): Boolean*  
**ID Algoritma:** *[Algo-034]*

```text
FUNCTION buatLaporanBaru(idPelapor: String, idTerlapor: String, jenis: String, deskripsi: String, bukti: String): Boolean
    IF deskripsi IS EMPTY THEN
        RETURN false
    END IF

    IF validasiBuktiLaporan(bukti) = false THEN
        RETURN false
    END IF

    statusSimpan <- Laporan.simpanDataLaporan(idPelapor, idTerlapor, jenis, deskripsi, bukti, "Pending")
    RETURN statusSimpan
END FUNCTION
```


## 5.35 ModerasiAkunController

**Nama Kelas:** ModerasiAkunController
**ID Kelas:** C35

Tabel 5.35.1. Operasi Kelas ModerasiAkunController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| prosesTinjauan(idLaporan: String, hasil: String): Boolean | public | Memproses hasil tinjauan admin terhadap laporan: jika disetujui, memicu pemblokiran akun terlapor; jika ditolak, menutup laporan dengan status 'ditolak'. Memberi notifikasi hasil tinjauan kepada pelapor. |
| prosesBlokirAkun(idTerlapor: String): Boolean | public | Mengeksekusi pemblokiran akun terlapor yang melanggar kebijakan sistem. |
| updateStatusLaporan(idLaporan: String, status: String): void | public | Memperbarui status laporan setelah ditinjau admin. |

Tabel 5.35.2. Atribut Kelas ModerasiAkunController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| - | - | - |

### 5.35.1 Algoritma/Query

**Nama Kelas:** ModerasiAkunController
**Nama Operasi:** prosesTinjauan(idLaporan: String, hasil: String): Boolean
**ID Algoritma:** Algo-035-1

```text
FUNCTION prosesTinjauan(idLaporan: String, hasil: String): Boolean
    laporan <- Laporan.getDetailLaporan(idLaporan)
    IF laporan IS NULL THEN
        RETURN false
    ELSE IF hasil = "disetujui" THEN
        berhasil <- prosesBlokirAkun(laporan.idTerlapor)
        IF berhasil = true THEN
            updateStatusLaporan(idLaporan, "disetujui")
            kirimNotifikasi(laporan.idPelapor, "Laporan Anda disetujui dan akun terlapor telah diblokir.")
        END IF
        RETURN berhasil
    ELSE
        updateStatusLaporan(idLaporan, "ditolak")
        kirimNotifikasi(laporan.idPelapor, "Laporan Anda ditolak karena tidak cukup bukti atau tidak melanggar kebijakan.")
        RETURN true
    END IF
END FUNCTION
```

**Nama Operasi:** prosesBlokirAkun(idTerlapor: String): Boolean
**ID Algoritma:** Algo-035-2

```text
FUNCTION prosesBlokirAkun(idTerlapor: String): Boolean
    berhasil <- ubahStatusAkun(idTerlapor, "diblokir")
    IF berhasil = true THEN
        kirimNotifikasi(idTerlapor, "Akun Anda diblokir karena melanggar kebijakan sistem.")
    END IF
    RETURN berhasil
END FUNCTION
```

**Nama Operasi:** updateStatusLaporan(idLaporan: String, status: String): void
**ID Algoritma:** Algo-035-3

```text
PROCEDURE updateStatusLaporan(idLaporan: String, status: String)
    laporan <- Laporan.getDetailLaporan(idLaporan)
    laporan.statusLaporan <- status
    simpanLaporan(laporan)
END PROCEDURE
```


## 5.36 RiwayatController

**Nama Kelas:** RiwayatController
**ID Kelas:** C36

Tabel 5.36.1. Operasi Kelas RiwayatController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getRiwayatPengacara(idMitra: String): List<Kasus> | public | Mengambil riwayat penanganan kasus milik mitra pengacara beserta detail kasus dan sesinya. |
| getRiwayatMasyarakat(idMasyarakat: String): List<Kasus> | public | Mengambil riwayat kasus/konsultasi milik masyarakat beserta detail kasus dan sesinya. |
| detailRiwayat(): List<Kasus> | public | Melengkapi daftar riwayat yang sedang diproses (hasil getRiwayatPengacara atau getRiwayatMasyarakat) dengan detail kasus dan sesi konsultasi, lalu mengurutkannya dari yang terbaru. |

Tabel 5.36.2. Atribut Kelas RiwayatController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| - | - | - |

### 5.36.1 Algoritma/Query

**Nama Kelas:** RiwayatController
**Nama Operasi:** getRiwayatPengacara(idMitra: String): List<Kasus>
**ID Algoritma:** Algo-036-1

```text
FUNCTION getRiwayatPengacara(idMitra: String): List<Kasus>
    daftarIdRiwayat <- MitraPengacara.lihatRiwayat(idMitra)
    IF daftarIdRiwayat IS NULL OR daftarIdRiwayat IS EMPTY THEN
        RETURN daftar kosong
    ELSE
        RETURN detailRiwayat()
    END IF
END FUNCTION
```

**Nama Operasi:** getRiwayatMasyarakat(idMasyarakat: String): List<Kasus>
**ID Algoritma:** Algo-036-2

```text
FUNCTION getRiwayatMasyarakat(idMasyarakat: String): List<Kasus>
    daftarIdRiwayat <- Masyarakat.lihatHistory(idMasyarakat)
    IF daftarIdRiwayat IS NULL OR daftarIdRiwayat IS EMPTY THEN
        RETURN daftar kosong
    ELSE
        RETURN detailRiwayat()
    END IF
END FUNCTION
```

**Nama Operasi:** detailRiwayat(): List<Kasus>
**ID Algoritma:** Algo-036-3

```text
FUNCTION detailRiwayat(): List<Kasus>
    daftarRiwayat <- daftar kosong
    FOR EACH item IN daftarIdRiwayat DO
        kasus <- Kasus.detailKasus(item.idKasus)
        sesi <- SesiKonsultasi.getDetailSesi(item.idSesi)
        tambahkan kasus dan sesi ke daftarRiwayat
    END FOR
    urutkan daftarRiwayat berdasarkan waktu sesi, terbaru lebih dulu
    RETURN daftarRiwayat
END FUNCTION
```


## 5.37 LiveChatController

**Nama Kelas:** LiveChatController
**ID Kelas:** C37

Tabel 5.37.1. Operasi Kelas LiveChatController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| startChat(idMasyarakat: String, pertanyaan: String): LiveChat | public | Membuat percakapan live chat baru berisi pertanyaan masyarakat, mencarikan admin yang standby, dan mengatur status chat ('aktif' jika ada admin, 'menunggu' jika tidak). |
| assignAdmin(): String | public | Mencari admin yang sedang standby dan mengembalikan idAdmin-nya; mengembalikan NULL jika tidak ada. |
| closeChat(idChat: String): Boolean | public | Menutup percakapan live chat dan mengubah statusnya menjadi 'ditutup'. |

Tabel 5.37.2. Atribut Kelas LiveChatController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| - | - | - |

### 5.37.1 Algoritma/Query

**Nama Kelas:** LiveChatController
**Nama Operasi:** startChat(idMasyarakat: String, pertanyaan: String): LiveChat
**ID Algoritma:** Algo-037-1

```text
FUNCTION startChat(idMasyarakat: String, pertanyaan: String): LiveChat
    chat <- buat LiveChat baru dengan idMasyarakat dan pertanyaan
    idAdmin <- assignAdmin()
    IF idAdmin IS NULL THEN
        chat.updateStatusChat("menunggu")
    ELSE
        chat.updateStatusChat("aktif")
        LiveChatAdminPage.showAdminChatDashboard(chat.idChat)
    END IF
    RETURN chat
END FUNCTION
```

**Nama Operasi:** assignAdmin(): String
**ID Algoritma:** Algo-037-2

```text
FUNCTION assignAdmin(): String
    idAdmin <- cariAdminStandby()
    RETURN idAdmin
END FUNCTION
```

**Nama Operasi:** closeChat(idChat: String): Boolean
**ID Algoritma:** Algo-037-3

```text
FUNCTION closeChat(idChat: String): Boolean
    chat <- LiveChat.detailChat(idChat)
    IF chat IS NULL THEN
        RETURN false
    ELSE
        chat.updateStatusChat("ditutup")
        RETURN true
    END IF
END FUNCTION
```


## 5.38 PembayaranController

**Nama Kelas:** PembayaranController
**ID Kelas:** C38

Tabel 5.38.1. Operasi Kelas PembayaranController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| prosesPembayaran(idSesi: String, metodePembayaran: String): Boolean | public | Mengirim transaksi ke payment gateway pihak ketiga sesuai metode yang dipilih, menyimpan hasilnya, dan mengubah status menjadi 'lunas' jika berhasil. Memanggil bukaSesiChat() setelah lunas. |
| bukaSesiChat(idSesi: String): Boolean | public | Memastikan pembayaran sesi sudah lunas, lalu menandai sesi konsultasi siap dibuka untuk chat. Mengembalikan false jika belum lunas. |

Tabel 5.38.2. Atribut Kelas PembayaranController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPembayaran | private | String |
| idSesi | private | String |
| totalPembayaran | private | Double |
| statusPembayaran | private | String |

### 5.38.1 Algoritma/Query

**Nama Kelas:** PembayaranController
**Nama Operasi:** prosesPembayaran(idSesi: String, metodePembayaran: String): Boolean
**ID Algoritma:** Algo-038-1

```text
FUNCTION prosesPembayaran(idSesi: String, metodePembayaran: String): Boolean
    respons <- PaymentGateway.prosesTransaksi(idSesi, totalPembayaran, metodePembayaran)
    IF respons.status = "berhasil" THEN
        statusPembayaran <- "lunas"
        simpanPembayaran(idPembayaran, idSesi, metodePembayaran, totalPembayaran, statusPembayaran)
        bukaSesiChat(idSesi)
        RETURN true
    ELSE
        statusPembayaran <- "gagal"
        simpanPembayaran(idPembayaran, idSesi, metodePembayaran, totalPembayaran, statusPembayaran)
        RETURN false
    END IF
END FUNCTION
```

**Nama Operasi:** bukaSesiChat(idSesi: String): Boolean
**ID Algoritma:** Algo-038-2

```text
FUNCTION bukaSesiChat(idSesi: String): Boolean
    status <- Pembayaran.getStatus(idSesi)
    IF status = "lunas" THEN
        SesiKonsultasi.aturStatusSesi("siap dimulai")
        RETURN true
    ELSE
        RETURN false
    END IF
END FUNCTION
```


## 5.39 PencairanDanaController

**Nama Kelas:** PencairanDanaController
**ID Kelas:** C39

Tabel 5.39.1. Operasi Kelas PencairanDanaController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiSaldo(idMitra: String, totalPencairan: Double): Boolean | public | Memeriksa apakah jumlah dana yang diajukan tidak melebihi saldo mitra pengacara. |
| prosesPencairan(idMitra: String, totalPencairan: Double): Boolean | public | Memvalidasi saldo, membuat data pencairan dana ke rekening terdaftar mitra, dan memperbarui statusnya. Dilakukan terpisah dan tidak otomatis setelah pembayaran diterima. |

Tabel 5.39.2. Atribut Kelas PencairanDanaController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPencairan | private | String |
| idMitra | private | String |
| totalPencairan | private | Double |
| statusPencairan | private | String |
| rekeningTujuan | private | String |

### 5.39.1 Algoritma/Query

**Nama Kelas:** PencairanDanaController
**Nama Operasi:** validasiSaldo(idMitra: String, totalPencairan: Double): Boolean
**ID Algoritma:** Algo-039-1

```text
FUNCTION validasiSaldo(idMitra: String, totalPencairan: Double): Boolean
    saldoMitra <- ambilSaldoMitra(idMitra)
    IF totalPencairan > saldoMitra THEN
        RETURN false
    ELSE
        RETURN true
    END IF
END FUNCTION
```

**Nama Operasi:** prosesPencairan(idMitra: String, totalPencairan: Double): Boolean
**ID Algoritma:** Algo-039-2

```text
FUNCTION prosesPencairan(idMitra: String, totalPencairan: Double): Boolean
    saldoCukup <- validasiSaldo(idMitra, totalPencairan)
    IF saldoCukup = false THEN
        RETURN false
    ELSE
        rekeningTujuan <- MitraPengacara.rekeningPencairan
        statusPencairan <- "diproses"
        simpanPencairan(idPencairan, idMitra, totalPencairan, statusPencairan, rekeningTujuan)
        kurangiSaldoMitra(idMitra, totalPencairan)
        statusPencairan <- PencairanDana.getStatus(idPencairan)
        RETURN true
    END IF
END FUNCTION
```


## 5.40 Kelas Masyarakat

**Nama Kelas:** *Masyarakat*  
**ID Kelas:** *C40*

Tabel 5.40.1. Operasi Kelas Masyarakat

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *inputInfo(nama: String, nomorInduk: String, email: String, sandi: String): Boolean* | *public* | *Menyimpan data pendaftaran entitas akun masyarakat baru ke basis data.* |
| *cekEmailTerdaftar(email: String): Boolean* | *public* | *Memeriksa apakah alamat email sudah tersimpan dalam basis data akun masyarakat.* |

Tabel 5.40.2. Atribut Kelas Masyarakat

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idMasyarakat | private | String |
| nama | private | String |
| nomorInduk| private | String |
| email | private | String |
| sandi| private | String |
| statusAkun    | private | String |

### 5.40.1 Algoritma/Query

**Nama Kelas:** *Masyarakat*  
**Nama Operasi:** *cekEmailTerdaftar(email: String): Boolean*  
**ID Algoritma:** *[Algo-040]*

```text
FUNCTION cekEmailTerdaftar(email: String): Boolean
    hasil <- Q-401 dengan parameter email
    IF hasil IS NOT NULL THEN
        RETURN true
    END IF
    RETURN false
END FUNCTION
```

Tabel 5.40.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-401 | `SELECT idMasyarakat FROM masyarakat WHERE email = ?;` | Mengecek keberadaan email masyarakat pada sistem. |
| Q-002 | `INSERT INTO masyarakat (idMasyarakat, nama, nomorInduk, email, sandi, statusAkun) VALUES (?, ?, ?, ?, ?, ?);` | Menambahkan baris data akun masyarakat baru. |


## 5.41 Kelas MitraPengacara

**Nama Kelas:** *MitraPengacara*  
**ID Kelas:** *C41*

Tabel 5.41.1. Operasi Kelas MitraPengacara

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *cekKetersediaanJadwal(idMitra: String, tanggal: String, waktu: String): Boolean* | *public* | *Memeriksa ketersediaan slot jadwal mitra pada tabel sesi konsultasi.* |
| *infoProfil(idMitra: String): MitraPengacara* | *public* | *Mengambil detail profil dan tag keahlian mitra pengacara.* |

Tabel 5.41.2. Atribut Kelas MitraPengacara

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idMitra | private | String |
| nama | private | String |
| sandiMitra | private | String |
| tagKeahlian | private | String |
| statusKetersediaan| private | String |
| rating | private | Float |
| saldo | private | Double |
| rekeningPencairan | private | String | 

### 5.41.1 Algoritma/Query

**Nama Kelas:** *MitraPengacara*  
**Nama Operasi:** *cekKetersediaanJadwal(idMitra: String, tanggal: String, waktu: String): Boolean*  
**ID Algoritma:** *[Algo-041]*

```text
FUNCTION cekKetersediaanJadwal(idMitra: String, tanggal: String, waktu: String): Boolean
    sesiBentrok <- Q-411 dengan parameter idMitra, tanggal, dan waktu
    IF sesiBentrok not isEmpty THEN
        RETURN false
    END IF
    RETURN true
END FUNCTION
```

Tabel 5.41.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-411 | `SELECT idSesi FROM sesi_konsultasi WHERE idMitra = ? AND tanggalJadwal = ? AND waktuJadwal = ? AND statusSesi != 'Dibatalkan'` | Memeriksa jadwal bentrok mitra. |
| Q-412 | `SELECT * FROM mitra_pengacara WHERE idMitra = ?;` | Memuat profil lengkap mitra pengacara. |


## 5.42 Kelas Admin

**Nama Kelas:** *Admin*  
**ID Kelas:** *C42*

Tabel 5.42.1. Operasi Kelas Admin

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *verifikasiDokumen(idDokumen: String, status: String): Boolean* | *public* | *Memperbarui status verifikasi dokumen legalitas mitra oleh admin.* |
| *login(idAdmin: String, sandi: String): Boolean* | *public* | *Memverifikasi identitas kredensial akun admin.* |

Tabel 5.42.2. Atribut Kelas Admin

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idAdmin | private | String |
| verifikasi | private | String |

### 5.42.1 Algoritma/Query

**Nama Kelas:** *Admin*  
**Nama Operasi:** *verifikasiDokumen(idDokumen: String, status: String): Boolean*  
**ID Algoritma:** *[Algo-042]*

```text
FUNCTION verifikasiDokumen(idDokumen: String, status: String): Boolean
    statusUpdate <- Q-42-1 dengan parameter status dan idDokumen
    IF statusUpdate = true THEN
        RETURN true
    END IF
    RETURN false
END FUNCTION
```

Tabel 5.42.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-421 | `UPDATE dokumen_legalitas SET statusValiditas = ? WHERE idDokumen = ?;` | Mengubah status keabsahan dokumen pendaftaran mitra. |


## 5.43 Kelas Kasus

**Nama Kelas:** *Kasus*  
**ID Kelas:** *C43*

Tabel 5.43.1. Operasi Kelas Kasus

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *infoDetailKasus(idKasus: String): Kasus* | *public* | *Mengambil detail deskripsi dan kategori kasus masyarakat berdasarkan idKasus.* |
| *infoKategoriKasus(idKasus: String): String* | *public* | *Mengembalikan nama tag/kategori masalah dari kasus.* |

Tabel 5.43.2. Atribut Kelas Kasus

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idKasus | private | String |
| kategoriMasalah | private | String |
| dekripsi | private | String |
| *...* | *...* | *...* |

### 5.43.1 Algoritma/Query

**Nama Kelas:** *Kasus*  
**Nama Operasi:** *infoDetailKasus(idKasus: String): Kasus*  
**ID Algoritma:** *[Algo-043]*

```text
FUNCTION infoDetailKasus(idKasus: String): Kasus
    dataKasus <- Q-431 dengan parameter idKasus
    IF dataKasus IS NULL THEN
        RETURN NULL
    END IF
    RETURN dataKasus
END FUNCTION
```

Tabel 5.43.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-431 | `SELECT * FROM kasus WHERE idKasus = ?;` | Mengambil detail entitas kasus dari database. |


## 5.44 DasarHukum

**Nama Kelas:** DasarHukum
**ID Kelas:** C44

Tabel 5.44.1. Operasi Kelas DasarHukum

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| infoPasal(idPasal: String): DasarHukum | public | Mengambil data peraturan atau pasal berdasarkan idPasal untuk ditampilkan pada fitur SearchLaw. |
| updatePasal(idPasal: String, dataPasal: String): Boolean | public | Memperbarui data peraturan atau pasal berdasarkan idPasal. Mengembalikan true jika berhasil. |

Tabel 5.44.2. Atribut Kelas DasarHukum

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPasal | private | String |

### 5.44.1 Algoritma/Query

**Nama Kelas:** DasarHukum
**Nama Operasi:** infoPasal(idPasal: String): DasarHukum
**ID Algoritma:** Algo-044-1

```text
FUNCTION infoPasal(idPasal: String): DasarHukum
    hasil <- jalankanQuery(Q-001, idPasal)
    IF hasil IS NULL OR hasil IS EMPTY THEN
        RETURN NULL
    ELSE
        RETURN hasil
    END IF
END FUNCTION
```

**Nama Operasi:** updatePasal(idPasal: String, dataPasal: String): Boolean
**ID Algoritma:** Algo-044-2

```text
FUNCTION updatePasal(idPasal: String, dataPasal: String): Boolean
    pasalAda <- jalankanQuery(Q-001, idPasal)
    IF pasalAda IS NULL OR pasalAda IS EMPTY THEN
        RETURN false
    ELSE
        jalankanQuery(Q-002, idPasal, dataPasal)
        RETURN true
    END IF
END FUNCTION
```

Tabel 5.44.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-001 | `SELECT * FROM dasar_hukum WHERE idPasal = ?;` | Mengambil data peraturan/pasal berdasarkan idPasal (operasi infoPasal dan pemeriksaan di updatePasal). |
| Q-002 | `UPDATE dasar_hukum SET isiPasal = ? WHERE idPasal = ?;` | Memperbarui isi pasal berdasarkan idPasal (operasi updatePasal). |


## 5.45 DokumenLegalitas

**Nama Kelas:** DokumenLegalitas
**ID Kelas:** C45

Tabel 5.45.1. Operasi Kelas DokumenLegalitas

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tambahDokumen(berkas: File): String | public | Menyimpan berkas legalitas yang diunggah mitra pengacara ke file system server dengan status validitas awal false (menunggu verifikasi admin). Mengembalikan idDokumen, atau NULL jika gagal. |

Tabel 5.45.2. Atribut Kelas DokumenLegalitas

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idDokumen | private | String |
| validitas | private | Boolean |

### 5.45.1 Algoritma/Query

**Nama Kelas:** DokumenLegalitas
**Nama Operasi:** tambahDokumen(berkas: File): String
**ID Algoritma:** Algo-045

```text
FUNCTION tambahDokumen(berkas: File): String
    idDokumen <- buatIdDokumen()
    alamatBerkas <- simpanBerkasKeFileSystem(berkas)
    validitas <- false
    berhasil <- jalankanQuery(Q-001, idDokumen, alamatBerkas, validitas)
    IF berhasil = true THEN
        RETURN idDokumen
    ELSE
        RETURN NULL
    END IF
END FUNCTION
```

Tabel 5.45.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-001 | `INSERT INTO dokumen_legalitas (idDokumen, alamatBerkas, validitas) VALUES (?, ?, ?);` | Menyimpan data dokumen legalitas baru; berkasnya disimpan di file system server dan basis data hanya menyimpan alamatnya (operasi tambahDokumen). |


## 5.46 SesiKonsultasi

**Nama Kelas:** SesiKonsultasi
**ID Kelas:** C46

Tabel 5.46.1. Operasi Kelas SesiKonsultasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| simpanJadwalBaru(sesi: SesiKonsultasi): Boolean | public | Menyimpan permintaan sesi konsultasi baru dengan status 'menunggu tanggapan mitra'. |
| infoStatusSesi(): String | public | Mengembalikan status sesi konsultasi ini (statusSesi). |
| aturStatusSesi(status: String): void | public | Mengubah status sesi konsultasi ini (misalnya 'terjadwal' atau 'dibatalkan'). |
| catatWaktuMulaiSelesai(jenis: String): void | public | Mencatat waktu saat ini sebagai waktu mulai (jenis = "mulai") atau waktu selesai (jenis = "selesai") sesi konsultasi ini. |
| getDetailSesi(idSesi: String): SesiKonsultasi | public | Mengambil data lengkap sesi konsultasi berdasarkan idSesi. |
| mulaiSesi(): void | public | Memulai sesi konsultasi ini setelah pembayaran lunas: mencatat waktu mulai dan mengubah statusKonsul menjadi 'berlangsung'. |
| akhiriSesi(): void | public | Mengakhiri sesi konsultasi ini: mencatat waktu selesai dan mengubah statusKonsul menjadi 'selesai'. |

Tabel 5.46.2. Atribut Kelas SesiKonsultasi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idSesi | private | String |
| tanggalJadwal | private | Date |
| waktuJadwal | private | Time |
| statusSesi | private | String |
| waktuStart | private | DateTime |
| waktuEnd | private | DateTime |
| statusKonsul | private | String |
| catatanKonsul | private | String |
| idMasyarakat | private | String |
| idMitra | private | String |
| statusPembayaran | private | String |
| waktuMulai | private | DateTime |
| waktuSelesai | private | DateTime |

### 5.46.1 Algoritma/Query

**Nama Kelas:** SesiKonsultasi
**Nama Operasi:** simpanJadwalBaru(sesi: SesiKonsultasi): Boolean
**ID Algoritma:** Algo-046-1

```text
FUNCTION simpanJadwalBaru(sesi: SesiKonsultasi): Boolean
    sesi.idSesi <- buatIdSesi()
    sesi.statusSesi <- "menunggu tanggapan mitra"
    berhasil <- jalankanQuery(Q-001, sesi.idSesi, sesi.idMasyarakat, sesi.idMitra, sesi.tanggalJadwal, sesi.waktuJadwal, sesi.statusSesi)
    RETURN berhasil
END FUNCTION
```

**Nama Operasi:** infoStatusSesi(): String
**ID Algoritma:** Algo-046-2

```text
FUNCTION infoStatusSesi(): String
    RETURN statusSesi
END FUNCTION
```

**Nama Operasi:** aturStatusSesi(status: String): void
**ID Algoritma:** Algo-046-3

```text
PROCEDURE aturStatusSesi(status: String)
    statusSesi <- status
    jalankanQuery(Q-003, statusSesi, idSesi)
END PROCEDURE
```

**Nama Operasi:** catatWaktuMulaiSelesai(jenis: String): void
**ID Algoritma:** Algo-046-4

```text
PROCEDURE catatWaktuMulaiSelesai(jenis: String)
    IF jenis = "mulai" THEN
        waktuMulai <- waktuSekarang()
        jalankanQuery(Q-004, waktuMulai, idSesi)
    ELSE IF jenis = "selesai" THEN
        waktuSelesai <- waktuSekarang()
        jalankanQuery(Q-005, waktuSelesai, idSesi)
    END IF
END PROCEDURE
```

**Nama Operasi:** getDetailSesi(idSesi: String): SesiKonsultasi
**ID Algoritma:** Algo-046-5

```text
FUNCTION getDetailSesi(idSesi: String): SesiKonsultasi
    hasil <- jalankanQuery(Q-002, idSesi)
    IF hasil IS NULL OR hasil IS EMPTY THEN
        RETURN NULL
    ELSE
        RETURN hasil
    END IF
END FUNCTION
```

**Nama Operasi:** mulaiSesi(): void
**ID Algoritma:** Algo-046-6

```text
PROCEDURE mulaiSesi()
    IF statusPembayaran = "lunas" THEN
        catatWaktuMulaiSelesai("mulai")
        statusKonsul <- "berlangsung"
        jalankanQuery(Q-006, statusKonsul, idSesi)
    END IF
END PROCEDURE
```

**Nama Operasi:** akhiriSesi(): void
**ID Algoritma:** Algo-046-7

```text
PROCEDURE akhiriSesi()
    catatWaktuMulaiSelesai("selesai")
    statusKonsul <- "selesai"
    jalankanQuery(Q-006, statusKonsul, idSesi)
END PROCEDURE
```

Tabel 5.46.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-001 | `INSERT INTO sesi_konsultasi (idSesi, idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi) VALUES (?, ?, ?, ?, ?, ?);` | Menyimpan permintaan sesi baru (simpanJadwalBaru). |
| Q-002 | `SELECT * FROM sesi_konsultasi WHERE idSesi = ?;` | Mengambil data sesi (getDetailSesi). |
| Q-003 | `UPDATE sesi_konsultasi SET statusSesi = ? WHERE idSesi = ?;` | Mengubah status sesi (aturStatusSesi). |
| Q-004 | `UPDATE sesi_konsultasi SET waktuMulai = ? WHERE idSesi = ?;` | Mencatat waktu mulai (catatWaktuMulaiSelesai). |
| Q-005 | `UPDATE sesi_konsultasi SET waktuSelesai = ? WHERE idSesi = ?;` | Mencatat waktu selesai (catatWaktuMulaiSelesai). |
| Q-006 | `UPDATE sesi_konsultasi SET statusKonsul = ? WHERE idSesi = ?;` | Mengubah status konsultasi (mulaiSesi dan akhiriSesi). |


## 5.47 Ulasan

**Nama Kelas:** Ulasan
**ID Kelas:** C47

Tabel 5.47.1. Operasi Kelas Ulasan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| infoDataUlasan(idMitra: String): List<Ulasan> | public | Mengambil ringkasan ulasan (skor rating dan teks ulasan) milik mitra pengacara untuk ditampilkan pada daftar mitra. |
| simpanDataUlasan(): void | public | Menyimpan data ulasan ini (idMitra, skorRating, teksUlasan, foto) beserta tanggal ulasan ke basis data. |
| ambilDataUlasan(): Ulasan | public | Mengambil kembali data ulasan ini dari basis data berdasarkan idUlasan, misalnya untuk ditampilkan pada profil mitra pengacara setelah ulasan disimpan. |
| getUlasan(idUlasan: String): Ulasan | public | Mengambil satu ulasan berdasarkan idUlasan (misalnya saat ulasan dilaporkan). |

Tabel 5.47.2. Atribut Kelas Ulasan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idUlasan | private | String |
| skorRating | private | Integer |
| teksUlasan | private | String |
| tanggalUlasan | private | Date |
| idMitra | private | String |
| foto | private | String |
| rating | private | Integer |

### 5.47.1 Algoritma/Query

**Nama Kelas:** Ulasan
**Nama Operasi:** infoDataUlasan(idMitra: String): List<Ulasan>
**ID Algoritma:** Algo-047-1

```text
FUNCTION infoDataUlasan(idMitra: String): List<Ulasan>
    hasil <- jalankanQuery(Q-001, idMitra)
    IF hasil IS NULL THEN
        RETURN daftar kosong
    ELSE
        RETURN hasil
    END IF
END FUNCTION
```

**Nama Operasi:** simpanDataUlasan(): void
**ID Algoritma:** Algo-047-2

```text
PROCEDURE simpanDataUlasan()
    idUlasan <- buatIdUlasan()
    tanggalUlasan <- tanggalSekarang()
    jalankanQuery(Q-002, idUlasan, idMitra, skorRating, teksUlasan, foto, tanggalUlasan)
END PROCEDURE
```

**Nama Operasi:** ambilDataUlasan(): Ulasan
**ID Algoritma:** Algo-047-3

```text
FUNCTION ambilDataUlasan(): Ulasan
    hasil <- jalankanQuery(Q-003, idUlasan)
    IF hasil IS NULL OR hasil IS EMPTY THEN
        RETURN NULL
    ELSE
        RETURN hasil
    END IF
END FUNCTION
```

**Nama Operasi:** getUlasan(idUlasan: String): Ulasan
**ID Algoritma:** Algo-047-4

```text
FUNCTION getUlasan(idUlasan: String): Ulasan
    hasil <- jalankanQuery(Q-003, idUlasan)
    IF hasil IS NULL OR hasil IS EMPTY THEN
        RETURN NULL
    ELSE
        RETURN hasil
    END IF
END FUNCTION
```

Tabel 5.47.3. Query Operasi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-001 | `SELECT idUlasan, skorRating, teksUlasan FROM ulasan WHERE idMitra = ?;` | Mengambil ringkasan ulasan mitra (infoDataUlasan). |
| Q-002 | `INSERT INTO ulasan (idUlasan, idMitra, skorRating, teksUlasan, foto, tanggalUlasan) VALUES (?, ?, ?, ?, ?, ?);` | Menyimpan ulasan baru (simpanDataUlasan). |
| Q-003 | `SELECT * FROM ulasan WHERE idUlasan = ?;` | Mengambil satu ulasan berdasarkan idUlasan (ambilDataUlasan dan getUlasan). |

<br>

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka [ID Layar 1]

Masukkan versi awal prototipe antarmuka, dimana untuk setiap antarmuka/layar, tuliskan spesifikasi rinci objek yang ditampilkan dan reaksi sistem terhadap interaksi pengguna.

**Antarmuka:** *[ID layar]*  
**Nama Layar:** *[Nama layar]*

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-design.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka [ID Layar] - [Nama Layar]</i>
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
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case; tuliskan seluruh use case terkait]* |
| *[ID kelas - Nama kelas]* | *[ID UC - Nama use case]* |
| *...* | *...* |
