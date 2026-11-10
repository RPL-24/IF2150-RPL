/**
 * The signed-in user, shared with every screen (`useSesi()`).
 * The root layout restores it from the device before the splash screen hides.
 */
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { aturSaatTidakTerautentikasi, hapusSesi, keluar as keluarApi, type Pengguna } from '@/api';

import { daftarkanPerangkatIni } from './notifikasi';

type NilaiSesi = {
  /** `null` when nobody is signed in. */
  pengguna: Pengguna | null;
  /** Call after a successful login; I-01 then routes by `pengguna.peran`. */
  masuk: (pengguna: Pengguna) => void;
  /** `SesiAutentikasi.logout()`, then back to I-01 (I-02 and I-03-02). */
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

  const masuk = (baru: Pengguna) => {
    setPengguna(baru);
    // Algo-003 after a successful login; runs in the background and never fails the login.
    void daftarkanPerangkatIni();
  };

  // Repeated taps on a logout button while the request is in flight are ignored.
  const sedangKeluar = useRef(false);

  const keluar = async () => {
    if (sedangKeluar.current) return;
    sedangKeluar.current = true;
    try {
      await keluarApi();
      setPengguna(null);
      router.replace('/');
    } finally {
      sedangKeluar.current = false;
    }
  };

  return <KonteksSesi.Provider value={{ pengguna, masuk, keluar }}>{children}</KonteksSesi.Provider>;
}

export function useSesi(): NilaiSesi {
  const nilai = useContext(KonteksSesi);
  if (!nilai) throw new Error('useSesi harus dipakai di dalam <PenyediaSesi>');
  return nilai;
}
