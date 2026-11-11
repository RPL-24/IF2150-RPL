"use client";

import { useState } from "react";
import type { TagihanDTO } from "@/contracts";
import { Alert, Badge, Card, EmptyState, Table } from "@/components/ui";
import { formatAngka, formatRupiah, labelPeriode } from "../internal/format";
import { ambilDenganPeriode } from "./api";
import PilihPeriode, { useDaftarPeriode } from "./PilihPeriode";

const hanyaFinal = (p: { statusFinal: boolean }) => p.statusFinal;

type Hasil = { jenis: "kosong" } | { jenis: "tagihan"; data: TagihanDTO } | { jenis: "galat"; pesan: string };

// I-04 (UC02): tagihan final milik warga yang sedang masuk. Server mengambil idWarga dari sesi.
export default function TagihanWarga() {
  const daftar = useDaftarPeriode(hanyaFinal);
  const [idPeriode, setIdPeriode] = useState("");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [memuat, setMemuat] = useState(false);

  async function pilih(id: string) {
    setIdPeriode(id);
    setHasil(null);
    if (!id) return;
    setMemuat(true);
    const res = await ambilDenganPeriode<TagihanDTO>("/api/iuran/tagihan", id);
    setMemuat(false);
    if (res.ok) setHasil({ jenis: "tagihan", data: res.data });
    else if (res.kode === "TIDAK_DITEMUKAN") setHasil({ jenis: "kosong" });
    else setHasil({ jenis: "galat", pesan: res.pesan });
  }

  const periode = daftar.periode.find((p) => p.idPeriode === idPeriode);

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 720 }}>
      {daftar.status === "galat" && (
        <Alert nada="bahaya">
          Daftar periode gagal dimuat.{" "}
          <button className="btn link" onClick={daftar.muatUlang}>
            Coba lagi
          </button>
        </Alert>
      )}
      {daftar.status === "siap" && daftar.periode.length === 0 && (
        <EmptyState>Belum ada tagihan final yang diterbitkan.</EmptyState>
      )}
      {daftar.periode.length > 0 && (
        <Card>
          <PilihPeriode periode={daftar.periode} nilai={idPeriode} onUbah={pilih} />
        </Card>
      )}

      {memuat && <p role="status">Memuat tagihan…</p>}
      {hasil?.jenis === "kosong" && <EmptyState>Tagihan untuk periode ini belum tersedia.</EmptyState>}
      {hasil?.jenis === "galat" && <Alert nada="bahaya">{hasil.pesan}</Alert>}

      {hasil?.jenis === "tagihan" && periode && <RincianTagihan tagihan={hasil.data} namaPeriode={labelPeriode(periode)} />}
    </div>
  );
}

function RincianTagihan({ tagihan, namaPeriode }: { tagihan: TagihanDTO; namaPeriode: string }) {
  const r = tagihan.rincian;
  const baris: [string, number][] = [];
  if (r.subtotalAir > 0 || r.volumeAirM3 > 0) baris.push([`Pemakaian air (${formatAngka(r.volumeAirM3)} m³)`, r.subtotalAir]);
  if (r.subtotalEnergi > 0 || r.energiKWh > 0) baris.push([`Pemakaian energi (${formatAngka(r.energiKWh)} kWh)`, r.subtotalEnergi]);
  if (r.biayaTetap > 0) baris.push(["Biaya tetap", r.biayaTetap]);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2>Tagihan {namaPeriode}</h2>
        <Badge>FINAL</Badge>
      </div>
      <Table style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th scope="col">Komponen</th>
            <th scope="col" style={{ textAlign: "right" }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {baris.map(([nama, jumlah]) => (
            <tr key={nama}>
              <td>{nama}</td>
              <td style={{ textAlign: "right" }}>{formatRupiah(jumlah)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Total iuran</th>
            <td style={{ textAlign: "right", fontWeight: 800 }}>{formatRupiah(tagihan.jumlahIuran)}</td>
          </tr>
        </tbody>
      </Table>
      <p style={{ marginTop: 14, color: "var(--muted)" }}>Iuran dibayarkan di luar aplikasi; halaman ini hanya menampilkan tagihan.</p>
    </Card>
  );
}
