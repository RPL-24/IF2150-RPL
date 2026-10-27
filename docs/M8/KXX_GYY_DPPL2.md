<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## *LaporKota*
<p align="center">
<img alt="Logo LaporKota" src="./assets/Logo.png" width="70%">
</p>

### Untuk: *Jordhy*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K - 03* |
| Kelompok | *G07* |

| NIM | Nama |
| --- | --- |
| *13525051* | *Rafi Pradipta Andira Sulistyo* |
| *13525105* | *Pasaribu Fritz T.A.M.* |
| *13525075* | *Bagas Anugrah Putra* |
| *13525099* | *Gede Pranajayanta Suputra* |
| *13525015* | *Muhammad Atallah Ramadhan* |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |


---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini disusun untuk memberikan panduan teknis, struktural, dan prosedural yang presisi bagi tim pengembang dalam mengimplementasikan platform LaporKota ke dalam bentuk kode program. Dokumen ini menjabarkan pemodelan arsitektur sistem, realisasi detail use case ke dalam sequence diagram dan class diagram, perancangan antarmuka pengguna, serta pemetaan keterlacakan kelas terhadap kebutuhan fungsional perangkat lunak. Dokumen ini ditujukan bagi Tim Pengembang (*software developer*) sebagai acuan implementasi kode, Tim Penguji (*quality assurance*) sebagai acuan pengujian integrasi struktural, serta Asisten dan Dosen Pengampu mata kuliah IF2150 Rekayasa Perangkat Lunak untuk mengevaluasi kesesuaian hasil rancangan dengan spesifikasi kebutuhan yang telah ditetapkan pada SKPL.

## 1.2 Lingkup Masalah
Perangkat lunak yang akan dikembangkan adalah LaporKota, sebuah platform pelaporan kerusakan infrastruktur publik berbasis website yang dirancang untuk mempermudah warga dalam menyampaikan dan memantau laporannya. Sistem pelaporan ini memfasilitasi pengguna untuk melaporkan masalah fasilitas umum dalam lingkup satu kota, kapan saja dan di mana saja dengan menyertakan foto serta koordinat lokasi. Dengan adanya sistem ini diharapkan pengguna tidak lagi kesulitan mencari saluran pengaduan yang responsif dan proses perbaikan kerusakan fasilitas publik dapat berjalan dengan efisien.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional, yaitu fungsi atau perilaku yang dimiliki sistem.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional, yaitu kualitas sistem seperti kecepatan, keamanan, dan ketersediaan.* |
| *UC* | *Singkatan dari Use Case, yaitu gambaran interaksi antara aktor dan sistem.* |
| *CD* | *Singkatan dari Class Diagram, Diagram yang menggambarkan struktur kelas beserta atribut, metode, dan hubungan antarkelas di dalam sistem.* |
| *GPS* | *Singkatan dari Global Positioning System, yaitu sistem navigasi berbasis satelit untuk menentukan posisi.* |
| *API* | *Singkatan dari Application Programming Interface, yaitu antarmuka yang memungkinkan program saling terhubung.* |
| *Latitude / Longitude* | *Garis lintang dan garis bujur, yaitu dua nilai koordinat posisi di bumi.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang berfungsi sebagai panduan bagi pengembang untuk mengimplementasikan perangkat lunak dalam bentuk kode program.* |
| *APL* | *Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang menetapkan pola arsitektur, komponen, dan model view dari perangkat lunak.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya, jangan membuat pola baru di dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | Contoh: KF01 |
| *Kebutuhan Non-Fungsional* | *KNFXX* | Contoh: KNF02 |
| *Use Case* | *UCXX* | Contoh: UC03 |
| *Kelas* | *CXX* | Contoh: C04 |
| *...* | *...* |

## 1.5 Referensi
| Nomor | Judul Referensi | Sumber |
| :--- | :--- | :--- |
| 1 | Dokumen Spesifikasi Kebutuhan Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M5/K03_G07_SKPL.md |
| 2 | Dokumen Aristektur Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M6/K03_G07_APL.md |

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini disusun dengan sistematika berikut. **BAB 1: Pendahuluan** memuat tujuan penulisan dokumen, lingkup masalah, daftar definisi, aturan penomoran, referensi, serta ikhtisar dokumen. **BAB 2: Perancangan Arsitektur** menjelaskan rancangan lingkungan implementasi, pola arsitektur (beserta alasan pemilihannya), identifikasi komponen (beserta tanggung jawabnya), dan model arsitektur yang mengacu pada dokumen APL. **BAB 3: Realisasi Use Case**  menguraikan perancangan setiap Use Case melalui identifikasi kelas perancangan, sequence diagram (untuk skenario normal dan alternatif), serta diagram kelas. **BAB 4: Diagram Kelas Keseluruhan** menggambungkan seluruh kelas perancangan dalam satu diagram. **BAB 5: Perancangan Rinci Kelas** merincikan setiap kelas meiliputi operasi dan atribut yang terkait dengan tiap kelas, serta implementasi algoritma/query yang penting pada kelas tersebut. **BAB 6: Perancangan Antarmuka** menggambarkan rancangan tampilan antarmuka pada perangkat lunak sebagai gambaran visual. **BAB 7: Matriks Kerunutan** memetakan keterkaitan setiap kelas perancangan dengan use case untuk memastikan rancangan telah mendukung kebutuhan pada SKPL.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

| Komponen | Spesifikasi |
| :--- | :--- |
| *Server/Hosting* | Vercel dengan *runtime* Node.js 24 (LTS) |
| *Framework* | Next.js 16.3 dan React 19.3 |
| *Backend-as-a-Service* | Supabase (Auth, Database, Storage, Realtime) |
| *DBMS* | PostgreSQL 17 yang dikelola oleh Supabase |
| *Penyimpanan Berkas* | Supabase Storage |
| *Layanan Peta* | *Tile* OpenStreetMap yang ditampilkan dengan pustaka Leaflet |
| *Client* | *Web browser* modern versi terbaru (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge) yang mendukung JavaScript, WebSocket, dan *Geolocation API* |
| *Perangkat Klien* | Warga dan Eksekutor Lapangan: *smartphone* atau laptop yang memiliki kamera dan layanan lokasi (GPS). Tim Administrasi: komputer atau laptop |
| *OS* | *Cross platform* melalui *browser* (Android, iOS, Windows, macOS, Linux, bisa banyak OS asal terhubung dengan jaringan internet) |
| *Jaringan* | Koneksi internet dengan protokol HTTPS |


## 2.2 Style/Pattern Arsitektur Acuan

LaporKota menggunakan pola arsitektur *client-server*. Pemilihan pola arsitektur *client-server* didasarkan pada karakteristik LaporKota yang telah ditetapkan pada dokumen SKPL sebelumnya. 

<p align="center">
<img alt="Diagram Arsitektur Client-Server" src="./assets/diagram/arsitektur-client-server.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur client-server</i>
</p>

## Style Arsitektur yang Dipilih

Pada pola *client-server*, fungsionalitas sistem disusun sebagai sekumpulan layanan yang disediakan oleh *server*, sedangkan *client* mengakses layanan tersebut melalui jaringan. Pola ini terdiri atas tiga bagian sebagai berikut: 

1. ***Client*** adalah antarmuka yang digunakan oleh pengguna. *Client* bertugas menampilkan data, menerima masukan pengguna, memanfaatkan fitur perangkat seperti kamera dan GPS, serta meneruskan permintaan ke *server*. *Client* tidak menyimpan data laporan secara permanen dan tidak menjalankan aturan bisnis. LaporKota memiliki tiga jenis *client* sesuai dengan aktornya, yaitu *client* Warga, *client* Eksekutor Lapangan, dan *client* Tim Administrasi.
2. ***Server*** menyediakan layanan yang dipakai bersama oleh seluruh *client*. *Server* menjalankan *logic* aplikasi melalui kelas-kelas *controller*, misalnya validasi berkas, pengecekan laporan duplikat, peralihan status laporan, dan pengiriman notifikasi. *Server* juga memuat kelas-kelas *entity* yang merepresentasikan data yang diolah oleh *controller*, seperti laporan, pengguna, dan hasil perbaikan.
3. ***Database*** menyimpan seluruh data *entity* serta berkas foto dan video secara terpusat dan persisten. Data laporan dicatat ke *database* melalui *server*, sedangkan berkas foto dan video diunggah langsung dari *client* ke penyimpanan berkas karena batas ukuran *request* pada *server* (batasan vercel). Dengan penyimpanan terpusat ini, seluruh *client* selalu memperoleh data yang sama dan *updated*.
4. **Jaringan** menghubungkan *client* dengan *server* melalui koneksi internet dengan protokol HTTPS.


## Alasan Pemilihan

Pola *client-server* dipilih karena LaporKota memiliki tiga aktor dengan perangkat dan kebutuhan antarmuka yang berbeda, tetapi seluruhnya mengolah data laporan yang sama. Warga dan Eksekutor Lapangan membutuhkan *client* yang dapat mengakses kamera dan GPS perangkat, sedangkan Tim Administrasi membutuhkan *client* untuk mengelola antrean laporan. Karena satu laporan berpindah tangan dari Warga ke Tim Administrasi, Eksekutor Lapangan, lalu kembali ke Tim Administrasi untuk diverifikasi ulang, setiap aktor harus melihat status laporan yang sama dan mutakhir sehingga data perlu dikelola oleh satu *server* dan disimpan pada sarana yang terpusat di *database*. Selain itu, beberapa kebutuhan fungsional hanya dapat dijalankan di *server* karena membutuhkan akses ke seluruh data laporan, yaitu pemeriksaan duplikasi dalam radius 20 meter (KF05, KF06) dan perhitungan ulang urutan prioritas (KF13), sedangkan penguncian koordinat GPS (KF01) dijalankan di *client*. Pengumpulan layanan di *server* juga mendukung kebutuhan nonfungsional, yaitu setiap laporan memiliki tepat satu ID tiket unik karena ID diterbitkan secara terpusat (KNF06), dan hak akses antrean verifikasi dapat dibatasi hanya untuk Tim Administrasi (KNF07).

