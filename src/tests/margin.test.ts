import { describe, expect, it } from 'vitest';
import {
  escapeLike,
  formatPersen,
  formatRupiah,
  hitungHpp,
  hitungMargin,
  hitungPersenMargin,
  hitungTotalBiaya,
  parseAngka,
} from '../controllers/margin';

describe('perhitungan sesuai rancangan I-06', () => {
  const resep = [
    { hargaBeli: 15000, takaran: 1 },
    { hargaBeli: 45000, takaran: 2 },
    { hargaBeli: 40, takaran: 250 },
    { hargaBeli: 15000, takaran: 1 },
  ];

  it('total biaya resep Rp 130.000', () => {
    expect(hitungTotalBiaya(resep)).toBe(130000);
  });

  it('HPP per porsi Rp 13.000 untuk 10 porsi', () => {
    expect(hitungHpp(resep, 10)).toBe(13000);
  });

  it('margin Rp 7.000 dan 35% pada harga jual Rp 20.000', () => {
    const margin = hitungMargin(20000, hitungHpp(resep, 10));
    expect(margin).toBe(7000);
    expect(hitungPersenMargin(20000, margin)).toBe(35);
  });
});

describe('hitungHpp dan hitungMargin', () => {
  it('porsi bawaan 1 sehingga HPP sama dengan total biaya', () => {
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

  it('porsi tidak valid diperlakukan sebagai 1', () => {
    expect(hitungHpp([{ hargaBeli: 100, takaran: 2 }], 0)).toBe(200);
    expect(hitungHpp([{ hargaBeli: 100, takaran: 2 }], NaN)).toBe(200);
  });

  it('margin negatif bila harga jual di bawah HPP', () => {
    const hpp = hitungHpp([
      { hargaBeli: 120, takaran: 15 },
      { hargaBeli: 18, takaran: 150 },
      { hargaBeli: 16, takaran: 20 },
      { hargaBeli: 5, takaran: 100 },
    ]);
    expect(hpp).toBe(5320);
    expect(hitungMargin(5000, hpp)).toBe(-320);
    expect(hitungPersenMargin(5000, -320)).toBe(-6.4);
  });

  it('tidak terkena galat floating point', () => {
    expect(hitungHpp([{ hargaBeli: 0.1, takaran: 3 }])).toBe(0.3);
  });

  it('persen margin 0 bila harga jual tidak valid', () => {
    expect(hitungPersenMargin(0, 100)).toBe(0);
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

describe('escapeLike dan format', () => {
  it('escapeLike melindungi karakter pola', () => {
    expect(escapeLike('50%_off')).toBe('50\\%\\_off');
  });
  it('formatRupiah', () => {
    expect(formatRupiah(10480)).toBe('Rp 10.480');
    expect(formatRupiah(-320)).toBe('-Rp 320');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
  it('formatPersen memakai koma desimal', () => {
    expect(formatPersen(35)).toBe('35,0%');
    expect(formatPersen(-6.4)).toBe('-6,4%');
  });
});
