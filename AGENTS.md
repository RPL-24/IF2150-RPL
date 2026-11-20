# AGENTS.md — LaporKota (IF2150 K03 G07 "Siulan")

Instruksi untuk AI coding agent (Claude Code, Cursor, Copilot, Codex, dll.) **dan** untuk manusia yang ngoding di repo ini. Baca seluruh file ini sebelum mengubah kode apa pun.

> **Sumber kebenaran:** skema database = file di `supabase/migrations/` + `src/types/database.ts`. Kalau isi file ini berbeda dengan migration, **migration yang benar** dan file ini perlu diperbarui (lapor ke pemilik Fondasi).

---

## 1. Ringkasan proyek

LaporKota adalah platform web pelaporan kerusakan infrastruktur publik dalam satu kota. Tiga aktor:

| Aktor | Role di DB | Perangkat | Halaman |
|---|---|---|---|
| Warga | `warga` | mobile | I-01 Lapor, I-02 Status |
| Tim Administrasi | `admin` | desktop | I-03 Validasi, I-04 Evaluasi |
| Eksekutor Lapangan | `eksekutor` | mobile | I-05 Daftar Tugas, I-06 Hasil Perbaikan |

Rancangan lengkap ada di `docs/M8/K03_G07_DPPL2.md` (kelas C01–C23, sequence diagram, mockup Bab 6) dan `docs/M3/K03_G07_UC.md` (skenario UC01–UC06). **Implementasi harus bisa ditelusuri ke kelas-kelas DPPL** (dinilai di laporan B.5).

## 2. Stack & versi

- Next.js 16 (App Router, folder `src/`, TypeScript strict), React 19
- Tailwind CSS
- Supabase: Auth, PostgreSQL 17, Storage, Realtime — via `@supabase/supabase-js` + `@supabase/ssr`
- Peta: Leaflet + `react-leaflet`, tile OpenStreetMap
- Anti-bot: Cloudflare Turnstile (hanya di form lapor, KNF04; **bukan** captcha Supabase Auth)
- Unit test: Vitest
- Deploy: Vercel. Package manager: **npm** (jangan campur dengan pnpm/yarn).
- Node.js ≥ 20.9 (CI memakai Node 22).

Next.js 16 memakai **`src/proxy.ts`** (bukan `middleware.ts`) dengan fungsi bernama `proxy`.

**Cache Components dimatikan** (proyek dibuat dengan `--no-cache-components`). Jangan menyalakan `cacheComponents` di `next.config.ts`.

## 3. Arsitektur: Client–Server (harus terlihat di struktur folder)

