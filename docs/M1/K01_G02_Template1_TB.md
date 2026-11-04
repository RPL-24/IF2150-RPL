<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *ITBELI*

### Untuk: *Mikhael Andrian Yonatan*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K1* |
| Kelompok | *2*  |

| NIM | Nama |
|---|---|
| *13525124* | *Sulthan Dhiyazka Suwandi* |
| *13525034* | *Dhanesworo Muhammad Datiputro* |
| *13525115* | *Nazhif Hilmi Kistijantoro* |
| *13525121* | *I Made Adi Kusuma Ardana* |
| *13525106* | *Ghaniyul Amri Caulava* |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Konsumsi barang di kalangan mahasiswa, khususnya mahasiswa ITB, memiliki karakteristik siklus pakai yang pendek namun frekuensi pembelian yang tinggi. Contoh nyatanya seperti jas praktikum dan alat lab yang hanya relevan selama masa perkuliahan tertentu, buku mata kuliah yang menumpuk begitu semester berakhir, kalkulator scientific, hingga perlengkapan kos yang sering ditinggalkan atau dibuang saat mahasiswa pindah kos maupun lulus. Barang-barang ini secara fisik masih layak pakai, namun kehilangan relevansi penggunaan bagi pemiliknya dalam waktu yang cukup singkat.

Pola konsumsi seperti ini sejalan dengan isu global yang diangkat dalam Sustainable Development Goals (SDG) 12: Responsible Consumption and Production, khususnya target 12.5 yang menekankan pengurangan timbulan limbah melalui pencegahan, pengurangan, daur ulang, dan penggunaan kembali (reuse). Di tingkat nasional, permasalahan ini terkonfirmasi oleh data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) KLHK, yang menunjukkan bahwa limbah kain atau tekstil menyumbang sekitar 2,6% dari total timbulan sampah nasional, sementara limbah kertas dan karton  menyumbang angka yang lebih besar, yakni 10,7%. Angka ini merepresentasikan jutaan ton barang yang sebenarnya memiliki potensi sirkularitas tinggi. Sebagian besar dari barang-barang tersebut secara fungsi masih sangat layak dipakai ulang, namun berakhir di tempat pembuangan semata-mata karena ketiadaan ekosistem perpindahan kepemilikan yang efektif kepada mereka yang membutuhkan.

Urgensi masalah ini terletak pada dua sisi. Di sisi lingkungan, barang yang tidak di-reuse berkontribusi pada limbah dan mendorong produksi barang baru yang tidak perlu. Lalu pada sisi ekonomi mahasiswa, banyak barang bernilai justru dibiarkan menumpuk atau dibuang padahal bisa dijual atau dipakai ulang oleh mahasiswa lain yang justru hanya membutuhkan versi bekas dengan harga yang lebih terjangkau.

**Bukti Permasalahan.** Untuk memastikan masalah ini bukan sekadar asumsi, kami melakukan wawancara singkat secara informal dengan beberapa adik kelas mahasiswa TPB ITB. Dari wawancara tersebut, mereka menyampaikan bahwa kebutuhan seperti buku Mafiki, jas praktikum, dan kalkulator scientific merupakan barang yang wajib dimiliki di awal masa perkuliahan namun harganya cukup memberatkan bila dibeli baru. Mereka mengaku berharap dapat memperoleh barang-barang tersebut dalam kondisi bekas layak pakai dengan harga yang lebih murah dari mahasiswa tingkat atas yang sudah tidak memakainya lagi, namun kesulitan menemukan penjual karena tidak ada wadah khusus yang mempertemukan kebutuhan mereka dengan mahasiswa yang ingin melepas barang tersebut. Temuan ini menguatkan bahwa kebutuhan akan platform preloved yang terpusat dan dikhususkan untuk lingkungan ITB memang dirasakan langsung oleh calon pengguna, bukan hanya berdasarkan observasi tim.

## 1.2 Analisis Kondisi Saat Ini
Saat ini, transaksi jual beli barang preloved di kalangan mahasiswa ITB umumnya berlangsung secara informal melalui grup WhatsApp atau Line per angkatan atau himpunan, story Instagram pribadi, atau marketplace umum yang tidak dikhususkan untuk lingkungan ITB.

