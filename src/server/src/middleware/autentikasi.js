/**
 * Komponen pendukung "Autentikasi" (DPPL Tabel 2.3): memeriksa token dan membatasi akses sesuai peran.
 * Pemilik: P1.
 *
 * Pemakaian di routes:
 *   router.get('/x', wajibLogin, wajibPeran(PERAN.ADMIN), handler)
 * Setelah lolos, `req.pengguna = { id, peran, nama, email }`.
 */
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

export function buatToken(pengguna) {
  return jwt.sign(
    { sub: String(pengguna.id_pengguna), peran: pengguna.peran, nama: pengguna.nama, email: pengguna.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

export function wajibLogin(req, _res, next) {
  const header = req.get('authorization') ?? '';
  const [skema, token] = header.split(' ');
  if (skema !== 'Bearer' || !token) return next(new HttpError(401, 'Silakan masuk terlebih dahulu'));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.pengguna = { id: Number(payload.sub), peran: payload.peran, nama: payload.nama, email: payload.email };
    return next();
  } catch {
    return next(new HttpError(401, 'Sesi tidak valid atau sudah berakhir'));
  }
}

export function wajibPeran(...peranDiizinkan) {
  return (req, _res, next) => {
    if (!req.pengguna) return next(new HttpError(401, 'Silakan masuk terlebih dahulu'));
    if (!peranDiizinkan.includes(req.pengguna.peran)) {
      return next(new HttpError(403, 'Anda tidak memiliki akses ke fitur ini'));
    }
    return next();
  };
}
