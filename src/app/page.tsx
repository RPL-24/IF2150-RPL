import Link from "next/link";

// Beranda sementara untuk ngecek semua route. Nanti diganti redirect sesuai role (L6).
const RUTE = [
  { href: "/login", label: "Login" },
  { href: "/daftar", label: "Daftar" },
  { href: "/lapor", label: "I-01 Lapor (warga)" },
  { href: "/status", label: "I-02 Status Laporan (publik)" },
  { href: "/validasi", label: "I-03 Validasi (admin)" },
  { href: "/evaluasi", label: "I-04 Evaluasi (admin)" },
  { href: "/tugas", label: "I-05 Daftar Tugas (eksekutor)" },
  { href: "/tugas/LK-0001/hasil", label: "I-06 Hasil Perbaikan (eksekutor)" },
];

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">LaporKota</h1>
      <ul className="space-y-2">
        {RUTE.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="text-blue-600 underline">
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
