export type BahanInput = {
  namaBahan: string;
  hargaBeli: number;
  takaran: number;
};

export function kunciNama(nama: string): string {
  return nama.trim().toLowerCase();
}

export function hitungHpp(
  daftarBahan: { hargaBeli: number; takaran: number }[],
): number {
  const total = daftarBahan.reduce(
    (jumlah, bahan) => jumlah + bahan.takaran * bahan.hargaBeli,
    0,
  );
  return Math.round(total * 100) / 100;
}

export function hitungMargin(hargaJual: number, hpp: number): number {
  return Math.round((hargaJual - hpp) * 100) / 100;
}

export function parseTag(teks: string): string[] {
  return teks.split(',').map((item) => item.trim()).filter((item) => item !== '');
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
