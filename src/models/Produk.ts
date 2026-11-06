import {
  PESAN_HASIL_RESEP_TIDAK_VALID,
  PESAN_INPUT_TIDAK_VALID,
  PESAN_NAMA_PRODUK_WAJIB,
  isAngkaPositif,
  isBilanganBulatPositif,
} from './pesan';

export const DAFTAR_TAG = [
  'Makanan utama',
  'Camilan',
  'Minuman',
  'Dessert',
  'Lainnya',
];

export class Produk {
  private namaProduk: string = '';
  private tag: string[] = [];
  private hargaJual: number = 0;
  private hasilResep: number = 1;
  private margin: number = 0;
    private statusPeringatan: boolean = false;

  getStatusPeringatan(): boolean{
    return this.statusPeringatan;
  }

  setStatusPeringatan(status_peringatan: boolean): void {
    this.statusPeringatan = status_peringatan;
  }


  getNamaProduk(): string {
    return this.namaProduk;
  }

  setNamaProduk(namaProduk: string): void {
    const nama = (namaProduk ?? '').trim();
    if (nama === '') {
      throw new Error(PESAN_NAMA_PRODUK_WAJIB);
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

  getHasilResep(): number {
    return this.hasilResep;
  }

  setHasilResep(hasilResep: number): void {
    if (!isBilanganBulatPositif(hasilResep)) {
      throw new Error(PESAN_HASIL_RESEP_TIDAK_VALID);
    }
    this.hasilResep = hasilResep;
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
