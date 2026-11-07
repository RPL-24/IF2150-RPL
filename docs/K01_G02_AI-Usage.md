# Deklarasi Penggunaan AI

## Tugas Besar IF2150 - Rekayasa Perangkat Lunak

| Informasi | Keterangan |
|---|---|
| Kelas | *K1* |
| Nomor Kelompok | *2* |
| Nama Kelompok | *Indes A* |
| Nama Perangkat Lunak | *ITBELI* |

**Anggota Kelompok:**

| NIM | Nama |
|---|---|
| *13525124* | *Sulthan Dhiyazka Suwandi* |
| *13525034* | *Dhanesworo Muhammad Datiputro* |
| *13525115* | *Nazhif Hilmi Kistijantoro* |
| *13525121* | *I Made Adi Kusuma Ardana* |
| *13525106* | *Ghaniyul Amri Caulava* |

---

### Daftar Isi
* [Milestone 1](#milestone-1)
* Notes: Copy bagian Daftar Isi seperti Milestone 1 untuk Milestone berikutnya, contoh ``* [Milestone 2](#milestone-2)``. Ketika Daftar isi diklik maka akan langsung diarahkan ke bagian bawah sesuai dengan Milestone tujuan.

---

### Prinsip Penggunaan AI yang Dianut Kelompok

Sesuai ketentuan penggunaan AI pada mata kuliah ini, kelompok kami membatasi pemanfaatan AI hanya sampai pada tahap **membantu pemahaman konsep, penggalian ide, penyusunan kerangka (outline), eksplorasi alternatif dan pendekatan, serta permintaan contoh umum**. AI tidak digunakan untuk menghasilkan jawaban akhir maupun isi dokumen yang langsung disalin ke laporan.

Secara operasional, batas tersebut kami terapkan melalui aturan kerja berikut:

1. Setiap keluaran AI diperlakukan sebagai bahan diskusi, bukan sebagai naskah. Seluruh kalimat yang masuk ke dokumen ditulis ulang sendiri oleh anggota yang bertanggung jawab atas subbab tersebut.
2. Setiap gagasan yang berasal dari AI wajib diuji kembali terhadap konteks ITBELI dan terhadap isi bab lain sebelum dipakai, sehingga gagasan yang tidak relevan dibuang.
3. Keputusan substantif, misalnya penetapan target platform, pemilihan aktor, dan penentuan ruang lingkup sistem, sepenuhnya diambil melalui diskusi kelompok, bukan mengikuti rekomendasi AI.
4. Data, angka, dan rujukan tidak pernah diambil dari AI, melainkan ditelusuri sendiri ke sumber aslinya.

---

### Log Penggunaan AI per Milestone

Silakan catat penggunaan AI yang berdampak signifikan pada pengerjaan tugas (misal: *generate* fungsi algoritma yang kompleks, *generate* draf dokumen SKPL/DPPL, atau *debugging* error utama). 
*Penggunaan sepele seperti memperbaiki *typo* atau auto-complete satu baris kode tidak perlu dicatat.*

### Milestone 1
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| *Google Gemini 2.5 Flash* | *Pemahaman konsep untuk subbab 2.1 Deskripsi Perangkat Lunak (penanggung jawab: Sulthan Dhiyazka Suwandi). Menanyakan perbedaan antara mendeskripsikan perangkat lunak dari sudut pandang pengguna dan dari sudut pandang teknis, agar penulisan subbab tidak terjebak membahas implementasi.* | *"Dalam dokumen analisis solusi perangkat lunak, apa perbedaan antara mendeskripsikan sistem dari sudut pandang pengguna dan dari sudut pandang teknis? Apa saja ciri deskripsi yang masih berada pada tingkat kebutuhan dan belum masuk ke rancangan?"* | *Penjelasan AI hanya kami pakai sebagai rambu penulisan. Berdasarkan penjelasan tersebut, kami memutuskan menyusun subbab 2.1.1 dengan cara menceritakan alur pemakaian dari sisi penjual, pembeli, dan admin secara terpisah. Seluruh kalimat deskripsi ITBELI ditulis sendiri oleh anggota penanggung jawab tanpa menyalin keluaran AI.* |
| *Google Gemini 2.5 Flash* | *Penyusunan kerangka (outline) subbab 2.1 (penanggung jawab: Sulthan Dhiyazka Suwandi). Menanyakan komponen apa saja yang umumnya dibahas pada bagian deskripsi perangkat lunak sebuah dokumen analisis solusi.* | *"Secara umum, bagian apa saja yang biasanya dibahas dalam subbab deskripsi perangkat lunak pada dokumen analisis solusi? Berikan kerangka poinnya saja, tanpa isi."* | *Kerangka umum dari AI kami sesuaikan dengan kebutuhan dokumen ini. Kami memecah subbab menjadi 2.1.1 sampai 2.1.4 dan menambahkan sendiri bagian perbandingan dengan solusi yang sudah ada, karena bagian tersebut diperlukan untuk menjawab celah yang dirumuskan pada subbab 1.2 namun tidak muncul pada kerangka umum yang diberikan AI. Urutan pembahasan juga kami ubah agar mengalir dari sudut pandang pengguna terlebih dahulu.* |
| *Google Gemini 2.5 Flash* | *Eksplorasi alternatif dan pendekatan terkait target platform pada subbab 2.1.2 (penanggung jawab: Sulthan Dhiyazka Suwandi). Menanyakan pertimbangan umum dalam memilih antara aplikasi web, desktop, dan mobile.* | *"Apa saja pertimbangan umum yang biasa dipakai untuk memilih antara aplikasi web, aplikasi desktop, dan aplikasi mobile? Jelaskan kelebihan dan kekurangan masing-masing secara umum."* | *AI hanya memberikan pertimbangan yang bersifat umum dan tidak merekomendasikan pilihan tertentu. Keputusan memilih aplikasi web diambil melalui diskusi kelompok dengan menimbang asumsi pengguna multi-perangkat pada subbab 2.2, kebutuhan verifikasi surel @itb.ac.id pada US-01, dan keterbatasan durasi pengerjaan. Alasan pemilihan platform ditulis ulang sepenuhnya dengan konteks ITBELI dan ITB.* |
| *Google Gemini 2.5 Flash* | *Permintaan contoh umum aspek pembanding untuk tabel pada subbab 2.1.4 (penanggung jawab: Sulthan Dhiyazka Suwandi).* | *"Secara umum, aspek apa saja yang biasa dipakai untuk membandingkan dua platform yang melayani kebutuhan serupa? Berikan contoh aspek pembandingnya saja."* | *Daftar aspek umum dari AI kami saring dan ganti sebagian. Aspek yang terlalu umum kami buang, lalu kami tentukan sendiri enam aspek pembanding yang langsung memetakan empat celah pada subbab 1.2. Isi setiap sel tabel diisi berdasarkan pengamatan dan pengalaman langsung anggota kelompok sebagai pengguna kanal informal dan marketplace umum, bukan dari keluaran AI.* |
| *Google Gemini 2.5 Flash* | *Penggalian ide arah pengembangan jangka panjang untuk roadmap pada subbab 2.1.2 (penanggung jawab: Sulthan Dhiyazka Suwandi).* | *"Secara umum, tahapan apa saja yang biasa ditempuh sebuah aplikasi web ketika ingin dikembangkan ke arah aplikasi mobile? Sebutkan garis besarnya saja."* | *Ide tahapan dari AI kami rumuskan ulang menjadi tiga tahap yang sesuai dengan kondisi ITBELI. Kelompok menambahkan sendiri penegasan bahwa seluruh roadmap berada di luar cakupan pengerjaan tugas besar, agar tidak terbaca sebagai kebutuhan yang dijanjikan akan diimplementasikan.* |
| *Google Gemini 3.1 Pro* | *Penggalian ide sudut pandang untuk subbab 1.1 Latar Belakang Masalah (penanggung jawab: Dhanesworo Muhammad Datiputro).* | *"Bagaimana pola konsumsi barang yang cepat kehilangan relevansi pakai (seperti pakaian atau perlengkapan yang hanya dipakai dalam periode tertentu) biasa dikaitkan dengan isu keberlanjutan atau pengelolaan sampah? Sebutkan sudut pandang yang umum dipakai saja."* | *Jawaban AI hanya kami jadikan pijakan awal untuk mencari isu yang relevan. Dari situ kami sendiri yang menelusuri SDG 12 dan data SIPSN KLHK sebagai rujukan konkret, karena AI tidak diberi ruang untuk menyebut angka atau sumber data. Contoh kasus barang mahasiswa ITB (jas praktikum, buku kuliah, kalkulator, perlengkapan kos) dan narasi urgensinya ditulis sendiri berdasarkan pengamatan pribadi, bukan dari keluaran AI.* |
| *Google Gemini 3.1 Pro* | *Penyusunan kerangka subbab 1.2 Analisis Kondisi Saat Ini (penanggung jawab: Dhanesworo Muhammad Datiputro).* | *"Ketika menganalisis kondisi/solusi yang sudah ada sebelum mengusulkan sistem baru, bagian apa saja yang biasanya perlu dibahas agar analisisnya lengkap?"* | *Kerangka umum dari AI kami pakai sekadar acuan urutan penulisan yaitu kondisi eksisting dulu, baru celah. Daftar media seperti grup WhatsApp/Line, story Instagram, marketplace umum dan keempat celah yang dicatat disusun sendiri berdasarkan pengalaman langsung sebagai mahasiswa ITB.* |
| *Claude Sonnet 5* | *[Tujuan penggunaan untuk subbab 2.2 pendeskripsian masing-masing bagian sesuai dengan contoh repository yang direkomendasikan asisten ( penanggung jawab: Ghaniyul Amri Caulava)* | *Dalam dokumentasi perangkat lunak, tolong jelaskan kepada saya secara umum mengenai asumsi dan batasan meliputi sisi pengguna(tingkat kemampuan pengguna, perangkat dan infrastruktur pengguna, dan perilaku pengguna), asumsi dari sisi pengerjaan teknis perangkat lunak, batasan dan ruang lingkup(batasan regulasi, keterbatasan sumber daya, ruang lingkup solusi)* | *Kerangka umum dari AI hanya digunakan sebagai kerangka acuan dan penjelasan lebih mendalam dari bagian-bagian tersebut. Selanjutnya disusun sendiri sembari melihat contoh dan memvalidasi dari repository rekomendasi asisten* |
| *[Nama AI]* | *[Tujuan penggunaan untuk subbab 3.1 dan 3.2 - penanggung jawab: Nazhif Hilmi Kistijantoro]* | *[Tuliskan Prompt Utama, atau tandai "-" jika tidak menggunakan AI]* | *[Tuliskan Keputusan Hasil Validasi]* |
| *[Nama AI]* | *[Tujuan penggunaan untuk subbab 3.3 - penanggung jawab: I Made Adi Kusuma Ardana]* | *[Tuliskan Prompt Utama, atau tandai "-" jika tidak menggunakan AI]* | *[Tuliskan Keputusan Hasil Validasi]* |

**Catatan Milestone 1:** *Tidak ada bagian dokumen pada milestone ini yang isinya dihasilkan langsung oleh AI. Seluruh naskah ditulis oleh anggota kelompok, sementara AI hanya dipakai pada tahap memahami konsep, menyusun kerangka, menimbang alternatif, dan meminta contoh yang bersifat umum. Data timbulan sampah pada subbab 1.1 ditelusuri langsung ke sumbernya dan tidak berasal dari AI.*

### Milestone 2
| Tool AI | Tujuan Penggunaan | Contoh Prompt Utama | Modifikasi & Validasi Manusia |
| :--- | :--- | :--- | :--- |
| | | | | |
| | | | | |

---
### Pernyataan Integritas dan Persetujuan

Kami yang bertanda tangan di bawah ini menyatakan bahwa seluruh log penggunaan AI di atas adalah benar. Kami telah memvalidasi seluruh hasil AI dan bertanggung jawab penuh atas orisinalitas, keamanan, dan kebenaran hasil akhir dari tugas ini.

| Tanda Tangan | Nama Anggota |
| :---: | :--- |
| <img src="./assets/ttd-anggota1.png" width="100"> | **[13525124 - Sulthan Dhiyazka Suwandi]** |
| <img src="./assets/ttd-anggota2.png" width="100"> | **[13525034 - Dhanesworo Muhammad Datiputro]** |
| <img src="./assets/ttd-anggota3.png" width="100"> | **[13525115 - Nazhif Hilmi Kistijantoro]** |
| <img src="./assets/ttd-anggota4.png" width="100"> | **[13525121 - I Made Adi Kusuma Ardana]** |
| <img src="./assets/ttd-anggota5.png" width="100"> | **[13525106 - Ghaniyul Amri Caulava]** |
