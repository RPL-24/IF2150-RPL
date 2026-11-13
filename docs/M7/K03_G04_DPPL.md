<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## *Mahasehat: Mental Health Monitoring App for Students*

<img alt="Logo Perangkat Lunak" src="./assets/diagram/logo-mahasehat.png" width="35%">

### Untuk: *Stefani Angeline Oroh*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *03* |
| Kelompok | *04*  |
| Nama Kelompok | *pakespinwheel*  |

| NIM       | Nama               |
| --------- | ------------------ |
| *13525021* | *Haikal Muhammad Royyan* |
| *13525066* | *Cynthia Winda Wijaya* |
| *13525081* | *Rendy Salastra Putra* |
| *13525090* | *Sophia Imelda Rogate Marpaung* |
| *13525141* | *Christabelcyne Costan* |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Melakukan penyesuaikan alur sistem dengan mengganti nama beberapa metode/operasi pada kelas-kelas di UC09 dan UC10 agar lebih deskriptif.* |
| *B* | *Melengkapi diagram kelas keseluruhan karena ada kelas yang double dan ada kelas yang belum termasuk.* |
| *C* | *Merevisi hubungan antarkelas pada logical view.* |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Deskripsi Perangkat Lunak (DPPL) merupakan lanjutan dari SKPL yang berisi rancangan atau desain teknis bagaimana perangkat lunak tersebut akan dibangun. DPPL digunakan sebagai acuan bagi tim pengembang dalam proses implementasi sistem, serta bagi pihak terkait untuk memahami fitur dan kebutuhan perangkat lunak yang telah ditentukan.

## 1.2 Lingkup Masalah
Mahasehat merupakan aplikasi berbasis web yang membantu pelajar dalam memantau dan memahami kondisi kesehatan mental sehari-hari serta memperoleh akses terhadap layanan kesehatan mental. Aplikasi ini menyediakan fitur pencatatan suasana hati, pola tidur, aktivitas fisik, pola makan, tingkat stres, dan refleksi harian. Data tersebut digunakan dan disajikan dalam bentuk statistik dan laporan untuk melihat perkembangan kondisi pelajar sehingga pelajar dapat mengenali pola atau perubahan pada kondisi kesehatan mentalnya. Selain pemantauan mandiri, Mahasehat menyediakan akses terhadap layanan kesehatan mental melalui tenaga kesehatan. Pelajar dapat mencari tenaga kesehatan sesuai kebutuhan, melihat jadwal yang tersedia, serta mengajukan konsultasi. Selain itu, orang tua/wali dilibatkan dalam pemantauan kondisi pelajar melalui informasi dan notifikasi tertentu, sementara tenaga kesehatan dapat mengakses informasi kesehatan yang relevan untuk mendukung proses konsultasi.

## 1.3 Definisi, Istilah, dan Singkatan

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen lanjutan SKPL yang berisi rancangan teknis dan arsitektur perangkat lunak.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional, yaitu layanan yang harus disediakan dan respon atas masukan, kadang termasuk yang tidak boleh dilakukan.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional, yaitu batasan atas layanan yang harus disediakan, seberapa baik, dalam kondisi apa, dengan jaminan apa.* |
| *UC* | *Singkatan dari Use Case, yaitu pemodelan cara aktor berinteraksi dengan sistem.* |
| *Aktor* | *Merepresentasikan entitas di luar batas sistem yang berinteraksi dengan sistem.* |
| *Skenario* | *Merepresentasikan satu penelusuran konkret melalui sebuah use case, menyatakan apa saja yang terjadi pada sistem.* |
| *Kelas* | *Merepresentasikan suatu jenis objek yang memiliki atribut dan metode/operasi untuk menjalankan tanggung jawabnya.* |
| *Entity Class* | *Kelas yang merepresentasikan data inti atau objek dunia nyata yang sifatnya bertahan lama dalam sistem.* |
| *Boundary Class* | *Kelas yang mengatur komunikasi antara pengguna (aktor) atau sistem luar dengan sistem utama.* |
| *Controller Class* | *Kelas yang mengatur alur kerja dan aturan bisnis (menghubungkan Boundary dan Entity).* |
| *Kebutuhan* | *Merepresentasikan persyaratan atau ketentuan wajib yang harus dipenuhi untuk mencapai suatu tujuan dalam pembuatan sistem atau Perangkat Lunak.* |

## 1.4 Aturan Penomoran

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Mewakili singkatan kata "Kebutuhan Fungsional", diikuti dua digit unik untuk membedakan tiap KF.* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Mewakili singkatan kata "Kebutuhan Non-Fungsional", diikuti dua digit unik untuk membedakan tiap KNF.* |
| *Aktor* | *AXX* | *Mewakili singkatan kata "Aktor", diikuti dua digit unik untuk membedakan tiap aktor.* |
| *Use Case* | *UCXX* | *Mewakili singkatan kata "Use Case", diikuti dua digit unik untuk membedakan tiap UC.* |
| *Kelas* | *CXX* | *Mewakili singkatan kata "Class", diikuti dua digit unik untuk membedakan tiap kelas.* |
| *Kebutuhan* | *RXX* | *Mewakili singkatan kata "Requirement", diikuti dua digit unik untuk membedakan tiap kebutuhan.* |

## 1.5 Referensi

