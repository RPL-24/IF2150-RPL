<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## PeerUP

### Untuk: _[Nama Asisten]_

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | _\[Kelas\]_ |
| Kelompok | _\[Nomor Kelompok\]_ |

| NIM      | Nama                            |
| -------- | ------------------------------- |
| 13525049 | Hugo Daniel Johansen Napitupulu |
| 13525001 | Matthew Allen Reynaldo          |
| 13525010 | Fabian Amzar Susanto            |
| 13525025 | David Christian                 |
| 13525028 | Markus Christiano Simanjutak    |

---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah

Pencapaian Sustainable Development Goals (SDGs) Nomor 4: Pendidikan Bermutu memiliki target untuk memastikan pendidikan yang inklusif dan merata, serta mendorong kesempatan belajar sepanjang hayat bagi semua orang. Namun, realitas pendidikan di Indonesia, khususnya bagi siswa dan mahasiswa yang mempersiapkan ujian penting seperti Tes Kemampuan Akademik (TKA), Ujian Tulis Berbasis Komputer (UTBK), dan ujian akhir, masih penuh dengan ketimpangan baik dari sisi infrastruktur maupun kesempatan. Bimbingan di luar institusi akademik biasanya membutuhkan biaya yang besar, sehingga siswa-siswi biasanya segan ataupun sulit mendapat akses diskusi dan bimbingan belajar, terutama pelajar kalangan ekonomi menengah ke bawah.

Di zaman di mana teknologi memarak kemana-mana, masalah ini diperparah oleh isolasi sosial. Banyak pelajar di tingkat pendidikan tinggi terus belajar sendirian karena mereka sering mempersepsikan pemeringkatan kelas sebagai kompetisi saling mengalahkan. Padahal, diskusi dan kolaborasi berbasis hubungan pertemanan dan interaksi sosial terbukti secara signifikan meningkatkan performa tim dalam menyelesaikan masalah atau tugas-tugas yang kompleks.

Pendekatan learning-by-teaching telah diakui dapat meningkatkan penyerapan materi pelajaran dan memperkuat relasi sosial antar-pelajar. Studi terbaru tentang program study buddy membuktikan bahwa kolaborasi antara pelajar yang nilainya di atas rata-rata (bertindak sebagai mentor) dan pelajar di bawah rata-rata (bertindak sebagai protégé) memberikan manfaat peningkatan nilai akademik yang sama besarnya bagi kedua belah pihak. Oleh karena itu, terdapat urgensi yang tinggi untuk menyediakan sebuah ekosistem digital gratis yang meruntuhkan batasan-batasan ini, memfasilitasi pelajar untuk menemukan study buddy yang tepat demi kesuksesan akademik bersama.

## 1.2 Analisis Kondisi Saat Ini

Di zaman yang sangat maju ini, para pelajar memiliki banyak metode yang dapat mereka pakai untuk belajar. Berikut adalah beberapa situasi metode pembelajaran yang paling sering digunakan oleh para pelajar di zaman sekarang.

# 1.2.1 Ketergantungan pada Kecerdasan Buatan (AI)
Banyak pelajar kini memanfaatkan AI berbayar maupun gratis sebagai tutor pribadi mereka. Sebenarnya, pemanfaatan AI sebagai tutor belajar itu sangat bagus karena teknologi ini membuat para pelajar memiliki tutor pribadi pintar yang mudah digunakan, dapat dipakai siapa saja, dan relatif murah. 

Akan tetapi, hal ini juga menimbulkan sebuah gap yang kritis. Berinteraksi secara eksklusif dengan mesin menghilangkan komponen interaksi sosial dan bahasa tubuh yang krusial untuk melancarkan komunikasi kognitif antarmanusia. Selain itu, belajar dengan AI tidak memberikan kesempatan kepada pengguna untuk merasakan "efek protégé", yaitu dorongan motivasi dan retensi memori tingkat tinggi yang hanya didapatkan ketika seseorang berusaha keras menjelaskan sebuah konsep kepada orang lain.

