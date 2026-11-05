import { BahanBaku } from './BahanBaku';
import { PESAN_TAKARAN_TIDAK_VALID, isAngkaPositif } from './pesan';

export class ResepBahan {
  private takaran: number = 0;

  constructor(
    private bahan: BahanBaku,
    takaran: number,
  ) {
    this.setTakaran(takaran);
  }

  getBahan(): BahanBaku {
    return this.bahan;
  }

  getTakaran(): number {
    return this.takaran;
  }

  setTakaran(takaran: number): void {
    if (!isAngkaPositif(takaran)) {
      throw new Error(PESAN_TAKARAN_TIDAK_VALID);
    }
    this.takaran = takaran;
  }
}
