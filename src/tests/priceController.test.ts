import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PriceController, ValidationError } from '../controllers/PriceController';
import { Produk } from '../models/Produk';
import { PESAN_INPUT_TIDAK_VALID } from '../models/pesan';

// Unit test kelas C13 PriceController serta skenario UC05 (Mengelola Harga Jual Produk).
// Supabase diganti mock sehingga pengujian berjalan lokal tanpa akses jaringan.

type Hasil = { data?: unknown; error: { message: string } | null };

type QueryPalsu = {
  tabel: string;
  select: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  then: (ok: (v: Hasil) => unknown, gagal?: (e: unknown) => unknown) => Promise<unknown>;
};

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('../services/supabase', () => ({ supabase: { from } }));

let antrean: Hasil[] = [];
let query: QueryPalsu[] = [];

function buatQuery(tabel: string, hasil: Hasil): QueryPalsu {
  const q = { tabel } as QueryPalsu;
  for (const m of ['select', 'update', 'insert', 'eq'] as const) {
    q[m] = vi.fn(() => q);
  }
  q.then = (ok, gagal) => Promise.resolve(hasil).then(ok, gagal);
  return q;
}

function siapkan(...hasil: Hasil[]) {
  antrean = [...hasil];
}

const ok = (data?: unknown): Hasil => ({ data, error: null });
const gagal = (pesan: string): Hasil => ({ data: null, error: { message: pesan } });

function buatProduk(hargaJual = 15000, hasilResep = 1, margin = 6000): Produk {
  const produk = new Produk();
  produk.setNamaProduk('Nasi Goreng');
  produk.setHargaJual(hargaJual);
  produk.setHasilResep(hasilResep);
  produk.setMargin(margin);
  return produk;
}

// Data resep contoh: telur (takaran 2 x 2000) + beras (takaran 1 x 5000) = 9000.
const resepContoh = [
  { takaran: 2, tbl_bahan_baku: { harga_beli: 2000 } },
  { takaran: '1', tbl_bahan_baku: [{ harga_beli: '5000' }] },
];

beforeEach(() => {
  antrean = [];
  query = [];
  from.mockReset();
  from.mockImplementation((tabel: string) => {
    const hasil = antrean.shift();
    if (hasil === undefined) throw new Error(`Query tak terduga ke ${tabel}`);
    const q = buatQuery(tabel, hasil);
    query.push(q);
    return q;
  });
});

describe('C13 PriceController.validasiInput()', () => {
  it('C13-UT01 normal: harga baru positif memperbarui harga, margin, dan mencatat riwayat lalu mengembalikan true', async () => {
    siapkan(ok(resepContoh), ok(), ok());
    const produk = buatProduk(15000, 1, 6000);
    const controller = new PriceController(produk, 'p1');

    const hasil = await controller.validasiInput(20000);

    expect(hasil).toBe(true);
    expect(produk.getHargaJual()).toBe(20000);
    expect(produk.getMargin()).toBe(11000);
    expect(query.map((q) => q.tabel)).toEqual([
      'tbl_resep_bahan',
      'tbl_produk',
      'tbl_riwayat_harga_jual',
    ]);
    expect(query[0].eq).toHaveBeenCalledWith('id_produk', 'p1');
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 20000, margin: 11000 });
    expect(query[1].eq).toHaveBeenCalledWith('id_produk', 'p1');
    expect(query[2].insert).toHaveBeenCalledWith({
      id_produk: 'p1',
      harga_jual_lama: 15000,
      harga_baru: 20000,
      waktu_perubahan: expect.any(String),
    });
  });

  it('C13-UT02 batas: harga baru nol ditolak dengan ValidationError tanpa mengakses basis data', async () => {
    const produk = buatProduk(15000, 1, 6000);
    const controller = new PriceController(produk, 'p1');

    const err = await controller.validasiInput(0).catch((e) => e);

    expect(err).toBeInstanceOf(ValidationError);
    expect(err.name).toBe('ValidationError');
    expect(err.message).toBe(PESAN_INPUT_TIDAK_VALID);
    expect(from).not.toHaveBeenCalled();
    expect(produk.getHargaJual()).toBe(15000);
  });

  it.each([
    ['negatif', -5000],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])(
    'C13-UT03 negatif: harga baru %s ditolak dengan ValidationError sebelum menyentuh basis data',
    async (_label, harga) => {
      const produk = buatProduk(15000, 1, 6000);
      const controller = new PriceController(produk, 'p1');

      await expect(controller.validasiInput(harga)).rejects.toThrow(ValidationError);
      await expect(controller.validasiInput(harga)).rejects.toThrow(PESAN_INPUT_TIDAK_VALID);
      expect(from).not.toHaveBeenCalled();
    },
  );
});

