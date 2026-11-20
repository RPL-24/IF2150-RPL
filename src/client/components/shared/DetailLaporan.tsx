// Panel rincian laporan (DPPL I02-07..09, I03-08..11, I05-06..08). Server/Client Component.
// Tombol aksi milik fitur (Validasi/Tolak, Dukung, Laporkan Hasil, ...) dimasukkan lewat children.
import { KATEGORI } from "@/lib/constants";
import { formatWaktu } from "@/lib/format";
import { urlMedia } from "@/server/entities/Foto";
import type { Enums } from "@/types/database";
import { StatusBadge } from "./StatusBadge";

type Media = { path: string };

export type DataDetailLaporan = {
  id_tiket: string;
  kategori: Enums<"kategori_kerusakan">;
  deskripsi: string;
  waktu_masuk: string;
  status: Enums<"status_laporan">;
  tahap?: Enums<"tahap_penanganan"> | null;
  alasan_penolakan?: string | null;
  foto?: Media[];
  video?: Media[];
};

export type RiwayatStatus = {
  status: Enums<"status_laporan">;
  tahap: Enums<"tahap_penanganan"> | null;
  catatan: string | null;
  waktu: string;
};

type Props = {
  laporan: DataDetailLaporan;
  /** Linimasa I02-08 (urut lama → baru). Tidak ditampilkan bila tidak diberikan. */
  riwayat?: RiwayatStatus[];
  /** Slot tombol aksi milik fitur. */
  children?: React.ReactNode;
};

export function DetailLaporan({ laporan, riwayat, children }: Props) {
  const { foto = [], video = [] } = laporan;
  return (
    <section className="space-y-4 rounded-md border border-gray-200 p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">
            {laporan.id_tiket} · {KATEGORI[laporan.kategori]}
          </h2>
          <p className="text-xs text-gray-500">Masuk {formatWaktu(laporan.waktu_masuk)}</p>
        </div>
        <StatusBadge status={laporan.status} tahap={laporan.tahap} />
      </header>

      {(foto.length > 0 || video.length > 0) && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {foto.map((f) => (
            <a key={f.path} href={urlMedia(f.path)} target="_blank" rel="noopener noreferrer" title="Perbesar foto">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL publik Supabase Storage, tanpa optimasi */}
              <img src={urlMedia(f.path)} alt="Foto laporan" loading="lazy" className="aspect-square w-full rounded object-cover" />
            </a>
          ))}
          {video.map((v) => (
            <video key={v.path} src={urlMedia(v.path)} controls preload="metadata" playsInline className="aspect-square w-full rounded bg-black" />
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium">Deskripsi</h3>
        <p className="text-sm whitespace-pre-line">{laporan.deskripsi}</p>
      </div>

      {laporan.status === "ditolak" && laporan.alasan_penolakan && (
        <div role="note" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          <p className="font-medium text-red-800">Alasan penolakan</p>
          <p className="text-red-700">{laporan.alasan_penolakan}</p>
        </div>
      )}

      {riwayat && riwayat.length > 0 && (
        <ol className="space-y-2 border-l-2 border-gray-200 pl-4">
          {riwayat.map((r) => (
            <li key={`${r.waktu}-${r.status}-${r.tahap}`} className="text-sm">
              <StatusBadge status={r.status} tahap={r.tahap} />
              <span className="ml-2 text-gray-500">{formatWaktu(r.waktu)}</span>
            </li>
          ))}
        </ol>
      )}

      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </section>
  );
}