Beberapa celah dari kondisi ini:
- **Fragmentasi informasi**: listing barang tersebar di puluhan grup berbeda tanpa sistem pencarian terpusat, sehingga calon pembeli sulit menemukan barang yang dicari dan penjual sulit menjangkau pembeli potensial di luar lingkaran pertemanannya.
- **Minim kepercayaan**: tidak ada sistem verifikasi identitas atau riwayat transaksi, sehingga rawan penipuan atau miskomunikasi harga ataupun kondisi barang.
- **Tidak ada kategori/filter khusus kebutuhan kampus**: marketplace umum tidak punya kategori seperti "jas praktikum", "buku mata kuliahtertentu", atau "perlengkapan kos", membuat pencarian barang relevan-kampus menjadi tidak efisien dan lebih susah.
- **Proses transaksi manual**: nego harga, kesepakatan COD, dan konfirmasi dilakukan manual via chat pribadi tanpa histori atau standar yang jelas, memperlambat proses dan meningkatkan risiko miskomunikasi.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
**ITBELI** adalah platform marketplace barang preloved yang dikhususkan untuk civitas akademika ITB. Perangkat lunak ini dirancang sebagai satu kanal terpusat yang mempertemukan mahasiswa yang ingin melepas barang bekas layak pakai dengan mahasiswa lain yang membutuhkannya, sehingga perpindahan kepemilikan barang yang selama ini terjadi secara informal dan tersebar dapat berlangsung di dalam satu ekosistem yang terstruktur, dapat ditelusuri, dan lebih terpercaya.

### 2.1.1 Gambaran Umum Solusi dari Sudut Pandang Pengguna
Dari sudut pandang penjual, ITBELI adalah tempat untuk mengubah barang yang sudah kehilangan relevansi pakai menjadi sesuatu yang masih bernilai. Seorang mahasiswa yang baru saja menyelesaikan mata kuliah dengan praktikum cukup membuka platform, mengunggah foto jas praktikumnya, mengisi deskripsi kondisi barang, menentukan harga, dan memilih kategori yang sesuai. Sejak listing tersebut dipublikasikan, barang itu langsung dapat ditemukan oleh seluruh mahasiswa ITB yang sedang mencari barang serupa, tanpa perlu bergantung pada jangkauan grup angkatan atau lingkaran pertemanan penjual. Ketika barang sudah terjual, penjual menandai listing-nya sebagai terjual sehingga tidak lagi muncul di hasil pencarian dan tidak menimbulkan kesalahpahaman bagi calon pembeli lain.

Dari sudut pandang pembeli, ITBELI berperan sebagai satu titik pencarian tunggal untuk kebutuhan perkuliahan dan kehidupan kampus. Mahasiswa baru yang membutuhkan jas praktikum, buku mata kuliah, kalkulator, atau perlengkapan kos tidak perlu lagi menyisir puluhan grup percakapan dan story Instagram satu per satu. Pembeli cukup melakukan pencarian berdasarkan nama barang, kategori, ataupun rentang harga, kemudian membuka detail listing untuk melihat foto dan kondisi barang. Bila tertarik, pembeli dapat langsung menghubungi penjual melalui fitur percakapan di dalam platform untuk bernegosiasi harga serta menyepakati waktu dan titik temu COD, seluruhnya tanpa perlu berpindah ke aplikasi lain.

Dari sudut pandang admin, ITBELI menyediakan sarana untuk menjaga kesehatan platform. Admin menerima dan meninjau laporan yang dikirimkan pengguna terhadap listing maupun akun yang bermasalah, lalu menindaklanjutinya dengan menghapus listing atau memblokir akun yang terbukti melanggar. Perlu ditegaskan bahwa kewenangan admin dibatasi pada objek yang dilaporkan dan tidak mencakup akses terhadap isi percakapan pribadi antarpengguna, sehingga fungsi moderasi tetap berjalan tanpa mengorbankan privasi pengguna.

Secara ringkas, dari sudut pandang seluruh pengguna, ITBELI mengubah proses jual beli preloved yang semula bersifat manual, tersebar, dan sangat bergantung pada relasi personal menjadi sebuah alur yang terpusat, dapat dicari, dan memiliki jejak yang jelas mulai dari publikasi listing, pencarian, negosiasi, hingga penandaan barang terjual.

