<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## *SaveBite*
<img width="40%" alt="logo" src=".\assets\save_bite.PNG" />

### Untuk: *Aurelia Jennifer Gunawan*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K02* |
| Kelompok | *G06*  |

| NIM | Nama |
|---|---|
| *13525122* | *Nadia Aulia Syafarani* |
| *13525041* | *Renata Puspanegara Ninagan* |
| *13525119* | *Ghina Emelia Yantes* |
| *13525017* | *Cendra Asih Chairunnisa* |
| *13525089* | *Sherin Felicia Danessa* |
---

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

---

**Deadline:** Rabu, 11 November 2026, 21.50 WIB
**Asistensi akbar:** *[Senin, 2 November 2006, 19.00 WIB, https://teams.microsoft.com/l/message/19:BGAB6hurIuLXWy3ZVN_CgpiGR7eTfgHyMzlVJhu-dzo1@thread.tacv2/1793620051162?tenantId=db6e1183-4c65-405c-82ce-7cd53fa6e9dc&groupId=5cce5463-c3b7-4b81-9f9c-e6de1abd54c0&parentMessageId=1793620051162&teamName=2026%20IF2150%20RPL&channelName=General&createdTime=1793620051162]*

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

Tabel B.1. Perubahan dari DPPL

(cek ulang)
| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 2 | Kelas C12 ListingView | Tidak memiliki atribut. Penghapusan listing hanya melalui `tampilkanKonfirmasiHapus()` | Ditambah atribut `idListingDiedit: Integer` dan `adaPerubahan: Boolean`, serta operasi `hapusMakanan(listing)` | `idListingDiedit` membedakan mode tambah dan edit pada satu form yang sama. `adaPerubahan` dibutuhkan untuk menentukan perlu tidaknya dialog konfirmasi keluar (UC01). `hapusMakanan()` meneruskan aksi hapus ke ListingController setelah konfirmasi (UC09) |
| 3 | Kelas C08 ItemTransaksi | Atribut: `idItem`, `idListing`, `jumlah`, `hargaSatuan` | Ditambah atribut `idTransaksi: Integer` | Atribut ini menjadi foreign key ke tabel `transaksi`, yang dibutuhkan untuk merealisasikan relasi komposisi Transaksi 1 ◆— 1..* ItemTransaksi di database |
| 4 | Kelas C21 PaymentGatewayAdapter | `buatTagihan()` mengembalikan kode QRIS dari QRIS dummy. `cekStatus()` meneruskan status pembayaran dari gateway | `buatTagihan()` mengembalikan lokasi file gambar QRIS dummy. `cekStatus()` selalu mengembalikan `"LUNAS"` saat Pembeli menekan tombol lanjut | Pembayaran hanya disimulasikan dan tidak terhubung ke penyedia QRIS sungguhan |
| 5 | Layar UI-01 Sign Up | Tidak ada use case maupun kelas untuk pendaftaran akun (hanya UC07 Login) | Ditambah layar Sign Up (email, password, konfirmasi password, persetujuan syarat dan ketentuan) | Akun Pembeli harus dapat dibuat sebelum pengguna bisa login |
| 6 | Layar UI-02 Log In | LoginView hanya berisi email, password, dan tombol masuk | Ditambah tautan "Forgot Password?" dan "Register your shop" | Menyediakan jalur pemulihan password dan pendaftaran toko bagi Penjual dari layar login |
| 7 | Kelas C04 ListingMakanan; layar UI-03 dan UI-06 | ListingMakanan tidak memiliki atribut kategori | Layar Home menampilkan kategori makanan dan form Add Product memiliki field Category | Memudahkan Pembeli menelusuri makanan berdasarkan jenisnya |
| 8 | Kelas C07 RewardLogin; layar UI-04 | Poin bertambah `POIN_PER_LOGIN` pada login pertama setiap hari | Layar My Reward menampilkan streak harian (Mon–Sun) dan total poin | Streak memperlihatkan konsistensi login Pembeli dan mendorong Pembeli login setiap hari |
| 9 | Kelas C09 Kupon, C18 PembayaranController; layar UI-04 dan UI-05 | Kupon hanya diterbitkan dari klaim reward dan belum dapat dipakai saat pembayaran (Revisi E DPPL) | Voucher dapat dipilih di My Reward, lalu potongannya tampil sebagai Discount di My Cart | Agar kupon hasil klaim reward memiliki kegunaan nyata bagi Pembeli |
| 10 | Operasi `checkout()` pada C18; layar UI-05 | `checkout(idPembeli, idListing, jumlah)` untuk satu listing per transaksi | Layar My Cart menampung beberapa item, dengan jumlah per item yang dapat diubah, lalu dibayar melalui tombol Buy Now | Pembeli dapat membeli beberapa makanan dalam satu transaksi. Hal ini sesuai dengan relasi Transaksi 1..* ItemTransaksi |
| 11 | Layar UI-06 Add Product; Kelas C20 Validasi | Form listing berisi porsi dan kondisi (wajib). Listing langsung aktif saat disimpan | Form tidak memuat field porsi dan kondisi. Ditambah tombol Save (simpan sebagai draf) dan Show (tampilkan ke katalog) | Penjual dapat menyiapkan listing terlebih dahulu sebelum ditampilkan kepada Pembeli |
| 12 | Layar UI-07 Detail Produk | KatalogView hanya menampilkan detail listing dan tombol beli | Ditambah tombol favorit (♡) dan tombol Add to Cart | Pembeli dapat menyimpan makanan yang diminati dan memasukkannya ke keranjang sebelum membayar |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | *[Tautan ke daftar branch / graph commit]* | *[Skema yang dipakai]* |
| Semantic commit | *[Tautan ke riwayat commit]* | *[Ringkasan]* |
| Track tasks | *[Tautan ke Issues/Projects]* | *[Jumlah issue, pembagian]* |
| Pull request dan review | *[Tautan ke 2-3 PR representatif]* | *[Siapa me-review siapa]* |
| Pengujian | *[Tautan ke `src/tests/` dan hasil test]* | *[Apa yang diuji, cara menjalankan]* |

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
| *13525041* | *Renata Puspanegara Ninagan* | Fondasi sistem dan Login (UC07): seluruh model basis data, autentikasi dengan bcrypt, *role guard* (penjual/pembeli), navbar | *[20%]* |
| *13525122* | *Nadia Aulia Syafarani* | Pengelolaan Listing Penjual (UC01, UC06, UC09): tambah, ubah, hapus (*soft delete*) listing, unggah foto | *[20%]* |
| *13525119* | *Ghina Emelia Yantes* | Katalog Pembeli (UC02, UC03, UC04): daftar listing, detail listing, pencarian, filter harga | *[20%]* |
| *13525089* | *Sherin Felicia Danessa* | Pembayaran (UC05): *checkout*, ItemTransaksi, QRIS *dummy*, pengurangan stok secara atomik | *[20%]* |
| *13525017* | *Cendra Asih Chairunnisa* | Reward (UC08), *seed data*, integrasi dan QA, skrip demo, perapian laporan M9 | *[20%]* |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| *[C01]* | *[Nama kelas pada DPPL]* | *[mis. Kelas / Fungsi / Komponen / Route / Tabel]* | *[mis. `src/models/user.py` - `User`]* | *[Cara atribut dan operasi kelas diwujudkan; "-" jika tidak ada penjelasan tambahan]* |
| *[C02]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/components/LoginForm.tsx` - `LoginForm`]* | *[mis. atribut menjadi *state*, operasi menjadi *handler*]* |
| *[C03]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/routes/auth.js` - `POST /login`]* | *[Keterangan]* |
| *...* | *...* | *...* | *...* | *...* |

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | Pengguna «abstract» | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C02 | Penjual | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C03 | Pembeli | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C04 | ListingMakanan | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C05 | MetodePembayaran «interface» | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C06 | Transaksi | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C07 | RewardLogin | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C08 | ItemTransaksi | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C09 | Kupon | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C10 | LoginView | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C11 | KatalogView | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C12 | ListingView | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C13 | PembayaranView | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C14 | RewardView | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C15 | AuthController | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C16 | KatalogController | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C17 | ListingController | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C18 | PembayaranController | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C19 | RewardController | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C20 | Validasi | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |
| C21 | PaymentGatewayAdapter | *[Bentuk implementasi]* | *[Lokasi]* | *[Keterangan]* |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.