<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## *Nama Perangkat Lunak*
### *[Logo Perangkat Lunak]*

### Untuk: *[Nama Asisten]*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *\[Kelas\]* |
| Kelompok | *\[Nomor Kelompok\]*  |

| NIM | Nama |
|---|---|
| *[NIM 1]* | *[Nama Anggota 1]* |
| *[NIM 2]* | *[Nama Anggota 2]* |
| *[NIM 3]* | *[Nama Anggota 3]* |
| *[NIM 4]* | *[Nama Anggota 4]* |
| *[NIM 5]* | *[Nama Anggota 5]* |
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
Tuliskan dengan ringkas tujuan dokumen DPPL ini dibuat dan siapa saja yang akan menggunakan dokumen ini.

## 1.2 Lingkup Masalah
Tuliskan dengan ringkas nama aplikasi dan deskripsi singkatnya. Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL.

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
| 1 | *User* | *User* |
| 2 | *Mentor* | *Mentor* |
| 3 | *Mentee* | *Mentee* |
| 4 | *Session* | *Session* |
| 5 | *GroupChat* | *GroupChat* |
| 6 | *Feedback* | *Feedback* |
| 7 | *SessionHistory* | *SessionHistory* |
| 8 | *ChatMessage* | *ChatMessage* |
| 9 | *Preference* | *Preference* |
| 10 | *Profile* | *Profile* |
| 11 | *Dashboard* | *Dashboard* |
| 12 | *UserControl* | *UserControl* |
| 13 | *SessionControl* | *SessionControl* |
| 14 | *FeedbackControl* | *FeedbackControl* |
| 15 | *LoginPage* | *LoginPage* |
| 16 | *ProfilePage* | *ProfilePage* |
| 17 | *SessionPage* | *SessionPage* |
| 18 | *HostSessionPage* | *HostSessionPage* |
| 19 | *ParticipantSessionPage* | *ParticipantSessionPage* |
| 20 | *FeedbackForm* | *FeedbackForm* |
| 21 | *GroupChatPage* | *GroupChatPage* |
| 22 | *Notification* | *Notification* |
| 23 | *PopUpNotification* | *PopUpNotification* |
| 24 | *HistoryPage* | *HistoryPage* |

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

## 5.2 Kelas [Nama Kelas 2]

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
## 5.3 Kelas [Nama Kelas 3]

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
## 5.4 Kelas [Nama Kelas 4]

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
## 5.5 Kelas [Nama Kelas 5]

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

## 5.6 Kelas [Nama Kelas 6]

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

## 5.7 Kelas [Nama Kelas 7]

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

## 5.8 Kelas [Nama Kelas 8]

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

## 5.9 Kelas [Nama Kelas 9]

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

## 5.10 Kelas [Nama Kelas 10]

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

## 5.11 Kelas [Nama Kelas 11]

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

## 5.12 Kelas [Nama Kelas 12]

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

## 5.13 Kelas SessionControl

**Nama Kelas:** *SessionControl*  
**ID Kelas:** *C13*

Tabel 5.13.1. Operasi Kelas SessionControl

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `processSessionCreation(idMentor: string, data: SessionData): Promise<Session>` | `public` | Mengoordinasikan alur pembuatan sesi baru dengan memvalidasi kapasitas dan konflik jadwal terlebih dahulu, lalu mendelegasikan pembuatan objek sesi baru ke kelas entitas `Session` (`Session.saveSession()` / `Session.create()`). |
| `validateScheduleConflict(idMentor: string, startTime: Date, endTime: Date, excludeSessionId?: string): Promise<boolean>` | `public` | Memeriksa apakah jadwal sesi yang diajukan bertabrakan dengan sesi aktif lain milik Mentor yang sama, dengan mengambil daftar sesi dari entitas `Session` (`Session.getSessionsByMentorInRange()`). |
| `validateCapacity(capacity: number): boolean` | `public` | Memeriksa apakah kapasitas maksimum peserta sesi berada dalam rentang aturan bisnis yang diizinkan (1 hingga 20 peserta). |
| `processRegistration(idSession: string, idMentee: string): Promise<boolean>` | `public` | Mengoordinasikan pendaftaran Mentee ke dalam sebuah sesi dengan mengambil objek `Session`, memeriksa ketersediaan kuota (`session.checkCapacity()`), dan memanggil metode entitas `session.addParticipant(idMentee)`. |
| `processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>` | `public` | Mengoordinasikan konfirmasi keterlaksanaan sesi yang waktunya telah berakhir setelah memverifikasi keterlibatan pengguna pada objek `Session`. |
| `updateSessionStatus(session: Session, status: SessionStatus, reason?: string): Promise<Session>` | `private` | Menginstruksikan objek entitas `Session` untuk memperbarui status keterlaksanaannya beserta alasan opsional melalui metode setter entitas `session.setStatus(status, reason)`. |
| `fetchUserHistory(idUser: string): Promise<SessionHistory>` | `public` | Mengambil arsip sesi berstatus akhir melalui kelas entitas `Session` (`Session.getArchivedByUser(idUser)`) dan menginstansiasi objek `SessionHistory` untuk dikembalikan ke antarmuka. |
| `getUpcomingSessions(idUser: string): Promise<Session[]>` | `public` | Mengoordinasikan pengambilan daftar sesi aktif terdekat yang dimiliki atau diikuti oleh pengguna melalui metode entitas `Session.getUpcomingByUser(idUser)`. |
| `findRecommendation(idMentee: string): Promise<Session[]>` | `public` | Mengoordinasikan pencarian rekomendasi sesi dengan mengambil objek `Preference` milik Mentee dan daftar kandidat sesi terbuka dari entitas `Session`, lalu menjalankan algoritma pencocokan `matchSession()`. |
| `matchSession(preference: Preference, candidates: Session[]): Session[]` | `private` | Menjalankan logika algoritma *matchmaking* untuk menyaring dan mengurutkan kandidat sesi berdasarkan irisan tag materi, ketersediaan jadwal, dan kesesuaian format belajar. |
| `getSessionDetail(idSession: string, idUser: string): Promise<Session>` | `public` | Mengoordinasikan pengambilan informasi rinci suatu sesi berdasarkan ID melalui metode getter entitas `Session.getSessionById(idSession)`. |
| `editSession(idSession: string, idMentor: string, data: SessionData): Promise<Session>` | `public` | Mengoordinasikan pembaruan data sesi oleh Mentor pemilik sesi setelah lolos validasi kapasitas dan jadwal, dengan memanggil metode mutator pada entitas `Session`. |
| `cancelSession(idSession: string, idMentee: string): Promise<boolean>` | `public` | Mengoordinasikan pembatalan keikutsertaan Mentee pada sesi yang belum dimulai dengan memanggil operasi penghapusan partisipan pada entitas `Session` (`session.removeParticipant(idMentee)`). |
| `deleteSession(idSession: string, idMentor: string): Promise<boolean>` | `public` | Mengoordinasikan penghapusan (*soft delete*) sesi oleh Mentor pemilik sesi dengan memanggil metode `session.markAsDeleted()` pada objek entitas `Session`. |

