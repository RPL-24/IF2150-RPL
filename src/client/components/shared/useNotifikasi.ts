"use client";

// Notifikasi in-app real-time (C10/C23). Muat lewat NotifikasiController; setiap INSERT baru dari
// Supabase Realtime postgres_changes (tersaring RLS + filter id_user) memicu muat ulang, supaya id_tiket
// ikut terisi (payload Realtime hanya baris notifikasi). Ini satu-satunya tempat View subscribe Realtime
// (AGENTS.md bagian 3).

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ambilNotifikasi, updateStatusBaca, type ItemNotifikasi } from "@/server/controllers/NotifikasiController";

export function useNotifikasi(userId: string) {
  const [daftar, setDaftar] = useState<ItemNotifikasi[]>([]);
  const [belumDibaca, setBelumDibaca] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Salinan daftar terbaru untuk tandaiDibaca (useCallback tanpa dependensi tidak melihat state terbaru).
  const daftarRef = useRef<ItemNotifikasi[]>([]);
  useEffect(() => {
    daftarRef.current = daftar;
  }, [daftar]);

  useEffect(() => {
    let aktif = true;
    let berjalan = false;
    let ulang = false;

    // Tidak bertumpuk: event yang datang saat fetch berjalan hanya menandai `ulang`,
    // lalu fetch diulang SEKALI setelah fetch yang sedang berjalan selesai.
    // try/finally memastikan `berjalan` selalu dilepas walau fetch melempar error (mis. koneksi putus).
    async function muat() {
      if (berjalan) {
        ulang = true;
        return;
      }
      berjalan = true;
      try {
        do {
          ulang = false;
          const hasil = await ambilNotifikasi();
          if (!aktif) return;
          if (hasil.ok) {
            setDaftar(hasil.data.daftar);
            setBelumDibaca(hasil.data.belumDibaca);
            setError(null);
          } else {
            setError(hasil.error);
          }
        } while (ulang);
      } catch {
        if (aktif) setError("Gagal memuat notifikasi. Periksa koneksi.");
      } finally {
        berjalan = false;
      }
    }

    void muat();
    const supabase = createClient();
    const channel = supabase
      .channel(`notifikasi:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifikasi", filter: `id_user=eq.${userId}` },
        () => void muat(),
      )
      .subscribe();

    return () => {
      aktif = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const tandaiDibaca = useCallback(async (idNotifikasi: string) => {
    // Notifikasi yang sudah dibaca (atau tidak ada di daftar) dilewati, supaya badge tidak berkurang dua kali.
    const target = daftarRef.current.find((n) => n.id_notifikasi === idNotifikasi);
    if (!target || target.status_baca) return;

    const hasil = await updateStatusBaca(idNotifikasi);
    if (!hasil.ok) return setError(hasil.error);
    setDaftar((lama) => lama.map((n) => (n.id_notifikasi === idNotifikasi ? { ...n, status_baca: true } : n)));
    setBelumDibaca((x) => Math.max(0, x - 1));
  }, []);

  return { daftar, belumDibaca, error, tandaiDibaca };
}