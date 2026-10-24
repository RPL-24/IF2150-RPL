<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK (SKPL)
</h1>
<br>

## PahamHukum

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh: #PenjagaNilai
| Informasi | Keterangan |
| --- | --- |
| Kelas | K01 |
| Kelompok | G07  |

| NIM | Nama |
|---|---|
| 13525007 | Rivan Cahyadi |
| 13525019 | Raditya Wibian Sastaka |
| 13525064 | Matthew Evan Kurniawan |
| 13525100 | Wesley Lianto |
| 13525109 | Christopherus Michael Jafeth Tobing |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

<br>

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) ini disusun untuk menjabarkan spesifikasi fungsional dan non-fungsional dari perangkat lunak PahamHukum. Dokumen ini bertujuan untuk menjadi acuan resmi dan kontrak teknis bagi tim pengembang (developer), penguji (tester), dan pengelola proyek (administrator) dalam membangun sistem. Melalui dokumen ini, seluruh pemangku kepentingan dapat memastikan bahwa produk akhir yang dikembangkan selaras dengan kebutuhan, batasan, dan tujuan yang telah disepakati.

## 1.2 Lingkup Masalah
PahamHukum adalah platform literasi hukum berbasis web yang menjembatani masyarakat awam dengan informasi hukum. Sistem ini menyederhanakan bahasa hukum menjadi panduan praktis berdasarkan kelompok kasus sehari-hari, memberikan wawasan, panduan langkah penyelesaian, serta template dokumen pendukung secara gratis. Platform ini tidak bertindak sebagai penasihat hukum resmi, melainkan sebagai penuntun langkah awal bagi masyarakat sebelum mereka berinteraksi langsung dengan lembaga hukum formal.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *EARS* | *Easy Approach to Requirements Syntax, yaitu pola penulisan kebutuhan agar konsisten dan mudah diuji.* |
| *LBH* | *Lembaga Bantuan Hukum, instansi yang memberikan layanan hukum bagi masyarakat.* |
| *Kurator* | *Pengelola sistem yang bertugas menyusun, menyunting, dan mengajukan konten rangkuman kasus untuk publik.* |
| *Administrator* | *Pemegang otoritas sistem yang memvalidasi konten kurator dan mengatur manajemen akun.* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *XX adalah nomor urut dari 01 hingga 43* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *XX adalah nomor urut dari 01 hingga 13* |
| *Aktor* | *AXX* | *XX adalah nomor urut dari 01 hingga 03* |
| *Use Case* | *UCXX* | *XX adalah nomor urut dari 01 hingga 09* |
| *Kelas* | *CXX* | *XX adalah nomor urut dari 01 hingga 29* |

## 1.5 Referensi
1. *Justice Needs in Indonesia 2014: Problems, Processes and Fairness* - The Hague Institute for Innovation of Law (2014)

2. *Analisis Ketimpangan Keadilan di Indonesia: Potret Buram Akses Keadilan bagi Masyarakat Marginal* - Pancasila: Jurnal Keindonesiaan (2025)

3. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). Easy Approach to Requirements Syntax (EARS). IEEE.

4. Web Content Accessibility Guidelines (WCAG) 2.1 - W3Cs

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen SKPL ini disusun dengan BAB 1 menguraikan pendahuluan, tujuan, lingkup masalah, serta definisi istilah. BAB 2 memaparkan deskripsi umum perangkat lunak, karakteristik pengguna, batasan, serta lingkungan operasi. BAB 3 mendetailkan Kebutuhan Fungsional (KF) dan Kebutuhan Non-Fungsional (KNF) sistem secara terukur. BAB 4 menjabarkan pemodelan Use Case beserta skenarionya. BAB 5 menjelaskan pemodelan Kelas (Class Diagram) baik per-Use Case maupun keseluruhan. Terakhir, BAB 6 memuat matriks keterlacakan (Traceability) yang memetakan hubungan antara Kelas, Use Case, dan Kebutuhan Fungsional.

---

# BAB 2: Deskripsi Perangkat Lunak

