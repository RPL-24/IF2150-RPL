"use client";

import React, { useEffect, useState } from "react";
import type { ApiRespons, FormatEkspor, PeriodeDTO, RekapitulasiDTO } from "@/contracts";

export default function LayarI15() {
  const [daftarPeriode, setDaftarPeriode] = useState<PeriodeDTO[]>([]);
  const [idPeriode, setIdPeriode] = useState<string>("");
  const [rekap, setRekap] = useState<RekapitulasiDTO | null>(null);
  const [pesanGalat, setPesanGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/iuran/periode")
      .then((r) => r.json())
      .then((res: ApiRespons<PeriodeDTO[]>) => {
        if (res.ok && res.data.length > 0) {
          setDaftarPeriode(res.data);
          const finalPertama = res.data.find((p) => p.statusFinal) ?? res.data[0];
          setIdPeriode(finalPertama.idPeriode);
        }
      });
  }, []);

  const handleBuatRekap = async () => {
    setMemuat(true);
    setPesanGalat(null);
    try {
      const res = await fetch("/api/iuran/rekapitulasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPeriode }),
      });
      const json: ApiRespons<RekapitulasiDTO> = await res.json();
      if (json.ok) {
        setRekap(json.data);
      } else {
        setPesanGalat(json.pesan);
      }
    } catch {
      setPesanGalat("Gagal membuat rekapitulasi.");
    } finally {
      setMemuat(false);
    }
  };

  const handleEkspor = async (format: FormatEkspor) => {
    setPesanGalat(null);
    const res = await fetch(
      `/api/iuran/rekapitulasi/ekspor?idPeriode=${encodeURIComponent(idPeriode)}&format=${format}`,
    );
    const json: ApiRespons<{ namaBerkas: string; url: string }> = await res.json();
    if (json.ok) {
      window.open(json.data.url, "_blank");
    } else {
      setPesanGalat(json.pesan);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Rekapitulasi Iuran (UC11)</h1>
        <p className="text-sm text-gray-600">
          Rekapitulasi tagihan periode FINAL dan ekspor laporan ke CSV atau PDF.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={idPeriode}
          onChange={(e) => {
            setIdPeriode(e.target.value);
            setRekap(null);
            setPesanGalat(null);
          }}
          className="rounded border px-3 py-2 text-sm"
        >
          {daftarPeriode.map((p) => (
            <option key={p.idPeriode} value={p.idPeriode}>
              {p.bulan}/{p.tahun} ({p.statusFinal ? "FINAL" : "DRAFT"})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleBuatRekap}
          disabled={memuat || !idPeriode}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Tampilkan Rekapitulasi
        </button>

        <button
          type="button"
          onClick={() => handleEkspor("CSV")}
          disabled={!idPeriode}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={() => handleEkspor("PDF")}
          disabled={!idPeriode}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Ekspor PDF
        </button>
      </div>

      {pesanGalat && (
        <div role="alert" className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {pesanGalat}
        </div>
      )}

      {rekap && (
        <div className="rounded-lg border bg-white p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-b pb-3 text-sm">
            <div>
              <p className="text-gray-500">Total Air</p>
              <p className="text-lg font-bold">{rekap.totalPemakaianAir} m³</p>
            </div>
            <div>
              <p className="text-gray-500">Total Energi</p>
              <p className="text-lg font-bold">{rekap.totalPemakaianEnergi} kWh</p>
            </div>
            <div>
              <p className="text-gray-500">Total Iuran</p>
              <p className="text-lg font-bold">Rp {rekap.totalIuran.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">ID Warga</th>
                <th className="py-2">Nama Warga</th>
                <th className="py-2">Volume Air (m³)</th>
                <th className="py-2">Energi (kWh)</th>
                <th className="py-2">Jumlah Iuran</th>
              </tr>
            </thead>
            <tbody>
              {rekap.baris.map((b) => (
                <tr key={b.idWarga} className="border-b last:border-0">
                  <td className="py-2">{b.idWarga}</td>
                  <td className="py-2">{b.namaWarga}</td>
                  <td className="py-2">{b.volumeAirM3}</td>
                  <td className="py-2">{b.energiKWh}</td>
                  <td className="py-2 font-semibold">Rp {b.jumlahIuran.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}