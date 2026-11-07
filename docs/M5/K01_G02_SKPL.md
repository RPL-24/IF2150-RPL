<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK (SKPL)
</h1>
<br>

## *ITBELI*

### Untuk: *Mikhael Andrian Yonatan*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K1* |
| Kelompok | *2*  |

| NIM | Nama |
|---|---|
| *13525124* | *Sulthan Dhiyazka Suwandi* |
| *13525034* | *Dhanesworo Muhammad Datiputro* |
| *13525115* | *Nazhif Hilmi Kistijantoro* |
| *13525121* | *I Made Adi Kusuma Ardana* |
| *13525106* | *Ghaniyul Amri Caulava* |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Menambahkan BAB 1 dan BAB 2 (pendahuluan, deskripsi sistem, deskripsi perangkat lunak, pengguna, batasan, dan lingkungan operasi) serta menyatukan kebutuhan, use case, diagram kelas, dan traceability dari dokumen Requirement Gathering, Use Case, dan Class Diagram ke dalam format SKPL.* |
| *B* | *Diagram kelas UC10–UC12 disesuaikan dengan skenario use case: aksi hapus, tandai terjual, dan batalkan penandaan terjual dilakukan dari C03 HalamanListingPenjual (sebelumnya C04 FormulirBarang), dan verifikasi kepemilikan listing pada UC09–UC12 memakai C28 SesiLogin seperti pada UC07–UC08.* |
| *C* | *Seluruh diagram kelas per use case digambar ulang dengan notasi yang seragam dan diselaraskan dengan diagram kelas keseluruhan: nama atribut dan metode diseragamkan, kelas yang terlibat dilengkapi (UC15–UC17, UC19, UC21–UC24), serta ditambahkan dependensi C20 LaporanController ke C28 SesiLogin dan C21 ModerasiController ke C26 Admin. Diagram kelas keseluruhan digambar ulang dari gabungan diagram per use case.* |
| *D* | *Tabel traceability (BAB 6) disusun ulang berdasarkan diagram kelas per use case dan tabel 4.2, dilengkapi pemeriksaan balik per kebutuhan fungsional. Kolom ID Use Case pada 5.1 disesuaikan dengan diagram per use case.* |

<br>
<br>

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) ini disusun dengan tujuan untuk mendefinisikan, mendokumentasikan, dan merinci seluruh batasan, spesifikasi, kebutuhan fungsional (KF), kebutuhan non-fungsional (KNF), serta arsitektur pemodelan sistem (Diagram Use Case dan Diagram Kelas) dari perangkat lunak ITBELI. Dokumen ini berfungsi sebagai landasan utama, panduan teknis yang mengikat, serta kontrak acuan dasar selama seluruh proses pengembangan perangkat lunak (SDLC).

### Pengguna utama dari dokumen ini meliputi:

#### 1. Pengembang Perangkat Lunak (Software Engineers/Developers): 
Sebagai acuan mutlak dalam menulis kode sumber (source code), membangun struktur basis data, dan mengimplementasikan logika bisnis sistem.

#### 2. Analis Sistem (System Analysts) & Desainer Antarmuka (UI/UX Designers): 
Sebagai pedoman terstruktur dalam merancang alur interaksi antarmuka (UI) dan pengalaman pengguna (UX).

#### 3. Tim Penguji (Quality Assurance/Testers): 
Sebagai standar rujukan pasti dalam menyusun matriks keterlacakan (traceability matrix), skenario pengujian (test case), dan validasi akhir sistem (UAT).

#### 4. Manajer Proyek (Project Managers) & Pemangku Kepentingan (Stakeholders): 
Sebagai tolak ukur evaluasi progres pengembangan, penyelesaian tenggat waktu, dan kelayakan rilis proyek perangkat lunak.
## 1.2 Lingkup Masalah
**ITBELI** adalah sebuah platform aplikasi marketplace barang preloved (bekas layak pakai) yang dirancang secara eksklusif untuk memfasilitasi transaksi jual-beli antar sivitas akademika Institut Teknologi Bandung (ITB). Sistem ini hadir sebagai solusi terpusat untuk mengatasi ketidakefisienan dan risiko penipuan pada transaksi jual-beli barang bekas mahasiswa yang selama ini tersebar tidak terstruktur di berbagai media sosial. Dengan mewajibkan verifikasi identitas menggunakan surel institusi (@itb.ac.id), perangkat lunak ini menyediakan ekosistem niaga yang aman dan tepercaya, dilengkapi dengan fitur manajemen katalog (listing), pencarian dan penyaringan barang spesifik kebutuhan kampus, ruang percakapan internal yang menjaga privasi negosiasi kesepakatan Cash on Delivery (COD), serta dasbor moderasi administratif untuk menindak tegas pelanggaran guna menjaga kenyamanan seluruh pengguna.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu serangkaian instruksi atau program komputer yang dieksekusi untuk menyediakan fitur, fungsi, dan kinerja yang diinginkan.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak (Software Requirements Specification/SRS), yaitu dokumen resmi yang merangkum deskripsi komprehensif terkait perilaku dan kriteria-kriteria yang diperlukan untuk membangun perangkat lunak.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional, yaitu kapabilitas, perilaku, atau aksi spesifik yang harus mampu dilakukan oleh sistem (bagaimana sistem merespons input).* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional, yaitu batasan, kualitas, dan kriteria kinerja sistem (seperti keamanan, keandalan, dan waktu respons) dalam menjalankan fungsi-fungsinya.* |
| *UC* | *Singkatan dari Use Case, yaitu deskripsi interaksi atau skenario langkah demi langkah antara aktor (pengguna) dengan sistem untuk mencapai tujuan tertentu.* |
| *EARS* | *Singkatan dari Easy Approach to Requirements Syntax, yaitu standar pola penulisan spesifikasi kebutuhan bahasa alami agar konsisten, terstruktur, dan tidak ambigu.* |
| *ITBELI* | *Nama dari perangkat lunak (sistem) yang dibangun dan didokumentasikan di dalam dokumen SKPL ini.* |
| *Preloved* | *Istilah untuk barang bekas pakai milik pribadi yang kondisinya masih sangat layak fungsi untuk dijual dan digunakan kembali oleh orang lain.* |
| *Listing* | *Daftar barang dagangan yang dipublikasikan oleh penjual di dalam katalog sistem, mencakup sekumpulan data seperti foto, deskripsi, kondisi, dan harga barang.* |
| *COD* | *Singkatan dari Cash on Delivery, yaitu metode transaksi serah terima barang dan pembayaran secara langsung atau tatap muka di titik temu fisik wilayah kampus yang telah disepakati oleh pembeli dan penjual.* |
| *OTP* | *Singkatan dari One-Time Password, yaitu kode otentikasi berupa karakter numerik/alfanumerik unik yang di-generate oleh sistem dan hanya berlaku satu kali dalam batasan waktu tertentu (contoh: 15 menit) untuk memverifikasi surel pendaftar.* |
| *JWT* | *Singkatan dari JSON Web Token, yaitu standar terbuka untuk mengenkripsi dan membuat token sesi akses (bearer token) yang digunakan untuk memverifikasi hak akses otorisasi pengguna saat mereka masuk (login) ke dalam sistem.* |
| *Bcrypt / Hash* | *Fungsi algoritma kriptografi satu arah yang digunakan untuk mengacak dan menyamarkan kata sandi (password) pengguna sebelum disimpan di basis data, sehingga kerahasiaannya terjaga dan tidak dapat dibaca dalam bentuk teks murni (plain-text).* |
| *Log Audit* | *Catatan rekam jejak digital di dalam basis data sistem yang bersifat permanen, anti-ubah (immutable), dan kronologis untuk melacak kapan dan siapa admin yang melakukan tindakan moderasi tertentu.* |
## 1.4 Aturan Penomoran
Aturan penomoran (ID) pada dokumen ini mengikuti pola yang telah digunakan pada dokumen *Requirement Gathering* (Tugas 2), *Use Case & Scenario Use Case* (Tugas 3), dan *Class Diagram* (Tugas 4). Setiap ID terdiri atas awalan huruf yang menunjukkan jenis artefak dan diikuti dua digit angka urut yang dimulai dari 01 (XX = 01, 02, 03, dst.).

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan (Pemetaan Kebutuhan)* | *RXX* | *R = Requirement. Menandai kebutuhan hasil pemetaan pada dokumen Requirement Gathering (R01–R27) dan dirujuk pada kolom "Kebutuhan" Tabel 3.1 serta kolom "ID Kebutuhan" Tabel 3.2.* |
| *Kebutuhan Fungsional* | *KFXX* | *KF = Kebutuhan Fungsional. Digunakan pada Tabel 3.1 (KF01–KF56).* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *KNF = Kebutuhan Non-Fungsional. Digunakan pada Tabel 3.2 (KNF01–KNF04).* |
| *Aktor* | *AXX* | *A = Aktor. Digunakan pada BAB 4.1 (A01–A03).* |
| *Use Case* | *UCXX* | *UC = Use Case. Digunakan pada BAB 4.2 hingga BAB 6 (UC01–UC24).* |
| *Kelas* | *CXX* | *C = Class. Digunakan pada BAB 5 dan BAB 6 (C01–C40), dengan pembagian C01–C12 untuk kelas boundary, C13–C22 untuk kelas control, dan C23–C40 untuk kelas entity.* |

## 1.5 Referensi
Berikut adalah referensi yang dirujuk dalam penyusunan dokumen ini.

