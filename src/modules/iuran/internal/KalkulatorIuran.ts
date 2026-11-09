// src/modules/iuran/internal/KalkulatorIuran.ts

export type StatusPeriode = 'DRAFT' | 'FINAL';
export type StatusTagihan = 'DRAFT' | 'FINAL' | 'LUNAS';

export interface AturanTarifEntity {
  id: string;
  biayaBebanTetap: number;
  tarifPerM3Air: number;
  tarifPerKwhListrik: number;
}

export interface DataPemakaianEntity {
  idWarga: string;
  namaWarga?: string;
  volumeAirM3: number;
  energiListrikKwh: number;
}

export interface RincianTagihan {
  idWarga: string;
  idPeriode: string;
  volumeAirM3: number;
  energiListrikKwh: number;
  biayaAir: number;
  biayaListrik: number;
  biayaBeban: number;
  totalTagihan: number;
  status: StatusTagihan;
}

export interface RingkasanAgregatKomunal {
  idPeriode: string;
  totalAirM3: number;
  totalListrikKwh: number;
  rataRataAirM3: number;
  rataRataListrikKwh: number;
  jumlahWargaTercatat: number;
}

export class KalkulatorIuran {
  /**
   * Algo-013 & Algo-014: Hitung rincian iuran per warga berdasarkan pemakaian dan aturan tarif
   */
  static hitungPerWarga(
    idPeriode: string,
    pemakaian: DataPemakaianEntity,
    tarif: AturanTarifEntity
  ): RincianTagihan {
    if (pemakaian.volumeAirM3 < 0 || pemakaian.energiListrikKwh < 0) {
      throw new Error('DATA_PEMAKAIAN_TIDAK_VALID');
    }
    if (
      tarif.biayaBebanTetap < 0 ||
      tarif.tarifPerM3Air < 0 ||
      tarif.tarifPerKwhListrik < 0
    ) {
      throw new Error('ATURAN_TARIF_TIDAK_VALID');
    }

    const biayaAir = Math.round(pemakaian.volumeAirM3 * tarif.tarifPerM3Air);
    const biayaListrik = Math.round(pemakaian.energiListrikKwh * tarif.tarifPerKwhListrik);
    const biayaBeban = Math.round(tarif.biayaBebanTetap);
    const totalTagihan = biayaAir + biayaListrik + biayaBeban;

    return {
      idWarga: pemakaian.idWarga,
      idPeriode,
      volumeAirM3: pemakaian.volumeAirM3,
      energiListrikKwh: pemakaian.energiListrikKwh,
      biayaAir,
      biayaListrik,
      biayaBeban,
      totalTagihan,
      status: 'DRAFT',
    };
  }

  /**
   * Algo-015: Hitung pratinjau kolektif seluruh warga pada satu periode
   */
  static hitungPratinjauKolektif(
    idPeriode: string,
    daftarPemakaian: DataPemakaianEntity[],
    tarif: AturanTarifEntity
  ): RincianTagihan[] {
    if (daftarPemakaian.length === 0) {
      throw new Error('DATA_PEMAKAIAN_KOSONG');
    }

    return daftarPemakaian.map((item) =>
      this.hitungPerWarga(idPeriode, item, tarif)
    );
  }

  /**
   * Algo-036 Helper: Hitung agregat pemakaian komunal
   */
  static hitungAgregat(
    idPeriode: string,
    daftarPemakaian: DataPemakaianEntity[]
  ): RingkasanAgregatKomunal {
    const jumlahWargaTercatat = daftarPemakaian.length;
    if (jumlahWargaTercatat === 0) {
      return {
        idPeriode,
        totalAirM3: 0,
        totalListrikKwh: 0,
        rataRataAirM3: 0,
        rataRataListrikKwh: 0,
        jumlahWargaTercatat: 0,
      };
    }

    const totalAirM3 = daftarPemakaian.reduce((sum, p) => sum + p.volumeAirM3, 0);
    const totalListrikKwh = daftarPemakaian.reduce((sum, p) => sum + p.energiListrikKwh, 0);

    return {
      idPeriode,
      totalAirM3: Number(totalAirM3.toFixed(2)),
      totalListrikKwh: Number(totalListrikKwh.toFixed(2)),
      rataRataAirM3: Number((totalAirM3 / jumlahWargaTercatat).toFixed(2)),
      rataRataListrikKwh: Number((totalListrikKwh / jumlahWargaTercatat).toFixed(2)),
      jumlahWargaTercatat,
    };
  }
}