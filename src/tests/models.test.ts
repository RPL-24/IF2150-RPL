import { describe, expect, it } from 'vitest';
import { BahanBaku } from '../models/BahanBaku';
import { Produk } from '../models/Produk';
import { ResepBahan } from '../models/ResepBahan';

describe('Produk (C02)', () => {
  it('menolak nama kosong dan merapikan nama', () => {
    const p = new Produk();
    expect(() => p.setNamaProduk('   ')).toThrow('Nama produk tidak boleh kosong');
    p.setNamaProduk('  Nasi Goreng ');
    expect(p.getNamaProduk()).toBe('Nasi Goreng');
  });

  it('menormalisasi tag: huruf kecil, rapi, tanpa duplikat', () => {
    const p = new Produk();
    p.setTag([' Makanan ', 'makanan', 'Nasi   Goreng', '']);
    expect(p.getTag()).toEqual(['makanan', 'nasi goreng']);
  });

  it('harga jual harus positif', () => {
    const p = new Produk();
    expect(() => p.setHargaJual(0)).toThrow('Input Takaran / Harga Jual Tidak Valid');
    expect(() => p.setHargaJual(NaN)).toThrow();
    p.setHargaJual(18000);
    expect(p.getHargaJual()).toBe(18000);
  });

  it('margin boleh negatif', () => {
    const p = new Produk();
    p.setMargin(-320);
    expect(p.getMargin()).toBe(-320);
    expect(() => p.setMargin(Infinity)).toThrow();
  });
});

describe('BahanBaku (C03)', () => {
  it('menolak nama kosong dan harga tidak positif', () => {
    expect(() => new BahanBaku('', 10)).toThrow();
    expect(() => new BahanBaku('Gula', 0)).toThrow('Input Takaran / Harga Jual Tidak Valid');
  });

  it('setHargaBeli memperbarui harga', () => {
    const b = new BahanBaku('Gula', 16);
    b.setHargaBeli(18);
    expect(b.getHargaBeli()).toBe(18);
    expect(b.getNamaBahan()).toBe('Gula');
  });
});

describe('ResepBahan (C04)', () => {
  it('takaran harus positif', () => {
    const bahan = new BahanBaku('Beras', 14);
    expect(() => new ResepBahan(bahan, -1)).toThrow('Input Takaran / Harga Jual Tidak Valid');
    const r = new ResepBahan(bahan, 150);
    expect(r.getTakaran()).toBe(150);
    expect(r.getBahan()).toBe(bahan);
    expect(() => r.setTakaran(0)).toThrow();
  });
});
