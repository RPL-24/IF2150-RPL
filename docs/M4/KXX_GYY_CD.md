<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 4
<br>
CLASS DIAGRAM
</h1>
<br>

## *Nama Perangkat Lunak*

### Untuk: *[Nama Asisten]*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *\[Kelas\]* |
| Kelompok | *\[Nomor Kelompok\]*  |

| NIM | Nama |
|---|---|
| *[NIM 1]* | *[Nama Anggota 1]* |
| *[NIM 2]* | *[Nama Anggota 2]* |
| *[NIM 3]* | *[Nama Anggota 3]* |
| *[NIM 4]* | *[Nama Anggota 4]* |
| *[NIM 5]* | *[Nama Anggota 5]* |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

<br>
<br>

# BAB 1: Deskripsi Perangkat Lunak

Tuliskan overview perangkat lunak dalam narasi yang dapat memberikan gambaran tentang konteks perangkat lunak aplikasi Anda.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

---

# BAB 2: Kebutuhan Fungsional

## 2.1 Kebutuhan Fungsional

Salin ulang seluruh Kebutuhan Fungsional (KF) yang telah dirumuskan pada dokumen sebelumnya, lengkap dengan ID KF, ID Kebutuhan (mengacu ke ID pada tabel Pemetaan Kebutuhan di dokumen *Requirement Gathering*), dan penjelasannya.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

<sub> ***Catatan***: *Kebutuhan ditulis mengikuti pola EARS. Pada contoh di bawah, sebagian besar KF dipicu oleh satu aksi pelanggan, sehingga memakai pola event-driven "Ketika ⟨pemicu⟩, sistem harus ⟨respons⟩".*
<sub>

Tabel 2.1. Daftar Kebutuhan Fungsional

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01* | *Ketika pelanggan membuka halaman katalog, sistem harus menampilkan daftar produk yang tersedia.* |
| *KF02* | *R02* | *Ketika pelanggan memilih "Tambah ke Keranjang" pada suatu produk, sistem harus menyimpan produk tersebut ke dalam keranjang pelanggan.* |
| *KF03* | *R03* | *Ketika pelanggan menekan tombol checkout, sistem harus menampilkan pilihan metode pembayaran yang tersedia.* |
| *KF04* | *R04* | *Ketika pelanggan memilih metode pembayaran, sistem harus mengirimkan permintaan otorisasi beserta nominal tagihan dan ID pesanan ke payment gateway (dummy).* |
| *KF05* | *R04* | *Ketika payment gateway (dummy) mengembalikan status pembayaran berhasil, sistem harus memperbarui status pesanan menjadi "Lunas" dan menampilkan notifikasi pembayaran berhasil.* |
| *KF06* | *R05* | *Ketika pelanggan membuka menu riwayat pesanan, sistem harus menampilkan daftar pesanan beserta statusnya.* |
| *KFXX* | *...* | *...* |


---

# BAB 3: Model Use Case

## 3.1 Identifikasi Aktor

Tuliskan kembali daftar aktor yang terlibat dan deskripsi perannya dalam perangkat lunak (P/L). Deskripsi peran harus menjelaskan wewenang aktor tersebut dalam perangkat lunak. Perlu diingat bahwa aktor yang dimaksud adalah pengguna yang berinteraksi langsung dengan P/L. Komponen seperti database, payment gateway, atau library bukan aktor.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

| Aktor | Deskripsi |
| :--- | :--- |
| *Pelanggan* | *Pengguna yang memesan produk, mengelola keranjang, dan menyelesaikan pembayaran melalui sistem.* |
| *...* | *...* |

## 3.2 Identifikasi Use Case

Use case berfungsi untuk mendeskripsikan interaksi aktor-aktor yang terlibat dengan sistem. Isi daftar use case dan deskripsi singkatnya dalam tabel di bawah.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

