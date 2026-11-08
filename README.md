# LaporKota

Platform web pelaporan kerusakan infrastruktur publik (jalan berlubang, lampu jalan mati, saluran air tersumbat, trotoar rusak, rambu/marka rusak) di Kota Bandung. Tugas Besar IF2150 Rekayasa Perangkat Lunak, kelas K03 kelompok G07 "Siulan".

| Aktor | Perangkat | Fitur |
|---|---|---|
| Warga | mobile | I-01 Lapor kerusakan, I-02 Status laporan + peta publik + dukungan |
| Tim Administrasi | desktop | I-03 Validasi laporan, I-04 Evaluasi hasil kerja |
| Eksekutor Lapangan | mobile | I-05 Daftar tugas, I-06 Lapor hasil perbaikan |

- Deploy: [TODO]
- Anggota tim: [TODO]
- Rancangan: [`docs/M8/K03_G07_DPPL2.md`](docs/M8/K03_G07_DPPL2.md) (DPPL), [`docs/M3/K03_G07_UC.md`](docs/M3/K03_G07_UC.md) (use case). Beda implementasi vs DPPL: [`docs/implementasi/perubahan-dppl.md`](docs/implementasi/perubahan-dppl.md).
- Aturan kerja tim & agent AI: [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 16 (App Router, TypeScript strict), React 19, Tailwind CSS 4, Supabase (Auth, PostgreSQL 17, Storage, Realtime), Leaflet + react-leaflet (tile OpenStreetMap), Cloudflare Turnstile, Vitest. Deploy ke Vercel. Package manager **npm**, Node.js ≥ 20.9.

## Struktur folder (Client–Server)

```
src/
  app/                 # routing: page.tsx tipis → render View
  client/
    views/             # kelas boundary DPPL C11–C16 (LaporPage, StatusLaporanPage, ...)
    components/shared/ # MapView, StatusBadge, DetailLaporan, MediaUploader, LoncengNotifikasi, ...
    components/<fitur>/
  server/
    controllers/       # kelas controller DPPL C17–C23 (Server Actions)
    entities/          # kelas entity DPPL C01–C10 (query Supabase + logika domain)
  lib/                 # client Supabase, auth, konstanta, helper (error-db, format, media)
  types/database.ts    # hasil `supabase gen types`
supabase/migrations/   # skema, RLS, trigger, RPC, bucket
scripts/seed.ts        # akun uji + data contoh
```

## Setup lokal

```bash
npm install
cp .env.example .env.local   # isi URL + publishable key Supabase, key Turnstile
npm run dev                  # http://localhost:3000
```

Variabel di `.env.local` dijelaskan di [`.env.example`](.env.example). `SUPABASE_SECRET_KEY` hanya untuk `npm run seed`, jangan dipakai di kode aplikasi.

## Akun uji (seed)

Semua akun memakai password **`LaporKota2026!`**.

| Email | Peran |
|---|---|
| `warga1@laporkota.test` | Warga |
| `warga2@laporkota.test` | Warga |
| `admin@laporkota.test` | Tim Administrasi |
| `eksekutor@laporkota.test` | Eksekutor Lapangan |

Isi ulang data uji: `npm run seed` (butuh `SUPABASE_SECRET_KEY`, dijalankan pemilik Fondasi).

## Supabase CLI (v3)

Target default CLI v3 adalah database lokal; tambahkan `--remote` untuk project yang sudah di-link.

```bash
npx supabase db push --remote                                             # terapkan migration ke project
npx supabase gen types --remote --schema public > src/types/database.ts   # perbarui tipe TypeScript
```

Hanya pemilik Fondasi yang mengubah `supabase/migrations/` dan `src/types/database.ts`.

## Testing

```bash
npm run lint
npm run typecheck   # next typegen && tsc --noEmit
npm run test        # Vitest: fungsi murni entity & lib (*.test.ts di sebelah file)
npm run build
```

Uji manual setiap skenario use case memakai akun seed di atas.

## Alur status laporan

Dijaga trigger database (perubahan lain ditolak):

```
kirim laporan            → Diterima
Diterima   --tolak-->      Ditolak (alasan wajib)
Diterima   --validasi-->   Dikerjakan · menunggu eksekusi
Dikerjakan --hasil-->      Dikerjakan · menunggu evaluasi
           --evaluasi "selesai"-->                         Berhasil
           --evaluasi "belum selesai"/"minta ulang bukti"--> Dikerjakan · menunggu eksekusi
```

Setiap perubahan status otomatis tercatat di riwayat (linimasa) dan mengirim notifikasi in-app ke pelapor; hasil evaluasi juga dikirim ke eksekutor.
