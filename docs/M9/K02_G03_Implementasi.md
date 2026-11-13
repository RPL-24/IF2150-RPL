<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## *SILEMBUR*
### *LOGO*
<p align="center">
<img alt="Logo SILEMBUR" src="./assets/logo.jpeg" width="40%">
</p>

### Untuk: *Amanda Aurellia Salsabila*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K02* |
| Kelompok | *G03* |

| NIM | Nama |
|---|---|
| *13525059* | *Muhammad Pandu Pulunggana* |
| *13525128* | *Mochamad Fachri Alfaridzi* |
| *13525101* | *Kevin Lincoln Hutabarat* |
| *13525035* | *Muhammad Dhiya Rafi* |
| *13525098* | *Satya Radhityan Yahya* |
---

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

---

**Deadline:** Jumat, 13 November 2026, 21.00 WIB
**Asistensi akbar:** Senin, 2 November 2026, 19.00 WIB, Microsoft Teams

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
| 1 | *[mis. Kelas C05, layar I-03, tabel `orders`]* | *[Yang direncanakan]* | *[Yang dibuat]* | *[Alasan perubahan]* |
| *...* | *...* | *...* | *...* | *...* |

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
| 13525128 | Mochamad Fachri Alfaridzi | P1: Fondasi proyek, autentikasi (email + kata sandi dan Google Sign-In), integrasi eksternal (adapter Google Maps, Cloud Storage), penggabungan laporan duplikat (UC07), CI. | *[%]* |
| 13525059 | Muhammad Pandu Pulunggana | P2: Pembuatan dan revisi laporan (UC01). Validasi isian, penyimpanan laporan, pencocokan fasilitas radius 30 m, lokasi laporan, endpoint `POST /api/laporan` dan `PUT /api/laporan/:id/revisi`, layar I-04, serta pengujiannya. | *[%]* |
| 13525098 | Satya Radhityan Yahya | P3: Tampilan warga, yaitu laporan publik, laporan saya, notifikasi, dan UI kit (UC04, UC05). | *[%]* |
| 13525101 | Kevin Lincoln Hutabarat | P4: Verifikasi admin, skor prioritas, dan pengiriman notifikasi (UC02). | *[%]* |
| 13525035 | Muhammad Dhiya Rafi | P5: Dashboard pemerintah daerah, yaitu prioritas laporan, fasilitas rusak berulang, riwayat fasilitas (UC03, UC06, UC08), serta profiling Q-004. | *[%]* |

## B.5 Traceability Kelas Perancangan ke Implementasi