- Diagram UML: [https://www.drawio.com/](https://www.drawio.com/)
- https://nodejs.org/docs/latest-v20.x/api/
- https://expressjs.com/
- https://www.postgresql.org/docs/15/
- https://developers.google.com/maps/documentation/geolocation/
- https://developers.google.com/calendar/api
- Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi: https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022
- Dokumen APL: https://github.com/cynthiawinda/IF2150-RPL-K03-G04/blob/main/docs/M6/K03_G04_APL.md
- Dokumen SKPL: https://github.com/cynthiawinda/IF2150-RPL-K03-G04/blob/main/docs/M5/K03_G04_SKPL.md

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
BAB 1 membahas pendahuluan, yang berisi tujuan, lingkup masalah, definisi, istilah, serta singkatan, aturan penomoran, referensi, dan deskripsi umum dokumen. BAB 2 membahas perancangan arsitektur, yang mencakup rancangan lingkungan implementasi, style/pattern arsitektur acuan, identifikasi komponen, serta model arsitektur perangkat lunak. BAB 3 membahas realisasi use case yang mencakup identifikasi kelas tiap use case, sequence diagram, serta class diagram. BAB 4 membahas diagram kelas keseluruhan, dan BAB 5 membahas matriks kerunutan.


<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Perangkat lunak Mahasehat dirancang dan diimplementasikan berbasis web (*web-based*) menggunakan model *client-server*.

Tabel 2.1. Rancangan Lingkungan Implementasi

| Komponen Lingkungan | Perangkat / Teknologi |
| :--- | :--- |
| *OS (Server)* | Ubuntu Server 22.04 LTS |
| *OS (Client)* | Multiplatform (Android, iOS, Windows, macOS) |
| *Backend* | JavaScript / TypeScript (Node.js, Express.js) |
| *Frontend* | HTML5, CSS3, JavaScript |
| *DBMS* | PostgreSQL 15+ |
| *Filing System* | ext4 & JWT |
| *Dev Tools* | VS Code, Git, GitHub, Postman, pgAdmin 4, PlantUML |
| *External APIs* | Google Maps API, Google Calendar API, Nodemailer (SMTP) |

## 2.2 Style/Pattern Arsitektur Acuan

Arsitektur acuan yang dipilih untuk pengembangan perangkat lunak Mahasehat adalah **MVC (_Model-View-Controller_)**. Pola ini memisahkan logika aplikasi ke dalam tiga komponen utama yang saling terhubung, yaitu _Model_, _View_, dan _Controller_.
1. _Model (`<<entity>>`)_
Bertanggung jawab dalam merepresentasikan dan mengelola data serta logika yang berkaitan dengan entitas pada sistem. Model menangani data yang digunakan dalam proses bisnis dan menyediakan akses terhadap data tanpa bergantung pada bagaimana data tersebut ditampilkan kepada pengguna.
2. _View (`<<boundary>>`)_
Bertanggung jawab dalam menyajikan antarmuka pengguna (_User Interface_) berbasis web responsif kepada aktor, yaitu Pelajar, Orang Tua/Wali, dan Tenaga Kesehatan. View menerima masukan dari pengguna, meneruskannya kepada _Controller_, serta menampilkan hasil pemrosesan dalam bentuk formulir, grafik, informasi, maupun notifikasi.
3. _Controller (`<<control>>`)_
Bertanggung jawab sebagai perantara antara _View_ dan _Model_. _Controller_ menerima request atau aksi dari pengguna melalui _View_, mengatur alur pemrosesan, melakukan validasi yang diperlukan, memanggil _Model_ untuk mengakses atau mengolah data, serta mengembalikan hasil pemrosesan kepada _View_.

<br><br>
Pemilihan pola MVC didasarkan pada karakteristik sistem Mahasehat, terutama keberagaman aktor, pemisahan hak akses, pengolahan data kesehatan, serta kebutuhan keamanan dan responsivitas sistem yang telah didefinisikan pada SKPL:
1. Pemisahan antarmuka dan hak akses pengguna
Mahasehat memiliki tiga jenis aktor, yaitu Pelajar, Orang Tua/Wali, dan Tenaga Kesehatan, yang memiliki kebutuhan serta hak akses berbeda. MVC memungkinkan antarmuka pengguna dipisahkan dari proses pengolahan data sehingga setiap kebutuhan pengguna dapat ditangani melalui _View_ dan _Controller_ yang sesuai. Contohnya pada UC04 (Melihat Statistik dan Laporan Kondisi), Pelajar dapat melihat laporan kondisi personal, sedangkan Orang Tua/Wali hanya memperoleh data ringkasan sesuai hak aksesnya. Pemisahan ini didukung oleh ReportPage sebagai View dan ReportController sebagai Controller yang mengatur kalkulasi statistik serta pembatasan akses data berdasarkan peran pengguna. Hal ini juga selaras dengan KNF02 yang mengharuskan data yang diberikan kepada Orang Tua/Wali tidak mencakup teks jurnal pribadi Pelajar.
2. Pemisahan pengolahan data dan antarmuka
Mahasehat mengolah berbagai data dari _daily check-in_, seperti skala mood dan pola tidur, menjadi grafik tren, rangkuman kondisi, serta indikator risiko. Pemisahan antara _Model_, _View_, dan _Controller_ memungkinkan proses pengolahan data tersebut dilakukan tanpa mencampurkannya dengan kode antarmuka pengguna. Sebagai contoh, LaporanKesehatan berperan dalam merepresentasikan hasil pengolahan laporan, sedangkan ReportController mengatur kalkulasi statistik, pembuatan grafik, serta evaluasi ambang batas. Sementara itu, ReportPage bertanggung jawab menampilkan hasil tersebut kepada pengguna.
3. Mendukung keamanan dan kebutuhan non-fungsional
Mahasehat menangani data kesehatan dan catatan _daily check-in_ yang bersifat sensitif. Pemisahan tanggung jawab dalam MVC memudahkan pengelolaan akses dan pemrosesan data secara terstruktur sehingga logika keamanan tidak perlu ditempatkan langsung pada antarmuka pengguna. Hal ini mendukung KNF01 mengenai enkripsi data kesehatan dan check-in menggunakan AES-256 serta KNF02 mengenai pembatasan akses data berdasarkan hak pengguna.
4. Mendukung aplikasi _web_ responsif
Mahasehat dirancang sebagai aplikasi web responsif yang digunakan oleh pengguna melalui peramban pada berbagai perangkat. Pemisahan View dari proses bisnis memungkinkan antarmuka dikembangkan secara responsif tanpa mengubah logika pengolahan data pada _Controller_ dan _Model_. Hal ini sesuai dengan KNF07 dan KNF08 yang menekankan kemudahan dan kecepatan proses _daily check-in_ serta kompatibilitas pada berbagai peramban dan perangkat.

<br><br>
<p align="center">
<img alt="Arsitektur MVC" src="./assets/diagram/arsitektur-mvc.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur MVC</i>
</p>
<br><br>

Tabel 1.1. Spesifikasi Lingkungan Operasi Perangkat Lunak
| Komponen | Spesifikasi |
| :--- | :--- |
| *Server Application* | Node.js v20.x LTS or Express.js |
| *Database Management System (DBMS)* | PostgreSQL 15+ |
| *Client Side (Perangkat Pengguna)* | Web browser modern |
| *External APIs & Services* | Geolocation API & Google Maps Platform |
| *External APIs & Services* | Google Calendar API |
| *External APIs & Services* | SMTP or Mail Service (Nodemailer/SendGrid) |
| *Operating System for Server* | Ubuntu Server 22.04 LTS or Linux Cloud Environment |
| *Protokol Keamanan* | HTTPS dengan sertifikat SSL/TLS & enkripsi AES-256 |

Kaitan teknologi dengan pola MVC yang dipilih:
1. Node.js dan Express.js sebagai lingkungan _Controller_
Node.js dan Express.js digunakan sebagai lingkungan _server-side_ untuk menjalankan logika aplikasi. Pada implementasi MVC, _route handler_ dan komponen _Controller_ yang dibangun menggunakan Express.js menangani _request_ dari _View_, mengatur alur pemrosesan, serta menghubungkan _View_ dengan _Model_.
2. PostgreSQL sebagai penyimpanan data _Model_
PostgreSQL digunakan sebagai DBMS untuk menyimpan data yang direpresentasikan oleh _Model_, seperti data pengguna, _daily check-in_, laporan kesehatan, fasilitas kesehatan, dan jadwal konsultasi. Dengan demikian, _Model_ menjadi bagian yang mengelola representasi dan akses terhadap data sistem.
3. Web UI sebagai _View_
Antarmuka berbasis _web_ responsif pada peramban pengguna berperan sebagai _View_ dalam pola MVC. Komponen seperti CheckInPage, ReportPage, dan PengajuanKonsultasiPage menyediakan antarmuka untuk menerima masukan pengguna serta menampilkan hasil pemrosesan sistem.
4. External APIs & Services sebagai integrasi yang diakses melalui _Controller_
Layanan eksternal seperti Geolocation API, Google Maps Platform, Google Calendar API, dan Mail Service digunakan untuk mendukung fungsi pencarian tenaga kesehatan, penjadwalan konsultasi, serta pengiriman notifikasi. Integrasi tersebut ditangani melalui alur pemrosesan pada _Controller_ sehingga detail layanan eksternal tidak perlu ditangani langsung oleh _View_.


## 2.3 Identifikasi Komponen / Modul / Subsistem

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis                 | Penjelasan                                                                                                           |
| :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------- |
| *Pengguna*                 | *Model*                | *Merepresentasikan data akun pengguna yang dimiliki ketiga aktor.*     |
| *CheckIn*                 | *Model*                | *Merepresentasikan data hasil daily check-in pelajar berupa skala mood, durasi tidur, pola makan, faktor pemicu stress, catatan jurnal, dan tanggal pencatatannya.*     |
| *Pelajar*                 | *Model*                | *Merepresentasikan data akun pelajar yang melakukan registrasi, check-in harian, melihat statistik kondisi kesehatan, dan menentukan jadwal konsultasi dengan tenaga kesehatan.*     |
| *LaporanKesehatan*                 | *Model*                | *Menyimpan dan mengolah data hasil check-in menjadi data tren mingguan/bulanan, menyusun rangkuman kondisi kesehatan, dan menerapkan logika ambang batas untuk mendeteksi kondisi darurat pada pelajar.*     |
| *OrangTuaWali*                 | *Model*                | *Merepresentasikan data akun pengguna orang tua/wali yang mengonfirmasi registrasi akun pelajar di bawah umur, memantau laporan kondisi kesehatan pelajar, dan menerima serta menindaklanjuti notifikasi darurat.*     |
| *FasilitasKesehatan*                 | *Model*                | *Merepresentasikan data fasilitas kesehatan atau klinik yang direkomendasikan pada fitur pencarian, termasuk lokasi dan estimasi biaya konsultasi.*     |
| *TenagaKesehatan*                 | *Model*                | *Merepresentasikan data akun pengguna psikolog/psikiater yang dapat dipilih pelajar dari daftar rekomendasi dan meninjau pengajuan konsultasi yang masuk.*     |
| *JadwalKonsultasi*                 | *Model*                | *Merepresentasikan data pengajuan jadwal konsultasi antara pelajar dan tenaga kesehatan beserta statusnya.*     |
| *RiwayatKesehatan*                 | *Model*                | *Merepresentasikan data riwayat kesehatan mental dan kontak orang tua/wali yang diisi pelajar ketika proses registrasi akun.*     |
| *RegistrationPage*                 | *View*                | *Menampilkan formulir registrasi akun bagi pelajar.*     |
| *CariTenagaKesehatanPage*                 | *View*                | *Menampilkan daftar tenaga kesehatan, lokasi fasilitas kesehatan, estimasi biaya konsultasi, dan informasi jarak.*     |
| *ProfilTenagaKesehatanPage*               | *View*                | *Menampilkan profil tenaga kesehatan yang dipilih pelajar.*     |
| *CheckInPage*               | *View*                | *Menampilkan formulir pengisian daily check-in bagi pelajar.*     |
| *PengajuanKonsultasiPage*               | *View*                | *Menampilkan formulir pengajuan konsultasi serta jadwal yang dipilih oleh pelajar.*     |
| *ReportPage*                         | *View*                 | *Merepresentasikan antarmuka visualisasi grafik statistik, tren mingguan/bulanan, dan rangkuman kondisi.*                                                                                                                |
| *LoginPage*                         | *View*                 | *Merepresentasikan antarmuka login untuk pengguna serta fitur lupa password.*                                                                                                                |
| *ResetPasswordPage*                         | *View*                 | *Merepresentasikan antarmuka untuk memasukkan e-mail serta password baru.*                                                                                                                |
| *DashboardPage*                         | *View*                 | *Merepresentasikan antarmuka halaman utama setelah pengguna berhasil masuk akun.*                                                                                                                |
| *SettingPage*                         | *View*                 | *Merepresentasikan antarmuka halaman pengaturan/profil yang menyediakan opsi keluar akun.*                                                                                                                |
| *AuthController*                         | *Controller*                 | *Mengatur proses registrasi,login, dan logout, memvalidasi data akun pengguna, mengatur proses konfirmasi, perubahan status registrasi akun, sesi login, dan mengakhiri sesi login pengguna.*                                                                                                                |
| *TenagaKesehatanController*                         | *Controller*                 | *Mengatur proses pencarian tenaga kesehatan, pemrosesan izin akses lokasi, perhitungan jarak ke fasilitas kesehatan, dan pemilihan tenaga kesehatan.*                                                                                                                |
| *CheckInController*                         | *Controller*                 | *Mengatur proses penerimaan masukan, validasi format masukan, dan penyimpanan data check-in.*                                                                                                                |
| *JadwalKonsultasiController*                         | *Controller*                 | *Mengatur proses pemuatan jadwal, pengecekan dan pembaruan ketersediaan, dan pemilihan jadwal.*                                                                                                                |
| *NotifikasiPengingatController*                         | *Controller*                 | *Mengatur penjadwalan dan pengiriman notifikasi pengingat harian ke peramban pengguna.*                                                                                                                |
| *KonsultasiController*                         | *Controller*                 | *Mengatur proses pengelolaan pengajuan konsultasi, termasuk persetujuan dan perubahan jadwal.*                                                                                                                |
| *ReportController*                         | *Controller*                 | *Mengatur kalkulasi data statistik, pembuatan grafik, pembatasan filter privasi wali, serta evaluasi ambang batas.*                                                                                                                |
| *NotifikasiDaruratController*                         | *Controller*                 | *Mengatur pengiriman notifikasi darurat, pengambilan detail kondisi darurat, pencatatan konfirmasi penerimaan, dan pencatatan tindak lanjut.*                                                                                                                |
| *PasswordController*                         | *Controller*                 | *Mengatur reset password, termasuk pengiriman tautan reset.*                                                                                                                |
## 2.4 Model Arsitektur Perangkat Lunak

Pada bab ini, arsitektur perangkat lunak Mahasehat dimodelkan melalui dua *architectural view* yang saling melengkapi. *Logical View* (3.1) memperlihatkan pembagian komponen dan hubungan antarkomponen yang menyediakan fitur aplikasi, sedangkan *Physical View* (3.2) memperlihatkan perangkat atau *node* tempat setiap komponen dijalankan beserta jalur komunikasinya. Kedua *view* memuat 29 komponen pada Tabel 2.1 dengan nama yang sama persis, yaitu 9 *Model*, 10 *View*, dan 9 *Controller*, serta mengikuti pola MVC yang dipilih pada BAB 1. Setiap garis pada diagram diberi label agar hubungan antarkomponen dapat dipahami tanpa penjelasan tambahan.

### 2.4.1 View Logical

Logical View digunakan untuk mendeskripsikan abstraksi utama dalam aplikasi Mahasehat beserta hubungan antarobjek/kelas yang mendukung kebutuhan fungsional sistem. View ini berfokus pada hubungan antarobjek yang digunakan untuk menyediakan fitur dalam aplikasi.

Logical View cocok digunakan pada Mahasehat karena dapat membantu pembaca memahami pembagian fungsi dan hubungan layanan yang mendukung kebutuhan aplikasi. Mahasehat memiliki berbagai objek yang saling berhubungan dalam mendukung fungsi utamanya, salah satunya pemantauan kesehatan mental dan layanan konsultasi. Objek seperti Pelajar, OrangTuaWali, TenagaKesehatan, RiwayatKesehatan, dan JadwalKonsultasi memiliki keterhubungan satu sama lain dalam menyediakan layanan dalam aplikasi

<p align="center">
<img alt="Logical View" src="./assets/diagram/logical-view.png" width="100%">
</p>
<p align="center">
<i>Gambar 2. Logical View</i>
</p>

### 2.4.2 View Physical
*Physical View* menggambarkan pemetaan komponen perangkat lunak ke perangkat (*node*) tempat komponen dijalankan beserta jalur komunikasinya.

*Physical View* dipilih untuk Mahasehat karena aplikasi ini adalah aplikasi web *client-server* yang bergantung pada layanan eksternal (lokasi, kalender, e-mail) dan menangani data kesehatan sensitif yang harus dilindungi saat transmisi dan penyimpanan. Pertanyaan yang dijawab oleh *view* ini adalah: di perangkat atau *node* mana setiap komponen dijalankan, dan melalui protokol apa komponen-komponen itu berkomunikasi. Jawabannya menunjukkan lingkungan operasi pada Tabel 1.1 dan penempatan komponen yang mendukung KNF01, KNF05, KNF08, dan KNF09. *View* ini menggambarkan seluruh sistem dan memuat 29 komponen pada Tabel 2.1 dengan nama yang sama persis, yaitu 9 *Model*, 11 *View*, dan 9 *Controller*, serta mengikuti pola MVC yang dipilih pada BAB 1.

<p align="center">
<img alt="UML Deployment Diagram Mahasehat" src="./assets/diagram/uml-deployment-diagram.png" width="100%">
</p>
<p align="center">
<i>Gambar 3. Physical View Mahasehat (UML Deployment Diagram)</i>
</p>

Gambar 3 menggambarkan lingkungan operasi pada Tabel 1.1 dalam tiga *deployment node*. Ketiga layanan pihak ketiga ditempatkan pada batas `«externalSystem»`, bukan dianggap sebagai satu *node* milik Mahasehat, karena perangkat dan lingkungan eksekusinya berada di luar kendali perangkat lunak. Pembagian MVC terlihat pada artefak: *View* berada pada artefak sisi klien, sedangkan *Controller* dan *Model* berada pada artefak sisi server. Basis data diletakkan sejajar dengan *Model* sebagai pemilik akses data, dan layanan eksternal diletakkan sejajar dengan *Controller* sebagai pemilik integrasi, sehingga setiap jalur komunikasi dapat ditelusuri ke komponen asalnya tanpa garis yang saling bersilangan.

Notasi pada Gambar 3:

| Elemen UML | Penggunaan pada Mahasehat |
| :--- | :--- |
| `«device»` | Perangkat pengguna, server aplikasi, dan server basis data sebagai tiga *deployment node*. |
| `«executionEnvironment»` | Web browser modern, Node.js v20.x LTS or Express.js pada Linux, dan PostgreSQL 15+. |
| `«artifact»` | `Web UI Responsif` dan `Mahasehat Server Application` sebagai artefak yang dideploy. |
| `«component»` | Seluruh 29 komponen Tabel 2.1 yang diwujudkan oleh kedua artefak. |
| `«database»` | `MahasehatDB` sebagai penyimpanan persisten bagi seluruh *Model*. Nama ini adalah nama artefak deployment, bukan komponen tambahan pada Tabel 2.1. |
| `«externalSystem»` | Batas bagi Geolocation API/Google Maps, Google Calendar, dan Mail Service yang tidak dikelola Mahasehat. |
| `«constraint»` | Batas kompatibilitas dan memori klien (KNF08–KNF09), ketersediaan server aplikasi (KNF05), serta enkripsi data saat tersimpan (KNF01). |
| Garis berpanah | *Communication path* yang diberi protokol dan, untuk layanan eksternal, keluar dari *controller* yang bertanggung jawab. Garis putus-putus menunjukkan komunikasi event atau pemanggilan layanan eksternal. |

Komponen pada tiap artefak disusun berurutan satu per satu sesuai Tabel 2.1 hanya untuk mencantumkan seluruh komponen; urutan baris tidak menyatakan relasi antarkomponen. Hubungan logis antarkomponen dijelaskan pada Logical View (3.1) dan diagram kelas M4.

### 2.4.2.1 Pemetaan Komponen ke *Node*

Tabel 3.4. Pemetaan komponen ke *node*

| *Node* | *Execution environment* (Tabel 1.1) | Artefak | Keterangan (komponen Tabel 2.1 yang ditempatkan) |
| :--- | :--- | :--- | :--- |
| Node 1: Perangkat Pengguna (`«device»`) | *Client Side (Perangkat Pengguna)*: Web browser modern. Sesuai KNF08: Chrome 100+, Safari 15+, dan Firefox 100+ pada Android 8.0+, iOS 14+, dan Windows 10/11 | Antarmuka web responsif (halaman *View*) | Seluruh *View*: `RegistrationPage`, `KonfirmasiRegistrasiPage`, `LoginPage`, `ResetPasswordPage`, `DashboardPage`, `SettingPage`, `CheckInPage`, `ReportPage`, `CariTenagaKesehatanPage`, `ProfilTenagaKesehatanPage`, `PengajuanKonsultasiPage`. Kendala: memori sisi klien maksimal 150 MB (KNF09) |
| Node 2: Server Aplikasi (`«device»`) | *Server Application*: Node.js v20.x LTS or Express.js; *Operating System for Server*: Ubuntu Server 22.04 LTS or Linux Cloud Environment | Aplikasi *server-side* berisi *route handler* dan logika *Controller* | Seluruh *Controller*: `AuthController`, `PasswordController`, `NotifikasiDaruratController`, `NotifikasiPengingatController`, `CheckInController`, `ReportController`, `TenagaKesehatanController`, `KonsultasiController`, `JadwalKonsultasiController`. Kendala: ketersediaan minimal 99,5% (KNF05) |
| Node 2: Server Aplikasi (`«device»`) | Sama dengan baris di atas | Kelas *Model* yang merepresentasikan dan mengakses data | Seluruh *Model*: `Pengguna`, `RiwayatKesehatan`, `OrangTuaWali`, `Pelajar`, `CheckIn`, `LaporanKesehatan`, `FasilitasKesehatan`, `TenagaKesehatan`, `JadwalKonsultasi` |
| Node 3: Server Basis Data (`«device»`) | *Database Management System (DBMS)*: PostgreSQL 15+ | Skema basis data dan data persisten milik seluruh *Model* | Data kesehatan dan *check-in* dienkripsi AES-256 saat tersimpan sesuai KNF01 |
| Batas sistem eksternal (`«externalSystem»`, di luar P/L) | *External APIs & Services*; bukan lingkungan eksekusi yang dikelola Mahasehat | Antarmuka API dan layanan pihak ketiga | Geolocation API & Google Maps Platform, Google Calendar API, SMTP or Mail Service (Nodemailer/SendGrid). Tidak termasuk Tabel 2.1 |

### 2.4.2.2 Jalur Komunikasi

Tabel 3.5. Jalur komunikasi antar-*node*

| Dari → Ke | Label pada Gambar 3 | Keterangan |
| :--- | :--- | :--- |
| Node 1 ↔ Node 2 | HTTPS (SSL/TLS): *request/response* | *View* di peramban mengirim *request* ke *route handler Controller*, kemudian server mengembalikan hasil pemrosesan melalui kanal terenkripsi yang sama. |
| Node 2 → Node 1 | HTTPS: data pengingat → notifikasi peramban | `NotifikasiPengingatController` mengirim data pengingat harian ke peramban pelajar sesuai spesifikasi komponen pada SKPL dan Tabel 2.1, dan peramban mengarahkan pelajar ke `CheckInPage` (UC03). Jalur ini tidak menambahkan layanan *push* eksternal yang tidak disebutkan dalam SKPL. |
| Node 2 ↔ Node 3 | Model: SQL baca / tulis | *Model* membaca dan menulis data ke PostgreSQL. Panah ini berasal dari *Model*, bukan dari *Controller*, karena *Controller* hanya mengakses data melalui *Model*. SKPL menetapkan AES-256 untuk data kesehatan dan *check-in* saat tersimpan, bukan untuk seluruh data tanpa pengecualian. |
| Controller → Geolocation API & Google Maps Platform | HTTPS API: lokasi & jarak | `TenagaKesehatanController` memanggil Geolocation API dan Google Maps Platform untuk lokasi dan jarak ke fasilitas kesehatan (KNF03). |
| Controller → Google Calendar API | HTTPS API: jadwal | `JadwalKonsultasiController` memanggil Google Calendar API untuk ketersediaan dan pengajuan jadwal. |
| Controller → SMTP or Mail Service | SMTP/API: kode verifikasi | `AuthController` mengirim kode verifikasi dan konfirmasi registrasi melalui Mail Service. |
| Controller → SMTP or Mail Service | SMTP/API: tautan reset | `PasswordController` mengirim tautan reset *password* melalui Mail Service. |
| Controller → SMTP or Mail Service | SMTP/API: notifikasi darurat; retry <= 3x | `NotifikasiDaruratController` mengirim notifikasi darurat melalui Mail Service. Saat transmisi gagal, *controller* ini mengulang pengiriman otomatis maksimal tiga kali sesuai KNF06. |
| Controller → SMTP or Mail Service | SMTP/API: pengingat harian | `NotifikasiPengingatController` juga mengirim pengingat harian melalui Mail Service, karena SKPL pada bagian lingkungan operasi menyebut *Mail Server* digunakan untuk mengirim pengingat, notifikasi darurat, dan informasi akun. Pengingat ini melengkapi jalur notifikasi peramban di atas. |

### 2.4.2.3 Alasan Penempatan

1. ***View* di sisi klien, *Controller* dan *Model* di sisi server.** *View* berupa antarmuka web responsif yang dijalankan pada kombinasi peramban dan sistem operasi dalam KNF08. Logika bisnis dan akses data ditempatkan di server agar tidak bergantung pada perangkat pengguna. Batas memori sisi klien maksimal 150 MB (KNF09) dicantumkan sebagai kendala deployment; penempatan ini membantu mengurangi beban klien, tetapi pemenuhannya tetap harus diukur saat implementasi.
2. **Hak akses dan privasi ditegakkan di server (KNF02).** Pembatasan data orang tua/wali, termasuk tidak diberikannya teks jurnal pelajar, dijalankan oleh *Controller* pada Node 2, bukan oleh *View* di perangkat pengguna yang berada di luar kendali sistem.
3. **Basis data dipisahkan dari server aplikasi.** Pemisahan ini memberi batas perlindungan dan pengelolaan tersendiri untuk data kesehatan (AES-256, KNF01), sekaligus memungkinkan strategi pencadangan dan penskalaan diterapkan secara terpisah. Pemisahan *node* saja belum menjamin ketersediaan 99,5% (KNF05); pencapaiannya tetap memerlukan pemantauan, pencadangan, dan mekanisme pemulihan pada tahap implementasi dan operasi.
4. **Layanan eksternal hanya diakses dari server.** Kunci API dan detail layanan eksternal tidak ditangani langsung oleh *View*, sesuai pernyataan pada BAB 1 bahwa integrasi layanan eksternal ditangani melalui *Controller*. Setiap koneksi ke layanan eksternal pada Gambar 3 keluar dari baris *controller* pemilik integrasinya agar keputusan deployment dapat ditelusuri kembali ke Tabel 2.1.
5. **Komunikasi peramban ke server memakai kanal terenkripsi.** Jalur Node 1 ↔ Node 2 memakai HTTPS dengan sertifikat SSL/TLS sesuai protokol keamanan pada Tabel 1.1, sedangkan data kesehatan dan *check-in* yang tersimpan di basis data dienkripsi AES-256 (KNF01). Pengamanan koneksi antara server aplikasi dan basis data tidak ditetapkan pada SKPL sehingga diputuskan pada tahap implementasi.

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case Melakukan Registrasi Akun

**ID Use Case:** *UC01*  
**Nama Use Case:** *Melakukan Registrasi Akun*

### 3.1.1 Identifikasi Kelas

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *RegistrasiPage* | *RegistrasiPage* |
| 2 | *AuthController* | *AuthController* |
| 3 | *Pengguna* | *Pengguna* |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC01]" src="./assets/diagram/SD_UC01_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.1.1. Sequence Diagram [UC01]</i>
</p>

