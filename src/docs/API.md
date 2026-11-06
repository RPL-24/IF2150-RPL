# Kontrak API SILEMBUR

Base URL: `http://<host>:3000/api`. Semua endpoint (kecuali `/health`, `/auth/login`, `/auth/google`) butuh header
`Authorization: Bearer <token>`. Request/response JSON memakai **camelCase**; kolom DB memakai snake_case.

Kontrak ini adalah **kesepakatan antar-anggota**. Mengubah bentuk respons = beri tahu pemakainya + update file ini di PR yang sama.

## Konvensi umum

| Hal | Aturan |
| :--- | :--- |
| Error | `{"error": {"message": "teks untuk pengguna", "details": [...]}}`. `details` hanya ada untuk error validasi (400). |
| Kode status | 200 OK, 201 dibuat, 204 tanpa isi, 400 input salah, 401 belum login, 403 peran salah, 404 tidak ada / bukan milikmu, 409 transisi status tidak sah, 501 belum diimplementasi (stub starter). |
| Daftar | Selalu dibungkus: `{"data": [...]}` (boleh ditambah field lain, mis. `belumDibaca`). |
| Tanggal | ISO 8601 string (`2026-11-08T07:30:00.000Z`). Format tampilan dikerjakan di mobile (`utils/format.js`). |
| Foto | Path relatif `"/uploads/..."` atau URL `https://...`. Mobile memakai `urlLengkap()` dari `api/client.js`. |
| Status & kategori | String persis seperti `shared/constants.js` (`STATUS`, `KATEGORI`, `KEPUTUSAN`). |
| Waktu respons | Target < 4 detik (KNF03). Mobile memutus setelah 5 detik dan menampilkan "Tolong muat ulang halaman". |

## Bentuk data (DTO)

<a id="laporanpublik"></a>
### `LaporanPublik` — aman untuk publik (KNF02)
```json
{
  "id": 12,
  "kategori": "Jalan Berlubang",
  "deskripsi": "Jalan amblas sekitar 1,2 meter ...",
  "foto": "/uploads/seed/jalan-berlubang.png",
  "status": "Terverifikasi",
  "tanggalLaporan": "2026-11-05T03:12:00.000Z",
  "lokasi": { "latitude": -6.8935, "longitude": 107.6046, "wilayah": "Coblong", "alamat": "Jl. Cihampelas No. 42, Coblong" },
  "fasilitas": { "id": 1, "nama": "Jalan Jl. Cihampelas No. 42" }
}
```
**Dilarang** ada: `pelapor`, `idPelapor`, `nama`, `email`, atau field apa pun yang mengidentifikasi pelapor. Ada test untuk ini (P3).

### `LaporanSaya` = `LaporanPublik` + 
```json
{ "diperbaruiPada": "...", "catatanVerifikasi": { "keputusan": "Revisi", "catatan": "Foto kurang jelas", "waktu": "..." } }
```
Pada detail (`/laporan/saya/:id`) ditambah `"riwayat": Riwayat[]` urut **terawal → terakhir** (UC05 langkah 2).

### `Riwayat`
```json
{ "id": 40, "statusLama": "Terverifikasi", "statusBaru": "Diproses", "deskripsi": "Penambalan darurat sedang berjalan.", "tanggal": "..." }
```

### `LaporanAdmin` = `LaporanPublik` + (hanya untuk ADMIN)
```json
{ "pelapor": { "id": 1, "nama": "Budi Santoso", "email": "warga1@silembur.test" }, "skor": 75, "idLaporanInduk": null }
```

### `LaporanPrioritas` = `LaporanPublik` + (tanpa identitas pelapor, gap G9)
```json
{ "skor": { "nilai": 95, "jumlahPelapor": 2, "lamaMenunggu": 3, "frekuensiBerulang": 4 } }
```

### `Fasilitas`
```json
{ "id": 4, "nama": "Jalan Jl. Merdeka", "kategori": "Jalan Berlubang", "lokasi": "Jl. Merdeka, Sumur Bandung",
  "latitude": -6.9126, "longitude": 107.6098, "wilayah": "Sumur Bandung",
  "jumlahKerusakanBerulang": 4, "kandidatEvaluasi": true }
```