1. Tim Pengajar IF2150, *Materi Perkuliahan (Slide) IF2150 Rekayasa Perangkat Lunak*, Sekolah Teknik Elektro dan Informatika, Institut Teknologi Bandung, Tahun Ajaran 2026/2027.
2. I. Sommerville, *Software Engineering*, 10th ed. Boston: Pearson, 2016.
3. A. Mavin, P. Wilkinson, A. Harwood, dan M. Novak, "Easy Approach to Requirements Syntax (EARS)," dalam *17th IEEE International Requirements Engineering Conference (RE'09)*, 2009, hlm. 317 – 322. https://ieeexplore.ieee.org/document/5328509/
4. M. Fowler, *UML Distilled: A Brief Guide to the Standard Object Modeling Language*, 3rd ed. Boston: Addison-Wesley, 2004.
5. Visual Paradigm, *Mastering UML: A Complete Guide to Use Case and Class Diagrams for Software Design*. https://www.visual-paradigm.com/guide/mastering-uml-a-complete-guide-to-use-case-and-class-diagrams-for-software-design/
6. PlantUML, *Activity Diagram - Syntax and Features*. https://plantuml.com/activity-diagram-beta
7. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022
8. United Nations, *Sustainable Development Goals. Goal 12: Ensure sustainable consumption and production patterns*. https://sdgs.un.org/goals/goal12
9. Kementerian Lingkungan Hidup dan Kehutanan, *Sistem Informasi Pengelolaan Sampah Nasional (SIPSN). Data Timbulan Sampah*. https://sipsn.menlhk.go.id/sipsn/public/data/timbulan
10. Supabase, *Supabase Documentation*. https://supabase.com/docs
11. MDN Web Docs, *Secure Contexts*. https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
BAB 2 membahas mengenai deskripsi umum sistem dan perangkat lunak dari berbagai perspektif aktor, kebutuhan pengguna, batasan perangkat lunak, dan lingkungan operasi dimana perangkat lunak tersebut dapat dijalankan. 

BAB 3 membahas kebutuhan perangkat lunak dengan lebih detil. 

BAB 4 membahas pemodelan use case untuk perangkat lunak.

BAB 5 membahas pemodelan kelas, meliputi identifikasi kelas, diagram kelas per use case, dan diagram kelas keseluruhan.

BAB 6 membahas traceability antara kelas, use case, dan kebutuhan fungsional yang terdapat pada dokumen ini.

---

# BAB 2: Deskripsi Perangkat Lunak

## 2.1 Deskripsi Umum Sistem
**ITBELI** adalah sistem marketplace barang preloved yang dikhususkan bagi civitas ITB, mempertemukan mahasiswa yang ingin melepas barang bekas layak pakai dengan mahasiswa lain yang membutuhkannya dalam satu ekosistem yang terpusat, dapat ditelusuri, dan lebih terpercaya dibandingkan media lainnya maupun marketplace umum yang selama ini digunakan.

Sistem ini melibatkan tiga pihak pengguna yang saling berinteraksi melalui perangkat lunak, yaitu Penjual, Pembeli, dan Admin, ditopang oleh proses bisnis nyata berupa kesepakatan harga dan serah terima barang secara *Cash on Delivery* (COD) di titik temu kampus yang berada di luar cakupan perangkat lunak itu sendiri.

Dari sisi Penjual, ekspektasi utama terhadap sistem adalah kemudahan dan kecepatan proses listing. Penjual mendaftar dan melakukan *login* menggunakan surel berdomain @itb.ac.id, kemudian membuat listing barang dengan mengunggah foto, mengisi deskripsi kondisi, menentukan harga, dan memilih kategori yang sesuai dengan kebutuhan kampus. Begitu listing dipublikasikan, sistem menjangkaunya kepada seluruh mahasiswa ITB yang terverifikasi tanpa bergantung pada jangkauan grup atau *circle* pertemanan penjual. Setelah barang laku, penjual menandai listing sebagai terjual agar tidak lagi muncul di hasil pencarian dan tidak menimbulkan kesalahpahaman bagi calon pembeli lain.

Dari sisi Pembeli, sistem diharapkan menjadi satu titik pencarian tunggal yang efisien. Pembeli mencari barang berdasarkan nama, kategori, atau rentang harga, membuka detail listing untuk melihat foto dan kondisi barang, lalu menghubungi penjual melalui fitur percakapan internal untuk bernegosiasi harga serta menyepakati waktu dan titik temu COD. Seluruh proses ini berlangsung tanpa perlu berpindah ke aplikasi lain, dan pembeli mengharapkan jaminan bahwa pihak yang diajak bertransaksi benar-benar merupakan mahasiswa ITB yang identitasnya dapat dipertanggungjawabkan.

Dari sisi Admin, sistem diharapkan menyediakan sarana untuk menjaga kesehatan platform tanpa mengorbankan privasi pengguna. Admin menerima dan meninjau laporan yang diajukan pengguna terhadap listing maupun akun yang bermasalah, kemudian menindaklanjutinya dengan menghapus listing atau memblokir akun yang terbukti melanggar, sementara isi percakapan pribadi antarpengguna tetap merupakan privasi yang tidak dapat diakses oleh admin.

Secara keseluruhan, alur kerja sistem yang diinginkan dimulai dari pendaftaran dan verifikasi identitas kampus, dilanjutkan dengan publikasi dan pencarian listing, negosiasi melalui percakapan internal, kesepakatan serta serah terima barang secara COD di dunia nyata, hingga penandaan status barang terjual dan penanganan laporan oleh admin bila diperlukan. Dengan alur tersebut, ITBELI diharapkan mengubah proses jual beli preloved yang semula manual, tersebar, dan sangat bergantung pada relasi personal menjadi sebuah pengalaman yang terpusat, tepercaya, dan memiliki jejak yang jelas bagi seluruh penggunanya.

<p align="center">
<img alt="Activity Diagram Proses Bisnis" src="https://uml.planttext.com/plantuml/png/dLHDQzj04BthLmm-f1QaEDy9pQ5nsqiX9W6vXnudqSeQxuV4VZG4_ECxgrsh1bSK2i8hQsVUlFTcTX-SH-k3LiNkMPXjG0Np5RReoBqXV5z_ANV5459yMWbJOyFlYyTkGmPgOJPe06KmCH3coxDpMC2FwkFPUNaVu_LBG0-Ad2UpWHUqo0k7NUIm2muhTXNl2xqR2hoJxXdp1BGmg7jIalzbW1Zxp9X2qJ77_s1dNj7I0QlBl7rvn6fa4cigw5CgcdynqgIetLUeEV-rPJ-ur5KkTNLiWAW9Owajgc11TZeOaWmCgFahvrxdtEkiGjZWOa8l7FzA0RcFYTn4IrCYQSnfaPnc9QZGJR2S5Fe1AZ8UfOCPDJEeewTls08PWivt6ZsvsCyjnYsXU4iA7thq1JLSfsUzBLGYhXw-FdtxN89l1OlzYQVmYD7iiW1WpehRcRHQTYpm6uV3_Abf51d1D07ucPOzW8p2MUvxx0sFcnCMsuYScdMV8v5dQXoHMHLg9heMDeBFeaCtsQ6RiVI-bob_qvBYr3_0R3JFtC400JZVzKKXb1CmNrEDyXIMDS8A7JUZBPEU2UkpANrdOmcTKeQPNuo7vc-yaWEfwLP8r320948nV5bhCdjyYlEG0yOYhFusgxyjir_w5mCtQLmF08URG7MIx6Bm1FlWnblX91rHXhlBS7TJPWhfX0oEXjODU0SEyl6dfdZWXI-ptm00" width="1000">
</p>
<p align="center">
<i>Gambar 1. Activity Diagram Proses Bisnis</i>
</p>

## 2.2 Deskripsi Umum Perangkat Lunak
ITBELI merupakan aplikasi lokapasar (marketplace) eksklusif berbasis percakapan (chat-based) yang dirancang khusus untuk memfasilitasi aktivitas jual beli di lingkungan sivitas akademika Institut Teknologi Bandung (ITB). Lingkup utama perangkat lunak ini berfokus pada fitur pengelolaan katalog barang dan penyediaan ruang percakapan waktu-nyata (real-time chat) sebagai sarana tunggal bagi pengguna untuk melakukan interaksi, tawar-menawar harga, dan kesepakatan titik temu.

Untuk menjaga keamanan dan memvalidasi keanggotaan komunitas, sistem ini terisolasi dan membatasi akses secara ketat, di mana pendaftaran akun dan otentikasi hanya dapat dilakukan oleh pengguna yang memiliki alamat surel berdomain resmi ITB. Pengguna dalam platform ini bersifat dinamis, sehingga satu akun dapat berperan ganda secara bergantian sebagai pembeli maupun penjual.

Terkait keterkaitannya dengan sistem transaksional di luar perangkat lunak, ITBeli sengaja dirancang untuk tidak berinteraksi dengan Payment Gateway (seperti dompet digital atau transfer bank otomatis) maupun antarmuka pemrograman aplikasi (API) dari penyedia layanan logistik pihak ketiga. Perangkat lunak ini hanya memfasilitasi tahapan pra-transaksi. Seluruh proses penyelesaian transaksi pembayaran dan serah terima barang sepenuhnya berada di luar cakupan sistem, dan akan dieksekusi secara luring (offline) melalui mekanisme Cash on Delivery (COD) di wilayah kampus sesuai kesepakatan akhir penjual dan pembeli di dalam ruang percakapan.

## 2.3 Pengguna dan Kebutuhan Pengguna Perangkat Lunak


| Pengguna | Kebutuhan |
| :--- | :--- |
| Penjual (Mahasiswa ITB) |Kemudahan dan kecepatan dalam membuat, mengubah, serta mengelola listing barang preloved. Keterjangkauan listing oleh calon pembeli di lingkungan kampus secara efektif. Keandalan dan stabilitas sistem saat mengunggah berkas foto dan memproses data barang.  |
| Pembeli (Mahasiswa ITB) | Kemudahan pencarian, penyaringan, dan kejelasan informasi detail barang preloved. Keamanan dan transparansi dalam proses komunikasi negosiasi serta kesepakatan transaksi. Stabilitas dan keandalan sistem saat mengakses katalog dan ruang percakapan.  |
| Admin | Kemudahan dalam memverifikasi, menindaklanjuti, dan memproses status laporan aduan pengguna. Efisiensi dalam melacak (tracking) rekam jejak masalah, pelanggaran, atau bug sistem. Keandalan platform untuk memastikan operasional dan moderasi berjalan stabil.|

## 2.4 Batasan Perangkat Lunak
Batasan yang harus dituliskan, di antaranya:
1. Cakupan pengguna dalam P/L ini hanya terbatas untuk civitas ITB dan memiliki surel resmi berdomain @itb.ac.id.
2. P/L tidak mendukung pembayaran secara digital, seluruh proses pembayaran melalui skema COD dan merupakan tanggung jawab antara penjual dan pembeli.
3. Peran P/L terbatas hanya sebagai penghubung antara penjual dan pembeli, P/L tidak bertanggung jawab atas kondisi atau keaslian barang yang ditawarkan.
4. Akses untuk ruang percakapan hanya terbatas untuk kedua pihak yang bertransaksi, dan setiap pesan terenkripsi sehingga hanya kedua pihak tersebut yang dapat melihat isi pesan. 

## 2.5 Lingkungan Operasi Perangkat Lunak
ITBELI berjalan sebagai aplikasi web dengan arsitektur klien-server. Server aplikasi dijalankan secara lokal pada komputer milik tim pengembang dan dapat diakses oleh perangkat lain yang terhubung ke jaringan yang sama. Basis data dan penyimpanan berkas tidak ditempatkan secara lokal, melainkan pada layanan *cloud* Supabase, sehingga seluruh perangkat membaca dan menulis data dari satu sumber yang sama dan konsisten. Pengguna cukup membuka ITBELI melalui peramban tanpa memasang aplikasi tambahan.

Tabel 2.5. Lingkungan Operasi Perangkat Lunak

| Komponen | Spesifikasi |
| :--- | :--- |
| Server | Satu komputer atau laptop milik tim pengembang yang menjalankan server web ITBELI (penyaji halaman antarmuka dan logika bisnis) menggunakan Node.js versi LTS (22.x atau lebih baru). Server dijalankan secara lokal, bukan pada layanan *hosting cloud*, dan harus tetap menyala selama sistem digunakan. |
| OS Server | Windows 10/11, macOS, atau distribusi Linux 64-bit (misalnya Ubuntu 22.04 LTS atau lebih baru). |
| DBMS | PostgreSQL terkelola pada layanan *cloud* Supabase. Basis data tidak dijalankan secara lokal agar data tetap konsisten bagi seluruh perangkat dan anggota tim. Server terhubung ke Supabase melalui koneksi terenkripsi (TLS), dan kunci akses Supabase yang berhak penuh (*service role key*) hanya disimpan di sisi server. |
| Penyimpanan Berkas | Supabase Storage untuk menyimpan foto listing (JPG/PNG, maksimum 5 MB per berkas dan 5 foto per listing) serta berkas bukti tangkapan layar pada laporan. |
| Layanan Surel | Layanan pengiriman surel berbasis SMTP dengan TLS untuk mengirim kode verifikasi berbatas waktu 15 menit ke alamat surel @itb.ac.id pendaftar serta pemberitahuan tindakan moderasi kepada pengguna. |
| Jaringan | Server dan perangkat klien terhubung ke jaringan lokal yang sama (Wi-Fi, LAN, atau *hotspot*). Klien mengakses ITBELI melalui alamat IP lokal server beserta port aplikasi (contoh: `https://192.168.1.10:3000`), sehingga *firewall* pada server harus mengizinkan koneksi masuk ke port tersebut. Server dan klien juga memerlukan koneksi internet untuk mengakses layanan Supabase dan layanan surel. |
| Protokol | HTTPS dengan sertifikat TLS yang dipercaya oleh perangkat klien (misalnya sertifikat lokal yang dibuat menggunakan mkcert lalu dipasang pada perangkat klien). Koneksi aman ini diperlukan karena peramban hanya mengaktifkan *Service Worker* dan notifikasi *push* pada *secure context*, sedangkan kedua fitur tersebut dibutuhkan untuk mengirim notifikasi pesan baru ketika aplikasi sedang tidak dibuka (KF34). HTTPS juga melindungi kata sandi dan token sesi selama pengiriman data. |
| Client | Peramban web berbasis Chromium (*Chromium-based web browser*) versi stabil terbaru, seperti Google Chrome, Microsoft Edge, Brave, atau Opera, dengan JavaScript, *cookie* dan penyimpanan lokal, serta izin notifikasi dalam keadaan aktif. |
| Perangkat Klien | Laptop, PC, tablet, atau ponsel pintar yang mampu menjalankan versi stabil terbaru peramban berbasis Chromium. |
| OS Klien | Windows 10/11, macOS, Linux, ChromeOS, dan Android 10 atau lebih baru. Perangkat iOS dan iPadOS tidak termasuk lingkungan yang didukung karena seluruh peramban pada sistem operasi tersebut menggunakan mesin WebKit, bukan Chromium. |

---

# BAB 3: Deskripsi Kebutuhan Perangkat Lunak

## 3.1 Kebutuhan Fungsional (KF)


Tabel 3.1. Kebutuhan Fungsional

| ID KF | Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| KF01 | R01 | Ketika pengunjung memilih menu pendaftaran, perangkat lunak harus menampilkan formulir pendaftaran yang meminta nama, NIM, alamat surel, dan kata sandi. |
| KF02 | R01 | Ketika pengunjung mengirimkan formulir pendaftaran yang lolos validasi, perangkat lunak harus membuat akun baru berstatus "Belum Terverifikasi". |
| KF03 | R01 | Ketika pengguna mengirimkan kombinasi surel dan kata sandi yang cocok dengan sebuah akun terverifikasi pada halaman login, perangkat lunak harus memberikan akses masuk ke sistem. |
| KF04 | R01 | Ketika pengguna membuka halaman profil, perangkat lunak harus menampilkan nama, NIM, surel, dan daftar listing milik akun tersebut.  |
| KF05 | R02 | Jika alamat surel yang dimasukkan pada formulir pendaftaran tidak berdomain itb.ac.id atau sudah terdaftar pada akun lain, maka perangkat lunak harus menolak pendaftaran dan menampilkan pesan kesalahan yang menyebutkan penyebabnya. |
| KF06 | R03 | Ketika sebuah akun baru berhasil dibuat, perangkat lunak harus membangkitkan kode verifikasi berbatas waktu 15 menit dan mengirimkannya ke alamat surel pendaftar.  |
| KF07 | R03 | 	Ketika pengguna memasukkan kode verifikasi yang benar dan belum kedaluwarsa, perangkat lunak harus mengubah status akun tersebut menjadi "Terverifikasi". |
| KF08 | R03 | 	Jika pengguna dengan akun berstatus "Belum Terverifikasi" mencoba masuk ke sistem, maka perangkat lunak harus menolak proses login dan menampilkan opsi pengiriman ulang kode verifikasi. |
| KF09 | R04 | 	Perangkat lunak harus menyimpan kata sandi pengguna hanya dalam bentuk hash bcrypt dan tidak pernah dalam bentuk plain-text. |
| KF10 | R04 | Ketika pengguna mengirimkan kata sandi pada proses login, perangkat lunak harus memverifikasinya dengan membandingkan nilai hash masukan terhadap hash yang tersimpan. |
| KF11 | R04 | 	Ketika pengguna berhasil masuk ke sistem, perangkat lunak harus membuat sesi bertoken dengan masa berlaku paling lama 24 jam. |
| KF12 | R04 | 	Ketika pengguna memilih fungsi keluar (logout), perangkat lunak harus menghapus sesi login yang sedang aktif. |
| KF13 | R05 | 	Ketika pengunjung membuka formulir pendaftaran, perangkat lunak harus menampilkan kebijakan privasi dan syarat penggunaan beserta kendali persetujuannya. |
| KF14 | R05 | 	Jika pengunjung mengirimkan formulir pendaftaran tanpa menyetujui kebijakan privasi dan syarat penggunaan, maka perangkat lunak harus menolak pembuatan akun. |
| KF15 | R06 | Ketika penjual memilih aksi pembuatan listing, perangkat lunak harus menampilkan formulir yang memuat isian judul, harga, deskripsi kondisi barang, kategori, lokasi titik temu COD, dan unggahan foto. |
| KF16 | R06 | 	Ketika penjual mengirimkan formulir listing yang lolos validasi, perangkat lunak harus menyimpan listing tersebut dengan status awal "Tersedia" dan menampilkannya pada katalog utama. |
| KF17 | R06 | 	Ketika pengguna membuka halaman detail sebuah listing, perangkat lunak harus menampilkan seluruh foto, judul, harga, deskripsi kondisi, kategori, lokasi COD, dan identitas penjual dari listing tersebut. |
| KF18 | R07 | **Jika** judul, harga, kategori, atau foto pada formulir listing belum diisi, **maka** perangkat lunak harus menolak publikasi listing dan menandai isian yang belum lengkap. |
| KF19 | R07 | **Selama** penjual mengisi formulir listing, perangkat lunak harus menampilkan daftar kategori barang yang telah ditetapkan (jas praktikum, buku dan diktat, elektronik, perlengkapan kos, pakaian dan jaket himpunan, serta lain-lain) sebagai satu-satunya pilihan kategori yang tersedia. |
| KF20 | R08 | **Ketika** penjual membuka halaman daftar listing miliknya, perangkat lunak harus menampilkan seluruh listing milik akun yang sedang masuk beserta status masing-masing listing. |
| KF21 | R08 | **Ketika** penjual mengonfirmasi perubahan atau penghapusan listing miliknya sendiri, perangkat lunak harus menyimpan perubahan atau menghapus listing tersebut. |
| KF22 | R08 | **Jika** permintaan perubahan atau penghapusan listing berasal dari akun yang bukan pemilik listing, **maka** perangkat lunak harus menolak permintaan tersebut. |
| KF23 | R09 | **Ketika** penjual mengunggah foto pada formulir listing, perangkat lunak harus menerima berkas berformat JPG atau PNG berukuran maksimum 5 MB hingga sebanyak-banyaknya 5 foto per listing. |
| KF24 | R09 | **Jika** berkas yang diunggah bukan berformat JPG atau PNG, berukuran lebih dari 5 MB, atau menyebabkan jumlah foto melebihi 5 per listing, **maka** perangkat lunak harus menolak berkas tersebut dan menampilkan pesan kesalahan yang menyebutkan ketentuan yang dilanggar. |
| KF25 | R10 | **Ketika** pembeli mengirimkan kata kunci pada kolom pencarian, perangkat lunak harus menampilkan listing yang judul atau deskripsinya mengandung kata kunci tersebut. |
| KF26 | R10 | **Ketika** pembeli menerapkan filter kategori, rentang harga minimum dan maksimum, atau lokasi titik temu, perangkat lunak harus menampilkan hanya listing yang memenuhi seluruh filter yang aktif. |
| KF27 | R10 | **Ketika** pembeli memilih kriteria pengurutan, perangkat lunak harus mengurutkan hasil pencarian berdasarkan waktu unggah terbaru, harga terendah, atau harga tertinggi sesuai kriteria yang dipilih. |
| KF28 | R11 | **Selama** katalog atau hasil pencarian ditampilkan, perangkat lunak harus membatasi tampilan menjadi maksimum 20 listing per halaman dan menyediakan navigasi antarhalaman. |
| KF29 | R11 | **Jika** pencarian atau kombinasi filter tidak menghasilkan listing apa pun, **maka** perangkat lunak harus menampilkan pesan bahwa barang tidak ditemukan. |
| KF30 | R12 | **Selama** katalog dan hasil pencarian ditampilkan, perangkat lunak harus memuat hanya listing berstatus "Tersedia" yang dimiliki oleh akun berstatus tidak diblokir. |
| KF31 | R13 | **Selama** akun penjual berstatus tidak diblokir, **ketika** pembeli memilih tombol "Hubungi Penjual" pada halaman detail listing, perangkat lunak harus membuka ruang percakapan antara pembeli dan penjual untuk listing tersebut. |
| KF32 | R13 | **Ketika** pengguna mengirim pesan teks pada ruang percakapan, perangkat lunak harus menyimpan pesan tersebut dan menampilkannya kepada kedua pihak beserta waktu pengirimannya secara berurutan. |
| KF33 | R13 | **Ketika** pengguna membuka daftar percakapan, perangkat lunak harus menampilkan seluruh percakapan miliknya beserta cuplikan pesan terakhir dan identitas lawan bicaranya. |
| KF34 | R14 | **Ketika** pengguna menerima pesan baru, perangkat lunak harus mengirimkan notifikasi kepada pengguna tersebut, termasuk ketika aplikasi sedang tidak dibuka, serta memperbarui penanda jumlah pesan belum dibaca. |
| KF35 | R16 | **Jika** akun selain kedua pihak yang terlibat dalam sebuah percakapan, termasuk akun admin, meminta akses ke ruang percakapan tersebut, **maka** perangkat lunak harus menolak permintaan itu. |
| KF36 | R16 | Perangkat lunak harus menyimpan isi seluruh pesan pada basis data dalam bentuk terenkripsi. |
| KF37 | R16 | **Ketika** pengguna melaporkan sebuah percakapan, perangkat lunak harus menyusun laporan yang hanya memuat ID percakapan, waktu, dan identitas pelapor tanpa menyertakan isi pesan. |
| KF38 | R17 | **Ketika** pengguna membuka halaman Kebijakan Privasi dan Ketentuan Penggunaan, perangkat lunak harus menampilkan pernyataan tertulis bahwa isi percakapan pribadi antarpengguna tidak dapat diakses oleh admin maupun pengembang. |
| KF39 | R17 | Perangkat lunak harus menyediakan tautan menuju halaman Kebijakan Privasi pada halaman pendaftaran, menu pengaturan akun, dan ruang percakapan. |
| KF40 | R18 | **Selama** sebuah listing berstatus "Tersedia", **ketika** penjual pemiliknya memilih aksi "Tandai Terjual", perangkat lunak harus mengubah status listing tersebut menjadi "Terjual". |
| KF41 | R18 | **Ketika** penjual pemilik listing membatalkan penandaan terjual, perangkat lunak harus mengembalikan status listing tersebut dari "Terjual" menjadi "Tersedia". |
| KF42 | R19 | **Selama** sebuah listing berstatus "Terjual", perangkat lunak harus menyembunyikan listing tersebut dari katalog dan hasil pencarian serta tetap menampilkannya pada halaman riwayat listing penjual. |
| KF43 | R20 | **Ketika** pengguna memilih aksi pelaporan pada halaman detail listing, profil pengguna, atau menu bantuan, perangkat lunak harus menampilkan formulir pelaporan berisi pilihan kategori laporan (penipuan, konten tidak pantas, atau *bug*) dan isian alasan. |
| KF44 | R20 | **Ketika** pengguna melampirkan berkas bukti berupa tangkapan layar pada formulir pelaporan, perangkat lunak harus menyimpan berkas tersebut bersama laporannya. |
| KF45 | R21 | **Ketika** admin membuka halaman daftar laporan, perangkat lunak harus menampilkan seluruh laporan beserta identitas pelapor, objek yang dilaporkan, kategori, waktu pelaporan, dan status penanganan. |
| KF46 | R21 | **Ketika** admin memilih status penanganan tertentu sebagai penyaring, perangkat lunak harus menampilkan hanya laporan berstatus Baru, Diproses, atau Selesai sesuai pilihan tersebut. |
| KF47 | R21 | **Ketika** admin mengubah status penanganan sebuah laporan, perangkat lunak harus menyimpan status baru tersebut beserta waktu perubahannya. |
| KF48 | R23 | **Ketika** sebuah laporan diterima sistem atau ditindaklanjuti admin, perangkat lunak harus menambahkan catatan kejadian tersebut ke dalam *log* audit. |
| KF49 | R23 | Perangkat lunak harus mencegah pengubahan dan penghapusan catatan yang telah tersimpan pada *log* audit. |
| KF50 | R24 | **Ketika** admin mengonfirmasi penghapusan sebuah listing yang dilaporkan dan mencantumkan alasannya, perangkat lunak harus menghapus listing tersebut dari sistem. |
| KF51 | R24 | **Ketika** admin menjalankan aksi blokir atau buka blokir pada halaman detail laporan maupun profil pengguna, perangkat lunak harus mengubah status akun pengguna yang bersangkutan sesuai aksi tersebut. |
| KF52 | R25 | **Ketika** sebuah listing dihapus atau sebuah akun diblokir oleh admin, perangkat lunak harus mengirimkan pemberitahuan kepada pengguna yang bersangkutan beserta alasan tindakan tersebut. |
| KF53 | R26 | **Jika** pengguna dengan akun berstatus diblokir mencoba masuk ke sistem, **maka** perangkat lunak harus menolak proses *login* dan menampilkan pesan bahwa akun sedang ditangguhkan. |
| KF54 | R26 | **Selama** sebuah akun berstatus diblokir, perangkat lunak harus menonaktifkan seluruh listing miliknya sehingga tidak muncul pada katalog maupun hasil pencarian. |
| KF55 | R26 | **Ketika** admin melakukan tindakan moderasi, perangkat lunak harus mencatat pelaku tindakan, jenis tindakan, objek, waktu, dan alasan ke dalam *log* admin. |
| KF56 | R27 | **Jika** akun yang tidak berperan sebagai admin mengakses halaman atau fungsi moderasi, **maka** perangkat lunak harus menolak akses tersebut. |


---

## 3.2 Kebutuhan Non-Fungsional (KNF)


Tabel 3.2. Kebutuhan Non-Fungsional

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R06, R10, R12-14, R18* | *Usability/Ergonomy* | Ketika user pertama kali memakai aplikasi, pemakaian aplikasi harus sudah dapat dimengerti user dalam waktu kurang dari 10 menit. |
| *KNF02* | *R20, R21, R23-24* | *Maintainability* | Selama keberjalanan sistem, sistem harus mencatat log aktivitas user dan memberikan akses yang sesuai kepada admin untuk menyelesaikan masalah. |
| *KNF03* | *R01-R05, R16-17* | *Security* | Selama keberjalanan sistem, hanya akun berdomain resmi ITB (@itb.ac.id) yang dapat login ke dalam sistem. Selain itu, kata sandi serta percakapan pengguna harus terenkripsi. |
| *KNF04* | *R01-02* | *Scability* | Sistem harus mampu menampung seluruh akun civitas ITB yang berdomain resmi ITB (@itb.ac.id) beserta aktivitas mereka. |

<sub>*Silakan pilih parameter yang relevan dengan P/L kalian (Availability, Reliability, Ergonomy, Portability, Memory, Response time, Safety, Security, dsb), tidak perlu semua parameter diisi. Lihat kembali dokumen Requirement Gathering untuk penjelasan tiap parameter.*<sub>

---

# BAB 4: Pemodelan Use Case

## 4.1 Identifikasi Aktor
Berikut adalah daftar aktor final yang berinteraksi langsung dengan P/L ITBELI beserta perannya. ID Aktor mengikuti Aturan Penomoran pada 1.4.

| ID Aktor | Aktor | Deskripsi |
| :--- | :--- | :--- |
| *A01* | *Penjual (Mahasiswa ITB)* | *Pengguna yang berniat untuk menjual barang preloved miliknya. Mengutamakan kemudahan proses listing, jangkauan listing kepada pembeli, dan reliabilitas sistem. Berwenang membuat, melihat, mengubah, menghapus, dan menandai terjual listing miliknya sendiri, berkomunikasi dengan pembeli melalui ruang percakapan, serta mengirimkan laporan.* |
| *A02* | *Pembeli (Mahasiswa ITB)* | *Pengguna yang berniat untuk membeli barang preloved. Mengutamakan keamanan transaksi, pencarian yang jelas dan informasi yang jelas, dan reliabilitas sistem. Berwenang melihat, mencari, dan menyaring katalog listing, melihat detail listing, menghubungi penjual melalui ruang percakapan, serta mengirimkan laporan.* |
| *A03* | *Admin* | *Pihak yang mengelola platform. Mengutamakan reliabilitas sistem, kemudahan untuk tracking masalah atau bug, sistem report/laporan yang mudah diverifikasi dan ditangani. Berwenang melihat dan menyaring daftar laporan, mengubah status penanganan laporan, menghapus listing yang dilaporkan, serta memblokir dan membuka blokir akun pengguna, tanpa memiliki akses terhadap isi percakapan pribadi antarpengguna.* |


## 4.2 Identifikasi Use Case


| ID UC | Nama Use Case | Deskripsi Singkat | Aktor Terlibat | ID KF Terkait |
| :--- | :--- | :--- | :--- | :--- |
| UC01 | Mendaftar Akun | Calon pengguna (mahasiswa ITB) mengisi formulir pendaftaran berisi nama, NIM, surel berdomain @itb.ac.id, dan kata sandi, lalu menyetujui kebijakan privasi dan syarat penggunaan. Sistem memvalidasi domain dan keunikan surel, menyimpan kata sandi sebagai *hash* bcrypt, membuat akun berstatus "Belum Terverifikasi", dan mengirimkan kode verifikasi ke surel pendaftar. | Penjual, Pembeli | KF01, KF02, KF05, KF06, KF09, KF13, KF14, KF39 |
| UC02 | Memverifikasi Surel | Pengguna memasukkan kode verifikasi berbatas waktu 15 menit yang diterima melalui surel agar status akun berubah menjadi "Terverifikasi". Bila kode kedaluwarsa atau belum diterima, pengguna dapat meminta pengiriman ulang kode. | Penjual, Pembeli | KF06, KF07, KF08 |
| UC03 | Masuk ke Sistem (*Login*) | Pengguna memasukkan surel dan kata sandi pada halaman *login*. Sistem membandingkan *hash* kata sandi, memeriksa status akun (harus "Terverifikasi" dan tidak diblokir), lalu membuat sesi bertoken dengan masa berlaku paling lama 24 jam. Akun belum terverifikasi ditawari pengiriman ulang kode, sedangkan akun diblokir ditolak dengan pesan penangguhan. | Penjual, Pembeli, Admin | KF03, KF08, KF10, KF11, KF53 |
| UC04 | Keluar dari Sistem (*Logout*) | Pengguna yang sedang masuk memilih fungsi keluar sehingga sistem menghapus sesi *login* yang sedang aktif. | Penjual, Pembeli, Admin | KF12 |
| UC05 | Melihat Profil Akun | Pengguna membuka halaman profil untuk melihat nama, NIM, surel, dan daftar listing milik akunnya, serta dapat mengakses tautan Kebijakan Privasi dari menu pengaturan akun. | Penjual, Pembeli | KF04, KF39 |
| UC06 | Melihat Kebijakan Privasi dan Ketentuan Penggunaan | Pengguna membuka halaman Kebijakan Privasi dan Ketentuan Penggunaan melalui tautan pada halaman pendaftaran, menu pengaturan akun, atau ruang percakapan. Sistem menampilkan isi kebijakan termasuk pernyataan tertulis bahwa isi percakapan pribadi tidak dapat diakses oleh admin maupun pengembang. | Penjual, Pembeli | KF13, KF38, KF39 |
| UC07 | Membuat Listing | Penjual mengisi formulir listing berupa judul, harga, deskripsi kondisi, kategori (dari daftar kategori tetap), lokasi titik temu COD, dan unggahan foto (maksimum 5 foto JPG/PNG berukuran ≤ 5 MB). Sistem memvalidasi kelengkapan isian dan berkas foto, lalu menyimpan listing berstatus "Tersedia" dan menampilkannya pada katalog utama. | Penjual | KF15, KF16, KF18, KF19, KF23, KF24 |
| UC08 | Melihat Daftar Listing Milik Sendiri | Penjual membuka halaman daftar listing miliknya untuk melihat seluruh listing beserta status masing-masing ("Tersedia"/"Terjual"), termasuk riwayat listing yang sudah terjual. | Penjual | KF20, KF42 |
| UC09 | Mengubah Listing | Penjual memperbarui informasi maupun foto pada listing miliknya. Sistem memastikan pengubah adalah pemilik listing, memvalidasi kelengkapan isian, pilihan kategori, dan ketentuan berkas foto, lalu menyimpan perubahan. | Penjual | KF18, KF19, KF21, KF22, KF23, KF24 |
| UC10 | Menghapus Listing | Penjual menghapus listing miliknya setelah mengonfirmasi penghapusan. Sistem menolak permintaan penghapusan yang berasal dari akun yang bukan pemilik listing. | Penjual | KF21, KF22 |
| UC11 | Menandai Listing Terjual | Penjual menandai listing berstatus "Tersedia" miliknya sebagai "Terjual" sehingga listing disembunyikan dari katalog dan hasil pencarian, namun tetap tampil pada riwayat listing penjual. | Penjual | KF40, KF42 |
| UC12 | Membatalkan Penandaan Terjual | Penjual membatalkan penandaan terjual pada listing miliknya bila keliru, sehingga status listing kembali menjadi "Tersedia" dan listing tampil kembali pada katalog dan hasil pencarian. | Penjual | KF41, KF42 |
| UC13 | Melihat Katalog Listing | Pembeli menjelajahi katalog utama yang hanya memuat listing berstatus "Tersedia" dari akun yang tidak diblokir. Sistem menampilkan maksimum 20 listing per halaman dan menyediakan navigasi antarhalaman. | Pembeli | KF28, KF30, KF42, KF54 |
| UC14 | Mencari dan Menyaring Listing | Pembeli memasukkan kata kunci pada kolom pencarian, menerapkan filter kategori, rentang harga minimum–maksimum, dan/atau lokasi titik temu, serta memilih kriteria pengurutan (terbaru, harga terendah, harga tertinggi). Sistem menampilkan hanya listing "Tersedia" yang memenuhi seluruh kriteria secara berhalaman, atau menampilkan pesan barang tidak ditemukan bila tidak ada hasil. | Pembeli | KF25, KF26, KF27, KF28, KF29, KF30 |
| UC15 | Melihat Detail Katalog | Pengguna membuka halaman detail sebuah katalog untuk melihat seluruh foto, judul, harga, deskripsi kondisi, kategori, lokasi titik temu COD, dan identitas penjual. | Pembeli, Penjual | KF17 |
| UC16 | Menghubungi Penjual | Pembeli memilih tombol "Hubungi Penjual" pada halaman detail listing. Selama akun penjual tidak diblokir, sistem membuka ruang percakapan antara pembeli dan penjual yang terkait dengan listing tersebut, lengkap dengan tautan Kebijakan Privasi. Ruang percakapan hanya dapat diakses oleh kedua pihak yang terlibat. | Pembeli | KF31, KF35, KF39 |
| UC17 | Mengirim Pesan dalam Percakapan | Penjual dan pembeli saling berkirim pesan teks pada ruang percakapan untuk bernegosiasi dan menyepakati COD. Sistem menyimpan pesan dalam bentuk terenkripsi, menampilkannya kepada kedua pihak secara berurutan beserta waktu pengiriman, serta mengirimkan notifikasi dan memperbarui penanda pesan belum dibaca kepada penerima, termasuk saat aplikasi tidak dibuka. | Penjual, Pembeli | KF32, KF34, KF35, KF36, KF39 |
| UC18 | Melihat Daftar Percakapan | Pengguna membuka daftar percakapan miliknya. Sistem menampilkan seluruh percakapan milik pengguna beserta cuplikan pesan terakhir, identitas lawan bicara, dan penanda jumlah pesan belum dibaca; percakapan milik pengguna lain tidak dapat diakses. | Penjual, Pembeli | KF33, KF34, KF35 |
| UC19 | Mengirimkan Laporan | Pengguna melaporkan listing, akun pengguna lain, percakapan, atau *bug* platform melalui formulir pelaporan yang tersedia pada halaman detail listing, profil pengguna, ruang percakapan, atau menu bantuan, dengan memilih kategori laporan (penipuan, konten tidak pantas, atau *bug*), mengisi alasan, dan melampirkan bukti tangkapan layar. Laporan atas percakapan hanya memuat ID percakapan, waktu, dan identitas pelapor tanpa isi pesan. Sistem menyimpan laporan berstatus "Baru" dan mencatat penerimaannya ke dalam *log* audit. | Penjual, Pembeli | KF37, KF43, KF44, KF48 |
| UC20 | Melihat dan Menyaring Daftar Laporan | Admin membuka halaman daftar laporan untuk melihat seluruh laporan beserta identitas pelapor, objek yang dilaporkan, kategori, waktu pelaporan, dan status penanganan, serta menyaringnya berdasarkan status Baru, Diproses, atau Selesai. Akses ditolak bagi akun yang bukan admin. | Admin | KF45, KF46, KF56 |
| UC21 | Mengubah Status Penanganan Laporan | Admin meninjau sebuah laporan dan mengubah status penanganannya (Baru - Diproses - Selesai). Sistem menyimpan status baru beserta waktu perubahannya dan mencatat tindak lanjut tersebut ke dalam *log* audit yang tidak dapat diubah maupun dihapus. | Admin | KF47, KF48, KF49, KF56 |
| UC22 | Menghapus Listing yang Dilaporkan | Admin menghapus listing yang terbukti bermasalah dari halaman detail laporan dengan mencantumkan alasan. Sistem menghapus listing dari sistem, mengirimkan pemberitahuan beserta alasan kepada pemilik listing, serta mencatat tindakan ke dalam *log* admin dan *log* audit. | Admin | KF48, KF49, KF50, KF52, KF55, KF56 |
| UC23 | Memblokir Akun Pengguna | Admin memblokir akun pengguna yang terbukti melanggar dari halaman detail laporan atau profil pengguna dengan mencantumkan alasan. Sistem mengubah status akun menjadi diblokir, menonaktifkan seluruh listing milik akun tersebut dari katalog dan hasil pencarian, menolak *login* akun tersebut dengan pesan penangguhan, mengirimkan pemberitahuan beserta alasan kepada pengguna, dan mencatat tindakan ke dalam *log* admin dan *log* audit. | Admin | KF48, KF49, KF51, KF52, KF53, KF54, KF55, KF56 |
| UC24 | Membuka Blokir Akun Pengguna | Admin membuka blokir akun yang sebelumnya diblokir dari halaman detail laporan atau profil pengguna. Sistem mengembalikan status akun menjadi tidak diblokir sehingga pengguna dapat masuk kembali dan listing miliknya tampil kembali pada katalog, serta mencatat tindakan ke dalam *log* admin. | Admin | KF51, KF54, KF55, KF56 |

## 4.3 Use Case Diagram


<p align="center">
<img alt="Use Case Diagram" src="./assets/diagram/Diagram_UseCase_M3.jpg" width="100%">
</p>
<p align="center">
<i>Gambar 2. Use Case Diagram</i>
</p>

## 4.4 Skenario Use Case

### 4.4.1 Skenario UC01

**Nama Use Case:** *Mendaftar Akun*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Calon pengguna membuka halaman pendaftaran akun baru* | *Sistem menampilkan formulir pendaftaran yang terdiri dari kolom nama, NIM, Email, Kata Sandi, serta kotak persetujuan(Kebijakan Privasi & Syarat Penggunaan)* |
| 2 | *Calon pengguna mengisi data diri(Nama, NIM, Email berdomain @itb.ac.id, dan Kata Sandi)* | *Sistem mendeteksi input dan melakukan validasi kelengkapan kolom formulir* |
| 3 | *Calon pengguna mencentang kotak persetujuan kebijakan privasi dan syarat penggunaan, lalu menekan tombol daftar* | *Sistem memvalidasi akhiran email untuk memastikan domain yang digunakan adalah @itb.ac.id dan akan melakukan pengecekan ke pangkalan data untuk memastikan Email belum pernah didaftarkan sebelumnya (validasi keunikan). Lalu Sistem meng-generate kode verifikasi (OTP/Token) unik, mengirimkannya ke alamat Email pendaftar, lalu mengarahkan layar pengguna ke halaman verifikasi Email.* |
| 4 | *Calon pengguna menerima kode otp yang dikirimkan oleh sistem ke Email dan memasukkannya* | *Sistem memvalidasi kode otp yang diberikan dan pengguna bisa login ke sistem* |


<br>

**Skenario Alternatif 1: Domain Email tidak valid**


| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Calon pengguna membuka halaman pendaftaran akun baru* | *Sistem menampilkan formulir pendaftaran yang terdiri dari kolom nama, NIM, Email, Kata Sandi, serta kotak persetujuan(Kebijakan Privasi & Syarat Penggunaan)* |
| 2 | *Calon pengguna mengisi data diri(Nama, NIM, Email berdomain @itb.ac.id, dan Kata Sandi)* | *Sistem mendeteksi input dan melakukan validasi kelengkapan kolom formulir* |
| 3 | *Calon pengguna mencentang kotak persetujuan, lalu menekan tombol "Daftar" (dengan Email selain @itb.ac.id, misal @gmail.com).* | *Sistem mendeteksi domain tidak sesuai ketentuan institusi. Selanjutnya, menggagalkan proses penyimpanan, tetap berada di halaman pendaftaran, dan menampilkan pesan galat: "Harap gunakan Email  berdomain @itb.ac.id".* |

<br>

**Skenario Alternatif 2: Email Sudah Terdaftar**


| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Calon pengguna membuka halaman pendaftaran akun baru* | *Sistem menampilkan formulir pendaftaran yang terdiri dari kolom nama, NIM, Email, Kata Sandi, serta kotak persetujuan(Kebijakan Privasi & Syarat Penggunaan)* |
| 2 | *Calon pengguna mengisi data diri(Nama, NIM, Email berdomain @itb.ac.id, dan Kata Sandi)* | *Sistem mendeteksi input dan melakukan validasi kelengkapan kolom formulir* |
| 3 | *Calon pengguna mencentang kotak persetujuan kebijakan privasi dan syarat penggunaan, lalu menekan tombol daftar* | *Sistem memvalidasi akhiran email untuk memastikan domain yang digunakan adalah @itb.ac.id dan akan melakukan pengecekan ke pangkalan data untuk memastikan Email belum pernah didaftarkan sebelumnya (validasi keunikan). Sistem menemukan Email yang sama sudah terdaftar di pangkalan data (gagal uji keunikan).Sistem menggagalkan pembuatan akun dan memunculkan pop-up peringatan: "Email sudah terdaftar. Silakan gunakan Email lain atau masuk menggunakan akun tersebut."* |


### 4.4.2 Skenario UC02

**Nama Use Case:** *Memverifikasi Email*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka halaman verifikasi akun (biasanya otomatis dialihkan setelah pendaftaran atau login bagi akun yang belum terverifikasi).* | *Sistem menampilkan kolom input untuk memasukkan kode verifikasi, batasan waktu (contoh: hitung mundur 15 menit), dan opsi "Kirim Ulang".* |
| 2 | *Pengguna membuka Emailnya, menyalin kode, menempelkannya ke kolom input, lalu menekan tombol "Verifikasi".* | *Sistem mencocokkan kode yang dimasukkan dengan kode yang tersimpan di pangkalan data untuk Email tersebut. Sistem memvalidasi stempel waktu (waktu pembuatan kode vs waktu saat ini) untuk memastikan belum lewat dari batas 15 menit. Sistem memperbarui status akun di pangkalan data dari "Belum Terverifikasi" menjadi "Terverifikasi". Sistem memunculkan notifikasi berhasil dan mengarahkan pengguna ke halaman utama (atau halaman login untuk memulai sesi baru).* |


<br>

**Skenario Alternatif 1: Kode Tidak Valid / Kedaluwarsa**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Calon pengguna membuka halaman pendaftaran akun baru* | *Sistem menampilkan formulir pendaftaran yang terdiri dari kolom nama, NIM, Email, Kata Sandi, serta kotak persetujuan(Kebijakan Privasi & Syarat Penggunaan)* |
| 2 | *Calon pengguna mengisi data diri(Nama, NIM, Email berdomain @itb.ac.id, dan Kata Sandi)* | *Sistem mendeteksi input dan melakukan validasi kelengkapan kolom formulir. Sistem mendeteksi bahwa kode salah (tidak cocok) ATAU waktu verifikasi telah melampaui 15 menit. Sistem menolak perubahan status akun dan menampilkan pesan galat: "Kode tidak valid atau telah kedaluwarsa. Silakan minta kode baru* |


<br>

**Skenario Alternatif 2: Meminta Pengiriman Ulang Kode**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna memilih opsi "Kirim Ulang Kode" karena kode belum masuk ke Email atau sudah kedaluwarsa.* | *Sistem menghanguskan kode lama (jika ada). Sistem membuat kode verifikasi baru dengan batas waktu 15 menit yang baru. Sistem mengirimkan Email berisi kode baru tersebut ke pengguna, lalu me-reset tampilan waktu hitung mundur di layar pengguna.* |


### 4.4.3 Skenario UC03

**Nama Use Case:** *Masuk ke Sistem (Login)*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengakses alamat web sistem dan menuju halaman Masuk (Login).* | *Sistem menampilkan formulir Masuk yang berisi input Email dan Kata Sandi.* |
| 2 | *Pengguna memasukkan Email dan kata sandi, kemudian menekan tombol "Masuk".* | *Sistem mencari identitas berdasarkan Email di pangkalan data. Sistem membandingkan nilai hash dari kata sandi yang dimasukkan dengan hash yang tersimpan (verifikasi otentikasi). Sistem memeriksa status akun pengguna (otorisasi); memastikan status adalah "Terverifikasi" dan tidak diblokir/ditangguhkan. Sistem men-generate token sesi (contoh: JWT) yang dikonfigurasi memiliki masa berlaku paling lama 24 jam.Sistem mengarahkan pengguna ke halaman utama (Beranda) dan merubah menu navigasi sesuai peran pengguna yang sedang aktif (contoh: muncul tombol profil/logout).* |

<br>

**Skenario Alternatif 1: Kredensial Tidak Sesuai**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengakses alamat web sistem dan menuju halaman Masuk (Login).* | *Sistem menampilkan formulir Masuk yang berisi input Email dan Kata Sandi.* |
| 2 | *Pengguna memasukkan Email dan kata sandi, kemudian menekan tombol "Masuk".* | *Sistem mencari identitas berdasarkan Email di pangkalan data. Sistem membandingkan nilai hash dari kata sandi yang dimasukkan dengan hash yang tersimpan (verifikasi otentikasi). Sistem mendeteksi bahwa Email tidak ditemukan, atau hash kata sandi tidak cocok. Sistem menolak sesi login dan memunculkan notifikasi: "Email atau kata sandi yang Anda masukkan salah."* |

<br>

**Skenario Alternatif 2: Akun Belum Terverifikasi**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengakses alamat web sistem dan menuju halaman Masuk (Login).* | *Sistem menampilkan formulir Masuk yang berisi input Email dan Kata Sandi.* |
| 2 | *Pengguna memasukkan Email dan kata sandi, kemudian menekan tombol "Masuk".* | *Sistem mencari identitas berdasarkan EMail di pangkalan data. Sistem membandingkan nilai hash dari kata sandi yang dimasukkan dengan hash yang tersimpan (verifikasi otentikasi). Sistem mendeteksi kredensial benar, namun mendapati status akun masih "Belum Terverifikasi". Sistem menahan akses masuk, menampilkan pesan penolakan masuk, dan memberikan tombol pintasan: "Akun belum diverifikasi. Kirim ulang kode".* |

<br>

**Skenario Alternatif 3: Akun Sedang Diblokir**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengakses alamat web sistem dan menuju halaman Masuk (Login).* | *Sistem menampilkan formulir Masuk yang berisi input Email dan Kata Sandi.* |
| 2 | *Pengguna memasukkan Email dan kata sandi, kemudian menekan tombol "Masuk".* | *Sistem mencari identitas berdasarkan Email di pangkalan data. Sistem membandingkan nilai hash dari kata sandi yang dimasukkan dengan hash yang tersimpan (verifikasi otentikasi). Sistem mendeteksi kredensial benar dan terverifikasi, namun mendapati bendera/status akun adalah "Diblokir" (oleh admin). Sistem menahan akses masuk ke dashboard dan menampilkan pesan penangguhan: "Akun Anda sedang ditangguhkan karena melanggar ketentuan. Hubungi Admin."* |

### 4.4.4 Skenario UC04

**Nama Use Case:** *Keluar dari Sistem (Logout)*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna (yang dalam keadaan login) menekan dropdown menu profil atau panel navigasi di sudut layar.* | *Sistem membuka panel menu dan menampilkan berbagai opsi, salah satunya tombol "Keluar" (Logout).* |
| 2 | *Pengguna mengklik tombol "Keluar".* | *Sistem memproses permintaan logout di sisi backend. Sistem menghapus/mencabut (revoke) token sesi yang sedang aktif dari penelusuran lokal (seperti cookies atau local storage) maupun dari sesi server. Sistem menyegarkan tampilan dan mengalihkan pengguna kembali ke halaman Login atau Beranda mode Tamu (Guest).* |

### 4.4.5 Skenario UC05

**Nama Use Case:** *Melihat Profil Akun*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna (dalam kondisi masuk/login) memilih menu "Profil Saya" dari antarmuka navigasi.* | *Sistem mengidentifikasi ID pengguna dari token sesi yang aktif. Sistem mengirim kueri ke pangkalan data untuk mengambil data identitas (Nama, NIM, Email). Sistem juga melakukan kueri untuk mengambil seluruh daftar listing barang yang berelasi dengan ID pengguna tersebut. Sistem merender halaman Profil yang menyajikan informasi data diri pengguna serta deretan listing milik akun tersebut.* |
| 2 | *Pengguna menekan tombol/menu "Pengaturan Akun" di halaman profil.* | *Sistem membentangkan menu tambahan (dropdown/modal) yang di dalamnya menyertakan tautan menuju dokumen Kebijakan Privasi.* |

### 4.4.6 Skenario UC06

**Nama Use Case:** *Melihat Kebijakan Privasi dan Ketentuan Penggunaan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengklik tautan "Kebijakan Privasi" atau "Ketentuan Penggunaan" (dapat dilakukan saat pendaftaran, dari pengaturan profil, maupun dari ikon informasi di dalam ruang percakapan).* | *Sistem menerima permintaan navigasi ke rute dokumen kebijakan. Sistem mengambil naskah/dokumen statis terkait kebijakan dan Terms of Service (ToS) dari direktori aset. Sistem merender dan menampilkan teks dokumen secara penuh di layar. Sistem menyoroti/menampilkan klausa tertulis secara jelas (dicetak tebal/diberi kotak) yang menyatakan: "Isi percakapan pribadi dienkripsi dan tidak dapat diakses oleh admin maupun pengembang sistem."* |

### 4.4.7 Skenario UC07

**Nama Use Case:** *Membuat Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menekan tombol "Buat Listing Baru" / "Jual Barang" dari halaman utama atau dasbor profil.* | *Sistem menampilkan antarmuka/formulir pembuatan listing.* |
| 2 | *Penjual mengisi teks ke dalam kolom judul, harga, kondisi (deskripsi), memilih kategori dari menu dropdown kategori yang tersedia secara tetap (hardcoded/fixed), dan mengisi lokasi spesifik titik temu (COD).* | *Sistem memvalidasi jenis tipe data pada setiap kolom secara real-time (misal: harga hanya boleh menerima angka, dsb).* |
| 3 | *Penjual mengunggah beberapa berkas gambar (hingga 5 foto).* | *Sistem memeriksa sisi klien (client-side): apakah format berkas sesuai (hanya JPG/PNG) dan ukurannya tidak melebihi 5 MB per foto.* |
| 4 | *Penjual memverifikasi isiannya dan menekan tombol "Unggah / Simpan Listing".* | *Sistem membawa data ke backend dan melakukan validasi ganda kelengkapan formulir beserta syarat batas foto.Sistem menyimpan direktori gambar dan informasi isian formulir ke pangkalan data listing dengan melabelinya dengan status ketersediaan awal: "Tersedia".Sistem menampilkan notifikasi sukses, secara otomatis menerbitkan produk tersebut ke katalog utama, dan mengarahkan penjual ke halaman "Daftar Listing Saya".* |

<br>

**Skenario Alternatif 1: Isian Formulir Tidak Lengkap**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menekan tombol "Buat Listing Baru" / "Jual Barang" dari halaman utama atau dasbor profil.* | *Sistem menampilkan antarmuka/formulir pembuatan listing.* |
| 2 | *Penjual mengisi teks ke dalam kolom judul, harga, kondisi (deskripsi), memilih kategori dari menu dropdown kategori yang tersedia secara tetap (hardcoded/fixed), dan mengisi lokasi spesifik titik temu (COD).* | *Sistem memvalidasi jenis tipe data pada setiap kolom secara real-time (misal: harga hanya boleh menerima angka, dsb).* |
| 3 | *Penjual mengunggah beberapa berkas gambar (hingga 5 foto).* | *Sistem memeriksa sisi klien (client-side): apakah format berkas sesuai (hanya JPG/PNG) dan ukurannya tidak melebihi 5 MB per foto.* |
| 4 | *Penjual membiarkan satu atau lebih kolom wajib kosong (misal tidak memilih kategori atau harga) lalu menekan tombol "Simpan".* | *Sistem mendeteksi kegagalan pada validasi wajib-isi (required fields). Sistem menghentikan pengiriman data, memberi penanda visual merah (garis tepi bata/tulisan merah) tepat pada kolom yang terlewat, dan meminta penjual untuk melengkapinya.* |

<br>

**Skenario Alternatif 2: Pelanggaran Syarat Unggahan Foto**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menekan tombol "Buat Listing Baru" / "Jual Barang" dari halaman utama atau dasbor profil.* | *Sistem menampilkan antarmuka/formulir pembuatan listing.* |
| 2 | *Penjual mengisi teks ke dalam kolom judul, harga, kondisi (deskripsi), memilih kategori dari menu dropdown kategori yang tersedia secara tetap (hardcoded/fixed), dan mengisi lokasi spesifik titik temu (COD).* | *Sistem memvalidasi jenis tipe data pada setiap kolom secara real-time (misal: harga hanya boleh menerima angka, dsb).* |
| 3 | *Penjual mencoba mengunggah foto dalam format yang tidak diizinkan (.pdf atau .heic), mengunggah berkas lebih dari 5MB, atau mencoba memasukkan 6 gambar sekaligus.* | *Sistem segera memblokir preview gambar yang tidak sah dan menampilkan notifikasi kesalahan: "Format harus JPG/PNG, ukuran maksimum 5MB, dan paling banyak 5 foto".* |
| 4 | *Penjual tetap memaksa menekan tombol "Simpan".* | *Sistem menolak mengeksekusi penyimpanan hingga berkas gambar diperbaiki/dihapus agar sesuai spesifikasi.* |

### 4.4.8 Skenario UC08

**Nama Use Case:** *Melihat Daftar Listing Milik Sendiri*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual mengklik menu navigasi bertajuk "Listing Saya" atau "Kelola Jualan".* | *Sistem menerima perintah dari ID sesi penjual dan mulai menghubungi pangkalan data. Sistem melakukan fetch (pengambilan) terhadap seluruh entitas listing yang terasosiasi (berelasi) dengan ID penjual tersebut. Sistem menyortir data tersebut dan memisahkan pengelompokannya berdasarkan label status (Misal: tab/bagian barang "Tersedia" dan tab/bagian riwayat barang "Terjual"). Sistem merender halaman dashboard khusus yang menampilkan daftar listing secara terstruktur (kartu produk) lengkap dengan detail, status aktual, serta rekaman riwayat untuk listing yang sudah pernah terjual.* |

### 4.4.9 Skenario UC09

**Nama Use Case:** *Mengubah Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya", memilih salah satu listing miliknya, lalu menekan tombol "Ubah Listing" (ikon pensil) pada kartu listing tersebut.* | *Sistem membaca ID pengguna dari token sesi yang aktif dan mencocokkannya dengan ID pemilik yang tersimpan pada data listing (verifikasi kepemilikan). Setelah keduanya cocok, Sistem mengambil seluruh atribut listing dari pangkalan data dan merender formulir pengubahan yang seluruh kolomnya sudah terisi nilai lama (prefilled): judul, harga, deskripsi kondisi, kategori yang sedang terpilih, lokasi titik temu COD, serta pratinjau foto yang sudah terunggah lengkap dengan tombol hapus pada masing-masing foto.* |
| 2 | *Penjual menyunting satu atau beberapa kolom teks (misalnya menurunkan harga atau memperbarui deskripsi kondisi barang) dan/atau memilih kategori lain dari menu dropdown kategori yang tersedia secara tetap (jas praktikum, buku dan diktat, elektronik, perlengkapan kos, pakaian dan jaket himpunan, serta lain-lain).* | *Sistem memvalidasi tipe data setiap kolom secara real-time (harga hanya menerima angka, judul dibatasi panjang karakternya) dan memastikan kategori yang dipilih berasal dari daftar kategori tetap tersebut, bukan masukan bebas dari penjual.* |
| 3 | *Penjual menghapus sebagian foto lama dan/atau mengunggah foto pengganti sehingga jumlah akhir foto pada listing tetap berada di antara 1 sampai 5 berkas.* | *Sistem memeriksa setiap berkas baru di sisi klien (format hanya JPG/PNG dan ukuran tidak melebihi 5 MB per berkas), lalu menghitung ulang jumlah total foto (foto lama yang dipertahankan ditambah foto baru) agar tidak melampaui batas 5 foto per listing.* |
| 4 | *Penjual memeriksa kembali seluruh isian yang telah disunting, lalu menekan tombol "Simpan Perubahan".* | *Sistem mengirim data ke backend dan mengulang seluruh validasi di sisi server: kepemilikan listing, kelengkapan kolom wajib (judul, harga, kategori, dan sekurang-kurangnya satu foto), keabsahan nilai kategori, serta ketentuan berkas foto. Sistem menimpa data listing lama dengan data baru, menyimpan berkas foto baru sekaligus melepas rujukan foto yang dibuang, dan memperbarui stempel waktu perubahan. Sistem menampilkan notifikasi "Perubahan berhasil disimpan", mengarahkan penjual ke halaman detail listing, serta menayangkan versi terbaru listing tersebut pada katalog utama dan hasil pencarian.* |

<br>

**Skenario Alternatif 1: Kolom Wajib Dikosongkan saat Pengubahan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya", memilih salah satu listing miliknya, lalu menekan tombol "Ubah Listing" (ikon pensil) pada kartu listing tersebut.* | *Sistem memverifikasi kepemilikan listing melalui token sesi, lalu menampilkan formulir pengubahan yang seluruh kolomnya sudah terisi nilai lama beserta pratinjau foto yang sudah terunggah.* |
| 2 | *Penjual mengosongkan salah satu kolom wajib, misalnya menghapus seluruh isi kolom harga atau mengosongkan pilihan kategori, kemudian menekan tombol "Simpan Perubahan".* | *Sistem menjalankan validasi wajib-isi (required fields) dan mendeteksi bahwa judul, harga, kategori, atau foto tidak terisi. Sistem menghentikan pengiriman data, mempertahankan listing pada versi lamanya sehingga tidak ada perubahan yang tersimpan, memberi penanda visual merah tepat pada kolom yang dikosongkan, dan menampilkan pesan galat: "Judul, harga, kategori, dan minimal satu foto wajib diisi".* |
| 3 | *Penjual melengkapi kembali kolom yang ditandai, lalu menekan ulang tombol "Simpan Perubahan".* | *Sistem mengulangi validasi, mendapati seluruh kolom wajib telah terisi, kemudian menyimpan perubahan ke pangkalan data dan mengarahkan penjual ke halaman detail listing disertai notifikasi berhasil.* |

<br>

**Skenario Alternatif 2: Pelanggaran Syarat Unggahan Foto saat Pengubahan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya", memilih salah satu listing miliknya, lalu menekan tombol "Ubah Listing" (ikon pensil) pada kartu listing tersebut.* | *Sistem memverifikasi kepemilikan listing melalui token sesi, lalu menampilkan formulir pengubahan yang seluruh kolomnya sudah terisi nilai lama beserta pratinjau foto yang sudah terunggah.* |
| 2 | *Penjual menambahkan foto baru berformat tidak sah (misalnya .pdf atau .heic), berukuran lebih dari 5 MB, atau menambahkan foto tanpa menghapus foto lama sehingga jumlah totalnya menjadi lebih dari 5 berkas.* | *Sistem membatalkan pratinjau berkas yang tidak sah, menolak berkas tersebut sebelum dikirim ke server, dan menampilkan pesan galat yang menyebutkan ketentuan yang dilanggar: "Format harus JPG/PNG, ukuran maksimum 5 MB, dan paling banyak 5 foto per listing".* |
| 3 | *Penjual tetap memaksa menekan tombol "Simpan Perubahan" tanpa memperbaiki berkas yang bermasalah.* | *Sistem menolak mengeksekusi penyimpanan dan mempertahankan data listing pada versi lamanya hingga berkas yang melanggar dihapus atau diganti dengan berkas yang memenuhi ketentuan.* |

<br>

**Skenario Alternatif 3: Percobaan Pengubahan oleh Akun Bukan Pemilik**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna lain yang bukan pemilik listing membuka tautan halaman pengubahan listing milik penjual lain secara langsung (misalnya dengan menyalin lalu menyunting alamat halaman).* | *Sistem membaca ID pengguna dari token sesi, membandingkannya dengan ID pemilik listing, dan mendapati keduanya berbeda. Sistem membatalkan pemuatan formulir pengubahan, menolak permintaan tersebut, dan menampilkan halaman galat: "Anda tidak memiliki akses untuk mengubah listing ini" beserta tautan kembali ke katalog.* |
| 2 | *Pengguna tersebut tetap mencoba mengirimkan data perubahan langsung ke sistem tanpa melalui antarmuka resmi.* | *Sistem kembali memeriksa kepemilikan pada lapisan server sebelum menyentuh pangkalan data, menolak permintaan itu, dan memastikan tidak ada satu pun atribut listing yang berubah.* |

### 4.4.10 Skenario UC10

**Nama Use Case:** *Menghapus Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya", menekan menu opsi (ikon titik tiga) pada kartu listing yang ingin dihapus, lalu memilih "Hapus Listing".* | *Sistem membaca ID pengguna dari token sesi dan mencocokkannya dengan ID pemilik listing (verifikasi kepemilikan). Setelah cocok, Sistem menampilkan dialog konfirmasi yang memuat judul listing yang dipilih beserta peringatan bahwa penghapusan bersifat permanen dan listing tidak dapat dikembalikan.* |
| 2 | *Penjual membaca peringatan tersebut, memastikan listing yang dipilih sudah benar, lalu menekan tombol "Ya, Hapus".* | *Sistem mengirim permintaan penghapusan ke backend, mengulang pemeriksaan kepemilikan di sisi server, kemudian menghapus data listing beserta rujukan berkas fotonya dari pangkalan data. Sistem menutup dialog, menampilkan notifikasi "Listing berhasil dihapus", dan memuat ulang halaman "Listing Saya" tanpa listing tersebut.* |
| 3 | *Penjual membuka katalog utama atau melakukan pencarian terhadap barang yang baru saja dihapus untuk memastikan listing sudah tidak tayang.* | *Sistem tidak lagi menyertakan listing yang telah dihapus pada katalog utama, hasil pencarian, maupun halaman daftar listing penjual, karena datanya sudah tidak ada di pangkalan data.* |

<br>

**Skenario Alternatif 1: Penjual Membatalkan Konfirmasi Penghapusan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya", menekan menu opsi (ikon titik tiga) pada kartu listing, lalu memilih "Hapus Listing".* | *Sistem memverifikasi kepemilikan listing, lalu menampilkan dialog konfirmasi beserta peringatan bahwa penghapusan bersifat permanen.* |
| 2 | *Penjual mengurungkan niatnya dan menekan tombol "Batal" atau menutup dialog konfirmasi.* | *Sistem menutup dialog tanpa mengirim permintaan apa pun ke backend, tidak mengubah maupun menghapus data listing, dan mengembalikan tampilan ke halaman "Listing Saya" dengan listing yang tetap utuh beserta status semula.* |

<br>

**Skenario Alternatif 2: Percobaan Penghapusan oleh Akun Bukan Pemilik**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna lain yang bukan pemilik listing mengirimkan permintaan penghapusan atas listing milik penjual lain, misalnya melalui tautan aksi yang disalin dari halaman lain.* | *Sistem membandingkan ID pengguna pada token sesi dengan ID pemilik listing dan mendapati keduanya berbeda. Sistem menolak permintaan penghapusan sebelum menyentuh pangkalan data dan menampilkan pesan: "Anda tidak memiliki akses untuk menghapus listing ini".* |
| 2 | *Pengguna tersebut memuat ulang halaman katalog untuk memeriksa akibat percobaannya.* | *Sistem tetap menampilkan listing tersebut dalam keadaan utuh pada katalog, sehingga tidak ada data yang terhapus akibat permintaan dari akun yang tidak berhak.* |

### 4.4.11 Skenario UC11

**Nama Use Case:** *Menandai Listing Terjual*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Setelah serah terima barang secara COD di titik temu kampus selesai, penjual membuka halaman "Listing Saya" pada bagian/tab barang berstatus "Tersedia".* | *Sistem mengambil seluruh listing milik ID penjual yang sedang masuk, mengelompokkannya berdasarkan label status, dan menampilkan kartu listing berstatus "Tersedia" yang masing-masing dilengkapi tombol aksi "Tandai Terjual".* |
| 2 | *Penjual menekan tombol "Tandai Terjual" pada listing barang yang baru saja laku.* | *Sistem memverifikasi bahwa pemohon adalah pemilik listing dan bahwa status listing saat ini memang "Tersedia", kemudian menampilkan dialog konfirmasi berisi judul listing dan keterangan bahwa listing akan disembunyikan dari katalog serta hasil pencarian.* |
| 3 | *Penjual menekan tombol "Ya, Tandai Terjual" pada dialog konfirmasi.* | *Sistem mengubah nilai status listing di pangkalan data dari "Tersedia" menjadi "Terjual" beserta stempel waktu penandaannya. Sistem mengeluarkan listing tersebut dari kueri katalog utama dan hasil pencarian, memindahkan kartunya ke bagian/tab riwayat "Terjual" pada halaman "Listing Saya", memberi label "Terjual" pada kartu tersebut, dan menampilkan notifikasi "Listing telah ditandai terjual".* |
| 4 | *Penjual membuka katalog utama atau mencari judul barangnya untuk memastikan listing sudah tidak tayang bagi calon pembeli lain.* | *Sistem tidak lagi menampilkan listing berstatus "Terjual" tersebut pada katalog maupun hasil pencarian, namun tetap menyimpan dan menampilkannya pada halaman riwayat listing penjual sebagai rekam jejak penjualan.* |

<br>

**Skenario Alternatif 1: Penjual Membatalkan Dialog Konfirmasi**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman "Listing Saya" dan menekan tombol "Tandai Terjual" pada salah satu listing berstatus "Tersedia".* | *Sistem memverifikasi kepemilikan dan status listing, lalu menampilkan dialog konfirmasi penandaan terjual.* |
| 2 | *Penjual menyadari salah memilih barang dan menekan tombol "Batal" pada dialog konfirmasi.* | *Sistem menutup dialog tanpa mengirim perubahan status ke backend. Status listing tetap "Tersedia", listing tetap tayang pada katalog dan hasil pencarian, serta kartunya tetap berada pada bagian barang tersedia.* |

<br>

**Skenario Alternatif 2: Listing Sudah Berstatus Terjual**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menekan tombol "Tandai Terjual" dari tampilan halaman yang belum diperbarui (misalnya tab peramban yang dibuka sebelum penandaan dilakukan dari perangkat lain), padahal listing tersebut sudah berstatus "Terjual".* | *Sistem memeriksa status terkini listing pada pangkalan data dan mendapati nilainya sudah "Terjual", sehingga prasyarat status "Tersedia" tidak terpenuhi. Sistem menolak permintaan penandaan agar tidak terjadi perubahan status ganda, menampilkan pesan "Listing ini sudah berstatus Terjual", dan menyegarkan tampilan kartu sesuai status terkini.* |
| 2 | *Penjual memperhatikan kartu listing yang telah disegarkan.* | *Sistem menampilkan kartu tersebut pada bagian riwayat "Terjual" dengan tombol aksi yang sudah berganti menjadi "Batalkan Penandaan Terjual".* |

### 4.4.12 Skenario UC12

**Nama Use Case:** *Membatalkan Penandaan Terjual*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menyadari telah keliru menandai sebuah barang sebagai terjual (misalnya calon pembeli membatalkan kesepakatan COD), lalu membuka halaman "Listing Saya" pada bagian/tab riwayat "Terjual".* | *Sistem mengambil seluruh listing milik penjual yang berstatus "Terjual" dan menampilkannya sebagai kartu riwayat berlabel "Terjual", masing-masing dilengkapi tombol aksi "Batalkan Penandaan Terjual".* |
| 2 | *Penjual menekan tombol "Batalkan Penandaan Terjual" pada listing yang keliru ditandai.* | *Sistem memverifikasi bahwa pemohon adalah pemilik listing dan bahwa status listing saat ini memang "Terjual", kemudian menampilkan dialog konfirmasi berisi keterangan bahwa listing akan kembali tayang pada katalog dan hasil pencarian.* |
| 3 | *Penjual menekan tombol "Ya, Batalkan" pada dialog konfirmasi.* | *Sistem mengembalikan nilai status listing di pangkalan data dari "Terjual" menjadi "Tersedia" beserta stempel waktu pembatalannya. Sistem memasukkan kembali listing tersebut ke dalam kueri katalog utama dan hasil pencarian, memindahkan kartunya dari bagian riwayat "Terjual" ke bagian barang "Tersedia", melepas label "Terjual", lalu menampilkan notifikasi "Penandaan terjual dibatalkan, listing kembali tayang".* |

<br>

**Skenario Alternatif 1: Penjual Membatalkan Dialog Konfirmasi**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka bagian/tab riwayat "Terjual" pada halaman "Listing Saya" dan menekan tombol "Batalkan Penandaan Terjual" pada salah satu listing.* | *Sistem memverifikasi kepemilikan dan status listing, lalu menampilkan dialog konfirmasi pembatalan penandaan terjual.* |
| 2 | *Penjual menekan tombol "Batal" pada dialog atau menutupnya.* | *Sistem menutup dialog tanpa mengirim perubahan status ke backend. Status listing tetap "Terjual", listing tetap tersembunyi dari katalog dan hasil pencarian, serta kartunya tetap berada pada halaman riwayat listing penjual.* |

<br>

**Skenario Alternatif 2: Listing Sudah Kembali Berstatus Tersedia**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual menekan tombol "Batalkan Penandaan Terjual" dari tampilan halaman yang belum diperbarui, padahal pembatalan atas listing yang sama sudah pernah dilakukan sebelumnya.* | *Sistem memeriksa status terkini listing pada pangkalan data dan mendapati nilainya sudah "Tersedia", sehingga prasyarat status "Terjual" tidak terpenuhi. Sistem menolak permintaan pembatalan, menampilkan pesan "Listing ini sudah berstatus Tersedia", lalu menyegarkan daftar listing sesuai status terkini.* |
| 2 | *Penjual memeriksa katalog utama untuk memastikan barangnya sudah tayang kembali.* | *Sistem menampilkan listing tersebut pada katalog dan hasil pencarian sebagaimana listing berstatus "Tersedia" lainnya, tanpa penggandaan data akibat permintaan pembatalan yang berulang.* |

### 4.4.13 Skenario UC13

**Nama Use Case:** *Melihat Katalog Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli membuka halaman Beranda atau memilih menu "Katalog" pada panel navigasi.* | *Sistem menyusun kueri katalog dengan dua penyaring wajib, yaitu status listing harus "Tersedia" dan akun pemilik listing harus berstatus tidak diblokir, sehingga listing berstatus "Terjual" maupun listing milik akun yang sedang ditangguhkan tidak ikut terambil. Sistem mengurutkan hasil secara baku berdasarkan waktu unggah terbaru dan memotong hasilnya menjadi maksimum 20 listing untuk halaman pertama.* |
| 2 | *Pembeli menunggu katalog tampil dan menelusuri kartu-kartu barang yang muncul di layar.* | *Sistem merender setiap listing sebagai kartu produk yang memuat foto utama, judul, harga, kategori, dan lokasi titik temu COD. Di bagian bawah katalog, Sistem menampilkan navigasi antarhalaman (nomor halaman beserta tombol "Sebelumnya" dan "Berikutnya") serta keterangan jumlah total listing yang tersedia.* |
| 3 | *Pembeli menekan tombol "Berikutnya" atau salah satu nomor halaman pada navigasi antarhalaman.* | *Sistem mengambil 20 listing berikutnya dari pangkalan data dengan kriteria penyaringan dan pengurutan yang sama persis, merender ulang daftar kartu produk, menyorot nomor halaman yang sedang aktif, dan mengembalikan posisi gulir ke bagian atas daftar.* |
| 4 | *Pembeli menekan salah satu kartu produk yang menarik perhatiannya.* | *Sistem mengarahkan pembeli ke halaman detail listing yang bersangkutan (dilanjutkan pada UC15).* |

<br>

**Skenario Alternatif 1: Katalog Masih Kosong**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli membuka halaman Beranda atau memilih menu "Katalog" pada panel navigasi.* | *Sistem menjalankan kueri katalog dengan penyaring status "Tersedia" dan pemilik tidak diblokir, lalu mendapati tidak ada satu pun listing yang memenuhi kriteria tersebut.* |
| 2 | *Pembeli memperhatikan tampilan katalog yang muncul.* | *Sistem tidak menampilkan kartu produk apa pun dan tidak menampilkan navigasi antarhalaman. Sebagai gantinya, Sistem menampilkan keadaan kosong (empty state) berisi pesan "Belum ada barang yang tersedia saat ini" beserta ajakan bagi pengguna untuk membuat listing pertamanya.* |

<br>

**Skenario Alternatif 2: Listing Menjadi Tidak Tersedia saat Katalog Dibuka**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli sedang menelusuri katalog, sementara pada saat yang sama seorang penjual menandai barangnya sebagai "Terjual" atau admin memblokir akun penjual tertentu.* | *Sistem memperbarui status listing dan status akun yang bersangkutan pada pangkalan data, sehingga listing tersebut tidak lagi memenuhi kriteria kueri katalog.* |
| 2 | *Pembeli menyegarkan halaman katalog atau berpindah ke halaman berikutnya.* | *Sistem menjalankan ulang kueri katalog dan tidak lagi menyertakan listing yang baru saja ditandai terjual maupun seluruh listing milik akun yang baru diblokir, kemudian merender ulang daftar beserta jumlah total listing yang sudah diperbarui.* |

### 4.4.14 Skenario UC14

**Nama Use Case:** *Mencari dan Menyaring Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli mengetikkan kata kunci barang yang dicari (misalnya "jas praktikum") pada kolom pencarian di bagian atas katalog, lalu menekan tombol cari atau tombol Enter.* | *Sistem mencocokkan kata kunci tersebut terhadap judul dan deskripsi seluruh listing tanpa membedakan huruf besar-kecil dan menerima kecocokan sebagian kata. Sistem tetap menerapkan penyaring wajib berupa status "Tersedia" dan pemilik tidak diblokir, lalu menampilkan hasilnya maksimum 20 listing per halaman beserta keterangan jumlah barang yang ditemukan.* |
| 2 | *Pembeli membuka panel filter dan memilih kategori "jas praktikum", mengisi rentang harga minimum Rp50.000 dan maksimum Rp150.000, serta memilih lokasi titik temu yang diinginkan.* | *Sistem menggabungkan seluruh filter aktif dengan kata kunci pencarian sebagai satu kesatuan syarat, sehingga hanya listing yang memenuhi semua kriteria sekaligus yang ditampilkan. Sistem mengembalikan tampilan ke halaman pertama, menampilkan penanda (chip) untuk setiap filter yang sedang aktif, dan memperbarui keterangan jumlah hasil.* |
| 3 | *Pembeli memilih kriteria pengurutan "Harga Terendah" pada menu dropdown urutkan.* | *Sistem mengurutkan ulang seluruh hasil yang sudah tersaring berdasarkan harga dari yang termurah, tanpa mengubah kata kunci maupun filter yang sedang aktif, lalu merender ulang daftar dari halaman pertama.* |
| 4 | *Pembeli menekan tombol "Berikutnya" pada navigasi antarhalaman untuk melihat sisa hasil pencarian.* | *Sistem memuat 20 listing berikutnya dengan mempertahankan kata kunci, seluruh filter aktif, dan kriteria pengurutan yang sedang dipakai, sehingga hasil antarhalaman tetap konsisten.* |

<br>

**Skenario Alternatif 1: Tidak Ada Barang yang Cocok**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli memasukkan kata kunci yang sangat spesifik dan/atau menerapkan kombinasi filter yang terlalu ketat (misalnya kategori elektronik dengan rentang harga maksimum Rp10.000).* | *Sistem menjalankan kueri pencarian dengan seluruh kriteria tersebut dan mendapati tidak ada satu pun listing berstatus "Tersedia" yang memenuhinya.* |
| 2 | *Pembeli memperhatikan area hasil pencarian.* | *Sistem tidak menampilkan kartu produk apa pun dan menampilkan pesan "Barang tidak ditemukan" disertai saran untuk mengganti kata kunci atau melonggarkan filter, lengkap dengan tombol "Hapus Semua Filter".* |
| 3 | *Pembeli menekan tombol "Hapus Semua Filter".* | *Sistem mengosongkan seluruh penanda filter dan kata kunci, lalu menampilkan kembali katalog utama secara penuh mulai dari halaman pertama dengan urutan baku waktu unggah terbaru.* |

<br>

**Skenario Alternatif 2: Rentang Harga Tidak Masuk Akal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli mengisi harga minimum dengan nilai yang lebih besar daripada harga maksimum (misalnya minimum Rp200.000 dan maksimum Rp50.000), lalu menekan tombol "Terapkan Filter".* | *Sistem memeriksa keabsahan rentang harga dan mendeteksi bahwa batas bawah melampaui batas atas. Sistem menahan penerapan filter tersebut, memberi penanda merah pada kedua kolom harga, dan menampilkan pesan "Harga minimum tidak boleh melebihi harga maksimum".* |
| 2 | *Pembeli memperbaiki nilai rentang harga sehingga minimum lebih kecil daripada maksimum, lalu menekan kembali tombol "Terapkan Filter".* | *Sistem menerima rentang harga yang sudah sah, menerapkannya bersama kata kunci dan filter lain yang aktif, kemudian menampilkan hasil pencarian yang sesuai secara berhalaman.* |

### 4.4.15 Skenario UC15

**Nama Use Case:** *Melihat Detail Listing*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan salah satu kartu produk dari katalog utama, dari hasil pencarian, atau dari halaman profil penjual.* | *Sistem membaca ID listing yang dipilih, melakukan kueri ke pangkalan data untuk mengambil seluruh atribut listing beserta relasinya ke data penjual, lalu merender halaman detail listing.* |
| 2 | *Pengguna membaca informasi barang yang ditampilkan pada halaman detail.* | *Sistem menyajikan galeri seluruh foto barang (hingga 5 foto) dalam bentuk carousel dengan thumbnail, judul barang, harga, deskripsi kondisi barang, kategori, lokasi titik temu COD, serta identitas penjual berupa nama dan tautan menuju halaman profilnya. Sistem juga menampilkan tombol aksi "Hubungi Penjual" dan "Laporkan" pada halaman tersebut.* |
| 3 | *Pengguna menekan salah satu thumbnail atau menggeser galeri untuk memeriksa kondisi barang lebih saksama.* | *Sistem menampilkan foto yang dipilih dalam ukuran penuh (lightbox) dan menyediakan navigasi maju-mundur antarfoto tanpa memuat ulang halaman detail.* |
| 4 | *Pengguna menekan nama atau tautan profil penjual pada halaman detail.* | *Sistem mengarahkan pengguna ke halaman profil penjual yang menampilkan identitas penjual beserta daftar listing lain miliknya.* |

<br>

**Skenario Alternatif 1: Pengguna adalah Pemilik Listing**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Penjual membuka halaman detail listing miliknya sendiri, misalnya dari halaman "Listing Saya".* | *Sistem membandingkan ID pengguna pada token sesi dengan ID pemilik listing dan mendapati keduanya sama.* |
| 2 | *Penjual memperhatikan tombol aksi yang tersedia pada halaman detail.* | *Sistem tetap menampilkan seluruh informasi listing seperti pada skenario normal, namun menggantikan tombol "Hubungi Penjual" dengan tombol pengelolaan listing, yaitu "Ubah Listing", "Hapus Listing", dan "Tandai Terjual", karena penjual tidak perlu menghubungi dirinya sendiri.* |

<br>

**Skenario Alternatif 2: Listing Sudah Dihapus atau Tidak Ditemukan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka tautan detail listing yang disimpan atau dibagikan sebelumnya, padahal listing tersebut sudah dihapus oleh penjualnya atau dihapus admin karena terbukti melanggar.* | *Sistem mencari ID listing pada pangkalan data dan tidak menemukan datanya.* |
| 2 | *Pengguna memperhatikan halaman yang tampil.* | *Sistem tidak merender halaman detail, melainkan menampilkan halaman pemberitahuan "Listing tidak ditemukan atau telah dihapus" beserta tombol untuk kembali ke katalog utama.* |

<br>

**Skenario Alternatif 3: Listing Sudah Berstatus Terjual**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka detail sebuah listing melalui tautan lama atau melalui halaman riwayat penjual, padahal status listing tersebut sudah "Terjual".* | *Sistem mengambil data listing beserta status terkininya dan mendapati nilainya "Terjual".* |
| 2 | *Pengguna memperhatikan halaman detail yang tampil.* | *Sistem tetap menampilkan informasi listing sebagai arsip, namun membubuhkan label "Terjual" yang menonjol pada bagian atas halaman dan menonaktifkan tombol "Hubungi Penjual" agar tidak terjadi kesalahpahaman mengenai ketersediaan barang.* |

### 4.4.16 Skenario UC16

**Nama Use Case:** *Menghubungi Penjual*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli yang tertarik pada sebuah barang menekan tombol "Hubungi Penjual" pada halaman detail listing.* | *Sistem memeriksa keabsahan token sesi pembeli, memastikan pembeli bukan pemilik listing, lalu memeriksa status akun penjual pada pangkalan data untuk memastikan akun tersebut tidak sedang diblokir. Setelah seluruh pemeriksaan lolos, Sistem mencari ruang percakapan yang sudah ada untuk kombinasi listing, pembeli, dan penjual tersebut.* |
| 2 | *Pembeli menunggu proses pembukaan ruang percakapan.* | *Karena belum ada ruang percakapan untuk kombinasi tersebut, Sistem membuat ruang percakapan baru, menautkannya pada ID listing yang bersangkutan, dan menetapkan daftar peserta yang sah hanya terdiri atas dua pihak, yaitu pembeli dan penjual.* |
| 3 | *Pembeli memperhatikan tampilan ruang percakapan yang terbuka.* | *Sistem menampilkan kartu ringkas listing (foto utama, judul, dan harga) yang disematkan pada bagian atas ruang percakapan sebagai konteks negosiasi, identitas lawan bicara, riwayat pesan yang masih kosong, kolom penulisan pesan, serta tautan menuju halaman Kebijakan Privasi sebagai pengingat bahwa isi percakapan bersifat pribadi.* |
| 4 | *Pembeli mengetik pesan pembuka untuk menanyakan ketersediaan barang atau menawar harga, lalu menekan tombol kirim.* | *Sistem menyimpan dan menayangkan pesan tersebut pada ruang percakapan serta meneruskan alur ke proses pengiriman pesan (dilanjutkan pada UC17).* |

<br>

**Skenario Alternatif 1: Akun Penjual Sedang Diblokir**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli menekan tombol "Hubungi Penjual" pada halaman detail listing yang dibuka dari tautan lama, padahal akun penjualnya baru saja diblokir admin.* | *Sistem memeriksa status akun penjual dan mendapati akun tersebut berstatus diblokir, sehingga prasyarat pembukaan ruang percakapan tidak terpenuhi.* |
| 2 | *Pembeli memperhatikan respons yang muncul di layar.* | *Sistem membatalkan pembuatan ruang percakapan, menampilkan pesan "Penjual tidak dapat dihubungi karena akunnya sedang ditangguhkan", dan menyediakan tautan kembali ke katalog utama.* |

<br>

**Skenario Alternatif 2: Ruang Percakapan untuk Listing Tersebut Sudah Ada**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pembeli yang sebelumnya pernah menghubungi penjual untuk listing yang sama menekan kembali tombol "Hubungi Penjual" pada halaman detail listing tersebut.* | *Sistem memeriksa status akun penjual, lalu menemukan bahwa ruang percakapan untuk kombinasi listing, pembeli, dan penjual tersebut sudah pernah dibuat.* |
| 2 | *Pembeli menunggu ruang percakapan terbuka.* | *Sistem tidak membuat ruang percakapan baru agar tidak terjadi penggandaan, melainkan membuka ruang percakapan yang sudah ada beserta seluruh riwayat pesan sebelumnya secara berurutan, lalu menempatkan tampilan pada pesan paling akhir.* |

<br>

**Skenario Alternatif 3: Percobaan Akses Ruang Percakapan oleh Pihak Ketiga**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna lain yang bukan peserta percakapan, termasuk akun dengan peran admin, mencoba membuka ruang percakapan antara pembeli dan penjual tersebut melalui tautan langsung.* | *Sistem membandingkan ID pengguna pada token sesi dengan daftar peserta sah ruang percakapan dan mendapati pemohon tidak termasuk di dalamnya.* |
| 2 | *Pengguna tersebut tetap berusaha memuat isi percakapan.* | *Sistem menolak permintaan akses tanpa mengirimkan satu pun isi pesan ke pemohon, menampilkan pesan "Anda tidak memiliki akses ke percakapan ini", dan mempertahankan isi pesan tetap tersimpan dalam bentuk terenkripsi di pangkalan data.* |

### 4.4.17 Skenario UC17

**Nama Use Case:** *Mengirim Pesan dalam Percakapan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna (Penjual dan Pembeli) mengetik pesan teks pada ruang percakapan untuk bernegosiasi atau menyepakati COD, lalu menekan tombol "Kirim".* | *Sistem membaca masukan teks, mengenkripsi isi pesan tersebut dan menyimpannya ke dalam pangkalan data.* |
| 2 | *Pengguna melihat layar ruang percakapan.* | *Sistem menampilkan pesan yang baru dikirim kepada kedua belah pihak secara berurutan beserta stempel waktu (waktu pengiriman) secara realtime.* |
| 3 | *(Aksi Pasif pada sisi penerima pesan).* | *Sistem mengirimkan notifikasi kepada perangkat penerima pesan (termasuk saat aplikasi tidak dibuka/berjalan di latar belakang) dan memperbarui angka penanda pesan belum dibaca (unread badge) pada antarmuka penerima.* |

<br>

**Skenario Alternatif 1: Percobaan Pengiriman Pesan Kosong**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna tidak mengetik teks apa pun (atau hanya berisi spasi) pada kolom ruang percakapan.* | *Sistem mendeteksi bahwa kolom input kosong, sehingga menonaktifkan tombol "Kirim" atau mengabaikan aksi jika tombol ditekan, serta tidak mengirim data apa pun ke server.* |

### 4.4.18 Skenario UC18

**Nama Use Case:** *Melihat Daftar Percakapan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna membuka halaman "Daftar Percakapan" miliknya melalui menu navigasi* | *Sistem membaca ID pengguna dari token sesi yang aktif, lalu mengambil seluruh data percakapan yang terkait dengan ID tersebut dari pangkalan data.* |
| 2 | *Pengguna melihat daftar antarmuka.* | *Sistem menampilkan daftar percakapan, lengkap dengan cuplikan pesan terakhir (last massage snippet), identitas lawan bicara, serta angka penanda jumlah pesan yang belum dibaca.* |

### 4.4.19 Skenario UC19

**Nama Use Case:** *Mengirimkan Laporan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna menekan tombol "Laporkan" dari halaman detail listing, profil pengguna, ruang  percakapan, atau menu bantuan.* | *Sistem menampilkan formulir pelaporan yang sesuai dengan konteks asal halaman.* |
| 2 | *Pengguna memilih kategori laporan (penipuan, konten tidak pantas, atau bug), mengisi kolom alasan, melampirkan bukti tangkapan layar, lalu menekan tombol "Kirim Laporan".* | *Sistem memvalidasi kelengkapan formulir. Khusus jika laporan berasal dari ruang percakapan, sistem secara otomatis hanya menyertakan ID percakapan, waktu pelaporan, dan identitas pelapor tanpa menyertakan isi/teks pesan.* |
| 3 | *Pengguna menunggu proses pengiriman selesai.* | *Sistem menyimpan laporan baru tersebut dengan status bawaan "Baru", mencatat aktivitas penerimaan laporan tersebut ke dalam log audit,dan menampilkan notifikasi "Laporan berhasil dikirim".* |

<br>

**Skenario Alternatif 1: Kolom Bukti atau Alasan Dikosongkan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna mengisi sebagian formulir namun mengosongkan kolom wajib seperti alasan atau tidak melampirkan tangkapan layar, lalu menekan "Kirim Laporan".* | *Sistem mendeteksi kolom wajib tidak terisi, menghentikan pengiriman, memberikan penanda visual merah pada kolom terkait, dan memunculkan galat "Alasan dan bukti tangkapan layar wajib diisi".* |

### 4.4.20 Skenario UC20

**Nama Use Case:** *Melihat dan Menyaring Daftar Laporan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Admin membuka halaman daftar laporan pada panel dashboard khusus admin.* | *Sistem memverifikasi hak akses admin melalui token sesi, lalu mengambil dan menampilkan seluruh data laporan yang berisi identitas pelapor, objek dilaporkan, kategori, waktu, dan status penanganan.* |
| 2 | *Admin memilih salah satu status pada menu dropdown filter (misalnya memilih "Baru").* | *Sistem memproses permintaan filter dan memperbarui tampilan tabel, sehingga hanya memunculkan laporan dengan status "Baru" yang sesuai dengan kriteria saringan.* |

<br>

**Skenario Alternatif 1: Akses oleh Akun Bukan Admin**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pengguna biasa (bukan admin) mencoba masuk ke URL halaman daftar laporan secara paksa/langsung.* | *Sistem memeriksa role akun dari token sesi, mendeteksi bahwa akun bukan admin, lalu menolak permintaan dengan memberikan redirect ke beranda utama beserta peringatan "Akses Ditolak".* |

### 4.4.21 Skenario UC21

**Nama Use Case:** *Mengubah Status Penanganan Laporan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Admin membuka halaman detail laporan, meninkjau isi laporan, lalu mengubah dropdown status penanganan (misalnya dari "Baru" ke "Diproses" atau "Selesai") dan menyimpannya.* | *Sistem menerima perubahan data, memvalidasi input, lalu memperbarui status laporan pada pangkalan data beserta dengan stempel waktu perubahan.* |
| 2 | *(Proses latar belakang).* | *Sistem mencatat tindak lanjut dan perubahan status tersebut secara permanen ke dalam log audit. Sistem memastikan log audit dienkripsi/diamankan sehingga tidak dapat diubah maupun dihapus oleh pihak manapun.* |

### 4.4.22 Skenario UC22

**Nama Use Case:** *Menghapus Listing yang Dilaporkan*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Admin, dari halaman detail laporan, menekan tombol "Hapus Listing" pada listing yang terbukti bermasalah, mencantumkan alasan penghgapusan pada kotak dialog yang muncul, lalu menekan konfirmasi.* | *Sistem mmeverifikasi tindakan admin dan menghapus data listing tersebut (beserta gambar dan detail terkait) dari sistem/katalog pangkalan data.* |
| 2 | *Pemberitahuan kepada pemilik.* | *Sistem mengirimkan pemberitahuan (melalui notifikasi in-app atau email) kepada akun pemilik listing, yang secara spesifik mencantumkan bahwa listing mereka dihapus beserta alasan dari admin.* |
| 3 | *Pencatatan Audit.* | *Sistem secara otomatis mencatat seluruh detail tindakan penghapusan listing tersebut ke dalam log admin dan log audit untuk keperluan penelusuran riwayat sistem.* |

### 4.4.23 Skenario UC23

**Nama Use Case:** *Memblokir Akun Pengguna*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Admin, dari halaman detail laporan atau profil pengguna, menekan tombol "Blokir Akun", mengisi alasan pada prompt yang disediakan, lalu melakukan konfirmasi pemblokiran.* | *Sistem memperbarui status akun pengguna di pangkalan data menjadi "Diblokir".* |
| 2 | *Dampak terhadap katalog pengguna.* | *Sistem memindai seluruh listing yang dimiliki oleh akun tersebut dan secara otomatis menonaktifkannya, sehingga listing tersebut hilang dari katalog publik dan tidak muncul pada hasil pencarian.* |
| 3 | *Dampak terhadap sistem login dam notifikasi.* | *Sistem mengirimkan notifikasi atau email pemberitahuan beserta alasan pemblokiran kepada pengguna terkait. Sisem juga memutuskan sesi aktif saat itu. Saat pengguna mencoba login kemabali, sistem akan menolak percobaan login dan menampilkan pesan penangguhah* |
| 4 | *Pencatatan Audit* | *Sistem akan mencatat tindakan pemblokiran akun ini beserta detail admin yang mengeksekusinya ke dalam log admin dan log audit.* |

### 4.4.24 Skenario UC24

**Nama Use Case:** *Membuka Blokir Akun Pengguna*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Admin menekan tombol "Buka Blokir" pada akun yang sedang diblokir melalui halaman detail laporan atau halaman profil pengguna terkait.* | *Sistem mengubah dan mengembalikan status pengguna di pangkalan data menjadi tidak diblokir (aktif/normal).* |
| 2 | *Dampak terhadap katalog dan aksesibilitas.* | *Sistem memulihkan akses masuk agar pengguna dapat menggunakan software kembali seperti semula. Sistem juga mengembalikan status publik seluruh listing milik pengguna tersebut sehingga kembali tampil pada katalog dan hasil pencarian.* |
| 3 | *Pencatatan* | *Sistem mencatat tindakan pembukaan blokir ini ke dalam log admin sebagai rekam jejak.* |

# BAB 5: Pemodelan Kelas

## 5.1 Identifikasi Kelas


| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| **C01** | *HalamanOtentikasi* | *Antarmuka pendaftaran akun, input OTP, autentikasi, dan login pengguna.* | *UC01, UC02, UC03, UC04* |
| **C02** | *HalamanProfil* | *Antarmuka untuk menampilkan profil pengguna (nama, NIM, email) beserta daftar barang yang dimiliki dan menu pengaturan akun.* | *UC05* |
| **C03** | *HalamanListingPenjual* | *Antarmuka dasbor penjual untuk melihat seluruh listing miliknya yang dikelompokkan berdasarkan status, beserta tombol aksi hapus, tandai terjual, dan batalkan penandaan terjual.* | *UC08, UC10, UC11, UC12* |
| **C04** | *FormulirBarang* | *Antarmuka untuk memasukkan, mengubah, dan melengkapi data barang beserta unggahan foto.* | *UC07, UC09* |
| **C05** | *HalamanKatalog* | *Antarmuka utama untuk menampilkan katalog barang, pencarian, filter, dan navigasi daftar barang.* | *UC13, UC14* |
| **C06** | *KartuProduk* | *Komponen antarmuka yang menampilkan ringkasan informasi barang pada katalog atau daftar barang.* | *UC05, UC08, UC13, UC14* |
| **C07** | *HalamanDetailBarang* | *Antarmuka untuk menampilkan detail spesifikasi, foto, status, dan informasi lengkap suatu barang, beserta tombol "Hubungi Penjual" dan aksi pelaporan.* | *UC15, UC16, UC19* |
| **C08** | *HalamanPercakapan* | *Antarmuka daftar percakapan dan ruang percakapan yang digunakan pengguna untuk melakukan komunikasi dan negosiasi.* | *UC16, UC17, UC18* |
| **C09** | *PanelNotifikasi* | *Komponen antarmuka yang menampilkan daftar pemberitahuan kepada pengguna beserta penanda jumlah pesan atau notifikasi yang belum dibaca.* | *UC17* |
| **C10** | *FormulirLaporan* | *Antarmuka untuk membuat laporan atau aduan dan mengunggah bukti pendukung.* | *UC19* |
| **C11** | *DasborAdmin* | *Antarmuka panel admin untuk memantau, memeriksa, dan menangani aktivitas moderasi sistem.* | *UC20, UC21, UC22, UC23, UC24* |
| **C12** | *HalamanDokumenLegal* | *Antarmuka untuk menampilkan dokumen legal seperti Terms of Service dan Kebijakan Privasi.* | *UC06* |
| **C13** | *AkunController* | *Pengelola alur proses akun, termasuk validasi domain ITB, registrasi, verifikasi OTP, login, logout, pengelolaan sesi, dan pengelolaan profil.* | *UC01, UC02, UC03, UC04, UC05* |
| **C14** | *BarangController* | *Pengelola proses pembuatan, pengubahan, penghapusan, validasi, verifikasi kepemilikan, dan perubahan status barang.* | *UC07, UC08, UC09, UC10, UC11, UC12, UC15* |
| **C15** | *KatalogController* | *Pengelola pengambilan daftar barang, pagination, sorting, dan penyajian data katalog kepada boundary.* | *UC13, UC14* |
| **C16** | *PencarianController* | *Pengelola proses pencarian barang berdasarkan kata kunci pada informasi barang yang tersedia.* | *UC14* |
| **C17** | *FilterController* | *Pengelola proses penyaringan barang berdasarkan kategori, harga, lokasi, dan kriteria lainnya serta validasi parameter filter.* | *UC14* |
| **C18** | *PercakapanController* | *Pengelola alur pembuatan percakapan, verifikasi peserta sah, pengiriman dan penerimaan pesan terenkripsi, serta perubahan status percakapan.* | *UC16, UC17, UC18* |
| **C19** | *NotifikasiController* | *Pengelola pembuatan dan pengiriman pemberitahuan kepada pengguna, baik melalui email (kode verifikasi) maupun notifikasi in-app (pesan baru, tindakan moderasi admin), serta pembaruan status baca.* | *UC01, UC02, UC17, UC22, UC23* |
| **C20** | *LaporanController* | *Pengelola proses pembuatan laporan pengguna, validasi data dan bukti, serta penyimpanan laporan untuk proses moderasi.* | *UC19* |
| **C21** | *ModerasiController* | *Pengelola proses moderasi admin, pemeriksaan laporan, tindakan terhadap barang atau akun, dan pencatatan aktivitas audit.* | *UC20, UC21, UC22, UC23, UC24* |
| **C22** | *DokumenLegalController* | *Pengelola pengambilan dan penyajian dokumen legal kepada pengguna.* | *UC06* |
| **C23** | *Akun* | *Entitas utama yang menyimpan data identitas, kredensial, status akun, dan informasi dasar pengguna sistem.* | *UC01, UC02, UC03, UC04, UC05, UC17, UC19, UC23, UC24* |
| **C24** | *Pembeli* | *Entitas role pengguna yang menggunakan sistem untuk mencari, melihat, dan berinteraksi terkait barang yang tersedia.* | *UC05, UC16* |
| **C25** | *Penjual* | *Entitas role pengguna yang memiliki dan mengelola barang yang ditawarkan pada sistem.* | *UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC15, UC16* |
| **C26** | *Admin* | *Entitas role pengguna yang memiliki hak akses administrasi dan moderasi sistem.* | *UC20, UC21, UC22, UC23, UC24* |
| **C27** | *TokenVerifikasi* | *Entitas penyimpanan token atau OTP verifikasi beserta waktu kedaluwarsa dan status penggunaannya.* | *UC01, UC02* |
| **C28** | *SesiLogin* | *Entitas yang menyimpan sesi login aktif pengguna berupa token sesi, akun pemilik, waktu mulai, dan waktu kedaluwarsa (paling lama 24 jam). Menjadi dasar identifikasi pengguna dan verifikasi kepemilikan pada setiap aksi yang memerlukan login, dan dihapus saat logout.* | *UC03, UC04, UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC16, UC17, UC18, UC19* |
| **C29** | *Barang* | *Entitas utama yang menyimpan informasi barang, deskripsi, harga, kondisi, status ketersediaan, pemilik, kategori, dan lokasi COD.* | *UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC13, UC14, UC15, UC16, UC19, UC22, UC23, UC24* |
| **C30** | *FotoBarang* | *Entitas yang menyimpan metadata foto barang seperti lokasi file, urutan foto, dan keterkaitannya dengan barang.* | *UC07, UC09, UC15* |
| **C31** | *Kategori* | *Entitas referensi yang menyimpan klasifikasi atau jenis barang yang digunakan pada katalog, input barang, pencarian, dan filter.* | *UC07, UC09, UC14, UC15* |
| **C32** | *LokasiCOD* | *Entitas referensi yang menyimpan daftar titik temu COD yang tersedia pada lingkungan multikampus.* | *UC07, UC09, UC14, UC15* |
| **C33** | *Percakapan* | *Entitas yang merepresentasikan sesi atau ruang percakapan antara pengguna yang terlibat dalam proses negosiasi.* | *UC16, UC17, UC18, UC19* |
| **C34** | *Pesan* | *Entitas yang menyimpan setiap pesan dalam percakapan, termasuk pengirim, waktu pengiriman, isi pesan terenkripsi, dan status pesan.* | *UC16, UC17, UC18* |
| **C35** | *Notifikasi* | *Entitas yang menyimpan pemberitahuan kepada pengguna, termasuk status telah dibaca atau belum dibaca.* | *UC01, UC02, UC17, UC22, UC23* |
| **C36** | *Laporan* | *Entitas yang menyimpan data aduan pengguna, pihak atau barang yang dilaporkan, kategori, alasan, status penanganan, dan hasil penyelesaian.* | *UC19, UC20, UC21* |
| **C37** | *BuktiLaporan* | *Entitas yang menyimpan metadata berkas bukti tangkapan layar yang dilampirkan pada sebuah laporan, seperti lokasi file dan keterkaitannya dengan laporan.* | *UC19* |
| **C38** | *LogAudit* | *Entitas yang menyimpan rekam jejak permanen atas penerimaan laporan dan tindak lanjutnya (waktu, pelaku, tindakan) yang tidak dapat diubah maupun dihapus.* | *UC19, UC21, UC22, UC23* |
| **C39** | *LogAdmin* | *Entitas yang mencatat setiap tindakan moderasi admin berupa pelaku, jenis tindakan, objek yang ditindak, waktu, dan alasan tindakan.* | *UC22, UC23, UC24* |
| **C40** | *DokumenLegal* | *Entitas yang menyimpan dokumen legal seperti Terms of Service dan Kebijakan Privasi beserta versi dan status publikasinya.* | *UC01, UC05, UC06* |


## 5.2 Diagram Kelas per Use Case
Setiap diagram pada subbab ini merupakan potongan dari diagram kelas keseluruhan pada 5.3 dan memakai notasi yang sama: panah garis penuh untuk asosiasi *boundary* ke *control*, panah garis putus-putus untuk dependensi «use» dari *control* ke *entity* (atau ke *control* lain), garis dengan multiplisitas untuk asosiasi antar-*entity*, belah ketupat hitam untuk komposisi, dan segitiga kosong untuk generalisasi. Setiap kotak hanya memuat ID dan nama kelas, sedangkan atribut dan metodenya dirinci pada tabel di bawah diagram.

### 5.2.1 Use Case UC01

**Nama Use Case:** *Mendaftar Akun*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *Menampilkan formulir pendaftaran (nama, NIM, email, kata sandi) beserta Kebijakan Privasi dan kotak persetujuannya, menandai isian yang belum lengkap, dan menampilkan pesan galat domain/email terdaftar.* |
| *C13* | *AkunController* | *Memvalidasi kelengkapan isian, domain @itb.ac.id, dan keunikan email; melakukan hashing kata sandi; membuat akun berstatus "Belum Terverifikasi"; membangkitkan kode verifikasi dan meminta pengirimannya.* |
| *C19* | *NotifikasiController* | *Mengirimkan kode verifikasi ke alamat email pendaftar.* |
| *C23* | *Akun* | *Menyimpan data akun baru (nama, NIM, email, hash kata sandi, status akun, persetujuan kebijakan).* |
| *C27* | *TokenVerifikasi* | *Menyimpan kode verifikasi yang dibangkitkan beserta waktu pembuatan dan batas kedaluwarsa 15 menit.* |
| *C35* | *Notifikasi* | *Menyimpan catatan pemberitahuan pengiriman kode verifikasi kepada pendaftar.* |
| *C40* | *DokumenLegal* | *Menyediakan versi Kebijakan Privasi dan Ketentuan Penggunaan yang harus disetujui pendaftar sebelum akun dibuat.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC01" src="./assets/diagram/Diagram_Kelas_UC01.png" width="70%">
</p>
<p align="center">
<i>Gambar 3. Diagram Kelas Use Case UC01</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *nama, nim, email, kataSandi, setujuKebijakan* | *tampilkanFormulirPendaftaran(), tampilkanKebijakanPrivasi(), kirimFormulirPendaftaran(), tampilkanPesanGalat(), arahkanKeHalamanVerifikasi()* |
| *C13* | *AkunController* | *-* | *daftarAkun(), validasiKelengkapanFormulir(), validasiDomainEmail(), cekKeunikanEmail(), hashKataSandi(), buatKodeVerifikasi(), getTautanDokumenLegal()* |
| *C19* | *NotifikasiController* | *-* | *kirimEmailVerifikasi()* |
| *C23* | *Akun* | *idAkun, nama, nim, email, kataSandiHash, statusAkun, setujuKebijakan, waktuDaftar* | *simpan()* |
| *C27* | *TokenVerifikasi* | *idToken, idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai* | *simpan()* |
| *C35* | *Notifikasi* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan()* |
| *C40* | *DokumenLegal* | *idDokumen, jenisDokumen, versi, isi, tautan* | *getVersiTerbaru(), getTautan()* |

### 5.2.2 Use Case UC02

**Nama Use Case:** *Memverifikasi Surel*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *Menampilkan kolom input kode verifikasi, hitung mundur 15 menit, tombol "Verifikasi" dan "Kirim Ulang", serta pesan galat kode tidak valid/kedaluwarsa.* |
| *C13* | *AkunController* | *Mencocokkan kode yang dimasukkan dengan token tersimpan, memeriksa kedaluwarsa, mengubah status akun menjadi "Terverifikasi", serta menghanguskan token lama dan membangkitkan token baru saat pengiriman ulang.* |
| *C19* | *NotifikasiController* | *Mengirimkan kode verifikasi baru ke email pengguna saat pengiriman ulang diminta.* |
| *C23* | *Akun* | *Menyimpan status akun yang diperbarui dari "Belum Terverifikasi" menjadi "Terverifikasi".* |
| *C27* | *TokenVerifikasi* | *Menyimpan kode verifikasi beserta waktu kedaluwarsa dan status penggunaannya (aktif/hangus/terpakai).* |
| *C35* | *Notifikasi* | *Menyimpan catatan pengiriman ulang kode verifikasi.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC02" src="./assets/diagram/Diagram_Kelas_UC02.png" width="70%">
</p>
<p align="center">
<i>Gambar 4. Diagram Kelas Use Case UC02</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *kodeVerifikasi, sisaWaktu* | *tampilkanFormulirVerifikasi(), kirimKodeVerifikasi(), mintaKirimUlang(), resetHitungMundur(), tampilkanPesanGalat()* |
| *C13* | *AkunController* | *-* | *verifikasiAkun(), validasiKodeVerifikasi(), cekKedaluwarsaKode(), hanguskanKodeLama(), buatKodeVerifikasi(), kirimUlangKode()* |
| *C19* | *NotifikasiController* | *-* | *kirimEmailVerifikasi()* |
| *C23* | *Akun* | *idAkun, email, statusAkun* | *perbaruiStatusAkun()* |
| *C27* | *TokenVerifikasi* | *idToken, idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai* | *simpan(), cocokkanKode(), sudahKedaluwarsa(), tandaiHangus(), tandaiTerpakai()* |
| *C35* | *Notifikasi* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan()* |

### 5.2.3 Use Case UC03

**Nama Use Case:** *Masuk ke Sistem (Login)*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *Menampilkan formulir login (email, kata sandi), pesan kredensial salah, pesan akun belum terverifikasi beserta pintasan kirim ulang kode, dan pesan penangguhan akun diblokir.* |
| *C13* | *AkunController* | *Mencari akun berdasarkan email, membandingkan hash kata sandi, memeriksa status akun (terverifikasi dan tidak diblokir), lalu membuat sesi login bertoken.* |
| *C23* | *Akun* | *Menyimpan kredensial (email, hash kata sandi) dan status akun yang diperiksa saat login.* |
| *C28* | *SesiLogin* | *Menyimpan token sesi yang dibuat saat login berhasil beserta waktu kedaluwarsa paling lama 24 jam.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC03" src="./assets/diagram/Diagram_Kelas_UC03.png" width="70%">
</p>
<p align="center">
<i>Gambar 5. Diagram Kelas Use Case UC03</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *email, kataSandi, token* | *tampilkanFormulirLogin(), kirimFormulirLogin(), tampilkanPesanGalat(), arahkanKeBeranda()* |
| *C13* | *AkunController* | *-* | *login(), cariAkunByEmail(), verifikasiKataSandi(), cekStatusAkun(), buatSesiLogin()* |
| *C23* | *Akun* | *idAkun, email, kataSandiHash, statusAkun, statusBlokir, peran* | *getStatusAkun()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token, waktuMulai, waktuKedaluwarsa, statusAktif* | *buatToken(), simpan()* |

### 5.2.4 Use Case UC04

**Nama Use Case:** *Keluar dari Sistem (Logout)*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *Menyediakan tombol "Keluar" pada menu navigasi, menghapus token dari penyimpanan lokal, dan mengalihkan pengguna ke halaman login/beranda tamu.* |
| *C13* | *AkunController* | *Memproses permintaan logout dengan mencabut (revoke) sesi login yang sedang aktif di sisi server.* |
| *C23* | *Akun* | *Pemilik sesi login yang diakhiri.* |
| *C28* | *SesiLogin* | *Sesi aktif yang dihapus/dinonaktifkan saat logout.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC04" src="./assets/diagram/Diagram_Kelas_UC04.png" width="70%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas Use Case UC04</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *token* | *tampilkanTombolKeluar(), kirimPermintaanLogout(), hapusTokenLokal(), arahkanKeHalamanLogin()* |
| *C13* | *AkunController* | *-* | *logout(), cabutSesi()* |
| *C23* | *Akun* | *idAkun* | *-* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token, statusAktif* | *nonaktifkan(), hapus()* |

### 5.2.5 Use Case UC05

**Nama Use Case:** *Melihat Profil Akun*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *HalamanProfil* | *Menampilkan data diri pengguna (nama, NIM, email), deretan listing milik akun, serta menu Pengaturan Akun yang memuat tautan Kebijakan Privasi.* |
| *C06* | *KartuProduk* | *Komponen yang menampilkan ringkasan tiap listing milik pengguna pada halaman profil.* |
| *C13* | *AkunController* | *Mengidentifikasi ID akun dari sesi aktif, mengambil data identitas akun dan daftar barang yang berelasi dengannya, serta menyediakan tautan dokumen legal.* |
| *C23* | *Akun* | *Menyimpan data identitas yang ditampilkan pada halaman profil.* |
| *C24* | *Pembeli* | *Role pengguna yang membuka halaman profilnya.* |
| *C25* | *Penjual* | *Role pengguna yang membuka halaman profil beserta daftar barang miliknya.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID akun pengguna.* |
| *C29* | *Barang* | *Daftar barang milik akun yang ditampilkan pada halaman profil.* |
| *C40* | *DokumenLegal* | *Dokumen Kebijakan Privasi yang tautannya tersedia pada menu Pengaturan Akun.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC05" src="./assets/diagram/Diagram_Kelas_UC05.png" width="70%">
</p>
<p align="center">
<i>Gambar 7. Diagram Kelas Use Case UC05</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *HalamanProfil* | *dataAkun, daftarKartuProduk* | *tampilkanProfil(), tampilkanDaftarListing(), bukaPengaturanAkun(), tampilkanTautanKebijakan()* |
| *C06* | *KartuProduk* | *idBarang, judul, harga, fotoUtama, status* | *render()* |
| *C13* | *AkunController* | *-* | *getProfil(), getIdAkunDariSesi(), getDaftarBarangAkun(), getTautanDokumenLegal()* |
| *C23* | *Akun* | *idAkun, nama, nim, email* | *getDataIdentitas()* |
| *C24* | *Pembeli* | *— (diwarisi dari C23 Akun)* | *lihatProfil()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *lihatProfil()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, status* | *getByPemilik()* |
| *C40* | *DokumenLegal* | *idDokumen, jenisDokumen, tautan* | *getTautan()* |

### 5.2.6 Use Case UC06

**Nama Use Case:** *Melihat Kebijakan Privasi dan Ketentuan Penggunaan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C12* | *HalamanDokumenLegal* | *Menampilkan teks dokumen Kebijakan Privasi dan Ketentuan Penggunaan secara penuh, dengan klausa privasi percakapan ditonjolkan.* |
| *C22* | *DokumenLegalController* | *Menerima permintaan navigasi ke rute dokumen kebijakan dan mengambil naskah dokumen yang sedang berlaku.* |
| *C40* | *DokumenLegal* | *Menyimpan naskah Kebijakan Privasi dan Ketentuan Penggunaan beserta versi dan klausa pernyataan bahwa isi percakapan tidak dapat diakses admin maupun pengembang.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC06" src="./assets/diagram/Diagram_Kelas_UC06.png" width="70%">
</p>
<p align="center">
<i>Gambar 8. Diagram Kelas Use Case UC06</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C12* | *HalamanDokumenLegal* | *judul, isiDokumen* | *tampilkanDokumen(), sorotKlausaPrivasi()* |
| *C22* | *DokumenLegalController* | *-* | *getDokumen(), getKlausaPrivasi()* |
| *C40* | *DokumenLegal* | *idDokumen, jenisDokumen, judul, isi, klausaPrivasiPesan, versi, tanggalBerlaku, statusPublikasi* | *getVersiTerbaru(), getIsi()* |

### 5.2.7 Use Case UC07

**Nama Use Case:** *Membuat Listing*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C04* | *FormulirBarang* | *Menampilkan formulir pembuatan listing (judul, harga, deskripsi kondisi, dropdown kategori, lokasi COD, unggah foto), memvalidasi tipe data dan berkas foto di sisi klien, serta menandai isian wajib yang kosong.* |
| *C14* | *BarangController* | *Melakukan validasi ganda kelengkapan isian dan syarat foto di sisi server, menyimpan barang berstatus "Tersedia" beserta fotonya, dan menerbitkannya ke katalog.* |
| *C25* | *Penjual* | *Role pengguna pemilik listing yang dibuat.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual pemilik listing.* |
| *C29* | *Barang* | *Menyimpan data utama listing dengan status awal "Tersedia".* |
| *C30* | *FotoBarang* | *Menyimpan metadata berkas foto listing (maks 5 foto, JPG/PNG, ≤ 5 MB per foto).* |
| *C31* | *Kategori* | *Menyediakan daftar kategori tetap sebagai satu-satunya pilihan kategori pada formulir.* |
| *C32* | *LokasiCOD* | *Menyediakan daftar rujukan titik temu COD berbasis wilayah kampus.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC07" src="./assets/diagram/Diagram_Kelas_UC07.png" width="70%">
</p>
<p align="center">
<i>Gambar 9. Diagram Kelas Use Case UC07</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *FormulirBarang* | *judul, harga, deskripsiKondisi, idKategori, idLokasi, daftarFoto* | *tampilkanFormulir(), validasiTipeData(), validasiFotoSisiKlien(), tandaiIsianKosong(), kirimFormulir(), tampilkanNotifikasi()* |
| *C14* | *BarangController* | *-* | *buatBarang(), validasiKelengkapanIsian(), validasiFoto(), getIdPenjualDariSesi(), simpanFoto(), terbitkanKeKatalog()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *buatListing()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, deskripsiKondisi, idKategori, idLokasi, status, waktuUnggah* | *simpan()* |
| *C30* | *FotoBarang* | *idFoto, idBarang, namaBerkas, format, ukuran, urutan, pathBerkas* | *validasiFormat(), validasiUkuran(), simpan()* |
| *C31* | *Kategori* | *idKategori, namaKategori* | *getDaftarKategori(), validasiKategori()* |
| *C32* | *LokasiCOD* | *idLokasi, namaLokasi, kampus* | *getDaftarLokasi()* |

### 5.2.8 Use Case UC08

**Nama Use Case:** *Melihat Daftar Listing Milik Sendiri*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *Menampilkan dasbor "Listing Saya" yang mengelompokkan listing ke dalam tab "Tersedia" dan riwayat "Terjual".* |
| *C06* | *KartuProduk* | *Komponen kartu yang menampilkan ringkasan tiap listing beserta status aktualnya.* |
| *C14* | *BarangController* | *Mengambil seluruh barang milik ID penjual dari sesi aktif dan mengelompokkannya berdasarkan status.* |
| *C25* | *Penjual* | *Role pengguna pemilik listing yang membuka halaman ini.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual.* |
| *C29* | *Barang* | *Daftar barang milik penjual beserta status "Tersedia"/"Terjual".* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC08" src="./assets/diagram/Diagram_Kelas_UC08.png" width="70%">
</p>
<p align="center">
<i>Gambar 10. Diagram Kelas Use Case UC08</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *daftarTersedia, daftarTerjual, tabAktif* | *tampilkanDaftarListing(), pilihTab()* |
| *C06* | *KartuProduk* | *idBarang, judul, harga, fotoUtama, status* | *render()* |
| *C14* | *BarangController* | *-* | *getListingSaya(), getIdPenjualDariSesi(), kelompokkanBerdasarkanStatus()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *lihatDaftarListingSendiri()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, status, waktuUnggah* | *getByPemilik(), getRiwayatTerjual()* |

### 5.2.9 Use Case UC09

**Nama Use Case:** *Mengubah Listing*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C04* | *FormulirBarang* | *Menampilkan formulir berisi data listing saat ini untuk disunting, memvalidasi isian dan berkas foto di sisi klien, serta menandai isian wajib yang kosong.* |
| *C14* | *BarangController* | *Memverifikasi bahwa pengubah adalah pemilik listing, memvalidasi ulang isian dan foto di sisi server, lalu menyimpan perubahan listing.* |
| *C25* | *Penjual* | *Pemilik listing yang mengubah informasi maupun foto pada listing miliknya.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual untuk verifikasi kepemilikan listing.* |
| *C29* | *Barang* | *Menyediakan seluruh atribut barang untuk disunting, memvalidasi kelengkapan isian wajib, dan menyimpan perubahan ke pangkalan data.* |
| *C30* | *FotoBarang* | *Mengelola pembaruan berkas foto (validasi format dan batas ukuran) serta memastikan total foto tidak melebihi 5 berkas.* |
| *C31* | *Kategori* | *Menyediakan rujukan daftar kategori tetap dan memastikan kategori baru yang dipilih berasal dari daftar yang sah.* |
| *C32* | *LokasiCOD* | *Menyediakan daftar rujukan titik temu COD yang dapat dipilih ulang oleh penjual.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC09" src="./assets/diagram/Diagram_Kelas_UC09.png" width="70%">
</p>
<p align="center">
<i>Gambar 11. Diagram Kelas Use Case UC09</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C04* | *FormulirBarang* | *judul, harga, deskripsiKondisi, idKategori, idLokasi, daftarFoto* | *tampilkanFormulir(), validasiTipeData(), validasiFotoSisiKlien(), tandaiIsianKosong(), onClickUpdate(), tampilkanNotifikasi()* |
| *C14* | *BarangController* | *-* | *getBarang(), getIdPenjualDariSesi(), verifikasiKepemilikan(), validasiKelengkapanIsian(), validasiFoto(), updateBarang(), simpanFoto()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *ubahListing()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, deskripsiKondisi, idKategori, idLokasi, status, waktuUbah* | *setJudul(), setHarga(), setDeskripsi(), setKategori(), setLokasi(), simpan()* |
| *C30* | *FotoBarang* | *idFoto, idBarang, namaBerkas, format, ukuran, urutan, pathBerkas* | *validasiFormat(), validasiUkuran(), perbaruiGaleri(), hapus()* |
| *C31* | *Kategori* | *idKategori, namaKategori* | *getDaftarKategori(), validasiKategori()* |
| *C32* | *LokasiCOD* | *idLokasi, namaLokasi, kampus* | *getDaftarLokasi()* |

### 5.2.10 Use Case UC10

**Nama Use Case:** *Menghapus Listing*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *Menampilkan halaman "Listing Saya" beserta menu "Hapus Listing", dialog konfirmasi penghapusan, dan notifikasi hasilnya.* |
| *C14* | *BarangController* | *Memverifikasi kepemilikan listing lalu menghapus listing beserta rujukan fotonya.* |
| *C25* | *Penjual* | *Pemilik listing yang menginisiasi aksi penghapusan permanen atas listing miliknya.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual untuk verifikasi kepemilikan listing yang akan dihapus.* |
| *C29* | *Barang* | *Menghapus data listing secara permanen dari pangkalan data sistem.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC10" src="./assets/diagram/Diagram_Kelas_UC10.png" width="70%">
</p>
<p align="center">
<i>Gambar 12. Diagram Kelas Use Case UC10</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *daftarTersedia, daftarTerjual* | *tampilkanDaftarListing(), onClickHapus(), tampilkanKonfirmasi(), tampilkanNotifikasi()* |
| *C14* | *BarangController* | *-* | *getIdPenjualDariSesi(), verifikasiKepemilikan(), deleteBarang()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *hapusListing()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual* | *hapus()* |

### 5.2.11 Use Case UC11

**Nama Use Case:** *Menandai Listing Terjual*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *Menampilkan listing berstatus "Tersedia" pada halaman "Listing Saya" beserta tombol "Tandai Terjual", dialog konfirmasi, dan pemindahan kartu ke riwayat "Terjual".* |
| *C14* | *BarangController* | *Mengelola proses perubahan status barang dan menyembunyikannya dari hasil pencarian umum untuk barang dengan status terjual.* |
| *C25* | *Penjual* | *Pengguna pemilik barang yang menekan tombol aksi untuk menandai sebuah barang yang telah laku.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual untuk verifikasi kepemilikan listing.* |
| *C29* | *Barang* | *Memeriksa nilai status terkini, memperbarui status menjadi "Terjual"* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC11" src="./assets/diagram/Diagram_Kelas_UC11.png" width="70%">
</p>
<p align="center">
<i>Gambar 13. Diagram Kelas Use Case UC11</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *daftarTersedia, daftarTerjual* | *tampilkanDaftarListing(), onClickTandaiTerjual(), tampilkanKonfirmasi(), tampilkanNotifikasi()* |
| *C14* | *BarangController* | *-* | *getIdPenjualDariSesi(), verifikasiKepemilikan(), ubahStatusBarang()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *tandaiTerjual()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, status* | *getStatus(), setStatus()* |

### 5.2.12 Use Case UC12

**Nama Use Case:** *Membatalkan Penandaan Terjual*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *Menampilkan riwayat "Terjual" pada halaman "Listing Saya" beserta tombol "Batalkan Penandaan Terjual", dialog konfirmasi, dan pemindahan kartu kembali ke bagian "Tersedia".* |
| *C14* | *BarangController* | *Mengelola proses perubahan status barang dan menampilkan pada hasil pencarian umum untuk barang yang belum terjual.* |
| *C25* | *Penjual* | *Pengguna pemilik barang yang menekan tombol aksi untuk update status barang.* |
| *C28* | *SesiLogin* | *Sesi aktif yang menjadi sumber ID penjual untuk verifikasi kepemilikan listing.* |
| *C29* | *Barang* | *Memeriksa nilai status terkini dan mengembalikan status menjadi "Tersedia".* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC12" src="./assets/diagram/Diagram_Kelas_UC12.png" width="70%">
</p>
<p align="center">
<i>Gambar 14. Diagram Kelas Use Case UC12</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C03* | *HalamanListingPenjual* | *daftarTersedia, daftarTerjual* | *tampilkanDaftarListing(), onClickBatalTerjual(), tampilkanKonfirmasi(), tampilkanNotifikasi()* |
| *C14* | *BarangController* | *-* | *getIdPenjualDariSesi(), verifikasiKepemilikan(), ubahStatusBarang()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *batalkanTandaTerjual()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, status* | *getStatus(), setStatus()* |

### 5.2.13 Use Case UC13

**Nama Use Case:** *Melihat Katalog Listing*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C05* | *HalamanKatalog* | *Antarmuka utama untuk menampilkan katalog barang maksimum 20 listing per halaman beserta navigasi antarhalaman.* |
| *C06* | *KartuProduk* | *Antarmuka untuk satuan barang yang ada di dalam halaman katalog.* |
| *C15* | *KatalogController* | *Mengambil listing berstatus "Tersedia" milik akun yang tidak diblokir dan membaginya per halaman.* |
| *C29* | *Barang* | *Data barang yang akan ditunjukkan, barang dengan status terjual tidak ditampilkan.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC13" src="./assets/diagram/Diagram_Kelas_UC13.png" width="70%">
</p>
<p align="center">
<i>Gambar 15. Diagram Kelas Use Case UC13</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C05* | *HalamanKatalog* | *listProduk, halamanAktif* | *showKatalog(), pindahHalaman()* |
| *C06* | *KartuProduk* | *idBarang, judul, harga, fotoUtama, status* | *render()* |
| *C15* | *KatalogController* | *-* | *getProduk(), paginasi()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, status, waktuUnggah* | *getJudul(), getHarga(), getStatus()* |

### 5.2.14 Use Case UC14

**Nama Use Case:** *Mencari dan Menyaring Listing*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C05* | *HalamanKatalog* | *Antarmuka katalog yang menyediakan kolom pencarian, filter, pilihan pengurutan, navigasi halaman, dan pesan barang tidak ditemukan.* |
| *C06* | *KartuProduk* | *Antarmuka untuk satuan barang yang ada di dalam halaman katalog.* |
| *C15* | *KatalogController* | *Menggabungkan hasil pencarian dan filter, mengurutkannya, lalu membaginya per halaman.* |
| *C16* | *PencarianController* | *Mengatur pencarian barang berdasarkan kata kunci.* |
| *C17* | *FilterController* | *Mengatur pencarian barang berdasarkan harga, kategori, dan lokasi COD.* |
| *C29* | *Barang* | *Data barang yang akan ditunjukkan, barang dengan status terjual tidak ditampilkan.* |
| *C31* | *Kategori* | *Entitas referensi yang menyimpan klasifikasi atau jenis barang yang digunakan pada katalog, input barang, pencarian, dan filter.* |
| *C32* | *LokasiCOD* | *Entitas referensi yang menyimpan daftar titik temu COD yang tersedia pada lingkungan multikampus, memungkinkan filter terhadap lokasi COD.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC14" src="./assets/diagram/Diagram_Kelas_UC14.png" width="70%">
</p>
<p align="center">
<i>Gambar 16. Diagram Kelas Use Case UC14</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C05* | *HalamanKatalog* | *listProduk, kataKunci, filterAktif, kriteriaUrutan, halamanAktif* | *inputPencarian(), pilihFilter(), pilihUrutan(), tampilkanHasil(), pindahHalaman(), tampilkanPesanKosong()* |
| *C06* | *KartuProduk* | *idBarang, judul, harga, fotoUtama, status* | *render()* |
| *C15* | *KatalogController* | *-* | *getProduk(), paginasi(), urutkanHasil()* |
| *C16* | *PencarianController* | *-* | *cariBarang(), normalisasiKataKunci(), cocokkanKataKunci()* |
| *C17* | *FilterController* | *-* | *validasiParameterFilter(), filterCategory(), filterPrice(), filterLocation()* |
| *C29* | *Barang* | *idBarang, judul, harga, deskripsiKondisi, idKategori, idLokasi, status, waktuUnggah* | *getJudul(), getHarga(), getDeskripsi(), getStatus()* |
| *C31* | *Kategori* | *idKategori, namaKategori* | *getDaftarKategori(), getKategori()* |
| *C32* | *LokasiCOD* | *idLokasi, namaLokasi, kampus* | *getDaftarLokasi(), getLokasi()* |

### 5.2.15 Use Case UC15

**Nama Use Case:** *Melihat Detail Katalog*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *Menampilkan seluruh foto, judul, harga, deskripsi kondisi, kategori, lokasi COD, dan identitas penjual dari sebuah listing.* |
| *C14* | *BarangController* | *Menyediakan data suatu barang dari entitiy class barang ke antarmuka.* |
| *C25* | *Penjual* | *Pemilik listing yang identitasnya ditampilkan pada halaman detail.* |
| *C29* | *Barang* | *Menyediakan data lengkap suatu barang.* |
| *C30* | *FotoBarang* | *Menyediakan galeri foto untuk ditampilkan di halaman detail.* |
| *C31* | *Kategori* | *Menyediakan rujukan kategori pada barang.* |
| *C32* | *LokasiCOD* | *Menyediakan rujukan lokasi titik temu.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC15" src="./assets/diagram/Diagram_Kelas_UC15.png" width="70%">
</p>
<p align="center">
<i>Gambar 17. Diagram Kelas Use Case UC15</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *barang, daftarFoto* | *showBarang()* |
| *C14* | *BarangController* | *-* | *getBarang()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *-* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, harga, deskripsiKondisi, idKategori, idLokasi, status* | *getJudul(), getHarga(), getDeskripsi(), getStatus()* |
| *C30* | *FotoBarang* | *idFoto, idBarang, urutan, pathBerkas* | *getGambar()* |
| *C31* | *Kategori* | *idKategori, namaKategori* | *getKategori()* |
| *C32* | *LokasiCOD* | *idLokasi, namaLokasi, kampus* | *getLokasi()* |

### 5.2.16 Use Case UC16

**Nama Use Case:** *Menghubungi Penjual*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *Menampilkan detail listing beserta tombol "Hubungi Penjual".* |
| *C08* | *HalamanPercakapan* | *Membuka ruang percakapan untuk listing tersebut lengkap dengan tautan Kebijakan Privasi.* |
| *C18* | *PercakapanController* | *Memastikan akun penjual tidak diblokir, membuat atau membuka ruang percakapan, dan memastikan hanya kedua peserta yang dapat mengaksesnya.* |
| *C24* | *Pembeli* | *Pengguna yang berinisiatif memulai negosiasi dengan menekan tombol hubungi penjual.* |
| *C25* | *Penjual* | *Identitas akun pemilik listing yang statusnya dipastikan aktif (tidak diblokir) sebelum obrolan dibuka.* |
| *C28* | *SesiLogin* | *Memverifikasi identitas pengguna yang membuka ruang percakapan.* |
| *C29* | *Barang* | *Listing yang menjadi rujukan ruang percakapan.* |
| *C33* | *Percakapan* | *Ruang percakapan yang menghubungkan tepat satu pembeli, satu penjual, dan satu listing.* |
| *C34* | *Pesan* | *Riwayat pesan terenkripsi yang ditampilkan saat ruang percakapan dibuka.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC16" src="./assets/diagram/Diagram_Kelas_UC16.png" width="70%">
</p>
<p align="center">
<i>Gambar 18. Diagram Kelas Use Case UC16</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *barang, kontakPenjual* | *showBarang(), onClickContact()* |
| *C08* | *HalamanPercakapan* | *percakapanAktif* | *bukaPercakapan(), showPercakapan(), tampilkanTautanKebijakan()* |
| *C18* | *PercakapanController* | *-* | *verifikasiPeserta(), mulaiPercakapan(), dekripsiPesan()* |
| *C24* | *Pembeli* | *— (diwarisi dari C23 Akun)* | *mulaiPercakapan(), kirimPesan()* |
| *C25* | *Penjual* | *— (diwarisi dari C23 Akun)* | *kirimPesan()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token, statusAktif* | *verifikasiAkses()* |
| *C29* | *Barang* | *idBarang, idPenjual* | *-* |
| *C33* | *Percakapan* | *idPercakapan, idPembeli, idPenjual, idBarang, waktuDibuat* | *simpan(), cekPeserta(), getDaftarPesan()* |
| *C34* | *Pesan* | *idPesan, idPercakapan, idPengirim, isiPesanTerenkripsi, waktuKirim* | *getIsiPesan()* |

### 5.2.17 Use Case UC17

**Nama Use Case:** *Mengirim Pesan dalam Percakapan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C08* | *HalamanPercakapan* | *Menampilkan antarmuka ruang percakapan, kolom input teks, tombol kirim, dan merender gelembung pesan secara berurutan.* |
| *C09* | *PanelNotifikasi* | *Menampilkan indikator atau badge pesan baru yang belum dibaca kepada pihak penerima.* |
| *C18* | *PercakapanController* | *Mengelola alur pengiriman pesan, memvalidasi sesi pengguna, mengenkripsi isi pesan, dan menyimpan entitas pesan ke dalam basis data.* |
| *C19* | *NotifikasiController* | *Membuat notifikasi pesan baru untuk penerima, mengirimkannya sebagai notifikasi push saat aplikasi tidak dibuka, dan memperbarui status baca.* |
| *C23* | *Akun* | *Akun pengirim pesan dan penerima notifikasi pesan baru.* |
| *C28* | *SesiLogin* | *Digunakan untuk memvalidasi identitas pengirim pesan (penjual/pembeli) agar sesuai dengan partisipan percakapan.* |
| *C33* | *Percakapan* | *Entitas yang menyimpan status ruang percakapan tempat pesan tersebut dikirimkan.* |
| *C34* | *Pesan* | *Entitas yang menyimpan isi teks pesan, cap waktu (timestamp), dan status keterbacaan pesan.* |
| *C35* | *Notifikasi* | *Menyimpan data pemberitahuan terkait pesan baru untuk ditampilkan pada antarmuka penerima.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC17" src="./assets/diagram/Diagram_Kelas_UC17.png" width="70%">
</p>
<p align="center">
<i>Gambar 19. Diagram Kelas Use Case UC17</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C08* | *HalamanPercakapan* | *percakapanAktif, isiTeksInput* | *showPercakapan(), kirimPesan(), tampilkanUrutanPesan(), tampilkanTautanKebijakan()* |
| *C09* | *PanelNotifikasi* | *daftarNotifikasi, jumlahBelumDibaca* | *tampilkanDaftarNotifikasi(), tampilkanPenandaBelumDibaca(), tandaiSudahDibaca()* |
| *C18* | *PercakapanController* | *-* | *verifikasiPeserta(), enkripsiPesan(), kirimPesan(), perbaruiWaktuPercakapan()* |
| *C19* | *NotifikasiController* | *-* | *kirimNotifikasi(), kirimPushNotifikasi(), perbaruiStatusBaca()* |
| *C23* | *Akun* | *idAkun, nama* | *getDataIdentitas()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token, statusAktif* | *verifikasiAkses()* |
| *C33* | *Percakapan* | *idPercakapan, idPembeli, idPenjual, waktuPembaruanTerakhir* | *cekPeserta(), addPesan(), perbaruiWaktuTerakhir()* |
| *C34* | *Pesan* | *idPesan, idPercakapan, idPengirim, isiPesanTerenkripsi, waktuKirim, statusBaca* | *simpanPesan(), updateStatusBaca()* |
| *C35* | *Notifikasi* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan(), tandaiDibaca()* |

### 5.2.18 Use Case UC18

**Nama Use Case:** *Melihat Daftar Percakapan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C08* | *HalamanPercakapan* | *Menampilkan daftar seluruh percakapan yang dimiliki pengguna beserta cuplikan pesan terakhir dan jumlah pesan belum dibaca.* |
| *C18* | *PercakapanController* | *Mengambil data daftar percakapan milik pengguna yang sedang login dari basis data dan mengurutkannya berdasarkan pesan terbaru.* |
| *C28* | *SesiLogin* | *Memastikan hanya pengguna yang sah yang dapat melihat daftar percakapannya sendiri.* |
| *C33* | *Percakapan* | *Entitas referensi yang menyediakan data percakapan (lawan bicara dan waktu terakhir aktif).* |
| *C34* | *Pesan* | *Menyediakan data teks pesan terakhir (cuplikan) untuk ditampilkan pada daftar percakapan.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC18" src="./assets/diagram/Diagram_Kelas_UC18.png" width="70%">
</p>
<p align="center">
<i>Gambar 20. Diagram Kelas Use Case UC18</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C08* | *HalamanPercakapan* | *daftarPercakapan* | *showDaftarPercakapan(), bukaPercakapan()* |
| *C18* | *PercakapanController* | *-* | *verifikasiPeserta(), getDaftarPercakapan(), ambilCuplikanPesanTerakhir(), dekripsiPesan(), hitungPesanBelumDibaca()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token, statusAktif* | *verifikasiAkses()* |
| *C33* | *Percakapan* | *idPercakapan, idPembeli, idPenjual, waktuPembaruanTerakhir* | *getDaftarPercakapanByPengguna(), getLawanBicara(), cekPeserta()* |
| *C34* | *Pesan* | *idPesan, idPercakapan, isiPesanTerenkripsi, statusBaca* | *getCuplikanPesanTerakhir(), hitungPesanBelumDibaca()* |

### 5.2.19 Use Case UC19

**Nama Use Case:** *Mengirimkan Laporan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *Menyediakan tombol "Laporkan" pada halaman detail listing sebagai salah satu titik masuk pelaporan.* |
| *C10* | *FormulirLaporan* | *Antarmuka bagi pengguna (penjual/pembeli) untuk memilih kategori laporan, mengisi alasan, dan mengunggah tangkapan layar.* |
| *C20* | *LaporanController* | *Memvalidasi isian dan bukti, menyusun laporan percakapan hanya dari ID percakapan, waktu, dan identitas pelapor, menyimpan laporan berstatus "Baru", serta mencatat penerimaannya ke log audit.* |
| *C23* | *Akun* | *Akun pelapor yang identitasnya dicatat pada laporan.* |
| *C28* | *SesiLogin* | *Mengidentifikasi identitas pelapor berdasarkan sesi aktif.* |
| *C29* | *Barang* | *Listing yang dapat menjadi objek laporan.* |
| *C33* | *Percakapan* | *Percakapan yang dapat menjadi objek laporan; hanya ID-nya yang dicatat, tanpa isi pesan.* |
| *C36* | *Laporan* | *Entitas yang menyimpan rincian aduan, objek yang dilaporkan (listing/akun/percakapan), dan status penanganan.* |
| *C37* | *BuktiLaporan* | *Entitas yang menyimpan metadata gambar tangkapan layar yang diunggah pelapor.* |
| *C38* | *LogAudit* | *Mencatat aktivitas penerimaan laporan baru oleh sistem sebagai rekam jejak permanen yang tidak dapat dihapus.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC19" src="./assets/diagram/Diagram_Kelas_UC19.png" width="70%">
</p>
<p align="center">
<i>Gambar 21. Diagram Kelas Use Case UC19</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C07* | *HalamanDetailBarang* | *barang* | *onClickLapor()* |
| *C10* | *FormulirLaporan* | *jenisPelanggaran, teksAlasan, objekDilaporkan, berkasBukti* | *tampilkanFormulirLaporan(), unggahBukti(), kirimLaporan()* |
| *C20* | *LaporanController* | *-* | *buatLaporan(), getIdPelaporDariSesi(), validasiDataLaporan(), susunMetadataPercakapan(), validasiBukti(), simpanBukti(), simpanLaporan(), catatLogAudit()* |
| *C23* | *Akun* | *idAkun, nama* | *getDataIdentitas()* |
| *C28* | *SesiLogin* | *idSesi, idAkun, token* | *getIdAkun()* |
| *C29* | *Barang* | *idBarang* | *-* |
| *C33* | *Percakapan* | *idPercakapan* | *-* |
| *C36* | *Laporan* | *idLaporan, idPelapor, objekDilaporkan, jenisPelanggaran, teksAlasan, waktuLapor, statusPenanganan* | *simpanLaporanBaru()* |
| *C37* | *BuktiLaporan* | *idBukti, idLaporan, namaBerkas, pathBerkas* | *validasiLampiranWajib(), simpan()* |
| *C38* | *LogAudit* | *idLog, idLaporan, waktu, identitasAktor, tindakan* | *catatPenerimaanLaporan()* |

### 5.2.20 Use Case UC20

**Nama Use Case:** *Melihat dan Menyaring Daftar Laporan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *Menampilkan antarmuka tabel daftar laporan beserta fungsi filter (Baru, Diproses, Selesai) khusus untuk Admin.* |
| *C21* | *ModerasiController* | *Mengelola kueri pengambilan data laporan dari basis data, menerapkan penyaringan, dan memastikan pengakses memiliki role Admin.* |
| *C26* | *Admin* | *Entitas otorisasi yang memvalidasi bahwa sesi saat ini memiliki hak akses level administrator.* |
| *C36* | *Laporan* | *Menyediakan data entitas laporan (kategori, status, pelapor) untuk disajikan pada data table Dasbor Admin.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC20" src="./assets/diagram/Diagram_Kelas_UC20.png" width="70%">
</p>
<p align="center">
<i>Gambar 22. Diagram Kelas Use Case UC20</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *daftarLaporan, filterStatus* | *tampilkanDaftarLaporan(), filterLaporan(), tampilkanDetailLaporan()* |
| *C21* | *ModerasiController* | *-* | *otorisasiAdmin(), getAllLaporan(), filterByStatus()* |
| *C26* | *Admin* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), aksesDaftarLaporan()* |
| *C36* | *Laporan* | *idLaporan, idPelapor, objekDilaporkan, jenisPelanggaran, waktuLapor, statusPenanganan* | *getAllLaporan(), filterByStatus()* |

