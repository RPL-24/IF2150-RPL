export type BahanInput = {
  idBahan?: string | null;
  namaBahan: string;
  hargaBeli: number;
  satuan: string;
  takaran: number;
};

export type DataBiaya = { hargaBeli: number; takaran: number };

export function kunciNama(nama: string): string {
  return nama.trim().toLowerCase();
}

function bulatkan(nilai: number): number {
  return Math.round(nilai * 100) / 100;
}

export function hitungTotalBiaya(daftarBahan: DataBiaya[]): number {
  return bulatkan(
    daftarBahan.reduce(
      (jumlah, bahan) => jumlah + bahan.takaran * bahan.hargaBeli,
      0,
    ),
  );
}

export function hitungHpp(daftarBahan: DataBiaya[], porsi: number = 1): number {
  const pembagi = Number.isFinite(porsi) && porsi > 0 ? porsi : 1;
  return bulatkan(hitungTotalBiaya(daftarBahan) / pembagi);
}

export function hitungMargin(hargaJual: number, hpp: number): number {
  return bulatkan(hargaJual - hpp);
}

export function hitungPersenMargin(hargaJual: number, margin: number): number {
  if (!Number.isFinite(hargaJual) || hargaJual <= 0) return 0;
  return Math.round((margin / hargaJual) * 1000) / 10;
}

export function parseAngka(teks: string): number {
  const s = (teks ?? '').trim();
  if (/^\d+$/.test(s)) return Number(s);
  if (/^[1-9]\d{0,2}(\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ''));
  if (/^[1-9]\d{0,2}(,\d{3})+$/.test(s)) return Number(s.replace(/,/g, ''));
  if (/^[1-9]\d{0,2}(\.\d{3})+,\d+$/.test(s)) {
    return Number(s.replace(/\./g, '').replace(',', '.'));
  }
  if (/^\d+[.,]\d+$/.test(s)) return Number(s.replace(',', '.'));
  return NaN;
}

export function escapeLike(teks: string): string {
  return teks.replace(/[\\%_]/g, (karakter) => `\\${karakter}`);
}

export function formatRupiah(nilai: number): string {
  const bulat = Math.round(Math.abs(nilai));
  const teks = String(bulat).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${nilai < 0 && bulat !== 0 ? '-' : ''}Rp ${teks}`;
}

export function formatPersen(nilai: number): string {
  return `${nilai.toFixed(1).replace('.', ',')}%`;
}
