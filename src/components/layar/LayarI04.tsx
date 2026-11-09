"use client";

import React, { useEffect, useState } from "react";
import type { ApiRespons, PeriodeDTO, TagihanDTO } from "@/contracts";

export default function LayarI04() {
  const [daftarPeriode, setDaftarPeriode] = useState<PeriodeDTO[]>([]);
  const [idPeriode, setIdPeriode] = useState<string>("");
  const [tagihan, setTagihan] = useState<TagihanDTO | null>(null);
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
      })
      .catch(() => setPesanGalat("Gagal memuat daftar periode."));
  }, []);

  useEffect(() => {
    if (!idPeriode) return;
    setMemuat(true);
    setPesanGalat(null);
    setTagihan(null);

    fetch(`/api/iuran/tagihan?idPeriode=${encodeURIComponent(idPeriode)}`)
      .then((r) => r.json())
      .then((res: ApiRespons<TagihanDTO>) => {
        if (res.ok) {
          setTagihan(res.data);
        } else {
          setPesanGalat(res.pesan);
        }
      })
      .catch(() => setPesanGalat("Gagal memuat tagihan."))
      .finally(() => setMemuat(false));
  }, [idPeriode]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Tagihan Iuran Final (UC02)</h1>
        <p className="text-sm text-gray-600">
          Menampilkan rincian tagihan air dan energi periode yang telah difinalisasi.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="select-periode-warga" className="text-sm font-medium">
          Pilih Periode:
        </label>
        <select
          id="select-periode-warga"
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

      {memuat && <p className="text-sm text-gray-500">Memuat data tagihan...</p>}

      {pesanGalat && !memuat && (
        <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {pesanGalat}
        </div>
      )}

      {tagihan && !memuat && (
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="text-xs text-gray-500">ID Tagihan: {tagihan.idTagihan}</p>
              <h2 className="text-lg font-semibold">Periode {tagihan.idPeriode}</h2>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              {tagihan.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded border p-3">
              <p className="text-gray-500">Pemakaian Air</p>
              <p className="text-base font-semibold">{tagihan.rincian.volumeAirM3} m³</p>
              <p className="text-xs text-gray-600">
                Subtotal: Rp {tagihan.rincian.subtotalAir.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded border p-3">
              <p className="text-gray-500">Pemakaian Energi</p>
              <p className="text-base font-semibold">{tagihan.rincian.energiKWh} kWh</p>
              <p className="text-xs text-gray-600">
                Subtotal: Rp {tagihan.rincian.subtotalEnergi.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="border-t pt-3 flex items-center justify-between text-sm">
            <span>Biaya Tetap Operasional</span>
            <span>Rp {tagihan.rincian.biayaTetap.toLocaleString("id-ID")}</span>
          </div>

          <div className="border-t pt-3 flex items-center justify-between text-lg font-bold">
            <span>Total Tagihan Iuran</span>
            <span>Rp {tagihan.jumlahIuran.toLocaleString("id-ID")}</span>
          </div>
        </div>
      )}
    </div>
  );
}