- **Skenario Alternatif 1: Masukan Pengguna Tidak Valid**

<p align="center">
<img alt="Sequence Diagram [UC01] - [Masukan Pengguna Tidak Valid]" src="./assets/diagram/SD_UC01_alt.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.1.2. Sequence Diagram [UC01] - [Masukan Pengguna Tidak Valid]</i>
</p>

### 3.1.3 Diagram Kelas

<p align="center">
<img alt="Diagram kelas UC01" src="./assets/diagram/CD_UC01.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.1.3. Diagram Kelas [Melakukan Registrasi Akun]</i>
</p>

## 3.2 Use Case Mengonfirmasi Registrasi Akun

**ID Use Case:** *UC02*  
**Nama Use Case:** *Mengonfirmasi Registrasi Akun*

### 3.2.1 Identifikasi Kelas

Tabel 3.2. Identifikasi Kelas Use Case [UC02]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *KonfirmasiRegistrasiPage* | *KonfirmasiRegistrasiPage* |
| 2 | *AuthController* | *AuthController* |
| 3 | *OrangTuaWali* | *OrangTuaWali* |
| 4 | *Pelajar* | *Pelajar* |

### 3.2.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC02]" src="./assets/diagram/SD_UC02_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.1. Sequence Diagram [UC02]</i>
</p>

