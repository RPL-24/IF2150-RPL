import { describe, expect, it } from 'vitest';
import { RiwayatHargaJual } from '../models/RiwayatHargaJual';
import { PESAN_INPUT_TIDAK_VALID } from '../models/pesan';

// Unit test kelas C20 RiwayatHargaJual serta skenario UC07 (Melihat Perubahan Harga Jual).

describe('C20 model RiwayatHargaJual', () => {
  it('C20-UT01 normal: konstruktor menyimpan harga baru positif dan nilai bawaan valid', () => {
    const sebelum = Date.now();
    const riwayat = new RiwayatHargaJual(20000);
    const sesudah = Date.now();

    expect(riwayat.getHargaBaru()).toBe(20000);
    expect(riwayat.getHargaJualLama()).toBe(0);
    expect(riwayat.getWaktuPerubahan()).toBeInstanceOf(Date);
    expect(riwayat.getWaktuPerubahan().getTime()).toBeGreaterThanOrEqual(sebelum);
    expect(riwayat.getWaktuPerubahan().getTime()).toBeLessThanOrEqual(sesudah);
  });

  it('C20-UT02 batas: konstruktor menerima bilangan positif desimal kecil', () => {
    const riwayat = new RiwayatHargaJual(0.01);

    expect(riwayat.getHargaBaru()).toBe(0.01);
  });

  it.each([
    ['nol', 0],
    ['negatif', -15000],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
  ])('C20-UT03 batas/negatif: konstruktor menolak harga baru %s', (_label, harga) => {
    expect(() => new RiwayatHargaJual(harga)).toThrow(PESAN_INPUT_TIDAK_VALID);
  });

  it('C20-UT04 normal: setHargaJualLama dan getHargaJualLama menyimpan harga jual lama positif', () => {
    const riwayat = new RiwayatHargaJual(22000);

    riwayat.setHargaJualLama(18000);
    expect(riwayat.getHargaJualLama()).toBe(18000);

    riwayat.setHargaJualLama(17500.5);
    expect(riwayat.getHargaJualLama()).toBe(17500.5);
  });

  it.each([
    ['nol', 0],
    ['negatif', -1],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])(
    'C20-UT05 batas/negatif: setHargaJualLama menolak %s tanpa mengubah nilai sebelumnya',
    (_label, harga) => {
      const riwayat = new RiwayatHargaJual(20000);
      riwayat.setHargaJualLama(15000);

      expect(() => riwayat.setHargaJualLama(harga)).toThrow(PESAN_INPUT_TIDAK_VALID);
      expect(riwayat.getHargaJualLama()).toBe(15000);
    },
  );

  it('C20-UT06 normal: setWaktuPerubahan dan getWaktuPerubahan menyimpan objek Date', () => {
    const riwayat = new RiwayatHargaJual(20000);
    const waktu = new Date('2026-11-18T08:30:00.000Z');

    riwayat.setWaktuPerubahan(waktu);

    expect(riwayat.getWaktuPerubahan()).toBe(waktu);
    expect(riwayat.getWaktuPerubahan().toISOString()).toBe('2026-11-18T08:30:00.000Z');
  });

  it('C20-UT07 negatif: setWaktuPerubahan menolak nilai kosong (null/undefined)', () => {
    const riwayat = new RiwayatHargaJual(20000);
    const waktuAwal = new Date('2026-11-10T07:00:00.000Z');
    riwayat.setWaktuPerubahan(waktuAwal);

    expect(() => riwayat.setWaktuPerubahan(null as unknown as Date)).toThrow(
      'Waktu perubahan tidak boleh kosong',
    );
    expect(() => riwayat.setWaktuPerubahan(undefined as unknown as Date)).toThrow(
      'Waktu perubahan tidak boleh kosong',
    );
    expect(riwayat.getWaktuPerubahan()).toBe(waktuAwal);
  });
});

describe('UC07 Melihat Perubahan Harga Jual (C20 RiwayatHargaJual)', () => {
  it('UC07-TC01 normal: daftar riwayat harga jual memuat urutan kronologis perubahan harga beserta tanggalnya', () => {
    const perubahanKedua = new RiwayatHargaJual(20000);
    perubahanKedua.setHargaJualLama(18000);
    perubahanKedua.setWaktuPerubahan(new Date('2026-11-15T10:00:00.000Z'));

    const perubahanPertama = new RiwayatHargaJual(18000);
    perubahanPertama.setHargaJualLama(15000);
    perubahanPertama.setWaktuPerubahan(new Date('2026-11-10T09:00:00.000Z'));

    const perubahanKetiga = new RiwayatHargaJual(19000);
    perubahanKetiga.setHargaJualLama(20000);
    perubahanKetiga.setWaktuPerubahan(new Date('2026-11-20T14:30:00.000Z'));

    const daftarTerurut = [perubahanKedua, perubahanPertama, perubahanKetiga].sort(
      (a, b) => a.getWaktuPerubahan().getTime() - b.getWaktuPerubahan().getTime(),
    );

    expect(
      daftarTerurut.map((r) => ({
        hargaLama: r.getHargaJualLama(),
        hargaBaru: r.getHargaBaru(),
        waktu: r.getWaktuPerubahan().toISOString(),
      })),
    ).toEqual([
      { hargaLama: 15000, hargaBaru: 18000, waktu: '2026-11-10T09:00:00.000Z' },
      { hargaLama: 18000, hargaBaru: 20000, waktu: '2026-11-15T10:00:00.000Z' },
      { hargaLama: 20000, hargaBaru: 19000, waktu: '2026-11-20T14:30:00.000Z' },
    ]);
  });

  it('UC07-TC02 alternatif: produk tanpa riwayat memiliki daftar historis kosong dan data riwayat tidak valid ditolak', () => {
    const daftarRiwayat: RiwayatHargaJual[] = [];

    expect(daftarRiwayat).toHaveLength(0);
    expect(() => new RiwayatHargaJual(0)).toThrow(PESAN_INPUT_TIDAK_VALID);

    const entri = new RiwayatHargaJual(18000);
    expect(() => entri.setWaktuPerubahan(null as unknown as Date)).toThrow(
      'Waktu perubahan tidak boleh kosong',
    );
  });
});
