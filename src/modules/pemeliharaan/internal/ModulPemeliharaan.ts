// ModulPemeliharaan (DPPL 5.43).
import type { ApiRespons, FormPemeliharaan, HasilPemeliharaan } from "@/contracts";
import { CatatanPemeliharaan, type PenyimpanCatatan } from "./CatatanPemeliharaan";

export interface PerangkatRingkas {
  idPerangkat: string;
  nama: string;
}

// Bagian DataPerangkatBoundary yang dipakai UC08.
export interface RepositoriPemeliharaan extends PenyimpanCatatan {
  cariPerangkatTeknisi(idTeknisi: string, idPerangkat: string): Promise<PerangkatRingkas | null>;
  daftarPerangkatTeknisi(idTeknisi: string): Promise<PerangkatRingkas[]>;
}

export class ModulPemeliharaan {
  constructor(private readonly data: RepositoriPemeliharaan) {}

  // Algo-035, ditambah cek perangkat terdaftar dan dalam lingkup teknisi (Q-001 Tabel 5.47.7, I-12-OBJ-02).
  async simpanCatatan(idTeknisi: string, form: FormPemeliharaan): Promise<ApiRespons<HasilPemeliharaan>> {
    const catatan = new CatatanPemeliharaan(form, idTeknisi);
    if (!catatan.validasiFormulir()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Formulir tidak lengkap" };
    }

    const perangkat = await this.data.cariPerangkatTeknisi(idTeknisi, catatan.idPerangkat);
    if (!perangkat) {
      return { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Perangkat tidak ditemukan" };
    }

    if (await catatan.simpan(this.data)) {
      return { ok: true, data: { idCatatan: catatan.idCatatan } };
    }
    return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Penyimpanan gagal" };
  }
}
