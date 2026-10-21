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
> Dokumen ini melanjutkan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)** dan **Arsitektur Perangkat Lunak (APL)**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

<br>

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan dengan ringkas tujuan dokumen DPPL ini dibuat dan siapa saja yang akan menggunakan dokumen ini.

## 1.2 Lingkup Masalah
LawHub merupakan platform layanan konsultasi hukum digital yang dikembangkan untuk memperluas akses bantuan hukum bagi masyarakat Indonesia, di tengah tingginya angka sengketa dan konflik hukum yang belum terselesaikan serta terbatasnya kanal konsultasi hukum yang interaktif dan efisien. Berbeda dari laman bantuan hukum yang sudah ada dan umumnya berfokus pada forum tanya jawab terbuka, LawHub menghadirkan dua fitur utama, yaitu HaloLaw untuk konsultasi hukum on-demand secara langsung dengan mitra pengacara melalui chat, dan SearchLaw untuk membantu masyarakat menemukan dasar hukum yang relevan dengan kasus yang dihadapi, sehingga proses konsultasi hukum menjadi lebih cepat, transparan, dan mudah diakses oleh berbagai kalangan.

## 1.3 Definisi, Istilah, dan Singkatan

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| P/L | Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu. |
| SKPL | Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya. |
| KF | Singkatan dari Kebutuhan Fungsional. |
| KNF | Singkatan dari Kebutuhan Non-Fungsional. |
| UC | Singkatan dari Use Case. |
| EARS | Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji. |

## 1.4 Aturan Penomoran

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran |
| :--- | :--- |
| Kebutuhan Fungsional | KFXX | 
| Kebutuhan Non-Fungsional | KNFXX | 
| Use Case | UCXX | 
| Kelas | CXX | 
| Kebutuhan | RXX | 

## 1.5 Referensi
Dokumen SKPL ini disusun dengan merujuk pada sumber-sumber berikut:
1. SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK (SKPL) IF2150-RPL-K03-G05
2. ARSITEKTUR PERANGKAT LUNAK (APL) IF2150-RPL-K03-G05
3. Materi kuliah IF2150 Rekayasa Perangkat Lunak, Program Studi Teknik Informatika, Institut Teknologi Bandung.

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
| Development Tools | | |
| Filing System | | |
| Bahasa Pemrograman | | |
Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

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

Tabel 2.1. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis                 | Penjelasan                                                                                                           |
| :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------- |
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

### 2.4.1 Logical View

Logical View dipilih karena bertujuan untuk menunjukkan interaksi dan alur pemrosesan antarkomponen arsitektur tingkat tinggi yang masing-masing dapat mewadahi satu atau lebih kelas fungsional. Selain itu, logical View juga mampu memvisualisasikan pemisahan fungsi  MVC, sehingga alur pemrosesan antar-aktor (Masyarakat, Pengacara, Admin) mudah dipahami.

<p align="center">
<img alt="Logical View pada P/L LawHub" src="./assets/diagram/logical-view-LawHub.webp" width="100%">
</p>
<p align="center">
<i>Gambar 2. Diagram Logical View LawHub</i>
</p>

Diagram dibagi menjadi tiga jalur utama, yaitu View, Controller, dan Model, sesuai dengan penerapan pola arsitektur Model-View-Controller (MVC) yang telah ditetapkan pada BAB 1. Komponen Integrasi Eksternal (PaymentGatewayAdapter) diletakkan di luar jalur utama (sebelah kanan) karena komponen ini bertindak sebagai perantara komunikasi diluar dari sistem dan hanya dipanggil oleh Controller. Komponen Penyimpanan Data (Database) diletakkan di bagian paling bawah sebagai fondasi penyimpanan data keseluruhan.

### 2.4.X View [Nama View]
*[Lakukan hal yang sama dengan bagian sebelumnya]*

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case UC01

**ID Use Case:** *UC01*  
**Nama Use Case:** *Daftar Akun bagi Masyarakat*

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *RegistrasiView* | *RegistrasiMasyarakatPage* |
| 2 | *RegistrasiController* | *RegistrasiMasyarakatController* |
| 3 | *Masyarakat* | *Masyarakat* |
| ... | *...* | *...* |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/seqeuence-diagram-01.webp" width="50%">
</p>
<p align="center">
<i>Gambar 1. Sequence Diagram UC01</i>
</p>

