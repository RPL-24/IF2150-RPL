/**
 * Galat domain modul akun. Dipisah dari boundary agar controller dan entity
 * bisa memakainya tanpa mengimpor lapisan data.
 */

/** Email sudah dipakai akun lain (UC12). */
export class EmailSudahTerdaftar extends Error {
  readonly email: string;

  constructor(email: string) {
    super('Email sudah terdaftar');
    this.name = 'EmailSudahTerdaftar';
    this.email = email;
  }
}

/** Padanan InvalidRoleException pada Algo-002. */
export class PeranTidakValid extends Error {
  readonly peran: string;

  constructor(peran: string) {
    super(`Peran tidak dikenal: ${peran}`);
    this.name = 'PeranTidakValid';
    this.peran = peran;
  }
}

/** Akun ada tetapi profil perannya (warga/teknisi/pengurus) belum tersedia. */
export class AkunTidakLengkap extends Error {
  readonly email: string;

  constructor(email: string) {
    super('Profil peran akun belum tersedia');
    this.name = 'AkunTidakLengkap';
    this.email = email;
  }
}   