Konsekuensi dari pola ini adalah server dan layanan Supabase menjadi titik kegagalan tunggal, sehingga ketersediaan 24 jam (KNF02) bergantung pada ketersediaan Vercel dan Supabase, serta waktu respons (KNF03, KNF05) bergantung pada kualitas jaringan pengguna. Risiko ini diterima karena beban LaporKOta tergolong sedang dan tidak membutuhkan ketersediaan tingkat kritis.


## 2.3 Identifikasi Komponen / Modul / Subsistem



Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis                 | Penjelasan                                                                                                                                                                                                |
| :---------------------------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LaporPage                     | Client                | Menampilkan formulir pelaporan Warga, mengunci koordinat GPS via Geolocation API, menandai lokasi via Leaflet, memicu verifikasi anti-bot, mengunggah media bukti, dan memanggil LaporanController        |
| StatusLaporanPage             | Client                | Menampilkan linimasa status tiket pribadi (termasuk alasan penolakan), memvisualisasikan peta sebaran publik via Leaflet secara anonim, menerima upvote, dan memanggil StatusController                   |
| ValidasiPage                  | Client                | Menampilkan antrean laporan Diterima bagi Tim Administrasi, menyediakan filter kategori dan waktu, menampilkan rincian tiket, serta memanggil ValidasiController untuk persetujuan atau penolakan.        |
| EvaluasiPage                  | Client                | Menampilkan antarmuka evaluasi bagi Tim Administrasi untuk mengomparasi bukti kerusakan awal dan hasil kerja perbaikan, serta memanggil EvaluasiController untuk konfirmasi hasil penanganan              |
| PenugasanPage                 | Client                | Menampilkan daftar tugas Dikerjakan bagi Eksekutor sesuai prioritas, menyediakan filter kategori dan lokasi, tautan navigasi Google Maps, membuka HasilPerbaikanForm, dan memanggil PenugasanController   |
| HasilPerbaikanForm            | Client                | Menampilkan formulir bagi Eksekutor untuk mengisi catatan teknis perbaikan, mengunggah foto atau video bukti penyelesaian ke Supabase Storage, dan memanggil PerbaikanController                          |
| NotifikasiController          | Server                | Mengonstruksi pesan perubahan status tiket laporan dan menyalurkan notifikasi secara real-time ke antarmuka akun Warga pelapor melalui kanal WebSocket Supabase Realtime                                  |
| LaporanController             | Server                | Memvalidasi kelayakan berkas, memeriksa lokasi, mengecek duplikasi radius 20 meter, mengalihkan duplikat menjadi upvote, menerbitkan ID tiket unik, serta memanggil NotifikasiController                  |
| StatusController              | Server                | Mengambil linimasa laporan warga, menyajikan data laporan publik secara anonim, memproses upvote, dan memicu kalkulasi ulang skor prioritas serta pembaruan notifikasi                                    |
| ValidasiController            | Server                | Menyusun antrean laporan Diterima, menyimpan alasan penolakan (status Ditolak), menyetujui laporan (status Dikerjakan), menghitung prioritas, serta memanggil NotifikasiController                        |
| EvaluasiController            | Server                | Menyimpan evaluasi admin, menyetujui laporan (status Berhasil) atau mengembalikan tugas (status Dikerjakan), merekam stempel waktu, serta memanggil NotifikasiController                                  |
| PenugasanController           | Server                | Mengambil laporan Dikerjakan dari basis data untuk mengonstruksi ListTugas, serta mengoordinasikan fitur pengurutan prioritas dan penyaringan kategori atau lokasi penugasan                              |
| PerbaikanController           | Server                | Memvalidasi kelengkapan bukti kerja, mengaitkan rekaman HasilPerbaikan ke laporan di basis data, dan memperbarui status tiket agar siap dievaluasi oleh Tim Administrasi                                  |
| Notifikasi                    | Server                | Entitas data pesan perubahan status laporan yang menyimpan idNotifikasi, isi pesan, waktu kirim, dan status baca, serta menyediakan operasi pembuatan pesan notifikasi                                    |
| Laporan                       | Server                | Entitas data utama laporan yang menyimpan atribut tiket, status (Diterima, Ditolak, Dikerjakan, Berhasil), waktu masuk, skor prioritas, dan alasan penolakan, serta mengelola mutasi statusnya            |
| Lokasi                        | Server                | Entitas data posisi geospasial yang menyimpan koordinat latitude dan longitude kerusakan, serta menyediakan metode hitungJarak untuk kalkulasi radius deteksi duplikasi laporan                           | 
| Video                         | Server                | Entitas data berkas audio-visual bukti laporan dan hasil perbaikan dengan batasan format MP4, MOV, atau MKV maksimal 10 MB, serta memvalidasi keabsahan spesifikasi berkas                                |
| Foto                          | Server                | Entitas data berkas gambar bukti laporan dan hasil perbaikan dengan batasan format JPG atau PNG maksimal 10 MB, serta memvalidasi keabsahan spesifikasi berkas gambar                                     |
| Upvote                        | Server                | Entitas data dukungan warga pada laporan aktif melalui idUpvote dan waktuUpvote guna meningkatkan tingkat urgensi dan prioritas penanganan laporan kerusakan                                              |
| Evaluasi                      | Server                | Entitas data verifikasi hasil kerja yang memuat idEvaluasi, keputusan persetujuan, uraian catatan evaluasi, dan waktu evaluasi penanganan oleh Tim Administrasi                                           |
| ListTugas                     | Server                | Entitas data koleksi penugasan aktif Eksekutor yang memuat daftar laporan yang harus ditangani beserta metode pengurutan skala prioritas dan penyaringan kategori tugas                                   |
| HasilPerbaikan                | Server                | Entitas data dokumentasi penanganan fisik fasilitas yang menyimpan idHasil, catatan teknis, waktu unggah, identitas eksekutor, serta relasi berkas media bukti penyelesaian kerja                         |
| User                          | Server                | Entitas data akun seluruh pengguna yang menyimpan idUser, nama, email, dan role, serta menyediakan metode validasi hak akses untuk peran Warga, Tim Administrasi, dan Eksekutor Lapangan                  |
| PostgreSQL                    | Database              | Menyimpan seluruh data entitas model secara terpusat dan persisten, menjaga integritas relasional data antartabel, dan menjamin keunikan ID tiket laporan                                                 |
| Supabase Auth                 | Database              | Menyimpan kredensial identitas pengguna, mengelola sesi login, dan menegakkan otorisasi hak akses berbasis peran (Role-Based Access Control) bagi seluruh aktor sistem                                    |
| Supabase Storage              | Database              | Menyimpan berkas biner foto dan video bukti laporan serta bukti hasil perbaikan fisik yang diunggah langsung dari klien guna mengatasi batasan ukuran muatan request serverless Vercel                    |

## 2.4 Model Arsitektur Perangkat Lunak


### 2.4.1 Logical View

<p align="center">
<img alt="Logical View LaporKota" src="./assets/diagram/logical-view-diagram-LaporKota.jpg" width="100%">
</p>
<p align="center">
<i>Gambar 2. Logical View pada LaporKota</i>
</p>

Gambar 2 menunjukkan model arsitektur Client-Server dari sistem LaporKota dalam perspektif Logical View dengan menggunakan Block Diagram. Seluruh komponen pada Tabel 2.1 digambarkan dan dikelompokkan sesuai pola Client-Server (*Client*, *Server*, *Database*). Setiap garis antar komponen diberi label yang merincikan bentuk hubungan pada masing-masing komponen.

Model Logical View ini dipilih karena *LaporKota* memiliki tiga peran dengan hak akses yang berbeda (berdasarkan SKPL 2.3) dan enam use case yang masing-masing dilayani halaman dan controller sendiri, sehingga pembagian tanggung jawab antarkomponen perlu terlihat lebih jelas dalam satu gambar. Selain itu, beberapa KNF hanya dapat dibuktikan lewat letak tanggung jawab komponen: seperti pembatasan akses (KNF07, KNF12), serta tiket unik dan pemeriksaan duplikasi laporan (KNF05, KNF06).


<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case Mengirim Laporan Kerusakan

**ID Use Case:** UC01  
**Nama Use Case:** Mengirim Laporan Kerusakan

### 3.1.1 Identifikasi Kelas

Tabel 3.1 memetakan kelas perancangan yang terlibat dalam realisasi UC01 ke kelas analisis pada SKPL. Kelas analisis Warga direalisasikan sebagai kelas perancangan User dengan atribut role bernilai "Warga", karena akun ketiga aktor dikelola oleh satu kelas yang sama.

Tabel 3.1. Identifikasi Kelas Use Case UC01

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | LaporPage | C11 - LaporPage |
| 2 | LaporanController | C17 - LaporanController |
| 3 | NotifikasiController | C23 - NotifikasiController |
| 4 | User | C01 - Warga |
| 5 | Laporan | C02 - Laporan |
| 6 | Lokasi | C03 - Lokasi |
| 7 | Foto | C04 - Foto |
| 8 | Video | C05 - Video |
| 9 | Notifikasi | C10 - Notifikasi |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC01 Skenario Normal" src="./assets/diagram/uc01-sd-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3. Sequence Diagram UC01 Mengirim Laporan Kerusakan</i>
</p>