```
src/
  app/                         # ROUTING saja. page.tsx tipis: cek akses lalu render View.
    (auth)/login/page.tsx
    (auth)/daftar/page.tsx
    (warga)/lapor/page.tsx                 -> <LaporPage />
    (warga)/status/page.tsx                -> <StatusLaporanPage />
    (admin)/validasi/page.tsx              -> <ValidasiPage />
    (admin)/evaluasi/page.tsx              -> <EvaluasiPage />
    (eksekutor)/tugas/page.tsx             -> <PenugasanPage />
    (eksekutor)/tugas/[idTiket]/hasil/page.tsx -> <HasilPerbaikanForm />
  client/                      # CLIENT = kelas boundary DPPL (C11–C16)
    views/                     # satu file per kelas boundary
      LaporPage.tsx  StatusLaporanPage.tsx  ValidasiPage.tsx
      EvaluasiPage.tsx  PenugasanPage.tsx  HasilPerbaikanForm.tsx
    components/
      shared/                  # dipakai >1 fitur (milik Fondasi)
      lapor/ status/ validasi/ evaluasi/ penugasan/   # komponen kecil per fitur
  server/                      # SERVER
    controllers/               # kelas controller DPPL (C17–C23) = Server Actions ('use server')
      LaporanController.ts  StatusController.ts  ValidasiController.ts
      EvaluasiController.ts PenugasanController.ts PerbaikanController.ts
      NotifikasiController.ts
    entities/                  # kelas entity DPPL (C01–C10) = akses data + logika domain
      User.ts Laporan.ts Lokasi.ts Foto.ts Video.ts Upvote.ts
      ListTugas.ts HasilPerbaikan.ts Evaluasi.ts Notifikasi.ts
  lib/
    supabase/client.ts         # createBrowserClient
    supabase/server.ts         # createServerClient (cookies)
    supabase/proxy.ts          # updateSession untuk src/proxy.ts
    auth.ts                    # getCurrentUser(), requireRole(), requireRoleOrRedirect()
    constants.ts               # KATEGORI, STATUS_LABEL, STATUS_WARNA(_PETA), BATAS_WILAYAH, MAX_FILE_SIZE, dll.
    action-result.ts           # tipe ActionResult<T>, ok(), gagal()
    error-db.ts                # pesanErrorDb(error) → pesan Indonesia
    format.ts                  # formatTanggal(), formatWaktu() (zona Asia/Jakarta)
    media.ts                   # unggahMedia() → upload browser ke bucket media
  types/database.ts            # HASIL GENERATE, jangan diedit manual
  proxy.ts
supabase/
  migrations/                  # milik Fondasi
scripts/seed.ts                # seed akun uji + data (npm run seed, pakai secret key)
docs/implementasi/perubahan-dppl.md   # catatan beda implementasi vs DPPL (untuk laporan B.1)
```

Aturan lapisan:
- **View** (`src/client/views`) hanya menampilkan data dan memanggil controller. View **tidak** memanggil Supabase untuk menulis data. Pengecualian yang diizinkan: upload berkas ke Storage lewat `MediaUploader`, dan subscribe Realtime lewat hook notifikasi.
- **Controller** (`src/server/controllers`) diawali `'use server'`, memverifikasi akses, memvalidasi input, lalu memanggil entity. Controller **tidak** menulis SQL/query builder panjang; itu tugas entity.
- **Entity** (`src/server/entities`) berisi query ke Supabase dan logika domain. Fungsi murni (tanpa DB) seperti `Lokasi.hitungJarak`, `Foto.isFotoValid`, `Video.isVideoValid` **tidak boleh** mengimpor `lib/supabase/server`, supaya bisa dipakai juga di client untuk validasi awal.
- Entity boleh berupa kumpulan fungsi (bukan class). Nama fungsi **mengikuti nama operasi di DPPL** (`simpanLaporan`, `hitungPrioritas`, `getByStatus`, ...).
- Operasi DB di entity menerima `supabase: SupabaseClient<Database>` sebagai parameter pertama (entity tidak mengimpor `lib/supabase/*`). Controller membuat client dengan `await createClient()` dari `lib/supabase/server`.
- Error dari Supabase diubah jadi pesan siap tampil dengan `pesanErrorDb(error)` (`lib/error-db.ts`): `return gagal(pesanErrorDb(error))`.

### 3.1 Yang sudah disediakan Fondasi (pakai, jangan buat ulang)

