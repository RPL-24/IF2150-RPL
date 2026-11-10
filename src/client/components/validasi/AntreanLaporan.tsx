import { KATEGORI } from "@/lib/constants";
import { formatWaktu } from "@/lib/format";
import type { LaporanAntrean } from "@/server/controllers/ValidasiController";

type Props = {
  daftar: LaporanAntrean[];
  pilihanFilter: string;
  ascending: boolean;
  idTiketTerpilih: string | null;
  memuat: boolean;
  onPilihFilterKategori: (kategori: string) => void;
  onBalikUrutan: () => void;
  onPilihLaporan: (idTiket: string) => void;
};

export function AntreanLaporan({
  daftar,
  pilihanFilter,
  ascending,
  idTiketTerpilih,
  memuat,
  onPilihFilterKategori,
  onBalikUrutan,
  onPilihLaporan,
}: Props) {
  return (
    <section aria-label="Antrean laporan" className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="filter-kategori" className="sr-only">
          Kategori
        </label>
        <select
          id="filter-kategori"
          value={pilihanFilter}
          onChange={(e) => onPilihFilterKategori(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="semua">Semua kategori</option>
          {Object.entries(KATEGORI).map(([nilai, label]) => (
            <option key={nilai} value={nilai}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onBalikUrutan}
          className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          {ascending ? "Terlama" : "Terbaru"}
        </button>
      </div>

      <p className="text-xs text-gray-500" aria-live="polite">
        {memuat ? "Memuat antrean..." : `${daftar.length} laporan`}
      </p>

      {daftar.length === 0 && !memuat ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Tidak ada laporan dalam antrean.
        </p>
      ) : (
        <ul className={`space-y-2 overflow-y-auto ${memuat ? "opacity-60" : ""}`}>
          {daftar.map((laporan) => {
            const terpilih = laporan.id_tiket === idTiketTerpilih;
            return (
              <li key={laporan.id}>
                <button
                  type="button"
                  onClick={() => onPilihLaporan(laporan.id_tiket)}
                  aria-current={terpilih ? "true" : undefined}
                  className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${
                    terpilih ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">{laporan.id_tiket}</span>
                    <span className="text-xs text-gray-500">{formatWaktu(laporan.waktu_masuk)}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-600">{KATEGORI[laporan.kategori]}</span>
                  <span className="mt-1 line-clamp-2 block text-gray-700">{laporan.deskripsi}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
