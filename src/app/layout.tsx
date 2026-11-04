import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
        {user && (
          <header className="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-sm">
            <span className="truncate">{user.nama}</span>
            <TombolKeluar />
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
