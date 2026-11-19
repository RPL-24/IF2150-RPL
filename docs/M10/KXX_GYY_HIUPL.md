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
| Kelas | *K - 03* |
| Kelompok | *G07* |

| NIM | Nama |
| --- | --- |
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
Tuliskan uraian ringkas mengenai isi dokumen, tujuan pembuatan dokumen HIUPL ini, dan siapa saja target pembacanya.

## 1.2 Lingkup Masalah
Tuliskan lingkup masalah, yaitu membangun perangkat lunak *[nama perangkat lunak]*. Jelaskan dengan singkat dan jelas deskripsi aplikasi serta keterkaitannya dengan perangkat lunak atau sistem lain (jika ada). Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL/DPPL.

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
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
Cantumkan daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L, **minimal dokumen SKPL, APL, DPPL, dan Implementasi (Tugas 9)**. Tambahkan dokumentasi *framework*/*library*/*testing tool* atau referensi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.

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

Lingkungan implementasi mengikuti rancangan pada Subbab 2.1 DPPL. Perubahan terhadap DPPL hanya berupa penambahan Cloudflare Turnstile sebagai layanan verifikasi anti-bot (KNF04) dan alat pengujian yang digunakan pada Tugas 10.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | Laptop masing-masing anggota (macOS, Linux, dan Windows) untuk pengembangan; server Vercel (*serverless*) dan Supabase (*cloud*) untuk *production* |
| *Operating System* | Pengembangan: macOS dan Windows. Pengguna: *cross platform* melalui *browser* (Android, iOS, Windows, macOS, Linux) |
| *Bahasa Pemrograman* | TypeScript [versi] di atas Node.js 24 (LTS); SQL (PostgreSQL) untuk *migration*, RPC, *trigger*, dan RLS |
| *Framework/Library* | Next.js 16.3, React 19.3, @supabase/supabase-js [versi], @supabase/ssr [versi], Leaflet [versi] dengan *tile* OpenStreetMap, Tailwind CSS [versi], Cloudflare Turnstile (anti-bot) |
| *DBMS* | PostgreSQL 17 yang dikelola Supabase, beserta Supabase Auth, Supabase Storage (bucket `media`), dan Supabase Realtime |
| *Development Tools* | Visual Studio Code, Supabase CLI v3 (*migration* dan *generate types*), Vercel CLI (*deploy*), ESLint, Git dan GitHub (*version control*, *pull request*, GitHub Actions sebagai CI untuk lint, typecheck, dan test) |
| *Testing Tools* | Vitest 5.1.0 (unit dan integrasi), @vitest/coverage-v8 5.1.0 (laporan *coverage*), Chrome DevTools dan Lighthouse (pengukuran KNF), pengujian manual melalui *browser* (use case) |

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