## 2.1 Deskripsi Umum Sistem
PahamHukum adalah aplikasi berbasis web yang menjembatani masyarakat awam dengan informasi hukum. Selama ini, informasi hukum di Indonesia ditulis dengan istilah teknis dan disusun untuk kalangan profesional. Akibatnya, orang yang tidak  memiliki latar belakang hukum sering terhenti karena kebingungan. PahamHukum menyajikan ulang informasi tersebut dalam bahasa sehari-hari, lengkap dengan panduan langkah dan templat surat pendukung. Namun, sistem ini tidak menangani perkara, tidak mewakili pengguna secara hukum, dan tidak menggantikan advokat maupun Lembaga Bantuan Hukum (LBH).

Proses bisnis PahamHukum berjalan dalam dua alur. Alur pertama dijalankan Pencari Informasi. Pengguna membuka beranda, menelusuri bidang hukum atau mengetik kata kunci, lalu memilih kasus yang paling mirip dengan situasinya. Judul kasus ditulis dalam bahasa sehari-hari, misalnya "saya diberhentikan tanpa surat", sedangkan istilah hukum resminya hanya menjadi keterangan pelengkap. Setelah kasus dipilih, sistem menampilkan satu halaman rangkuman berisi inti masalah, hak pengguna, langkah penyelesaian, hal yang perlu dipertimbangkan, daftar periksa dokumen, templat surat, artikel dan sumber hukum, serta rujukan LBH.

Di balik layar, alur kedua dijalankan Kurator dan Administrator. Kurator menyusun rangkuman kasus di panel pengelolaan, melampirkan templat, lalu mengajukannya sehingga status konten berubah dari `Draft` menjadi `Diajukan`. Selanjutnya, Administrator memeriksa ketepatan informasi hukum di dalamnya. Konten yang disetujui langsung tayang bersama nama Kurator dan tanggal peninjauan. Sebaliknya, konten yang dikembalikan berstatus `Perlu Revisi` dan wajib disertai catatan perbaikan. Singkatnya, publik hanya melihat konten yang sudah lolos peninjauan.

Kedua alur tersebut dimodelkan dalam *Activity Diagram* berikut.

<p align="center">
<img alt="Activity Diagram Penyediaan Konten untuk Kurator dan Administrator" src="./assets/diagram/kurator.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Activity Diagram Penyediaan Konten untuk Kurator dan Administrator</i>
</p>
<br>
<p align="center">
<img alt="Activity Diagram untuk Pencari Informasi" src="./assets/diagram/pencari_informasi.png" width="70%">
</p>
<p align="center">
<i>Gambar 2. Activity Diagram untuk Pencari Informasi</i>
</p>

## 2.2 Deskripsi Umum Perangkat Lunak
PahamHukum memiliki dua antarmuka, yaitu halaman publik dan panel pengelolaan. Halaman publik terbuka bagi siapa saja tanpa akun. Di sana, Pencari Informasi dapat menelusuri dan mencari kasus, membaca rangkuman, menandai daftar periksa dokumen, serta mengunduh templat surat. Panel pengelolaan hanya bisa diakses Kurator dan Administrator setelah masuk dengan email dan kata sandi. Kurator memakainya untuk menyusun dan mengajukan konten, sementara Administrator memakainya untuk meninjau konten dan mengelola akun Kurator.

PahamHukum tidak terhubung secara otomatis dengan sistem eksternal. Tidak ada *payment gateway*, layanan tanda tangan digital, ataupun integrasi dengan sistem pengaduan instansi. Keterkaitan dengan pihak luar hanya berupa rujukan dan penyimpanan di sisi pengguna, seperti berikut.
1. Sumber hukum primer terbuka, seperti JDIH dan peraturan.bpk.go.id, dirujuk Kurator saat menyusun konten dan ditampilkan sebagai tautan pada artikel pendukung. Sistem tidak menarik data dari situs tersebut.
2. Direktori LBH ditampilkan beserta area layanannya. Untuk kasus yang ditandai darurat, sistem menampilkan rujukan ke kepolisian atau unit perlindungan terkait. Tidak ada data pengguna yang dikirim ke lembaga mana pun.
3. Penyimpanan lokal peramban (*local storage*) menyimpan status daftar periksa dokumen milik pengguna. Data ini tidak pernah dikirim ke server.

