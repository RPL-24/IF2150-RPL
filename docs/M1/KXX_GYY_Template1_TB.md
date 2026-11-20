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

Platform yang kami rencanakan adalah LaporKota. LaporKota sendiri merupakan platofrm pelaporan dan penanganan kerusakan infrastruktur publik berbasis _crowdsourcing_. Dari sudut pandang pengguna, pengguna dapat melaporkan hal yang terjadi di lapangan dengan cara mengambil foto, memilih kategori kerusakan, serta mengirimkan laporan dengan lokasi yang ditandai secara otomatis melalui GPS perangkat. Kemudian terdapat juga dashboard dinas untuk mengelola laporan dari hulu ke hilir. Petugas admin akan menerima dan memverifikasi laporan yang masuk, lalu akan diteruskan ke petinggi dinas setempat. Kemudian, setelah suatu surat tugas diturunkan kepada eksekutor di lapangan, eksekutor lapangan tersebut dapat memberikan _update_ kepada petugas admin yang nantiyna akan menampilkan progres secara berkala ke publik. Dengan tujuan untuk memudahkan para pengguna, LaporKota akan diimplementasikan sebagai aplikasi web dengan antarmuka yang responsif. Aksesibilitas tanpa instalasi merupakan salah satu aspek yang krusial dalam pengembangan LaporKota. Aplikasi berbasis web ini dapat diakses langsung tanpa terdapat hambatan tambahan seperti instalasi, hal ini diharapkan dapat mempermudah pengguna untuk menggunakan LaporKota. 

 Adapun nilai unik dari perangkat lunak kami berupa: 

1. Deduplikasi berbasis lokasi dan upvote, dimana laporan titik yang berdekatan dengan kategori mirip otomatis digabung menjadi satu dan menaikkan bobot urgensi. 
2. Skor prioritas dihitung jadi jumlah pelapor, kelas jalan/fasilitas/hal terlapor, dan dapat dilihat secara p ublik. 
3. Transparansi dua arah, di mana laporan beserta statusnya yang diupdate secara _real time_ dapat dilihat oleh seluruh pengguna. 

## 2.2 Asumsi dan Batasan
Pengembangan LaporKota didasarkan pada sejumlah asusmsi dan batasan yang perlu diidentifikasikan sedari awal. 
Asumsi dalam pengerjaan perangkat lunak ini kami bagi menjadi 2 asumsi. 

**Asumsi Teknis:**
  
  1. Pengguna memiliki smartphone dengan kamera + GPS dan koneksi internet saat melaporkan. 
  2. Layanan pihak ketiga yang digunakan pada proses pengembangan tersedia secara stabil. 

**Asumsi Operasional**

Terdapat pihak pemerintah yang berkomitmen untuk memverifikasi dan menindaklanjuti laporan. 


Selain daripada asumsi di atas, terdapat juga batasan-batasan yang memengaruhi pengembangan aplikasi ini. Batasan tersebut mencakup batasan sumber daya, batasan hukum, serta ruang lingkup solusi. 

**Batasan Sumber Daya**

Batasan yang dihadapi salah satunya adalah batasan sumber daya. Perihal ini, batasan yang dihadapi para _developer_ adlaah perangkat lunak ini hanya dikembangkan oleh tim yang terdiri dari 5 mahasiswa. 

**Batasan Hukum**

Batasan Hukum yang kami gunakan antara lain: 
1. Foto dan data lokasi yang dikirimkan warga merupakan data yang tunduk pada UU No.27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP). Dengan ini, diharapkan bahwa sistem meminimalkan pengumpulan data pribadi dan identatis pelapor ditampilkan secara anonim pada dashboard publik. 
2. Laporkota juga menjunjung nilai-nilai yang terkandung pada UU No.14 Tahun 2008 tentang Keterbukaan Informasi Publik. Hal ini ditunjukkan pada fitur ketersediaan informasi status laporan dan penanganan kerusakan infrastruktur yang terbuka bagi publik. 

**Batasan Ruang Lingkup Solusi**

Beberapa batasan ruang lingkup solusi juga ditetapkan agar pengembangan berjalan sesuai dengan kapabilitas pengembang. Adapun batasan-batasan ruang lingkup solusi tersebut antara lain: 
1. Cakupan gegorafis LaporKota dibatasi pada satu wilayah kota/kabupaten sebagai lokasi implementasi. 
2. Sistem LaporKota mencakup keseluruhan alur mulai dari pelaporan oleh warga setempat, verifikasi oleh admin, pengambilan keputusan oleh petinggi dinas, hingga pemantauan progress yang diberikan oleh eksekutor di lapangan secara real time sampai laporan dinyatakan selesai oleh petinggi dinas.  

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| *Warga* | *Pengguna ini merupakan masyarakat umum yang bertindak sebagai pihak yang berhak melaporkan segala bentuk keluhan dan masalah yang ditemukan di lapangan. Pengguna ini juga dapat melihat informasi laporan dari pengguna lain (secara anonim) dan melakukan upvote terhadap laporan lain.* |
| *Tim Administrasi* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memverifikasi terlebih dahulu segala laporan yang diterima sistem (apakah valid/spam). Pihak ini juga bertanggung jawab untuk mengatur skala prioritas dari semua laporan berdasarkan berbagai faktor, dan nantinya meneruskan laporan dengan skala prioritas yang tinggi kepada petinggi dinas sembari melakukan update status secara berkala.* |
| *Eksekutor Lapangan* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk turun langsung ke lapangan dalam menindak lanjuti instruksi dari Tim Administrasi . Pengguna ini juga bertanggung jawab untuk melakukan update progress kepada Tim Administrasi.* |
| ... | ... |