- **Skenario Alternatif 1: Foto/Video Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC01 Alternatif 1" src="./assets/diagram/uc01-sd-alt1.png" width="90%">
</p>
<p align="center">
<i>Gambar 4. Sequence Diagram UC01 - Foto/Video Tidak Valid</i>
</p>



- **Skenario Alternatif 2: Lokasi di Luar Daerah Penanganan**

<p align="center">
<img alt="Sequence Diagram UC01 Alternatif 2" src="./assets/diagram/uc01-sd-alt2.png" width="90%">
</p>
<p align="center">
<i>Gambar 5. Sequence Diagram UC01 - Lokasi di Luar Daerah Penanganan</i>
</p>


### 3.1.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC01" src="./assets/diagram/uc01-class.png" width="100%">
</p>
<p align="center">
<i>Gambar 6. Diagram Kelas Mengirim Laporan Kerusakan</i>
</p>

## 3.2 Use Case Memvalidasi Laporan Baru

**ID Use Case:** UC02  
**Nama Use Case:** Memvalidasi Laporan Baru

### 3.2.1 Identifikasi Kelas


Tabel 3.2. Identifikasi Kelas Use Case UC02

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:---|:---|:---|
| 1 | ValidasiPage | C12 - ValidasiPage |
| 2 | ValidasiController | C18 - ValidasiController |
| 3 | NotifikasiController | C23 - NotifikasiController |
| 4 | User | C01 - User |
| 5 | Laporan | C02 - Laporan |
| 6 | Lokasi | C03 - Lokasi |
| 7 | Foto | C04 - Foto |
| 8 | Video | C05 - Video |
| 9 | Upvote | C06 - Upvote |
| 10 | Notifikasi | C10 - Notifikasi |

### 3.2.2 Sequence Diagram

- **Skenario Normal: Menyetujui Laporan Kerusakan (Status: "Dikerjakan")**

<p align="center">
<img alt="Sequence Diagram UC02 Skenario Normal" src="./assets/diagram/uc02-sd-normal.png" width="95%">
</p>
<p align="center">
<i>Gambar 7. Sequence Diagram UC02 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Menyaring Antrean Sebelum Meninjau**

<p align="center">
<img alt="Sequence Diagram UC02 Alternatif 1" src="./assets/diagram/uc02-sd-alt1.png" width="85%">
</p>
<p align="center">
<i>Gambar 8. Sequence Diagram UC02 - Menyaring Antrean Sebelum Meninjau</i>
</p>

- **Skenario Alternatif 2: Laporan Dinyatakan Tidak Valid (Status: "Ditolak")**

<p align="center">
<img alt="Sequence Diagram UC02 Alternatif 2" src="./assets/diagram/uc02-sd-alt2.png" width="95%">
</p>
<p align="center">
<i>Gambar 9. Sequence Diagram UC02 - Laporan Dinyatakan Tidak Valid</i>
</p>

### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC02 Memvalidasi Laporan Baru" src="./assets/diagram/uc02-cd.png" width="85%">
</p>
<p align="center">
<i>Gambar 10. Diagram Kelas Memvalidasi Laporan Baru</i>
</p>

## 3.3 Use Case Melihat Penugasan Lapangan

**ID Use Case:** *UC03*  
**Nama Use Case:** *Melihat Penugasan Lapangan*

### 3.3.1 Identifikasi Kelas

Tabel 3.3. Identifikasi Kelas Use Case UC03

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *PenugasanPage* | *C13 - PenugasanPage* |
| 2 | *PenugasanController* | *C19 - PenugasanController* |
| 3 | *ListTugas* | *C07 - ListTugas* |
| 4 | *Laporan* | *C02 - Laporan* |
| 5 | *User* | *C01 - User* |
| 6 | *Foto* | *C04 - Foto* |
| 7 | *Video* | *C05 - Video* |

### 3.3.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-03-SD-Normal.webp" width="50%">
</p>
<p align="center">
<i>Gambar 11. Sequence Diagram UC03</i>
</p>

- **Skenario Alternatif [1]: Menyaring Daftar Penugasan Berdasarkan Kategori**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-03-SD-Alt1.webp" width="50%">
</p>
<p align="center">
<i>Gambar 12. Sequence Diagram UC03 - Menyaring Daftar Penugasan Berdasarkan Kategori</i>
</p>

- **Skenario Alternatif [2]: Belum Ada Penugasan yang Tersedia**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-03-SD-Alt2.webp" width="50%">
</p>
<p align="center">
<i>Gambar 13. Sequence Diagram UC03 - Belum Ada Penugasan yang Tersedia</i>
</p>

### 3.3.3 Diagram Kelas


<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-03-CD.webp" width="35%">
</p>
<p align="center">
<i>Gambar 14. Diagram Kelas Melihat Penugasan Lapangan</i>
</p>

## 3.4 Use Case Melaporkan Hasil Penugasan

**ID Use Case:** *UC04*  
**Nama Use Case:** *Melaporkan Hasil Penugasan*

### 3.4.1 Identifikasi Kelas


Tabel 3.4. Identifikasi Kelas Use Case UC04

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *PenugasanPage* | *C13 - PenugasanPage* |
| 2 | *PenugasanController* | *C19 - PenugasanController* |
| 3 | *HasilPerbaikanForm* | *C14 - HasilPerbaikanForm* |
| 4 | *PerbaikanController* | *C20 - PerbaikanController* |
| 5 | *ListTugas* | *C07 - ListTugas* |
| 6 | *Laporan* | *C02 - Laporan* |
| 7 | *HasilPerbaikan* | *C08 - HasilPerbaikan* |
| 8 | *User* | *C01 - User* |
| 9 | *Foto* | *C04 - Foto* |
| 10 | *Video* | *C05 - Video* |

### 3.4.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-04-SD-Normal.webp" width="50%">
</p>
<p align="center">
<i>Gambar 15. Sequence Diagram UC04</i>
</p>

- **Skenario Alternatif 1: Data Laporan Belum Lengkap**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-04-SD-Alt1.webp" width="50%">
</p>
<p align="center">
<i>Gambar 16. Sequence Diagram UC04 - Data Laporan Belum Lengkap</i>
</p>

- **Skenario Alternatif 2: Data Laporan Belum Lengkap**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-04-SD-Alt1.webp" width="50%">
</p>
<p align="center">
<i>Gambar 16. Sequence Diagram UC04 - Data Laporan Belum Lengkap</i>
</p>

### 3.4.3 Diagram Kelas


<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-04-CD.webp" width="35%">
</p>
<p align="center">
<i>Gambar 17. Diagram Kelas Melaporkan Hasil Penugasan</i>
</p>

## 3.5 Use Case Mengevaluasi Hasil Kerja

**ID Use Case:** *UC05*  
**Nama Use Case:** *Mengevaluasi Hasil Kerja*

### 3.5.1 Identifikasi Kelas


Tabel 3.5. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *EvaluasiPage* | *C15 - EvaluasiPage* |
| 2 | *EvaluasiController* | *C21 - EvaluasiController* |
| 3 | *Evaluasi* | *C09 - Evaluasi* |
| 4 | *Laporan* | *C02 - Laporan* |
| 5 | *HasilPerbaikan* | *C08 - HasilPerbaikan* |
| 6 | *User* | *C01 - User* |
| 7 | *Foto* | *C04 - Foto* |
| 8 | *Video* | *C05 - Video* |
| 9 | *NotifikasiController* | *C23 - NotifikasiController* |
| 10 | *Notifikasi* | *C10 - Notifikasi* |

### 3.5.2 Sequence Diagram


- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-05-SD.png" width="50%">
</p>
<p align="center">
<i>Gambar 18. Sequence Diagram UC05</i>
</p>

- **Skenario Alternatif 1: Pekerjaan belum selesai**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-05-SD-Alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 19. Sequence Diagram UC05 - Pekerjaan belum selesai</i>
</p>

- **Skenario Alternatif 2: Foto/video pekerjaan tidak ada atau tidak jelas**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-05-SD-Alt2.png" width="50%">
</p>
<p align="center">
<i>Gambar 20. Sequence Diagram UC05 - Pekerjaan belum selesai</i>
</p>

### 3.5.3 Diagram Kelas


<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC-05-CD.png" width="35%">
</p>
<p align="center">
<i>Gambar 21. Diagram Kelas [Nama Uce Case]</i>
</p>

## 3.6 Use Case Memantau Status Laporan

**ID Use Case:** *UC06*  
**Nama Use Case:** *Memantau Status Laporan*

### 3.6.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.6. Identifikasi Kelas Use Case [UC06]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | StatusLaporanPage | C16 - StatusLaporanPage |
| 2 | StatusController | C22 - StatusController |
| 3 | NotifikasiController | C23 - NotifikasiController |
| 4 | User | C01 - Warga |
| 5 | Laporan | C02 - Laporan |
| 6 | Lokasi | C03 - Lokasi |
| 7 | Foto | C04 - Foto |
| 8 | Video | C05 - Video |
| 9 | Upvote | C06 - Upvote |
| 10 | HasilPerbaikan | C08 - HasilPerbaikan |
| 11 | Notifikasi | C10 - Notifikasi |

### 3.6.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC06" src="./assets/diagram/UC-06-SD.webp" width="50%">
</p>
<p align="center">
<i>Gambar 22. Sequence Diagram UC06</i>
</p>

