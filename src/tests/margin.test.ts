import { describe, expect, it } from 'vitest';
import {
  escapeLike,
  formatRupiah,
  hitungHpp,
  hitungMargin,
  parseAngka,
  parseTag,
} from '../controllers/margin';

describe('hitungHpp dan hitungMargin', () => {
  it('Nasi Goreng Spesial: HPP 7.520, margin 10.480', () => {
    const hpp = hitungHpp([
      { hargaBeli: 14, takaran: 150 },
      { hargaBeli: 2500, takaran: 1 },
      { hargaBeli: 20, takaran: 20 },
      { hargaBeli: 18, takaran: 15 },
      { hargaBeli: 35, takaran: 10 },
      { hargaBeli: 38, takaran: 50 },
    ]);
    expect(hpp).toBe(7520);
    expect(hitungMargin(18000, hpp)).toBe(10480);
  });

  it('margin negatif bila harga jual di bawah HPP (Kopi Susu)', () => {
    const hpp = hitungHpp([
      { hargaBeli: 120, takaran: 15 },
      { hargaBeli: 18, takaran: 150 },
      { hargaBeli: 16, takaran: 20 },
      { hargaBeli: 5, takaran: 100 },
    ]);
    expect(hpp).toBe(5320);
    expect(hitungMargin(5000, hpp)).toBe(-320);
  });

  it('tidak terkena galat floating point', () => {
    expect(hitungHpp([{ hargaBeli: 0.1, takaran: 3 }])).toBe(0.3);
  });
});

describe('parseAngka', () => {
  it('bilangan bulat', () => {
    expect(parseAngka('18000')).toBe(18000);
  });
  it('titik sebagai ribuan', () => {
    expect(parseAngka('18.000')).toBe(18000);
    expect(parseAngka('1.500.000')).toBe(1500000);
  });
  it('koma sebagai desimal', () => {
    expect(parseAngka('2,5')).toBe(2.5);
    expect(parseAngka('0,250')).toBe(0.25);
  });
  it('ribuan dan desimal sekaligus', () => {
    expect(parseAngka('1.500,50')).toBe(1500.5);
  });
  it('NaN untuk format tidak valid', () => {
    expect(parseAngka('')).toBeNaN();
    expect(parseAngka('abc')).toBeNaN();
    expect(parseAngka('12a')).toBeNaN();
    expect(parseAngka('-5')).toBeNaN();
  });
});

describe('parseTag, escapeLike, formatRupiah', () => {
  it('parseTag memecah dan membuang yang kosong', () => {
    expect(parseTag('makanan, nasi ,, ')).toEqual(['makanan', 'nasi']);
  });
  it('escapeLike melindungi karakter pola', () => {
    expect(escapeLike('50%_off')).toBe('50\\%\\_off');
  });
  it('formatRupiah', () => {
    expect(formatRupiah(10480)).toBe('Rp 10.480');
    expect(formatRupiah(-320)).toBe('-Rp 320');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});
