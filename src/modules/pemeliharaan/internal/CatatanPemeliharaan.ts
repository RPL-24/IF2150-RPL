// C27 CatatanPemeliharaan (DPPL 5.27).
import { randomUUID } from "node:crypto";
import type { FormPemeliharaan } from "@/contracts";
import { periksaPemeliharaan } from "./validasi";

export interface BarisCatatan {
  idCatatan: string;
  idTeknisi: string;
  idPerangkat: string;
  waktuPelaksanaan: Date;
  tindakan: string;
  catatanHasil: string;
}

export interface PenyimpanCatatan {
  simpanCatatan(catatan: BarisCatatan): Promise<boolean>;
}

export class CatatanPemeliharaan {
  readonly idCatatan = randomUUID();
  readonly idTeknisi: string;
  readonly idPerangkat: string;
  readonly waktuPelaksanaan: string;
  readonly tindakan: string;
  readonly catatanHasil: string;

  // idTeknisi datang dari KonteksSesi. Konstruktor hanya menyalin kolom FormPemeliharaan.
  constructor(data: FormPemeliharaan, idTeknisi: string) {
    this.idTeknisi = idTeknisi;
    this.idPerangkat = data.idPerangkat?.trim();
    this.waktuPelaksanaan = data.waktuPelaksanaan;
    this.tindakan = data.tindakan?.trim();
    this.catatanHasil = data.catatanHasil?.trim();
  }

  // Algo-021, ditambah catatanHasil yang wajib menurut FormPemeliharaan dan I-12-OBJ-05.
  validasiFormulir(): boolean {
    return periksaPemeliharaan(this).valid;
  }

  simpan(penyimpan: PenyimpanCatatan): Promise<boolean> {
    return penyimpan.simpanCatatan({
      idCatatan: this.idCatatan,
      idTeknisi: this.idTeknisi,
      idPerangkat: this.idPerangkat,
      waktuPelaksanaan: new Date(this.waktuPelaksanaan),
      tindakan: this.tindakan,
      catatanHasil: this.catatanHasil,
    });
  }
}