- **Skenario Alternatif 1 : Registrasi Gagal saat email sudah terdaftar atau password lemah**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/seqeuence-diagram-alt-01.webp" width="50%">
</p>
<p align="center">
<i>Gambar 2. Sequence Diagram UC01 - email sudah terdaftar atau password lemah</i>
</p>

### 3.1.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/diagram-kelas-01.webp" width="35%">
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

## 3.2 Use Case 02

**ID Use Case:** UC02
**Nama Use Case:** Melakukan Login bagi Masyarakat

### 3.1.1 Identifikasi Kelas

Tabel 3.2. Identifikasi Kelas Use Case [UC02]

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


<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas


<p align="center">
<img alt="Diagram Kelas Keseluruhan LawHub" src="./assets/diagram/diagram-kelas-keseluruhan.webp" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan LawHub</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | RegistrasiMasyarakatPage | tombolRegistrasi | submitRegistrasi() |
| C02 | LoginMasyarakatPage | tombolVerifikasi | submitVerifikasi() |
| C04 | RegistrasiMitraPage | tombolRegistrasi | submitRegistrasi() |
| C05 | LoginMitraPage | tombolVerifikasi, inputKredensial | submitVerifikasi() |
| C06 | StatusVerifikasiMitraPage | status | infoStatus() |
| C07 | VerifikasiMitraPage | status | ubahStatus() |
| C08 | EditProfilMitraPage | inputKredensial | validasiData() |
| C09 | EditDokumenLegalitasPage | inputDokumen | validasiData() |
| C10 | SearchLawPage | tombolCari, infoPasal | cariPasal() |
| C11 | DaftarMitraPengacaraPage | kataKunciKasus, filterKeahlian | inputPencarian(), tampilkanDaftarMitra() |
| C12 | PemilihanJadwalKonsultasiPage | pilihanMitra, pilihanTanggal, pilihanWaktu | pilihMitra(), pilihJadwal() |
| C13 | KonfirmasiKonsultasiPage | pilihanKonfirmasi, catatanKonfirmasi | klikKonfirmasi(), tampilkanPermintaanJadwal() |
| C14 | ChatKonsultasiPage | pesanInput, lampiranFile | kirimPesan(), tampilkanPesanTerkini() |
| C15 | UlasanPage | inputRating, inputTeksUlasan | isiFormUlasan(), kirimUlasan() |
| C16 | LaporanAkunPage / LaporanUlasanPage | kategoriPelanggaran, teksAlasan, buktiLampiran, idLaporan, idUlasan, idMitra | isiFormLaporan(), kirimLaporan(), buatFormLaporan(), submitLaporan(), buatFormLaporanUlasan(), submitLaporanUlasan(), statusUlasan() |
| C18 | TinjauanPage | idAdmin, pilihLaporan | submitHasil(), tampilkanLaporan(), tolakLaporan() |
| C19 | HistoryPage | listRiwayat, idMasyarakat, idMitra | lihatHistory() |
| C20 | LiveChatMasyarakatPage | idMasyarakat, chatAktifId | showChat(), sendMessage(), endChat() |
| C21 | LiveChatAdminPage | idAdmin, chatAktifId | showAdminChatDashboard(), markAsResolved() |
| C22 | PembayaranPage | metodePembayaran | pilihMetodePembayaran(), submitPembayaran() |
| C23 | PencairanDanaPage | idPencairan | submitPencairan() |
| C24 | RegistrasiMasyarakatController | idRegistrasi, id | buatAkun() |
| C25 | AutentikasiController | tombolVerifikasi, inputKredensial, idMitra, passwordMitra | validasiData() |
| C26 | RegistrasiMitraController | idRegistrasi, idDokumen, status, idMitra, passwordMitra | validasiData(), buatAkunBaru() |
| C27 | VerifikasiMitraController | status, idMitra, passwordMitra, dokumenMitra | validasiData() |
| C29 | SearchLawController | tombolCari, infoPasal, kataKunci, idPasal | validasiData() |
| C30 | PencarianMitraController | - | cariMitraSesuaiKasus(), terapkanFilter() |
| C31 | PenjadwalanKonsultasiController | - | buatSesiKonsultasi(), validasiJadwal() |
| C32 | SesiKonsultasiController | - | prosesKonfirmasiJadwal(), perbaruiStatusSesi(), kelolaPesanChat(), validasiStatusPembayaran(), akhiriSesiKonsultasi() |
| C33 | UlasanController | - | simpanUlasanBaru(), perbaruiRatingMitra() |
| C34 | LaporanController | - | buatLaporanBaru(), validasiBuktiLaporan(), prosesLaporan(), detailLaporan() |
| C35 | ModerasiAkunController | - | prosesTinjauan(), prosesBlokirAkun(), updateStatusLaporan() |
| C36 | RiwayatController | - | getRiwayatPengacara(), getRiwayatMasyarakat(), detailRiwayat() |
| C37 | LiveChatController | - | assignAdmin(), startChat(), closeChat() |
| C38 | PembayaranController | idPembayaran, idSesi, totalPembayaran, statusPembayaran | prosesPembayaran(), bukaSesiChat() |
| C39 | PencairanDanaController | idPencairan, idMitra, totalPencairan, statusPencairan, rekeningTujuan | validasiSaldo(), prosesPencairan() |
| C40 | Masyarakat | idMasyarakat, nama, nomorInduk, email, sandi, kataKunci, statusAkun, idKasus, idLaporan | inputInfo(), cekPasal(), ajukanPencarian(), ajukanJadwal(), kirimPesan(), berikanPenilaian(), ajukanLaporanPelanggaran(), getProfil(), lihatHistory(), ajukanKasus(), cariMitra(), beriUlasan(), buatLaporan() |
| C41 | MitraPengacara | idMitra, sandiMitra, validitas, passwordMitra, dokumenMitra, nama, tagKeahlian, statusKetersediaan, rating, spesialisasi, ratingAkun, rekeningPencairan | inputInfo(), cekStatus(), verifikasiUlang(), editDokumen(), infoProfil(), cekKetersediaan(), cekKetersediaanJadwal(), terimaJadwal(), tolakJadwal(), balasPesan(), getProfil(), lihatUlasan(), lihatRiwayat(), tambahSaldo() |
| C42 | Admin | verifikasi, idAdmin | verifikasiDokumen(), login(), balasPesan() |
| C43 | Kasus | idKasus, kategoriMasalah, deskripsi, judulKasus, statusKasus | infoKategoriKasus(), infoDetailKasus(), detailKasus(), getIdKasus() |
| C44 | DasarHukum | idPasal | infoPasal(), updatePasal() |
| C45 | DokumenLegalitas | idDokumen, validitas | tambahDokumen() |
| C46 | SesiKonsultasi | idSesi, tanggalJadwal, waktuJadwal, statusSesi, idMasyarakat, idMitra, statusPembayaran, waktuMulai, waktuSelesai, waktuStart, waktuEnd, statusKonsul, catatanKonsul | simpanJadwalBaru(), infoStatusSesi(), aturStatusSesi(), catatWaktuMulaiSelesai(), getDetailSesi(), mulaiSesi(), akhiriSesi() |
| C47 | Ulasan / Laporan | idUlasan, skorRating, teksUlasan, tanggalUlasan, idMitra, foto, rating, jenisPelanggaran, deskripsi, statusLaporan | infoDataUlasan(), simpanDataUlasan(), ambilDataUlasan(), simpanDataLaporan(), infoStatusLaporan(), getUlasan() |
| C48 | Laporan | idLaporan, idPelapor, idTerlapor, tanggalLaporan, statusLaporan | buatLaporan(), statusLaporan(), getDetailLaporan() |
| C49 | Pembayaran | idPembayaran, nominal, statusPembayaran, metodeBayar, idSesi, waktuTransaksi | cekStatusLunas(), getStatus() |
| C50 | LiveChat | idChat, waktuChatMulai, waktuChatSelesai, statusChat, historyChat | updateStatusChat(), detailChat() |
| C51 | PencairanDana | idPencairan, totalPencairan, tanggalPengajuan, statusPencairan, rekeningTujuan | getStatus() |

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
