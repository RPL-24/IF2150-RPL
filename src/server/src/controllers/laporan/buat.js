/**
 * LaporanController (bagian UC01) — membuat & merevisi laporan.
 * Pemilik: P2. Kontrak request/response: src/docs/API.md#uc01
 */
import { belumDiimplementasi } from '../../utils/http.js';

/**
 * POST /api/laporan   (multipart/form-data: foto, kategori, deskripsi, latitude, longitude, sumberLokasi)
 * Alur (satu transaksi): simpan foto (cloudStorageAdapter) -> wilayah (googleMapsAdapter)
 *  -> cariAtauBuatFasilitas -> simpanLaporan -> setLokasiLaporan -> catatRiwayat("Laporan berhasil diterima oleh sistem")
 * Balas 201 { laporan: LaporanSaya }.
 */
export async function buatLaporan() {
  throw belumDiimplementasi('P2', 'POST /api/laporan (UC01)');
}

/** PUT /api/laporan/:id/revisi  (multipart, field opsional) -> 200 { laporan } ; 409 bila status bukan "Perlu Revisi". */
export async function revisiLaporan() {
  throw belumDiimplementasi('P2', 'PUT /api/laporan/:id/revisi (gap G7)');
}
