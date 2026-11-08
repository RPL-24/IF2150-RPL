"use client";
// C11 · LaporPage (kelas boundary DPPL). Pemilik: Peran A (lihat AGENTS.md bagian 4).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KATEGORI } from "@/lib/constants";
import type { Enums } from "@/types/database";
import { HeaderLapor } from "@/client/components/lapor/HeaderLapor";
import { AreaBerkas } from "@/client/components/lapor/AreaBerkas";
import { AreaLokasi } from "@/client/components/lapor/AreaLokasi";
import { DialogTerkirim } from "@/client/components/lapor/DialogTerkirim";

const KELAS_LABEL = "block text-sm font-semibold";
const KELAS_INPUT = "mt-1.5 w-full rounded-lg border border-gray-300 bg-background dark:border-gray-700 px-3 py-2.5 text-base";

// Sementara (tampilan statis): dipakai sebelum tersambung ke LaporanController.kirimLaporan.
const ID_TIKET_DUMMY = "LK-0123";

export function LaporPage() {
  const router = useRouter();
  const [inputKategori, setInputKategori] = useState<Enums<"kategori_kerusakan"> | "">("");
  const [inputDeskripsi, setInputDeskripsi] = useState("");
  const [diLuarWilayah, setDiLuarWilayah] = useState(false);
  const [idTiketTerkirim, setIdTiketTerkirim] = useState<string | null>(null);

  // DPPL batalkanLaporan(): dipakai I01-01 dan I01-14.
  function batalkanLaporan() {
    router.back();
  }

  // Sementara: toggle alert I01-13 untuk mengecek tampilan. Diganti kunciLokasi() di branch GPS.
  function gunakanLokasiDummy() {
    setDiLuarWilayah((v) => !v);
  }

  // DPPL submitForm(). Sementara langsung menampilkan dialog sukses dengan data dummy.
  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIdTiketTerkirim(ID_TIKET_DUMMY);
  }

  return (
    // Mockup DPPL 6.1 tema sesuai dark/lightmode pengguna
    <main className="flex flex-1 flex-col">
      <form onSubmit={submitForm} className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <HeaderLapor onKembali={batalkanLaporan} />

        <div className="flex-1 space-y-5 px-4 py-4">
          <label className={KELAS_LABEL}>
            Kategori kerusakan
            <select
              required
              value={inputKategori}
              onChange={(e) => setInputKategori(e.target.value as Enums<"kategori_kerusakan">)}
              className={`${KELAS_INPUT} font-normal`}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {Object.entries(KATEGORI).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={KELAS_LABEL}>
            Deskripsi
            <textarea
              required
              rows={3}
              value={inputDeskripsi}
              onChange={(e) => setInputDeskripsi(e.target.value)}
              placeholder="Jelaskan kondisi kerusakan"
              className={`${KELAS_INPUT} font-normal`}
            />
          </label>

          <AreaBerkas />
          <AreaLokasi diLuarWilayah={diLuarWilayah} onGunakanLokasi={gunakanLokasiDummy} />
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-background dark:border-gray-800 px-4 py-3">
          <button
            type="button"
            onClick={batalkanLaporan}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={diLuarWilayah}
            className="flex-[2] rounded-lg bg-blue-600 py-2.5 font-medium text-white disabled:opacity-60"
          >
            Kirim Laporan
          </button>
        </div>
      </form>

      {idTiketTerkirim && (
        <DialogTerkirim idTiket={idTiketTerkirim} onTutup={() => setIdTiketTerkirim(null)} />
      )}
    </main>
  );
}