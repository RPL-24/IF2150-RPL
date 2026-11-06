# Basis Data SILEMBUR (PostgreSQL 18)

Skema dibuat oleh `server/src/db/migrations/001_init.sql`. Sumber: atribut kelas DPPL2 BAB 4–5 dan query Q-001..Q-013,
ditambah kolom relasi yang tidak ada di DPPL (gap G1, lihat [KEPUTUSAN.md](KEPUTUSAN.md)).

## ERD

```mermaid
erDiagram
  pengguna ||--o{ laporan : "membuat (pelapor)"
  fasilitas ||--o{ laporan : "memiliki"
  laporan ||--|| lokasi : "berada di"
  laporan ||--o| skor_prioritas : "memiliki"
  laporan ||--o{ riwayat_status : "mencatat"
  laporan ||--o{ verifikasi : "diverifikasi"
  pengguna ||--o{ verifikasi : "memutuskan (admin)"
  laporan ||--o{ notifikasi : "memicu"
  pengguna ||--o{ notifikasi : "menerima (pelapor)"
  laporan |o--o{ laporan : "induk dari (digabung)"
  pengguna |o--o{ riwayat_status : "mengubah"

  pengguna {
    int id_pengguna PK
    text email UK
    text nama
    text password_hash "NULL bila hanya Google"
    text google_sub UK
    text peran "PELAPOR | ADMIN | PEMDA"
    text nama_instansi "PEMDA"
    text wilayah_kerja "PEMDA"
    int jumlah_laporan "PELAPOR"
    timestamptz dibuat_pada
  }
  fasilitas {
    int id_fasilitas PK
    text nama_fasilitas
    text kategori
    text lokasi_fasilitas
    numeric latitude
    numeric longitude
    text wilayah
    int jumlah_kerusakan_berulang
    bool kandidat_evaluasi
    timestamptz dibuat_pada
  }
  laporan {
    int id_laporan PK
    int id_pelapor FK
    int id_fasilitas FK
    int id_laporan_induk FK "self, bila Digabung"
    text foto_laporan
    text deskripsi_laporan "maks 300"
    text kategori_kerusakan
    timestamptz tanggal_laporan
    text status_laporan
    timestamptz diperbarui_pada
  }
  lokasi {
    int id_laporan PK, FK
    text koordinat "lat,lng"
    numeric latitude
    numeric longitude
    text wilayah "kecamatan"
    text alamat
    text sumber "GPS | MANUAL"
  }
  skor_prioritas {
    int id_laporan PK, FK
    int jumlah_pelapor
    int lama_menunggu "hari"
    int frekuensi_berulang
    int skor
    timestamptz dihitung_pada
  }
  verifikasi {
    int id_verifikasi PK
    int id_laporan FK
    int id_admin FK
    text keputusan "Disetujui | Ditolak | Revisi"
    text catatan_alasan
    timestamptz waktu_verifikasi
  }
  riwayat_status {
    int id_riwayat PK
    int id_laporan FK
    int id_pengguna FK "NULL = sistem"
    text status_lama
    text status_baru
    text deskripsi_perubahan
    timestamptz tanggal_perubahan
  }
  notifikasi {
    int id_notifikasi PK
    int id_laporan FK
    int id_pelapor FK
    text isi_pesan
    bool dibaca
    timestamptz waktu_kirim
  }
```

## Pemetaan kelas DPPL → tabel

