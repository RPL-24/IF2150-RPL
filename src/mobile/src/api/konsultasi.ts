/**
 * Consultation sessions (DPPL C-29 `ConsultationController`).
 */
import { api } from './client';

export type SesiBerikutnya = {
  idJadwal: string;
  /** ISO 8601 */
  waktu: string;
  /** ISO 8601 */
  waktuSelesai: string;
  /** Konsultan name. */
  nama: string;
  spesialisasi: string;
};

/** `ambilSesiBerikutnya()` (Q-042): the student's next booked session, or `null` if none. */
export async function ambilSesiBerikutnya(): Promise<SesiBerikutnya | null> {
  const { session } = await api.get<{ session: SesiBerikutnya | null }>('/api/sessions/next');
  return session;
}
