"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  namaAdmin: string;
  jumlahAntreanValidasi?: number;
  jumlahSiapEvaluasi?: number;
};

type MenuAdmin = { href: string; label: string; jumlah: number };

export function AdminSidebar({
  namaAdmin,
  jumlahAntreanValidasi = 0,
  jumlahSiapEvaluasi = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const daftarMenu: MenuAdmin[] = [
    { href: "/validasi", label: "Validasi Laporan", jumlah: jumlahAntreanValidasi },
    { href: "/evaluasi", label: "Evaluasi Hasil Kerja", jumlah: jumlahSiapEvaluasi },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <nav aria-label="Menu admin" className="flex flex-col gap-1">
        {daftarMenu.map((menu) => {
          const aktif = pathname === menu.href || pathname.startsWith(`${menu.href}/`);
          return (
            <Link
              key={menu.href}
              href={menu.href}
              aria-current={aktif ? "page" : undefined}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                aktif ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{menu.label}</span>
              <span
                className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs ${
                  aktif ? "bg-white text-gray-900" : "bg-gray-200 text-gray-700"
                }`}
              >
                {menu.jumlah}
              </span>
            </Link>
          );
        })}
      </nav>
      <p className="mt-auto border-t border-gray-200 pt-4 text-xs text-gray-500">
        Masuk sebagai <span className="font-medium text-gray-700">{namaAdmin}</span>
      </p>
    </aside>
  );
}
