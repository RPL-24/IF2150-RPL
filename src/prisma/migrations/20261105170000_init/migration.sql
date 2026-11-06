-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "peran" AS ENUM ('WARGA', 'TEKNISI', 'PENGURUS');

-- CreateEnum
CREATE TYPE "status_akun" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "jenis_perangkat" AS ENUM ('TANGKI_AIR', 'BATERAI', 'PANEL_SURYA');

-- CreateEnum
CREATE TYPE "status_pengiriman" AS ENUM ('PENDING', 'TERKIRIM');

-- CreateEnum
CREATE TYPE "status_laporan" AS ENUM ('MENUNGGU', 'SEDANG_DIPERBAIKI', 'SELESAI');

-- CreateEnum
CREATE TYPE "status_tagihan" AS ENUM ('DRAFT', 'FINAL');

-- CreateTable
CREATE TABLE "akun" (
    "id_akun" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "peran" "peran" NOT NULL,
    "password" TEXT NOT NULL,
    "status_akun" "status_akun" NOT NULL DEFAULT 'MENUNGGU',
    "waktu_pengajuan" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "akun_pkey" PRIMARY KEY ("id_akun")
);

-- CreateTable
CREATE TABLE "warga" (
    "id_warga" SERIAL NOT NULL,
    "id_akun" TEXT NOT NULL,
    "id_komunitas" TEXT NOT NULL,
    "status_terdaftar" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "warga_pkey" PRIMARY KEY ("id_warga")
);

-- CreateTable
CREATE TABLE "teknisi" (
    "id_teknisi" TEXT NOT NULL,
    "id_akun" TEXT NOT NULL,
    "kontak" TEXT,

    CONSTRAINT "teknisi_pkey" PRIMARY KEY ("id_teknisi")
);

-- CreateTable
CREATE TABLE "pengurus" (
    "id_pengurus" TEXT NOT NULL,
    "id_akun" TEXT NOT NULL,

    CONSTRAINT "pengurus_pkey" PRIMARY KEY ("id_pengurus")
);

-- CreateTable
CREATE TABLE "perangkat" (
    "id_perangkat" TEXT NOT NULL,
    "jenis_perangkat" "jenis_perangkat" NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "volume_liter" DOUBLE PRECISION,
    "kapasitas_liter" DOUBLE PRECISION,
    "ambang_rendah" DOUBLE PRECISION,
    "ambang_kritis" DOUBLE PRECISION,
    "kapasitas_persen" DOUBLE PRECISION,
    "ambang_batas_aman" DOUBLE PRECISION,
    "daya_watt" DOUBLE PRECISION,
    "kapasitas" DOUBLE PRECISION,

    CONSTRAINT "perangkat_pkey" PRIMARY KEY ("id_perangkat")
);

-- CreateTable
CREATE TABLE "pembacaan_sensor" (
    "id_pembacaan" TEXT NOT NULL,
    "id_perangkat" TEXT NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL,
    "waktu" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pembacaan_sensor_pkey" PRIMARY KEY ("id_pembacaan")
);

-- CreateTable
CREATE TABLE "data_historis_kinerja" (
    "id_data" TEXT NOT NULL,
    "id_panel" TEXT NOT NULL,
    "waktu" TIMESTAMPTZ(3) NOT NULL,
    "daya_dihasilkan" DOUBLE PRECISION NOT NULL,
    "energi" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "data_historis_kinerja_pkey" PRIMARY KEY ("id_data")
);

-- CreateTable
CREATE TABLE "laporan_gangguan" (
    "id_laporan" TEXT NOT NULL,
    "id_warga" INTEGER NOT NULL,
    "jenis_gangguan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "foto" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "waktu_dibuat" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "status_laporan" NOT NULL DEFAULT 'MENUNGGU',

    CONSTRAINT "laporan_gangguan_pkey" PRIMARY KEY ("id_laporan")
);

-- CreateTable
CREATE TABLE "riwayat_status_laporan" (
    "id_riwayat" TEXT NOT NULL,
    "id_laporan" TEXT NOT NULL,
    "status" "status_laporan" NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_status_laporan_pkey" PRIMARY KEY ("id_riwayat")
);

-- CreateTable
CREATE TABLE "penugasan_laporan" (
    "id_penugasan" TEXT NOT NULL,
    "id_teknisi" TEXT NOT NULL,
    "id_laporan" TEXT NOT NULL,
    "waktu_penugasan" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penugasan_laporan_pkey" PRIMARY KEY ("id_penugasan")
);

-- CreateTable
CREATE TABLE "penugasan_perangkat" (
    "id_penugasan" TEXT NOT NULL,
    "id_teknisi" TEXT NOT NULL,
    "id_perangkat" TEXT NOT NULL,

    CONSTRAINT "penugasan_perangkat_pkey" PRIMARY KEY ("id_penugasan")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id_notifikasi" TEXT NOT NULL,
    "id_teknisi" TEXT NOT NULL,
    "id_perangkat" TEXT,
    "pesan" TEXT NOT NULL,
    "level" TEXT,
    "kapasitas_saat_ini" DOUBLE PRECISION,
    "status_pengiriman" "status_pengiriman" NOT NULL DEFAULT 'PENDING',
    "status_baca" BOOLEAN NOT NULL DEFAULT false,
    "waktu" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id_notifikasi")
);

