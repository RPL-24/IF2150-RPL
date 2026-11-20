import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16: pengganti middleware.ts. Hanya refresh sesi + redirect kasar;
// pengaman sebenarnya RLS + verifikasiAkses() di controller.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Semua path kecuali aset statis, optimasi gambar, favicon, dan file gambar.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
