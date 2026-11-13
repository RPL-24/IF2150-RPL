<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## *ITBELI*

### Untuk:  *Mikhael Andrian Yonatan*

Dipersiapkan oleh:

| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *G02*  |
| Nama Kelompok | *Indeks A*  |

| NIM | Nama |
|---|---|
| *13525124* | *Sulthan Dhiyazka Suwandi* |
| *13525034* | *Dhanesworo Muhammad Datiputro* |
| *13525115* | *Nazhif Hilmi Kistijantoro* |
| *13525121* | *I Made Adi Kusuma Ardana* |
| *13525106* | *Ghaniyul Amri Caulava* |

---

**Deadline:** Rabu, 11 November 2026, 21.50 WIB
**Asistensi akbar:** *[Hari, DD Bulan YYYY, HH.MM WIB, lokasi/link]*

---

# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:
- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, *route/handler*, *stored procedure*, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform | Ketentuan |
| :--- | :--- |
| **Web** | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-*deploy*; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional. |
| **Mobile** | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release. |

## A.3 Keamanan Repository

Repo fork kelompok bersifat **public**, sehingga:

- **Dilarang** meng-commit password, API key, token, `.env` asli, sertifikat/private key, atau data pribadi. Hal ini dapat mengurangi nilai.
- Sediakan `.env.example` berisi nama variabel tanpa nilai rahasia, dan masukkan `.env` ke `.gitignore`.
- Jika sudah terlanjur ter-commit, **cabut/ganti** kredensial tersebut. Menghapus commit saja tidak cukup.
- Data uji/seed harus berupa data fiktif.

## A.4 Struktur Folder

Seluruh kode ditempatkan di `src/` pada repo fork. Jangan mengubah folder milestone lama.

```
src/                              # SELURUH kode implementasi
	README.md                     # dokumentasi utama aplikasi (lihat A.5)
	.env.example                  # jika memakai environment variable
	<struktur kode kalian>        # bebas, mengikuti pola arsitektur DPPL
	tests/                        # test case (jika ada)
docs/
	M9/
		KXX_GYY_Implementasi.md   # laporan ini (Bagian B)
		KXX_GYY_Form-Asistensi.md
```

Catatan:
- `README.md` aplikasi diletakkan di **`src/README.md`**, bukan di root repo.
- Jika kerangka kerja kalian mewajibkan struktur tertentu (misalnya Maven `src/main/java`, Flutter `lib/`, monorepo `frontend/` dan `backend/`), letakkan semuanya **di dalam `src/`**.
- Nama file dan folder pada `docs/M9/` mengikuti aturan penamaan milestone sebelumnya (`KXX_GYY_...`).

## A.5 Isi Minimal `src/README.md`

README harus cukup bagi orang yang belum pernah melihat proyek kalian untuk menjalankan aplikasi dari nol. Minimal berisi:

1. **Deskripsi singkat** aplikasi.
2. **Teknologi yang digunakan** beserta versi (bahasa, framework, basis data).
3. **Prasyarat dan instalasi** (software yang harus ada, perintah instalasi dependensi).
4. **Konfigurasi** (environment variable, setup basis data, migrasi/seed) dan langkah demi langkah menjalankannya.
5. **Cara menjalankan aplikasi** (dan cara menjalankan test, jika ada).
6. **Akun/data uji** untuk mencoba tiap peran pengguna (jika ada login).
7. **Daftar modul/fitur yang diimplementasi** beserta pembagian anggota.
8. **Daftar tabel/koleksi basis data** beserta atributnya (atau tautan ke skema/ERD).

## A.6 Best Practices

Kalian dianjurkan menerapkan praktik berikut. Bukti penerapannya dirangkum pada Bagian B.2.

### 1. Branching
Sesuai aturan umum di README repository, `main` fork kelompok dijaga agar tetap bisa menerima sync dari asisten. Pada tugas ini **sangat disarankan** memakai branch per fitur dengan format `<tipe>/<nama-fitur>` (contoh: `feat/login-page`, `fix/null-cart`), lalu digabungkan ke `main` melalui Pull Request. Skema Gitflow penuh (dengan `develop`) boleh dipakai, tetapi tidak diwajibkan.

### 2. Semantic Commit
Gunakan format `<tipe>(<scope>): <deskripsi>`, misalnya `feat(auth): tambah validasi email`.

