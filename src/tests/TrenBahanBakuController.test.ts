import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  TrenBahanBakuController,
  TrenBahanBakuError,
  type RiwayatHarga,
} from '../controllers/TrenBahanBakuController';

vi.mock('../services/supabase', () => ({ supabase: {} }));

// Helper untuk membuat mock chainable query Supabase
function createMockSupabase(responses: Array<{ data?: unknown; error?: unknown }>) {
  let callIndex = 0;
  const builder: Record<string, vi.mock> = {};
  const chainMethods = ['select', 'eq', 'gte', 'lt', 'order', 'limit', 'single'];

  chainMethods.forEach((method) => {
    builder[method] = vi.fn(() => builder);
  });

  // Agar bisa di-await langsung
  (builder as unknown as PromiseLike<unknown>).then = (resolve) => {
    const res = responses[callIndex++] ?? { data: [], error: null };
    return Promise.resolve(res).then(resolve);
  };

  return {
    from: vi.fn(() => builder),
  } as unknown as SupabaseClient;
}

describe('TrenBahanBakuController (C16)', () => {
  describe('filterByRentang()', () => {
    const controller = new TrenBahanBakuController(createMockSupabase([]));

    it('[Normal] hanya mengembalikan riwayat dalam rentang 7 hari terakhir', () => {
      const sekarang = new Date();
      const tigaHariLalu = new Date(sekarang);
      tigaHariLalu.setDate(sekarang.getDate() - 3);

      const sepuluhHariLalu = new Date(sekarang);
      sepuluhHariLalu.setDate(sekarang.getDate() - 10);

      const data: RiwayatHarga[] = [
        { id: '1', bahanId: 'b1', harga: 10000, tanggal: sepuluhHariLalu.toISOString() },
        { id: '2', bahanId: 'b1', harga: 12000, tanggal: tigaHariLalu.toISOString() },
      ];

      const hasil = controller.filterByRentang(data, 7);
      expect(hasil).toHaveLength(1);
      expect(hasil[0].id).toBe('2');
    });

    it('[Boundary] menyertakan data tepat pada batas awal hari (00:00) rentang 7 hari', () => {
      const batasTepat = new Date();
      batasTepat.setHours(0, 0, 0, 0);
      batasTepat.setDate(batasTepat.getDate() - 6); // 7 hari termasuk hari ini

      const data: RiwayatHarga[] = [
        { id: '1', bahanId: 'b1', harga: 15000, tanggal: batasTepat.toISOString() },
      ];

      const hasil = controller.filterByRentang(data, 7);
      expect(hasil).toHaveLength(1);
    });

    it('[Negative] mengembalikan array kosong jika input riwayat kosong atau tanggal invalid', () => {
      expect(controller.filterByRentang([], 30)).toEqual([]);

      const dataInvalid: RiwayatHarga[] = [
        { id: '1', bahanId: 'b1', harga: 10000, tanggal: 'bukan-tanggal' },
      ];
      expect(controller.filterByRentang(dataInvalid, 7)).toEqual([]);
    });
  });

  describe('formatUntukChart()', () => {
    const controller = new TrenBahanBakuController(createMockSupabase([]));

    it('[Normal] mengelompokkan hari yang sama (ambil harga terakhir) dan menghitung ringkasan', () => {
      const data: RiwayatHarga[] = [
        { id: '1', bahanId: 'b1', harga: 10000, tanggal: '2026-11-01T08:00:00Z' },
        { id: '2', bahanId: 'b1', harga: 12000, tanggal: '2026-11-01T15:00:00Z' }, // hari sama
        { id: '3', bahanId: 'b1', harga: 15000, tanggal: '2026-11-02T10:00:00Z' },
      ];

      const res = controller.formatUntukChart(data);
      expect(res.jumlahTitik).toBe(2);
      expect(res.chart.datasets[0].data).toEqual([12000, 15000]);
      expect(res.ringkasan).toEqual({
        terendah: 12000,
        tertinggi: 15000,
        rataRata: 13500,
        hargaAwal: 12000,
        hargaAkhir: 15000,
        perubahanPersen: 25,
      });
    });

    it('[Boundary] menjarangkan label sumbu-X jika titik data lebih dari 5 hari', () => {
      const data: RiwayatHarga[] = Array.from({ length: 7 }, (_, i) => ({
        id: String(i),
        bahanId: 'b1',
        harga: 10000 + i * 1000,
        tanggal: `2026-11-0${i + 1}T10:00:00Z`,
      }));

      const res = controller.formatUntukChart(data);
      expect(res.jumlahTitik).toBe(7);
      expect(res.chart.labels.includes('')).toBe(true);
      expect(res.chart.labels[res.chart.labels.length - 1]).not.toBe('');
    });

    it('[Negative] mengabaikan data tanggal/harga NaN dan mengembalikan ringkasan null jika kosong', () => {
      const dataRusak: RiwayatHarga[] = [
        { id: '1', bahanId: 'b1', harga: Number.NaN, tanggal: '2026-11-01T10:00:00Z' },
        { id: '2', bahanId: 'b1', harga: 10000, tanggal: 'invalid-date' },
      ];

      const res = controller.formatUntukChart(dataRusak);
      expect(res.jumlahTitik).toBe(0);
      expect(res.ringkasan).toBeNull();
      expect(res.chart.labels).toEqual([]);
    });
  });

  describe('getDaftarBahanBaku(), getRiwayatHarga(), dan getTren()', () => {
    it('[Normal] getDaftarBahanBaku memetakan data dari Supabase', async () => {
      const mockClient = createMockSupabase([
        {
          data: [{ id_bahan: '1', nama_bahan: 'Gula', satuan: 'kg' }],
          error: null,
        },
      ]);
      const controller = new TrenBahanBakuController(mockClient);

      const hasil = await controller.getDaftarBahanBaku();
      expect(hasil).toEqual([{ id: '1', nama: 'Gula', satuan: 'kg' }]);
    });

    it('[Negative] getDaftarBahanBaku melempar TrenBahanBakuError saat query gagal', async () => {
      const mockClient = createMockSupabase([{ data: null, error: { message: 'DB error' } }]);
      const controller = new TrenBahanBakuController(mockClient);

      await expect(controller.getDaftarBahanBaku()).rejects.toThrow(TrenBahanBakuError);
    });

    it('[Normal] getTren mengambil riwayat + baseline sebelum rentang lalu memformatnya', async () => {
      const mockClient = createMockSupabase([
        // Query 1: riwayat dalam rentang
        {
          data: [
            {
              id_riwayat: 'r2',
              id_bahan: 'b1',
              harga_beli_baru: 12000,
              waktu_perubahan: new Date().toISOString(),
            },
          ],
          error: null,
        },
        // Query 2: baseline sebelum rentang
        {
          data: [
            {
              id_riwayat: 'r1',
              id_bahan: 'b1',
              harga_beli_baru: 10000,
              waktu_perubahan: '2026-01-01T00:00:00Z',
            },
          ],
          error: null,
        },
      ]);

      const controller = new TrenBahanBakuController(mockClient);
      const res = await controller.getTren('b1', 7);

      expect(res.jumlahTitik).toBe(2);
      expect(res.ringkasan?.hargaAwal).toBe(10000);
      expect(res.ringkasan?.hargaAkhir).toBe(12000);
    });
  });
});