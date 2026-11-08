/**
 * Dialog konfirmasi berbasis Promise (dipakai untuk warning() UC07 dan aksi berisiko lain).
 * Pemilik: P1.
 *
 *   const yakin = await konfirmasi({ judul: 'Gabungkan laporan?', pesan: '...', tombolYa: 'Yakin' });
 *   if (!yakin) return;
 */
import { Alert } from 'react-native';

export function konfirmasi({ judul, pesan, tombolYa = 'Ya', tombolTidak = 'Batal', berbahaya = false }) {
  return new Promise((resolve) => {
    Alert.alert(
      judul,
      pesan,
      [
        { text: tombolTidak, style: 'cancel', onPress: () => resolve(false) },
        { text: tombolYa, style: berbahaya ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

/** Pemberitahuan sederhana (satu tombol). */
export function beritahu(judul, pesan) {
  Alert.alert(judul, pesan);
}
