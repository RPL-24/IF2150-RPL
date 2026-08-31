<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## _Nama Perangkat Lunak_

### Untuk: _[Nama Asisten]_

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | _\[Kelas\]_ |
| Kelompok | _\[Nomor Kelompok\]_ |

| NIM       | Nama               |
| --------- | ------------------ |
| _[NIM 1]_ | _[Nama Anggota 1]_ |
| _[NIM 2]_ | _[Nama Anggota 2]_ |
| _[NIM 3]_ | _[Nama Anggota 3]_ |
| _[NIM 4]_ | _[Nama Anggota 4]_ |
| _[NIM 5]_ | _[Nama Anggota 5]_ |

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
| Sistem Admin | _Mengelola sumber dan data spesies_ |
| Pihak Berwenang | _Penerima laporan terverifikasi, yang menindak lanjuti_ |
| Owner Platform | _Menerima laporan user yang melanggar aturan agar bisa ditindaklanjuti sesuai aturan platform_ |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Admin_        | _Saya ingin mengelola daftar sumber pemantauan dan data spesies dilindungi_ | _sehingga sistem tetap akurat_ |
| US-02 | _Pihak berwenang_ | _Saya ingin menerima laporan yang terverifikasi_    | _sehingga bisa langsung ditindaklanjuti_              |
| US-03 | _Owner Platform_ | _Saya ingin platform bebas dari barang illegal_    | _sehingga aman dan nyaman bagi pengguna_              |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Deskripsi Aktivitas
Buatlah daftar seluruh aktivitas yang terdapat dalam sistem solusi, lengkap dengan ID dan penjelasan. Telusuri hubungan aktivitas tersebut dengan user story yang sudah dituliskan sebelumnya. Bisa dibuat dalam bentuk tabel.
| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | Mengelola Sumber Pemantauan | Admin bisa menambah, mengurangi, mengubah platform data dan kata kunci sistem | US-01 |
| A02 | Mengelola Basis Data Spesies | Admin bisa meng-update list database satwa dilindungi dari sumber terpercaya | US-01 |
| A03 | Menampilkan Statistik Pemantauan | Sistem bisa menampilkan data berupa list atau chart jumlah temuan | US-01 |
| A04 | Mengirimkan Laporan ke Instansi | Sistem bisa memberi laporan kepada pihak berwenang  | US-02 |
| A05 | Menindaklanjuti Temuan | Pihak berwenang menerima laporan, menilai, dan melaksanakan tindak lanjut sesuai kewenangannya | US-03 |
| ... | ... | ... | ... |

## 3.4 Model Proses Bisnis
Buatlah Activity Diagram atau Swimlane Diagram yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

# Referensi

- Diagram UML: https://www.drawio.com/, https://staruml.io/