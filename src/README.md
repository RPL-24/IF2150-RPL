# LaporKota

Platform web pelaporan kerusakan infrastruktur publik (jalan berlubang, lampu jalan mati, saluran air tersumbat, trotoar rusak, rambu/marka rusak) di Kota Bandung. Warga melapor dengan foto/video dan titik lokasi, Tim Administrasi memvalidasi laporan dan mengevaluasi hasil kerja, Eksekutor Lapangan mengerjakan perbaikan dan mengunggah bukti. Tugas Besar IF2150 Rekayasa Perangkat Lunak, kelas K03 kelompok G07 "Siulan".

| Aktor | Perangkat | Halaman |
|---|---|---|
| Warga | mobile | I-01 Lapor kerusakan, I-02 Status laporan + peta publik + dukungan |
| Tim Administrasi | desktop | I-03 Validasi laporan, I-04 Evaluasi hasil kerja |
| Eksekutor Lapangan | mobile | I-05 Daftar tugas, I-06 Lapor hasil perbaikan |

- **Production:** https://laporkota.vercel.app (aplikasi tetap bisa dijalankan lokal, lihat bagian 4–6).
- Laporan implementasi: [`docs/M9/K03_G07_Implementasi.md`](../docs/M9/K03_G07_Implementasi.md).
- Bukti profiling performa: [`docs/implementasi/profiling/`](../docs/implementasi/profiling/).
- Rancangan: [`docs/M8/K03_G07_DPPL2.md`](../docs/M8/K03_G07_DPPL2.md) (DPPL), [`docs/M3/K03_G07_UC.md`](../docs/M3/K03_G07_UC.md) (use case). Beda implementasi vs DPPL: [`docs/implementasi/perubahan-dppl.md`](../docs/implementasi/perubahan-dppl.md).

## 1. Anggota tim dan pembagian modul

