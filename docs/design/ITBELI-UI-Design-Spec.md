# ITBELI — Spesifikasi Antarmuka & Design System

Dokumen kerja untuk menyusun **BAB 6 Perancangan Antarmuka** pada DPPL (`docs/M8/K01_G02_DPPL2.md`)
dan untuk membangun mockup, baik di Figma maupun langsung sebagai halaman HTML.

Dokumen ini **bukan** bagian dari dokumen tugas. Ia adalah referensi internal tim:
Bab 6 mengambil gambar dan tabel objek dari sini, bukan sebaliknya.

| Hal | Isi |
| :--- | :--- |
| Produk | ITBELI — marketplace barang preloved untuk civitas ITB |
| Platform | Aplikasi web responsif, peramban berbasis Chromium |
| Acuan arsitektur | MVC; 12 kelas *boundary* C01–C12 (subbab 2.3 DPPL) |
| Acuan visual pembanding | Facebook Marketplace (web), hasil observasi terekam |
| Jumlah layar | 15 layar (I-01 … I-15) |

---

## Daftar Isi

1. [Cara memakai dokumen ini](#1-cara-memakai-dokumen-ini)
2. [Hasil observasi Facebook Marketplace](#2-hasil-observasi-facebook-marketplace)
3. [Keputusan adopsi untuk ITBELI](#3-keputusan-adopsi-untuk-itbeli)
4. [Fondasi desain (design tokens)](#4-fondasi-desain-design-tokens)
5. [Kerangka layout dan grid](#5-kerangka-layout-dan-grid)
6. [Pustaka komponen](#6-pustaka-komponen)
7. [Spesifikasi per layar (I-01 … I-15)](#7-spesifikasi-per-layar)
8. [Peta navigasi antarlayar](#8-peta-navigasi-antarlayar)
9. [Panduan membangun di Figma](#9-panduan-membangun-di-figma)
10. [Panduan membangun dengan Claude Code](#10-panduan-membangun-dengan-claude-code)
11. [Checklist pengisian BAB 6](#11-checklist-pengisian-bab-6)

---

## 1. Cara memakai dokumen ini

Urutan kerja yang disarankan:

1. Baca **bagian 2 dan 3** sekali untuk tahu pola mana yang ditiru dari Facebook Marketplace dan mana yang sengaja tidak.
2. Masukkan **bagian 4 (tokens)** ke Figma sebagai *variables/styles*, atau ke CSS sebagai `:root` custom properties.
3. Bangun **bagian 6 (komponen)** sebagai *component set* di Figma, sekali saja, lalu pakai ulang.
4. Untuk setiap layar di **bagian 7**, susun frame dari komponen yang sudah ada. Setiap layar sudah membawa tabel objeknya, siap disalin ke Bab 6.
5. Ekspor PNG setiap layar ke `docs/M8/assets/` dengan nama `layar01.png` … `layar15.png`.
6. Tempel tabel objek dan gambar ke Bab 6 memakai **checklist bagian 11**.

**Status saat ini.** Seluruh 15 layar sudah jadi, bersumber dari halaman HTML di `src/mockup/`,
dan sudah terpasang di Bab 6 (lihat **bagian 10**). Palet, tipografi, dan radius pada bagian 4
diambil dari rancangan awal I-01 yang dibuat manual lebih dahulu, sehingga arah visual kelompok
tetap terjaga. Jadi langkah 1–6 di atas kini berlaku untuk menambah layar baru atau membangun
ulang di Figma, bukan untuk memulai dari nol.

---

## 2. Hasil observasi Facebook Marketplace

### 2.1 Metode dan batas bukti

Observasi dijalankan dengan **REA** (`capture_browser_scenario`), yang meluncurkan Chromium 156
dengan profil sementara, membuka URL, dan merekam hasilnya.

| Hal | Keterangan |
| :--- | :--- |
| Evidence ID | `ev_68b243f7afb516c71c627266bb6f211f6f79cec14b45c6b964c8b886bc8c9049` |
| Peramban | Chromium 156.0.8078.49, profil sementara milik REA |
| Viewport | 1280 × 720, `prefers-color-scheme: light` |
| Durasi skenario | 68.670 ms, 6 langkah |
| Halaman terekam | `/marketplace/` → `/marketplace/item/<id>/` → `/marketplace/category/books` |
| Status sesi | **Tidak masuk akun.** Tidak ada kredensial yang dipakai. |

Pengamatan tambahan dilakukan pada halaman `/marketplace/sanfrancisco/search/?query=textbook`
untuk melihat halaman hasil pencarian beserta panel filternya.

**Yang teramati langsung** (boleh dikutip sebagai fakta):
halaman katalog, halaman kategori, halaman hasil pencarian beserta panel filter,
halaman detail listing, dan anatomi kartu produk.

**Yang tidak teramati** (tidak boleh diklaim sebagai fakta):
formulir *Create new listing*, inbox/percakapan, halaman "Your listings", dan seluruh keadaan
setelah masuk akun. `/marketplace/create/item` mengalihkan pengunjung yang belum masuk kembali ke
`/marketplace/`. Rancangan ITBELI untuk layar sejenis (I-07, I-10) karena itu **diturunkan dari
kebutuhan ITBELI sendiri pada BAB 5 DPPL**, bukan dari tiruan Facebook.

### 2.2 Kerangka halaman

Facebook Marketplace memakai **tiga lajur tetap**:

```
┌──────────────────────────────────────────────────────────────────┐
│  Top bar global (logo, pencarian global, aksi akun)              │  ~56 px
├───────────────────────┬──────────────────────────────────────────┤
│  Rail kiri (tetap)    │  Area konten                             │
│  ~360 px, menggulir   │                                          │
│  sendiri              │  Grid kartu / detail listing             │
│                       │                                          │
│  • Judul konteks      │                                          │
│  • Kolom pencarian    │                                          │
│  • CTA primer         │                                          │
│  • Filter             │                                          │
│  • Daftar kategori    │                                          │
└───────────────────────┴──────────────────────────────────────────┘
```

Yang penting dari pola ini:

- **Rail kiri tidak pernah hilang.** Pencarian, tombol "Create new listing", filter, dan daftar
  kategori selalu ada di tempat yang sama, di halaman katalog maupun di halaman hasil pencarian.
  Pengguna tidak pernah kehilangan jalan untuk mempersempit atau mengganti pencarian.
- **Filter tinggal di rail, bukan di halaman terpisah.** Hasil di sebelah kanan berubah tanpa
  pengguna berpindah halaman.
- **CTA menjual diletakkan di rail, bukan di top bar.** Tombol "Create new listing" muncul
  persis di bawah kolom pencarian, sebagai aksi kedua paling menonjol setelah mencari.

### 2.3 Panel filter (halaman hasil pencarian)

Urutan kontrol yang teramati, dari atas ke bawah:

```
Filters
  Lokasi                   "San Francisco, California · Within 65 km"
  Sort by                  (accordion)
  Price                    [ Min. ]  to  [ Max. ]
  Condition                (accordion)
  Date listed              (accordion)
  Availability             (accordion)
Categories
  Vehicles / Property for rent / Classifieds / Clothing / Electronics /
  Entertainment / Family / Free stuff / Garden and outdoors / Hobbies /
  Home goods / Home improvement supplies / Musical instruments /
  Office supplies / Pet supplies / Property for sale / Sporting goods /
  Toys and games
```

Catatan yang berguna untuk ITBELI:

- Lokasi berada **di atas** semua filter lain, karena ia yang paling mengubah hasil.
  Pada ITBELI, padanannya adalah **lokasi titik temu COD**.
- Harga memakai **dua kolom Min–Max berdampingan**, bukan slider. Lebih mudah dibuat dan lebih
  presisi untuk harga yang rentangnya lebar.
- Kategori adalah **daftar tegak berikon**, bukan dropdown. Daftar kategori ITBELI jauh lebih
  pendek (jas praktikum, buku kuliah, alat lab, kalkulator, jaket himpunan, perlengkapan kos),
  sehingga pola daftar tegak ini justru lebih cocok lagi.

### 2.4 Anatomi kartu produk

Urutan yang teramati pada setiap kartu di grid:

```
┌─────────────────────┐
│                     │
│      Foto 1:1       │   ← badge "Just listed" menempel di pojok kiri atas
│                     │
├─────────────────────┤
│ $20                 │   ← harga, paling tebal
│ unbound calculus    │   ← judul, maksimum 2 baris
│ textbook            │
│ San Francisco, CA   │   ← lokasi, kecil dan redup
└─────────────────────┘
```

**Harga diletakkan di atas judul.** Ini kebalikan dari kebiasaan e-commerce ritel. Pada pasar
barang bekas, harga adalah penyaring pertama, bukan nama barang, sehingga ia naik ke posisi paling
mudah dipindai. Ketika ada potongan harga, dua harga ditampilkan berurutan (harga baru lalu harga
lama). Lokasi selalu menjadi baris terakhir.

Pada grid 1280 px, kartu berukuran ±282 px dengan jarak antarkartu ±8 px, tiga kolom di area konten.

### 2.5 Halaman detail listing

```
┌───────────────────┬───────────────────────────────┬────────────────────────┐
│ Rail kiri         │  Galeri foto                  │  Kolom informasi       │
│ (sama seperti     │  tombol ‹ › di tepi gambar    │                        │
│  katalog)         │                               │  Judul                 │
│                   │                               │  Harga                 │
│                   │                               │  Kategori              │
│                   │                               │  "Listed 16 hours ago  │
│                   │                               │   in San Pablo, CA"    │
│                   │                               │  Chip "Door pick-up"   │
│                   │                               │  [Message] [Save]      │
│                   │                               │  ──────────────        │
│                   │                               │  Details               │
│                   │                               │    Condition: Used–good│
│                   │                               │  Deskripsi penjual     │
│                   │                               │  Peta lokasi perkiraan │
│                   │                               │  Seller information    │
└───────────────────┴───────────────────────────────┴────────────────────────┘
```

Urutan informasi di kolom kanan — **judul → harga → kategori → waktu & lokasi → cara serah terima
→ aksi → detail kondisi → deskripsi → lokasi → penjual** — menjawab pertanyaan pembeli persis
dalam urutan yang biasanya ia tanyakan. Tombol aksi diletakkan **sebelum** deskripsi panjang,
sehingga pembeli yang sudah yakin tidak perlu menggulir.

Dua hal lain yang teramati dan layak ditiru:

- Lokasi ditulis **"Location is approximate"**. Lokasi ditampilkan cukup untuk menilai jarak,
  tidak cukup untuk menemukan rumah penjual.
- Di bawah informasi penjual ada blok **"Related searches"** berisi kata kunci serupa, dan di
  bawahnya lagi grid "Today's picks". Halaman detail tidak pernah menjadi jalan buntu.

---

## 3. Keputusan adopsi untuk ITBELI

| Pola Facebook Marketplace | Keputusan | Alasan |
| :--- | :--- | :--- |
| Rail kiri tetap berisi pencarian, CTA jual, filter, kategori | **Adopsi** | Menjawab celah "fragmentasi informasi" pada subbab 1.2 Tugas 1: satu titik pencarian yang tidak pernah hilang. |
| Filter di rail, hasil berubah tanpa pindah halaman | **Adopsi** | Sesuai C05 `HalamanKatalog`, yang mengirim kata kunci, filter, urutan, dan halaman dalam satu permintaan ke `KatalogController`. |
| Harga di atas judul pada kartu | **Adopsi** | Sesuai C06 `KartuProduk`, dan sesuai perilaku pembeli barang bekas. |
| Badge status menempel di foto kartu | **Adopsi, diubah isinya** | ITBELI memakai badge **"Terjual"** (KF26) dan **"Baru"**, bukan "Just listed" saja. |
| Detail: aksi sebelum deskripsi panjang | **Adopsi** | Tombol "Hubungi Penjual" adalah tujuan utama halaman detail (UC16). |
| Lokasi perkiraan, bukan alamat persis | **Adopsi** | Sejalan dengan batasan privasi pada subbab 2.2.3 Tugas 1. |
| Blok rekomendasi di bawah detail | **Adopsi sebagian** | ITBELI cukup menampilkan "Barang lain dari penjual ini" dan "Kategori serupa". |
| Filter lokasi geografis dengan radius kilometer | **Diubah** | ITBELI memakai **pilihan titik temu COD** (C32 `LokasiCOD`) yang jumlahnya tetap dan terbatas di kampus. Radius tidak relevan di dalam satu kampus. |
| *Infinite scroll* pada grid katalog | **Ditolak** | KF28 menetapkan maksimum 20 listing per halaman dengan navigasi antarhalaman. C05 memiliki `tampilkanPagination()` dan `pindahHalaman()`. |
| Top bar global lintas produk (logo Facebook, akun) | **Disederhanakan** | ITBELI hanya satu produk. Top bar cukup berisi logo, notifikasi, percakapan, dan menu akun. |
| Tombol "Save"/wishlist | **Ditolak** | Tidak ada kebutuhan fungsional yang mencakupnya. Menambahkannya berarti menambah kelas di luar C01–C12. |
| Modal login yang menutupi konten bagi pengunjung | **Ditolak** | Katalog ITBELI boleh dilihat tanpa masuk; yang memerlukan sesi hanyalah menghubungi penjual dan membuat listing. Dinding login yang memblokir konten justru memperbesar hambatan awal. |
| Tawar-menawar lewat pesan bebas | **Adopsi** | US-04: negosiasi berlangsung di dalam platform, bukan di luar. |

---

## 4. Fondasi desain (design tokens)

Nilai warna di bawah diambil langsung dari rancangan awal I-01, sehingga seluruh layar
mengikuti arah visual yang sudah disepakati kelompok sejak awal.

### 4.1 Warna

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--green-900` | `#0F3A25` | Teks di atas latar hijau muda, hover tombol primer |
| `--green-700` | `#1B5C3A` | **Warna utama.** Panel hero, tombol primer, logo, judul |
| `--green-500` | `#2E7D55` | Garis fokus, ikon aktif |
| `--green-200` | `#A9C8B6` | Garis pembatas di atas latar hijau |
| `--green-50` | `#EAF2EC` | Latar kotak informasi, badge netral, baris tabel terpilih |
| `--bg` | `#F6F5F1` | Latar halaman (putih hangat, bukan putih murni) |
| `--surface` | `#FFFFFF` | Kartu, panel, top bar, isian formulir |
| `--text-900` | `#14181A` | Judul dan teks utama |
| `--text-600` | `#5A6460` | Teks pendukung, label, lokasi pada kartu |
| `--text-400` | `#8E9995` | Teks placeholder, keterangan kecil |
| `--border` | `#E3E1DA` | Garis pembatas kartu, isian, dan pemisah |
| `--danger` | `#B3261E` | Galat, tombol hapus, label akun diblokir |
| `--danger-bg` | `#FBEAE9` | Latar pesan galat |
| `--warning` | `#9A6400` | Status laporan "Sedang Ditinjau" |
| `--warning-bg` | `#FBF2E2` | Latar badge peringatan |
| `--success` | `#1B5C3A` | Pesan berhasil (memakai warna utama) |
| `--sold` | `#5A6460` | Overlay dan badge "Terjual" |

Aturan kontras: setiap teks harus mencapai rasio minimal 4,5 : 1 terhadap latarnya.
`--text-600` di atas `--surface` dan `--bg` memenuhi syarat; `--text-400` **hanya** boleh dipakai
untuk teks non-esensial seperti placeholder.

### 4.2 Tipografi

Dua keluarga huruf, seperti pada I-01:

| Peran | Keluarga | Alasan |
| :--- | :--- | :--- |
| Display / judul besar | **Serif** — `Source Serif 4`, cadangan `Georgia` | Memberi kesan terpercaya dan "kampus", membedakan ITBELI dari marketplace ritel |
| Antarmuka / teks isi | **Sans-serif** — `Inter`, cadangan `system-ui` | Terbaca pada ukuran kecil, angka harga rapi |

| Token | Ukuran / tinggi baris | Bobot | Keluarga | Pemakaian |
| :--- | :--- | :--- | :--- | :--- |
| `display-lg` | 44 / 52 | 700 | serif | Judul hero pada I-01, I-02 |
| `display-sm` | 32 / 40 | 700 | serif | Judul halaman (Katalog, Detail, Dasbor) |
| `heading` | 20 / 28 | 600 | sans | Judul seksi, judul kartu detail |
| `body-lg` | 16 / 24 | 400 | sans | Teks isi, deskripsi barang, isi pesan |
| `body` | 14 / 20 | 400 | sans | Teks antarmuka umum, label isian |
| `caption` | 12 / 16 | 400 | sans | Lokasi pada kartu, cap waktu, keterangan |
| `price` | 18 / 24 | 700 | sans, *tabular numerals* | Harga pada kartu produk |
| `price-lg` | 28 / 36 | 700 | sans, *tabular numerals* | Harga pada halaman detail |

Harga selalu memakai angka *tabular* agar kolom harga pada grid tampak sejajar.

### 4.3 Jarak, radius, bayangan

Skala jarak kelipatan 4: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64**.
Gunakan hanya nilai dari skala ini; jangan menambah 10, 18, atau 30.

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--radius-sm` | 8 px | Badge, chip, isian kecil |
| `--radius-md` | 12 px | Isian formulir, tombol, kartu produk |
| `--radius-lg` | 20 px | Panel besar, modal, panel hero |
| `--radius-full` | 999 px | Avatar, badge jumlah notifikasi |
| `--shadow-sm` | `0 1px 2px rgba(20,24,26,.06)` | Kartu dalam keadaan diam |
| `--shadow-md` | `0 4px 12px rgba(20,24,26,.08)` | Kartu saat disorot, dropdown |
| `--shadow-lg` | `0 12px 32px rgba(20,24,26,.16)` | Modal, lightbox |

### 4.4 Ikon

Satu himpunan ikon garis dengan ketebalan 1,5 px, ukuran 20 px pada antarmuka dan 24 px pada rail.
Contoh himpunan yang konsisten: **Lucide** atau **Phosphor (regular)**. Jangan mencampur dua
himpunan ikon dalam satu layar.

Ikon yang dibutuhkan: pencarian, filter, plus, foto, kirim, lonceng, percakapan, pengguna,
pengaturan, keluar, bendera (laporan), sampah, pensil, centang, silang, panah kiri/kanan,
mata, kunci, lokasi, tanda seru, dan tiga titik.

---

## 5. Kerangka layout dan grid

### 5.1 Ukuran frame

| Breakpoint | Lebar frame Figma | Perilaku |
| :--- | :--- | :--- |
| Desktop | **1440 × 1043** | Rail + konten, grid 4 kolom kartu |
| Laptop | 1280 | Grid 3 kolom kartu |
| Tablet | 768 | Rail menjadi panel geser, grid 2 kolom |
| Ponsel | 375 | Rail menjadi *bottom sheet*, grid 2 kolom sempit, navigasi bawah |

Frame utama untuk dokumen adalah **1440 × 1043**, sama dengan I-01, agar semua gambar Bab 6
memiliki rasio yang sama.

### 5.2 Kerangka halaman ITBELI

```
┌───────────────────────────────────────────────────────────────────────┐
│ TOP BAR  h=64                                                         │
│ [logo ITBELI]            [ kolom pencarian ]      [🔔] [💬] [avatar ▾] │
├──────────────────────┬────────────────────────────────────────────────┤
│ RAIL KIRI  w=280     │  AREA KONTEN                                   │
│ padding 24           │  padding 32, lebar maksimum 1096               │
│                      │                                                │
│ [+ Jual Barang]      │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│                      │  │ kartu│ │ kartu│ │ kartu│ │ kartu│           │
│ Filter               │  └──────┘ └──────┘ └──────┘ └──────┘           │
│  Kategori            │  gap 20                                        │
│  Harga  [min]-[maks] │                                                │
│  Lokasi COD          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  Urutkan             │  │ kartu│ │ kartu│ │ kartu│ │ kartu│           │
│  [Hapus semua filter]│  └──────┘ └──────┘ └──────┘ └──────┘           │
│                      │                                                │
│ ─────────            │             ‹ 1 2 3 … 7 ›                      │
│ Kategori             │                                                │
│  Jas praktikum       │                                                │
│  Buku kuliah         │                                                │
│  Alat laboratorium   │                                                │
│  Kalkulator          │                                                │
│  Jaket himpunan      │                                                │
│  Perlengkapan kos    │                                                │
└──────────────────────┴────────────────────────────────────────────────┘
```

Angka tetap:

| Bagian | Nilai |
| :--- | :--- |
| Tinggi top bar | 64 px, menempel di atas saat menggulir |
| Lebar rail kiri | 280 px, menggulir sendiri, menempel di bawah top bar |
| Padding area konten | 32 px |
| Lebar maksimum konten | 1096 px |
| Jarak antarkartu | 20 px |
| Lebar kartu minimum | 220 px |
| Jumlah kolom kartu | 4 (≥1440), 3 (1280), 2 (768 dan 375) |

### 5.3 Layar yang tidak memakai rail

I-01, I-02, I-03, dan I-15 adalah halaman berdiri sendiri: top bar tipis, konten di tengah dengan
lebar maksimum 1040 px (otentikasi) atau 720 px (dokumen legal). I-10 memakai layout dua panel
sendiri (daftar percakapan + ruang percakapan), tanpa rail filter.

---

## 6. Pustaka komponen

Setiap komponen di bawah dibuat **sekali** sebagai *component set*, lalu dipakai ulang di semua
layar. Keadaan (*state*) ditulis karena Bab 6 menuntut kolom "Reaksi sistem".

### 6.1 TopBar

Isi: logo ITBELI (kiri), kolom pencarian global (tengah, lebar 420 px), ikon notifikasi dengan
badge jumlah, ikon percakapan dengan badge jumlah, avatar dengan menu turun.

Keadaan: **tamu** (hanya tombol Masuk dan Daftar), **pengguna**, **admin** (menambah tautan Dasbor).

### 6.2 RailKiri

Isi berurutan: tombol primer "+ Jual Barang", blok Filter, pemisah, blok Kategori.
Pada tablet dan ponsel berubah menjadi panel yang dibuka tombol "Filter".

### 6.3 KartuProduk (C06)

```
┌─────────────────────┐
│ ▢ badge             │  foto rasio 1:1, object-fit: cover
│                     │  radius 12 px di sudut atas
│                     │
├─────────────────────┤
│ Rp120.000           │  price, 18/24, bobot 700
│ Jas Praktikum Kimia │  body, maksimum 2 baris, dipotong "…"
│ Ukuran M            │
│ Labtek V · Buku     │  caption, --text-600
└─────────────────────┘
```

Keadaan:

| Keadaan | Tampilan |
| :--- | :--- |
| Tersedia | Normal |
| Terjual | Foto diberi lapisan `--sold` 55 % + badge "Terjual" putih di tengah; harga dan judul meredup |
| Baru | Badge "Baru" hijau di pojok kiri atas foto (listing < 24 jam) |
| Disorot | `--shadow-md`, foto membesar 2 % di dalam bingkainya |
| Memuat | Kerangka abu dengan animasi denyut |

### 6.4 Tombol

| Varian | Latar | Teks | Pemakaian |
| :--- | :--- | :--- | :--- |
| Primer | `--green-700` | putih | Satu per layar: Masuk, Jual Barang, Kirim, Simpan |
| Sekunder | `--surface` + garis `--border` | `--text-900` | Batal, Daftar pada halaman masuk |
| Teks | transparan | `--green-700` | Tautan dalam kalimat |
| Merusak | `--danger` | putih | Hapus listing, Blokir akun |

Ukuran: tinggi 44 px (normal), 36 px (kecil), padding mendatar 20 px, radius 12 px.
Setiap tombol wajib punya keadaan **fokus** berupa cincin 2 px `--green-500` dengan jarak 2 px.

### 6.5 IsianFormulir

Label di atas isian (bukan placeholder sebagai label), isian tinggi 44 px, radius 12 px,
garis `--border`, dan satu baris keterangan di bawahnya.

Keadaan: normal, fokus (garis `--green-500` 2 px), galat (garis `--danger` + pesan merah di bawah),
nonaktif (latar `--bg`, teks `--text-400`).

Pesan galat ditulis sebagai perbaikan, bukan tuduhan: "Gunakan surel berdomain @itb.ac.id",
bukan "Surel salah".

### 6.6 Badge dan Chip

| Nama | Warna | Isi |
| :--- | :--- | :--- |
| Badge status listing | `--green-50` / `--sold` | "Tersedia" / "Terjual" |
| Badge status laporan | `--green-50` / `--warning-bg` / `--border` | "Baru" / "Sedang Ditinjau" / "Selesai" |
| Badge jumlah | `--danger`, teks putih, radius penuh | Angka pesan belum dibaca |
| Chip filter aktif | `--green-50`, teks `--green-900`, ikon silang | "Buku kuliah ✕" |
| Chip lokasi COD | `--surface` + garis | "Labtek V" |

### 6.7 Komponen lain

| Komponen | Isi pokok |
| :--- | :--- |
| **Galeri foto** | Foto utama besar + deretan 5 thumbnail; tombol ‹ › di tepi; klik membuka lightbox |
| **Lightbox** | Foto penuh di atas lapisan gelap 80 %, navigasi maju-mundur, tombol tutup |
| **DialogKonfirmasi** | Judul, kalimat dampak, isian alasan bila perlu, tombol Batal + tombol aksi |
| **Toast** | Muncul di kanan bawah, hilang sendiri setelah 4 detik, varian berhasil/galat |
| **Pagination** | ‹ 1 2 3 … 7 ›, halaman aktif berlatar `--green-700` |
| **EmptyState** | Ilustrasi garis, satu kalimat penjelasan, satu tombol jalan keluar |
| **Tab** | Garis bawah 2 px `--green-700` pada tab aktif |
| **GelembungPesan** | Pesan sendiri: `--green-700`, teks putih, rata kanan. Pesan lawan: `--surface` + garis, rata kiri. Cap waktu `caption` di bawah |
| **BarisTabel** | Tinggi 56 px, garis bawah `--border`, latar `--green-50` saat disorot |

---

## 7. Spesifikasi per layar

Setiap layar di bawah berisi: tujuan, kelas dan use case yang direalisasikan, struktur layout,
tabel objek siap salin ke Bab 6, serta keadaan khusus yang perlu digambar.

Penomoran objek: `IXX-Onn`, dengan `IXX` adalah ID layar dan `nn` nomor urut objek.

---

### I-01 — Masuk (Login)

**Kelas:** C01 `HalamanOtentikasi` · **Use case:** UC03 · **Status:** sudah dibuat (`layar01.png`)

Dua kolom: panel hero hijau di kiri (60 %) berisi tagline dan tiga foto contoh barang;
formulir masuk di kanan (40 %).

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I01-O01 | Text Field | "Email institusi" | Menyimpan `email`; validasi awal domain `@itb.ac.id` |
| I01-O02 | Text Field (password) | "Kata sandi" | Menyimpan `kataSandi`, teks tertutup |
| I01-O03 | Button (primer) | "Masuk" | `kirimFormulirLogin(email, kataSandi)` → `AkunController.login()` |
| I01-O04 | Button (sekunder) | "Daftar" | Membuka I-02 |
| I01-O05 | Label galat | Pesan kegagalan | `tampilkanPesanGalat()`: kredensial salah, akun belum terverifikasi, atau akun diblokir |
| I01-O06 | Info Box | "Khusus sivitas ITB…" | Peringatan agar kata sandi dan kode verifikasi tidak dibagikan |
| I01-O07 | Link | "Kebijakan Privasi", "Ketentuan Penggunaan" | Membuka I-15 |

Keadaan yang perlu digambar: normal, galat kredensial.

---

### I-02 — Daftar Akun

**Kelas:** C01 · **Use case:** UC01

Panel hero yang sama dengan I-01 agar kedua layar terasa satu keluarga; formulir kanan memuat
empat isian bertumpuk dan satu kotak centang persetujuan.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I02-O01 | Text Field | "Nama lengkap" | `nama` |
| I02-O02 | Text Field | "NIM" | `nim`, hanya angka |
| I02-O03 | Text Field | "Email institusi" | `email`; galat bila domain bukan `@itb.ac.id` (KF05) atau surel sudah terdaftar |
| I02-O04 | Text Field (password) | "Kata sandi" | `kataSandi`, disertai indikator kekuatan |
| I02-O05 | Checkbox | "Saya menyetujui Kebijakan Privasi dan Ketentuan Penggunaan" | `setujuKebijakan`; tombol daftar nonaktif selama belum dicentang (KF13) |
| I02-O06 | Link | "Kebijakan Privasi" | Membuka I-15 di tab baru, formulir tidak hilang |
| I02-O07 | Button (primer) | "Buat Akun" | `kirimFormulirPendaftaran()` → `AkunController.daftarAkun()`; berhasil → I-03 |
| I02-O08 | Link | "Sudah punya akun? Masuk" | Membuka I-01 |

Keadaan: normal, isian wajib kosong bertanda merah, surel sudah terdaftar.

---

### I-03 — Verifikasi Surel

**Kelas:** C01 · **Use case:** UC02

Kartu tunggal di tengah layar, lebar 480 px. Tidak ada rail, tidak ada navigasi lain:
layar ini hanya punya satu pekerjaan.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I03-O01 | Teks | "Kode verifikasi telah dikirim ke nama@itb.ac.id" | Surel diambil dari langkah pendaftaran |
| I03-O02 | OTP Input | 6 kotak angka | `kodeVerifikasi`; pindah fokus otomatis antarkotak |
| I03-O03 | Countdown | "Kode berlaku 14:59" | `sisaWaktu`, hitung mundur 15 menit; `resetHitungMundur()` setelah kode baru |
| I03-O04 | Button (primer) | "Verifikasi" | `kirimKodeVerifikasi()` → `AkunController.verifikasiAkun()`; berhasil → I-04 |
| I03-O05 | Button (teks) | "Kirim ulang kode" | Nonaktif sampai hitung mundur habis; `mintaKirimUlang()` |
| I03-O06 | Label galat | "Kode salah atau sudah kedaluwarsa" | `tampilkanPesanGalat()` |
| I03-O07 | Toast | "Kode verifikasi baru telah dikirim." | `tampilkanPesanSukses()` |

Keadaan: menunggu, kode salah, kode kedaluwarsa.

---

### I-04 — Katalog (Beranda)

**Kelas:** C05 `HalamanKatalog`, C06 `KartuProduk` · **Use case:** UC13

Layout penuh: top bar + rail kiri + grid kartu + pagination. Inilah halaman yang paling sering
dibuka, dan inilah layar yang paling banyak meniru Facebook Marketplace.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I04-O01 | Search Field | Placeholder "Cari jas praktikum, buku, kalkulator…" | `inputPencarian()`; menekan Enter membuka I-05 |
| I04-O02 | Button (primer) | "+ Jual Barang" | Membuka I-07 dalam mode pembuatan; bagi tamu mengarah ke I-01 |
| I04-O03 | Daftar Kategori | Jas praktikum, Buku kuliah, Alat laboratorium, Kalkulator, Jaket himpunan, Perlengkapan kos | `pilihFilter({kategori})`; memuat ulang grid dari halaman pertama |
| I04-O04 | Range Input | "Harga" — [Min] s.d. [Maks] | `validasiRentangHarga()`; kedua kolom ditandai merah bila min > maks |
| I04-O05 | Dropdown | "Lokasi titik temu COD" | Diisi dari `LokasiCOD.getDaftarLokasi()` |
| I04-O06 | Dropdown | "Urutkan: Terbaru / Harga terendah / Harga tertinggi" | `pilihUrutan()` |
| I04-O07 | Grid | Maksimum 20 `KartuProduk` | `tampilkanHasil()`; 4 kolom pada 1440 px (KF28) |
| I04-O08 | Kartu Produk | Foto, harga, judul, lokasi, kategori | `onClickDetail(idBarang)` → I-06 |
| I04-O09 | Pagination | ‹ 1 2 3 … › | `pindahHalaman()` lalu `gulirKeAtas()` |
| I04-O10 | Empty State | "Belum ada barang yang tersedia" | `tampilkanPesanKosong()`; pagination disembunyikan |
| I04-O11 | Ikon Notifikasi | Lonceng + badge jumlah | Membuka I-11 |
| I04-O12 | Ikon Percakapan | Gelembung + badge jumlah | Membuka I-10 |

Keadaan yang perlu digambar: **normal (terisi)**, **memuat (kerangka kartu)**, **kosong**.

---

### I-05 — Hasil Pencarian dan Filter

**Kelas:** C05, C06 · **Use case:** UC14

Sama dengan I-04, dengan tiga tambahan: judul "Hasil pencarian", baris chip filter aktif di atas
grid, dan tombol "Hapus Semua Filter".

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I05-O01 | Judul | "Hasil pencarian untuk \"kalkulator\"" | Menampilkan `kataKunci` yang sedang dipakai |
| I05-O02 | Teks | "37 barang ditemukan" | Dari `total` yang dikembalikan `KatalogController` |
| I05-O03 | Chip filter aktif | "Kalkulator ✕", "Rp0–Rp200.000 ✕", "Labtek V ✕" | `tampilkanFilterAktif()`; klik ✕ melepas satu filter |
| I05-O04 | Button (teks) | "Hapus Semua Filter" | `hapusSemuaFilter()` lalu `resetHalaman()` |
| I05-O05 | Grid | Hasil tersaring | Sama dengan I04-O07 |
| I05-O06 | Empty State | "Barang tidak ditemukan" + tombol "Hapus Semua Filter" | `tampilkanPesanKosong()` (KF29) |
| I05-O07 | Label galat rentang | "Harga minimum tidak boleh melebihi harga maksimum" | `tandaiRentangHarga()` |

Keadaan yang perlu digambar: **ada hasil** dan **tidak ditemukan**. Keadaan kedua inilah yang
paling sering terlupa pada dokumen perancangan, padahal ia dituntut KF29.

---

### I-06 — Detail Barang

**Kelas:** C07 `HalamanDetailBarang` · **Use case:** UC15, pintu masuk UC16 dan UC19

Tiga lajur: rail kiri, galeri foto di tengah, kolom informasi di kanan (lebar 380 px, menempel
saat menggulir).

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I06-O01 | Galeri | Foto utama + maksimum 5 thumbnail | `pilihFoto(indeks)`; klik membuka lightbox |
| I06-O02 | Lightbox | Foto ukuran penuh, navigasi ‹ › | `tampilkanLightbox()`; tidak meminta data ulang |
| I06-O03 | Judul | Nama barang | `tampilkanDetail()` |
| I06-O04 | Harga | "Rp120.000" | `price-lg`, angka tabular |
| I06-O05 | Chip | Kategori + lokasi COD | Dari `Kategori` dan `LokasiCOD` |
| I06-O06 | Teks meta | "Diunggah 2 hari lalu" | Waktu relatif |
| I06-O07 | Button (primer) | "Hubungi Penjual" | `onClickContact()` → `PercakapanController.mulaiPercakapan()` → I-10 |
| I06-O08 | Button (teks) | "Laporkan" | `onClickLapor()` → I-12 dengan listing ini sebagai objek |
| I06-O09 | Blok Detail | "Kondisi: Bekas, layak pakai" + deskripsi penjual | `tampilkanDetail()` |
| I06-O10 | Blok Penjual | Nama, NIM tersamar, tautan profil | `bukaProfilPenjual()` → I-09 |
| I06-O11 | Badge "Terjual" | Label pada foto | `tampilkanArsipTerjual()`; I06-O07 dinonaktifkan |
| I06-O12 | Aksi pemilik | "Ubah", "Hapus", "Tandai Terjual" | `tampilkanAksiPemilik()`; hanya muncul bila pemohon adalah pemilik |
| I06-O13 | Empty State | "Listing tidak ditemukan" + tombol kembali ke katalog | `tampilkanTidakDitemukan()` |

Keadaan yang perlu digambar (sesuai Algo-001 pada subbab 5.7.1):
**(a)** pengunjung biasa, **(b)** pemilik listing, **(c)** listing terjual, **(d)** tidak ditemukan.
Gambarkan setidaknya (a) dan (c) pada Bab 6.

---

### I-07 — Formulir Listing (Buat / Ubah)

**Kelas:** C04 `FormulirBarang` · **Use case:** UC07, UC09

> Layar ini **tidak** meniru Facebook, karena formulir *Create new listing* tidak dapat diamati
> tanpa masuk akun. Rancangan di bawah diturunkan dari operasi C04 pada subbab 5.4 DPPL.

Dua panel: formulir di kiri (640 px), **pratinjau kartu produk langsung** di kanan (320 px).
Pratinjau ini membuat penjual melihat tampilan listingnya di katalog sebelum menekan simpan,
sehingga judul yang terlalu panjang atau foto yang terpotong ketahuan lebih awal.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I07-O01 | Uploader | Area seret-dan-lepas, maksimum 5 foto | `pilihFoto()`; `validasiFotoSisiKlien()`: JPG/PNG, maksimum 5 MB (KF23, KF24) |
| I07-O02 | Daftar pratinjau foto | Thumbnail dengan tombol hapus dan penanda "Foto utama" | Urutan dapat diubah dengan seret |
| I07-O03 | Text Field | "Judul barang" | `judul`, wajib, maksimum 80 karakter dengan penghitung |
| I07-O04 | Number Field | "Harga (Rp)" | `harga`, wajib, angka positif; `validasiTipeData()` |
| I07-O05 | Dropdown | "Kategori" | `idKategori`, wajib, dari `Kategori.getDaftarKategori()` |
| I07-O06 | Dropdown | "Lokasi titik temu COD" | `idLokasi`, dari `LokasiCOD.getDaftarLokasi()` |
| I07-O07 | Textarea | "Deskripsi kondisi" | `deskripsiKondisi`, maksimum 1000 karakter |
| I07-O08 | Penanda galat | Garis merah pada isian wajib yang kosong | `tandaiIsianKosong()` (KF18) |
| I07-O09 | Button (primer) | "Publikasikan" / "Simpan Perubahan" | `kirimFormulir()` atau `onClickUpdate()`; berhasil → I-06 |
| I07-O10 | Button (sekunder) | "Batal" | Kembali tanpa menyimpan; memunculkan konfirmasi bila ada perubahan |
| I07-O11 | Pratinjau | `KartuProduk` yang diperbarui sambil mengetik | Memakai komponen 6.3, bukan gambar statis |
| I07-O12 | Toast | "Listing berhasil dibuat" | `tampilkanNotifikasi()` |

Keadaan: kosong (mode buat), terisi (mode ubah), galat validasi, foto ditolak.

---

### I-08 — Listing Saya

**Kelas:** C03 `HalamanListingPenjual`, C06 · **Use case:** UC08, UC10, UC11, UC12

Dua tab di atas grid: **Tersedia** dan **Terjual**. Setiap kartu memiliki baris aksi sendiri.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I08-O01 | Tab | "Tersedia (4)" / "Terjual (7)" | `pilihTab()`; jumlah dari `kelompokkanBerdasarkanStatus()` |
| I08-O02 | Kartu + aksi | `KartuProduk` + tombol Ubah / Hapus / Tandai Terjual | Aksi berbeda menurut tab yang aktif |
| I08-O03 | Button | "Ubah" | `onClickUbah()` → I-07 mode ubah |
| I08-O04 | Button (merusak) | "Hapus" | `onClickHapus()` → dialog konfirmasi |
| I08-O05 | Button | "Tandai Terjual" / "Batalkan Terjual" | `onClickTandaiTerjual()` / `onClickBatalTerjual()` |
| I08-O06 | Dialog Konfirmasi | "Hapus \"Jas Praktikum Kimia\"? Tindakan ini permanen." | `tampilkanKonfirmasi()`; tombol Batal + Hapus |
| I08-O07 | Toast | "Listing berhasil dihapus" | `tampilkanNotifikasi()` |
| I08-O08 | Empty State | "Anda belum punya listing" + tombol "+ Jual Barang" | Pada tab Tersedia yang kosong |

Keadaan yang perlu digambar: tab Tersedia terisi, dialog konfirmasi hapus terbuka.

---

### I-09 — Profil Akun

**Kelas:** C02 `HalamanProfil`, C06 · **Use case:** UC05

Kepala profil (avatar, nama, NIM, surel) lalu grid listing milik akun di bawahnya.
Layar ini juga dipakai saat pembeli membuka profil penjual dari I-06; bedanya menu pengaturan
tidak muncul.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I09-O01 | Blok identitas | Avatar, nama, NIM, surel | `tampilkanProfil(data)` (KF04) |
| I09-O02 | Grid | Listing milik akun | `tampilkanDaftarListing()` memanggil `KartuProduk.render()` |
| I09-O03 | Menu pengaturan | "Pengaturan akun", "Kebijakan Privasi", "Keluar" | `bukaPengaturanAkun()`; hanya pada profil sendiri |
| I09-O04 | Link | "Kebijakan Privasi" | `tampilkanTautanKebijakan()` → I-15 |
| I09-O05 | Button | "Keluar" | `kirimPermintaanLogout(token)` → `hapusTokenLokal()` → I-01 |
| I09-O06 | Badge | "Akun diblokir" | Muncul bagi admin yang melihat akun terblokir |

---

### I-10 — Percakapan

**Kelas:** C08 `HalamanPercakapan` · **Use case:** UC16, UC17, UC18

Dua panel: daftar percakapan di kiri (320 px), ruang percakapan di kanan.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I10-O01 | Daftar percakapan | Avatar, nama lawan bicara, cuplikan pesan terakhir, waktu, badge jumlah | `showDaftarPercakapan()` |
| I10-O02 | Kepala ruang | Nama lawan bicara + kartu kecil barang yang dibahas | Barang yang menjadi konteks percakapan |
| I10-O03 | Daftar pesan | Gelembung pesan berurutan + cap waktu | `tampilkanUrutanPesan()`; `gulirKePesanTerakhir()` saat dibuka |
| I10-O04 | Textarea | "Tulis pesan…" | `isiTeksInput`; `validasiInputKosong()` menolak pesan kosong |
| I10-O05 | Button (primer) | Ikon kirim | `kirimPesan(isi)` → `PercakapanController.kirimPesan()` |
| I10-O06 | Banner privasi | "Isi percakapan ini terenkripsi dan tidak dapat diakses admin maupun pengembang." | `tampilkanTautanKebijakan()` (KF39); tautan membuka I-15 |
| I10-O07 | Empty State | "Akses ditolak" | `tampilkanAksesDitolak()`; **tidak menampilkan isi pesan apa pun** (KF35) |
| I10-O08 | Empty State | "Belum ada percakapan" | Saat daftar kosong |

Banner privasi pada I10-O06 bukan hiasan. Ia adalah wujud visual dari US-05 dan KF39, dan
sebaiknya digambar dengan jelas pada mockup Bab 6.

---

### I-11 — Panel Notifikasi

**Kelas:** C09 `PanelNotifikasi` · **Use case:** pendukung UC17 dan tindakan moderasi

Panel turun dari ikon lonceng pada top bar, lebar 380 px, tinggi maksimum 480 px.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I11-O01 | Daftar notifikasi | Ikon jenis, teks, waktu relatif | `tampilkanDaftarNotifikasi()` |
| I11-O02 | Penanda belum dibaca | Titik hijau pada baris + badge angka pada ikon | `tampilkanPenandaBelumDibaca(jumlah)` |
| I11-O03 | Baris notifikasi | "Pesan baru dari Rani tentang Kalkulator FX-991" | Klik membuka I-10 pada percakapan terkait |
| I11-O04 | Baris notifikasi | "Listing Anda dihapus admin: alasan …" | Klik membuka I-15 atau detail terkait |
| I11-O05 | Empty State | "Belum ada notifikasi" | Saat daftar kosong |

---

### I-12 — Formulir Laporan

**Kelas:** C10 `FormulirLaporan` · **Use case:** UC19

Modal di atas layar sebelumnya, lebar 560 px, agar konteks objek yang dilaporkan tetap terlihat.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I12-O01 | Teks konteks | "Melaporkan: Jas Praktikum Kimia" | `objekDilaporkan` dari layar pemanggil |
| I12-O02 | Radio Group | "Penipuan" / "Konten tidak pantas" / "Bug" | `jenisPelanggaran`, wajib |
| I12-O03 | Textarea | "Alasan" | `teksAlasan`, wajib |
| I12-O04 | Uploader | "Bukti tangkapan layar" | `unggahBukti()`, minimal satu berkas |
| I12-O05 | Label galat | "Alasan dan bukti tangkapan layar wajib diisi" | `tandaiIsianKosong()` |
| I12-O06 | Button (primer) | "Kirim Laporan" | `kirimLaporan()` → `LaporanController.buatLaporan()` |
| I12-O07 | Toast | "Laporan berhasil dikirim" | `tampilkanNotifikasi()` |

---

### I-13 — Dasbor Admin: Daftar Laporan

**Kelas:** C11 `DasborAdmin` · **Use case:** UC20, UC21

Layout tabel, bukan grid kartu. Rail kiri diganti navigasi admin.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I13-O01 | Tab filter | "Semua / Baru / Sedang Ditinjau / Selesai" | `filterLaporan(status)` → `ModerasiController.filterByStatus()` |
| I13-O02 | Tabel | Kolom: ID, Objek, Kategori, Pelapor, Tanggal, Status, Aksi | `tampilkanDaftarLaporan()` |
| I13-O03 | Badge status | "Baru" / "Sedang Ditinjau" / "Selesai" | Warna mengikuti 6.6 |
| I13-O04 | Button | "Lihat Detail" | `bukaDetailLaporan()` → I-14 |
| I13-O05 | Dropdown status | Mengubah status langsung dari baris | `onClickUbahStatus()` |
| I13-O06 | Empty State | "Tidak ada laporan pada status ini" | Saat filter tidak menghasilkan baris |
| I13-O07 | Halaman Akses Ditolak | "Akses Ditolak" + pengalihan ke beranda | `tampilkanAksesDitolak()` bagi akun bukan admin (KF56) |

---

### I-14 — Dasbor Admin: Detail Laporan dan Tindakan Moderasi

**Kelas:** C11 · **Use case:** UC21, UC22, UC23, UC24

Dua kolom: rincian laporan dan bukti di kiri, panel tindakan di kanan.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I14-O01 | Blok rincian | Pelapor, objek, kategori, alasan, waktu | `tampilkanDetailLaporan()` |
| I14-O02 | Galeri bukti | Thumbnail tangkapan layar, klik memperbesar | Dari `BuktiLaporan` |
| I14-O03 | Blok objek | Ringkasan listing atau akun yang dilaporkan | Tautan ke I-06 atau I-09 |
| I14-O04 | Dropdown | "Status penanganan" | `onClickUbahStatus()` |
| I14-O05 | Button (merusak) | "Hapus Listing" | `onClickHapusListing()` → dialog + isian alasan |
| I14-O06 | Button (merusak) | "Blokir Akun" | `onClickBlokirAkun()` → dialog + isian alasan |
| I14-O07 | Button | "Buka Blokir Akun" | `onClickBukaBlokir()` → dialog konfirmasi |
| I14-O08 | Dialog Konfirmasi | Judul tindakan + textarea "Alasan" wajib | `tampilkanModalKonfirmasi()`; `konfirmasiTindakan(alasan)` |
| I14-O09 | Catatan privasi | "Isi percakapan tidak tersedia bagi admin." | Wujud visual KF35 dan KF38 |
| I14-O10 | Toast | "Akun berhasil diblokir" | `tampilkanStatusTerbaru()` |

I14-O09 penting: ia memperlihatkan bahwa jaminan privasi pada subbab 2.2.2 angka 4 benar-benar
tercermin di antarmuka admin, bukan hanya di diagram.

---

### I-15 — Dokumen Legal

**Kelas:** C12 `HalamanDokumenLegal` · **Use case:** UC06

Satu kolom teks, lebar maksimum 720 px, dengan daftar isi menempel di kiri pada layar lebar.

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| I15-O01 | Tab | "Kebijakan Privasi" / "Ketentuan Penggunaan" | `bukaDokumen(jenis)` |
| I15-O02 | Judul + versi | "Kebijakan Privasi — versi 1.0, berlaku 1 November 2026" | `tampilkanDokumen()` |
| I15-O03 | Isi dokumen | Teks berjenjang | Dari `DokumenLegal.getVersiTerbaru()` |
| I15-O04 | Blok sorotan | Kotak `--green-50` berisi klausul privasi percakapan | `sorotKlausaPrivasi()` |
| I15-O05 | Daftar isi | Tautan lompat antarbagian | Menempel saat menggulir |

---

## 8. Peta navigasi antarlayar

```
                    ┌──────────┐
                    │  I-01    │ Masuk
                    │  Login   │◄───────────── Keluar (I-09)
                    └────┬─────┘
            Daftar ──────┤
                    ┌────▼─────┐      ┌──────────┐
                    │  I-02    │─────►│  I-03    │ Verifikasi
                    │  Daftar  │      │  Surel   │
                    └──────────┘      └────┬─────┘
                                           │
  ┌────────────────────────────────────────▼─────────────────────────┐
  │                        I-04  KATALOG                             │
  └──┬──────────┬──────────────┬─────────────┬──────────┬────────────┘
     │          │              │             │          │
  cari       + Jual        klik kartu     lonceng    avatar
     │          │              │             │          │
┌────▼────┐ ┌───▼────┐   ┌─────▼─────┐  ┌────▼────┐ ┌───▼────┐
│  I-05   │ │  I-07  │   │   I-06    │  │  I-11   │ │  I-09  │
│  Hasil  │ │ Form   │   │  Detail   │  │ Notif   │ │ Profil │
│ Pencari │ │ Listing│   │  Barang   │  └────┬────┘ └───┬────┘
└────┬────┘ └───▲────┘   └──┬─────┬──┘       │          │
     │          │  ubah     │     │          │       Listing
     └──klik────┘        Hubungi Laporkan    │        Saya
        kartu   │           │     │          │          │
                │      ┌────▼──┐ ┌▼───────┐  │     ┌────▼───┐
            ┌───┴───┐  │ I-10  │ │ I-12   │  │     │  I-08  │
            │ I-08  │  │ Chat  │◄┘ Laporan │  └────►│ Listing│
            │Listing│  └───────┘ └────┬───┘        │  Saya  │
            │ Saya  │                 │            └────────┘
            └───────┘                 ▼
                              ┌───────────────┐
                              │ I-13 → I-14   │  (hanya admin)
                              │ Dasbor Admin  │
                              └───────────────┘

  I-15 Dokumen Legal dapat dibuka dari I-01, I-02, I-09, I-10, dan footer.
```

---

## 9. Panduan membangun di Figma

**Langkah 1 — Variables.** Buat satu *collection* bernama `ITBELI`, dengan group `color`,
`spacing`, dan `radius`, lalu isi dari bagian 4. Pakai nama token persis seperti di tabel,
supaya penamaan di Figma dan di CSS nanti sama.

**Langkah 2 — Text styles.** Buat delapan style dari tabel 4.2 (`display-lg` … `price-lg`).
Pasang `Source Serif 4` untuk dua style display dan `Inter` untuk sisanya.

**Langkah 3 — Komponen dasar.** Urutan membuat yang paling hemat waktu:
`Button` → `IsianFormulir` → `Badge` → `KartuProduk` → `TopBar` → `RailKiri`.
`KartuProduk` dibuat sebagai *component set* dengan properti `status` (Tersedia / Terjual / Baru)
dan `state` (Default / Hover / Loading).

**Langkah 4 — Auto layout.** Semua komponen memakai auto layout:

| Elemen | Pengaturan |
| :--- | :--- |
| Grid kartu | Horizontal wrap, gap 20, `fill container` |
| Kartu produk | Vertical, gap 8, padding 12, lebar `fill` |
| Rail kiri | Vertical, gap 24, padding 24, lebar tetap 280 |
| Baris isian formulir | Vertical, gap 6 (label → isian → keterangan) |
| Top bar | Horizontal, `space between`, padding 16 / 24 |

**Langkah 5 — Frame layar.** Buat 15 frame `1440 × 1043`, beri nama `I-01 Masuk`,
`I-02 Daftar Akun`, dan seterusnya persis seperti bagian 7. Nama frame inilah yang akan menjadi
nama berkas saat diekspor.

**Langkah 6 — Keadaan tambahan.** Untuk layar yang memerlukan lebih dari satu keadaan
(I-04 kosong, I-05 tidak ditemukan, I-06 terjual, I-08 dialog terbuka), buat frame terpisah dengan
akhiran huruf: `I-04b Katalog Kosong`. Di Bab 6 keduanya masuk sebagai gambar pada subbab yang sama.

**Langkah 7 — Ekspor.** Ekspor setiap frame sebagai PNG 1× ke `docs/M8/assets/` dengan nama
`layar01.png` … `layar15.png`, mengikuti nomor ID layar.

---

## 10. Mockup HTML yang sudah dibangun

Seluruh layar sudah diwujudkan sebagai halaman HTML di `src/mockup/`, dan PNG untuk BAB 6
dibangkitkan dari halaman-halaman itu. Pendekatan ini dipilih karena hasilnya dapat dipakai ulang
sebagai kerangka *front-end* pada tahap implementasi, dan karena memperbarui satu mockup cukup
dengan mengubah HTML-nya lalu merender ulang.

### 10.1 Susunan berkas

| Berkas | Isi |
| :--- | :--- |
| `src/mockup/tokens.css` | Seluruh token bagian 4 sebagai custom property pada `:root`, beserta skala tipografi. **Satu-satunya tempat kode warna ditulis.** |
| `src/mockup/components.css` | Kelas untuk setiap komponen bagian 6, ditambah ilustrasi barang sebagai SVG inline |
| `src/mockup/shell.js` | Menyisipkan top bar dan rail kiri, serta data contoh barang, supaya tidak diulang di 16 berkas |
| `src/mockup/I-XX-<nama>.html` | Satu berkas per layar; hanya menyusun komponen, tanpa CSS baru |
| `src/mockup/render.sh` | Merender seluruh halaman menjadi PNG 1440 × 1043 memakai Chrome *headless* |

Pemakaian `shell.js` dari dalam berkas layar:

```html
<div data-topbar></div>                      <!-- pengguna; "tamu" atau "admin" juga tersedia -->
<aside data-rail="katalog" data-aktif="Buku kuliah"></aside>
<div class="grid" data-cards="8"></div>      <!-- kartu produk dari data contoh -->
```

### 10.2 Merender ulang

```bash
bash src/mockup/render.sh
```

Perintah itu merender seluruh layar ke `docs/M8/assets/layarXX.png`. Untuk satu layar saja:

```bash
bash src/mockup/render.sh I-04-katalog layar04
```

Keduanya dijalankan dari akar repository dan memerlukan Chrome terpasang pada lokasi bakunya.

### 10.3 Data contoh

Data yang sama dipakai di seluruh layar supaya mockup terbaca sebagai satu produk, bukan
kumpulan halaman terpisah. Mockup dengan "Lorem ipsum" tidak menunjukkan apakah judul dua baris
merusak tata letak; mockup dengan judul sungguhan menunjukkannya.

| Barang | Harga | Kategori | Lokasi COD |
| :--- | :--- | :--- | :--- |
| Jas Praktikum Kimia Ukuran M | Rp120.000 | Jas praktikum | Labtek V |
| Kalkulator Casio FX-991EX | Rp180.000 | Kalkulator | Gedung Oktagon |
| Kalkulus Jilid 1 — Purcell edisi 9 | Rp85.000 | Buku kuliah | Perpustakaan Pusat |
| Jaket Himpunan HMIF 2023 | Rp250.000 | Jaket himpunan | Labtek V |
| Rak Buku Lipat 3 Susun | Rp60.000 | Perlengkapan kos | Gerbang Belakang |
| Set Alat Gelas Praktikum Dasar | Rp95.000 | Alat laboratorium | Labtek X |

### 10.4 Menambah atau mengubah layar

**Contoh prompt untuk satu layar baru:**

> Buat `src/mockup/I-16-<nama>.html`. Pakai `tokens.css`, `components.css`, dan `shell.js` yang
> sudah ada; jangan menambah warna atau ukuran huruf baru di luar token. Struktur: top bar 64 px,
> rail kiri 280 px, area konten berisi … . Halaman harus pas dalam 1440 × 1043 px tanpa menggulir.
> Lalu tambahkan barisnya ke `PETA` pada `render.sh` dan render.

Tiga hal yang membuat mockup gagal dirender dengan benar:

1. **Konten melebihi 1043 px.** `body` memakai `overflow: hidden`, sehingga kelebihan konten
   terpotong diam-diam. Periksa hasil PNG-nya, jangan hanya berkas HTML-nya.
2. **Warna ditulis langsung.** Bila kode heksadesimal muncul di berkas layar, perubahan token
   nanti tidak akan ikut terbawa.
3. **Ilustrasi barang memakai berkas foto.** Ilustrasi digambar sebagai SVG di `components.css`
   agar mockup tidak bergantung pada berkas gambar eksternal dan tidak membawa masalah hak cipta.

---

## 11. Checklist pengisian BAB 6

Bab 6 pada `docs/M8/K01_G02_DPPL2.md` terdiri atas 15 subbab layar (6.1–6.15) dan satu subbab
rekapitulasi (6.16).

- [x] Struktur subbab 6.1–6.16 tersusun
- [x] Tabel objek setiap layar terisi
- [x] `layar01.png` — I-01 Masuk
- [x] `layar02.png` — I-02 Daftar Akun
- [x] `layar03.png` — I-03 Verifikasi Surel
- [x] `layar04.png` — I-04 Katalog
- [x] `layar05.png` — I-05 Hasil Pencarian
- [x] `layar05b.png` — I-05 keadaan "Barang tidak ditemukan" (KF29)
- [x] `layar06.png` — I-06 Detail Barang
- [x] `layar06b.png` — I-06 keadaan listing terjual (KF26)
- [x] `layar07.png` — I-07 Formulir Listing
- [x] `layar08.png` — I-08 Listing Saya
- [x] `layar09.png` — I-09 Profil Akun
- [x] `layar10.png` — I-10 Percakapan
- [x] `layar11.png` — I-11 Panel Notifikasi
- [x] `layar12.png` — I-12 Formulir Laporan
- [x] `layar13.png` — I-13 Dasbor Admin: Daftar Laporan
- [x] `layar14.png` — I-14 Dasbor Admin: Detail Laporan
- [x] `layar14b.png` — I-14 dialog konfirmasi tindakan moderasi
- [x] `layar15.png` — I-15 Dokumen Legal
- [x] Tabel 6.16 (rekapitulasi seluruh antarmuka) diisi thumbnail
- [x] Baris revisi ditambahkan pada Daftar Perubahan

Seluruh 15 layar kini bersumber dari `src/mockup/`, sehingga perubahan token pada bagian 4
terbawa ke semuanya sekaligus. Rancangan awal I-01 yang dibuat manual tetap tersimpan pada
riwayat git (commit `5c39ba7`) dan dapat dikembalikan dengan:

```bash
git checkout 5c39ba7 -- docs/M8/assets/layar01.png
```

Yang masih bisa dikerjakan kemudian, bila tim ingin melengkapi:

- [ ] Varian responsif (ponsel 375 px) untuk I-04, I-06, dan I-10
- [ ] Keadaan "memuat" (kerangka kartu) pada I-04, memakai kelas `.skel` yang sudah tersedia

Hal yang paling sering ditegur asisten dan sudah diantisipasi di sini:

1. **Setiap objek pada tabel harus punya reaksi sistem**, bukan sekadar nama. Kolom "Keterangan"
   pada bagian 7 sudah menyebut operasi kelas atau layar tujuan.
2. **Keadaan kosong dan galat ikut digambar.** KF29 menuntut pesan "Barang tidak ditemukan";
   bila mockup hanya menampilkan katalog terisi, kebutuhan itu tidak terbukti dirancang.
3. **Setiap kelas *boundary* C01–C12 harus muncul di setidaknya satu layar.** Pemetaannya ada
   pada judul masing-masing subbab bagian 7, dan lengkap: C01 (I-01…I-03), C02 (I-09), C03 (I-08),
   C04 (I-07), C05 (I-04, I-05), C06 (I-04, I-05, I-08, I-09), C07 (I-06), C08 (I-10), C09 (I-11),
   C10 (I-12), C11 (I-13, I-14), C12 (I-15).