### 2.1.2 Target Platform dan Alasan Pemilihannya
Perangkat lunak ini dikembangkan sebagai **aplikasi berbasis web (web application)** yang dapat diakses melalui peramban modern pada laptop, PC, tablet, maupun telepon genggam. Pemilihan platform ini didasari beberapa pertimbangan berikut.

- **Kesesuaian dengan pola penggunaan pengguna.** Aktivitas jual beli preloved bersifat spontan dan sering muncul di sela-sela kegiatan kuliah, misalnya ketika mahasiswa teringat untuk mencari buku sebelum kelas dimulai. Aplikasi web dapat diakses langsung melalui tautan tanpa proses instalasi maupun pembaruan berkala, sehingga hambatan awal bagi pengguna baru menjadi jauh lebih kecil dibandingkan aplikasi desktop yang harus diunduh dan dipasang terlebih dahulu.
- **Aksesibilitas lintas perangkat.** Asumsi pada subbab 2.2 menyatakan bahwa pengguna dapat mengakses sistem melalui berbagai jenis perangkat. Aplikasi web dengan tampilan responsif memenuhi asumsi ini melalui satu basis kode yang sama, sedangkan aplikasi desktop akan membatasi akses hanya pada laptop atau PC dan aplikasi mobile native menuntut pengembangan terpisah untuk setiap sistem operasi.
- **Kemudahan verifikasi identitas kampus.** Kebutuhan US-01 mensyaratkan pendaftaran menggunakan surel berdomain @itb.ac.id. Alur verifikasi berbasis surel maupun potensi integrasi SSO kampus di kemudian hari jauh lebih mudah diimplementasikan pada arsitektur web karena keduanya memang berjalan di atas protokol dan alur autentikasi berbasis peramban.
- **Sifat data yang terpusat dan selalu berubah.** Status ketersediaan barang, listing baru, dan pesan percakapan merupakan data yang harus konsisten bagi seluruh pengguna secara bersamaan. Arsitektur klien-server pada aplikasi web menjamin setiap pengguna selalu melihat kondisi data terbaru dari satu sumber yang sama, tanpa perlu mekanisme sinkronisasi tambahan seperti pada aplikasi yang menyimpan data secara lokal.
- **Kesesuaian dengan batasan sumber daya pengembangan.** Sebagaimana disebutkan pada batasan di subbab 2.2, durasi pengerjaan tergolong singkat. Pengembangan berbasis web memungkinkan tim memakai satu basis kode untuk seluruh perangkat serta melakukan deployment dan perbaikan bug secara terpusat, sehingga waktu pengembangan yang terbatas dapat difokuskan pada kematangan fitur inti alih-alih pada distribusi aplikasi ke berbagai platform.

Pemilihan aplikasi web ditetapkan sebagai target platform untuk cakupan pengerjaan tugas besar ini, bukan sebagai bentuk akhir dari produk. Dalam jangka panjang, tim memandang **aplikasi mobile native** sebagai arah pengembangan lanjutan yang paling relevan, mengingat sebagian besar aktivitas mahasiswa saat ini berlangsung melalui telepon genggam. Rencana pengembangan tersebut dipandang sebagai roadmap dengan tahapan berikut.

- **Tahap pertama, penguatan pengalaman mobile pada basis web.** Antarmuka web dioptimalkan lebih jauh untuk layar kecil dan dikembangkan menjadi *Progressive Web App* (PWA) sehingga dapat dipasang di layar utama perangkat serta memiliki dukungan akses luring terbatas. Tahap ini memberikan sebagian besar kenyamanan aplikasi mobile tanpa perlu membangun basis kode baru.
- **Tahap kedua, pengembangan aplikasi mobile native.** Aplikasi untuk Android dan iOS dibangun di atas layanan backend serta basis data yang sama dengan versi web, sehingga tidak ada duplikasi data maupun logika bisnis. Pada tahap ini dapat dimanfaatkan kemampuan khas perangkat mobile yang sulit dicapai peramban, seperti notifikasi *push* saat ada pesan atau listing baru pada kategori yang diikuti pengguna, pengunggahan foto barang langsung dari kamera, serta bantuan penentuan titik temu COD berbasis lokasi.
- **Tahap ketiga, integrasi dengan ekosistem kampus.** Setelah basis pengguna terbentuk, aplikasi dapat diarahkan pada integrasi yang lebih dalam dengan layanan kampus, misalnya autentikasi melalui SSO ITB secara penuh maupun keterhubungan dengan kanal informasi kemahasiswaan.

