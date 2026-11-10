<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## *ITBELI*
### *[Logo Perangkat Lunak]*

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

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

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
| 7 | Kelas C41 Otorisasi | Operasi `verifikasiToken` dan `verifikasiAdmin` | Kedua operasi tetap ada, ditambah `ambilToken` (membaca header `Authorization: Bearer`) serta middleware Express `wajibLogin` (401) dan `wajibAdmin` (401/403) yang membungkus kedua operasi tersebut | Cara standar Express untuk melindungi route, sehingga pemeriksaan sesi dan peran tidak ditulis ulang di setiap route. Dipakai route Modul A, B, C, D, dan E |
| 8 | Kelas C13 AkunController: `getTautanDokumenLegal` | Operasi controller yang dipanggil View | Ditambah endpoint `GET /api/akun/tautan-kebijakan` | View (I-02, I-09) berjalan di peramban sehingga memerlukan jalur HTTP untuk memanggil operasi controller |
| 9 | Kelas C29 Barang: `getListingPenjual` | Mengembalikan `List<Barang>` dengan atribut Tabel 4.1 | Setiap objek `Barang` dilengkapi atribut tambahan `fotoUtama` yang diambil dalam query yang sama (subquery ke `foto_barang`) | Kartu listing pada profil (I-09) memerlukan foto utama. Mengambilnya per barang akan menimbulkan satu query tambahan untuk setiap listing |
| 10 | Kelas C02 HalamanProfil: `tampilkanDaftarListing`, layar I-09 (I09-O02) | Memanggil `KartuProduk.render()` untuk setiap barang | Kartu listing dibuat oleh `HalamanProfil.buatKartu` dengan gaya `.card` yang sama, dan menaut ke detail listing milik penjual (`/detail?id=`) | C06 KartuProduk (Modul C) dibuat untuk katalog: menaut ke detail pembeli dan belum mendukung label "Terjual", sedangkan profil menampilkan listing Tersedia dan Terjual milik sendiri |
| 11 | Kelas C01 HalamanOtentikasi, layar I-02 (I02-O04) | Isian kata sandi dengan indikator kekuatan, tanpa aturan minimum | Kata sandi wajib minimal 8 karakter serta memuat huruf dan angka, divalidasi di View dan di `AkunController.daftarAkun` | Mengikuti teks petunjuk pada rancangan antarmuka I-02 ("Minimal 8 karakter, memuat huruf dan angka") |
| 12 | Kelas C40 DokumenLegal: atribut `isi` | Isi lengkap dokumen berupa teks | Isi disimpan dengan penanda `## ` di awal judul setiap bagian, dan `tanggal_berlaku` diambil sebagai teks `YYYY-MM-DD` | Penanda bagian memungkinkan I-15 membuat daftar isi otomatis (I15-O05). Tanggal sebagai teks mencegah tanggal bergeser satu hari akibat konversi zona waktu di peramban |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | *[Tautan ke daftar branch / graph commit]* | *[Skema yang dipakai]* |
| Semantic commit | *[Tautan ke riwayat commit]* | *[Ringkasan]* |
| Track tasks | *[Tautan ke Issues/Projects]* | *[Jumlah issue, pembagian]* |
| Pull request dan review | *[Tautan ke 2-3 PR representatif]* | *[Siapa me-review siapa]* |
| Pengujian | [Suite Pengujian Modul E](src/tests/) · 106 tests passed | Pengujian unit dan integrasi otomatis (Jest & Supertest) untuk Modul E (Laporan & Moderasi): validasi formulir & privasi percakapan (UC19), peninjauan & penyaringan laporan (UC20), transisi status & audit log (UC21), penghapusan listing (UC22), pemblokiran akun (UC23), pembukaan blokir akun (UC24), serta 3 skenario integrasi end-to-end. Dijalankan dengan `npm test` di dalam direktori `src/`. |

### B.2.1 Profiling dan Optimasi

Pilih minimal satu fitur yang diprofil.

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | *[Nama fitur]* |
| Alat | *[mis. Chrome DevTools, cProfile, EXPLAIN]* |
| Temuan (sebelum) | *[Bottleneck yang ditemukan, sertakan angka/tangkapan layar]* |
| Perbaikan | *[Yang diubah]* |
| Hasil (sesudah) | *[Perbandingan dengan sebelumnya]* |

