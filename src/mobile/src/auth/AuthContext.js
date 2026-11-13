/**
 * Status login aplikasi (komponen pendukung Autentikasi di sisi View).
 * Token disimpan lewat penyimpananToken.js (SecureStore di HP, localStorage di mode web).
 * Pemilik: P1.
 *
 *   const { pengguna, masuk, masukDenganGoogle, keluar, memuat, segarkanPengguna } = useAuth();
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setTokenApi } from '../api/client';
import { ambilToken, hapusToken, simpanToken } from './penyimpananToken';

const KUNCI_TOKEN = 'silembur.token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [pengguna, setPengguna] = useState(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const tersimpan = await ambilToken(KUNCI_TOKEN);
        if (tersimpan) {
          setTokenApi(tersimpan);
          const { pengguna: p } = await api.get('/auth/me');
          setPengguna(p);
        }
      } catch {
        setTokenApi(null);
        await hapusToken(KUNCI_TOKEN).catch(() => {});
      } finally {
        setMemuat(false);
      }
    })();
  }, []);

  const terapkanSesi = useCallback(async ({ token, pengguna: p }) => {
    setTokenApi(token);
    await simpanToken(KUNCI_TOKEN, token);
    setPengguna(p);
    return p;
  }, []);

  const masuk = useCallback(
    async (email, password) => terapkanSesi(await api.post('/auth/login', { email, password })),
    [terapkanSesi],
  );

  /** Login Google: kirim ID token ke server untuk diverifikasi (POST /auth/google). */
  const masukDenganGoogle = useCallback(
    async (idToken) => terapkanSesi(await api.post('/auth/google', { idToken })),
    [terapkanSesi],
  );

  /** Muat ulang profil dari server (mis. jumlahLaporan bertambah setelah membuat laporan). Gagal -> data lama dipakai. */
  const segarkanPengguna = useCallback(async () => {
    try {
      const { pengguna: p } = await api.get('/auth/me');
      setPengguna(p);
    } catch {
      // Biarkan data profil yang sudah ada; layar lain menangani error koneksi.
    }
  }, []);

  const keluar = useCallback(async () => {
    setTokenApi(null);
    await hapusToken(KUNCI_TOKEN).catch(() => {});
    setPengguna(null);
  }, []);

  const nilai = useMemo(
    () => ({ pengguna, memuat, masuk, masukDenganGoogle, keluar, segarkanPengguna }),
    [pengguna, memuat, masuk, masukDenganGoogle, keluar, segarkanPengguna],
  );
  return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
