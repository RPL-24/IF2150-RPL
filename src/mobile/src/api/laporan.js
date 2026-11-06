/**
 * API UC01 - membuat & merevisi laporan. Pemilik: P2. Kontrak: src/docs/API.md#uc01
 */
import { api } from './client';

/**
 * @param {{ foto: { uri: string, mimeType?: string, fileName?: string }, kategori: string, deskripsi: string,
 *           latitude: number, longitude: number, sumberLokasi: 'GPS'|'MANUAL' }} data
 */
function keForm({ foto, ...isian }) {
  const form = new FormData();
  if (foto) {
    form.append('foto', { uri: foto.uri, type: foto.mimeType ?? 'image/jpeg', name: foto.fileName ?? 'foto.jpg' });
  }
  for (const [k, v] of Object.entries(isian)) if (v !== undefined && v !== null) form.append(k, String(v));
  return form;
}

export const laporanApi = {
  buat: (data) => api.kirimForm('POST', '/laporan', keForm(data)),
  revisi: (id, data) => api.kirimForm('PUT', `/laporan/${id}/revisi`, keForm(data)),
};