### `Notifikasi`
```json
{ "id": 3, "idLaporan": 12, "isiPesan": "Laporan #12: Disetujui. Lokasi dan foto sesuai.", "dibaca": false, "waktuKirim": "..." }
```

---

## Umum — P1 (sudah jadi di starter)

| Method & path | Peran | Request | Response |
| :--- | :--- | :--- | :--- |
| `GET /health` | - | - | `{ status: "ok", waktu }` |
| `POST /auth/login` | - | `{ email, password }` | `{ token, pengguna: Profil }` · 400, 401 |
| `GET /auth/me` | semua | - | `{ pengguna: Profil }` |
| `POST /auth/google` | - | `{ idToken }` | `{ token, pengguna }` · **stub 501 (stretch P1)** |
| `GET /referensi` | semua | - | `{ wilayah: string[], kategori: string[], status: string[] }` |

`Profil` = `{ id, email, nama, peran, namaInstansi, wilayahKerja, jumlahLaporan }`.

<a id="uc01"></a>
## UC01 Membuat laporan (+ revisi) — P2

### `POST /laporan` — PELAPOR · KF01–KF04
`multipart/form-data`:

| Field | Tipe | Aturan |
| :--- | :--- | :--- |
| `foto` | file gambar | wajib, ≤ 5 MB |
| `kategori` | string | salah satu `KATEGORI` |
| `deskripsi` | string | 1–300 karakter (trim) |
| `latitude`, `longitude` | angka (dikirim sebagai string) | wajib |
| `sumberLokasi` | `GPS` \| `MANUAL` | default `GPS` (KF03) |

Response **201** `{ "laporan": LaporanSaya }` dengan `status = "Menunggu Verifikasi"`. Error 400 (field kurang/invalid).
Efek samping: foto tersimpan, lokasi + wilayah tersimpan, laporan tertaut ke fasilitas (dibuat bila belum ada, gap G1),
riwayat pertama "Laporan berhasil diterima oleh sistem.", `pengguna.jumlah_laporan + 1`.

### `PUT /laporan/:id/revisi` — PELAPOR (pemilik) · gap G7
`multipart/form-data`, semua field opsional (sama seperti POST). Hanya boleh bila status `Perlu Revisi`.
Response 200 `{ "laporan": LaporanSaya }` dengan status kembali `Menunggu Verifikasi`. Error 404 (bukan milikmu), 409 (status bukan Perlu Revisi).

<a id="uc04"></a>
## UC04 Laporan publik & UC05 Laporan saya — P3

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /laporan/ringkasan` | semua | - | `{ masuk, diproses, selesai }` — masuk = laporan publik bulan ini; diproses = Terverifikasi + Diproses; selesai = Selesai |
| `GET /laporan/publik` | semua | `kelompok` = `menunggu` \| `diproses` \| `selesai` (kosong = semua), `wilayah`, `kategori`, `limit` (20), `offset` (0) | `{ data: LaporanPublik[] }` terbaru dulu. Hanya status `STATUS_PUBLIK`. |
| `GET /laporan/publik/:id` | semua | - | `{ laporan: LaporanPublik }` · 404 bila tidak ada atau bukan status publik |

<a id="uc05"></a>

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /laporan/saya` | PELAPOR | - | `{ data: LaporanSaya[] }` semua status, terbaru dulu |
| `GET /laporan/saya/:id` | PELAPOR | - | `{ laporan: LaporanSaya & { riwayat: Riwayat[] } }` · 404 bila bukan miliknya |