Tabel 5.13.2. Atribut Kelas SessionControl

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `sessionList` | `private` | `Session[]` |
| `sessionHistory` | `private` | `SessionHistory \| null` |
| `session` | `private` | `Session \| null` |

### 5.13.1 Algoritma/Query

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `processSessionCreation(idMentor: string, data: SessionData): Promise<Session>`  
**ID Algoritma:** *Algo-C13-01*

```text
FUNCTION processSessionCreation(idMentor: string, data: SessionData): Promise<Session>
    IF NOT THIS.validateCapacity(data.capacity) THEN
        THROW Error("INVALID_CAPACITY")
    END IF

    hasConflict <- AWAIT THIS.validateScheduleConflict(idMentor, data.startTime, data.endTime)
    IF hasConflict THEN
        THROW Error("SCHEDULE_CONFLICT")
    END IF

    // Operasi CRUD pembuatan dan penyimpanan sesi didelegasikan ke kelas entitas Session
    newSession <- NEW Session(idMentor, data.topic, data.schedule, data.format, data.capacity)
    savedSession <- AWAIT newSession.saveSession()
    THIS.session <- savedSession
    RETURN savedSession
END FUNCTION
```

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `findRecommendation(idMentee: string): Promise<Session[]>` dan `matchSession(preference: Preference, candidates: Session[]): Session[]`  
**ID Algoritma:** *Algo-C13-02*

```text
FUNCTION findRecommendation(idMentee: string): Promise<Session[]>
    // Mengambil data melalui getter pada kelas entitas Preference dan Session
    preference <- AWAIT Preference.getPreferenceByUser(idMentee)
    IF preference IS NULL OR NOT preference.isComplete() THEN
        THROW Error("PREFERENCE_NOT_SET")
    END IF

    candidates <- AWAIT Session.getAvailableSessions(NOW())
    THIS.sessionList <- THIS.matchSession(preference, candidates)
    RETURN THIS.sessionList
END FUNCTION

FUNCTION matchSession(preference: Preference, candidates: Session[]): Session[]
    matchedSessions <- EMPTY LIST OF Session
    prefTags <- preference.getMaterialTag()
    prefAvailability <- preference.getAvailability()
    prefFormat <- preference.getSessionFormatPreference()

    FOR EACH candidate IN candidates DO
        IF candidate.checkCapacity() AND NOT candidate.isParticipant(preference.getUserId()) THEN
            tagMatch <- candidate.getTopic() IN prefTags
            formatMatch <- (prefFormat == "BOTH") OR (candidate.getFormat() == prefFormat)
            timeMatch <- prefAvailability.overlapsWith(candidate.getScheduledTime())

            IF tagMatch AND formatMatch AND timeMatch THEN
                APPEND candidate TO matchedSessions
            END IF
        END IF
    END FOR

    RETURN matchedSessions
END FUNCTION
```

**Nama Kelas:** *SessionControl*  
**Nama Operasi:** `processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>`  
**ID Algoritma:** *Algo-C13-03*

```text
FUNCTION processSessionConfirmation(idSession: string, idUser: string, isConducted: boolean, reason?: string): Promise<Session>
    // Mengambil objek entitas menggunakan getter pada kelas Session
    targetSession <- AWAIT Session.getSessionById(idSession)
    IF targetSession IS NULL THEN
        THROW Error("SESSION_NOT_FOUND")
    END IF

    IF NOT targetSession.involves(idUser) THEN
        THROW Error("UNAUTHORIZED_USER")
    END IF

    IF NOT targetSession.needsConfirmation(NOW()) THEN
        THROW Error("SESSION_NOT_AWAITING_CONFIRMATION")
    END IF

    IF isConducted THEN
        targetStatus <- SessionStatus.SELESAI
        targetReason <- NULL
    ELSE
        targetStatus <- SessionStatus.TIDAK_TERLAKSANA
        targetReason <- reason
    END IF

    RETURN AWAIT THIS.updateSessionStatus(targetSession, targetStatus, targetReason)
END FUNCTION
```

*Catatan: Kelas `SessionControl` tidak mengeksekusi query basis data secara langsung. Seluruh operasi pembacaan (getter) dan penulisan (setter/CRUD) basis data dienkapsulasi di dalam kelas entitas `Session` dan `Preference` sesuai prinsip pemrograman berorientasi objek (OOP).*

## 5.14 Kelas FeedbackControl

**Nama Kelas:** *FeedbackControl*  
**ID Kelas:** *C14*

