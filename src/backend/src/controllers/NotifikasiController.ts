import { Notifikasi } from '../models/Notifikasi.js';

/**
 * Kelas DPPL C30 - NotifikasiController (Stub & Persistence sesuai DPPL Bab 5.20)
 * Memproses pembentukan notifikasi otomatis saat terjadi event kontrak kerja (KNF12, KNF20, KNF21).
 */
export class NotifikasiController {
  /**
   * ALGO-067 & Q-027: Membuat objek notifikasi baru, menyimpannya ke database,
   * dan memicu pengiriman notifikasi.
   */
  public async buatNotifikasi(
    idPenerima: string,
    pesan: string
  ): Promise<Notifikasi | null> {
    if (!idPenerima || !pesan) {
      return null;
    }

    const notif = new Notifikasi(idPenerima, pesan);
    await notif.simpanNotifikasi();
    await this.kirimNotifikasi(notif);
    return notif;
  }

  /**
   * ALGO-068 & ALGO-069 (Q-028): Meneruskan isi notifikasi ke penerima (stub push notification)
   */
  public async kirimNotifikasi(
    notifOrIdPenerima: Notifikasi | string,
    pesan?: string
  ): Promise<void> {
    if (notifOrIdPenerima instanceof Notifikasi) {
      const targetId = notifOrIdPenerima.getIdPenerima();
      const message = notifOrIdPenerima.getIsiNotifikasi();
      if (process.env.NODE_ENV !== 'test') {
        console.log(`[Notifikasi -> ${targetId}]: ${message}`);
      }
      return;
    }

    if (typeof notifOrIdPenerima === 'string' && pesan) {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`[Notifikasi -> ${notifOrIdPenerima}]: ${pesan}`);
      }
    }
  }
}

export const notifikasiController = new NotifikasiController();
export default NotifikasiController;