- **Skenario Alternatif 1: Memantau Laporan Publik via Peta Sebaran dan Memberikan Dukungan (Upvote)**

<p align="center">
<img alt="Sequence Diagram UC06-Alt1" src="./assets/diagram/UC-06-SD-Alt1.webp" width="50%">
</p>
<p align="center">
<i>Gambar 23. Sequence Diagram UC06 - Memantau Laporan Publik via Peta Sebaran dan Memberikan Dukungan (Upvote)</i>
</p>

- **Skenario Alternatif 2: Memantau Laporan yang Berstatus "Ditolak"**

<p align="center">
<img alt="Sequence Diagram UC06-Alt2" src="./assets/diagram/UC-06-SD-Alt2.webp" width="50%">
</p>
<p align="center">
<i>Gambar 24. Sequence Diagram UC06 - Laporan Berstatus "Ditolak"</i>
</p>

### 3.6.3 Diagram Kelas


<p align="center">
<img alt="Diagram Kelas Memantau Status Laporan" src="./assets/diagram/UC-06-CD.webp" width="70%">
</p>
<p align="center">
<i>Gambar 25. Diagram Kelas Memantau Status Laporan</i>
</p>

<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/Keseluruhan-CD.webp" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan [Nama P/L]</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | User | - idUser: String<br>- nama: String<br>- email: String<br>- role: String | + getRole(): String<br>+ getIdUser(): String<br>+ isAdmin(): Boolean |
| C02 | Laporan | - idTiket: String<br>- kategori: String<br>- deskripsi: String<br>- status: String<br>- waktuMasuk: DateTime<br>- jumlahUpvote: Integer<br>- skorPrioritas: Float<br>- alasanPenolakan: String | + Laporan(idTiket: String, kategori: String, deskripsi: String, foto: List[Foto], video: List[Video], lokasi: Lokasi)<br>+ simpanLaporan(): Boolean<br>+ hitungPrioritas(): Float<br>+ getRincian(): Laporan<br>+ getRincianPublik(): Laporan<br>+ tambahUpvote(upvote: Upvote): Integer<br>+ updateStatus(statusBaru: String): Boolean<br>+ setAlasanPenolakan(alasan: String): void<br>+ getByStatus(status: String): List[Laporan]<br>+ filterByKategori(kategori: String, status: String): List[Laporan] |
| C03 | Lokasi | - latitude: Double<br>- longitude: Double | + dalamWilayah(): Boolean<br>+ hitungJarak(lokasiLain: Lokasi): Double<br>+ getKoordinat(): String |
| C04 | Foto | - url: String<br>- format: String<br>- ukuran: Integer | + isFotoValid(): Boolean |
| C05 | Video | - url: String<br>- format: String<br>- ukuran: Integer | + isVideoValid(): Boolean |
| C06 | Upvote | - idUpvote: String<br>- waktuUpvote: DateTime | + catatUpvote(idUser: String): void<br>+ getJumlahUpvote(): Integer |
| C07 | ListTugas | - jumlahLaporanAktif: Integer<br>- daftarLaporan: List[Laporan] | + urutPrioritas(): List[Laporan]<br>+ filterKategori(kategori: String): List[Laporan]<br>+ getLaporanById(idTiket: String): Laporan |
| C08 | HasilPerbaikan | - idHasil: String<br>- catatan: String<br>- waktuUnggah: DateTime<br>- fotoBukti: List[Foto]<br>- videoBukti: List[Video] | + validasiBerkas(foto: List[Foto], video: List[Video]): Boolean<br>+ simpanBukti(): Boolean<br>+ getBuktiLengkap(): HasilPerbaikan |
| C09 | Evaluasi | - idEvaluasi: String<br>- idTiket: String<br>- keputusan: String<br>- catatan: String<br>- waktuEvaluasi: DateTime | + Evaluasi(idTiket: String, keputusan: String, catatan: String)<br>+ simpanEvaluasi(): Boolean<br>+ getKeputusan(): String |
| C10 | Notifikasi | - idNotifikasi: String<br>- isiPesan: String<br>- waktuKirim: DateTime<br>- statusBaca: Boolean | + Notifikasi(idUser: String, pesan: String)<br>+ createNotifikasi(idUser: String, pesan: String)<br>+ createNotifikasiSelesai(idUser: String)<br>+ buatPesan(): String<br>+ tandaiDibaca(): Boolean |
| C11 | LaporPage | - kategoriDipilih: String<br>- inputDeskripsi: String<br>- berkasFoto: List[Foto]<br>- berkasVideo: List[Video]<br>- lokasiTerkunci: Lokasi | + bukaForm(): void<br>+ userInput(kategori: String, deskripsi: String, foto: List[Foto], video: List[Video]): void<br>+ kunciLokasi(): void<br>+ tandaiLokasiManual(latitude: Double, longitude: Double): void<br>+ submitForm(): void<br>+ batalkanLaporan(): void<br>- ambilTokenAntiBot(): String<br>- hapusBerkasTidakValid(): void<br>- tampilkanPesan(pesan: String): void |
| C12 | ValidasiPage | - pilihanFilter: String<br>- idTiketTerpilih: String<br>- inputAlasanPenolakan: String | + bukaDasborPenanganan(): void<br>+ tampilkanAntrean(): void<br>+ pilihFilterKategori(kategori: String): void<br>+ pilihLaporan(idTiket: String): void<br>+ onValidClicked(idTiket: String): void<br>+ onTolakClicked(idTiket: String): void<br>+ submitAlasanPenolakan(idTiket: String, alasan: String): void |
| C13 | PenugasanPage | - pilihanKategori: String<br>- statusTampilan: String<br>- idTiketAktif: String | + tampilkanPage(): void<br>+ pindahPage(): void<br>+ renderRincianLaporan(laporan: Laporan): void<br>+ renderListTugas(daftar: List[Laporan]): void<br>+ pilihLaporan(): void<br>+ pilihKategori(): void |
| C14 | HasilPerbaikanForm | - statusTampilan: String<br>- inputDeskripsi: String<br>- berkasFoto: List[Foto]<br>- berkasVideo: List[Video] | + tampilkanForm(idTiket: String): void<br>+ renderBerkas(): void<br>+ userInput(deskripsi: String, foto: List[Foto], video: List[Video]): void<br>+ submitForm(): void |
| C15 | EvaluasiPage | - daftarPekerjaan: List[Laporan]<br>- idTiketDipilih: String<br>- inputCatatan: String | + tampilkanPage(): void<br>+ renderListPekerjaan(daftar: List[Laporan]): void<br>+ pilihPekerjaan(idTiket: String): void<br>+ renderDetailPekerjaan(laporan: Laporan, hasil: HasilPerbaikan): void<br>+ konfirmasiSelesai(): void<br>+ konfirmasiBelumSelesai(catatan: String): void<br>+ mintaUlangBukti(catatan: String): void<br>+ tampilkanHasilEvaluasi(berhasil: Boolean): void |
| C16 | StatusLaporanPage | - pilihanTiket: String<br>- modeTampilan: String | + pilihMenuRiwayat(): void<br>+ pilihMenuPeta(): void<br>+ bukaTautanNotifikasi(idNotifikasi: String): void<br>+ pilihTiket(idTiket: String): void<br>+ pilihMarker(idTiket: String): void<br>+ onUpvoteClicked(): void<br>+ tampilkanRiwayat(daftarLaporan: List[Laporan]): void<br>+ tampilkanPetaSebaran(daftarLaporanPublik: List[Laporan]): void<br>+ tampilkanDetailTiket(detail: Laporan): void |
| C17 | LaporanController | - idUserAktif: String | + validasiBerkas(foto: List[Foto], video: List[Video]): Boolean<br>+ validasiLokasi(lokasi: Lokasi): Boolean<br>+ kirimLaporan(kategori: String, deskripsi: String, foto: List[Foto], video: List[Video], lokasi: Lokasi, token: String): String<br>- verifikasiAkses(): Boolean<br>- verifikasiAntiBot(token: String): Boolean<br>- cekDuplikat(lokasi: Lokasi, kategori: String): Laporan<br>- terbitkanIdTiket(): String |
| C18 | ValidasiController | - idUserAktif: String | + verifikasiAkses(): Boolean<br>+ susunAntrean(): List[Laporan]<br>+ saringAntrean(kategori: String): List[Laporan]<br>+ ambilRincianLaporan(idTiket: String): Laporan<br>+ setujuiLaporan(idTiket: String): Boolean<br>+ tolakLaporan(idTiket: String, alasan: String): Boolean |
| C19 | PenugasanController | - idUserAktif: String | + doFilter(kategori: String): List[Laporan]<br>+ doSorting(): List[Laporan]<br>+ verifikasiAkses(): Boolean<br>+ bukaLaporan(idTiket: String): Laporan |
| C20 | PerbaikanController | - idLaporan: String<br>- idUserAktif: String | + validasiForm(catatan: String, foto: List[Foto], video: List[Video]): Boolean<br>+ verifikasiAkses(): Boolean<br>+ unggahHasil(idTiket: String, catatan: String, foto: List[Foto], video: List[Video]): Boolean |
| C21 | EvaluasiController | - idUserAktif: String | + verifikasiAkses(): Boolean<br>+ ambilDaftarUntukEvaluasi(): List[Laporan]<br>+ pilihSiapEvaluasi(daftar: List[Laporan]): List[Laporan]<br>+ urutkanBerdasarkanWaktu(daftar: List[Laporan]): List[Laporan]<br>+ ambilDetailEvaluasi(idTiket: String): Object<br>+ simpanKeputusan(idTiket: String, keputusan: String, catatan: String): Boolean<br>+ ambilIdEksekutor(idTiket: String): String<br>+ ambilIdWarga(idTiket: String): String |
| C22 | StatusController | - idUserAktif: String | + ambilRiwayatWarga(): List[Laporan]<br>+ ambilLaporanPublik(): List[Laporan]<br>+ ambilDetailStatus(idTiket: String): Laporan<br>+ prosesUpvote(idTiket: String): Integer |
| C23 | NotifikasiController | - idPenerima: String | + susunPesanNotifikasi(idPenerima: String, pesan: String): void<br>+ kirimNotifikasi(idPenerima: String, pesan: String): Boolean<br>+ kirimNotifikasiSelesai(idPenerima: String): Boolean<br>+ updateStatusBaca(idNotifikasi: String): Boolean |


