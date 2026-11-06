/** Data referensi (wilayah, kategori, status) untuk dropdown/filter. Pemilik: P1. */
import { api } from './client';

export const referensiApi = {
  ambil: () => api.get('/referensi'),
};
