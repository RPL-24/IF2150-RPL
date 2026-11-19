// C44 PushNotifikasiAdapter – pengirim Web Push ke peramban penerima memakai kunci VAPID (KF34).
// Notifikasi ditampilkan oleh Service Worker ITBELI (views/sw.js).
const webpush = require('web-push');
const config = require('../config/env');
const LanggananPush = require('../models/LanggananPush');

const TTL_DETIK = 24 * 60 * 60; // push service menyimpan pesan maksimal 1 hari bila peramban sedang luring
const STATUS_LANGGANAN_KEDALUWARSA = [404, 410];

class PushNotifikasiAdapter {
  constructor(kunciPublikVapid, kunciPrivatVapid, subjekVapid) {
    this.kunciPublikVapid = kunciPublikVapid;
    this.kunciPrivatVapid = kunciPrivatVapid;
    this.subjekVapid = subjekVapid;
    this.sudahCatatTanpaVapid = false;
  }

  vapidTerkonfigurasi() {
    return Boolean(this.kunciPublikVapid && this.kunciPrivatVapid);
  }

  getKunciPublik() {
    return this.vapidTerkonfigurasi() ? this.kunciPublikVapid : null;
  }

  // Algo-071 (KF34). Payload { judul, isi, tautan } dibaca Service Worker.
  // Mengembalikan false (tanpa melempar galat) bila VAPID belum diatur atau tidak ada yang terkirim.
  async kirimPush(idPenerima, judul, isi, tautan = '/') {
    if (!this.vapidTerkonfigurasi()) {
      if (!this.sudahCatatTanpaVapid) {
        console.warn('Web Push dilewati: VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY belum diatur.');
        this.sudahCatatTanpaVapid = true;
      }
      return false;
    }

    try {
      const daftarLangganan = await LanggananPush.getByAkun(idPenerima);
      if (daftarLangganan.length === 0) return false; // penerima belum mengaktifkan notifikasi

      const muatan = JSON.stringify({ judul, isi, tautan });
      const opsi = {
        TTL: TTL_DETIK,
        vapidDetails: {
          subject: this.subjekVapid,
          publicKey: this.kunciPublikVapid,
          privateKey: this.kunciPrivatVapid,
        },
      };

      let adaTerkirim = false;
      for (const langganan of daftarLangganan) {
        try {
          await webpush.sendNotification(
            { endpoint: langganan.endpoint, keys: { p256dh: langganan.p256dh, auth: langganan.auth } },
            muatan,
            opsi,
          );
          adaTerkirim = true;
        } catch (galat) {
          if (STATUS_LANGGANAN_KEDALUWARSA.includes(galat.statusCode)) {
            // Langganan sudah tidak berlaku di push service: hapus supaya tidak dicoba lagi
            await LanggananPush.hapusByEndpoint(langganan.endpoint);
          } else {
            console.error('Pengiriman push gagal:', galat.message);
          }
        }
      }
      return adaTerkirim;
    } catch (galat) {
      console.error('Pengiriman push gagal:', galat.message);
      return false;
    }
  }
}

const { publicKey, privateKey, subject } = config.vapid;
module.exports = new PushNotifikasiAdapter(publicKey, privateKey, subject);