-- CreateTable
CREATE TABLE "catatan_pemeliharaan" (
    "id_catatan" TEXT NOT NULL,
    "id_teknisi" TEXT NOT NULL,
    "id_perangkat" TEXT NOT NULL,
    "waktu_pelaksanaan" TIMESTAMPTZ(3) NOT NULL,
    "tindakan" TEXT NOT NULL,
    "catatan_hasil" TEXT NOT NULL,

    CONSTRAINT "catatan_pemeliharaan_pkey" PRIMARY KEY ("id_catatan")
);

-- CreateTable
CREATE TABLE "periode" (
    "id_periode" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status_final" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "periode_pkey" PRIMARY KEY ("id_periode")
);

-- CreateTable
CREATE TABLE "data_pemakaian" (
    "id_pemakaian" TEXT NOT NULL,
    "id_warga" INTEGER NOT NULL,
    "id_periode" TEXT NOT NULL,
    "volume_air_m3" DECIMAL(12,3),
    "energi_kwh" DECIMAL(12,3),
    "waktu_catat" TIMESTAMPTZ(3),

    CONSTRAINT "data_pemakaian_pkey" PRIMARY KEY ("id_pemakaian")
);

-- CreateTable
CREATE TABLE "aturan_tarif" (
    "id_aturan" TEXT NOT NULL,
    "id_periode" TEXT NOT NULL,
    "tarif_air_per_m3" DECIMAL(14,2) NOT NULL,
    "tarif_energi_per_kwh" DECIMAL(14,2) NOT NULL,
    "biaya_tetap" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "aturan_tarif_pkey" PRIMARY KEY ("id_aturan")
);

-- CreateTable
CREATE TABLE "tagihan" (
    "id_tagihan" TEXT NOT NULL,
    "id_warga" INTEGER NOT NULL,
    "id_periode" TEXT NOT NULL,
    "jumlah_iuran" DECIMAL(14,2) NOT NULL,
    "data_pemakaian_dasar" TEXT NOT NULL,
    "status" "status_tagihan" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "tagihan_pkey" PRIMARY KEY ("id_tagihan")
);

-- CreateTable
CREATE TABLE "rekapitulasi" (
    "id_rekap" TEXT NOT NULL,
    "id_periode" TEXT NOT NULL,
    "total_pemakaian_air" DECIMAL(14,3) NOT NULL,
    "total_pemakaian_energi" DECIMAL(14,3) NOT NULL,
    "total_iuran" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "rekapitulasi_pkey" PRIMARY KEY ("id_rekap")
);

-- CreateIndex
CREATE UNIQUE INDEX "akun_email_key" ON "akun"("email");

-- CreateIndex
CREATE INDEX "akun_status_akun_idx" ON "akun"("status_akun");

-- CreateIndex
CREATE UNIQUE INDEX "warga_id_akun_key" ON "warga"("id_akun");

-- CreateIndex
CREATE UNIQUE INDEX "teknisi_id_akun_key" ON "teknisi"("id_akun");

-- CreateIndex
CREATE UNIQUE INDEX "pengurus_id_akun_key" ON "pengurus"("id_akun");

-- CreateIndex
CREATE INDEX "perangkat_jenis_perangkat_idx" ON "perangkat"("jenis_perangkat");

-- CreateIndex
CREATE INDEX "pembacaan_sensor_id_perangkat_waktu_idx" ON "pembacaan_sensor"("id_perangkat", "waktu");

-- CreateIndex
CREATE INDEX "data_historis_kinerja_id_panel_waktu_idx" ON "data_historis_kinerja"("id_panel", "waktu");

-- CreateIndex
CREATE INDEX "laporan_gangguan_id_warga_waktu_dibuat_idx" ON "laporan_gangguan"("id_warga", "waktu_dibuat");

-- CreateIndex
CREATE INDEX "riwayat_status_laporan_id_laporan_timestamp_idx" ON "riwayat_status_laporan"("id_laporan", "timestamp");

-- CreateIndex
CREATE INDEX "penugasan_laporan_id_laporan_idx" ON "penugasan_laporan"("id_laporan");

-- CreateIndex
CREATE UNIQUE INDEX "penugasan_laporan_id_teknisi_id_laporan_key" ON "penugasan_laporan"("id_teknisi", "id_laporan");

-- CreateIndex
CREATE INDEX "penugasan_perangkat_id_perangkat_idx" ON "penugasan_perangkat"("id_perangkat");

-- CreateIndex
CREATE UNIQUE INDEX "penugasan_perangkat_id_teknisi_id_perangkat_key" ON "penugasan_perangkat"("id_teknisi", "id_perangkat");

-- CreateIndex
CREATE INDEX "notifikasi_id_teknisi_status_pengiriman_idx" ON "notifikasi"("id_teknisi", "status_pengiriman");