| ID UC | Nama Use Case | Deskripsi Singkat | Aktor | ID KF |
| :--- | :--- | :--- | :--- | :--- |
| *UC01* | *Memesan Produk* | *Pelanggan memilih produk hingga pesanan tersimpan di sistem.* | *Pelanggan* | *KF01, KF02* |
| *UC02* | *Melihat Keranjang* | *Pelanggan melihat daftar item yang telah dipilih sebelum checkout.* | *Pelanggan* | *KF02* |
| *UC03* | *Melakukan Pembayaran* | *Pelanggan menyelesaikan pembayaran atas pesanan yang dibuat.* | *Pelanggan* | *KF03, KF04, KF05* |
| *UC04* | *Memilih Metode Pembayaran* | *Pelanggan memilih metode pembayaran alternatif (kartu atau e-wallet).* | *Pelanggan* | *KF03* |
| *UC05* | *Melihat Riwayat Pesanan* | *Pelanggan melihat daftar pesanan yang pernah dibuat beserta statusnya.* | *Pelanggan* | *KF06* |
| *...* | *...* | *...* | *...* | *...* |

## 3.3 Use Case Diagram
Buatlah diagram use case keseluruhan berdasarkan identifikasi use case beserta aktor yang melakukan use case tersebut. Perhatikan garis `<<extend>>` dan `<<include>>`.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

<br>
<p align="center">
<img alt="Use Case Diagram" src="../M4/assets/diagram/contoh-uc-diagram.webp" width="80%">
</p>
<p align="center">
<i>Gambar 1. Use Case Diagram</i>
</p>
<br>

## 3.4 Skenario Use Case
Salin ulang skenario **setiap** use case (skenario normal dan alternatif) dari dokumen *Use Case & Scenario Use Case*. Skenario ini menjadi dasar penentuan atribut dan metode/operasi kelas pada BAB 4.

Pada bagian ini, Anda diperbolehkan untuk menyalin dari dokumen sebelumnya.

### 3.4.1 Skenario UC01

**Nama Use Case:** *Memesan Produk*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan memilih produk dari katalog* | *Sistem menampilkan detail produk dan menambahkannya ke keranjang* |
| 2 | *Pelanggan menekan tombol checkout* | *Sistem membuat pesanan baru dari isi keranjang dan menampilkan ringkasan pesanan* |
| ... | *...* | *...* |

**Skenario Alternatif 1: Produk Tidak Tersedia**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan memilih produk dari katalog* | *Sistem menampilkan pesan "Produk tidak tersedia" karena stok habis* |
| 2 | *Pelanggan memilih produk lain* | *Sistem kembali ke langkah 1 skenario normal* |
| ... | *...* | *...* |

### 3.4.3 Skenario UC03

**Nama Use Case:** *Melakukan Pembayaran*

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan menekan tombol "Bayar" pada ringkasan pesanan* | *Sistem menampilkan pilihan metode pembayaran yang tersedia (mis. Kartu, E-Wallet)* |
| 2 | *Pelanggan memilih salah satu metode pembayaran* | *Sistem mengirimkan permintaan otorisasi ke payment gateway (dummy) sesuai metode yang dipilih* |
| 3 | *-* | *Payment gateway (dummy) mengembalikan status pembayaran berhasil; sistem memperbarui status pesanan menjadi "Lunas" dan menampilkan notifikasi pembayaran berhasil* |
| ... | *...* | *...* |

**Skenario Alternatif 1: Pembayaran Dummy Gagal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| :--- | :--- | :--- |
| 1 | *Pelanggan menekan tombol "Bayar" pada ringkasan pesanan* | *Sistem menampilkan pilihan metode pembayaran yang tersedia* |
| 2 | *Pelanggan memilih salah satu metode pembayaran* | *Sistem mengirimkan permintaan otorisasi ke payment gateway (dummy), yang mengembalikan status gagal (mis. saldo e-wallet dummy tidak mencukupi)* |
| 3 | *Pelanggan memilih untuk mencoba lagi atau memilih metode lain* | *Sistem kembali ke langkah 1 skenario normal* |
| ... | *...* | *...* |

<sub>*Lanjutkan pola 3.4.x ini untuk setiap ID UC pada 3.2, sampai seluruh use case tercakup.*<sub>

