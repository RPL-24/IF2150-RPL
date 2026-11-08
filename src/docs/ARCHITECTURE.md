# Arsitektur SILEMBUR

Pola: **MVC di atas klien-server** (APL BAB 2, DPPL2 2.2). View berjalan di aplikasi mobile; Controller dan Model
berjalan di server Node.js; data di PostgreSQL; foto di Cloud Storage (atau disk lokal).

```
 HP Android/iOS (Expo)                      Server Node.js 24 (Express 5)                 Penyimpanan
┌──────────────────────────┐   HTTP/JSON   ┌───────────────────────────────────────┐   ┌───────────────┐
│ VIEW                      │ ───────────▶ │ routes/index.js                        │   │ PostgreSQL 18 │
│ src/app/** (rute)         │               │   └ middleware: Autentikasi, Validasi │   │  (8 tabel)    │
│ src/features/** (layar)   │ ◀─────────── │ CONTROLLER  controllers/*Controller.js│──▶│               │
│ src/components/map (peta) │               │ MODEL       models/<kelas>/*.js       │   └───────────────┘
│ src/api/* (klien HTTP)    │               │ ADAPTER     adapters/*                │──▶ disk lokal / GCS
└──────────────────────────┘               └───────────────────────────────────────┘    Google Geocoding
```

## Komponen DPPL → lokasi kode

| Komponen DPPL (Tabel 2.3) | Jenis | Lokasi | Pemilik |
| :--- | :--- | :--- | :--- |
| FormLaporanView | View | `mobile/src/features/pelaporan/BuatLaporanScreen.js` (I-04) | P2 |
| VerifikasiView | View | `mobile/src/features/verifikasi/DashboardAdminScreen.js` (I-05), `VerifikasiScreen.js` (I-06) | P4 |
| PrioritasView | View | `mobile/src/features/prioritas/PrioritasScreen.js` (I-08) | P5 |
| LaporanPublikView | View | `mobile/src/features/warga/BerandaScreen.js` (I-02), `DetailLaporanScreen.js` (I-03) | P3 |
| LaporanSayaView | View | `mobile/src/features/warga/LaporanSayaScreen.js`, `DetailLaporanScreen.js`, `NotifikasiScreen.js` | P3 |
| FasilitasBerulangView | View | `mobile/src/features/fasilitas/FasilitasBerulangPreview.js`, `DaftarFasilitasScreen.js` (I-09) | P5 |
| DuplikatView | View | `mobile/src/features/duplikat/DuplikatScreen.js` (I-07) | P1 |
| RiwayatFasilitasView | View | `mobile/src/features/fasilitas/DetailFasilitasScreen.js` (I-10) | P5 |
| LaporanController | Controller | `server/src/controllers/LaporanController.js` → `laporan/buat.js` (P2), `laporan/publik.js`, `laporan/saya.js` (P3) | P2, P3 |
| VerifikasiController | Controller | `server/src/controllers/VerifikasiController.js` | P4 |
| PrioritasController | Controller | `server/src/controllers/PrioritasController.js` | P5 |
| FasilitasController | Controller | `server/src/controllers/FasilitasController.js` | P5 |
| DuplikatController | Controller | `server/src/controllers/DuplikatController.js` | P1 |
| Pengguna, Laporan, Lokasi, Fasilitas, Verifikasi, SkorPrioritas, RiwayatStatus, Notifikasi, KonfirmasiDuplikat | Model | `server/src/models/index.js` (peta kelas → fungsi) + `models/<kelas>/<fitur>.js` | lihat header file |
| Autentikasi | Pendukung | `server/src/middleware/autentikasi.js`, `server/src/adapters/googleAuthAdapter.js`, `mobile/src/auth/AuthContext.js`, `mobile/src/auth/TombolMasukGoogle.js` | P1 |
| Validasi | Pendukung | `server/src/middleware/validasi.js` (zod) | P1 |
| GoogleMapsAdapter | Integrasi | `mobile/src/components/map/Peta.js` (peta), `server/src/adapters/googleMapsAdapter.js` (wilayah) | P1 |
| CloudStorageAdapter | Integrasi | `server/src/adapters/cloudStorageAdapter.js` | P1 |
| Database | Penyimpanan | `server/src/db/` (pool, migrasi, seed) | P1 |

Tambahan pendukung (bukan komponen DPPL): `AuthController`, `NotifikasiController`, `ReferensiController`.

## Alur satu permintaan (contoh UC02 verifikasi)

1. `VerifikasiScreen` memanggil `adminApi.verifikasi(id, { keputusan, catatan })` (`mobile/src/api/admin.js`).
2. `routes/index.js`: `wajibLogin` → `wajibPeran(ADMIN)` → `validasi(skemaKeputusan)` → `VerifikasiController.tetapkanKeputusan`.
3. Controller membuka `withTransaction(async (db) => ...)` dan memanggil model:
   `Verifikasi.tetapkanKeputusan` → `Laporan.ubahStatus` → `SkorPrioritas.buatSkorAwal/hitungSkor` → `Notifikasi.kirimNotifikasi`.
4. Controller membalas DTO sesuai `docs/API.md`.

## Aturan lapisan

- **View tidak pernah** menghitung aturan bisnis (skor, transisi status, anonimisasi). Semua di server
  ("agar aturan bisnis tidak bisa dilewati dari aplikasi", DPPL 2.4.2). Validasi di mobile hanya untuk UX.
- **Controller** tipis: ambil input tervalidasi → panggil model (dalam transaksi bila >1 tulis) → bentuk DTO.
- **Model** berisi SQL + logika domain. Setiap fungsi menerima `db` (pool atau client transaksi) sebagai argumen pertama.
- **Perubahan status laporan hanya lewat `Laporan.ubahStatus()`** (otomatis mencatat RiwayatStatus dan memeriksa transisi).
- **Identitas pelapor** hanya boleh keluar di endpoint `/admin/*` (KNF02).

## Mode layanan eksternal

| Layanan | Variabel | Tanpa variabel (default) |
| :--- | :--- | :--- |
| Google Cloud Storage | `STORAGE_DRIVER=gcs`, `GCS_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS` | Foto disimpan ke `server/uploads/`, dilayani di `/uploads/...` |
| Google Geocoding | `GOOGLE_MAPS_API_KEY` | Wilayah = kecamatan Bandung terdekat (`adapters/wilayahBandung.js`) |
| Google Maps (peta di HP) | `GOOGLE_MAPS_ANDROID_API_KEY` saat build APK (`mobile/app.config.js`) | Android di Expo Go: Google Maps bawaan Expo Go; iOS: Apple Maps |
| Google Sign-In | `GOOGLE_CLIENT_IDS` (server, `adapters/googleAuthAdapter.js`), `EXPO_PUBLIC_GOOGLE_*` (mobile, `auth/TombolMasukGoogle.js`) | Tombol Google nonaktif; masuk memakai akun uji |