- **Skenario Alternatif 1: Orang Tua/Wali Tidak Mengonfirmasi Registrasi Akun**

<p align="center">
<img alt="Sequence Diagram [UC01] - [Orang Tua/Wali Tidak Mengonfirmasi Registrasi Akun]" src="./assets/diagram/SD_UC02_alt.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.2. Sequence Diagram [UC02] - [Orang Tua/Wali Tidak Mengonfirmasi Registrasi Akun]</i>
</p>

### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC02" src="./assets/diagram/CD_UC02.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.2.3. Diagram Kelas [Mengonfirmasi Registrasi Akun]</i>
</p>


## 3.3 Use Case Melakukan Daily Check-in

**ID Use Case:** *UC03*  
**Nama Use Case:** *Melakukan Daily Check-in*

### 3.3.1 Identifikasi Kelas


Tabel 3.1. Identifikasi Kelas Use Case [UC03]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelajar* | *Pelajar* |
| 2 | *CheckIn* | *CheckIn* |
| 3 | *CheckInPage* | *CheckInPage* |
| 4 | *CheckInController* | *CheckInController* |
| 5 | *NotificationPengingatController* | *NotificationPengingatController* |

### 3.3.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC03_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.1. Sequence Diagram [UC03]</i>
</p>

- **Skenario Alternatif 1: Pelajar Tidak Mengisi Catatan Refleksi Harian**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC03_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.2. Sequence Diagram [UC03] - [Pelajar Tidak Mengisi Catatan Refleksi Harian]</i>
</p>

