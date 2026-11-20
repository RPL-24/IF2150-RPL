import { requireRoleOrRedirect } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRoleOrRedirect("eksekutor");
  return children;
}