describe('C13 PriceController.updateHargaProduk()', () => {
  it('C13-UT04 normal: HPP dibagi hasilResep (> 1 porsi) dan menerima margin negatif bila harga di bawah HPP', async () => {
    // Total biaya = 100.000, hasil resep = 10 porsi -> HPP = 10.000.
    // Harga baru = 8.000 -> margin baru = -2.000.
    siapkan(ok([{ takaran: 2, tbl_bahan_baku: { harga_beli: 50000 } }]), ok(), ok());
    const produk = buatProduk(15000, 10, 5000);
    const controller = new PriceController(produk, 'p2');

    await controller.updateHargaProduk(8000);

    expect(produk.getHargaJual()).toBe(8000);
    expect(produk.getMargin()).toBe(-2000);
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 8000, margin: -2000 });
    expect(query[2].insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id_produk: 'p2',
        harga_jual_lama: 15000,
        harga_baru: 8000,
      }),
    );
  });

  it('C13-UT05 batas: margin tepat 0 ketika harga baru sama dengan HPP', async () => {
    siapkan(ok(resepContoh), ok(), ok());
    const produk = buatProduk(15000, 1, 6000);
    const controller = new PriceController(produk, 'p1');

    await controller.updateHargaProduk(9000);

    expect(produk.getHargaJual()).toBe(9000);
    expect(produk.getMargin()).toBe(0);
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 9000, margin: 0 });
  });

  it('C13-UT06 batas: resep null atau bahan tanpa harga beli diperlakukan sebagai biaya 0', async () => {
    siapkan(ok(null), ok(), ok());
    const produkTanpaResep = buatProduk(10000, 1, 10000);
    await new PriceController(produkTanpaResep, 'p3').updateHargaProduk(12000);

    expect(produkTanpaResep.getMargin()).toBe(12000);
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 12000, margin: 12000 });

    query = [];
    siapkan(
      ok([
        { takaran: 2, tbl_bahan_baku: null },
        { takaran: 3, tbl_bahan_baku: {} },
      ]),
      ok(),
      ok(),
    );
    const produkBahanKosong = buatProduk(10000, 1, 10000);
    await new PriceController(produkBahanKosong, 'p4').updateHargaProduk(14000);

    expect(produkBahanKosong.getMargin()).toBe(14000);
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 14000, margin: 14000 });
  });

  it('C13-UT07 negatif: gagal mengambil data resep melempar error tanpa memperbarui produk', async () => {
    siapkan(gagal('Koneksi DB putus'));
    const produk = buatProduk(15000, 1, 6000);
    const controller = new PriceController(produk, 'p1');

    await expect(controller.updateHargaProduk(20000)).rejects.toThrow(
      'Gagal mengambil data resep: Koneksi DB putus',
    );
    expect(produk.getHargaJual()).toBe(15000);
    expect(produk.getMargin()).toBe(6000);
    expect(query).toHaveLength(1);
  });

  it('C13-UT08 negatif: gagal memperbarui tbl_produk mengembalikan harga jual ke harga lama dan tidak mencatat riwayat', async () => {
    siapkan(ok(resepContoh), gagal('Izin ditolak'));
    const produk = buatProduk(15000, 1, 6000);
    const controller = new PriceController(produk, 'p1');

    await expect(controller.updateHargaProduk(20000)).rejects.toThrow(
      'Gagal memperbarui harga jual: Izin ditolak',
    );
    expect(produk.getHargaJual()).toBe(15000);
    expect(query).toHaveLength(2);
  });
});

