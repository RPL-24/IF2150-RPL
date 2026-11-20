import React from "react";
import { formatWaktu } from "@/lib/format";
import { urlMedia } from "@/server/entities/Foto";
import type { BuktiHasilPerbaikan } from "@/server/controllers/StatusController";
import type { Enums } from "@/types/database";

type Props = {
  status: Enums<"status_laporan">;
  bukti: BuktiHasilPerbaikan | null | undefined;
};

/** Bagian KF19. Rincian laporan awal dan linimasa tetap memakai DetailLaporan shared. */
export function BuktiPerbaikan({ status, bukti }: Props): React.ReactElement | null {
  if (status !== "berhasil") return null;

  return (
    <section aria-label="Hasil perbaikan" className="space-y-3 rounded-md border border-green-200 p-4">
      <h3 className="font-semibold">Hasil perbaikan</h3>
      {bukti === undefined ? (
        <p className="text-sm text-gray-600">Bukti hasil perbaikan belum dapat ditampilkan.</p>
      ) : bukti === null ? (
        <p className="text-sm text-gray-600">Belum ada bukti hasil perbaikan untuk laporan ini.</p>
      ) : (
        <>
          <p className="text-xs text-gray-500">
            Diunggah <time dateTime={bukti.waktu_unggah}>{formatWaktu(bukti.waktu_unggah)}</time>
          </p>
          <p className="text-sm whitespace-pre-line">{bukti.catatan}</p>
          {bukti.foto.length === 0 ? (
            <p className="text-sm text-gray-600">Belum ada foto hasil perbaikan untuk laporan ini.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {bukti.foto.map((foto, index) => (
                <a key={foto.path} href={urlMedia(foto.path)} target="_blank" rel="noopener noreferrer" title="Perbesar foto hasil perbaikan">
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL publik Storage, sama seperti DetailLaporan shared */}
                  <img
                    src={urlMedia(foto.path)}
                    alt={`Foto hasil perbaikan ${index + 1}`}
                    loading="lazy"
                    className="aspect-square w-full rounded object-cover"
                  />
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
