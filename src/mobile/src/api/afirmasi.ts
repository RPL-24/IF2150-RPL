/**
 * Daily affirmation (DPPL C-26 `AffirmationController`, Q-041).
 */
import { api } from './client';

export type Afirmasi = {
  idAffirmation: string;
  konten: string;
  /** Daily send time, "HH:MM". */
  waktuKirim: string;
};

/** `ambilAfirmasiHariIni()`: the student's affirmation, or `null` before one is set up. */
export async function ambilAfirmasi(): Promise<Afirmasi | null> {
  const { affirmation } = await api.get<{ affirmation: Afirmasi | null }>('/api/affirmation');
  return affirmation;
}

/**
 * `submitWaktuPengiriman(waktu)`: Algo-023 `validasiWaktu`, then
 * `DailyAffirmation.aturWaktuKirim` (Algo-004 / Algo-028). Creates the row
 * with default content on the first save.
 */
export async function simpanWaktuAfirmasi(waktu: string): Promise<void> {
  await api.put('/api/affirmation/time', { waktu });
}

/**
 * I-04-03 toggle off: stops the daily send by deleting the affirmation.
 * Toggling back on goes through `simpanWaktuAfirmasi` again.
 */
export async function hapusAfirmasi(): Promise<void> {
  await api.delete('/api/affirmation');
}