describe('C13 PriceController.catatRiwayat()', () => {
  it('C13-UT09 normal: menyimpan riwayat harga jual dengan waktu ISO valid', async () => {
    siapkan(ok());
    const controller = new PriceController(buatProduk(15000), 'p1');

    await controller.catatRiwayat(15000, 18000);

    expect(query).toHaveLength(1);
    expect(query[0].tabel).toBe('tbl_riwayat_harga_jual');
    const arg = query[0].insert.mock.calls[0][0] as {
      id_produk: string;
      harga_jual_lama: number;
      harga_baru: number;
      waktu_perubahan: string;
    };
    expect(arg.id_produk).toBe('p1');
    expect(arg.harga_jual_lama).toBe(15000);
    expect(arg.harga_baru).toBe(18000);
    expect(Number.isNaN(Date.parse(arg.waktu_perubahan))).toBe(false);
  });

  it('C13-UT10 negatif: gagal menyimpan riwayat ke basis data melempar error', async () => {
    siapkan(gagal('Constraint error'));
    const controller = new PriceController(buatProduk(15000), 'p1');

    await expect(controller.catatRiwayat(15000, 18000)).rejects.toThrow(
      'Gagal mencatat riwayat harga: Constraint error',
    );
  });

  it('C13-UT11 negatif: harga lama atau harga baru tidak positif ditolak sebelum insert ke basis data', async () => {
    const controller = new PriceController(buatProduk(15000), 'p1');

    await expect(controller.catatRiwayat(0, 18000)).rejects.toThrow(PESAN_INPUT_TIDAK_VALID);
    await expect(controller.catatRiwayat(15000, -1000)).rejects.toThrow(PESAN_INPUT_TIDAK_VALID);
    expect(from).not.toHaveBeenCalled();
  });
});

describe('UC05 Mengelola Harga Jual Produk', () => {
  it('UC05-TC01 normal: pemilik usaha memperbarui harga jual produk dengan nilai positif, margin diperbarui dan riwayat tersimpan', async () => {
    // Ayam Geprek: harga jual awal 18.000, hasil resep 2 porsi, total biaya 24.000 -> HPP 12.000.
    // Harga baru 22.000 -> margin baru 10.000.
    siapkan(ok([{ takaran: 2, tbl_bahan_baku: { harga_beli: 12000 } }]), ok(), ok());
    const produk = new Produk();
    produk.setNamaProduk('Ayam Geprek');
    produk.setHargaJual(18000);
    produk.setHasilResep(2);
    produk.setMargin(6000);

    const controller = new PriceController(produk, 'p-ayam');
    const berhasil = await controller.validasiInput(22000);

    expect(berhasil).toBe(true);
    expect(produk.getHargaJual()).toBe(22000);
    expect(produk.getMargin()).toBe(10000);
    expect(query[1].update).toHaveBeenCalledWith({ harga_jual: 22000, margin: 10000 });
    expect(query[2].insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id_produk: 'p-ayam',
        harga_jual_lama: 18000,
        harga_baru: 22000,
      }),
    );
  });

  it('UC05-TC02 alternatif: pemilik usaha memasukkan harga jual bukan bilangan positif, sistem menolak dan tidak menyimpan ke database', async () => {
    const produk = new Produk();
    produk.setNamaProduk('Ayam Geprek');
    produk.setHargaJual(18000);
    produk.setHasilResep(2);
    produk.setMargin(6000);

    const controller = new PriceController(produk, 'p-ayam');

    await expect(controller.validasiInput(-5000)).rejects.toThrow(ValidationError);
    await expect(controller.validasiInput(0)).rejects.toThrow(PESAN_INPUT_TIDAK_VALID);
    expect(produk.getHargaJual()).toBe(18000);
    expect(produk.getMargin()).toBe(6000);
    expect(from).not.toHaveBeenCalled();
  });
});