Perlu ditegaskan bahwa seluruh tahapan di atas berada **di luar cakupan pengerjaan tugas besar ini** dan tidak menjadi bagian dari kebutuhan yang akan diimplementasikan. Rencana tersebut dicantumkan untuk menunjukkan bahwa keputusan memilih aplikasi web merupakan pilihan yang sadar akan arah pertumbuhan produk, sekaligus memastikan arsitektur yang dibangun sejak awal tidak menutup kemungkinan perluasan ke platform lain di kemudian hari.

### 2.1.3 Nilai Unik dan Inovasi Inti
Nilai unik ITBELI terletak pada keputusan untuk mempersempit cakupan pengguna secara sengaja, kemudian memanfaatkan kesempitan cakupan tersebut untuk menghadirkan pengalaman yang tidak mungkin diberikan oleh marketplace umum.

1. **Komunitas tertutup dan terverifikasi melalui identitas kampus.** Pendaftaran hanya dapat dilakukan dengan surel berdomain @itb.ac.id, sehingga setiap pihak dalam transaksi berada dalam satu komunitas yang identitasnya dapat dipertanggungjawabkan. Mekanisme ini menjawab langsung celah minimnya kepercayaan pada subbab 1.2, karena risiko penipuan oleh akun anonim ditekan sejak titik masuk sistem, bukan sekadar ditangani setelah kerugian terjadi.
2. **Taksonomi kategori yang dirancang mengikuti kebutuhan perkuliahan.** Kategori dan filter pada ITBELI disusun berdasarkan realitas kebutuhan mahasiswa ITB, seperti jas praktikum, buku mata kuliah tertentu, alat laboratorium, kalkulator, jaket himpunan, dan perlengkapan kos. Struktur kategori semacam ini tidak tersedia pada marketplace umum yang taksonominya dirancang untuk pasar ritel nasional, sehingga pencarian barang relevan kampus di ITBELI menjadi jauh lebih presisi.
3. **Negosiasi dan kesepakatan dalam satu alur di dalam platform.** Fitur percakapan internal membuat proses tawar-menawar harga serta penentuan waktu dan titik temu COD berlangsung tanpa keluar dari sistem. Riwayat kesepakatan tersimpan pada satu tempat sehingga mengurangi risiko miskomunikasi yang selama ini muncul akibat kesepakatan yang berserak di chat pribadi lintas aplikasi.
4. **Privasi percakapan yang dijamin secara desain.** Sesuai kebutuhan US-05, isi percakapan antarpengguna tidak dapat diakses oleh admin. Moderasi dijalankan berbasis laporan pengguna terhadap listing atau akun, bukan melalui pengawasan menyeluruh terhadap komunikasi. Kombinasi antara komunitas terverifikasi dan percakapan yang tertutup ini menjadi pembeda yang cukup jarang ditawarkan platform sejenis.
5. **Model transaksi COD yang memanfaatkan kedekatan geografis kampus.** Karena seluruh pengguna berada dalam satu lingkungan kampus, serah terima barang dapat dilakukan langsung di titik-titik yang sudah dikenal bersama. Pembeli dapat memeriksa kondisi barang sebelum membayar, sementara biaya dan risiko pengiriman jarak jauh sepenuhnya hilang dari persamaan.
6. **Kontribusi terhadap sirkularitas barang di lingkungan kampus.** Setiap transaksi yang berhasil berarti satu barang layak pakai yang tidak berakhir sebagai limbah dan satu kebutuhan yang terpenuhi tanpa produksi barang baru. Nilai ini menjadikan ITBELI bukan sekadar alat bantu transaksi, melainkan juga instrumen konkret yang menjawab isu SDG 12 pada skala lingkungan kampus sebagaimana diuraikan pada subbab 1.1.

