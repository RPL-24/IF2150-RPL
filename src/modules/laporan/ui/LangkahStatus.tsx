import type { StatusLaporan } from "@/contracts";
import { URUTAN_STATUS, labelStatus } from "../internal/StatusLaporan";

const KETERANGAN: Record<StatusLaporan, string> = {
  MENUNGGU: "Laporan ditugaskan kepada Anda.",
  SEDANG_DIPERBAIKI: "Penanganan oleh teknisi penugasan.",
  SELESAI: "Tahap akhir; tidak ada aksi berikutnya.",
};

// Tiga tahap penanganan; tahap saat ini ditandai.
export default function LangkahStatus({ status }: { status: StatusLaporan }) {
  return (
    <ol className="langkah" aria-label="Tahap penanganan">
      {URUTAN_STATUS.map((s) => (
        <li key={s} className={s === status ? "sekarang" : undefined} aria-current={s === status ? "step" : undefined}>
          <strong>{labelStatus(s)}</strong>
          <p>{KETERANGAN[s]}</p>
        </li>
      ))}
    </ol>
  );
}
