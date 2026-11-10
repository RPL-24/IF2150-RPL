/**
 * Titik rakit modul akun (hanya untuk server). Route dan server action
 * memakai `akunController` dari sini; tes membuat instance sendiri dengan
 * boundary palsu sehingga tidak butuh basis data.
 */
import { DataAkunBoundary } from './boundary';
import { AkunController } from './controller';
import { ModulAkun } from './modul';
import { Validasi } from './validasi';

export const akunController = new AkunController(
  new ModulAkun(new DataAkunBoundary()),
  new Validasi(),
);