<br>

---

# BAB 5: Perancangan Rinci Kelas

Bagian ini diisi dengan daftar seluruh kelas dalam tabel berikut:

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *User* | *User* |
| 2 | *Laporan* | *Laporan* |
| 3 | *Lokasi* | *Lokasi* |
| 4 | *Foto* | *Foto* |
| 5 | *Video* | *Video* |
| 6 | *Upvote* | *Upvote* |
| 7 | *ListTugas* | *ListTugas* |
| 8 | *HasilPerbaikan* | *HasilPerbaikan* |
| 9 | *Evaluasi* | *Evaluasi* |
| 10 | *Notifikasi* | *Notifikasi* |
| 11 | *LaporPage* | *LaporPage* |
| 12 | *ValidasiPage* | *ValidasiPage* |
| 13 | *PenugasanPage* | *PenugasanPage* |
| 14 | *HasilPerbaikanForm* | *HasilPerbaikanForm* |
| 15 | *EvaluasiPage* | *EvaluasiPage* |
| 16 | *StatusLaporanPage* | *StatusLaporanPage* |
| 17 | *LaporanController* | *LaporanController* |
| 18 | *ValidasiController* | *ValidasiController* |
| 19 | *PenugasanController* | *PenugasanController* |
| 20 | *PerbaikanController* | *PerbaikanController* |
| 21 | *EvaluasiController* | *EvaluasiController* |
| 22 | *StatusController* | *StatusController* |
| 23 | *NotifikasiController* | *NotifikasiController* |

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

## 5.7 Kelas ListTugas
**Nama Kelas:** *ListTugas*  
**ID Kelas:** *C07*

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *urutPrioritas(): List[Laporan]* | *public* | *Menerima permintaan untuk menghitung skor prioritas setiap laporan dalam ListTugas dan pengurutan berdasarma  skor tersebut dan meneruskannya pada PenugasanController.* |
| *filterKategori(kategori: String): List[Laporan]* | *public* | *Menerima permintaan untuk menyaring setiap laporan dalam ListTugas yang memenuhi kategori tertentu dan meneruskannya pada PenugasanController.* |
| *getLaporanById(idTiket: String): Laporan* | *public* | *Mencari dan mengembalikan objek Laporan dengan ID tertentu.* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *jumlahLaporanAktif* | *private* | *Integer* |
| *daftarLaporan* | *private* | *List[Laporan]* |

### 5.7.1 Algoritma/Query

**Nama Kelas:** *ListTugas*  
**Nama Operasi:** *urutPrioritas*  
**ID Algoritma:** *[Algo-00x]*

```text
function urutPrioritas()
    n <- jumlahLaporanAktif
    if n = 0 then
        return daftarLaporan
    i traversal [0..n-1]
        daftarLaporan[i].hitungPrioritas()
    newDaftar <- {algoritma sorting Laporan}
    return newDaftar
    
```

### 5.7.2 Algoritma/Query

**Nama Kelas:** *ListTugas*  
**Nama Operasi:** *filterKategori*  
**ID Algoritma:** *[Algo-00x]*

```text
function filterKategori(kategori):
    n <- jumlahLaporanAktif
    if n = 0 then
        return daftarLaporan
    hasil <- NIL
    x <- 0
    i traversal [0..n-1]
        if laporan.getKategori == kategori then
            hasil[x] <- laporan
            x <- x+1
    return hasil
    
```

## 5.8 Kelas HasilPerbaikan
**Nama Kelas:** *HasilPerbaikan*  
**ID Kelas:** *C08*

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *validasiBerkas(foto: List[Foto], video: List[Video]): Boolean* | *public* | *Memeriksa format dan ukuran dari setiap berkas bukti perbaikan (foto/video)* |
| *simpanBukti(): Boolean* | *public* | *Menyimpan deskripsi, serta berkas bukti hasil perbaikan ke basis data untuk laporan tertentu.* |
| *getBuktiLengkap(): HasilPerbaikan* | *public* | *Mengembalikan dokumentasi hasil perbaikan beserta deskripsi dan berkas bukti.* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *idHasil* | *private* | *String* |
| *catatan* | *private* | *String* |
| *waktuUnggah* | *private* | *DateTime* |
| *fotoBukti* | *private* | *List[Foto]* |
| *videoBukti* | *private* | *List[Video]* |

### 5.8.1 Algoritma/Query


**Nama Kelas:** *HasilPerbaikan*  
**Nama Operasi:** *validasiBerkas*  
**ID Algoritma:** *[Algo-00x]*

```text
function validasiBerkas(foto, video):
    for f in foto do
        if not(f.isFotoValid()) then
            return false
    for v in video do
        if not(v.isVideoValid()) then
            return false
    return true 
```

### 5.8.2 Algoritma/Query


**Nama Kelas:** *HasilPerbaikan*  
**Nama Operasi:** *simpanBukti*  
**ID Algoritma:** *[Algo-00x]*

```text
function simpanBukti():
    waktuUnggah <- time.current
    idHsasil <- Q-001(idTiket, catatan, waktuUnggah)
    if idHasil = NIL then
        return false
    for f in fotoBukti do
        Q-002(idHasil, f.url, f.format, f.ukuran)
    for v in videoBukti do
        Q-003(idHasil, v.url, v.format, v.ukuran)
```


Tabel 5.8.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-001* | *INSERT INTO hasil_perbaikan (id_tiket, catatan, waktu_unggah) VALUES ($1, $2, $3) RETURNING id_hasil;* | *Menyimpan data hasil perbaikan untuk suatu laporan dan mengembalikan ID untuk hasil perbaikan tersebut* |
| *Q-002* | *INSERT INTO foto (id_hasil, url, format, ukuran) VALUES ($1, $2, $3, $4);* | *Menyimpan tautan berkas foto bukti yang diunggah ke Supabase Storage* |
| *Q-003* | *INSERT INTO video (id_hasil, url, format, ukuran) VALUES ($1, $2, $3, $4);* | *Menyimpan tautan berkas video bukti yang diunggah ke Supabase Storage* |
| *...* | *...* | *...* |

## 5.13 Kelas PenugasanPage
**Nama Kelas:** *PenugasanPage*  
**ID Kelas:** *C13*
| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanPage(): void* | *public* | *Membuka dashboard penugasan Eksekutor Lapangan, meminta verifikasi askes, memuat list laporan yang harus dikerjakan* |
| *pindahPage(): void* | *public* | *Mengalihkan tampilan ke halaman lain* |
| *renderRincianLaporan(laporan: Laporan): void* | *public* | *Menampilkan rincian dari laporan yang dipilih (foto, deskripsi, dll).* |
| *renderListTugas(daftar: List[Laproan]): void* | *public* | *Menampilkan daftar penugasan, yaitu list Laporan berstatus "Dikerjakan" milik User. Menampilkan list kosong jika belum ada penugasan.* |
| *pilihLaporan(): void* | *public* | *Menerima laporan yang dipilih (di-klik) User dan meneruskan idTiket nya ke PenugasanController.* |
| *pilihKategori(): void* | *public* | *Menerima jenis kategori yang dipilih (di-klik) User dan meneruskannya ke PenugasanController.* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *pilihanKategori* | *private* | *String* |
| *statusTampilan* | *private* | *String* |
| *idTiketAktif* | *private* | *String* |

### 5.13.1 Algoritma/Query


**Nama Kelas:** *PenugasanPage*  
**Nama Operasi:** *tampilkanPage()*  
**ID Algoritma:** *[Algo-00x]*

```text
procedure tampilkanPage():
    if not(penugasanController.verifikasiAkses()) then
        output("Gagal menampilkan page")
        return
    else
        daftar <- penugasanController.doSorting()
        renderListTugas(daftar)
```

### 5.13.2 Algoritma/Query


**Nama Kelas:** *PenugasanPage*  
**Nama Operasi:** *pilihLaporan()*  
**ID Algoritma:** *[Algo-00x]*

```text
procedure pilihLaporan():
    idTiketAktif <- {id elemen laporan yang di klik}
    laporan <- penugasanController.bukaLaporan(idTiketAktif)
    renderRincianLaporan(laporan)
```



## 5.14 Kelas HasilPerbaikanForm
**Nama Kelas:** *HasilPerbaikanForm*  
**ID Kelas:** *C14*

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanForm(idTiket: String): void* | *public* | *Menampilkan formulir input hasil perbaikan untuk laporan dengan ID tertentu* |
| *renderBerkas(): void* | *public* | *Menampilkan preview foto, video, dan deskripsi yang sudah diinput* |
| *userInput(deskripsi: String, foto: List[Foto], video: List[Video]): void* | *public* | *Menerima deskripsi pekerjaan, serta berkas (foto dan/atau video) dari Eksekutor* |
| *submitForm(): void* | *public* | *Mengirim isi formulir ke PerbaikanController saat aktor menekan "Kirim Laporan" dan menampilkan pesan konfirmasi terkirim.* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *statusTampilan* | *private* | *String* |
| *inputDeskripsi* | *private* | *String* |
| *berkasFoto* | *private* | *List[Foto]* |
| *berkasVideo* | *private* | *List[Video]* |

