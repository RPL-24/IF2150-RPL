import prisma from '../database/prisma';
import {
  AUTO_CANCEL_TIMEOUT_MS,
  defaultKontrakNotifikasiSender,
  KontrakNotifikasiSender,
  STATUS_KETERSEDIAAN,
  STATUS_PEKERJAAN,
} from '../models/KontrakPekerjaan';

export interface AutoCancelResult {
  cancelledCount: number;
  cancelledIds: string[];
}

let workerTimer: NodeJS.Timeout | null = null;

/**
 * KF07 & KNF11: Membatalkan kontrak berstatus 'Menunggu' yang telah melewati 30 menit
 * tanpa konfirmasi dari penyedia jasa, serta melepaskan kunci ketersediaan penyedia jasa.
 */
export async function cancelExpiredContracts(
  referenceTime: Date = new Date(),
  notifSender: KontrakNotifikasiSender = defaultKontrakNotifikasiSender
): Promise<AutoCancelResult> {
  const fallbackCutoff = new Date(
    referenceTime.getTime() - AUTO_CANCEL_TIMEOUT_MS
  );

  const expiredContracts = await prisma.kontrakPekerjaan.findMany({
    where: {
      statusPekerjaan: STATUS_PEKERJAAN.MENUNGGU,
      OR: [
        {
          expiresAt: {
            not: null,
            lte: referenceTime,
          },
        },
        {
          expiresAt: null,
          createdAt: {
            lte: fallbackCutoff,
          },
        },
      ],
    },
  });

  const cancelledIds: string[] = [];

  for (const contract of expiredContracts) {
    try {
      const wasCancelled = await prisma.$transaction(async (tx) => {
        const updated = await tx.kontrakPekerjaan.updateMany({
          where: {
            idKontrakPekerjaan: contract.idKontrakPekerjaan,
            statusPekerjaan: STATUS_PEKERJAAN.MENUNGGU,
          },
          data: {
            statusPekerjaan: STATUS_PEKERJAAN.DIBATALKAN,
          },
        });

        if (updated.count === 0) {
          return false;
        }

        const activeOtherContracts = await tx.kontrakPekerjaan.count({
          where: {
            idPemberiJasa: contract.idPemberiJasa,
            idKontrakPekerjaan: { not: contract.idKontrakPekerjaan },
            statusPekerjaan: {
              in: [
                STATUS_PEKERJAAN.MENUNGGU,
                STATUS_PEKERJAAN.ON_PROGRESS,
                STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
              ],
            },
          },
        });

        if (activeOtherContracts === 0) {
          await tx.pemberiJasa.update({
            where: { idPemberiJasa: contract.idPemberiJasa },
            data: {
              statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
              version: { increment: 1 },
            },
          });
        }

        return true;
      });

      if (wasCancelled) {
        cancelledIds.push(contract.idKontrakPekerjaan);

        await Promise.allSettled([
          notifSender.buatNotifikasi(
            contract.idPelanggan,
            `Pesanan "${contract.detailPekerjaan}" dibatalkan otomatis karena penyedia jasa tidak merespons dalam 30 menit.`
          ),
          notifSender.buatNotifikasi(
            contract.idPemberiJasa,
            `Pesanan "${contract.detailPekerjaan}" dibatalkan otomatis karena melewati batas waktu konfirmasi 30 menit.`
          ),
        ]);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(
          `[AutoCancelWorker]: Gagal membatalkan kontrak ${contract.idKontrakPekerjaan}:`,
          error
        );
      }
    }
  }

  return {
    cancelledCount: cancelledIds.length,
    cancelledIds,
  };
}

/**
 * Menjalankan cron job / background worker pembatalan otomatis kontrak kedaluwarsa (KF07, KNF11).
 * Default interval: 60 detik (1 menit).
 */
export function startAutoCancelWorker(
  intervalMs = 60 * 1000
): NodeJS.Timeout {
  if (workerTimer) {
    return workerTimer;
  }

  workerTimer = setInterval(async () => {
    try {
      const result = await cancelExpiredContracts();
      if (result.cancelledCount > 0 && process.env.NODE_ENV !== 'test') {
        console.log(
          `[AutoCancelWorker]: ${result.cancelledCount} kontrak kedaluwarsa (>30 menit) dibatalkan otomatis.`
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[AutoCancelWorker]: Error saat mengecek kontrak:', error);
      }
    }
  }, intervalMs);

  if (typeof workerTimer.unref === 'function') {
    workerTimer.unref();
  }

  return workerTimer;
}

export function stopAutoCancelWorker(): void {
  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }
}
