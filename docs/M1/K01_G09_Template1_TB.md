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

Saat ini, upaya pelacakan perdagangan satwa dan flora liar di internet sebenarnya telah memanfaatkan teknologi tingkat tinggi di skala global. Sistem pemantauan raksasa seperti AI Guardian (dikembangkan oleh IFAW dan Baidu) atau ECO-SOLVE telah menggunakan Kecerdasan Buatan (AI) untuk menyaring jutaan data di platform besar.

Namun, keberadaan teknologi ini menunjukkan gap aktual, khususnya untuk penerapan di negara berkembang seperti Indonesia apalagi di daerah lokal. Terdapat tiga gap utama dari teknologi yang sudah ada saat ini:   
1. Bersifat Tertutup (Closed-Source): Teknologi pelacakan yang ada saat ini dimiliki dan dikembangkan perusahaan teknologi besar dan hanya diakses oleh penegak hukum. Sistem ini bersifat closed-source, artinya pihak luar atau publik tidak bisa melihat, memodifikasi, atau memakai kode programnya untuk digunakan atau dikembangkan mandiri.
2. Sistem Terlalu Berat dan Membutuhkan Biaya Besar: Sistem global mengandalkan Large Language Models (LLM), Computer Vision, dan AI yang membutuhkan daya komputasi dan budget yang sangat besar.
3. Tidak Tahu Konteks Pasar Gelap Lokal: AI buatan perusahaan multinasional dilatih menggunakan bahasa baku dan bahasa luar, bukan Bahasa Indonesia ataupun buzzword lokal. Akibatnya, sistem mereka sering kali gagal beradaptasi saat pedagang di Indonesia memodifikasi teks, menggunakan singkatan daerah atau menggunakan buzzword mereka sendiri.

Berdasarkan gaps tersebut, petugas konservasi umumnya membutuhkan solusi yang lebih terjangkau. Oleh karena itu, perangkat lunak ini dapat dikembangkan sebagai bot pelacak (web scraper) yang ringan, murah, dan dapat digunakan siapapun. Alih-alih menggunakan teknologi yang berat dan rumit, perangkat lunak ini berfokus pada teknologi sistem pencocokan teks menggunakan database kamus buzzword pasar gelap lokal. Dengan struktur yang lebih ringan dan sederhana, perangkat lunak ini dapat dijalankan dengan mudah pada komputer/device pihak berwenang untuk menyaring forum dan komunitas jual-beli tertutup di wilayah mereka masing-masing.



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
| _Kasir_ | _Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi._ |
| ...     | ...                                                                                                                                                                                                                               |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Kasir_        | _Memindai barcode barang_ | _Proses pembayaran berjalan cepat dan akurat_ |
| US-02 | _[Nama Aktor]_ | _[Kebutuhan pengguna]_    | _[Tujuan yang dicapai pengguna]_              |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Model Proses Bisnis

Buatlah _Activity Diagram_ atau _Swimlane Diagram_ yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
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
