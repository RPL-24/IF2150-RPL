"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IKON, MENU, NAMA_PERAN, menuAktif, type Peran } from "./menu";

export default function BottomNav({ peran }: { peran: Peran }) {
  const pathname = usePathname();
  const menu = MENU[peran];
  const hrefs = menu.map((m) => m.href);
  return (
    <nav className="bottom-nav" aria-label={`Menu ${NAMA_PERAN[peran]}`}>
      {menu.map((m) => {
        const on = menuAktif(pathname, m.href, hrefs);
        return (
          <Link key={m.href} href={m.href} className={on ? "active" : undefined} aria-current={on ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d={IKON[m.ikon]} />
            </svg>
            {m.pendek}
          </Link>
        );
      })}
    </nav>
  );
}
