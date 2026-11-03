-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PELANGGAN', 'PEMBERI_JASA', 'LAYANAN_PELANGGAN');

-- CreateTable
CREATE TABLE "pengguna" (
    "id_pengguna" TEXT NOT NULL,
    "nama_pengguna" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomor_telpon" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PELANGGAN',
    "avatar_url" TEXT,
    "akumulasi_rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "riwayat_rating" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id_pengguna")
);

-- CreateTable
CREATE TABLE "kategori_jasa" (
    "id_kategori_jasa" TEXT NOT NULL,
    "jenis_jasa" TEXT NOT NULL,
    "deskripsi_jasa" TEXT NOT NULL,
    "tarif" DOUBLE PRECISION NOT NULL,
    "jam_kerja" TEXT NOT NULL,
    "daerah_kerja" TEXT NOT NULL,

    CONSTRAINT "kategori_jasa_pkey" PRIMARY KEY ("id_kategori_jasa")
);

-- CreateTable
CREATE TABLE "pemberi_jasa" (
    "id_pemberi_jasa" TEXT NOT NULL,
    "nama_toko" TEXT NOT NULL DEFAULT '',
    "id_kategori_jasa" TEXT,
    "jenis_jasa" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status_ketersediaan" TEXT NOT NULL DEFAULT 'Available',
    "is_online" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "pemberi_jasa_pkey" PRIMARY KEY ("id_pemberi_jasa")
);

-- CreateTable
CREATE TABLE "layanan_pelanggan" (
    "id_layanan_pelanggan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "jumlah_tiket_dipegang" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "layanan_pelanggan_pkey" PRIMARY KEY ("id_layanan_pelanggan")
);

-- CreateTable
CREATE TABLE "kontrak_pekerjaan" (
    "id_kontrak_pekerjaan" TEXT NOT NULL,
    "id_pelanggan" TEXT NOT NULL,
    "id_pemberi_jasa" TEXT NOT NULL,
    "detail_pekerjaan" TEXT NOT NULL,
    "persetujuan_harga" INTEGER NOT NULL,
    "status_pekerjaan" TEXT NOT NULL DEFAULT 'Menunggu',
    "has_rating" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "kontrak_pekerjaan_pkey" PRIMARY KEY ("id_kontrak_pekerjaan")
);

-- CreateTable
CREATE TABLE "komunikasi" (
    "id_chat" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "id_penerima" TEXT NOT NULL,
    "id_tiket" TEXT,
    "isi_pesan" TEXT NOT NULL,
    "lampiran_url" TEXT,
    "waktu_terkirim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_chat_terbaca" BOOLEAN NOT NULL DEFAULT false,
    "status_chat" TEXT NOT NULL DEFAULT 'SENT',
    "durasi_chat" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "komunikasi_pkey" PRIMARY KEY ("id_chat")
);

-- CreateTable
CREATE TABLE "tiket_laporan" (
    "id_tiket" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "id_layanan_pelanggan" TEXT,
    "jenis_tiket" TEXT NOT NULL,
    "keterangan_tiket" TEXT NOT NULL,
    "bukti_foto_url" TEXT,
    "tanggal_tiket" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_tiket" TEXT NOT NULL DEFAULT 'Open',

    CONSTRAINT "tiket_laporan_pkey" PRIMARY KEY ("id_tiket")
);

-- CreateTable
CREATE TABLE "rating" (
    "id_rating" TEXT NOT NULL,
    "id_pengguna_pemberi" TEXT NOT NULL,
    "id_pengguna_penerima" TEXT NOT NULL,
    "id_kontrak_pekerjaan" TEXT NOT NULL,
    "nilai_rating" DOUBLE PRECISION NOT NULL,
    "ulasan" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tanggal_rating" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id_rating")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id_notifikasi" TEXT NOT NULL,
    "id_penerima" TEXT NOT NULL,
    "isi_pesan" TEXT NOT NULL,
    "waktu_notifikasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_baca" TEXT NOT NULL DEFAULT 'Unread',

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id_notifikasi")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rating_id_kontrak_pekerjaan_key" ON "rating"("id_kontrak_pekerjaan");

-- AddForeignKey
ALTER TABLE "pemberi_jasa" ADD CONSTRAINT "pemberi_jasa_id_pemberi_jasa_fkey" FOREIGN KEY ("id_pemberi_jasa") REFERENCES "pengguna"("id_pengguna") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemberi_jasa" ADD CONSTRAINT "pemberi_jasa_id_kategori_jasa_fkey" FOREIGN KEY ("id_kategori_jasa") REFERENCES "kategori_jasa"("id_kategori_jasa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "layanan_pelanggan" ADD CONSTRAINT "layanan_pelanggan_id_layanan_pelanggan_fkey" FOREIGN KEY ("id_layanan_pelanggan") REFERENCES "pengguna"("id_pengguna") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontrak_pekerjaan" ADD CONSTRAINT "kontrak_pekerjaan_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontrak_pekerjaan" ADD CONSTRAINT "kontrak_pekerjaan_id_pemberi_jasa_fkey" FOREIGN KEY ("id_pemberi_jasa") REFERENCES "pemberi_jasa"("id_pemberi_jasa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komunikasi" ADD CONSTRAINT "komunikasi_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komunikasi" ADD CONSTRAINT "komunikasi_id_penerima_fkey" FOREIGN KEY ("id_penerima") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komunikasi" ADD CONSTRAINT "komunikasi_id_tiket_fkey" FOREIGN KEY ("id_tiket") REFERENCES "tiket_laporan"("id_tiket") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiket_laporan" ADD CONSTRAINT "tiket_laporan_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiket_laporan" ADD CONSTRAINT "tiket_laporan_id_layanan_pelanggan_fkey" FOREIGN KEY ("id_layanan_pelanggan") REFERENCES "layanan_pelanggan"("id_layanan_pelanggan") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_id_pengguna_pemberi_fkey" FOREIGN KEY ("id_pengguna_pemberi") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_id_pengguna_penerima_fkey" FOREIGN KEY ("id_pengguna_penerima") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_id_kontrak_pekerjaan_fkey" FOREIGN KEY ("id_kontrak_pekerjaan") REFERENCES "kontrak_pekerjaan"("id_kontrak_pekerjaan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_id_penerima_fkey" FOREIGN KEY ("id_penerima") REFERENCES "pengguna"("id_pengguna") ON DELETE RESTRICT ON UPDATE CASCADE;
