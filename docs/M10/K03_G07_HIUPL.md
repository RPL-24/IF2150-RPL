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
| Kelas | *K03* |
| Kelompok | *G07*  |

| NIM | Nama |
|---|---|
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
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun untuk melaporkan hasil implementasi platform LaporKota beserta hasil pengujiannya. Dokumen ini memuat rancangan dan deskripsi perangkat lunak, lingkungan dan hasil implementasinya serta bukti hasil pengujiannya yang mencakup Pengujian Unit, Integrasi, Use Case, dan Kebutuhan Non-Fungsional. Dokumen ini ditujukan bagi Tim Pengembang (anggota kelompok) sebagai catatan hasil akhir implementasi perangkat lunak, dan Tim Penguji (asisten/dosen) sebagai landasan pengujian kesesuaian implementasi dengan rancangan awal.

## 1.2 Lingkup Masalah
Perangkat lunak yang akan dikembangkan adalah LaporKota, sebuah platform pelaporan kerusakan infrastruktur publik berbasis website yang dirancang untuk mempermudah warga dalam menyampaikan dan memantau laporannya. Sistem pelaporan ini memfasilitasi pengguna untuk melaporkan masalah fasilitas umum dalam lingkup satu kota, kapan saja dan di mana saja dengan menyertakan foto serta koordinat lokasi. Dengan adanya sistem ini diharapkan pengguna tidak lagi kesulitan mencari saluran pengaduan yang responsif dan proses perbaikan kerusakan fasilitas publik dapat berjalan dengan efisien.

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
| *CD* | *Singkatan dari Class Diagram, Diagram yang menggambarkan struktur kelas beserta atribut, metode, dan hubungan antarkelas di dalam sistem.* |
| *GPS* | *Singkatan dari Global Positioning System, yaitu sistem navigasi berbasis satelit untuk menentukan posisi.* |
| *API* | *Singkatan dari Application Programming Interface, yaitu antarmuka yang memungkinkan program saling terhubung.* |
| *Latitude / Longitude* | *Garis lintang dan garis bujur, yaitu dua nilai koordinat posisi di bumi.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang berfungsi sebagai panduan bagi pengembang untuk mengimplementasikan perangkat lunak dalam bentuk kode program.* |
| *APL* | *Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang menetapkan pola arsitektur, komponen, dan model view dari perangkat lunak.* |
| *Server Action* | *Fungsi server Next.js yang dipanggil langsung dari antarmuka* |
| *RLS* | *Row Level Security, aturan akses per baris di PostgreSQL/Supabase* |
| *RPC* | *Remote Procedure Call, fungsi PostgreSQL yang dipanggil aplikasi* |
| *Trigger* | *Fungsi database yang berjalan otomatis saat data berubah* |
| *Mock* | *Objek pengganti dependensi dalam unit test untuk pengujian kelas terpisah dari database* |
| *Vitest* | *Framework unit test Typescript yang digunakan pada proyek* |
| *CI* | *Continuous Integration, Github Actions yang menjalankan lint, typecheck, dan test pada setiap Pull Request* |
| *Seed* | *Skrip npm run seed yang mengisi akun uji dan data contoh fiktif* |
| *ID Tiket* | *Kode unik laporan dalam platform dengan format LK-XXXX* |


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
| *Antarmuka antarkomponen* | *IK-XX* | *Dibedakan dari antarmuka layar (I-XX); daftar pada Tabel 4.3.1* |
| *Objek Antarmuka* | *IXX-YY* | *Sesuai DPPL, contoh I06-08* |
| *Algoritma* | *Algo-XXX* | *Sesuai DPPL* |
| *Query* | *Q-XXX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |

## 1.5 Referensi
| 1 | Dokumen Spesifikasi Kebutuhan Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M5/K03_G07_SKPL.md |
| 2 | Dokumen Aristektur Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M6/K03_G07_APL.md |
| 3 | Dokumen Deskripsi Perancangan Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M8/K03_G07_DPPL2.md |
| 4 | Laporan Implementasi Perangkat Lunak LaporKota | Repository IF2150-RPL-K03-G07/docs/M9/K03_G07_Implementasi.md |
| 5 | Dokumentasi Vitest & `@vitest/coverage-v8` | https://vitest.dev/guide/coverage.html |
| 6 | Dokumentasi Chrome DevTools | https://developer.chrome.com/docs/devtools |

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun dengan sistematika berikut. **BAB 1: Pendahuluan** memuat tujuan penulisan dokumen, lingkup masalah, daftar definisi, aturan penomoran, referensi, serta ikhtisar dokumen. **BAB 2: Deskripsi Umum Perangkat Lunak** menjelaskan gambaran rancangan sistem, batasan, dan keterkaitannya dengan sistem eksternal. Terlampir juga pemodelan sistem perangkat lunak menggunakan Use Case Diagram. **BAB 3: Implementasi**  menjabarkan lingkungan implementasi, dan hasil-hasil implementasi perangkat lunak (modul, antarmuka, dll) yang telah dibuat berdasarkan DPPL. **BAB 4: Hasil Pengujian** menguraikan kedalaman pengujian pada setiap kelas, serta masing-masing hasil pengujiannya yang meliputi pengujian Unit, Integrasi, Use Case, dan Kebutuhan Non-Fungsional. **BAB 5: Traceability** memetakan seluruh KF, KNF, UC, Kelas, Hasil Implementasi, dan Test Case untuk memverifikasi kelengkapan dan keterkaitannya.

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

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti rancangan pada Subbab 2.1 DPPL dengan dua perbedaan: versi Next.js yang digunakan adalah 16.4.4 (DPPL: 16.3, pembaruan minor), serta penambahan Cloudflare Turnstile sebagai layanan verifikasi anti-bot (KNF04). Selain itu ditambahkan alat pengujian yang digunakan pada Tugas 10.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | Laptop masing-masing anggota (macOS, Linux, dan Windows) untuk pengembangan; server Vercel (*serverless*) dan Supabase (*cloud*) untuk *production* |
| *Operating System* | Pengembangan: macOS, Linux, dan Windows. Pengguna: *cross platform* melalui *browser* (Android, iOS, Windows, macOS, Linux) |
| *Bahasa Pemrograman* | TypeScript 5.9.3 di atas Node.js 24.13.0 (LTS); SQL (PostgreSQL) untuk *migration*, RPC, *trigger*, dan RLS |
| *Framework/Library* | Next.js 16.4.4, React 19.3.0, React DOM 19.3.0, @supabase/supabase-js 2.118.0, @supabase/ssr 0.12.7, Leaflet 1.9.4 dan React Leaflet 5.0.0 dengan *tile* OpenStreetMap, Tailwind CSS 4.3.4, Cloudflare Turnstile (anti-bot) |
| *DBMS* | PostgreSQL 17 yang dikelola Supabase, beserta Supabase Auth, Supabase Storage (bucket `media`), dan Supabase Realtime |
| *Development Tools* | Visual Studio Code, Supabase CLI 3.0.0 (*migration* dan *generate types*), Vercel CLI (*deploy*), ESLint 9.39.5, tsx 4.23.15 (menjalankan skrip seed), Git dan GitHub (*version control*, *pull request*, GitHub Actions sebagai CI untuk lint, typecheck, dan test) |
| *Testing Tools* | Vitest 5.1.0 (unit dan integrasi), @vitest/coverage-v8 5.1.0 (laporan *coverage*), Chrome DevTools dan Lighthouse (pengukuran KNF), pengujian manual melalui *browser* (use case) |
## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| 3 | C09 | Evaluasi | `src/server/entities/Evaluasi.ts` | – |
| 4 | C12 | ValidasiPage | `src/client/views/ValidasiPage.tsx`<br>`src/app/(admin)/validasi/page.tsx` | – |
| 5 | C15 | EvaluasiPage | `src/client/views/EvaluasiPage.tsx`<br>`src/app/(admin)/evaluasi/page.tsx` | – |
| 6 | C18 | ValidasiController | `src/server/controllers/ValidasiController.ts` | – |
| 7 | C21 | EvaluasiController | `src/server/controllers/EvaluasiController.ts` | – |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| 3 | I-03 | Validasi Laporan | `src/app/(admin)/validasi/page.tsx`<br>`src/client/views/ValidasiPage.tsx`<br>`src/client/components/validasi/AntreanLaporan.tsx`<br>`src/client/components/validasi/RincianLaporan.tsx`<br>`src/client/components/validasi/DialogTolak.tsx`<br>`src/app/(admin)/layout.tsx`<br>`src/client/components/validasi/AdminSidebar.tsx` | – |
| 4 | I-04 | Evaluasi Hasil Kerja | `src/app/(admin)/evaluasi/page.tsx`<br>`src/client/views/EvaluasiPage.tsx`<br>`src/client/components/evaluasi/DaftarSiapEvaluasi.tsx`<br>`src/client/components/evaluasi/KomparasiEvaluasi.tsx`<br>`src/client/components/evaluasi/DialogKeputusanEvaluasi.tsx`<br>`src/app/(admin)/layout.tsx`<br>`src/client/components/validasi/AdminSidebar.tsx` | – |
| ... | *...* | *...* | *...* | *...* |

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

### 4.2.2 Kelas Laporan

**ID Kelas:** *C02*  
**Nama Kelas:** *Laporan*  
**Tingkat:** *Mendalam*

| *C02-UT40* | *`getRincian(idTiket)`* | *Normal* | *Client palsu, `LK-0001`* | *Query tabel `laporan` beserta foto, video, dan riwayat; filter `id_tiket`; riwayat terurut waktu* | *Sesuai harapan; tes lulus (4ms)* | *Pass* |
| *C02-UT41* | *`getRincian(idTiket)`* | *Batas* | *Tiket tidak ada / tidak boleh dilihat (`LK-9999`)* | *`{ data: null, error: null }`* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C02-UT42* | *`getRincian(idTiket)`* | *Negatif* | *Basis data mengembalikan error* | *Error diteruskan tanpa diubah* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C02-UT43* | *`hitungPrioritas()`* | *Batas* | *Laporan tes `[TEST-INT]` baru (uji integrasi, trigger `tambah_upvote`)* | *`jumlah_upvote = 0`, `skor_prioritas = 0`* | *Sesuai harapan; tes lulus (102ms)* | *Pass* |
| *C02-UT44* | *`hitungPrioritas()`* | *Normal* | *1 upvote dari akun warga tes kedua* | *`jumlah_upvote = 1`, skor prioritas naik* | *Sesuai harapan; tes lulus (409ms)* | *Pass* |
| *C02-UT45* | *`hitungPrioritas()`* | *Negatif* | *Upvote kedua oleh akun yang sama* | *Ditolak; jumlah dukungan dan skor tidak berubah* | *Sesuai harapan; tes lulus (584ms)* | *Pass* |

### 4.2.3 Kelas Lokasi

**ID Kelas:** C03  
**Nama Kelas:** Lokasi  
**Tingkat:** Mendalam

