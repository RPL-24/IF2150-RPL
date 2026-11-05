import type { ReactNode } from "react";

export type NadaBadge = "ok" | "peringatan" | "bahaya" | "netral";

const KELAS: Record<NadaBadge, string> = { ok: "", peringatan: " warn", bahaya: " bad", netral: " neutral" };

export default function Badge({ nada = "ok", children }: { nada?: NadaBadge; children: ReactNode }) {
  return <span className={`badge${KELAS[nada]}`}>{children}</span>;
}
