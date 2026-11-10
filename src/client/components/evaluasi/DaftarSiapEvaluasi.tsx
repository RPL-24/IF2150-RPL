import { KATEGORI } from "@/lib/constants";
import { formatTanggal, formatWaktu } from "@/lib/format";
import type { ItemSiapEvaluasi } from "@/server/entities/Evaluasi";

type Props = {
  daftar: ItemSiapEvaluasi[];
  idTiketDipilih: string | null;
  memuat: boolean;
  onPilihPekerjaan: (idTiket: string) => void;
};

export function DaftarSiapEvaluasi({ daftar, idTiketDipilih, memuat, onPilihPekerjaan }: Props) {
  return (
    <section aria-label="Antrean siap evaluasi" className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">
          {memuat ? "Memuat antrean..." : `Siap evaluasi (${daftar.length})`}
        </h2>
      </div>

      {daftar.length === 0 && !memuat ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Tidak ada antrean laporan yang siap dievaluasi.
        </p>
      ) : (
        <ul className={`space-y-2 overflow-y-auto ${memuat ? "opacity-60" : ""}`}>
          {daftar.map((item) => {
            const terpilih = item.id_tiket === idTiketDipilih;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onPilihPekerjaan(item.id_tiket)}
                  aria-current={terpilih ? "true" : undefined}
                  className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${
                    terpilih ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{item.id_tiket}</span>
                    <span className="text-xs text-gray-600">{formatWaktu(item.waktu_unggah)}</span>
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-gray-700">
                    {KATEGORI[item.kategori]}
                  </span>
                  <span className="mt-1 block text-xs text-gray-600">
                    {item.nama_eksekutor ?? "Eksekutor Lapangan"} · Laporan masuk {formatTanggal(item.waktu_masuk)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
