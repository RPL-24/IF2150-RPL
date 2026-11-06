/**
 * API UC02 (verifikasi) - pemilik P4, dan UC07 (duplikat) - pemilik P1. Kontrak: src/docs/API.md#uc02
 */
import { api } from './client';

export const adminApi = {
  // P4
  daftarLaporan: (filter) => api.get('/admin/laporan', filter),
  jumlahBaru: () => api.get('/admin/laporan/jumlah-baru'),
  detailLaporan: (id) => api.get(`/admin/laporan/${id}`),
  verifikasi: (id, { keputusan, catatan }) => api.post(`/admin/laporan/${id}/verifikasi`, { keputusan, catatan }),
  // P1
  kandidatDuplikat: () => api.get('/admin/duplikat/kandidat'),
  gabung: (idLaporan) => api.post('/admin/duplikat/gabung', { idLaporan }),
};