## 2.3 Pengguna dan Kebutuhan Pengguna Perangkat Lunak

| Pengguna | Kebutuhan |
| :--- | :--- |
| Pencari Informasi (Masyarakat Awam) | Menemukan kasus yang sesuai dengan situasinya, baik lewat penelusuran bidang hukum maupun kata kunci sehari-hari. Setelah itu, pengguna dapat membaca rangkuman kasus, menandai daftar periksa dokumen, mengunduh templat surat, dan melihat rujukan sumber hukum serta LBH. Semua fitur ini dipakai tanpa mendaftar akun. |
| Kurator Konten | Masuk ke panel pengelolaan, menulis atau menyunting rangkuman kasus dalam satu formulir, dan melampirkan templat PDF atau DOCX. Kurator juga mengajukan konten untuk ditinjau, lalu memantau statusnya beserta catatan revisi dari Administrator. Kurator tidak dapat menayangkan kontennya sendiri. |
| Administrator Sistem | Masuk ke panel pengelolaan dan melihat antrean konten berstatus `Diajukan`, diurutkan dari yang paling lama menunggu. Pada satu layar, Administrator membaca isi konten lalu memilih Setujui atau Kembalikan dengan catatan revisi. Selain itu, Administrator mendaftarkan, memperbarui, dan menonaktifkan akun Kurator. |

## 2.4 Batasan Perangkat Lunak
1. P/L berjalan sebagai aplikasi web pada peramban Chrome, Firefox, Edge, dan Safari versi rilis dua tahun terakhir, dengan lebar layar minimal 360 piksel.
2. P/L tidak memakai API atau data dari sistem lain. Sumber hukum primer dan direktori LBH hanya ditampilkan sebagai tautan atau informasi statis.
3. P/L hanya menerima templat berformat PDF atau DOCX dengan ukuran paling besar 5 MB.
4. P/L tidak menyimpan data pribadi maupun detail kasus Pencari Informasi di server. Status daftar periksa hanya tersimpan di peramban pengguna.
5. P/L hanya menyediakan informasi umum, bukan nasihat hukum yang mengikat. Oleh karena itu, setiap halaman publik wajib memuat *disclaimer*.
6. P/L tidak menangani situasi darurat secara langsung dan tidak mengirim dokumen ke instansi mana pun. Pengguna diarahkan ke lembaga yang berwenang, lalu menindaklanjuti sendiri.
7. P/L tidak menyediakan pendaftaran akun publik. Akun Kurator hanya dibuat oleh Administrator.
8. Cakupan konten dibatasi pada dua sampai tiga bidang hukum, misalnya ketenagakerjaan dan perlindungan konsumen, dengan antarmuka berbahasa Indonesia.

## 2.5 Lingkungan Operasi Perangkat Lunak

| Komponen | Spesifikasi |
| :--- | :--- |
| Server | Web server pada layanan *cloud hosting* gratis atau berbiaya rendah dengan dukungan HTTPS |
| Client | Peramban Chrome, Firefox, Edge, atau Safari (versi rilis dua tahun terakhir) di komputer maupun ponsel |
| DBMS | Basis data relasional (PostgreSQL atau MySQL) untuk data akun, bidang hukum, kelompok kasus, konten, dan riwayat perubahan status |
| Penyimpanan Berkas | Penyimpanan di sisi server untuk templat PDF dan DOCX |
| OS | Tidak bergantung pada sistem operasi tertentu selama tersedia peramban yang didukung |
| Jaringan | Koneksi internet minimal 1 Mbps agar beranda termuat paling lama 3 detik |

---

# BAB 3: Deskripsi Kebutuhan Perangkat Lunak

## 3.1 Kebutuhan Fungsional (KF)
Salin ulang **seluruh Kebutuhan Fungsional (KF)** versi terbaru dari BAB 2.1 dokumen *Class Diagram* (sudah versi final dan sudah memakai format EARS). Pastikan ID Kebutuhan (kolom "ID Kebutuhan") juga konsisten dengan ID pada tabel Pemetaan Kebutuhan di dokumen *Requirement Gathering*.

