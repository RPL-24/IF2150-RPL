import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

// Route yang wajib login (cek role TIDAK di sini, tapi di layout + verifikasiAkses()).
const BUTUH_LOGIN = ["/lapor", "/validasi", "/evaluasi", "/tugas"];
const HANYA_TAMU = ["/login", "/daftar"];

const cocok = (path: string, daftar: string[]) =>
  daftar.some((p) => path === p || path.startsWith(`${p}/`));

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Cache-Control/Expires/Pragma: respons yang membawa token tidak boleh di-cache CDN.
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
        },
      },
    },
  );

  // JANGAN menaruh kode di antara createServerClient dan getClaims():
  // getClaims() yang me-refresh token yang hampir kedaluwarsa.
  const { data } = await supabase.auth.getClaims();
  const sudahLogin = Boolean(data?.claims);

  const { pathname, search } = request.nextUrl;

  if (!sudahLogin && cocok(pathname, BUTUH_LOGIN)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + search);
    return redirectDenganCookie(url, supabaseResponse);
  }

  if (sudahLogin && cocok(pathname, HANYA_TAMU)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return redirectDenganCookie(url, supabaseResponse);
  }

  // Wajib mengembalikan supabaseResponse terakhir (membawa cookie hasil refresh).
  return supabaseResponse;
}

// Redirect tetap membawa cookie sesi + header cache dari supabaseResponse,
// kalau tidak user ter-logout di request berikutnya.
function redirectDenganCookie(url: URL, sumber: NextResponse) {
  const res = NextResponse.redirect(url);
  sumber.cookies.getAll().forEach((c) => res.cookies.set(c));
  for (const h of ["cache-control", "expires", "pragma"]) {
    const v = sumber.headers.get(h);
    if (v) res.headers.set(h, v);
  }
  return res;
}
