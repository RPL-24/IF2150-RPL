"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApiRespons, HasilStatus, StatusLaporan } from "@/contracts";
import { Alert, Button } from "@/components/ui";
import type { GalatTransisi } from "../internal/ModulLaporan";
import { statusBerikutnya } from "../internal/StatusLaporan";

const AKSI: Partial<Record<StatusLaporan, string>> = {
  MENUNGGU: "Mulai perbaikan",
  SEDANG_DIPERBAIKI: "Selesaikan perbaikan",
};

export default function UbahStatus({ idLaporan, status }: { idLaporan: string; status: StatusLaporan }) {
  const router = useRouter();
  const berikutnya = statusBerikutnya(status)[0];
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState<{ judul?: string; teks: string } | null>(null);

  if (!berikutnya) return <p>Tugas ini sudah selesai. Tidak ada status yang dapat diubah.</p>;

  async function ubah() {
    setMengirim(true);
    setGalat(null);
    try {
      const res = await fetch(`/api/laporan/tugas/${encodeURIComponent(idLaporan)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: berikutnya }),
      });
      const hasil = (await res.json()) as ApiRespons<HasilStatus> | GalatTransisi;
      if (hasil.ok) {
        router.refresh();
      } else if (hasil.kode === "KONFLIK" || "opsi" in hasil) {
        // Tombol hanya menawarkan langkah sah, jadi transisi ditolak berarti tampilan sudah usang.
        setGalat({ judul: "409 · Status telah berubah", teks: "Perubahan Anda tidak disimpan. Muat ulang dan tinjau status terbaru sebelum melanjutkan." });
      } else {
        setGalat({ teks: hasil.pesan });
      }
    } catch {
      setGalat({ teks: "Koneksi gagal. Perubahan Anda tidak disimpan." });
    } finally {
      setMengirim(false);
    }
  }

  return (
    <>
      {galat && (
        <Alert nada="bahaya">
          {galat.judul && (
            <>
              <strong>{galat.judul}</strong>
              <br />
            </>
          )}
          {galat.teks}
        </Alert>
      )}
      <div className="actions" style={{ marginTop: 16 }}>
        {galat?.judul ? (
          <Button varian="primary" onClick={() => router.refresh()}>
            Muat ulang status
          </Button>
        ) : (
          <Button varian="primary" onClick={ubah} disabled={mengirim}>
            {mengirim ? "Menyimpan..." : AKSI[status]}
          </Button>
        )}
      </div>
      <p style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
        {status} → {berikutnya}
      </p>
    </>
  );
}