### 3.3.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD_UC03.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.3.3. Diagram Kelas [Melakukan Daily Check-In]</i>
</p>

## 3.4 Use Case Melihat Statistik dan Laporan Kondisi

**ID Use Case:** *UC04*  
**Nama Use Case:** *Melihat Statistik dan Laporan Kondisi*

### 3.4.1 Identifikasi Kelas

Tabel 3.4. Identifikasi Kelas Use Case [UC04]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelajar* | *Pelajar* |
| 2 | *OrangTuaWali* | *OrangTuaWali* |
| 3 | *CheckIn* | *CheckIn* |
| 4 | *LaporanKesehatan* | *LaporanKesehatan* |
| 5 | *ReportPage* | *ReportPage* |
| 6 | *ReportController* | *ReportController* |

### 3.4.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC04_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.4.1. Sequence Diagram [UC04]</i>
</p>

- **Skenario Alternatif 1: Data Check-In Belum Dapat Divisualisasikan**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/SD_UC04_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.4.2. Sequence Diagram [UC04] - [Data Check-In Belum Dapat Divisualisasikan]</i>
</p>

### 3.4.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/CD_UC04.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.4.3. Diagram Kelas [Melihat Statistik dan Laporan Kondisi]</i>
</p>

## 3.5 Use Case Menentukan Tenaga Kesehatan