### 5.14.1 Algoritma/Query


**Nama Kelas:** *HasilPernaikanForm*  
**Nama Operasi:** *submitForm()*  
**ID Algoritma:** *[Algo-00x]*

```text
procedure submitForm():
    berhasil <- perbaikanController.unggahHasil(idTiket, inputDeskripsi, berkasFoto, berkasVideo)
    if berhasil then
        output("terkirim")
    else
        output("Gagal terkirim")
```


## 5.19 Kelas PenugasanController
**Nama Kelas:** *PenugasanController*  
**ID Kelas:** *C19*

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *doFilter(kategori: String): List[Laporan]* | *public* | *Mengembalikan list laporan yang telah disaring dari ListTugas berdasarkan input kategori.* |
| *doSorting(): List[Laporan]* | *public* | *Mengembalikan list laporan yang telah terurut dari ListTugas berdasarkan skor prioritas dari tertinggi hingga terendah.* |
| *verifikasiAkses(): Boolean* | *public* | *Memastikan pengguna memiliki hak akses (role Eksekutor Lapangan)* |
| *bukaLaporan(idTiket: String): Laporan* | *public* | *Mengembalikan objek Laporan dengan ID tertentu untuk ditampilkan rinciannya* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *idUserAktif* | *private* | *String* |

### 5.19.1 Algoritma/Query


**Nama Kelas:** *PenugasanController*  
**Nama Operasi:** *verifikasiAkses()*  
**ID Algoritma:** *[Algo-00x]*

```text
function verifikasiAkses():
    role <- user.getRole()
    return role = "EksekutorLapangan"
```


### 5.19.2 Algoritma/Query


**Nama Kelas:** *PenugasanController*  
**Nama Operasi:** *doSorting()*  
**ID Algoritma:** *[Algo-00x]*

```text
function doSorting():
    daftarLaporan <- Q-001
    listTugas <- {ListTugas baru}
    return listTugas.urutPrioritas()

```

Tabel 5.19.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *SELECT (id_ticket, kategori, deskripsi, status, waktu_masuk, jumlah_upvote, skor_prioritas) FROM laporan WHERE (status="Dikerjakan")* | *Mengambil seluruh laporan yang sudah disetujui Tim Administrasi untuk dikerjakan Eksekutor Lapangan* |
| *...* | *...* | *...* |

## 5.20 Kelas PerbaikanController
**Nama Kelas:** *PerbaikanController*  
**ID Kelas:** *C20*

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *validasiForm(catatan: String, foto: List[Foto], video: List[Video]): Boolean* | *public* | *Memeriksa kelengkapan input user (deskripsi & foto)* |
| *verifikasiAkses(): Boolean* | *public* | *Memastikan pengguna memiliki hak akses (role Eksekutor Lapangan)* |
| *unggahHasil(idTiket: String, catatan: String, foto: List[Foto], video: List[Video]): Boolean* | *public* | *Mengoordinasi verifikasi akses, pemeriksaan eklengkapan, dan pembuatan objek HasilPerbaikan.* |

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *idLaporan* | *private* | *String* |
| *idUserAktif* | *private* | *String* |

### 5.20.1 Algoritma/Query


**Nama Kelas:** *PerbaikanController*  
**Nama Operasi:** *validasiForm*  
**ID Algoritma:** *[Algo-00x]*

```text
function validasiForm(catatan, foto, video):
    if catatan = NIL then
        return false
    if length(foto) = 0 then
        return false
    return true
```

Tabel 5.x.x. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.20.2 Algoritma/Query


**Nama Kelas:** *PerbaikanController*  
**Nama Operasi:** *unggahHasil*  
**ID Algoritma:** *[Algo-00x]*

```text
function unggahHasil(idTiket, catatan, foto, video):
    if not(verifikasiAkses()) then
        return false
    if not(validasiForm(catatan, foto, video)) then
        return false
    hasil <- {HasilPerbaikan baru}
    if not(hasil.validasiBerkas(foto, video)) then
        return false
    return hasil.simpanBukti()
```

Tabel 5.x.x. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |

## 5.X Kelas [Nama Kelas Berikutnya]

*[Ulangi pola 5.1: nama dan ID kelas, tabel operasi, tabel atribut, serta subbab algoritma/query untuk operasi penting jika diperlukan.]*

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.x.1. Operasi Kelas [Nama Kelas 1]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.x.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.x.x Algoritma/Query


**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-00x]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Tabel 5.x.x. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |

<br>

---

# BAB 6: Perancangan Antarmuka

Bab ini memuat rancangan awal antarmuka untuk setiap halaman *client* pada Tabel 2.3. Setiap layar merealisasikan satu kelas *boundary* pada Tabel 4.1, yaitu LaporPage (I-01), StatusLaporanPage (I-02), ValidasiPage (I-03), EvaluasiPage (I-04), PenugasanPage (I-05), dan HasilPerbaikanForm (I-06). Layar Warga dan Eksekutor Lapangan dirancang untuk *smartphone*, sedangkan layar Tim Administrasi dirancang untuk komputer.

## 6.1 Rancangan Antarmuka I-01

**Antarmuka:** I-01  
**Nama Layar:** Formulir Laporan Kerusakan (Warga, mobile)

<p align="center">
<img alt="Rancangan Antarmuka I-01 - Formulir Laporan Kerusakan" src="./assets/I-01_formulir-laporan-kerusakan.png" width="35%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka I-01 - Formulir Laporan Kerusakan</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka I-01

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I01-01 | Icon Button | Panah kembali (←) | Membatalkan pengisian dan kembali ke layar sebelumnya tanpa menyimpan data. |
| I01-02 | Label | "Laporkan Kerusakan" | Judul layar. |
| I01-03 | Dropdown | "Kategori kerusakan": Jalan berlubang, Lampu jalan mati, Saluran air tersumbat, Trotoar rusak, Rambu / marka rusak | Wajib dipilih. Kategori disimpan bersama laporan dan dipakai untuk filter di I-03 dan I-05. |
| I01-04 | Text Area | "Deskripsi" (placeholder: "Jelaskan kondisi kerusakan") | Wajib diisi. Berisi uraian kondisi kerusakan dari warga. |
| I01-05 | File Upload | "Foto", "JPG/PNG, maks. 10 MB" | Membuka kamera/galeri. Sistem memeriksa format (JPG/PNG) dan ukuran (≤ 10 MB); berkas yang tidak sesuai ditolak dengan pesan error. |
| I01-06 | File Preview | Thumbnail, nama berkas, dan ukuran (contoh: "IMG_2041.jpg", "2,4 MB") | Menampilkan pratinjau foto yang berhasil diunggah. |
| I01-07 | Icon Button | Ikon × ("Hapus foto") | Menghapus foto dari formulir. |
| I01-08 | File Upload | "Video (opsional)", "MP4/MOV/MKV, maks. 10 MB" | Membuka kamera/galeri. Sistem memeriksa format (MP4/MOV/MKV) dan ukuran (≤ 10 MB); berkas yang tidak sesuai ditolak dengan pesan error. |
| I01-09 | File Preview | Thumbnail video, nama berkas, ukuran, dan durasi (contoh: "VID_0388.mp4", "8,1 MB · 0:12") | Menampilkan pratinjau video yang berhasil diunggah. |
| I01-10 | Icon Button | Ikon × ("Hapus video") | Menghapus video dari formulir. |
| I01-11 | Button | "Gunakan Lokasi Saat Ini" | Meminta izin lokasi perangkat, mengambil koordinat GPS, lalu memindahkan penanda pada peta (I01-12) ke titik tersebut. |
| I01-12 | Map | Peta kecil dengan penanda dan label "Click peta untuk pilih lokasi", area di luar batas kota diarsir dengan label "Luar batas kota" | Klik pada peta memindahkan penanda ke titik yang dipilih (pemilihan lokasi manual). Setiap perubahan titik memicu pengecekan batas daerah penanganan. |
| I01-13 | Alert | "Lokasi di luar daerah penanganan. Pilih titik di dalam batas kota." | Muncul jika titik lokasi berada di luar batas kota. Selama pesan ini aktif, laporan tidak dapat dikirim. |
| I01-14 | Button | "Batal" | Membatalkan pembuatan laporan dan kembali ke layar sebelumnya. |
| I01-15 | Button | "Kirim Laporan" | Memvalidasi seluruh isian (kategori, deskripsi, minimal satu foto/video, lokasi di dalam batas kota). Jika valid, laporan disimpan dengan status **Diterima**, ID tiket dibuat, lalu dialog sukses (I01-16) ditampilkan. Jika tidak valid, pesan error ditampilkan pada isian yang bermasalah. |
| I01-16 | Dialog | "Laporan terkirim", "ID tiket: LK-0123" | Dialog sukses yang muncul setelah laporan berhasil dikirim. Dialog ini merupakan keadaan setelah pengiriman sehingga tidak tampak pada Gambar 6.1. |
| I01-17 | Button | "Lihat Status" | Menutup dialog dan membuka layar I-02 Status Laporan. |
| I01-18 | Button | "Tutup" | Menutup dialog sukses. |

