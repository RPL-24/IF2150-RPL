// Test adapter integrasi eksternal (GoogleMapsAdapter, CloudStorageAdapter) tanpa memanggil layanan Google sungguhan.
// Pemilik: P1.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { buatDriverGcs, buatDriverLokal } from '../src/adapters/cloudStorageAdapter.js';
import { jarakMeter, wilayahGoogle, wilayahOffline } from '../src/adapters/googleMapsAdapter.js';

const TITIK_COBLONG = { lat: -6.8915, lng: 107.6107 }; // kawasan ITB, Kec. Coblong

function fetchPalsu(body) {
  return vi.fn(async () => ({ json: async () => body }));
}

describe('GoogleMapsAdapter', () => {
  it('fallback offline memilih kecamatan terdekat', () => {
    expect(wilayahOffline(TITIK_COBLONG.lat, TITIK_COBLONG.lng).wilayah).toBe('Coblong');
    expect(wilayahOffline(-7.5, 110.4).wilayah).toBe('Luar Kota Bandung');
  });

  it('jarakMeter menghitung jarak haversine', () => {
    const d = jarakMeter({ lat: -6.9, lng: 107.6 }, { lat: -6.9, lng: 107.6003 });
    expect(d).toBeGreaterThan(30);
    expect(d).toBeLessThan(36);
  });

  it('memakai kecamatan & alamat dari Google Geocoding', async () => {
    const fetchFn = fetchPalsu({
      status: 'OK',
      results: [
        {
          formatted_address: 'Jl. Cihampelas No.42, Cipaganti, Kec. Coblong, Kota Bandung',
          address_components: [{ long_name: 'Kecamatan Coblong', types: ['administrative_area_level_3', 'political'] }],
        },
      ],
    });
    const hasil = await wilayahGoogle(TITIK_COBLONG.lat, TITIK_COBLONG.lng, { apiKey: 'kunci-uji', fetchFn });
    expect(hasil).toEqual({ wilayah: 'Coblong', alamat: 'Jl. Cihampelas No.42, Cipaganti, Kec. Coblong, Kota Bandung' });
    expect(fetchFn.mock.calls[0][0]).toContain('latlng=-6.8915,107.6107');
  });

  it('kecamatan tidak dikenali -> wilayah offline, alamat tetap dari Google', async () => {
    const fetchFn = fetchPalsu({
      status: 'OK',
      results: [{ formatted_address: 'Alamat Google', address_components: [{ long_name: 'Antah Berantah', types: ['locality'] }] }],
    });
    const hasil = await wilayahGoogle(TITIK_COBLONG.lat, TITIK_COBLONG.lng, { apiKey: 'k', fetchFn });
    expect(hasil).toEqual({ wilayah: 'Coblong', alamat: 'Alamat Google' });
  });

  it.each([
    ['status bukan OK', fetchPalsu({ status: 'OVER_QUERY_LIMIT', results: [] })],
    ['jaringan gagal', vi.fn(async () => { throw new Error('offline'); })],
  ])('%s -> fallback offline', async (_nama, fetchFn) => {
    const hasil = await wilayahGoogle(TITIK_COBLONG.lat, TITIK_COBLONG.lng, { apiKey: 'k', fetchFn });
    expect(hasil).toEqual(wilayahOffline(TITIK_COBLONG.lat, TITIK_COBLONG.lng));
  });
});

describe('CloudStorageAdapter', () => {
  const file = { buffer: Buffer.from('foto'), mimetype: 'image/png', originalname: 'a.png' };

  it('driver lokal menulis file dan mengembalikan kunci relatif', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'silembur-upload-'));
    try {
      const kunci = await buatDriverLokal(dir).simpanFoto(file);
      expect(kunci).toMatch(/^laporan\/\d{4}-\d{2}-\d{2}\/.+\.png$/);
      expect(await fs.readFile(path.join(dir, kunci), 'utf8')).toBe('foto');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it('driver gcs mengunggah ke bucket dan mengembalikan URL publik', async () => {
    const save = vi.fn(async () => {});
    const storage = { bucket: vi.fn(() => ({ file: vi.fn(() => ({ save })) })) };
    const url = await buatDriverGcs({ bucket: 'bucket-uji', storage }).simpanFoto(file);
    expect(url).toMatch(/^https:\/\/storage\.googleapis\.com\/bucket-uji\/laporan\/.+\.png$/);
    expect(save).toHaveBeenCalledWith(file.buffer, expect.objectContaining({ contentType: 'image/png' }));
  });

  it('driver gcs wajib punya nama bucket', () => {
    expect(() => buatDriverGcs({ bucket: '' })).toThrow(/GCS_BUCKET/);
  });
});
