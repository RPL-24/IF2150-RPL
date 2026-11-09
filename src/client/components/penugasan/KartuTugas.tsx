// Kartu satu tugas di Daftar Tugas dan indikator skor prioritas

import { KATEGORI } from "@/lib/constants";
import type { TugasLaporan } from "@/server/entities/ListTugas";

const MAX_SKOR = 100;

export function KartuTugas({ tugas }: { tugas: TugasLaporan }) {
    const skor = Math.round(Number(tugas.skor_prioritas));
    const persen = Math.min(100, Math.max(0, (skor / MAX_SKOR) * 100));

    return (
        <article className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-gray-500">{tugas.id_tiket}</p>
                    <p className="font-semibold">{KATEGORI[tugas.kategori]}</p>
                </div>
                <p className="shrink-0 text-sm">
                    <span className="text-lg font-semibold">{skor}</span>
                    <span className="text-gray-500"> /{MAX_SKOR}</span>
                </p>
            </div>
            <div aria-hidden="true" className="mt-2 h-1.5 rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${persen}%` }} />
            </div>
        </article>
    )
}