// Contoh test integrasi HTTP (pola untuk semua anggota). Pemilik: P1.
import { afterAll, describe, expect, it } from 'vitest';
import { pool } from '../src/db/pool.js';
import { AKUN, PASSWORD_UJI, api, auth, loginSebagai } from './helpers.js';

afterAll(() => pool.end());

describe('Autentikasi (I-01)', () => {
  it('health check menjawab ok', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it.each([
    ['warga1', 'PELAPOR'],
    ['admin', 'ADMIN'],
    ['pemda', 'PEMDA'],
  ])('login %s mengembalikan token dan peran %s', async (nama, peran) => {
    const res = await api().post('/api/auth/login').send({ email: AKUN[nama], password: PASSWORD_UJI });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.pengguna.peran).toBe(peran);
    expect(res.body.pengguna).not.toHaveProperty('password_hash');
  });

  it('kata sandi salah ditolak 401', async () => {
    const res = await api().post('/api/auth/login').send({ email: AKUN.admin, password: 'salah' });
    expect(res.status).toBe(401);
  });

  it('body kosong ditolak 400 oleh Validasi', async () => {
    const res = await api().post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  it('endpoint terlindungi butuh token', async () => {
    expect((await api().get('/api/auth/me')).status).toBe(401);
  });

  it('pelapor tidak boleh mengakses endpoint admin (403)', async () => {
    const token = await loginSebagai('warga1');
    const res = await api().get('/api/admin/laporan').set(auth(token));
    expect(res.status).toBe(403);
  });

  it('referensi wilayah & kategori tersedia', async () => {
    const token = await loginSebagai('pemda');
    const res = await api().get('/api/referensi').set(auth(token));
    expect(res.status).toBe(200);
    expect(res.body.wilayah).toContain('Coblong');
    expect(res.body.kategori).toContain('Pohon Tumbang');
  });
});
