// src/modules/iuran/repository.ts
// Kelas Perancangan: DataIuranBoundary (DPPL)
import { prisma } from "@/lib/prisma";
import type {
  AturanTarifDTO,
  DataPemakaianDTO,
  PeriodeDTO,
  RekapitulasiDTO,
  TagihanDTO,
} from "@/contracts";
import type { RepositoriIuran } from "./internal/ModulIuran";
import type { TagihanDenganNama } from "./internal/Rekapitulasi";

function keNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

export const repositoriIuran: RepositoriIuran = {
  async daftarPeriode(): Promise<PeriodeDTO[]> {
    const rows = await prisma.periode.findMany({
      orderBy: [{ tahun: "desc" }, { bulan: "desc" }],
    });
    return rows.map((r: any) => ({
      idPeriode: r.idPeriode,
      bulan: r.bulan,
      tahun: r.tahun,
      statusFinal: Boolean(r.statusFinal),
    }));
  },

  async ambilPeriodeById(idPeriode: string): Promise<PeriodeDTO | null> {
    const r: any = await prisma.periode.findUnique({
      where: { idPeriode },
    });
    if (!r) return null;
    return {
      idPeriode: r.idPeriode,
      bulan: r.bulan,
      tahun: r.tahun,
      statusFinal: Boolean(r.statusFinal),
    };
  },

  async ambilTagihanWarga(idWarga: number, idPeriode: string): Promise<TagihanDTO | null> {
    const [t, p, tarif]: [any, any, any] = await Promise.all([
      prisma.tagihan.findFirst({
        where: { idWarga, idPeriode },
      }),
      prisma.dataPemakaian.findFirst({
        where: { idWarga, idPeriode },
      }),
      prisma.aturanTarif.findFirst({
        where: { idPeriode },
      }),
    ]);

    if (!t) return null;

    const volumeAirM3 = keNumber(p?.volumeAirM3);
    const energiKWh = keNumber(p?.energiKWh ?? p?.energiKwh);
    const biayaTetap = keNumber(tarif?.biayaTetap);
    const subtotalAir = Math.round(volumeAirM3 * keNumber(tarif?.tarifAirPerM3));
    const subtotalEnergi = Math.round(
      energiKWh * keNumber(tarif?.tarifEnergiPerKWh ?? tarif?.tarifEnergiPerKwh),
    );

    return {
      idTagihan: t.idTagihan,
      idWarga: t.idWarga,
      idPeriode: t.idPeriode,
      jumlahIuran: keNumber(t.jumlahIuran),
      status: t.status,
      rincian: {
        volumeAirM3,
        energiKWh,
        biayaTetap,
        subtotalAir,
        subtotalEnergi,
      },
    };
  },

  async ambilPemakaianPeriode(idPeriode: string): Promise<DataPemakaianDTO[]> {
    const rows: any[] = await prisma.dataPemakaian.findMany({
      where: { idPeriode },
      orderBy: { idWarga: "asc" },
    });

    return rows.map((r) => ({
      idPemakaian: r.idPemakaian,
      idWarga: r.idWarga,
      idPeriode: r.idPeriode,
      volumeAirM3: r.volumeAirM3 !== null && r.volumeAirM3 !== undefined ? Number(r.volumeAirM3) : null,
      energiKWh:
        (r.energiKWh ?? r.energiKwh) !== null && (r.energiKWh ?? r.energiKwh) !== undefined
          ? Number(r.energiKWh ?? r.energiKwh)
          : null,
      waktuCatat: r.waktuCatat ? new Date(r.waktuCatat).toISOString() : null,
    }));
  },

  async ambilTarifPeriode(idPeriode: string): Promise<AturanTarifDTO | null> {
    const r: any = await prisma.aturanTarif.findFirst({
      where: { idPeriode },
    });
    if (!r) return null;
    return {
      idAturan: r.idAturan,
      idPeriode: r.idPeriode,
      tarifAirPerM3: keNumber(r.tarifAirPerM3),
      tarifEnergiPerKWh: keNumber(r.tarifEnergiPerKWh ?? r.tarifEnergiPerKwh),
      biayaTetap: keNumber(r.biayaTetap),
    };
  },

  async simpanTagihanDraft(idPeriode: string, tagihanList: TagihanDTO[]): Promise<boolean> {
    try {
      await prisma.$transaction(
        tagihanList.map((t) => {
          const dataPemakaianDasar = JSON.stringify(t.rincian);
          return prisma.tagihan.upsert({
            where: {
              idWarga_idPeriode: {
                idWarga: t.idWarga,
                idPeriode: t.idPeriode,
              },
            },
            update: {
              jumlahIuran: t.jumlahIuran,
              dataPemakaianDasar,
              status: "DRAFT",
            },
            create: {
              idTagihan: t.idTagihan,
              idWarga: t.idWarga,
              idPeriode: t.idPeriode,
              jumlahIuran: t.jumlahIuran,
              dataPemakaianDasar,
              status: "DRAFT",
            },
          });
        }),
      );
      return true;
    } catch (galat) {
      console.error("[iuran] simpanTagihanDraft gagal:", galat);
      return false;
    }
  },

  async tetapkanPeriodeDanTagihanFinal(idPeriode: string): Promise<PeriodeDTO | null> {
    try {
      const [periodeUpdated] = await prisma.$transaction([
        prisma.periode.update({
          where: { idPeriode },
          data: { statusFinal: true },
        }),
        prisma.tagihan.updateMany({
          where: { idPeriode },
          data: { status: "FINAL" },
        }),
      ]);

      return {
        idPeriode: periodeUpdated.idPeriode,
        bulan: periodeUpdated.bulan,
        tahun: periodeUpdated.tahun,
        statusFinal: Boolean(periodeUpdated.statusFinal),
      };
    } catch (galat) {
      console.error("[iuran] tetapkanPeriodeDanTagihanFinal gagal:", galat);
      return null;
    }
  },

  async ambilTagihanFinalPeriode(idPeriode: string): Promise<TagihanDenganNama[]> {
    const [tagihanRows, pemakaianRows, tarif]: [any[], any[], any] = await Promise.all([
      prisma.tagihan.findMany({
        where: { idPeriode, status: "FINAL" },
        include: {
          warga: {
            include: { akun: true },
          },
        },
        orderBy: { idWarga: "asc" },
      }),
      prisma.dataPemakaian.findMany({ where: { idPeriode } }),
      prisma.aturanTarif.findFirst({ where: { idPeriode } }),
    ]);

    const pemakaianMap = new Map<number, any>();
    for (const p of pemakaianRows) {
      pemakaianMap.set(p.idWarga, p);
    }

    return tagihanRows.map((t) => {
      const p = pemakaianMap.get(t.idWarga);
      const volumeAirM3 = keNumber(p?.volumeAirM3);
      const energiKWh = keNumber(p?.energiKWh ?? p?.energiKwh);
      const biayaTetap = keNumber(tarif?.biayaTetap);
      const subtotalAir = Math.round(volumeAirM3 * keNumber(tarif?.tarifAirPerM3));
      const subtotalEnergi = Math.round(
        energiKWh * keNumber(tarif?.tarifEnergiPerKWh ?? tarif?.tarifEnergiPerKwh),
      );

      return {
        idTagihan: t.idTagihan,
        idWarga: t.idWarga,
        namaWarga: t.warga?.akun?.nama ?? `Warga #${t.idWarga}`,
        idPeriode: t.idPeriode,
        jumlahIuran: keNumber(t.jumlahIuran),
        status: t.status,
        rincian: {
          volumeAirM3,
          energiKWh,
          biayaTetap,
          subtotalAir,
          subtotalEnergi,
        },
      };
    });
  },

  async simpanRekapitulasi(rekap: RekapitulasiDTO): Promise<RekapitulasiDTO | null> {
    try {
      const existing: any = await prisma.rekapitulasi.findFirst({
        where: { idPeriode: rekap.idPeriode },
      });

      if (existing) {
        await prisma.rekapitulasi.update({
          where: { idRekap: existing.idRekap },
          data: {
            totalPemakaianAir: rekap.totalPemakaianAir,
            totalPemakaianEnergi: rekap.totalPemakaianEnergi,
            totalIuran: rekap.totalIuran,
          },
        });
        return { ...rekap, idRekap: existing.idRekap };
      }

      const created: any = await prisma.rekapitulasi.create({
        data: {
          idRekap: rekap.idRekap,
          idPeriode: rekap.idPeriode,
          totalPemakaianAir: rekap.totalPemakaianAir,
          totalPemakaianEnergi: rekap.totalPemakaianEnergi,
          totalIuran: rekap.totalIuran,
        },
      });
      return { ...rekap, idRekap: created.idRekap };
    } catch (galat) {
      console.error("[iuran] simpanRekapitulasi gagal:", galat);
      return null;
    }
  },
};