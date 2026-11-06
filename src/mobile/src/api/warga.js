/**
 * API UC04 (laporan publik), UC05 (laporan saya), notifikasi pelapor. Pemilik: P3.
 * Kontrak: src/docs/API.md#uc04
 */
import { api } from './client';

export const wargaApi = {
  ringkasan: () => api.get('/laporan/ringkasan'),
  daftarPublik: (filter) => api.get('/laporan/publik', filter),
  detailPublik: (id) => api.get(`/laporan/publik/${id}`),
  daftarSaya: () => api.get('/laporan/saya'),
  detailSaya: (id) => api.get(`/laporan/saya/${id}`),
  notifikasi: () => api.get('/notifikasi'),
  tandaiDibaca: (id) => api.patch(`/notifikasi/${id}/dibaca`),
};