Tabel 5.14.1. Operasi Kelas FeedbackControl

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `checkFeedbackEligibility(idSession: string, idMentee: string): Promise<boolean>` | `public` | Memeriksa kelayakan Mentee dalam memberikan penilaian pada suatu sesi (memastikan sesi berstatus Selesai, Mentee terdaftar sebagai partisipan, dan Mentee belum pernah mengirim *feedback* pada sesi tersebut). |
| `validateFeedback(rating: number, comment?: string): boolean` | `public` | Memvalidasi masukan penilaian agar nilai *rating* berada pada rentang integer 1 hingga 5 dan panjang ulasan teks tidak melebihi batas karakter maksimum. |
| `submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>` | `public` | Mengoordinasikan pengiriman *feedback* dari antarmuka dengan memverifikasi kelayakan serta validitas input sebelum meneruskannya ke operasi `saveFeedback()`. |
| `saveFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>` | `private` | Menginstansiasi objek entitas `Feedback`, mengatur nilai atributnya melalui setter (`setRating()`, `setComment()`), dan memanggil metode persistensi pada entitas `Feedback` (`feedback.save()`). |
| `retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>` | `public` | Memverifikasi kepemilikan sesi oleh Mentor dan status selesai pada entitas `Session`, lalu mengambil daftar objek `Feedback` melalui metode getter entitas `Feedback.getFeedbackBySession(idSession)`. |

Tabel 5.14.2. Atribut Kelas FeedbackControl

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `feedbackList` | `private` | `Feedback[]` |

### 5.14.1 Algoritma/Query

**Nama Kelas:** *FeedbackControl*  
**Nama Operasi:** `submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>`  
**ID Algoritma:** *Algo-C14-01*

```text
FUNCTION submitFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>
    isEligible <- AWAIT THIS.checkFeedbackEligibility(idSession, idMentee)
    IF NOT isEligible THEN
        THROW Error("FEEDBACK_NOT_ELIGIBLE")
    END IF

    IF NOT THIS.validateFeedback(rating, comment) THEN
        THROW Error("INVALID_FEEDBACK_DATA")
    END IF

    savedFeedback <- AWAIT THIS.saveFeedback(idSession, idMentee, rating, comment)
    APPEND savedFeedback TO THIS.feedbackList
    RETURN savedFeedback
END FUNCTION

FUNCTION saveFeedback(idSession: string, idMentee: string, rating: number, comment?: string): Promise<Feedback>
    // Pembuatan dan penyimpanan data didelegasikan ke setter/CRUD kelas entitas Feedback
    feedbackObj <- NEW Feedback(idSession, idMentee)
    feedbackObj.setRating(rating)
    feedbackObj.setComment(comment)
    RETURN AWAIT feedbackObj.save()
END FUNCTION
```

**Nama Kelas:** *FeedbackControl*  
**Nama Operasi:** `retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>`  
**ID Algoritma:** *Algo-C14-02*

```text
FUNCTION retrieveFeedbackBySession(idSession: string, idMentor: string): Promise<Feedback[]>
    session <- AWAIT Session.getSessionById(idSession)
    IF session IS NULL THEN
        THROW Error("SESSION_NOT_FOUND")
    END IF

    IF NOT session.isOwnedBy(idMentor) THEN
        THROW Error("FORBIDDEN_NOT_HOST")
    END IF

    IF NOT session.isCompleted() THEN
        THROW Error("SESSION_NOT_COMPLETED")
    END IF

    // Pengambilan daftar feedback didelegasikan ke metode getter kelas entitas Feedback
    THIS.feedbackList <- AWAIT Feedback.getFeedbackBySession(idSession)
    RETURN THIS.feedbackList
END FUNCTION
```

*Catatan: Kelas `FeedbackControl` berfokus pada orkestrasi aturan bisnis dan validasi, sedangkan operasi pembacaan dan penyimpanan ke basis data dilakukan oleh kelas entitas `Feedback` dan `Session`.*

## 5.15 Kelas LoginPage

**Nama Kelas:** *LoginPage*  
**ID Kelas:** *C15*

Tabel 5.15.1. Operasi Kelas LoginPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showForm(mode: "LOGIN" \| "REGISTER"): void` | `public` | Menampilkan antarmuka formulir autentikasi sesuai mode yang dipilih pengguna (masuk akun atau pendaftaran akun baru). |
| `clickRegister(): void` | `public` | Menangani interaksi pengguna saat memilih tab atau tombol pendaftaran akun dan mengalihkan tampilan formulir ke mode `"REGISTER"`. |
| `submitForm(): Promise<void>` | `public` | Mengambil masukan kredensial dan data profil dari state formulir, lalu meneruskannya ke `UserControl.authLogin()` atau `UserControl.processRegistration()`. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan atau galat validasi (seperti domain email bukan institusi universitas) pada layar dengan tetap mempertahankan isian formulir. |
| `redirectToLogin(): void` | `public` | Mengarahkan pengguna kembali ke tampilan formulir masuk (login) setelah proses registrasi berhasil dilakukan. |
| `loadDashboard(): void` | `public` | Mengarahkan navigasi pengguna ke halaman beranda utama (`Dashboard`) setelah autentikasi berhasil diverifikasi. |

Tabel 5.15.2. Atribut Kelas LoginPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `formMode` | `private` | `"LOGIN" \| "REGISTER"` |
| `emailInput` | `private` | `string` |
| `passwordInput` | `private` | `string` |
| `profileInput` | `private` | `ProfileData \| null` |
| `warningMessage` | `private` | `string \| null` |
| `userControl` | `private` | `UserControl` |

### 5.15.1 Algoritma/Query

**Nama Kelas:** *LoginPage*  
**Nama Operasi:** `submitForm(): Promise<void>`  
**ID Algoritma:** *Algo-C15-01*

```text
FUNCTION submitForm(): Promise<void>
    THIS.warningMessage <- NULL
    TRY
        IF THIS.formMode == "REGISTER" THEN
            AWAIT THIS.userControl.processRegistration(THIS.emailInput, THIS.passwordInput, THIS.profileInput)
            THIS.redirectToLogin()
        ELSE
            AWAIT THIS.userControl.authLogin(THIS.emailInput, THIS.passwordInput)
            THIS.loadDashboard()
        END IF
    CATCH error
        IF error.message == "INVALID_UNIVERSITY_EMAIL" THEN
            THIS.showWarning("Harap gunakan email institusi universitas yang valid")
        ELSE
            THIS.showWarning(error.message)
        END IF
    END TRY