**ID Use Case:** *UC05*  
**Nama Use Case:** *Menentukan Tenaga Kesehatan*

### 3.5.1 Identifikasi Kelas

Tabel 3.5. Identifikasi Kelas Use Case [UC05]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *CariTenagaKesehatanPage* | *CariTenagaKesehatanPage* |
| 2 | *ProfilTenagaKesehatanPage* | *ProfilTenagaKesehatanPage* |
| 3 | *TenagaKesehatanController* | *TenagaKesehatanController* |
| 4 | *Pelajar* | *Pelajar* |
| 5 | *TenagaKesehatan* | *TenagaKesehatan* |
| 6 | *FasilitasKesehatan* | *FasilitasKesehatan* |

### 3.5.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC05]" src="./assets/diagram/SD_UC05_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.5.1. Sequence Diagram [UC05]</i>
</p>

Pelajar membuka halaman pencarian, lalu `TenagaKesehatanController` memuat daftar `TenagaKesehatan` dan `FasilitasKesehatan`, kemudian mengambil profil, lokasi, dan estimasi biaya konsultasi untuk disusun menjadi daftar ringkasan. Setelah pelajar memberikan izin akses lokasi, lokasi perangkat dicatat pada `Pelajar`, lalu controller mengambil lokasi setiap fasilitas kesehatan dan menghitung jaraknya melalui `calculateDistances()`. Ketika pelajar memilih salah satu tenaga kesehatan, controller mengambil profilnya dan menampilkannya melalui `ProfilTenagaKesehatanPage`.

- **Skenario Alternatif 1: Akses Lokasi Tidak Diberikan**

<p align="center">
<img alt="Sequence Diagram [UC05] - [Akses Lokasi Tidak Diberikan]" src="./assets/diagram/SD_UC05_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.5.2. Sequence Diagram [UC05] - [Akses Lokasi Tidak Diberikan]</i>
</p>

Langkah 1 dan langkah 3 sama dengan skenario normal sehingga dirujuk dengan fragmen `ref`. Ketika pelajar menolak izin akses lokasi, `processLocationPermission(false, null)` masuk ke cabang `[izinLokasi = false]`: lokasi tidak disimpan dan jarak tidak dihitung, sehingga halaman tetap menampilkan daftar tenaga kesehatan tanpa informasi jarak.

### 3.5.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas [Menentukan Tenaga Kesehatan]" src="./assets/diagram/CD_UC05.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.5.3. Diagram Kelas [Menentukan Tenaga Kesehatan]</i>
</p>

## 3.6 Use Case Mengajukan Jadwal Konsultasi

**ID Use Case:** *UC06*  
**Nama Use Case:** *Mengajukan Jadwal Konsultasi*

### 3.6.1 Identifikasi Kelas

Tabel 3.6. Identifikasi Kelas Use Case [UC06]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *ProfilTenagaKesehatanPage* | *ProfilTenagaKesehatanPage* |
| 2 | *PengajuanKonsultasiPage* | *PengajuanKonsultasiPage* |
| 3 | *JadwalKonsultasiController* | *JadwalKonsultasiController* |
| 4 | *Pelajar* | *Pelajar* |
| 5 | *TenagaKesehatan* | *TenagaKesehatan* |
| 6 | *JadwalKonsultasi* | *JadwalKonsultasi* |

### 3.6.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC06]" src="./assets/diagram/SD_UC06_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.6.1. Sequence Diagram [UC06]</i>
</p>

`ProfilTenagaKesehatanPage` meminta jadwal yang tersedia kepada `JadwalKonsultasiController`, dan `TenagaKesehatan` menyusun daftar jadwalnya dengan menanyakan ketersediaan setiap `JadwalKonsultasi`. Controller kemudian menampilkan formulir pengajuan pada `PengajuanKonsultasiPage`, sedangkan profil dan jadwal yang tersedia ditampilkan pada halaman profil. Jadwal yang dipilih pelajar diperiksa kembali sebelum ditampilkan pada formulir, dan selama formulir dibuka ketersediaan jadwal diperbarui berulang (fragmen `loop`). Saat pengajuan dikirim, `Pelajar` yang mengajukan konsultasi: `JadwalKonsultasi` memeriksa ketersediaannya sendiri, lalu mengubah status ketersediaan dan status pengajuannya menjadi "Diajukan" agar dapat ditinjau tenaga kesehatan.

- **Skenario Alternatif 1: Jadwal Konsultasi Tidak Lagi Tersedia**

<p align="center">
<img alt="Sequence Diagram [UC06] - [Jadwal Konsultasi Tidak Lagi Tersedia]" src="./assets/diagram/SD_UC06_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.6.2. Sequence Diagram [UC06] - [Jadwal Konsultasi Tidak Lagi Tersedia]</i>
</p>

Ketika `isAvailable()` mengembalikan `false`, cabang `[jadwal tidak tersedia]` menampilkan pemberitahuan dan memuat ulang pilihan jadwal lain. Pelajar kemudian memilih jadwal baru yang diperiksa ulang hingga tersedia. Langkah awal serta pengisian dan pengiriman formulir sama dengan skenario normal sehingga dirujuk dengan fragmen `ref`.

### 3.6.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas [Mengajukan Jadwal Konsultasi]" src="./assets/diagram/CD_UC06.png" width="80%">
</p>
<p align="center">
<i>Gambar 3.6.3. Diagram Kelas [Mengajukan Jadwal Konsultasi]</i>
</p>

## 3.7 Use Case Mengelola Pengajuan Konsultasi

**ID Use Case:** *UC07*  
**Nama Use Case:** *Mengelola Pengajuan Konsultasi*

### 3.7.1 Identifikasi Kelas

Tabel 3.7. Identifikasi Kelas Use Case [UC07]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *PengajuanKonsultasiPage* | *PengajuanKonsultasiPage* |
| 2 | *KonsultasiController* | *KonsultasiController* |
| 3 | *JadwalKonsultasi* | *JadwalKonsultasi* |
| 4 | *Pelajar* | *Pelajar* |
| 5 | *TenagaKesehatan* | *TenagaKesehatan* |

