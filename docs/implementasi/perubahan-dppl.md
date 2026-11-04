# Perubahan Implementasi terhadap DPPL

Catat setiap bagian implementasi yang berbeda dari DPPL (`docs/M8/K03_G07_DPPL2.md`). Dipakai untuk laporan B.1.

| No | Bagian DPPL | Rancangan di DPPL | Implementasi | Alasan | PIC |
|---|---|---|---|---|---|
| 1 | C03 Lokasi | Tidak ada operasi `dalamWilayah()` | Operasi baru `Lokasi.dalamWilayah()`: cek titik di dalam polygon batas Kota Bandung (`src/lib/batas-wilayah.ts`, dari OpenStreetMap via Nominatim, disederhanakan ±300 m) dengan algoritma ray casting | Dibutuhkan untuk validasi "Lokasi di luar daerah penanganan" (I01-13) dan validasi koordinat data seed | F (Dipta) |
