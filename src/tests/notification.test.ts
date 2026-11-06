import { describe, expect, it } from 'vitest';
import {
  bandingkanHarga,
  buatJudulPerubahanHarga,
  buatPesanPerubahanHarga,
  buatPesanKerugian,
  cekMarginNegatif,
  formatJam,
  formatPersen,
  hitungPersen,
  hitungUlangProduk,
  kelompokkanPerHari,
  labelHari,
  ProdukResep,
} from '../controllers/notification';
import { Notifikasi } from '../models/Notifikasi';
import { Produk } from '../models/Produk';

// Kopi Susu: harga jual 15.000. HPP awal = 120*15 + 18*150 + 16*20 + 5*100 = 5.320
const kopiSusu: ProdukResep = {
  idProduk: 'p1',
  namaProduk: 'Kopi Susu',
  hargaJual: 15000,
  resep: [
    { idBahan: 'kopi', hargaBeli: 120, takaran: 15 },
    { idBahan: 'susu', hargaBeli: 18, takaran: 150 },
    { idBahan: 'gula', hargaBeli: 16, takaran: 20 },
    { idBahan: 'es', hargaBeli: 5, takaran: 100 },
  ],
};

const teh: ProdukResep = {
  idProduk: 'p2',
  namaProduk: 'Teh Manis',
  hargaJual: 5000,
  resep: [
    { idBahan: 'teh', hargaBeli: 50, takaran: 10 },
    { idBahan: 'gula', hargaBeli: 16, takaran: 20 },
  ],
};

describe('hitungUlangProduk', () => {
  it('hanya menghitung produk yang memakai bahan tersebut', () => {
    const hasil = hitungUlangProduk([kopiSusu, teh], 'kopi', 120);
    expect(hasil.map((h) => h.idProduk)).toEqual(['p1']);
  });

  it('margin dihitung ulang dengan harga bahan baru', () => {
    // kopi 120 -> 1000: HPP = 1000*15 + 2700 + 320 + 500 = 18.520
    const [hasil] = hitungUlangProduk([kopiSusu], 'kopi', 1000);
    expect(hasil.margin).toBe(15000 - 18520);
    expect(hasil.rugi).toBe(true);
  });

  it('produk tetap untung bila kenaikan harga kecil', () => {
    const [hasil] = hitungUlangProduk([kopiSusu], 'kopi', 130);
    expect(hasil.margin).toBe(15000 - 5470);
    expect(hasil.rugi).toBe(false);
  });

  it('margin tepat 0 bukan kerugian', () => {
    // HPP awal 5.320 = harga jual, jadi margin tepat 0
    const [hasil] = hitungUlangProduk(
      [{ ...kopiSusu, hargaJual: 5320 }],
      'kopi',
      120,
    );
    expect(hasil.margin).toBe(0);
    expect(hasil.rugi).toBe(false);
  });

  it('bahan yang dipakai banyak produk memengaruhi semuanya', () => {
    // gula 16 -> 1000: Kopi HPP = 1800+2700+20000+500 = 25000 ; Teh HPP = 500+20000
    const hasil = hitungUlangProduk([kopiSusu, teh], 'gula', 1000);
    expect(hasil).toHaveLength(2);
    expect(cekMarginNegatif(hasil).map((h) => h.namaProduk)).toEqual([
      'Kopi Susu',
      'Teh Manis',
    ]);
  });

  it('daftar produk kosong menghasilkan daftar kosong', () => {
    expect(hitungUlangProduk([], 'kopi', 100)).toEqual([]);
  });
});

describe('cekMarginNegatif', () => {
  it('menyaring hanya produk rugi', () => {
    const hasil = [
      { idProduk: 'a', namaProduk: 'A', hargaJual: 10, margin: -1, rugi: true },
      { idProduk: 'b', namaProduk: 'B', hargaJual: 10, margin: 0, rugi: false },
      { idProduk: 'c', namaProduk: 'C', hargaJual: 10, margin: 10, rugi: false },
    ];
    expect(cekMarginNegatif(hasil).map((h) => h.idProduk)).toEqual(['a']);
  });
});

describe('bandingkanHarga', () => {
  it('naik, turun, tetap', () => {
    expect(bandingkanHarga(100, 150)).toBe('naik');
    expect(bandingkanHarga(100, 50)).toBe('turun');
    expect(bandingkanHarga(100, 100)).toBe('tetap');
  });
});

