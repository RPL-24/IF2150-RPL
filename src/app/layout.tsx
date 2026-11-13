import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoncengNotifikasi } from "@/client/components/shared/LoncengNotifikasi";
import { NavigasiUtama } from "@/client/components/shared/NavigasiUtama";
import { TombolKeluar } from "@/client/components/shared/TombolKeluar";
import { getCurrentUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaporKota",
  description: "Platform pelaporan kerusakan infrastruktur publik kota.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 px-4 py-2 text-sm sm:px-6">
          <span className="min-w-0 flex-1 truncate font-medium sm:flex-none">{user ? user.nama : "LaporKota"}</span>
          {/* Mobile: navigasi turun ke baris kedua; ≥ sm: satu baris. */}
          <NavigasiUtama peran={user?.role ?? null} />
          {user && (
            <div className="flex items-center gap-2">
              {/* Admin tidak pernah menerima notifikasi (trigger hanya ke pelapor & eksekutor). */}
              {user.role !== "admin" && <LoncengNotifikasi userId={user.id} role={user.role} />}
              <TombolKeluar />
            </div>
          )}
        </header>
        {children}
      </body>
    </html>
  );
}
