<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *Pross*

### Untuk: *Stefani Angeline Oroh*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K2* |
| Kelompok | *07*  |

| NIM | Nama |
|---|---|
| *13525002* | *Ahmad Boutros Fathir* |
| *13525020* | *Klio Lysander* |
| *13525047* | *Muhammad Fakhriyan Rizki M.* |
| *13525053* | *Kevin Sie* |
| *13525062* | *Rafel Dzinun Muhammad* |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Usaha Mikro, Kecil, dan Menengah (UMKM) yang berada pada sektor kuliner menjadi salah satu penggerak utama dalam perekonomian di Indonesia dan dapat berkontribusi langsung terhadap SDG yang ke-8 yaitu "Decent Work and Economic Growth". Yang menjadi masalah adalah banyak pedagang UMKM kuliner menjalani usaha tanpa menghitung biaya produksi yang jelas. Padahal harga bahan baku itu fluktuatif dan bisa berubah dalam hitungan minggu, hari, ataupun kondisi pasar. Salah satu contohnya adalah data CNBC Indonesia yang menunjukkan harga bawang merah sempat melonjak cukup tinggi dari harga Rp 34.600/kg di akhir Oktober 2024 menjadi Rp 42.450/kg pada akhir November 2024. Banyak pedagang yang menetapkan harga jual sementara biaya produksi terus meningkat, yang lama-lama dapat menyebabkan kerugian produk tanpa disadari. Apalagi jika pedagang menjual banyak produk, terkadang pemilik usaha tidak mengetahui produk mana yang beneran untung dan rugi. Masalah ini perlu diselesaikan karena dapat berdampak langsung pada keberlangsungan usahanya. Oleh karena itu, diperlukan suatu alat pemantauan bagi para pelaku usaha yang terus menjalani kondisi rugi pada beberapa produk tanpa disadari.

## 1.2 Analisis Kondisi Saat Ini
Kondisi yang terjadi sekarang menunjukkan bahwa para pedagang UMKM kuliner masih menentukan harga dan memantau keuntungan atau kerugian dengan cara manual. Harga jual ditentukan di awal berdasarkan perkiraan kasar harga biaya bahan baku saat itu tanpa ada evaluasi dan perhitungan mendalam. Pencatatan harga bahan baku juga tidak terdokumentasi dengan baik, bahkan pedagang biasanya hanya mengandalkan ingatan saja sehingga menjadi susah untuk mengecek biaya produksi secara berkala. Perhitungan HPP per produk juga biasanya tidak pernah dilakukan secara terpisah karena pedagang langsung membeli bahan baku untuk semua produk sekaligus. Perhitungan untung atau rugi baru dilakukan di akhir periode dan tidak menganalisis margin per produk.

Dari permasalahan ini, terdapat alasan yang menjadi dasar pengembangan proyek perangkat lunak ini, yang dapat dirincikan menjadi:

1. Belum ada sistem yang menghubungkan perubahan harga bahan baku langsung ke perhitungan biaya produksi tiap produk
2. Belum ada mekanisme yang memperingatkan kalau suatu produk sudah mulai masuk ke fase kerugian akibat kenaikan harga

Perangkat lunak inilah yang akan dikembangkan untuk menutupi permasalahan di atas.

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Perangkat lunak yang kami usulkan adalah aplikasi manajemen Harga Pokok Penjualan (HPP) berbasis mobile yang dirancang untuk pelaku UMKM. Solusi ini berfokus pada pemantauan keuntungan produk secara berkelanjutan yang disesuaikan dengan perubahan harga bahan baku di pasar. Pemilihan perangkat mobile dikarenakan mobilitas operasional pelaku UMKM, sehingga pembaruan harga dan pencatatan biaya akan lebih praktis diakses langsung melalui smartphone, bahkan saat mereka sedang di pasar sekalipun. Nilai unik dan inovasi inti dari aplikasi ini terletak pada otomatisasi analisis margin keuntungan. Pengguna dapat menginput daftar bahan baku beserta takaran spesifik untuk tiap porsi menu, lalu menetapkan harga jualnya. Sistem akan secara otomatis mengalkulasi margin keuntungan atau kerugian berdasarkan perbandingan dengan harga standar bahan baku. Sebagai bentuk pencegahan, aplikasi ini memiliki fitur Notifikasi Kerugian yang akan langsung memberikan peringatan apabila perubahan harga pasar menyebabkan suatu menu masuk ke fase rugi. Aplikasi juga menyediakan fitur grafik perubahan harga dari bahan baku, di mana pengguna dapat memantau tren pergerakan harga dari bahan baku yang relevan dengan usaha mereka. Selain itu, sistem dirancang untuk fleksibel dengan menyediakan opsi penyesuaian harga khusus untuk penjualan via platform makanan online (GoFood, GrabFood, atau ShopeeFood). Sistem tidak terintegrasi langsung dengan platform tersebut, perhitungan komisi aplikasi murni diinput secara manual oleh pengguna sebagai parameter tambahan untuk melihat proyeksi keuntungan akhir.