<a id="notifikasi"></a>
| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /notifikasi` | PELAPOR | - | `{ data: Notifikasi[], belumDibaca: number }` terbaru dulu |
| `PATCH /notifikasi/:id/dibaca` | PELAPOR | - | 204 · 404 bila bukan miliknya |

<a id="uc02"></a>
## UC02 Verifikasi & skor prioritas — P4

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /admin/laporan` | ADMIN | `status` (default `Menunggu Verifikasi`), `q` (cari di deskripsi/alamat) | `{ data: LaporanAdmin[] }` terlama dulu (antrean) |
| `GET /admin/laporan/jumlah-baru` | ADMIN | - | `{ jumlah }` laporan Menunggu Verifikasi (badge, UC02 langkah 1) |
| `GET /admin/laporan/:id` | ADMIN | - | `{ laporan: LaporanAdmin & { pratinjauSkor: {nilai, jumlahPelapor, lamaMenunggu, frekuensiBerulang}, riwayat: Riwayat[], verifikasi: [{keputusan, catatan, waktu, admin}] } }` |
| `POST /admin/laporan/:id/verifikasi` | ADMIN | `{ keputusan: "Disetujui"\|"Ditolak"\|"Revisi", catatan }` — catatan wajib untuk Ditolak/Revisi (sudah divalidasi di route) | `{ laporan: LaporanAdmin, skor: number\|null }` · 404, 409 bila status bukan Menunggu Verifikasi |

Efek `POST .../verifikasi` (satu transaksi): baris `verifikasi` (Q-003) → `ubahStatus` (Disetujui→Terverifikasi,
Ditolak→Ditolak, Revisi→Perlu Revisi) → bila Disetujui: `buatSkorAwal` (Q-008) + `hitungSkor` (Algo-009) →
`kirimNotifikasi` ke pelapor berisi keputusan + catatan (KF07).

<a id="uc07"></a>
## UC07 Duplikat — P1

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /admin/duplikat/kandidat` | ADMIN | - | `{ data: [{ fasilitas: Fasilitas, kandidat: boolean, laporan: LaporanAdmin[] }] }` — semua laporan **aktif** dikelompokkan per fasilitas; `kandidat = laporan.length >= 2` (KF20, KF21); kelompok kandidat diurutkan paling atas |
| `POST /admin/duplikat/gabung` | ADMIN | `{ idLaporan: number[] }` (≥ 2, sudah divalidasi di route) | `{ idLaporanInduk, digabung: number[], skor: number\|null }` · 400 bila kategori berbeda, 409 bila ada laporan tidak aktif |

Aturan gabung (Algo-012): induk = `tanggal_laporan` paling awal; laporan lain → status `Digabung` +
`id_laporan_induk = induk` (+ `id_fasilitas` ikut induk); lalu `hitungSkor(induk)` (KF17). Jumlah pelapor
induk = 1 + jumlah laporan dengan `id_laporan_induk = induk` (KF15, Q-009).

<a id="uc03"></a>
## UC03 Prioritas, UC06 Fasilitas berulang, UC08 Riwayat fasilitas — P5

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /prioritas` | PEMDA, ADMIN | `kategori`, `wilayah`, `status` (`Terverifikasi`\|`Diproses`\|`Selesai`; kosong = Terverifikasi + Diproses) | `{ data: LaporanPrioritas[] }` urut `skor.nilai` DESC (Q-004) |
| `PATCH /laporan/:id/status` | PEMDA | `{ status: "Diproses"\|"Selesai", keterangan }` (sudah divalidasi di route) | `{ laporan: LaporanPrioritas }` · 404, 409 transisi tidak sah |

<a id="uc06"></a>

| Method & path | Peran | Query / body | Response |
| :--- | :--- | :--- | :--- |
| `GET /fasilitas` | PEMDA, ADMIN | `q` (keyword nama/lokasi/wilayah), `berulang=true` | `{ data: Fasilitas[], pesan?: string }` — bila `q` diisi dan kosong: `pesan = PESAN.FASILITAS_TIDAK_DITEMUKAN` (UC08 alt 1) |
| `GET /fasilitas/berulang` | PEMDA, ADMIN | `limit` (opsional) | `{ data: Fasilitas[] }` hanya `kandidatEvaluasi = true`, urut jumlah terbanyak (KF14) |
| `GET /fasilitas/:id` | PEMDA, ADMIN | - | `{ fasilitas: Fasilitas, laporan: LaporanPrioritas[], riwayat: (Riwayat & { idLaporan })[] }` riwayat terbaru dulu (KF23) · 404 |

Catatan `LaporanPrioritas` untuk laporan yang belum punya skor (mis. masih Menunggu Verifikasi di detail fasilitas): `skor = null`.
