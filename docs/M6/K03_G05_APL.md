<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 6
<br>
ARSITEKTUR PERANGKAT LUNAK (APL)
</h1>
<br>

## LawHub

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:

| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | G05 |
| Nama Kelompok | HEYSRIUSLAH  |

| NIM | Nama |
|---|---|
| 13525057 | Raya Medina Farrelin |
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525108 | Khasya Nurul Amini |
| 13525150 | Livy Chandra |
| 13525138 | Cathrine Angel Siburian |
---

<br>
<br>

# BAB 1: Style/Pattern Arsitektur Acuan

Architectural style atau pattern yang menjadi acuan untuk aplikasi LawHub yang kami kembangkan adalah MVC (Model-View-Controller). Pada MVC, view berperan untuk memperlihatkan antarmuka pada perangkat lunak. View menerima aksi atau masukan awal dari pengguna lalu meneruskan informasi ke controller. Pada LawHub, view direpresentasikan dengan kelas antarmuka seperti SearchLawpage, DaftarMitraPengacaraPage, dan ChatKonsultasiPage. Lalu, controller menjadi penghubung antara view dan model. Controller menerima permintaan pengguna dari view, memproses logika melalui model, dan mengembalikan view setelah data selesai diproses. Contoh controller pada LawHub adalah SesiKonsultasiController dan PencarianMitraController.Terakhir, model merupakan representasi struktur data dan state aplikasi. Model menerima masukan permintaan data yang diperlukan sesuai instruksi controller. Setelah itu, model melakukan operasi create, read, update, dan delete pada database. Selain itu, model juga dapat menyimpan informasi apabila diinstruksikan oleh database. Contoh model pada LawHub adalah Kasus, MitraPengacara, dan DasarHukum.

<p align="center">
<img alt="Arsitektur MVC" src="./assets/diagram/contoh-arsitektur-mvc.webp" width="70%">
</p>
<p align="center">
<i>Gambar 1. Arsitektur MVC</i>
</p>

MVC dipilih karena sesuai dengan karakteristik aplikasi Lawhub serta kebutuhan fungsional dan non-fungsional. Pada class diagram yang telah dibuat, LawHub telah memakai stereotype <<boundery>>, <<control>>, dan <<entity>> yang dapat langsung diadaptasi dengan rancangan arsitektur MVC tanpa perlu mengatur ulang struktur kelas. Selain itu, LawHub memiliki tiga aktor dengan antarmuka yang berbeda tetapi ketiganya dapat memanipulasi data yang sama. Dengan MVC, antarmuka untuk setiap peran dapat dikembangakn secara mandiri tanpa perlu memengaruhi logika di belakangnya. Kemudian, berdasarkan alur bisnis dan KF, fitur dengan algoritma pencarian membutuhkan pemisahan tugas antara view dan controller. View hanya memproses masukan pengguna, sementara logika pencariannya dijalankan oleh controller. Terakhir, MVC mendukung keamanan sistem saat mengenkripsi pesan karena dapat diisolasi pada controller dan model.

Tabel 1.1. Lingkungan Operasi Perangkat Lunak

| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | Local |
| *Client* | Chromium Based Browser |
| *DBMS* | PostgreSQL  |
| *OS* | Cross-platform (Windows/Linux/MacOS) melalui browser |

---

# BAB 2: Identifikasi Komponen / Modul / Subsistem

