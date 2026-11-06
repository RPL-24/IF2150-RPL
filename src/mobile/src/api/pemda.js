/**
 * API UC03 (prioritas), UC06 (fasilitas berulang), UC08 (riwayat fasilitas). Pemilik: P5.
 * Kontrak: src/docs/API.md#uc03
 */
import { api } from './client';

export const pemdaApi = {
  prioritas: (filter) => api.get('/prioritas', filter),
  ubahStatus: (idLaporan, { status, keterangan }) => api.patch(`/laporan/${idLaporan}/status`, { status, keterangan }),
  daftarFasilitas: (filter) => api.get('/fasilitas', filter),
  fasilitasBerulang: (limit) => api.get('/fasilitas/berulang', { limit }),
  detailFasilitas: (id) => api.get(`/fasilitas/${id}`),
};
