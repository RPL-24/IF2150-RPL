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

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

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

Dapat menyalin dari dokumen DPPL sebelumnya

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
