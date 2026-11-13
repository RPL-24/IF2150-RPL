import { api } from './client';

export type EventKalender = {
  judul: string;
  mulai: string;
  selesai: string;
  /** `google`, `terpesan` (a session the student booked), or `tersedia` (a slot still open). */
  sumber: 'google' | 'tersedia' | 'terpesan' | string;
  /** Consultation entries only. */
  idJadwal?: string;
  konsultan?: string;
  spesialisasi?: string;
  /** True only for the student's own booked session. */
  milikSaya?: boolean;
};

export type HasilKalender = {
  events: EventKalender[];
  mode: 'google' | 'mock';
  peringatan?: string;
};

export async function ambilKalender(
  dari: string,
  sampai: string,
): Promise<HasilKalender> {
  const params = new URLSearchParams({ dari, sampai });

  return api.get<HasilKalender>(
    `/api/calendar?${params.toString()}`,
  );
}