---

# BAB 4: Diagram Kelas
Bagian ini berisi identifikasi kelas dan pemodelan struktur kelas yang diperlukan untuk merealisasikan use case pada BAB 3. Gunakan skenario use case (3.4) sebagai dasar untuk menentukan kelas, atribut, metode, dan hubungan antarkelas.

## 4.1 Identifikasi Kelas
Identifikasi seluruh kelas yang diperlukan berdasarkan use case dan skenarionya. Satu kelas boleh terkait dengan lebih dari satu use case.

| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| C01 | Warga | Menyimpan data akun warga; membuat laporan kerusakan, memberikan dukungan (upvote) pada laporan, dan memantau status laporannya. | UC01, UC06 |
| C02 | Admin | Menyimpan data akun anggota Tim Administrasi; meninjau antrean laporan yang dapat disaring per kategori, memvalidasi atau menolak laporan, serta mengevaluasi hasil perbaikan. | UC02, UC05 |
| C03 | EksekutorLapangan | Menyimpan data akun eksekutor; melihat daftar laporan yang harus ditangani dan mengunggah hasil perbaikan. | UC03, UC04 |
| C04 | Laporan | Menyimpan data laporan kerusakan (ID tiket, kategori, deskripsi, status, waktu masuk, alasan penolakan) dengan status bernilai Diterima, Ditolak, Dikerjakan, atau Berhasil; memutuskan apakah dirinya duplikat, menghitung skor prioritas, dan mengelola perubahan statusnya sendiri. | UC01, UC02, UC03, UC04, UC05, UC06 |
| C05 | Lokasi | Menyimpan koordinat GPS laporan dan menghitung jarak ke lokasi lain untuk pengecekan duplikat dalam radius 20 m. | UC01, UC02 |
| C06 | Foto | Menyimpan berkas foto beserta format dan ukurannya, serta memeriksa kevalidan dirinya (JPG/PNG, maksimal 10 MB). | UC01, UC02, UC04, UC05 |
| C07 | Upvote | Merepresentasikan dukungan seorang Warga terhadap suatu laporan sebagai dasar skor prioritas. | UC01, UC02 |
| C08 | HasilPerbaikan | Menyimpan bukti penanganan dari Eksekutor Lapangan berupa foto, catatan, dan waktu unggah; satu laporan dapat memiliki lebih dari satu hasil bila dikembalikan untuk eksekusi ulang. | UC04, UC05 |
| C09 | Evaluasi | Menyimpan keputusan verifikasi ulang Tim Administrasi atas suatu hasil perbaikan (diterima atau dikembalikan) beserta catatannya. | UC05 |
| C10 | Notifikasi | Menyimpan dan mengirimkan pesan perubahan status laporan kepada Warga pelapor. | UC01, UC02, UC05, UC06 |