END FUNCTION
```

*Catatan: Kelas `LoginPage` merupakan kelas antarmuka (Boundary/View) sehingga tidak melakukan query ke basis data.*

## 5.16 Kelas ProfilePage

**Nama Kelas:** *ProfilePage*  
**ID Kelas:** *C16*

Tabel 5.16.1. Operasi Kelas ProfilePage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openProfile(idUser: string): Promise<void>` | `public` | Memuat halaman profil pengguna tertentu dengan meminta data identitas dan preferensi melalui `UserControl`. |
| `displayProfileData(profile: Profile): void` | `public` | Merender informasi identitas pengguna (nama, universitas, program studi, dan bio) yang diperoleh dari getter objek `Profile` ke layar. |
| `displayPreferenceData(preference: Preference): void` | `public` | Merender daftar tag materi, preferensi format sesi, dan ketersediaan waktu dari objek `Preference` ke layar. |
| `clickEditPreference(): void` | `public` | Membuka mode pengeditan formulir preferensi belajar bagi pemilik akun. |
| `showPreferenceForm(preference: Preference): void` | `public` | Menampilkan komponen pemilihan tag materi, format sesi (daring/luring), dan kalender ketersediaan waktu yang terisi data saat ini. |
| `submitUpdate(data: PreferenceData \| ProfileData): Promise<void>` | `public` | Mengirimkan pembaruan data profil atau preferensi yang telah diisi pengguna ke `UserControl.savePreference()` atau `UserControl.saveProfile()`. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan pada layar apabila terdapat pilihan preferensi yang belum diisi lengkap. |
| `showSuccessMessage(message: string): void` | `public` | Menampilkan notifikasi umpan balik keberhasilan penyimpanan pembaruan profil atau preferensi. |
| `showNotFound(message: string): void` | `public` | Menampilkan pesan bahwa profil pengguna tidak ditemukan apabila ID pengguna tidak valid atau akun telah dihapus. |

Tabel 5.16.2. Atribut Kelas ProfilePage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `targetUserId` | `private` | `string` |
| `currentProfile` | `private` | `Profile \| null` |
| `currentPreference` | `private` | `Preference \| null` |
| `isEditingPreference` | `private` | `boolean` |
| `feedbackBanner` | `private` | `string \| null` |
| `userControl` | `private` | `UserControl` |

### 5.16.1 Algoritma/Query

**Nama Kelas:** *ProfilePage*  
**Nama Operasi:** `openProfile(idUser: string): Promise<void>` dan `submitUpdate(data: PreferenceData): Promise<void>`  
**ID Algoritma:** *Algo-C16-01*

```text
FUNCTION openProfile(idUser: string): Promise<void>
    THIS.targetUserId <- idUser
    TRY
        profile <- AWAIT THIS.userControl.fetchUserProfile(idUser)
        preference <- AWAIT THIS.userControl.fetchUserPreference(idUser)
        THIS.displayProfileData(profile)
        THIS.displayPreferenceData(preference)
    CATCH error
        IF error.message == "USER_NOT_FOUND" THEN
            THIS.showNotFound("Profil pengguna tidak ditemukan")
        END IF
    END TRY
END FUNCTION

FUNCTION submitUpdate(data: PreferenceData): Promise<void>
    TRY
        updatedPref <- AWAIT THIS.userControl.savePreference(THIS.targetUserId, data)
        THIS.isEditingPreference <- FALSE
        THIS.displayPreferenceData(updatedPref)
        THIS.showSuccessMessage("Preferensi berhasil disimpan")
    CATCH error
        IF error.message == "INCOMPLETE_PREFERENCE" THEN
            THIS.showWarning("Silahkan Isi Semua Pilihan Preferensi")
        END IF
    END TRY
END FUNCTION
```

*Catatan: Kelas `ProfilePage` merupakan kelas antarmuka (Boundary/View) sehingga tidak mengeksekusi query basis data.*

## 5.17 Kelas SessionPage

**Nama Kelas:** *SessionPage*  
**ID Kelas:** *C17*

