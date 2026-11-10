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