| Tipe | Kegunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format/spasi, tanpa mengubah logika |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test` | Menambah/memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |

### 3. Track Tasks
Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.
- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review
- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-*review* minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa
- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform | Contoh alat |
| :--- | :--- |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse |
| Web (backend) | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python | `cProfile`, `PyInstrument` |
| Java | VisualVM, JProfiler |
| Mobile | Android Studio Profiler, Flutter DevTools, Xcode Instruments |

### 6. Penggunaan AI
Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-*commit* dan di-*push* ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan | Jalur |
| :--- | :--- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** *[tautan sheets QnA]* |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git | Grup kelompok bersama asisten masing-masing |

Ketentuan:
1. Pertanyaan tentang ketentuan tugas **wajib** diajukan melalui Sheets QnA. Periksa terlebih dahulu apakah pertanyaan serupa sudah dijawab.
2. Jika pertanyaan tentang ketentuan tugas tetap diajukan langsung kepada asisten kelompok, asisten **berhak menolak menjawab** dan meminta kelompok memasukkan pertanyaannya ke Sheets QnA.
3. Jika pertanyaan di Sheets QnA **belum dijawab dalam 24 jam**, kelompok boleh menghubungi asisten kelompok masing-masing. Cantumkan pertanyaan yang sudah diajukan di sheets tersebut.
4. Jawaban pada Sheets QnA berlaku untuk **seluruh kelompok** dan menjadi acuan jika terjadi perbedaan pemahaman.

---

# BAGIAN B: Laporan Implementasi

## B.1 Perubahan dari DPPL

Catat semua perbedaan antara perancangan (DPPL) dan implementasi akhir. Jika tidak ada perubahan, tuliskan "Tidak ada perubahan".

Tabel B.1. Perubahan dari DPPL

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Lingkungan implementasi, DBMS (Tabel 2.1) | PostgreSQL terkelola pada Supabase (*cloud*), tidak dijalankan lokal | PostgreSQL 16 lokal melalui Docker Compose (`src/docker-compose.yml`). Basis data lain, termasuk Supabase, tetap dapat dipakai dengan mengisi `DATABASE_URL` | Ketentuan A.2 M9 meminta aplikasi dapat dijalankan ulang asisten tanpa akun pribadi kelompok, dan basis data lokal disarankan. Skema dan SQL tetap PostgreSQL sehingga rancangan tidak berubah |
| 2 | Kelas C43 SurelAdapter | Mengirim surel melalui layanan SMTP | Tetap SMTP melalui nodemailer, tetapi saat pengembangan dan penilaian diarahkan ke Mailpit (SMTP lokal pada Docker Compose, kotak masuk di `http://localhost:8025`). SMTP asli cukup diatur lewat variabel `SMTP_*` | Kode verifikasi (UC02) dapat diuji asisten tanpa akun surel sungguhan dan tanpa kredensial yang di-*commit* |
| 3 | Kelas C13 AkunController: `daftarAkun`, `verifikasiAkun`, `kirimUlangKode` | Mengembalikan `Boolean` | Mengembalikan objek `{ berhasil, kodePesan, pesan }`, misalnya `DOMAIN_TIDAK_VALID`, `SUREL_TERDAFTAR`, `KODE_KEDALUWARSA`. `login` memakai pola yang sama dengan kode pesan Algo-006 ditambah `ISIAN_KOSONG` | KF05 meminta pesan kesalahan yang menyebutkan penyebabnya. Dengan nilai `Boolean`, View tidak dapat membedakan domain salah, surel terdaftar, atau kode kedaluwarsa |
| 4 | Kelas C13 AkunController: `validasiKodeVerifikasi(kode)` dan `cekKedaluwarsaKode(idToken)` | Parameter berupa kode dan `idToken` | Keduanya menerima objek `TokenVerifikasi` yang sudah diambil `verifikasiAkun` | Controller tidak menyimpan *state* antarpermintaan (DPPL 2.2.2), sehingga token perlu diteruskan sebagai parameter. Cara ini juga menghindari query ulang ke tabel `token_verifikasi` |
| 5 | UC02, layar I-03 (`arahkanKeBeranda`) | Setelah verifikasi berhasil, pengguna diarahkan ke beranda | `POST /api/akun/verifikasi` yang berhasil langsung membuat sesi login (`buatSesiLogin`) dan mengembalikan token | Beranda memerlukan sesi login. Tanpa sesi, pengguna harus login ulang tepat setelah memverifikasi surel |
| 6 | Kelas C28 SesiLogin: `buatToken` | Token sesi "bertanda tangan kriptografis" | Token acak 32 byte (64 karakter hex) dari `crypto.randomBytes` yang disimpan pada tabel `sesi_login` dan diperiksa ke basis data pada setiap permintaan | Token yang tersimpan di basis data dapat dicabut seketika saat logout (KF12) maupun saat akun diblokir (`nonaktifkanByAkun`, KF53), hal yang sulit dilakukan pada token bertanda tangan seperti JWT |
| 7 | Kelas C41 Otorisasi | Operasi `verifikasiToken` dan `verifikasiAdmin` | Kedua operasi tetap ada, ditambah `ambilToken` (membaca header `Authorization: Bearer`) serta middleware Express `wajibLogin` (401) dan `wajibAdmin` (401/403) yang membungkus kedua operasi tersebut. `verifikasiAdmin` menerima parameter opsional kedua, yaitu sesi yang sudah diperiksa `wajibAdmin` | Cara standar Express untuk melindungi route, sehingga pemeriksaan sesi dan peran tidak ditulis ulang di setiap route. Dipakai route Modul A, B, C, D, dan E. Parameter opsional itu membuat tabel `sesi_login` hanya dikueri sekali per permintaan admin (Tabel B.2c No. 1) |
| 8 | Kelas C13 AkunController: `getTautanDokumenLegal` | Operasi controller yang dipanggil View | Ditambah endpoint `GET /api/akun/tautan-kebijakan` | View (I-02, I-09) berjalan di peramban sehingga memerlukan jalur HTTP untuk memanggil operasi controller |
| 9 | Kelas C29 Barang: `getListingPenjual` | Mengembalikan `List<Barang>` dengan atribut Tabel 4.1 | Setiap objek `Barang` dilengkapi atribut tambahan `fotoUtama` yang diambil dalam query yang sama (subquery ke `foto_barang`) | Kartu listing pada profil (I-09) memerlukan foto utama. Mengambilnya per barang akan menimbulkan satu query tambahan untuk setiap listing |
| 10 | Kelas C02 HalamanProfil: `tampilkanDaftarListing`, layar I-09 (I09-O02) | Memanggil `KartuProduk.render()` untuk setiap barang | Kartu listing dibuat oleh `HalamanProfil.buatKartu` dengan gaya `.card` yang sama, dan menaut ke detail listing milik penjual (`/detail?id=`) | C06 KartuProduk (Modul C) dibuat untuk katalog: menaut ke detail pembeli dan belum mendukung label "Terjual", sedangkan profil menampilkan listing Tersedia dan Terjual milik sendiri |
| 11 | Kelas C01 HalamanOtentikasi, layar I-02 (I02-O04) | Isian kata sandi dengan indikator kekuatan, tanpa aturan minimum | Kata sandi wajib minimal 8 karakter serta memuat huruf dan angka, divalidasi di View dan di `AkunController.daftarAkun` | Mengikuti teks petunjuk pada rancangan antarmuka I-02 ("Minimal 8 karakter, memuat huruf dan angka") |
| 12 | Kelas C40 DokumenLegal: atribut `isi` | Isi lengkap dokumen berupa teks | Isi disimpan dengan penanda `## ` di awal judul setiap bagian, dan `tanggal_berlaku` diambil sebagai teks `YYYY-MM-DD` | Penanda bagian memungkinkan I-15 membuat daftar isi otomatis (I15-O05). Tanggal sebagai teks mencegah tanggal bergeser satu hari akibat konversi zona waktu di peramban |
| 13 | Lingkungan implementasi, *Filing System* (Tabel 2.1) dan kelas C45 PenyimpananBerkas | Berkas unggahan disimpan pada Supabase Storage; atribut `namaBucket` | Berkas disimpan pada folder lokal `src/uploads/<idObjek>/` dengan nama acak (UUID) dan disajikan Express lewat `/uploads`. Atribut menjadi `direktoriBasis`. `simpan` mengembalikan `null` bila gagal dan menghapus berkas yang sempat tertulis | Alasannya sama dengan No. 1: asisten dapat menjalankan aplikasi tanpa akun Supabase kelompok. Tanda tangan `simpan(idObjek, berkas)` dan `hapus(pathBerkas)` tetap, sehingga pindah ke *bucket* cukup mengganti isi kelas ini, seperti yang kemudian dilakukan untuk Vercel Blob (No. 40) |
| 14 | Lingkungan implementasi, *Development Tools* (Tabel 2.1): mkcert | HTTPS lokal dengan sertifikat buatan mkcert | Server berjalan pada `http://localhost:3000` tanpa sertifikat | Peramban memperlakukan `localhost` sebagai *secure context*, jadi Service Worker dan Web Push tetap bekerja. Langkah pemasangan sertifikat dihilangkan agar aplikasi jalan dengan lebih sedikit perintah |
| 15 | Pemeriksaan sesi pada Controller (BAB 4, butir "Pemeriksaan sesi terpusat"): C14, C15, C18 | Setiap operasi Controller menerima `token`, lalu memanggil Otorisasi | Route memasang `Otorisasi.wajibLogin` dan meneruskan `req.akun.idAkun`. Operasi C18 PercakapanController menerima `idAkun`, sedangkan C14 dan C15 berbentuk *handler* Express `(req, res)`. C20 dan C21 tetap menerima `token` seperti rancangan | Token sudah diverifikasi sekali oleh middleware (No. 7). Memeriksanya lagi di dalam Controller berarti dua kueri ke `sesi_login` untuk satu permintaan |
| 16 | Kelas C14 BarangController (15 operasi) | Validasi isian, validasi foto, pemeriksaan kepemilikan, penyimpanan foto, dan perubahan status berada di BarangController | BarangController berisi 7 *handler* tipis. Logikanya pindah ke `src/services/ListingService.js` (`get`, `simpan`, `hapus`, `status`, `validasiData`, `validasiFoto`) dan `src/models/ListingPenjual.js` (`transaksi`, `kunci`, `akunAktif`, `update`, `setStatus`, `galeri`). Pemetaan tiap operasi ada pada Tabel B.5 | Membuat atau mengubah listing menyentuh tabel `barang`, `foto_barang`, dan berkas foto sekaligus, jadi ketiganya dibungkus satu transaksi dengan `SELECT ... FOR UPDATE`. Kelas Barang dan FotoBarang yang juga dipakai Modul E tidak diubah kontraknya |
| 17 | Kelas C14: `siapkanPenghapusan`, `siapkanPerubahanStatus`, `terbitkanKeKatalog`, `getIdPenjualDariSesi` | Empat operasi tersendiri | Tidak ada sebagai operasi. Sebelum dialog konfirmasi, View memanggil `GET /api/barang/:id` untuk memeriksa kepemilikan dan status terbaru. Listing berstatus "Tersedia" langsung terbaca kueri katalog tanpa langkah penerbitan, dan identitas penjual datang dari middleware | Pemeriksaan pradialog cukup dilayani `getBarang`. Katalog membaca tabel `barang` secara langsung, sehingga tidak ada salinan data yang harus diterbitkan |
| 18 | Kelas C29 Barang: `setStatus`; kelas C30 FotoBarang: `perbaruiGaleri`, `getFotoUtama` | Operasi pada Barang dan FotoBarang | `setStatus` dan penggantian galeri berada di `ListingPenjual.setStatus` dan `ListingPenjual.galeri` (hapus, lalu simpan ulang sesuai urutan). Foto utama diambil lewat subkueri `foto_utama` pada kueri Barang | Kedua operasi berjalan di dalam transaksi listing (No. 16). Subkueri foto utama menghindari satu kueri tambahan per kartu, seperti pada No. 9 |
| 19 | Kelas C31 Kategori dan C32 LokasiCOD; tabel `kategori` dan `lokasi_cod` (subbab 5.31 dan 5.32) | Dua kelas Model dengan tabel masing-masing; LokasiCOD punya atribut `kampus` | Daftar tetap pada `src/models/ReferensiListing.js`: 6 kategori dan 6 lokasi COD. Kolom `barang.id_kategori` dan `barang.id_lokasi` menyimpan nama pilihan itu sebagai teks. Atribut `kampus` tidak ada | Tidak ada use case untuk menambah atau mengubah kategori dan lokasi, sehingga daftar tetap sudah mencukupi. Konsekuensinya, menambah pilihan memerlukan perubahan kode |
| 20 | Kelas C03 HalamanListingPenjual dan C04 FormulirBarang (nama operasi) | 13 operasi per kelas, misalnya `onClickHapus`, `onClickTandaiTerjual`, `tampilkanKonfirmasi`, `validasiFotoSisiKlien` | C03 memiliki `mulai`, `muat`, `render`, dan `aksi(barang, aksi)`. C04 memiliki `mulai`, `tambahFoto`, `pindah`, `renderFoto`, `data`, `preview`, `validasi`, `simpan`, `batal`. Dialog konfirmasi, *toast*, kartu, dan kerangka halaman dipakai bersama lewat `src/views/js/ListingUI.js` | Hapus, tandai terjual, dan batal terjual memakai dialog serta alur yang sama, jadi cukup satu *method* `aksi`. Perilaku layar I-07 dan I-08 tetap mengikuti rancangan |
| 21 | Layar I-07 (`arahkanKeDetail`) | Setelah menyimpan, penjual diarahkan ke detail barang I-06 | Penjual diarahkan ke halaman detail khusus pemilik, yaitu `src/views/pages/detail.html` dengan `DetailListingPenjual.js` | Detail untuk pemilik diambil dari `GET /api/barang/:id` yang memeriksa kepemilikan, terpisah dari detail publik UC15 (No. 24) |
| 22 | Kelas C15 KatalogController: `getProduk`, `paginasi`, `urutkanHasil` | `getProduk(kataKunci, filterAktif, kriteriaUrutan, halaman)`; `paginasi` dan `urutkanHasil` di KatalogController | `getProduk(req, res)` membaca *query string* `q`, `kategori`, `hargaMin`, `hargaMaks`, `lokasi`, `urut`, dan `halaman`. Paginasi dihitung `FilterController.hitungPaginasi`. Urutan divalidasi FilterController, lalu dipetakan ke daftar tetap `URUTAN_KATALOG` di `Barang.js` | Klausa `ORDER BY` hanya boleh berasal dari daftar tetap agar aman dari injeksi SQL, dan Model adalah satu-satunya penyusun SQL (aturan DPPL 2.2.1) |
| 23 | Kelas C16 PencarianController: `cocokkanKataKunci`; kelas C17 FilterController: `filterCategory`, `filterPrice`, `filterLocation`, `validasiParameterFilter` | Controller mencocokkan kata kunci dan menyaring per kriteria | C16 memiliki `normalisasiKataKunci`, `pecahKataKunci`, dan `siapkanPencarian` (maksimal 100 karakter, 5 kata). C17 memiliki `validasiFilter` dan `hitungPaginasi`. Pencocokan dan penyaringan dikerjakan basis data lewat `Barang.getKatalog`: `ILIKE` per kata, `WHERE` per kriteria | Menyaring di Controller berarti memuat seluruh listing ke memori server. Dengan `WHERE` dan `LIMIT`, basis data hanya mengirim 20 baris per halaman (KF28) |
| 24 | UC15 Melihat Detail Listing (subbab 3.15): C14, C25, C30, C31, C32 | `BarangController.getBarang(idBarang, token, tujuan)` mengumpulkan data dari Barang, FotoBarang, Penjual, Kategori, dan LokasiCOD | `GET /api/katalog/:id` → `KatalogController.getDetailProduk` → `Barang.getDetailKatalog`, yaitu satu kueri dengan JOIN `akun` dan `json_agg` foto. `BarangController.getBarang` hanya melayani pemilik listing | Satu kueri menggantikan empat sampai lima kueri. Jalur pembeli dan pemilik dipisah karena aturannya berbeda: pembeli tidak boleh membuka listing "Dinonaktifkan" atau milik akun terblokir |
| 25 | Kelas C05 HalamanKatalog dan C06 KartuProduk; layar I-04 dan I-05 | Dua layar; operasi seperti `showKatalog`, `inputPencarian`, `pilihFilter`, `pindahHalaman`; `KartuProduk.render` dan `onClickDetail` | Satu halaman `katalog.html` untuk I-04 dan I-05. C05 memiliki `mulai`, `muatReferensi`, `isiFormulir`, `bacaFormulir`, `terapkan`, `keHalaman`, `muat`, `render`, dan menyimpan kriteria pada *query string* URL. C06 berupa objek `KartuProduk` dengan satu fungsi `buat(barang)` yang menghasilkan tautan ke `/barang?id=` | Katalog tanpa kata kunci dan hasil pencarian memakai tampilan serta endpoint yang sama. Kriteria pada URL membuat hasil pencarian bisa dimuat ulang dan dibagikan. Kartu berupa tautan biasa, sehingga tidak perlu *handler* klik |
| 26 | Kelas C07 HalamanDetailBarang: `tampilkanLightbox`, `bukaProfilPenjual` | Foto dapat diperbesar (*lightbox*) dan nama penjual membuka profilnya | Belum diimplementasikan. Galeri hanya mengganti foto utama saat *thumbnail* diklik, dan nama penjual tampil sebagai teks | Profil publik penjual memerlukan endpoint baru, sebab `GET /api/akun/profil` hanya mengembalikan profil pemilik sesi. Keduanya belum sempat dikerjakan dan dicatat sebagai *known issue* pada B.3 |
| 27 | Kelas C44 PushNotifikasiAdapter; skema basis data | Hanya atribut kunci VAPID; tidak ada tempat menyimpan langganan peramban | Kelas Model baru `LanggananPush` dan tabel `langganan_push` (`endpoint`, `p256dh`, `auth` per peramban). `kirimPush` menerima parameter tambahan `tautan`, dan langganan yang ditolak *push service* (404 atau 410) dihapus | Web Push hanya bisa dikirim ke *endpoint* langganan yang dibuat peramban, jadi data itu harus disimpan per akun. `tautan` menentukan halaman yang dibuka saat notifikasi diklik |
| 28 | Kelas C19 NotifikasiController dan C35 Notifikasi | C19 punya 5 operasi kirim. C35 punya `simpan` dan `hitungBelumDibaca` | C19 bertambah `getDaftarNotifikasi`, `tandaiDibaca`, `tandaiSemuaDibaca`, `simpanLanggananPush`, `validasiLanggananPush`, dan `getKunciPublik`, dengan route `/api/notifikasi/*`. C35 bertambah `getDaftarByAkun`, `tandaiDibaca`, dan `tandaiSemuaDibaca`. `kirimPushNotifikasi` menerima `jenis` opsional | C09 PanelNotifikasi (I-11) perlu mengambil daftar notifikasi dan menandainya sudah dibaca, sedangkan rancangan baru mengatur sisi pengiriman |
| 29 | Kelas C34 Pesan dan C18 PercakapanController | Tidak ada operasi yang mengubah `statusBaca` | `Pesan.tandaiDibaca(idPercakapan, idAkun)` dipanggil `bukaPercakapan`. C18 bertambah `potongCuplikan`, `beritahuPenerima`, dan `ambilRingkasanBarang` | Tanpa operasi ini, jumlah pesan belum dibaca (KF34) tidak pernah turun. Tiga operasi bantu memisahkan cuplikan 80 karakter, notifikasi untuk penerima, dan kartu barang di kepala ruang percakapan |
| 30 | Algo-018 `kirimPesan`: isi notifikasi | `kirimNotifikasi(idPenerima, "Pesan Baru", "Anda menerima pesan baru pada obrolan ITBELI.")` | `kirimNotifikasi(idPenerima, 'pesan', 'Pesan baru dari <nama pengirim>')`, tanpa cuplikan isi pesan | Nama pengirim membantu penerima memilih percakapan yang harus dibuka. Cuplikan sengaja tidak disertakan karena tabel `notifikasi` menyimpan teks polos, sedangkan isi pesan wajib terenkripsi (KF36) |
| 31 | Kelas C36 Laporan dan C21 ModerasiController; layar I-13 | Rancangan tidak mengatur urutan perubahan status dan tidak memiliki operasi statistik | `Laporan.validasiTransisiStatus` hanya mengizinkan Baru → Diproses → Selesai (boleh langsung Baru → Selesai) dan menolak langkah mundur. `Laporan.getStatistikStatus` dan `ModerasiController.getStatistik` mengisi kartu jumlah laporan per status lewat `GET /api/admin/laporan/statistik`. Permintaan mengubah ke status yang sama dijawab berhasil tanpa menulis ke tabel `laporan` maupun `log_audit` | Laporan yang sudah "Selesai" tidak boleh dibuka lagi diam-diam, sejalan dengan log audit yang hanya bertambah (KF48, KF49). Kartu jumlah laporan ada pada rancangan I-13, tetapi belum punya operasi sumber data. Riwayat penanganan hanya memuat perubahan yang benar-benar terjadi (Tabel B.2c No. 7) |
| 32 | Kelas C37 BuktiLaporan, C38 LogAudit, C39 LogAdmin | Hanya operasi tulis | Ditambah operasi baca: `BuktiLaporan.cariByLaporan`, `LogAudit.getRiwayatByLaporan`, `LogAdmin.getAllLog` | Detail laporan (I-14) menampilkan lampiran bukti dan riwayat penanganan. LogAudit dan LogAdmin tetap tanpa operasi ubah atau hapus |
| 33 | Kelas C20 LaporanController: `buatLaporan`; kelas C21: `blokirAkun`, `bukaBlokirAkun` | `buatLaporan` mengembalikan `Boolean`; `bukaBlokirAkun(token, idAkun)` | `buatLaporan` mengembalikan `{ berhasil, kodePesan, pesan }` dengan kode `TIDAK_TEROTENTIKASI`, `DATA_TIDAK_LENGKAP`, `BUKTI_TIDAK_VALID`, atau `GALAT_SERVER`. `bukaBlokirAkun` menerima `alasan` opsional. Route blokir dan buka blokir tersedia dengan maupun tanpa ID laporan | Alasannya sama dengan No. 3: View perlu tahu isian mana yang salah (KF43, KF44). Alasan buka blokir dicatat ke LogAdmin (KF55). Bila ID laporan disertakan, status laporan ikut menjadi "Selesai" dan tindakannya tercatat di LogAudit |
| 34 | Kelas C10 FormulirLaporan; layar I-12 | `tampilkanFormulirLaporan(objekDilaporkan)` dipanggil dari HalamanDetailBarang | Formulir menjadi halaman sendiri (`laporan-form.html`) yang menerima `?objek=<id>&jenis=<Listing atau Percakapan>`, dan operasinya menerima parameter kedua `jenisObjek`. `laporan.html` hanya mengalihkan ke halaman ini | Halaman terpisah cukup ditaut dari detail listing dengan membawa ID objek, tanpa memuat skrip formulir di halaman lain |
| 35 | Skema basis data: indeks tabel `barang` | Tidak dirinci pada DPPL | Tiga indeks tambahan untuk katalog dan pencarian: `barang_katalog_terbaru` (parsial), `barang_judul_trgm`, dan `barang_deskripsi_trgm` (GIN `pg_trgm`) | Hasil profiling pada B.2.1 |
| 36 | Algo-020 `kirimNotifikasi`: langkah 3, pengiriman notifikasi push | `kirimPushNotifikasi(idPenerima, isi)` dipanggil sebagai langkah berurutan sebelum `RETURN true` | Push dipicu tanpa ditunggu hasilnya; `kirimNotifikasi` langsung mengembalikan `true` setelah notifikasi tersimpan, dan kegagalan push hanya dicatat di log server | Pengiriman ke *push service* adalah panggilan jaringan yang bisa lambat, sedangkan `kirimPesan` harus segera menjawab pengirim (Tabel B.2c No. 10) |
| 37 | Lingkungan implementasi: pembacaan konfigurasi pada `src/config/env.js` | Tidak dirinci pada DPPL | Variabel lingkungan bernilai angka (`PORT`, `DB_PORT`, `SMTP_PORT`, `BCRYPT_SALT_ROUNDS`, `DURASI_SESI_JAM`, `DURASI_KODE_MENIT`) memakai nilai bawaan bila kosong atau bukan angka | Salah isi berkas `.env` tidak boleh menghasilkan `NaN` pada perhitungan masa berlaku sesi dan kode verifikasi (Tabel B.2c No. 2) |
| 38 | Kelas C13 AkunController: `validasiDomainEmail` | Memeriksa bahwa alamat surel berakhiran `@itb.ac.id` | Menerima `itb.ac.id` beserta subdomainnya, misalnya `@mahasiswa.itb.ac.id` dan `@std.stei.itb.ac.id`. Domain yang hanya memuat teks itu, seperti `itb.ac.id.palsu.com` atau `bukanitb.ac.id`, tetap ditolak. Pemeriksaan yang sama dipakai `HalamanOtentikasi` | Surel sivitas ITB juga memakai subdomain, dan KF05 hanya mensyaratkan surel berdomain itb.ac.id. Diubah pada commit `162315b` (PR #57) |
| 39 | Lingkungan implementasi (Tabel 2.1; APL subbab 1.4): server | Server berjalan pada laptop tim secara lokal, bukan pada layanan *hosting cloud* | Cara lokal tetap menjadi cara utama. Selain itu, aplikasi di-deploy ke Vercel di https://itbeli.vercel.app: Express berjalan sebagai satu *Vercel Function* di region Singapura (`sin1`), basis data PostgreSQL terkelola Neon (Singapura) dihubungkan lewat `DATABASE_URL`, dan surel dikirim lewat SMTP Gmail. Konfigurasinya ada di `src/vercel.json`: berkas View disalin ke `public/` oleh `src/scripts/salinStatis.js` karena Vercel mengabaikan `express.static()`, lalu `db:init` dan `db:seed-legal` dijalankan saat build. Akun uji dari `db:seed` tidak dibuat di produksi | Aplikasi dapat dicoba daring tanpa laptop tim menyala, sesuai A.2 M9 yang membolehkan deploy selama aplikasi tetap dapat dijalankan lokal. Akun uji tidak dibuat di produksi karena kata sandinya tertulis di README. Diubah pada PR #70 |
| 40 | Kelas C45 PenyimpananBerkas (lanjutan No. 13) | Berkas disimpan di satu tempat penyimpanan | Dua mode dengan `simpan` dan `hapus` yang sama: bila `BLOB_READ_WRITE_TOKEN` diisi, berkas diunggah ke Vercel Blob dan *path* yang disimpan berupa URL publik; bila kosong, berkas tetap ditulis ke `src/uploads/`. Folder `uploads/` baru dibuat saat pertama kali menyimpan, bukan saat modul dimuat. `hapus` mengirim URL ke Blob dan *path* `/uploads/...` ke disk | Disk *Vercel Function* hanya bisa dibaca dan tidak permanen, sehingga berkas harus disimpan di luar server. Membuat folder saat modul dimuat akan menggagalkan seluruh aplikasi di Vercel. Diubah pada PR #70 |
| 41 | UC03 Masuk ke Sistem; kelas C01, C13, C23; layar I-01 | Masuk hanya dengan surel dan kata sandi (Algo-006). Akun baru selalu melalui pendaftaran dan kode verifikasi (UC01, UC02) | Ditambah "Masuk dengan Google" (OAuth 2.0 *Authorization Code* dengan PKCE S256) lewat kelas baru `SsoController` dan route `/api/akun/sso/*`. Hanya akun Google dengan surel terverifikasi berdomain itb.ac.id (aturan No. 38) yang diterima. Pengguna baru diarahkan ke halaman `lengkapi-sso` untuk mengisi NIM dan menyetujui kebijakan, lalu akunnya langsung "Terverifikasi" dengan kata sandi acak (`AkunController.daftarAkunSso`). Akun yang sudah ada masuk lewat `AkunController.masukDenganSso`: akun diblokir ditolak, akun Admin tidak boleh masuk lewat SSO, dan akun "Belum Terverifikasi" langsung diverifikasi dengan *hash* kata sandi lamanya diganti (`Akun.perbaruiKataSandiHash`). Fitur ini nonaktif dan tombolnya tersembunyi bila `GOOGLE_CLIENT_ID` kosong | Surel sivitas ITB dikelola Google, sehingga kepemilikan surel sudah dibuktikan Google tanpa kode verifikasi (KF06). *Hash* lama diganti karena kata sandi itu bisa saja dipasang orang lain yang lebih dulu mendaftar dengan surel tersebut. Masuk dengan Microsoft sempat dibuat lalu dihapus (commit `4b19cb4`). Diubah pada PR #68 |
| 42 | Rancangan antarmuka (BAB 6, I-01 sampai I-15) dan *design tokens* | Tampilan mengikuti mockup: palet hijau, huruf Inter dan Source Serif 4, serta top bar dan rail yang ditulis di setiap halaman | Tampilan diganti bergaya marketplace sosial: token warna dan huruf baru di `tokens.css` (aksen biru `#0866ff`, latar `#f0f2f5`, huruf Segoe UI), top bar dan sidebar dibuat dari satu sumber `src/views/js/Kerangka.js`, layar pembuka di `/masuk` (sekali per tab), dan transisi antarhalaman (`@view-transition`). Alur dan fungsi setiap layar tetap mengikuti BAB 6 | Tampilan dibuat lebih akrab bagi pengguna marketplace dan seragam di semua halaman. Kerangka di satu berkas menghindari top bar dan rail yang berbeda-beda antarmodul. Diubah pada PR #66 dan #68 |

Rancangan lain berjalan sesuai DPPL: pola MVC di atas klien-server, 24 use case, 15 layar (ditambah halaman `lengkapi-sso` pada No. 41), dan seluruh nama kelas pada Tabel 4.1. Dari 45 kelas perancangan, 43 punya wujud kode dengan nama yang sama; dua sisanya (C31 Kategori dan C32 LokasiCOD) digabung menjadi satu modul daftar tetap seperti dijelaskan pada No. 19.

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | [Daftar branch](https://github.com/ghaniyul/IF2150-RPL-K01-G02/branches/all) · [graph commit](https://github.com/ghaniyul/IF2150-RPL-K01-G02/network) | Gitflow yang disederhanakan: `main` hanya menerima sync dari asisten dan rilis, `develop` menjadi tempat integrasi, dan setiap pekerjaan punya branch `<tipe>/<nama>`. Ada 29 branch kerja di remote: 20 `feat/`, 3 `test/`, 3 `docs/`, 2 `fix/`, dan 1 `chore/`, misalnya `feat/moderasi-uc21`, `feat/chat-uc17`, dan `test/akun`. Dua puluh empat di antaranya masuk `develop` lewat PR. Lima sisanya digabung langsung dengan `git merge`: `feat/laporan-uc19` (commit `c6bb0a4`), `fix/tindak-lanjut-review` (commit `f69c01c`), `docs/finalisasi-m9` (commit `4810d33`), `feat/logo-gajah` (commit `20197e1`), dan `docs/pembaruan-angka-m9` |
| Semantic commit | [Riwayat commit `develop`](https://github.com/ghaniyul/IF2150-RPL-K01-G02/commits/develop) | Dari 85 commit non-merge yang menyentuh `src/`, `docs/M9/`, dan `.github/`, 83 mengikuti format `<tipe>(<scope>): <deskripsi>` dan 80 di antaranya memakai scope. Dua sisanya adalah commit templat dari asisten (`init M1`, `init M9`). Sebaran tipe: 49 `feat`, 10 `test`, 9 `docs`, 8 `fix`, 5 `chore`, 1 `refactor`, 1 `style`. Scope mengikuti modul, antara lain `auth`, `profil`, `legal`, `katalog`, `chat`, `notif`, `laporan`, `moderasi`, `db`, dan `ui` |
| Track tasks | [GitHub Issues](https://github.com/ghaniyul/IF2150-RPL-K01-G02/issues?q=is%3Aissue) · [Issue Tracker #48](https://github.com/ghaniyul/IF2150-RPL-K01-G02/issues/48) | 24 issue kerja per use case, kelompok use case, atau paket pengujian, masing-masing punya penanggung jawab, label modul (`modul-A` sampai `modul-E`), dan label prioritas. Pembagiannya: Modul A 6 issue (Dhanesworo), Modul C 2 (I Made Adi), Modul D 7 (Sulthan), Modul E 7 (Ghaniyul), listing penjual 1 (Nazhif), dan otomasi tracker 1 (Sulthan). Per 11 November 2026 sudah 22 yang ditutup. Workflow GitHub Actions `issue-tracker` memperbarui tabel progres di issue #48 setiap ada perubahan issue atau PR, lalu menutup issue yang dirujuk `Closes #n` begitu PR masuk `develop`. Dua issue Modul C masih terbuka: #34 karena PR #44 tidak mencantumkan `Closes #34`, dan #35 (profiling) yang baru selesai bersama laporan ini |
| Pull request dan review | [#8](https://github.com/ghaniyul/IF2150-RPL-K01-G02/pull/8) (kerangka proyek, Otorisasi, login) · [#31](https://github.com/ghaniyul/IF2150-RPL-K01-G02/pull/31) (UC21) · [#50](https://github.com/ghaniyul/IF2150-RPL-K01-G02/pull/50) (notifikasi dan Web Push) · hasil review pada Tabel B.2c | Ada 30 PR: 29 digabung dan 1 ditutup tanpa merge (#28, diajukan ulang sebagai #32). Sebanyak 17 PR punya deskripsi yang dibagi per bagian, seperti apa yang dikerjakan, cara menguji, bukti hasil test, dan perubahan dari DPPL, dan 21 PR menutup issue-nya lewat `Closes #n`. Pada tiga contoh di samping, #8 memuat langkah uji manual dan cara memakai middleware untuk modul lain, #31 memuat rincian per berkas, daftar periksa *acceptance criteria*, dan hasil 100 test lulus, sedangkan #50 memuat bukti test dan daftar perubahan dari DPPL. Reviewer ditunjuk pada 17 PR, tetapi tidak ada review yang dikirim lewat fitur review GitHub, sehingga ketentuan review oleh minimal satu anggota lain belum terpenuhi selama pengembangan. Sebagai tindak lanjut, pada 13 November 2026 ketiga PR contoh di-review setelah merge oleh Ghaniyul Amri Caulava dengan bantuan AI, yang dicatat pada [`K01_G02_AI-Usage.md`](../K01_G02_AI-Usage.md). Review itu menghasilkan 12 temuan: 6 diperbaiki pada branch `fix/tindak-lanjut-review` beserta 11 test baru, dan 6 dicatat sebagai *known issue* pada B.3.3. Rinciannya ada pada Tabel B.2c |
| Pengujian | [`src/tests/`](../../src/tests/) · rincian pada Tabel B.2a | 408 test dalam 26 suite (18 unit, 8 integrasi), seluruhnya lulus lewat `npm test` di folder `src/`. Alatnya Jest 30 dan Supertest 7. Test tidak memerlukan PostgreSQL yang berjalan karena kueri diganti tiruan (*spy* dan *mock*), sehingga bisa dijalankan tepat setelah `npm ci`. Cakupan baris 82,1% (pernyataan 80,8%, cabang 75,3%, fungsi 73,2%): Controller 93,1%, Pendukung 100%, Model 58,0%. Sebelas test ditambahkan saat menindaklanjuti review pada Tabel B.2c, dan 50 test untuk penyimpanan Vercel Blob serta masuk dengan Google (B.1 No. 40 dan 41) |

Tabel B.2a. Rincian Pengujian per Modul

| Modul | Suite (jumlah test) | Total | Yang diuji |
| :--- | :--- | :--- | :--- |
| A. Akun dan Otentikasi | `AkunController` (64), `ModelAkun` (16), `Otorisasi` (21), `Kriptografi` (5), `DokumenLegalController` (10), `KonfigurasiEnv` (4), `AkunAPI` (24), `AlurModulA` (3) | 147 | Validasi pendaftaran dan domain `itb.ac.id` beserta subdomainnya, kode verifikasi (cocok, kedaluwarsa, hangus, kirim ulang), login untuk tiap status akun, logout, middleware `wajibLogin` dan `wajibAdmin`, bcrypt, AES-256-GCM, pembacaan variabel lingkungan bernilai angka, serta alur daftar → verifikasi → masuk → keluar |
| B. Listing Penjual | `ListingService` (14), `ListingAPI` (12) | 26 | Validasi judul, harga, kategori, lokasi, dan foto (tipe berkas dari *magic bytes*, batas 5 MB, 1 sampai 5 foto), kepemilikan listing, serta perubahan status Tersedia ↔ Terjual |
| C. Katalog dan Pencarian | `KatalogController` (5), `PencarianController` (7), `FilterController` (9) | 21 | Normalisasi dan pemecahan kata kunci, validasi rentang harga, urutan, dan nomor halaman, bentuk respons paginasi, serta pesan "Barang tidak ditemukan" |
| D. Percakapan dan Notifikasi | `PercakapanController` (21), `NotifikasiController` (21), `PushNotifikasiAdapter` (5), `PercakapanAPI` (8) | 55 | Satu ruang per kombinasi barang, pembeli, dan penjual, penolakan akses bukan peserta (KF35), enkripsi dan dekripsi pesan, cuplikan, hitungan belum dibaca, validasi langganan push, penghapusan langganan kedaluwarsa, dan push yang tidak menahan pengiriman pesan |
| E. Laporan dan Moderasi | `ModerasiController` (39), `LaporanController` (12), `LaporanModel` (11), `BarangModel` (11), `ModerasiAPI` (29), `LaporanAPI` (4), `AlurModulE` (3) | 109 | Validasi formulir dan bukti laporan, privasi laporan percakapan (KF37), penyaringan laporan, urutan status, isi teks log audit, hapus listing, blokir dan buka blokir akun beserta pencabutan sesi, penolakan akses bukan admin (KF56), dan tiga alur dari laporan sampai tindakan |
| Tambahan: deploy dan masuk dengan Google | `PenyimpananBerkasBlob` (8), `SsoAPI` (42) | 50 | Unggah ke Vercel Blob secara publik, *rollback* bila salah satu berkas gagal, penghapusan URL Blob dan *path* lokal, dan modul yang tidak membuat folder saat dimuat. Alur masuk dengan Google: penyedia nonaktif tanpa kredensial, *state* dan PKCE, klaim token (penerbit, audiens, kedaluwarsa, surel terverifikasi, domain itb.ac.id), penolakan akun Admin dan akun diblokir, serta pendaftaran pengguna baru lewat `lengkapi-sso` |

Angka cakupan Model lebih rendah karena kueri SQL tidak ikut dieksekusi oleh test; bagian itu kami periksa lewat pengujian manual di peramban dan lewat profiling di bawah.

Tabel B.2c berisi hasil review pasca-merge terhadap tiga PR contoh pada Tabel B.2. Review dilakukan pada 13 November 2026 dengan membaca diff tiap PR beserta kode akhirnya di `develop`. Setiap perbaikan didahului test yang gagal pada kode lama, lalu seluruh test dijalankan ulang.

Tabel B.2c. Hasil Review Pasca-Merge PR #8, #31, dan #50

| No | PR | Temuan | Tindak lanjut |
| :--- | :--- | :--- | :--- |
| 1 | #8 | `Otorisasi.wajibAdmin` memanggil `verifikasiToken`, lalu `verifikasiAdmin` yang mencari token yang sama sekali lagi. Setiap permintaan admin mengkueri tabel `sesi_login` dua kali, padahal B.1 No. 15 justru menghindari kueri ganda semacam ini | Diperbaiki pada commit `7937354`: sesi yang sudah diperiksa diteruskan ke `verifikasiAdmin`. Satu test baru memastikan `SesiLogin.cariSesiAktif` hanya dipanggil sekali |
| 2 | #8 | `config/env.js` mengubah variabel angka dengan `Number()` tanpa memeriksa hasilnya. Salah isi seperti `DURASI_SESI_JAM=abc` menjadi `NaN`, sehingga waktu kedaluwarsa sesi menjadi tanggal yang tidak sah, dan nilai yang hanya berisi spasi terbaca 0 | Diperbaiki pada commit `505d98e`: nilai kosong atau bukan angka memakai nilai bawaan, disertai peringatan di log server. Suite baru `KonfigurasiEnv` berisi 4 test |
| 3 | #8 | `POST /api/akun/login` tidak membatasi jumlah percobaan, sehingga kata sandi dapat ditebak berulang kali tanpa hambatan | Belum diperbaiki karena memerlukan pencatatan jumlah percobaan per akun atau per alamat IP. Dicatat pada B.3.3 No. 9 |
| 4 | #8 | Token sesi disimpan apa adanya pada kolom `sesi_login.token`. Bila isi basis data bocor, sesi yang masih aktif dapat langsung dipakai pihak lain | Belum diperbaiki. Perbaikannya adalah menyimpan hash SHA-256 dari token dan mencocokkan hash itu pada `cariSesiAktif`. Dicatat pada B.3.3 No. 10 |
| 5 | #31 | Riwayat penanganan menyimpan teks "Perubahan status laporan menjadi Perubahan status laporan menjadi Diproses". `catatLogAudit` meneruskan kalimat lengkap ke `LogAudit.catatPerubahanStatusLaporan`, yang menambahkan awalan yang sama. Penanganannya sudah ada pada PR #31, tetapi hilang ketika `LogAudit.js` tertimpa pada PR #32 (commit `b9fe310`) dan tidak ikut dipulihkan commit `448d0fb`. Test tidak menangkapnya karena `catatLogAudit` selalu diganti tiruan | Diperbaiki pada commit `a322183`: awalan dibuang di `catatLogAudit` sebelum diteruskan ke LogAudit. Tiga test baru, salah satunya memeriksa nilai yang benar-benar dikirim ke `INSERT INTO log_audit` |
| 6 | #31 | Test `validasiTransisiStatus` dari PR #31 ikut hilang pada PR #32, sehingga aturan urutan status tidak lagi punya uji unit sendiri | Dipulihkan pada commit `14ebf4a` |
| 7 | #31 | Mengirim status yang sama dengan status saat ini diperlakukan sebagai perubahan: `waktu_perubahan` diperbarui dan log audit bertambah walaupun tidak ada yang berubah, termasuk pada laporan yang sudah "Selesai" | Diperbaiki pada commit `a322183`: `ubahStatusLaporan` mengembalikan berhasil tanpa menulis apa pun. Satu test baru |
| 8 | #31 | `ubahStatusLaporan` membaca status, memvalidasi transisi, memperbarui laporan, lalu mencatat log audit sebagai empat langkah terpisah tanpa transaksi. Dua admin yang bertindak bersamaan dapat melewati aturan transisi, dan kegagalan pencatatan log meninggalkan perubahan status tanpa jejak audit | Belum diperbaiki karena `Laporan.getDetailLaporan` perlu dukungan penguncian baris lebih dulu. Dicatat pada B.3.3 No. 11 |
| 9 | #31 | Route `/api/admin/*` tidak memeriksa bentuk ID. ID yang bukan UUID ditolak PostgreSQL saat kueri dijalankan, dan route menjawab 500, bukan 404. Route listing dan notifikasi sudah memeriksa bentuk UUID | Belum diperbaiki karena test integrasi moderasi memakai ID bukan UUID dan harus ditulis ulang. Dicatat pada B.3.3 No. 12 |
| 10 | #50 | `kirimNotifikasi` menunggu pengiriman Web Push selesai, dan `kirimPesan` menunggu `kirimNotifikasi`. Akibatnya pengirim pesan ikut menunggu *push service*, dan permintaan kirim pesan tertahan selama *push service* belum menjawab | Diperbaiki pada commit `16bc6b2`: push dipicu tanpa ditunggu dan kegagalannya tetap dicatat. Satu test baru memakai push yang tidak pernah selesai |
| 11 | #50 | Langganan push tidak dihapus saat logout: tidak ada endpoint penghapusan dan View tidak membatalkan langganan peramban. Pada komputer bersama, peramban tetap menampilkan notifikasi `Pesan baru dari <nama>` milik akun yang sudah keluar sampai akun lain mengaktifkan notifikasi di peramban itu | Belum diperbaiki karena memerlukan endpoint baru dan pengujian di peramban dengan kunci VAPID. Dicatat pada B.3.3 No. 13 |
| 12 | #50 | `kirimNotifikasi` memanggil `Notifikasi.hitungBelumDibaca`, tetapi hasilnya tidak dipakai. Setiap pesan menambah satu kueri `COUNT` | Dibiarkan karena langkah itu bagian dari Algo-020 pada DPPL. Dicatat pada B.3.3 No. 14 |

Beberapa hal pada ketiga PR itu sudah baik dan tidak diubah: pesan galat login sama untuk surel yang tidak terdaftar dan kata sandi yang salah, token sesi dibangkitkan dari 32 byte acak, urutan status laporan divalidasi di server maupun di View, dan langganan push yang ditolak *push service* langsung dihapus.

### B.2.1 Profiling dan Optimasi

Pilih minimal satu fitur yang diprofil.

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | Katalog dan pencarian listing (UC13, UC14): `GET /api/katalog` → `KatalogController.getProduk` → `Barang.getKatalog`. Setiap permintaan menjalankan dua kueri, yaitu `COUNT(*)` untuk jumlah halaman dan kueri data 20 baris yang membawa subkueri foto utama. Fitur ini dipilih karena menjadi halaman beranda dan satu-satunya kueri yang tumbuh seiring jumlah listing |
| Alat | `EXPLAIN (ANALYZE, BUFFERS)` pada PostgreSQL 16.15, ditambah pengukuran waktu `process.hrtime` di Node.js 22.19 yang memanggil `Barang.getKatalog` asli. Tiap skenario dijalankan 40 kali setelah 3 kali pemanasan, lalu diambil mediannya. Data uji sintetis: 5.000 akun (100 diblokir), 50.000 listing (40.000 Tersedia, 7.500 Terjual, 2.500 Dinonaktifkan), dan 150.000 foto; tabel `barang` berukuran 25 MB. Pengukuran dilakukan pada basis data lokal terpisah di laptop Windows 11. Skrip dan keluaran mentahnya ada di [`assets/profiling/`](./assets/profiling/) |
| Temuan (sebelum) | (1) Indeks `barang_status` tidak terpakai karena 80% baris berstatus "Tersedia", sehingga beranda katalog selalu `Seq Scan` 50.000 baris lalu mengurutkan 39.500 baris (*top-N heapsort*) hanya untuk mengambil 20. Kueri datanya 19,1 ms dan membaca 3.010 *buffer*. (2) `ILIKE '%kata%'` tidak bisa memakai indeks B-tree, jadi pencarian memindai seluruh tabel dua kali, sekitar 30 ms untuk `COUNT(*)` dan 31 ms untuk data. (3) Pada halaman ke-500, subkueri foto utama dijalankan 10.000 kali untuk baris yang dilewati `OFFSET`, dan pengurutan tumpah ke disk (*external merge*, 5.432 kB) |
| Perbaikan | Tiga indeks ditambahkan pada [`src/database/schema.sql`](../../src/database/schema.sql) tanpa mengubah kueri maupun kode aplikasi. `barang_katalog_terbaru` adalah indeks parsial `(waktu_unggah DESC, id_barang) WHERE status = 'Tersedia'`, sehingga urutan "terbaru" dibaca langsung dari indeks. `barang_judul_trgm` dan `barang_deskripsi_trgm` adalah indeks GIN `pg_trgm` untuk `ILIKE`. Dua indeks trigram dibuat di dalam blok `DO` yang menangkap galat, jadi `npm run db:init` tetap berhasil pada PostgreSQL tanpa ekstensi `pg_trgm`. Ukuran ketiganya 1,6 MB, 5,5 MB, dan 8,3 MB |
| Hasil (sesudah) | Lihat Tabel B.2b. Beranda katalog turun dari 30,2 ms ke 11,9 ms dan pencarian dari 63,4 ms ke 10,1 ms. Kueri data beranda turun dari 19,1 ms ke 0,36 ms dengan 206 *buffer*, karena `Index Scan` berhenti setelah 21 baris |

Jika tidak ada perbaikan yang perlu dilakukan, jelaskan hasil profiling dan alasan kenapa fitur tersebut sudah memadai.

Tabel B.2b. Waktu `Barang.getKatalog` Sebelum dan Sesudah Indeks (median 40 kali, 50.000 listing)

| Skenario | Sebelum | Sesudah | Rencana eksekusi sesudah |
| :--- | :--- | :--- | :--- |
| A. Beranda katalog, urutan terbaru, halaman 1 | 30,2 ms | 11,9 ms | Kueri data memakai `Index Scan using barang_katalog_terbaru`; sisa waktunya adalah `COUNT(*)` (10,0 ms) |
| B. Cari "jas praktikum" (6.667 hasil) | 63,4 ms | 10,1 ms | `COUNT(*)` memakai `BitmapOr` dua indeks trigram; kueri data memakai indeks parsial |
| C. Kategori Kalkulator, harga Rp50.000 sampai Rp200.000, termurah | 23,7 ms | 17,0 ms | Tidak berubah (`Seq Scan` dan *top-N heapsort*). Selisihnya berasal dari derau pengukuran |
| D. Beranda katalog halaman 500 (`OFFSET 9980`) | 115,6 ms | 91,7 ms | Pengurutan ke disk hilang, tetapi subkueri foto tetap berjalan 10.000 kali |
| E. Cari kata yang tidak ada | 62,3 ms | 0,8 ms | Dua `Bitmap Index Scan` trigram langsung mengembalikan nol baris |

Dua hal sengaja belum diperbaiki. `COUNT(*)` masih memindai seluruh listing "Tersedia" pada setiap permintaan, dan sekarang menjadi porsi terbesar di skenario A. Skenario D masih lambat karena subkueri foto dihitung sebelum `OFFSET` diterapkan; perbaikannya adalah memilih 20 `id_barang` lebih dulu baru mengambil fotonya, atau mengganti `OFFSET` dengan paginasi berbasis kunci. Keduanya menuntut perubahan kueri di `Barang.getKatalog`, dan pada 50.000 listing seluruh skenario masih di bawah 120 ms, jadi kami menundanya. Ketiga indeks menambah sekitar 15 MB pada tabel 25 MB dan sedikit memperlambat penulisan listing, harga yang wajar untuk tabel yang jauh lebih sering dibaca daripada ditulis.

## B.3 Kendala dan Catatan Penting

Tuliskan kendala yang ditemui, fitur yang belum sempurna (*known issues*), serta hal yang perlu diketahui asisten saat menjalankan atau menilai aplikasi (misalnya akun uji khusus, urutan menjalankan, atau batasan).

### B.3.1 Yang perlu diketahui saat menjalankan aplikasi

Petunjuk lengkap, termasuk daftar variabel lingkungan, endpoint, dan tabel basis data, ada di [`src/README.md`](../../src/README.md). Ringkasnya, prasyaratnya Node.js 22 ke atas dan Docker, dengan urutan perintah berikut dari folder `src/`:

```bash
cp .env.example .env        # isi DB_PASSWORD dan KUNCI_ENKRIPSI_PESAN
docker compose up -d        # PostgreSQL 16 dan Mailpit
npm ci
npm run db:init             # membuat tabel dan indeks
npm run db:seed             # akun uji dan dokumen legal
npm run dev                 # http://localhost:3000
```

Beberapa hal yang sering membuat aplikasi tampak rusak padahal hanya belum diatur:

- `DB_PASSWORD` wajib diisi, nilainya bebas. Docker Compose menolak berjalan bila variabel ini kosong.
- `KUNCI_ENKRIPSI_PESAN` wajib 64 karakter hex. Tanpa kunci ini pendaftaran dan katalog tetap jalan, tetapi mengirim atau membuka pesan gagal dengan galat server. Perintah pembuatnya tertulis di `.env.example`.
- `VAPID_*` boleh kosong. Notifikasi di dalam aplikasi tetap muncul; yang dilewati hanya notifikasi push peramban.
- Kode verifikasi pendaftaran tidak dikirim ke surel sungguhan. Kode itu masuk ke Mailpit dan dapat dibaca di `http://localhost:8025`.
- Port yang dipakai: 3000 (aplikasi), 5432 (PostgreSQL), 1025 dan 8025 (Mailpit).
- `npm run db:seed` hanya membuat akun dan dokumen legal. Katalog masih kosong setelah seed, jadi untuk mencoba pencarian, percakapan, dan laporan, masuklah lebih dulu sebagai penjual dan buat satu atau dua listing.

Lima akun uji berikut dibuat oleh seed. Semuanya data fiktif dengan kata sandi `ujicoba123`.

| Surel | Peran dan status | Dipakai untuk mencoba |
| :--- | :--- | :--- |
| `admin.uji@itb.ac.id` | Admin, terverifikasi | Dasbor laporan di `/admin-laporan` (UC20 sampai UC24) |
| `penjual.uji@itb.ac.id` | Pengguna, terverifikasi | Membuat dan mengelola listing (UC07 sampai UC12) |
| `pembeli.uji@itb.ac.id` | Pengguna, terverifikasi | Katalog, pencarian, percakapan, laporan (UC13 sampai UC19) |
| `diblokir.uji@itb.ac.id` | Pengguna, diblokir | Penolakan login akun terblokir (KF53) dan buka blokir (UC24) |
| `belum.uji@itb.ac.id` | Pengguna, belum terverifikasi | Penolakan login sebelum verifikasi dan kirim ulang kode (UC02) |

Alur percakapan paling mudah dicoba dengan dua peramban atau satu jendela biasa dan satu jendela penyamaran: pembeli membuka detail listing lalu menekan Hubungi Penjual, dan penjual membalas dari `/percakapan`.

Selain cara lokal di atas, versi daring tersedia di **https://itbeli.vercel.app** (B.1 No. 39). Versi ini memakai basis data terpisah yang kosong dan tidak memuat lima akun uji di atas, jadi akun harus didaftarkan dengan surel ITB. Kode verifikasinya dikirim ke kotak surat sungguhan (periksa juga folder *spam*). Penilaian tetap memakai cara lokal, sesuai ketentuan A.2.

### B.3.2 Kendala selama pengerjaan

Lima modul dikerjakan paralel di branch masing-masing, dan hampir semua kendala muncul di titik temu antarmodul.

- **Berkas yang disentuh banyak modul.** `Barang.js`, `NotifikasiController.js`, `schema.sql`, dan `app.js` diubah oleh tiga sampai empat anggota. PR listing penjual pertama (#28, 34 berkas dengan 838 baris terhapus) ditutup tanpa merge, lalu diajukan ulang sebagai #32 dengan perubahan yang lebih sempit (24 berkas). Setelah #32 masuk, implementasi UC21 perlu disinkronkan lagi (commit `448d0fb`), dan route katalog serta percakapan harus digabung manual di `app.js` (commit `78b17bb`). Review pasca-merge masih menemukan dua sisa penimpaan itu, yaitu teks log audit yang tertulis ganda dan satu test UC21 yang hilang (Tabel B.2c No. 5 dan 6).
- **Review PR.** Reviewer sudah ditunjuk pada 17 PR, tetapi PR digabung sebelum ada review yang dikirim. Review baru dilakukan setelah merge terhadap tiga PR contoh (Tabel B.2c), sehingga PR lainnya belum pernah di-review anggota lain.
- **Format data antarmodul.** Tombol Laporkan pada detail listing semula belum mengikuti format objek laporan Modul E dan baru disesuaikan pada commit `f3c05f1`. Kontrak antarmodul sejauh ini tertulis di deskripsi PR, belum di satu dokumen bersama.
- **Privasi pesan pada notifikasi.** Versi awal notifikasi pesan baru berbentuk `<nama>: <cuplikan pesan>`. Karena tabel `notifikasi` menyimpan teks polos, hal itu melanggar KF36 dan dihapus pada commit `0863fd5`.
- **Perbedaan lingkungan anggota.** `schema.sql` yang tersimpan sebagai UTF-8 dengan BOM dari salah satu editor ditolak PostgreSQL saat `db:init`; `init.js` sekarang membuang BOM lebih dulu (commit `ebe2a77`).
- **Deploy ke Vercel.** Tiga hal yang berjalan di lokal tidak berlaku di Vercel: `express.static()` diabaikan, disk *function* hanya bisa dibaca, dan satu permintaan dibatasi 4,5 MB. Akibatnya berkas View perlu disalin ke `public/` saat build, penyimpanan berkas dipindah ke Vercel Blob, dan C45 tidak boleh lagi membuat folder saat dimuat karena hal itu menggagalkan seluruh aplikasi (B.1 No. 39 dan 40). Variabel basis data dari Neon juga bersifat rahasia dan tidak dapat dibaca dari luar Vercel, sehingga pembuatan skema dipindah ke tahap build.
- **Waktu.** Dari 73 commit kode, 63 bertanggal 4 sampai 9 November 2026, dan 33 di antaranya jatuh pada 9 November, hari ketika semua PR Modul C dan D masuk. Sepuluh sisanya adalah indeks basis data pada 11 November dan sembilan commit pada 13 November: lima tindak lanjut review, penerimaan surel subdomain ITB, penggantian tema warna menjadi biru ITB, dan dua commit logo.

### B.3.3 Fitur yang belum sempurna

1. Detail listing (I-06) belum punya *lightbox* foto dan tautan ke profil penjual (B.1 No. 26).
2. Pesan baru tidak muncul seketika. Halaman percakapan mengambil pesan tiap 4 detik dan daftar percakapan tiap 10 detik, sedangkan panel notifikasi tiap 30 detik. Belum ada WebSocket.
3. Laporan terhadap percakapan menyusun metadata privasi (KF37) lewat `susunMetadataPercakapan`, tetapi metadata itu belum disimpan karena tabel `laporan` tidak punya kolomnya. Yang tersimpan hanya ID percakapan pada `objek_dilaporkan`. Isi pesan tetap tidak pernah ikut ke laporan.
4. `kirimPesan` menyimpan pesan dan memperbarui waktu percakapan tanpa transaksi. Bila langkah kedua gagal, pesan tetap tersimpan dan hanya urutan daftar percakapan yang tertinggal.
5. Katalog halaman jauh masih lambat dan `COUNT(*)` berjalan pada setiap permintaan (B.2.1).
6. Kartu listing pada profil (I-09) masih dibuat `HalamanProfil.buatKartu`, belum memakai C06 KartuProduk (B.1 No. 10). `Penjual.getIdentitas` sudah ada tetapi belum dipanggil modul mana pun.
7. Kategori dan lokasi COD berupa daftar tetap di kode (B.1 No. 19).
8. Test otomatis tidak mengeksekusi SQL sungguhan, jadi kesalahan kueri hanya tertangkap lewat pengujian manual.
9. `POST /api/akun/login` belum membatasi jumlah percobaan login (Tabel B.2c No. 3).
10. Token sesi tersimpan tanpa di-hash pada tabel `sesi_login` (Tabel B.2c No. 4).
11. Perubahan status laporan dan pencatatan log auditnya belum berada dalam satu transaksi, dan pemeriksaan urutan statusnya belum mengunci baris laporan (Tabel B.2c No. 8).
12. Route `/api/admin/*` menjawab 500, bukan 404, untuk ID yang bukan UUID (Tabel B.2c No. 9).
13. Langganan notifikasi push tidak dihapus saat logout, sehingga peramban di komputer bersama masih dapat menerima notifikasi akun sebelumnya (Tabel B.2c No. 11).
14. `kirimNotifikasi` menjalankan satu kueri `COUNT` yang hasilnya tidak dipakai (Tabel B.2c No. 12).
15. Masuk dengan Google belum aktif di https://itbeli.vercel.app karena kredensial OAuth Google belum dibuat untuk alamat itu. Tombolnya tersembunyi, dan masuk dengan surel serta kata sandi tetap berjalan (B.1 No. 41).

### B.3.4 Batasan

- Saat dijalankan lokal, berkas unggahan disimpan di disk `src/uploads/` dan tidak ikut repository. Menghapus folder itu menghilangkan foto listing dan bukti laporan walaupun datanya masih ada di basis data. Versi daring menyimpannya di Vercel Blob.
- Aplikasi ditujukan untuk peramban berbasis Chromium sesuai DPPL 2.1. iOS dan iPadOS tidak didukung.
- Server lokal berjalan lewat HTTP pada `localhost`. Notifikasi push di luar `localhost` membutuhkan HTTPS, yang sudah tersedia pada versi daring.
- Versi daring menolak permintaan di atas 4,5 MB, sehingga total foto dalam satu kali simpan listing harus di bawah ukuran itu. Server di sana tidak menyala terus, jadi permintaan pertama setelah lama tidak dipakai bisa sedikit lebih lambat.
- Sesi login berlaku 24 jam dan kode verifikasi 15 menit; keduanya dapat diubah lewat `DURASI_SESI_JAM` dan `DURASI_KODE_MENIT`.

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| 13525124 | Sulthan Dhiyazka Suwandi | **Modul D, Percakapan dan Notifikasi (UC16, UC17, UC18).** Tabel `percakapan`, `pesan`, `notifikasi`, `langganan_push`; kelas C08, C09, C18, C33, C34, C35, C44, dan `LanggananPush`; bagian notifikasi dalam aplikasi dan Web Push pada C19; enkripsi AES-256-GCM pada C42; Service Worker; 54 test Modul D. Di luar modul: masuk dengan Google ITB (`SsoController`, rute `/api/akun/sso/*`, `TombolSSO.js`, `HalamanLengkapiSSO.js`, halaman `lengkapi-sso`) beserta 42 test (B.1 No. 41); tampilan baru dengan token warna, `Kerangka.js`, layar pembuka, dan transisi halaman (B.1 No. 42); workflow GitHub Actions `issue-tracker` dan issue #48. PR #45, #46, #47, #49 sampai #54, #66, #67, #68 | 20% |
| 13525034 | Dhanesworo Muhammad Datiputro | **Modul A, Akun dan Otentikasi (UC01 sampai UC06).** Kerangka proyek: Express, `config/`, Docker Compose (PostgreSQL dan Mailpit), `db:init`, `db:seed`, CSS bersama. Kelas C01, C02, C12, C13, C22, C23 sampai C28, C40, C41, C43, dan bagian bcrypt pada C42; middleware `wajibLogin` dan `wajibAdmin` yang dipakai semua modul; 142 test Modul A; B.1 No. 1 sampai 12 dan B.5 Modul A; penerimaan surel subdomain ITB dan tema warna biru ITB pada 13 November. Di luar modul: deploy ke Vercel dengan Neon dan Gmail SMTP (`vercel.json`, `.vercelignore`, `scripts/salinStatis.js`, `db:seed-legal`) serta mode Vercel Blob pada C45 beserta 8 test (B.1 No. 39, 40). PR #8, #21, #25, #26, #55, #56, #57, #59, #70, #71 | 20% |
| 13525115 | Nazhif Hilmi Kistijantoro | **Modul B, Listing Penjual (UC07 sampai UC12).** Kelas C03, C04, C14; `ListingService`, `ListingPenjual`, `ReferensiListing`, dan `ListingUI.js`; halaman Listing Saya, Formulir Listing, dan detail pemilik; validasi foto dan transaksi listing; 26 test Modul B. PR #32 | 20% |
| 13525121 | I Made Adi Kusuma Ardana | **Modul C, Katalog dan Pencarian (UC13, UC14, UC15).** Kelas C05, C06, C07, C15, C16, C17; `Barang.getKatalog` dan `Barang.getDetailKatalog`; halaman katalog dan detail listing, termasuk tombol Hubungi Penjual dan Laporkan; 21 test Modul C. PR #44 | 20% |
| 13525106 | Ghaniyul Amri Caulava | **Modul E, Laporan dan Moderasi (UC19 sampai UC24).** Kelas C10, C11, C20, C21, C36 sampai C39, C45, serta versi awal C29 Barang dan C30 FotoBarang; surel peringatan penghapusan dan penangguhan pada C19; dasbor admin I-13 dan I-14; 104 test Modul E; B.5 Modul E. PR #22, #23, #24, #27, #29, #31, #33. Di luar modul: review pasca-merge PR #8, #31, dan #50 beserta perbaikannya dan 11 test tambahan (5 di Modul A, 1 di Modul D, 5 di Modul E; Tabel B.2c), serta logo ITBELI beserta favicon dan pemasangannya pada top bar | 20% |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Struktur folder `src/` mengikuti pembagian komponen pada DPPL 2.3: `views/` berisi View (C01 sampai C12) yang berjalan di peramban, `controllers/` dan `routes/` berisi Controller (C13 sampai C22) beserta pemetaan HTTP-nya, `models/` berisi Model (C23 sampai C40), sedangkan `pendukung/`, `integrasi/`, dan `penyimpanan/` berisi C41 sampai C45. Hanya berkas di `models/` yang memuat SQL.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | HalamanOtentikasi | Kelas JavaScript sisi klien (View) dan tiga halaman HTML | `src/views/js/HalamanOtentikasi.js` - `HalamanOtentikasi`; `src/views/pages/masuk.html` (I-01), `src/views/pages/daftar.html` (I-02), `src/views/pages/verifikasi.html` (I-03) | Atribut (`nama`, `nim`, `email`, `kataSandi`, `setujuKebijakan`, `kodeVerifikasi`, `sisaWaktu`, `token`) menjadi properti objek. Operasi menjadi *method* penangan *event* formulir yang memanggil `/api/akun/*` melalui `src/views/js/api.js`. Token sesi disimpan di `localStorage` dan dihapus oleh `hapusTokenLokal` |
| C02 | HalamanProfil | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanProfil.js` - `HalamanProfil`; `src/views/pages/profil.html` (I-09) | `muatProfil` memanggil `GET /api/akun/profil`, `bukaPengaturanAkun` memanggil `GET /api/akun/tautan-kebijakan`, dan tombol Keluar memanggil `HalamanOtentikasi.kirimPermintaanLogout` (I09-O05). Atribut `daftarKartuProduk` berisi elemen kartu listing yang dibuat `HalamanProfil.buatKartu` (lihat B.1 No. 10) |
| C03 | HalamanListingPenjual | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanListingPenjual.js` - `HalamanListingPenjual`; `src/views/pages/listing-saya.html` (I-08); `src/views/js/ListingUI.js` (kartu, dialog, *toast*) | `muat` memanggil `GET /api/barang/saya`. `render` mengelompokkan listing ke tab Tersedia dan Terjual beserta jumlahnya (padanan `kelompokkanBerdasarkanStatus` dan `pilihTab`). `aksi(barang, aksi)` memeriksa status terbaru, menampilkan dialog konfirmasi, lalu memanggil `DELETE /api/barang/:id` atau `PATCH /api/barang/:id/status` (UC10, UC11, UC12). Nama operasi berbeda dari rancangan (lihat B.1 No. 20) |
| C04 | FormulirBarang | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/FormulirBarang.js` - `FormulirBarang`; `src/views/pages/listing-form.html` (I-07); `src/views/js/DetailListingPenjual.js` dan `src/views/pages/detail.html` (tujuan setelah simpan) | `mulai` memuat pilihan kategori dan lokasi dari `GET /api/barang/formulir`, atau dari `GET /api/barang/:id` bersama data listing bila `?id=` ada (UC09). `tambahFoto`, `pindah`, dan `renderFoto` mengatur 1 sampai 5 foto beserta urutannya. `validasi` menandai isian kosong (KF18), dan `simpan` mengirim `multipart/form-data` ke `POST /api/barang` atau `PUT /api/barang/:id` (lihat B.1 No. 20, 21) |
| C05 | HalamanKatalog | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanKatalog.js` - `HalamanKatalog`; `src/views/pages/katalog.html` (I-04, I-05); `src/views/js/layoutKatalog.js` (kotak cari di *topbar*) | Kriteria (`q`, `kategori`, `hargaMin`, `hargaMaks`, `lokasi`, `urut`, `halaman`) dibaca dari dan ditulis ke URL. `muat` memanggil `GET /api/katalog`, dan `render` menampilkan kartu, jumlah hasil, paginasi 20 listing per halaman (KF28), serta keadaan "Barang tidak ditemukan" (KF29). `keHalaman` berpindah halaman dan menggulir ke atas (lihat B.1 No. 25) |
| C06 | KartuProduk | Objek JavaScript sisi klien dengan satu fungsi | `src/views/js/KartuProduk.js` - `KartuProduk.buat(barang)` | Menghasilkan elemen tautan berisi foto utama, harga, judul, lokasi COD, kategori, dan nama penjual; mengklik kartu membuka `/barang?id=` (UC15). Dipakai HalamanKatalog. Halaman Listing Saya memakai `ListingUI.kartu` dan profil memakai `HalamanProfil.buatKartu` (lihat B.1 No. 10, 25) |
| C07 | HalamanDetailBarang | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanDetailBarang.js` - `HalamanDetailBarang`; `src/views/pages/barang.html` (I-06) | `mulai` memanggil `GET /api/katalog/:id`. `render` dan `renderGaleri` menampilkan data dan foto listing. `renderAksi` memilih tombol menurut keadaan: Ubah Listing untuk pemilik, Hubungi Penjual untuk listing tersedia (`hubungiPenjual` → `POST /api/percakapan`, UC16), keterangan "sudah terjual", dan Laporkan yang membuka formulir laporan (UC19). *Lightbox* dan profil penjual belum ada (lihat B.1 No. 26) |
| C08 | HalamanPercakapan | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanPercakapan.js` - `HalamanPercakapan`; `src/views/pages/percakapan.html` (I-10) | Sepuluh operasi Tabel 4.1 ada dengan nama yang sama: `bukaDaftarPercakapan`, `showDaftarPercakapan`, `bukaPercakapan`, `showPercakapan`, `tampilkanUrutanPesan`, `gulirKePesanTerakhir`, `kirimPesan`, `validasiInputKosong`, `tampilkanAksesDitolak`, `tampilkanTautanKebijakan`. Tambahannya `mulaiPercakapanDariBarang` dan `aturPolling`, yang mengambil pesan baru tiap 4 detik dan daftar percakapan tiap 10 detik |
| C09 | PanelNotifikasi | Kelas JavaScript sisi klien (View) yang memasang diri ke *topbar*; Service Worker | `src/views/js/PanelNotifikasi.js` - `PanelNotifikasi`; `src/views/sw.js` | `tampilkanDaftarNotifikasi` dan `tampilkanPenandaBelumDibaca` sesuai Tabel 4.1 (I-11). Panel dibangun lewat JavaScript pada halaman yang memuat skrip ini, mengambil data dari `GET /api/notifikasi` tiap 30 detik, dan menandai dibaca lewat `PATCH /api/notifikasi/:id/baca` atau `/baca-semua`. `aktifkanNotifikasiPeramban` mendaftarkan Service Worker dan mengirim langganan ke `POST /api/notifikasi/langganan-push` |
| C10 | FormulirLaporan | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/FormulirLaporan.js` - `FormulirLaporan`; `src/views/pages/laporan-form.html` (I-12); `src/views/pages/laporan.html` (pengalihan) | Enam operasi Tabel 4.1 ada dengan nama yang sama: `tampilkanFormulirLaporan`, `unggahBukti`, `validasiIsianWajib`, `tandaiIsianKosong`, `kirimLaporan`, `tampilkanNotifikasi`. `kirimLaporan` mengirim `multipart/form-data` ke `POST /api/laporan` (lihat B.1 No. 34) |
| C11 | DasborAdmin | Kelas JavaScript sisi klien (View) dan dua halaman HTML | `src/views/js/DasborAdmin.js` - `DasborAdmin`; `src/views/pages/admin-laporan.html` (I-13); `src/views/pages/admin-detail.html` (I-14) | Ketiga belas operasi Tabel 4.1 ada dengan nama yang sama, antara lain `bukaDaftarLaporan`, `filterLaporan`, `bukaDetailLaporan`, `onClickUbahStatus`, `onClickHapusListing`, `onClickBlokirAkun`, `onClickBukaBlokir`, `tampilkanModalKonfirmasi`, dan `konfirmasiTindakan`. Tambahannya `muatStatistik` untuk kartu jumlah laporan dan `validasiTransisiStatus` yang menonaktifkan pilihan status mundur (lihat B.1 No. 31). Seluruh panggilan menuju `/api/admin/*` |
| C12 | HalamanDokumenLegal | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanDokumenLegal.js` - `HalamanDokumenLegal`; `src/views/pages/legal.html` (I-15) | `bukaDokumen` memanggil `GET /api/dokumen-legal/:jenis` (tab I15-O01), `tampilkanDokumen` merender judul, versi, isi per bagian, dan daftar isi otomatis (I15-O02, O03, O05), serta `sorotKlausaPrivasi` menyorot klausul privasi percakapan (I15-O04, KF38). Isi ditampilkan melalui `textContent` agar aman dari XSS |
| C13 | AkunController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/AkunController.js` - `AkunController`; `src/routes/akunRoutes.js` (`/api/akun/*`) | Tanpa atribut, sesuai DPPL. Seluruh operasi Tabel 4.1 diimplementasikan dengan nama yang sama: Algo-002 `daftarAkun`, Algo-003 `buatKodeVerifikasi`, Algo-004 `verifikasiAkun`, Algo-005 `kirimUlangKode`, Algo-006 `login`, serta `logout`, `getProfil`, dan operasi pendukungnya. *Route* memetakan hasil ke HTTP: `POST /daftar`, `/verifikasi`, `/kirim-ulang`, `/login`, `/logout`, `GET /profil`, `/tautan-kebijakan` (lihat B.1 No. 3, 4, 5, 8). Ditambah `masukDenganSso` dan `daftarAkunSso` yang dipanggil `SsoController` lewat rute `/api/akun/sso/*` (lihat B.1 No. 41) |
| C14 | BarangController | Objek berisi 7 *handler* Express, *route*, dan kelas layanan | `src/controllers/BarangController.js` (`getDataFormulir`, `getListingSaya`, `getBarang`, `buatBarang`, `updateBarang`, `deleteBarang`, `ubahStatusBarang`); `src/routes/barangRoutes.js` (`/api/barang/*`); `src/services/ListingService.js` - `ListingService`, `validasiData`, `validasiFoto` | Tujuh operasi utama Tabel 4.1 menjadi *handler* dengan nama yang sama. Operasi lainnya dipetakan sebagai berikut: `validasiKelengkapanIsian` → `validasiData`; `validasiFoto` → `validasiFoto`; `verifikasiKepemilikan` → fungsi `milik`; `simpanFoto` → `PenyimpananBerkas.simpan` di dalam `ListingService.simpan`; `getIdPenjualDariSesi` → `Otorisasi.wajibLogin`. Route memakai `multer` (maksimal 5 berkas, 5 MB per berkas) dan menolak ID yang bukan UUID (lihat B.1 No. 16, 17) |
| C15 | KatalogController | Modul berisi 2 *handler* Express dan *route* | `src/controllers/KatalogController.js` (`getProduk`, `getDetailProduk`); `src/routes/katalogRoutes.js` (`GET /api/katalog`, `GET /api/katalog/:id`) | `getProduk` memanggil FilterController, PencarianController, lalu `Barang.getKatalog`, dan mengembalikan daftar, data paginasi, serta kriteria yang berlaku (UC13, UC14). `getDetailProduk` melayani UC15 dan menambahkan penanda `milikSendiri`. `paginasi` dan `urutkanHasil` pindah tempat (lihat B.1 No. 22, 24) |
| C16 | PencarianController | Modul fungsi | `src/controllers/PencarianController.js` (`normalisasiKataKunci`, `pecahKataKunci`, `siapkanPencarian`) | `normalisasiKataKunci` sesuai Tabel 4.1: huruf kecil, spasi dirapikan, maksimal 100 karakter. `cocokkanKataKunci` diwujudkan `siapkanPencarian` yang memecah kata kunci menjadi paling banyak 5 kata; pencocokannya dilakukan `Barang.getKatalog` dengan `ILIKE` pada judul dan deskripsi (KF25; lihat B.1 No. 23) |
| C17 | FilterController | Modul fungsi | `src/controllers/FilterController.js` (`validasiFilter`, `hitungPaginasi`, konstanta `UKURAN_HALAMAN`, `URUTAN`) | `validasiParameterFilter` diwujudkan `validasiFilter`: memeriksa harga tidak negatif, harga minimum tidak melebihi maksimum, urutan `terbaru`, `termurah`, atau `termahal`, dan nomor halaman. `filterCategory`, `filterPrice`, dan `filterLocation` menjadi klausa `WHERE` di `Barang.getKatalog` (KF26, KF27, KF28; lihat B.1 No. 23) |
| C18 | PercakapanController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/PercakapanController.js` - `PercakapanController`; `src/routes/percakapanRoutes.js` (`POST /api/percakapan`, `GET /api/percakapan`, `GET /api/percakapan/:id`, `POST /api/percakapan/:id/pesan`) | Sembilan operasi Tabel 4.1 ada dengan nama yang sama: Algo-016 `mulaiPercakapan`, Algo-017 `bukaPercakapan`, Algo-018 `kirimPesan`, Algo-019 `getDaftarPercakapan`, serta `verifikasiPeserta`, `enkripsiPesan`, `dekripsiPesan`, `ambilCuplikanPesanTerakhir`, dan `hitungPesanBelumDibaca`. Parameter `token` diganti `idAkun` dan hasilnya berbentuk `{ berhasil, status, data atau pesan }` (lihat B.1 No. 15, 29, 30) |
| C19 | NotifikasiController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/NotifikasiController.js` - `NotifikasiController`; `src/routes/notifikasiRoutes.js` (`/api/notifikasi/*`) | Lima operasi Tabel 4.1 ada dengan nama yang sama: `kirimEmailVerifikasi` (KF06, dipakai Modul A), `kirimNotifikasi` (Algo-020) dan `kirimPushNotifikasi` (KF34, Modul D), serta `kirimPeringatanPenghapusan` dan `kirimPesanPenangguhan` (KF52, Modul E). Enam operasi tambahan melayani panel notifikasi dan langganan push. `kirimNotifikasi` memicu push tanpa menunggu hasilnya (lihat B.1 No. 28, 36) |
| C20 | LaporanController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/LaporanController.js` - `LaporanController`; `src/routes/laporanRoutes.js` (`POST /api/laporan`) | Delapan operasi Tabel 4.1 ada dengan nama yang sama. Algo-021 `buatLaporan` memvalidasi data (KF43) dan bukti JPG atau PNG maksimal 5 MB (KF44), lalu menyimpan laporan, bukti, dan catatan LogAudit dalam satu transaksi. `susunMetadataPercakapan` tidak menyertakan isi pesan (KF37). Nilai kembaliannya berupa objek berkode pesan (lihat B.1 No. 33) |
| C21 | ModerasiController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/ModerasiController.js` - `ModerasiController`; `src/routes/moderasiRoutes.js` (`/api/admin/*`, 9 endpoint) | Dua belas operasi Tabel 4.1 ada dengan nama yang sama: `otorisasiAdmin` (KF56), `getAllLaporan` dan `filterByStatus` (UC20), `getDetailLaporan`, `ubahStatusLaporan` (UC21), `hapusListingDilaporkan` (UC22), `blokirAkun` dan `nonaktifkanListingPengguna` (UC23), `bukaBlokirAkun` dan `pulihkanListingPengguna` (UC24), `catatLogAdmin`, `catatLogAudit`. Hapus listing dan blokir akun berjalan dalam transaksi; surel pemberitahuan dikirim setelah transaksi berhasil. `catatLogAudit` memilih operasi LogAudit dari awalan teks tindakan dan hanya meneruskan status, ID barang, atau ID akun. Tambahannya `getStatistik` (lihat B.1 No. 31, 33) |
| C22 | DokumenLegalController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/DokumenLegalController.js` - `DokumenLegalController`; `src/routes/dokumenLegalRoutes.js` (`GET /api/dokumen-legal/:jenis`) | `getDokumen` memvalidasi jenis terhadap daftar tetap (`kebijakan-privasi`, `ketentuan-penggunaan`) sebelum memanggil `DokumenLegal.getVersiTerbaru`, sehingga jenis lain langsung ditolak (404). `getKlausaPrivasi` mengambil klausul dari Kebijakan Privasi yang berlaku |
| C23 | Akun | Kelas Model (Entity) & Tabel DB | `src/models/Akun.js` - `Akun`, `src/database/schema.sql` (tabel `akun`), `src/database/seed.js` (akun uji) | Atribut menjadi kolom tabel `akun` (indeks unik `LOWER(email)`, `CHECK` untuk `status_akun` dan `peran`). Operasi menjadi query SQL berparameter: `simpan` (Algo-025), `cariByEmail` (Algo-026), `cariById`, `perbaruiStatusAkun`, `getStatusBlokir`, `getSyaratTidakDiblokir`. `getStatusAkun` mengutamakan status blokir dan `getDataIdentitas` hanya mengembalikan nama, NIM, dan surel. `blokir` dan `bukaBlokir` dipakai Modul E untuk pemblokiran dan pembukaan blokir akun (UC23, UC24). `perbaruiKataSandiHash` ditambahkan untuk masuk dengan Google (lihat B.1 No. 41) |
| C24 | Pembeli | Kelas Model (Entity Turunan) | `src/models/Pembeli.js` - `Pembeli extends Akun` | Tanpa atribut dan operasi tambahan, sesuai DPPL 5.24. Disimpan pada tabel `akun` yang sama dengan `peran = 'Pengguna'` (*single table inheritance*) |
| C25 | Penjual | Kelas Model (Entity Turunan) | `src/models/Penjual.js` - `Penjual extends Akun` | `getIdentitas` (Algo-027) mengambil identitas publik penjual dari tabel `akun`. Saat ini belum dipanggil modul lain: detail listing (Modul C) mengambil nama penjual langsung melalui JOIN pada `Barang.getDetailKatalog` |
| C26 | Admin | Kelas Model (Entity Turunan) | `src/models/Admin.js` - `Admin extends Akun` | `verifikasiPeran` (Algo-028) memeriksa `peran = 'Admin'` dan akun tidak diblokir. Dipanggil `Otorisasi.verifikasiAdmin` untuk melindungi endpoint moderasi (KF56). Disimpan pada tabel `akun` dengan `peran = 'Admin'` |
| C27 | TokenVerifikasi | Kelas Model (Entity) & Tabel DB | `src/models/TokenVerifikasi.js` - `TokenVerifikasi`, `src/database/schema.sql` (tabel `token_verifikasi`) | Atribut menjadi kolom tabel, dengan `status_pakai` bernilai `Aktif`, `Terpakai`, atau `Hangus`. `simpan` dan `cariTokenAktif` (Algo-029) berupa query SQL, `cocokkanKode` dan `sudahKedaluwarsa` dihitung pada objek, sedangkan `tandaiTerpakai` (kode tidak dapat dipakai ulang) dan `tandaiHangus` (saat kirim ulang) mengubah `status_pakai` |
| C28 | SesiLogin | Kelas Model (Entity) & Tabel DB | `src/models/SesiLogin.js` - `SesiLogin`, `src/database/schema.sql` (tabel `sesi_login`) | `buatToken` membangkitkan token acak 32 byte (lihat B.1 No. 6). `simpan` mencatat sesi berlaku `DURASI_SESI_JAM` (bawaan 24 jam, KF11). `cariSesiAktif` (Algo-030) hanya mengambil sesi aktif yang belum kedaluwarsa. `nonaktifkan` dipakai saat logout (KF12), dan `nonaktifkanByAkun` (Algo-031) dipakai Modul E untuk mencabut seluruh sesi saat pemblokiran akun |
| C29 | Barang | Kelas Model (Entity) dan tabel basis data | `src/models/Barang.js` - `Barang`; `src/models/ListingPenjual.js` - `ListingPenjual` (`kunci`, `update`, `setStatus`); `src/database/schema.sql` (tabel `barang` dan 5 indeksnya) | Atribut menjadi kolom tabel `barang` dengan `CHECK` status `Tersedia`, `Terjual`, atau `Dinonaktifkan`. Operasi Tabel 4.1 yang ada dengan nama sama: `simpan`, `cariById`, `getListingPenjual`, `getStatus`, `getKatalog`, `hapus`, `nonaktifkanByPemilik`, `pulihkanKatalog`. `getKatalog` hanya memuat listing "Tersedia" milik akun yang tidak diblokir (KF30, KF54). `setStatus` berada di `ListingPenjual`, dan `getDetailKatalog` ditambahkan untuk UC15 (lihat B.1 No. 9, 18, 24, 35) |
| C30 | FotoBarang | Kelas Model (Entity) dan tabel basis data | `src/models/FotoBarang.js` - `FotoBarang`; `src/models/ListingPenjual.js` - `ListingPenjual.galeri`; `src/database/schema.sql` (tabel `foto_barang`) | `validasiFormat`, `validasiUkuran` (maksimal 5 MB), `simpan`, `getGaleri`, dan `hapus` sesuai Tabel 4.1. Baris foto ikut terhapus lewat `ON DELETE CASCADE` saat listing dihapus, sedangkan berkasnya dihapus `PenyimpananBerkas.hapus`. `perbaruiGaleri` dan `getFotoUtama` pindah tempat (lihat B.1 No. 18) |
| C31 | Kategori | Daftar tetap (digabung dengan C32) | `src/models/ReferensiListing.js` - `kategori` | Enam nilai: Jas praktikum, Buku kuliah, Alat laboratorium, Kalkulator, Jaket himpunan, Perlengkapan kos. `getDaftarKategori` dilayani `GET /api/barang/formulir`, dan `validasiKategori` oleh pemeriksaan `includes` di `ListingService.validasiData`. Tidak ada tabel `kategori` (lihat B.1 No. 19) |
| C32 | LokasiCOD | Daftar tetap (digabung dengan C31) | `src/models/ReferensiListing.js` - `lokasi` | Enam nilai: Labtek V, Labtek VI, Labtek X, Gedung Oktagon, Perpustakaan Pusat, Gerbang Belakang. `getDaftarLokasi` dan `validasiLokasi` diwujudkan dengan cara yang sama seperti C31. Tidak ada tabel `lokasi_cod` maupun atribut `kampus` (lihat B.1 No. 19) |
| C33 | Percakapan | Kelas Model (Entity) dan tabel basis data | `src/models/Percakapan.js` - `Percakapan`; `src/database/schema.sql` (tabel `percakapan`) | Delapan operasi Tabel 4.1 ada dengan nama yang sama. `UNIQUE (id_barang, id_pembeli, id_penjual)` menjamin satu ruang per kombinasi (KF31), dan `cekPeserta` menjadi dasar penolakan akses pihak luar (KF35). `id_barang` memakai `ON DELETE SET NULL`, sehingga percakapan tetap ada setelah listing dihapus |
| C34 | Pesan | Kelas Model (Entity) dan tabel basis data | `src/models/Pesan.js` - `Pesan`; `src/database/schema.sql` (tabel `pesan`) | `getDaftarPesan`, `simpanPesan`, `getCuplikanPesanTerakhir`, dan `hitungPesanBelumDibaca` sesuai Tabel 4.1. Kolom `isi_pesan_terenkripsi` hanya berisi keluaran `Kriptografi.enkripsi` (KF36). `tandaiDibaca` ditambahkan (lihat B.1 No. 29) |
| C35 | Notifikasi | Kelas Model (Entity) dan tabel basis data | `src/models/Notifikasi.js` - `Notifikasi`; `src/database/schema.sql` (tabel `notifikasi`) | `simpan` dan `hitungBelumDibaca` sesuai Tabel 4.1 (KF34). Ditambah `getDaftarByAkun` (50 notifikasi terbaru), `tandaiDibaca`, dan `tandaiSemuaDibaca` (lihat B.1 No. 28) |
| C36 | Laporan | Kelas Model (Entity) dan tabel basis data | `src/models/Laporan.js` - `Laporan`; `src/database/schema.sql` (tabel `laporan`) | Lima operasi Tabel 4.1 ada dengan nama yang sama: `simpanLaporanBaru` (Algo-051), `getAllLaporan`, `filterByStatus`, `getDetailLaporan`, `updateStatusPenanganan` (KF45 sampai KF47). `CHECK` membatasi jenis pelanggaran dan status penanganan. Ditambah `validasiTransisiStatus` dan `getStatistikStatus` (lihat B.1 No. 31) |
| C37 | BuktiLaporan | Kelas Model (Entity) dan tabel basis data | `src/models/BuktiLaporan.js` - `BuktiLaporan`; `src/database/schema.sql` (tabel `bukti_laporan`) | `validasiLampiranWajib` menolak laporan tanpa tangkapan layar (KF44), dan `simpan` mencatat nama serta lokasi berkas bukti. Ditambah `cariByLaporan` untuk detail laporan (lihat B.1 No. 32) |
| C38 | LogAudit | Kelas Model (Entity) dan tabel basis data | `src/models/LogAudit.js` - `LogAudit`; `src/database/schema.sql` (tabel `log_audit`) | Empat operasi catat pada Tabel 4.1 ada dengan nama yang sama. Kelas ini hanya berisi `INSERT` dan `SELECT`, tanpa `UPDATE` atau `DELETE`, sehingga jejak audit hanya bisa bertambah (KF48, KF49). Ditambah `getRiwayatByLaporan` (lihat B.1 No. 32) |
| C39 | LogAdmin | Kelas Model (Entity) dan tabel basis data | `src/models/LogAdmin.js` - `LogAdmin`; `src/database/schema.sql` (tabel `log_admin`) | `catatTindakan` menyimpan tindakan `HAPUS_LISTING`, `BLOKIR_AKUN`, dan `BUKA_BLOKIR` beserta admin, objek, dan alasannya (KF55). Ditambah `getAllLog` (lihat B.1 No. 32) |
| C40 | DokumenLegal | Kelas Model (Entity) & Tabel DB | `src/models/DokumenLegal.js` - `DokumenLegal`, `src/database/schema.sql` (tabel `dokumen_legal`), `src/database/seedDokumenLegal.js` (isi versi 1.0) | Atribut menjadi kolom tabel dengan `UNIQUE (jenis_dokumen, versi)`. `getVersiTerbaru` (Algo-063) mengambil versi terpublikasi yang sudah berlaku (`tanggal_berlaku <= CURRENT_DATE`), sedangkan `getTautan` dan `getIsi` mengembalikan atribut dokumen (lihat B.1 No. 12) |
| C41 | Otorisasi | Kelas Pendukung (*method* statis) dan middleware Express | `src/pendukung/Otorisasi.js` - `Otorisasi` | `verifikasiToken` (Algo-064) memeriksa token sesi pada tabel `sesi_login` melalui `SesiLogin.cariSesiAktif`. `verifikasiAdmin` (Algo-065) menambahkan pemeriksaan `Admin.verifikasiPeran` (KF56). Keduanya dibungkus middleware `wajibLogin` (401) dan `wajibAdmin` (401/403) yang dipakai route seluruh modul, termasuk endpoint moderasi Modul E. `wajibAdmin` meneruskan sesi yang sudah diperiksanya ke `verifikasiAdmin`, sehingga sesi hanya dicari sekali (lihat B.1 No. 7) |
| C42 | Kriptografi | Kelas Pendukung (instans tunggal) | `src/pendukung/Kriptografi.js` - `Kriptografi` | Atribut `saltRounds` dan `kunciEnkripsi` dibaca dari variabel lingkungan. `hash` dan `cocokkanHash` (Algo-066, Algo-067) memakai bcrypt untuk kata sandi (Modul A, KF09, KF10), sedangkan `enkripsi` dan `dekripsi` (Algo-068, Algo-069) memakai AES-256-GCM untuk isi pesan percakapan (Modul D, KF36) |
| C43 | SurelAdapter | Kelas Integrasi Eksternal (instans tunggal) | `src/integrasi/SurelAdapter.js` - `SurelAdapter` | Atribut `hostSmtp`, `portSmtp`, dan `alamatPengirim` dibaca dari variabel lingkungan `SMTP_*`. `kirimSurel` mengirim surel melalui nodemailer dan mengembalikan `false` bila gagal. Dipanggil `NotifikasiController` untuk kode verifikasi (UC01, UC02) dan pemberitahuan moderasi (Modul E). Saat lokal diarahkan ke Mailpit (lihat B.1 No. 2) |
| C44 | PushNotifikasiAdapter | Kelas Integrasi Eksternal (instans tunggal), Model pendukung, dan tabel basis data | `src/integrasi/PushNotifikasiAdapter.js` - `PushNotifikasiAdapter`; `src/models/LanggananPush.js` - `LanggananPush`; `src/database/schema.sql` (tabel `langganan_push`); `src/views/sw.js` | Atribut `kunciPublikVapid` dan `kunciPrivatVapid` dibaca dari `VAPID_PUBLIC_KEY` dan `VAPID_PRIVATE_KEY`. `kirimPush` (Algo-071) mengirim lewat pustaka `web-push` ke semua peramban penerima dan mengembalikan `false` tanpa melempar galat bila VAPID belum diatur. Notifikasinya ditampilkan Service Worker (lihat B.1 No. 27) |
| C45 | PenyimpananBerkas | Kelas Penyimpanan Data (instans tunggal) | `src/penyimpanan/PenyimpananBerkas.js` - `PenyimpananBerkas`; folder `src/uploads/` | `simpan` (Algo-072) menulis foto listing dan bukti laporan ke `src/uploads/<idObjek>/` dengan nama UUID, lalu mengembalikan daftar *path* `/uploads/...`. `hapus` (Algo-073) menghapus berkas menurut daftar *path*. Bila `BLOB_READ_WRITE_TOKEN` diisi (versi daring), berkas diunggah ke Vercel Blob dan yang disimpan adalah URL-nya; `hapus` mengirim URL ke Blob dan *path* `/uploads/` ke disk. Dipakai ListingService, LaporanController, dan ModerasiController (lihat B.1 No. 13, 40) |

Unit implementasi berikut tidak berasal dari Tabel 4.1, tetapi ikut menyusun aplikasi. Semuanya sudah dirujuk pada B.1.

| Unit | Lokasi | Peran |
| :--- | :--- | :--- |
| `ListingService` | `src/services/ListingService.js` | Aturan bisnis listing penjual yang dipindah dari C14 (B.1 No. 16) |
| `ListingPenjual` | `src/models/ListingPenjual.js` | Transaksi dan penguncian baris untuk C29 dan C30 (B.1 No. 16, 18) |
| `LanggananPush` | `src/models/LanggananPush.js` | Langganan Web Push per peramban untuk C44 (B.1 No. 27) |
| `SsoController` | `src/controllers/SsoController.js` | Alur OAuth 2.0 Google dengan PKCE: membuat tautan masuk, menukar kode, memeriksa klaim token, dan menyerahkan hasilnya ke C13 (B.1 No. 41) |
| *Route* Express | `src/routes/*.js`, `src/app.js` | 41 endpoint `/api/*` yang memetakan HTTP ke Controller, ditambah penyajian berkas View |
| Pembantu View | `src/views/js/api.js`, `Kerangka.js`, `ListingUI.js`, `layoutKatalog.js` | Pemanggil API dengan token sesi, kerangka halaman (*topbar* dan *sidebar*), dialog, dan *toast* yang dipakai beberapa View (B.1 No. 42) |
| View masuk dengan Google | `src/views/js/TombolSSO.js`, `HalamanLengkapiSSO.js`; `src/views/pages/lengkapi-sso.html` | Tombol Google di halaman masuk beserta pesan galatnya, dan formulir NIM serta persetujuan kebijakan untuk akun baru (B.1 No. 41) |
| Service Worker | `src/views/sw.js` | Menampilkan notifikasi push dan membuka halaman tujuan saat diklik |
| Aset merek | `src/views/ikon/itbeli-simbol.svg`, `itbeli-nama.svg`; `src/views/favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`, `site.webmanifest` | Logo ITBELI (tas belanja berbentuk kepala gajah) pada top bar semua halaman, favicon, dan ikon aplikasi web. Warnanya biru ITB `#0F4C97`. Token warna aksi `--primer-700` kini `#0866ff` sejak tampilan baru (B.1 No. 42) |
| Konfigurasi dan basis data | `src/config/env.js`, `src/config/db.js`, `src/database/init.js`, `seed.js`, `seedDokumenLegal.js` | Pembacaan variabel lingkungan (B.1 No. 37), *pool* koneksi, pembuatan skema, dan data uji |
| Konfigurasi deploy | `src/vercel.json`, `src/.vercelignore`, `src/scripts/salinStatis.js` | Pengaturan Vercel (region, alamat bersih, perintah build), daftar berkas yang tidak diunggah, dan penyalinan berkas View ke `public/` (B.1 No. 39) |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