### 3.7.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC07]" src="./assets/diagram/SD_UC07_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.7.1. Sequence Diagram [UC07]</i>
</p>

- **Skenario Alternatif 1: Reschedule Jadwal Konsultasi**

<p align="center">
<img alt="Sequence Diagram [UC07] - [Reschedule Jadwal Konsultasi]" src="./assets/diagram/SD_UC07_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.7.2. Sequence Diagram [UC07] - [Reschedule Jadwal Konsultasi]</i>
</p>

### 3.7.3 Diagram Kelas
<p align="center">
<img alt="Diagram Kelas [Mengelola Pengajuan Konsultasi]" src="./assets/diagram/CD_UC07.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.7.3. Diagram Kelas [Mengelola Pengajuan Konsultasi]</i>
</p>

## 3.8 Use Case Menerima dan Menindaklanjuti Notifikasi Darurat

**ID Use Case:** *UC08*
**Nama Use Case:** *Menerima dan Menindaklanjuti Notifikasi Darurat*

### 3.8.1 Identifikasi Kelas

Tabel 3.8. Identifikasi Kelas Use Case [UC08]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pelajar* | *Pelajar* |
| 2 | *OrangTuaWali* | *OrangTuaWali* |
| 3 | *LaporanKesehatan* | *LaporanKesehatan* |
| 4 | *NotifikasiDaruratController* | *NotifikasiDaruratController* |

### 3.8.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC08]" src="./assets/diagram/SD_UC08_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.8.1. Sequence Diagram [UC08]</i>
</p>

- **Skenario Alternatif 1: Notifikasi Darurat Tidak Direspon**

<p align="center">
<img alt="Sequence Diagram [UC08] - Notifikasi Darurat Tidak Direspon" src="./assets/diagram/SD_UC08_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.8.2. Sequence Diagram [UC08] - Notifikasi Darurat Tidak Direspon</i>
</p>

### 3.8.3 Diagram Kelas
<p align="center">
<img alt="Diagram Kelas [Menerima dan Menindaklanjuti Notifikasi Darurat]" src="./assets/diagram/CD_UC08.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.8.3. Diagram Kelas [Menerima dan Menindaklanjuti Notifikasi Darurat]</i>
</p>

## 3.9 Use Case Masuk Akun Pengguna

**ID Use Case:** *UC09*  
**Nama Use Case:** *Masuk Akun Pengguna*

### 3.9.1 Identifikasi Kelas

Tabel 3.9. Identifikasi Kelas Use Case [UC09]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pengguna* | *Pengguna* |
| 2 | *LoginPage* | *LoginPage* |
| 3 | *AuthController* | *AuthController* |
| 4 | *ResetPasswordPage* | *ResetPasswordPage* |
| 5 | *PasswordController* | *PasswordController* |
| 6 | *DashboardPage* | *DashboardPage* |

### 3.9.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC09]" src="./assets/diagram/SD_UC09_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.9.1. Sequence Diagram [UC09]</i>
</p>

- **Skenario Alternatif 1: Kredensial Tidak Valid**

<p align="center">
<img alt="Sequence Diagram [UC09] - [Kredensial Tidak Valid]" src="./assets/diagram/SD_UC09_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.9.2. Sequence Diagram [UC09] - [Kredensial Tidak Valid]</i>
</p>

- **Skenario Alternatif 2: Akun Belum Terverifikasi**

<p align="center">
<img alt="Sequence Diagram [UC09] - [Akun Belum Terverifikasi]" src="./assets/diagram/SD_UC09_alt2.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.9.3. Sequence Diagram [UC09] - [Akun Belum Terverifikasi]</i>
</p>

- **Skenario Alternatif 3: Lupa Password**

<p align="center">
<img alt="Sequence Diagram [UC09] - [Lupa Password]" src="./assets/diagram/SD_UC09_alt3.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.9.4. Sequence Diagram [UC09] - [Lupa Password]</i>
</p>

### 3.9.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas [Masuk Akun Pengguna]" src="./assets/diagram/CD_UC09.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.9.5. Diagram Kelas [Masuk Akun Pengguna]</i>
</p>

## 3.10 Use Case Keluar Akun Pengguna

**ID Use Case:** *UC10*  
**Nama Use Case:** *Keluar Akun Pengguna*

### 3.10.1 Identifikasi Kelas

Tabel 3.10. Identifikasi Kelas Use Case [UC10]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *Pengguna* | *Pengguna* |
| 2 | *SettingPage* | *SettingPage* |
| 3 | *AuthController* | *AuthController* |
| 4 | *LoginPage* | *LoginPage* |

### 3.10.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram [UC10]" src="./assets/diagram/SD_UC10_normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.10.1. Sequence Diagram [UC10]</i>
</p>

- **Skenario Alternatif 1: Membatalkan Keluar Akun**

<p align="center">
<img alt="Sequence Diagram [UC10] - [Membatalkan Keluar Akun]" src="./assets/diagram/SD_UC10_alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.10.2. Sequence Diagram [UC10] - [Membatalkan Keluar Akun]</i>
</p>