## 6.2 Rancangan Antarmuka I-02

**Antarmuka:** I-02  
**Nama Layar:** Status Laporan (Warga, mobile) — tab Riwayat dan tab Peta

<p align="center">
<img alt="Rancangan Antarmuka I-02 - Status Laporan (Riwayat)" src="./assets/I-02a_status-laporan-riwayat.png" width="35%">
</p>
<p align="center">
<i>Gambar 6.2. Rancangan Antarmuka I-02 - Status Laporan (Tab Riwayat)</i>
</p>

<p align="center">
<img alt="Rancangan Antarmuka I-02 - Status Laporan (Peta)" src="./assets/I-02b_status-laporan-peta.png" width="35%">
</p>
<p align="center">
<i>Gambar 6.3. Rancangan Antarmuka I-02 - Status Laporan (Tab Peta)</i>
</p>

Tabel 6.2. Spesifikasi Objek Antarmuka I-02

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I02-01 | Label | "Laporan Saya" | Judul layar. |
| I02-02 | Icon Button | Ikon lonceng dengan badge jumlah notifikasi belum dibaca (contoh: "2") | Membuka daftar notifikasi perubahan status laporan milik warga. Memilih notifikasi menampilkan detail tiket terkait pada I02-07. |
| I02-03 | Tab | "Riwayat" | Menampilkan daftar tiket laporan milik warga (I02-05 s.d. I02-09). |
| I02-04 | Tab | "Peta" | Menampilkan peta sebaran laporan publik (I02-10 s.d. I02-14). |
| I02-05 | Card List | Kartu tiket berisi ID tiket, tanggal, kategori, dan status (contoh: "LK-0123 · 24 Okt 2026", "Jalan berlubang") | Daftar laporan milik warga. Klik kartu memilih tiket (kartu diberi garis tepi aksen) dan menampilkan detailnya pada I02-07. |
| I02-06 | Badge | Status: Diterima, Ditolak, Dikerjakan, Berhasil | Penanda status terkini tiket, dengan warna berbeda untuk setiap status. |
| I02-07 | Panel | "Detail tiket", ID tiket · kategori, dan badge status | Menampilkan rincian tiket yang sedang dipilih. |
| I02-08 | Timeline | Tahapan status beserta waktunya (contoh: "Diterima – 20 Okt, 19.02", "Ditolak – 21 Okt, 09.30") | Menampilkan riwayat perubahan status tiket secara berurutan. |
| I02-09 | Info Box | "Alasan penolakan" beserta isi alasan dari Tim Administrasi | Hanya muncul jika status tiket **Ditolak**. Isinya berasal dari alasan yang dikirim di I-03. |
| I02-10 | Map | Peta sebaran laporan publik, dengan label "Laporan publik di sekitar Anda" | Menampilkan seluruh laporan publik dalam batas kota. Tidak menampilkan nama atau identitas pelapor. |
| I02-11 | Legend | Diterima (biru), Dikerjakan (kuning), Berhasil (hijau) | Keterangan arti warna penanda pada peta. |
| I02-12 | Map Marker | Penanda berwarna sesuai status laporan | Klik penanda memilih laporan tersebut: penanda diperbesar dan kartu ringkas (I02-13) diperbarui. |


## 6.3 Rancangan Antarmuka I-03

**Antarmuka:** I-03  
**Nama Layar:** Validasi Laporan (Tim Administrasi, desktop)

<p align="center">
<img alt="Rancangan Antarmuka I-03 - Validasi Laporan" src="./assets/I-03_validasi-laporan.png" width="90%">
</p>
<p align="center">
<i>Gambar 6.4. Rancangan Antarmuka I-03 - Validasi Laporan</i>
</p>

Tabel 6.3. Spesifikasi Objek Antarmuka I-03

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I03-01 | Sidebar Menu | "Validasi Laporan" dengan badge jumlah antrean (contoh: "7") | Menu aktif. Menampilkan layar I-03. |
| I03-02 | Sidebar Menu | "Evaluasi Hasil Kerja" dengan badge jumlah (contoh: "3") | Membuka layar I-04 Evaluasi Hasil Kerja. |
| I03-03 | Label | "Masuk sebagai Admin Kota" | Menampilkan akun Tim Administrasi yang sedang masuk. |
| I03-04 | Dropdown | "Kategori": Semua kategori, Jalan berlubang, Lampu jalan mati, Saluran air tersumbat, Trotoar rusak, Rambu / marka rusak | Memfilter isi tabel antrean (I03-06) berdasarkan kategori. |
| I03-05 | Label | Jumlah laporan (contoh: "7 laporan") | Jumlah laporan dalam antrean sesuai filter aktif. |
| I03-06 | Table | Kolom: ID tiket, Kategori, Waktu masuk, Status | Antrean laporan berstatus **Diterima**, diurutkan dari waktu masuk terbaru. Baris terpilih diberi latar berwarna. |
| I03-07 | Link | ID tiket (contoh: "LK-0131") | Memilih laporan dan menampilkan rinciannya pada panel kanan (I03-08 s.d. I03-12). |
| I03-08 | Panel | ID tiket · kategori, waktu masuk, badge status (contoh: "LK-0131 · Jalan berlubang", "Masuk 26 Okt 2026, 07.48", "Diterima") | Header panel rincian laporan terpilih. |
| I03-09 | Image Viewer | Foto laporan | Menampilkan foto kiriman warga; klik untuk memperbesar. |
| I03-10 | Video Player | Video laporan dengan durasi (contoh: "0:12") | Memutar video kiriman warga. |
| I03-11 | Text | "Deskripsi" beserta isi deskripsi laporan | Menampilkan deskripsi dari warga. |
| I03-12 | Map | "Lokasi · Jl. Sudirman" dengan penanda | Menampilkan titik lokasi laporan. |
| I03-13 | Button | "Validasi" | Menyatakan laporan valid: status berubah menjadi **Dikerjakan**, laporan keluar dari antrean dan masuk ke Daftar Tugas eksekutor (I-05), lalu notifikasi dikirim ke pelapor. |
| I03-14 | Button | "Tolak" | Menampilkan isian alasan penolakan (I03-15 dan I03-16). |
| I03-15 | Text Area | "Alasan penolakan" (placeholder: "Tuliskan alasan yang akan dikirim ke pelapor") | Wajib diisi sebelum penolakan dikirim. |
| I03-16 | Button | "Kirim Penolakan" | Status laporan berubah menjadi **Ditolak**, alasan disimpan dan ditampilkan ke pelapor di I-02, laporan keluar dari antrean. Jika alasan kosong, sistem menampilkan pesan error. |

## 6.4 Rancangan Antarmuka I-04

**Antarmuka:** I-04  
**Nama Layar:** Evaluasi Hasil Kerja (Tim Administrasi, desktop)

<p align="center">
<img alt="Rancangan Antarmuka I-04 - Evaluasi Hasil Kerja" src="./assets/I-04_evaluasi-hasil-kerja.png" width="90%">
</p>
<p align="center">
<i>Gambar 6.5. Rancangan Antarmuka I-04 - Evaluasi Hasil Kerja</i>
</p>

Tabel 6.4. Spesifikasi Objek Antarmuka I-04

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I04-01 | Sidebar Menu | "Validasi Laporan" dengan badge jumlah (contoh: "7") | Membuka layar I-03 Validasi Laporan. |
| I04-02 | Sidebar Menu | "Evaluasi Hasil Kerja" dengan badge jumlah (contoh: "3") | Menu aktif. Menampilkan layar I-04. |
| I04-03 | Label | "Masuk sebagai Admin Kota" | Menampilkan akun Tim Administrasi yang sedang masuk. |
| I04-04 | Card List | "Siap evaluasi (3)"; kartu berisi ID tiket, kategori, tim eksekutor, dan waktu kirim bukti (contoh: "LK-0123", "Jalan berlubang", "Tim Lapangan A · 26 Okt, 10.20") | Daftar pekerjaan yang hasilnya sudah dikirim eksekutor melalui I-06. Klik kartu menampilkan perbandingan pada area utama. |
| I04-05 | Label | ID tiket · kategori, lokasi, dan tim eksekutor (contoh: "LK-0123 · Jalan berlubang", "Jl. Sudirman · dikerjakan oleh Tim Lapangan A") | Header area utama untuk pekerjaan terpilih. |
| I04-06 | Badge | "Dikerjakan" | Status tiket saat dievaluasi. |
| I04-07 | Image Viewer | "Sebelum · laporan warga, 24 Okt" | Foto kondisi awal dari laporan warga (I-01). Klik untuk memperbesar. |
| I04-08 | Image Viewer | "Sesudah · bukti eksekutor, 26 Okt, 10.20" | Foto bukti hasil perbaikan dari eksekutor (I-06), ditampilkan berdampingan dengan I04-07. Klik untuk memperbesar. |
| I04-09 | Text | "Catatan eksekutor" beserta isi catatan perbaikan | Menampilkan catatan yang dikirim eksekutor. |
| I04-10 | Text Area | "Catatan evaluasi" (placeholder: "Tambahkan catatan untuk eksekutor atau arsip tiket") | Catatan Tim Administrasi; dikirim ke eksekutor bersama keputusan evaluasi dan disimpan pada riwayat tiket. |
| I04-11 | Button | "Minta Ulang Bukti" | Mengembalikan tugas ke eksekutor (I-05) untuk mengunggah ulang bukti. Status tetap **Dikerjakan**. |
| I04-12 | Button | "Belum Selesai" | Menandai perbaikan belum tuntas dan mengembalikan tugas ke Daftar Tugas eksekutor (I-05) beserta catatan evaluasi. Status tetap **Dikerjakan**. |
| I04-13 | Button | "Konfirmasi Selesai" | Mengubah status tiket menjadi **Berhasil**, menghapus pekerjaan dari daftar evaluasi, lalu mengirim notifikasi ke pelapor (I-02). |

