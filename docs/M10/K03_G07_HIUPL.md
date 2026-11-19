<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
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
| Kelas | *K03* |
| Kelompok | *G07*  |

| NIM | Nama |
|---|---|
| *13525051* | *Rafi Pradipta Andira Sulistyo* |
| *13525105* | *Pasaribu Fritz T.A.M.* |
| *13525075* | *Bagas Anugrah Putra* |
| *13525099* | *Gede Pranajayanta Suputra* |
| *13525015* | *Muhammad Atallah Ramadhan* |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

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
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun untuk melaporkan hasil implementasi platform LaporKota beserta hasil pengujiannya. Dokumen ini memuat rancangan dan deskripsi perangkat lunka, lingkungan dan hasil implementasinya serta bukti hasil pengujiannya yang mencakup Pengujian Unit, Integrasi, Use Case, dan Kebutuhan Non-Fungsional. Dokumen ini ditujukan bagi Tim Pengembang (anggota kelompok) sebagai catatan hasil akhir implementasi perangkat lunak, dan Tim Penguji (asisten/dosen) sebagai landasan pengujian kesesuaian implementasi dengan rancangan awal.

## 1.2 Lingkup Masalah
Perangkat lunak yang akan dikembangkan adalah LaporKota, sebuah platform pelaporan kerusakan infrastruktur publik berbasis website yang dirancang untuk mempermudah warga dalam menyampaikan dan memantau laporannya. Sistem pelaporan ini memfasilitasi pengguna untuk melaporkan masalah fasilitas umum dalam lingkup satu kota, kapan saja dan di mana saja dengan menyertakan foto serta koordinat lokasi. Dengan adanya sistem ini diharapkan pengguna tidak lagi kesulitan mencari saluran pengaduan yang responsif dan proses perbaikan kerusakan fasilitas publik dapat berjalan dengan efisien.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *CD* | *Singkatan dari Class Diagram, Diagram yang menggambarkan struktur kelas beserta atribut, metode, dan hubungan antarkelas di dalam sistem.* |
| *GPS* | *Singkatan dari Global Positioning System, yaitu sistem navigasi berbasis satelit untuk menentukan posisi.* |
| *API* | *Singkatan dari Application Programming Interface, yaitu antarmuka yang memungkinkan program saling terhubung.* |
| *Latitude / Longitude* | *Garis lintang dan garis bujur, yaitu dua nilai koordinat posisi di bumi.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang berfungsi sebagai panduan bagi pengembang untuk mengimplementasikan perangkat lunak dalam bentuk kode program.* |
| *APL* | *Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang menetapkan pola arsitektur, komponen, dan model view dari perangkat lunak.* |
| *Server Action* | *Fungsi server Next.js yang dipanggil langsung dari antarmuka* |
| *RLS* | *Row Level Security, aturan akses per baris di PostgreSQL/Supabase* |
| *RPC* | *Remote Procedure Call, fungsi PostgreSQL yang dipanggil aplikasi* |
| *Trigger* | *Fungsi database yang berjalan otomatis saat data berubah* |
| *Mock* | *Objek pengganti dependensi dalam unit test untuk pengujian kelas terpisah dari database* |
| *Vitest* | *Framework unit test Typescript yang digunakan pada proyek* |
| *CI* | *Continuous Integration, Github Actions yang menjalankan lint, typecheck, dan test pada setiap Pull Request* |
| *Seed* | *Skrip npm run seed yang mengisi akun uji dan data contoh fiktif* |
| *ID Tiket* | *Kode unik laporan dalam platform dengan format LK-XXXX* |

| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Objek Antarmuka* | *IXX-YY* | *Sesuai DPPL, contoh I06-08* |
| *Algoritma* | *Algo-XXX* | *Sesuai DPPL* |
| *Query* | *Q-XXX* | *Sesuai DPPL* |
| *Antarmuka antarkomponen* | *IK-XX* | *Dibedakan dari antarmuka layar* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
| 1 | Dokumen Spesifikasi Kebutuhan Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M5/K03_G07_SKPL.md |
| 2 | Dokumen Aristektur Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M6/K03_G07_APL.md |
| 3 | Dokumen Deskripsi Perancangan Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M8/K03_G07_DPPL2.md |
| 4 | Laporan Implementasi Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M9/K03_G07_Implementasi.md |

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun dengan sistematika berikut. **BAB 1: Pendahuluan** memuat tujuan penulisan dokumen, lingkup masalah, daftar definisi, aturan penomoran, referensi, serta ikhtisar dokumen. **BAB 2: Deskripsi Umum Perangkat Lunak** menjelaskan gambaran rancangan sistem, batasan, dan keterkaitannya dengan sistem eksternal. Terlampir juga pemodelan sistem perangkat lunak menggunakan Use Case Diagram. **BAB 3: Implementasi**  menjabarkan lingkungan implementasi, dan hasil-hasil implementasi perangkat lunak (modul, antarmuka, dll) yang telah dibuat berdasarkan DPPL. **BAB 4: Hasil Pengujian** menguraikan kedalaman pengujian pada setiap kelas, serta masing-masing hasil pengujiannya yang meliputi pengujian Unit, Integrasi, Use Case, dan Kebutuhan Non-Fungsional. **BAB 5: Traceability** memetakan seluruh KF, KNF, UC, Kelas, Hasil Implementasi, dan Test Case untuk memverifikasi kelengkapan dan keterkaitannya.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram [Nama P/L]</i>
</p>

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *Mendalam* | *Memuat `hitungTotal()` dan transisi status pembayaran* | *C02-UT01 s.d. C02-UT08* |
| *C03* | *Keranjang* | *Sedang* | *Delegasi sederhana ke Produk dan Pesanan* | *C03-UT01 s.d. C03-UT03, INT-TC02* |
| *C01* | *Pelanggan* | *Tidak perlu* | *Hanya menyimpan data akun, tanpa logika* | *-* |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: *[tuliskan perintah, mis. `pytest src/tests/`]*.

Lokasi file test: *[path, mis. `src/tests/`]*.

### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** *[C02]*  
**Nama Kelas:** *[Pesanan]*  
**Tingkat:** *[Mendalam]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`hitungTotal(): Decimal`* | *Normal* | *Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1* | *Total = 25.000* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`hitungTotal(): Decimal`* | *Batas* | *Pesanan berisi tepat 1 item dengan jumlah 1* | *Total = harga item tersebut* | *[...]* | *Pass/Fail* |
| *C02-UT03* | *`hitungTotal(): Decimal`* | *Negatif* | *Pesanan tanpa item* | *Total = 0 atau melempar kesalahan sesuai rancangan* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas [Nama Kelas 2]

*[Ulangi pola 4.2.1 untuk setiap kelas bertingkat Mendalam atau Sedang.]*

### 4.2.7 Kelas ListTugas

**ID Kelas:** *C07*  
**Nama Kelas:** *ListTugas*  
**Tingkat:** *Mendalam*

