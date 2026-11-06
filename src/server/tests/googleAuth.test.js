// Test POST /api/auth/google (SKPL 2.4, gap G5). Verifikasi token Google dipalsukan. Pemilik: P1.
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from '../src/utils/http.js';

const palsu = vi.hoisted(() => ({ aktif: vi.fn(), verifikasi: vi.fn() }));
vi.mock('../src/adapters/googleAuthAdapter.js', () => ({
  googleSignInAktif: palsu.aktif,
  verifikasiIdTokenGoogle: palsu.verifikasi,
}));

const { pool } = await import('../src/db/pool.js');
const { AKUN, api, auth } = await import('./helpers.js');

afterAll(() => pool.end());
beforeEach(() => {
  palsu.aktif.mockReturnValue(true);
  palsu.verifikasi.mockReset();
});

const loginGoogle = (body = { idToken: 'token-uji' }) => api().post('/api/auth/google').send(body);

describe('POST /api/auth/google', () => {
  it('503 bila Google Sign-In belum dikonfigurasi', async () => {
    palsu.aktif.mockReturnValue(false);
    const res = await loginGoogle();
    expect(res.status).toBe(503);
    expect(palsu.verifikasi).not.toHaveBeenCalled();
  });

  it('400 bila idToken kosong', async () => {
    expect((await loginGoogle({})).status).toBe(400);
  });

  it('401 bila token Google tidak sah', async () => {
    palsu.verifikasi.mockRejectedValue(new HttpError(401, 'Token Google tidak sah'));
    expect((await loginGoogle()).status).toBe(401);
  });

  it('akun Google baru dibuat sebagai PELAPOR dan tokennya bisa dipakai', async () => {
    palsu.verifikasi.mockResolvedValue({ googleSub: 'google-sub-baru', email: 'warga.google@silembur.test', nama: 'Warga Google' });
    const res = await loginGoogle();
    expect(res.status).toBe(200);
    expect(res.body.pengguna).toMatchObject({ email: 'warga.google@silembur.test', peran: 'PELAPOR' });

    const me = await api().get('/api/auth/me').set(auth(res.body.token));
    expect(me.body.pengguna.nama).toBe('Warga Google');

    // Login kedua dengan sub yang sama memakai akun yang sama, tidak membuat duplikat.
    const ulang = await loginGoogle();
    expect(ulang.body.pengguna.id).toBe(res.body.pengguna.id);
  });

  it('menautkan ke akun yang sudah ada dengan email sama', async () => {
    palsu.verifikasi.mockResolvedValue({ googleSub: 'google-sub-warga2', email: AKUN.warga2, nama: 'Nama Lain' });
    const res = await loginGoogle();
    expect(res.status).toBe(200);
    expect(res.body.pengguna).toMatchObject({ email: AKUN.warga2, nama: 'Siti Rahmawati', peran: 'PELAPOR' });
    const { rows } = await pool.query('SELECT google_sub FROM pengguna WHERE email = $1', [AKUN.warga2]);
    expect(rows[0].google_sub).toBe('google-sub-warga2');
  });
});
