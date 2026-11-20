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
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

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
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
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

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *I-01* | *KeranjangController* | *Keranjang (Model)* | *Controller - Model* | *INT-TC01, INT-TC02* |
| *I-02* | *Pesanan (Model)* | *Database* | *Aplikasi - Basis data* | *INT-TC03* |
| *I-03* | *PaymentGatewayAdapter* | *Payment Gateway (dummy)* | *Aplikasi - Sistem eksternal* | *INT-TC04, INT-TC05* |
| *[I-XX]* | *[Komponen asal]* | *[Komponen tujuan]* | *[Jenis batas]* | *[ID test case]* |
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC01* | *I-01* | *Normal: tambah item ke keranjang* | *Panggil `tambahItem()` melalui KeranjangController dengan produk valid* | *Item tersimpan pada Keranjang dan tampil pada daftar item* | *[Hasil aktual]* | *Pass/Fail* |
| *INT-TC03* | *I-02* | *Normal: simpan pesanan* | *Buat pesanan, lalu baca ulang langsung dari basis data* | *Baris pesanan ada dengan nilai total dan status yang sama* | *[...]* | *Pass/Fail* |
| *INT-TC05* | *I-03* | *Gagal: gateway mengembalikan status gagal* | *Kirim otorisasi dengan saldo dummy tidak cukup* | *Status pesanan tidak berubah menjadi "Lunas", pesan gagal diteruskan ke pengguna* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01* | *Normal* | *1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login".* | *User: rpl@gmail.com<br>Pass: 123456* | *Pengguna diarahkan ke Halaman Dashboard.* | *Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
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