| NIM | Nama | GitHub | Peran / UC | Modul / fitur | Lokasi kode utama |
|---|---|---|---|---|---|
| 13525051 | Rafi Pradipta Andira Sulistyo | [@rafipradiptaas](https://github.com/rafipradiptaas) | F – Fondasi | Skema basis data, RLS, trigger status/riwayat/notifikasi/prioritas, RPC, Storage, autentikasi (masuk/daftar), komponen bersama, notifikasi real-time, seed, CI, deploy, profiling | `supabase/`, `scripts/`, `src/lib/`, `src/app/(auth)/`, `src/client/components/shared/`, `src/server/entities/{User,Laporan,Lokasi,Foto,Video,Upvote,Notifikasi}.ts`, `AuthController.ts`, `NotifikasiController.ts` |
| 13525015 | Muhammad Atallah Ramadhan | [@atarmdhnn](https://github.com/atarmdhnn) | A – UC01 Mengirim Laporan | Formulir lapor I-01, GPS / pilih titik di peta, validasi wilayah dan berkas, cek duplikat ≤ 20 m | `src/app/(warga)/lapor/`, `src/client/views/LaporPage.tsx`, `src/client/components/lapor/`, `LaporanController.ts`, `laporan-validasi.ts` |
| 13525075 | Bagas Anugrah Putra | [@bagasapt-spec](https://github.com/bagasapt-spec) | B – UC02 Memvalidasi Laporan, UC05 Mengevaluasi Hasil | Antrean validasi I-03 (setujui/tolak), evaluasi hasil kerja I-04 | `src/app/(admin)/`, `src/client/views/{ValidasiPage,EvaluasiPage}.tsx`, `src/client/components/{validasi,evaluasi}/`, `ValidasiController.ts`, `EvaluasiController.ts`, `entities/Evaluasi.ts` |
| 13525105 | Pasaribu Fritz T.A.M. | [@fritziez](https://github.com/fritziez) | C – UC03 Melihat Penugasan, UC04 Melaporkan Hasil | Daftar tugas I-05 (urut skor prioritas, filter kategori, rincian + Google Maps), formulir hasil perbaikan I-06 | `src/app/(eksekutor)/`, `src/client/views/{PenugasanPage,HasilPerbaikanForm}.tsx`, `src/client/components/penugasan/`, `PenugasanController.ts`, `PerbaikanController.ts`, `entities/{ListTugas,HasilPerbaikan}.ts` |
| 13525099 | Gede Pranajayanta Suputra | [@soepoetra](https://github.com/soepoetra) | D – UC06 Memantau Status Laporan | Riwayat laporan + linimasa status, peta publik, dukungan (upvote), bukti hasil perbaikan | `src/app/(warga)/status/`, `src/client/views/StatusLaporanPage.tsx`, `src/client/components/status/`, `StatusController.ts` |

## 2. Teknologi

| Bagian | Teknologi | Versi |
|---|---|---|
| Runtime | Node.js, npm | Node ≥ 20.9 (CI memakai Node 22) |
| Bahasa | TypeScript (strict) | 5 |
| Framework | Next.js (App Router, Server Actions), React | 16.4.4, 19.3.0 |
| Tampilan | Tailwind CSS | 4 |
| Basis data & backend | Supabase: PostgreSQL, Auth, Storage, Realtime (`@supabase/supabase-js`, `@supabase/ssr`) | PostgreSQL 17, supabase-js 2.118, ssr 0.12 |
| Peta | Leaflet + react-leaflet, tile OpenStreetMap | 1.9.4, 5 |
| Test | Vitest | 5.1 |
| CLI basis data | Supabase CLI (devDependency, dipanggil lewat `npx supabase`) | 3 |
| Deploy | Vercel | - |

Versi pasti seluruh dependensi tercatat di `package.json` dan `package-lock.json` di root repository.

## 3. Struktur folder

Pola arsitektur Client–Server sesuai DPPL:

```
.github/workflows/ci.yml     # CI: lint, typecheck, test
docs/                        # dokumen milestone M1–M9, log AI, logbook, docs/implementasi/
public/                      # aset statis
scripts/seed.ts              # akun uji + data contoh (npm run seed)
supabase/migrations/         # skema, RLS, trigger, RPC, bucket Storage, index
src/
  app/                       # ROUTING: page.tsx tipis → cek akses → render View
    (auth)/login, (auth)/daftar
    (warga)/lapor, (warga)/status
    (admin)/validasi, (admin)/evaluasi
    (eksekutor)/tugas, (eksekutor)/tugas/[idTiket]/hasil
  client/                    # CLIENT
    views/                   # kelas boundary DPPL C11–C16 (LaporPage, ValidasiPage, PenugasanPage,
                             #   HasilPerbaikanForm, EvaluasiPage, StatusLaporanPage)
    components/              # shared/ (dipakai >1 fitur) + lapor/ validasi/ evaluasi/ penugasan/ status/
  server/                    # SERVER
    controllers/             # kelas controller DPPL C17–C23 (Server Actions) + AuthController
    entities/                # kelas entity DPPL C01–C10 (query Supabase + logika domain)
  lib/                       # client Supabase (supabase/), auth, konstanta, helper, validasi
  types/database.ts          # tipe hasil `supabase gen types`
  proxy.ts                   # refresh sesi + redirect per route group
```

Unit test (`*.test.ts`) diletakkan di sebelah file yang diuji.

## 4. Prasyarat

- Node.js ≥ 20.9 dan npm.
- Git.
- Project Supabase: project kelompok (URL + publishable key diberikan ke asisten) **atau** project Supabase sendiri (bagian 5b).

## 5. Instalasi dan konfigurasi

Semua perintah dijalankan dari **root repository** (folder yang berisi `package.json`):

```bash
git clone https://github.com/bagasapt-spec/IF2150-RPL-K03-G07.git
cd IF2150-RPL-K03-G07
npm ci
cp .env.example .env.local
```

Isi `.env.local` (daftar variabel sama dengan [`.env.example`](../.env.example)):

| Variabel | Isi | Dipakai oleh |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase | aplikasi |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key (aman untuk browser) | aplikasi |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | **wajib**: key Cloudflare Turnstile untuk anti-bot form lapor. Verifikasi di server gagal-tertutup, jadi tanpa kedua key ini semua laporan ditolak. Untuk lokal pakai key uji Cloudflare (di bawah) | form lapor |
| `SUPABASE_SECRET_KEY` | secret key Supabase | **hanya** `npm run seed`; tidak dipakai kode aplikasi |

Key uji Cloudflare Turnstile untuk pengembangan lokal (selalu lolos verifikasi):

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Untuk penggunaan sebenarnya, ganti dengan site key dan secret key asli dari dashboard Cloudflare Turnstile.

### 5a. Memakai project Supabase kelompok

Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dengan nilai dari kelompok. Skema, data, dan akun uji sudah tersedia; lanjut ke bagian 6.

### 5b. Memakai project Supabase sendiri

1. Buat project baru di <https://supabase.com/dashboard>.
2. Terapkan seluruh migration:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-project>
   npx supabase db push --remote
   ```
3. Di Dashboard → Authentication → Sign In / Providers → Email, matikan **Confirm email** (aplikasi tidak mengirim email).
4. Isi keempat variabel Supabase di `.env.local` dari Dashboard → Project Settings → API Keys.
5. Isi akun uji dan data contoh: `npm run seed`.

### Daftar migration (`supabase/migrations/`)

| File | Isi |
|---|---|
| [`20261103161117_skema_awal.sql`](../supabase/migrations/20261103161117_skema_awal.sql) | Enum, tabel, index, view `laporan_publik`, fungsi bantu, RLS |
| [`20261107155512_trigger_status.sql`](../supabase/migrations/20261107155512_trigger_status.sql) | Trigger transisi status, riwayat, notifikasi, upvote/prioritas, RPC `cari_laporan_duplikat` |
| [`20261107162818_storage_media.sql`](../supabase/migrations/20261107162818_storage_media.sql) | Bucket `media`, policy unggah, RPC `kirim_laporan` / `kirim_hasil_perbaikan`, Realtime notifikasi |
| [`20261110140216_index_cari_duplikat.sql`](../supabase/migrations/20261110140216_index_cari_duplikat.sql) | Partial index untuk RPC `cari_laporan_duplikat` (hasil profiling) |

## 6. Menjalankan aplikasi

```bash
npm run dev        # http://localhost:3000
```

Build produksi: `npm run build` lalu `npm run start`.

### Lint, typecheck, test, build

```bash
npm run lint       # ESLint
npm run typecheck  # next typegen && tsc --noEmit
npm run test       # unit test Vitest
npm run build      # build produksi Next.js
```

CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) menjalankan lint, typecheck, dan test pada setiap pull request ke `dev`/`main` dan setiap push ke `dev`.

## 7. Akun uji

Semua akun memakai password **`LaporKota2026!`** (data fiktif dari `scripts/seed.ts`).

| Email | Peran | Halaman awal |
|---|---|---|
| `warga1@laporkota.test` | Warga | `/lapor`, `/status` |
| `warga2@laporkota.test` | Warga | `/lapor`, `/status` |
| `admin@laporkota.test` | Tim Administrasi | `/validasi`, `/evaluasi` |
| `eksekutor@laporkota.test` | Eksekutor Lapangan | `/tugas` |

Tab Peta di `/status` bisa dibuka tanpa login. Pendaftaran lewat `/daftar` selalu membuat akun Warga. Data uji dikembalikan ke kondisi awal dengan `npm run seed` (butuh `SUPABASE_SECRET_KEY`).

## 8. Tabel basis data

Skema lengkap (tipe, constraint, RLS, trigger) ada di migration di atas.

| Tabel | Atribut | Kelas DPPL |
|---|---|---|
| `profiles` | `id` (= `auth.users.id`), `nama`, `role` (`warga`/`admin`/`eksekutor`), `created_at` | C01 User |
| `laporan` | `id`, `id_tiket` (`LK-0001`, unik), `id_pelapor` → `profiles`, `kategori`, `deskripsi`, `latitude`, `longitude`, `status` (`diterima`/`ditolak`/`dikerjakan`/`berhasil`), `tahap` (`menunggu_eksekusi`/`menunggu_evaluasi`), `jumlah_upvote`, `skor_prioritas`, `alasan_penolakan`, `waktu_masuk`, `waktu_selesai` | C02 Laporan, C03 Lokasi |
| `foto` | `id`, `id_laporan` **atau** `id_hasil` (tepat satu terisi), `path` (di bucket `media`), `format`, `ukuran`, `created_at` | C04 Foto |
| `video` | sama seperti `foto` | C05 Video |
| `upvote` | `id_upvote`, `id_laporan`, `id_user`, `waktu_upvote`; unik per (`id_laporan`, `id_user`) | C06 Upvote |
| `hasil_perbaikan` | `id_hasil`, `id_laporan`, `id_eksekutor`, `catatan`, `waktu_unggah` | C08 HasilPerbaikan |
| `evaluasi` | `id_evaluasi`, `id_laporan`, `id_hasil`, `id_admin`, `keputusan` (`selesai`/`belum_selesai`/`minta_ulang_bukti`), `catatan`, `waktu_evaluasi` | C09 Evaluasi |
| `notifikasi` | `id_notifikasi`, `id_user`, `id_laporan`, `isi_pesan`, `waktu_kirim`, `status_baca` | C10 Notifikasi |
| `riwayat_status` | `id`, `id_laporan`, `status`, `tahap`, `catatan`, `waktu` | linimasa status dan log audit |
| view `laporan_publik` | kolom `laporan` **tanpa** `id_pelapor` dan `alasan_penolakan`, hanya status ≠ `ditolak` | peta publik tanpa login |

`ListTugas` (C07) tidak punya tabel; dibentuk dari `laporan` berstatus `dikerjakan` dengan tahap `menunggu_eksekusi`.

### Alur status laporan

Dijaga trigger basis data (transisi lain ditolak):

```
kirim laporan            → Diterima
Diterima   --tolak-->      Ditolak (alasan wajib)
Diterima   --validasi-->   Dikerjakan · menunggu eksekusi
Dikerjakan --hasil-->      Dikerjakan · menunggu evaluasi
           --evaluasi "selesai"-->                           Berhasil
           --evaluasi "belum selesai"/"minta ulang bukti"--> Dikerjakan · menunggu eksekusi
```

Setiap perubahan status otomatis tercatat di `riwayat_status` dan mengirim notifikasi in-app ke pelapor; hasil evaluasi juga dikirim ke eksekutor.
