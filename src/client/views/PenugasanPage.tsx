// C13 · PenugasanPage (kelas boundary DPPL). Pemilik: Peran C (lihat AGENTS.md bagian 4).
import { KartuTugas } from "../components/penugasan/KartuTugas";
import type { ActionResult } from "@/lib/action-result";
import type { TugasLaporan } from "@/server/entities/ListTugas";

type Props = { hasilAwal: ActionResult<TugasLaporan[]> };

// tampilkanPage() Algo-025
export function PenugasanPage({ hasilAwal}: Props) {
  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-4">
        <h1 className="text-xl font-semibold">Daftar Tugas</h1>
        {hasilAwal.ok && (
          <p className="text-sm text-gray-500">
            Eksekutor Lapangan · {hasilAwal.data.length} tugas aktif
          </p>
        )}
      </header>

      {hasilAwal.ok ? (
        renderListTugas(hasilAwal.data)
      ) : (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {hasilAwal.error}
        </p>
      )}
    </main>
  );
}

function renderListTugas(daftar: TugasLaporan[]) {
  if (daftar.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Belum ada penugasan yang perlu dikerjakan saat ini.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-xs text-gray-500">
        Diurutkan berdasarkan skor prioritas tertinggi
      </p>
      <ul className="space-y-2">
        {daftar.map((tugas) => (
          <li key={tugas.id}>
            <KartuTugas tugas={tugas} />
          </li>
        ))}
      </ul>
    </>
  );
}