Tabel 4.2.7. Hasil Pengujian Unit Kelas [C07]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C07-UT01* | *`urutPrioritas()`* | *Normal* | *3 tugas dengan skor: 30, 92, 50* | *LK-002, LK-003, LK-001* | ** | *Pass/Fail* |
| *C07-UT02* | *`urutPrioritas()`* | *Batas* | *2 tugas skor sama, waktu masuk berbeda* | *Yang masuk lebih awal di depan* | ** | *Pass/Fail* |
| *C07-UT03* | *`urutPrioritas()`* | *Daftar asli yang terurut* | *Daftar asli tak beruhbah* | *xxx* | ** | *Pass/Fail* |
| *C07-UT04* | *`urutPrioritas()`* | *Batas* | *Daftar kosong* | *[]* | ** | *Pass/Fail* |
| *C07-UT05* | *`jumlahLaporanAktif`* | *Normal* | *2 tugas; 0 tugas* | *2; 0* | ** | *Pass/Fail* |
| *C07-UT06* | *`filterKategori(kategori)`* | *Normal* | *3 tugas, filter lampu_jalan_mati* | *LK-003, LK-001 (terurut)* | ** | *Pass/Fail* |
| *C07-UT07* | *`filterKategori(kategori)`* | *Batas* | *Filter trotoar_rusak (tidak ada laporan sesuai)* | *[]* | ** | *Pass/Fail* |
| *C07-UT08* | *`getLaporanById(idTiket)`* | *Normal* | *LK-002* | *Laporan LK-002* | ** | *Pass/Fail* |
| *C07-UT09* | *`getLaporanById(idTiket)`* | *Negatif* | *LK-9999* | *null* | ** | *Pass/Fail* |
| *C07-UT10* | *`isKategori(nilai)`* | *Normal* | *5 nilai enum kategori* | *true untuk semuanya* | ** | *Pass/Fail* |
| *C07-UT11* | *`isKategori(nilai)`* | *Negatif* | *"", "semua", label tampilan, nilai berspasi, teks injeksi SQL* | *false untuk semuanya* | ** | *Pass/Fail* |
| *C07-UT12* | *`isTugasAktif(laporan)`* | *Normal* | *dikerjakan + menunggu_eksekusi* | *true* | ** | *Pass/Fail* |
| *C07-UT13* | *`isTugasAktif(laporan)`* | *Negatif* | *false* | *xxx* | ** | *Pass/Fail* |
| *C07-UT14* | *`urutPrioritas()`* | *Negatif* | *skor berupa string numerik "2.5" dan "10"* | *Terurut sesuai angka LK-002, LK-001* | ** | *Pass/Fail* |
| *C07-UT15* | *`filterKategori(kategori)`* | *Negatif* | *Kategori di luar enum* | *[]* | ** | *Pass/Fail* |
| *C07-UT16* | *`getLaporanById(idTiket)`* | *Batas* | *Daftar tugas kosong* | *null* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |


Tabel 4.2.7b. Ringkasan Cakupan Kelas C07

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `urutPrioritas(idTiket)`, `filterKategori(idTiket)`, `getLaporanById()` |
| Operasi yang diuji | `urutPrioritas(idTiket)`, `filterKategori(idTiket)`, `getLaporanById()` |
| ID Algoritma yang tercakup | `Algo-012`, `Algo-013` |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.8 Kelas HasilPerbaikan

**ID Kelas:** *C08*  
**Nama Kelas:** *HasilPerbaikan*  
**Tingkat:** *Mendalam*