### 5.2.21 Use Case UC21

**Nama Use Case:** *Mengubah Status Penanganan Laporan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *Menyediakan tombol aksi (dropdown atau button) bagi Admin untuk mengubah status laporan (misal: "Baru" menjadi "Diproses").* |
| *C21* | *ModerasiController* | *Menangani permintaan perubahan status dari view, memvalidasi perubahan, dan memperbarui entitas laporan.* |
| *C26* | *Admin* | *Peran admin yang diverifikasi sebelum status penanganan laporan diubah.* |
| *C36* | *Laporan* | *Entitas yang atribut status penanganannya diperbarui oleh sistem.* |
| *C38* | *LogAudit* | *Mencatat rekam jejak bahwa Admin tertentu telah mengubah status pada laporan tertentu.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC21" src="./assets/diagram/Diagram_Kelas_UC21.png" width="70%">
</p>
<p align="center">
<i>Gambar 23. Diagram Kelas Use Case UC21</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *detailLaporan, statusBaru* | *tampilkanDetailLaporan(), onClickUbahStatus()* |
| *C21* | *ModerasiController* | *-* | *otorisasiAdmin(), getDetailLaporan(), ubahStatusLaporan(), catatLogAudit()* |
| *C26* | *Admin* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), tinjauLaporan(), ubahStatusLaporan()* |
| *C36* | *Laporan* | *idLaporan, statusPenanganan, waktuPerubahan* | *getDetailLaporan(), updateStatusPenanganan()* |
| *C38* | *LogAudit* | *idLog, idLaporan, waktu, identitasAktor, tindakan* | *catatPerubahanStatusLaporan()* |

