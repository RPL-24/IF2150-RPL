// Isi Kebijakan Privasi dan Ketentuan Penggunaan ITBELI versi 1.0 (C40 DokumenLegal).
// Format isi: baris "## Judul" memulai satu bagian; paragraf dipisahkan baris kosong.

const KLAUSA_PRIVASI_PESAN =
  'Isi percakapan tidak dapat diakses admin maupun pengembang. ' +
  'Pesan antarpengguna disimpan dalam bentuk terenkripsi. Moderasi dijalankan berdasarkan laporan ' +
  'pengguna terhadap listing atau akun, bukan melalui pembacaan isi percakapan.';

const KEBIJAKAN_PRIVASI = `## 1. Data yang kami kumpulkan
ITBELI menyimpan nama, NIM, dan surel institusi yang Anda masukkan saat mendaftar, beserta data listing yang Anda publikasikan. Kata sandi tidak pernah disimpan dalam bentuk teks biasa, melainkan hanya nilai hash-nya.

## 2. Penggunaan data
Data identitas dipakai untuk memastikan bahwa setiap pihak dalam transaksi benar-benar merupakan sivitas ITB. Nama dan NIM Anda ditampilkan kepada lawan transaksi agar kedua pihak dapat saling mempertanggungjawabkan kesepakatan COD.

Surel institusi dipakai untuk mengirim kode verifikasi dan pemberitahuan tindakan moderasi. ITBELI tidak mengirim surel promosi dan tidak membagikan data Anda kepada pihak ketiga.

## 3. Privasi percakapan
Isi percakapan hanya dapat dibaca oleh kedua peserta percakapan. Admin dan pengembang tidak memiliki jalur akses menuju isi pesan, baik melalui dasbor moderasi maupun melalui laporan pengguna. Pesan disimpan dalam bentuk terenkripsi.

Laporan yang menyangkut percakapan hanya memuat ID percakapan, waktu, dan identitas pelapor, tanpa kutipan pesan.

## 4. Moderasi dan pelaporan
Admin dapat menghapus listing dan memblokir akun yang terbukti melanggar setelah menerima laporan pengguna. Setiap tindakan moderasi dicatat beserta pelaku, objek, waktu, dan alasannya, lalu diberitahukan kepada pengguna yang bersangkutan melalui surel.

## 5. Penyimpanan dan keamanan
Seluruh data disimpan pada basis data dengan koneksi terenkripsi. Foto listing dan berkas bukti laporan disimpan terpisah dari data identitas. Sesi login berlaku paling lama 24 jam dan dapat Anda akhiri kapan saja melalui tombol Keluar.

## 6. Hak pengguna
Anda dapat mengubah atau menghapus listing milik Anda kapan saja, serta meminta penghapusan akun beserta datanya melalui formulir pelaporan.

## 7. Perubahan kebijakan
Kebijakan ini dapat diperbarui dari waktu ke waktu. Setiap perubahan diterbitkan sebagai versi baru beserta tanggal berlakunya, dan versi terbaru selalu dapat dibaca pada halaman ini.`;

const KETENTUAN_PENGGUNAAN = `## 1. Ketentuan umum
ITBELI adalah platform jual beli barang bekas khusus sivitas ITB. Dengan membuat akun, Anda menyetujui ketentuan ini beserta Kebijakan Privasi ITBELI.

## 2. Akun
Pendaftaran hanya terbuka bagi pemilik surel berdomain @itb.ac.id. Satu surel hanya dapat dipakai untuk satu akun. Anda bertanggung jawab menjaga kerahasiaan kata sandi dan kode verifikasi, serta atas seluruh aktivitas yang terjadi melalui akun Anda.

## 3. Listing barang
Listing harus menggambarkan barang yang benar-benar Anda miliki, dengan judul, harga, deskripsi kondisi, kategori, lokasi titik temu, dan foto yang sesuai keadaan sebenarnya. Tandai listing sebagai terjual setelah transaksi selesai.

## 4. Transaksi COD
Transaksi dilakukan secara langsung (cash on delivery) di titik temu yang disepakati. ITBELI hanya mempertemukan penjual dan pembeli, tidak memproses pembayaran, dan tidak menjamin kondisi barang. Periksa barang sebelum membayar.

## 5. Larangan
Pengguna dilarang menjual barang ilegal atau berbahaya, mengunggah konten tidak pantas, melakukan penipuan, menyamar sebagai pihak lain, serta mengganggu atau meneror pengguna lain melalui percakapan.

## 6. Moderasi dan sanksi
Admin berhak menghapus listing dan memblokir akun yang terbukti melanggar ketentuan ini berdasarkan laporan pengguna. Pengguna yang terkena tindakan moderasi akan menerima pemberitahuan beserta alasannya melalui surel.

## 7. Perubahan ketentuan
Ketentuan ini dapat diperbarui dari waktu ke waktu. Setiap perubahan diterbitkan sebagai versi baru beserta tanggal berlakunya.`;

module.exports = [
  {
    jenis: 'kebijakan-privasi',
    judul: 'Kebijakan Privasi',
    isi: KEBIJAKAN_PRIVASI,
    klausa: KLAUSA_PRIVASI_PESAN,
    versi: '1.0',
    tanggalBerlaku: '2026-11-01',
    tautan: '/legal?jenis=kebijakan-privasi',
  },
  {
    jenis: 'ketentuan-penggunaan',
    judul: 'Ketentuan Penggunaan',
    isi: KETENTUAN_PENGGUNAAN,
    klausa: KLAUSA_PRIVASI_PESAN,
    versi: '1.0',
    tanggalBerlaku: '2026-11-01',
    tautan: '/legal?jenis=ketentuan-penggunaan',
  },
];
