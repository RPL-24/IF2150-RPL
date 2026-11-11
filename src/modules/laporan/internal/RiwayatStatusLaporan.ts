// C22 RiwayatStatusLaporan (DPPL 5.22).
import { randomUUID } from "node:crypto";
import type { RingkasanStatus, StatusLaporan } from "@/contracts";

export interface DataRiwayat {
  idRiwayat: string;
  idLaporan: string;
  status: StatusLaporan;
  timestamp: Date;
}

export class RiwayatStatusLaporan {
  readonly data: DataRiwayat;

  constructor(idLaporan: string, status: StatusLaporan, waktu: Date) {
    this.data = { idRiwayat: `RWY-${randomUUID().slice(0, 8).toUpperCase()}`, idLaporan, status, timestamp: waktu };
  }

  // Penyimpanan ikut transaksi DataLaporanBoundary.simpanStatusDanRiwayat, bukan lewat catat() terpisah.
  static ringkas(data: DataRiwayat): RingkasanStatus {
    return { status: data.status, timestamp: data.timestamp.toISOString() };
  }
}
