"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { linkAktif, menuNavigasi } from "@/lib/navigasi";
import type { Enums } from "@/types/database";

type Props = { peran: Enums<"peran_user"> | null };

/** Navigasi header per peran (tamu = null). Client Component karena butuh path aktif. */
export function NavigasiUtama({ peran }: Props) {
  const pathname = usePathname();
  const menu = menuNavigasi(peran);
  if (menu.length === 0) return null;

  return (
    <nav aria-label="Navigasi utama" className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
      <ul className="flex flex-wrap gap-1">
        {menu.map(({ href, label }) => {
          const aktif = linkAktif(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={aktif ? "page" : undefined}
                className={`block rounded-md px-3 py-1.5 font-medium ${
                  aktif ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
