"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU, NAMA_KOMUNITAS, NAMA_PERAN, URL_KELUAR, menuAktif, type Peran } from "./menu";

export default function Sidebar({ peran, namaPengguna }: { peran: Peran; namaPengguna?: string }) {
  const pathname = usePathname();
  const menu = MENU[peran];
  const hrefs = menu.map((m) => m.href);
  return (
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="fajar.tech">
        fajar<span>.tech</span>
      </Link>
      <div className="community">
        <strong>{NAMA_KOMUNITAS}</strong>
        Ruang {NAMA_PERAN[peran].toLowerCase()}
      </div>
      <nav aria-label={`Menu ${NAMA_PERAN[peran]}`}>
        {menu.map((m) => {
          const on = menuAktif(pathname, m.href, hrefs);
          return (
            <Link key={m.href} href={m.href} className={on ? "active" : undefined} aria-current={on ? "page" : undefined}>
              {m.label}
            </Link>
          );
        })}
      </nav>
      <div className="profile">
        {namaPengguna && <strong>{namaPengguna}</strong>}
        {NAMA_PERAN[peran]}
        <form action={URL_KELUAR} method="post">
          <button type="submit" className="btn link">
            Keluar ke Masuk
          </button>
        </form>
      </div>
    </aside>
  );
}
