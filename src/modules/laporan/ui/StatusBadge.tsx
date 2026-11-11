import type { StatusLaporan } from "@/contracts";
import { Badge } from "@/components/ui";

export default function StatusBadge({ status }: { status: StatusLaporan }) {
  return <Badge nada={status === "MENUNGGU" ? "peringatan" : "ok"}>{status}</Badge>;
}