| ID Kelas | Nama Kelas | Deskripsi Kelas | ID Use Case |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | Kelas yang menyimpan data akun dan autentikasi yang dimiliki seluruh aktor, serta menentukan daftar laporan yang dapat dilihat sesuai perannya. | UC01, UC02, UC03, UC04, UC05, UC06 |
| C02 | Warga | Turunan Pengguna yang membuat laporan kerusakan, memberikan dukungan (upvote), dan memantau status laporannya. | UC01, UC06 |
| C03 | Admin | Turunan Pengguna yang memvalidasi atau menolak laporan baru serta mengevaluasi hasil perbaikan. | UC02, UC05 |
| C04 | Eksekutor | Turunan Pengguna yang melihat laporan yang harus ditangani dan mengunggah hasil perbaikan. | UC03, UC04 |
| C05 | Laporan | Menyimpan data laporan kerusakan (ID tiket, kategori, deskripsi, status, waktu masuk, alasan penolakan), memutuskan apakah dirinya duplikat, menghitung skor prioritas, dan mengelola perubahan statusnya sendiri. | UC01, UC02, UC03, UC04, UC05, UC06 |
| C06 | Lokasi | Menyimpan koordinat GPS laporan dan menghitung jarak ke lokasi lain untuk pengecekan duplikat dalam radius 20 m. | UC01, UC02 |
| C07 | Foto/Video | Menyimpan berkas foto atau video beserta format dan ukurannya, serta memeriksa kevalidan dirinya. | UC01, UC02, UC04, UC05 |
| C08 | Upvote | Merepresentasikan dukungan seorang Warga terhadap suatu laporan sebagai dasar skor prioritas. | UC01, UC02 |
| C09 | AntrianLaporan | Mengelola kumpulan laporan: mencari laporan di sekitar lokasi tertentu, menyaring berdasarkan kategori, dan mengurutkan berdasarkan waktu masuk atau prioritas. | UC01, UC02, UC03 |
| C10 | HasilPerbaikan | Menyimpan bukti penanganan dari Eksekutor Lapangan berupa foto, catatan, dan waktu unggah. Satu laporan dapat memiliki lebih dari satu hasil bila dikembalikan untuk eksekusi ulang. | UC04, UC05 |
| C11 | Evaluasi | Menyimpan keputusan verifikasi ulang Tim Administrasi atas suatu hasil perbaikan (diterima atau dikembalikan) beserta catatannya. | UC05 |
| C12 | Notifikasi | Menyimpan dan mengirimkan pesan perubahan status laporan kepada Warga pelapor. | UC01, UC02, UC05, UC06 |
| C13 | StatusLaporan | Enumerasi status laporan: Diterima, Ditolak, Dikerjakan, dan Berhasil. | UC01, UC02, UC03, UC04, UC05, UC06 |
| C14 | KategoriKerusakan | Enumerasi kategori kerusakan infrastruktur yang dapat dipilih saat pelaporan dan dipakai untuk penyaringan. | UC01, UC02 |

Pastikan setiap kelas memiliki tanggung jawab yang jelas dan memang diperlukan untuk merealisasikan fungsi yang dimodelkan. Hindari kelas yang tidak memiliki keterkaitan dengan KF atau use case manapun.

## 4.2 Diagram Kelas per Use Case
Buat diagram kelas untuk setiap use case pada 3.2.

### 4.2.1 Use Case UC01

**Nama Use Case:** *Memesan Produk*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C01* | *Pelanggan* | *Menyimpan data akun pelanggan yang membuat pesanan.* |
| *C02* | *Pesanan* | *Menyimpan data pesanan yang dibuat dari isi keranjang.* |
| *C03* | *Keranjang* | *Menyimpan sementara item yang dipilih sebelum checkout.* |
| *...* | *...* | *...* |

#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/contoh-class-diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar 2. Diagram Kelas Use Case UC01</i>
</p>
<br>

Pada diagram kelas, cukup tampilkan nama kelas saja. Atribut dan metode/operasi milik setiap kelas dapat dituliskan pada tabel di bawah ini. Pastikan hubungan antarkelas menggunakan jenis relasi yang sesuai (asosiasi, agregasi, komposisi, generalisasi, atau dependensi).

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *idPesanan, total, status* | *buatPesanan(), hitungTotal()* |
| *C03* | *Keranjang* | *daftarItem* | *tambahItem(), checkout()* |
| *...* | *...* | *...* | *...* |

### 4.2.5 Use Case UC05

**Nama Use Case:** *Mengevaluasi Hasil Kerja*

#### Identifikasi Kelas

| ID Kelas | Nama Kelas | Deskripsi Kelas |
| :--- | :--- | :--- |
| *C02* | *Admin* | *Memvalidasi dan menentukan apakah hasil pekerjaan sudah dinilai selesai atau tidak.* |
| *C04* | *Laporan* | *Mengelola perubahan statusnya pekerjaan.* |
| *C06* | *Foto/Video* | *Menyimpan bukti hasil pekerjaan.* |
| *C08* | *HasilPerbaikan* | *Menyimpan bukti  serta keterangan penanganan dari Eksekutor Lapangan.* |
| *C09* | *Evaluasi* | *Menyimpan keputusan validasi ulang Tim Administrasi.* |
| *C10* | *Notifikasi* | *Mengirimkan peasn perubahan status laporan.* |
| *...* | *...* | *...* |

