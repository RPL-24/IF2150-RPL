import { redirect } from "next/navigation";

// Middleware mengalihkan pengguna yang sudah masuk ke dasbornya; tamu ke /login.
export default function Beranda() {
  redirect("/login");
}