## 6.5 Rancangan Antarmuka I-05

**Antarmuka:** I-05  
**Nama Layar:** Daftar Tugas (Eksekutor Lapangan, mobile)

<p align="center">
<img alt="Rancangan Antarmuka I-05 - Daftar Tugas" src="./assets/I-05_daftar-tugas.png" width="35%">
</p>
<p align="center">
<i>Gambar 6.6. Rancangan Antarmuka I-05 - Daftar Tugas</i>
</p>

Tabel 6.5. Spesifikasi Objek Antarmuka I-05

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I05-01 | Label | "Daftar Tugas", "Eksekutor Lapangan · 4 tugas aktif" | Judul layar dan jumlah tugas aktif milik eksekutor. |
| I05-02 | Dropdown | "Kategori": Semua kategori, Jalan berlubang, Lampu jalan mati, Saluran air tersumbat, Trotoar rusak, Rambu / marka rusak | Memfilter daftar tugas (I05-04) berdasarkan kategori. |
| I05-03 | Label | "Diurutkan berdasarkan skor prioritas tertinggi" | Keterangan urutan daftar tugas. |
| I05-04 | Card List | Kartu tugas berisi ID tiket dan kategori (contoh: "LK-0123", "Jalan berlubang") | Daftar tugas berstatus **Dikerjakan** yang hasil perbaikannya belum dikirim, diurutkan dari skor prioritas tertinggi. Klik kartu menampilkan rincian pada I05-06. |
| I05-05 | Indicator | Skor prioritas berupa angka dan bar (contoh: "92 /100") | Menampilkan skor prioritas tugas; panjang bar sebanding dengan skor. |
| I05-06 | Panel | Rincian tugas terpilih (contoh: "LK-0123 · Jalan berlubang") | Menampilkan detail tugas yang sedang dipilih. |
| I05-07 | Image Viewer | "Foto laporan warga" | Menampilkan foto dari laporan warga; klik untuk memperbesar. |
| I05-08 | Text | Deskripsi laporan | Menampilkan deskripsi kerusakan dari warga. |
| I05-09 | Label | Ikon lokasi dan alamat lengkap kerusakan | Menampilkan alamat titik kerusakan. |
| I05-10 | Button | "Buka di Google Maps" | Membuka aplikasi atau situs Google Maps dengan koordinat lokasi kerusakan untuk navigasi. |
| I05-11 | Button | "Laporkan Hasil" | Membuka layar I-06 Formulir Hasil Perbaikan untuk tiket terpilih. |

## 6.6 Rancangan Antarmuka I-06

**Antarmuka:** I-06  
**Nama Layar:** Formulir Hasil Perbaikan (Eksekutor Lapangan, mobile)

<p align="center">
<img alt="Rancangan Antarmuka I-06 - Formulir Hasil Perbaikan" src="./assets/I-06_formulir-hasil-perbaikan.png" width="35%">
</p>
<p align="center">
<i>Gambar 6.7. Rancangan Antarmuka I-06 - Formulir Hasil Perbaikan</i>
</p>

Tabel 6.6. Spesifikasi Objek Antarmuka I-06

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I06-01 | Icon Button | Panah kembali (←) | Kembali ke layar I-05 Daftar Tugas tanpa mengirim hasil. |
| I06-02 | Label | "Laporkan Hasil Perbaikan" | Judul layar. |
| I06-03 | Card | "Tiket LK-0123", "Jalan berlubang · Jl. Sudirman", badge "Dikerjakan" | Identitas tiket yang sedang dilaporkan hasilnya. |
| I06-04 | Text Area | "Catatan perbaikan *" (placeholder: "Contoh: Lubang ditambal aspal hotmix, area sudah dibersihkan.") | Wajib diisi. Jika kosong saat dikirim, garis tepi berubah merah. |
| I06-05 | File Upload | "Foto bukti *", "JPG/PNG, maks. 10 MB", "Ambil atau unggah foto" | Wajib diisi. Membuka kamera/galeri; sistem memeriksa format dan ukuran berkas. Jika kosong saat dikirim, garis tepi berubah merah. |
| I06-06 | File Upload + Preview | "Video bukti (opsional)", "MP4/MOV/MKV, maks. 10 MB"; pratinjau video, nama berkas, dan ukuran (contoh: "VID_0412.mp4", "9,3 MB") | Mengunggah video bukti dan menampilkan pratinjaunya. Sistem memeriksa format dan ukuran berkas. |
| I06-07 | Icon Button | Ikon × ("Hapus video") | Menghapus video bukti dari formulir. |
| I06-08 | Alert | "Gagal terkirim: foto dan deskripsi wajib diisi." | Muncul jika catatan perbaikan atau foto bukti belum diisi saat tombol Kirim Hasil ditekan. |
| I06-09 | Button | "Kirim Hasil" | Memvalidasi isian wajib. Jika lengkap, hasil perbaikan dikirim dan masuk ke daftar Siap Evaluasi pada I-04, lalu tugas keluar dari daftar aktif I-05. Status tiket tetap **Dikerjakan** sampai dikonfirmasi Tim Administrasi. Jika tidak lengkap, I06-08 ditampilkan. |

## 6.7 Rancangan Antarmuka Keseluruhan

Berikut daftar seluruh antarmuka LaporKota. ID pada tabel ini sama dengan ID yang digunakan pada subbab 6.1 s.d. 6.6.

Tabel 6.7. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| I-01 | <img src="./assets/I-01_formulir-laporan-kerusakan.png" alt="I-01 Formulir Laporan Kerusakan" width="250"> |
| I-02 (Riwayat) | <img src="./assets/I-02a_status-laporan-riwayat.png" alt="I-02 Status Laporan - Riwayat" width="250"> |
| I-02 (Peta) | <img src="./assets/I-02b_status-laporan-peta.png" alt="I-02 Status Laporan - Peta" width="250"> |
| I-03 | <img src="./assets/I-03_validasi-laporan.png" alt="I-03 Validasi Laporan" width="500"> |
| I-04 | <img src="./assets/I-04_evaluasi-hasil-kerja.png" alt="I-04 Evaluasi Hasil Kerja" width="500"> |
| I-05 | <img src="./assets/I-05_daftar-tugas.png" alt="I-05 Daftar Tugas" width="250"> |
| I-06 | <img src="./assets/I-06_formulir-hasil-perbaikan.png" alt="I-06 Formulir Hasil Perbaikan" width="250"> |

<br>

---

# BAB 7: Matriks Kerunutan


Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| *[C01 - User]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan], [UC05 - Mengevaluasi Hasil Kerja], [UC06 - Memantau Status Laporan]* |
| *[C02 - Laporan]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan], [UC05 - Mengevaluasi Hasil Kerja], [UC06 - Memantau Status Laporan]* |
| *[C03 - Lokasi]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC06 - Memantau Status Laporan]* |
| *[C04 - Foto]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan], [UC05 - Mengevaluasi Hasil Kerja], [UC06 - Memantau Status Laporan]* |
| *[C05 - Video]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan], [UC05 - Mengevaluasi Hasil Kerja], [UC06 - Memantau Status Laporan]* |
| *[C06 - Upvote]* | *[UC02 - Memvalidasi Laporan Baru], [UC06 - Memantau Status Laporan]* |
| *[C07 - ListTugas]* | *[UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan]* |
| *[C08 - HasilPerbaikan]* | *[UC04 - Melaporkan Hasil Penugasan], [UC05 - Mengevaluasi Hasil Kerja], [UC06 - Memantau Status Laporan]* |
| *[C09 - Evaluasi]* | *[UC05 - Mengevaluasi Hasil Kerja]* |
| *[C10 - Notifikasi]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC05 - Mengevaluasi Hasil Kerja]* |
| *[C11 - LaporPage]* | *[UC01 - Mengirim Laporan Kerusakan]* |
| *[C12 - ValidasiPage]* | *[UC02 - Memvalidasi Laporan Baru]* |
| *[C13 - PenugasanPage]* | *[UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan]* |
| *[C14 - HasilPerbaikanForm]* | *[UC04 - Melaporkan Hasil Penugasan]* |
| *[C15 - EvaluasiPage]* | *[UC05 - Mengevaluasi Hasil Kerja]* |
| *[C16 - StatusLaporanPage]* | *[UC06 - Memantau Status Laporan]* |
| *[C17 - LaporanController]* | *[UC01 - Mengirim Laporan Kerusakan]* |
| *[C18 - ValidasiController]* | *[UC02 - Memvalidasi Laporan Baru]* |
| *[C19 - PenugasanController]* | *[UC03 - Melihat Penugasan Lapangan], [UC04 - Melaporkan Hasil Penugasan]* |
| *[C20 - PerbaikanController]* | *[UC04 - Melaporkan Hasil Penugasan]* |
| *[C21 - EvaluasiController]* | *[UC05 - Mengevaluasi Hasil Kerja]* |
| *[C22 - StatusController]* | *[UC06 - Memantau Status Laporan]* |
| *[C23 - NotifikasiController]* | *[UC01 - Mengirim Laporan Kerusakan], [UC02 - Memvalidasi Laporan Baru], [UC05 - Mengevaluasi Hasil Kerja]* |