## 3.4 File Lain

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `supabase/migrations/*.sql` | Skema basis data: tabel, relasi, RLS, RPC (mis. `kirim_laporan`, `cari_laporan_duplikat`), *trigger* riwayat status dan notifikasi, *sequence* ID tiket, dan *policy* Storage |
| 2 | `scripts/seed.ts` | Skrip `npm run seed` untuk mengisi akun uji (warga, admin, eksekutor) dan data laporan contoh fiktif |
| 3 | `src/types/database.ts` | Tipe TypeScript hasil *generate* dari skema Supabase |
| 4 | `src/lib/supabase/client.ts`, `server.ts`, `proxy.ts` | Pembuatan client Supabase untuk *browser*, *server*, dan penyegaran sesi |
| 5 | `src/proxy.ts` | Proteksi rute berdasarkan sesi dan peran pengguna |
| 6 | `src/lib/auth.ts`, `src/lib/validasi-auth.ts` | Utilitas autentikasi dan validasi masukan form masuk/daftar |
| 7 | `src/server/controllers/AuthController.ts` | Controller masuk, daftar, dan keluar (tidak tercantum sebagai kelas pada DPPL karena autentikasi ditangani Supabase Auth) |
| 8 | `src/lib/constants.ts`, `src/lib/batas-wilayah.ts` | Konstanta aplikasi, termasuk pusat peta dan *polygon* batas wilayah kota |
| 9 | `src/lib/media.ts` | Utilitas unggah berkas foto/video ke Supabase Storage |
| 10 | `src/lib/format.ts`, `error-db.ts`, `action-result.ts`, `navigasi.ts`, `validasi-perbaikan.ts` | Utilitas format tampilan, penerjemahan galat basis data, bentuk hasil *server action*, navigasi per peran, dan validasi hasil perbaikan |
| 11 | `.env.example` | Contoh variabel lingkungan (URL dan key Supabase, key Turnstile, akun uji integrasi) tanpa nilai rahasia |
| 12 | `package.json`, `package-lock.json` | Daftar dependensi dan skrip (`dev`, `build`, `lint`, `typecheck`, `test`, `test:coverage`, `test:integration`, `seed`) |
| 13 | `eslint.config.mjs`, `tsconfig.json`, `next.config.ts` | Konfigurasi lint, TypeScript, dan Next.js |
| 14 | `vitest.config.mts` | Konfigurasi unit test dan *coverage*; mengecualikan uji integrasi |
| 15 | `vitest.integration.config.mts` | Konfigurasi uji integrasi terhadap basis data Supabase |
| 16 | `src/**/*.test.ts` | File unit test yang diletakkan di sebelah file yang diuji |
| 17 | `tests/integration/*.int.test.ts` | File uji integrasi |
| 18 | `tests/integration/helpers/` | Helper uji integrasi: client per peran, penanda data uji `[TEST-INT]`, koordinat uji, pelacak dan pembersih data, pengecekan sisa data |
| 19 | `.github/workflows/[nama-file].yml` | Konfigurasi CI GitHub Actions (lint, typecheck, test) pada setiap *pull request* |
| 20 | `src/README.md` | Dokumentasi aplikasi: instalasi, konfigurasi, cara menjalankan, akun uji, dan cara pengujian |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C02 | Laporan | Mendalam | Memuat perhitungan skor prioritas, transisi status, penambahan upvote, serta filter dan pengurutan laporan (`src/server/entities/Laporan.ts`) | C02-UT01 s.d. C02-UTxx |
| C03 | Lokasi | Mendalam | Memuat validasi titik di dalam batas wilayah (`dalamWilayah`) dan perhitungan jarak haversine (`hitungJarak`) | C03-UT01 s.d. C03-UTxx |
| C04 | Foto | Mendalam | Memuat validasi format dan ukuran berkas foto, termasuk nilai batas ukuran maksimum | C04-UT01 s.d. C04-UTxx |
| C05 | Video | Mendalam | Memuat validasi format dan ukuran berkas video, termasuk nilai batas ukuran maksimum | C05-UT01 s.d. C05-UTxx |
| C06 | Upvote | Mendalam | Memuat aturan satu upvote per pengguna untuk setiap laporan | C06-UT01 s.d. C06-UTxx |
| C07 | ListTugas | Mendalam | Memuat algoritma pengurutan tugas berdasarkan skor prioritas dan filter kategori | C07-UT01 s.d. C07-UTxx |
| C08 | HasilPerbaikan | Mendalam | Memuat validasi berkas bukti perbaikan dan catatan hasil kerja | C08-UT01 s.d. C08-UTxx |
| C09 | Evaluasi | Mendalam | Memuat aturan keputusan evaluasi (setuju/tolak) yang mengubah status laporan dan tahap pengerjaan | C09-UT01 s.d. C09-UTxx |
| C17 | LaporanController | Mendalam | Memuat verifikasi anti-bot Cloudflare Turnstile (keamanan, integrasi eksternal) dan validasi masukan laporan sebelum disimpan | C17-UT01 s.d. C17-UTxx |
| C10 | Notifikasi | Sedang | Hanya membentuk dan meneruskan data notifikasi; notifikasi dibuat oleh *trigger* basis data saat status berubah | C10-UT01 s.d. C10-UTxx |
| C18 | ValidasiController | Sedang | Meneruskan aksi validasi/penolakan ke Laporan setelah pemeriksaan peran | C18-UT01 s.d. C18-UTxx |
| C19 | PenugasanController | Sedang | Meneruskan permintaan daftar tugas ke ListTugas setelah pemeriksaan peran | C19-UT01 s.d. C19-UTxx |
| C20 | PerbaikanController | Sedang | Meneruskan unggahan hasil perbaikan ke HasilPerbaikan | C20-UT01 s.d. C20-UTxx |
| C21 | EvaluasiController | Sedang | Meneruskan keputusan evaluasi ke Evaluasi | C21-UT01 s.d. C21-UTxx |
| C22 | StatusController | Sedang | Meneruskan permintaan data status, peta publik, dan upvote ke Laporan dan Upvote | C22-UT01 s.d. C22-UTxx |
| C23 | NotifikasiController | Sedang | Meneruskan pengambilan dan penandaan notifikasi ke Notifikasi | C23-UT01 s.d. C23-UTxx |
| C01 | User | Tidak perlu | Entity yang hanya menyimpan data akun dan peran tanpa logika (`src/server/entities/User.ts`); autentikasi ditangani Supabase Auth | - |
| C11 | LaporPage | Tidak perlu | Kelas *view* yang hanya menampilkan formulir dan meneruskan masukan ke controller | - (teruji melalui UC01-TC) |
| C12 | ValidasiPage | Tidak perlu | Kelas *view* yang hanya menampilkan antrean dan rincian laporan | - (teruji melalui UC02-TC) |
| C13 | PenugasanPage | Tidak perlu | Kelas *view* yang hanya menampilkan daftar tugas | - (teruji melalui UC03-TC) |
| C14 | HasilPerbaikanForm | Tidak perlu | Kelas *view* yang hanya menampilkan formulir hasil perbaikan | - (teruji melalui UC04-TC) |
| C15 | EvaluasiPage | Tidak perlu | Kelas *view* yang hanya menampilkan perbandingan bukti dan tombol keputusan | - (teruji melalui UC05-TC) |
| C16 | StatusLaporanPage | Tidak perlu | Kelas *view* yang hanya menampilkan linimasa status dan peta publik | - (teruji melalui UC06-TC) |

| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

engujian unit dilakukan secara otomatis menggunakan Vitest 5.1.0. Setiap file test diletakkan di sebelah file kelas yang diuji dan diberi nama sesuai ID test case, misalnya `C03-UT01 dalamWilayah: titik di tengah kota → true`, sehingga keluaran *test runner* dapat langsung dirujuk sebagai bukti pada Subbab 4.6. Kelas *entity* yang tidak bergantung pada basis data diuji sebagai fungsi murni. Kelas *controller* diuji dengan *mock* untuk autentikasi dan client Supabase, sehingga logika controller dapat diuji terpisah dari basis data; interaksi nyata dengan basis data diuji pada Subbab 4.3. *Coverage* diukur dengan @vitest/coverage-v8 dan dilaporkan per kelas Mendalam dalam bentuk persentase *line* dan *branch*.

Cara menjalankan unit test:
- Seluruh unit test: `npm test`
- Unit test beserta laporan *coverage*: `npm run test:coverage` (ringkasan tampil di terminal, laporan HTML di folder `coverage/`)
- Satu file tertentu: `npx vitest run <path file test>`

Lokasi file test: `src/**/*.test.ts`, di sebelah file yang diuji (contoh: `src/server/entities/Lokasi.test.ts` untuk `src/server/entities/Lokasi.ts`).


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

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Pengujian integrasi dilakukan secara otomatis menggunakan Vitest dengan konfigurasi terpisah (`vitest.integration.config.mts`) dan memakai komponen nyata tanpa *mock*: kode aplikasi, PostgreSQL beserta RLS, RPC, dan *trigger*, Supabase Auth, Supabase Storage, serta layanan eksternal. Setiap pengujian masuk sebagai akun uji sesuai peran (warga, admin, eksekutor) sehingga aturan hak akses ikut teruji.

