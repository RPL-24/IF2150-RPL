# Cara Menjalankan & Akun Uji

Panduan singkat untuk menjalankan MahaSehat dan login sebagai tiap peran.
Perintah ditulis untuk PowerShell di Windows.

---

## 1. Jalankan aplikasi

```powershell
cd "C:\Users\user\Documents\ITB\Semester 3\IF2150 Rekayasa Perangkat Lunak\IF2150-RPL-K03-G04\src"

npm install        # cukup sekali
npm start
```

- Server berjalan di **http://localhost:3000**.
- Butuh PostgreSQL aktif dan `src/.env` berisi `DATABASE_URL` (sudah terisi).
- Buka `http://localhost:3000` → diarahkan ke halaman login.
- Hentikan server dengan `Ctrl+C`. Kalau port 3000 dipakai proses lain
  (`EADDRINUSE`), matikan proses lama dulu atau jalankan dengan port lain:
  `$env:PORT=3100; node server.js`.

Tidak perlu menjalankan `npm run db:seed` lagi: database saat ini sudah berisi
skema + data demo. Perintah itu hanya untuk database kosong karena
`schema.sql` belum memakai `IF NOT EXISTS`.

---

## 2. Akun uji

Password semua akun seed: **`Password123!`**

| Peran | Email | Keterangan |
|---|---|---|
| Pelajar | `budi.pelajar@mahasehat.id` | punya riwayat check-in, terhubung ke wali Santoso |
| Pelajar | `citra.pelajar@mahasehat.id` | punya riwayat check-in |
| Pelajar (pending) | `andi.siswa@mahasehat.id` | status **Belum Terverifikasi** — untuk tes konfirmasi wali |
| Wali | `santoso.wali@mahasehat.id` | terhubung ke pelajar Budi |
| Wali | `ratna.wali@mahasehat.id` | akun wali kedua |
| Nakes | `siti.psikolog@mahasehat.id` | punya slot jadwal + 1 pengajuan masuk |
| Nakes | `hendra.psikiater@mahasehat.id` | punya slot, tanpa pengajuan masuk |
| Nakes | `nadia.psikolog@mahasehat.id` | punya slot jadwal |

Akun lain yang mungkin terlihat di DB (`apaya@gmail.com`,
`rennndysp@gmail.com`, `rina.1794146877759@test.com`, dst.) dibuat manual
sebelumnya dan password-nya tidak dijamin sama.

### Kalau login akun seed ditolak

Hash password seed bisa kembali ke placeholder setelah database diutak-atik.
Setel ulang satu akun lewat perintah ini (ganti emailnya):

```powershell
node -e 'const db=require("./config/db"),b=require("bcryptjs");(async()=>{const h=await b.hash("Password123!",12);const r=await db.query("UPDATE pengguna SET password_hash=$1 WHERE email=$2",[h,"budi.pelajar@mahasehat.id"]);console.log("diperbarui:",r.rowCount);process.exit(0)})()'
```

---

## 3. Halaman per peran

| Peran | Setelah login masuk ke | Menu utama |
|---|---|---|
| Pelajar | `DashboardPagePelajar.html` | Dashboard, Laporan Kesehatan, Konsultasi, Setelan |
| Wali | `DashboardPageOrangTuaWali.html` | Dashboard, Laporan Kesehatan, Notifikasi, Setelan |
| Nakes | `DashboardPageTenagaKesehatan.html` | Dashboard, Konsultasi, Setelan |

URL langsung:

- Login: `http://localhost:3000/views/LoginPage.html`
- Registrasi: `.../RegistrationPagePelajar.html` (ada tab Pelajar / Wali / Nakes)
- Reset sandi: `.../ResetPasswordPage.html?demo=1`
- Konfirmasi wali: `.../KonfirmasiRegistrasiPage.html?token=<token>`

---

## 4. Skenario cepat

1. **Login & guard** — buka `views/DashboardPagePelajar.html` tanpa login →
   dilempar ke LoginPage. Login `budi.pelajar@…` → dashboard terisi data DB.
2. **Check-in** — Dashboard → Mulai check-in → 5 langkah → "Check-in tersimpan";
   dashboard dan Laporan Kesehatan ikut berubah.
3. **Konfirmasi wali** — daftar pelajar dengan tanggal lahir < 18 tahun dan email
   wali `santoso.wali@…`. Tautan konfirmasi dicetak di terminal server:
   `[Mail] Konfirmasi untuk ...: http://localhost:3000/konfirmasi-registrasi?token=...`
   Buka tautan → Setujui. Token lama `andi.siswa` bisa dilihat lewat:
   ```sql
   SELECT token_konfirmasi FROM pengguna WHERE email = 'andi.siswa@mahasehat.id';
   ```
4. **Konsultasi pelajar** — login `citra.pelajar@…` → Konsultasi → pilih nakes →
   Jadwalkan → pilih slot → keluhan minimal 10 karakter → Buat Janji.
5. **Manajemen nakes** — login `siti.psikolog@…` → Konsultasi → kartu pengajuan
   masuk → Setujui / Jadwalkan Ulang / Tolak.
6. **Setelan** — ubah nama/telepon lalu simpan; toast muncul di kanan bawah.
7. **Logout** — tombol Keluar di sidebar; token lama langsung tidak berlaku.

---

## 5. Reset data demo

Opsi paling bersih: buat database baru, isi `.env`, lalu:

```powershell
npm run db:init      # buat skema
npm run db:seed      # isi data demo + password Password123!
```

Jangan jalankan `db:init` di database yang sudah berisi tabel — `schema.sql`
belum idempotent dan akan gagal di `CREATE TABLE` pertama.
