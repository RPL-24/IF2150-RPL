// src/modules/iuran/internal/KalkulatorIuran.ts
// Kelas Perancangan: C14 (Periode), C15 (DataPemakaian), C16 (AturanTarif),
// C17 (Tagihan), C18 (StatusTagihan), C19 (KalkulatorIuran)
import type {
  AturanTarifDTO,
  DataPemakaianDTO,
  PeriodeDTO,
  RingkasanPemakaian,
  StatusTagihan,
  TagihanDTO,
  TitikPemakaianPekan,
} from "@/contracts";

export interface DataPemakaianWarga extends DataPemakaianDTO {
  namaWarga?: string;
}

/**
 * C15: DataPemakaian - Algo-012: Periksa kelengkapan data pemakaian warga
 */
export function isPemakaianLengkap(p: DataPemakaianDTO): p is DataPemakaianDTO & {
  volumeAirM3: number;
  energiKWh: number;
  waktuCatat: string;
} {
  return (
    p.volumeAirM3 !== null &&
    p.volumeAirM3 !== undefined &&
    p.volumeAirM3 >= 0 &&
    p.energiKWh !== null &&
    p.energiKWh !== undefined &&
    p.energiKWh >= 0 &&
    p.waktuCatat !== null &&
    p.waktuCatat !== undefined
  );
}

/**
 * C19: KalkulatorIuran (Algo-013, Algo-014, Algo-015, Algo-036)
 */
export class KalkulatorIuran {
  /**
   * Algo-013 & Algo-014: Hitung tagihan satu warga
   * Total = biayaTetap + volume * tarifAir + energi * tarifEnergi
   */
  static hitungPerWarga(
    idPeriode: string,
    pemakaian: DataPemakaianDTO,
    tarif: AturanTarifDTO,
    status: StatusTagihan = "DRAFT",
    idTagihan?: string,
  ): TagihanDTO {
    if (!isPemakaianLengkap(pemakaian)) {
      throw new Error("DATA_BELUM_LENGKAP");
    }
    if (
      tarif.biayaTetap < 0 ||
      tarif.tarifAirPerM3 < 0 ||
      tarif.tarifEnergiPerKWh < 0
    ) {
      throw new Error("ATURAN_TARIF_TIDAK_VALID");
    }

    const subtotalAir = Math.round(pemakaian.volumeAirM3 * tarif.tarifAirPerM3);
    const subtotalEnergi = Math.round(pemakaian.energiKWh * tarif.tarifEnergiPerKWh);
    const biayaTetap = Math.round(tarif.biayaTetap);
    const jumlahIuran = biayaTetap + subtotalAir + subtotalEnergi;

    return {
      idTagihan: idTagihan ?? `tgh-${idPeriode}-${pemakaian.idWarga}`,
      idWarga: pemakaian.idWarga,
      idPeriode,
      jumlahIuran,
      status,
      rincian: {
        volumeAirM3: Number(pemakaian.volumeAirM3),
        energiKWh: Number(pemakaian.energiKWh),
        biayaTetap,
        subtotalAir,
        subtotalEnergi,
      },
    };
  }

  /**
   * Algo-015: Hitung pratinjau kolektif seluruh warga pada satu periode
   */
  static hitungPratinjauKolektif(
    idPeriode: string,
    daftarPemakaian: DataPemakaianDTO[],
    tarif: AturanTarifDTO,
  ): { daftarTagihan: TagihanDTO[]; totalIuran: number } {
    if (daftarPemakaian.length === 0) {
      throw new Error("DATA_BELUM_LENGKAP");
    }

    // Pastikan seluruh warga memiliki data lengkap (Algo-012)
    const adaBelumLengkap = daftarPemakaian.some((p) => !isPemakaianLengkap(p));
    if (adaBelumLengkap) {
      throw new Error("DATA_BELUM_LENGKAP");
    }

    const daftarTagihan = daftarPemakaian.map((p) =>
      this.hitungPerWarga(idPeriode, p, tarif, "DRAFT"),
    );
    const totalIuran = daftarTagihan.reduce((acc, t) => acc + t.jumlahIuran, 0);

    return { daftarTagihan, totalIuran };
  }

  /**
   * Algo-036: Hitung agregat pemakaian komunal beserta rincian pekanan M1..M4
   */
  static hitungAgregat(
    periode: PeriodeDTO,
    daftarPemakaian: DataPemakaianDTO[],
  ): RingkasanPemakaian {
    const pekanMap: Record<string, { airM3: number; energiKWh: number }> = {
      M1: { airM3: 0, energiKWh: 0 },
      M2: { airM3: 0, energiKWh: 0 },
      M3: { airM3: 0, energiKWh: 0 },
      M4: { airM3: 0, energiKWh: 0 },
    };

    let totalAirM3 = 0;
    let totalEnergiKWh = 0;

    for (const p of daftarPemakaian) {
      const air = p.volumeAirM3 ?? 0;
      const energi = p.energiKWh ?? 0;
      totalAirM3 += air;
      totalEnergiKWh += energi;

      let labelPekan = "M4";
      if (p.waktuCatat) {
        const tgl = new Date(p.waktuCatat).getUTCDate();
        if (tgl <= 7) labelPekan = "M1";
        else if (tgl <= 14) labelPekan = "M2";
        else if (tgl <= 21) labelPekan = "M3";
        else labelPekan = "M4";
      }
      pekanMap[labelPekan].airM3 = Number((pekanMap[labelPekan].airM3 + air).toFixed(2));
      pekanMap[labelPekan].energiKWh = Number((pekanMap[labelPekan].energiKWh + energi).toFixed(2));
    }

    const rincianPekanan: TitikPemakaianPekan[] = ["M1", "M2", "M3", "M4"].map((label) => ({
      label,
      airM3: pekanMap[label].airM3,
      energiKWh: pekanMap[label].energiKWh,
    }));

    return {
      periode,
      totalAirM3: Number(totalAirM3.toFixed(2)),
      totalEnergiKWh: Number(totalEnergiKWh.toFixed(2)),
      rincianPekanan,
    };
  }
}