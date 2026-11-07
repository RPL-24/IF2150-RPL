// src/modules/iuran/repository.ts
import {
  AturanTarifEntity,
  DataPemakaianEntity,
  RincianTagihan,
  StatusPeriode,
} from './internal/KalkulatorIuran';

export interface PeriodeRecord {
  id: string;
  nama: string;
  status: StatusPeriode;
  idKomunitas?: string;
}

export interface IuranRepository {
  ambilPeriodeById(idPeriode: string): Promise<PeriodeRecord | null>;
  ambilTagihanFinalWarga(idWarga: string, idPeriode?: string): Promise<RincianTagihan[]>;
  ambilPemakaianPeriode(idPeriode: string): Promise<DataPemakaianEntity[]>;
  ambilTarifAktif(idPeriode: string): Promise<AturanTarifEntity | null>;
  simpanTagihanDraft(idPeriode: string, tagihanList: RincianTagihan[]): Promise<void>;
  tetapkanPeriodeDanTagihanFinal(idPeriode: string): Promise<RincianTagihan[]>;
  ambilTagihanFinalPeriode(idPeriode: string): Promise<RincianTagihan[]>;
}