<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *LaporKota*

### Untuk: *Jordhy*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K - 03* |
| Kelompok | *G07* |

| NIM | Nama |
|---|---|
| *13525051* | *Rafi Pradipta Andira Sulistyo* |
| *13525105* | *Pasaribu Fritz T.A.M.* |
| *13525075* | *Bagas Anugrah Putra* |
| *13525099* | *Gede Pranajayanta Suputra* |
| *13525015* | *Muhammad Atallah Ramadhan* |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Infrastruktur fisik perkotaan, seperti jalan raya, penerangan jalan umum (PJU), saluran drainase, pohon peneduh jalan, dan rambu lalu lintas, merupakan penopang utama mobilitas warga serta perputaran ekonomi harian. Namun di lapangan, laju kerusakan fasilitas fisik kerap terjadi lebih cepat dibanding siklus inspeksi rutin yang dilakukan dinas terkait. Kerusakan skala lokal, seperti lubang jalan yang tertutup genangan air, lampu penerangan padam di ruas rawan, trotoar rusak, hingga tumpukan sampah yang menyumbat saluran air, sering kali tidak terpantau oleh dinas teknis hingga akhirnya memicu kemacetan, kecelakaan lalu lintas, dan kerugian material bagi masyarakat.

Permasalahan ini berkaitan erat dengan target Tujuan Pembangunan Berkelanjutan (SDGs), yaitu:
* **SDG 9: Industri, Inovasi, dan Infrastruktur (Target 9.1):** Mengembangkan infrastruktur yang berkualitas, andal, berkelanjutan, dan tangguh untuk mendukung pembangunan ekonomi serta kesejahteraan manusia melalui akses yang terjangkau dan merata.
* **SDG 11: Kota dan Komunitas yang Berkelanjutan (Target 11.2):** Menyediakan akses terhadap sistem transportasi yang aman, terjangkau, dan berkelanjutan bagi seluruh lapisan masyarakat.

Data statistik Kementerian PUPR dan Badan Pusat Statistik (BPS) mencatat bahwa puluhan ribu kilometer ruas jalan daerah di Indonesia masih berada dalam kondisi rusak ringan hingga berat. Di sisi lain, data pengaduan publik nasional seperti SP4N-LAPOR! secara konsisten menempatkan masalah sarana dan prasarana jalan serta fasilitas umum pada kategori keluhan teratas setiap tahunnya.

Urgensi penanganan masalah ini bertumpu pada kesenjangan waktu respons (*response time gap*). Masyarakat berada di lokasi kejadian setiap hari dan menjadi pihak pertama yang merasakan dampak kerusakan, sedangkan dinas teknis memiliki keterbatasan jumlah personel dan armada untuk menyisir setiap ruas jalan secara berkala. Ketiadaan platform terpusat yang mampu mengumpulkan laporan masyarakat (*crowdsourcing*) secara terstruktur dan terverifikasi geospasial membuat penanganan perbaikan menjadi lambat, tidak terarah, dan memakan biaya pemulihan yang jauh lebih besar ketika fasilitas fisik sudah terlanjur rusak parah.

## 1.2 Analisis Kondisi Saat Ini
Saat ini, proses pelaporan kerusakan fasilitas publik yang berjalan di masyarakat masih terpecah ke dalam beberapa saluran yang belum terintegrasi:

* **Media Sosial dan Grup Pesan Instan (X, Instagram, WhatsApp):**
  Warga kerap mengunggah foto kerusakan fasilitas jalan sambil menandai akun dinas atau kepala daerah. Saluran ini tidak memiliki format data yang terstandarisasi, koordinat GPS sering tidak disertakan secara presisi, dan unggahan laporan mudah tertimbun oleh algoritma linimasa. Selain itu, warga tidak memiliki sarana formal untuk memantau apakah keluhan mereka sudah masuk ke antrean kerja perbaikan atau belum.

