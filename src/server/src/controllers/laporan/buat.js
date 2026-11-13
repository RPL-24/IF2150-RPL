/**
 * LaporanController (bagian UC01) — membuat & merevisi laporan.
 * Pemilik: P2. Kontrak request/response: src/docs/API.md#uc01
 */
import { z } from 'zod';
import { ATURAN, SEMUA_KATEGORI, STATUS, SUMBER_LOKASI } from '@silembur/shared';
import { cloudStorageAdapter } from '../../adapters/cloudStorageAdapter.js';
import { diKotaBandung, getWilayahFromCoordinates } from '../../adapters/googleMapsAdapter.js';
import { pool, withTransaction } from '../../db/pool.js';
import { periksa } from '../../middleware/validasi.js';
import { Laporan } from '../../models/index.js';
import { HttpError, paramId } from '../../utils/http.js';

/** Angka dari field multipart (string). String kosong dianggap tidak diisi, bukan 0. */
const angka = (nama, min, max) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.coerce
      .number({ error: `${nama} wajib berupa angka` })
      .min(min, `${nama} tidak valid`)
      .max(max, `${nama} tidak valid`),
  );

const kategori = z.enum(SEMUA_KATEGORI, { error: 'Pilih salah satu kategori kerusakan' });
const deskripsi = z
  .string({ error: 'Deskripsi wajib diisi' })
  .trim()
  .min(1, 'Deskripsi wajib diisi')
  .max(ATURAN.BATAS_DESKRIPSI, `Deskripsi maksimal ${ATURAN.BATAS_DESKRIPSI} karakter`);
const sumberLokasi = z.enum([SUMBER_LOKASI.GPS, SUMBER_LOKASI.MANUAL], { error: 'Sumber lokasi tidak valid' });
const latitude = angka('Latitude', -90, 90);
const longitude = angka('Longitude', -180, 180);

/** Isian POST /laporan (selain file foto). */
export const skemaBuatLaporan = z.object({
  kategori,
  deskripsi,
  latitude,
  longitude,
  sumberLokasi: sumberLokasi.default(SUMBER_LOKASI.GPS),
});

/** Isian PUT /laporan/:id/revisi: semua opsional, tetapi latitude & longitude harus berpasangan. */
export const skemaRevisiLaporan = z
  .object({
    kategori: kategori.optional(),
    deskripsi: deskripsi.optional(),
    latitude: latitude.optional(),
    longitude: longitude.optional(),
    sumberLokasi: sumberLokasi.optional(),
  })
  .refine((d) => (d.latitude === undefined) === (d.longitude === undefined), {
    message: 'Latitude dan longitude harus dikirim bersamaan',
    path: ['latitude'],
  });

const fotoWajib = () =>
  new HttpError(400, 'Data yang dikirim belum lengkap atau tidak valid', [
    { field: 'foto', pesan: 'Foto kerusakan wajib dilampirkan' },
  ]);

/**
 * Lingkup satu kota (SKPL/DPPL 1.2): titik di luar Kota Bandung ditolak sebelum foto disimpan
 * atau layanan peta dipanggil.
 */
function pastikanDiKotaBandung(lat, lng) {
  if (!diKotaBandung(lat, lng)) {
    throw new HttpError(400, 'Data yang dikirim belum lengkap atau tidak valid', [
      { field: 'lokasi', pesan: 'Lokasi kerusakan harus berada di Kota Bandung' },
    ]);
  }
}

/** Algo-006: koordinat -> { latitude, longitude, sumber, wilayah, alamat } (geocoding di luar transaksi). */
async function siapkanLokasi(lat, lng, sumber) {
  const { wilayah, alamat } = await getWilayahFromCoordinates(lat, lng);
  return { latitude: lat, longitude: lng, sumber, wilayah, alamat };
}

/**
 * POST /api/laporan   (multipart/form-data: foto, kategori, deskripsi, latitude, longitude, sumberLokasi)
 * Alur: tolak titik di luar Kota Bandung (400) -> simpan foto (cloudStorageAdapter) -> wilayah (googleMapsAdapter)
 *  -> satu transaksi: cariAtauBuatFasilitas -> simpanLaporan -> getJumlahLaporan (KF14) -> setLokasiLaporan
 *  -> catatRiwayat("Laporan berhasil diterima oleh sistem")
 * Balas 201 { laporan: LaporanSaya }.
 */
export async function buatLaporan(req, res) {
  const data = periksa(skemaBuatLaporan, req.body ?? {});
  if (!req.file) throw fotoWajib();
  pastikanDiKotaBandung(data.latitude, data.longitude);

  const foto = await cloudStorageAdapter.simpanFoto(req.file);
  const lokasi = await siapkanLokasi(data.latitude, data.longitude, data.sumberLokasi);
  const idPelapor = req.pengguna.id;

  const laporan = await withTransaction(async (db) => {
    const idLaporan = await Laporan.konfirmasiSimpanLaporan(db, {
      idPelapor,
      foto,
      deskripsi: data.deskripsi,
      kategori: data.kategori,
      lokasi,
    });
    return Laporan.getLaporanBuatan(db, { idLaporan, idPelapor });
  });
  res.status(201).json({ laporan });
}

/** PUT /api/laporan/:id/revisi  (multipart, field opsional) -> 200 { laporan } ; 409 bila status bukan "Perlu Revisi". */
export async function revisiLaporan(req, res) {
  const idLaporan = paramId(req);
  const data = periksa(skemaRevisiLaporan, req.body ?? {});
  const idPelapor = req.pengguna.id;

  // Periksa kepemilikan & status sebelum menyimpan foto/memanggil layanan peta.
  // Pemeriksaan ulang yang mengikat (dengan kunci baris) ada di Laporan.revisiLaporan.
  const sekarang = await Laporan.getLaporanBuatan(pool, { idLaporan, idPelapor });
  if (!sekarang) throw new HttpError(404, 'Laporan tidak ditemukan');
  if (sekarang.status !== STATUS.PERLU_REVISI) {
    throw new HttpError(409, `Laporan hanya bisa direvisi saat berstatus "${STATUS.PERLU_REVISI}"`);
  }

  if (data.latitude !== undefined) pastikanDiKotaBandung(data.latitude, data.longitude);

  const perubahan = { kategori: data.kategori, deskripsi: data.deskripsi };
  if (req.file) perubahan.foto = await cloudStorageAdapter.simpanFoto(req.file);
  if (data.latitude !== undefined) {
    perubahan.lokasi = await siapkanLokasi(data.latitude, data.longitude, data.sumberLokasi ?? SUMBER_LOKASI.GPS);
  }

  const laporan = await withTransaction(async (db) => {
    await Laporan.revisiLaporan(db, { idLaporan, idPelapor, perubahan });
    return Laporan.getLaporanBuatan(db, { idLaporan, idPelapor });
  });
  res.json({ laporan });
}