Tabel 4.2.8. Hasil Pengujian Unit Kelas C08

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C08-UT01* | *`validasiBerkas(foto, video)`* | *Normal* | *Foto JPG/PNG & Video MP4/MOV/MKV 2 MB* | *true* | ** | *Pass/Fail* |
| *C08-UT02* | *`validasiBerkas()`* | *Normal* | *Foto tanpa video* | *true* | ** | *Pass/Fail* |
| *C08-UT03* | *`validasiBerkas()`* | *Batas* | *Foto & video kosong* | *true* | ** | *Pass/Fail* |
| *C08-UT04* | *`validasiBerkas()`* | *Negatif* | *Foto a.heic* | *false* | ** | *Pass/Fail* |
| *C08-UT05* | *`validasiBerkas()`* | *Negatif* | *Video a.avi* | *false* | ** | *Pass/Fail* |
| *C08-UT06* | *`validasiBerkas()`* | *Batas* | *10 MB ; +1 byte* | *true ; false* | ** | *Pass/Fail* |
| *C08-UT07* | *`validasiBerkas()`* | *Batas* | *Berkas 0 byte* | *false* | ** | *Pass/Fail* |
| *C08-UT08* | *`pilihBuktiSelesai(daftar)`* | *Batas* | *Belum ada hasil* | *null* | ** | *Pass/Fail* |
| *C08-UT09* | *`pilihBuktiSelesai()`* | *Negatif* | *Belum ada hasil yang dievaluasi* | *null* | ** | *Pass/Fail* |
| *C08-UT10* | *`pilihBuktiSelesai()`* | *Negatif* | *Semua hasil dikembalikan* | *null* | ** | *Pass/Fail* |
| *C08-UT11* | *`pilihBuktiSelesai()`* | *Normal* | *Hasil lama dikembalikan & hasil baru selesai* | *Hasil yang selesai* | ** | *Pass/Fail* |
| *C08-UT12* | *`pilihBuktiSelesai()`* | *Normal* | *Beberapa hasil yang selesai* | *Hasil terbaru* | ** | *Pass/Fail* |
| *C08-UT13* | *`pilihBuktiSelesai()`* | *Normal* | *Satu hasil selesai* | *Objek tanpa field evaluasi* | ** | *Pass/Fail* |
| *C08-UT14* | *`pilihBuktiSelesai()`* | *Normal* | *Dua hasil yang selesai* | *Urutan daftar asli tidak berubah* | ** | *Pass/Fail* |
| *C08-UT15* | *`sumpanBukti()`* | *Normal* | *Client palsu; idLaporan, catatan, 1 foto* | *RPC `kirim_hasil_perbaikan` dipanggil dengan argumen yang benar* | ** | *Pass/Fail* |
| *C08-UT16* | *`sumpanBukti()`* | *Negatif* | *RPC mengembalikan error P0001* | *Error diteruskan* | ** | *Pass/Fail* |
| *C08-UT17* | *`simpanBukti()`* | *Batas* | *3 foto + 1 video* | *Satu panggilan RPC membawa 4 media* | ** | *Pass/Fail* |
| *C08-UT18* | *`getBuktiLengkap`* | *Normal* | *Hasil lama minta_ulang_bukti + hasil baru selesai* | *Membaca hasil_perbaikan per id_laporan; mengembalikan hasil selesai* | ** | *Pass/Fail* |
| *C08-UT19* | *`getBuktiLengkap`* | *Batas* | *Database mengembalikan data: null* | *{ data: null, error: null}* | ** | *Pass/Fail* |
| *C08-UT20* | *`getBuktiLengkap`* | *Negatif* | *Database mengembalikan error* | *{ data: null, error }* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.8b. Ringkasan Cakupan Kelas C08

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()` |
| Operasi yang diuji | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()`, `pilihBuktiSelesai()` |
| ID Algoritma yang tercakup | *`Algo-014`, `Algo-015`* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.19 Kelas PenugasanController

**ID Kelas:** *C19*  
**Nama Kelas:** *PenugasanController*  
**Tingkat:** *Sedang*

Tabel 4.2.19. Hasil Pengujian Unit Kelas C19

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C19-UT01* | *`verifikasiAkses()`* | *Normal* | *Sesi eksekutor* | *true* | ** | *Pass/Fail* |
| *C19-UT02* | *`verifikasiAkses()`* | *Negatif* | *Sesi ditolak* | *false* | ** | *Pass/Fail* |
| *C19-UT03* | *`doSorting()`* | *Normal* | *3 tugas (skor 5, 9, 9)* | *LK-003, LK-002, LK-001* | ** | *Pass/Fail* |
| *C19-UT04* | *`doSorting()`* | *Batas* | *Tugas kosong* | *ok([])* | ** | *Pass/Fail* |
| *C19-UT05* | *`doSorting()`* | *Negatif* | *Akses ditolak* | *Pesan tanpa akses, database tak dibaca* | ** | *Pass/Fail* |
| *C19-UT06* | *`doSorting()`* | *Negatif* | *Error database* | *Gagal memuat daftar tugas* | ** | *Pass/Fail* |
| *C19-UT07* | *`doFilter(kategori)`* | *Normal* | *lampu_jalan_mati* | *2 tugas lampu terurut* | ** | *Pass/Fail* |
| *C19-UT08* | *`doFilter(kategori)`* | *Negatif* | *"semua", "". label, teks injeksi* | *Kategori tak dikenal... (tanpa query)* | ** | *Pass/Fail* |
| *C19-UT09* | *`doFilter(kategori)`* | *Negatif* | *Database error* | *Pesan gagal memuat* | ** | *Pass/Fail* |
| *C19-UT10* | *`bukaLaporan(idTiket)`* | *Normal* | *Tugas aktif tanpa evaluasi* | *Rincian lengkap, evaluasiTerakhir: null* | ** | *Pass/Fail* |
| *C19-UT11* | *`bukaLaporan(idTiket)`* | *Normal* | *Tugas dengan evaluasi* | *Rincian lengkap, evaluasiTerakhir berisi catatan* | ** | *Pass/Fail* |
| *C19-UT12* | *`bukaLaporan(idTiket)`* | *Negatif* | *Tiket tidak ada/sudah berhasil* | *Tugas tidak ditemukan atau sudah tidak aktif* | ** | *Pass/Fail* |
| *C19-UT13* | *`bukaLaporan(idTiket)`* | *Negatif* | *Error membaca rincian* | *Gagal memuat rincian tugas* | ** | *Pass/Fail* |
| *C19-UT14* | *`bukaLaporan(idTiket)`* | *Negatif* | *Error membaca evaluasi* | *Gagal memuat rincian tugas* | ** | *Pass/Fail* |
| *C19-UT15* | *`bukaLaporan(idTiket)`* | *Negatif* | *Belum login* | *Pesan tanpa akses, client tak dibuat* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.2.20 Kelas PerbaikanController

