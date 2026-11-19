# Draf Bahan Laporan Implementasi (Bagian Fondasi)

Bahan untuk `docs/M9/K03_G07_Implementasi.md` (template asli: `docs/M9/KXX_GYY_Implementasi.md` di repo [RPL-24/IF2150-RPL](https://github.com/RPL-24/IF2150-RPL)), khusus bagian Fondasi (F, Rafi). Format tabel mengikuti template. Tanda **[PERIKSA]** = klaim yang perlu dicek manusia; angka profiling diambil dari hasil `docs/implementasi/profiling/benchmark-cari-duplikat.sql` di Supabase SQL Editor (PostgreSQL 17, 10 November 2026), lihat [`profiling/README.md`](profiling/README.md).

---

## B.1 Perubahan dari DPPL

Rincian lengkap per baris ada di [`perubahan-dppl.md`](perubahan-dppl.md) (baris PIC F: no. 1–20). Ringkasan + keputusan yang belum tercatat di sana:

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C03 Lokasi | Tidak ada cek batas wilayah | Operasi baru `Lokasi.dalamWilayah()` (ray casting pada polygon batas Kota Bandung dari OpenStreetMap) | Validasi "Lokasi di luar daerah penanganan" (I01-13) |
| 2 | Controller C17–C23 | Tidak ada masuk/daftar/keluar | `AuthController` (`masuk`, `daftar`, `keluar`) dengan Supabase Auth email + password; akun baru selalu `warga` | Sistem harus membedakan tiga aktor |
| 3 | C02, C06, C10, C17–C23 (notifikasi, riwayat, prioritas) | Controller memanggil `kirimNotifikasi()`, mencatat riwayat, menghitung prioritas | Trigger DB: `cek_transisi_status` (state machine), `catat_perubahan_status`, `tambah_upvote`, `terima_hasil_perbaikan`, `terapkan_evaluasi`; pesan ditambah ID tiket | Atomik dan tidak bisa dilewati walau Server Action dipanggil langsung |
| 4 | C02 `simpanLaporan()`, C08 `simpanBukti()` | Insert laporan lalu foto/video satu per satu dari aplikasi | RPC `kirim_laporan` dan `kirim_hasil_perbaikan` (satu transaksi, `SECURITY INVOKER`) | Supabase JS tidak punya transaksi lintas request; tidak ada laporan tanpa bukti |
| 5 | C04 Foto / C05 Video (`url`) | URL disimpan di tabel | Bucket Storage `media` **public**, tabel menyimpan `path`, URL dibentuk `urlMedia(path)`; upload hanya ke folder milik sendiri; policy RESTRICTIVE path | URL langsung bisa dipakai di `<img>`/`<video>` dan peta publik tanpa signed URL kedaluwarsa. Trade-off: siapa pun yang tahu path (UUID acak) bisa membuka berkas |
| 6 | C10 Notifikasi / C23, SKPL KNF13 | KNF13: notifikasi **email** ≤ 2 menit; DPPL: `realtime.broadcast` per user | Notifikasi **in-app** saja: tabel `notifikasi` di publication `supabase_realtime`, client subscribe `postgres_changes` (tersaring RLS), lonceng di header untuk warga dan eksekutor | Batasan SKPL poin 8 sudah menyatakan notifikasi hanya di aplikasi [PERIKSA: pastikan KNF13 dicatat sebagai tidak diimplementasi/berubah]; channel per user bisa didengar siapa saja, postgres_changes tidak |
| 7 | KF20, C22 Q-002 (peta publik) | Data publik dibaca langsung | View `laporan_publik` **tanpa** `security_invoker` (berjalan sebagai pemilik), tanpa `id_pelapor`/`alasan_penolakan`, hanya status ≠ ditolak; hanya `SELECT` untuk anon/authenticated | Anon bisa membaca peta tanpa membuka RLS tabel `laporan`. Peringatan Advisors "Security Definer View" **disengaja** |
| 8 | KF20 (peta publik real-time) | Tidak dirinci | Peta publik memuat ulang data secara berkala (refetch), bukan Realtime | Realtime `postgres_changes` tidak berjalan pada view [PERIKSA: implementasi refetch berkala belum ditemukan di `src/`, pastikan dengan pemilik UC06] |
| 9 | Helper RLS | Tidak dirinci | Fungsi helper `peran_saya()`, `laporan_terbuka()`, `boleh_dukung()`, `dari_service_role()` di schema `public` (security definer, `search_path = ''`, `EXECUTE` dicabut dari role yang tidak perlu) | Dipakai di policy tanpa rekursi RLS; schema `public` dipilih agar sederhana, risikonya ditutup dengan revoke execute [PERIKSA] |
| 10 | Autentikasi | Tidak dirinci | Opsi **Confirm email** Supabase Auth dimatikan | Akun uji dan pendaftaran warga bisa langsung dipakai tanpa server email [PERIKSA: pengaturan di dashboard] |
| 11 | Data uji | Tidak dirinci | Akun uji (4 peran) dan password-nya ditulis di README | Asisten bisa mencoba setiap peran tanpa akun pribadi (ketentuan A.2 no. 3); semua data seed fiktif |
| 12 | C01 User, C07 ListTugas, C02 operasi baca, komponen Bab 6 | Lihat `perubahan-dppl.md` no. 12–20 | Entity berupa kumpulan fungsi, query bersama di `Laporan.ts`, komponen shared (`MapView`, `StatusBadge`, `DetailLaporan`, `MediaUploader`, `LoncengNotifikasi`), `pesanErrorDb` | Dipakai lebih dari satu fitur; aturan lapisan AGENTS.md |

## B.2 Bukti Penerapan Best Practices (bagian Fondasi)

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Least privilege (grant per kolom) | `supabase/migrations/20261103161117_skema_awal.sql`, `20261107155512_trigger_status.sql` bagian A | INSERT `laporan` hanya kolom form (`id_pelapor, kategori, deskripsi, latitude, longitude`); UPDATE `laporan` hanya `status, tahap, alasan_penolakan`; UPDATE `notifikasi` hanya `status_baca`. Kolom counter/waktu diurus trigger |
| Least privilege (fungsi) | `20261107155512_trigger_status.sql` | `REVOKE EXECUTE` pada fungsi trigger dan helper dari `public`/`anon`/`authenticated` yang tidak memerlukannya. Supabase Advisors (security): peringatan untuk fungsi buatan tim turun dari 10 menjadi 5 [PERIKSA: angka dan sisa peringatan] |
| RLS efisien | Semua policy di `20261103161117_skema_awal.sql` | `(select auth.uid())` dan `(select public.peran_saya())` dibungkus subquery sehingga dievaluasi sekali per query (initPlan), bukan per baris |
| Policy RESTRICTIVE path media | `20261107162818_storage_media.sql` | Baris `foto`/`video` hanya boleh menunjuk berkas di folder `{laporan\|hasil}/{auth.uid()}/` dengan ekstensi sesuai kolom `format`, walau RPC dipanggil langsung |
| State machine di DB | Trigger `cek_transisi_status` | Transisi status di luar alur UC ditolak database; alasan penolakan wajib saat ditolak dan tidak bisa diubah sesudahnya |
| Operasi atomik | RPC `kirim_laporan`, `kirim_hasil_perbaikan` | Laporan/hasil + media dalam satu transaksi |
| Role tidak dipercaya dari client | `handle_new_user()` | Profil baru selalu `warga`; hanya `nama` yang diambil dari metadata pendaftaran, `role` di metadata diabaikan |
| Verifikasi identitas di server | `src/lib/auth.ts`, `src/lib/supabase/proxy.ts` | `getClaims()` (JWT diverifikasi), bukan `getSession()`, untuk keputusan akses; setiap Server Action memanggil `verifikasiAkses()` |
| Cegah open redirect | `src/lib/navigasi.ts` `nextAman()` + `navigasi.test.ts` | Parameter `?next=` hanya menerima path internal; `//`, `/\`, karakter kontrol, dan versi ter-encode ditolak |
| Pesan error aman | `src/lib/error-db.ts` `pesanErrorDb()` + test | Error DB diubah menjadi pesan Indonesia tanpa detail tabel/constraint |
| Unit test fungsi murni | `Lokasi.test.ts`, `Foto.test.ts`, `Video.test.ts`, `Laporan.test.ts`, `src/lib/*.test.ts` | Vitest, `npm run test` [PERIKSA: tautan hasil CI] |
| Profiling | `docs/implementasi/profiling/` | Lihat B.2.1 |

### B.2.1 Profiling dan Optimasi

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | RPC `cari_laporan_duplikat` (cek laporan duplikat ≤ 20 m saat warga mengirim laporan, KF05/UC01) |
| Alat | `EXPLAIN (ANALYZE, BUFFERS)` di Supabase SQL Editor, skrip [`benchmark-cari-duplikat.sql`](profiling/benchmark-cari-duplikat.sql): 10.000 laporan dummy, 3 titik uji, 50 pengulangan, median dan p95 *Execution Time*; seluruh skrip di-rollback |
| Temuan (sebelum) | Tanpa index koordinat, query membaca semua laporan aktif (Index Scan `laporan_status_tahap_idx`, **bukan** Seq Scan: index itu hanya menyaring status) dan membuang 5.141–5.144 baris per panggilan (586 buffer). Median naif 1,648–1,680 ms, RPC tanpa index 1,707–1,738 ms |
| Perbaikan | Migration `20261110140216_index_cari_duplikat.sql`: partial index `laporan (kategori, latitude, longitude) where status in ('diterima','dikerjakan')`. Bounding box ±0.0003° sebelum haversine sudah ada di RPC, kini bisa memakai index |
| Hasil (sesudah) | Index Scan `laporan_cari_duplikat_idx`, baris dibuang 0–1 (3 buffer), median 0,333–0,350 ms (±5× lebih cepat dari naif; query di dalam RPC 1,680 → 0,062 ms, ±27×). Hasil `id_tiket` sama dengan query naif di semua titik uji (YA di ketiga titik) |

Tabel lengkap dan penjelasan: [`profiling/README.md`](profiling/README.md).

## B.3 Kendala dan Catatan Penting (bagian Fondasi)

1. **Supabase JS tidak punya transaksi lintas request.** Insert laporan lalu media dari aplikasi bisa meninggalkan laporan tanpa bukti jika salah satu gagal. Solusi: RPC Postgres per operasi (`kirim_laporan`, `kirim_hasil_perbaikan`).
2. **Berkas yatim di Storage.** Media diunggah dari browser sebelum RPC dipanggil; jika RPC gagal (mis. validasi lokasi), berkas tetap ada di bucket tanpa baris `foto`/`video`. Belum ada pembersihan otomatis (*known issue*) [PERIKSA].
3. **MIME `.mkv` kosong di browser.** `File.type` sering kosong untuk MKV, sehingga validasi format memakai ekstensi berkas; bucket tetap membatasi `allowed_mime_types` [PERIKSA: perilaku upload MKV dengan MIME kosong ke bucket].
4. **Payload Realtime tanpa `id_tiket`.** Event `postgres_changes` hanya membawa kolom tabel `notifikasi`, jadi lonceng memuat ulang daftar lewat `NotifikasiController.ambilNotifikasi()` setiap ada event, bukan memakai payload.
5. **Leaflet tidak bisa SSR** (butuh `window`). `MapView` dibungkus `next/dynamic` dengan `ssr: false`.
6. **Deploy Vercel.** Collaborator repo tidak bisa meng-import repo milik akun lain ke Vercel, sehingga deploy memakai Vercel CLI [PERIKSA: alur deploy dan siapa yang menjalankan].
7. **Supabase CLI v3 mengubah perintah.** Target default menjadi database lokal; perintah ke project harus memakai `--remote` (mis. `npx supabase db push --remote`, `npx supabase gen types --remote`).
8. **Supabase Advisors "Multiple Permissive Policies" (6 tabel) belum diselesaikan.** Beberapa policy SELECT per peran pada tabel yang sama dievaluasi semuanya; secara fungsi benar, tetapi bisa digabung menjadi satu policy per aksi untuk performa [PERIKSA: daftar 6 tabel].
9. **Catatan untuk asisten:** akun uji ada di README (password sama untuk semua peran); data uji diisi ulang dengan `npm run seed` (butuh secret key, dijalankan Fondasi); aplikasi deploy di https://laporkota.vercel.app.
