import type { ItemPeta } from "@/server/controllers/StatusController";

/** Siklus refetch UC06 Alt 1. Pemanggil mengabaikan respons bila signal sudah aborted. */
export function mulaiPembaruanPeta(muat: (signal: AbortSignal) => Promise<void>): () => void {
  const pembatalan = new AbortController();
  let sedangMemuat = false;

  async function perbarui() {
    if (pembatalan.signal.aborted || sedangMemuat || document.visibilityState !== "visible") return;
    sedangMemuat = true;
    try {
      await muat(pembatalan.signal);
    } catch {
      // Data terakhir tetap terlihat. Event/interval berikutnya dapat mencoba lagi.
    } finally {
      sedangMemuat = false;
    }
  }

  const saatAktif = () => { void perbarui(); };
  const timer = setInterval(saatAktif, 30_000);
  document.addEventListener("visibilitychange", saatAktif);
  window.addEventListener("focus", saatAktif);

  return () => {
    pembatalan.abort();
    clearInterval(timer);
    document.removeEventListener("visibilitychange", saatAktif);
    window.removeEventListener("focus", saatAktif);
  };
}

/** Status/lokasi mengikuti server; dukungan yang hanya bisa bertambah tidak boleh mundur. */
export function gabungkanPetaTerbaru(
  daftarBaru: ItemPeta[], daftarSebelumnya: ItemPeta[],
  jumlahDukunganTerbaru: Readonly<Record<string, ItemPeta["jumlah_upvote"]>>,
): ItemPeta[] {
  const sebelumnya = new Map(daftarSebelumnya.map((laporan) => [laporan.id_tiket, laporan]));
  return daftarBaru.map((laporan) => {
    const lama = sebelumnya.get(laporan.id_tiket);
    return {
      ...laporan,
      jumlah_upvote: Math.max(laporan.jumlah_upvote, lama?.jumlah_upvote ?? 0, jumlahDukunganTerbaru[laporan.id_tiket] ?? 0),
      sudahDidukung: laporan.sudahDidukung === true || lama?.sudahDidukung === true ? true : laporan.sudahDidukung,
    };
  });
}
