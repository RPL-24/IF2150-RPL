/**
 * Hook pemuat data generik: memanggil fungsi API, mengelola loading/error, bisa dimuat ulang.
 * Pemilik: P1.
 *
 *   const { data, memuat, error, muatUlang } = useApi(() => laporanPublik.daftar({ wilayah }), [wilayah]);
 *   if (memuat) return <LoadingState />;
 *   if (error) return <ErrorState pesan={error.message} onCobaLagi={muatUlang} />;
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useApi(fungsi, deps = []) {
  const [data, setData] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState(null);
  const aktif = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const muatUlang = useCallback(async () => {
    setMemuat(true);
    setError(null);
    try {
      const hasil = await fungsi();
      if (aktif.current) setData(hasil);
    } catch (err) {
      if (aktif.current) setError(err);
    } finally {
      if (aktif.current) setMemuat(false);
    }
  }, deps);

  useEffect(() => {
    aktif.current = true;
    muatUlang();
    return () => {
      aktif.current = false;
    };
  }, [muatUlang]);

  return { data, memuat, error, muatUlang, setData };
}