### 2.1.4 Perbandingan dengan Solusi yang Sudah Ada
Untuk memperjelas posisi ITBELI, tabel berikut membandingkannya dengan dua kanal yang saat ini digunakan mahasiswa ITB untuk bertransaksi barang preloved.

| Aspek | Grup WhatsApp/Line dan Story Instagram | Marketplace Umum (Shopee, Tokopedia, Carousell) | ITBELI |
| :--- | :--- | :--- | :--- |
| Cakupan pengguna | Terbatas pada anggota grup atau lingkaran pertemanan | Sangat luas, seluruh pengguna publik | Seluruh civitas ITB yang terverifikasi |
| Pencarian barang | Tidak ada, harus menyisir percakapan secara manual | Tersedia, namun bercampur dengan jutaan produk baru | Terpusat dengan filter kategori khas kebutuhan kampus |
| Kepercayaan identitas | Bergantung pada kenal atau tidaknya kedua pihak | Anonim, bertumpu pada sistem rating dan escrow platform | Terjamin melalui verifikasi surel @itb.ac.id |
| Riwayat kesepakatan | Berserak di chat pribadi lintas aplikasi | Tersimpan, namun terikat pada alur pembayaran platform | Tersimpan dalam percakapan internal yang bersifat privat |
| Status ketersediaan barang | Tidak jelas, sering menimbulkan pertanyaan berulang | Otomatis mengikuti stok penjual | Ditandai eksplisit oleh penjual dan hilang dari pencarian |
| Serah terima barang | COD informal tanpa standar yang jelas | Umumnya melalui pengiriman berbiaya tambahan | COD di titik temu kampus yang mudah dijangkau |

Marketplace umum unggul dalam kelengkapan fitur, tetapi keunggulan itu dirancang untuk transaksi antarpihak yang saling asing dan berjauhan secara geografis, sehingga membawa serta biaya pengiriman, alur pembayaran berlapis, dan hasil pencarian yang didominasi produk baru. Kanal informal unggul dalam kecepatan dan kedekatan sosial, tetapi tidak memiliki kemampuan pencarian, jangkauan, maupun jejak transaksi. ITBELI mengambil posisi di antara keduanya, yaitu kedekatan sosial dan kemudahan COD khas kanal informal, dipadukan dengan kemampuan pencarian, verifikasi identitas, dan keterlacakan status yang selama ini hanya dimiliki platform formal.

## 2.2 Asumsi dan Batasan
### 2.2.1 Asumsi dari sisi pengguna
1. **Tingkat Kemampuan**
- Pengguna diasumsikan sudah terbiasa dalam mengoperasikan situs web marketplace standar seperti login menggunakan *email*, pengisian formuliur dan deskripsi barang, serta proses mengunggah foto/gambar.
- Pengguna diasumsikan terbiasa dan familiar dengan praktek jual beli COD(Cash on Delivery) secara langsung tanpa melalui perantara sistem pembayaran digital seperti *Bank* atau *e money*.
2. **Perangkat dan/atau Infrastruktur Pengguna**
- Pengguna diasumsikan memiliki perangkat modern seperti handphone, tablet, laptop, dan PC.
- Pengguna diasumsikan memiliki koneksi internet yang stabil untuk mengakses laman pencarian dan katalog, mengunggah foto produk, dan melakukan komunikasi chat melalui platform.
3. **Perilaku Pengguna**
- Pengguna merupakan mahasiswa aktif ITB yang memiliki akun dengan domain @itb.ac.id untuk melakukan proses registrasi, verifikasi, dan *login*.
- Pengguna memberikan deskripsi dari barang yang valid dan sesuai dengan kondisi yang sebenarnya meliputi kondisi, spesifikasi, harga, dan juga foto.
- Penjual dan pembeli diasumsikan bersedia dan kooperatif dalam menyepakati waktu, lokasi, serta harga dan metode serah terima barang secara COD diluar dari sistem.
- Penjual dan pembeli bertanggung jawab penuh atas proses transaksi yang terjadi secara langsung, karena sistem dan pengembang tidak akan bertanggung jawab.

