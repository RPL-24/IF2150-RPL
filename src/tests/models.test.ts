import { describe, expect, it } from 'vitest';
import { BahanBaku } from '../models/BahanBaku';
import { DAFTAR_TAG, Produk } from '../models/Produk';
import { ResepBahan } from '../models/ResepBahan';

describe('Produk (C02)', () => {
  it('menolak nama kosong dan merapikan nama', () => {
    const p = new Produk();
    expect(() => p.setNamaProduk('   ')).toThrow('Nama produk wajib diisi');
    p.setNamaProduk('  Nasi Goreng ');
    expect(p.getNamaProduk()).toBe('Nasi Goreng');
  });

  it('menormalisasi tag: huruf kecil, rapi, tanpa duplikat', () => {
    const p = new Produk();
    p.setTag([' Makanan ', 'makanan', 'Nasi   Goreng', '']);
    expect(p.getTag()).toEqual(['makanan', 'nasi goreng']);
  });

  it('daftar tag tersedia', () => {
    expect(DAFTAR_TAG).toContain('Makanan utama');
  });

  it('harga jual harus positif', () => {
    const p = new Produk();
    expect(() => p.setHargaJual(0)).toThrow('Input Takaran / Harga Jual Tidak Valid');
    expect(() => p.setHargaJual(NaN)).toThrow();
    p.setHargaJual(18000);
    expect(p.getHargaJual()).toBe(18000);
  });

  it('hasil resep harus bilangan bulat positif', () => {
    const p = new Produk();
    expect(p.getHasilResep()).toBe(1);
    expect(() => p.setHasilResep(0)).toThrow('Hasil resep harus berupa bilangan bulat lebih dari 0');
    expect(() => p.setHasilResep(2.5)).toThrow();
    p.setHasilResep(10);
    expect(p.getHasilResep()).toBe(10);
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
    expect(() => new BahanBaku('', 10, 'gram')).toThrow('Nama bahan baku wajib diisi');
    expect(() => new BahanBaku('Gula', 0, 'gram')).toThrow('Input Takaran / Harga Jual Tidak Valid');
  });

  it('satuan wajib diisi', () => {
    expect(() => new BahanBaku('Gula', 16, '  ')).toThrow('Satuan bahan baku wajib diisi');
    expect(new BahanBaku('Gula', 16).getSatuan()).toBe('unit');
  });

  it('setHargaBeli dan setSatuan memperbarui data', () => {
    const b = new BahanBaku('Gula', 16, 'gram');
    b.setHargaBeli(18);
    b.setSatuan('kg');
    expect(b.getHargaBeli()).toBe(18);
    expect(b.getSatuan()).toBe('kg');
    expect(b.getNamaBahan()).toBe('Gula');
  });
});

describe('ResepBahan (C04)', () => {
  it('takaran harus positif', () => {
    const bahan = new BahanBaku('Beras', 14, 'gram');
    expect(() => new ResepBahan(bahan, -1)).toThrow('Takaran harus lebih dari 0');
    const r = new ResepBahan(bahan, 150);
    expect(r.getTakaran()).toBe(150);
    expect(r.getBahan()).toBe(bahan);
    expect(() => r.setTakaran(0)).toThrow();
  });
});
