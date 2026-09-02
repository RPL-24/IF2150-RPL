<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## _Nama Perangkat Lunak_

### Untuk: _Mikhael Andrian Yonatan_

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | _K01_ |
| Kelompok | _G09_ |

| NIM        | Nama                              |
| ---------- | --------------------------------- |
| _13525049_ | _Hugo Daniel Johansen Napitupulu_ |
| _13525028_ | _Markus Christiano Simanjutak_    |
| _13525025_ | _David Christian_                 |
| _13525001_ | _Matthew Allen Reynaldo_          |
| _13525010_ | _Fabian Amzar Susanto_            |

---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah

Penjualan hewan langka di black market listings
Poacher sering memburu hewan tsb dan menjualnya
Terkadang terjual juga di website listing yang publik dan umum seperti e-bay

Perdagangan satwa dan flora liar ilegal merupakan salah satu penyebab rusaknya keanekaragaman hayati darat, yang berujung pada ancaman kepunahan spesies endemik. Hal ini merupakan salah satu pengancam pencapaian Sustainable Development Goals (SDGs) Nomor 15: Life on Land yang bertujuan untuk melindungi, memulihkan, dan menghentikan hilangnya keanekaragaman hayati.

Dari perdagangan ilegal ini, komunitas oknum pemburu dan penjual satwa dan flora terancam ini akan terus ada dan dapat mendukung pertumbuhan komunitas oknum tersebut.
Dulu, perdagangan ilegal ini dilakukan di pasar gelap fisik. Namun seiring berkembangnya dunia digital, aktivitas perdagangan ilegal ini dapat dilakukan dengan lebih masif dan lebih mudah dengan adanya internet, social media dan platform e-commerce.

(Data dan argumen pendukung tambahannya akan dibuat lagi nanti)

## 1.2 Analisis Kondisi Saat Ini

Lakukan analisis terhadap proses yang berjalan saat ini di dunia nyata, baik itu sistem lama ataupun solusi yang sudah ada. Soroti kesenjangan atau celah dari kondisi tersebut yang nantinya akan diselesaikan oleh perangkat lunak kalian.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak

Sebuah bot pemantau otomatis dengan UI desktop application yang dirancang untuk membantu investigator untuk mendeteksi perdagangan satwa liar ilegal di internet secara otomatis.

Dari POV user, bot bekerja dengan melakukan web-scraping di medsos dan e-commerce untuk menganalisis gambar, serta mengekstrak informasi dari satwa tanpa pencarian manual. Platform desktop dipilih agar memudahkan user dengan memberikan UI yang mudah dimanfaatkan

Nilai inovasi:

1. NLP dilatih dengan slang/kode lokal Indonesia

<!-- Abstraksikan solusi perangkat lunak yang diusulkan dari sudut pandang pengguna. Jelaskan target platform yang akan digunakan (misalnya: desktop application) beserta alasan pemilihannya. Deskripsikan juga nilai unik (inovasi inti) dari perangkat lunak kalian dan apa yang membedakannya dari solusi yang sudah ada. -->

## 2.2 Asumsi dan Batasan