Tabel 3.1. Kebutuhan Fungsional

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01* | *Ketika pelanggan membuka halaman katalog, sistem harus menampilkan daftar produk yang tersedia.* |
| *KF02* | *R02* | *Ketika pelanggan memilih "Tambah ke Keranjang" pada suatu produk, sistem harus menyimpan produk tersebut ke dalam keranjang pelanggan.* |
| *KF03* | *R03* | *Ketika pelanggan menekan tombol checkout, sistem harus menampilkan pilihan metode pembayaran yang tersedia.* |
| *KF04* | *R04* | *Ketika pelanggan memilih metode pembayaran, sistem harus mengirimkan permintaan otorisasi beserta nominal tagihan dan ID pesanan ke payment gateway (dummy).* |
| *KF05* | *R04* | *Ketika payment gateway (dummy) mengembalikan status pembayaran berhasil, sistem harus memperbarui status pesanan menjadi "Lunas" dan menampilkan notifikasi pembayaran berhasil.* |
| *KF06* | *R05* | *Ketika pelanggan membuka menu riwayat pesanan, sistem harus menampilkan daftar pesanan beserta statusnya.* |
| *KFXX* | *...* | *...* |

## 3.2 Kebutuhan Non-Fungsional (KNF)
Salin ulang Kebutuhan Non-Fungsional dari BAB 2.5 dokumen *Requirement Gathering*, sesuaikan ID Kebutuhan (kolom "ID Kebutuhan") apabila terjadi perubahan penomoran pada BAB 3.1 di atas.

Tabel 3.2. Kebutuhan Non-Fungsional

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R03* | *Reliability* | *Proses transaksi pembayaran harus memenuhi prinsip ACID untuk mencegah terjadinya data tersangkut (lost update) apabila terjadi kegagalan jaringan di tengah proses.* |
| *KNF02* | *R04* | *Security* | *Sistem harus mengenkripsi PIN atau password pengguna menggunakan algoritma SHA-256 sebelum data dikirimkan ke server, serta tidak menyimpannya dalam bentuk plain-text di database.* |
| *...* | *...* | *...* | *...* |

<sub>*Silakan pilih parameter yang relevan dengan P/L kalian (Availability, Reliability, Ergonomy, Portability, Memory, Response time, Safety, Security, dsb), tidak perlu semua parameter diisi. Lihat kembali dokumen Requirement Gathering untuk penjelasan tiap parameter.*<sub>

---

# BAB 4: Pemodelan Use Case

## 4.1 Identifikasi Aktor
Salin ulang daftar aktor final dari BAB 3.1 dokumen *Use Case & Scenario Use Case* atau *Class Diagram*. Tambahkan ID Aktor mengikuti Aturan Penomoran pada 1.4.

| ID Aktor | Aktor | Deskripsi |
| :--- | :--- | :--- |
| A01 | **Pencari Informasi (Masyarakat Awam)** | Masyarakat umum yang sedang menghadapi persoalan hukum, atau sekadar ingin memahaminya, misalnya sengketa ketenagakerjaan dan perselisihan transaksi. Kebanyakan tidak berlatar hukum dan kurang familier dengan istilah teknis maupun nomor peraturan. Yang mereka butuhkan kejelasan, bahasa yang sederhana, dan panduan langkah yang praktis. Umumnya, situs diakses lewat perangkat seluler dengan kualitas koneksi yang bervariasi, dan mereka memakai sistem tanpa perlu mendaftar dan membuat akun. |
| A02 | **Kurator Konten** | Tim pengelola yang menyusun kategori hukum, menulis rangkuman kasus, mengunggah materi pendukung, dan menyiapkan *template* dokumen. Mereka memiliki pemahaman dasar tentang hukum, teliti saat merujuk peraturan, serta konsisten menjaga informasi tetap mudah dicerna orang awam. Kurator bekerja melalui panel pengelolaan dan tidak berwenang menerbitkan konten langsung ke publik. |
| A03 | **Administrator Sistem** | Pemegang otoritas tertinggi dalam sistem. Tugas utamanya meninjau akurasi konten dari Kurator sebelum terbit, sekaligus mengelola akun dan hak akses mereka. Pemahaman hukumnya umumnya lebih dalam daripada Kurator dengan tingkat kehati-hatian yang tinggi untuk meloloskan informasi hukum bagi konsumsi publik, contohnya praktisi hukum atau mahasiswa tingkat akhir di bidang hukum. |

