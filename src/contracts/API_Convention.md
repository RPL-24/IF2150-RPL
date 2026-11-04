# Konvensi Route API Fajar Tech

Berkas Fase 0, **beku setelah Kamis 5 Nov 2026 pukul 18.00 WIB**. Mau ubah: buat Issue, Raffi yang membuat PR (balasan maksimal 24 jam).

## 1. Struktur dan kepemilikan

Next.js App Router. Route handler tipis: memeriksa sesi, memanggil service modul, membungkus hasil.

```
src/
  contracts/              # Raffi (beku)
  modules/<modul>/        # milik satu orang; internal tidak boleh diimpor modul lain
    service.ts            # mengimplementasikan <Modul>Service dari contracts
    repository.ts         # akses data (Data*Boundary)
    internal/             # kelas entity dan algoritma
  app/api/<modul>/...     # route handler, dimiliki pemilik modul
```

| Modul | Pemilik | Prefiks route |
| --- | --- | --- |
| akun | Faiz | `/api/akun` |
| monitoring | Andro | `/api/monitoring`, `/api/telemetri` |
| laporan | Rionaldo | `/api/laporan` |
| pemeliharaan | Rafiandhi | `/api/pemeliharaan` |
| iuran | Raffi | `/api/iuran` |

## 2. Pola URL dan metode

Kata benda jamak berbahasa Indonesia, huruf kecil, tanpa kata kerja di URL.

| Metode | Arti |
| --- | --- |
| GET | baca, tanpa efek samping |
| POST | buat sesuatu atau jalankan aksi (hitung, finalisasi) |
| PATCH | ubah sebagian (mis. status) |

Rute per use case:

| UC | Metode dan URL | Peran |
| --- | --- | --- |
| UC12 | `POST /api/akun/registrasi` | publik |
| UC13 | `POST /api/akun/login` | publik |
| UC14 | `GET /api/akun/menunggu`, `PATCH /api/akun/{email}/persetujuan` (isi `{disetujui:boolean}`) | PENGURUS |
| UC01 | `GET /api/monitoring/status` | WARGA |
| telemetri | `POST /api/telemetri` | perangkat IoT (kunci perangkat) |
| UC05 | `GET /api/monitoring/peringatan` | TEKNISI |
| UC06 | `GET /api/monitoring/panel?mulai=&selesai=` | TEKNISI |
| UC03 | `POST /api/laporan` | WARGA |
| UC04 | `GET /api/laporan`, `GET /api/laporan/{id}`, `GET /api/laporan/{id}/riwayat` | WARGA |
| UC07 | `GET /api/laporan/tugas`, `GET /api/laporan/tugas/{id}`, `PATCH /api/laporan/tugas/{id}/status` | TEKNISI |
| UC08 | `POST /api/pemeliharaan`, `GET /api/pemeliharaan?idPerangkat=` | TEKNISI |
| UC02 | `GET /api/iuran/tagihan?idPeriode=` | WARGA |
| UC09 | `GET /api/iuran/analitik?idPeriode=` | PENGURUS |
| UC10 | `POST /api/iuran/pratinjau`, `POST /api/iuran/finalisasi` | PENGURUS |
| UC11 | `POST /api/iuran/rekapitulasi`, `GET /api/iuran/rekapitulasi/ekspor?idPeriode=&format=PDF\|CSV` | PENGURUS |

## 3. Bentuk respons

Semua respons JSON memakai `ApiRespons<T>` dari `contracts/common.ts`.

```json
{ "ok": true, "data": { } }
{ "ok": false, "kode": "VALIDASI_GAGAL", "pesan": "Isian belum lengkap", "galat": [{ "kolom": "deskripsi", "pesan": "Wajib diisi" }] }
```

| Kode galat | HTTP | Kapan |
| --- | --- | --- |
| VALIDASI_GAGAL | 400 | isian tidak valid, transisi status tidak sah (sertakan `OpsiStatusLegal`) |
| TIDAK_TERAUTENTIKASI | 401 | tanpa sesi, atau akun belum DISETUJUI |
| TIDAK_BERWENANG | 403 | peran salah, bukan keanggotaan komunitas, bukan penugasan |
| TIDAK_DITEMUKAN | 404 | ID tidak ada **atau milik pihak lain** (pesan sama, tidak membocorkan) |
| KONFLIK | 409 | status lama berubah saat transaksi, pengajuan sudah diproses |
| DATA_BELUM_LENGKAP | 422 | UC10: data pemakaian sebagian warga belum lengkap |
| GAGAL_SIMPAN | 500 | persistensi gagal; tidak pernah dikonversi menjadi sukses |
| GAGAL_INTERNAL | 500 | lainnya |

Aturan isi pesan: tanpa SQL, kata sandi, atau data pengguna lain. Daftar kosong adalah `ok: true` dengan `[]`, **bukan** galat; kegagalan baca adalah galat.

## 4. Aturan keamanan yang berlaku di setiap handler

1. Bentuk `KonteksSesi` dari sesi server (`lib/auth`). `idWarga`, `idTeknisi`, `idPengurus`, `idKomunitas` **tidak pernah** dibaca dari body, query, atau header.
2. Periksa peran dan status akun DISETUJUI sebelum memanggil service. Server memeriksa ulang walau UI menyembunyikan menu.
3. ID di URL bukan bukti kewenangan: query data selalu memuat predikat pemilik atau penugasan.
4. Validasi ulang di server walau UI sudah memvalidasi.
5. Query berparameter, tidak ada interpolasi string dari input.

## 5. Format data

| Hal | Aturan |
| --- | --- |
| Waktu | ISO 8601 dengan zona waktu, mis. `2026-10-28T08:10:00+07:00`; tampilan WIB |
| Uang | angka rupiah bulat (number), format `Rp` hanya di tampilan |
| Nilai belum ada | `null`, bukan `0` |
| Daya vs energi | daya sesaat dalam W, energi dalam kWh; jangan dicampur |
| Penamaan JSON | camelCase, sama dengan `contracts/*.ts` |
| Urutan | riwayat status: `timestamp ASC`, lalu `idRiwayat ASC`; daftar laporan warga: `waktuDibuat DESC` |

## 6. Pemanggilan lintas modul

Modul A butuh data modul B: impor tipe dan antarmuka dari `contracts`, panggil lewat `<Modul>Service`. Jangan impor dari `modules/<b>/internal`. Satu pengecualian yang sudah dirancang: `ModulLaporan` memanggil `AkunService.validasiKeanggotaan` untuk UC03.

## 7. Pengujian

Tiap modul punya tes di `src/tests/<modul>/`. Tes memakai service lewat `contracts`, bukan internal modul lain.