Tabel 5.17.1. Operasi Kelas SessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openSessionDetail(idSession: string): Promise<void>` | `public` | Memuat data detail sesi melalui `SessionControl.getSessionDetail()`, menampilkannya ke layar, serta memeriksa apakah sesi membutuhkan konfirmasi keterlaksanaan atau layak diberikan *feedback*. |
| `showSessionDetails(session: Session): void` | `public` | Menampilkan rincian informasi sesi (topik materi, jadwal, format belajar, kapasitas, daftar partisipan, dan status) menggunakan getter dari objek entitas `Session`. |
| `showConfirmationPrompt(promptText?: string): void` | `public` | Menampilkan dialog atau tombol konfirmasi keterlaksanaan sesi ("Terlaksana" dan "Tidak Terlaksana") maupun dialog konfirmasi aksi sesi. |
| `closeConfirmationPrompt(): void` | `public` | Menutup dialog konfirmasi yang sedang tampil di layar. |
| `clickConducted(): Promise<void>` | `public` | Menangani aksi pengguna saat menekan tombol "Terlaksana" dan memanggil `submitConfirmation(true, null)`. |
| `clickNotConducted(): void` | `public` | Menangani aksi pengguna saat menekan tombol "Tidak Terlaksana" dengan menampilkan kolom masukan alasan opsional (`showReasonField()`). |
| `showReasonField(): void` | `public` | Menampilkan kotak input teks opsional bagi pengguna untuk menuliskan alasan mengapa sesi tidak terlaksana. |
| `submitConfirmation(isConducted: boolean, reason?: string): Promise<void>` | `public` | Mengirimkan hasil konfirmasi keterlaksanaan sesi beserta alasan opsional ke `SessionControl.processSessionConfirmation()`. |
| `showSuccessMessage(message: string): void` | `public` | Menampilkan pesan notifikasi keberhasilan pembaruan status atau aksi pada halaman sesi. |
| `showWarning(message: string): void` | `public` | Menampilkan pesan peringatan apabila terjadi kendala validasi atau kegagalan pemrosesan aksi sesi. |

Tabel 5.17.2. Atribut Kelas SessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `confirmationPrompt` | `protected` | `string \| null` |
| `currentSession` | `protected` | `Session \| null` |
| `reasonInput` | `protected` | `string` |
| `isReasonFieldVisible` | `protected` | `boolean` |
| `sessionControl` | `protected` | `SessionControl` |

### 5.17.1 Algoritma/Query

**Nama Kelas:** *SessionPage*  
**Nama Operasi:** `submitConfirmation(isConducted: boolean, reason?: string): Promise<void>`  
**ID Algoritma:** *Algo-C17-01*

```text
FUNCTION submitConfirmation(isConducted: boolean, reason?: string): Promise<void>
    IF THIS.currentSession IS NULL THEN
        RETURN
    END IF

    TRY
        updatedSession <- AWAIT THIS.sessionControl.processSessionConfirmation(
            THIS.currentSession.getSessionID(),
            THIS.currentUserId,
            isConducted,
            reason
        )
        THIS.currentSession <- updatedSession
        THIS.closeConfirmationPrompt()
        THIS.showSessionDetails(updatedSession)
        THIS.showSuccessMessage("Status sesi berhasil diperbarui")
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION
```

*Catatan: Kelas `SessionPage` merupakan kelas antarmuka (Boundary/View) induk untuk tampilan sesi sehingga tidak mengeksekusi query basis data.*

## 5.18 Kelas HostSessionPage

**Nama Kelas:** *HostSessionPage*  
**ID Kelas:** *C18*

Tabel 5.18.1. Operasi Kelas HostSessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `clickCreateSession(): void` | `public` | Menangani aksi Mentor saat memilih menu "Buat Sesi Baru" dengan memanggil `showCreateForm()`. |
| `showCreateForm(): void` | `public` | Menampilkan formulir kosong untuk pembuatan sesi belajar baru (topik, jadwal, format daring/luring, dan batas kapasitas peserta). |
| `submitSessionData(data: SessionData): Promise<void>` | `public` | Mengirimkan data formulir sesi baru ke `SessionControl.processSessionCreation()` dan menampilkan rincian sesi yang baru dibuat. |
| `clickEditSession(): void` | `public` | Menangani aksi Mentor saat menekan tombol "Edit Sesi" pada halaman detail sesi. |
| `showEditForm(session: Session): void` | `public` | Menampilkan formulir pengubahan sesi yang telah terisi (*pre-filled*) dengan data sesi saat ini. |
| `submitSessionUpdate(data: SessionData): Promise<void>` | `public` | Mengirimkan perubahan data sesi yang diedit Mentor ke `SessionControl.editSession()`. |
| `clickDeleteSession(): void` | `public` | Menangani aksi Mentor saat menekan tombol "Hapus Sesi" dengan menampilkan dialog konfirmasi penghapusan (`showConfirmationPrompt("Hapus sesi ini?")`). |
| `confirmDelete(): Promise<void>` | `public` | Mengirimkan permintaan penghapusan sesi ke `SessionControl.deleteSession()` setelah Mentor menekan tombol konfirmasi "Ya, Hapus". |
| `cancelDelete(): void` | `public` | Membatalkan proses penghapusan sesi dan menutup dialog konfirmasi tanpa mengubah data sesi. |
| `clickViewFeedback(): Promise<void>` | `public` | Meminta daftar *feedback* sesi yang telah selesai melalui `FeedbackControl.retrieveFeedbackBySession()` ketika Mentor menekan tombol "Lihat Feedback". |
| `showFeedbackList(feedbackList: Feedback[]): void` | `public` | Menampilkan daftar penilaian (*rating* dan ulasan teks) yang diberikan oleh para Mentee pada sesi tersebut. |
| `showEmptyFeedback(): void` | `public` | Menampilkan informasi keadaan kosong apabila belum ada Mentee yang memberikan *feedback* pada sesi tersebut. |

Tabel 5.18.2. Atribut Kelas HostSessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `sessionFormData` | `private` | `SessionData \| null` |
| `sessionFeedbackList` | `private` | `Feedback[]` |
| `isEditMode` | `private` | `boolean` |
| `feedbackControl` | `private` | `FeedbackControl` |

### 5.18.1 Algoritma/Query

**Nama Kelas:** *HostSessionPage*  
**Nama Operasi:** `submitSessionData(data: SessionData): Promise<void>` dan `clickViewFeedback(): Promise<void>`  
**ID Algoritma:** *Algo-C18-01*

```text
FUNCTION submitSessionData(data: SessionData): Promise<void>
    TRY
        createdSession <- AWAIT THIS.sessionControl.processSessionCreation(THIS.mentorId, data)
        THIS.currentSession <- createdSession
        THIS.showSessionDetails(createdSession)
        THIS.showSuccessMessage("Sesi berhasil dibuat")
    CATCH error
        IF error.message == "INVALID_CAPACITY_MAX" THEN
            THIS.showWarning("Kapasitas maksimal adalah 20 orang")
        ELSE IF error.message == "INVALID_CAPACITY_MIN" THEN
            THIS.showWarning("Kapasitas minimum adalah 1 orang")
        ELSE IF error.message == "SCHEDULE_CONFLICT" THEN
            THIS.showWarning("Jadwal bertabrakan dengan sesi lain")
        END IF
    END TRY
END FUNCTION

FUNCTION clickViewFeedback(): Promise<void>
    feedbackList <- AWAIT THIS.feedbackControl.retrieveFeedbackBySession(
        THIS.currentSession.getSessionID(),
        THIS.mentorId
    )
    THIS.sessionFeedbackList <- feedbackList
    IF LENGTH(feedbackList) > 0 THEN
        THIS.showFeedbackList(feedbackList)
    ELSE
        THIS.showEmptyFeedback()
    END IF