### 2.2.2 Asumsi dari Sisi Pengerjaan Teknis Perangkat Lunak
- Media penyimpanan baik *local* maupun *cloud* diasumsikan memiliki kapasitas yang besar dan mencukupi untuk mendukung semua permintaan dari pengguna.
- Sistem verifikasi email dengan menggunakan domain @itb.ac.id diasumsikan dapat berjalan dengan baik untuk memastikan bahwa pengguna merupakan mahasiswa aktif ITB.
- Sistem diasumsikan dapat beroperasi dengan kapasitas yang wajar dengab menggunakan satu server tunggal tanpa perlu melakukan konfigurasi yang lebih rumit.
- Proses autentikasi diasumsikan dapat berjalan dengan konsisten dalam memvalidasi token pengguna sehingga risiko pembajakan akun dapat diminimalisir.
- Data kredensial dari pengguna diasumsikan telahy mengalami enkripsi selama proses pengiriman dari pengguna menuju server.

### 2.2.3 Batasan dan Ruang Lingkup

1. **Batasan Regulasi/Hukum**
- Sistem wajib menjaga privasi data pengguna, kredensial akun, dan riwayat komunikasi antar pengguna, agar supaya tidak tersebar ke pihak luar tanpa izin yang sah.
- Peran dari sistem hanya terbatas sebagai penghubung antara penjual dan pembeli (mahasiswa aktif ITB)tanpa memiliki tanggung jawab terhadap keaslian dan kondisi atas barang yang ditawarkan.

2. **Keteratasan Sumber Daya**
- Kurangnya anggaran yang diberikan dalam proses pengembangan.
- Durasi pengembangan yang singkat dan kurang *flexible karena ada perkuliahan lain.
- Keterbatasan jumlah anggota dalam proses pengembangan.

3. **Ruang Lingkup Solusi**
- Cakupan dalam pengguna sistem ini terbatas hanya pada mahasiswa aktif ITB dengan pembatasan melalui proses verifikasi email berdomain @itb.ac.id.
- Layanan *customer service* tidak tersedia secara *real time* 24 jam, melainkan hanya melalui formulir pelaporan atau *report*.
- Fitur komunikasi antar pengguna hanya sebatas teks tanpa mendukung komunikasi melalui video maupun panggilan suara.
- Sistem tidak mendukung pembayaran secara  digital maupun sebagai perantara transaksi keuangan. Seluruh proses pembayaran dan serah terima barang sepenuhnya menjadi tanggung jawab pembeli dan penjual.
---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
| Aktor | Deskripsi |
| :--- | :--- |
| Penjual (Mahasiswa ITB) | Pengguna yang berniat untuk menjual barang preloved miliknya. Mengutamakan kemudahan proses listing, jangkauan listing kepada pembeli, dan reliabilitas sistem. |
| Pembeli (Mahasiswa ITB) | Pengguna yang berniat untuk membeli barang preloved. Mengutamakan keamanan transaksi, pencarian yang jelas dan informasi yang jelas, dan reliabilitas sistem. |
| Admin | Pihak yang mengelola platform. Mengutamakan reliabilitas sistem, kemudahan untuk tracking masalah atau bug, sistem report/laporan yang mudah diverifikasi dan ditangani. |

## 3.2 Kebutuhan Pengguna Awal
Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | Penjual/Pembeli |  Mendaftar menggunakan email ITB | Hanya warga ITB yang dapat mendaftar dan memiliki informasi yang jelas sehingga menambahkan rasa keamanan |
| US-02 | Penjual | Membuat listing barang | Barang dapat ditunjukkan kepada calon pembeli. |
| US-03 | Pembeli | Mencari barang yang diinginkan berdasarkan nama, harga, kategori, dll. | Pembeli dapat mencari barang sesuai yang diinginkan dengan mudah. |
| US-04 | Penjual/Pembeli | Berkomunikasi dengan penjual/pembeli. | Penjual dan pembeli dapat bernegosiasi dan menyepakati transaksi tanpa keluar platform. |
| US-05 | Penjual/Pembeli | Sistem komunikasi yang aman dan tidak dapat dilihat oleh admin. | Menjaga privasi pengguna platform. |
| US-06 | Penjual | Menandai barang sudah terjual | Listing tidak lagi muncul di pencarian pembeli dan menghindari kesalahpahaman |
| US-07 | Admin | Melihat laporan masalah dari pengguna | Menjaga kualitas dan keamanan platform |
| US-08 | Admin | Memblokir atau menghapus listing dan akun yang dilaporkan bermasalah | Menjaga kualitas dan keamanan platform |