Tabel 4.2.3. Hasil Pengujian Unit Kelas C03

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C03-UT01 | `dalamWilayah(titik)` | Normal | ITB Ganesha (-6.8915, 107.6107) dan Alun-alun Bandung (-6.9218, 107.607) | true | true untuk kedua titik; tes lulus | Pass |
| C03-UT02 | `dalamWilayah(titik, polygon)` | Normal | Titik (2, 2) pada polygon kotak 0–4 | true | true; tes lulus | Pass |
| C03-UT03 | `dalamWilayah(titik, polygon)` | Batas | Titik 0,0001° di dalam tepi dan 0,0001° di luar tepi kotak | true lalu false | Sesuai harapan; tes lulus | Pass |
| C03-UT04 | `dalamWilayah(titik, polygon)` | Batas | Polygon tidak cembung (bentuk U), titik di dasar U | true | true; tes lulus | Pass |
| C03-UT05 | `dalamWilayah(titik, polygon)` | Negatif | Titik di celah bentuk U | false | false; tes lulus | Pass |
| C03-UT06 | `dalamWilayah(titik)` | Negatif | Lembang, Jatinangor, Cimahi, Jakarta | false | false untuk keempat titik; tes lulus | Pass |
| C03-UT07 | `dalamWilayah(titik)` | Negatif | Latitude NaN | false | false; tes lulus | Pass |
| C03-UT08 | `dalamWilayah(titik, polygon)` | Negatif | Polygon kosong | false | false; tes lulus | Pass |
| C03-UT09 | Data `BATAS_WILAYAH` | Normal | Semua titik polygon batas kota | ≥ 3 titik, semua berformat [lat, lng] di sekitar Bandung | Sesuai harapan; tes lulus | Pass |
| C03-UT10 | `hitungJarak(a, b)` | Normal | ITB Ganesha ke Alun-alun Bandung | ≈ 3394 m (±50 m) | Sesuai harapan; tes lulus | Pass |
| C03-UT11 | `hitungJarak(a, b)` | Normal | Jarak A→B dan B→A | Sama (simetris) | Sama; tes lulus | Pass |
| C03-UT12 | `hitungJarak(a, b)` | Batas | Titik yang sama | 0 m | 0; tes lulus | Pass |
| C03-UT13 | `hitungJarak(a, b)` | Batas | Selisih 0,0001° lintang | ≈ 11,12 m (±0,2 m) | Sesuai harapan; tes lulus | Pass |
| C03-UT14 | `hitungJarak(a, b)` | Batas | Selisih 0,00017° dan 0,00019° (sekitar radius duplikat 20 m) | < 20 m dan > 20 m | Sesuai harapan; tes lulus | Pass |
| C03-UT15 | `hitungJarak(a, b)` | Batas | (0, 0) ke (0, 180), jarak maksimum di bumi | ≈ 20.015 km (±1 km) | Sesuai harapan; tes lulus | Pass |
| C03-UT16 | `hitungJarak(a, b)` | Negatif | Latitude NaN | NaN (bukan angka palsu) | NaN; tes lulus | Pass |
| C03-UT17 | `getKoordinat(lokasi)` | Normal | ITB Ganesha | [-6.8915, 107.6107] | Sesuai harapan; tes lulus | Pass |
| C03-UT18 | `getKoordinat(lokasi)` | Batas | (0, 0) | [0, 0] | Sesuai harapan; tes lulus | Pass |
| C03-UT19 | `getKoordinat(lokasi)` | Negatif | ITB Ganesha, periksa urutan | Bukan [longitude, latitude] | Urutan [lat, lng]; tes lulus | Pass |

Tabel 4.2.3b. Ringkasan Cakupan Kelas C03

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `hitungJarak()`, `getKoordinat()` (+ `dalamWilayah()`, operasi tambahan, lihat perubahan-dppl.md) |
| Operasi yang diuji | `dalamWilayah()`, `hitungJarak()`, `getKoordinat()` |
| ID Algoritma yang tercakup | Algo-020 (validasi wilayah), Algo-039 (jarak untuk cek duplikat) |
| Coverage (wajib ≥ 70%) | 100% line / 100% branch (100% statement, 100% function), Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C03-coverage) |

### 4.2.4 Kelas Foto

**ID Kelas:** C04  
**Nama Kelas:** Foto  
**Tingkat:** Mendalam

Tabel 4.2.4. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C04-UT01 | `formatDariNama(nama)` | Normal | IMG_2041.jpg | jpg | jpg; tes lulus | Pass |
| C04-UT02 | `formatDariNama(nama)` | Batas | foto.JPEG, a.b.PNG, VID.MKV | jpg, png, mkv | Sesuai harapan (3/3); tes lulus | Pass |
| C04-UT03 | `formatDariNama(nama)` | Negatif | tanpa-ekstensi, "foto." | String kosong | Sesuai harapan (2/2); tes lulus | Pass |
| C04-UT04 | `isFotoValid(berkas)` | Normal | a.jpg, a.jpeg, a.png, A.JPG, A.PNG, 2 MB | true | true (5/5); tes lulus | Pass |
| C04-UT05 | `isFotoValid(berkas)` | Batas | a.jpg tepat 10 MB | true | true; tes lulus | Pass |
| C04-UT06 | `isFotoValid(berkas)` | Batas | a.jpg 10 MB + 1 byte | false | false; tes lulus | Pass |
| C04-UT07 | `isFotoValid(berkas)` | Batas | a.png 1 byte | true | true; tes lulus | Pass |
| C04-UT08 | `isFotoValid(berkas)` | Negatif | gif, webp, mp4, heic, pdf, "jpg", a.constructor | false | false (7/7); tes lulus | Pass |
| C04-UT09 | `isFotoValid(berkas)` | Negatif | Ukuran 0 dan -1 byte | false | false (2/2); tes lulus | Pass |
| C04-UT10 | `ukuranValid(ukuran)` | Normal | 2 MB | true | true; tes lulus | Pass |
| C04-UT11 | `ukuranValid(ukuran)` | Batas | Tepat 10 MB; 10 MB + 1 byte | true; false | Sesuai harapan; tes lulus | Pass |
| C04-UT12 | `ukuranValid(ukuran)` | Negatif | 0, -5, NaN | false | false (3/3); tes lulus | Pass |
| C04-UT13 | `urlMedia(path)` | Normal | laporan/u/f.jpg | URL publik bucket media | Sesuai harapan; tes lulus | Pass |
| C04-UT14 | `urlMedia(path)` | Batas | Path kosong | URL folder bucket | Sesuai harapan; tes lulus | Pass |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C04

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `isFotoValid()` |
| Operasi yang diuji | `isFotoValid()`, `ukuranValid()`, `formatDariNama()`, `urlMedia()` |
| ID Algoritma yang tercakup | Algo-009 |
| Coverage (wajib ≥ 70%) | 100% line / 100% branch (100% statement, 100% function), Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C04-coverage) |

### 4.2.5 Kelas Video

**ID Kelas:** C05  
**Nama Kelas:** Video  
**Tingkat:** Mendalam

Tabel 4.2.5. Hasil Pengujian Unit Kelas C05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C05-UT01 | `isVideoValid(berkas)` | Normal | a.mp4, a.mov, a.mkv, 8 MB | true | true (3/3); tes lulus | Pass |
| C05-UT02 | `isVideoValid(berkas)` | Normal | A.MOV (huruf besar) | true | true; tes lulus | Pass |
| C05-UT03 | `isVideoValid(berkas)` | Normal | VID_0388.mkv dengan MIME kosong | true (dinilai dari ekstensi) | true; tes lulus | Pass |
| C05-UT04 | `isVideoValid(berkas)` | Batas | a.mp4 tepat 10 MB | true | true; tes lulus | Pass |
| C05-UT05 | `isVideoValid(berkas)` | Batas | a.mp4 10 MB + 1 byte | false | false; tes lulus | Pass |
| C05-UT06 | `isVideoValid(berkas)` | Batas | a.mov 1 byte | true | true; tes lulus | Pass |
| C05-UT07 | `isVideoValid(berkas)` | Negatif | a.mp4 0 byte | false | false; tes lulus | Pass |
| C05-UT08 | `isVideoValid(berkas)` | Negatif | avi, webm, jpg, png, "mp4" | false | false (5/5); tes lulus | Pass |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C05

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `isVideoValid()` |
| Operasi yang diuji | `isVideoValid()` |
| ID Algoritma yang tercakup | Algo-010 |
| Coverage (wajib ≥ 70%) | 100% line / 100% branch (100% statement, 100% function), Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C05-coverage) |


### 4.2.7 Kelas ListTugas

**ID Kelas:** *C07*  
**Nama Kelas:** *ListTugas*  
**Tingkat:** *Mendalam*

Tabel 4.2.7. Hasil Pengujian Unit Kelas [C07]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C07-UT01* | *`urutPrioritas()`* | *Normal* | *3 tugas dengan skor: 30, 92, 50* | *LK-002, LK-003, LK-001* | *Sesuai harapan; tes lulus (2ms)* | *Pass* |
| *C07-UT02* | *`urutPrioritas()`* | *Batas* | *2 tugas skor sama, waktu masuk berbeda* | *Yang masuk lebih awal di depan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT03* | *`urutPrioritas()`* | *Normal* | *Daftar asli yang terurut* | *Daftar asli tak beruhbah* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT04* | *`urutPrioritas()`* | *Batas* | *Daftar kosong* | *[]* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT05* | *`jumlahLaporanAktif`* | *Normal* | *2 tugas; 0 tugas* | *2; 0* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT06* | *`filterKategori(kategori)`* | *Normal* | *3 tugas, filter lampu_jalan_mati* | *LK-003, LK-001 (terurut)* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT07* | *`filterKategori(kategori)`* | *Batas* | *Filter trotoar_rusak (tidak ada laporan sesuai)* | *[]* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT08* | *`getLaporanById(idTiket)`* | *Normal* | *LK-002* | *Laporan LK-002* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT09* | *`getLaporanById(idTiket)`* | *Negatif* | *LK-9999* | *null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT10* | *`isKategori(nilai)`* | *Normal* | *5 nilai enum kategori* | *true untuk semuanya* | *Sesuai harapan; 5/5 kasus lulus* | *Pass* |
| *C07-UT11* | *`isKategori(nilai)`* | *Negatif* | *"", "semua", label tampilan, nilai berspasi, teks injeksi SQL* | *false untuk semuanya* | *Sesuai harapan; 5/5 kasus lulus* | *Pass* |
| *C07-UT12* | *`isTugasAktif(laporan)`* | *Normal* | *dikerjakan + menunggu_eksekusi* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT13* | *`isTugasAktif(laporan)`* | *Negatif* | *4 kombinasi status/tahap lain* | *false* | *Sesuai harapan; 4/4 kasus lulus* | *Pass* |
| *C07-UT14* | *`urutPrioritas()`* | *Negatif* | *skor berupa string numerik "2.5" dan "10"* | *Terurut sesuai angka LK-002, LK-001* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT15* | *`filterKategori(kategori)`* | *Negatif* | *Kategori di luar enum* | *[]* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C07-UT16* | *`getLaporanById(idTiket)`* | *Batas* | *Daftar tugas kosong* | *null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |


Tabel 4.2.7b. Ringkasan Cakupan Kelas C07

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `urutPrioritas()`, `filterKategori(kategori)`, `getLaporanById(idTiket)` |
| Operasi yang diuji | `urutPrioritas(idTiket)`, `filterKategori(idTiket)`, `getLaporanById()` |
| ID Algoritma yang tercakup | `Algo-012`, `Algo-013` |
| Coverage (wajib ≥ 70%) | *100% line / 100% branch (100% statement, 100% function), tool: Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C07-coverage.png)* |

### 4.2.8 Kelas HasilPerbaikan

**ID Kelas:** *C08*  
**Nama Kelas:** *HasilPerbaikan*  
**Tingkat:** *Mendalam*

Tabel 4.2.8. Hasil Pengujian Unit Kelas C08

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C08-UT01* | *`validasiBerkas(foto, video)`* | *Normal* | *Foto JPG/PNG & Video MP4/MOV/MKV 2 MB* | *true* | *Sesuai harapan; tes lulus (2ms)* | *Pass* |
| *C08-UT02* | *`validasiBerkas()`* | *Normal* | *Foto tanpa video* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT03* | *`validasiBerkas()`* | *Batas* | *Foto & video kosong* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT04* | *`validasiBerkas()`* | *Negatif* | *Foto a.heic* | *false* | *Sesuai harapan; 3/3 kasus lulus* | *Pass* |
| *C08-UT05* | *`validasiBerkas()`* | *Negatif* | *Video a.avi* | *false* | *Sesuai harapan; 3/3 kasus lulus* | *Pass* |
| *C08-UT06* | *`validasiBerkas()`* | *Batas* | *10 MB ; +1 byte* | *true ; false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT07* | *`validasiBerkas()`* | *Batas* | *Berkas 0 byte* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT08* | *`pilihBuktiSelesai(daftar)`* | *Batas* | *Belum ada hasil* | *null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT09* | *`pilihBuktiSelesai()`* | *Negatif* | *Belum ada hasil yang dievaluasi* | *null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT10* | *`pilihBuktiSelesai()`* | *Negatif* | *Semua hasil dikembalikan* | *null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT11* | *`pilihBuktiSelesai()`* | *Normal* | *Hasil lama dikembalikan & hasil baru selesai* | *Hasil yang selesai* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT12* | *`pilihBuktiSelesai()`* | *Normal* | *Beberapa hasil yang selesai* | *Hasil terbaru* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT13* | *`pilihBuktiSelesai()`* | *Normal* | *Satu hasil selesai* | *Objek tanpa field evaluasi* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT14* | *`pilihBuktiSelesai()`* | *Normal* | *Dua hasil yang selesai* | *Urutan daftar asli tidak berubah* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT15* | *`simpanBukti()`* | *Normal* | *Client palsu; idLaporan, catatan, 1 foto* | *RPC `kirim_hasil_perbaikan` dipanggil dengan argumen yang benar* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT16* | *`simpanBukti()`* | *Negatif* | *RPC mengembalikan error P0001* | *Error diteruskan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT17* | *`simpanBukti()`* | *Batas* | *3 foto + 1 video* | *Satu panggilan RPC membawa 4 media* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT18* | *`getBuktiLengkap()`* | *Normal* | *Hasil lama minta_ulang_bukti + hasil baru selesai* | *Membaca hasil_perbaikan per id_laporan; mengembalikan hasil selesai* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT19* | *`getBuktiLengkap()`* | *Batas* | *Database mengembalikan data: null* | *{ data: null, error: null}* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT20* | *`getBuktiLengkap()`* | *Negatif* | *Database mengembalikan error* | *{ data: null, error }* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.8b. Ringkasan Cakupan Kelas C08

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()` |
| Operasi yang diuji | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()`, `pilihBuktiSelesai()` |
| ID Algoritma yang tercakup | *`Algo-014`, `Algo-015`* |
| Coverage (wajib ≥ 70%) | *100% line / 100% branch (100% statement, 100% function), tool: Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C08-coverage.png)* |

