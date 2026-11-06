export type TipeNotifikasi = 'kerugian' | 'harga_bahan';

export class Notifikasi {
  private idNotifikasi: string;
  private judul: string;
  private pesanAlert: string;
  private waktuKirim: Date;
  private isRead: boolean;
  private tipe: TipeNotifikasi;
  private idProduk: string | null;

  constructor(
    idNotifikasi: string,
    judul: string,
    pesanAlert: string,
    waktuKirim: Date,
    tipe: TipeNotifikasi,
    idProduk: string | null = null,
    isRead: boolean = false,
  ) {
    const pesan = (pesanAlert ?? '').trim();
    if (pesan === '') {
      throw new Error('Pesan notifikasi tidak boleh kosong');
    }
    this.idNotifikasi = idNotifikasi;
    this.judul = (judul ?? '').trim();
    this.pesanAlert = pesan;
    this.waktuKirim = waktuKirim;
    this.tipe = tipe;
    this.idProduk = idProduk;
    this.isRead = isRead;
  }

  getIdNotifikasi(): string {
    return this.idNotifikasi;
  }

  getJudul(): string {
    return this.judul;
  }

  getPesanAlert(): string {
    return this.pesanAlert;
  }

  getWaktuKirim(): Date {
    return this.waktuKirim;
  }

  getTipe(): TipeNotifikasi {
    return this.tipe;
  }

  getIdProduk(): string | null {
    return this.idProduk;
  }

  getIsRead(): boolean {
    return this.isRead;
  }

  markAsRead(): void {
    this.isRead = true;
  }
}