## 4.2 Identifikasi Use Case
| ID UC | Nama Use Case | Deskripsi Singkat | Aktor | ID KF |
| :--- | :--- | :--- | :--- | :--- |
| UC01 | Menelusuri dan Membaca Rangkuman Kasus | Pencari Informasi menelusuri bidang dan kelompok hukum, lalu membuka satu halaman rangkuman kasus yang memuat inti masalah, hak, langkah, pertimbangan, dan referensi. | Pencari Informasi | KF01, KF02, KF03, KF04, KF05, KF08, KF09, KF10, KF11, KF12, KF18, KF19, KF20, KF21, KF42 |
| UC02 | Mencari Kasus | Pencari Informasi mengetik kata kunci untuk langsung menuju kasus yang dicari tanpa menelusuri seluruh kategori. | Pencari Informasi | KF02, KF06, KF07 |
| UC03 | Menyiapkan Dokumen dengan *Checklist* | Pencari Informasi menandai dokumen yang sudah disiapkan pada *checklist*, dan progresnya tersimpan di *browser* sehingga tetap terjaga saat halaman dibuka kembali. | Pencari Informasi | KF13, KF14 |
| UC04 | Mengunduh Templat Dokumen | Pencari Informasi mengunduh templat surat yang tersedia pada sebuah kasus sebagai kerangka awal dokumen. | Pencari Informasi | KF15, KF16, KF17 |
| UC05 | Masuk ke Panel Pengelolaan | Kurator atau Administrator masuk ke panel pengelolaan menggunakan email dan kata sandinya. | Kurator Konten, Administrator Sistem | KF39, KF40, KF41 |
| UC06 | Mengelola Konten Rangkuman Kasus | Kurator menulis, menyunting, melampirkan templat, lalu mengajukan konten rangkuman kasus untuk ditinjau. | Kurator Konten | KF22, KF23, KF25, KF26, KF27, KF28, KF35 |
| UC07 | Memantau Status dan Revisi Konten | Kurator memantau status pengajuan kontennya dan membaca catatan revisi bila ada. | Kurator Konten | KF29, KF30 |
| UC08 | Meninjau dan Memutuskan Konten | Administrator meninjau konten yang diajukan Kurator, lalu menyetujui atau mengembalikannya disertai catatan. | Administrator Sistem | KF24, KF31, KF32, KF33, KF34, KF36 |
| UC09 | Mengelola Akun Kurator | Administrator mendaftarkan, memperbarui, atau menonaktifkan akun Kurator beserta hak aksesnya. | Administrator Sistem | KF37, KF38, KF43 |

## 4.3 Use Case Diagram
Diagram berikut memuat ketiga aktor (Pencari Informasi, Kurator Konten, dan Administrator Sistem) beserta sembilan use case (UC01 hingga UC09) yang diidentifikasi pada 4.2.

<br>
<p align="center">
<img alt="Use Case Diagram Sistem PahamHukum" src="./assets/diagram/useCaseDiagram.png" width="80%">
</p>
<p align="center">
<i>Gambar 3. Use Case Diagram Sistem PahamHukum</i>
</p>
<br>

## 4.4 Skenario Use Case
Salin ulang skenario **setiap** use case (skenario normal dan alternatif) dari BAB 3.4 dokumen *Use Case & Scenario Use Case*, sesuaikan dengan daftar UC final pada 4.2. Jika use case melibatkan lebih dari satu aktor manusia yang benar-benar berinteraksi langsung (misalnya *Kasir* yang memverifikasi transaksi setelah *Pelanggan* membayar), tambahkan kolom aksi tersendiri untuk aktor tersebut di samping kolom "Reaksi Perangkat Lunak". Sistem eksternal otomatis seperti *payment gateway* **bukan aktor**, sehingga interaksinya cukup dituliskan sebagai bagian dari "Reaksi Perangkat Lunak", bukan kolom aktor terpisah.

