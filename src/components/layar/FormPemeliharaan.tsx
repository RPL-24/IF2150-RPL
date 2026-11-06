"use client";

import { useState, type FormEvent } from "react";
import type { ApiRespons, FormPemeliharaan as IsianForm, HasilPemeliharaan } from "@/contracts";
import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui";

type Pesan = { nada: "info" | "bahaya"; teks: string };

// Input datetime-local tidak membawa zona waktu; spesifikasi I-12-OBJ-03 memakai WIB.
const keWaktuWib = (lokal: string) => (lokal ? `${lokal}:00+07:00` : "");

export default function FormPemeliharaan({
  perangkat,
}: {
  perangkat: { idPerangkat: string; nama: string }[];
}) {
  const [idPerangkat, setIdPerangkat] = useState(perangkat[0].idPerangkat);
  const [waktu, setWaktu] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [catatanHasil, setCatatanHasil] = useState("");
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<Pesan | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  async function kirim(e: FormEvent) {
    e.preventDefault();
    setMenyimpan(true);
    setGalat({});
    setPesan(null);

    const isian: IsianForm = { idPerangkat, waktuPelaksanaan: keWaktuWib(waktu), tindakan, catatanHasil };
    try {
      const res = await fetch("/api/pemeliharaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isian),
      });
      const hasil = (await res.json()) as ApiRespons<HasilPemeliharaan>;
      if (hasil.ok) {
        setPesan({ nada: "info", teks: "Catatan pemeliharaan berhasil disimpan" });
        setWaktu("");
        setTindakan("");
        setCatatanHasil("");
      } else {
        setGalat(Object.fromEntries((hasil.galat ?? []).map((g) => [g.kolom, g.pesan])));
        setPesan({ nada: "bahaya", teks: hasil.pesan });
      }
    } catch {
      setPesan({ nada: "bahaya", teks: "Koneksi gagal. Isian Anda masih tersimpan di formulir." });
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <form onSubmit={kirim} noValidate>
      <Field label="Perangkat" galat={galat.idPerangkat}>
        {(p) => (
          <Select {...p} value={idPerangkat} onChange={(e) => setIdPerangkat(e.target.value)}>
            {perangkat.map((x) => (
              <option key={x.idPerangkat} value={x.idPerangkat}>
                {x.idPerangkat} · {x.nama}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Waktu pemeliharaan (WIB)" galat={galat.waktuPelaksanaan}>
        {(p) => <Input {...p} type="datetime-local" value={waktu} onChange={(e) => setWaktu(e.target.value)} />}
      </Field>
      <Field label="Tindakan" galat={galat.tindakan}>
        {(p) => <Input {...p} value={tindakan} onChange={(e) => setTindakan(e.target.value)} />}
      </Field>
      <Field label="Hasil pemeliharaan" galat={galat.catatanHasil}>
        {(p) => <Textarea {...p} value={catatanHasil} onChange={(e) => setCatatanHasil(e.target.value)} />}
      </Field>
      {pesan && <Alert nada={pesan.nada}>{pesan.teks}</Alert>}
      <div className="actions" style={{ marginTop: 18 }}>
        <Button type="submit" varian="primary" disabled={menyimpan}>
          {menyimpan ? "Menyimpan..." : "Simpan catatan"}
        </Button>
      </div>
    </form>
  );
}
