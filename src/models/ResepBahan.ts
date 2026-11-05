import { BahanBaku } from './BahanBaku';
import { isAngkaPositif, PESAN_INPUT_TIDAK_VALID } from './pesan';

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
      throw new Error(PESAN_INPUT_TIDAK_VALID);
    }
    this.takaran = takaran;
  }
}
