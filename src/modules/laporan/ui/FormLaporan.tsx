"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { ApiRespons, FormLaporan as IsianForm, HasilLaporan } from "@/contracts";
import { Alert, Badge, Button, Card, Field, Select, Textarea } from "@/components/ui";
import { JENIS_GANGGUAN } from "../internal/validasi";

export default function FormLaporan() {
  const [jenis, setJenis] = useState<string>(JENIS_GANGGUAN[0]);
  const [deskripsi, setDeskripsi] = useState("");
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [berhasil, setBerhasil] = useState<{ id: string; jenis: string } | null>(null);

  async function kirim(e: FormEvent) {
    e.preventDefault();
    if (mengirim) return;
    setMengirim(true);
    setGalat({});
    setPesan(null);

    const isian: IsianForm = { jenisGangguan: jenis, deskripsi, fotoPendukung: [] };
    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isian),
      });
      const hasil = (await res.json()) as ApiRespons<HasilLaporan>;
      if (hasil.ok) {
        setBerhasil({ id: hasil.data.idLaporan, jenis });
        setDeskripsi("");
      } else {
        setGalat(Object.fromEntries((hasil.galat ?? []).map((g) => [g.kolom, g.pesan])));
        setPesan(hasil.pesan);
      }
    } catch {
      setPesan("Koneksi gagal. Isian Anda masih tersimpan di formulir.");
    } finally {
      setMengirim(false);
    }
  }

  if (berhasil) {
    return (
      <Card>
        <p style={{ fontSize: 32, color: "var(--teal)", lineHeight: 1 }} aria-hidden="true">
          ✓
        </p>
        <p style={{ margin: "12px 0" }}>
          <Badge nada="netral">Berhasil</Badge>
        </p>
        <h2 style={{ fontSize: 32 }} role="status">
          Laporan berhasil dikirim
        </h2>
        <p style={{ margin: "12px 0 20px", color: "var(--muted)" }}>
          {berhasil.id} · {berhasil.jenis}. Status awal MENUNGGU. Ikuti perkembangannya di Laporan saya.
        </p>
        <div className="actions">
          <Link className="btn primary" href={`/dashboard/warga/laporan/${berhasil.id}`}>
            Lihat perkembangan
          </Link>
          <Link className="btn" href="/dashboard/warga/laporan">
            Laporan saya
          </Link>
          <Button onClick={() => setBerhasil(null)}>Buat laporan lain</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 style={{ marginBottom: 20 }}>Informasi gangguan</h2>
      <form onSubmit={kirim} noValidate>
        <Field label="Jenis gangguan *" galat={galat.jenisGangguan}>
          {(p) => (
            <Select {...p} value={jenis} onChange={(e) => setJenis(e.target.value)}>
              {JENIS_GANGGUAN.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Deskripsi *" galat={galat.deskripsi}>
          {(p) => <Textarea {...p} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} maxLength={1000} />}
        </Field>
        <p style={{ margin: "-6px 0 18px", fontSize: 13, color: "var(--muted)" }}>
          Foto pendukung belum bisa dilampirkan.
        </p>
        {pesan && <Alert nada="bahaya">{pesan}</Alert>}
        <div className="actions" style={{ marginTop: 18 }}>
          <Button type="submit" varian="primary" disabled={mengirim}>
            {mengirim ? "Mengirim..." : "Kirim laporan"}
          </Button>
          <Link className="btn" href="/dashboard/warga/laporan">
            Batal
          </Link>
        </div>
      </form>
    </Card>
  );
}
