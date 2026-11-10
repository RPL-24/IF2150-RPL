import React from "react";
import Link from "next/link";
import { StatusBadge } from "@/client/components/shared/StatusBadge";
import { KATEGORI } from "@/lib/constants";
import type { ItemPeta } from "@/server/controllers/StatusController";
import type { Enums } from "@/types/database";

type Props = {
  laporan: ItemPeta;
  peran?: Enums<"peran_user"> | null;
  memuatDukungan?: boolean;
  sudahDidukung?: ItemPeta["sudahDidukung"];
  pesanDukungan?: string;
  gagalDukungan?: boolean;
  onDukung?: () => void;
};

/** I02-13..14: ringkasan anonim dan aksi dukungan untuk tiket terpilih. */
export function KartuLaporanPublik({
  laporan, peran = null, memuatDukungan = false, sudahDidukung = laporan.sudahDidukung,
  pesanDukungan, gagalDukungan = false, onDukung,
}: Props): React.ReactElement {
  const aktif = laporan.status === "diterima" || laporan.status === "dikerjakan";
  const statusBelumDiketahui = peran === "warga" && sudahDidukung == null;
  const kelasTombol = "mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600";
  return (
    <article aria-label={`Ringkasan laporan ${laporan.id_tiket}`} className="rounded-2xl bg-white p-4 text-gray-900 shadow-lg sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-gray-600">{laporan.id_tiket}</p>
          <h3 className="text-base leading-snug font-semibold">{KATEGORI[laporan.kategori]}</h3>
        </div>
        <StatusBadge status={laporan.status} />
      </div>
      <p className="mt-4 text-sm text-gray-600">{laporan.jumlah_upvote} dukungan</p>
      {!aktif ? (
        <button type="button" disabled className={kelasTombol}>Laporan sudah selesai</button>
      ) : peran === null ? (
        <Link href="/login?next=%2Fstatus" className={kelasTombol}>Masuk untuk mendukung</Link>
      ) : (
        <>
          <button
            type="button"
            disabled={peran !== "warga" || memuatDukungan || sudahDidukung === true || statusBelumDiketahui || !onDukung}
            aria-busy={memuatDukungan}
            onClick={onDukung}
            className={kelasTombol}
          >
            {memuatDukungan ? "Memproses…" : `${sudahDidukung ? "Didukung" : "Dukung"} (${laporan.jumlah_upvote})`}
          </button>
          {peran !== "warga" && <p className="mt-2 text-sm text-gray-600">Dukungan hanya tersedia untuk akun warga.</p>}
          {statusBelumDiketahui && <p className="mt-2 text-sm text-gray-600">Status dukungan belum tersedia. Muat ulang Peta.</p>}
        </>
      )}
      {pesanDukungan && (
        <p role={gagalDukungan ? "alert" : "status"} className={`mt-2 text-sm ${gagalDukungan ? "text-red-700" : "text-green-700"}`}>
          {pesanDukungan}
        </p>
      )}
    </article>
  );
}