### 5.2.22 Use Case UC22

**Nama Use Case:** *Menghapus Listing yang Dilaporkan*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *Antarmuka bagi Admin untuk mengeksekusi penghapusan listing dengan menyertakan input alasan penghapusan.* |
| *C19* | *NotifikasiController* | *Mengelola pengiriman pesan pemberitahuan in-app atau surel kepada penjual pemilik listing terkait alasan penghapusan.* |
| *C21* | *ModerasiController* | *Mengeksekusi logika penghapusan (mengubah status listing menjadi dihapus), mendelegasikan pengiriman notifikasi, dan mencatat log.* |
| *C26* | *Admin* | *Admin pelaku penghapusan listing yang tercatat pada log admin.* |
| *C29* | *Barang* | *Entitas listing yang atribut status ketersediaannya diubah (dihapus/dinonaktifkan) dari katalog.* |
| *C35* | *Notifikasi* | *Entitas yang menyimpan data pesan penalti/pemberitahuan untuk pengguna.* |
| *C38* | *LogAudit* | *Mencatat tindak lanjut penghapusan listing atas laporan pada catatan audit yang tidak dapat diubah maupun dihapus.* |
| *C39* | *LogAdmin* | *Menyimpan catatan operasional spesifik bahwa admin melakukan tindakan "Hapus Listing".* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC22" src="./assets/diagram/Diagram_Kelas_UC22.png" width="70%">
</p>
<p align="center">
<i>Gambar 24. Diagram Kelas Use Case UC22</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *detailLaporan, alasanTindakan* | *tampilkanDetailLaporan(), onClickHapusListing(), tampilkanModalKonfirmasi()* |
| *C19* | *NotifikasiController* | *-* | *kirimPeringatanPenghapusan()* |
| *C21* | *ModerasiController* | *-* | *otorisasiAdmin(), hapusListingDilaporkan(), catatLogAdmin(), catatLogAudit()* |
| *C26* | *Admin* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), hapusListing()* |
| *C29* | *Barang* | *idBarang, idPenjual, judul, status* | *hapus()* |
| *C35* | *Notifikasi* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan()* |
| *C38* | *LogAudit* | *idLog, idLaporan, waktu, identitasAktor, tindakan* | *catatPenghapusanListing()* |
| *C39* | *LogAdmin* | *idLogAdmin, idAdmin, jenisTindakan, objekDitindak, waktu, alasan* | *catatTindakan()* |

