"use client";

import { useState } from "react";
import type { FormatEkspor, RekapitulasiDTO } from "@/contracts";
import { NAMA_KOMUNITAS } from "@/components/shell/menu";
import { Alert, Badge, Button, Card, EmptyState, Table } from "@/components/ui";
import { formatAngka, formatRupiah, labelPeriode } from "../internal/format";
import { kirimPeriode } from "./api";
import PilihPeriode, { useDaftarPeriode } from "./PilihPeriode";

const hanyaFinal = (p: { statusFinal: boolean }) => p.statusFinal;

type Pesan = { nada: "info" | "bahaya"; teks: string };

// I-15 (UC11): rekapitulasi periode final, ekspor PDF atau CSV, dan cetak.
export default function RekapIuran() {
  const daftar = useDaftarPeriode(hanyaFinal);
  const [idPeriode, setIdPeriode] = useState("");
  const [rekap, setRekap] = useState<RekapitulasiDTO | null>(null);
  const [pesan, setPesan] = useState<Pesan | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const periode = daftar.periode.find((p) => p.idPeriode === idPeriode);

  function ubahPeriode(id: string) {
    setIdPeriode(id);
    setRekap(null);
    setPesan(null);
  }

  async function buat() {
    if (!idPeriode || sibuk) return;
    setSibuk(true);
    setPesan(null);
    const res = await kirimPeriode<RekapitulasiDTO>("/api/iuran/rekapitulasi", idPeriode);
    setSibuk(false);
    if (res.ok) setRekap(res.data);
    else {
      setRekap(null);
      setPesan({ nada: "bahaya", teks: res.pesan });
    }
  }

  // Berkas diunduh lewat fetch agar kegagalan tampil sebagai pesan, bukan sebagai halaman JSON.
  async function unduh(format: FormatEkspor) {
    if (!rekap || sibuk) return;
    setSibuk(true);
    setPesan(null);
    try {
      const res = await fetch(`/api/iuran/rekapitulasi/ekspor?idPeriode=${encodeURIComponent(rekap.idPeriode)}&format=${format}&unduh=1`);
      if (!res.ok) {
        const galat = (await res.json().catch(() => null)) as { pesan?: string } | null;
        setPesan({ nada: "bahaya", teks: galat?.pesan ?? `Ekspor ${format} gagal.` });
        return;
      }
      const nama = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? `rekap-iuran.${format.toLowerCase()}`;
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = nama;
      a.click();
      URL.revokeObjectURL(url);
      setPesan({ nada: "info", teks: `Berkas ${nama} diunduh.` });
    } catch {
      setPesan({ nada: "bahaya", teks: `Ekspor ${format} gagal. Koneksi terputus.` });
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 820 }}>
      {pesan && <Alert nada={pesan.nada}>{pesan.teks}</Alert>}
      {daftar.status === "galat" && <Alert nada="bahaya">Daftar periode gagal dimuat. Muat ulang halaman ini.</Alert>}
      {daftar.status === "siap" && daftar.periode.length === 0 && (
        <EmptyState>Belum ada periode final. Rekapitulasi tersedia setelah iuran ditetapkan final.</EmptyState>
      )}

      {daftar.periode.length > 0 && (
        <Card>
          <PilihPeriode periode={daftar.periode} nilai={idPeriode} onUbah={ubahPeriode} />
          <Button varian="primary" onClick={buat} disabled={!idPeriode || sibuk}>
            Buat rekapitulasi
          </Button>
        </Card>
      )}

      {rekap && periode && (
        <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h2>Rekap iuran komunitas</h2>
                <p style={{ color: "var(--muted)" }}>
                  {NAMA_KOMUNITAS} · {labelPeriode(periode)}
                </p>
              </div>
              <Badge>FINAL</Badge>
            </div>
            <Table style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th scope="col">Warga</th>
                  <th scope="col" style={{ textAlign: "right" }}>Air (m³)</th>
                  <th scope="col" style={{ textAlign: "right" }}>Energi (kWh)</th>
                  <th scope="col" style={{ textAlign: "right" }}>Iuran</th>
                </tr>
              </thead>
              <tbody>
                {rekap.baris.map((b) => (
                  <tr key={b.idWarga}>
                    <th scope="row">{b.namaWarga}</th>
                    <td style={{ textAlign: "right" }}>{formatAngka(b.volumeAirM3)}</td>
                    <td style={{ textAlign: "right" }}>{formatAngka(b.energiKWh)}</td>
                    <td style={{ textAlign: "right" }}>{formatRupiah(b.jumlahIuran)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Total</th>
                  <td style={{ textAlign: "right", fontWeight: 800 }}>{formatAngka(rekap.totalPemakaianAir)}</td>
                  <td style={{ textAlign: "right", fontWeight: 800 }}>{formatAngka(rekap.totalPemakaianEnergi)}</td>
                  <td style={{ textAlign: "right", fontWeight: 800 }}>{formatRupiah(rekap.totalIuran)}</td>
                </tr>
              </tbody>
            </Table>
          </Card>
          <Card>
            <p style={{ marginBottom: 14 }}>
              <strong>Dokumen siap ditinjau.</strong> Rekap periode FINAL untuk {rekap.baris.length} warga.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button onClick={() => unduh("PDF")} disabled={sibuk}>PDF</Button>
              <Button onClick={() => unduh("CSV")} disabled={sibuk}>CSV</Button>
              <Button onClick={() => window.print()}>Cetak</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
