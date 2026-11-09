"use client"

// C13 · PenugasanPage (kelas boundary DPPL). Pemilik: Peran C (lihat AGENTS.md bagian 4).
import {useRef, useState, useTransition } from "react";
import { FilterKategori, SEMUA_KATEGORI, type PilihanKategori } from "@/client/components/penugasan/FilterKategori";
import { KartuTugas } from "../components/penugasan/KartuTugas";
import type { ActionResult } from "@/lib/action-result";
import type { TugasLaporan } from "@/server/entities/ListTugas";
import { KATEGORI } from "@/lib/constants";
import { doFilter, doSorting } from "@/server/controllers/PenugasanController";

type Props = { hasilAwal: ActionResult<TugasLaporan[]> };

// tampilkanPage() Algo-025
export function PenugasanPage({ hasilAwal}: Props) {
  const [pilihanKategori, setPilihanKategori] = useState<PilihanKategori>(SEMUA_KATEGORI);
  const [daftar, setDaftar] = useState<TugasLaporan[]>(hasilAwal.ok ? hasilAwal.data : []);
  const [jumlahAktif, setJumlahAktif] = useState(hasilAwal.ok ? hasilAwal.data.length : 0);
  const [pesanGagal, setPesanGagal] = useState<string | null> (hasilAwal.ok ? null : hasilAwal.error);
  const [loading, startTransition] = useTransition();
  const permintaanTerakhir = useRef(0);

  function pilihKategori(nilai: PilihanKategori) {
    setPilihanKategori(nilai);
    const nomor = ++permintaanTerakhir.current;

    startTransition(async () => {
      const hasil = nilai == SEMUA_KATEGORI ? await doSorting() : await doFilter(nilai);
      if (nomor !== permintaanTerakhir.current) return;
      
      if (!hasil.ok) {
        setPesanGagal(hasil.error);
        return
      }

      setPesanGagal(null);
      setDaftar(hasil.data);
      if (nilai === SEMUA_KATEGORI) setJumlahAktif(hasil.data.length);
    });
  }

  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-4">
        <h1 className="text-xl font-semibold">Daftar Tugas</h1>
        {hasilAwal.ok && (
          <p className="text-sm text-gray-500">
            Eksekutor Lapangan · {jumlahAktif} tugas aktif
          </p>
        )}
      </header>

      {hasilAwal.ok && (
        <div className="mb-4">
          <FilterKategori nilai={pilihanKategori} onSelect={pilihKategori} disabled={loading} />
        </div>
      )}

      {pesanGagal && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {pesanGagal}
        </p>
      )}

      {hasilAwal.ok && (
        <div>
          {renderListTugas(daftar, pilihanKategori)}
        </div>
      )}
    </main>
  );
}

function renderListTugas(daftar: TugasLaporan[], pilihanKategori: PilihanKategori) {
  if (daftar.length === 0) {
    const pesan = 
      pilihanKategori === SEMUA_KATEGORI ?
      "Belum ada penugasan yang perlu dikerjakan saat ini." : `Tidak ada tugas dengan kategori ${KATEGORI[pilihanKategori]}.`
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        {pesan}
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
