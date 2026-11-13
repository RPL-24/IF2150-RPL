const TenagaKesehatan = require('../models/TenagaKesehatan');
const Pelajar = require('../models/Pelajar');
const AppError = require('../utils/AppError');
const { kirim, tanganiAsync } = require('../utils/respon');
const { calculateDistanceKm } = require('../utils/distance');

function angka(nilai) {
  if (nilai === undefined || nilai === null || String(nilai).trim() === '') return NaN;
  return Number(nilai);
}

/** Ambil koordinat pengguna dari query (GET) atau body (PUT). Null bila tidak valid. */
function lokasiPengguna(req) {
  const sumber = { ...req.query, ...(req.body || {}) };
  const lat = angka(sumber.lat !== undefined ? sumber.lat : sumber.latitude);
  const lng = angka(sumber.lng !== undefined ? sumber.lng : sumber.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

/** Tambahkan jarak_km relatif terhadap pengguna, urut terdekat lebih dulu. */
function denganJarak(daftar, lokasi) {
  if (!lokasi) return daftar.map((nakes) => ({ ...nakes, jarak_km: null }));

  return daftar
    .map((nakes) => {
      const jarak = calculateDistanceKm(lokasi, nakes.lokasi || nakes.lokasi_kerja);
      return { ...nakes, jarak_km: jarak >= 0 ? jarak : null };
    })
    .sort((a, b) => {
      if (a.jarak_km === null) return 1;
      if (b.jarak_km === null) return -1;
      return a.jarak_km - b.jarak_km;
    });
}

exports.loadTenagaKesehatan = tanganiAsync(async (req, res) => {
  const { spesialisasi, search } = req.query;
  let daftar = await TenagaKesehatan.findSemuaDenganFasilitas();

  if (spesialisasi) {
    const kunci = String(spesialisasi).toLowerCase();
    daftar = daftar.filter((nakes) => String(nakes.jenis_tenaga_kesehatan || '').toLowerCase() === kunci);
  }

  if (search) {
    const kata = String(search).toLowerCase();
    daftar = daftar.filter((nakes) => [nakes.nama, nakes.nama_fasilitas, nakes.lokasi_kerja, nakes.alamat]
      .filter(Boolean)
      .some((nilai) => String(nilai).toLowerCase().includes(kata)));
  }

  return kirim(res, 200, 'Daftar tenaga kesehatan.', denganJarak(daftar, lokasiPengguna(req)));
});

/** Q-C20-03: simpan izin lokasi lalu kembalikan daftar yang sudah berjarak. */
exports.processLocationPermission = tanganiAsync(async (req, res) => {
  const lokasi = lokasiPengguna(req);
  if (!lokasi) {
    throw new AppError(400, 'Koordinat lokasi tidak valid.');
  }

  if (req.user.role === 'Pelajar') {
    const pelajar = await Pelajar.findByIdPengguna(req.user.idPengguna);
    if (pelajar) await pelajar.setLokasiSaatIni(`${lokasi.lat},${lokasi.lng}`);
  }

  const daftar = await TenagaKesehatan.findSemuaDenganFasilitas();
  return kirim(res, 200, 'Daftar tenaga kesehatan terdekat.', denganJarak(daftar, lokasi));
});

/** Ubah tarif konsultasi milik tenaga kesehatan yang sedang login. */
exports.updateTarif = tanganiAsync(async (req, res) => {
  const tarif = angka(req.body && req.body.estimasi_biaya);
  if (!Number.isFinite(tarif) || tarif <= 0) {
    throw new AppError(400, 'Tarif konsultasi tidak valid.');
  }

  const nakes = await TenagaKesehatan.findByIdPengguna(req.user.idPengguna);
  if (!nakes) {
    throw new AppError(403, 'Hanya tenaga kesehatan yang dapat mengubah tarif.');
  }

  const berhasil = await nakes.setEstimasiBiaya(Math.round(tarif));
  if (!berhasil) {
    throw new AppError(400, 'Tenaga kesehatan belum terhubung ke fasilitas, tarif tidak dapat disimpan.');
  }

  return kirim(res, 200, 'Tarif konsultasi berhasil diperbarui.', { estimasi_biaya: Math.round(tarif) });
});

/** Q-C20-02 & Algo-C04-04 */
exports.selectTenagaKesehatan = tanganiAsync(async (req, res) => {
  const { id } = req.params;
  const detail = await TenagaKesehatan.findDetailDenganFasilitas(id);
  if (!detail) {
    throw new AppError(404, 'Tenaga kesehatan tidak ditemukan.');
  }

  const nakes = await TenagaKesehatan.findById(id);
  const jadwal = nakes ? await nakes.getJadwalTersedia() : [];
  const lokasi = lokasiPengguna(req);
  const jarak = lokasi ? calculateDistanceKm(lokasi, detail.lokasi || detail.lokasi_kerja) : -1;
  return kirim(res, 200, 'Detail tenaga kesehatan.', {
    ...detail,
    jarak_km: lokasi ? Math.max(calculateDistanceKm(lokasi, detail.lokasi || detail.lokasi_kerja), -1) : null,
    jadwal_tersedia: jadwal.map((item) => ({
      id_jadwal: item.idJadwal,
      tanggal: item.tanggal,
      waktu: item.waktu,
      status_ketersediaan: item.statusKetersediaan,
    })),
  });
});