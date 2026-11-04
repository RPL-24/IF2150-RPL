# Daftar Cek Review schema.prisma (untuk Raffi, Rab 4 Nov)

Cocokkan draft PR Rafiandhi dengan DPPL BAB 4-5. Beri komentar per butir yang tidak cocok. Tujuan: schema beku Kamis 5 Nov 18.00 WIB tanpa perubahan susulan.

## A. Tabel yang wajib ada (nama dari DPPL)

| Tabel | Kolom wajib (DPPL) | Dipakai oleh |
| --- | --- | --- |
| `akun` | id_akun, email (unik), nama, peran, password (hash), status_akun | UC12-14 |
| `warga` | id_warga, id_komunitas, status_terdaftar (terhubung ke akun) | UC01-04 |
| `laporan_gangguan` | id_laporan, id_warga, jenis_gangguan, deskripsi, foto (daftar URI), waktu_dibuat, status | UC03, 04, 07 |
| `riwayat_status_laporan` | id_riwayat, id_laporan, status, timestamp | UC04, 07 |
| `penugasan_laporan` | id_penugasan, id_teknisi, id_laporan, waktu_penugasan | UC07 |
| `penugasan_perangkat` | id_penugasan, id_teknisi, id_perangkat | UC05 |
| `perangkat` | id_perangkat, jenis_perangkat, lokasi (plus kolom tangki, baterai, panel: volume, ambang, kapasitas, daya) | UC01, 05, 06, 08 |
| `pembacaan_sensor` | id_pembacaan, id_perangkat, nilai, satuan, waktu | UC01, telemetri |
| `data_historis_kinerja` | id_data, id_panel, waktu, daya_dihasilkan, energi | UC06 |
| `notifikasi` | id_notifikasi, id_teknisi, pesan, level, kapasitas_saat_ini, status_pengiriman, status_baca, waktu | UC05 |
| `catatan_pemeliharaan` | id_catatan, id_teknisi, id_perangkat, waktu_pelaksanaan, tindakan, catatan_hasil | UC08 |
| `periode` | id_periode, bulan, tahun, status_final | UC02, 09-11 |
| `data_pemakaian` | id_pemakaian, id_warga, id_periode, volume_air_m3, energi_kwh, waktu_catat | UC09-11 |
| `aturan_tarif` | id_aturan, id_periode, tarif_air_per_m3, tarif_energi_per_kwh, biaya_tetap | UC10 |
| `tagihan` | id_tagihan, id_warga, id_periode, jumlah_iuran, data_pemakaian_dasar, status | UC02, 10, 11 |
| `rekapitulasi` | id_rekap, id_periode, total_pemakaian_air, total_pemakaian_energi, total_iuran | UC11 |

Catatan: pemetaan nama Prisma (camelCase) ke nama tabel DPPL (snake_case) harus konsisten lewat `@map` dan `@@map`.

## B. Aturan integritas yang paling memengaruhi modul iuran (milik Raffi)

- [ ] `periode`: unik pada (bulan, tahun).
- [ ] `aturan_tarif`: **tepat satu** per periode (unik pada id_periode). Dipakai seluruh warga (KF28).
- [ ] `data_pemakaian`: unik pada (id_warga, id_periode); `volume_air_m3`, `energi_kwh`, `waktu_catat` **boleh null** agar `isLengkap()` (Algo-012) bermakna.
- [ ] `tagihan`: unik pada (id_warga, id_periode); `status` berisi DRAFT atau FINAL (enum).
- [ ] `periode.status_final` dan `tagihan.status` bisa diubah dalam satu transaksi.
- [ ] Tipe uang: gunakan `Decimal` atau bilangan bulat rupiah, bukan `Float`.
- [ ] Indeks pada `tagihan(id_periode)` dan `data_pemakaian(id_periode)`.
- [ ] `rekapitulasi` merujuk satu `periode`.

## C. Aturan integritas lintas modul

- [ ] `akun.email` unik; `status_akun` enum MENUNGGU, DISETUJUI, DITOLAK; password disimpan sebagai hash.
- [ ] `laporan_gangguan.status` enum MENUNGGU, SEDANG_DIPERBAIKI, SELESAI.
- [ ] `riwayat_status_laporan.id_laporan` berkunci asing ke laporan; indeks (id_laporan, timestamp).
- [ ] `penugasan_laporan` unik pada (id_teknisi, id_laporan) (query pemeriksaan penugasan UC07).
- [ ] `data_historis_kinerja`: indeks (id_panel, waktu), untuk query `BETWEEN` UC06 dan profiling Rafiandhi.
- [ ] `notifikasi.status_pengiriman`: nilai PENDING dan TERKIRIM; indeks (id_teknisi, status_pengiriman).
- [ ] Kolom waktu bertipe timestamp dengan zona waktu.
- [ ] Hubungan satu-ke-banyak sesuai ringkasan relasi BAB 4.1.3 (Warga ke laporan, pemakaian, tagihan; Periode ke tarif, pemakaian, tagihan, rekap).

## D. Seed (indeks seed Rafiandhi)

- [ ] Satu akun DISETUJUI per peran, dan satu akun MENUNGGU untuk uji UC14.
- [ ] Penugasan laporan dan perangkat untuk teknisi seed.
- [ ] Satu periode FINAL dan satu periode belum final, lengkap dengan tarif dan pemakaian (satu warga sengaja tidak lengkap untuk uji UC10 Alt 2).
- [ ] Semua data fiktif; tidak ada kredensial asli.

## E. Cara memberi komentar

Satu komentar per ketidakcocokan, sebutkan bagian DPPL yang menjadi rujukan (mis. "Tabel 5.49.5 Q-001: kolom `data_pemakaian_dasar` belum ada"). Setelah semua diselesaikan, centang di PR dan tandai Approve.