Karena kelompok tidak memiliki databse uji terpisah, pengujian integrasi dijalankan pada basis data Supabase *production* dengan pengaman berikut:
1. Setiap data uji diberi penanda `[TEST-INT]` pada deskripsi atau catatannya.
2. Laporan uji memakai koordinat khusus (`KOORDINAT_TES`) yang berada di dalam batas wilayah tetapi berjarak lebih dari 4 km dari laporan lain, sehingga tidak terdeteksi sebagai duplikat laporan asli.
3. Setiap ID data yang dibuat dicatat, lalu dihapus berdasarkan ID tersebut setelah pengujian selesai, termasuk berkas pada Storage. Penghapusan menolak laporan yang tidak berpenanda.
4. Setelah pengujian, jumlah sisa data berpenanda diperiksa dan harus bernilai 0.
5. Pengujian integrasi tidak dijalankan oleh CI dan tidak ikut perintah `npm test`.

Efek samping yang tidak dapat dihindari adalah terpakainya nomor urut ID tiket oleh laporan uji, sehingga nomor tiket laporan asli berikutnya melompat.

Cara menjalankan uji integrasi: `npm run test:integration` (memerlukan variabel `TEST_INT_*` dan `SUPABASE_SECRET_KEY` pada `.env.local`, lihat `.env.example`).

Lokasi file test: `tests/integration/*.int.test.ts`, dengan helper bersama di `tests/integration/helpers/`.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| IK-01 | LaporanController | Laporan, Lokasi, Foto, Video (Model) | Controller - Model | INT-TC01 dst. |
| IK-02 | Laporan (Model) | PostgreSQL (RPC `kirim_laporan`, `cari_laporan_duplikat`, *sequence* ID tiket) | Aplikasi - Basis data | INT-TC01 dst. |
| IK-03 | LaporPage (unggah media) | Supabase Storage (bucket `media`) | Aplikasi - Basis data | INT-TC01 dst. |
| IK-04 | LaporanController | Cloudflare Turnstile (verifikasi token) | Aplikasi - Sistem eksternal | INT-TC01 dst. |
| IK-05 | ValidasiController | Laporan (Model) | Controller - Model | INT-TC20 dst. |
| IK-06 | Laporan (Model) | PostgreSQL (pembaruan status, RLS peran admin, *trigger* riwayat status) | Aplikasi - Basis data | INT-TC20 dst. |
| IK-07 | EvaluasiController | Evaluasi, HasilPerbaikan (Model) | Controller - Model | INT-TC20 dst. |
| IK-08 | Evaluasi (Model) | PostgreSQL (tabel evaluasi, perubahan status laporan) | Aplikasi - Basis data | INT-TC20 dst. |
| IK-09 | PostgreSQL (*trigger* perubahan status) | Notifikasi, NotifikasiController, Supabase Realtime | Basis data - Aplikasi | INT-TC20 dst. |
| IK-10 | PenugasanController | ListTugas (Model) | Controller - Model | INT-TC40 dst. |
| IK-11 | ListTugas (Model) | PostgreSQL (daftar tugas terurut prioritas, RLS peran eksekutor) | Aplikasi - Basis data | INT-TC40 dst. |
| IK-12 | PerbaikanController | HasilPerbaikan (Model) | Controller - Model | INT-TC40 dst. |
| IK-13 | HasilPerbaikan (Model) | PostgreSQL dan Supabase Storage (hasil perbaikan dan berkas bukti) | Aplikasi - Basis data | INT-TC40 dst. |
| IK-14 | StatusController | Laporan, Upvote (Model) | Controller - Model | INT-TC60 dst. |
| IK-15 | Upvote (Model) | PostgreSQL (tabel upvote, batas satu upvote per pengguna) | Aplikasi - Basis data | INT-TC60 dst. |
| IK-16 | StatusController | PostgreSQL (view `laporan_publik` tanpa identitas pelapor) | Aplikasi - Basis data | INT-TC60 dst. |
| IK-17 | AuthController dan proteksi rute | Supabase Auth (sesi dan peran pengguna) | Aplikasi - Sistem eksternal | INT-TC60 dst. |
| IK-18 | StatusLaporanPage, LaporPage (peta) | OpenStreetMap (*tile* peta melalui Leaflet) | Aplikasi - Sistem eksternal | INT-TC60 dst. |

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