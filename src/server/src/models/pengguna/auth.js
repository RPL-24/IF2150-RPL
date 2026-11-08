/**
 * Model Pengguna (C01 Pelapor, C02 Admin, C03 PemerintahDaerah) — bagian autentikasi.
 * Pemilik: P1.
 */

const KOLOM = `id_pengguna, email, nama, password_hash, peran, nama_instansi, wilayah_kerja, jumlah_laporan`;

export async function cariPenggunaByEmail(db, email) {
  const { rows } = await db.query(`SELECT ${KOLOM} FROM pengguna WHERE lower(email) = lower($1)`, [email]);
  return rows[0] ?? null;
}

export async function cariPenggunaById(db, idPengguna) {
  const { rows } = await db.query(`SELECT ${KOLOM} FROM pengguna WHERE id_pengguna = $1`, [idPengguna]);
  return rows[0] ?? null;
}

/** DTO profil: tidak pernah menyertakan password_hash. */
export function toProfil(p) {
  return {
    id: p.id_pengguna,
    email: p.email,
    nama: p.nama,
    peran: p.peran,
    namaInstansi: p.nama_instansi,
    wilayahKerja: p.wilayah_kerja,
    jumlahLaporan: p.jumlah_laporan,
  };
}

/**
 * Login Google: cari berdasarkan google_sub; jika belum ada, tautkan ke akun dengan email yang sama;
 * jika tetap tidak ada, buat akun baru berperan PELAPOR (petugas tidak bisa mendaftar sendiri).
 */
export async function cariAtauBuatPenggunaGoogle(db, { googleSub, email, nama }) {
  const lewatSub = await db.query(`SELECT ${KOLOM} FROM pengguna WHERE google_sub = $1`, [googleSub]);
  if (lewatSub.rows[0]) return lewatSub.rows[0];

  const tertaut = await db.query(
    `UPDATE pengguna SET google_sub = $1 WHERE lower(email) = lower($2) AND google_sub IS NULL RETURNING ${KOLOM}`,
    [googleSub, email],
  );
  if (tertaut.rows[0]) return tertaut.rows[0];

  const baru = await db.query(
    `INSERT INTO pengguna (email, nama, google_sub, peran) VALUES ($1, $2, $3, 'PELAPOR') RETURNING ${KOLOM}`,
    [email, nama, googleSub],
  );
  return baru.rows[0];
}
