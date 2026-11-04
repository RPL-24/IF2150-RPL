import { LaporPage } from "@/client/views/LaporPage";
import { requireRoleOrRedirect } from "@/lib/auth";

export default async function Page() {
  await requireRoleOrRedirect("warga");
  return <LaporPage />;
}
