"use client";

import React, { useEffect, useState } from "react";
import type { ApiRespons, PeriodeDTO, RingkasanPemakaian } from "@/contracts";

export default function LayarI13() {
  const [daftarPeriode, setDaftarPeriode] = useState<PeriodeDTO[]>([]);
  const [idPeriode, setIdPeriode] = useState<string>("");
  const [analitik, setAnalitik] = useState<RingkasanPemakaian | null>(null);
  const [pesanGalat, setPesanGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/iuran/periode")
      .then((r) => r.json())
      .then((res: ApiRespons<PeriodeDTO[]>) => {
        if (res.ok && res.data.length > 0) {
          setDaftarPeriode(res.data);
          setIdPeriode(res.data[0].idPeriode);
        }
      })
      .catch(() => setPesanGalat("Gagal memuat daftar periode."));
  }, []);

  useEffect(() => {
    if (!idPeriode) return;
    setMemuat(true);
    setPesanGalat(null);

    fetch(`/api/iuran/analitik?idPeriode=${encodeURIComponent(idPeriode)}`)
      .then((r) => r.json())
      .then((res: ApiRespons<RingkasanPemakaian>) => {
        if (res.ok) {
          setAnalitik(res.data);
        } else {
          setPesanGalat(res.pesan);
        }
      })
      .catch(() => setPesanGalat("Gagal memuat analitik komunal."))
      .finally(() => setMemuat(false));
  }, [idPeriode]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Analitik Pemakaian Komunal (UC09)</h1>
        <p className="text-sm text-gray-600">
          Ringkasan agregat pemakaian air dan energi seluruh warga per periode.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="select-periode-analitik" className="text-sm font-medium">
          Periode:
        </label>
        <select
          id="select-periode-analitik"
          value={idPeriode}
          onChange={(e) => setIdPeriode(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          {daftarPeriode.map((p) => (
            <option key={p.idPeriode} value={p.idPeriode}>
              {p.bulan}/{p.tahun} ({p.statusFinal ? "FINAL" : "DRAFT"})
            </option>
          ))}
        </select>
      </div>

      {memuat && <p className="text-sm text-gray-500">Memuat analitik...</p>}

      {pesanGalat && (
        <div
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800"
        >
          {pesanGalat}
        </div>
      )}

      {analitik && !memuat && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Pemakaian Air Komunal</p>
              <p className="text-2xl font-bold">{analitik.totalAirM3} m³</p>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Pemakaian Energi Komunal</p>
              <p className="text-2xl font-bold">{analitik.totalEnergiKWh} kWh</p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold">Rincian Pekanan (M1 - M4)</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Pekan</th>
                  <th className="py-2">Volume Air (m³)</th>
                  <th className="py-2">Energi (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {analitik.rincianPekanan.map((pekan) => (
                  <tr key={pekan.label} className="border-b last:border-0">
                    <td className="py-2 font-medium">{pekan.label}</td>
                    <td className="py-2">{pekan.airM3} m³</td>
                    <td className="py-2">{pekan.energiKWh} kWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

