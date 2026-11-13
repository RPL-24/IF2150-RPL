/**
 * Model Laporan — pembuatan & revisi laporan (UC01, KF01-KF04, gap G7).
 * Pemilik: P2.
 *
 * Juga memuat operasi C01 Pelapor.konfirmasiSimpanLaporan (Algo-001) karena seluruh langkahnya
 * menulis tabel laporan/lokasi/fasilitas/riwayat; jumlahLaporan pelapor ikut diperbarui di simpanLaporan.
 */
import { ATURAN, SEMUA_KATEGORI, STATUS } from '@silembur/shared';
import { HttpError, urlFoto } from '../../utils/http.js';
import { getJumlahLaporan } from '../fasilitas/berulang.js';
import { cariAtauBuatFasilitas } from '../fasilitas/cocokkan.js';
import { setLokasiLaporan } from '../lokasi/lokasi.js';
import { catatRiwayat, ubahStatus } from './status.js';

const RIWAYAT_DITERIMA = 'Laporan berhasil diterima oleh sistem.';
const RIWAYAT_DIREVISI = 'Laporan direvisi oleh pelapor.';

const terisi = (s) => typeof s === 'string' && s.trim() !== '';

function adaKoordinat(koordinat) {
  if (typeof koordinat === 'string') return koordinat.trim() !== '';
  if (koordinat && typeof koordinat === 'object') {
    return Number.isFinite(koordinat.latitude) && Number.isFinite(koordinat.longitude);
  }
  return false;
}

/**
 * Algo-004 validasiIsianFormulir(foto, deskripsi, koordinat) -> Boolean.
 * Fungsi murni (tanpa DB) agar mudah diuji dan bisa dipakai juga di mobile.
 * - foto: kunci/URL (string) atau objek file; wajib ada.
 * - deskripsi: 1..ATURAN.BATAS_DESKRIPSI karakter setelah trim.
 * - koordinat: "lat,lng" atau { latitude, longitude }.
 * - kategori: opsional untuk Algo-004; bila dikirim harus salah satu KATEGORI.
 */
export function validasiIsianFormulir({ foto, deskripsi, koordinat, kategori }) {
  const adaFoto = typeof foto === 'string' ? foto.trim() !== '' : Boolean(foto);
  const deskripsiSah = terisi(deskripsi) && deskripsi.trim().length <= ATURAN.BATAS_DESKRIPSI;
  const kategoriSah = kategori === undefined || SEMUA_KATEGORI.includes(kategori);
  return adaFoto && deskripsiSah && adaKoordinat(koordinat) && kategoriSah;
}

/**
 * Algo-001 + Q-001: simpan laporan baru berstatus "Menunggu Verifikasi"
 * dan tambah pengguna.jumlah_laporan. Panggil di dalam transaksi.
 * @returns {Promise<number>} id_laporan baru
 */
export async function simpanLaporan(db, { idPelapor, idFasilitas, foto, deskripsi, kategori }) {
  const { rows } = await db.query(
    `INSERT INTO laporan (foto_laporan, deskripsi_laporan, kategori_kerusakan, tanggal_laporan, status_laporan,
                          id_pelapor, id_fasilitas)
     VALUES ($1, $2, $3, NOW(), $4, $5, $6)
     RETURNING id_laporan`,
    [foto, deskripsi, kategori, STATUS.MENUNGGU_VERIFIKASI, idPelapor, idFasilitas],
  );
  // C01 Pelapor: self.jumlahLaporan <- self.jumlahLaporan + 1
  await db.query('UPDATE pengguna SET jumlah_laporan = jumlah_laporan + 1 WHERE id_pengguna = $1', [idPelapor]);
  return rows[0].id_laporan;
}

/**
 * C01 Pelapor.konfirmasiSimpanLaporan (Algo-001), versi lengkap UC01 langkah 3, ditambah
 * Fasilitas.getJumlahLaporan (Algo-007) agar penanda kerusakan berulang langsung terbarui (KF14, gap G11).
 * Panggil di dalam withTransaction. Foto sudah tersimpan (cloudStorageAdapter) dan wilayah/alamat
 * sudah didapat (googleMapsAdapter) sebelum transaksi, agar transaksi tidak menunggu layanan luar.
 * @param {{ idPelapor: number, foto: string, deskripsi: string, kategori: string,
 *           lokasi: { latitude: number, longitude: number, sumber: string, wilayah: string, alamat: string } }} data
 * @returns {Promise<number>} id_laporan baru
 * @throws HttpError 400 bila formulir tidak lengkap (validasiIsianFormulir = false).
 */
export async function konfirmasiSimpanLaporan(db, { idPelapor, foto, deskripsi, kategori, lokasi }) {
  if (!validasiIsianFormulir({ foto, deskripsi, koordinat: lokasi, kategori })) {
    throw new HttpError(400, 'Lengkapi foto, kategori, lokasi, dan deskripsi untuk melanjutkan');
  }
  const { idFasilitas } = await cariAtauBuatFasilitas(db, { kategori, ...lokasi });
  const idLaporan = await simpanLaporan(db, { idPelapor, idFasilitas, foto, deskripsi: deskripsi.trim(), kategori });
  // KF14 / Algo-007 (gap G11): perbarui penanda kerusakan berulang fasilitas tanpa menunggu verifikasi.
  await getJumlahLaporan(db, idFasilitas);
  await setLokasiLaporan(db, { idLaporan, ...lokasi });
  await catatRiwayat(db, {
    idLaporan,
    status: STATUS.MENUNGGU_VERIFIKASI,
    deskripsi: RIWAYAT_DITERIMA,
    idPengguna: idPelapor,
  });
  return idLaporan;
}

