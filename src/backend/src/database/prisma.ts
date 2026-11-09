import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client untuk menghindari koneksi database yang berlebihan,
 * terutama saat hot-reload di development (tsx watch).
 *
 * Referensi: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