### 5.2.23 Use Case UC23

**Nama Use Case:** *Memblokir Akun Pengguna*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *Antarmuka bagi Admin untuk menekan tombol "Blokir Akun", mengisi alasan pelanggaran, dan menampilkan status akun terkini.* |
| *C19* | *NotifikasiController* | *Mengirimkan pemberitahuan administratif ke surel pengguna bahwa akunnya telah ditangguhkan beserta alasannya.* |
| *C21* | *ModerasiController* | *Mengubah status akun pengguna menjadi "Diblokir", menonaktifkan seluruh listing miliknya secara iteratif, dan mencatat aktivitas.* |
| *C23* | *Akun* | *Entitas yang atribut statusnya berubah dari "Aktif" menjadi "Diblokir".* |
| *C26* | *Admin* | *Admin pelaku pemblokiran akun yang tercatat pada log admin.* |
| *C29* | *Barang* | *Seluruh listing milik akun yang diblokir akan disembunyikan (cascade effect status ketersediaan).* |
| *C35* | *Notifikasi* | *Menyimpan pemberitahuan penangguhan akun beserta alasannya untuk pengguna yang diblokir.* |
| *C38* | *LogAudit* | *Mencatat aktivitas pemblokiran pada catatan audit.* |
| *C39* | *LogAdmin* | *Mencatat aktivitas admin yang melakukan pemblokiran dalam log admin* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC23" src="./assets/diagram/Diagram_Kelas_UC23.png" width="70%">
</p>
<p align="center">
<i>Gambar 25. Diagram Kelas Use Case UC23</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *detailLaporan, alasanTindakan* | *onClickBlokirAkun(), tampilkanModalKonfirmasi()* |
| *C19* | *NotifikasiController* | *-* | *kirimPesanPenangguhan()* |
| *C21* | *ModerasiController* | *-* | *otorisasiAdmin(), blokirAkun(), nonaktifkanListingPengguna(), catatLogAdmin(), catatLogAudit()* |
| *C23* | *Akun* | *idAkun, statusBlokir* | *blokir()* |
| *C26* | *Admin* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), eksekusiBlokirAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, status* | *nonaktifkanByPemilik()* |
| *C35* | *Notifikasi* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan()* |
| *C38* | *LogAudit* | *idLog, idLaporan, waktu, identitasAktor, tindakan* | *catatPemblokiranAkun()* |
| *C39* | *LogAdmin* | *idLogAdmin, idAdmin, jenisTindakan, objekDitindak, waktu, alasan* | *catatTindakan()* |