describe('persen', () => {
  it('hitungPersen membulatkan 1 desimal', () => {
    expect(hitungPersen(40000, 45000)).toBe(12.5);
    expect(hitungPersen(100, 50)).toBe(-50);
    expect(hitungPersen(0, 10)).toBe(0);
  });

  it('formatPersen memakai koma dan tanda', () => {
    expect(formatPersen(12.5)).toBe('+12,5%');
    expect(formatPersen(-8.3)).toBe('-8,3%');
    expect(formatPersen(0)).toBe('0%');
    expect(formatPersen(10)).toBe('+10%');
  });
});

describe('pesan notifikasi', () => {
  it('pesan kerugian sesuai desain: nama, selisih per porsi, persen, bahan, harga baru', () => {
    // Ayam Geprek harga jual 18.000, margin -1.500 => -8,3%
    expect(buatPesanKerugian('Ayam Geprek', 'ayam', -1500, 18000, 45000)).toBe(
      'Ayam Geprek rugi ~Rp 1.500/porsi (-8,3%) karena harga ayam naik menjadi Rp 45.000.',
    );
  });

  it('judul perubahan harga naik dan turun', () => {
    expect(buatJudulPerubahanHarga('ayam', 40000, 45000)).toBe('Harga ayam naik +12,5%');
    expect(buatJudulPerubahanHarga('beras', 15000, 12000)).toBe('Harga beras turun -20%');
    expect(buatJudulPerubahanHarga('beras', 15000, 15000)).toBe('Harga beras diperbarui');
  });

  it('pesan perubahan harga, dengan dan tanpa produk terdampak', () => {
    expect(buatPesanPerubahanHarga(40000, 45000, 2)).toBe(
      'Harga beli berubah dari Rp 40.000 menjadi Rp 45.000. Periksa dampaknya pada HPP produk.',
    );
    expect(buatPesanPerubahanHarga(40000, 45000, 0)).toBe(
      'Harga beli berubah dari Rp 40.000 menjadi Rp 45.000.',
    );
  });
});

describe('pengelompokan per hari', () => {
  const sekarang = new Date(2026, 9, 28, 12, 0); // 28 Okt 2026

  it('label hari ini, kemarin, dan tanggal lama', () => {
    expect(labelHari(new Date(2026, 9, 28, 9, 20), sekarang)).toBe('HARI INI · 28 OKT 2026');
    expect(labelHari(new Date(2026, 9, 27, 15, 0), sekarang)).toBe('KEMARIN · 27 OKT 2026');
    expect(labelHari(new Date(2026, 9, 20, 8, 0), sekarang)).toBe('20 OKT 2026');
  });

  it('kemarin benar melewati batas bulan', () => {
    expect(labelHari(new Date(2026, 9, 31, 8, 0), new Date(2026, 10, 1, 8, 0))).toBe(
      'KEMARIN · 31 OKT 2026',
    );
  });

  it('formatJam memakai titik dan nol di depan', () => {
    expect(formatJam(new Date(2026, 9, 28, 9, 5))).toBe('09.05');
  });

  it('kelompokkanPerHari mempertahankan urutan dan menggabungkan hari sama', () => {
    const item = [
      { id: 1, w: new Date(2026, 9, 28, 9, 20) },
      { id: 2, w: new Date(2026, 9, 28, 8, 0) },
      { id: 3, w: new Date(2026, 9, 27, 15, 0) },
    ];
    const grup = kelompokkanPerHari(item, (i) => i.w, sekarang);
    expect(grup.map((g) => g.label)).toEqual(['HARI INI · 28 OKT 2026', 'KEMARIN · 27 OKT 2026']);
    expect(grup[0].item.map((i) => i.id)).toEqual([1, 2]);
    expect(kelompokkanPerHari([], (i: { w: Date }) => i.w, sekarang)).toEqual([]);
  });
});

describe('model Notifikasi', () => {
  it('awalnya belum dibaca dan markAsRead mengubahnya', () => {
    const n = new Notifikasi('1', 'Judul', 'Halo', new Date(0), 'kerugian', 'p1');
    expect(n.getIsRead()).toBe(false);
    n.markAsRead();
    expect(n.getIsRead()).toBe(true);
    expect(n.getPesanAlert()).toBe('Halo');
    expect(n.getJudul()).toBe('Judul');
  });

  it('menolak pesan kosong', () => {
    expect(() => new Notifikasi('1', 'Judul', '   ', new Date(0), 'harga_bahan')).toThrow();
  });
});

describe('Produk.statusPeringatan', () => {
  it('default false dan bisa diubah', () => {
    const p = new Produk();
    expect(p.getStatusPeringatan()).toBe(false);
    p.setStatusPeringatan(true);
    expect(p.getStatusPeringatan()).toBe(true);
  });
});