# 1.2.2 Platform EdTech Berbasis Subskripsi
Solusi seperti platform EdTech (Skuling, Pahamify, atau Zenius) menggunakan model bisnis berlangganan yang diskriminatif secara ekonomi yang membuat para pelajar dengan anggaran yang terbatas sulit untuk mengakses platform-platform ini. Sistem ini juga lebih banyak berjalan satu arah. Hal ini juga berarti para pelajar tidak mendapatkan koneksi ataupun sosialisasi yang cukup untuk memaksimalkan potensi dan pembelajaran mereka. Metode belajar ini gagal mewadahi kebutuhan pelajar yang membutuhkan komunikasi dua arah secara real-time dengan tutor ataupun teman sebaya.

# 1.2.3 Pencarian Teman Belajar secara Manual
Pelajar sering mencari teman belajar secara acak di media sosial, mau itu dari group WhatsApp, Line, ataupun saat diajak. Situasi ini sangat bagus karena mendorong interaksi yang natural dan mendorong kolaborasi yang memang disetujui dan diinginkan oleh semua orang yang terlibat dalam kelompok belajarnya. Akan tetapi, kondisi semacam ini memiliki gap yang cukup besar juga. Banyak pelajar yang memiliki kesulitan dalam bertemu dan berbicara dengan orang baru, mau itu untuk berkomunikasi maupun untuk membuat kelompok belajar. Hal ini diperparah lagi dengan maraknya digitalisasi dan kecanduan sosial media yang dapat menghambat kemampuan sosialisasi para pelajar dan membuat mereka terisolasi dari dunia nyata. Gap-nya juga terletak pada tidak adanya struktur atau sistem pencarian grup belajar yang jelas. Sering kali jadwal mereka berbenturan atau mereka terjebak pada kelompok yang tingkat pemahamannya sama-sama rendah, sehingga tidak terjadi transfer ilmu dari sosok mentor ke protégé.

# Kesenjangan yang Akan Diselesaikan:
Perangkat lunak yang kami kembangkan hadir untuk membantu mengisi celah ini melalui platform matching study group. Platform ini bertindak seperti fasilitator otomatis yang mencocokkan pengguna berdasarkan metrik yang jelas: tingkat penguasaan materi, ketersediaan waktu, dan topik/pelajaran yang ingin didiskusikan. Dengan memfasilitasi terbentuknya kelompok belajar yang lebih jelas dan terstruktur, aplikasi ini menghadirkan solusi berbiaya rendah dan terukur untuk meningkatkan pengalaman pendidikan pelajar.



---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak

Sebuah bot pemantau otomatis dengan UI desktop application yang dirancang untuk membantu investigator untuk mendeteksi perdagangan satwa liar ilegal di internet secara otomatis.

Dari POV user, bot bekerja dengan melakukan web-scraping di medsos dan e-commerce untuk menganalisis gambar, serta mengekstrak informasi dari satwa tanpa pencarian manual. Platform desktop dipilih agar memudahkan user dengan memberikan UI yang mudah dimanfaatkan

Nilai inovasi:

1. NLP dilatih dengan slang/kode lokal Indonesia.

## 2.2 Asumsi dan Batasan

Asumsi:
1. Hewan dan/atau satwa langka diperjual-belikan di internet/e-commerce.

Batasan:
1. Hanya mencakup transaksi ilegal yang terjadi di Indonesia.
2. Hanya mengambil dan mengelola informasi berbasis teks atau data, bukan gambar.
3. Kelompok ini tidak memiliki wewenang hukum untuk melakukan penangkapan atau agen penyamar yang dapat     membahayakan keselamatan pribadi ataupun melanggar hukum.


---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor   | Deskripsi                                                                                                                                                                                                                         |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Kasir_ | _Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi._ |
| ...     | ...                                                                                                                                                                                                                               |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Kasir_        | _Memindai barcode barang_ | _Proses pembayaran berjalan cepat dan akurat_ |
| US-02 | _[Nama Aktor]_ | _[Kebutuhan pengguna]_    | _[Tujuan yang dicapai pengguna]_              |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Model Proses Bisnis

Buatlah _Activity Diagram_ atau _Swimlane Diagram_ yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
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
