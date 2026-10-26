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
Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini disusun dengan sistematika berikut. **BAB 1: Pendahuluan** memuat tujuan penulisan dokumen, lingkup masalah, daftar definisi, aturan penomoran, referensi, serta ikhtisar dokumen. **BAB 2: Perancangan Arsitektur** menjelaskan rancangan lingkungan implementasi, pola arsitektur (beserta alasan pemilihannya), identifikasi komponen (beserta tanggung jawabnya), dan model arsitektur yang mengacu pada dokumen APL. **BAB 3: Realisasi Use Case**  menguraikan perancangan setiap Use Case melalui identifikasi kelas perancangan, sequence diagram (untuk skenario normal dan alternatif), serta diagram kelas. **BAB 4: Diagram Kelas Keseluruhan** menggambungkan seluruh kelas perancangan dalam satu diagram. **BAB 5: Matriks Kerunutan** memetakan keterkaitan setiap kelas perancangan dengan use case untuk memastikan rancangan telah mendukung kebutuhan pada SKPL.

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

## 3.X Use Case XX

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh_class-diagram2.jpg" width="35%">
</p>
<p align="center">
<i>Gambar 26. Diagram Kelas [Nama Uce Case]</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.
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
