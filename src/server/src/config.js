/**
 * Konfigurasi server dari environment variable (lihat server/.env.example).
 * Pemilik: P1.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

const env = (name, fallback = '') => process.env[name]?.trim() || fallback;

export const config = Object.freeze({
  isTest,
  port: Number(env('PORT', '3000')),
  databaseUrl: isTest
    ? env('TEST_DATABASE_URL', 'postgres://silembur:silembur@localhost:5432/silembur_test')
    : env('DATABASE_URL', 'postgres://silembur:silembur@localhost:5432/silembur'),
  jwtSecret: env('JWT_SECRET', 'dev-only-secret-ganti-di-env'),
  jwtExpiresIn: env('JWT_EXPIRES_IN', '7d'),
  storageDriver: env('STORAGE_DRIVER', 'local'),
  uploadDir: path.resolve(serverRoot, env('UPLOAD_DIR', 'uploads')),
  gcsBucket: env('GCS_BUCKET'),
  googleMapsApiKey: env('GOOGLE_MAPS_API_KEY'),
  googleClientIds: env('GOOGLE_CLIENT_IDS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  serverRoot,
});
