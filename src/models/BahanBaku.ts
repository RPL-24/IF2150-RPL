import {
  PESAN_INPUT_TIDAK_VALID,
  PESAN_NAMA_BAHAN_WAJIB,
  PESAN_SATUAN_WAJIB,
  isAngkaPositif,
} from './pesan';

export class BahanBaku {
  private namaBahan: string;
  private hargaBeli: number;
  private satuan: string;

  constructor(namaBahan: string, hargaBeli: number, satuan: string = 'unit') {
    const nama = (namaBahan ?? '').trim();
    if (nama === '') {
      throw new Error(PESAN_NAMA_BAHAN_WAJIB);
    }
    this.namaBahan = nama;
    this.hargaBeli = 0;
    this.satuan = 'unit';
    this.setHargaBeli(hargaBeli);
    this.setSatuan(satuan);
  }

  getNamaBahan(): string {
    return this.namaBahan;
  }

  getHargaBeli(): number {
    return this.hargaBeli;
  }

  setHargaBeli(hargaBeli: number): void {
    if (!isAngkaPositif(hargaBeli)) {
      throw new Error(PESAN_INPUT_TIDAK_VALID);
    }
    this.hargaBeli = hargaBeli;
  }

  getSatuan(): string {
    return this.satuan;
  }

  setSatuan(satuan: string): void {
    const bersih = (satuan ?? '').trim();
    if (bersih === '') {
      throw new Error(PESAN_SATUAN_WAJIB);
    }
    this.satuan = bersih;
  }
}
