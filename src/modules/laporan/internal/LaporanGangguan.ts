// C20 LaporanGangguan (DPPL 5.20).
import { randomUUID } from "node:crypto";
import type { DetailLaporan, FormLaporan, RingkasanLaporan, StatusLaporan } from "@/contracts";
import { adalahStatus, statusBerikutnya } from "./StatusLaporan";

export interface DataLaporan {
  idLaporan: string;
  idWarga: number;
  jenisGangguan: string;
  deskripsi: string;
  fotoPendukung: string[];
  waktuDibuat: Date;
  status: StatusLaporan;
}

// Laporan beserta nama pemilik, hasil gabungan dengan akun saat membaca detail.
export type DataLaporanPemilik = DataLaporan & { namaPemilik: string };

export interface PenyimpanLaporan {
  simpanLaporan(laporan: DataLaporan): Promise<boolean>;
}

export class LaporanGangguan {
  private constructor(private data: DataLaporan) {}

  // Konstruktor DPPL bersama setStatusMenunggu(): hanya untuk objek baru.
  static baru(form: FormLaporan, idWarga: number, waktu: Date): LaporanGangguan {
    return new LaporanGangguan({
      idLaporan: `LAP-${randomUUID().slice(0, 8).toUpperCase()}`,
      idWarga,
      jenisGangguan: form.jenisGangguan.trim(),
      deskripsi: form.deskripsi.trim(),
      fotoPendukung: [...form.fotoPendukung],
      waktuDibuat: waktu,
      status: "MENUNGGU",
    });
  }

  static dariData(data: DataLaporan): LaporanGangguan {
    return new LaporanGangguan({ ...data });
  }

  get idLaporan(): string {
    return this.data.idLaporan;
  }

  get status(): StatusLaporan {
    return this.data.status;
  }

  toData(): DataLaporan {
    return { ...this.data };
  }

  // Algo-017
  validasiTransisi(statusBaru: unknown): boolean {
    return adalahStatus(statusBaru) && statusBerikutnya(this.data.status).includes(statusBaru);
  }

  statusBerikutnya(): StatusLaporan[] {
    return statusBerikutnya(this.data.status);
  }

  // Tolak tanpa mengubah objek bila transisi tidak sah.
  ubahStatus(statusBaru: StatusLaporan): void {
    if (!this.validasiTransisi(statusBaru)) {
      throw new Error(`Transisi ${this.data.status} -> ${statusBaru} tidak sah`);
    }
    this.data.status = statusBaru;
  }

  getRingkasan(): RingkasanLaporan {
    return {
      idLaporan: this.data.idLaporan,
      jenisGangguan: this.data.jenisGangguan,
      status: this.data.status,
      waktuDibuat: this.data.waktuDibuat.toISOString(),
    };
  }

  getDetailLaporan(namaPemilik: string): DetailLaporan {
    return { ...this.getRingkasan(), deskripsi: this.data.deskripsi, fotoPendukung: [...this.data.fotoPendukung], namaPemilik };
  }

  async simpan(penyimpan: PenyimpanLaporan): Promise<boolean> {
    return penyimpan.simpanLaporan(this.toData());
  }
}