## 2.2 Asumsi dan Batasan
Asumsi Pengguna :

1. Pemilik UMKM memiliki smartphone yang memadai untuk menggunakan aplikasi.
2. Pemilik usaha memiliki takaran baku yang pasti untuk setiap produk yang dijual, sehingga kalkulasi biaya bahan dapat dimodelkan secara akurat oleh sistem.
3. Pengguna memiliki literasi digital dasar untuk melakukan input angka dan rutin memperbarui data harga beli bahan baku yang mereka temui di pasar.

Asumsi Teknis :

1. Terdapat koneksi internet yang memadai pada perangkat pengguna.

Batasan Hukum :

1. Aplikasi  mengumpulkan data profil usaha UMKM dan takaran resep pengguna, sehingga pengembangan harus sesuai dengan UU Nomor 27 tahun 2022 tentang perlindungan data pribadi. 

Batasan Sumber Daya :

1. Pengujian dan pengembangan aplikasi terbatas pada lingkungan localhost menggunakan dummy data, serta diuji pada smartphone pribadi milik anggota kelompok.

Batasan Ruang Lingkup Solusi :

1. Perhitungan batas untung/rugi difokuskan murni pada biaya variabel (bahan baku operasional). Aplikasi tidak mencatat fixed cost (biaya sewa tempat, listrik, atau gaji pegawai).
2. Perangkat lunak murni berfungsi sebagai alat pemantauan HPP dan peringatan kerugian, bukan yang memproses transaksi dengan pembeli atau mencetak struk.
3. Sistem tidak memiliki integrasi API dengan platform pihak ketiga manapun.
---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

| Aktor | Deskripsi |
| :--- | :--- |
| *Pemilik Usaha* | *Orang yang menjalankan usaha kuliner. dapat menginput kebutuhan bahan baku, memantau kerugian, dan melihat tren harga* |



## 3.2 Kebutuhan Pengguna Awal

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Pemilik Usaha* |  *Penginputan Takaran Bahan dan Harga Jual* | *Mengetahui apabila harga jual yang ditetapkan bersifat untung/rugi berdasarkan harga standar bahan baku* |
| US-02 | *Pemilik Usaha* | *Notifikasi Kerugian* | *Memberitahu pengguna apabila harga yang ditetapkan tidak lagi menguntungkan* |
| US-03 | *Pemilik Usaha* | *Data Perubahan Harga Bahan* | *Mengetahui tren perubahan harga yang terjadi pada bahan baku pada rentang waktu tertentu*  |

## 3.3 Deskripsi Aktivitas
| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | *Penginputan Takaran Bahan dan Harga Jual* | *Pengguna memasuki jumlah masing-masing bahan yang digunakan untuk pembuatan produk dan kemudian menentukan harga jual produk tersebut. Sistem kemudian akan menentukan apabila harga jual yang ditetapkan menguntungkan berdasarkan jumlah bahan baku dan harga standarnya.* | *US-01* |
| A02 | *Notifikasi Kerugian* | *Setelah menginput harga jual dan terverifikasi menguntungkan, sistem akan membiarkan harga tersebut digunakan oleh pengguna hingga di mana harga tersebut tidak lagi menguntungkan akibat adanya perubahan harga bahan baku.* | *US-02*|
| A03 | *Data Perubahan Harga Bahan* | *Dengan adanya fluktuasi harga bahan baku dalam jangka waktu yang konsisten, pengguna dapat mengakses data historis perubahan tersebut pada rentang waktu yang telah ditentukan.* | *US-03* |

## 3.4 Model Proses Bisnis
<br>

<p align="center">
<img alt="Diagram Activity Software" src="./assets/diagram/diagram-act-software-fix.png" width="100%">
</p>
<p align="center">
<i>Gambar 1. Diagram Activity Penggunaan Perangkat Lunak</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/ 
- Berita: https://www.cnbcindonesia.com/research/20241201162945-128-592495/harga-bawang-merah-bikin-menangis-inflasi-kembali-ganas
