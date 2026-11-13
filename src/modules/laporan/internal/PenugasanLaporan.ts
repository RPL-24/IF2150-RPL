// C24 PenugasanLaporan (DPPL 5.24).
export interface DataPenugasan {
  idPenugasan: string;
  idTeknisi: string;
  idLaporan: string;
  waktuPenugasan: Date;
}

export class PenugasanLaporan {
  constructor(private readonly data: DataPenugasan) {}

  // Algo-019
  verifikasi(idTeknisi: string, idLaporan: string): boolean {
    return this.data.idTeknisi === idTeknisi && this.data.idLaporan === idLaporan;
  }
}
