/**
 * Helper test bersama. Pakai di test fitur masing-masing:
 *   const api = request(buatApp());
 *   const token = await loginSebagai('admin');
 *   await api.get('/api/admin/laporan').set(auth(token));
 */
import request from 'supertest';
import { buatApp } from '../src/app.js';

export const AKUN = {
  warga1: 'warga1@silembur.test',
  warga2: 'warga2@silembur.test',
  warga3: 'warga3@silembur.test',
  admin: 'admin@silembur.test',
  pemda: 'pemda@silembur.test',
};
export const PASSWORD_UJI = 'silembur123';

export const app = buatApp();
export const api = () => request(app);

export async function loginSebagai(nama) {
  const res = await api().post('/api/auth/login').send({ email: AKUN[nama], password: PASSWORD_UJI });
  if (res.status !== 200) throw new Error(`Login ${nama} gagal: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.token;
}

export const auth = (token) => ({ Authorization: `Bearer ${token}` });
