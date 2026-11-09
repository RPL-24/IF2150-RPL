import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export type UserRole = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

export interface AuthUserPayload {
  idPengguna: string;
  username?: string;
  email?: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'kunci_rahasia_cariuang_2026';
};

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): Buffer {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad === 2) base64 += '==';
  else if (pad === 3) base64 += '=';
  return Buffer.from(base64, 'base64');
}

/**
 * Membangkitkan token JWT standar RFC 7519 (HS256)
 * Kompatibel penuh dengan pustaka `jsonwebtoken`
 */
export function signJWT(
  payload: Omit<AuthUserPayload, 'iat' | 'exp'>,
  expiresInSeconds = 24 * 60 * 60
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthUserPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

/**
 * Memverifikasi token JWT standar RFC 7519 (HS256)
 */
export function verifyJWT(token: string): AuthUserPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Format token JWT tidak valid');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest();

  const actualSignature = base64UrlDecode(encodedSignature);

  if (
    expectedSignature.length !== actualSignature.length ||
    !crypto.timingSafeEqual(expectedSignature, actualSignature)
  ) {
    throw new Error('Signature token JWT tidak valid');
  }

  const rawPayload = JSON.parse(base64UrlDecode(encodedPayload).toString('utf8'));

  if (typeof rawPayload.exp === 'number') {
    const now = Math.floor(Date.now() / 1000);
    if (now >= rawPayload.exp) {
      throw new Error('Token JWT telah kedaluwarsa');
    }
  }

  const idPengguna: string | undefined =
    rawPayload.idPengguna ||
    rawPayload.id_pengguna ||
    rawPayload.userId ||
    rawPayload.id ||
    rawPayload.sub;

  if (!idPengguna || typeof idPengguna !== 'string') {
    throw new Error('Payload token JWT tidak memiliki identitas pengguna');
  }

  const normalizedRole = String(rawPayload.role || 'PELANGGAN').toUpperCase() as UserRole;

  return {
    idPengguna,
    username: rawPayload.username,
    email: rawPayload.email,
    role: normalizedRole,
    iat: rawPayload.iat,
    exp: rawPayload.exp,
  };
}

/**
 * Middleware autentikasi Bearer JWT
 */
export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi (Bearer JWT) wajib disertakan',
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi kosong',
    });
    return;
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Token autentikasi tidak valid';
    res.status(401).json({
      success: false,
      message: `Akses ditolak: ${message}`,
    });
  }
}

/**
 * Middleware otorisasi berbasis Role pengguna
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak: Pengguna belum terautentikasi',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak: Peran ${req.user.role} tidak diizinkan mengakses endpoint ini`,
      });
      return;
    }

    next();
  };
}