### 3.10.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas [Keluar Akun Pengguna]" src="./assets/diagram/CD_UC10.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.10.3. Diagram Kelas [Keluar Akun Pengguna]</i>
</p>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas Keseluruhan" src="./assets/diagram/diagram-kelas-keseluruhan.png" width="50%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan Mahasehat</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *Pengguna* | *idPengguna, username, email, password, role, statusAkun* | *findByUsernameorEmail(), findByEmail(), verifyPassword(), setPassword(), getRole(), getStatusAkun()* |
| *C02* | *Pelajar* | *idPelajar, nama, lokasiSaatIni, statusDarurat, tanggalLahir, nomorTelepon* | *getCheckInHistory(), setCheckIn(), getLokasiSaatIni(), updateEmergencyStatus()* |
| *C03* | *OrangTuaWali* | *idWali, nama, email, nomorTelepon* | *-* |
| *C04* | *TenagaKesehatan* | *idTenagaKesehatan, nama, email, nomorTelepon, jenisTenagaKesehatan, lokasi* | *getProfil()* |
| *C05* | *RiwayatKesehatan* | *riwayatKesehatan* | *-* |
| *C06* | *CheckIn* | *idCheckIn, tanggalCheckIn, skalaMood, jamTidur, jamBangun, polaMakan, pemicuStres, catatanRefleksi* | *createCheckIn(), getCheckInData(), validateData()* |
| *C07* | *LaporanKesehatan* | *periode, ringkasanKondisi, indikatorRisiko, jumlahHariTidakCheckIn* | *evaluateThreshold(), detectEmergency()* |
| *C08* | *FasilitasKesehatan* | *idFasilitas, namaFasilitas, lokasi, estimasiBiaya* | *getLokasi(), getEstimasiBiaya()* |
| *C09* | *JadwalKonsultasi* | *idJadwal, tanggal, waktu, statusKetersediaan, statusPengajuan* | *getDate(), getTime(), getStatus(), updateAvailability(), updateStatus()* |
| *C10* | *RegistrationPage* | *inputDataPelajar, inputDataWali* | *displayFormRegistrasi(), getDataPelajar(), getDataWali(), submitRegistrasi()* |
| *C11* | *AuthController* | *currentUser* | *validateData(), registerAccount(), login(), logout(), validateConfirmation(), confirmAccount(), validateCredentials(), checkAccountStatus(), startSession(), endSession()* |
| *C12* | *KonfirmasiRegistrasiPage* | *dataRegistrasi, statusKonfirmasi* | *displayDataRegistrasi(), confirmRegistrasi()* |
| *C13* | *CheckInPage* | *moodInput, sleepDurationInput, dietInput, triggerInput, reflectionInput* | *showPage(), getInput(), showError(), showSuccessMessage()* |
| *C14* | *CheckInController* | *currentCheckIn* | *submitCheckIn(), validateCheckInFormat(), encryptJournal()* |
| *C15* | *NotifikasiPengingatController* | *reminderSchedule, status* | *sendDailyReminder(), checkPendingCheckIn()* |
| *C16* | *ReportPage* | *selectedPeriod, displayedChart, displayedSummary* | *showPage(), displayChart(), filterViewByRole()* |
| *C17* | *ReportController* | *currentReport* | *calculateStatistics(), buildTrendChart(), applyPrivacyRestriction()* |
| *C18* | *CariTenagaKesehatanPage* | *-* | *showPage(), requestLocationPermission(), displayResults()* |
| *C19* | *ProfilTenagaKesehatanPage* | *tenagaKesehatanDipilih* | *displayProfile(), displayAvailableSchedules()* |
| *C20* | *TenagaKesehatanController* | *-* | *loadTenagaKesehatan(), processLocationPermission(), calculateDistances(), selectTenagaKesehatan()* |
| *C21* | *PengajuanKonsultasiPage* | *selectedTenagaKesehatan, filteredDate, displayedTenagaKesehatan, displayedSchedule, jadwalDipilih, dataPengajuan* | *displayForm(), displaySelectedSchedule(), showUnavailableWarning(), getFormData(), displayTenagaKesehatan(), filterDate(), displayAvailableSchedule(), selectTenagaKesehatan(), filterJenisTenagaKesehatan()* |
| *C22* | *JadwalKonsultasiController* | *-* | *loadAvailableSchedules(), checkAvailability(), selectSchedule(), submitRequest()* |
| *C23* | *KonsultasiController* | *-* | *submitPengajuan(), approvePengajuan(), reschedule()* |
| *C24* | *NotifikasiDaruratController* | *-* | *sendEmergencyNotification(), loadEmergencyDetail(), confirmReceived(), markFollowUp()* |
| *C25* | *LoginPage* | *usernameOrEmailInput, passwordInput* | *showPage(), getInput(), showError(), selectForgotPassword()* |
| *C26* | *ResetPasswordPage* | *emailInput, newPasswordInput, confirmPasswordInput* | *getInput(), showError(), showEmailForm(), showNewPasswordForm(), showMessage()* |
| *C27* | *PasswordController* | *-* | *sendResetLink(), resetPassword(), generateResetLink(), validateNewPassword()* |
| *C28* | *DashboardPage* | *currentUser* | *displayDashboard(), displayUserInfo()* |
| *C29* | *SettingPage* | *currentUser* | *showPage(), selectLogout(), showLogoutConfirmation(), confirmLogout(), cancelLogout()* |


<br>

---

# BAB 5: Matriks Kerunutan

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *[C01 - Pengguna]* | *[UC01 - Melakukan Registrasi Akun, UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Pengguna]* |
| *[C02 - Pelajar]* | *[UC01 - Melakukan Registrasi Akun, UC03 - Melakukan Daily Check-In, UC04 - Melihat Statistik dan Laporan Kondisi, UC05 - Menentukan Tenaga Kesehatan, UC06 - Mengajukan Jadwal Konsultasi, UC08 - Menerima dan Menindaklanjuti Notifikasi Darurat, UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Pengguna]* |
| *[C03 - OrangTuaWali]* | *[UC02 - Mengonfirmasi Registrasi Akun, UC04 - Melihat Statistik dan Laporan Kondisi, UC08 - Menerima dan Menindaklanjuti Notifikasi Darurat, UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Penggua]* |
| *[C04 - TenagarKesehatan]* | *[UC05 - Menentukan Tenaga Kesehatan, UC07 - Mengelola Pengajuan Konsultasi, UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Pengguna]* |
| *[C05 - RiwayatKesehatan]* | *[UC01 - Melakukan Registrasi Akun]* |
| *[C06 - CheckIn]* | *[UC03 - Melakukan Daily Check-In, UC04 - Melihat Statistik dan Laporan Kondisi]* |
| *[C07 - LaporanKesehatan]* | *[UC04 - Melihat Statistik dan Laporan Kondisi, UC08 - Menerima dan Menindaklanjuti Notifikasi Darurat]* |
| *[C08 - FasilitasKesehatan]* | *[UC05 - Menentukan Tenaga Kesehatan]* |
| *[C09 - JadwalKonsultasi]* | *[UC06 - Mengajukan Jadwal Konsultasi, UC07 - Mengelola Pengajuan Konsultasi]* |
| *[C10 - RegistrationPage]* | *[UC01 - Melakukan Registrasi Akun]* |
| *[C11 - AuthController]* | *[UC01 - Melakukan Registrasi Akun, UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Pengguna]* |
| *[C12 - KonfirmasiRegistrasiPage]* | *[UC02 - Mengonfirmasi Registrasi Akun]* |
| *[C13 - CheckInPage]* | *[UC03 - Melakukan Daily Check-In]* |
| *[C14 - CheckInController]* | *[UC03 - Melakukan Daily Check-In]* |
| *[C15 - NotifikasiPengingatController]* | *[UC03 - Melakukan Daily Check-In]* |
| *[C16 - ReportPage]* | *[UC04 - Melihat Statistik dan Laporan Kondisi]* |
| *[C17 - ReportController]* | *[UC04 - Melihat Statistik dan Laporan Kondisi]* |
| *[C18 - CariTenagaKesehatanPage]* | *[UC05 - Menentukan Tenaga Kesehatan]* |
| *[C19 - ProfilTenagaKesehatanPage]* | *[UC05 - Menentukan Tenaga Kesehatan, UC06 - Mengajukan Jadwal Konsultasi]* |
| *[C20 - TenagaKesehatanController]* | *[UC05 - Menentukan Tenaga Kesehatan]* |
| *[C21 - PengajuanKonsultasiPage]* | *[UC06 - Mengajukan Jadwal Konsultasi, UC07 - Mengelola Pengajuan Konsultasi]* |
| *[C22 - JadwalKonsultasiController]* | *[UC06 - Mengajukan Jadwal Konsultasi]* |
| *[C23 - KonsultasiController]* | *[UC07 - Mengelola Pengajuan Konsultasi]* |
| *[C24 - NotifikasiDaruratController]* | *[UC08 - Menerima dan Menindaklanjuti Notifikasi Darurat]* |
| *[C25 - LoginPage]* | *[UC09 - Masuk Akun Pengguna, UC10 - Keluar Akun Pengguna]* |
| *[C26 - ResetPasswordPage]* | *[UC09 - Masuk Akun Pengguna]* |
| *[C27 - PasswordController]* | *[UC09 - Masuk Akun Pengguna]* |
| *[C28 - DashboardPage]* | *[UC09 - Masuk Akun Pnegguna]* |
| *[C29 - SettingPage]* | *[UC10 - Keluar Akun Pengguna]* |