END FUNCTION
```

*Catatan: Kelas `HostSessionPage` merupakan kelas antarmuka (Boundary/View) turunan dari `SessionPage` khusus untuk Mentor (host) sehingga tidak mengeksekusi query basis data.*

## 5.19 Kelas ParticipantSessionPage

**Nama Kelas:** *ParticipantSessionPage*  
**ID Kelas:** *C19*

Tabel 5.19.1. Operasi Kelas ParticipantSessionPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showSessionDetails(session: Session): void` | `public` | Menampilkan rincian sesi bagi Mentee dilengkapi tombol aksi kontekstual ("Gabung Sesi" jika belum terdaftar, atau "Batalkan Keikutsertaan" jika sudah terdaftar dan sesi belum dimulai). |
| `submitJoinRequest(idSession: string): Promise<void>` | `public` | Mengirimkan permintaan pendaftaran Mentee ke dalam sesi melalui `SessionControl.processRegistration()` saat tombol "Gabung Sesi" ditekan. |
| `clickCancelParticipation(): void` | `public` | Menampilkan dialog konfirmasi pembatalan keikutsertaan (`showConfirmationPrompt("Batalkan keikutsertaan pada sesi ini?")`) saat Mentee menekan tombol "Batalkan Keikutsertaan". |
| `confirmCancelParticipation(): Promise<void>` | `public` | Meneruskan konfirmasi pembatalan keikutsertaan Mentee ke `SessionControl.cancelSession()` dan memperbarui tampilan halaman sesi. |
| `clickBack(): void` | `public` | Menutup dialog konfirmasi pembatalan tanpa mengirimkan permintaan ke `SessionControl` sehingga Mentee tetap terdaftar. |

Tabel 5.19.2. Atribut Kelas ParticipantSessionPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `isRegisteredParticipant` | `private` | `boolean` |
| `idMentee` | `private` | `string` |

### 5.19.1 Algoritma/Query

**Nama Kelas:** *ParticipantSessionPage*  
**Nama Operasi:** `submitJoinRequest(idSession: string): Promise<void>` dan `confirmCancelParticipation(): Promise<void>`  
**ID Algoritma:** *Algo-C19-01*

```text
FUNCTION submitJoinRequest(idSession: string): Promise<void>
    TRY
        success <- AWAIT THIS.sessionControl.processRegistration(idSession, THIS.idMentee)
        IF success THEN
            THIS.isRegisteredParticipant <- TRUE
            THIS.showSuccessMessage("Berhasil bergabung")
        END IF
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION

FUNCTION confirmCancelParticipation(): Promise<void>
    TRY
        success <- AWAIT THIS.sessionControl.cancelSession(THIS.currentSession.getSessionID(), THIS.idMentee)
        IF success THEN
            THIS.isRegisteredParticipant <- FALSE
            THIS.closeConfirmationPrompt()
            THIS.showSuccessMessage("Berhasil Membatalkan Keikutsertaan")
        END IF
    CATCH error
        THIS.showWarning(error.message)
    END TRY
END FUNCTION
```

*Catatan: Kelas `ParticipantSessionPage` merupakan kelas antarmuka (Boundary/View) turunan dari `SessionPage` khusus untuk Mentee sehingga tidak mengeksekusi query basis data.*

## 5.20 Kelas FeedbackForm

**Nama Kelas:** *FeedbackForm*  
**ID Kelas:** *C20*

Tabel 5.20.1. Operasi Kelas FeedbackForm

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `showForm(idSession: string): void` | `public` | Menampilkan komponen formulir penilaian berisi pilihan *rating* (1–5 bintang), kolom komentar opsional, tombol "Kirim", serta tombol "Skip". |
| `submitFeedback(rating: number, comment?: string): Promise<void>` | `public` | Mengirimkan nilai *rating* dan ulasan komentar yang diisi Mentee ke `FeedbackControl.submitFeedback()`. |
| `clickSkip(): void` | `public` | Menangani aksi Mentee saat melewati pengisian penilaian dengan langsung menutup formulir (`closeForm()`) tanpa memanggil `FeedbackControl`. |
| `closeForm(): void` | `public` | Menutup dan menyembunyikan modal atau komponen formulir *feedback* dari layar pengguna. |
| `showThankYou(message: string): void` | `public` | Menampilkan pesan apresiasi ("Terima kasih atas feedback Anda") setelah penilaian berhasil disimpan. |

Tabel 5.20.2. Atribut Kelas FeedbackForm

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idSession` | `private` | `string` |
| `idMentee` | `private` | `string` |
| `rating` | `private` | `number` |
| `comment` | `private` | `string` |
| `isOpen` | `private` | `boolean` |
| `feedbackControl` | `private` | `FeedbackControl` |

### 5.20.1 Algoritma/Query

**Nama Kelas:** *FeedbackForm*  
**Nama Operasi:** `submitFeedback(rating: number, comment?: string): Promise<void>`  
**ID Algoritma:** *Algo-C20-01*

```text
FUNCTION submitFeedback(rating: number, comment?: string): Promise<void>
    THIS.rating <- rating
    THIS.comment <- comment
    AWAIT THIS.feedbackControl.submitFeedback(THIS.idSession, THIS.idMentee, THIS.rating, THIS.comment)
    THIS.closeForm()
    THIS.showThankYou("Terima kasih atas feedback Anda")
END FUNCTION

FUNCTION clickSkip(): void
    THIS.closeForm()
