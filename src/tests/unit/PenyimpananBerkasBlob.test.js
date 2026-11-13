// src/tests/unit/PenyimpananBerkasBlob.test.js
// Mode Vercel Blob pada C45 PenyimpananBerkas (dipakai saat deploy ke Vercel).
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  del: jest.fn(),
}));

const fs = require('fs');
const os = require('os');
const path = require('path');
const { put, del } = require('@vercel/blob');
const PenyimpananBerkas = require('../../penyimpanan/PenyimpananBerkas');

const Kelas = PenyimpananBerkas.constructor;
const FOTO = { originalname: 'Foto.PNG', mimetype: 'image/png', buffer: Buffer.from('isi-foto') };

describe('PenyimpananBerkas mode Vercel Blob (C45)', () => {
  let penyimpanan;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    penyimpanan = new Kelas(fs.mkdtempSync(path.join(os.tmpdir(), 'itbeli-blob-')), 'token-uji');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('tanpa token memakai disk lokal dan tidak memanggil Blob', async () => {
    const lokal = new Kelas(fs.mkdtempSync(path.join(os.tmpdir(), 'itbeli-lokal-')), undefined);
    const hasil = await lokal.simpan('brg-1', [FOTO]);
    expect(hasil[0]).toMatch(/^\/uploads\/brg-1\/[0-9a-f-]{36}\.png$/);
    expect(put).not.toHaveBeenCalled();
  });

  test('membuat objek tidak membuat folder apa pun (aman di disk read-only Vercel)', () => {
    const tujuan = path.join(os.tmpdir(), `itbeli-tidak-ada-${Date.now()}`);
    new Kelas(tujuan, 'token-uji');
    expect(fs.existsSync(tujuan)).toBe(false);
  });

  test('simpan mengunggah ke Blob secara publik dan mengembalikan URL', async () => {
    put.mockResolvedValueOnce({ url: 'https://blob.example/brg-1/a.png' })
      .mockResolvedValueOnce({ url: 'https://blob.example/brg-1/b.png' });

    const hasil = await penyimpanan.simpan('brg-1', [FOTO, FOTO]);

    expect(hasil).toEqual(['https://blob.example/brg-1/a.png', 'https://blob.example/brg-1/b.png']);
    const [nama, isi, opsi] = put.mock.calls[0];
    expect(nama).toMatch(/^brg-1\/[0-9a-f-]{36}\.png$/);
    expect(isi).toBe(FOTO.buffer);
    expect(opsi).toEqual({ access: 'public', token: 'token-uji', contentType: 'image/png' });
  });

  test('gagal di tengah: berkas yang sempat terunggah dihapus lagi (rollback) dan hasilnya null', async () => {
    put.mockResolvedValueOnce({ url: 'https://blob.example/brg-1/a.png' })
      .mockRejectedValueOnce(new Error('jaringan putus'));
    del.mockResolvedValue();

    expect(await penyimpanan.simpan('brg-1', [FOTO, FOTO])).toBeNull();
    expect(del).toHaveBeenCalledWith(['https://blob.example/brg-1/a.png'], { token: 'token-uji' });
  });

  test('daftar kosong mengembalikan [] tanpa memanggil Blob', async () => {
    expect(await penyimpanan.simpan('brg-1', [])).toEqual([]);
    expect(put).not.toHaveBeenCalled();
  });

  test('hapus mengirim URL ke Blob dan path /uploads/ lama ke disk', async () => {
    del.mockResolvedValue();
    const dir = path.join(penyimpanan.direktoriBasis, 'brg-lama');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'x.png'), 'lama');

    const hasil = await penyimpanan.hapus(['https://blob.example/brg-1/a.png', '/uploads/brg-lama/x.png', null]);

    expect(hasil).toBe(true);
    expect(del).toHaveBeenCalledWith(['https://blob.example/brg-1/a.png'], { token: 'token-uji' });
    expect(fs.existsSync(path.join(dir, 'x.png'))).toBe(false);
  });

  test('hapus URL Blob tanpa token tidak memanggil Blob dan tidak membuat galat', async () => {
    const lokal = new Kelas(penyimpanan.direktoriBasis, undefined);
    expect(await lokal.hapus(['https://blob.example/brg-1/a.png'])).toBe(true);
    expect(del).not.toHaveBeenCalled();
  });

  test('galat dari Blob saat hapus menghasilkan false', async () => {
    del.mockRejectedValue(new Error('token tidak sah'));
    expect(await penyimpanan.hapus(['https://blob.example/brg-1/a.png'])).toBe(false);
  });
});