* **Kanal Pengaduan Umum Pemerintah (SP4N-LAPOR! atau Portal Pemda):**
  Layanan resmi saat ini dirancang untuk penanganan birokrasi umum lintas instansi, bukan sebagai sistem operasional tiket lapangan. Alur verifikasi disposisi membutuhkan birokrasi yang panjang. Sistem ini juga belum memiliki mekanisme pengelompokan laporan otomatis (*duplicate clustering*), sehingga dinas sering menerima puluhan aduan terpisah untuk satu titik lubang jalan atau lampu mati yang sama tanpa agregasi data.

* **Patroli Manual Dinas PU dan Perhubungan:**
  Pemerintah daerah mengandalkan survei lapangan berkala oleh petugas teknis. Metode ini memiliki keterbatasan ruang lingkup karena kendala armada dan anggaran, sehingga pemantauan cenderung hanya terpusat pada jalan protokol utama dan melewatkan jalan arteri sekunder atau jalan lingkungan permukiman warga.

Kesenjangan utama dari kondisi saat ini adalah ketiadaan sistem yang menjembatani laporan warga dengan antrean kerja dinas secara terotomasi. Solusi yang berjalan belum menyediakan pemetaan geospasial terpusat (*heatmap*), penggabungan laporan duplikat berbasis radius lokasi, serta pemeringkatan prioritas penanganan (*risk-based prioritization*) yang mempertimbangkan tingkat bahaya, volume lalu lintas, dan jumlah warga yang terdampak (*upvote*). Akibatnya, dinas teknis kesulitan mengalokasikan tim perbaikan ke titik-titik kerusakan yang paling mendesak.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Abstraksikan solusi perangkat lunak yang diusulkan dari sudut pandang pengguna. Jelaskan target platform yang akan digunakan (misalnya: desktop application) beserta alasan pemilihannya. Deskripsikan juga nilai unik (inovasi inti) dari perangkat lunak kalian dan apa yang membedakannya dari solusi yang sudah ada.

## 2.2 Asumsi dan Batasan
Definisikan secara tegas asumsi (baik teknis maupun dari sisi pengguna) yang menjadi dasar pengembangan. Tuliskan batasan seperti regulasi/hukum, keterbatasan sumber daya, dan ruang lingkup solusi.

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
Dari ide solusi perangkat lunak yang telah kami usulkan, kami mengidentifikasi terdapat 4 aktor utama yang akan berinteraksi langsung dengan sistem kami, diantaranya:

| Aktor | Deskripsi |
| :--- | :--- |
| *Warga* | *Pengguna ini merupakan masyarakat umum yang bertindak sebagai pihak yang berhak melaporkan segala bentuk keluhan dan masalah yang ditemukan di lapangan. Pengguna ini juga dapat melihat informasi laporan dari pengguna lain (secara anonim) dan melakukan upvote terhadap laporan lain.* |
| *Tim Administrasi* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memverifikasi terlebih dahulu segala laporan yang diterima sistem (apakah valid/spam). Pihak ini juga bertanggung jawab untuk mengatur skala prioritas dari semua laporan berdasarkan berbagai faktor, dan nantinya meneruskan laporan dengan skala prioritas yang tinggi kepada petinggi dinas sembari melakukan update status secara berkala.* |
| *Eksekutor Lapangan* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk turun langsung ke lapangan dalam menindak lanjuti instruksi dari Tim Administrasi . Pengguna ini juga bertanggung jawab untuk melakukan update progress kepada Tim Administrasi.* |
| ... | ... |


## 3.2 Kebutuhan Pengguna Awal
Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Kasir* |  *Memindai barcode barang* | *Proses pembayaran berjalan cepat dan akurat* |
| US-02 | *[Nama Aktor]* | *[Kebutuhan pengguna]* | *[Tujuan yang dicapai pengguna]* |
| ... | ... | ... | ... |

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