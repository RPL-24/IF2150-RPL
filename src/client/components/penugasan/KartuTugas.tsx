// Kartu satu tugas di Daftar Tugas dan indikator skor prioritas

import { KATEGORI } from "@/lib/constants";
import type { TugasLaporan } from "@/server/entities/ListTugas";

const MAX_SKOR = 100;

type Props = {
    tugas: TugasLaporan;
    aktif: boolean;
    onSelect: (tugas: TugasLaporan) => void;
};

export function KartuTugas({ tugas, aktif, onSelect}: Props) {
    const skor = Math.round(Number(tugas.skor_prioritas));
    const persen = Math.min(100, Math.max(0, (skor / MAX_SKOR) * 100));

    return (
    <button
      type="button"
      onClick={() => onSelect(tugas)}
      aria-pressed={aktif}
      className={`block w-full rounded-lg border p-3 text-left ${
        aktif ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-xs font-medium text-gray-500">{tugas.id_tiket}</span>
          <span className="block font-semibold">{KATEGORI[tugas.kategori]}</span>
        </span>
        <span className="shrink-0 text-sm">
          <span className="text-lg font-semibold">{skor}</span>
          <span className="text-gray-500"> /{MAX_SKOR}</span>
        </span>
      </span>
      {/* Bar hanya visual; angka skor di atas sudah terbaca oleh pembaca layar. */}
      <span aria-hidden="true" className="mt-2 block h-1.5 rounded-full bg-gray-100">
        <span className="block h-full rounded-full bg-blue-600" style={{ width: `${persen}%` }} />
      </span>
    </button>
  );
}