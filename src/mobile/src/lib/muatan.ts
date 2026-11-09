import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { ApiError } from '@/api/client';

/**
 * State of data loaded from the backend, so every card or screen handles the
 * same four cases: still loading, failed, loaded but empty, and loaded.
 * "Empty" is `{ status: 'siap', data: null }`.
 */
export type Muatan<T> =
  | { status: 'memuat' }
  | { status: 'galat'; pesan: string }
  | { status: 'siap'; data: T };

/**
 * Loads `ambil()` each time the screen gains focus, so returning from a settings
 * screen shows the new value. Only the first load (and "Coba lagi") shows the
 * spinner; later reloads keep the current data on screen until the new data arrives.
 * `ambil` must be stable (a module function or a `useCallback`).
 */
export function useMuatan<T>(ambil: () => Promise<T>): [Muatan<T>, () => void] {
  const [muatan, setMuatan] = useState<Muatan<T>>({ status: 'memuat' });
  // Only the latest request may update the state, so a slow earlier one cannot overwrite it.
  const permintaanTerakhir = useRef(0);

  const muat = useCallback(
    async (tampilkanMemuat: boolean) => {
      const ke = ++permintaanTerakhir.current;
      if (tampilkanMemuat) setMuatan({ status: 'memuat' });
      try {
        const data = await ambil();
        if (ke === permintaanTerakhir.current) setMuatan({ status: 'siap', data });
      } catch (e) {
        if (ke !== permintaanTerakhir.current) return;
        const pesan = e instanceof ApiError ? e.pesan : 'Terjadi kesalahan. Coba lagi.';
        setMuatan({ status: 'galat', pesan });
      }
    },
    [ambil],
  );

  useFocusEffect(
    useCallback(() => {
      void muat(false);
      // Ignore a request still in flight when the screen loses focus or unmounts.
      return () => {
        permintaanTerakhir.current++;
      };
    }, [muat]),
  );

  const muatUlang = useCallback(() => void muat(true), [muat]);
  return [muatan, muatUlang];
}
