/**
 * Singleton Prisma Client (pola Prisma 7: driver adapter PostgreSQL).
 * Satu instance dipakai bersama agar hot reload Next.js dev tidak membuka
 * koneksi baru terus-menerus.
 *
 * SESUAIKAN baris import PrismaClient dengan `output` pada blok
 * `generator client` di schema.prisma (Rafiandhi).
 * Dependensi yang dibutuhkan: @prisma/client, @prisma/adapter-pg, pg.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

function buatClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL belum diatur (lihat src/.env.example).');
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

const global_ = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = global_.prisma ?? buatClient();

if (process.env.NODE_ENV !== 'production') global_.prisma = prisma;