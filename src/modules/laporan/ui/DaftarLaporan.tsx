"use client";

import Link from "next/link";
import { useState } from "react";
import type { StatusLaporan } from "@/contracts";
import { Card, EmptyState, Field, Input, Select, Table } from "@/components/ui";
import { URUTAN_STATUS } from "../internal/StatusLaporan";
import { waktuWib } from "./format";
import StatusBadge from "./StatusBadge";

export interface BarisLaporan {
  id: string;
  judul: string;
  keterangan: string;
  status: StatusLaporan;
  waktu: string;
  href: string;
}

// Daftar dengan pencarian dan filter status di sisi klien; datanya sudah dibatasi server.
export default function DaftarLaporan({
  judulPanel,
  baris,
  labelAksi,
  satuan,
  kosong,
}: {
  judulPanel: string;
  baris: BarisLaporan[];
  labelAksi: string;
  satuan: "laporan" | "tugas";
  kosong: string;
}) {
  const [cari, setCari] = useState("");
  const [status, setStatus] = useState<"" | StatusLaporan>("");

  const tampil = baris.filter(
    (b) =>
      (!status || b.status === status) &&
      `${b.judul} ${b.id} ${b.keterangan}`.toLowerCase().includes(cari.trim().toLowerCase()),
  );

  return (
    <>
      <div className="filter">
        <Field label="Cari laporan">{(p) => <Input {...p} value={cari} onChange={(e) => setCari(e.target.value)} />}</Field>
        <Field label="Status">
          {(p) => (
            <Select {...p} value={status} onChange={(e) => setStatus(e.target.value as "" | StatusLaporan)}>
              <option value="">Semua status</option>
              {URUTAN_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Card>
        <h2 style={{ marginBottom: 20 }}>
          {judulPanel} · {tampil.length} {satuan}
          {tampil.length !== baris.length && ` dari ${baris.length}`}
        </h2>
        {tampil.length === 0 ? (
          <EmptyState>{baris.length === 0 ? kosong : "Tidak ada yang cocok dengan pencarian."}</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Laporan</th>
                <th>Status</th>
                <th>Diajukan</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((b) => (
                <tr key={b.id}>
                  <td data-label="Laporan">
                    <strong>{b.judul}</strong>
                    <br />
                    <small>
                      {b.id}
                      {b.keterangan && ` · ${b.keterangan}`}
                    </small>
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={b.status} />
                  </td>
                  <td data-label="Diajukan">{waktuWib(b.waktu)}</td>
                  <td data-label="Tindakan">
                    <Link className="btn" href={b.href}>
                      {labelAksi}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
