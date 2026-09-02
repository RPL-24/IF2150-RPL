<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *Nama Perangkat Lunak*

### Untuk: Amanda Aurellia Salsabilla

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K02 |
| Kelompok | 4  |

| NIM | Nama |
|---|---|
| 13525029 | Muhammad Naufal Hilmi |
| 13525077 | Muhammad Abduh |
| 13525107 | Nathaniel Marvelo |
| 13525113 | Diandra Aria Yufana |
| 13525143 | Natan Danuarta Ariel Wicaksana |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Indonesia sebagai salah satu negara multikultural terbesar di dunia memiliki kurang lebih 1340 suku bangsa. Keberagaman yang dimiliki bangsa Indonesia ini menghasilkan berbagai kekayaan budaya, termasuk kurang lebih 700 bahasa daerah yang beberapa diantaranya memiliki sistem penulisan aksara yang unik. Bahasa-bahasa ini bukan hanya menjadi alat komunikasi sehari-hari, tetapi juga memuat nilai-nilai adat istiadat dari tiap daerah.

## 1.2 Analisis Kondisi Saat Ini
Bahasa lokal yang merupakan kekayaan bangsa ini sekarang tengah mengalami tantangan. Ancaman dari luar seperti globalisasi menjadikan penggunaan bahasa lokal makin ditinggalkan oleh golongan muda. Padahal, bahasa lokal yang merupakan kekayaan bangsa seharusnya dilestarikan. 

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Ngaksara merupakan solusi perangkat lunak yang kami usulkan sebagai upaya pemenuhan SDGs 14 (Quality Education) berbasis website. Alasan kami memilih media situs web adalah untuk memperluas aksesiblitas perangkat lunak kami serta tidak perlu ada prasyarat untuk mengunduh aplikasi terlebih dahulu. Situs ini dirancang untuk menunjang proses pembelajaran bahasa baru, dengan fokus pada bahasa dengan aksara/karakter yang rumit. Dengan aplikasi ini, kami berharap untuk dapat berkontribusi dalam pembelajaran berbagai bahasa, mulai dari bahasa lokal maupun global. Salah satu fitur yang terdapat dalam Ngaksara adalah fitur menggambar suatu karakter sesuai dengan outline karakter tersebut, dengan opsi untuk menggambar tanpa outline bagi pengguna yang sudah mahir. Hasil gambar pengguna kemudian akan dinilai keakuratannya dengan karakter asli. Selain itu, fitur mencocokan aksara dengan pelanturan serta fitur menulis pelanturan karakter merupakan solusi kami untuk  meningkatkan familiaritas dan pemahaman akan pelanturan karakter.

## 2.2 Asumsi dan Batasan
Perancangan dan pengembangan Ngaksara dilandasi oleh sejumlah asumsi, baik secara teknis maupun kemampuan pengguna. Asumsi teknis mencakup kondisi sistem dan kapasitas perangkat lunak untuk menunjang keberlangsungan operasi. Sedangkan, asumsi pengguna mencakup kemampuan individu pengguna untuk dapat mengoperasikan perangkat lunak sesuai dengan tujuan.
| Kategori | Asumsi |
| --- | --- |
| Teknis | Sistem dapat berjalan sesuai dengan fungsi yang dimaksudkan dan dapat diperbarui pada aspek fitur tertentu |
| Teknis | Sistem mampu berjalan secara berkesinambung dan melayani permintaan pengguna tanpa adanya gangguan yang berarti |
| Pengguna | Pengguna memiliki gawai serta infrastruktur yang memadai untuk menunjang penggunaan perangkat lunak |
| Pengguna | Pengguna memiliki kemampuan untuk mengoperasikan website, seperti mendaftarkan akun, menggunakan fitur-fitur yang tersedia, dan melaporkan permasalahan yang muncul |
| Pengguna | Pengguna memiliki kemampuan untuk mengunggah materi yang sesuai dan mampu mengelola data-data pelajar dibawahnya |

Selain asumsi di atas, terdapat sejumlah batasan yang melatarbelakangi pengembangan perangkat lunak akmi. Keterbatasan berasal dari penetapan fitur dan skema yang realistis, keterbatasan sumber daya, dan regulasi terkait.
| Kategori | Batasan |
| --- | --- |
| Fitur | Fitur yang ditawarkan harus dapat direalisasikan tanpa ada reduksi fitur yang berarti |
| Sumber Daya | Sistem harus dapat direalisasikan sesuai dengan constraint yang ada, sumber daya manusia dan kemampuan personil |
| Sumber Daya | Prioritas sistem diletakkan pada fitur inti, pemaparan pengetahuan dan penunjang pembelajaran |
| Regulasi | Perangkat lunak dapat dipergunakan sesuai dengan regulasi dari lembaga terkait untuk menunjang penggunaan Ngaksara sebagai sarana perolehan sertifikat kemahiran bahasa |

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| Pelajar | Pengguna ini bertindak sebagai pihak yang memanfaatkan perangkat lunak sebagai sarana untuk belajar, berlatih, dan mengembangkan kemampuan menulis aksara XXX. Karakteristik dari pengguna ini adalah membutuhkan pembelajaran yang interaktif, mudah dipahami, dan memberikan umpan balik seperti dalam bentuk nilai. |
| Guru | Pengguna ini bertindak sebagai pendamping dan fasilitator dalam proses pembelajaran aksara XXX. Karakteristik pengguna ini adalah membutuhkan media pembelajaran yang praktis dan menarik untuk proses pembelajaran para pelajar. |


## 3.2 Kebutuhan Pengguna Awal
Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Pelajar* |  *Melihat daftar bentuk dasar aksara XX beserta panduan cara membacanya* | *Dapat menghafal dan mengealibentuk dasar setiap huruf dengan benar.* |
| US-02 | *Pelajar* | *Melatih penulisan aksara dengan menebalkan garis panduan di layar perangkat.* | *Terbiasa dengan alur, urutan, dan arah goresan penulisan aksara yang tepat* |
| US-03 | *Pelajar* | *Mendapatkan penilaian dan koreksi otomatis setelah menggambar aksara di layar* | *Mengetahui letak kesalahan goresan dan dapat memperbaiki akurasi tulisan.* |
| US-04 | *Guru* | *Sebagai media bagi guru untuk mengajar.* | *Membantu guru melatih siswa dalam memahami aksara XX.* |


## 3.3 Model Proses Bisnis
Buatlah *Activity Diagram* atau *Swimlane Diagram* yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