Definisikan secara tegas asumsi (baik teknis maupun dari sisi pengguna) yang menjadi dasar pengembangan. Tuliskan batasan seperti regulasi/hukum, keterbatasan sumber daya, dan ruang lingkup solusi.

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor   | Deskripsi                                                                                                                                                                                                                         |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tutor | _User yang mendaftarkan materi, Menentukan ketersediaan waktu dan kapasitas peserta per sesi, lalu memberi materi pada sesi yang terbentuk. Satu orang dapat berperan sebagai Tutor sekaligus Mentee untuk materi yang berbeda_ |
| Mentee | _User yang mendaftarkan materi yang ingin dipelajarinya beserta ketersediaan waktunya, lalu mengikuti sesi belajar bersama Tutor atau sesama Mentee_ |
| Sistem | _Menjalankan pencocokan tutor dan mentee secara terjadwal berdasarkan materi dan waktu, serta mencatat keterlaksanaan sesi_ |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Tutor_  | _Saya ingin mendaftar dan masuk menggunakan akun pribadi_ | _sehingga saya bisa mengakses semua fitur_ |
| US-02 | _Tutor_  | _Saya ingin mengisi materi yang saya bisa_ | _sehingga saya dipertemukan dengan orang yang membutuhkannya_ |
| US-03 | _Tutor_  | _Saya ingin mengisi ketersediaan waktu_ | _sehingga saya tidak dipasangkan pada jadwal yang saya tidak bisa_ |
| US-04 | _Tutor_  | _Saya ingin menetapkan jumlah maksimum peserta dalam satu sesi_ | _sehingga sesi tetap efektif_ |
| US-05 | _Tutor_  | _Saya ingin menerima info mentee beserta materi dan waktunya_ | _sehingga saya tahu harus bertemu siapa dan kapan_ |
| US-06 | _Tutor_  | _Saya ingin menolak mentee yang tidak sesuai_ | _sehingga saya dipertemukan dengan orang yang tepat_ |
| US-07 | _Tutor_  | _Saya ingin mencatat apakah sesi jadi terlaksana_ | _sehingga catatan sistem sesuai keadaan sebenarnya_ |
| US-08 | _Tutor_  | _Saya ingin melihat riwayat sesi yang pernah saya jalani_ | _sehingga saya bisa mengecek apa saja yang sudah saya ajarkan_ |
| US-09 | _Tutor_  | _Saya ingin memberi penilaian singkat setelah sesi_ | _sehingga kualitas pencocokan berikutnya membaik_ |
| US-10 | _Mentee_ | _Saya ingin mendaftar dan masuk menggunakan akun pribadi_ | _sehingga saya bisa mengakses semua fitur_ |
| US-11 | _Mentee_ | _Saya ingin mengisi materi yang ingin saya pelajari_ | _sehingga saya memperoleh bantuan yang sesuai_ |
| US-12 | _Mentee_ | _Saya ingin mengisi ketersediaan waktu_ | _sehingga saya tidak dipasangkan pada jadwal yang saya tidak bisa_ |
| US-13 | _Mentee_ | _Saya ingin menerima info tutor atau teman beserta materi dan waktunya_ | _sehingga saya tahu harus bertemu siapa dan kapan_ |
| US-14 | _Mentee_ | _Saya ingin menolak tutor atau teman yang tidak sesuai_ | _sehingga saya dipertemukan dengan orang yang saya setujui_ |
| US-15 | _Mentee_ | _Saya ingin mencatat apakah sesi jadi terlaksana_ | _sehingga catatan sistem sesuai keadaan sebenarnya_ |
| US-16 | _Mentee_ | _Saya ingin melihat riwayat sesi yang pernah saya jalani_ | _sehingga saya bisa menelusuri apa saja yang sudah saya pelajari_ |
| US-17 | _Mentee_ | _Saya ingin memberi penilaian singkat setelah sesi_ | _sehingga kualitas pencocokan berikutnya membaik dan bisa melaporkan yang bermasalah_ |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Deskripsi Aktivitas
Buatlah daftar seluruh aktivitas yang terdapat dalam sistem solusi, lengkap dengan ID dan penjelasan. Telusuri hubungan aktivitas tersebut dengan user story yang sudah dituliskan sebelumnya. Bisa dibuat dalam bentuk tabel.
| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | Melakukan Registrasi dan Autentikasi | User mendaftar dan masuk menggunakan akun pribadi | US-01 US-02 |
| A02 | Mengisi Kebutuhan Materi  | User memilih materi yang ingin dipelajari dan dikuasai | US-01 US-02 |
| A03 | Mengisi Ketersediaan Waktu | User menandai waktu saat mereka bisa | US-01 US-02 |
| A04 | Menetapkan Kapasitas Sesi | User menentukan jumlah maksimum orang pada sesi  | US-03 |
| A05 | Menjalankan Pencocokan Jadwal | Sistem mencocokan tutor dan mentee berdasarkan materi dan waktu | US-04 |
| A06 | Mengonfirmasi atau Menolak tutor atau teman | Kedua pihak menyetujui atau menolak pasangan yang diusulkan | US-05 |
| A07 | Melaksanakan Sesi Belajar | Kedua pihak bertemu sesuai kesepakatan bisa offline atau online | US-04 |
| A08 | Konfirmasi Sesi | Sistem menanyakan dan mencatat sesi  | US-06 |
| A09 | Melihat History Sesi | User bisa melihat daftar sesi yang pernah dijalaninya sebagai tutor atau mentee  | US-07 |
| A10 | Memberikan Feedback Sehabis Sesi | User memberi penilaian singkat dan catatan opsional ke orang pada sesi tersebut  | US-08 |
| ... | ... | ... | ... |

## 3.4 Model Proses Bisnis
Buatlah Activity Diagram atau Swimlane Diagram yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

# Referensi

- Diagram UML: https://www.drawio.com/, https://staruml.io/