### 4.2.9 Kelas Evaluasi

**ID Kelas:** C09<br>
**Nama Kelas:** Evaluasi<br>
**Tingkat:** Mendalam<br>
**File uji:** `src/server/entities/Evaluasi.test.ts`

Tabel 4.2.9. Hasil Pengujian Unit Kelas [C09]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C09-UT01 | `ambilDaftarSiapEvaluasi()` | Normal | Laporan dengan dua bukti, tanpa bukti, dan tanpa profil eksekutor | Bukti terbaru dipilih, laporan tanpa bukti dilewati, nama yang tidak tersedia bernilai `null` | Sesuai harapan | Pass |
| C09-UT02 | `ambilDaftarSiapEvaluasi()` | Batas | Daftar laporan kosong | Daftar kosong dikembalikan | Sesuai harapan | Pass |
| C09-UT03 | `ambilDaftarSiapEvaluasi()` | Negatif | Query ditolak database | Data `null` dan error diteruskan | Sesuai harapan | Pass |
| C09-UT04 | `ambilDetailEvaluasi()` | Normal | Tiket dengan profil pelapor dan bukti terbaru | Rincian, nama pelapor/eksekutor, foto dan video dipetakan | Sesuai harapan | Pass |
| C09-UT05 | `ambilDetailEvaluasi()` | Batas | Tiket tanpa profil pelapor dan tanpa bukti | Nama pelapor dan hasil perbaikan bernilai `null` | Sesuai harapan | Pass |
| C09-UT06 | `ambilDetailEvaluasi()` | Batas | Bukti tersedia tanpa profil eksekutor | Bukti tetap tampil dengan nama eksekutor `null` | Sesuai harapan | Pass |
| C09-UT07 | `ambilDetailEvaluasi()` | Batas | Tiket tidak ditemukan | Data dan error `null` | Sesuai harapan | Pass |
| C09-UT08 | `ambilDetailEvaluasi()` | Negatif | Query ditolak database | Data `null` dan error diteruskan | Sesuai harapan | Pass |
| C09-UT09 | `cariIdLaporan()` | Normal | Tiket ditemukan | ID internal laporan dikembalikan | Sesuai harapan | Pass |
| C09-UT10 | `cariIdLaporan()` | Batas | Tidak ada baris yang cocok | ID dan error `null` | Sesuai harapan | Pass |
| C09-UT11 | `cariIdLaporan()` | Negatif | Query ditolak database | ID `null` dan error diteruskan | Sesuai harapan | Pass |
| C09-UT12 | `simpanEvaluasi()` | Normal | Keputusan `belum_selesai` dengan catatan | INSERT ke tabel `evaluasi` mengembalikan ID evaluasi | Sesuai harapan | Pass |
| C09-UT13 | `simpanEvaluasi()` | Batas | Keputusan `selesai` dengan catatan `null` | INSERT menerima catatan `null` dan mengembalikan ID evaluasi | Sesuai harapan | Pass |
| C09-UT14 | `simpanEvaluasi()` | Negatif | INSERT ditolak database | Data `null` dan error diteruskan | Sesuai harapan | Pass |
| C09-UT15 | `getEvaluasiTerakhir()` | Normal | Tiket memiliki evaluasi | Query mengambil satu evaluasi terbaru beserta keputusan, catatan, dan waktu | Sesuai harapan | Pass |
| C09-UT16 | `getEvaluasiTerakhir()` | Batas | Tiket belum memiliki evaluasi | Data dan error `null` | Sesuai harapan | Pass |
| C09-UT17 | `getEvaluasiTerakhir()` | Negatif | Query ditolak database | Data `null` dan error diteruskan | Sesuai harapan | Pass |

Tabel 4.2.9b. Ringkasan Cakupan Kelas C09

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | Konstruktor `Evaluasi(...)`, `simpanEvaluasi()`, `getKeputusan()` |
| Operasi yang diuji | `ambilDaftarSiapEvaluasi()`, `ambilDetailEvaluasi()`, `cariIdLaporan()`, `simpanEvaluasi()`, `getEvaluasiTerakhir()` |
| ID Algoritma yang tercakup | `Algo-016` melalui `simpanEvaluasi()` (C09-UT12–C09-UT14) |
| Hasil pengujian unit | 17 test lulus. [Bukti unit test](./assets/bukti-test/unit-test/ut-uc02-uc05/C09-UT.png) |
| Coverage (wajib ≥ 70%) | 100% line / 100% branch (100% statement, 100% function). Diukur dengan `npx vitest run --coverage` (Vitest 5.1.0 dan V8). [Bukti coverage](./assets/bukti-test/unit-test/ut-uc02-uc05/C09-coverage.png) pada Subbab 4.6. |

Pada implementasi M9, data konstruktor diteruskan sebagai `DataEvaluasiBaru` dan keputusan terakhir dibaca melalui `getEvaluasiTerakhir()`.

### 4.2.17 Kelas LaporanController

**ID Kelas:** C17  
**Nama Kelas:** LaporanController  
**Tingkat:** Mendalam

Validasi server dipisah ke `laporan-validasi.ts` karena file `'use server'` hanya boleh mengekspor fungsi async; keduanya diperlakukan sebagai satu kelas C17. `verifikasiAntiBot()` bersifat private (sesuai DPPL), sehingga diuji melalui `kirimLaporan()`. Autentikasi, client Supabase, dan Cloudflare di-*mock*; interaksi nyata diuji pada INT-TC01 s.d. INT-TC09.

Tabel 4.2.17. Hasil Pengujian Unit Kelas C17

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C17-UT01 | `validasiForm()` | Normal | jalan_berlubang, deskripsi terisi | null (valid) | null; tes lulus | Pass |
| C17-UT02 | `validasiForm()` | Batas | Deskripsi 1 karakter | null | null; tes lulus | Pass |
| C17-UT03 | `validasiForm()` | Negatif | Kategori "banjir" (di luar enum) | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT04 | `validasiForm()` | Negatif | Deskripsi kosong / hanya spasi | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT05 | `validasiForm()` | Negatif | Kategori "constructor" | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT06 | `validasiLokasi()` | Normal | Pusat kota (-6.9175, 107.6191) | null | null; tes lulus | Pass |
| C17-UT07 | `validasiLokasi()` | Batas | Titik dekat tepi tenggara kota (-6.955, 107.7) | null | null; tes lulus | Pass |
| C17-UT08 | `validasiLokasi()` | Negatif | Jakarta | "Lokasi di luar daerah penanganan…" | Sesuai harapan; tes lulus | Pass |
| C17-UT09 | `validasiLokasi()` | Negatif | Latitude NaN | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT10 | `validasiLokasi()` | Negatif | Longitude Infinity | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT11 | `validasiBerkas()` | Normal | Satu foto JPG 2 MB | null | null; tes lulus | Pass |
| C17-UT12 | `validasiBerkas()` | Normal | Foto PNG + video MP4 | null | null; tes lulus | Pass |
| C17-UT13 | `validasiBerkas()` | Batas | Foto dan video tepat 10 MB | null | null; tes lulus | Pass |
| C17-UT14 | `validasiBerkas()` | Batas | Foto 10 MB + 1 byte | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT15 | `validasiBerkas()` | Negatif | Daftar kosong | Pesan form tidak lengkap | Sesuai harapan; tes lulus | Pass |
| C17-UT16 | `validasiBerkas()` | Negatif | PDF sebagai foto, AVI sebagai video | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT17 | `validasiBerkas()` | Negatif | MP4 dikirim bertipe foto | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT18 | `validasiBerkas()` | Negatif | Path di folder user lain | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT19 | `validasiBerkas()` | Negatif | Kolom format "png" untuk path .jpg | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT20 | `validasiBerkas()` | Negatif | Folder `laporan/<id>-palsu/` | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT21 | `kirimLaporan()` | Normal | Data valid, token sah, tidak ada duplikat | `{jenis: "terkirim", idTiket: "LK-0101"}`, cek duplikat dipanggil dengan kategori & koordinat | Sesuai harapan; tes lulus | Pass |
| C17-UT22 | `kirimLaporan()` | Batas | Deskripsi berspasi di awal/akhir | Disimpan dalam bentuk ter-trim | Sesuai harapan; tes lulus | Pass |
| C17-UT23 | `kirimLaporan()` | Normal | RPC duplikat mengembalikan LK-0042 (7,5 m) | `{jenis: "duplikat", idTiket: "LK-0042"}`, laporan baru tidak disimpan | Sesuai harapan; tes lulus | Pass |
| C17-UT24 | `kirimLaporan()` | Batas | Dua laporan serupa (3 m dan 19,9 m) | Yang pertama (LK-0042) dipakai | Sesuai harapan; tes lulus | Pass |
| C17-UT25 | `kirimLaporan()` / `verifikasiAkses()` | Negatif | Akun bukan warga | Ditolak, Cloudflare & DB tidak dipanggil | Sesuai harapan; tes lulus | Pass |
| C17-UT26 | `kirimLaporan()` | Negatif | Deskripsi hanya spasi | Pesan form tidak lengkap, DB tidak dipanggil | Sesuai harapan; tes lulus | Pass |
| C17-UT27 | `kirimLaporan()` | Negatif | Lokasi Jakarta | Pesan di luar wilayah, DB tidak dipanggil | Sesuai harapan; tes lulus | Pass |
| C17-UT28 | `kirimLaporan()` | Negatif | Berkas di folder user lain | Pesan berkas tidak valid | Sesuai harapan; tes lulus | Pass |
| C17-UT29 | `kirimLaporan()` | Negatif | RPC cek duplikat error koneksi | Pesan umum, laporan tidak disimpan | Sesuai harapan; tes lulus | Pass |
| C17-UT30 | `kirimLaporan()` | Negatif | RPC `kirim_laporan` menolak (P0001) | Pesan DB diteruskan | Sesuai harapan; tes lulus | Pass |
| C17-UT31 | `kirimLaporan()` | Negatif | RPC tanpa data dan tanpa error | Pesan umum | Sesuai harapan; tes lulus | Pass |
| C17-UT32 | `verifikasiAntiBot()` | Normal | Token sah | POST ke siteverify Cloudflare berisi secret & token | Sesuai harapan; tes lulus | Pass |
| C17-UT33 | `verifikasiAntiBot()` | Negatif | Token kosong | Ditolak tanpa memanggil Cloudflare | Sesuai harapan; tes lulus | Pass |
| C17-UT34 | `verifikasiAntiBot()` | Negatif | Token tidak valid (`success: false`) | Ditolak, laporan tidak disimpan | Sesuai harapan; tes lulus | Pass |
| C17-UT35 | `verifikasiAntiBot()` | Batas | `TURNSTILE_SECRET_KEY` kosong | Gagal-tertutup (ditolak) | Sesuai harapan; tes lulus | Pass |
| C17-UT36 | `verifikasiAntiBot()` | Negatif | Cloudflare membalas HTTP 500 | Ditolak | Sesuai harapan; tes lulus | Pass |
| C17-UT37 | `verifikasiAntiBot()` | Negatif | Cloudflare tidak bisa dihubungi | Ditolak | Sesuai harapan; tes lulus | Pass |
| C17-UT38 | `dukungLaporanDuplikat()` | Normal | Warga mendukung LK-0042 | ok, upvote dicatat untuk user aktif | Sesuai harapan; tes lulus | Pass |
| C17-UT39 | `dukungLaporanDuplikat()` | Batas | Tiket tidak ada / tidak publik | "Laporan tidak ditemukan." | Sesuai harapan; tes lulus | Pass |
| C17-UT40 | `dukungLaporanDuplikat()` | Negatif | Dukungan kedua akun sama (23505) | "Anda sudah mendukung laporan ini." | Sesuai harapan; tes lulus | Pass |
| C17-UT41 | `dukungLaporanDuplikat()` | Negatif | Mendukung laporan sendiri (RLS 42501) | "Anda tidak memiliki akses untuk tindakan ini." | Sesuai harapan; tes lulus | Pass |
| C17-UT42 | `dukungLaporanDuplikat()` | Negatif | Belum login | Ditolak, DB tidak dibaca | Sesuai harapan; tes lulus | Pass |
| C17-UT43 | `dukungLaporanDuplikat()` | Negatif | Error DB saat membaca laporan | Pesan umum | Sesuai harapan; tes lulus | Pass |

