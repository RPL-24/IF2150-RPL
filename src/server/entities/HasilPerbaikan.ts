// C08 · HasilPerbaikan (kelas entity DPPL). Pemilik: Peran C.
// Nama fungsi mengikuti nama operasi di DPPL.

import { isFotoValid, type Berkas } from "./Foto";
import { isVideoValid } from "./Video";

// Algo-014
export function validasiBerkas(foto: readonly Berkas[], video: readonly Berkas[]): boolean {
    return foto.every((f) => isFotoValid(f)) && video.every((v) => isVideoValid(v));
}