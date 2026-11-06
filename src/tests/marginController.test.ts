import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  produkCount: 0,
  bahan: [] as Record<string, unknown>[],
  inserts: [] as { tabel: string; data: unknown }[],
  resepGagal: false,
  hapus: [] as string[],
}));

vi.mock('../services/supabase', () => {
  const hasil = (nilai: unknown) => {
    const b: Record<string, unknown> = {};
    b.eq = () => b;
    b.ilike = () => b;
    b.then = (resolve: (v: unknown) => unknown) => resolve(nilai);
    return b;
  };

  return {
    supabase: {
      auth: {
        getUser: async () => ({ data: { user: { id: 'u1' } }, error: null }),
      },
      from: (tabel: string) => ({
        select: () =>
          tabel === 'tbl_produk'
            ? hasil({ count: state.produkCount, error: null })
            : hasil({ data: state.bahan, error: null }),
        insert: (data: unknown) => {
          state.inserts.push({ tabel, data });
          const b: Record<string, unknown> = {};
          b.select = () => ({
            single: async () => ({
              data: { id_produk: 'p1', id_bahan: `b${state.inserts.length}` },
              error: null,
            }),
          });
          b.then = (resolve: (v: unknown) => unknown) =>
            resolve({
              error:
                tabel === 'tbl_resep_bahan' && state.resepGagal
                  ? { message: 'gagal' }
                  : null,
            });
          return b;
        },
        delete: () => ({
          eq: async (_kolom: string, nilai: string) => {
            state.hapus.push(nilai);
            return { error: null };
          },
        }),
      }),
    },
  };
});

import { MarginController } from '../controllers/MarginController';

const bahanDb = [
  { id_bahan: 'beras', nama_bahan: 'Beras', harga_beli: 15000, satuan: 'kg' },
  { id_bahan: 'ayam', nama_bahan: 'Ayam', harga_beli: 45000, satuan: 'kg' },
  { id_bahan: 'kecap', nama_bahan: 'Kecap', harga_beli: 40, satuan: 'ml' },
];

beforeEach(() => {
  state.produkCount = 0;
  state.bahan = [...bahanDb];
  state.inserts = [];
  state.resepGagal = false;
  state.hapus = [];
});

const dasar = {
  namaProduk: 'Nasi Ayam Kecap',
  tag: ['Makanan utama'],
  hargaJual: 20000,
  hasilResep: 10,
};

describe('MarginController.validasiInput', () => {
  it('menghitung preview dari bahan yang dipilih (harga dari database)', async () => {
    const c = new MarginController();
    const hasil = await c.validasiInput({
      ...dasar,
      bahan: [
        { idBahan: 'beras', namaBahan: 'x', hargaBeli: 1, satuan: 'x', takaran: 1 },
        { idBahan: 'ayam', namaBahan: 'x', hargaBeli: 1, satuan: 'x', takaran: 2 },
        { idBahan: 'kecap', namaBahan: 'x', hargaBeli: 1, satuan: 'x', takaran: 250 },
      ],
    });
    expect(hasil.totalBiaya).toBe(115000);
    expect(hasil.hpp).toBe(11500);
    expect(hasil.margin).toBe(8500);
    expect(hasil.persenMargin).toBe(42.5);
  });

  it('menolak nama produk yang sudah ada', async () => {
    state.produkCount = 1;
    await expect(
      new MarginController().validasiInput({ ...dasar, bahan: [] }),
    ).rejects.toThrow('Nama Produk Sudah Pernah Dibuat');
  });

  it('menolak takaran tidak valid', async () => {
    await expect(
      new MarginController().validasiInput({
        ...dasar,
        bahan: [{ idBahan: 'beras', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 0 }],
      }),
    ).rejects.toThrow('Takaran harus lebih dari 0');
  });

  it('menolak bahan yang sama dua kali', async () => {
    const b = { idBahan: 'beras', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 1 };
    await expect(
      new MarginController().validasiInput({ ...dasar, bahan: [b, b] }),
    ).rejects.toThrow('Bahan baku tidak boleh duplikat dalam satu resep');
  });

  it('menolak bahan baru yang namanya sudah ada', async () => {
    await expect(
      new MarginController().validasiInput({
        ...dasar,
        bahan: [{ idBahan: null, namaBahan: 'beras', hargaBeli: 10, satuan: 'kg', takaran: 1 }],
      }),
    ).rejects.toThrow('sudah ada, pilih dari daftar');
  });

  it('menolak hasil resep bukan bilangan bulat', async () => {
    await expect(
      new MarginController().validasiInput({
        ...dasar,
        hasilResep: 2.5,
        bahan: [{ idBahan: 'beras', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 1 }],
      }),
    ).rejects.toThrow('Hasil resep harus berupa bilangan bulat lebih dari 0');
  });

  it('margin negatif bila harga jual di bawah HPP', async () => {
    const hasil = await new MarginController().validasiInput({
      ...dasar,
      hargaJual: 5000,
      bahan: [{ idBahan: 'ayam', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 2 }],
    });
    expect(hasil.hpp).toBe(9000);
    expect(hasil.margin).toBe(-4000);
  });
});

describe('MarginController.simpanProduk', () => {
  it('menyimpan produk, bahan baru, dan resep', async () => {
    const c = new MarginController();
    await c.validasiInput({
      ...dasar,
      bahan: [
        { idBahan: 'beras', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 1 },
        { idBahan: null, namaBahan: 'Bumbu', hargaBeli: 15000, satuan: 'pak', takaran: 1 },
      ],
    });
    await c.simpanProduk();

    const produk = state.inserts.find((i) => i.tabel === 'tbl_produk')?.data as Record<string, unknown>;
    expect(produk.hasil_resep).toBe(10);
    expect(produk.margin).toBe(17000);
    expect(produk.tag).toEqual(['makanan utama']);

    const bahanBaru = state.inserts.find((i) => i.tabel === 'tbl_bahan_baku')?.data as Record<string, unknown>;
    expect(bahanBaru).toMatchObject({ nama_bahan: 'Bumbu', harga_beli: 15000, satuan: 'pak' });

    const resep = state.inserts.find((i) => i.tabel === 'tbl_resep_bahan')?.data as unknown[];
    expect(resep).toHaveLength(2);
  });

  it('membatalkan produk bila resep gagal disimpan', async () => {
    state.resepGagal = true;
    const c = new MarginController();
    await c.validasiInput({
      ...dasar,
      bahan: [{ idBahan: 'beras', namaBahan: '', hargaBeli: 0, satuan: '', takaran: 1 }],
    });
    await expect(c.simpanProduk()).rejects.toThrow('gagal');
    expect(state.hapus).toEqual(['p1']);
  });

  it('menolak simpan sebelum preview dihitung', async () => {
    await expect(new MarginController().simpanProduk()).rejects.toThrow(
      'Hitung preview margin terlebih dahulu',
    );
  });
});
