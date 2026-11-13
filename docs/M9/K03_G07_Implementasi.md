<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
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


# BAGIAN B: Laporan Implementasi

## B.1 Perubahan dari DPPL

Rincian lengkap setiap perubahan implementasi dari referensi DPPL, beserta penanggung jawabnya.

Tabel B.1. Perubahan dari DPPL

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[mis. Kelas C05, layar I-03, tabel `orders`]* | *[Yang direncanakan]* | *[Yang dibuat]* | *[Alasan perubahan]* |
| *...* | *...* | *...* | *...* | *...* |

## B.2 Bukti Penerapan Best Practices

Repository: <https://github.com/bagasapt-spec/IF2150-RPL-K03-G07>

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | [Daftar branch](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/branches) · [Network graph](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/network) | *Melakukan branch per fitur dengan format `<tipe>/<nama-fitur>`. Contoh: `feat/penugasan-rincian`. Semua branch fitur digabung ke `dev` lewat Pull Request, dan `dev` digabung ke `main` untuk rilis.* |
| Semantic commit | [Riwayat commit `dev`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/commits/dev) | *Format `<tipe>(<scope>): <deskripsi>` dengan scope per fitur. Contoh: `feat(penugasan): tambah operasi doFilter() di PenugasanController`, `fix(perbaikan): pakai client Supabase bukan server`* |
| Track tasks | [Issues](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/issues) · [Project "LaporKota - Milestone 9 Board"](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/projects) | Pembuatan Issue per use case/fitur dengan Acceptance Criteria, Asignee, Label, dan Kolom Todo/In Progress/Done. Dibagi menjadi 12 Issue (#94-#96, #98-#105) berdasarkan perna dengan label `enhancement`, `test`, `performance`, dan `documentation`. Pembagian tanggung jawab Issues terlampir di Tabel B.2a * |
| Pull request dan review | PR representatif: [#85](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/pull/85) (UC03 daftar tugas), [#88](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/pull/88) (filter kategori), [#97](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/pull/97) (validasi dan evaluasi admin) | *PR berisi ringkasan, daftar perubahan, baris perubahan DPPL, dan screenshot bukti hasil pekerjaan. Pembagian peran reviewer terlampir di Tabel B.2a* |
| Pengujian | [Riwayat CI (GitHub Actions)](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/actions) · contoh file test: [`ListTugas.test.ts`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/blob/dev/src/server/entities/ListTugas.test.ts), [`HasilPerbaikan.test.ts`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/blob/dev/src/server/entities/HasilPerbaikan.test.ts), [`validasi-perbaikan.test.ts`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/blob/dev/src/lib/validasi-perbaikan.test.ts), [`StatusController.test.ts`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/blob/dev/src/server/controllers/StatusController.test.ts), [`EvaluasiController.test.ts`](https://github.com/bagasapt-spec/IF2150-RPL-K03-G07/blob/dev/src/server/controllers/EvaluasiController.test.ts) · tangkapan layar hasil `npm run test` | *Unit test Vitest diletakkan di samping kode (`<feat>.test.ts` di dalam src/). Yang diuji: logika inti entity (urutan prioritas, validasi berkas, validasi input) dan controller dengan entitiy yang di-mock. Dijalankan dengan `npm run test`.* |

Tabel B.2 Pembagian Issue & Reviewer
| Peran | Anggota | Issue | Jumlah | Direview |
| :--- | :--- | :--- | :--- |
| A | Ata | #100 UC01 Tampilan Formulir Laporan dan Integrasi Geolocation GPS · #101 UC01 Validasi Media, Anti-Bot Turnstile, dan Deteksi Duplikasi Laporan | 2 | [D] Prana (utama) atau [F] Dipta (backup) |
| B | Bagas | #93 UC02 & UC05 Layout Admin dan Sidebar Navigasi Antrean · #94 UC02 Logika Controller dan Antarmuka Validasi Laporan · #95 UC05 Logika Controller, Entity, dan Antarmuka Evaluasi Hasil Kerja · #96 Unit Testing dan Proteksi Akses Role Admin | 4 | [C] Fritz (utama) atau [F] Dipta (backup) |
| C | Fritz | #98 UC03 Antarmuka Daftar Tugas Eksekutor Terurut Skor Prioritas · #99 UC04 Formulir Pengiriman Hasil Perbaikan dan Unggah Bukti Kerja | 2 | [B] Bagas (utama) atau [F] Dipta (backup) |
| D | Prana | #102 UC06 Tab Riwayat Laporan Warga dan Linimasa Status Tiket · #103 UC06 Peta Sebaran Publik Anonim dan Fitur Dukungan Laporan | 2 | [A] Ata (utama) atau [F] Dipta (backup) |
| F | Dipta | #104 Profiling Performa RPC `cari_laporan_duplikat` dan Optimasi Database · #105 Finalisasi Dokumentasi README dan Penyusunan Laporan B.1–B.5 | 2 | [D] Prana (utama) atau [B] Bagas (backup) |
| | | **Total** | **12** |

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

**Catatan Penting**

*Menjalankan Aplikasi*
- Aplikasi memakai Supabase. File `.env.local` diisi dari `.env.example`, dengan nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` yang akan diberikan kelompok kami kepada asisten. Kunci rahasia (`SUPABASE_SECRET_KEY`) hanya dipakai skrip seed dan tidak dibutuhkan untuk menjalankan aplikasi.
- Akun uji (tercantum di `src/README.md`): `warga1@laporkota.test`, `warga2@laporkota.test`, `admin@laporkota.test`, `eksekutor@laporkota.test`.
- Data uji dapat dikembalikan ke kondisi awal dengan `npm run seed`.

*Kendala*
- Lokasi yang ditampilkan hanya berupa koordinat, peta, dan link Google Maps. Database tidak menyimpan alamat dalam wujud teks.
- Jika pengiriman "HasilPerbaikan" gagal setelah foto/video terunggah, berkas tersebut teteap tertinggal di bucket `media`
- Filter Daftar Tugas hanya berdasarkan kategori; filter lokasi tidak diimplementasikan.

# MONGGO DIISI LAGI

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| 13525015 | Muhammad Atallah Ramadhan | **Peran A: UC01 Melaporkan Kerusakan.** Formulir laporan dan integrasi geolocation GPS (#100); validasi media, anti-bot Turnstile, dan deteksi duplikasi laporan (#101). Kelas C11, C17. | *[%]* |
| 13525075 | Bagas Anugrah Putra | **Peran B: UC02 Memvalidasi Laporan dan UC05 Mengevaluasi Hasil Perbaikan.** Layout admin dan sidebar (#93), validasi laporan I-03 (#94), evaluasi hasil kerja I-04 (#95), unit test dan proteksi role admin (#96). Kelas C09, C12, C15, C18, C21. | *[%]* |
| 13525105 | Pasaribu Fritz T.A.M. | **Peran C: UC03 Melihat Penugasan Lapangan dan UC04 Melaporkan Hasil Penugasan** (#98, #99). Daftar Tugas I-05 (urutan skor prioritas, filter kategori, rincian tugas dengan peta, Google Maps, dan catatan evaluasi terakhir), Formulir Hasil Perbaikan I-06 (validasi, unggah foto/video, pengiriman), serta penyediaan bukti hasil perbaikan untuk KF19. Kelas C07, C08, C13, C14, C19, C20. | *[%]* |
| 13525099 | Gede Pranajayanta Suputra | **Peran D: UC06 Melihat Status Laporan.** Tab riwayat laporan warga dan linimasa status tiket (#102); peta sebaran publik anonim dan dukungan laporan (#103). Kelas C16, C22. | *[%]* |
| 13525051 | Rafi Pradipta Andira Sulistyo | **Peran F (Fondasi).** Skema basis data, autentikasi, komponen bersama, seed, dan CI; profiling RPC `cari_laporan_duplikat` (#104); finalisasi README dan laporan B.1–B.5 (#105). Kelas C01–C06, C10, C23 beserta AuthController. | *[%]* |

## B.5 Traceability Kelas Perancangan ke Implementasi


Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | User | Modul fungsi *entity* + tabel `profiles` | `src/server/entities/User.ts`: `muatProfil`; dipakai `src/lib/auth.ts`: `getCurrentUser`, `requireRole`, `requireRoleOrRedirect`, tipe `UserAktif` | Atribut `idUser`, `nama`, `role` menjadi kolom tabel `profiles` dan tipe `UserAktif` (`email` dikelola Supabase Auth). `getIdUser()`/`getRole()` menjadi field `id`/`role` pada `UserAktif`; `isAdmin()` dan pemeriksaan peran lain diwujudkan `requireRole(...)`. Sesi dibaca dengan `getClaims()` (JWT terverifikasi) |
| C02 | Laporan | Modul fungsi *entity* + tabel `laporan` | `src/server/entities/Laporan.ts`: `simpanLaporan`, `getByStatus`, `getMilikSaya`, `getRincian`, `getDaftarPublik`, `getRincianPublik`, `urutPrioritas`, `filterKategori` | Atribut menjadi kolom tabel `laporan` (`id_tiket`, `kategori`, `deskripsi`, `status`, `tahap`, `waktu_masuk`, `jumlah_upvote`, `skor_prioritas`, `alasan_penolakan`). `simpanLaporan` memanggil RPC `kirim_laporan` (laporan + foto/video dalam satu transaksi; ID tiket diterbitkan basis data). `tambahUpvote`/`hitungPrioritas` diwujudkan trigger `tambah_upvote`. `updateStatus`/`setAlasanPenolakan` dilakukan lewat UPDATE kolom `status`/`alasan_penolakan` (ValidasiController) dan trigger evaluasi. `filterByKategori` menjadi fungsi murni `filterKategori`. Riwayat status dicatat trigger |
| C03 | Lokasi | Fungsi murni | `src/server/entities/Lokasi.ts`: `dalamWilayah`, `hitungJarak`, `getKoordinat`, tipe `Koordinat`; batas kota di `src/lib/batas-wilayah.ts` | Atribut `latitude`/`longitude` menjadi tipe `Koordinat` dan kolom di tabel `laporan`. `dalamWilayah` memakai *ray casting* terhadap poligon batas kota; `hitungJarak` memakai rumus haversine; `getKoordinat` mengembalikan `[lat, lng]` untuk Leaflet. Dapat dipakai di browser dan server. Diuji di `Lokasi.test.ts` |
| C04 | Foto | Fungsi murni + tabel `foto` | `src/server/entities/Foto.ts`: `isFotoValid`, `formatDariNama`, `ukuranValid`, `urlMedia`, tipe `Berkas`, `MediaTerunggah` | Atribut `format`, `ukuran` menjadi kolom tabel `foto`; `url` disimpan sebagai `path` di bucket `media` dan URL publik dibentuk `urlMedia()`. `isFotoValid` (Algo-009) memeriksa format JPG/PNG dan ukuran ≤ 10 MB dari ekstensi nama berkas. Baris `foto` ditulis RPC `kirim_laporan`/`kirim_hasil_perbaikan`. Diuji di `Foto.test.ts` |
| C05 | Video | Fungsi murni + tabel `video` | `src/server/entities/Video.ts`: `isVideoValid` | Sama dengan C04 untuk video: `isVideoValid` (Algo-010) memeriksa format MP4/MOV/MKV dan ukuran ≤ 10 MB. Baris `video` ditulis RPC yang sama. Diuji di `Video.test.ts` |
| C06 | Upvote | Modul fungsi *entity* + tabel `upvote` + trigger | `src/server/entities/Upvote.ts`: `catatUpvote`, `getJumlahUpvote`, `sudahUpvote` | Atribut `idUpvote`, `waktuUpvote` menjadi kolom tabel `upvote`. `catatUpvote` (Algo-011) menyisipkan baris; aturan satu dukungan per akun dan bukan pelapor dijaga RLS + *unique constraint*. Penghitung `jumlah_upvote` dan `skor_prioritas` diperbarui trigger `tambah_upvote`. `getJumlahUpvote` membaca kolom `jumlah_upvote` di view publik. `sudahUpvote` adalah operasi tambahan untuk menonaktifkan tombol Dukung |
| C07 | ListTugas | Kelas TypeScript + fungsi murni | `src/server/entities/ListTugas.ts`: kelas `ListTugas`, fungsi `isKategori`, `isTugasAktif`, tipe `TugasLaporan`, `RincianTugas`, `EvaluasiTerakhir` | Atribut `daftarLaporan` menjadi field privat *readonly*; `jumlahLaporanAktif` menjadi *getter*. `urutPrioritas()`, `filterKategori()`, dan `getLaporanById()` menjadi *method*. Kelas tidak punya tabel: datanya dimuat `Laporan.getByStatus()` oleh PenugasanController. Diuji di `ListTugas.test.ts` |
| C08 | HasilPerbaikan | Modul fungsi *entity* + tabel basis data | `src/server/entities/HasilPerbaikan.ts`: `validasiBerkas`, `simpanBukti`, `getBuktiLengkap`, `pilihBuktiSelesai`, tipe `BuktiLengkap`; tabel `hasil_perbaikan` dan baris `foto`/`video` dengan `id_hasil` | Atribut `idHasil`, `catatan`, `waktuUnggah`, `fotoBukti`, `videoBukti` menjadi kolom `hasil_perbaikan` dan relasi `foto`/`video`, serta tipe `BuktiLengkap`. `simpanBukti` memanggil RPC `kirim_hasil_perbaikan`; `getBuktiLengkap` dipakai `StatusController` (KF19). Diuji di `HasilPerbaikan.test.ts` |
| C09 | Evaluasi | Modul fungsi *entity* + tabel `evaluasi` + trigger | `src/server/entities/Evaluasi.ts`: `simpanEvaluasi`, `ambilDaftarSiapEvaluasi`, `ambilDetailEvaluasi`, `cariIdLaporan`, `getEvaluasiTerakhir`, tipe `DetailEvaluasi`, `DataEvaluasiBaru` | Atribut menjadi kolom tabel `evaluasi` (`keputusan`, `catatan`, `waktu_evaluasi`, ditambah `id_hasil` dan `id_admin`). Konstruktor + `simpanEvaluasi()` (Algo-016) menjadi satu fungsi INSERT dengan data `DataEvaluasiBaru`. `getKeputusan()` menjadi kolom `keputusan` yang dibaca `getEvaluasiTerakhir()` (dipakai rincian tugas eksekutor). Perubahan status/tahap laporan dan notifikasi setelah evaluasi diurus trigger `terapkan_evaluasi` |
| C10 | Notifikasi | Modul fungsi *entity* + tabel `notifikasi` + trigger basis data | `src/server/entities/Notifikasi.ts`: `getMilikSaya`, `jumlahBelumDibaca`, `tandaiDibaca`; real-time di `src/client/components/shared/useNotifikasi.ts` | Atribut menjadi kolom tabel `notifikasi` (`isi_pesan`, `waktu_kirim`, `status_baca`). `createNotifikasi`, `createNotifikasiSelesai`, dan `buatPesan` diwujudkan trigger `catat_perubahan_status` dan `terapkan_evaluasi`, dalam transaksi yang sama dengan perubahan status. `tandaiDibaca` (Algo-018) mengubah `status_baca` (hanya kolom ini yang boleh diubah pengguna). Siaran ke browser memakai Supabase Realtime |
| C11 | LaporPage | Client Component + route Server Component + komponen pendukung | `src/client/views/LaporPage.tsx`: `LaporPage`; route `src/app/(warga)/lapor/page.tsx`; `src/client/components/lapor/`: `HeaderLapor`, `AreaBerkas`, `AreaLokasi`, `DialogTerkirim`, `DialogDuplikat` | Atribut menjadi *state* (`inputKategori`, `inputDeskripsi`, `berkasFoto`, `berkasVideo`, `lokasi`). `bukaForm()` diwujudkan route yang memeriksa role warga dan mengirim `idUser`. `kunciLokasi()` membungkus Geolocation API (batas 3 detik, Algo-020); `tandaiLokasiManual()`, `submitForm()`, dan `batalkanLaporan()` menjadi fungsi di komponen; `tampilkanPesan()` menjadi *state* `pesanError` dan dialog. Laporan serupa (KF05) ditampilkan `DialogDuplikat`. `ambilTokenAntiBot()` *[menyusul bersama verifikasi anti-bot, issue #101]* |
| C12 | ValidasiPage | Client Component + route Server Component + komponen pendukung | `src/client/views/ValidasiPage.tsx`: `ValidasiPage`; route `src/app/(admin)/validasi/page.tsx`; `src/client/components/validasi/`: `AntreanLaporan`, `RincianLaporan`, `DialogTolak`, `AdminSidebar` | Atribut `pilihanFilter` dan `idTiketTerpilih` menjadi *state*; `inputAlasanPenolakan` dikelola `DialogTolak`. `bukaDasborPenanganan()` diwujudkan route yang memanggil `susunAntrean()` di server dan layout admin. `tampilkanAntrean()`, `pilihFilterKategori()`, `pilihLaporan()`, `onValidClicked()`, `onTolakClicked()`, dan `submitAlasanPenolakan()` menjadi fungsi di komponen dengan nama yang sama; ditambah pembalik urutan antrean |
| C13 | PenugasanPage | Client Component + route Server Component + komponen pendukung | `src/client/views/PenugasanPage.tsx`: `PenugasanPage`, `DaftarTugas`, `renderRincianLaporan`; route `src/app/(eksekutor)/tugas/page.tsx`; `src/client/components/penugasan/`: `FilterKategori`, `KartuTugas`, `PanelRincianTugas`, `tautan.ts` | Atribut `pilihanKategori` dan `idTiketAktif` menjadi *state*; `statusTampilan` menjadi status memuat (`useTransition`). `tampilkanPage()` diwujudkan oleh route yang memanggil `doSorting()` di server. `pilihKategori()` dan `pilihLaporan(tugas)` menjadi *event handler*; `renderListTugas()` menjadi komponen `DaftarTugas`; `renderRincianLaporan()` menampilkan `PanelRincianTugas`; `pindahPage()` menjadi tautan **Laporkan Hasil** ke I-06 |
| C14 | HasilPerbaikanForm | Client Component + route Server Component | `src/client/views/HasilPerbaikanForm.tsx`: `HasilPerbaikanForm`, `renderTerkirim`, `renderGagal`; route `src/app/(eksekutor)/tugas/[idTiket]/hasil/page.tsx` | Atribut `statusTampilan`, `inputDeskripsi`, `berkasFoto`, `berkasVideo` menjadi *state*. `tampilkanForm(idTiket)` diwujudkan oleh route yang memanggil `bukaLaporan(idTiket)`. `userInput()` dan `submitForm()` menjadi fungsi di komponen; `renderBerkas()` disediakan `MediaUploader` (komponen bersama) |
| C15 | EvaluasiPage | Client Component + route Server Component + komponen pendukung | `src/client/views/EvaluasiPage.tsx`: `EvaluasiPage`; route `src/app/(admin)/evaluasi/page.tsx`; `src/client/components/evaluasi/`: `DaftarSiapEvaluasi`, `KomparasiEvaluasi`, `DialogKeputusanEvaluasi` | Atribut `daftarPekerjaan`, `idTiketDipilih`, `inputCatatan` menjadi *state*. `tampilkanPage()` diwujudkan route yang memanggil `ambilDaftarUntukEvaluasi()` di server. `renderListPekerjaan()`, `pilihPekerjaan()`, `renderDetailPekerjaan()`, `konfirmasiSelesai()`, `konfirmasiBelumSelesai()`, `mintaUlangBukti()`, dan `tampilkanHasilEvaluasi()` menjadi fungsi di komponen dengan nama yang sama; perbandingan foto awal dan foto bukti ditampilkan `KomparasiEvaluasi` |
| C16 | StatusLaporanPage | Client Component + route Server Component + komponen pendukung | `src/client/views/StatusLaporanPage.tsx`: `StatusLaporanPage`; route `src/app/(warga)/status/page.tsx`; `src/client/components/status/`: `KartuLaporanPublik`, `BuktiPerbaikan`, `pembaruanPeta`; komponen bersama `DetailLaporan`, `MapView`, `LoncengNotifikasi` | Atribut `modeTampilan` dan `pilihanTiket` menjadi *state*. `pilihMenuRiwayat()`, `pilihMenuPeta()`, `pilihTiket()`, `pilihMarker()`, `onUpvoteClicked()`, `tampilkanRiwayat()`, `tampilkanPetaSebaran()`, dan `tampilkanDetailTiket()` menjadi fungsi di komponen dengan nama yang sama. `bukaTautanNotifikasi()` diwujudkan tautan `/status?tiket=` dari lonceng notifikasi yang dibaca route. Bukti hasil perbaikan (KF19) ditampilkan `BuktiPerbaikan`; peta diperbarui berkala oleh `pembaruanPeta`. Diuji di `BuktiPerbaikan.test.ts`, `KartuLaporanPublik.test.ts`, `StatusDeepLink.test.ts`, `pembaruanPeta.test.ts`, `status/page.test.ts` |
| C17 | LaporanController | Server Action Next.js + fungsi murni + RPC basis data | `src/server/controllers/LaporanController.ts`: `kirimLaporan`, `dukungLaporanDuplikat`; `src/server/controllers/laporan-validasi.ts`: `validasiForm`, `validasiLokasi`, `validasiBerkas` | `kirimLaporan` (Algo-021) mengikuti urutan verifikasi akses (`requireRole("warga")`) → validasi ulang di server → `cekDuplikat` lewat RPC `cari_laporan_duplikat` (radius 20 m, KF05) → `simpanLaporan`. `terbitkanIdTiket()` dilakukan basis data saat insert. Fungsi validasi dipindah ke `laporan-validasi.ts` karena file `"use server"` hanya boleh mengekspor fungsi async; `validasiBerkas` juga memeriksa folder `laporan/<idUser>/`. `dukungLaporanDuplikat` adalah operasi tambahan. `verifikasiAntiBot()`. Diuji di `laporan-validasi.test.ts` |
| C18 | ValidasiController | Server Action Next.js | `src/server/controllers/ValidasiController.ts`: `susunAntrean`, `saringAntrean`, `ambilRincianLaporan`, `setujuiLaporan`, `tolakLaporan` | `verifikasiAkses()` menjadi fungsi internal `requireRole("admin")`. `susunAntrean`/`saringAntrean` memakai `Laporan.getByStatus` dan `filterKategori` (dengan pilihan urutan naik/turun); `ambilRincianLaporan` memakai `Laporan.getRincian`. `setujuiLaporan` mengubah status menjadi Dikerjakan (tahap menunggu eksekusi) dan `tolakLaporan` menjadi Ditolak beserta alasan, keduanya hanya untuk laporan yang masih berstatus Diterima. Diuji di `ValidasiController.test.ts` |
| C19 | PenugasanController | Server Action Next.js (`"use server"`) | `src/server/controllers/PenugasanController.ts`: `verifikasiAkses`, `doSorting`, `doFilter`, `bukaLaporan` | Setiap operasi menjadi fungsi async yang mengembalikan `ActionResult<T>`. Atribut `idUserAktif` tidak disimpan; pengguna dibaca dari sesi lewat `requireRole("eksekutor")` pada tiap pemanggilan. Pemuatan tugas aktif dipusatkan di fungsi bantu internal |
| C20 | PerbaikanController | Server Action Next.js + fungsi murni | `src/server/controllers/PerbaikanController.ts`: `verifikasiAkses`, `unggahHasil`; `src/lib/validasi-perbaikan.ts`: `validasiForm`, `cekKelengkapan`, `cekMediaTerunggah` | `unggahHasil` mengikuti Algo-047 dan mengembalikan `ActionResult`. `validasiForm` dipindah ke modul murni agar dipakai juga oleh formulir (lihat B.1 no. 15). Atribut `idLaporan` dan `idUserAktif` tidak disimpan: `idLaporan` diambil dari `getRincian`, pengguna dari `requireRole`. Diuji di `validasi-perbaikan.test.ts` |
| C21 | EvaluasiController | Server Action Next.js | `src/server/controllers/EvaluasiController.ts`: `ambilDaftarUntukEvaluasi`, `ambilDetailEvaluasi`, `simpanKeputusan` | `verifikasiAkses()` menjadi fungsi internal `requireRole("admin")`. `pilihSiapEvaluasi()` dan `urutkanBerdasarkanWaktu()` digabung ke query `Evaluasi.ambilDaftarSiapEvaluasi` (status Dikerjakan + tahap menunggu evaluasi, terbaru dulu). `simpanKeputusan` memvalidasi keputusan dan mewajibkan catatan untuk Belum Selesai/Minta Ulang Bukti. `ambilIdEksekutor()`/`ambilIdWarga()` tidak diperlukan karena notifikasi dibuat trigger basis data. Diuji di `EvaluasiController.test.ts` |
| C22 | StatusController | Server Action Next.js | `src/server/controllers/StatusController.ts`: `ambilRiwayatWarga`, `ambilDetailStatus`, `ambilLaporanPublik`, `prosesUpvote`, tipe `DetailStatus`, `BuktiHasilPerbaikan` | `verifikasiAkses()` menjadi fungsi internal `requireRole("warga")`. `ambilRiwayatWarga` (Algo-051), `ambilLaporanPublik` (Algo-052, tanpa login, lewat view `laporan_publik`), `ambilDetailStatus` (memeriksa format ID tiket, RLS, dan memanggil `HasilPerbaikan.getBuktiLengkap` untuk KF19), serta `prosesUpvote` (Algo-053, menolak laporan sendiri, laporan selesai, dan dukungan ganda). Diuji di `StatusController.test.ts` |
| C23 | NotifikasiController | Server Action Next.js + trigger basis data + Supabase Realtime | `src/server/controllers/NotifikasiController.ts`: `ambilNotifikasi`, `updateStatusBaca`; komponen `LoncengNotifikasi` dan hook `useNotifikasi` | `updateStatusBaca` (Algo-056) memanggil `Notifikasi.tandaiDibaca`; `ambilNotifikasi` (tambahan) mengembalikan 20 notifikasi terbaru dan jumlah belum dibaca. `susunPesanNotifikasi`, `kirimNotifikasi`, dan `kirimNotifikasiSelesai` diwujudkan trigger `catat_perubahan_status` (ke pelapor) dan `terapkan_evaluasi` (ke eksekutor); notifikasi sampai ke browser lewat Supabase Realtime |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