Seluruh model server dikumpulkan di `src/server/src/models/index.js` dengan nama sesuai kelas DPPL (`Pengguna`, `Laporan`, `Lokasi`, `Fasilitas`, `Verifikasi`, `SkorPrioritas`, `RiwayatStatus`, `Notifikasi`, `KonfirmasiDuplikat`). Setiap objek tersebut menggabungkan fungsi dari beberapa file.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | Pelapor | Tabel, fungsi model, komponen | Tabel `pengguna` (peran `PELAPOR`). `src/server/src/models/laporan/buat.js` - `konfirmasiSimpanLaporan()`. `src/server/src/models/laporan/saya.js` - `getDaftarLaporanSaya()`, `getDetailLaporanSaya()`. `src/server/src/models/notifikasi/inbox.js` - `getNotifikasiPelapor()`. `src/mobile/src/features/warga/` - `DetailLaporanScreen`, `LaporanSayaScreen`, `NotifikasiScreen` | Pelapor, Admin, dan PemerintahDaerah disimpan di satu tabel `pengguna` yang dibedakan oleh kolom `peran`. Atribut `jumlahLaporan` menjadi kolom `jumlah_laporan`. `konfirmasiSimpanLaporan()` = Algo-001. `bukaLaporan()` dan `bukaRiwayatLaporan()` diwujudkan oleh detail laporan saya beserta riwayat statusnya. `terimaNotifikasi()` diwujudkan oleh kotak masuk notifikasi. |
| C02 | Admin | Tabel, fungsi model, route, komponen | Tabel `pengguna` (peran `ADMIN`). `src/server/src/models/laporan/verifikasi.js` - `getLaporanAdmin()`. `src/server/src/models/verifikasi/verifikasi.js` - `tetapkanKeputusan()`. `src/server/src/models/fasilitas/berulang.js` - `getFasilitasBerulang()`. `src/server/src/controllers/VerifikasiController.js`. `src/mobile/src/features/verifikasi/DashboardAdminScreen.js`, `src/mobile/src/features/duplikat/DuplikatScreen.js` | `lihatDaftarLaporan()` = `GET /api/admin/laporan`. `tetapkanKeputusan()` = `POST /api/admin/laporan/:id/keputusan`. `konfirmasiGabungLaporan()` diwujudkan oleh dialog konfirmasi di `DuplikatScreen`. `lihatFasilitasRusakBerulang()` = `GET /api/fasilitas/berulang`. |
| C03 | PemerintahDaerah | Tabel, fungsi model, route, komponen | Tabel `pengguna` (peran `PEMDA`, kolom `nama_instansi`, `wilayah_kerja`). `src/server/src/models/laporan/prioritas.js` - `getLaporanTerverifikasi()`, `getLaporanPrioritas()`. `src/server/src/controllers/PrioritasController.js` - `GET /api/prioritas`. `src/mobile/src/features/prioritas/PrioritasScreen.js` | `lihatLaporanTerverifikasi()` = `GET /api/prioritas`. `pilihFilter(kategori, wilayah)` diwujudkan oleh parameter query dan pilihan filter di layar. `lihatFasilitasRusakBerulang()` memakai endpoint yang sama dengan Admin. |
| C04 | Laporan | Tabel, fungsi model, route, komponen | Tabel `laporan`. `src/server/src/models/laporan/` - `buat.js` (`validasiIsianFormulir()`, `simpanLaporan()`, `revisiLaporan()`), `status.js` (`ubahStatus()`), `verifikasi.js` (`getLaporanAdmin()`, `getDetailLaporanAdmin()`), `publik.js`, `saya.js`, `prioritas.js` (`getLaporanTerverifikasi()`). `src/server/src/controllers/laporan/`. `src/mobile/src/features/pelaporan/BuatLaporanScreen.js` | `buatLaporanBaru()`, `tampilkanFormulir()`, dan `bukaKunciSimpan()` diwujudkan oleh `BuatLaporanScreen` (*state* `lengkap` mengatur tombol Kirim). `validasiIsianFormulir()` = Algo-004. `simpanLaporan()` = Q-001. `getLaporanMenungguVerifikasi()` = `getLaporanAdmin()`. `getDetailLaporan()` = detail admin, publik, dan saya. `updateStatus()` = `ubahStatus()` (Q-002). `urutkanBerdasarkanPrioritas()` dan `filterLaporan()` ada di SQL Q-004 (lihat B.1 no. 14). `pilihDuplikat()` = `getKandidatDuplikat()`. `getRiwayatStatus()` memakai model RiwayatStatus. |
| C05 | Lokasi | Tabel, fungsi model | Tabel `lokasi`. `src/server/src/models/lokasi/lokasi.js` - `setLokasiLaporan()`, `getWilayah()` | `setLokasiLaporan(koordinat)` = Algo-006 dan Q-005. Wilayah diambil dari `googleMapsAdapter.getWilayahFromCoordinates()`. Di mobile, lokasi dipilih melalui GPS (`expo-location`) atau pin peta (`PetaPilih`). |
| C06 | Fasilitas | Tabel, fungsi model, route, komponen | Tabel `fasilitas`. `src/server/src/models/fasilitas/` - `cocokkan.js` (`cariAtauBuatFasilitas()`), `berulang.js` (`getJumlahLaporan()`, `getFasilitasBerulang()`), `riwayat.js` (`cariFasilitas()`, `getDetailFasilitas()`). `src/server/src/models/laporan/prioritas.js` - `getLaporanPerFasilitas()`. `src/server/src/controllers/FasilitasController.js`. `src/mobile/src/features/fasilitas/` - `DaftarFasilitasScreen`, `DetailFasilitasScreen` | `getLaporan()` = `getLaporanPerFasilitas()`. `cariFasilitas(keyword)` = `GET /api/fasilitas`. `getDetailFasilitas()` = `GET /api/fasilitas/:id`. `getJumlahLaporan()` memperbarui `jumlah_kerusakan_berulang` dan `kandidat_evaluasi`. `cariAtauBuatFasilitas()` adalah operasi tambahan (B.1 no. 1). |
| C07 | Verifikasi | Tabel, fungsi model | Tabel `verifikasi`. `src/server/src/models/verifikasi/verifikasi.js` - `simpanVerifikasi()`, `teruskanKePemerintah()`, `tetapkanKeputusan()` | `simpanVerifikasi()` = Algo-002 dan Q-003. `teruskanKePemerintah()` mengubah status menjadi Terverifikasi. `tahanLaporan()` tidak memerlukan query, karena laporan yang tidak disetujui otomatis tertahan oleh statusnya. |
| C08 | SkorPrioritas | Tabel, fungsi model | Tabel `skor_prioritas`. `src/server/src/models/skorPrioritas/skor.js` - `hitungSkor()`, `getSkor()`, `hitungNilaiSkor()`, `getKomponenSkor()` | `hitungSkor()` = Algo-009, dihitung dari jumlah pelapor, lama menunggu, dan frekuensi berulang. Skor dihitung ulang jika berumur lebih dari 1 jam (KF17). |
| C09 | RiwayatStatus | Tabel, fungsi model | Tabel `riwayat_status`. `src/server/src/models/riwayatStatus/riwayat.js` - `getRiwayatStatus()`, `getPerubahan()`. `src/server/src/models/laporan/status.js` - `catatRiwayat()` | Setiap perubahan status lewat `ubahStatus()` otomatis tercatat sebagai riwayat. Ditampilkan di detail laporan saya dan detail fasilitas. |
| C10 | Notifikasi | Tabel, fungsi model, route, komponen | Tabel `notifikasi`. `src/server/src/models/notifikasi/kirim.js` - `kirimNotifikasi()`. `src/server/src/models/notifikasi/inbox.js` - `getNotifikasiPelapor()`, `tandaiDibaca()`. `src/server/src/controllers/NotifikasiController.js`. `src/mobile/src/features/warga/NotifikasiScreen.js` | `kirimNotifikasi()` dipanggil saat keputusan verifikasi dan perubahan status. Kotak masuk pelapor = `GET /api/notifikasi` dan `PATCH /api/notifikasi/:id/dibaca`. |
| C11 | KonfirmasiDuplikat | Fungsi model, route, komponen | `src/server/src/models/konfirmasiDuplikat/duplikat.js` - `getKandidatDuplikat()`, `gabungLaporan()`. `src/server/src/controllers/DuplikatController.js`. `src/mobile/src/features/duplikat/DuplikatScreen.js` | `simpanKandidat()` dan `warning()` diwujudkan di mobile (*state* pilihan dan dialog konfirmasi). `gabungLaporan()` = Algo-012 (`POST /api/admin/duplikat/gabung`). Atribut `daftarKandidat` dan `namaFasilitasInduk` diwujudkan sebagai *state* layar dan kolom `id_laporan_induk` pada tabel `laporan`. |


Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
