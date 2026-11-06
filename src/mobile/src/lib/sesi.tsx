/**
 * The signed-in user, shared with every screen (`useSesi()`).
 * The root layout restores it from the device before the splash screen hides.
 */
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { aturSaatTidakTerautentikasi, hapusSesi, keluar as keluarApi, type Pengguna } from '@/api';

type NilaiSesi = {
  /** `null` when nobody is signed in. */
  pengguna: Pengguna | null;
  /** Call after a successful login; I-01 then routes by `pengguna.peran`. */
  masuk: (pengguna: Pengguna) => void;
  /** `SesiAutentikasi.logout()`, then back to I-01 (I-03-02). */
  keluar: () => Promise<void>;
};

const KonteksSesi = createContext<NilaiSesi | null>(null);

export function PenyediaSesi({ awal, children }: { awal: Pengguna | null; children: ReactNode }) {
  const [pengguna, setPengguna] = useState(awal);

  // Any 401 means the backend ended the session (logout elsewhere or BATAS_SESI).
  useEffect(() => {
    aturSaatTidakTerautentikasi(() => {
      void hapusSesi();
      setPengguna(null);
      router.replace('/');
    });
    return () => aturSaatTidakTerautentikasi(null);
  }, []);

  const keluar = async () => {
    await keluarApi();
    setPengguna(null);
    router.replace('/');
  };

  return <KonteksSesi.Provider value={{ pengguna, masuk: setPengguna, keluar }}>{children}</KonteksSesi.Provider>;
}

export function useSesi(): NilaiSesi {
  const nilai = useContext(KonteksSesi);
  if (!nilai) throw new Error('useSesi harus dipakai di dalam <PenyediaSesi>');
  return nilai;
}