### 5.2.24 Use Case UC24

**Nama Use Case:** *Membuka Blokir Akun Pengguna*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *Antarmuka profil pengguna di panel admin yang menampilkan opsi pemulihan/membuka blokir (unban).* |
| *C21* | *ModerasiController* | *Memulihkan status entitas akun agar pengguna dapat melakukan autentikasi (login) kembali ke dalam sistem.* |
| *C23* | *Akun* | *Entitas yang status blokirnya dikembalikan sehingga pengguna dapat masuk kembali.* |
| *C26* | *Admin* | *Admin pelaku pembukaan blokir akun yang tercatat pada log admin.* |
| *C29* | *Barang* | *Mengembalikan visibilitas listing barang milik pengguna yang sebelumnya disembunyikan akibat pemblokiran.* |
| *C39* | *LogAdmin* | *Entitas yang mencatat rekam aktivitas bahwa Admin telah mencabut status blokir dari suatu entitas akun.* |

#### Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC24" src="./assets/diagram/Diagram_Kelas_UC24.png" width="70%">
</p>
<p align="center">
<i>Gambar 26. Diagram Kelas Use Case UC24</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C11* | *DasborAdmin* | *detailLaporan* | *onClickBukaBlokir(), tampilkanModalKonfirmasi()* |
| *C21* | *ModerasiController* | *-* | *otorisasiAdmin(), bukaBlokirAkun(), pulihkanListingPengguna(), catatLogAdmin()* |
| *C23* | *Akun* | *idAkun, statusBlokir* | *bukaBlokir()* |
| *C26* | *Admin* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), cabutBlokirAkun()* |
| *C29* | *Barang* | *idBarang, idPenjual, status* | *pulihkanKatalog()* |
| *C39* | *LogAdmin* | *idLogAdmin, idAdmin, jenisTindakan, objekDitindak, waktu, alasan* | *catatTindakan()* |

