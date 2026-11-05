import type { ReactNode } from "react";
import Link from "next/link";
import BottomNav from "./BottomNav";
import { NAMA_KOMUNITAS, NAMA_PERAN, type Peran } from "./menu";
import Sidebar from "./Sidebar";
import Tanggal from "./Tanggal";

export type { Peran };

export default function DashboardShell({
  peran,
  namaPengguna,
  children,
}: {
  peran: Peran;
  namaPengguna?: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#konten">
        Lewati ke konten
      </a>
      <Sidebar peran={peran} namaPengguna={namaPengguna} />
      <header className="mobile-header">
        <Link className="brand" href="/" aria-label="fajar.tech">
          fajar<span>.tech</span>
        </Link>
        <span className="badge neutral">{NAMA_PERAN[peran]}</span>
      </header>
      <main id="konten" className="workspace">
        <div className="topline">
          <span>
            {NAMA_KOMUNITAS} &nbsp; / &nbsp; {NAMA_PERAN[peran]}
          </span>
          <Tanggal />
        </div>
        <div className="content">{children}</div>
      </main>
      <BottomNav peran={peran} />
    </div>
  );
}
