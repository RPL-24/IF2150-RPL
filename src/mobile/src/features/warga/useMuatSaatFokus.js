/**
 * Muat ulang data setiap kali layar kembali difokuskan (mis. setelah membuka notifikasi
 * atau mengirim revisi). Fokus pertama dilewati karena useApi sudah memuat saat mount. Pemilik: P3.
 */
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useMuatSaatFokus(...fungsiMuat) {
  const pertama = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (pertama.current) {
        pertama.current = false;
        return;
      }
      fungsiMuat.forEach((f) => f());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, fungsiMuat),
  );
}