#### Diagram Kelas

<p align="center">
<img alt="Class Diagram UC01" src="./assets/diagram/4.3.5.png" width="70%">
</p>
<p align="center">
<i>Gambar 2. Diagram Kelas Use Case UC05</i>
</p>
<br>

Pada diagram kelas, cukup tampilkan nama kelas saja. Atribut dan metode/operasi milik setiap kelas dapat dituliskan pada tabel di bawah ini. Pastikan hubungan antarkelas menggunakan jenis relasi yang sesuai (asosiasi, agregasi, komposisi, generalisasi, atau dependensi).

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C02* | *Admin* | *idAdmin* | *validasiLaporan(), laporanSelesai(), laporanTidakSelesai(), saringAntrean* |
| *C04* | *Laporan* | *idTiket, kategori, deskripsi, status, waktuMasuk, foto, video* | *ubahStatus()* |
| *C06* | *Foto/Video* | *idFoto, idVideo* | *bukaVideo(), bukaFoto()* |
| *C08* | *HasilPerbaikan* | *idHasil, idTiket, idEksekutor, catatan, waktuUnggah* | *tambahFoto(), tambahVideo(), tulisKeterangan(), simpanBukti()* |
| *C09* | *Evaluasi* | *idHasil, keputusan, catatan* | *simpanEvaluasi, laporanTidakSelesai(), laporanSelesai()* |
| *C010* | *Notifikasi* | *idNotifikasi, idTiket, idWarga, isiPesan, waktuKirim* | *kirimPesan()* |
| *...* | *...* | *...* | *...* |

> Lanjutkan pola **4.2.x** untuk setiap use case pada 3.2.

## 4.3 Diagram Kelas Keseluruhan

Gabungkan seluruh kelas dan hubungan antarkelas dari diagram kelas setiap use case menjadi satu diagram kelas keseluruhan. Pastikan tidak ada kelas yang terduplikasi.

<p align="center">
<img alt="Class Diagram Keseluruhan" src="./assets/diagram/contoh-class-diagram.webp" width="70%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas Keseluruhan</i>
</p>
<br>

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| *C01* | *Pelanggan* | *idPelanggan, nama, email* | *lihatRiwayatPesanan()* |
| *C02* | *Pesanan* | *idPesanan, total, status* | *hitungTotal(), perbaruiStatus()* |
| *C03* | *Keranjang* | *daftarItem* | *tambahItem(), checkout()* |
| *C04* | *MetodePembayaran* | *-* | *kirimKePaymentGatewayDummy()* |
| *C05* | *Kartu* | *nomorKartu, masaBerlaku* | *kirimKePaymentGatewayDummy()* |
| *C06* | *EWallet* | *saldo, idAkun* | *cekSaldo(), kirimKePaymentGatewayDummy()* |
| *C07* | *RiwayatTransaksi* | *idTransaksi, waktu, status* | *catatTransaksi(), tampilkanNotifikasi()* |
| *...* | *...* | *...* | *...* |

---

# BAB 5: Traceability
Cocokkan setiap kebutuhan fungsional, use case, dengan diagram kelas yang mendukung atau mengimplementasikan kebutuhan tersebut.

| ID Kelas | ID Use Case | ID KF |
| :--- | :--- | :--- |
| *C01* | *UC01, UC05* | *KF01, KF06* |
| *C02* | *UC01, UC03, UC05* | *KF01, KF02, KF05, KF06* |
| *C03* | *UC01, UC02* | *KF01, KF02* |
| *C04* | *UC03, UC04* | *KF03* |
| *C05* | *UC03, UC04* | *KF03* |
| *C06* | *UC03, UC04* | *KF03, KF04* |
| *C07* | *UC03, UC05* | *KF04, KF05* |
| *...* | *...* | *...* |

---

# Referensi

- Diagram UML: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)