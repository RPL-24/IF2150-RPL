"use client";

import { useState } from "react";
import type { RingkasanPemakaian } from "@/contracts";
import { Alert, Card, EmptyState, Table } from "@/components/ui";
import { formatAngka } from "../internal/format";
import { ambilDenganPeriode } from "./api";
import PilihPeriode, { useDaftarPeriode } from "./PilihPeriode";

const semua = () => true;

// I-13 (UC09): total pemakaian komunal dan rinciannya per pekan.
export default function AnalitikKomunal() {
  const daftar = useDaftarPeriode(semua);
  const [idPeriode, setIdPeriode] = useState("");
  const [data, setData] = useState<RingkasanPemakaian | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);

  async function pilih(id: string) {
    setIdPeriode(id);
    setData(null);
    setGalat(null);
    if (!id) return;
    setMemuat(true);
    const res = await ambilDenganPeriode<RingkasanPemakaian>("/api/iuran/analitik", id);
    setMemuat(false);
    if (res.ok) setData(res.data);
    else setGalat(res.pesan);
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {daftar.status === "galat" && <Alert nada="bahaya">Daftar periode gagal dimuat. Muat ulang halaman ini.</Alert>}
      {daftar.status === "siap" && daftar.periode.length === 0 && <EmptyState>Belum ada periode.</EmptyState>}
      {daftar.periode.length > 0 && (
        <Card style={{ maxWidth: 420 }}>
          <PilihPeriode periode={daftar.periode} nilai={idPeriode} onUbah={pilih} />
        </Card>
      )}
      {memuat && <p role="status">Memuat analitik…</p>}
      {galat && <Alert nada="bahaya">{galat}</Alert>}
      {data && <Hasil data={data} />}
    </div>
  );
}

function Hasil({ data }: { data: RingkasanPemakaian }) {
  const kosong = data.totalAirM3 === 0 && data.totalEnergiKWh === 0;
  if (kosong) return <EmptyState>Belum ada data pemakaian pada periode ini.</EmptyState>;
  return (
    <>
      <p className="note">4 pekan pengamatan. Data simulasi komunal, bukan aliran sensor kontinu.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 20 }}>
        <Grafik judul="Pemakaian air komunal" total={data.totalAirM3} satuan="m³" titik={data.rincianPekanan.map((t) => [t.label, t.airM3])} warna="var(--brand)" />
        <Grafik judul="Energi komunal" total={data.totalEnergiKWh} satuan="kWh" titik={data.rincianPekanan.map((t) => [t.label, t.energiKWh])} warna="var(--focus)" />
      </div>
      <Card>
        <h2 style={{ marginBottom: 12 }}>Angka di balik grafik</h2>
        <Table>
          <thead>
            <tr>
              <th scope="col">Pekan</th>
              <th scope="col" style={{ textAlign: "right" }}>Air (m³)</th>
              <th scope="col" style={{ textAlign: "right" }}>Energi (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.rincianPekanan.map((t) => (
              <tr key={t.label}>
                <th scope="row">{t.label}</th>
                <td style={{ textAlign: "right" }}>{formatAngka(t.airM3)}</td>
                <td style={{ textAlign: "right" }}>{formatAngka(t.energiKWh)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <small style={{ display: "block", marginTop: 12 }}>
          Sumber: data pemakaian warga yang tercatat pada periode ini. Kilowatt-jam (energi) berbeda dari watt (daya sesaat) pada layar panel.
        </small>
      </Card>
    </>
  );
}

// Diagram batang CSS. Nilainya diulang di tabel, jadi diagram disembunyikan dari pembaca layar.
function Grafik({ judul, total, satuan, titik, warna }: { judul: string; total: number; satuan: string; titik: [string, number][]; warna: string }) {
  const maks = Math.max(...titik.map(([, v]) => v), 1);
  return (
    <Card>
      <p style={{ color: "var(--muted)", fontWeight: 700 }}>{judul}</p>
      <p style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: "4px 0 16px" }}>
        {formatAngka(total)} <span style={{ fontSize: 18 }}>{satuan}</span>
      </p>
      <div aria-hidden="true" style={{ display: "grid", gap: 8 }}>
        {titik.map(([label, nilai]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "32px 1fr 52px", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span>{label}</span>
            <span style={{ background: "var(--light)", borderRadius: 3, height: 18, display: "block" }}>
              <span style={{ display: "block", height: "100%", width: `${(nilai / maks) * 100}%`, background: warna, borderRadius: 3 }} />
            </span>
            <span style={{ textAlign: "right" }}>{formatAngka(nilai)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
