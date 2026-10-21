<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## PeerUP

### 

<img alt="Arsitektur MVC PeerUP" src="./assets/Logo_PeerUP.jpeg" width="30%">


### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *G09* |
| Nama Kelompok | *PindahCSUI*|

| NIM        | Nama                                 |
|---         |---                                   |
| *13525049* | *Hugo Daniel Johansen Napitupulu*    |
| *13525001* | *Matthew Allen Reynaldo*             |
| *13525010* | *Fabian Amzar Susanto*               |
| *13525025* | *David Christian*                    |
| *13525028* | *Markus Christiano Simanjuntak*      |

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
Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) ini ditulis untuk mendefinisikan secara lengkap, rinci, dan terstruktur seluruh kebutuhan fungsional, kebutuhan non-fungsional, batasan sistem, pemodelan *use case*, serta pemodelan kelas dari perangkat lunak **PeerUP**. Dokumen ini ditujukan bagi:
1. **Tim Pengembang (Developer):** Sebagai acuan teknis utama dalam mengimplementasikan kode program, merancang basis data, dan mengintegrasikan antarmuka perangkat lunak.
2. **Penguji Perangkat Lunak (Tester / QA):** Sebagai dasar pengujian untuk memvalidasi apakah seluruh fitur dan skenario telah berjalan sesuai spesifikasi.
3. **Dosen dan/atau Asisten Pengampu IF2150:** Sebagai dokumen evaluasi akademik terhadap perancangan rekayasa perangkat lunak yang dilakukan oleh Kelompok ini.

## 1.2 Lingkup Masalah
**PeerUP** adalah platform web pembelajaran kolaboratif (*peer-to-peer tutoring*) yang dirancang untuk mengatasi ketimpangan akses bimbingan belajar berbiaya mahal serta isolasi sosial di kalangan pelajar dan mahasiswa. Di tengah maraknya platform *EdTech* berlangganan yang bersifat satu arah dan pencarian teman belajar manual yang tidak terstruktur, PeerUP hadir sebagai fasilitator otomatis yang mempertemukan *Mentee* (pelajar yang membutuhkan bimbingan) dengan *Mentor* (tutor sebaya) berdasarkan kecocokan materi, ketersediaan jadwal, dan format belajar (daring/luring), dilengkapi dengan fitur ruang obrolan grup sementara (*temporary group chat*), pengingat jadwal otomatis, serta sistem *feedback*.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya disajikan pada Tabel 1.3.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *EARS* | *Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji.* |
| *Mentor / Tutor* | *Pengguna sebaya yang memiliki penguasaan materi lebih baik dan membuka sesi belajar untuk membimbing pengguna lain.* |
| *Mentee* | *Pengguna (siswa/mahasiswa) yang mencari bantuan pemahaman materi dan bergabung ke dalam sesi belajar.* |
| *Matchmaking* | *Proses pencocokan otomatis antara preferensi materi serta jadwal kosong Mentee dengan sesi belajar yang tersedia.* | 
| *BaaS* | *Backend-as-a-Service, layanan cloud yang menyediakan infrastruktur backend siap pakai seperti basis data, autentikasi, dan komunikasi real-time.* |

## 1.4 Aturan Penomoran
Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *User Story* | *US-XX* | *XX menyatakan dua digit nomor urut kebutuhan pengguna awal (contoh: US-01).* |
| *Aktivitas* | *AXX* | *XX menyatakan dua digit nomor urut aktivitas proses bisnis (contoh: A01).* |
| *Kebutuhan* | *RXX* | *XX menyatakan dua digit nomor urut pemetaan kebutuhan (contoh: R01).* |
| *Kebutuhan Fungsional* | *KFXX* | *XX menyatakan dua digit nomor urut kebutuhan fungsional (contoh: KF01).* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *XX menyatakan dua digit nomor urut kebutuhan non-fungsional (contoh: KNF01).* |
| *Aktor* | *AXX* | *XX menyatakan dua digit nomor urut aktor pada pemodelan use case (contoh: A01).* |
| *Use Case* | *UCXX* | *XX menyatakan dua digit nomor urut use case (contoh: UC01).* |
| *Kelas* | *CXX* | *XX menyatakan dua digit nomor urut kelas pada diagram kelas (contoh: C01).* |

## 1.5 Referensi
1. Dokumentasi Perangkat Lunak *Topic Brainstorming* (Tugas 1), *Requirement Gathering* (Tugas 2), *Use Case & Scenario Use Case* (Tugas 3), dan *Class Diagram* (Tugas 4) Kelompok G09 IF2150 Rekayasa Perangkat Lunak.
2. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). *Easy Approach to Requirements Syntax (EARS)*. 17th IEEE International Requirements Engineering Conference.
3. Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
4. Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU ITE.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen SKPL ini dibagi menjadi enam bab utama:
- **BAB 1: Pendahuluan**, menjelaskan tujuan penulisan dokumen, lingkup masalah, definisi dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen.
- **BAB 2: Deskripsi Perangkat Lunak**, menguraikan deskripsi umum sistem beserta *Activity Diagram* proses bisnis, deskripsi umum perangkat lunak dan komponen eksternal, karakteristik pengguna, batasan perangkat lunak, serta lingkungan operasi perangkat lunak.
- **BAB 3: Deskripsi Kebutuhan Perangkat Lunak**, merinci seluruh Kebutuhan Fungsional (KF) dan Kebutuhan Non-Fungsional (KNF).
- **BAB 4: Pemodelan Use Case**, memuat identifikasi aktor, identifikasi *use case*, *Use Case Diagram*, serta skenario normal dan alternatif untuk masing-masing *use case*.
- **BAB 5: Pemodelan Kelas**, menyajikan identifikasi kelas (arsitektur *Boundary, Controller, Entity*), diagram kelas per *use case*, serta diagram kelas keseluruhan beserta atribut dan operasinya.
- **BAB 6: Traceability**, memetakan keterlacakan antara ID Kelas, ID Use Case, dan ID Kebutuhan Fungsional.

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

