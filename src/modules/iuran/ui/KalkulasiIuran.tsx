"use client";

import { useState } from "react";
import type { PeriodeDTO, PratinjauIuran } from "@/contracts";
import { Alert, Badge, Button, Card, EmptyState, Table } from "@/components/ui";
import { formatAngka, formatRupiah, labelPeriode } from "../internal/format";
import { kirimPeriode } from "./api";
import PilihPeriode, { useDaftarPeriode } from "./PilihPeriode";

const belumFinal = (p: PeriodeDTO) => !p.statusFinal;
const LANGKAH = ["Hitung", "Tinjau", "Tetapkan final"];

type Pesan = { nada: "info" | "bahaya"; teks: string };

// I-14 (UC10): hitung pratinjau, tinjau, lalu tetapkan final. Pratinjau tidak menyimpan apa pun.
export default function KalkulasiIuran() {
  const daftar = useDaftarPeriode(belumFinal);
  const [idPeriode, setIdPeriode] = useState("");
  const [pratinjau, setPratinjau] = useState<PratinjauIuran | null>(null);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [pesan, setPesan] = useState<Pesan | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const langkah = pratinjau ? (konfirmasi ? 3 : 2) : 1;

  function ubahPeriode(id: string) {
    setIdPeriode(id);
    setPratinjau(null);
    setKonfirmasi(false);
    setPesan(null);
  }

  async function hitung() {
    if (!idPeriode || sibuk) return;
    setSibuk(true);
    setPesan(null);
    setPratinjau(null);
    setKonfirmasi(false);
    const res = await kirimPeriode<PratinjauIuran>("/api/iuran/pratinjau", idPeriode);
    setSibuk(false);
    if (res.ok) setPratinjau(res.data);
    else setPesan({ nada: "bahaya", teks: res.pesan });
  }

  async function tetapkan() {
    if (!pratinjau || sibuk) return;
    setSibuk(true);
    const res = await kirimPeriode<PeriodeDTO>("/api/iuran/finalisasi", pratinjau.periode.idPeriode);
    setSibuk(false);
    setKonfirmasi(false);
    if (res.ok) {
      setPesan({ nada: "info", teks: `Iuran ${labelPeriode(res.data)} telah ditetapkan FINAL. Warga kini dapat melihat tagihannya.` });
      setPratinjau(null);
      setIdPeriode("");
      daftar.muatUlang();
    } else {
      setPesan({ nada: "bahaya", teks: res.pesan });
    }
  }

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 820 }}>
      <ol aria-label="Tahapan" style={{ display: "flex", gap: 8, flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {LANGKAH.map((nama, i) => (
          <li key={nama} aria-current={langkah === i + 1 ? "step" : undefined}>
            <Badge nada={langkah === i + 1 ? "ok" : "netral"}>
              {i + 1}. {nama}
            </Badge>
          </li>
        ))}
      </ol>

      {pesan && <Alert nada={pesan.nada}>{pesan.teks}</Alert>}
      {daftar.status === "galat" && <Alert nada="bahaya">Daftar periode gagal dimuat. Muat ulang halaman ini.</Alert>}
      {daftar.status === "siap" && daftar.periode.length === 0 && <EmptyState>Semua periode sudah final.</EmptyState>}

      {daftar.periode.length > 0 && (
        <Card>
          <PilihPeriode periode={daftar.periode} nilai={idPeriode} onUbah={ubahPeriode} />
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Satu tarif periode dipakai untuk seluruh warga. Tarif ditentukan di data periode dan tidak diubah dari layar ini.
          </p>
          <Button varian="primary" onClick={hitung} disabled={!idPeriode || sibuk}>
            {sibuk && !pratinjau ? "Menghitung…" : "Hitung pratinjau"}
          </Button>
        </Card>
      )}

      {pratinjau && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2>Pratinjau iuran {labelPeriode(pratinjau.periode)}</h2>
            <Badge nada="peringatan">DRAFT</Badge>
          </div>
          <p style={{ margin: "8px 0 16px", color: "var(--muted)" }}>
            Tarif: air {formatRupiah(pratinjau.tarif.tarifAirPerM3)}/m³, energi {formatRupiah(pratinjau.tarif.tarifEnergiPerKWh)}/kWh, biaya tetap{" "}
            {formatRupiah(pratinjau.tarif.biayaTetap)}. Hasil ini belum dapat dilihat warga.
          </p>
          <Table>
            <thead>
              <tr>
                <th scope="col">Warga</th>
                <th scope="col" style={{ textAlign: "right" }}>Air (m³)</th>
                <th scope="col" style={{ textAlign: "right" }}>Energi (kWh)</th>
                <th scope="col" style={{ textAlign: "right" }}>Iuran</th>
              </tr>
            </thead>
            <tbody>
              {pratinjau.tagihan.map((t) => (
                <tr key={t.idWarga}>
                  <th scope="row">{t.namaWarga ?? `Warga #${t.idWarga}`}</th>
                  <td style={{ textAlign: "right" }}>{formatAngka(t.rincian.volumeAirM3)}</td>
                  <td style={{ textAlign: "right" }}>{formatAngka(t.rincian.energiKWh)}</td>
                  <td style={{ textAlign: "right" }}>{formatRupiah(t.jumlahIuran)}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Total ({pratinjau.tagihan.length} warga)</th>
                <td />
                <td />
                <td style={{ textAlign: "right", fontWeight: 800 }}>{formatRupiah(pratinjau.totalIuran)}</td>
              </tr>
            </tbody>
          </Table>

          {!konfirmasi && (
            <div style={{ marginTop: 18 }}>
              <Button varian="primary" onClick={() => setKonfirmasi(true)}>
                Tinjau & finalisasi
              </Button>
            </div>
          )}

          {konfirmasi && (
            <div role="alertdialog" aria-labelledby="judul-konfirmasi" className="note" style={{ marginTop: 18 }}>
              <h3 id="judul-konfirmasi" style={{ fontSize: 17, marginBottom: 6 }}>
                Tetapkan iuran {labelPeriode(pratinjau.periode)} sebagai FINAL?
              </h3>
              <p>
                {pratinjau.tagihan.length} tagihan dengan total {formatRupiah(pratinjau.totalIuran)} akan ditetapkan dan langsung tampil ke warga. Setelah final,
                tagihan tidak dapat dihitung ulang dari layar ini.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <Button varian="primary" onClick={tetapkan} disabled={sibuk}>
                  {sibuk ? "Menyimpan…" : "Tetapkan Final"}
                </Button>
                <Button onClick={() => setKonfirmasi(false)} disabled={sibuk}>
                  Batal
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