-- CreateIndex
CREATE INDEX "catatan_pemeliharaan_id_perangkat_waktu_pelaksanaan_idx" ON "catatan_pemeliharaan"("id_perangkat", "waktu_pelaksanaan");

-- CreateIndex
CREATE INDEX "catatan_pemeliharaan_id_teknisi_idx" ON "catatan_pemeliharaan"("id_teknisi");

-- CreateIndex
CREATE UNIQUE INDEX "periode_bulan_tahun_key" ON "periode"("bulan", "tahun");

-- CreateIndex
CREATE INDEX "data_pemakaian_id_periode_idx" ON "data_pemakaian"("id_periode");

-- CreateIndex
CREATE UNIQUE INDEX "data_pemakaian_id_warga_id_periode_key" ON "data_pemakaian"("id_warga", "id_periode");

-- CreateIndex
CREATE UNIQUE INDEX "aturan_tarif_id_periode_key" ON "aturan_tarif"("id_periode");

-- CreateIndex
CREATE INDEX "tagihan_id_periode_idx" ON "tagihan"("id_periode");

-- CreateIndex
CREATE UNIQUE INDEX "tagihan_id_warga_id_periode_key" ON "tagihan"("id_warga", "id_periode");

-- CreateIndex
CREATE INDEX "rekapitulasi_id_periode_idx" ON "rekapitulasi"("id_periode");

-- AddForeignKey
ALTER TABLE "warga" ADD CONSTRAINT "warga_id_akun_fkey" FOREIGN KEY ("id_akun") REFERENCES "akun"("id_akun") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teknisi" ADD CONSTRAINT "teknisi_id_akun_fkey" FOREIGN KEY ("id_akun") REFERENCES "akun"("id_akun") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengurus" ADD CONSTRAINT "pengurus_id_akun_fkey" FOREIGN KEY ("id_akun") REFERENCES "akun"("id_akun") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembacaan_sensor" ADD CONSTRAINT "pembacaan_sensor_id_perangkat_fkey" FOREIGN KEY ("id_perangkat") REFERENCES "perangkat"("id_perangkat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_historis_kinerja" ADD CONSTRAINT "data_historis_kinerja_id_panel_fkey" FOREIGN KEY ("id_panel") REFERENCES "perangkat"("id_perangkat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_gangguan" ADD CONSTRAINT "laporan_gangguan_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_status_laporan" ADD CONSTRAINT "riwayat_status_laporan_id_laporan_fkey" FOREIGN KEY ("id_laporan") REFERENCES "laporan_gangguan"("id_laporan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penugasan_laporan" ADD CONSTRAINT "penugasan_laporan_id_teknisi_fkey" FOREIGN KEY ("id_teknisi") REFERENCES "teknisi"("id_teknisi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penugasan_laporan" ADD CONSTRAINT "penugasan_laporan_id_laporan_fkey" FOREIGN KEY ("id_laporan") REFERENCES "laporan_gangguan"("id_laporan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penugasan_perangkat" ADD CONSTRAINT "penugasan_perangkat_id_teknisi_fkey" FOREIGN KEY ("id_teknisi") REFERENCES "teknisi"("id_teknisi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penugasan_perangkat" ADD CONSTRAINT "penugasan_perangkat_id_perangkat_fkey" FOREIGN KEY ("id_perangkat") REFERENCES "perangkat"("id_perangkat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_id_teknisi_fkey" FOREIGN KEY ("id_teknisi") REFERENCES "teknisi"("id_teknisi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_id_perangkat_fkey" FOREIGN KEY ("id_perangkat") REFERENCES "perangkat"("id_perangkat") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catatan_pemeliharaan" ADD CONSTRAINT "catatan_pemeliharaan_id_teknisi_fkey" FOREIGN KEY ("id_teknisi") REFERENCES "teknisi"("id_teknisi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catatan_pemeliharaan" ADD CONSTRAINT "catatan_pemeliharaan_id_perangkat_fkey" FOREIGN KEY ("id_perangkat") REFERENCES "perangkat"("id_perangkat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_pemakaian" ADD CONSTRAINT "data_pemakaian_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_pemakaian" ADD CONSTRAINT "data_pemakaian_id_periode_fkey" FOREIGN KEY ("id_periode") REFERENCES "periode"("id_periode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aturan_tarif" ADD CONSTRAINT "aturan_tarif_id_periode_fkey" FOREIGN KEY ("id_periode") REFERENCES "periode"("id_periode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagihan" ADD CONSTRAINT "tagihan_id_warga_fkey" FOREIGN KEY ("id_warga") REFERENCES "warga"("id_warga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagihan" ADD CONSTRAINT "tagihan_id_periode_fkey" FOREIGN KEY ("id_periode") REFERENCES "periode"("id_periode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekapitulasi" ADD CONSTRAINT "rekapitulasi_id_periode_fkey" FOREIGN KEY ("id_periode") REFERENCES "periode"("id_periode") ON DELETE RESTRICT ON UPDATE CASCADE;

