<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## Sehati

<p align="center">
  <img alt="Logo Sehati" src="./assets/sehati-logo.png" width="160">
</p>

### Untuk: Aurelia Jennifer Gunawan

Dipersiapkan oleh:

| Informasi | Keterangan |
| --------- | ---------- |
| Kelas     | K01        |
| Kelompok  | G04        |

| NIM      | Nama                         |
| -------- | ---------------------------- |
| 13525052 | Daniel Charisma Christian    |
| 13525061 | Rifqi Irfan Indrawan         |
| 13525082 | Ausa Haadiyaan Mukhtar Yusuf |
| 13525058 | Farish Firstian Erifiawan    |

---

> **Petunjuk pengerjaan:** _[Silahkan hapus bagian ini setelah selesai mengerjakan]_
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

---

**Deadline:** Rabu, 11 November 2026, 21.50 WIB
**Asistensi akbar:** _[Hari, DD Bulan YYYY, HH.MM WIB, lokasi/link]_

---

# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:

- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, _route/handler_, _stored procedure_, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform    | Ketentuan                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web**     | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-_deploy_; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional.                                                                                               |
| **Mobile**  | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release.                                         |

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

| Tipe       | Kegunaan                                                      |
| ---------- | ------------------------------------------------------------- |
| `feat`     | Menambahkan fitur baru                                        |
| `fix`      | Memperbaiki bug                                               |
| `docs`     | Mengubah dokumentasi                                          |
| `style`    | Perubahan format/spasi, tanpa mengubah logika                 |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test`     | Menambah/memperbaiki pengujian                                |
| `chore`    | Tugas rutin (build, dependensi, konfigurasi)                  |

### 3. Track Tasks

Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.

- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review

- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-_review_ minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa

- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform       | Contoh alat                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse                              |
| Web (backend)  | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python         | `cProfile`, `PyInstrument`                                                     |
| Java           | VisualVM, JProfiler                                                            |
| Mobile         | Android Studio Profiler, Flutter DevTools, Xcode Instruments                   |

### 6. Penggunaan AI

Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-_commit_ dan di-_push_ ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan                                                                                               | Jalur                                       |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** _[tautan sheets QnA]_       |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git                                 | Grup kelompok bersama asisten masing-masing |

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

| No    | Bagian DPPL                                    | Rancangan Awal        | Implementasi Akhir | Alasan               |
| ----- | ---------------------------------------------- | --------------------- | ------------------ | -------------------- |
| 1 | UC-11 (Algo-001), kelas `AuthController` (C-25) dan `GoogleAuthService` (C-34) | `LoginView.isiLoginPage(kodeOtorisasi)` menerima kode otorisasi dari halaman login Google, lalu mengirimkannya ke `AuthController.kirimData`. Cara kode kembali dari Google ke aplikasi tidak dirinci. | Ditambah dua rute backend. `GET /api/auth/google/mulai?kembali=<deep link>` (`tampilkanLoginPage`) mengalihkan ke halaman login Google. `GET /api/auth/google/callback` menerima kode dari Google dan meneruskannya ke *deep link* aplikasi yang memiliki *host* (`sehati://masuk` pada APK atau `exp://<host>/--/` pada Expo Go), lalu aplikasi memanggil `POST /api/auth/google` seperti rancangan. Hanya skema aplikasi tersebut yang diterima, agar kode tidak dapat dialihkan ke situs lain; *deep link* tanpa *host* (misalnya `sehati://`) ditolak dengan status 400 karena Android tidak dapat meneruskannya ke aplikasi. | Google OAuth 2.0 hanya menerima *redirect URI* `http(s)`, bukan skema aplikasi *mobile*, sehingga kode harus melewati backend terlebih dahulu. Penukaran kode dengan *client secret* tetap terjadi di server, sesuai alasan arsitektur Client-Server pada DPPL BAB 2. |
| 2 | UC-11, layar I-01, kelas `AuthController` (C-25) | Login hanya melalui akun Google. Akun baru selalu didaftarkan sebagai Mahasiswa. | Ditambah login demo: `POST /api/auth/demo { peran }` membuat sesi untuk akun hasil *seed* (`seed-usr-mhs` atau `seed-usr-adm`), dan layar I-01 menampilkan tombol "Mode demo" (Mahasiswa dan Administrator). Rute hanya aktif bila backend berjalan dengan `MODE_DEMO=1` (selain itu membalas 404), dan tombol hanya tampil bila aplikasi dibangun dengan `EXPO_PUBLIC_MODE_DEMO=1`. | Asisten perlu mencoba kedua peran tanpa akun Google kampus. Akun Administrator juga tidak dapat dibuat melalui login Google karena pendaftaran otomatis selalu membuat akun Mahasiswa. |
| 3 | Layar I-02, objek I-02-02, kelas `Notifikasi` (C-07) | Tombol ikon lonceng menampilkan daftar notifikasi yang diterima (`Notifikasi.tampilkanNotifikasi()`). | Tombol lonceng ditampilkan sesuai rancangan, tetapi belum membuka layar apa pun. Notifikasi tetap diterima sebagai *push notification* di perangkat. | BAB 6 tidak merancang layar daftar notifikasi (I-01 sampai I-15 tidak memuatnya), dan backend belum menyediakan rute untuk membaca riwayat tabel `notifikasi`. Layar tersebut ditunda agar tidak menambah antarmuka di luar rancangan. |
| 4 | UC-11 (Algo-003), kelas `LoginView` (C-16) dan `SesiAutentikasi` (C-04) | Setelah login, aplikasi meminta izin notifikasi, mengambil Expo push token, lalu `daftarkanPerangkat(tokenPush)` menyimpannya pada sesi aktif. Kasus perangkat yang tidak dapat menerima *push* dan kegagalan pendaftaran tidak dirinci. | Pendaftaran perangkat berjalan di latar belakang setelah login dan tidak pernah menggagalkan login: izin yang ditolak, galat pengambilan token, atau galat jaringan hanya berarti perangkat tidak menerima notifikasi. Emulator/simulator dan Expo Go di Android dilewati sebelum izin diminta. | Login tetap harus berhasil walaupun notifikasi tidak tersedia. Expo Go di Android tidak mendukung *push notification* sejak Expo SDK 53, dan dukungan *push* pada emulator (citra Android dengan Google Play, simulator iOS baru) tidak dapat diperiksa dari JavaScript, sehingga pengguna tidak dimintai izin yang tidak dapat dipakai. |
| 5 | Layar I-02, kelas `HomeView` (C-36) dan `SesiAutentikasi` (C-04) | Tombol keluar (`SesiAutentikasi.logout()`) hanya ada di I-03 (I-03-02). I-02 hanya memiliki tombol lonceng (I-02-02), dan tidak ada layar Mahasiswa lain yang memuat tombol keluar. | I-02 diberi tombol ikon keluar di sebelah tombol lonceng. Tombol ini menjalankan `SesiAutentikasi.logout()` yang sama dengan I-03-02, lalu kembali ke I-01. | Tanpa tombol ini, Mahasiswa tidak dapat keluar dari aplikasi karena sesi tersimpan di perangkat dan dipulihkan setiap kali aplikasi dibuka (C-04, `verifikasiToken`). Keluar juga diperlukan untuk berganti akun di perangkat yang sama. |
| 6 | UC-01, layar I-04, objek I-04-03, kelas `DailyAffirmation` (C-05) dan `AffirmationController` (C-26) | Toggle "Kirim afirmasi harian" mengaktifkan atau menonaktifkan pengiriman afirmasi. DPPL hanya merinci `aturWaktuKirim(waktu)`; cara penonaktifan pengiriman tidak dirinci. | Toggle mati menghapus baris `daily_affirmation` Mahasiswa melalui rute tambahan `DELETE /api/affirmation` (idempoten), sehingga penjadwal (Algo-005) berhenti mengirim dan kartu Beranda (I-02-03) kembali menampilkan ajakan mengatur afirmasi. Toggle aktif atau "Simpan Setelan" membuat/memperbarui baris lewat `PUT /api/affirmation/time` dengan konten bawaan `KONTEN_BAWAAN` (Algo-028) pada penyimpanan pertama. | Kelas `DailyAffirmation` hanya memiliki atribut `konten` dan `waktuKirim` (tidak ada atribut aktif), sehingga keadaan "nonaktif" yang paling sederhana dan tidak mengubah skema adalah tidak adanya baris. |
| 7 | UC-03 (Algo-009/011), layar I-06, kelas `CalendarView` (C-19), `CalendarController` (C-28), `GoogleCalendarService` (C-08), dan `KalenderGabungan` (C-09) | `CalendarView` meminta kalender melalui `CalendarController`; controller mengambil event Google Calendar dan jadwal konsultasi, lalu menggabungkannya melalui `KalenderGabungan`. Rancangan tidak merinci format parameter rentang tanggal, fallback tanpa kredensial Google, maupun cara pemetaan event lintas hari di sisi mobile. | Layar I-06 memanggil `ambilKalender(dari, sampai)` dari `src/mobile/src/api/kalender.ts` melalui `GET /api/calendar?dari=<ISO-8601>&sampai=<ISO-8601>`. Endpoint Hono `calendarRoutes` (di `src/backend/src/routes/consultation.ts`) memerlukan autentikasi Mahasiswa, memvalidasi rentang, mengambil slot yang beririsan dengan rentang melalui Q-013 (`semuaJadwal`), lalu menggabungkan hasil Google/mock dengan slot melalui `gabungkanJadwal` di `src/backend/src/lib/kalender.ts`. `GoogleCalendarService` diwujudkan sebagai fungsi di `src/backend/src/lib/google.ts`; jika token atau konfigurasi Google tidak tersedia, layanan mengembalikan event contoh (`mode: "mock"`). Mobile menampilkan navigasi mingguan, agenda hari terpilih, indikator sumber event, tombol muat ulang, serta banner peringatan. Utilitas `src/mobile/src/lib/kalender.ts` menangani tanggal all-day dan event yang melintasi beberapa hari. | Implementasi mengikuti pemisahan client-server, tetapi kelas controller dan layanan tidak dibuat sebagai kelas berorientasi objek: controller diwujudkan sebagai route handler Hono dan layanan/model sebagai modul fungsi. Mode mock memungkinkan layar diuji tanpa menghubungkan akun Google; rentang waktu dan parsing tanggal eksplisit diperlukan agar hasil kalender konsisten dan event all-day tidak bergeser hari. |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik                 | Bukti                                      | Keterangan                           |
| ----------------------- | ------------------------------------------ | ------------------------------------ |
| Branching               | _[Tautan ke daftar branch / graph commit]_ | _[Skema yang dipakai]_               |
| Semantic commit         | _[Tautan ke riwayat commit]_               | _[Ringkasan]_                        |
| Track tasks             | _[Tautan ke Issues/Projects]_              | _[Jumlah issue, pembagian]_          |
| Pull request dan review | _[Tautan ke 2-3 PR representatif]_         | _[Siapa me-review siapa]_            |
| Pengujian               | _[Tautan ke `src/tests/` dan hasil test]_  | _[Apa yang diuji, cara menjalankan]_ |

