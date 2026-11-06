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

// TODO(P1, stretch): cariAtauBuatPenggunaGoogle(db, { googleSub, email, nama }) untuk POST /api/auth/google.