### 4.4.1 Skenario UC01

**Nama Use Case:** Menelusuri dan Membaca Rangkuman Kasus

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi membuka halaman beranda | Sistem menampilkan seluruh bidang hukum aktif beserta jumlah kelompok kasus pada masing-masing bidang, dan hanya menampilkan konten yang sudah berstatus Disetujui |
| 2 | Pencari Informasi memilih salah satu bidang hukum | Sistem menampilkan kelompok kasus pada bidang tersebut, dengan judul dalam bahasa sehari-hari dan istilah hukum resmi sebagai keterangan pelengkap |
| 3 | Pencari Informasi memilih kelompok kasus yang sesuai | Sistem membuka halaman rangkuman kasus yang tersusun berurutan, meliputi inti masalah, hak, langkah penyelesaian, poin pertimbangan, checklist dokumen, templat, artikel pendukung, dan **disclaimer** |
| 4 | Pencari Informasi membaca bagian hak dan pertimbangan | Sistem menampilkan hak pengguna serta bagian "hal yang perlu dipertimbangkan" yang memuat perkiraan waktu pengerjaan dan saran kapan sebaiknya mencari pendampingan profesional |
| 5 | Pencari Informasi membaca langkah penyelesaian | Sistem menyajikan langkah secara bernomor dan berurutan, lengkap dengan tujuan tiap langkah dan dokumen yang diperlukan, serta menandai langkah yang memiliki tenggat waktu |
| 6 | Pencari Informasi menelusuri bagian akhir halaman | Sistem menampilkan artikel pendukung bertaut ke sumber hukum resmi, direktori Lembaga Bantuan Hukum terdekat, nama Kurator dan tanggal peninjauan, serta **disclaimer** pada footer |

<br>

**Skenario Alternatif 1: Kasus Ditandai Situasi Darurat**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi memilih kelompok kasus yang ditandai sebagai situasi darurat | Sistem menampilkan peringatan prioritas agar segera melapor ke kepolisian atau unit perlindungan khusus |
| 2 | Pencari Informasi menutup peringatan dan melanjutkan | Sistem menampilkan halaman rangkuman kasus seperti pada skenario normal |

### 4.4.2 Skenario UC02

**Nama Use Case:** Mencari Kasus

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi mengetik kata kunci pada kolom pencarian | Sistem mencocokkan kata kunci dengan judul kasus, kalimat gejala, isi rangkuman, dan istilah hukum resmi |
| 2 | Pencari Informasi mengirim pencarian | Sistem menampilkan daftar kasus yang relevan, terbatas pada konten yang sudah Disetujui |
| 3 | Pencari Informasi memilih salah satu hasil | Sistem membuka halaman rangkuman kasus terkait |

<br>

**Skenario Alternatif 1: Pencarian Tidak Menemukan Hasil**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi mengirim kata kunci yang tidak cocok dengan kasus mana pun | Sistem menampilkan pesan yang sopan bahwa kasus belum tersedia, disertai saran bidang hukum lain dan tautan lembaga bantuan hukum |

### 4.4.3 Skenario UC03

**Nama Use Case:** Menyiapkan Dokumen dengan *Checklist*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi membuka bagian *checklist* dokumen pada halaman rangkuman | Sistem menampilkan daftar dokumen yang perlu disiapkan |
| 2 | Pencari Informasi mencentang dokumen yang sudah disiapkan | Sistem memperbarui tampilan item yang dicentang, menghitung berapa banyak dokumen yang sudah siap, dan menyimpan status centang ke penyimpanan lokal peramban |
| 3 | Pencari Informasi meninggalkan halaman | Sistem mempertahankan status centang di penyimpanan lokal peramban pengguna tanpa mengirimnya ke server |

<br>

**Skenario Alternatif 1: Pengguna Memuat Ulang atau Membuka Kembali Halaman**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi memuat ulang atau membuka kembali halaman rangkuman yang sama | Sistem memulihkan status *checklist* dan centangnya dari penyimpanan lokal peramban, sehingga progres sebelumnya tetap terjaga |

### 4.4.4 Skenario UC04

