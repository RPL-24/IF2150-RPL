import { AdminSidebar } from "@/client/components/validasi/AdminSidebar";
import { requireRoleOrRedirect } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const admin = await requireRoleOrRedirect("admin");
  return (
    <div className="flex min-h-0 flex-1 min-w-5xl">
      <AdminSidebar namaAdmin={admin.nama} />
      <div className="min-w-0 flex-1 bg-gray-50">{children}</div>
    </div>
  );
}