Tabel 2.1. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis                 | Penjelasan                                                                                                           |
| :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------- |
RegistrasiView | View | Menampilkan formulir pendaftaran akun bagi masyarakat dan mitra pengacar, serta meneruskan input ke RegistrasiController. |
AutentikasiView | View | Menampilkan halaman login bagi masyarakat dan mitra pengacara untuk masuk sebagai akun terdaftar |
BerandaView | View | Menampilkan halaman utama setelah login. |
StatusVerifikasiMitraView | View | Menampilkan status terkini verifikasi akun kepada Mitra Pengacara, serta menampilkan dokumen pendaftar bagi Admin untuk ditinjau dan diverifikasi. |
EditProfilMitraPage | View |  Menampilkan formulir pengeditan profil/identitas firma serta pengunggahan dan pengeditan dokumen legalitas milik Mitra Pengacara. |
SearchLawView | View | Menampilkan hasil pencarian pasal berdasarkan kata kunci yang dimasukkan pengguna pada fitur SearchLaw. |
DaftarMitraPengacaraPage | View | Menampilkan daftar Mitra Pengacara lengkap dengan filter pencarian. |
KonsultasiView | View |  Menampilkan pemilihan Mitra Pengacara dan jadwal konsultasi, konfirmasi penerimaan konsultasi oleh Mitra Pengacara, serta ruang chat sesi konsultasi (HaloLaw) antara Masyarakat dan Mitra Pengacara. |
UlasanView | View | Menampilkan formulir pengisian ulasan, feedback, dan rating setelah sesi konsultasi selesai. |
LaporanView | View | Menampilkan formulir pelaporan pelanggaran akun (oleh Masyarakat maupun Mitra Pengacara) dan pelaporan ulasan yang dianggap tidak relevan (oleh Mitra Pengacara), serta halaman tinjauan laporan bagi Admin. |
HistoryView | View | Menampilkan riwayat kasus dan sesi konsultasi yang telah dilakukan Masyarakat maupun Mitra Pengacara. |
LiveChatAdminView | View | Menampilkan ruang live chat bagi Masyarakat untuk bertanya dan bagi Admin untuk menjawab pertanyaan. |
PembayaranView | View | Menampilkan pemilihan metode dan konfirmasi pembayaran sesi konsultasi. |
PencairanDanaView | View | Menampilkan formulir pengajuan pencairan dana bagi Mitra Pengacara. |
RegistrasiController | Controller | Mengatur alur pendaftaran akun baru, termasuk validasi data dan pembuatan akun Masyarakat, serta pendaftaran akun dan pengunggahan dokumen legalitas Mitra Pengacara untuk diverifikasi.
AutentikasiController | Controller | Mengelola proses log in dan verifikasi kredensial, dipakai bersama oleh Masyarakat maupun Mitra Pengacara. |
| VerifikasiMitraController | Controller | Mengelola proses verifikasi Mitra Pengacara, mencakup penampilan status bagi Mitra Pengacara maupun peninjauan dan penentuan status oleh Admin berdasarkan dokumen legalitas. |
| ProfilMitraController | Controller | Mengelola pembaruan profil dan dokumen legalitas Mitra Pengacara. |
| SearchLawController | Controller | Memproses permintaan pencarian pasal berdasarkan kata kunci pada basis data peraturan perundang-undangan dalam fitur SearchLaw. |
| PencarianMitraController | Controller | Memproses pencarian dan filter daftar Mitra Pengacara berdasarkan kasus yang dimasukkan Masyarakat dalam fitur HaloLaw. |
| KonsultasiController | Controller | Mengelola pemilihan Mitra Pengacara dan jadwal sesi konsultasi oleh Masyarakat, alur penerimaan sesi oleh Mitra Pengacara, serta berjalannya sesi konsultasi melalui chat yang baru dapat dimulai setelah pembayaran lunas. |
| UlasanController | Controller | Mengelola pengiriman ulasan, feedback, dan rating dari Masyarakat kepada Mitra Pengacara. |
| LaporanController | Controller | Mengatur alur pelaporan pelanggaran akun maupun ulasan (baik oleh Masyarakat maupun Mitra Pengacara), serta memproses tinjauan laporan dan eksekusi pemblokiran akun yang melanggar kebijakan oleh Admin. |
| RiwayatController | Controller | Mengambil dan menyusun data riwayat kasus/konsultasi yang telah dilakukan Masyarakat maupun Mitra Pengacara. |
| LiveChatController | Controller | Mengelola pengiriman dan penerimaan pesan live chat antara Masyarakat dan Admin. |
| PembayaranController | Controller | Memproses transaksi pembayaran sesi konsultasi melalui PaymentGatewayAdapter; pembayaran harus lunas sebagai syarat sebelum sesi chat dibuka. |
| PencairanDanaController | Controller | Memproses permintaan dan validasi pencairan dana Mitra Pengacara ke rekening terdaftar melalui PaymentGatewayAdapter, secara terpisah dan tidak otomatis setelah pembayaran diterima sistem. |
Masyarakat | Model | Menyimpan data akun Masyarakat yang mengajukan kasus, mencari pasal dan mitra, berkonsultasi, membayar, memberi ulasan, dan melapor. |
MitraPengacara | Model | Menyimpan data akun dan profil Mitra Pengacara, mencakup tag keahlian, status verifikasi, status ketersediaan, rating, saldo, dan rekening pencairan. |
Admin | Model | Menyimpan data akun Admin yang memverifikasi Mitra Pengacara, meninjau laporan, memblokir akun, dan melayani live chat. |
Kasus | Model | Menyimpan data kasus/kondisi Masyarakat yang menjadi dasar pencarian dan pemilihan Mitra Pengacara pada fitur HaloLaw, serta dikaitkan dengan sesi konsultasi dan riwayat penanganan. |
DasarHukum | Model | Menyimpan data peraturan dan perundang-undangan (pasal) yang menjadi basis data pencarian pada fitur SearchLaw. |
DokumenLegalitas | Model | Menyimpan berkas dan data legalitas yang diunggah Mitra Pengacara untuk keperluan verifikasi. |
SesiKonsultasi | Model | Menyimpan data sesi konsultasi antara Masyarakat dan Mitra Pengacara beserta status dan waktu mulai/selesai. |
Ulasan | Model | Menyimpan data ulasan berupa teks, foto, dan/atau rating yang diberikan Masyarakat setelah sesi konsultasi, dan ditampilkan pada profil Mitra Pengacara. |
Laporan | Model | Menyimpan data laporan pelanggaran akun maupun ulasan beserta status peninjauannya oleh Admin. |
Pembayaran | Model | Menyimpan data transaksi pembayaran sesi konsultasi, termasuk metode, jumlah, status, dan waktu transaksi. |
LiveChat | Model | Menyimpan data percakapan live chat antara Masyarakat dan Admin. |
| PencairanDana | Model | Menyimpan data transaksi pencairan dana Mitra Pengacara, termasuk jumlah, tanggal, status, dan rekening tujuan. |
| PaymentGatewayAdapter | Integrasi Eksternal | Mengirim permintaan otorisasi ke Payment Gateway pihak ketiga (dummy) untuk pembayaran sesi konsultasi maupun pencairan dana Mitra Pengacara, lalu meneruskan status transaksi ke PembayaranController dan PencairanDanaController. |
| Database | Penyimpanan Data | Menyimpan seluruh data Model secara persisten dan terpusat, diakses oleh seluruh Controller LawHub. |