| Lokasi | Isi |
|---|---|
| `entities/Laporan.ts` | `simpanLaporan(sb, data)` (RPC `kirim_laporan`), `getByStatus(sb, status, tahap?)`, `getMilikSaya(sb, idPelapor)`, `getRincian(sb, idTiket)` (+ `pelapor`, `foto`, `video`, `riwayat`), `getDaftarPublik(sb)`, `getRincianPublik(sb, idTiket)` (+ `foto`, `video`); fungsi murni `urutPrioritas(daftar)`, `filterKategori(daftar, kategori \| null)` |
| `entities/Upvote.ts` | `catatUpvote(sb, idLaporan, idUser)`, `getJumlahUpvote(sb, idLaporan)`, `sudahUpvote(sb, idLaporan, idUser)` |
| `entities/Notifikasi.ts` | `getMilikSaya(sb, idUser, limit?)`, `jumlahBelumDibaca(sb, idUser)`, `tandaiDibaca(sb, idNotifikasi)` |
| `entities/User.ts` | `muatProfil(sb, idUser)` (dipakai `getCurrentUser()`) |
| `entities/Lokasi.ts` | `dalamWilayah(titik)`, `hitungJarak(a, b)`, `getKoordinat(lokasi)` → `[lat, lng]` |
| `entities/Foto.ts`, `Video.ts` | `isFotoValid(berkas)`, `isVideoValid(berkas)`, `formatDariNama(nama)`, `urlMedia(path)`, tipe `MediaTerunggah` |
| `controllers/NotifikasiController.ts` | `ambilNotifikasi()`, `updateStatusBaca(idNotifikasi)` |
| `components/shared/MapView.tsx` | `<MapView markers? onPilihMarker? idTerpilih? onPilihTitik? titikTerpilih? tinggi? />` |
| `components/shared/StatusBadge.tsx` | `<StatusBadge status tahap? />` |
| `components/shared/DetailLaporan.tsx` | `<DetailLaporan laporan riwayat?>{tombol aksi}</DetailLaporan>` |
| `components/shared/MediaUploader.tsx` | `<MediaUploader tipe label value onChange maks? invalid? disabled? />` |
| `components/shared/LoncengNotifikasi.tsx` + `useNotifikasi.ts` | lonceng notifikasi di header root layout (sudah terpasang) |

Contoh pola controller:

```ts
"use server";
import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { getByStatus, urutPrioritas } from "@/server/entities/Laporan";

async function verifikasiAkses() {
  return requireRole("eksekutor");
}

export async function doSorting() {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;
  const { data, error } = await getByStatus(await createClient(), "dikerjakan", "menunggu_eksekusi");
  if (error) return gagal(pesanErrorDb(error));
  return ok(urutPrioritas(data));
}
```

## 4. Kepemilikan folder

Hanya ubah file milikmu. Butuh perubahan di file orang lain? Tulis di PR/issue dan minta pemiliknya.

| Peran | UC | File/folder milik |
|---|---|---|
| **F – Fondasi** (Dipta) | infra, notifikasi | `supabase/**`, `scripts/**`, `.github/**`, `package.json`, `src/lib/**`, `src/types/**`, `src/proxy.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/(auth)/**`, `src/client/components/shared/**`, `src/server/entities/{User,Laporan,Lokasi,Foto,Video,Upvote,Notifikasi}.ts`, `src/server/controllers/NotifikasiController.ts` |
| **A – Lapor** | UC01 | `src/app/(warga)/lapor/**`, `views/LaporPage.tsx`, `components/lapor/**`, `controllers/LaporanController.ts` |
| **B – Admin** | UC02, UC05 | `src/app/(admin)/**`, `views/ValidasiPage.tsx`, `views/EvaluasiPage.tsx`, `components/validasi/**`, `components/evaluasi/**`, `controllers/ValidasiController.ts`, `controllers/EvaluasiController.ts`, `entities/Evaluasi.ts` |
| **C – Eksekutor** | UC03, UC04 | `src/app/(eksekutor)/**`, `views/PenugasanPage.tsx`, `views/HasilPerbaikanForm.tsx`, `components/penugasan/**`, `controllers/PenugasanController.ts`, `controllers/PerbaikanController.ts`, `entities/ListTugas.ts`, `entities/HasilPerbaikan.ts` |
| **D – Status** | UC06 | `src/app/(warga)/status/**`, `views/StatusLaporanPage.tsx`, `components/status/**`, `controllers/StatusController.ts` |

`entities/Laporan.ts` dipakai semua orang. Fondasi menyediakan operasi DPPL-nya. Kalau butuh query tambahan, **tambahkan fungsi baru di bagian bawah file** lewat PR kecil, jangan mengubah fungsi yang sudah ada.

## 5. Model data (final, sesuai migration)

Enum (nilai di DB huruf kecil; label tampilan ada di `lib/constants.ts`):

