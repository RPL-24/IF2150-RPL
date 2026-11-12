import { api } from './client';

export type EventKalender = {
  judul: string;
  mulai: string;
  selesai: string;
  sumber: 'google' | 'tersedia' | 'terpesan' | string;
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