| Kelas DPPL | Tabel | Catatan |
| :--- | :--- | :--- |
| C01 Pelapor, C02 Admin, C03 PemerintahDaerah | `pengguna` | Satu tabel + kolom `peran` (model "Pengguna" pada DPPL 2.3). `idPelapor/idAdmin/idPemerintah` = `id_pengguna`. |
| C04 Laporan | `laporan` | + FK `id_pelapor`, `id_fasilitas`, `id_laporan_induk` (gap G1). |
| C05 Lokasi | `lokasi` | 1:1 dengan laporan. `koordinat` tetap disimpan sebagai string sesuai DPPL, plus lat/lng numerik untuk perhitungan jarak. |
| C06 Fasilitas | `fasilitas` | + `kandidat_evaluasi` (KF14), lat/lng untuk pencocokan radius. |
| C07 Verifikasi | `verifikasi` | Satu laporan bisa diverifikasi lebih dari sekali (setelah revisi). |
| C08 SkorPrioritas | `skor_prioritas` | 1:0..1, dibuat saat laporan disetujui (Q-008). `namaFasilitasInduk` diturunkan via join ke `fasilitas`. |
| C09 RiwayatStatus | `riwayat_status` | Ditulis HANYA lewat `ubahStatus()` / `catatRiwayat()`. Terhubung ke fasilitas lewat `laporan.id_fasilitas` (KF22). |
| C10 Notifikasi | `notifikasi` | + `dibaca` untuk lencana lonceng I-02. |
| C11 KonfirmasiDuplikat | (tanpa tabel) | Kandidat dihitung dari laporan aktif per fasilitas; jejak penggabungan = `laporan.id_laporan_induk`. |

## Nilai yang dibatasi (CHECK)

- `laporan.status_laporan`: `Menunggu Verifikasi`, `Perlu Revisi`, `Ditolak`, `Terverifikasi`, `Diproses`, `Selesai`, `Digabung`
- `laporan.kategori_kerusakan`, `fasilitas.kategori`: `Jalan Berlubang`, `Lampu Jalan Mati`, `Pohon Tumbang`, `Lainnya`
- `verifikasi.keputusan`: `Disetujui`, `Ditolak`, `Revisi`
- `pengguna.peran`: `PELAPOR`, `ADMIN`, `PEMDA`

## Siklus status laporan

```mermaid
stateDiagram-v2
  [*] --> MenungguVerifikasi : UC01 kirim laporan
  MenungguVerifikasi --> Terverifikasi : admin Disetujui (+ skor)
  MenungguVerifikasi --> Ditolak : admin Ditolak
  MenungguVerifikasi --> PerluRevisi : admin Revisi
  PerluRevisi --> MenungguVerifikasi : pelapor merevisi
  Terverifikasi --> Diproses : pemda mulai menangani
  Diproses --> Selesai : pemda selesai
  MenungguVerifikasi --> Digabung : admin gabung duplikat
  PerluRevisi --> Digabung
  Terverifikasi --> Digabung
  Diproses --> Digabung
  Ditolak --> [*]
  Selesai --> [*]
  Digabung --> [*]
```
Sumber kebenaran tabel transisi: `TRANSISI_STATUS` di `shared/constants.js`.

## Indeks

`001_init.sql` hanya membuat PK, UNIQUE, dan indeks untuk foreign key. Indeks untuk query berat (mis. Q-004 daftar
prioritas: filter `status_laporan`, `kategori_kerusakan`, `lokasi.wilayah`, urut `skor`) **sengaja** ditambahkan P5
lewat migrasi `5xx_` setelah profiling `EXPLAIN ANALYZE`, sebagai bukti M9 bagian B.2.1.

## Data uji (seed)

`npm run db:seed` mengisi data fiktif: 5 akun (kata sandi `silembur123`), 8 fasilitas di Kota Bandung, 16 laporan di
semua status. Skenario khusus: fasilitas **Jalan Jl. Merdeka** punya 4 laporan dalam 90 hari (kandidat kerusakan
berulang, UC06) dan **PJU Jl. Cihampelas** punya 2 laporan aktif (kandidat duplikat, UC07). Foto contoh dibuat
otomatis ke `server/uploads/seed/`.

| Email | Peran |
| :--- | :--- |
| `warga1@silembur.test`, `warga2@silembur.test`, `warga3@silembur.test` | PELAPOR |
| `admin@silembur.test` | ADMIN |
| `pemda@silembur.test` | PEMDA (Dinas Pekerjaan Umum Kota Bandung) |