END FUNCTION
```

*Catatan: Kelas `FeedbackForm` merupakan kelas antarmuka (Boundary/View) sehingga tidak mengeksekusi query basis data.*

## 5.21 Kelas GroupChatPage

**Nama Kelas:** *GroupChatPage*  
**ID Kelas:** *C21*

Tabel 5.21.1. Operasi Kelas GroupChatPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openGroupChat(idSession: string): Promise<void>` | `public` | Membuka halaman ruang obrolan grup untuk sesi terkait, meminta riwayat pesan melalui pengontrol obrolan, dan mendaftarkan langganan pesan *real-time*. |
| `displayMessages(messages: ChatMessage[]): void` | `public` | Menampilkan daftar seluruh riwayat pesan obrolan secara kronologis saat ruang obrolan pertama kali dimuat. |
| `displayMessage(message: ChatMessage): void` | `public` | Menambahkan dan menampilkan satu pesan obrolan baru ke layar secara instan menggunakan getter pada objek `ChatMessage` (`getSender()`, `getTime()`, `getText()`). |
| `sendMessage(text: string): Promise<void>` | `public` | Mengirimkan teks pesan baru yang diketik pengguna ke ruang obrolan sesi dan memperbarui tampilan pesan di layar. |
| `onMessageReceived(message: ChatMessage): void` | `public` | *Callback handler* yang menerima siaran pesan baru secara *real-time* melalui WebSocket dari anggota grup lain dan memanggil `displayMessage(message)`. |
| `showChatExpired(message: string): void` | `public` | Menampilkan pemberitahuan bahwa masa aktif ruang obrolan sementara untuk sesi tersebut telah berakhir (melewati batas retensi 48 jam setelah sesi selesai). |
| `disableMessageInput(): void` | `public` | Menonaktifkan kotak input pengetikan dan tombol kirim pesan ketika grup obrolan sudah berakhir. |

Tabel 5.21.2. Atribut Kelas GroupChatPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `idGroupChat` | `private` | `string` |
| `messageList` | `private` | `ChatMessage[]` |
| `messageInput` | `private` | `string` |
| `isInputDisabled` | `private` | `boolean` |

### 5.21.1 Algoritma/Query

**Nama Kelas:** *GroupChatPage*  
**Nama Operasi:** `openGroupChat(idSession: string): Promise<void>` dan `sendMessage(text: string): Promise<void>`  
**ID Algoritma:** *Algo-C21-01*

```text
FUNCTION openGroupChat(idSession: string): Promise<void>
    TRY
        chatData <- AWAIT chatController.getGroupChat(idSession, THIS.currentUserId)
        THIS.idGroupChat <- chatData.groupChat.getId()
        THIS.messageList <- chatData.messages
        THIS.displayMessages(THIS.messageList)
    CATCH error
        IF error.message == "CHAT_EXPIRED" THEN
            THIS.showChatExpired("Group chat untuk sesi ini telah berakhir")
            THIS.disableMessageInput()
        END IF
    END TRY
END FUNCTION

FUNCTION sendMessage(text: string): Promise<void>
    IF THIS.isInputDisabled OR TRIM(text) == "" THEN
        RETURN
    END IF

    newMsg <- AWAIT chatController.sendMessage(THIS.idGroupChat, THIS.currentUserId, text)
    APPEND newMsg TO THIS.messageList
    THIS.displayMessage(newMsg)
    THIS.messageInput <- ""
END FUNCTION
```

*Catatan: Kelas `GroupChatPage` merupakan kelas antarmuka (Boundary/View) sehingga tidak mengeksekusi query basis data.*

## 5.22 Kelas Notification

**Nama Kelas:** *Notification*  
**ID Kelas:** *C22*

Tabel 5.22.1. Operasi Kelas Notification

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>` | `public` | Operasi CRUD (Create) pada kelas entitas untuk menyimpan rekaman notifikasi pengingat baru ke dalam basis data dan mengembalikan objek `Notification`. |
| `findById(idNotification: string): Promise<Notification \| null>` | `public` | Operasi getter statis (Read) untuk mengambil satu objek entitas `Notification` dari basis data berdasarkan ID notifikasi. |
| `getNotificationsByUser(idUser: string): Promise<Notification[]>` | `public` | Operasi getter statis (Read) untuk mengambil daftar seluruh notifikasi milik seorang pengguna dari basis data. |
| `markAsRead(): Promise<boolean>` | `public` | Operasi setter/mutator (Update) pada entitas yang mengubah atribut `isRead` menjadi `true` dan memperbarui status terbaca di basis data. |
| `showContent(): string` | `public` | Operasi getter untuk mengembalikan gabungan judul dan isi teks pesan pengingat notifikasi (`title` dan `content`). |
| `getTime(): Date` | `public` | Operasi getter untuk mengembalikan waktu pembuatan atau pengiriman notifikasi (`timestamp`). |
| `getNotificationId(): string` | `public` | Operasi getter untuk mengembalikan identitas unik notifikasi (`notificationId`). |
| `getSessionId(): string` | `public` | Operasi getter untuk mengembalikan identitas sesi belajar yang terkait dengan notifikasi (`idSession`). |
| `getIsRead(): boolean` | `public` | Operasi getter untuk memeriksa apakah notifikasi sudah dibaca oleh pengguna (`isRead`). |
| `openApp(): string` | `public` | Mengembalikan tautan rute detail sesi tujuan (`/sessions/{idSession}`) ketika objek notifikasi diakses untuk membuka aplikasi. |

Tabel 5.22.2. Atribut Kelas Notification

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `notificationId` | `private` | `string` |
| `idUser` | `private` | `string` |
| `idSession` | `private` | `string` |
| `title` | `private` | `string` |
| `content` | `private` | `string` |
| `timestamp` | `private` | `Date` |
| `isRead` | `private` | `boolean` |

### 5.22.1 Algoritma/Query

**Nama Kelas:** *Notification*  
**Nama Operasi:** `create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>` dan `markAsRead(): Promise<boolean>`  
**ID Algoritma:** *Algo-C22-01*

```text
STATIC FUNCTION create(idUser: string, idSession: string, title: string, content: string): Promise<Notification>
    row <- AWAIT Database.executeQuery(Q-C22-01, [idUser, idSession, title, content])
    RETURN NEW Notification(
        row.notification_id,
        row.id_user,
        row.id_session,
        row.title,
        row.content,
        row.timestamp,
        row.is_read
    )
END FUNCTION

FUNCTION markAsRead(): Promise<boolean>
    THIS.isRead <- TRUE
    AWAIT Database.executeQuery(Q-C22-03, [THIS.notificationId])
    RETURN TRUE
