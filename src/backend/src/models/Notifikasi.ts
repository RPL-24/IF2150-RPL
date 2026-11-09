import { randomUUID } from 'crypto';
import prisma from '../database/prisma.js';

/**
 * Kelas DPPL C28 - Notifikasi
 * Merepresentasikan data notifikasi sistem serta membaca dan menyimpan data (KNF20, KNF21).
 */
export class Notifikasi {
  private idNotifikasi: string;
  private idPenerima: string;
  private isiNotifikasi: string;
  private waktuNotifikasi: Date;
  private statusBaca: string;

  constructor(
    idPenerima: string,
    isiNotifikasi: string,
    idNotifikasi?: string,
    waktuNotifikasi?: Date,
    statusBaca = 'Unread'
  ) {
    this.idNotifikasi = idNotifikasi ?? randomUUID();
    this.idPenerima = idPenerima;
    this.isiNotifikasi = isiNotifikasi;
    this.waktuNotifikasi = waktuNotifikasi ?? new Date();
    this.statusBaca = statusBaca;
  }

  public getIdNotifikasi(): string {
    return this.idNotifikasi;
  }

  public getIdPenerima(): string {
    return this.idPenerima;
  }

  /**
   * ALGO-065: Mengembalikan teks isi pesan notifikasi
   */
  public getIsiNotifikasi(): string {
    return this.isiNotifikasi;
  }

  public getWaktuNotifikasi(): Date {
    return this.waktuNotifikasi;
  }

  public getStatusBaca(): string {
    return this.statusBaca;
  }

  /**
   * Menyimpan data notifikasi baru ke dalam database (Q-027)
   */
  public async simpanNotifikasi(): Promise<Notifikasi> {
    await prisma.notifikasi.create({
      data: {
        idNotifikasi: this.idNotifikasi,
        idPenerima: this.idPenerima,
        isiNotifikasi: this.isiNotifikasi,
        waktuNotifikasi: this.waktuNotifikasi,
        statusBaca: this.statusBaca,
      },
    });
    return this;
  }

  /**
   * ALGO-066 & Q-026: Memperbarui status baca notifikasi menjadi 'Read'
   */
  public async tandaiTerbaca(): Promise<void> {
    this.statusBaca = 'Read';
    await prisma.notifikasi.update({
      where: { idNotifikasi: this.idNotifikasi },
      data: { statusBaca: 'Read' },
    });
  }

  /**
   * Mengambil pesan notifikasi terakhir yang diterima oleh pengguna
   */
  public async getLastMessage(): Promise<string | null> {
    const latest = await prisma.notifikasi.findFirst({
      where: { idPenerima: this.idPenerima },
      orderBy: { waktuNotifikasi: 'desc' },
    });
    return latest ? latest.isiNotifikasi : null;
  }
}

export default Notifikasi;