| Komponen | Spesifikasi |
| :--- | :--- |
| *Sistem Operasi Pengembangan* | *Windows, Linux, atau macOS yang mendukung Node.js dan perkakas pengembangan web.* |
| *Sistem Operasi Client* | *Cross-platform, yaitu Windows, Linux, macOS, Android, dan iOS selama perangkat memiliki peramban web modern serta koneksi internet aktif.* |
| *Bahasa Pemrograman* | *TypeScript untuk kode frontend dan backend Next.js. SQL digunakan untuk definisi skema, constraint, query, dan kebijakan basis data yang diperlukan pada PostgreSQL/Supabase.* |
| *Framework & UI* | *Next.js berbasis React dengan Tailwind CSS untuk penyusunan tampilan antarmuka.* |
| *Runtime & Backend* | *Node.js untuk menjalankan lingkungan pengembangan lokal. Next.js Server Actions dan Route Handlers/API Routes menjadi titik masuk pemrosesan sisi server dan terintegrasi dengan Supabase Client SDK.* |
| *DBMS* | *PostgreSQL yang dikelola melalui layanan Supabase sebagai penyimpanan data persisten.* |
| *Authentication* | *Supabase Auth untuk registrasi, login, dan pengelolaan sesi autentikasi. Validasi domain email universitas dilakukan oleh logika aplikasi pada sisi tepercaya.* |
| *Real-time Communication* | *Supabase Realtime berbasis WebSocket untuk mendukung penerimaan pembaruan pesan secara real-time sesuai otorisasi pengguna.* |
| *Scheduled Task* | *Supabase Cron untuk memicu pekerjaan pengingat sesi 15 menit sebelum sesi dimulai dan pengelolaan masa retensi group chat. Dalam rancangan ini, pemicu Cron diteruskan ke endpoint internal Next.js yang dilindungi autentikasi server-side.* |
| *Server & Hosting* | *Pengembangan dan pengujian dapat dijalankan secara lokal menggunakan Node.js. Vercel direncanakan sebagai hosting aplikasi Next.js pada lingkungan deployment; keputusan ini harus disamakan dengan target deployment final tim.* |
| *Development Tools* | *Node.js dan package manager proyek; editor kode yang disepakati tim (misalnya Visual Studio Code); Git dan GitHub untuk kontrol versi; Supabase Dashboard/CLI untuk pengelolaan layanan; serta draw.io dan PlantUML untuk penyusunan diagram.* |
| *Filing System* | *Sistem berkas lokal pada sistem operasi pengembang digunakan untuk menyimpan kode sumber, konfigurasi, dan aset statis. Kode sumber dikelola melalui repositori Git. Data aplikasi yang persisten disimpan pada PostgreSQL/Supabase, bukan pada sistem berkas lokal server aplikasi.* |

## 2.2 Style/Pattern Arsitektur Acuan

Tentukan *architectural style* atau *pattern* yang menjadi acuan aplikasi, misalnya *layered architecture*, *client-server*, *repository*, *pipe and filter*, atau MVC (*Model-View-Controller*).


Gunakan hasil **BAB 1 Style/Pattern Arsitektur Acuan pada dokumen APL**, termasuk alasan pemilihan dan gambar penerapannya pada P/L kelompok. Gunakan komponen aplikasi sendiri pada gambar, bukan hanya contoh pola umum.

<p align="center">
<img alt="Contoh Arsitektur MVC" src="./assets/diagram/contoh-arsitektur-mvc.webp" width="40%">
</p>
<p align="center">
<i>Gambar 1. Contoh Arsitektur MVC</i>
</p>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Identifikasi komponen, modul, atau subsistem penyusun aplikasi berdasarkan *pattern* yang telah ditetapkan. Jelaskan tanggung jawab masing-masing komponen. Pengelompokan dapat mengikuti lapisan arsitektur atau fungsi/peran komponen dalam sistem.

Ambil dari **Tabel 2.1 dokumen APL**, lalu kelompokkan berdasarkan lapisan (Model/View/Controller). Kolom **Jenis** diisi sesuai pattern, misalnya View, Controller, Model, Service, Repository. Satu komponen merepresentasikan saatu tanggung jawab utama yang jelas,

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *...* | *...* | *...* |

## 2.4 Model Arsitektur Perangkat Lunak

Buat model arsitektur dalam bentuk satu atau lebih *view* yang memperlihatkan interaksi dan kolaborasi komponen, modul, serta subsistem dalam menjalankan fungsi sistem. Pilih notasi yang sesuai. Contoh *view*: *Logical View*, *Process View*, *Development View*, dan *Physical View*.

Gunakan hasil **BAB 3 Model Arsitektur Perangkat Lunak pada dokumen APL**. 

### 2.4.1 View [Nama View]

Tuliskan secara singkat model arsitektur yang dipilih dan alasan model tersebut cocok untuk aplikasi.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-logical-view.webp" width="50%">
</p>
<p align="center">
<i>Gambar 2. Contoh Logical View pada P/L E-Commerce</i>
</p>

### 2.4.X View [Nama View]
*[Lakukan hal yang sama dengan bagian sebelumnya]*

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
