// C21 StatusLaporan (DPPL 5.21).
import type { StatusLaporan } from "@/contracts";

export const URUTAN_STATUS: readonly StatusLaporan[] = ["MENUNGGU", "SEDANG_DIPERBAIKI", "SELESAI"];

const LABEL: Record<StatusLaporan, string> = {
  MENUNGGU: "Menunggu",
  SEDANG_DIPERBAIKI: "Sedang diperbaiki",
  SELESAI: "Selesai",
};

export function labelStatus(status: StatusLaporan): string {
  return LABEL[status];
}

export function adalahStatus(nilai: unknown): nilai is StatusLaporan {
  return typeof nilai === "string" && (URUTAN_STATUS as readonly string[]).includes(nilai);
}

// Satu langkah maju saja; SELESAI adalah status akhir.
export function statusBerikutnya(status: StatusLaporan): StatusLaporan[] {
  const i = URUTAN_STATUS.indexOf(status);
  return i >= 0 && i < URUTAN_STATUS.length - 1 ? [URUTAN_STATUS[i + 1]] : [];
}
