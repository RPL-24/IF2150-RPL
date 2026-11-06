/**
 * Status login aplikasi (komponen pendukung Autentikasi di sisi View).
 * Token disimpan lewat penyimpananToken.js (SecureStore di HP, localStorage di mode web).
 * Pemilik: P1.
 *
 *   const { pengguna, masuk, keluar, memuat } = useAuth();
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

  const masuk = useCallback(async (email, password) => {
    const { token, pengguna: p } = await api.post('/auth/login', { email, password });
    setTokenApi(token);
    await simpanToken(KUNCI_TOKEN, token);
    setPengguna(p);
    return p;
  }, []);

  const keluar = useCallback(async () => {
    setTokenApi(null);
    await hapusToken(KUNCI_TOKEN).catch(() => {});
    setPengguna(null);
  }, []);

  const nilai = useMemo(() => ({ pengguna, memuat, masuk, keluar }), [pengguna, memuat, masuk, keluar]);
  return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