### B.2.1 Profiling dan Optimasi

Pilih minimal satu fitur yang diprofil.

| Informasi                    | Keterangan                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| Fitur / proses yang diprofil | _[Nama fitur]_                                                |
| Alat                         | _[mis. Chrome DevTools, cProfile, EXPLAIN]_                   |
| Temuan (sebelum)             | _[Bottleneck yang ditemukan, sertakan angka/tangkapan layar]_ |
| Perbaikan                    | _[Yang diubah]_                                               |
| Hasil (sesudah)              | _[Perbandingan dengan sebelumnya]_                            |

Jika tidak ada perbaikan yang perlu dilakukan, jelaskan hasil profiling dan alasan kenapa fitur tersebut sudah memadai.

## B.3 Kendala dan Catatan Penting

Tuliskan kendala yang ditemui, fitur yang belum sempurna (_known issues_), serta hal yang perlu diketahui asisten saat menjalankan atau menilai aplikasi (misalnya akun uji khusus, urutan menjalankan, atau batasan).

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM       | Nama     | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| --------- | -------- | ----------------------------- | --------------------- |
| _[NIM 1]_ | _[Nama]_ | _[Modul/fitur]_               | _[%]_                 |
| _..._     | _..._    | _..._                         | _..._                 |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, _route/handler_, _stored procedure_, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