**Nama Use Case:** Mengunduh Templat Dokumen

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi mencari bagian templat pada halaman rangkuman | Sistem menampilkan tombol unduh beserta ukuran berkas dan tanggal pembaruan terakhir, serta *disclaimer* bahwa templat hanya kerangka awal tepat di atas tombol |
| 2 | Pencari Informasi menekan tombol unduh | Sistem mengirimkan berkas templat versi terbaru tanpa meminta pengguna mendaftar |

<br>

**Skenario Alternatif 1: Kasus Belum Memiliki Templat**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pencari Informasi membuka kasus yang belum memiliki berkas templat | Sistem tidak menampilkan tombol unduh dan menyatakan bahwa templat belum tersedia untuk kasus tersebut |

### 4.4.5 Skenario UC05

**Nama Use Case:** Masuk ke Panel Pengelolaan

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator atau Administrator membuka halaman login dan memasukkan email dan kata sandi yang benar | Sistem memberi akses dan mengarahkan pengguna ke antarmuka kerja sesuai perannya |

<br>

**Skenario Alternatif 1: Kredensial Salah**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pengguna memasukkan email atau kata sandi yang keliru | Sistem menolak akses dan menampilkan pesan galat tanpa menyebutkan bagian mana yang salah |

<br>

**Skenario Alternatif 2: Akses Tanpa Sesi yang Sah**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Pengguna mencoba membuka halaman pengelola tanpa sesi login yang sah | Sistem mengalihkannya ke halaman login atau menampilkan halaman akses ditolak |

### 4.4.6 Skenario UC06

**Nama Use Case:** Mengelola Konten Rangkuman Kasus

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator membuka formulir penyusunan konten | Sistem menampilkan formulir dinamis yang urutan isiannya mengikuti susunan baku halaman rangkuman |
| 2 | Kurator mulai menulis draf baru | Sistem menetapkan status konten sebagai Draft secara otomatis |
| 3 | Kurator melampirkan berkas templat pada kasus | Sistem menyimpan berkas dan memperbarui riwayat perubahan dokumen sebagai versi paling baru |
| 4 | Kurator melengkapi seluruh isian wajib lalu mengajukan konten | Sistem mengubah status dari Draft menjadi Diajukan dan memasukkannya ke antrean peninjauan Administrator |

<br>

**Skenario Alternatif 1: Berkas Templat Tidak Valid**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator mengunggah berkas templat selain PDF atau DOCX, atau berukuran melebihi 5 MB | Sistem menolak unggahan dan menampilkan pesan yang menjelaskan format dan ukuran yang benar |

<br>

**Skenario Alternatif 2: Isian Wajib Belum Lengkap**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator mengajukan konten sementara masih ada isian wajib yang kosong | Sistem mencegah pengajuan dan menandai isian mana saja yang belum lengkap |

<br>

**Skenario Alternatif 3: Kurator Mencoba Menayangkan Sendiri**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator mencoba menayangkan langsung kontennya ke publik | Sistem menolak permintaan tersebut, karena penayangan hanya dapat dilakukan melalui persetujuan Administrator |

### 4.4.7 Skenario UC07

**Nama Use Case:** Memantau Status dan Revisi Konten

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator membuka daftar kontennya | Sistem menampilkan seluruh tulisan milik Kurator beserta statusnya, yaitu Draft, Diajukan, Disetujui, atau Perlu Revisi |

<br>

**Skenario Alternatif 1: Konten Berstatus Perlu Revisi**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Kurator membuka konten yang berstatus Perlu Revisi | Sistem menampilkan catatan perbaikan dari Administrator pada menu penyuntingan konten terkait |

### 4.4.8 Skenario UC08

**Nama Use Case:** Meninjau dan Memutuskan Konten

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Administrator membuka antrean peninjauan | Sistem menampilkan daftar konten berstatus Diajukan, diurutkan dari yang paling lama menunggu beserta nama pengunggahnya |
| 2 | Administrator membuka salah satu konten dan meninjau isinya | Sistem menampilkan isi konten pada layar peninjauan |
| 3 | Administrator memilih Setujui | Sistem mengubah status menjadi Disetujui, menayangkan konten ke publik, dan mencatat riwayat perubahan status |