/**
 * Revisi laporan berstatus "Perlu Revisi" milik pelapor, lalu kembalikan ke
 * "Menunggu Verifikasi" lewat ubahStatus(). Penanda berulang fasilitas terkait dihitung ulang (KF14).
 * @param {{ idLaporan: number, idPelapor: number,
 *           perubahan: { foto?: string, deskripsi?: string, kategori?: string,
 *                        lokasi?: { latitude, longitude, sumber, wilayah, alamat } } }} data
 * @throws HttpError 404 bila bukan milik pelapor, 409 bila status bukan "Perlu Revisi".
 */
export async function revisiLaporan(db, { idLaporan, idPelapor, perubahan = {} }) {
  const { rows } = await db.query(
    `SELECT l.status_laporan, l.kategori_kerusakan, l.id_fasilitas, lo.latitude, lo.longitude, lo.wilayah, lo.alamat
       FROM laporan l
       LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
      WHERE l.id_laporan = $1 AND l.id_pelapor = $2
        FOR UPDATE OF l`,
    [idLaporan, idPelapor],
  );
  if (rows.length === 0) throw new HttpError(404, 'Laporan tidak ditemukan');
  const lama = rows[0];
  if (lama.status_laporan !== STATUS.PERLU_REVISI) {
    throw new HttpError(409, `Laporan hanya bisa direvisi saat berstatus "${STATUS.PERLU_REVISI}"`);
  }

  const { foto, kategori, lokasi } = perubahan;
  const deskripsi = perubahan.deskripsi?.trim();

  // Kategori atau titik berubah -> tautkan ulang ke fasilitas yang sesuai (gap G1).
  let idFasilitas = null;
  const kategoriBaru = kategori ?? lama.kategori_kerusakan;
  const titik = lokasi ?? (lama.latitude === null ? null : lama);
  if ((kategori && kategori !== lama.kategori_kerusakan) || lokasi) {
    if (titik) {
      ({ idFasilitas } = await cariAtauBuatFasilitas(db, {
        kategori: kategoriBaru,
        latitude: titik.latitude,
        longitude: titik.longitude,
        wilayah: titik.wilayah,
        alamat: titik.alamat,
      }));
    }
  }

  await db.query(
    `UPDATE laporan
        SET foto_laporan       = COALESCE($1, foto_laporan),
            deskripsi_laporan  = COALESCE($2, deskripsi_laporan),
            kategori_kerusakan = COALESCE($3, kategori_kerusakan),
            id_fasilitas       = COALESCE($4, id_fasilitas)
      WHERE id_laporan = $5`,
    [foto ?? null, deskripsi || null, kategori ?? null, idFasilitas, idLaporan],
  );
  if (lokasi) await setLokasiLaporan(db, { idLaporan, ...lokasi });

  // KF14 / Algo-007 (gap G11): hitung ulang fasilitas baru dan fasilitas lama bila tautannya pindah.
  await getJumlahLaporan(db, idFasilitas ?? lama.id_fasilitas);
  if (idFasilitas && idFasilitas !== lama.id_fasilitas) await getJumlahLaporan(db, lama.id_fasilitas);

  await ubahStatus(db, {
    idLaporan,
    statusBaru: STATUS.MENUNGGU_VERIFIKASI,
    deskripsi: RIWAYAT_DIREVISI,
    idPengguna: idPelapor,
  });
  return idLaporan;
}

/** DTO LaporanSaya (src/docs/API.md#laporanpublik + diperbaruiPada + catatanVerifikasi). */
function keLaporanSaya(r) {
  return {
    id: r.id_laporan,
    kategori: r.kategori_kerusakan,
    deskripsi: r.deskripsi_laporan,
    foto: urlFoto(r.foto_laporan),
    status: r.status_laporan,
    tanggalLaporan: r.tanggal_laporan,
    lokasi:
      r.latitude === null
        ? null
        : { latitude: r.latitude, longitude: r.longitude, wilayah: r.wilayah, alamat: r.alamat },
    fasilitas: r.id_fasilitas ? { id: r.id_fasilitas, nama: r.nama_fasilitas } : null,
    diperbaruiPada: r.diperbarui_pada,
    catatanVerifikasi: r.keputusan
      ? { keputusan: r.keputusan, catatan: r.catatan_alasan, waktu: r.waktu_verifikasi }
      : null,
  };
}

/**
 * Laporan hasil UC01 (buat/revisi) dalam bentuk DTO LaporanSaya, hanya bila milik idPelapor.
 * Tanpa kolom identitas pelapor (KNF02). null bila tidak ditemukan.
 */
export async function getLaporanBuatan(db, { idLaporan, idPelapor }) {
  const { rows } = await db.query(
    `SELECT l.id_laporan, l.id_fasilitas, l.foto_laporan, l.deskripsi_laporan, l.kategori_kerusakan,
            l.tanggal_laporan, l.status_laporan, l.diperbarui_pada,
            lo.latitude, lo.longitude, lo.wilayah, lo.alamat,
            f.nama_fasilitas,
            v.keputusan, v.catatan_alasan, v.waktu_verifikasi
       FROM laporan l
       LEFT JOIN lokasi lo ON lo.id_laporan = l.id_laporan
       LEFT JOIN fasilitas f ON f.id_fasilitas = l.id_fasilitas
       LEFT JOIN LATERAL (
            SELECT keputusan, catatan_alasan, waktu_verifikasi
              FROM verifikasi
             WHERE id_laporan = l.id_laporan
             ORDER BY waktu_verifikasi DESC, id_verifikasi DESC
             LIMIT 1
       ) v ON TRUE
      WHERE l.id_laporan = $1 AND l.id_pelapor = $2`,
    [idLaporan, idPelapor],
  );
  return rows[0] ? keLaporanSaya(rows[0]) : null;
}