## 3.3 Deskripsi Aktivitas

| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | Mendaftar atau login menggunakan akun ITB | Pelanggan dan pembeli hanya bisa menggunakan akun dengan domain itb.ac.id | US-01 |
| A02 | Membuat listing barang yang ingin dijual | Penjual membuat listing barang yang nantinya akan ditunjukkan oleh sistem kepada calon pembeli | US-02|
| A03 | Mencari barang yang diinginkan berdasarkan nama, harga, kategori, dan sebagainya | Pembeli mencari barang berdasarkan kategori yang diinginkan dan sistem akan menunjukkan sesuai yang diminta | US-03 |
| A04 | Komunikasi antara penjual dan pembeli | Pembeli dan penjual melakukan negosiasi dalam chat sebelum melakukan COD barang yang diinginkan | US-04 |
| A05 | Sistem komunikasi yang aman antara penjual dan pembeli yang tidak bisa dilihat oleh admin | Menjaga privasi dari komunikasi antara penjual dan pembeli | US-05 |
| A06 | Menandai barang sudah terjual | Sistem tidak akan menampilkan kembali list barang yang sudah dilabeli terjual sehingga menghindari kesalahpahaman | US-06 |
| A07 | Melihat laporan masalah dari pengguna | Admin menerima laporan masalah dari pengguna untuk menjaga kualitas dari platform | US-07 |
| A08 | Memblokir atau menghapus listing barang dan akun yang dilaporkan masalah | Admin dapat melakukan pemblokiran setelah menerima laporan dan telah memverifikasinya | US-08 |

## 3.4 Model Proses Bisnis

<p align="center">
<img src="https://uml.planttext.com/plantuml/png/dLHDQzj04BthLmm-f1QaEDy9pQ5nsqiX9W6vXnudqSeQxuV4VZG4_ECxgrsh1bSK2i8hQsVUlFTcTX-SH-k3LiNkMPXjG0Np5RReoBqXV5z_ANV5459yMWbJOyFlYyTkGmPgOJPe06KmCH3coxDpMC2FwkFPUNaVu_LBG0-Ad2UpWHUqo0k7NUIm2muhTXNl2xqR2hoJxXdp1BGmg7jIalzbW1Zxp9X2qJ77_s1dNj7I0QlBl7rvn6fa4cigw5CgcdynqgIetLUeEV-rPJ-ur5KkTNLiWAW9Owajgc11TZeOaWmCgFahvrxdtEkiGjZWOa8l7FzA0RcFYTn4IrCYQSnfaPnc9QZGJR2S5Fe1AZ8UfOCPDJEeewTls08PWivt6ZsvsCyjnYsXU4iA7thq1JLSfsUzBLGYhXw-FdtxN89l1OlzYQVmYD7iiW1WpehRcRHQTYpm6uV3_Abf51d1D07ucPOzW8p2MUvxx0sFcnCMsuYScdMV8v5dQXoHMHLg9heMDeBFeaCtsQ6RiVI-bob_qvBYr3_0R3JFtC400JZVzKKXb1CmNrEDyXIMDS8A7JUZBPEU2UkpANrdOmcTKeQPNuo7vc-yaWEfwLP8r320948nV5bhCdjyYlEG0yOYhFusgxyjir_w5mCtQLmF08URG7MIx6Bm1FlWnblX91rHXhlBS7TJPWhfX0oEXjODU0SEyl6dfdZWXI-ptm00" alt="Activity Diagram Proses Bisnis" width="1000">

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
- Data timbulan sampah tekstil (2,6%) dan sampah kertas/karton (10,7%) nasional: Sistem Informasi Pengelolaan Sampah Nasional (SIPSN), Kementerian Lingkungan Hidup dan Kehutanan (KLHK) - https://sipsn.menlhk.go.id/sipsn/public/data/timbulan
- SDG 12.5 (Responsible Consumption and Production - reduce waste generation through prevention, reduction, recycling and reuse): United Nations, Sustainable Development Goals - https://sdgs.un.org/goals/goal12