**ID Kelas:** *C20*  
**Nama Kelas:** *PerbaikanController*  
**Tingkat:** *Sedang*

Tabel 4.2.20. Hasil Pengujian Unit Kelas C20

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C20-UT01* | *`validasiForm(catatan, foto, video)`* | *Normal* | *Catatan + 1 foto* | *true* | ** | *Pass/Fail* |
| *C20-UT02* | *`validasiForm()`* | *Normal* | *Catatan + foto + video* | *true* | ** | *Pass/Fail* |
| *C20-UT03* | *`validasiForm()`* | *Negatif* | *catatan "" / "  " / "\n\t* | *false* | ** | *Pass/Fail* |
| *C20-UT04* | *`validasiForm()`* | *Negatif* | *Tanpa foto, ada video* | *false* | ** | *Pass/Fail* |
| *C20-UT05* | *`validasiForm()`* | *Batas* | *Catatan 1 karakter + 1 foto* | *true* | ** | *Pass/Fail* |
| *C20-UT06* | *`cekKelengkapan()`* | *Normal* | *catatan/foto kosong* | *Mennadai bagian yang kosong* | ** | *Pass/Fail* |
| *C20-UT07* | *`cekMediaTerunggah()`* | *Normal* | *Foto/video di hasil/<idUser>/* | *true* | ** | *Pass/Fail* |
| *C20-UT08* | *`cekMediaTerunggah()`* | *Negatif* | *Folder eksekutor lain* | *false* | ** | *Pass/Fail* |
| *C20-UT09* | *`cekMediaTerunggah()`* | *Negatif* | *Folder laporan/warga* | *false* | ** | *Pass/Fail* |
| *C20-UT10* | *`cekMediaTerunggah()`* | *Negatif* | *Video di daftar foto* | *false* | ** | *Pass/Fail* |
| *C20-UT11* | *`cekMediaTerunggah()`* | *Negatif* | *format tidak sesuai batasan ekstensi* | *false* | ** | *Pass/Fail* |
| *C20-UT12* | *`verifikasiAkses()`* | *Normal* | *Sesi eksekutor* | *true* | ** | *Pass/Fail* |
| *C20-UT13* | *`verifikasiAkses()`* | *Negatif* | *Sesi ditolak* | *false* | ** | *Pass/Fail* |
| *C20-UT14* | *`unggahHasil(idTiket, catatan, foto, video)`* | *Normal* | *Catatan berspasi + 1 foto + 1 video* | *ok({idTiket}), catatan di-trim* | ** | *Pass/Fail* |
| *C20-UT15* | *`unggahHasil()`* | *Batas* | *Foto tepat 10 MB* | *ok* | ** | *Pass/Fail* |
| *C20-UT16* | *`unggahHasil()`* | *Negatif* | *Akses ditolak* | *Pesan akses, database tak tersentuh* | ** | *Pass/Fail* |
| *C20-UT17* | *`unggahHasil()`* | *Negatif* | *Catatan kosong* | *PESAN_TAK_LENGKAP* | ** | *Pass/Fail* |
| *C20-UT18* | *`unggahHasil()`* | *Negatif* | *Tipe masukan salah dari client* | *PESAN_TAK_LENGKAP* | ** | *Pass/Fail* |
| *C20-UT19* | *`unggahHasil()`* | *Negatif* | *GIF, > 10MB, folder lain* | *PESAN_BERKAS_TIDAK_VALID, berkas tak disimpan* | ** | *Pass/Fail* |
| *C20-UT20* | *`unggahHasil()`* | *Negatif* | *Tiket tidak ada/menunggu_evaluasi* | *Pesan tugas tak aktif, tidak disimpan* | ** | *Pass/Fail* |
| *C20-UT21* | *`unggahHasil()`* | *Negatif* | *Error membaca laporan* | *pesanErrorDB(error)* | ** | *Pass/Fail* |
| *C20-UT22* | *`unggahHasil()`* | *RPC menolak (P0001)* | *Pesan database diteruskan* | *xxx* | ** | *Pass/Fail* |
| *C20-UT23* | *`unggahHasil()`* | *Negatif* | *Koneksi gagal* | *Gagal mengirim hasil perbaikan* | ** | *Pass/Fail* |
| *C20-UT24* | *`unggahHasil()`* | *Negatif* | *xxx* | *xxx* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.2.x Kelas ABCD

**ID Kelas:** *CXX*  
**Nama Kelas:** *ABCD*  
**Tingkat:** *ABCD*

Tabel 4.2.x. Hasil Pengujian Unit Kelas [CXX]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *CXX-UTXX* | *`xxx`* | *Normal* | *xxx* | *xxx* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.xb. Ringkasan Cakupan Kelas [CXX]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.x Kelas ABCD

**ID Kelas:** *CXX*  
**Nama Kelas:** *ABCD*  
**Tingkat:** *ABCD*

Tabel 4.2.x. Hasil Pengujian Unit Kelas [CXX]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *CXX-UTXX* | *`xxx`* | *Normal* | *xxx* | *xxx* | ** | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.xb. Ringkasan Cakupan Kelas [CXX]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *I-01* | *KeranjangController* | *Keranjang (Model)* | *Controller - Model* | *INT-TC01, INT-TC02* |
| *I-02* | *Pesanan (Model)* | *Database* | *Aplikasi - Basis data* | *INT-TC03* |
| *I-03* | *PaymentGatewayAdapter* | *Payment Gateway (dummy)* | *Aplikasi - Sistem eksternal* | *INT-TC04, INT-TC05* |
| *[I-XX]* | *[Komponen asal]* | *[Komponen tujuan]* | *[Jenis batas]* | *[ID test case]* |
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC01* | *I-01* | *Normal: tambah item ke keranjang* | *Panggil `tambahItem()` melalui KeranjangController dengan produk valid* | *Item tersimpan pada Keranjang dan tampil pada daftar item* | *[Hasil aktual]* | *Pass/Fail* |
| *INT-TC03* | *I-02* | *Normal: simpan pesanan* | *Buat pesanan, lalu baca ulang langsung dari basis data* | *Baris pesanan ada dengan nilai total dan status yang sama* | *[...]* | *Pass/Fail* |
| *INT-TC05* | *I-03* | *Gagal: gateway mengembalikan status gagal* | *Kirim otorisasi dengan saldo dummy tidak cukup* | *Status pesanan tidak berubah menjadi "Lunas", pesan gagal diteruskan ke pengguna* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01* | *Normal* | *1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login".* | *User: rpl@gmail.com<br>Pass: 123456* | *Pengguna diarahkan ke Halaman Dashboard.* | *Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |