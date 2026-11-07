"use client";

// Ikon lonceng + badge jumlah belum dibaca + daftar notifikasi (DPPL I02-02). Dipasang di header root layout.
// Dropdown memakai Popover API bawaan browser (tutup otomatis saat klik di luar / tombol Esc).

import { useRouter } from "next/navigation";
import { useId, useRef } from "react";
import { formatWaktu } from "@/lib/format";
import type { Enums } from "@/types/database";
import { useNotifikasi } from "./useNotifikasi";

type Props = { userId: string; role: Enums<"peran_user"> };

export function LoncengNotifikasi({ userId, role }: Props) {
  const { daftar, belumDibaca, error, tandaiDibaca } = useNotifikasi(userId);
  const router = useRouter();
  const popover = useRef<HTMLDivElement>(null);
  const id = useId();

  function pilih(n: (typeof daftar)[number]) {
    if (!n.status_baca) void tandaiDibaca(n.id_notifikasi);
    // Warga: buka detail tiket di I-02 (StatusLaporanPage membaca ?tiket=).
    if (role === "warga" && n.id_tiket) {
      popover.current?.hidePopover();
      router.push(`/status?tiket=${encodeURIComponent(n.id_tiket)}`);
    }
  }

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={belumDibaca > 0 ? `Notifikasi, ${belumDibaca} belum dibaca` : "Notifikasi"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {belumDibaca > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs leading-5 text-white">
            {belumDibaca > 99 ? "99+" : belumDibaca}
          </span>
        )}
      </button>

      <div
        ref={popover}
        id={id}
        popover="auto"
        className="fixed inset-auto top-12 right-2 m-0 max-h-[70vh] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto rounded-md border border-gray-200 bg-white p-0 text-sm text-gray-900 shadow-lg"
      >
        <p className="border-b border-gray-200 px-3 py-2 font-medium">Notifikasi</p>
        {error && (
          <p role="alert" className="px-3 py-2 text-red-600">
            {error}
          </p>
        )}
        {daftar.length === 0 ? (
          <p className="px-3 py-4 text-center text-gray-500">Belum ada notifikasi.</p>
        ) : (
          <ul>
            {daftar.map((n) => (
              <li key={n.id_notifikasi}>
                <button
                  type="button"
                  onClick={() => pilih(n)}
                  className={`block w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50 ${
                    n.status_baca ? "text-gray-600" : "bg-blue-50 font-medium"
                  }`}
                >
                  <span className="block">{n.isi_pesan}</span>
                  <span className="block text-xs font-normal text-gray-500">{formatWaktu(n.waktu_kirim)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