```
peran_user        : 'warga' | 'admin' | 'eksekutor'
status_laporan    : 'diterima' | 'ditolak' | 'dikerjakan' | 'berhasil'
tahap_penanganan  : 'menunggu_eksekusi' | 'menunggu_evaluasi'      -- hanya terisi saat status = 'dikerjakan'
kategori_kerusakan: 'jalan_berlubang' | 'lampu_jalan_mati' | 'saluran_air_tersumbat' | 'trotoar_rusak' | 'rambu_marka_rusak'
keputusan_evaluasi: 'selesai' | 'belum_selesai' | 'minta_ulang_bukti'
```

Tabel (semua `id` bertipe `uuid default gen_random_uuid()` kecuali disebut lain):

| Tabel | Kolom penting | Kelas DPPL |
|---|---|---|
| `profiles` | `id` (= `auth.users.id`), `nama`, `role peran_user default 'warga'` | C01 User |
| `laporan` | `id`, `id_tiket text unique` (format `LK-0001`, dari sequence), `id_pelapor → profiles`, `kategori`, `deskripsi`, `latitude float8`, `longitude float8`, `status default 'diterima'`, `tahap`, `jumlah_upvote int default 0`, `skor_prioritas numeric default 0`, `alasan_penolakan`, `waktu_masuk timestamptz default now()`, `waktu_selesai` | C02 Laporan, C03 Lokasi |
| `foto` | `id`, `id_laporan` **atau** `id_hasil` (tepat satu terisi), `path`, `format`, `ukuran` | C04 Foto |
| `video` | sama seperti `foto` | C05 Video |
| `upvote` | `id_upvote`, `id_laporan`, `id_user`, `waktu_upvote`; `unique(id_laporan, id_user)` | C06 Upvote |
| `hasil_perbaikan` | `id_hasil`, `id_laporan`, `id_eksekutor`, `catatan`, `waktu_unggah` | C08 HasilPerbaikan |
| `evaluasi` | `id_evaluasi`, `id_laporan`, `id_hasil`, `id_admin`, `keputusan`, `catatan`, `waktu_evaluasi` | C09 Evaluasi |
| `notifikasi` | `id_notifikasi`, `id_user`, `id_laporan`, `isi_pesan`, `waktu_kirim`, `status_baca bool default false` | C10 Notifikasi |
| `riwayat_status` | `id`, `id_laporan`, `status`, `tahap`, `catatan`, `waktu` | (linimasa I02-08 & log audit KF17) |
| view `laporan_publik` | kolom `laporan` **tanpa** `id_pelapor` dan `alasan_penolakan`, hanya status ≠ `ditolak` | getRincianPublik (KF20, anonim) |

`ListTugas` (C07) tidak punya tabel; ia dibentuk dari `laporan` berstatus `dikerjakan` + tahap `menunggu_eksekusi`.

### 5.1 Alur status (state machine) — dijaga oleh trigger di DB

```
(insert)                                   -> diterima
diterima   --ValidasiController.tolak-->      ditolak            (alasan_penolakan WAJIB)
diterima   --ValidasiController.setujui-->    dikerjakan / menunggu_eksekusi
dikerjakan/menunggu_eksekusi --insert hasil_perbaikan--> dikerjakan / menunggu_evaluasi
dikerjakan/menunggu_evaluasi --insert evaluasi 'selesai'-->            berhasil (+ waktu_selesai)
dikerjakan/menunggu_evaluasi --insert evaluasi 'belum_selesai'/'minta_ulang_bukti'--> dikerjakan / menunggu_eksekusi
```

Transisi lain ditolak oleh trigger `cek_transisi_status`. Jangan mengakali dengan update langsung.

### 5.2 Logika lintas fitur yang SUDAH ditangani DB (jangan dibuat ulang di kode)

