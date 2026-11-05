import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import type { TipeNotifikasi } from '../models/Notifikasi';

export type DataNotifikasi = {
  tipe: TipeNotifikasi;
  idProduk?: string;
};

export type StatusIzin = 'memeriksa' | 'diizinkan' | 'ditolak';

const KATEGORI_KERUGIAN = 'kerugian';
export const AKSI_TINJAU = 'tinjau';

export class PushNotificationUI {
  private notifikasiAktif = false;

  isNotifikasiAktif(): boolean {
    return this.notifikasiAktif;
  }

  async inisialisasi(): Promise<boolean> {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Peringatan Pross',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    await Notifications.setNotificationCategoryAsync(KATEGORI_KERUGIAN, [
      {
        identifier: AKSI_TINJAU,
        buttonTitle: 'Tinjau harga',
        options: { opensAppToForeground: true },
      },
    ]);

    const { status: statusAwal } = await Notifications.getPermissionsAsync();
    let status = statusAwal;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }

    this.notifikasiAktif = status === 'granted';
    return this.notifikasiAktif;
  }

  async periksaIzin(): Promise<StatusIzin> {
    const { status } = await Notifications.getPermissionsAsync();
    this.notifikasiAktif = status === 'granted';
    return this.notifikasiAktif ? 'diizinkan' : 'ditolak';
  }

  async bukaPengaturan(): Promise<void> {
    await Linking.openSettings();
  }

  async tampilkanNotifikasi(
    judul: string,
    pesan: string,
    data: DataNotifikasi,
  ): Promise<void> {
    if (!this.notifikasiAktif) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: judul,
        body: pesan,
        data,
        categoryIdentifier: data.tipe === 'kerugian' ? KATEGORI_KERUGIAN : undefined,
      },
      trigger: null,
    });
  }

  onClickNotification(handler: (data: DataNotifikasi) => void): () => void {
    const langganan = Notifications.addNotificationResponseReceivedListener((respons) => {
      const data = parseDataNotifikasi(respons.notification.request.content.data);
      if (data !== null) handler(data);
    });
    return () => langganan.remove();
  }

  async ambilKetukanTerakhir(): Promise<DataNotifikasi | null> {
    const respons = await Notifications.getLastNotificationResponseAsync();
    if (respons === null) return null;
    return parseDataNotifikasi(respons.notification.request.content.data);
  }
}

export const pushNotificationUI = new PushNotificationUI();

export function parseDataNotifikasi(data: unknown): DataNotifikasi | null {
  if (typeof data !== 'object' || data === null) return null;
  const { tipe, idProduk } = data as Record<string, unknown>;
  if (tipe !== 'kerugian' && tipe !== 'harga_bahan') return null;
  return {
    tipe,
    idProduk: typeof idProduk === 'string' ? idProduk : undefined,
  };
}
