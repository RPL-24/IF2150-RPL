// Badge status laporan (DPPL I02-06, I03-08, I04-06, I06-03). Server/Client Component.
import { STATUS_LABEL, STATUS_WARNA, TAHAP_LABEL } from "@/lib/constants";
import type { Enums } from "@/types/database";

type Props = {
  status: Enums<"status_laporan">;
  /** Hanya terisi saat status "dikerjakan"; ditampilkan sebagai keterangan kecil. */
  tahap?: Enums<"tahap_penanganan"> | null;
};

export function StatusBadge({ status, tahap }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_WARNA[status]}`}>
      {STATUS_LABEL[status]}
      {tahap && <span className="font-normal opacity-80">· {TAHAP_LABEL[tahap]}</span>}
    </span>
  );
}
