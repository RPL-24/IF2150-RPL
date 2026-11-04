import { isAngkaPositif, PESAN_INPUT_TIDAK_VALID } from './pesan';

export class Produk {
  private namaProduk: string = '';
  private tag: string[] = [];
  private hargaJual: number = 0;
  private margin: number = 0;

  getNamaProduk(): string {
    return this.namaProduk;
  }

  setNamaProduk(namaProduk: string): void {
    const nama = (namaProduk ?? '').trim();
    if (nama === '') {
      throw new Error('Nama produk tidak boleh kosong');
    }
    this.namaProduk = nama;
  }

  getTag(): string[] {
    return [...this.tag];
  }

  setTag(tag: string[]): void {
    const hasil: string[] = [];
    for (const item of tag ?? []) {
      const bersih = item.trim().toLowerCase().replace(/\s+/g, ' ');
      if (bersih !== '' && !hasil.includes(bersih)) {
        hasil.push(bersih);
      }
    }
    this.tag = hasil;
  }

  getHargaJual(): number {
    return this.hargaJual;
  }

  setHargaJual(hargaJual: number): void {
    if (!isAngkaPositif(hargaJual)) {
      throw new Error(PESAN_INPUT_TIDAK_VALID);
    }
    this.hargaJual = hargaJual;
  }

  getMargin(): number {
    return this.margin;
  }

  setMargin(margin: number): void {
    if (typeof margin !== 'number' || !Number.isFinite(margin)) {
      throw new Error('Margin tidak valid');
    }
    this.margin = margin;
  }
}
