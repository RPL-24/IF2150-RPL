/**
 * Uji integrasi atomisitas status dan riwayat (Algo-040, 042) terhadap PostgreSQL sungguhan.
 * Jest tidak bisa memuat Prisma Client (modul ESM), jadi dijalankan dengan tsx:
 *   DATABASE_URL=postgresql://... npx tsx tests/laporan/transaksiStatus.db.ts
 * Basis data harus sudah dimigrasi dan di-seed (butuh satu warga dan teknisi TEK-01). Data uji dihapus di akhir.
 */
import assert from "node:assert/strict";

const awalan = `UJI-${Date.now()}`;
const id = (n: string) => `${awalan}-${n}`;

async function main() {
  const { prisma } = await import("../../lib/prisma");
  const { repositoriLaporan: repo } = await import("../../modules/laporan/repository");
  const idWarga = (await prisma.warga.findFirstOrThrow()).idWarga;

  const riwayatBaru = (idLaporan: string, status: "SEDANG_DIPERBAIKI" | "SELESAI", idRiwayat: string) => ({
    idRiwayat, idLaporan, status, timestamp: new Date(),
  });
  const dataLaporan = (idLaporan: string, status: "SEDANG_DIPERBAIKI" | "SELESAI") => ({
    idLaporan, idWarga, jenisGangguan: "Kebocoran pipa", deskripsi: "uji", fotoPendukung: [], waktuDibuat: new Date(), status,
  });
  const ambil = async (idLaporan: string) => ({
    status: (await prisma.laporanGangguan.findUniqueOrThrow({ where: { idLaporan } })).status,
    riwayat: await prisma.riwayatStatusLaporan.count({ where: { idLaporan } }),
  });
  async function buatLaporan(n: string, ditugaskan = true) {
    await prisma.laporanGangguan.create({
      data: { idLaporan: id(n), idWarga, jenisGangguan: "Kebocoran pipa", deskripsi: "uji", status: "MENUNGGU" },
    });
    if (ditugaskan) await prisma.penugasanLaporan.create({ data: { idTeknisi: "TEK-01", idLaporan: id(n) } });
    return id(n);
  }

  const kasus: [string, () => Promise<void>][] = [
    ["menyimpan status dan satu riwayat bersama", async () => {
      const l = await buatLaporan("a");
      assert.equal(await repo.simpanStatusDanRiwayat(dataLaporan(l, "SEDANG_DIPERBAIKI"), riwayatBaru(l, "SEDANG_DIPERBAIKI", id("ra")), "TEK-01", "MENUNGGU"), true);
      assert.deepEqual(await ambil(l), { status: "SEDANG_DIPERBAIKI", riwayat: 1 });
    }],
    ["status lama yang sudah berubah (konflik) tidak menulis apa pun", async () => {
      const l = await buatLaporan("b");
      await prisma.laporanGangguan.update({ where: { idLaporan: l }, data: { status: "SEDANG_DIPERBAIKI" } });
      assert.equal(await repo.simpanStatusDanRiwayat(dataLaporan(l, "SEDANG_DIPERBAIKI"), riwayatBaru(l, "SEDANG_DIPERBAIKI", id("rb")), "TEK-01", "MENUNGGU"), false);
      assert.deepEqual(await ambil(l), { status: "SEDANG_DIPERBAIKI", riwayat: 0 });
    }],
    ["riwayat gagal disisipkan membatalkan perubahan status (rollback)", async () => {
      const l = await buatLaporan("c");
      const bentrok = id("rc");
      await prisma.riwayatStatusLaporan.create({ data: { idRiwayat: bentrok, idLaporan: l, status: "MENUNGGU" } });
      // idRiwayat sudah dipakai, jadi INSERT melanggar kunci utama setelah UPDATE berjalan.
      assert.equal(await repo.simpanStatusDanRiwayat(dataLaporan(l, "SEDANG_DIPERBAIKI"), riwayatBaru(l, "SEDANG_DIPERBAIKI", bentrok), "TEK-01", "MENUNGGU"), false);
      assert.deepEqual(await ambil(l), { status: "MENUNGGU", riwayat: 1 });
    }],
    ["teknisi yang tidak ditugaskan tidak bisa mengubah status", async () => {
      const l = await buatLaporan("d", false);
      assert.equal(await repo.simpanStatusDanRiwayat(dataLaporan(l, "SEDANG_DIPERBAIKI"), riwayatBaru(l, "SEDANG_DIPERBAIKI", id("rd")), "TEK-01", "MENUNGGU"), false);
      assert.deepEqual(await ambil(l), { status: "MENUNGGU", riwayat: 0 });
    }],
    ["lompat status ditolak di basis data walau lolos dari pemanggil", async () => {
      const l = await buatLaporan("e");
      assert.equal(await repo.simpanStatusDanRiwayat(dataLaporan(l, "SELESAI"), riwayatBaru(l, "SELESAI", id("re")), "TEK-01", "MENUNGGU"), false);
      assert.deepEqual(await ambil(l), { status: "MENUNGGU", riwayat: 0 });
    }],
    ["dua permintaan serentak untuk transisi yang sama: tepat satu yang berhasil", async () => {
      const l = await buatLaporan("f");
      const hasil = await Promise.all(
        ["rf1", "rf2"].map((r) => repo.simpanStatusDanRiwayat(dataLaporan(l, "SEDANG_DIPERBAIKI"), riwayatBaru(l, "SEDANG_DIPERBAIKI", id(r)), "TEK-01", "MENUNGGU")),
      );
      assert.equal(hasil.filter(Boolean).length, 1);
      assert.deepEqual(await ambil(l), { status: "SEDANG_DIPERBAIKI", riwayat: 1 });
    }],
  ];

  let gagal = 0;
  const log = console.error;
  console.error = () => {}; // galat INSERT yang disengaja tidak perlu muncul di keluaran uji
  try {
    for (const [nama, uji] of kasus) {
      try {
        await uji();
        console.log(`lulus  ${nama}`);
      } catch (e) {
        gagal++;
        console.log(`GAGAL  ${nama}\n       ${(e as Error).message}`);
      }
    }
  } finally {
    console.error = log;
    await prisma.riwayatStatusLaporan.deleteMany({ where: { idLaporan: { startsWith: awalan } } });
    await prisma.penugasanLaporan.deleteMany({ where: { idLaporan: { startsWith: awalan } } });
    await prisma.laporanGangguan.deleteMany({ where: { idLaporan: { startsWith: awalan } } });
    await prisma.$disconnect();
  }
  if (gagal) process.exit(1);
}

void main();