Kelas _View_ (C-16 sampai C-24 dan C-36) diwujudkan sebagai layar Expo Router di `src/mobile/src/app/`. Kerangka navigasi dan berkas layarnya dibuat pada issue #2; isi tiap layar dikerjakan pada issue yang tercantum di kolom Keterangan. Kelas _controller_ diwujudkan sebagai router Hono di `src/backend/src/routes/`, dan kelas layanan eksternal sebagai modul di `src/backend/src/lib/`.

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| -------- | ---------------------- | ------------------- | ---------------------- | ---------- |
| C-04 | `SesiAutentikasi` | Tabel basis data, *route handler*, *middleware*, dan modul klien | Tabel: `src/backend/src/db/schema.ts` - `sesiAutentikasi`. Server: `src/backend/src/routes/auth.ts` - `POST /api/auth/google`, `POST /api/auth/logout`; `src/backend/src/middleware/auth.ts` - `auth`. Klien: `src/mobile/src/api/sesi.ts` - `simpanSesi`, `pulihkanSesi`, `keluar`; `src/mobile/src/lib/sesi.tsx` - `PenyediaSesi`, `useSesi` | `autentikasiPengguna` diwujudkan oleh *handler* `POST /api/auth/google` (pendaftaran otomatis, pembuatan sesi, dan penyimpanan token Google terenkripsi AES-256-GCM). `verifikasiToken` diwujudkan oleh *middleware* `auth` (menolak sesi berakhir atau melewati `BATAS_SESI` 30 hari), dan di klien oleh `pulihkanSesi` yang memeriksa token tersimpan melalui `GET /api/me` saat aplikasi dibuka. `logout` diwujudkan oleh `POST /api/auth/logout` dan `keluar`. Token sesi disimpan di perangkat dengan `expo-secure-store`. `daftarkanPerangkat` dikerjakan pada issue #5. Issue #1 dan #3. |
| C-05 | `DailyAffirmation` | Tabel basis data, fungsi kueri, dan tugas cron | Tabel: `src/backend/src/db/schema.ts` - `dailyAffirmation`. Kueri: `src/backend/src/db/queries.ts` - `buatAfirmasi`, `ambilAfirmasi`, `ubahWaktuAfirmasi`, `hapusAfirmasi`, `afirmasiJatuhTempo`. Cron: `src/backend/src/jobs/scheduler.ts` - `jalankanAfirmasi` | Atribut `konten` dan `waktuKirim` (DPPL 5.37). `aturWaktuKirim(waktu)` (Algo-004) diwujudkan oleh `cariAfirmasiId` lalu `ubahWaktuAfirmasi`/`buatAfirmasi` (Q-021–Q-023), dengan baris baru memakai `KONTEN_BAWAAN` (Algo-028). `ambilAfirmasi()` (REV-M8-05) oleh `ambilAfirmasi` (Q-041) untuk kartu Beranda dan layar I-04. `kirimAfirmasi()` (Algo-005) oleh `jalankanAfirmasi`, yang setiap menit mengambil afirmasi jatuh tempo (`afirmasiJatuhTempo`, Q-004), mengirim *push* (Q-007), dan mencatat notifikasi (Q-006). Toggle I-04-03 menghapus baris lewat `hapusAfirmasi` (lihat B.1 no. 6). Semuanya diakses lewat `AffirmationController` (C-26). Issue #1 dan #7. |
| C-08 | `GoogleCalendarService` | Modul fungsi layanan eksternal | `src/backend/src/lib/google.ts` - `buatUrlOtorisasi`, `ambilKalender`, `ambilEventGoogle`, `cekBentrokJadwal`, `cekBentrokGoogle`, `buatEventKalenderMock` | `ambilKalender` (Algo-009) mengambil event Google Calendar dalam rentang waktu yang diminta dengan token yang dibaca/diperbarui di server. Jika token atau konfigurasi Google tidak tersedia, fungsi mengembalikan event contoh dengan `mode: "mock"` agar kalender tetap dapat diuji. `cekBentrokJadwal`/`cekBentrokGoogle` (Algo-010) dipakai untuk pemeriksaan bentrok pada pemesanan (UC-04). Scope OAuth mencakup `calendar.readonly`. Issue #3 dan #11. |
| C-09 | `KalenderGabungan` | Modul fungsi dan tipe data | `src/backend/src/lib/kalender.ts` - `EventKalender`, `gabungkanJadwal`, `jadwalBentrok`, `ubahKalender`, `pesanSesi` | `gabungkanJadwal(google, jadwal)` (Algo-011) mengubah event Google dan slot konsultasi menjadi daftar `EventKalender`, memberi label sumber (`google` atau status slot), lalu mengurutkannya berdasarkan waktu mulai. Model ini dihitung saat diminta dan tidak memiliki tabel tersendiri; slot sumbernya berasal dari C-11. Pemeriksaan/penyimpanan bentrok juga digunakan pada alur pemesanan UC-04. Issue #11 dan #12. |
| C-11 | `JadwalKonsultasi` | Tabel basis data dan fungsi kueri | Tabel: `src/backend/src/db/schema.ts` - `jadwalKonsultasi`. Kueri: `src/backend/src/db/queries.ts` - `semuaJadwal`, `ambilKalender` | Untuk kalender I-06, `semuaJadwal(db, dari, sampai)` (Q-013) mengambil slot yang beririsan dengan rentang yang diminta; hasilnya digabungkan dengan event Google oleh C-09. Operasi pemesanan dan pengelolaan jadwal juga diwujudkan oleh kueri lain pada file yang sama. Issue #11, #12, dan #13. |
| C-16 | `LoginView` | Komponen layar (_route_) dan modul klien | `src/mobile/src/app/index.tsx` - `Masuk`; `src/mobile/src/api/auth.ts` - `masukDenganGoogle`, `masukDemo` | Layar I-01. `masukLamanLogin` dan `tampilkanLoginPage` diwujudkan oleh `masukDenganGoogle`, yang membuka halaman login Google di peramban aplikasi (`expo-web-browser`). `isiLoginPage(kodeOtorisasi)` mengirim kode ke `POST /api/auth/google`. `showError` diwujudkan oleh `Banner` galat (I-01-06). `loadPageUtama` diwujudkan oleh `Redirect` ke I-02 atau I-03 sesuai `peran`. Tombol "Mode demo" ditambahkan (lihat B.1 no. 2). `daftarkanPerangkat` dikerjakan pada issue #5. Issue #3. |
| C-17 | `AffirmationView` | Komponen layar (_route_) dan modul klien | Layar: `src/mobile/src/app/(mahasiswa)/afirmasi.tsx` - `Afirmasi`. Klien: `src/mobile/src/api/afirmasi.ts` - `simpanWaktuAfirmasi`, `hapusAfirmasi` | Layar I-04, dibuka dari Beranda (tanpa tombol tab). `bukaPageAffirmasi()` diwujudkan oleh navigasi dari kartu I-02-03 dan menu I-02-05. `tampilkanOpsiAffirmasi()` diwujudkan oleh `useMuatan(ambilAfirmasi)` (Q-041) yang mengisi kartu contoh afirmasi (I-04-02), toggle (I-04-03), dan waktu tersimpan. `pilihWaktuPengiriman(waktu)` diwujudkan oleh pemilih waktu bawaan `@react-native-community/datetimepicker` (I-04-04) dan empat chip waktu cepat (I-04-05). `submitWaktuPengiriman(waktu)` memanggil `simpanWaktuAfirmasi` (`PUT /api/affirmation/time`) dengan Banner sukses (I-04-07) atau galat (I-04-08). Toggle menghapus jadwal lewat `hapusAfirmasi` (`DELETE /api/affirmation`, lihat B.1 no. 6). Issue #7. |
| C-18 | `ReminderView` | Komponen layar (_route_) | `src/mobile/src/app/(mahasiswa)/pengingat.tsx` - `Pengingat` | Layar I-05, tab Pengingat. Diimplementasikan pada issue #8. |
| C-19 | `CalendarView` | Komponen layar (_route_) dan modul klien | Layar: `src/mobile/src/app/(mahasiswa)/kalender.tsx` - `Kalender`. Klien: `src/mobile/src/api/kalender.ts` - `ambilKalender`, `EventKalender`; utilitas: `src/mobile/src/lib/kalender.ts` - `tanggalEvent`, `eventPadaTanggal`, `labelWaktuEvent` | Layar I-06 menampilkan strip tujuh hari, agenda pada tanggal terpilih, label sumber event Google/sesi konsultasi, keadaan kosong, banner galat/peringatan, dan aksi muat ulang. Klien memanggil `GET /api/calendar` dengan parameter `dari` dan `sampai`. Utilitas mobile menangani tanggal all-day Google (format `YYYY-MM-DD`, dengan akhir eksklusif) dan event multi-hari. Issue #11. |
| C-20 | `ConsultationBookingView` | Komponen layar (_route_), dua layar | `src/mobile/src/app/(mahasiswa)/konsultasi.tsx` - `Konsultasi`; `src/mobile/src/app/(mahasiswa)/sesi.tsx` - `PilihSesi` | Layar I-07 (tab Konsultasi) dan I-08. Diimplementasikan pada issue #12. |
| C-21 | `ConsultationManagementView` | Komponen layar (_route_) | `src/mobile/src/app/admin/jadwal.tsx` - `KelolaJadwal` | Layar I-12 pada _stack_ Administrator. Diimplementasikan pada issue #13. |
| C-22 | `FAQView` | Komponen layar (_route_), tiga layar | `src/mobile/src/app/(mahasiswa)/faq.tsx` - `Faq`; `src/mobile/src/app/(mahasiswa)/pertanyaan.tsx` - `Pertanyaan`; `src/mobile/src/app/admin/faq.tsx` - `KelolaFaq` | Layar I-09 (tab FAQ), I-10, dan I-13. Diimplementasikan pada issue #10. |
| C-23 | `FeedbackView` | Komponen layar (_route_), dua layar | `src/mobile/src/app/(mahasiswa)/umpan-balik.tsx` - `UmpanBalik`; `src/mobile/src/app/admin/umpan-balik.tsx` - `TanggapiUmpanBalik` | Layar I-11 dan I-14. Diimplementasikan pada issue #15. |
| C-24 | `ServerStatusView` | Komponen layar (_route_) | `src/mobile/src/app/admin/status.tsx` - `StatusServer` | Layar I-15 pada _stack_ Administrator. Diimplementasikan pada issue #14. |
| C-25 | `AuthController` | Router Hono | `src/backend/src/routes/auth.ts` - `authRoutes` (di-*mount* pada `/api/auth`) | `tampilkanLoginPage` diwujudkan oleh `GET /api/auth/google/mulai`, yang mengalihkan ke halaman login Google, dan `GET /api/auth/google/callback`, yang meneruskan kode ke aplikasi (lihat B.1 no. 1). `kirimData(kodeOtorisasi)` diwujudkan oleh `POST /api/auth/google`. `daftarkanPerangkat` diwujudkan oleh `POST /api/auth/device` (issue #5). Rute tambahan `POST /api/auth/demo` untuk login demo (B.1 no. 2). Issue #1 dan #3. |
| C-26 | `AffirmationController` | Router Hono | `src/backend/src/routes/affirmation.ts` - `affirmationRoutes` (di-*mount* pada `/api/affirmation`) | `tampilkanOpsiAffirmasi()` dan `ambilAfirmasiHariIni()` diwujudkan oleh `GET /api/affirmation` (Q-041; `null` bila belum diatur) yang dipakai I-04 dan kartu Beranda (Algo-031). `submitWaktuPengiriman(waktu)` diwujudkan oleh `PUT /api/affirmation/time`: `validasiWaktu` (Algo-023), lalu `aturWaktuKirim` (Algo-004/Algo-028, Q-021–Q-023) yang membuat baris dengan konten bawaan `KONTEN_BAWAAN` pada penyimpanan pertama. Rute tambahan `DELETE /api/affirmation` untuk toggle I-04-03 (lihat B.1 no. 6). Issue #1 dan #7. |
| C-28 | `CalendarController` | Router Hono dan route handler | `src/backend/src/routes/consultation.ts` - `calendarRoutes` (`GET /api/calendar`), di-*mount* dari `src/backend/src/index.ts` | `tampilkanCalendar()` (UC-03) diwujudkan oleh handler `GET /api/calendar`, dengan middleware `auth` dan `requireRole("mahasiswa")`. Handler memvalidasi parameter rentang, mengambil jadwal lokal, meminta event dari C-08, menggabungkan hasil melalui C-09, dan mengembalikan `{ events, mode, peringatan }`. Jika pengambilan Google gagal, jadwal lokal tetap dikembalikan dan pesan kegagalan disertakan sebagai `peringatan`. Issue #11. |
| C-34 | `GoogleAuthService` | Modul fungsi | `src/backend/src/lib/google.ts` - `validasiKodeOtorisasi`, `buatUrlOtorisasi`, `KredensialGoogle` | `validasi(kodeOtorisasi)` diwujudkan oleh `validasiKodeOtorisasi`, yang menukar kode di endpoint token Google (Algo-027) dan membaca identitas dari `id_token`. Atribut `authCode` menjadi parameter `kodeOtorisasi`, sedangkan `accessToken` dan `refreshToken` dibawa oleh `KredensialGoogle`, lalu disimpan terenkripsi di tabel `token_google` (`src/backend/src/lib/crypto.ts` - `enkripsiAES256GCM`). `buatUrlOtorisasi` membentuk URL halaman login Google dengan *scope* identitas dan `calendar.readonly` untuk UC-03. Issue #1 dan #3. |
| C-36 | `HomeView` | Komponen layar (_route_), dua layar, komponen kartu, dan modul klien | Layar: `src/mobile/src/app/(mahasiswa)/beranda.tsx` - `BerandaMahasiswa`; `src/mobile/src/app/admin/index.tsx` - `BerandaAdministrator`. Kartu: `src/mobile/src/views/beranda/` - `KartuAfirmasi`, `KartuSesi`, `KartuStatusLayanan`, `KepalaBeranda`, `GridMenu`. Klien: `src/mobile/src/api/afirmasi.ts` - `ambilAfirmasi`; `src/mobile/src/api/konsultasi.ts` - `ambilSesiBerikutnya`; `src/mobile/src/api/status.ts` - `ambilStatus`, `ambilStatusLayanan`; `src/mobile/src/lib/muatan.ts` - `useMuatan` | Layar I-02 (tab Beranda) dan I-03 (awal _stack_ Administrator). `tampilkanBeranda(peran)` (Algo-031) terbagi menjadi dua layar: cabang Mahasiswa mengambil afirmasi melalui `GET /api/affirmation` (`AffirmationController.ambilAfirmasiHariIni`, Q-041) dan sesi berikutnya melalui `GET /api/sessions/next` (`ConsultationController.ambilSesiBerikutnya`, Q-042), dengan ajakan mengatur afirmasi atau memesan sesi bila datanya kosong. Cabang Administrator mengambil `GET /api/status/website` dan `GET /api/status/server` (`ServerStatusController.tampilkanStatusServer(jenis)`, Algo-020). `useMuatan` memuat ulang data setiap kali layar kembali tampil dan menangani keadaan memuat, galat (dengan tombol "Coba lagi"), dan kosong. Atribut `peran` diambil dari sesi (`useSesi`), dan *layout* tiap peran mengalihkan pengguna dengan peran lain ke I-01. `bukaMenu(menu)` diwujudkan oleh navigasi Expo Router (`TabBar` dan `MenuTile`). Tombol keluar I-03-02, dan tombol keluar tambahan di I-02 (B.1 no. 5), memanggil `SesiAutentikasi.logout` melalui `useSesi().keluar`. Tombol lonceng I-02-02 belum membuka layar (lihat B.1 no. 3). Issue #4. |

Catatan:

- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
