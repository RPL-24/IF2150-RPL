/** Consultation booking API (DPPL C-10/C-11/C-29). */
import { api } from './client';

export type Konsultan = { idKonsultan: string; nama: string; spesialisasi: string };
export type SlotKonsultasi = {
  idJadwal: string;
  waktu: string;
  waktuSelesai: string;
  status: 'tersedia' | 'terpesan';
};
export type SesiBerikutnya = {
  idJadwal: string;
  waktu: string;
  waktuSelesai: string;
  nama: string;
  spesialisasi: string;
};

/** Algo-014 / Q-012: daftar konsultan. */
export async function ambilDaftarKonsultan(): Promise<Konsultan[]> {
  const { consultants } = await api.get<{ consultants: Konsultan[] }>('/api/consultants');
  return consultants;
}

/** Algo-015 / Q-014: slot mendatang milik konsultan. */
export async function ambilSlotKonsultan(idKonsultan: string): Promise<SlotKonsultasi[]> {
  const { slots } = await api.get<{ slots: SlotKonsultasi[] }>(`/api/consultants/${encodeURIComponent(idKonsultan)}/slots`);
  return slots;
}

/** Algo-016 / Q-028: pemesanan bersyarat; konflik mengembalikan ApiError 409. */
export async function pesanSesi(idJadwal: string): Promise<void> {
  await api.post<{ ok: true }>(`/api/slots/${encodeURIComponent(idJadwal)}/book`);
}

/** Q-042: sesi terdekat mahasiswa pada Beranda. */
export async function ambilSesiBerikutnya(): Promise<SesiBerikutnya | null> {
  const { session } = await api.get<{ session: SesiBerikutnya | null }>('/api/sessions/next');
  return session;
}
