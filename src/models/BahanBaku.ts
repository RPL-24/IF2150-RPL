import { isAngkaPositif, PESAN_INPUT_TIDAK_VALID } from './pesan';

export class BahanBaku {
  private namaBahan: string;
  private hargaBeli: number;

  constructor(namaBahan: string, hargaBeli: number) {
    const nama = (namaBahan ?? '').trim();
    if (nama === '') {
      throw new Error('Nama bahan baku tidak boleh kosong');
    }
    this.namaBahan = nama;
    this.hargaBeli = 0;
    this.setHargaBeli(hargaBeli);
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
}