<sub><b><i>Catatan</i></b>: <i>Nama komponen pada Tabel 2.1 harus dipakai sama persis pada gambar di BAB 1 dan setiap view di BAB 3. Jika saat membuat view ternyata dibutuhkan komponen baru, tambahkan komponen tersebut ke Tabel 2.1 terlebih dahulu.</i></sub>

---

# BAB 3: Model Arsitektur Perangkat Lunak

*Architectural View* adalah bagaimana cara kita melihat/mendeskripsikan arsitektur sebuah sistem dari sudut pandang tertentu. Dalam perancangan arsitektur aplikasi, dibutuhkan *Architectural View* yang dapat mempermudah pemahaman dari proses aplikasi yang akan dikembangkan. Tujuan dari *Architectural View* adalah menjadi bahan komunikasi, pemisahan masalah, mempermudah analisis, dan pemandu saat eksekusi pengembangan sistem tersebut.

Buatlah model arsitektur dari aplikasi yang akan dirancang dalam bentuk *view*. Model arsitektur ini berfungsi untuk memperlihatkan bagaimana setiap komponen, modul, dan subsistem saling berinteraksi serta berkolaborasi dalam menjalankan fungsi utama sistem secara keseluruhan. Anda dapat membuat satu atau lebih *view* tergantung kebutuhan dalam bentuk gambar. Pilihlah notasi yang sesuai. Contoh *view* yang dapat digunakan antara lain ***Logical View***, ***Process View***, ***Development View***, serta ***Physical View***.

Ketentuan pengisian BAB 3:
1. Setiap view menggambarkan **keseluruhan sistem**, bukan satu use case atau satu fitur saja.
2. Buat **minimal satu view**. Setiap view dituliskan dalam subbab tersendiri (3.1, 3.2, dan seterusnya). Tidak perlu membuat keempat view, pilih yang paling membantu menjelaskan P/L Anda, lalu jelaskan alasan pemilihannya.
3. Setiap view harus **konsisten dengan BAB 2**. Seluruh komponen pada Tabel 2.1 harus muncul dengan nama yang sama, dan tidak boleh ada komponen pada view yang tidak terdaftar di Tabel 2.1.
4. Setiap view harus **mencerminkan style/pattern pada BAB 1**. Misalnya, jika memilih MVC, pembagian *Model*, *View*, dan *Controller* harus terlihat jelas pada diagram.
5. Jika membuat lebih dari satu view, setiap view harus menggambarkan sistem yang sama dari sudut pandang berbeda. View tambahan melengkapi view pertama, bukan mengulanginya.
6. Beri label pada setiap garis atau panah yang menghubungkan komponen agar hubungan antarkomponen dapat dipahami tanpa penjelasan tambahan.
7. Jika membuat *Physical View*, gambarkan lingkungan operasi pada Tabel 1.1.

## 3.1 XXX View

Tuliskan secara singkat mengenai model arsitektur perangkat lunak yang Anda pilih dan sertakan alasan mengapa model arsitektur tersebut cocok untuk aplikasi Anda.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-logical-view.webp" width="100%">
</p>
<p align="center">
<i>Gambar 2. Contoh Logical View pada P/L E-Commerce</i>
</p>

Gambar 2 adalah contoh *Logical View* dalam bentuk *block diagram*. Seluruh komponen pada Tabel 2.1 digambarkan dan dikelompokkan sesuai pola MVC (*View*, *Controller*, *Model*), ditambah komponen pendukung dan basis data. Sistem di luar P/L, seperti *Payment Gateway (dummy)*, digambarkan dengan garis putus-putus dan tidak perlu dimasukkan ke Tabel 2.1. Setiap garis diberi label: "Memanggil" untuk *View* yang memanggil *Controller*, "akses" untuk *Controller* yang mengakses *Model*, serta agregasi dan komposisi untuk hubungan antar-*Model*.

<sub><b><i>Catatan</i></b>: <i>Ganti XXX dengan nama view yang dibuat, misalnya Logical View. Gambar 2 hanya contoh untuk P/L e-commerce, ganti dengan view milik kelompok Anda yang memuat seluruh komponen pada Tabel 2.1. Jenis view dan notasinya boleh berbeda dari contoh. Jika membuat view tambahan, lanjutkan pola 3.x ini (3.2, 3.3, dan seterusnya).</i></sub>

---

# Referensi

- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 6: *Architectural Design*: [https://software-engineering-book.com/slides/](https://software-engineering-book.com/slides/)
- Diagram arsitektur: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
