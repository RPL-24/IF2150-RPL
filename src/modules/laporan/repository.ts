// DataLaporanBoundary (DPPL 5.48) di atas Prisma. Semua query memakai parameter terikat.
import { prisma } from "@/lib/prisma";
import type { DataLaporan } from "./internal/LaporanGangguan";
import type { RepositoriLaporan } from "./internal/ModulLaporan";
import { statusBerikutnya } from "./internal/StatusLaporan";

class TransaksiDibatalkan extends Error {}

type BarisLaporan = {
  idLaporan: string;
  idWarga: number;
  jenisGangguan: string;
  deskripsi: string;
  foto: string[];
  waktuDibuat: Date;
  status: DataLaporan["status"];
};

const keData = (b: BarisLaporan): DataLaporan => ({
  idLaporan: b.idLaporan,
  idWarga: b.idWarga,
  jenisGangguan: b.jenisGangguan,
  deskripsi: b.deskripsi,
  fotoPendukung: b.foto,
  waktuDibuat: b.waktuDibuat,
  status: b.status,
});

export const repositoriLaporan: RepositoriLaporan = {
  // true hanya setelah INSERT berhasil; galat database menjadi false dan modul melaporkannya sebagai GAGAL_SIMPAN.
  async simpanLaporan(laporan) {
    try {
      await prisma.laporanGangguan.create({
        data: {
          idLaporan: laporan.idLaporan,
          idWarga: laporan.idWarga,
          jenisGangguan: laporan.jenisGangguan,
          deskripsi: laporan.deskripsi,
          foto: laporan.fotoPendukung,
          waktuDibuat: laporan.waktuDibuat,
          status: laporan.status,
        },
      });
      return true;
    } catch (galat) {
      console.error("[laporan] INSERT laporan gagal:", galat);
      return false;
    }
  },

  // Terbaru dulu; id sebagai pembeda urutan bila waktu sama.
  async cariMilikWarga(idWarga) {
    const baris = await prisma.laporanGangguan.findMany({
      where: { idWarga },
      orderBy: [{ waktuDibuat: "desc" }, { idLaporan: "asc" }],
    });
    return baris.map(keData);
  },

  async cariDetailMilik(idWarga, idLaporan) {
    const baris = await prisma.laporanGangguan.findFirst({
      where: { idWarga, idLaporan },
      include: { warga: { select: { akun: { select: { nama: true } } } } },
    });
    return baris ? { ...keData(baris), namaPemilik: baris.warga.akun.nama } : null;
  },

  async cariRiwayatMilik(idWarga, idLaporan) {
    const baris = await prisma.riwayatStatusLaporan.findMany({
      where: { idLaporan, laporan: { idWarga } },
      orderBy: [{ timestamp: "asc" }, { idRiwayat: "asc" }],
    });
    return baris.map((b) => ({ idRiwayat: b.idRiwayat, idLaporan: b.idLaporan, status: b.status, timestamp: b.timestamp }));
  },

  async cariPenugasan(idTeknisi, idLaporan) {
    return prisma.penugasanLaporan.findUnique({ where: { idTeknisi_idLaporan: { idTeknisi, idLaporan } } });
  },

  // EXISTS lewat relasi penugasan: tidak menggandakan laporan dan hanya tugas milik sesi.
  async cariDaftarTugas(idTeknisi) {
    const baris = await prisma.laporanGangguan.findMany({
      where: { penugasan: { some: { idTeknisi } } },
      orderBy: [{ waktuDibuat: "asc" }, { idLaporan: "asc" }],
    });
    return baris.map(keData);
  },

  async cariDetailTugas(idTeknisi, idLaporan) {
    const baris = await prisma.laporanGangguan.findFirst({
      where: { idLaporan, penugasan: { some: { idTeknisi } } },
      include: { warga: { select: { akun: { select: { nama: true } } } } },
    });
    return baris ? { ...keData(baris), namaPemilik: baris.warga.akun.nama } : null;
  },

  async cariRiwayatTugas(idTeknisi, idLaporan) {
    const baris = await prisma.riwayatStatusLaporan.findMany({
      where: { idLaporan, laporan: { penugasan: { some: { idTeknisi } } } },
      orderBy: [{ timestamp: "asc" }, { idRiwayat: "asc" }],
    });
    return baris.map((b) => ({ idRiwayat: b.idRiwayat, idLaporan: b.idLaporan, status: b.status, timestamp: b.timestamp }));
  },

  // Algo-042: satu transaksi. Baris laporan dan penugasan dikunci, status lama dan transisi diperiksa ulang,
  // lalu UPDATE (tepat satu baris) dan INSERT riwayat. Pelanggaran apa pun membatalkan keduanya.
  async simpanStatusDanRiwayat(laporan, riwayat, idTeknisi, statusLama) {
    try {
      await prisma.$transaction(async (tx) => {
        const terkini = await tx.$queryRaw<{ status: string }[]>`
          SELECT status::text AS status FROM laporan_gangguan WHERE id_laporan = ${laporan.idLaporan} FOR UPDATE`;
        const tugas = await tx.$queryRaw<{ id_penugasan: string }[]>`
          SELECT id_penugasan FROM penugasan_laporan
          WHERE id_laporan = ${laporan.idLaporan} AND id_teknisi = ${idTeknisi} FOR UPDATE`;

        const sekarang = terkini[0]?.status as DataLaporan["status"] | undefined;
        if (!sekarang || !tugas[0] || sekarang !== statusLama) throw new TransaksiDibatalkan();
        if (!statusBerikutnya(sekarang).includes(laporan.status)) throw new TransaksiDibatalkan();
        if (riwayat.idLaporan !== laporan.idLaporan || riwayat.status !== laporan.status) throw new TransaksiDibatalkan();

        const { count } = await tx.laporanGangguan.updateMany({
          where: { idLaporan: laporan.idLaporan, status: statusLama, penugasan: { some: { idTeknisi } } },
          data: { status: laporan.status },
        });
        if (count !== 1) throw new TransaksiDibatalkan();

        await tx.riwayatStatusLaporan.create({
          data: { idRiwayat: riwayat.idRiwayat, idLaporan: riwayat.idLaporan, status: riwayat.status, timestamp: riwayat.timestamp },
        });
      });
      return true;
    } catch (galat) {
      if (!(galat instanceof TransaksiDibatalkan)) console.error("[laporan] transaksi status gagal:", galat);
      return false;
    }
  },
};