| Kejadian | Efek otomatis (trigger/fungsi milik Fondasi) |
|---|---|
| insert `laporan`, atau `laporan.status`/`tahap` berubah | insert `riwayat_status` + insert `notifikasi` ke pelapor (KF07, KF17, KF19) |
| insert `upvote` | `jumlah_upvote += 1`, hitung ulang `skor_prioritas` (KF13) |
| insert `hasil_perbaikan` | `laporan.tahap = 'menunggu_evaluasi'` |
| insert `evaluasi` | terapkan keputusan ke `laporan` (lihat 5.1) + `notifikasi` ke eksekutor untuk **semua** keputusan, beserta catatan evaluasi |
| RPC `cari_laporan_duplikat(p_lat, p_lng, p_kategori)` | kembalikan `{id_tiket, status, jarak_m}` laporan aktif (`diterima`/`dikerjakan`) berkategori sama dalam radius ≤ 20 m (KF05) |
| RPC `kirim_laporan(p_kategori, p_deskripsi, p_latitude, p_longitude, p_media)` | insert `laporan` + `foto`/`video` dalam satu transaksi → `{id, id_tiket}`. Minimal 1 media. Dipanggil lewat `Laporan.simpanLaporan()` |
| RPC `kirim_hasil_perbaikan(p_id_laporan, p_catatan, p_media)` | insert `hasil_perbaikan` + `foto`/`video` dalam satu transaksi → `id_hasil`. Minimal 1 foto, catatan wajib |

Skor prioritas (0–100, ditampilkan di I05-05): `LEAST(100, jumlah_upvote * 10)` (trigger `tambah_upvote`); seri diurutkan `waktu_masuk` paling lama dulu (`Laporan.urutPrioritas`).

Semua RPC `SECURITY INVOKER` (RLS + grant kolom tetap berlaku). Pesan `raise exception` (kode `P0001`) sudah berbahasa Indonesia; `pesanErrorDb` meneruskannya apa adanya.

Grant kolom (UPDATE dari client):
- `laporan`: hanya `status`, `tahap`, `alasan_penolakan` (dan hanya admin, lewat RLS). Kolom lain (`jumlah_upvote`, `skor_prioritas`, `waktu_selesai`, ...) diurus trigger.
- `notifikasi`: hanya `status_baca`, milik sendiri.
- `laporan` INSERT: hanya `id_pelapor, kategori, deskripsi, latitude, longitude` (sisanya default). Pakai RPC `kirim_laporan`, bukan insert langsung.

## 6. Auth & akses

- Supabase Auth email + password. Profil dibuat otomatis oleh trigger saat user daftar (role default `warga`). Akun admin/eksekutor dibuat lewat seed.
- Di server, identitas diambil dengan `supabase.auth.getClaims()` (lewat helper `getCurrentUser()` / `requireRole()` di `lib/auth.ts`). **Jangan pernah memakai `getSession()` di kode server untuk keputusan akses.**
- Setiap controller punya `verifikasiAkses()` (sesuai DPPL) yang memanggil `requireRole(...)`.
- `src/proxy.ts` hanya me-refresh sesi dan redirect kasar per route group. Pengaman sebenarnya adalah **RLS** + `verifikasiAkses()`.
- Guard di `layout.tsx` route group hanya untuk UX (layout tidak dirender ulang di setiap navigasi). Server Action bisa dipanggil langsung tanpa membuka halaman, jadi **setiap** action tetap wajib `verifikasiAkses()`.
- Tab Peta (I-02) dan view `laporan_publik` boleh dibaca tanpa login (UC06: "maupun sebagai publik"). Memberi dukungan, membuat laporan, dan semua halaman lain wajib login.
- Satu akun hanya bisa memberi satu dukungan per laporan (`unique(id_laporan, id_user)`); pelapor tidak bisa mendukung laporannya sendiri.
- Secret key Supabase **tidak boleh** dipakai di kode aplikasi atau diekspos ke client. Hanya untuk script seed.

## 7. Media (foto/video)

