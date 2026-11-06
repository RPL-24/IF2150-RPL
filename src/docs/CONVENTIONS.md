# Konvensi Kerja Tim

## Jadwal (deadline M9: Rabu, 11 Nov 2026 21.50 WIB)

| Hari | Target |
| :--- | :--- |
| Sab 7 Nov | Starter di-merge ke `main`. Semua anggota: clone, jalankan, login 3 peran berhasil. Buat issue dari file tugas masing-masing. |
| Min 8 Nov | Endpoint backend milikmu lengkap + test inti hijau. Layar menampilkan data seed. PR pertama dibuka. |
| Sen 9 Nov | Fitur lengkap (normal + skenario alternatif). Semua PR fitur sudah di-review. |
| Sel 10 Nov | **Feature freeze 20.00.** Uji lintas peran (lihat "Uji E2E" di bawah), profiling (P5), perbaikan bug. |
| Rab 11 Nov | README & laporan M9 (B.1–B.5) lengkap. **Tag `v9.0` paling lambat 20.00** (buffer sebelum 21.50). |

## Git

- `main` selalu bisa dijalankan. Kerja di branch `feat/p<n>-<fitur>`, mis. `feat/p2-buat-laporan`, `fix/p5-filter-wilayah`.
- Sebelum push: `git pull --rebase origin main`, lalu `npm test` di `src/`.
- Commit memakai Conventional Commits: `feat(laporan): simpan foto dan lokasi`, `fix(prioritas): urutan skor`, `test(skor): kasus bobot kategori`, `docs(api): ...`.
  Scope yang dipakai: `auth`, `laporan`, `warga`, `verifikasi`, `skor`, `duplikat`, `prioritas`, `fasilitas`, `notifikasi`, `db`, `ui`, `docs`.
- **Jangan** menambahkan baris `Co-Authored-By` dari alat AI atau menyebut nama alat AI di commit/PR/kode. Penggunaan AI dicatat di `docs/K02_G03_AI-Usage.md` sesuai aturan kuliah.
- Jangan commit `.env`, kunci API, `node_modules/`, `server/uploads/`.

## Pull Request

- Satu PR = satu fitur/issue, ditautkan `Closes #<nomor>`.
- Deskripsi: apa yang dikerjakan, KF/UC yang dipenuhi, cara menguji, tangkapan layar layar HP.
- Minimal 1 reviewer, rotasi: **P1 → P2 → P3 → P4 → P5 → P1** (P1 me-review PR P2, P2 me-review PR P3, dst.; PR P5 di-review P1).
- Reviewer memeriksa: kontrak `docs/API.md` dipatuhi, tidak menyentuh file milik orang lain, ada test, tidak ada identitas pelapor bocor.
- Merge memakai **Squash and merge**.

## Kepemilikan file (anti-bentrok)

1. Satu file = satu pemilik (tertulis di header file dan di `AGENTS.md`).
2. File bersama sudah diisi starter: `routes/index.js`, `models/index.js`, `src/app/**`, `shared/constants.js`,
   `001_init.sql`, `components/ui`, `theme`. Butuh perubahan? Buka PR kecil terpisah dan tag pemiliknya.
3. Migrasi baru: `server/src/db/migrations/<nomor>_<deskripsi>.sql` dengan rentang nomor P1 `1xx`, P2 `2xx`, P3 `3xx`, P4 `4xx`, P5 `5xx`. Jangan pernah mengubah migrasi yang sudah di-merge.
4. Butuh fungsi model milik orang lain yang belum ada? Pakai stub/kontraknya, tulis TODO, kabari pemiliknya di grup. Jangan menyalin SQL-nya ke file milikmu.

## Gaya kode

- JavaScript ESM (`import`/`export`), 2 spasi, kutip tunggal, titik koma.
- Penamaan Bahasa Indonesia mengikuti DPPL: nama fungsi = nama operasi kelas (`hitungSkor`, `gabungLaporan`, `getJumlahLaporan`).
- SQL memakai parameter `$1, $2` (tidak boleh menyambung string input pengguna).
- Mobile: warna/jarak dari `theme/tokens.js`, komponen dari `components/ui`.
- Pesan untuk pengguna dalam Bahasa Indonesia; pakai `PESAN` di `shared/constants.js` untuk pesan yang ada di skenario SKPL.

## Uji E2E manual (Selasa)

1. `warga1` membuat laporan (foto + GPS) → muncul di Laporan Saya berstatus Menunggu Verifikasi.
2. `admin` melihatnya di Dashboard → Minta Revisi dengan catatan → `warga1` menerima notifikasi → merevisi.
3. `admin` Setujui → skor terhitung → `warga1` menerima notifikasi.
4. `pemda` melihat laporan di Prioritas (urut skor) → filter kategori & wilayah → ubah ke Diproses lalu Selesai.
5. `warga1` melihat riwayat lengkap di detail laporan; `warga2` melihat laporan yang sama tanpa nama pelapor.
6. `admin` menggabungkan 2 laporan PJU Jl. Cihampelas → skor induk bertambah.
7. `pemda`/`admin` membuka fasilitas Jl. Merdeka dari pratinjau kerusakan berulang → riwayat per fasilitas tampil.
8. Matikan server lalu buka daftar laporan → muncul "Tolong muat ulang halaman" dalam ±5 detik.
