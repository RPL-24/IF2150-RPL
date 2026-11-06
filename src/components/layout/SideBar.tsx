"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { Role } from "@/types/role";

const menuUser = [
  { href: "/akun", label: "Profile", icon: "/icon/Profile.svg" },
  { href: "/laporan/baru", label: "Report", icon: "/icon/Lapor.svg" },
  { href: "/leaderboard", label: "Leaderboard", icon: "/icon/Leaderboard.svg" },
];

const menuStaf = [
  ...menuUser,
  { href: "/tanggapan", label: "Response", icon: "/icon/Vector.svg" },
];

export function SideBar({ role = "pelapor" }: { role?: Role }) {
  const [open, setOpen] = useState(false);
  const menu = role === "pelapor" ? menuUser : menuStaf;

  return (
    <>
      <button
        type="button"
        aria-label="Buka menu"
        onClick={() => setOpen(!open)}
        className="relative z-50 rounded-lg p-2 text-white hover:bg-white/10"
      >
        <Menu className="size-10" />
      </button>

      {open && (
        <>
          {/* Lapisan gelap: #626693, Multiply, mulai di bawah header (133px) */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[133px] z-40 bg-[#626693] mix-blend-multiply"
          />

          {/* Panel sidebar: lebar 315, #485AB8 */}
          <nav className="fixed bottom-0 left-0 top-[133px] z-40 flex w-[315px] flex-col gap-12 bg-[#485AB8] px-[30px] pt-10 font-hywenhei text-white">
            {menu.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-[40px] items-center gap-[26px] text-[27px]"
              >
                <span className="flex h-[40px] w-[35px] items-center justify-center">
                  <img src={icon} alt="" className="max-h-full max-w-full" />
                </span>
                {label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  );
}