## 5.3 Diagram Kelas Keseluruhan
Diagram kelas keseluruhan merupakan gabungan dari seluruh diagram kelas per use case pada 5.2. Setiap kelas hanya digambarkan satu kali, dan atribut serta metodenya merupakan gabungan (*union*) dari seluruh kemunculannya pada 5.2. Dengan demikian, setiap atribut, metode, dan relasi pada diagram ini muncul pada sekurang-kurangnya satu diagram per use case, dan sebaliknya tidak ada atribut, metode, atau relasi pada 5.2 yang tidak tercantum di sini. Penomoran kelas mengikuti 5.1 (C01–C40).

Diagram disusun mengikuti pola tiga lapis **boundary–control–entity**:

- **Boundary (C01–C12)**, kolom kiri: kelas antarmuka yang menerima aksi pengguna dan menampilkan hasil. Berasosiasi searah ke kelas control.
- **Control (C13–C22)**, kolom tengah: kelas pengendali yang memuat logika proses, validasi, dan orkestrasi. Bergantung («use») pada kelas entity dan, bila perlu, pada *C19 NotifikasiController*.
- **Entity (C23–C40)**, kolom kanan: kelas data yang menyimpan keadaan sistem secara persisten. Hanya kelas entity yang saling berasosiasi dengan multiplisitas, komposisi, dan generalisasi.

Sama seperti pada 5.2, setiap kotak kelas hanya memuat ID dan nama kelas. Atribut dan metode lengkap setiap kelas tercantum pada tabel Atribut dan Metode Seluruh Kelas di bawah diagram.

<p align="center">
<img alt="Diagram Kelas Keseluruhan" src="./assets/diagram/Diagram_Kelas_Keseluruhan.png" width="100%">
</p>
<p align="center">
<i>Gambar 27. Diagram Kelas Keseluruhan</i>
</p>
<br>

### Atribut dan Metode Seluruh Kelas