- Selalu pakai `<MediaUploader>` dari `components/shared`. Jangan membuat uploader sendiri.
- Aturan: foto JPG/PNG, video MP4/MOV/MKV, masing-masing ≤ 10 MB (`MAX_FILE_SIZE` di `lib/constants.ts`). Validasi di client (UX) **dan** di bucket (`allowed_mime_types`, `file_size_limit`).
- Alur saat submit (bukan saat dipilih):
  1. View memanggil `unggahMedia(files, "laporan" | "hasil", userId)` dari `lib/media.ts` → upload **langsung dari browser** ke bucket `media`, path `{laporan|hasil}/{user_id}/{uuid}.{ext}` → `MediaTerunggah[]` (`{path, format, ukuran, tipe}`).
  2. View memanggil Server Action (`LaporanController.kirimLaporan` / `PerbaikanController`) dengan array itu.
  3. Controller meneruskan ke RPC `kirim_laporan` (lewat `Laporan.simpanLaporan`) / `kirim_hasil_perbaikan` (lewat entity `HasilPerbaikan`).
- **Jangan** insert ke tabel `foto`/`video` langsung, dan jangan kirim isi file lewat Server Action (batas ukuran request Vercel). Bucket public: tampilkan berkas dengan `urlMedia(path)`.
- Preview pakai `URL.createObjectURL(file)`.

## 8. Peta & lokasi

- Selalu pakai `<MapView>` dari `components/shared` (sudah dibungkus `next/dynamic` dengan `ssr: false`). Jangan mengimpor `react-leaflet` langsung di View.
- Batas kota = `BATAS_WILAYAH` di `lib/constants.ts`. Cek dengan `Lokasi.dalamWilayah()`, di client (UX) **dan** di `LaporanController.validasiLokasi()` (server).
- Jarak memakai `Lokasi.hitungJarak()` (haversine, meter). Cek duplikat di server memakai RPC `cari_laporan_duplikat`.
- Navigasi eksekutor: link `https://www.google.com/maps/search/?api=1&query={lat},{lng}`.

## 9. Konvensi kode

- TypeScript strict, **tanpa `any`**. Tipe baris DB dari `src/types/database.ts` (`Tables<'laporan'>`, `Enums<'status_laporan'>`).
- Semua Server Action mengembalikan `ActionResult<T>` = `{ ok: true; data: T } | { ok: false; error: string }` (pakai helper `ok()` / `gagal()` dari `lib/action-result.ts`). Pesan `error` berbahasa Indonesia dan siap ditampilkan ke user. Jangan melempar error mentah ke View.
- Istilah domain berbahasa Indonesia, mengikuti DPPL (`laporan`, `idTiket`, `kirimLaporan`, `setujuiLaporan`). Istilah teknis umum tetap Inggris (`props`, `state`, `handler`).
- Teks UI mengikuti tabel spesifikasi objek di DPPL Bab 6 (mis. tombol "Kirim Laporan", alert "Lokasi di luar daerah penanganan. Pilih titik di dalam batas kota.").
- RLS tidak melempar error saat baris tidak boleh diubah; hasilnya cuma 0 baris. Setiap `update`/`delete` di entity harus memakai `.select(...)` lalu cek jumlah baris yang kembali, baru anggap berhasil.
- Komponen client diberi `'use client'` hanya jika perlu (state, event, browser API).
- Jangan menambah dependency baru tanpa disebut di deskripsi PR.

## 10. Larangan untuk agent

1. **Jangan** membuat/mengubah file di `supabase/migrations/` atau mengubah skema. Butuh kolom/tabel baru → berhenti, jelaskan kebutuhannya, minta pemilik Fondasi.
2. **Jangan** mengedit `src/types/database.ts` manual (hasil `supabase gen types`).
3. **Jangan** mengubah file di luar kepemilikan peran yang sedang dikerjakan (lihat bagian 4).
4. **Jangan** membuat ulang komponen yang sudah ada di `components/shared` (uploader, peta, badge status, detail laporan).
5. **Jangan** menulis logika notifikasi, riwayat status, atau hitung prioritas di kode aplikasi (sudah di DB, bagian 5.2).
6. **Jangan** commit `.env*` (kecuali `.env.example`), `node_modules/`, `.next/`.
7. **Jangan** mengarang nama tabel/kolom. Kalau tidak yakin, baca `src/types/database.ts`.
8. Kalau implementasi harus berbeda dari DPPL, **tulis** di `docs/implementasi/perubahan-dppl.md` (apa yang berubah + alasan).
9. **Jangan** commit atau membuat PR kecuali diminta. Konvensi tim: commit tanpa trailer `Co-Authored-By` AI; pemakaian AI dicatat di `docs/K03_G07_AI-Usage.md` (Milestone 9).

