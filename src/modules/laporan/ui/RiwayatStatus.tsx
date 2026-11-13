import type { RingkasanStatus, WaktuISO } from "@/contracts";
import { PERISTIWA, waktuWib } from "./format";

// Peristiwa pengajuan berasal dari waktuDibuat laporan, bukan dari tabel riwayat (DPPL 5.22.1).
export default function RiwayatStatus({ waktuDibuat, riwayat }: { waktuDibuat: WaktuISO; riwayat: RingkasanStatus[] }) {
  const peristiwa = [{ status: "MENUNGGU" as const, timestamp: waktuDibuat }, ...riwayat];
  return (
    <ol className="timeline">
      {peristiwa.map((p, i) => (
        <li key={`${p.status}-${i}`}>
          <time dateTime={p.timestamp}>{waktuWib(p.timestamp)}</time>
          <strong>{PERISTIWA[p.status].judul}</strong>
          <p>{PERISTIWA[p.status].isi}</p>
        </li>
      ))}
    </ol>
  );
}
