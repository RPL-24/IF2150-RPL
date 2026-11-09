// C19 NotifikasiController - milik modul D.
const config = require('../config/env');
const SurelAdapter = require('../integrasi/SurelAdapter');
const PushNotifikasiAdapter = require('../integrasi/PushNotifikasiAdapter');
const Notifikasi = require('../models/Notifikasi');
const LanggananPush = require('../models/LanggananPush');

const JUDUL_PUSH = 'ITBELI';
const TAUTAN_PUSH = { pesan: '/percakapan' }; // halaman yang dibuka saat notifikasi push diklik
const BATAS_DAFTAR = 50;
const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class NotifikasiController {
  // KF06
  static async kirimEmailVerifikasi(email, kode) {
    const isi = [
      'Halo,',
      '',
      `Kode verifikasi akun ITBELI Anda: ${kode}`,
      `Kode berlaku selama ${config.durasiKodeMenit} menit.`,
      '',
      'Jangan bagikan kode ini kepada siapa pun. Abaikan surel ini bila Anda tidak mendaftar di ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Kode Verifikasi ITBELI', isi);
  }

  // Algo-020 (KF34)
  static async kirimNotifikasi(idPenerima, jenis, isi) {
    const waktuKirim = new Date();

    // 1. Simpan rekaman pemberitahuan (status belum dibaca)
    const berhasilSimpan = await Notifikasi.simpan(idPenerima, jenis, isi, waktuKirim, false);
    if (!berhasilSimpan) return false;

    // 2. Hitung notifikasi belum dibaca penerima (penanda di PanelNotifikasi diambil lewat GET /api/notifikasi)
    await Notifikasi.hitungBelumDibaca(idPenerima);

    // 3. Picu Web Push; kegagalan push tidak menggagalkan notifikasi dalam aplikasi
    try {
      await NotifikasiController.kirimPushNotifikasi(idPenerima, isi, jenis);
    } catch (galat) {
      console.error('Gagal memicu Web Push:', galat.message);
    }
    return true;
  }

  // KF34. jenis menentukan tautan yang dibuka saat notifikasi diklik.
  static async kirimPushNotifikasi(idPenerima, isi, jenis = 'pesan') {
    const tautan = TAUTAN_PUSH[jenis] || '/';
    return PushNotifikasiAdapter.kirimPush(idPenerima, JUDUL_PUSH, isi, tautan);
  }

  // KF34: daftar notifikasi terbaru (maks 50) beserta jumlah belum dibaca untuk PanelNotifikasi
  static async getDaftarNotifikasi(idAkun) {
    const [daftar, belumDibaca] = await Promise.all([
      Notifikasi.getDaftarByAkun(idAkun, BATAS_DAFTAR),
      Notifikasi.hitungBelumDibaca(idAkun),
    ]);
    return {
      berhasil: true,
      data: {
        belumDibaca,
        daftar: daftar.map((n) => ({
          idNotifikasi: n.idNotifikasi,
          jenis: n.jenis,
          isi: n.isi,
          waktuKirim: n.waktuKirim,
          statusBaca: n.statusBaca,
        })),
      },
    };
  }

  // KF34: hanya notifikasi milik akun yang dapat ditandai sudah dibaca
  static async tandaiDibaca(idAkun, idNotifikasi) {
    const ditandai = POLA_UUID.test(String(idNotifikasi || ''))
      && (await Notifikasi.tandaiDibaca(idNotifikasi, idAkun));
    if (!ditandai) {
      return { berhasil: false, kodePesan: 'TIDAK_DITEMUKAN', pesan: 'Notifikasi tidak ditemukan.' };
    }
    return { berhasil: true, data: { belumDibaca: await Notifikasi.hitungBelumDibaca(idAkun) } };
  }

  static async tandaiSemuaDibaca(idAkun) {
    await Notifikasi.tandaiSemuaDibaca(idAkun);
    return { berhasil: true, data: { belumDibaca: 0 } };
  }

  // Menyimpan PushSubscription.toJSON() peramban: { endpoint, keys: { p256dh, auth } }
  static async simpanLanggananPush(idAkun, langganan) {
    if (!NotifikasiController.validasiLanggananPush(langganan)) {
      return { berhasil: false, kodePesan: 'DATA_TIDAK_VALID', pesan: 'Data langganan notifikasi tidak valid.' };
    }
    const { endpoint, keys } = langganan;
    await LanggananPush.simpan(idAkun, endpoint, keys.p256dh, keys.auth);
    return { berhasil: true, data: null };
  }

  // Endpoint wajib URL https dan kunci p256dh/auth wajib ada (batas panjang mengikuti tabel langganan_push)
  static validasiLanggananPush(langganan) {
    if (!langganan || typeof langganan !== 'object') return false;
    const { endpoint, keys } = langganan;
    if (typeof endpoint !== 'string' || endpoint.length > 500) return false;
    try {
      if (new URL(endpoint).protocol !== 'https:') return false;
    } catch {
      return false;
    }
    if (!keys || typeof keys !== 'object') return false;
    const { p256dh, auth } = keys;
    if (typeof p256dh !== 'string' || p256dh.trim() === '' || p256dh.length > 200) return false;
    if (typeof auth !== 'string' || auth.trim() === '' || auth.length > 100) return false;
    return true;
  }

  // Kunci publik VAPID untuk PushManager.subscribe() di peramban; null bila belum diatur
  static getKunciPublik() {
    return { berhasil: true, data: { kunciPublik: PushNotifikasiAdapter.getKunciPublik() } };
  }

  // KF52: Menyusun surel pemberitahuan penghapusan listing yang melanggar aturan beserta alasannya dan mengirimkannya ke pemilik listing
  static async kirimPeringatanPenghapusan(idPemilik, email, judulBarang, alasan) {
    const isi = [
      'Halo,',
      '',
      `Listing barang Anda "${judulBarang || 'Tanpa Judul'}" telah dihapus oleh Tim Moderasi ITBELI karena terbukti melanggar ketentuan layanan.`,
      '',
      'Alasan penghapusan:',
      `${alasan}`,
      '',
      'Apabila Anda merasa ada kekeliruan atau ingin mengajukan banding, silakan hubungi tim bantuan ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Peringatan Penghapusan Listing ITBELI', isi);
  }

  // KF52: Menyusun surel pemberitahuan penangguhan/pemblokiran akun beserta rincian pelanggaran dan mengirimkannya ke alamat surel terdaftar pengguna
  static async kirimPesanPenangguhan(idAkun, email, alasan) {
    const isi = [
      'Halo,',
      '',
      'Akun ITBELI Anda telah ditangguhkan (diblokir) oleh Tim Moderasi karena pelanggaran ketentuan layanan.',
      '',
      'Alasan penangguhan:',
      `${alasan}`,
      '',
      'Seluruh listing aktif Anda telah dinonaktifkan dan sesi login Anda telah diakhiri. Jika Anda merasa ini merupakan kekeliruan, silakan hubungi tim bantuan ITBELI.',
    ].join('\n');
    return SurelAdapter.kirimSurel(email, 'Pemberitahuan Penangguhan Akun ITBELI', isi);
  }
}

module.exports = NotifikasiController;