## 11. Git & alur kerja

- Branch: `main` (rilis), `dev` (integrasi, default branch), `feat/<scope>-<deskripsi>`, `fix/<scope>-<deskripsi>`, `refactor/...`. Branch dibuat dari `dev` (`git checkout -b feat/x origin/dev`), PR ke `dev`.
- Repo ini fork. PR harus ke `bagasapt-spec/IF2150-RPL-K03-G07` branch `dev`, **bukan** ke repo upstream: jalankan sekali `gh repo set-default bagasapt-spec/IF2150-RPL-K03-G07`, lalu `gh pr create --base dev`.
- Commit semantik: `<tipe>(<scope>): <deskripsi>`. Tipe: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Scope: `lapor`, `status`, `validasi`, `evaluasi`, `penugasan`, `perbaikan`, `notifikasi`, `auth`, `db`, `shared`.
  Contoh: `feat(lapor): tambah cek duplikat radius 20 m`
- Satu PR = satu fitur/perbaikan yang bisa direview. Deskripsi PR memuat `Closes #<issue>` dan checklist uji manual.
- **Pembuat PR tidak boleh me-merge PR-nya sendiri.** Yang approve dan merge adalah **reviewer PIC** area tersebut (otomatis diminta lewat `.github/CODEOWNERS`):

  | Area (penulis) | Reviewer PIC (approve + merge) | Cadangan |
  |---|---|---|
  | Fondasi (F) | D | B |
  | UC01 Lapor (A) | D | F |
  | UC02+UC05 Admin (B) | C | F |
  | UC03+UC04 Eksekutor (C) | B | F |
  | UC06 Status (D) | A | F |
  | `docs/` | F | siapa pun |

  Cadangan dipakai kalau PIC tidak merespons dalam ±12 jam. Merge memakai **"Create a merge commit"** (jangan squash), supaya commit semantik tetap terlihat di riwayat.
- Sebelum push: `npm run lint && npm run typecheck && npm run test`.

## 12. Testing

- Unit test (Vitest) untuk fungsi murni entity: `hitungJarak`, `dalamWilayah`, `isFotoValid`, `isVideoValid`, `urutPrioritas`, `filterKategori`, `validasiForm`, dll. Taruh di sebelah file (`Lokasi.test.ts`). Contoh: `src/lib/action-result.test.ts`.
- Uji manual setiap skenario normal & alternatif UC milikmu, pakai akun seed.

## 13. Perintah

```bash
npm install
cp .env.example .env.local      # isi URL & publishable key Supabase, key Turnstile
npm run dev                     # http://localhost:3000
npm run lint
npm run typecheck               # next typegen && tsc --noEmit
npm run test                    # vitest run
npm run seed                    # isi ulang data uji (butuh SUPABASE_SECRET_KEY, Fondasi)
# Supabase CLI v3 (Fondasi). Default target = lokal; --remote = project yang di-link.
npx supabase db push --remote                                              # terapkan migration
npx supabase gen types --remote --schema public > src/types/database.ts    # generate tipe
```

Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, dan `SUPABASE_SECRET_KEY` (khusus script seed, jangan dipakai di kode aplikasi).

Akun seed (password sama, lihat README): `warga1@laporkota.test`, `warga2@laporkota.test`, `admin@laporkota.test`, `eksekutor@laporkota.test`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
