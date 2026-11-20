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
| D — 20 November 2026 | Melengkapi pendahuluan, gambaran sistem, pemetaan implementasi, hasil uji UC06, KNF11–KNF12, bukti, dan traceability; bukti D ditata mengikuti subdirektori bukti-test. |

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

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Objek Antarmuka* | *IXX-YY* | *Sesuai DPPL, contoh I06-08* |
| *Algoritma* | *Algo-XXX* | *Sesuai DPPL* |
| *Query* | *Q-XXX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |

## 1.5 Referensi

| No | Referensi | Sumber |
| :--- | :--- | :--- |
| 1 | SKPL LaporKota | [M5 SKPL](../M5/K03_G07_SKPL.md) |
| 2 | Arsitektur Perangkat Lunak | [M6 APL](../M6/K03_G07_APL.md) |
| 3 | DPPL LaporKota | [M8 DPPL](../M8/K03_G07_DPPL2.md) |
| 4 | Implementasi dan pemetaan kelas, Tabel B.5 | [M9 Implementasi](../M9/K03_G07_Implementasi.md) |
| 5 | Vitest dan coverage V8 | [Vitest Coverage](https://vitest.dev/guide/coverage.html) |
| 6 | Next.js App Router | [Next.js Docs](https://nextjs.org/docs) |
| 7 | Supabase | [Supabase Docs](https://supabase.com/docs) |
| 8 | Chrome DevTools Network | [Network](https://developer.chrome.com/docs/devtools/network) |
| 9 | Lighthouse | [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) |

Lighthouse dicantumkan sebagai referensi alat; pengukuran KNF bagian D menggunakan Chrome DevTools Network.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun dengan sistematika berikut. **BAB 1: Pendahuluan** memuat tujuan penulisan dokumen, lingkup masalah, daftar definisi, aturan penomoran, referensi, serta ikhtisar dokumen. **BAB 2: Deskripsi Umum Perangkat Lunak** menjelaskan gambaran rancangan sistem, batasan, dan keterkaitannya dengan sistem eksternal. Terlampir juga pemodelan sistem perangkat lunak menggunakan Use Case Diagram. **BAB 3: Implementasi**  menjabarkan lingkungan implementasi, dan hasil-hasil implementasi perangkat lunak (modul, antarmuka, dll) yang telah dibuat berdasarkan DPPL. **BAB 4: Hasil Pengujian** menguraikan kedalaman pengujian pada setiap kelas, serta masing-masing hasil pengujiannya yang meliputi pengujian Unit, Integrasi, Use Case, dan Kebutuhan Non-Fungsional. **BAB 5: Traceability** memetakan seluruh KF, KNF, UC, Kelas, Hasil Implementasi, dan Test Case untuk memverifikasi kelengkapan dan keterkaitannya.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

## 2.1 Gambaran Sistem

LaporKota merupakan platform pelaporan kerusakan infrastruktur publik dalam lingkup Kota Bandung. Warga mengirim kategori, deskripsi, bukti foto/video, dan koordinat lokasi, lalu memantau laporan melalui tiket. Tim Administrasi memvalidasi laporan dan mengevaluasi hasil kerja. Eksekutor Lapangan melihat tugas berdasarkan prioritas, membuka navigasi lokasi, serta mengunggah hasil perbaikan.

Status laporan meliputi Diterima, Ditolak, Dikerjakan, dan Berhasil. Dikerjakan memiliki tahap menunggu eksekusi atau menunggu evaluasi. Peta publik dapat dibaca tanpa login. Dukungan memerlukan akun warga, berlaku satu kali per pengguna per laporan, dan tidak dapat diberikan pada laporan sendiri. Perubahan implementasi dari rancangan dijelaskan pada B.1 laporan M9.

## 2.2 Hubungan dengan Sistem Eksternal

~~~mermaid
flowchart LR
  W[Warga] --> C[Browser LaporKota]
  A[Tim Administrasi] --> C
  E[Eksekutor Lapangan] --> C
  C --> V[Next.js pada Vercel]
  V --> DB[Supabase Auth dan PostgreSQL]
  C --> ST[Supabase Storage]
  V --> ST
  C --> RT[Supabase Realtime untuk notifikasi]
  C --> T[Cloudflare Turnstile]
  V --> T
  C --> M[Tile OpenStreetMap melalui Leaflet]
  C --> G[Google Maps untuk navigasi]
~~~

Gambar 2.1. Konteks LaporKota dan layanan eksternal

| Sistem eksternal | Hubungan dengan LaporKota |
| :--- | :--- |
| Vercel | Menjalankan aplikasi Next.js dan Server Actions. |
| Supabase Auth dan PostgreSQL | Mengelola autentikasi dan data, serta menjalankan RLS, RPC, constraint, dan trigger. |
| Supabase Storage | Menyimpan foto/video; browser mengunggah berkas langsung sesuai aturan akses. |
| Supabase Realtime | Menyalurkan notifikasi di dalam aplikasi. Peta publik dimuat ulang berkala karena datanya berasal dari view. |
| Cloudflare Turnstile | Menyediakan token anti-bot pada formulir dan memverifikasinya di server. |
| OpenStreetMap dan Leaflet | Menampilkan tile peta, batas kota, dan lokasi laporan. |
| Google Maps | Membuka navigasi koordinat bagi eksekutor. |

Aplikasi diakses melalui browser dan HTTPS. Cakupan lokasi dibatasi Kota Bandung. Ketersediaan layanan dan respons jaringan memengaruhi akses sistem.

## 2.3 Use Case Diagram

<img alt="Use Case Diagram LaporKota dari SKPL" src="../M5/assets/diagram/uc-diagram.png" width="750">

Gambar 2.2. Use Case Diagram LaporKota

| Use case | Aktor | Tujuan |
| :--- | :--- | :--- |
| UC01 Mengirim Laporan Kerusakan | Warga | Menyampaikan kerusakan beserta bukti dan lokasi. |
| UC02 Memvalidasi Laporan Baru | Tim Administrasi | Menyetujui penanganan atau menolak dengan alasan. |
| UC03 Melihat Penugasan Lapangan | Eksekutor Lapangan | Melihat tugas terurut prioritas dan lokasinya. |
| UC04 Melaporkan Hasil Perbaikan | Eksekutor Lapangan | Mengunggah bukti dan catatan pekerjaan. |
| UC05 Mengevaluasi Hasil Kerja | Tim Administrasi | Menyetujui penyelesaian atau meminta perbaikan ulang. |
| UC06 Memantau Status Laporan | Warga dan publik | Memantau riwayat pribadi, alasan penolakan, peta anonim, serta memberi dukungan sesuai akses. |

Diagram use case menggunakan model SKPL. Sistem eksternal pada Gambar 2.1 menjelaskan konteks teknis implementasi.

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

## 3.2 Implementasi Modul

Tabel berikut mengikuti Tabel B.5 laporan M9. Kelas diwujudkan sebagai modul fungsi, kelas TypeScript, komponen React, Server Action, dan/atau aturan database. Modul tidak memiliki executable tersendiri karena dibundel oleh Next.js.

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik dan Implementasi | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | User | `src/server/entities/User.ts`: `muatProfil`; dipakai `src/lib/auth.ts`: `getCurrentUser`, `requireRole`, `requireRoleOrRedirect`, tipe `UserAktif` | —, dibundel Next.js |
| 2 | C02 | Laporan | `src/server/entities/Laporan.ts`: `simpanLaporan`, `getByStatus`, `getMilikSaya`, `getRincian`, `getDaftarPublik`, `getRincianPublik`, `urutPrioritas`, `filterKategori` | —, dibundel Next.js |
| 3 | C03 | Lokasi | `src/server/entities/Lokasi.ts`: `dalamWilayah`, `hitungJarak`, `getKoordinat`, tipe `Koordinat`; batas kota di `src/lib/batas-wilayah.ts` | —, dibundel Next.js |
| 4 | C04 | Foto | `src/server/entities/Foto.ts`: `isFotoValid`, `formatDariNama`, `ukuranValid`, `urlMedia`, tipe `Berkas`, `MediaTerunggah` | —, dibundel Next.js |
| 5 | C05 | Video | `src/server/entities/Video.ts`: `isVideoValid` | —, dibundel Next.js |
| 6 | C06 | Upvote | `src/server/entities/Upvote.ts`: `catatUpvote`, `getJumlahUpvote`, `sudahUpvote` | —, dibundel Next.js |
| 7 | C07 | ListTugas | `src/server/entities/ListTugas.ts`: kelas `ListTugas`, fungsi `isKategori`, `isTugasAktif`, tipe `TugasLaporan`, `RincianTugas`, `EvaluasiTerakhir` | —, dibundel Next.js |
| 8 | C08 | HasilPerbaikan | `src/server/entities/HasilPerbaikan.ts`: `validasiBerkas`, `simpanBukti`, `getBuktiLengkap`, `pilihBuktiSelesai`, tipe `BuktiLengkap`; tabel `hasil_perbaikan` dan baris `foto`/`video` dengan `id_hasil` | —, dibundel Next.js |
| 9 | C09 | Evaluasi | `src/server/entities/Evaluasi.ts`: `simpanEvaluasi`, `ambilDaftarSiapEvaluasi`, `ambilDetailEvaluasi`, `cariIdLaporan`, `getEvaluasiTerakhir`, tipe `DetailEvaluasi`, `DataEvaluasiBaru` | —, dibundel Next.js |
| 10 | C10 | Notifikasi | `src/server/entities/Notifikasi.ts`: `getMilikSaya`, `jumlahBelumDibaca`, `tandaiDibaca`; real-time di `src/client/components/shared/useNotifikasi.ts` | —, dibundel Next.js |
| 11 | C11 | LaporPage | `src/client/views/LaporPage.tsx`: `LaporPage`; route `src/app/(warga)/lapor/page.tsx`; `src/client/components/lapor/`: `HeaderLapor`, `AreaBerkas`, `AreaLokasi`, `DialogTerkirim`, `DialogDuplikat`, `WidgetAntiBot` (`src/client/components/lapor/WidgetAntiBot.tsx`) | —, dibundel Next.js |
| 12 | C12 | ValidasiPage | `src/client/views/ValidasiPage.tsx`: `ValidasiPage`; route `src/app/(admin)/validasi/page.tsx`; `src/client/components/validasi/`: `AntreanLaporan`, `RincianLaporan`, `DialogTolak`, `AdminSidebar` | —, dibundel Next.js |
| 13 | C13 | PenugasanPage | `src/client/views/PenugasanPage.tsx`: `PenugasanPage`, `DaftarTugas`, `renderRincianLaporan`; route `src/app/(eksekutor)/tugas/page.tsx`; `src/client/components/penugasan/`: `FilterKategori`, `KartuTugas`, `PanelRincianTugas`, `tautan.ts` | —, dibundel Next.js |
| 14 | C14 | HasilPerbaikanForm | `src/client/views/HasilPerbaikanForm.tsx`: `HasilPerbaikanForm`, `renderTerkirim`, `renderGagal`; route `src/app/(eksekutor)/tugas/[idTiket]/hasil/page.tsx` | —, dibundel Next.js |
| 15 | C15 | EvaluasiPage | `src/client/views/EvaluasiPage.tsx`: `EvaluasiPage`; route `src/app/(admin)/evaluasi/page.tsx`; `src/client/components/evaluasi/`: `DaftarSiapEvaluasi`, `KomparasiEvaluasi`, `DialogKeputusanEvaluasi` | —, dibundel Next.js |
| 16 | C16 | StatusLaporanPage | `src/client/views/StatusLaporanPage.tsx`: `StatusLaporanPage`; route `src/app/(warga)/status/page.tsx`; `src/client/components/status/`: `KartuLaporanPublik`, `BuktiPerbaikan`, `pembaruanPeta`; komponen bersama `DetailLaporan`, `MapView`, `LoncengNotifikasi` | —, dibundel Next.js |
| 17 | C17 | LaporanController | `src/server/controllers/LaporanController.ts`: `kirimLaporan`, `verifikasiAntiBot` (tidak diekspor), `dukungLaporanDuplikat`; `src/server/controllers/laporan-validasi.ts`: `validasiForm`, `validasiLokasi`, `validasiBerkas`, `PESAN_ANTIBOT_BELUM`, `PESAN_ANTIBOT_GAGAL` | —, dibundel Next.js |
| 18 | C18 | ValidasiController | `src/server/controllers/ValidasiController.ts`: `susunAntrean`, `saringAntrean`, `ambilRincianLaporan`, `setujuiLaporan`, `tolakLaporan` | —, dibundel Next.js |
| 19 | C19 | PenugasanController | `src/server/controllers/PenugasanController.ts`: `verifikasiAkses`, `doSorting`, `doFilter`, `bukaLaporan` | —, dibundel Next.js |
| 20 | C20 | PerbaikanController | `src/server/controllers/PerbaikanController.ts`: `verifikasiAkses`, `unggahHasil`; `src/lib/validasi-perbaikan.ts`: `validasiForm`, `cekKelengkapan`, `cekMediaTerunggah` | —, dibundel Next.js |
| 21 | C21 | EvaluasiController | `src/server/controllers/EvaluasiController.ts`: `ambilDaftarUntukEvaluasi`, `ambilDetailEvaluasi`, `simpanKeputusan` | —, dibundel Next.js |
| 22 | C22 | StatusController | `src/server/controllers/StatusController.ts`: `ambilRiwayatWarga`, `ambilDetailStatus`, `ambilLaporanPublik`, `prosesUpvote`, tipe `DetailStatus`, `BuktiHasilPerbaikan` | —, dibundel Next.js |
| 23 | C23 | NotifikasiController | `src/server/controllers/NotifikasiController.ts`: `ambilNotifikasi`, `updateStatusBaca`; komponen `LoncengNotifikasi` dan hook `useNotifikasi` | —, dibundel Next.js |

Operasi C02 tambahUpvote/hitungPrioritas diwujudkan trigger tambah_upvote pada <code>supabase/migrations/20261107155512_trigger_status.sql</code>. Efek tambahUpvote diuji melalui integrasi, bukan dengan menambahkan fungsi aplikasi baru.

## 3.3 Implementasi Antarmuka

Tabel 3.3. Implementasi Antarmuka

| No | ID | Nama Antarmuka | File Fisik | Executable/Route |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Formulir Laporan Kerusakan | <code>src/app/(warga)/lapor/page.tsx</code>; <code>src/client/views/LaporPage.tsx</code>; <code>src/client/components/lapor/</code> | —, /lapor |
| 2 | I-02 | Status Laporan dan Peta Publik | <code>src/app/(warga)/status/page.tsx</code>; <code>src/client/views/StatusLaporanPage.tsx</code>; <code>src/client/components/status/</code>; DetailLaporan dan MapView | —, /status |
| 3 | I-03 | Validasi Laporan | <code>src/app/(admin)/validasi/page.tsx</code>; <code>src/client/views/ValidasiPage.tsx</code>; <code>src/client/components/validasi/</code> | —, /validasi |
| 4 | I-04 | Evaluasi Hasil Kerja | <code>src/app/(admin)/evaluasi/page.tsx</code>; <code>src/client/views/EvaluasiPage.tsx</code>; <code>src/client/components/evaluasi/</code> | —, /evaluasi |
| 5 | I-05 | Daftar Tugas | <code>src/app/(eksekutor)/tugas/page.tsx</code>; <code>src/client/views/PenugasanPage.tsx</code>; <code>src/client/components/penugasan/</code> | —, /tugas |
| 6 | I-06 | Formulir Hasil Perbaikan | <code>src/app/(eksekutor)/tugas/[idTiket]/hasil/page.tsx</code>; <code>src/client/views/HasilPerbaikanForm.tsx</code>; MediaUploader | —, /tugas/[idTiket]/hasil |
| 7 | —, tambahan | Masuk | <code>src/app/(auth)/login/page.tsx</code> | —, /login |
| 8 | —, tambahan | Daftar | <code>src/app/(auth)/daftar/page.tsx</code> | —, /daftar |

Autentikasi tambahan mengikuti perubahan B.1 M9.

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C02 | Laporan | Mendalam | D menangani getRincianPublik dan efek tambahUpvote di database; coverage gabungan A–D diukur Fondasi. | C02-UT60–C02-UT70; INT-TC60–INT-TC64 |
| C06 | Upvote | Mendalam | Akses dukungan dan aturan satu dukungan per pengguna. | C06-UT01–C06-UT10; INT-TC60–INT-TC63 |
| C16 | StatusLaporanPage | Tidak perlu | Boundary diperiksa melalui alur use case dan screenshot. | UC06-TC01–UC06-TC05 |
| C22 | StatusController | Sedang | Koordinasi entity, pemeriksaan akses, dan respons UI; normal dan negatif untuk empat operasi public. | C22-UT01–C22-UT08; 48 kasus regresi tambahan |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan verifikasi unit tanpa memilih file integrasi:

~~~cmd
npx vitest run src/server/entities src/server/controllers src/client src/lib src/app
~~~

Lokasi unit test: file .test.ts di dalam src, bersebelahan dengan modul yang diuji.


Verifikasi regresi pada branch test/uc6: 360 unit test lulus pada 26 file. [Hasil terstruktur](./assets/bukti-test/unit-test/ut-uc06/D-repo-unit-results.json).


Verifikasi gabungan tiga file unit test bagian D: 77 kasus lulus, tanpa kegagalan. [Hasil terstruktur](./assets/bukti-test/unit-test/ut-uc06/D-unit-results.json).

~~~cmd
npx vitest run src/server/entities/Upvote.test.ts src/server/entities/LaporanPublik.test.ts src/server/controllers/StatusController.test.ts --reporter=verbose
~~~

### 4.2.2 Kelas Laporan Bagian D

**ID Kelas:** C02. **Tingkat:** Mendalam.<br>
**File uji:** <code>src/server/entities/LaporanPublik.test.ts</code>

| ID | Operasi | Jenis | Prosedur/Masukan | Hasil Diharapkan | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C02-UT60 | getRincianPublik | Normal | Mock laporan lengkap LK-0001. | View publik, filter tiket, kolom tanpa identitas. | Data lengkap, view, dan filter sesuai assertion; wildcard/field identitas tidak diminta. | Pass |
| C02-UT61 | getRincianPublik | Batas | jumlah_upvote = 0. | Laporan tetap dikembalikan dengan angka 0. | Jumlah dukungan tetap 0. | Pass |
| C02-UT62 | getRincianPublik | Negatif | id = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT63 | getRincianPublik | Negatif | id_tiket = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT64 | getRincianPublik | Negatif | kategori = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT65 | getRincianPublik | Negatif | latitude = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT66 | getRincianPublik | Negatif | longitude = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT67 | getRincianPublik | Negatif | status = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT68 | getRincianPublik | Negatif | waktu_masuk = null. | Data tidak lengkap ditolak. | data = null, error = null. | Pass |
| C02-UT69 | getRincianPublik | Batas | Tidak ada laporan yang cocok. | data = null tanpa error. | Sesuai harapan. | Pass |
| C02-UT70 | getRincianPublik | Negatif | Error database 42501. | data = null dan error diteruskan. | Error dipertahankan pada respons. | Pass |

Tabel 4.2.2b-D. Ringkasan Cakupan C02 Bagian D

| Informasi | Keterangan |
| :--- | :--- |
| Operasi perancangan bagian D | tambahUpvote dan getRincianPublik. |
| Operasi diuji | getRincianPublik, termasuk tujuh pemeriksaan kolom wajib. |
| Pengujian database | Trigger tambah_upvote melalui INT-TC60–INT-TC63; counter dan skor terutama INT-TC60–INT-TC61. |
| Algoritma | Algo-003 untuk getRincianPublik; pemetaan trigger mengikuti B.5 M9. |
| Hasil | 11 unit test lulus. |
| Coverage | Coverage gabungan kelas diukur Fondasi dari tes A–D. Cakupan satu file tes D tidak dipakai sebagai cakupan gabungan. V8 tidak mengukur PL/pgSQL. |

### 4.2.6 Kelas Upvote

**ID Kelas:** C06. **Tingkat:** Mendalam.<br>
**File uji:** <code>src/server/entities/Upvote.test.ts</code>

| ID | Operasi | Jenis | Prosedur/Masukan | Hasil Diharapkan | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C06-UT01 | catatUpvote | Normal | Mock INSERT berhasil. | Payload memuat ID laporan dan pengguna, respons diteruskan. | Tabel upvote, dua ID, dan respons sesuai assertion. | Pass |
| C06-UT02 | catatUpvote | Batas satu dukungan | Mock error 23505 untuk dukungan kedua. | Error keunikan diteruskan. | code 23505 dan respons dipertahankan. | Pass |
| C06-UT03 | catatUpvote | Negatif | Mock error akses 42501. | Error akses diteruskan. | code 42501 dan respons dipertahankan. | Pass |
| C06-UT04 | getJumlahUpvote | Normal | View mengembalikan jumlah 5. | data = 5; query berdasarkan ID laporan. | Jumlah 5, view, dan filter sesuai assertion. | Pass |
| C06-UT05 | getJumlahUpvote | Batas | Jumlah dukungan 0. | Angka 0 dipertahankan. | data = 0, error = null. | Pass |
| C06-UT06 | getJumlahUpvote | Batas | Laporan publik tidak ditemukan. | data = null tanpa error. | Sesuai harapan. | Pass |
| C06-UT07 | getJumlahUpvote | Negatif | Pembacaan ditolak dengan 42501. | data = null dan error diteruskan. | Sesuai harapan. | Pass |
| C06-UT08 | sudahUpvote | Normal | count = 1. | true; filter pasangan laporan/pengguna benar. | Boolean true dan dua filter sesuai assertion. | Pass |
| C06-UT09 | sudahUpvote | Batas | count = 0. | false tanpa error. | Sesuai harapan. | Pass |
| C06-UT10 | sudahUpvote | Negatif | count = null dan error pembacaan. | false dan error diteruskan. | Sesuai harapan; pemanggil tetap memeriksa error. | Pass |

Tabel 4.2.6b. Ringkasan Cakupan C06

| Informasi | Keterangan |
| :--- | :--- |
| Operasi public implementasi | catatUpvote, getJumlahUpvote, sudahUpvote. |
| Kasus | Masing-masing 3, 4, dan 3; total 10 lulus. |
| Algoritma | Algo-011 melalui catatUpvote; operasi tambahan mengikuti B.5 M9. |
| Coverage | 100% line / 100% branch; statement dan function juga 100%. Vitest 5.1.0 dan coverage V8. |
| Bukti | C06-UT.png dan C06-coverage.png pada 4.6. |

Unit test memeriksa respons database tiruan. Penegakan constraint dan RLS nyata dibuktikan oleh tes integrasi.

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
| Daftar operasi public pada DPPL | `urutPrioritas(idTiket)`, `filterKategori(idTiket)`, `getLaporanById()` |
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
| *C08-UT15* | *`sumpanBukti()`* | *Normal* | *Client palsu; idLaporan, catatan, 1 foto* | *RPC `kirim_hasil_perbaikan` dipanggil dengan argumen yang benar* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT16* | *`sumpanBukti()`* | *Negatif* | *RPC mengembalikan error P0001* | *Error diteruskan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT17* | *`simpanBukti()`* | *Batas* | *3 foto + 1 video* | *Satu panggilan RPC membawa 4 media* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT18* | *`getBuktiLengkap`* | *Normal* | *Hasil lama minta_ulang_bukti + hasil baru selesai* | *Membaca hasil_perbaikan per id_laporan; mengembalikan hasil selesai* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *C08-UT19* | *`getBuktiLengkap`* | *Batas* | *Database mengembalikan data: null* | *{ data: null, error: null}* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C08-UT20* | *`getBuktiLengkap`* | *Negatif* | *Database mengembalikan error* | *{ data: null, error }* | *Sesuai harapan; tes lulus (1ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.8b. Ringkasan Cakupan Kelas C08

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()` |
| Operasi yang diuji | `validasiBerkas()`, `simpanBukti()`, `getBuktiLengkap()`, `pilihBuktiSelesai()` |
| ID Algoritma yang tercakup | *`Algo-014`, `Algo-015`* |
| Coverage (wajib ≥ 70%) | *100% line / 100% branch (100% statement, 100% function), tool: Vitest 5.1.0 + @vitest/coverage-v8. Bukti pada Subbab 4.6 (C08-coverage.png)* |

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
| *C20-UT22* | *`unggahHasil()`* | *RPC menolak (P0001)* | *Pesan database diteruskan* | *xxx* | *Sesuai harapan; tes lulus (0ms)* | *Pass/Fl* |
| *C20-UT23* | *`unggahHasil()`* | *Negatif* | *Koneksi gagal* | *Gagal mengirim hasil perbaikan* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *C20-UT24* | *`unggahHasil()`* | *Negatif* | *xxx* | *xxx* | *Sesuai harapan; tes lulus (0ms)* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |


<br>

### 4.2.22 Kelas StatusController

**ID Kelas:** C22. **Tingkat:** Sedang.<br>
**File uji:** <code>src/server/controllers/StatusController.test.ts</code>

| ID | Operasi | Jenis | Prosedur/Masukan | Hasil Diharapkan | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | ambilRiwayatWarga | Normal | Sesi sah dan entity mengembalikan laporan pribadi. | ID sesi dipakai; hanya kolom kartu dikirim. | Query dan proyeksi sesuai assertion. | Pass |
| C22-UT02 | ambilRiwayatWarga | Negatif | Guard menolak pengguna belum login. | Penolakan sebelum membuat client/query entity. | Pesan masuk terlebih dahulu; tidak ada akses database. | Pass |
| C22-UT03 | ambilDetailStatus | Normal | Rincian memuat media, linimasa, profil, dan skor internal. | DTO detail memuat media/linimasa tanpa profil dan skor. | DTO sesuai assertion. | Pass |
| C22-UT04 | ambilDetailStatus | Negatif | Entity mengembalikan data null. | Pesan tiket tidak ditemukan atau tidak dapat diakses. | Pesan yang sama untuk kedua kondisi. | Pass |
| C22-UT05 | ambilLaporanPublik | Normal | Data entity berisi field pribadi tambahan. | DTO marker hanya berisi kolom publik. | Field tambahan tidak ikut dikirim. | Pass |
| C22-UT06 | ambilLaporanPublik | Negatif | Entity mengembalikan error 42703. | Pesan aman tanpa detail internal database. | Pesan umum sesuai assertion. | Pass |
| C22-UT07 | prosesUpvote | Normal | Warga mendukung laporan aktif milik akun lain. | Memakai identitas sesi dan mengembalikan counter terbaru. | Pemanggilan entity dan respons sesuai assertion. | Pass |
| C22-UT08 | prosesUpvote | Negatif | Pengguna sudah mendukung. | Penolakan, dukunganTercatat = true, tanpa INSERT ulang. | Sesuai harapan. | Pass |

Delapan kasus utama mencakup normal dan negatif pada empat operasi public (Algo-051–Algo-053 serta ambilDetailStatus). Seluruh file memiliki 56 kasus lulus. Filter C22-UT menghasilkan 8 passed dan 48 skipped; 48 kasus tersebut merupakan regresi tambahan yang tidak dipilih filter.

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| I-02 | Laporan/Upvote (C02/C06) | Supabase PostgreSQL: view, RLS, constraint, dan trigger | Aplikasi — basis data | INT-TC60–INT-TC64 |

**Pengujian UC06**

**File uji:** <code>tests/integration/uc06.int.test.ts</code>

~~~cmd
npm run test:integration -- tests/integration/uc06.int.test.ts --reporter=verbose
~~~

Fixture diberi penanda <code>[TEST-INT]</code> dan koordinat helper tim. Service role hanya untuk setup, baca ulang hasil, dan pembersihan. Pemilik fixture umum adalah akun admin tes agar berbeda dari pemberi dukungan; INT-TC63 memakai warga tes sebagai pemilik. Setup ini bukan pengujian pengiriman laporan UC01. Aksi dukungan menggunakan client warga atau anonim sehingga RLS, constraint, dan trigger tetap berlaku.

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC40* | *I-05* | *Normal, data flow: daftar tugas* | *Laporan tes [TEST-INT] disetujui admin tes; eksekutor tes doSorting()* | *Laporan tes ada, daftar terurut prioritas* | *Laporan tes [TES-INT] muncul di hasil doSorting() dan seluruh daftar terurut skor menurun, seri waktu masuk lebih awal (452ms)* | *Pass* |
| *INT-TC41* | *I-05* | *Normal, interface coordination: filter* | *doFilter("rambu_marka_rusak")* | *Laporan tes ada, semua berkategori rambu_marka_rusak, daftar terurut* | *doFilter("rambu_marka_rusak") memuat laporan tes, semua item berkategori tampil terurut (292ms)* | *Pass* |
| *INT-TC42* | *I-05* | *Gagal, protocol: Role warga* | *Warga tes doSorting()* | *ok: false* | *Akun warga tes ditolak oleh requrieRole (315ms)* | *Pass* |
| *INT-TC43* | *I-05* | *Normal + gagal: rincian* | *bukaLaporan(<tiket tes>), lalu "LK-TIDAK-ADA"* | *Path foto sama, evaluasi null, tiket fiktif ditolak* | *Rincian laporan tes sesuai database, path foto sama dengan berkas yang diunggah, evaluasiTerakhir null, tiket fiktif ditolak (2164ms)* | *Pass* |
| *INT-TC44* | *I-06* | *Normal, data flow: Storage -> RPC -> tabel* | *Unggah JPG ke hasil/<id>/, unggahHasil()* | *1 baris hasil + 1 foto, tahap = menunggu_evaluasi* | *unggahHasil() ok, tepat 1 baris hasil_perbaikan + 1 baris foto. Laporan berstatus dikerjakan, tahap menunggu_evaluasi (1462ms)* | *Pass* |
| *INT-TC45* | *I-06* | *Gagal, protocol: kirim ulang* | *unggahHasil() kedua kali* | *ok: false, baris hasil tetap 1* | *Kirim ulang diolak, jumlah bars hasil_perbaikan tetap satu (472ms)* | *Pass* |
| *INT-TC46* | *I-06* | *Gagal, interface coordination: path orang lain* | *Path hasil/<id warga>/..* | *PESAN_BERKAS_TIDAK_VALID* | *Ditolak dengan PESAN_BERKAS_TIDAK_VALID, data tidak tersimpan (362ms)* | *Pass* |
| *INT-TC47* | *I-05* | *Normal, data flow: UC05 -> UC03* | *Admin tes evaluasi minta_ulang_bukti, eksekutor bukaLaporan()* | *Tahap kembali menunggu_eksekusi, catatan evaluasi tampil* | *Setelah minta_ulang_bukti, tugas kembali ke tahap menunggu_eksekusi, evaluasiTerakhir memuat catatan admin (1055ms)* | *Pass* |
| INT-TC60 | I-02 | Normal | Buat fixture 0 dukungan; upvote sebagai warga lain; baca database/view. | 1 baris, counter 1, skor 10. | Assertion baris, counter, skor, dan getJumlahUpvote lulus. | Pass |
| INT-TC61 | I-02 | Batas/negatif | Pengguna sama mendukung dua kali. | Error kedua 23505; baris 1, counter 1, skor 10. | Seluruh assertion lulus. | Pass |
| INT-TC62 | I-02 | Negatif | Client tanpa sesi mencoba upvote. | Ditolak; baris dan counter 0. | Ditolak dan tidak ada pertambahan. | Pass |
| INT-TC63 | I-02 | Negatif | Pelapor mendukung fixture sendiri. | Error 42501; baris dan counter 0. | Sesuai harapan. | Pass |
| INT-TC64 | I-02 | Normal/keamanan | Anonim membaca daftar, rincian entity, dan seluruh kolom view untuk fixture. | Laporan terbaca tanpa identitas pelapor. | Ketiga respons lolos assertion. | Pass |

<br>

Kelima kasus lulus. Pelacak menghapus hanya ID data tes yang dicatat, termasuk baris dukungan. Keluaran run yang didokumentasikan menyatakan seluruh fixture UC06 sudah dibersihkan dan sisa laporan <code>[TEST-INT]</code> adalah 0. Laporan manual LK-0038 memakai penanda berbeda dan telah dibersihkan setelah pengukuran KNF11; bukti pembersihannya dicatat terpisah pada 4.6.

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

### 4.4.6 Use Case Memantau Status Laporan

**Use case:** UC06 Memantau Status Laporan. **Acuan:** SKPL 4.4.6.<br>
**Lingkungan:** production, Chrome; akun seed untuk riwayat dan akun warga tes untuk dukungan.

Tabel 4.4.6. Hasil Pengujian UC06

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC06-TC01 | KF19; pembacaan KF11/KF12 | Normal: riwayat dan linimasa | Masuk sebagai warga1; buka Riwayat dan LK-0022; tinjau linimasa LK-0001. | Akun warga1; LK-0022 dan LK-0001. | Tiket, kategori, tanggal, status, serta linimasa dan waktunya tampil. | LK-0022: Diterima 12 Nov 2026 22.09. LK-0001: Diterima → Dikerjakan/menunggu eksekusi → Dikerjakan/menunggu evaluasi → Berhasil, dengan waktu. | Pass untuk riwayat/linimasa. Foto selesai diperiksa pada TC04. |
| UC06-TC02 | KF13, KF20 | Alternatif 1: peta dan dukungan | Buat LK-0038 khusus tes sebagai warga1; masuk sebagai warga8; pilih pada peta; Dukung; refresh dan pilih ulang. | LK-0038 aktif, 0 dukungan; warga1 sebagai pelapor dan warga8 sebagai pendukung. | Dukungan bertambah tepat satu, tersimpan, tombol tidak menerima ulang, identitas pelapor tersembunyi. | Dukung (0) menjadi Didukung (1), tetap 1 setelah refresh. Anonim melihat 1 dukungan dan Masuk untuk mendukung. | Pass untuk dukungan/persistensi/akses publik. Kelengkapan kartu diperiksa pada TC05. |
| UC06-TC03 | KF11, KF19 | Alternatif 2: Ditolak | Sebagai warga1, buka LK-0012. | Akun warga1; LK-0012 berstatus Ditolak. | Status, alasan penolakan, dan linimasa tampil. | Alasan: lokasi di area Gedung Sate di luar kewenangan kota. Diterima 31 Okt 2026 12.00 → Ditolak 1 Nov 2026 09.00. | Pass |
| UC06-TC04 | KF19 | Normal: bukti hasil perbaikan | Buka bagian Hasil perbaikan LK-0001 yang berstatus Berhasil. | Akun warga1; LK-0001 berstatus Berhasil. | Dokumentasi foto hasil tersedia sesuai skenario normal SKPL. | “Belum ada bukti hasil perbaikan untuk laporan ini.” Foto tidak tampil pada sampel. | Fail pada sampel; data hasil/evaluasi dan akses warga perlu dikonfirmasi. |
| UC06-TC05 | KF20; SKPL alternatif 1 langkah 4 | Kelengkapan rincian publik | Pilih LK-0038 yang memiliki deskripsi dan gambar uji. | LK-0038 dengan deskripsi dan satu PNG uji. | Kartu menampilkan foto, kategori, deskripsi, lokasi, status, dukungan. | Kartu menampilkan tiket, kategori, status, dukungan; foto/deskripsi tidak tampil. ItemPeta/KartuLaporanPublik hanya memuat ringkasan. | Fail terhadap kelengkapan kartu SKPL; selaraskan perubahan UI M9 atau lengkapi pada pengembangan berikutnya. |

Untuk TC04, C08 memilih hasil dengan evaluasi selesai, sedangkan policy evaluasi pada migration membatasi pembacaan kepada admin/eksekutor. Ini merupakan dugaan penyebab yang perlu dikonfirmasi terhadap data dan konfigurasi production. Hasil unit test tidak dipakai untuk mengubah temuan browser menjadi Pass. Perubahan fitur/skema tidak dilakukan dalam pengujian rilis.

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF09-TC01* | *KNF09* | *Response time* | *Antrean tiket dihitung ulang dan diurutkan berdasarkan Skor Prioritas dalam ≤ 3 detik setiap ada laporan baru masuk.* | *Chrome DevTools (Disable chche), 5 kali ukur & refresh, ambil rata-rata* | *Rata-rata 2.152 detik, maks 2.97 detik* | *Pass* |
| *KNF10-TC01* | *KNF09* | *Ergonomy* | *Koordinat lokasi terintegrasi langsung dengan Google Maps, eksekutor tidak perlu mengetik ulang alamat* | *Klik "Buka di Google Maps" dari rincian 3 tugas berbeda, cocokan koordinat di Rincian Tugas dengan di URL Google Maps. Hitung jumlah klik yang diperlukan.* | *3/3 berhasil, 2 klik dari daftar.* | *Pass* |
| KNF11-TC01 | KNF11 | Memory | Daftar dashboard memakai thumbnail; gambar asli dimuat saat detail dibuka. | Chrome DevTools Network; Disable cache aktif; filter Img, lalu storage untuk detail. 1 sampel LK-0038 diamati pada dua kondisi, sebelum dan sesudah detail dibuka. | Sebelum: 0 request gambar, 0,0 kB. Pada rekaman sesudah: 2 request PNG, 7.308 kB dan 7.309 kB, total transfer 14.617 kB. Daftar tidak menampilkan thumbnail; gambar asli dimuat saat detail. Inspeksi kode menunjukkan URL Storage asli dipakai untuk pratinjau dan perbesaran. | Fail terhadap kewajiban thumbnail pada daftar; pemuatan gambar asli saat detail sudah teramati. Usulan: buat thumbnail terpisah saat unggah dan pakai pada daftar, dengan URL asli untuk detail. |
| KNF12-TC01 | KNF12 | Security | 0 field identitas pribadi pelapor pada data peta publik. | Incognito tanpa login; Network → Doc → status → Response; 1 respons disalin dan objek data diperiksa; pencarian id_pelapor. | Respons 21.774 byte, 27 objek laporan, tanpa field id_pelapor/nama/email/kontak. LK-0038 memiliki 8 field publik, 1 dukungan, sudahDidukung = null. UI tidak menampilkan nama pelapor. | Pass pada respons dan sampel yang diperiksa. |

<br>

Field id pada DTO adalah ID laporan. Kata “pelapor” dapat muncul pada teks UI; pemeriksaan identitas dilakukan pada field dan isi objek data laporan.

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C07-UT01 - C07-UT16* | <img alt="C07-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C07-UT.png" width="600"> |
| *C07 (coverage)* | <img alt="C07-Coverage" src="./assets/bukti-test/unit-test/ut-uc03-uc04/c07-coverage.png" width="600"> |
| *C08-UT01 - C08-UT20* | <img alt="C08-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C08-UT.png" width="600"> |
| *C08 (coverage)* | <img alt="C08-Coverage" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C08-coverage.png" width="600"> |
| *C19-UT01 - C19-UT15* | <img alt="C19-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C19-UT.png" width="600"> |
| *C20-UT01 - C20-UT24* | <img alt="C19-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C20-UT.png" width="600"> |
| *C02-UT40 - C02-UT42* | <img alt="C20-UT" src="./assets/bukti-test/unit-test/ut-uc03-uc04/C02-UT.png" width="600"> |
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
| C06-UT01–C06-UT10 | <img alt="Sepuluh tes Upvote lulus" src="./assets/bukti-test/unit-test/ut-uc06/C06-UT.png" width="650"> |
| C06 coverage | <img alt="Coverage C06 100 persen line dan branch" src="./assets/bukti-test/unit-test/ut-uc06/C06-coverage.png" width="650"> |
| C02-UT60–C02-UT70 | <img alt="Sebelas tes rincian publik lulus" src="./assets/bukti-test/unit-test/ut-uc06/C02-UT.png" width="650"> |
| C22-UT01–C22-UT08 | <img alt="Delapan kasus utama C22 lulus" src="./assets/bukti-test/unit-test/ut-uc06/C22-UT.png" width="650"> |
| INT-TC60–INT-TC64 | <img alt="Lima integrasi lulus dan sisa TEST INT nol" src="./assets/bukti-test/integration-test/UC06-INT.png" width="650"> |
| UC06-TC01, daftar | <img alt="Daftar riwayat pribadi" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC01-1.png" width="500"> |
| UC06-TC01, detail | <img alt="Detail dan linimasa LK-0022" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC01-2.png" width="500"> |
| UC06-TC01 dan UC06-TC04 | <img alt="Linimasa LK-0001 dan bukti hasil belum tampil" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC01-3.png" width="500"> |
| UC06-TC02, peta | <img alt="Peta dan kartu publik" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC02-1.png" width="500"> |
| UC06-TC02, setup | <img alt="Laporan tes LK-0038 dibuat" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC02-setup.png" width="500"> |
| UC06-TC02 dan UC06-TC05, sebelum | <img alt="LK-0038 nol dukungan" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC02-2.png" width="500"> |
| UC06-TC02, sesudah | <img alt="LK-0038 sesudah dukungan" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC02-3.png" width="500"> |
| UC06-TC02, refresh | <img alt="Dukungan tetap setelah refresh" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC02-4.png" width="500"> |
| UC06-TC03 | <img alt="Alasan dan linimasa penolakan" src="./assets/bukti-test/uc-test/uc-uc06/UC06-TC03.png" width="500"> |
| KNF12-TC01, UI | <img alt="Peta anonim" src="./assets/bukti-test/knf-test/knf-uc06/KNF12-TC01-1.png" width="500"> |
| KNF12-TC01, Network | <img alt="Pemeriksaan identitas pada Network" src="./assets/bukti-test/knf-test/knf-uc06/KNF12-TC01-2.png" width="650"> |
| KNF12-TC01, teks respons | [Respons HTML anonim](./assets/bukti-test/knf-test/knf-uc06/KNF12-response.txt) |
| KNF11-TC01, daftar | <img alt="Daftar sebelum detail tanpa request gambar" src="./assets/bukti-test/knf-test/knf-uc06/KNF11-TC01-1.png" width="650"> |
| KNF11-TC01, detail | <img alt="Detail LK-0038 memuat PNG berukuran asli" src="./assets/bukti-test/knf-test/knf-uc06/KNF11-TC01-2.png" width="650"> |
| Pembersihan LK-0038 | [Verifikasi database dan Storage](./assets/bukti-test/uc-test/uc-uc06/UC06-cleanup.json) |

<br>

---

Pembersihan manual menghapus hanya LK-0038 berdasarkan ID, tiket, dan penanda yang cocok, beserta satu berkas PNG terkait. Verifikasi menunjukkan 0 baris laporan/anak terkait dan 0 berkas tersebut pada Storage. Sisa laporan berpenanda [TEST-UC06-D] saat pemeriksaan: 0. Akun dan laporan lain tidak menjadi target pembersihan.

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KF06 | — | UC01, UC06 | C06 - Upvote<br>C02 - Laporan<br>C22 - StatusController | src/server/entities/Upvote.ts<br>src/server/entities/Laporan.ts<br>src/server/controllers/StatusController.ts | UC06-TC02 | C06-UT01–C06-UT10; INT-TC60–INT-TC63 |
| KF07 | — | UC06 | C10 - Notifikasi<br>C23 - NotifikasiController<br>C16 - StatusLaporanPage | src/server/entities/Notifikasi.ts<br>src/server/controllers/NotifikasiController.ts<br>src/client/views/StatusLaporanPage.tsx | — (pengiriman notifikasi: B/F) | — (pengiriman notifikasi: B/F) |
| KF10 | KNF11 | UC02 | C12 - ValidasiPage<br>DetailLaporan (komponen bersama) | src/client/views/ValidasiPage.tsx<br>src/client/components/shared/DetailLaporan.tsx | — | KNF11-TC01 |
| KF11 | — | UC02, UC06 | C22 - StatusController<br>C16 - StatusLaporanPage | src/server/controllers/StatusController.ts<br>src/client/views/StatusLaporanPage.tsx | UC06-TC03 | C22-UT03–C22-UT04 |
| KF12 | — | UC02, UC06 | C22 - StatusController<br>C16 - StatusLaporanPage | src/server/controllers/StatusController.ts<br>src/client/views/StatusLaporanPage.tsx | UC06-TC01 | C22-UT01, C22-UT03 |
| *KF13* | *KN09* | UC02, UC03, UC06 | *C02 - Laporan<br>C07 - ListTugas<br>C19 - PenugasanController*<br>C06 - Upvote<br>C22 - StatusController<br>C16 - StatusLaporanPage | `src/server/entities/Laporan.ts` (trigger `tambah_upvote`)<br>`src/server/entities/ListTugas.ts`<br>`src/server/controllers/PenugasanController.ts`<br>src/server/entities/Upvote.ts<br>src/server/controllers/StatusController.ts<br>src/client/views/StatusLaporanPage.tsx | *UC03-TC01*<br>UC06-TC02 | *C02-UT43 – C02-UT45, C07-UT01 – C07-UT04, C07-UT14, C19-UT03, C19-UT04, INT-TC40, KNF09-TC01*<br>C06-UT01–C06-UT10; C22-UT07–C22-UT08; INT-TC60–INT-TC63 |
| KF14 | KNF09, KNF10 | UC03 | C02 - Laporan<br>C07 - ListTugas<br>C13 - PenugasanPage<br>C19 - PenugasanController | `src/server/entities/Laporan.ts`<br>`src/server/entities/ListTugas.ts`<br>`src/client/views/PenugasanPage.tsx`<br>`src/client/components/penugasan/*`<br>`src/server/controllers/PenugasanController.ts` | UC03-TC01 – UC03-TC05 | C02-UT40 – C02-UT42, C07-UT01 – C07-UT16, C19-UT01 – C19-UT15, INT-TC40 – INT-TC43, KNF10-TC01 |
| KF15 | - | UC04 | C04 - Foto<br>C05 - Video<br>C08 - HasilPerbaikan<br>C14 - HasilPerbaikanForm<br>C20 - PerbaikanController | `src/server/entities/HasilPerbaikan.ts`<br>`src/client/views/HasilPerbaikanForm.tsx`<br>`src/server/controllers/PerbaikanController.ts`<br>`src/lib/validasi-perbaikan.ts` | UC04-TC01 – UC04-TC04 | C08-UT01 – C08-UT07, C08-UT15 – C08-UT17, C20-UT01 – C20-UT24, INT-TC44 – INT-TC46 |
| KF17 | - | UC05, UC03 | C09 - Evaluasi<br>C19 - PenugasanController | `src/server/entities/Evaluasi.ts` (`getEvaluasiTerakhir`)<br>`src/server/controllers/PenugasanController.ts` | UC03-TC05 | C19-UT11, INT-TC47 |
| KF19 | - | UC06 | C08 - HasilPerbaikan<br>C22 - StatusController<br>C16 - StatusLaporanPage | `src/server/entities/HasilPerbaikan.ts` (`getBuktiLengkap`)<br>src/server/controllers/StatusController.ts<br>src/client/views/StatusLaporanPage.tsx | UC06-TC01, UC06-TC03, UC06-TC04 | C08-UT08 – C08-UT14, C08-UT18 – C08-UT20<br>C22-UT01–C22-UT04 |
| KF20 | KNF12 | UC06 | C02 - Laporan<br>C22 - StatusController<br>C16 - StatusLaporanPage | src/server/entities/Laporan.ts<br>src/server/controllers/StatusController.ts<br>src/client/views/StatusLaporanPage.tsx | UC06-TC02, UC06-TC05 | C02-UT60–C02-UT70; C22-UT05–C22-UT06; INT-TC64; KNF12-TC01 |

Cakupan D pada KF06, KF07, KF11, KF12, dan KF13 hanya meliputi komponen UC06; pengujian formulir duplikat (A), perubahan status (B), pengurutan tugas (C), serta pengiriman notifikasi (B/F) tetap digabungkan dari pemiliknya. UC06-TC04, UC06-TC05, dan KNF11-TC01 mencatat temuan Fail; kebutuhan terkait belum dinyatakan terpenuhi seluruhnya.

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| KNF09 | Response time | KF13, KF14 / UC03 | KNF09-TC01 |
| KNF10 | Ergonomy | KF14 / UC03 | KNF10-TC01 |
| KNF11 | Memory | KF10 / UC02 | KNF11-TC01 |
| KNF12 | Security | KF20 / UC06 | KNF12-TC01 |