## 3.2 Kebutuhan Pengguna Awal

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | Warga | Mengirimkan laporan  | Format laporan yang jelas, fitur yang mudah digunakan, dan mendapat perkembangan terhaadap masalah yang dilaporkan |
| US-02 | Admin | Menerima laporan, memverifikasi, menentukan tingkat urgensi kerusakan, dan memeriksa hasil pekerjaan lapangan | Format laporan masalah dan laporan eksekusi yang jelas serta data yang terintegrasi dengan warga dan eksekutor lapangan |
| US-03 | Eksekutor Lapangan | Menerima perintah pekerjaan yang perlu dikerjakan dan melaporkan keselesaian pekerjaan dengan platform ini | Kemudahan mengirimkan hasil pekerjaan dan mendapatkan persetujuan mengenai status (selesai atau tidak) dari eksekusi yang dilakukan  |


## 3.3 Deskripsi Aktivitas
Buatlah daftar seluruh aktivitas yang terdapat dalam sistem solusi, lengkap dengan ID dan penjelasan. Telusuri hubungan aktivitas tersebut dengan *user story* yang sudah dituliskan sebelumnya. Bisa dibuat dalam bentuk tabel.
| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | Menemukan Kendala/Masalah | Warga menemukan kendala atau permasalahan di lingkungan terkait kerusakan infrastruktur publik | US-01 |
| A02 | Membuka Aplikasi | Warga membuka aplikasi Lapor Kota untuk melakukan pelaporan permasalahan | US-01 |
| A03 | Mengirim Laporan | Warga mengirimkan laporan permasalahan melalui aplikasi | US-01 |
| A04 | Status Diterima | Sistem memberikan status bahwa laporan telah diterima dan masuk ke proses pemeriksaan administrasi | US-02 |
| A05 | Validasi Laporan | Tim Administrasi memeriksa laporan untuk menentukan apakah laporan valid dan dapat diproses | US-02 |
| A06 | Status Ditolak | Jika laporan dinyatakan tidak valid, Tim Administrasi mengubah status laporan menjadi ditolak | US-02 |
| A07 | Status Dikerjakan | Jika laporan dinyatakan valid, sistem mengubah status laporan menjadi dikerjakan dan keluhan akan diproses | US-02 |
| A08 | Menentukan Skala Prioritas Laporan | Tim Administrasi menentukan tingkat prioritas laporan berdasarkan jumlah laporan atau urgensi permasalahan | US-02 |
| A09 | Menerima Laporan | Eksekutor Lapangan menerima laporan dan segera menindaklanjuti | US-03 |
| A10 | Eksekusi Lapangan | Eksekutor Lapangan menindaklanjuti secara langsung terhadap permasalahan yang dilaporkan | US-03 |
| A11 | Mengirim Laporan Hasil Eksekusi | Eksekutor Lapangan mengirimkan informasi mengenai hasil penanganan permasalahan melalui aplikasi | US-03 |
| A12 | Memeriksa Penyelesaian Kendala | Tim Administrasi memeriksa apakah kendala yang dilaporkan telah berhasil diselesaikan berdasarkan hasil eksekusi lapangan | US-02 |
| A13 | Melakukan Eksekusi Ulang | Jika kendala belum terselesaikan, laporan dikembalikan kepada Eksekutor Lapangan untuk dilakukan penanganan kembali | US-03 |
| A14 | Status Berhasil | Jika kendala telah terselesaikan, Tim Administrasi mengubah status laporan menjadi berhasil | US-02 |
| A15 | Melihat Laporan | Warga dapat melihat informasi dan status akhir dari laporan yang telah dibuat, termasuk hasil penanganannya | US-01 |
| ... | ... | ... | ... |

## 3.4 Model Proses Bisnis
Buatlah *Activity Diagram* atau *Swimlane Diagram* yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Swimlane Diagram Lapor" src="./assets/diagram/ModelProsesBisnisLaporKota.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Swimlane Diagram Alur Pelaporan dan Penanganan Kerusakan Infrastruktur Publik pada LaporKota</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/