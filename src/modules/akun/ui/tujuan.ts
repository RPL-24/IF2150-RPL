/**
 * Menyaring parameter `next` (diset middleware ke /login?next=...) agar
 * pengalihan setelah login hanya ke jalur internal, bukan situs lain
 * (open redirect). Mengembalikan null bila tidak aman, dan pemanggil
 * memakai dasbor tujuan dari server.
 */
export function urlTujuanAman(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  if (next.includes('\\') || /[\u0000-\u001f\u007f]/.test(next)) return null;

  // Harus tetap satu asal (origin) setelah di-parse.
  try {
    const dasar = 'http://asal-internal.invalid';
    if (new URL(next, dasar).origin !== dasar) return null;
  } catch {
    return null;
  }

  // Halaman auth dan API bukan tujuan yang masuk akal setelah login.
  const jalur = next.split(/[?#]/)[0];
  if (jalur === '/login' || jalur === '/registrasi') return null;
  if (jalur === '/api' || jalur.startsWith('/api/')) return null;

  return next;
}