Tabel 4.2.17b. Ringkasan Cakupan Kelas C17

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiBerkas()`, `validasiLokasi()`, `kirimLaporan()` (private: `verifikasiAkses()`, `verifikasiAntiBot()`, `cekDuplikat()`, `terbitkanIdTiket()`) |
| Operasi yang diuji | `validasiForm()`, `validasiLokasi()`, `validasiBerkas()`, `kirimLaporan()`, `verifikasiAntiBot()` (lewat `kirimLaporan`), `dukungLaporanDuplikat()` |
| ID Algoritma yang tercakup | Algo-019, Algo-020, Algo-036, Algo-037, Algo-038, Algo-039 |
| Coverage (wajib ≥ 70%) | `LaporanController.ts` dan `laporan-validasi.ts`: 100% line / 100% branch (100% statement, 100% function), Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C17-coverage) |

### 4.2.18 Kelas ValidasiController

**ID Kelas:** C18<br>
**Nama Kelas:** ValidasiController<br>
**Tingkat:** Mendalam<br>
**File uji:** `src/server/controllers/ValidasiController.test.ts`

Tabel 4.2.18. Hasil Pengujian Unit Kelas [C18]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C18-UT01 | `Seluruh operasi publik` | Negatif | Guard menolak akun non-admin | Kelima operasi mengembalikan penolakan tanpa membuat klien database | Sesuai harapan | Pass |
| C18-UT02 | `susunAntrean()` | Normal | Dua laporan Diterima dengan waktu masuk berbeda, parameter urutan dihilangkan | Mengambil status Diterima dan mengurutkan terbaru dahulu | Sesuai harapan | Pass |
| C18-UT03 | `susunAntrean(true)` | Normal | Dua laporan yang sama dengan urutan naik | Laporan terlama tampil dahulu | Sesuai harapan | Pass |
| C18-UT04 | `saringAntrean()` | Batas | Kategori `semua` atau hanya spasi | Seluruh antrean dikembalikan | Sesuai harapan | Pass |
| C18-UT05 | `saringAntrean()` | Normal | Kategori `jalan_berlubang` | Hanya laporan yang cocok dikembalikan | Sesuai harapan | Pass |
| C18-UT06 | `saringAntrean()` | Negatif | Kategori di luar enum | Pesan “Kategori tidak valid.” | Sesuai harapan | Pass |
| C18-UT07 | `ambilRincianLaporan()` | Normal | ID tiket ditemukan | Rincian tiket dari entity Laporan dikembalikan | Sesuai harapan | Pass |
| C18-UT08 | `setujuiLaporan()` | Normal | Tiket berstatus Diterima | Status menjadi Dikerjakan / menunggu eksekusi, halaman direvalidasi, prioritas ditangani database | Sesuai harapan | Pass |
| C18-UT09 | `tolakLaporan()` | Negatif | Alasan kosong, hanya spasi, atau whitespace baris baru/tab | Pesan wajib isi alasan, tanpa UPDATE atau revalidasi | 3/3 variasi lulus | Pass |
| C18-UT10 | `tolakLaporan()` | Normal | Tiket Diterima dengan alasan valid yang diapit spasi | Status Ditolak, alasan disimpan setelah trim, halaman direvalidasi | Sesuai harapan | Pass |

Tabel 4.2.18b. Ringkasan Cakupan Kelas C18

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `verifikasiAkses()`, `susunAntrean()`, `saringAntrean()`, `ambilRincianLaporan()`, `setujuiLaporan()`, `tolakLaporan()` |
| Operasi yang diuji | Kelima Server Action publik, termasuk guard internal melalui C18-UT01 |
| ID Algoritma yang tercakup | `Algo-041` (C18-UT01–C18-UT03), `Algo-042` (C18-UT01, C18-UT08), `Algo-043` (C18-UT01, C18-UT09–C18-UT10) |
| Hasil pengujian unit | 12 test lulus. [Bukti unit test](./assets/bukti-test/unit-test/ut-uc02-uc05/C18-UT.png) |
| Coverage (wajib ≥ 70%) | 100% line / 78,94% branch (85,18% statement, 100% function). Diukur dengan `npx vitest run --coverage` (Vitest 5.1.0 dan V8). [Bukti coverage](./assets/bukti-test/unit-test/ut-uc02-uc05/C18-coverage.png) pada Subbab 4.6. |

Suite C18 mencapai target coverage. Kasus batas `susunAntrean()`, `ambilRincianLaporan()`, `setujuiLaporan()`, dan `tolakLaporan()` belum tercakup sebagai uji tersendiri, sehingga syarat tiga jenis kasus per operasi publik masih belum terpenuhi sepenuhnya.

### 4.2.19 Kelas PenugasanController

**ID Kelas:** *C19*  
**Nama Kelas:** *PenugasanController*  
**Tingkat:** *Sedang*

Tabel 4.2.19. Hasil Pengujian Unit Kelas C19

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C19-UT01* | *`verifikasiAkses()`* | *Normal* | *Sesi eksekutor* | *true* | *Sesuai harapan; tes lulus* | *Pass* |
| *C19-UT02* | *`verifikasiAkses()`* | *Negatif* | *Sesi ditolak* | *false* | *Sesuai harapan; tes lulus* | *Pass* |
| *C19-UT03* | *`doSorting()`* | *Normal* | *3 tugas (skor 5, 9, 9)* | *LK-003, LK-002, LK-001* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C19-UT04* | *`doSorting()`* | *Batas* | *Tugas kosong* | *ok([])* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT05* | *`doSorting()`* | *Negatif* | *Akses ditolak* | *Pesan tanpa akses, database tak dibaca* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C19-UT06* | *`doSorting()`* | *Negatif* | *Error database* | *Gagal memuat daftar tugas* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT07* | *`doFilter(kategori)`* | *Normal* | *lampu_jalan_mati* | *2 tugas lampu terurut* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT08* | *`doFilter(kategori)`* | *Negatif* | *"semua", "". label, teks injeksi* | *Kategori tak dikenal... (tanpa query)* | *Sesuai harapan; 4/4 kasus lulus* | *Pass* |
| *C19-UT09* | *`doFilter(kategori)`* | *Negatif* | *Database error* | *Pesan gagal memuat* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT10* | *`bukaLaporan(idTiket)`* | *Normal* | *Tugas aktif tanpa evaluasi* | *Rincian lengkap, evaluasiTerakhir: null* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT11* | *`bukaLaporan(idTiket)`* | *Normal* | *Tugas dengan evaluasi* | *Rincian lengkap, evaluasiTerakhir berisi catatan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT12* | *`bukaLaporan(idTiket)`* | *Negatif* | *Tiket tidak ada/sudah berhasil* | *Tugas tidak ditemukan atau sudah tidak aktif* | *Sesuai harapan; 3/3 kasus lulus* | *Pass* |
| *C19-UT13* | *`bukaLaporan(idTiket)`* | *Negatif* | *Error membaca rincian* | *Gagal memuat rincian tugas* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT14* | *`bukaLaporan(idTiket)`* | *Negatif* | *Error membaca evaluasi* | *Gagal memuat rincian tugas* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C19-UT15* | *`bukaLaporan(idTiket)`* | *Negatif* | *Belum login* | *Pesan tanpa akses, client tak dibuat* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.2.20 Kelas PerbaikanController

**ID Kelas:** *C20*  
**Nama Kelas:** *PerbaikanController*  
**Tingkat:** *Sedang*

Tabel 4.2.20. Hasil Pengujian Unit Kelas C20

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C20-UT01* | *`validasiForm(catatan, foto, video)`* | *Normal* | *Catatan + 1 foto* | *true* | *Sesuai harapan; tes lulus (2ms)* | *Pass* |
| *C20-UT02* | *`validasiForm()`* | *Normal* | *Catatan + foto + video* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT03* | *`validasiForm()`* | *Negatif* | *catatan "" / "  " / "\n\t* | *false* | *Sesuai harapan; 3/3 kasus lulus* | *Pass* |
| *C20-UT04* | *`validasiForm()`* | *Negatif* | *Tanpa foto, ada video* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT05* | *`validasiForm()`* | *Batas* | *Catatan 1 karakter + 1 foto* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT06* | *`cekKelengkapan()`* | *Normal* | *catatan/foto kosong* | *Mennadai bagian yang kosong* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C20-UT07* | *`cekMediaTerunggah()`* | *Normal* | *Foto/video di hasil/<idUser>/* | *true* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT08* | *`cekMediaTerunggah()`* | *Negatif* | *Folder eksekutor lain* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT09* | *`cekMediaTerunggah()`* | *Negatif* | *Folder laporan/warga* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT10* | *`cekMediaTerunggah()`* | *Negatif* | *Video di daftar foto* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT11* | *`cekMediaTerunggah()`* | *Negatif* | *format tidak sesuai batasan ekstensi* | *false* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT12* | *`verifikasiAkses()`* | *Normal* | *Sesi eksekutor* | *true* | *Sesuai harapan; tes lulus* | *Pass* |
| *C20-UT13* | *`verifikasiAkses()`* | *Negatif* | *Sesi ditolak* | *false* | *Sesuai harapan; tes lulus* | *Pass* |
| *C20-UT14* | *`unggahHasil(idTiket, catatan, foto, video)`* | *Normal* | *Catatan berspasi + 1 foto + 1 video* | *ok({idTiket}), catatan di-trim* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C20-UT15* | *`unggahHasil()`* | *Batas* | *Foto tepat 10 MB* | *ok* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT16* | *`unggahHasil()`* | *Negatif* | *Akses ditolak* | *Pesan akses, database tak tersentuh* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C20-UT17* | *`unggahHasil()`* | *Negatif* | *Catatan kosong* | *PESAN_TAK_LENGKAP* | *Sesuai harapan; 3/3 kasus lulus* | *Pass* |
| *C20-UT18* | *`unggahHasil()`* | *Negatif* | *Tipe masukan salah dari client* | *PESAN_TAK_LENGKAP* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT19* | *`unggahHasil()`* | *Negatif* | *GIF, > 10MB, folder lain* | *PESAN_BERKAS_TIDAK_VALID, berkas tak disimpan* | *Sesuai harapan; 5/5 kasus lulus* | *Pass* |
| *C20-UT20* | *`unggahHasil()`* | *Negatif* | *Tiket tidak ada/menunggu_evaluasi* | *Pesan tugas tak aktif, tidak disimpan* | *Sesuai harapan; 2/2 kasus lulus* | *Pass* |
| *C20-UT21* | *`unggahHasil()`* | *Negatif* | *Error membaca laporan* | *pesanErrorDB(error)* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT22* | *`unggahHasil()`* | *Negatif* | *RPC menolak (P0001)* | *Pesan database diteruskan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT23* | *`unggahHasil()`* | *Negatif* | *Koneksi gagal* | *Gagal mengirim hasil perbaikan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT24* | *`unggahHasil()`* | *Negatif* | *xxx* | *xxx* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |


<br>

### 4.2.21 Kelas EvaluasiController

**ID Kelas:** C21<br>
**Nama Kelas:** EvaluasiController<br>
**Tingkat:** Mendalam<br>
**File uji:** `src/server/controllers/EvaluasiController.test.ts`

Tabel 4.2.21. Hasil Pengujian Unit Kelas [C21]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C21-UT01 | `Seluruh operasi publik` | Negatif | Guard menolak akun non-admin | Ketiga operasi gagal tanpa membuat klien database | Sesuai harapan | Pass |
| C21-UT02 | `ambilDaftarUntukEvaluasi()` | Normal | Entity mengembalikan satu laporan siap dievaluasi | Daftar dikembalikan dalam hasil sukses | Sesuai harapan | Pass |
| C21-UT03 | `ambilDaftarUntukEvaluasi()` | Batas | Daftar siap evaluasi kosong | Hasil sukses dengan daftar kosong | Sesuai harapan | Pass |
| C21-UT04 | `ambilDaftarUntukEvaluasi()` | Negatif | Query daftar ditolak | Pesan akses database diterjemahkan | Sesuai harapan | Pass |
| C21-UT05 | `ambilDetailEvaluasi()` | Normal | Tiket Dikerjakan / menunggu evaluasi dengan bukti | Detail dikembalikan dalam hasil sukses | Sesuai harapan | Pass |
| C21-UT06 | `ambilDetailEvaluasi()` | Batas | ID tiket diapit spasi | Entity menerima ID hasil trim dan detail dikembalikan | Sesuai harapan | Pass |
| C21-UT07 | `ambilDetailEvaluasi()` | Negatif | ID tiket hanya spasi | Pesan wajib isi ID tanpa membuat klien database | Sesuai harapan | Pass |
| C21-UT08 | `ambilDetailEvaluasi()` | Negatif | Tiket tidak ditemukan | Pesan “Laporan tidak ditemukan.” | Sesuai harapan | Pass |
| C21-UT09 | `ambilDetailEvaluasi()` | Negatif | Query detail ditolak | Pesan akses database diterjemahkan | Sesuai harapan | Pass |
| C21-UT10 | `ambilDetailEvaluasi()` | Negatif | Laporan sudah Berhasil | Pesan bahwa laporan tidak sedang menunggu evaluasi | Sesuai harapan | Pass |
| C21-UT11 | `ambilDetailEvaluasi()` | Negatif | Tahap masih menunggu eksekusi | Pesan bahwa laporan tidak sedang menunggu evaluasi | Sesuai harapan | Pass |
| C21-UT12 | `ambilDetailEvaluasi()` | Negatif | Bukti perbaikan belum tersedia | Pesan bahwa laporan tidak sedang menunggu evaluasi | Sesuai harapan | Pass |
| C21-UT13 | `simpanKeputusan()` | Negatif | ID tiket atau ID hasil hanya berisi spasi | Pesan data tidak lengkap tanpa membuat klien database atau merevalidasi halaman | 2/2 variasi lulus | Pass |
| C21-UT14 | `simpanKeputusan()` | Negatif | Keputusan di luar enum | Pesan keputusan tidak valid tanpa membuat klien database atau merevalidasi halaman | Sesuai harapan | Pass |
| C21-UT15 | `simpanKeputusan()` | Negatif | ID internal laporan tidak ditemukan | Pesan laporan tidak ditemukan tanpa INSERT atau revalidasi | Sesuai harapan | Pass |
| C21-UT16 | `simpanKeputusan()` | Negatif | Query pencarian ID laporan ditolak | Pesan akses database tanpa INSERT atau revalidasi | Sesuai harapan | Pass |
| C21-UT17 | `simpanKeputusan()` | Negatif | INSERT ditolak database | Pesan akses database tanpa revalidasi | Sesuai harapan | Pass |
| C21-UT18 | `simpanKeputusan()` | Negatif | `belum_selesai` dengan catatan kosong, spasi saja, atau tanpa catatan | Pesan catatan wajib diisi tanpa INSERT atau revalidasi | 3/3 variasi lulus | Pass |
| C21-UT19 | `simpanKeputusan()` | Negatif | `minta_ulang_bukti` dengan catatan kosong, spasi saja, atau tanpa catatan | Pesan catatan wajib diisi tanpa INSERT atau revalidasi | 3/3 variasi lulus | Pass |
| C21-UT20 | `simpanKeputusan()` | Batas | `selesai` dengan catatan hanya spasi | Keputusan disimpan dengan catatan `null` dan halaman direvalidasi | Sesuai harapan | Pass |
| C21-UT21 | `simpanKeputusan()` | Normal | `belum_selesai` dengan catatan diapit spasi | Keputusan disimpan dengan catatan hasil trim, status ditangani database, dan halaman direvalidasi | Sesuai harapan | Pass |

Tabel 4.2.21b. Ringkasan Cakupan Kelas C21

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `verifikasiAkses()`, `ambilDaftarUntukEvaluasi()`, `pilihSiapEvaluasi()`, `urutkanBerdasarkanWaktu()`, `ambilDetailEvaluasi()`, `simpanKeputusan()`, `ambilIdEksekutor()`, `ambilIdWarga()` |
| Operasi yang diuji | `ambilDaftarUntukEvaluasi()`, `ambilDetailEvaluasi()`, `simpanKeputusan()` dan guard internal |
| ID Algoritma yang tercakup | `Algo-048` (C21-UT01), `Algo-049` (C21-UT02–C21-UT04 dan C09-UT01–C09-UT03), `Algo-050` (C21-UT13–C21-UT21) |
| Hasil pengujian unit | 26 test lulus. [Bukti unit test](./assets/bukti-test/unit-test/ut-uc02-uc05/C21-UT.png) |
| Coverage (wajib ≥ 70%) | 100% line / 100% branch (100% statement, 100% function). Diukur dengan `npx vitest run --coverage` (Vitest 5.1.0 dan V8). [Bukti coverage](./assets/bukti-test/unit-test/ut-uc02-uc05/C21-coverage.png) pada Subbab 4.6. |

Pemilahan dan pengurutan daftar berada di query C09. Pemutakhiran status serta notifikasi pelapor dan eksekutor ditangani trigger basis data. Uji unit memeriksa data yang diteruskan controller dan responsnya.

<br>

## 4.3 Pengujian Integrasi

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
| IK-01 | LaporanController | Laporan, Lokasi, Foto, Video (Model) | Controller - Model | INT-TC01, INT-TC06, INT-TC07 |
| IK-02 | Laporan (Model) | PostgreSQL (RPC `kirim_laporan`, `cari_laporan_duplikat`, *sequence* ID tiket) | Aplikasi - Basis data | INT-TC01, INT-TC04, INT-TC05, INT-TC07 |
| IK-03 | LaporPage (unggah media) | Supabase Storage (bucket `media`) | Aplikasi - Basis data | INT-TC02, INT-TC03 |
| IK-04 | LaporanController | Cloudflare Turnstile (verifikasi token) | Aplikasi - Sistem eksternal | INT-TC06, INT-TC08, INT-TC09 |
| IK-05 | ValidasiController | Laporan (Model) | Controller - Model | INT-TC20 dst. |
| IK-06 | Laporan (Model) | PostgreSQL (pembaruan status, RLS peran admin, *trigger* riwayat status) | Aplikasi - Basis data | INT-TC20 dst. |
| IK-07 | EvaluasiController | Evaluasi, HasilPerbaikan (Model) | Controller - Model | INT-TC20 dst. |
| IK-08 | Evaluasi (Model) | PostgreSQL (tabel evaluasi, perubahan status laporan) | Aplikasi - Basis data | INT-TC20 dst. |
| IK-09 | PostgreSQL (*trigger* perubahan status) | Notifikasi, NotifikasiController, Supabase Realtime | Basis data - Aplikasi | INT-TC20 dst. |
| IK-10 | PenugasanController | ListTugas (Model) | Controller - Model | INT-TC40 – INT-TC43, INT-TC47 |
| IK-11 | ListTugas (Model) | PostgreSQL (daftar tugas terurut prioritas, RLS peran eksekutor) | Aplikasi - Basis data | INT-TC40 – INT-TC43 |
| IK-12 | PerbaikanController | HasilPerbaikan (Model) | Controller - Model | INT-TC44 – INT-TC46 |
| IK-13 | HasilPerbaikan (Model) | PostgreSQL dan Supabase Storage (hasil perbaikan dan berkas bukti) | Aplikasi - Basis data | INT-TC44 – INT-TC46 |
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
| *INT-TC40* | *IK-10, IK-11* | *Normal, data flow: daftar tugas* | *Laporan tes [TEST-INT] disetujui admin tes; eksekutor tes doSorting()* | *Laporan tes ada, daftar terurut prioritas* | *Laporan tes [TEST-INT] muncul di hasil doSorting() dan seluruh daftar terurut skor menurun, seri waktu masuk lebih awal (452ms)* | *Pass* |
| *INT-TC41* | *IK-10, IK-11* | *Normal, interface coordination: filter* | *doFilter("rambu_marka_rusak")* | *Laporan tes ada, semua berkategori rambu_marka_rusak, daftar terurut* | *doFilter("rambu_marka_rusak") memuat laporan tes, semua item berkategori tampil terurut (292ms)* | *Pass* |
| *INT-TC42* | *IK-10, IK-11* | *Gagal, protocol: Role warga* | *Warga tes doSorting()* | *ok: false* | *Akun warga tes ditolak oleh requireRole (315ms)* | *Pass* |
| *INT-TC43* | *IK-10, IK-11* | *Normal + gagal: rincian* | *bukaLaporan(<tiket tes>), lalu "LK-TIDAK-ADA"* | *Path foto sama, evaluasi null, tiket fiktif ditolak* | *Rincian laporan tes sesuai database, path foto sama dengan berkas yang diunggah, evaluasiTerakhir null, tiket fiktif ditolak (2164ms)* | *Pass* |
| *INT-TC44* | *IK-12, IK-13* | *Normal, data flow: Storage -> RPC -> tabel* | *Unggah JPG ke hasil/<id>/, unggahHasil()* | *1 baris hasil + 1 foto, tahap = menunggu_evaluasi* | *unggahHasil() ok, tepat 1 baris hasil_perbaikan + 1 baris foto. Laporan berstatus dikerjakan, tahap menunggu_evaluasi (1462ms)* | *Pass* |
| *INT-TC45* | *IK-12, IK-13* | *Gagal, protocol: kirim ulang* | *unggahHasil() kedua kali* | *ok: false, baris hasil tetap 1* | *Kirim ulang ditolak, jumlah baris hasil_perbaikan tetap satu (472ms)* | *Pass* |
| *INT-TC46* | *IK-12, IK-13* | *Gagal, interface coordination: path orang lain* | *Path hasil/<id warga>/..* | *PESAN_BERKAS_TIDAK_VALID* | *Ditolak dengan PESAN_BERKAS_TIDAK_VALID, data tidak tersimpan (362ms)* | *Pass* |
| *INT-TC47* | *IK-10* | *Normal, data flow: UC05 -> UC03* | *Admin tes evaluasi minta_ulang_bukti, eksekutor bukaLaporan()* | *Tahap kembali menunggu_eksekusi, catatan evaluasi tampil* | *Setelah minta_ulang_bukti, tugas kembali ke tahap menunggu_eksekusi, evaluasiTerakhir memuat catatan admin (1055ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.
### 4.4.1 Use Case Mengirim Laporan Kerusakan

**ID Use Case:** UC01  
**Nama Use Case:** Mengirim Laporan Kerusakan

Diuji di production (https://laporkota.vercel.app) dengan akun seed `warga1@laporkota.test` dan `warga2@laporkota.test`, tampilan mobile.

Tabel 4.4.1. Hasil Pengujian Use Case UC01

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC01-TC01 | KF01, KF02, KF04, KF05, KF07, KF08 | Normal | 1. Login warga1, buka "Buat Laporan".<br>2. Pilih kategori, isi deskripsi, unggah foto dan video.<br>3. Tentukan lokasi di dalam kota.<br>4. Tunggu verifikasi Cloudflare "Success!".<br>5. Klik "Kirim Laporan". | Foto JPG 0,1 MB, video MP4 2,4 MB, titik di dalam batas kota | Laporan tersimpan berstatus Diterima, dialog "Laporan terkirim" menampilkan ID tiket | Dialog "Laporan terkirim" tampil dengan ID tiket LK-0030; tombol "Lihat Status" dan "Tutup" tersedia | Pass |
| UC01-TC02 | KF03 | Alternatif 1: foto/video tidak valid | 1. Buka "Buat Laporan".<br>2. Pilih berkas berformat tidak didukung / > 10 MB pada isian Foto. | [ISI: nama/format/ukuran berkas yang dipakai] | Berkas ditolak, pesan validasi format dan ukuran tampil, berkas tidak tersimpan | Berkas tidak masuk daftar; tampil pesan merah "Foto harus JPG/PNG, video MP4/MOV/MKV, maks. 10 MB" | Pass |
| UC01-TC03 | KF01 | Alternatif 2: lokasi di luar daerah penanganan | 1. Buka "Buat Laporan".<br>2. Klik titik di peta di luar garis batas kota (sekitar Cimenyan). | Titik di luar batas kota | Sistem menolak dan menampilkan "Lokasi di luar daerah penanganan." | Tampil "Lokasi di luar daerah penanganan. Pilih titik di dalam batas kota." dan tombol "Kirim Laporan" nonaktif | Pass |
| UC01-TC04 | KF05, KF06 | Tambahan: laporan duplikat (≤ 20 m, kategori sama) | 1. Login warga2.<br>2. Buat laporan berkategori sama di titik LK-0030.<br>3. Klik "Kirim Laporan". | Kategori dan titik sama dengan LK-0030 | Konfirmasi duplikat tampil dan aksi dialihkan menjadi dukungan | Dialog "Laporan serupa sudah ada" menyebut LK-0030 dengan tombol "Dukung" dan "Batal" | Pass |


### 4.4.2 Use Case Memvalidasi Laporan Baru

**ID Use Case:** UC02<br>
**Nama Use Case:** Memvalidasi Laporan Baru<br>
**Prakondisi:** Admin sudah masuk dan tersedia beberapa laporan Diterima dengan kategori dan waktu masuk berbeda. Siapkan akun warga pelapor, warga lain untuk memberi dukungan, serta akun eksekutor.

Tabel 4.4.2. Hasil Pengujian Use Case UC02

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF07, KF09, KF10, KF12, KF13 | Normal — laporan dinyatakan valid | 1. Beri dukungan tambahan pada tiket uji dengan akun warga lain.<br>2. Buka `/validasi` sebagai admin dan pilih tiket.<br>3. Klik “Valid” dan konfirmasi.<br>4. Buka daftar tugas sebagai eksekutor dan lonceng notifikasi sebagai pelapor. | Tiket Diterima dengan foto/video, koordinat dan dukungan. Siapkan tugas pembanding dengan skor lebih rendah. | Antrean Diterima tampil terbaru dahulu dengan filter kategori. Rincian menampilkan bukti, deskripsi, kategori, waktu, peta dan jumlah dukungan yang sudah bertambah. Tiket menjadi Dikerjakan / menunggu eksekusi dan hilang dari antrean validasi setelah konfirmasi. Daftar tugas menempatkan tiket sesuai skor yang diperbarui dan pelapor menerima notifikasi di aplikasi. | Dasbor menampilkan konfirmasi bahwa laporan berhasil divalidasi dan diteruskan ke daftar tugas penugasan. Antrean validasi dimuat kembali dengan 10 laporan. | Pass |
| UC02-TC02 | KF09, KF10 | Alternatif 1 — menyaring antrean sebelum meninjau | 1. Buka `/validasi`.<br>2. Pilih kategori dan ubah urutan waktu masuk ke terlama dahulu.<br>3. Pilih satu tiket hasil saringan, lalu kembalikan filter ke “Semua kategori”. | Dua tiket Diterima dari kategori yang sama dengan waktu masuk berbeda dan satu tiket kategori lain. | Antrean hanya menampilkan kategori terpilih dengan urutan terlama dahulu. Rincian tiket yang dipilih tampil. “Semua kategori” menampilkan kembali seluruh antrean. | Filter “Jalan berlubang” menampilkan tiga laporan dengan urutan “Terlama”. Rincian LK-0019 tampil beserta deskripsi dan peta lokasi. | Pass |
| UC02-TC03 | KF07, KF10, KF11 | Alternatif 2 — laporan dinyatakan tidak valid | 1. Pilih tiket Diterima dan periksa rinciannya.<br>2. Klik “Tolak”, lalu coba konfirmasi dengan alasan kosong.<br>3. Isi alasan dan konfirmasi.<br>4. Periksa notifikasi dan status tiket sebagai pelapor. | Tiket uji berbeda dari UC02-TC01, alasan kosong lalu “Lokasi pada bukti tidak sesuai laporan”. | Alasan wajib diisi dan tiket tetap Diterima saat pengiriman tanpa alasan. Setelah konfirmasi dengan alasan valid, status menjadi Ditolak, alasan tersimpan, aplikasi menampilkan konfirmasi dan kembali ke antrean. Pelapor menerima notifikasi di aplikasi yang memuat alasan. | Dasbor menampilkan konfirmasi bahwa laporan berhasil ditolak dan status diperbarui. Antrean validasi dimuat kembali dengan 9 laporan. | Pass |


### 4.4.3 Use Case Melihat Penugasan Lapangan

**ID Use Case:** UC03
**Nama Use Case:** Melihat Penugasan Lapangan

Tabel 4.4.3. Hasil Pengujian Use Case UC03

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC03-TC01* | *KF13, KF14* | *Normal* | *1. Login eksekutor.<br>2. Buka daftar tugas* | *Akun eksekutor* | *Tugas "Dikerjakan" tampil, terurut skor (jika seri sesuai waktu masuk)* | *Daftar tugas menampilkan 6 tugas aktif yang terurut berdasarkan skor prioritas, dan untuk yang seri sesuai waktu masuk.* | *Pass* |
| *UC03-TC02* | *KF14* | *Normal (rincian)* | *1. Klik kartu LK-0027.* | *LK-0027* | *Rincian lengkap: ID, kategori, deskripsi, foto, peta, koordinat, dukungan, tombol Gmaps, Laporkan hasil* | *Rincian LK--027 tampil: Kategori Rambu/marka rusak, Masuk 19 Nov 2026 22.14, Status Dikerjakan Menunggu eksekusi, Foto, Deskripsi, Peta, Lokasi, Koordinat -6.87560, 107.62460, 0 dukungan, tombol GMaps & Laporkan Hasil tampil.* | *Pass* |
| *UC03-TC03* | *KF14* | *Alternatif 1: menyaring berdasarkan kategori* | *1. Pilih "Rambu / marka jalan rusak".<br>2. Pilih "Semua kategori".* | *Kategori rambu_marka_rusak* | *Hanya kategori itu yang tampil, setelah itu semua kembali tanpa error.* | *Filter "Rambu / marka rusak" menampilkan 2 tugas (LK-0004 & LK-0027) dan tetap terurut. Kembali ke kategori "Semua kategori" menampilkan seluruh tugas kembali.* | *Pass* |
| *UC03-TC04* | *KF14* | *Alternatif 2: belum ada penugasan* | *1. Pilih kategori tanpa tugas* | *Kategori Saluran air tersumbat* | *Pesan belum ada penugasan, tanpa error* | *Tampil "Tidak ada tugas dengan kategori saluran air tersumgat"* | *Pass* |
| *UC03-TC05* | *KF14, KF17* | *Tambahan: tugas hasil revisi* | *1. Admin "Minta ulang bukti" LK-X.<br>2. Eksekutor buka LK-X.* | *LK-0027* | *Kotak "Dikembalikan Tim Administrasi" + catatan admin* | *Rincian LK-0027 tetap lengkap dan menambahkan kotak "Dikembalikan Tim Administrasi: Minta ulang bukti" dengan catatan admin "Masih kurang bener". Lonceng notifikasi menampilkan 1 pesan baru.* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.4 Use Case Melaporkan Hasil Penugasan

**ID Use Case:** UC04
**Nama Use Case:** Melaporkan Hasil Penugasan

Tabel 4.4.1. Hasil Pengujian Use Case UC04

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC04-TC01* | *KF15* | *Normal* | *1. Rincian LK-X -> Laporkan Hasil.<br>2. Isi catatan, unggah foto + video.<br>3. Kirim.* | *Catatan, foto, video* | *Layar terkirim, LK-X hilang dari Daftar Tugas, muncul di /evaluasi* | *Muncul layar "Hasil perbaikan terkirim". Laporan sudah tidak ada di DaftarTugas. Tiket terkirim sampai ke Tim Admin.* | *Pass* |
| *UC04-TC02* | *KF15* | *Alternatif 1: data belum lengkap.* | *1. Formulir LK-Y, foto saja.* | *foto* | *Gagal terkirim: foto dan deskripsi wajib diisi, bagian catatan bergaris merah.* | *Muncul pesan "Gagal terkirim: Foto dan deskripsi wajib diisi", kolom catatan bergaris tepi merah, data tidak terkirim.* | *Pass* |
| *UC04-TC03* | *KF15* | *Alternatif 1: data belum lengkap* | *1. Catatan saja.<br>2. Kirim.* | *Catatan* | *Gagal terkirim: foto dan deskripsi wajib diisi, bagian foto bergaris merah.* | *Muncul pesan "Gagal terkirim: Foto dan deskripsi wajib diisi", kolom foto bukti bergaris tepi merah, data tidak terkirim.* | *Pass* |
| *UC04-TC04* | *KF15* | *Alternatif 2: berkas tidak valid* | *1. Unggah animasi.gif dan foto besar.jpg* | *Berkas gif & foto besar* | *Berkas ditolak dengan pesan format/ukuran* | *Berkas ditolak "Foto harus JPG/PNG, video MP4/MOV/MKV, maks. 10 MB". Foto tidak tampil sebagai daftar unggahan, data tidak terkirim* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

### 4.4.5 Use Case Mengevaluasi Hasil Kerja

**ID Use Case:** UC05<br>
**Nama Use Case:** Mengevaluasi Hasil Kerja<br>
**Prakondisi:** Admin sudah masuk. Siapkan tiket berbeda untuk tiap skenario dengan status Dikerjakan / menunggu evaluasi dan akses akun pelapor serta eksekutor.

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC05-TC01 | KF07, KF16, KF18 | Normal — pekerjaan selesai | 1. Buka `/evaluasi`, periksa urutan daftar, dan pilih tiket.<br>2. Tinjau komparasi bukti awal dan hasil, catatan teknis, dan waktu unggah.<br>3. Pilih “Selesai”, lalu konfirmasi.<br>4. Periksa status, waktu penyelesaian, dan notifikasi pelapor serta eksekutor. | Tiket dengan bukti perbaikan yang jelas dan catatan teknis. Catatan evaluasi boleh kosong. | Daftar tampil terbaru dahulu sesuai waktu masuk laporan. Detail menunjukkan foto awal dan hasil, video jika tersedia, waktu unggah, dan catatan teknis. Status menjadi Berhasil, `waktu_selesai` terisi, tiket keluar dari antrean, dan pelapor serta eksekutor menerima notifikasi di aplikasi. | Dasbor mengonfirmasi bahwa status laporan telah diperbarui menjadi Berhasil. Daftar siap evaluasi menampilkan tiga laporan tersisa. | Pass |
| UC05-TC02 | KF07, KF16, KF17 | Alternatif 1 — pekerjaan belum selesai | 1. Pilih tiket di `/evaluasi` dan periksa bukti.<br>2. Pilih “Belum Selesai” dan coba kirim tanpa catatan.<br>3. Isi catatan dan konfirmasi.<br>4. Periksa tugas eksekutor, notifikasi pelapor dan riwayat status. | Tiket dengan perbaikan belum tuntas. Catatan kosong lalu “Tambalan masih belum rata”. | Pengiriman tanpa catatan ditolak. Keputusan dan catatan tersimpan setelah konfirmasi. Tiket kembali ke Dikerjakan / menunggu eksekusi, riwayat transisi tercatat, eksekutor menerima catatan, dan pelapor menerima notifikasi bahwa pekerjaan akan diulang. | Dasbor mengonfirmasi bahwa keputusan disimpan dan pekerjaan dikembalikan ke eksekutor lapangan. Daftar siap evaluasi menampilkan dua laporan tersisa. | Pass |
| UC05-TC03 | KF07, KF16, KF17 | Alternatif 2 — foto/video tidak ada atau tidak jelas | 1. Pilih tiket di `/evaluasi` dan periksa bukti yang kabur.<br>2. Pilih “Minta Ulang Bukti” dan coba kirim tanpa catatan.<br>3. Jelaskan kekurangan bukti dan konfirmasi.<br>4. Periksa tugas eksekutor, notifikasi pelapor dan riwayat status. | Tiket dengan foto yang tidak jelas. Catatan kosong lalu “Unggah ulang foto yang memperlihatkan seluruh area perbaikan”. | Pengiriman tanpa catatan ditolak. Keputusan dan catatan tersimpan setelah konfirmasi. Tiket kembali ke Dikerjakan / menunggu eksekusi untuk pengunggahan ulang, riwayat transisi tercatat, eksekutor menerima instruksi, dan pelapor menerima notifikasi di aplikasi. | Dasbor mengonfirmasi bahwa instruksi unggah ulang bukti telah dikirim ke eksekutor lapangan. Daftar siap evaluasi menampilkan satu laporan tersisa. | Pass |

Langkah terakhir SKPL 4.4.5 alternatif 2 menyebut status “selesai”. Hasil yang diharapkan pada UC05-TC03 mengikuti KF17, keputusan “Minta Ulang Bukti” di DPPL (I04-11), dan transisi di M9 B.1 butir 31.

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF01-TC01 | KNF01 | Ergonomy | Pelaporan selesai < 3 menit | Stopwatch, 5 kali alur buka "Buat Laporan" sampai dialog "Laporan terkirim" | [ISI: t1, t2, t3, t4, t5 → rata-rata …, maks …] | [ISI] |
| KNF03-TC01 | KNF03 | Response time | Koordinat terkunci ≤ 3 detik setelah formulir dibuka | [ISI: Chrome DevTools Performance / stopwatch], 5 kali ukur | [ISI: rata-rata … detik, maks … detik] | [ISI] |
| KNF04-TC01 | KNF04 | Security | Pengiriman tanpa token / token tidak valid ditolak server dan laporan tidak tersimpan | Unit test C17-UT33 s.d. C17-UT37 dan uji integrasi INT-TC08, INT-TC09 ke server Cloudflare | [ISI setelah INT dijalankan] | [ISI] |
| KNF01-TC01 | `assets/bukti-test/knf-test/knf-uc01/KNF01-TC01.png` |
| KNF03-TC01 | `assets/bukti-test/knf-test/knf-uc01/KNF03-TC01.png` |
| KNF01-TC01 | <img alt="KNF01-TC01" src="./assets/bukti-test/knf-test/knf-uc01/KNF01-TC01.png" width="600"> |
| KNF03-TC01 | <img alt="KNF03-TC01" src="./assets/bukti-test/knf-test/knf-uc01/KNF03-TC01.png" width="600"> |
| *KNF09-TC01* | *KNF09* | *Response time* | *Antrean tiket dihitung ulang dan diurutkan berdasarkan Skor Prioritas dalam ≤ 3 detik setiap ada laporan baru masuk.* | *Chrome DevTools (Disable chche), 5 kali ukur & refresh, ambil rata-rata* | *Rata-rata 2.152 detik, maks 2.97 detik* | *Pass* |
| *KNF10-TC01* | *KNF10* | *Ergonomy* | *Koordinat lokasi terintegrasi langsung dengan Google Maps, eksekutor tidak perlu mengetik ulang alamat* | *Klik "Buka di Google Maps" dari rincian 3 tugas berbeda, cocokan koordinat di Rincian Tugas dengan di URL Google Maps. Hitung jumlah klik yang diperlukan.* | *3/3 berhasil, 2 klik dari daftar.* | *Pass* |
| KNF13-TC01 | KNF13 | Response time | Notifikasi email terkirim ke pelapor ≤ 2 menit setelah status laporan berubah | Pemeriksaan kode sumber dan *migration* basis data untuk mencari integrasi pengiriman email (`grep` kata kunci email, SMTP, Resend, SendGrid, Nodemailer) | Tidak ditemukan integrasi pengiriman email; kemunculan kata "email" hanya pada formulir masuk dan pembuatan profil. Notifikasi perubahan status disampaikan melalui notifikasi dalam aplikasi (lonceng) secara *realtime* via Supabase Realtime | Fail. Penyebab: layanan pengiriman email belum diintegrasikan. Usulan perbaikan: menambahkan pengiriman email (mis. melalui Supabase Edge Function dan Resend) yang dipicu oleh perubahan status laporan |
| KNF02-TC01 | KNF02 | Availability | Aplikasi dapat diakses dan menerima laporan di luar jam kerja tanpa ada akun Tim Administrasi yang sedang masuk | Seluruh sesi admin dikeluarkan, lalu warga mengirim laporan melalui `laporkota.vercel.app` pada Jumat, 20 November 2026 pukul 17.32 WIB (di luar jam kerja); status *deployment* Vercel dan *project* Supabase diperiksa | Laporan terkirim dengan ID tiket LK-0031; *deployment* Vercel berstatus Ready (Production), *project* Supabase berstatus Healthy dengan *success rate* 97,4% dari 155 permintaan dalam 60 menit terakhir | Pass |
| KNF05-TC01 | KNF05 | Response time | Pemeriksaan duplikasi berdasarkan radius menghasilkan hasil ≤ 3 detik setelah laporan dikirim | Mengirim laporan berkategori sama (`trotoar_rusak`) pada titik laporan LK-0031 melalui `laporkota.vercel.app`, lalu mengukur durasi permintaan *server action* `lapor` (yang menjalankan pemeriksaan duplikasi) dengan Safari Web Inspector (Network), 5 kali | Durasi 1,33 s; 1,75 s; 2,00 s; 2,10 s; 0,90 s. Rata-rata 1,62 detik, maksimum 2,10 detik. Dialog "Laporan serupa sudah ada (LK-0031)" tampil pada 5/5 percobaan | Pass |
| KNF06-TC01 | KNF06 | Reliability | Setiap laporan memiliki tepat satu ID tiket unik; tidak ada ID tiket ganda | Pemeriksaan basis data *production* di Supabase SQL Editor: (1) pengelompokan `id_tiket` dengan jumlah > 1, (2) daftar *constraint* unik pada tabel `laporan`, (3) perbandingan jumlah laporan dengan jumlah `id_tiket` berbeda | (1) 0 ID tiket ganda. (2) Terdapat *constraint* `laporan_id_tiket_key UNIQUE (id_tiket)` sehingga basis data menolak ID tiket ganda. (3) 30 laporan dengan 30 ID tiket unik | Pass |
| KNF06-TC02 | KNF06 | Reliability | Laporan pada lokasi yang sama tidak menghasilkan tiket ganda | (1) Mengirim laporan berkategori sama (`trotoar_rusak`) pada titik LK-0031 (jarak ≤ 20 m), 5 kali. (2) Mengirim laporan berkategori sama pada jarak 73,3 m dari LK-0031, lalu memeriksa jarak kedua laporan dengan *query* haversine di Supabase SQL Editor | (1) Sistem menampilkan dialog "Laporan serupa sudah ada (LK-0031)" dan tidak menerbitkan tiket baru pada 5/5 percobaan. (2) Laporan di luar radius 20 m diterbitkan sebagai tiket baru LK-0032, sesuai aturan fungsi `cari_laporan_duplikat` (kategori sama, status diterima/dikerjakan, jarak ≤ 20 m) | Pass |
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
| C03-UT01–C03-UT19 | <img alt="C03-UT" src="./assets/bukti-test/unit-test/ut-uc01/C03-UT.png" width="600"> |
| C03 (coverage) | <img alt="C03-coverage" src="./assets/bukti-test/unit-test/ut-uc01/C03-coverage.png" width="600"> |
| C04-UT01–C04-UT14 | <img alt="C04-UT" src="./assets/bukti-test/unit-test/ut-uc01/C04-UT.png" width="600"> |
| C04 (coverage) | <img alt="C04-coverage" src="./assets/bukti-test/unit-test/ut-uc01/C04-coverage.png" width="600"> |
| C05-UT01–C05-UT08 | <img alt="C05-UT" src="./assets/bukti-test/unit-test/ut-uc01/C05-UT.png" width="600"> |
| C05 (coverage) | <img alt="C05-coverage" src="./assets/bukti-test/unit-test/ut-uc01/C05-coverage.png" width="600"> |
| C17-UT01–C17-UT43 | <img alt="C17-UT" src="./assets/bukti-test/unit-test/ut-uc01/C17-UT.png" width="600"> |
| C17 (coverage) | <img alt="C17-coverage" src="./assets/bukti-test/unit-test/ut-uc01/C17-coverage.png" width="600"> |
| C02-UT01–C02-UT04 | <img alt="C02-UT" src="./assets/bukti-test/unit-test/ut-uc01/C02-UT.png" width="600"> |
| INT-TC01–INT-TC09 | <img alt="UC01-INT" src="./assets/bukti-test/integration-test/UC01-INT.png" width="600"> |
| UC01-TC01 | <img alt="UC01-TC01_1" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC01_1.jpeg" width="300"> <br> <img alt="UC01-TC01_2" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC01_2.jpeg" width="300"> <br> <img alt="UC01-TC01_3" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC01_3.jpeg" width="300"> |
| UC01-TC02 | <img alt="UC01-TC02" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC02.jpeg" width="300"> |
| UC01-TC03 | <img alt="UC01-TC03" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC03.jpeg" width="300"> |
| UC01-TC04 | <img alt="UC01-TC04" src="./assets/bukti-test/uc-test/uc-uc01/UC01-TC04.jpeg" width="300"> |
| KNF01-TC01 | <img alt="KNF01-TC01" src="./assets/bukti-test/knf-test/knf-uc01/KNF01-TC01.png" width="600"> |
| KNF03-TC01 | <img alt="KNF03-TC01" src="./assets/bukti-test/knf-test/knf-uc01/KNF03-TC01.png" width="600"> |
| KNF04-TC01 | Bukti C17-UT (C17-UT33–C17-UT37) dan INT-TC01–INT-TC09 (INT-TC08, INT-TC09) |
| C09-UT01–C09-UT17 | <img alt="C09-UT" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C09-UT.png" width="600"> |
| C09 (coverage) | <img alt="C09-coverage" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C09-coverage.png" width="600"> |
| C18-UT01–C18-UT10 | <img alt="C18-UT" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C18-UT.png" width="600"> |
| C18 (coverage) | <img alt="C18-coverage" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C18-coverage.png" width="600"> |
| C21-UT01–C21-UT21 | <img alt="C21-UT" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C21-UT.png" width="600"> |
| C21 (coverage) | <img alt="C21-coverage" src="./assets/bukti-test/unit-test/ut-uc02-uc05/C21-coverage.png" width="600"> |
| UC02-TC01 | <img alt="UC02-TC01" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC02-TC01.png" width="300"> |
| UC02-TC02 | <img alt="UC02-TC02" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC02-TC02.png" width="300"> |
| UC02-TC03 | <img alt="UC02-TC03" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC02-TC03.png" width="300"> |
| UC05-TC01 | <img alt="UC05-TC01" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC05-TC01.png" width="300"> |
| UC05-TC02 | <img alt="UC05-TC02" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC05-TC02.png" width="300"> |
| UC05-TC03 | <img alt="UC05-TC03" src="./assets/bukti-test/uc-test/uc-uc02-uc05/UC05-TC03.png" width="300"> |
| *C07-UT01 - C07-UT16* | <img alt="C07-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C07-UT.png" width="600"> |
| *C07 (coverage)* | <img alt="C07-Coverage" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C07-coverage.png" width="600"> |
| *C08-UT01 - C08-UT20* | <img alt="C08-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C08-UT.png" width="600"> |
| *C08 (coverage)* | <img alt="C08-Coverage" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C08-coverage.png" width="600"> |
| *C19-UT01 - C19-UT15* | <img alt="C19-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C19-UT.png" width="600"> |
| *C20-UT01 - C20-UT24* | <img alt="C20-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C20-UT.png" width="600"> |
| *C02-UT40 - C02-UT42* | <img alt="C02-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C02-UT.png" width="600"> |
| *INT-TC40 - INT-TC47* | <img alt="UC03-UC04-INT" src="./assets/bukti-test/integration-test/UC03-UC04-INT.png" width="600"> |
| *UC03-TC01* | <img alt="UC03-TC01" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC01.png" width="300"> |
| *UC03-TC02* | <img alt="UC03-TC02" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC02.png" width="300"> |
| *UC03-TC03* | <img alt="UC03-TC03" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC03-1.png" width="300"> <br> <img alt="UC03-TC03" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC03-2.png" width="300"> |
| *UC03-TC04* | <img alt="UC03-TC04" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC04.png" width="300"> |
| *UC03-TC05* | <img alt="UC03-TC05" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC03-TC05.png" width="300"> |
| *UC04-TC01* | <img alt="UC04-TC01" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC04-TC01-1.png" width="300"> <br> <img alt="UC04-TC01" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC04-TC01-1.png" width="300"> |
| *UC04-TC02* | <img alt="UC04-TC02" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC04-TC02.png" width="300"> |
| *UC04-TC03* | <img alt="UC04-TC03" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC04-TC03.png" width="300"> |
| *UC04-TC04* | <img alt="UC04-TC04" src="./assets/bukti-test/uc-test/uc-uc03-uc04/UC04-TC04.png" width="300"> |
| *KNF09-TC01* | <img alt="KNF09-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF09-TC01-1.png" width="600"> <br> <img alt="KNF09-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF09-TC01-2.png" width="600"> <br> <img alt="KNF09-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF09-TC01-3.png" width="600"> <br> <img alt="KNF09-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF09-TC01-4.png" width="600"> <br> <img alt="KNF09-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF09-TC01-5.png" width="00"> |
| *KNF10-TC01* | <img alt="KNF10-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF10-TC01-1.png" width="600"> <br> <img alt="KNF10-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF10-TC01-2.png" width="600"> <br> <img alt="KNF10-TC01" src="./assets/bukti-test/knf-test/knf-uc03-uc04/KNF10-TC01-3.png" width="600"> |
| *KNF13-TC01* | <img alt="KNF13-TC01" src="./assets/bukti-test/knf-test/KNF13-TC01.png" width="600"> |
| *KNF02-TC01* | <img alt="KNF02-TC01" src="./assets/bukti-test/knf-test/KNF02-TC01-1.png" width="300"> <br> <img alt="KNF02-TC01" src="./assets/bukti-test/knf-test/KNF02-TC01-2.png" width="600"> <br> <img alt="KNF02-TC01" src="./assets/bukti-test/knf-test/KNF02-TC01-3.png" width="600"> |
| *KNF05-TC01* | <img alt="KNF05-TC01" src="./assets/bukti-test/knf-test/KNF05-TC01-1.png" width="600"> <br> <img alt="KNF05-TC01" src="./assets/bukti-test/knf-test/KNF05-TC01-2.png" width="600"> <br> <img alt="KNF05-TC01" src="./assets/bukti-test/knf-test/KNF05-TC01-3.png" width="600"> <br> <img alt="KNF05-TC01" src="./assets/bukti-test/knf-test/KNF05-TC01-4.png" width="600"> <br> <img alt="KNF05-TC01" src="./assets/bukti-test/knf-test/KNF05-TC01-5.png" width="600"> |
| *KNF06-TC01* | <img alt="KNF06-TC01" src="./assets/bukti-test/knf-test/KNF06-TC01-1.png" width="600"> <br> <img alt="KNF06-TC01" src="./assets/bukti-test/knf-test/KNF06-TC01-2.png" width="600"> <br> <img alt="KNF06-TC01" src="./assets/bukti-test/knf-test/KNF06-TC01-3.png" width="600"> |
| *KNF06-TC02* | Bagian (1) pada bukti KNF05-TC01-1 s.d. KNF05-TC01-5. <br> <img alt="KNF06-TC02" src="./assets/bukti-test/knf-test/KNF06-TC02-1.png" width="300"> <br> <img alt="KNF06-TC02" src="./assets/bukti-test/knf-test/KNF06-TC02-2.png" width="600"> |
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
| KF01 | KNF03 | UC01 | C03 - Lokasi<br>C11 - LaporPage<br>C17 - LaporanController | `src/client/views/LaporPage.tsx` (`kunciLokasi`)<br>`src/server/entities/Lokasi.ts`<br>`src/server/controllers/laporan-validasi.ts` | UC01-TC01, UC01-TC03 | C03-UT01–C03-UT09, C17-UT06–C17-UT10, C17-UT27, KNF03-TC01 |
| KF02 | KNF01 | UC01 | C11 - LaporPage<br>C17 - LaporanController | `src/client/views/LaporPage.tsx`<br>`src/server/controllers/laporan-validasi.ts` | UC01-TC01 | C17-UT01–C17-UT05, C17-UT26, KNF01-TC01 |
| KF03 | - | UC01 | C04 - Foto<br>C05 - Video<br>C17 - LaporanController | `src/server/entities/Foto.ts`<br>`src/server/entities/Video.ts`<br>`src/server/controllers/laporan-validasi.ts`<br>`src/client/components/shared/MediaUploader.tsx` | UC01-TC02 | C04-UT01–C04-UT14, C05-UT01–C05-UT08, C17-UT11–C17-UT20, C17-UT28, INT-TC03 |
| KF04 | KNF06 | UC01 | C02 - Laporan<br>C17 - LaporanController | `src/server/controllers/LaporanController.ts`<br>`src/server/entities/Laporan.ts` (RPC `kirim_laporan`) | UC01-TC01 | C17-UT21–C17-UT22, C17-UT30–C17-UT31, C02-UT01–C02-UT04, INT-TC01, INT-TC02, INT-TC04, INT-TC06 |
| KF05 | KNF05 | UC01 | C03 - Lokasi<br>C17 - LaporanController | `src/server/controllers/LaporanController.ts` (RPC `cari_laporan_duplikat`)<br>`src/server/entities/Lokasi.ts` | UC01-TC04 | C03-UT10–C03-UT16, C17-UT23–C17-UT24, C17-UT29, INT-TC05, INT-TC07 |
| KF06 | - | UC01 | C06 - Upvote<br>C11 - LaporPage<br>C17 - LaporanController | `src/client/components/lapor/DialogDuplikat.tsx`<br>`src/server/controllers/LaporanController.ts` (`dukungLaporanDuplikat`) | UC01-TC04 | C17-UT38–C17-UT43, INT-TC07 |
| KF08 | KNF04 | UC01 | C11 - LaporPage<br>C17 - LaporanController | `src/client/components/lapor/WidgetAntiBot.tsx`<br>`src/client/views/LaporPage.tsx` (`ambilTokenAntiBot`)<br>`src/server/controllers/LaporanController.ts` (`verifikasiAntiBot`) | UC01-TC01 | C17-UT25, C17-UT32–C17-UT37, INT-TC06, INT-TC08, INT-TC09, KNF04-TC01 |
| KF07 | KNF13 | UC02, UC05 | C02 - Laporan<br>C10 - Notifikasi<br>C23 - NotifikasiController | `supabase/migrations/20261107155512_trigger_status.sql` (`catat_perubahan_status`)<br>`src/client/components/shared/LoncengNotifikasi.tsx` | UC02-TC01, UC02-TC03, UC05-TC01–UC05-TC03 | – |
| KF09 | KNF08 | UC02 | C12 - ValidasiPage<br>C18 - ValidasiController | `src/client/views/ValidasiPage.tsx`<br>`src/client/components/validasi/AntreanLaporan.tsx`<br>`src/server/controllers/ValidasiController.ts` | UC02-TC01, UC02-TC02 | C18-UT01–C18-UT06 |
| KF10 | KNF11 | UC02 | C02 - Laporan<br>C12 - ValidasiPage<br>C18 - ValidasiController | `src/server/entities/Laporan.ts`<br>`src/client/views/ValidasiPage.tsx`<br>`src/client/components/validasi/RincianLaporan.tsx`<br>`src/server/controllers/ValidasiController.ts` | UC02-TC01–UC02-TC03 | C18-UT07 |
| KF11 | KNF07 | UC02 | C02 - Laporan<br>C12 - ValidasiPage<br>C18 - ValidasiController | `src/client/components/validasi/DialogTolak.tsx`<br>`src/server/controllers/ValidasiController.ts`<br>`supabase/migrations/20261107155512_trigger_status.sql` (`cek_transisi_status`) | UC02-TC03 | C18-UT01, C18-UT09–C18-UT10 |
| KF12 | KNF07 | UC02 | C02 - Laporan<br>C12 - ValidasiPage<br>C18 - ValidasiController | `src/client/views/ValidasiPage.tsx`<br>`src/server/controllers/ValidasiController.ts`<br>`supabase/migrations/20261107155512_trigger_status.sql` (`cek_transisi_status`) | UC02-TC01 | C18-UT01, C18-UT08 |
| KF13 | KNF09 | UC02 | C02 - Laporan<br>C06 - Upvote<br>C07 - ListTugas<br>C18 - ValidasiController | `src/server/entities/Upvote.ts`<br>`supabase/migrations/20261107155512_trigger_status.sql` (`tambah_upvote`)<br>`src/server/entities/ListTugas.ts`<br>`src/server/controllers/ValidasiController.ts` | UC02-TC01 | C18-UT08 (delegasi prioritas ke basis data) |
| KF16 | – | UC05 | C09 - Evaluasi<br>C15 - EvaluasiPage<br>C21 - EvaluasiController | `src/server/entities/Evaluasi.ts`<br>`src/client/views/EvaluasiPage.tsx`<br>`src/client/components/evaluasi/KomparasiEvaluasi.tsx`<br>`src/server/controllers/EvaluasiController.ts` | UC05-TC01–UC05-TC03 | C09-UT01–C09-UT08, C21-UT02–C21-UT12 |
| KF17 | – | UC05 | C09 - Evaluasi<br>C15 - EvaluasiPage<br>C21 - EvaluasiController | `src/server/entities/Evaluasi.ts`<br>`src/client/components/evaluasi/DialogKeputusanEvaluasi.tsx`<br>`src/server/controllers/EvaluasiController.ts`<br>`supabase/migrations/20261107155512_trigger_status.sql` (`terapkan_evaluasi`, `catat_perubahan_status`) | UC05-TC02, UC05-TC03 | C09-UT12–C09-UT14, C21-UT18–C21-UT19, C21-UT21 |
| KF18 | – | UC05 | C02 - Laporan<br>C09 - Evaluasi<br>C15 - EvaluasiPage<br>C21 - EvaluasiController | `src/server/entities/Evaluasi.ts`<br>`src/client/views/EvaluasiPage.tsx`<br>`src/server/controllers/EvaluasiController.ts`<br>`supabase/migrations/20261107155512_trigger_status.sql` (`terapkan_evaluasi`, `cek_transisi_status`) | UC05-TC01 | C09-UT13, C21-UT20 |
| *KF13* | *KNF09* | *UC03, UC02, UC06* | *C02 - Laporan<br>C07 - ListTugas<br>C19 - PenugasanController* | `src/server/entities/Laporan.ts` (trigger `tambah_upvote`)<br>`src/server/entities/ListTugas.ts`<br>`src/server/controllers/PenugasanController.ts` | *UC03-TC01* | *C02-UT43 – C02-UT45, C07-UT01 – C07-UT04, C07-UT14, C19-UT03, C19-UT04, INT-TC40, KNF09-TC01* |
| KF14 | KNF09, KNF10 | UC03 | C02 - Laporan<br>C07 - ListTugas<br>C13 - PenugasanPage<br>C19 - PenugasanController | `src/server/entities/Laporan.ts`<br>`src/server/entities/ListTugas.ts`<br>`src/client/views/PenugasanPage.tsx`<br>`src/client/components/penugasan/*`<br>`src/server/controllers/PenugasanController.ts` | UC03-TC01 – UC03-TC05 | C02-UT40 – C02-UT42, C07-UT01 – C07-UT16, C19-UT01 – C19-UT15, INT-TC40 – INT-TC43, KNF10-TC01 |
| KF15 | - | UC04 | C04 - Foto<br>C05 - Video<br>C08 - HasilPerbaikan<br>C14 - HasilPerbaikanForm<br>C20 - PerbaikanController | `src/server/entities/HasilPerbaikan.ts`<br>`src/client/views/HasilPerbaikanForm.tsx`<br>`src/server/controllers/PerbaikanController.ts`<br>`src/lib/validasi-perbaikan.ts` | UC04-TC01 – UC04-TC04 | C08-UT01 – C08-UT07, C08-UT15 – C08-UT17, C20-UT01 – C20-UT24, INT-TC44 – INT-TC46 |
| KF17 | - | UC05, UC03 | C09 - Evaluasi<br>C19 - PenugasanController | `src/server/entities/Evaluasi.ts` (`getEvaluasiTerakhir`)<br>`src/server/controllers/PenugasanController.ts` | UC03-TC05 | C19-UT11, INT-TC47 |
| KF19 | - | UC06 | C08 - HasilPerbaikan<br>C22 - StatusController | `src/server/entities/HasilPerbaikan.ts` (`getBuktiLengkap`) | UC06-TC… (D) | C08-UT08 – C08-UT14, C08-UT18 – C08-UT20 |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| KNF09 | Response time | KF13, KF14 / UC03 | KNF09-TC01 |
| KNF10 | Ergonomy | KF14 / UC03 | KNF10-TC01 |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
<<<<<<< HEAD
| KNF13 | Response time | KF18, KF19 / UC05, UC06 | KNF13-TC01 |
| KNF02 | Availability | KF01 / UC01 | KNF02-TC01 |
| KNF06 | Reliability | [KF ID tiket unik] / UC01 | KNF06-TC01, KNF06-TC02 |
| KNF05 | Response time | [KF cek duplikat] / UC01 | KNF05-TC01 |
| *...* | *...* | *...* | *...* |
=======
| *...* | *...* | *...* | *...* |
>>>>>>> origin/dev
