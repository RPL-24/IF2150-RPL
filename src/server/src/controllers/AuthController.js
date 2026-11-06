/**
 * AuthController — login (I-01) dan profil. Komponen pendukung, bukan salah satu dari 5 controller DPPL.
 * Pemilik: P1.
 *
 * CONTOH POLA END-TO-END untuk semua anggota: route -> validasi -> controller -> model -> DTO -> JSON.
 */
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { buatToken } from '../middleware/autentikasi.js';
import { Pengguna } from '../models/index.js';
import { HttpError, belumDiimplementasi } from '../utils/http.js';

export const skemaLogin = z.object({
  email: z.string().trim().min(1, 'Email wajib diisi'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

/** POST /api/auth/login  body: { email, password }  -> { token, pengguna } */
export async function login(req, res) {
  const { email, password } = req.valid.body;
  const pengguna = await Pengguna.cariPenggunaByEmail(pool, email);
  const cocok = pengguna?.password_hash && (await bcrypt.compare(password, pengguna.password_hash));
  if (!cocok) throw new HttpError(401, 'Email atau kata sandi salah');
  res.json({ token: buatToken(pengguna), pengguna: Pengguna.toProfil(pengguna) });
}

/** GET /api/auth/me -> { pengguna } */
export async function me(req, res) {
  const pengguna = await Pengguna.cariPenggunaById(pool, req.pengguna.id);
  if (!pengguna) throw new HttpError(401, 'Akun tidak ditemukan');
  res.json({ pengguna: Pengguna.toProfil(pengguna) });
}

/**
 * POST /api/auth/google  body: { idToken } -> { token, pengguna }   (SKPL 2.4, gap G5)
 * TODO(P1): verifikasi idToken dengan google-auth-library (audience = config.googleClientIds),
 * cari/buat pengguna peran PELAPOR berdasarkan google_sub. Balas 503 bila GOOGLE_CLIENT_IDS kosong.
 */
export async function loginGoogle() {
  throw belumDiimplementasi('P1', 'POST /api/auth/google (Google Sign-In)');
}
