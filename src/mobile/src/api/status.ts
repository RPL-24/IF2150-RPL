/**
 * Service status (DPPL C-32 `StatusServerController`, Algo-020, Q-017).
 */
import { api } from './client';

export type JenisStatus = 'website' | 'server';

/** Latest check of one service (`StatusServer`); `null` if it was never checked. */
export type CekStatus = {
  statusUptime: boolean;
  /** ISO 8601 */
  waktuCek: string;
} | null;

export type StatusLayanan = Record<JenisStatus, CekStatus>;

/** `tampilkanStatusServer(jenis)`: the latest check of one service. */
export async function ambilStatus(jenis: JenisStatus): Promise<CekStatus> {
  const { status } = await api.get<{ status: (NonNullable<CekStatus> & { jenis: JenisStatus }) | null }>(
    `/api/status/${jenis}`,
  );
  return status && { statusUptime: status.statusUptime, waktuCek: status.waktuCek };
}

/** Both services for the I-03 card, requested in parallel. */
export async function ambilStatusLayanan(): Promise<StatusLayanan> {
  const [website, server] = await Promise.all([ambilStatus('website'), ambilStatus('server')]);
  return { website, server };
}