<br>

**Skenario Alternatif 1: Konten Dikembalikan dengan Catatan Revisi**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Administrator memilih Kembalikan dan mengisi alasan revisi | Sistem mengubah status menjadi Perlu Revisi, mengirimkan catatan revisi kepada Kurator, dan mencatat riwayat perubahan status |

<br>

**Skenario Alternatif 2: Alasan Revisi Dikosongkan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Administrator memilih Kembalikan tetapi membiarkan kolom alasan revisi kosong | Sistem menahan perubahan status dan mewajibkan alasan revisi diisi lebih dulu |

### 4.4.9 Skenario UC09

**Nama Use Case:** Mengelola Akun Kurator

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Administrator membuka panel pengelolaan akun dan mendaftarkan akun Kurator baru | Sistem membuat akun tersebut melalui panel Administrator, tanpa membuka pendaftaran mandiri di *interface* publik |
| 2 | Administrator memperbarui detail akun Kurator | Sistem menyimpan perubahan dan memberlakukannya pada sesi login Kurator berikutnya |

<br>

**Skenario Alternatif 1: Penonaktifan Akun Kurator**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | Administrator menonaktifkan akun seorang Kurator | Sistem segera memutus sesi Kurator tersebut bila sedang login dan mencegahnya login kembali |

---

# BAB 5: Pemodelan Kelas

## 5.1 Identifikasi Kelas
Salin ulang seluruh kelas yang telah diidentifikasi dari BAB 4.1 dokumen *Class Diagram*.

| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| *C01* | *Pelanggan* | *Menyimpan data akun pelanggan yang membuat pesanan.* | *UC01, UC05* |
| *C02* | *Pesanan* | *Menyimpan data pesanan beserta status pembayarannya.* | *UC01, UC03, UC05* |
| *C03* | *Keranjang* | *Menyimpan sementara item yang dipilih sebelum checkout.* | *UC01, UC02* |
| *...* | *...* | *...* | *...* |

## 5.2 Diagram Kelas per Use Case
Salin ulang diagram kelas untuk setiap use case dari BAB 4.2 dokumen *Class Diagram*, lengkap dengan tabel atribut dan metode/operasinya.

### 5.2.1 Use Case UC01

**Nama Use Case:** *Memesan Produk*

<p align="center">
<img alt="Contoh Class Diagram" src="./assets/diagram/contoh-class-diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar 3. Contoh Diagram Kelas Use Case UC01</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *idPesanan, total, status* | *buatPesanan(), hitungTotal()* |
| *C03* | *Keranjang* | *daftarItem* | *tambahItem(), checkout()* |
| *...* | *...* | *...* | *...* |

> Lanjutkan pola **5.2.x** untuk setiap use case pada 4.2.

## 5.3 Diagram Kelas Keseluruhan
Gabungkan seluruh kelas dan hubungan antarkelas dari BAB 4.3 dokumen *Class Diagram* menjadi satu diagram kelas keseluruhan. Pastikan tidak ada kelas yang terduplikasi atau tertinggal.

<p align="center">
<img alt="Contoh Class Diagram Keseluruhan" src="./assets/diagram/contoh-class-diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar 4. Contoh Diagram Kelas Keseluruhan</i>
</p>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *Pelanggan* | *idPelanggan, nama, email* | *lihatRiwayatPesanan()* |
| *C02* | *Pesanan* | *idPesanan, total, status* | *hitungTotal(), perbaruiStatus()* |
| *...* | *...* | *...* | *...* |

---

# BAB 6: Traceability
Salin ulang tabel Traceability dari BAB 5 dokumen *Class Diagram*, cocokkan setiap Kebutuhan Fungsional, Use Case, dan Kelas yang saling terkait.

| ID Kelas | ID Use Case | ID KF |
| :--- | :--- | :--- |
| *C01* | *UC01, UC05* | *KF01, KF06* |
| *C02* | *UC01, UC03, UC05* | *KF01, KF02, KF05, KF06* |
| *C03* | *UC01, UC02* | *KF01, KF02* |
| *...* | *...* | *...* |

---

# Referensi
- Diagram UML: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