END FUNCTION
```

Tabel 5.22.3. Query Operasi Kelas Notification

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-C22-01* | `INSERT INTO notifications (id_user, id_session, title, content, timestamp, is_read) VALUES ($1, $2, $3, $4, NOW(), FALSE) RETURNING *;` | Menyimpan entitas notifikasi pengingat sesi baru ke dalam tabel `notifications` (operasi Create). |
| *Q-C22-02* | `SELECT * FROM notifications WHERE notification_id = $1;` | Mengambil data entitas notifikasi berdasarkan `notification_id` (operasi Read pada `findById`). |
| *Q-C22-03* | `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1;` | Memperbarui status `is_read` menjadi `TRUE` saat notifikasi dibaca pengguna (operasi Update pada `markAsRead`). |
| *Q-C22-04* | `SELECT * FROM notifications WHERE id_user = $1 ORDER BY timestamp DESC;` | Mengambil daftar seluruh notifikasi milik seorang pengguna diurutkan dari yang terbaru (operasi Read pada `getNotificationsByUser`). |

## 5.23 Kelas PopUpNotification

**Nama Kelas:** *PopUpNotification*  
**ID Kelas:** *C23*

Tabel 5.23.1. Operasi Kelas PopUpNotification

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `onNotificationReceived(notification: Notification): void` | `public` | Menerima objek `Notification` yang dikirim secara *real-time* (15 menit sebelum sesi dimulai) dan memicu penampilan *pop-up* di layar pengguna. |
| `showPopUp(notification: Notification): void` | `public` | Menampilkan komponen visual *pop-up* notifikasi pada antarmuka pengguna. |
| `showContent(): string` | `public` | Mengambil dan menampilkan teks isi pesan pengingat dengan memanggil getter `activeNotification.showContent()` pada entitas `Notification`. |
| `getTime(): Date` | `public` | Mengambil dan menampilkan waktu pengingat dengan memanggil getter `activeNotification.getTime()` pada entitas `Notification`. |
| `clickNotification(idNotification: string): Promise<void>` | `public` | Menangani interaksi pengguna saat menekan *pop-up* notifikasi dengan menandainya sebagai telah dibaca (`markAsRead()`) dan mengarahkan pengguna ke halaman sesi (`openApp()`). |
| `markAsRead(): Promise<void>` | `public` | Meneruskan perintah pembaruan status terbaca untuk notifikasi yang sedang aktif. |
| `openApp(): void` | `public` | Mengarahkan pengguna ke halaman detail sesi (`SessionPage.openSessionDetail()`) sesuai rute dari `activeNotification.openApp()`. |

Tabel 5.23.2. Atribut Kelas PopUpNotification

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `activeNotification` | `private` | `Notification \| null` |
| `isVisible` | `private` | `boolean` |

### 5.23.1 Algoritma/Query

**Nama Kelas:** *PopUpNotification*  
**Nama Operasi:** `clickNotification(idNotification: string): Promise<void>`  
**ID Algoritma:** *Algo-C23-01*

```text
FUNCTION onNotificationReceived(notification: Notification): void
    THIS.activeNotification <- notification
    THIS.isVisible <- TRUE
    THIS.showPopUp(notification)
END FUNCTION

FUNCTION clickNotification(idNotification: string): Promise<void>
    IF THIS.activeNotification IS NOT NULL THEN
        AWAIT THIS.markAsRead()
        THIS.isVisible <- FALSE
        THIS.openApp()
    END IF
END FUNCTION
```

*Catatan: Kelas `PopUpNotification` merupakan kelas antarmuka (Boundary/View) penampil notifikasi sehingga tidak mengeksekusi query basis data secara langsung.*

## 5.24 Kelas HistoryPage

**Nama Kelas:** *HistoryPage*  
**ID Kelas:** *C24*

Tabel 5.24.1. Operasi Kelas HistoryPage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| `openHistory(): Promise<void>` | `public` | Memuat halaman riwayat sesi pengguna dengan meminta objek `SessionHistory` melalui `SessionControl.fetchUserHistory()`. |
| `displayHistoryList(history: SessionHistory): void` | `public` | Mengambil pengelompokan arsip sesi berdasarkan status akhir (Selesai, Tidak Terlaksana, Dibatalkan) dari objek entitas `SessionHistory` dan merendernya ke layar. |
| `showEmptyState(message: string): void` | `public` | Menampilkan pesan keadaan kosong ("Belum ada sesi") apabila objek `SessionHistory` pengguna belum memiliki arsip sesi berstatus akhir. |
| `selectSession(idSession: string): void` | `public` | Menangani interaksi pengguna saat memilih salah satu kartu sesi pada daftar riwayat dan membuka detail sesi tersebut melalui `SessionPage.openSessionDetail(idSession)`. |

Tabel 5.24.2. Atribut Kelas HistoryPage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| `historyList` | `private` | `SessionHistory \| null` |
| `selectedStatusFilter` | `private` | `SessionStatus \| "ALL"` |
| `sessionControl` | `private` | `SessionControl` |
| `sessionPage` | `private` | `SessionPage` |

### 5.24.1 Algoritma/Query

**Nama Kelas:** *HistoryPage*  
**Nama Operasi:** `openHistory(): Promise<void>`  
**ID Algoritma:** *Algo-C24-01*

```text
FUNCTION openHistory(): Promise<void>
    history <- AWAIT THIS.sessionControl.fetchUserHistory(THIS.currentUserId)
    THIS.historyList <- history

    IF history.isEmpty() THEN
        THIS.showEmptyState("Belum ada sesi")
    ELSE
        groupedSessions <- history.getGroupedByStatus()
        THIS.displayHistoryList(history)
    END IF
END FUNCTION

FUNCTION selectSession(idSession: string): void
    THIS.sessionPage.openSessionDetail(idSession)
END FUNCTION
```

*Catatan: Kelas `HistoryPage` merupakan kelas antarmuka (Boundary/View) sehingga tidak mengeksekusi query basis data.*



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
