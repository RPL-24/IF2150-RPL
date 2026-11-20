import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ProductSearchController,
  ProductSearchError,
} from '../controllers/ProductSearchController';

vi.mock('../services/supabase', () => ({ supabase: {} }));

function createMockSupabase(responses: Array<{ data?: unknown; error?: unknown }>) {
  let callIndex = 0;
  const builder: Record<string, vi.mock> = {};
  const chainMethods = ['select', 'order', 'limit', 'ilike', 'contains', 'in'];

  chainMethods.forEach((method) => {
    builder[method] = vi.fn(() => builder);
  });

  (builder as unknown as PromiseLike<unknown>).then = (resolve) => {
    const res = responses[callIndex++] ?? { data: [], error: null };
    return Promise.resolve(res).then(resolve);
  };

  return {
    from: vi.fn(() => builder),
  } as unknown as SupabaseClient;
}

describe('ProductSearchController (C22)', () => {
  const sampleRow = {
    id_produk: 'p1',
    nama_produk: 'Es Kopi Susu',
    tag: 'minuman, kopi',
    harga_jual: 20000,
    margin: 8000,
  };

  it('[Normal] mencari dengan filter "nama" dan menghitung HPP dengan benar', async () => {
    const mockClient = createMockSupabase([{ data: [sampleRow], error: null }]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: 'Kopi', filter: 'nama' });

    expect(hasil).toHaveLength(1);
    expect(hasil[0]).toEqual({
      id: 'p1',
      nama: 'Es Kopi Susu',
      tag: ['minuman', 'kopi'],
      hargaJual: 20000,
      hpp: 12000, // harga_jual - margin
    });
  });

  it('[Normal] mencari dengan filter "tag"', async () => {
    const mockClient = createMockSupabase([{ data: [sampleRow], error: null }]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: 'Minuman', filter: 'tag' });
    expect(hasil).toHaveLength(1);
  });

  it('[Normal] mencari dengan filter "semua" (gabungan nama dan tag)', async () => {
    const mockClient = createMockSupabase([
      { data: [{ id_produk: 'p1' }], error: null }, // hasilNama
      { data: [{ id_produk: 'p1' }], error: null }, // hasilTag (duplikat diuji)
      { data: [sampleRow], error: null }, // query utama
    ]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: 'kopi', filter: 'semua' });
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id).toBe('p1');
  });

  it('[Normal] mencari dengan filter "bahan_baku"', async () => {
    const mockClient = createMockSupabase([
      { data: [{ id_bahan: 'b1' }], error: null }, // tbl_bahan_baku
      { data: [{ id_produk: 'p1' }], error: null }, // tbl_resep_bahan
      { data: [sampleRow], error: null }, // tbl_produk
    ]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: 'susu', filter: 'bahan_baku' });
    expect(hasil).toHaveLength(1);
  });

  it('[Boundary] keyword kosong atau hanya karakter khusus tetap mengembalikan daftar produk', async () => {
    const mockClient = createMockSupabase([{ data: [sampleRow], error: null }]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: '  %*()  ' });
    expect(hasil).toHaveLength(1);
  });

  it('[Boundary] mengembalikan array kosong jika tidak ada produk yang cocok', async () => {
    const mockClient = createMockSupabase([
      { data: [], error: null }, // hasilNama kosong
      { data: [], error: null }, // hasilTag kosong
    ]);
    const controller = new ProductSearchController(mockClient);

    const hasil = await controller.search({ keyword: 'tidakada', filter: 'semua' });
    expect(hasil).toEqual([]);
  });

  it('[Negative] melempar ProductSearchError saat query database gagal', async () => {
    const mockClient = createMockSupabase([{ data: null, error: { message: 'Network error' } }]);
    const controller = new ProductSearchController(mockClient);

    await expect(controller.search({ keyword: 'kopi', filter: 'nama' })).rejects.toThrow(
      ProductSearchError,
    );
  });
});