| ID Kelas | Nama Kelas | Stereotipe | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- | :--- |
| *C01* | *HalamanOtentikasi* | *boundary* | *nama, nim, email, kataSandi, setujuKebijakan, kodeVerifikasi, sisaWaktu, token* | *tampilkanFormulirPendaftaran(), tampilkanKebijakanPrivasi(), kirimFormulirPendaftaran(), arahkanKeHalamanVerifikasi(), tampilkanFormulirVerifikasi(), kirimKodeVerifikasi(), mintaKirimUlang(), resetHitungMundur(), tampilkanFormulirLogin(), kirimFormulirLogin(), arahkanKeBeranda(), tampilkanTombolKeluar(), kirimPermintaanLogout(), hapusTokenLokal(), arahkanKeHalamanLogin(), tampilkanPesanGalat()* |
| *C02* | *HalamanProfil* | *boundary* | *dataAkun, daftarKartuProduk* | *tampilkanProfil(), tampilkanDaftarListing(), bukaPengaturanAkun(), tampilkanTautanKebijakan()* |
| *C03* | *HalamanListingPenjual* | *boundary* | *daftarTersedia, daftarTerjual, tabAktif* | *tampilkanDaftarListing(), pilihTab(), onClickHapus(), onClickTandaiTerjual(), onClickBatalTerjual(), tampilkanKonfirmasi(), tampilkanNotifikasi()* |
| *C04* | *FormulirBarang* | *boundary* | *judul, harga, deskripsiKondisi, idKategori, idLokasi, daftarFoto* | *tampilkanFormulir(), validasiTipeData(), validasiFotoSisiKlien(), tandaiIsianKosong(), kirimFormulir(), onClickUpdate(), tampilkanNotifikasi()* |
| *C05* | *HalamanKatalog* | *boundary* | *listProduk, kataKunci, filterAktif, kriteriaUrutan, halamanAktif* | *showKatalog(), inputPencarian(), pilihFilter(), pilihUrutan(), tampilkanHasil(), pindahHalaman(), tampilkanPesanKosong()* |
| *C06* | *KartuProduk* | *boundary* | *idBarang, judul, harga, fotoUtama, status* | *render()* |
| *C07* | *HalamanDetailBarang* | *boundary* | *barang, daftarFoto, kontakPenjual* | *showBarang(), onClickContact(), onClickLapor()* |
| *C08* | *HalamanPercakapan* | *boundary* | *daftarPercakapan, percakapanAktif, isiTeksInput* | *showDaftarPercakapan(), bukaPercakapan(), showPercakapan(), tampilkanUrutanPesan(), kirimPesan(), tampilkanTautanKebijakan()* |
| *C09* | *PanelNotifikasi* | *boundary* | *daftarNotifikasi, jumlahBelumDibaca* | *tampilkanDaftarNotifikasi(), tampilkanPenandaBelumDibaca(), tandaiSudahDibaca()* |
| *C10* | *FormulirLaporan* | *boundary* | *jenisPelanggaran, teksAlasan, objekDilaporkan, berkasBukti* | *tampilkanFormulirLaporan(), unggahBukti(), kirimLaporan()* |
| *C11* | *DasborAdmin* | *boundary* | *daftarLaporan, filterStatus, detailLaporan, statusBaru, alasanTindakan* | *tampilkanDaftarLaporan(), filterLaporan(), tampilkanDetailLaporan(), onClickUbahStatus(), onClickHapusListing(), onClickBlokirAkun(), onClickBukaBlokir(), tampilkanModalKonfirmasi()* |
| *C12* | *HalamanDokumenLegal* | *boundary* | *judul, isiDokumen* | *tampilkanDokumen(), sorotKlausaPrivasi()* |
| *C13* | *AkunController* | *control* | *-* | *daftarAkun(), validasiKelengkapanFormulir(), validasiDomainEmail(), cekKeunikanEmail(), hashKataSandi(), buatKodeVerifikasi(), getTautanDokumenLegal(), verifikasiAkun(), validasiKodeVerifikasi(), cekKedaluwarsaKode(), hanguskanKodeLama(), kirimUlangKode(), login(), cariAkunByEmail(), verifikasiKataSandi(), cekStatusAkun(), buatSesiLogin(), logout(), cabutSesi(), getProfil(), getIdAkunDariSesi(), getDaftarBarangAkun()* |
| *C14* | *BarangController* | *control* | *-* | *buatBarang(), validasiKelengkapanIsian(), validasiFoto(), getIdPenjualDariSesi(), simpanFoto(), terbitkanKeKatalog(), getListingSaya(), kelompokkanBerdasarkanStatus(), getBarang(), verifikasiKepemilikan(), updateBarang(), deleteBarang(), ubahStatusBarang()* |
| *C15* | *KatalogController* | *control* | *-* | *getProduk(), paginasi(), urutkanHasil()* |
| *C16* | *PencarianController* | *control* | *-* | *cariBarang(), normalisasiKataKunci(), cocokkanKataKunci()* |
| *C17* | *FilterController* | *control* | *-* | *validasiParameterFilter(), filterCategory(), filterPrice(), filterLocation()* |
| *C18* | *PercakapanController* | *control* | *-* | *verifikasiPeserta(), mulaiPercakapan(), dekripsiPesan(), enkripsiPesan(), kirimPesan(), perbaruiWaktuPercakapan(), getDaftarPercakapan(), ambilCuplikanPesanTerakhir(), hitungPesanBelumDibaca()* |
| *C19* | *NotifikasiController* | *control* | *-* | *kirimEmailVerifikasi(), kirimNotifikasi(), kirimPushNotifikasi(), perbaruiStatusBaca(), kirimPeringatanPenghapusan(), kirimPesanPenangguhan()* |
| *C20* | *LaporanController* | *control* | *-* | *buatLaporan(), getIdPelaporDariSesi(), validasiDataLaporan(), susunMetadataPercakapan(), validasiBukti(), simpanBukti(), simpanLaporan(), catatLogAudit()* |
| *C21* | *ModerasiController* | *control* | *-* | *otorisasiAdmin(), getAllLaporan(), filterByStatus(), getDetailLaporan(), ubahStatusLaporan(), hapusListingDilaporkan(), blokirAkun(), nonaktifkanListingPengguna(), bukaBlokirAkun(), pulihkanListingPengguna(), catatLogAdmin(), catatLogAudit()* |
| *C22* | *DokumenLegalController* | *control* | *-* | *getDokumen(), getKlausaPrivasi()* |
| *C23* | *Akun* | *entity* | *idAkun, nama, nim, email, kataSandiHash, statusAkun, statusBlokir, peran, setujuKebijakan, waktuDaftar* | *simpan(), perbaruiStatusAkun(), getStatusAkun(), getDataIdentitas(), blokir(), bukaBlokir()* |
| *C24* | *Pembeli* | *entity* | *— (diwarisi dari C23 Akun)* | *lihatProfil(), mulaiPercakapan(), kirimPesan()* |
| *C25* | *Penjual* | *entity* | *— (diwarisi dari C23 Akun)* | *lihatProfil(), buatListing(), lihatDaftarListingSendiri(), ubahListing(), hapusListing(), tandaiTerjual(), batalkanTandaTerjual(), kirimPesan()* |
| *C26* | *Admin* | *entity* | *— (diwarisi dari C23 Akun)* | *verifikasiPeran(), aksesDaftarLaporan(), tinjauLaporan(), ubahStatusLaporan(), hapusListing(), eksekusiBlokirAkun(), cabutBlokirAkun()* |
| *C27* | *TokenVerifikasi* | *entity* | *idToken, idAkun, kode, waktuBuat, waktuKedaluwarsa, statusPakai* | *simpan(), cocokkanKode(), sudahKedaluwarsa(), tandaiHangus(), tandaiTerpakai()* |
| *C28* | *SesiLogin* | *entity* | *idSesi, idAkun, token, waktuMulai, waktuKedaluwarsa, statusAktif* | *buatToken(), simpan(), nonaktifkan(), hapus(), getIdAkun(), verifikasiAkses()* |
| *C29* | *Barang* | *entity* | *idBarang, idPenjual, judul, harga, deskripsiKondisi, idKategori, idLokasi, status, waktuUnggah, waktuUbah* | *simpan(), getByPemilik(), getRiwayatTerjual(), setJudul(), setHarga(), setDeskripsi(), setKategori(), setLokasi(), hapus(), getStatus(), setStatus(), getJudul(), getHarga(), getDeskripsi(), nonaktifkanByPemilik(), pulihkanKatalog()* |
| *C30* | *FotoBarang* | *entity* | *idFoto, idBarang, namaBerkas, format, ukuran, urutan, pathBerkas* | *validasiFormat(), validasiUkuran(), simpan(), perbaruiGaleri(), hapus(), getGambar()* |
| *C31* | *Kategori* | *entity* | *idKategori, namaKategori* | *getDaftarKategori(), validasiKategori(), getKategori()* |
| *C32* | *LokasiCOD* | *entity* | *idLokasi, namaLokasi, kampus* | *getDaftarLokasi(), getLokasi()* |
| *C33* | *Percakapan* | *entity* | *idPercakapan, idPembeli, idPenjual, idBarang, waktuDibuat, waktuPembaruanTerakhir* | *simpan(), cekPeserta(), getDaftarPesan(), addPesan(), perbaruiWaktuTerakhir(), getDaftarPercakapanByPengguna(), getLawanBicara()* |
| *C34* | *Pesan* | *entity* | *idPesan, idPercakapan, idPengirim, isiPesanTerenkripsi, waktuKirim, statusBaca* | *getIsiPesan(), simpanPesan(), updateStatusBaca(), getCuplikanPesanTerakhir(), hitungPesanBelumDibaca()* |
| *C35* | *Notifikasi* | *entity* | *idNotifikasi, idAkun, jenis, isi, waktuKirim, statusBaca* | *simpan(), tandaiDibaca()* |
| *C36* | *Laporan* | *entity* | *idLaporan, idPelapor, objekDilaporkan, jenisPelanggaran, teksAlasan, waktuLapor, statusPenanganan, waktuPerubahan* | *simpanLaporanBaru(), getAllLaporan(), filterByStatus(), getDetailLaporan(), updateStatusPenanganan()* |
| *C37* | *BuktiLaporan* | *entity* | *idBukti, idLaporan, namaBerkas, pathBerkas* | *validasiLampiranWajib(), simpan()* |
| *C38* | *LogAudit* | *entity* | *idLog, idLaporan, waktu, identitasAktor, tindakan* | *catatPenerimaanLaporan(), catatPerubahanStatusLaporan(), catatPenghapusanListing(), catatPemblokiranAkun()* |
| *C39* | *LogAdmin* | *entity* | *idLogAdmin, idAdmin, jenisTindakan, objekDitindak, waktu, alasan* | *catatTindakan()* |
| *C40* | *DokumenLegal* | *entity* | *idDokumen, jenisDokumen, judul, isi, klausaPrivasiPesan, versi, tanggalBerlaku, statusPublikasi, tautan* | *getVersiTerbaru(), getTautan(), getIsi()* |

### Hubungan Antarkelas

**a. Asosiasi boundary → control**

| Kelas Boundary | Kelas Control |
| :--- | :--- |
| *C01 HalamanOtentikasi* | *C13 AkunController* |
| *C02 HalamanProfil* | *C13 AkunController* |
| *C03 HalamanListingPenjual* | *C14 BarangController* |
| *C04 FormulirBarang* | *C14 BarangController* |
| *C05 HalamanKatalog* | *C15 KatalogController*, *C16 PencarianController*, *C17 FilterController* |
| *C07 HalamanDetailBarang* | *C14 BarangController*, *C18 PercakapanController*, *C20 LaporanController* |
| *C08 HalamanPercakapan* | *C18 PercakapanController* |
| *C09 PanelNotifikasi* | *C19 NotifikasiController* |
| *C10 FormulirLaporan* | *C20 LaporanController* |
| *C11 DasborAdmin* | *C21 ModerasiController* |
| *C12 HalamanDokumenLegal* | *C22 DokumenLegalController* |

Selain itu, *C02 HalamanProfil*, *C03 HalamanListingPenjual*, dan *C05 HalamanKatalog* masing-masing memiliki relasi komposisi *1 ◆— 0..\** terhadap *C06 KartuProduk*.

**b. Dependensi control ⇢ entity/control**

| Kelas Control | Bergantung pada |
| :--- | :--- |
| *C13 AkunController* | *C23 Akun*, *C27 TokenVerifikasi*, *C28 SesiLogin*, *C29 Barang*, *C40 DokumenLegal*, *C19 NotifikasiController* |
| *C14 BarangController* | *C28 SesiLogin*, *C29 Barang*, *C30 FotoBarang*, *C31 Kategori*, *C32 LokasiCOD* |
| *C15 KatalogController* | *C29 Barang* |
| *C16 PencarianController* | *C29 Barang* |
| *C17 FilterController* | *C29 Barang*, *C31 Kategori*, *C32 LokasiCOD* |
| *C18 PercakapanController* | *C28 SesiLogin*, *C33 Percakapan*, *C34 Pesan*, *C19 NotifikasiController* |
| *C19 NotifikasiController* | *C35 Notifikasi* |
| *C20 LaporanController* | *C28 SesiLogin*, *C36 Laporan*, *C37 BuktiLaporan*, *C38 LogAudit* |
| *C21 ModerasiController* | *C23 Akun*, *C26 Admin*, *C29 Barang*, *C36 Laporan*, *C38 LogAudit*, *C39 LogAdmin*, *C19 NotifikasiController* |
| *C22 DokumenLegalController* | *C40 DokumenLegal* |

**c. Relasi antar-entity**

| Kelas A | Mult. A | Jenis Relasi | Mult. B | Kelas B | Keterangan |
| :--- | :---: | :--- | :---: | :--- | :--- |
| *C23 Akun* | *-* | *generalisasi* | *-* | *C24 Pembeli* | *Pembeli merupakan peran dari Akun* |
| *C23 Akun* | *-* | *generalisasi* | *-* | *C25 Penjual* | *Penjual merupakan peran dari Akun* |
| *C23 Akun* | *-* | *generalisasi* | *-* | *C26 Admin* | *Admin merupakan peran dari Akun* |
| *C23 Akun* | *1* | *asosiasi* | *0..\** | *C27 TokenVerifikasi* | *Satu akun dapat memiliki banyak kode verifikasi* |
| *C23 Akun* | *1* | *asosiasi* | *0..\** | *C28 SesiLogin* | *Sesi aktif berlaku paling lama 24 jam* |
| *C23 Akun* | *1* | *asosiasi* | *0..\** | *C35 Notifikasi* | *Akun sebagai penerima notifikasi* |
| *C23 Akun* | *0..\** | *asosiasi* | *1* | *C40 DokumenLegal* | *Versi kebijakan yang disetujui saat pendaftaran* |
| *C25 Penjual* | *1* | *komposisi* | *0..\** | *C29 Barang* | *Barang tidak dapat berdiri tanpa pemiliknya* |
| *C29 Barang* | *1* | *komposisi* | *1..5* | *C30 FotoBarang* | *Maksimum 5 foto per listing* |
| *C31 Kategori* | *1* | *asosiasi* | *0..\** | *C29 Barang* | *Kategori tetap sebagai rujukan barang* |
| *C32 LokasiCOD* | *1* | *asosiasi* | *0..\** | *C29 Barang* | *Titik temu COD pada barang* |
| *C24 Pembeli* | *1* | *asosiasi* | *0..\** | *C33 Percakapan* | *Pembeli sebagai inisiator percakapan* |
| *C25 Penjual* | *1* | *asosiasi* | *0..\** | *C33 Percakapan* | *Penjual sebagai lawan bicara* |
| *C29 Barang* | *1* | *asosiasi* | *0..\** | *C33 Percakapan* | *Setiap percakapan mengacu pada satu barang* |
| *C33 Percakapan* | *1* | *komposisi* | *0..\** | *C34 Pesan* | *Pesan terhapus bersama percakapannya* |
| *C23 Akun* | *1* | *asosiasi* | *0..\** | *C34 Pesan* | *Akun sebagai pengirim pesan* |
| *C23 Akun* | *1* | *asosiasi* | *0..\** | *C36 Laporan* | *Akun sebagai pelapor* |
| *C36 Laporan* | *1* | *komposisi* | *1..\** | *C37 BuktiLaporan* | *Lampiran tangkapan layar bersifat wajib* |
| *C36 Laporan* | *0..\** | *asosiasi* | *0..1* | *C29 Barang* | *Barang sebagai objek yang dilaporkan* |
| *C36 Laporan* | *0..\** | *asosiasi* | *0..1* | *C33 Percakapan* | *Percakapan sebagai objek yang dilaporkan* |
| *C36 Laporan* | *1* | *asosiasi* | *0..\** | *C38 LogAudit* | *Rekam jejak permanen atas laporan* |
| *C26 Admin* | *1* | *asosiasi* | *0..\** | *C39 LogAdmin* | *Catatan setiap tindakan moderasi admin* |

Secara keseluruhan diagram memuat **40 kelas** dengan **3 relasi generalisasi**, **7 relasi komposisi** (4 antar-entity dan 3 antara halaman dengan *C06 KartuProduk*), **15 asosiasi antar-entity**, **15 asosiasi boundary–control**, dan **33 dependensi control–entity/control**, tanpa kelas yang terduplikasi.

---

# BAB 6: Traceability
Bagian ini mencocokkan setiap kelas dengan use case dan kebutuhan fungsional (KF) yang didukung atau diimplementasikannya. Pemetaan disusun dengan dua aturan berikut.

1. Sebuah kelas dipetakan ke suatu use case hanya jika kelas tersebut muncul pada diagram kelas use case itu di 5.2. Dengan demikian, kolom ID Use Case pada Tabel 6.1 sama dengan kolom ID Use Case pada 5.1.
2. Sebuah kelas dipetakan ke suatu KF hanya jika KF tersebut tercantum pada use case yang memuat kelas itu (tabel 4.2) dan kelas tersebut ikut merealisasikan KF tersebut melalui atribut atau metodenya. Kelas tidak otomatis mendapatkan seluruh KF milik use case-nya.

## 6.1 Tabel Traceability Kelas

Tabel 6.1. Traceability Kelas, Use Case, dan Kebutuhan Fungsional

| ID Kelas | ID Use Case | ID KF |
| :--- | :--- | :--- |
| *C01* | *UC01, UC02, UC03, UC04* | *KF01, KF02, KF03, KF05, KF06, KF07, KF08, KF10, KF11, KF12, KF13, KF14, KF39, KF53* |
| *C02* | *UC05* | *KF04, KF39* |
| *C03* | *UC08, UC10, UC11, UC12* | *KF20, KF21, KF22, KF40, KF41, KF42* |
| *C04* | *UC07, UC09* | *KF15, KF16, KF18, KF19, KF21, KF22, KF23, KF24* |
| *C05* | *UC13, UC14* | *KF25, KF26, KF27, KF28, KF29, KF30, KF42, KF54* |
| *C06* | *UC05, UC08, UC13, UC14* | *KF04, KF20, KF25, KF26, KF27, KF28, KF30, KF42* |
| *C07* | *UC15, UC16, UC19* | *KF17, KF31, KF43* |
| *C08* | *UC16, UC17, UC18* | *KF31, KF32, KF33, KF34, KF35, KF39* |
| *C09* | *UC17* | *KF34* |
| *C10* | *UC19* | *KF37, KF43, KF44* |
| *C11* | *UC20, UC21, UC22, UC23, UC24* | *KF45, KF46, KF47, KF50, KF51, KF52, KF55, KF56* |
| *C12* | *UC06* | *KF13, KF38, KF39* |
| *C13* | *UC01, UC02, UC03, UC04, UC05* | *KF01, KF02, KF03, KF04, KF05, KF06, KF07, KF08, KF09, KF10, KF11, KF12, KF13, KF14, KF39, KF53* |
| *C14* | *UC07, UC08, UC09, UC10, UC11, UC12, UC15* | *KF15, KF16, KF17, KF18, KF19, KF20, KF21, KF22, KF23, KF24, KF40, KF41, KF42* |
| *C15* | *UC13, UC14* | *KF27, KF28, KF29, KF30, KF42, KF54* |
| *C16* | *UC14* | *KF25, KF29, KF30* |
| *C17* | *UC14* | *KF26, KF29, KF30* |
| *C18* | *UC16, UC17, UC18* | *KF31, KF32, KF33, KF34, KF35, KF36* |
| *C19* | *UC01, UC02, UC17, UC22, UC23* | *KF06, KF34, KF52* |
| *C20* | *UC19* | *KF37, KF43, KF44, KF48* |
| *C21* | *UC20, UC21, UC22, UC23, UC24* | *KF45, KF46, KF47, KF48, KF49, KF50, KF51, KF52, KF53, KF54, KF55, KF56* |
| *C22* | *UC06* | *KF13, KF38, KF39* |
| *C23* | *UC01, UC02, UC03, UC04, UC05, UC17, UC19, UC23, UC24* | *KF01, KF02, KF03, KF04, KF05, KF07, KF08, KF09, KF10, KF12, KF14, KF32, KF34, KF37, KF43, KF51, KF53* |
| *C24* | *UC05, UC16* | *KF04, KF31, KF35* |
| *C25* | *UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC15, UC16* | *KF04, KF16, KF17, KF20, KF21, KF22, KF31, KF35, KF40, KF41* |
| *C26* | *UC20, UC21, UC22, UC23, UC24* | *KF45, KF47, KF50, KF51, KF55, KF56* |
| *C27* | *UC01, UC02* | *KF06, KF07, KF08* |
| *C28* | *UC03, UC04, UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC16, UC17, UC18, UC19* | *KF03, KF04, KF11, KF12, KF16, KF20, KF22, KF31, KF33, KF35, KF37, KF40, KF41, KF43* |
| *C29* | *UC05, UC07, UC08, UC09, UC10, UC11, UC12, UC13, UC14, UC15, UC16, UC19, UC22, UC23, UC24* | *KF04, KF16, KF17, KF18, KF20, KF21, KF22, KF25, KF26, KF27, KF28, KF29, KF30, KF31, KF40, KF41, KF42, KF43, KF50, KF54* |
| *C30* | *UC07, UC09, UC15* | *KF16, KF17, KF21, KF23, KF24* |
| *C31* | *UC07, UC09, UC14, UC15* | *KF15, KF17, KF19, KF21, KF26* |
| *C32* | *UC07, UC09, UC14, UC15* | *KF15, KF17, KF21, KF26* |
| *C33* | *UC16, UC17, UC18, UC19* | *KF31, KF32, KF33, KF35, KF37* |
| *C34* | *UC16, UC17, UC18* | *KF31, KF32, KF33, KF34, KF35, KF36* |
| *C35* | *UC01, UC02, UC17, UC22, UC23* | *KF06, KF34, KF52* |
| *C36* | *UC19, UC20, UC21* | *KF37, KF43, KF44, KF45, KF46, KF47* |
| *C37* | *UC19* | *KF44* |
| *C38* | *UC19, UC21, UC22, UC23* | *KF48, KF49* |
| *C39* | *UC22, UC23, UC24* | *KF55* |
| *C40* | *UC01, UC05, UC06* | *KF13, KF14, KF38, KF39* |

## 6.2 Pemeriksaan Balik per Kebutuhan Fungsional
Tabel 6.2 menyajikan pemetaan yang sama dari arah kebutuhan fungsional untuk memastikan tidak ada KF yang tertinggal. Tanda "-" pada kolom Kelas Boundary menandakan KF tersebut merupakan aturan internal sistem yang tidak memiliki antarmuka tersendiri, yaitu penyimpanan kata sandi dalam bentuk *hash* (KF09), enkripsi isi pesan (KF36), serta pencatatan dan perlindungan *log* audit (KF48, KF49).

Tabel 6.2. Pemeriksaan Balik Kebutuhan Fungsional terhadap Use Case dan Kelas

| ID KF | ID Use Case | Kelas Boundary | Kelas Control | Kelas Entity |
| :--- | :--- | :--- | :--- | :--- |
| *KF01* | *UC01* | *C01* | *C13* | *C23* |
| *KF02* | *UC01* | *C01* | *C13* | *C23* |
| *KF03* | *UC03* | *C01* | *C13* | *C23, C28* |
| *KF04* | *UC05* | *C02, C06* | *C13* | *C23, C24, C25, C28, C29* |
| *KF05* | *UC01* | *C01* | *C13* | *C23* |
| *KF06* | *UC01, UC02* | *C01* | *C13, C19* | *C27, C35* |
| *KF07* | *UC02* | *C01* | *C13* | *C23, C27* |
| *KF08* | *UC02, UC03* | *C01* | *C13* | *C23, C27* |
| *KF09* | *UC01* | *-* | *C13* | *C23* |
| *KF10* | *UC03* | *C01* | *C13* | *C23* |
| *KF11* | *UC03* | *C01* | *C13* | *C28* |
| *KF12* | *UC04* | *C01* | *C13* | *C23, C28* |
| *KF13* | *UC01, UC06* | *C01, C12* | *C13, C22* | *C40* |
| *KF14* | *UC01* | *C01* | *C13* | *C23, C40* |
| *KF15* | *UC07* | *C04* | *C14* | *C31, C32* |
| *KF16* | *UC07* | *C04* | *C14* | *C25, C28, C29, C30* |
| *KF17* | *UC15* | *C07* | *C14* | *C25, C29, C30, C31, C32* |
| *KF18* | *UC07, UC09* | *C04* | *C14* | *C29* |
| *KF19* | *UC07, UC09* | *C04* | *C14* | *C31* |
| *KF20* | *UC08* | *C03, C06* | *C14* | *C25, C28, C29* |
| *KF21* | *UC09, UC10* | *C03, C04* | *C14* | *C25, C29, C30, C31, C32* |
| *KF22* | *UC09, UC10* | *C03, C04* | *C14* | *C25, C28, C29* |
| *KF23* | *UC07, UC09* | *C04* | *C14* | *C30* |
| *KF24* | *UC07, UC09* | *C04* | *C14* | *C30* |
| *KF25* | *UC14* | *C05, C06* | *C16* | *C29* |
| *KF26* | *UC14* | *C05, C06* | *C17* | *C29, C31, C32* |
| *KF27* | *UC14* | *C05, C06* | *C15* | *C29* |
| *KF28* | *UC13, UC14* | *C05, C06* | *C15* | *C29* |
| *KF29* | *UC14* | *C05* | *C15, C16, C17* | *C29* |
| *KF30* | *UC13, UC14* | *C05, C06* | *C15, C16, C17* | *C29* |
| *KF31* | *UC16* | *C07, C08* | *C18* | *C24, C25, C28, C29, C33, C34* |
| *KF32* | *UC17* | *C08* | *C18* | *C23, C33, C34* |
| *KF33* | *UC18* | *C08* | *C18* | *C28, C33, C34* |
| *KF34* | *UC17, UC18* | *C08, C09* | *C18, C19* | *C23, C34, C35* |
| *KF35* | *UC16, UC17, UC18* | *C08* | *C18* | *C24, C25, C28, C33, C34* |
| *KF36* | *UC17* | *-* | *C18* | *C34* |
| *KF37* | *UC19* | *C10* | *C20* | *C23, C28, C33, C36* |
| *KF38* | *UC06* | *C12* | *C22* | *C40* |
| *KF39* | *UC01, UC05, UC06, UC16, UC17* | *C01, C02, C08, C12* | *C13, C22* | *C40* |
| *KF40* | *UC11* | *C03* | *C14* | *C25, C28, C29* |
| *KF41* | *UC12* | *C03* | *C14* | *C25, C28, C29* |
| *KF42* | *UC08, UC11, UC12, UC13* | *C03, C05, C06* | *C14, C15* | *C29* |
| *KF43* | *UC19* | *C07, C10* | *C20* | *C23, C28, C29, C36* |
| *KF44* | *UC19* | *C10* | *C20* | *C36, C37* |
| *KF45* | *UC20* | *C11* | *C21* | *C26, C36* |
| *KF46* | *UC20* | *C11* | *C21* | *C36* |
| *KF47* | *UC21* | *C11* | *C21* | *C26, C36* |
| *KF48* | *UC19, UC21, UC22, UC23* | *-* | *C20, C21* | *C38* |
| *KF49* | *UC21, UC22, UC23* | *-* | *C21* | *C38* |
| *KF50* | *UC22* | *C11* | *C21* | *C26, C29* |
| *KF51* | *UC23, UC24* | *C11* | *C21* | *C23, C26* |
| *KF52* | *UC22, UC23* | *C11* | *C19, C21* | *C35* |
| *KF53* | *UC03, UC23* | *C01* | *C13, C21* | *C23* |
| *KF54* | *UC13, UC23, UC24* | *C05* | *C15, C21* | *C29* |
| *KF55* | *UC22, UC23, UC24* | *C11* | *C21* | *C26, C39* |
| *KF56* | *UC20, UC21, UC22, UC23, UC24* | *C11* | *C21* | *C26* |

Berdasarkan Tabel 6.1 dan Tabel 6.2, seluruh 56 kebutuhan fungsional (KF01–KF56) terpetakan ke sekurang-kurangnya satu use case, satu kelas control, dan satu kelas entity. Seluruh 24 use case (UC01–UC24) memiliki kelas pendukung, dan seluruh 40 kelas (C01–C40) terpetakan ke sekurang-kurangnya satu use case dan satu KF.

# Referensi
- Diagram UML: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