Jika tidak ada perbaikan yang perlu dilakukan, jelaskan hasil profiling dan alasan kenapa fitur tersebut sudah memadai.

## B.3 Kendala dan Catatan Penting

Tuliskan kendala yang ditemui, fitur yang belum sempurna (*known issues*), serta hal yang perlu diketahui asisten saat menjalankan atau menilai aplikasi (misalnya akun uji khusus, urutan menjalankan, atau batasan).

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| *[NIM 1]* | *[Nama]* | *[Modul/fitur]* | *[%]* |
| *...* | *...* | *...* | *...* |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | HalamanOtentikasi | Kelas JavaScript sisi klien (View) dan tiga halaman HTML | `src/views/js/HalamanOtentikasi.js` - `HalamanOtentikasi`; `src/views/pages/masuk.html` (I-01), `src/views/pages/daftar.html` (I-02), `src/views/pages/verifikasi.html` (I-03) | Atribut (`nama`, `nim`, `email`, `kataSandi`, `setujuKebijakan`, `kodeVerifikasi`, `sisaWaktu`, `token`) menjadi properti objek. Operasi menjadi *method* penangan *event* formulir yang memanggil `/api/akun/*` melalui `src/views/js/api.js`. Token sesi disimpan di `localStorage` dan dihapus oleh `hapusTokenLokal` |
| C02 | HalamanProfil | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanProfil.js` - `HalamanProfil`; `src/views/pages/profil.html` (I-09) | `muatProfil` memanggil `GET /api/akun/profil`, `bukaPengaturanAkun` memanggil `GET /api/akun/tautan-kebijakan`, dan tombol Keluar memanggil `HalamanOtentikasi.kirimPermintaanLogout` (I09-O05). Atribut `daftarKartuProduk` berisi elemen kartu listing yang dibuat `HalamanProfil.buatKartu` (lihat B.1 No. 10) |
| C11 | DasborAdmin | Komponen UI & Skrip Client-side | `src/views/pages/admin-laporan.html`, `src/views/pages/admin-detail.html`, `src/views/js/DasborAdmin.js` - `DasborAdmin` | Antarmuka dasbor admin untuk melihat/menyaring daftar laporan (I-13) dan melihat rincian laporan (I-14), termasuk dropdown pengubah status penanganan (UC21) dan tombol tindakan moderasi |
| C12 | HalamanDokumenLegal | Kelas JavaScript sisi klien (View) dan halaman HTML | `src/views/js/HalamanDokumenLegal.js` - `HalamanDokumenLegal`; `src/views/pages/legal.html` (I-15) | `bukaDokumen` memanggil `GET /api/dokumen-legal/:jenis` (tab I15-O01), `tampilkanDokumen` merender judul, versi, isi per bagian, dan daftar isi otomatis (I15-O02, O03, O05), serta `sorotKlausaPrivasi` menyorot klausul privasi percakapan (I15-O04, KF38). Isi ditampilkan melalui `textContent` agar aman dari XSS |
| C13 | AkunController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/AkunController.js` - `AkunController`; `src/routes/akunRoutes.js` (`/api/akun/*`) | Tanpa atribut, sesuai DPPL. Seluruh operasi Tabel 4.1 diimplementasikan dengan nama yang sama: Algo-002 `daftarAkun`, Algo-003 `buatKodeVerifikasi`, Algo-004 `verifikasiAkun`, Algo-005 `kirimUlangKode`, Algo-006 `login`, serta `logout`, `getProfil`, dan operasi pendukungnya. *Route* memetakan hasil ke HTTP: `POST /daftar`, `/verifikasi`, `/kirim-ulang`, `/login`, `/logout`, `GET /profil`, `/tautan-kebijakan` (lihat B.1 No. 3, 4, 5, 8) |
| C19 | NotifikasiController | Kelas Controller | `src/controllers/NotifikasiController.js` - `NotifikasiController` | Mengorkestrasikan pengiriman notifikasi/surel peringatan moderasi dan penangguhan akun |
| C21 | ModerasiController | Kelas Controller | `src/controllers/ModerasiController.js` - `ModerasiController` | Mengorkestrasikan moderasi laporan, otorisasi peran admin (KF56), penyaringan laporan (UC20), perubahan status penanganan laporan (UC21), penghapusan listing (UC22), pemblokiran akun (UC23), dan pembukaan blokir akun (UC24) |
| C22 | DokumenLegalController | Kelas Controller (*method* statis) dan *route* Express | `src/controllers/DokumenLegalController.js` - `DokumenLegalController`; `src/routes/dokumenLegalRoutes.js` (`GET /api/dokumen-legal/:jenis`) | `getDokumen` memvalidasi jenis terhadap daftar tetap (`kebijakan-privasi`, `ketentuan-penggunaan`) sebelum memanggil `DokumenLegal.getVersiTerbaru`, sehingga jenis lain langsung ditolak (404). `getKlausaPrivasi` mengambil klausul dari Kebijakan Privasi yang berlaku |
| C23 | Akun | Kelas Model (Entity) & Tabel DB | `src/models/Akun.js` - `Akun`, `src/database/schema.sql` (tabel `akun`), `src/database/seed.js` (akun uji) | Atribut menjadi kolom tabel `akun` (indeks unik `LOWER(email)`, `CHECK` untuk `status_akun` dan `peran`). Operasi menjadi query SQL berparameter: `simpan` (Algo-025), `cariByEmail` (Algo-026), `cariById`, `perbaruiStatusAkun`, `getStatusBlokir`, `getSyaratTidakDiblokir`. `getStatusAkun` mengutamakan status blokir dan `getDataIdentitas` hanya mengembalikan nama, NIM, dan surel. `blokir` dan `bukaBlokir` dipakai Modul E untuk pemblokiran dan pembukaan blokir akun (UC23, UC24) |
| C24 | Pembeli | Kelas Model (Entity Turunan) | `src/models/Pembeli.js` - `Pembeli extends Akun` | Tanpa atribut dan operasi tambahan, sesuai DPPL 5.24. Disimpan pada tabel `akun` yang sama dengan `peran = 'Pengguna'` (*single table inheritance*) |
| C25 | Penjual | Kelas Model (Entity Turunan) | `src/models/Penjual.js` - `Penjual extends Akun` | `getIdentitas` (Algo-027) mengambil identitas publik penjual dari tabel `akun`. Saat ini belum dipanggil modul lain: detail listing (Modul C) mengambil nama penjual langsung melalui JOIN pada `Barang.getDetailKatalog` |
| C26 | Admin | Kelas Model (Entity Turunan) | `src/models/Admin.js` - `Admin extends Akun` | `verifikasiPeran` (Algo-028) memeriksa `peran = 'Admin'` dan akun tidak diblokir. Dipanggil `Otorisasi.verifikasiAdmin` untuk melindungi endpoint moderasi (KF56). Disimpan pada tabel `akun` dengan `peran = 'Admin'` |
| C27 | TokenVerifikasi | Kelas Model (Entity) & Tabel DB | `src/models/TokenVerifikasi.js` - `TokenVerifikasi`, `src/database/schema.sql` (tabel `token_verifikasi`) | Atribut menjadi kolom tabel, dengan `status_pakai` bernilai `Aktif`, `Terpakai`, atau `Hangus`. `simpan` dan `cariTokenAktif` (Algo-029) berupa query SQL, `cocokkanKode` dan `sudahKedaluwarsa` dihitung pada objek, sedangkan `tandaiTerpakai` (kode tidak dapat dipakai ulang) dan `tandaiHangus` (saat kirim ulang) mengubah `status_pakai` |
| C28 | SesiLogin | Kelas Model (Entity) & Tabel DB | `src/models/SesiLogin.js` - `SesiLogin`, `src/database/schema.sql` (tabel `sesi_login`) | `buatToken` membangkitkan token acak 32 byte (lihat B.1 No. 6). `simpan` mencatat sesi berlaku `DURASI_SESI_JAM` (bawaan 24 jam, KF11). `cariSesiAktif` (Algo-030) hanya mengambil sesi aktif yang belum kedaluwarsa. `nonaktifkan` dipakai saat logout (KF12), dan `nonaktifkanByAkun` (Algo-031) dipakai Modul E untuk mencabut seluruh sesi saat pemblokiran akun |
| C29 | Barang | Kelas Model (Entity) & Tabel DB | `src/models/Barang.js` - `Barang`, `src/database/schema.sql` (tabel `barang`) | Entitas katalog barang dengan penonaktifan dan pemulihan listing |
| C30 | FotoBarang | Kelas Model (Entity) & Tabel DB | `src/models/FotoBarang.js` - `FotoBarang`, `src/database/schema.sql` (tabel `foto_barang`) | Entitas foto barang yang terhubung ke penyimpanan berkas lokal |
| C36 | Laporan | Kelas Model (Entity) & Tabel DB | `src/models/Laporan.js` - `Laporan`, `src/database/schema.sql` (tabel `laporan`) | Entitas laporan pelanggaran pengguna dengan pelacakan status penanganan ("Baru", "Diproses", "Selesai"), validasi transisi tertib, dan waktu perubahannya (KF47) |
| C37 | BuktiLaporan | Kelas Model (Entity) & Tabel DB | `src/models/BuktiLaporan.js` - `BuktiLaporan`, `src/database/schema.sql` (tabel `bukti_laporan`) | Entitas berkas tangkapan layar bukti pelanggaran |
| C38 | LogAudit | Kelas Model (Entity) & Tabel DB | `src/models/LogAudit.js` - `LogAudit`, `src/database/schema.sql` (tabel `log_audit`) | Rekam jejak audit penanganan laporan bersifat append-only tanpa operasi UPDATE atau DELETE untuk menjamin immutabilitas bukti audit (KF48, KF49) |
| C39 | LogAdmin | Kelas Model (Entity) & Tabel DB | `src/models/LogAdmin.js` - `LogAdmin`, `src/database/schema.sql` (tabel `log_admin`) | Rekam jejak audit tindakan moderasi administratif (penghapusan listing, pemblokiran akun, pembukaan blokir) |
| C40 | DokumenLegal | Kelas Model (Entity) & Tabel DB | `src/models/DokumenLegal.js` - `DokumenLegal`, `src/database/schema.sql` (tabel `dokumen_legal`), `src/database/seedDokumenLegal.js` (isi versi 1.0) | Atribut menjadi kolom tabel dengan `UNIQUE (jenis_dokumen, versi)`. `getVersiTerbaru` (Algo-063) mengambil versi terpublikasi yang sudah berlaku (`tanggal_berlaku <= CURRENT_DATE`), sedangkan `getTautan` dan `getIsi` mengembalikan atribut dokumen (lihat B.1 No. 12) |
| C41 | Otorisasi | Kelas Pendukung (*method* statis) dan middleware Express | `src/pendukung/Otorisasi.js` - `Otorisasi` | `verifikasiToken` (Algo-064) memeriksa token sesi pada tabel `sesi_login` melalui `SesiLogin.cariSesiAktif`. `verifikasiAdmin` (Algo-065) menambahkan pemeriksaan `Admin.verifikasiPeran` (KF56). Keduanya dibungkus middleware `wajibLogin` (401) dan `wajibAdmin` (401/403) yang dipakai route seluruh modul, termasuk endpoint moderasi Modul E (lihat B.1 No. 7) |
| C42 | Kriptografi | Kelas Pendukung (instans tunggal) | `src/pendukung/Kriptografi.js` - `Kriptografi` | Atribut `saltRounds` dan `kunciEnkripsi` dibaca dari variabel lingkungan. `hash` dan `cocokkanHash` (Algo-066, Algo-067) memakai bcrypt untuk kata sandi (Modul A, KF09, KF10), sedangkan `enkripsi` dan `dekripsi` (Algo-068, Algo-069) memakai AES-256-GCM untuk isi pesan percakapan (Modul D, KF36) |
| C43 | SurelAdapter | Kelas Integrasi Eksternal (instans tunggal) | `src/integrasi/SurelAdapter.js` - `SurelAdapter` | Atribut `hostSmtp`, `portSmtp`, dan `alamatPengirim` dibaca dari variabel lingkungan `SMTP_*`. `kirimSurel` mengirim surel melalui nodemailer dan mengembalikan `false` bila gagal. Dipanggil `NotifikasiController` untuk kode verifikasi (UC01, UC02) dan pemberitahuan moderasi (Modul E). Saat lokal diarahkan ke Mailpit (lihat B.1 No. 2) |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
