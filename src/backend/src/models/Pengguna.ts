import {Role} from '@prisma/client'
import {prisma} from '../database/prisma'

export interface PenggunaProps {
    idPengguna: string;
    nomorTelepon: string;
    email: string;
    namaPengguna: string;
    username: string;
    passwordHash: string;
    role?: Role;
    avatarUrl?: string | null;
    akumulasiRating?: number;
    riwayatRating?: number[];
}

export class Pengguna {
  protected idPengguna: string;
  protected nomorTelepon: string;
  protected email: string;
  protected namaPengguna: string;
  protected username: string;
  protected passwordHash: string;
  protected role: Role;
  protected avatarUrl: string | null;
  protected akumulasiRating: number;
  protected riwayatRating: number[];

  constructor(props: PenggunaProps) {
    this.idPengguna = props.idPengguna;
    this.nomorTelepon = props.nomorTelepon;
    this.email = props.email;
    this.namaPengguna = props.namaPengguna;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.role = props.role ?? Role.PELANGGAN;
    this.avatarUrl = props.avatarUrl ?? null;
    this.akumulasiRating = props.akumulasiRating ?? 0.0;
    this.riwayatRating = props.riwayatRating ?? [];
  }

  public getId(): string {
    return this.idPengguna;
  }

  public getNomor(): string {
    return this.nomorTelepon;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNama(): string {
    return this.namaPengguna;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getRole(): Role {
    return this.role;
  }


  public getAkumulasiRating(): number {
    return this.akumulasiRating;
  }

  public getRiwayatRating(): number[] {
    return [...this.riwayatRating];
  }

  public setNomor(nomorBaru: string): void {
    this.nomorTelepon = nomorBaru.trim();
  }

  public setEmail(emailBaru: string): void {
    this.email = emailBaru.trim().toLowerCase();
  }

  public setNama(namaBaru: string): void {
    this.namaPengguna = namaBaru.trim();
  }

  public addNewRatingRiwayat(nilaiRating: number): void {
    if (nilaiRating < 1 || nilaiRating > 5) {
      throw new Error('Nilai rating harus berada dalam rentang 1 hingga 5.');
    }
    this.riwayatRating.push(nilaiRating);
    const total = this.riwayatRating.reduce((acc, curr) => acc + curr, 0);
    this.akumulasiRating = Number((total / this.riwayatRating.length).toFixed(2));
  }

  public static async cekDuplikasiKredensial(
    username: string,
    email: string,
    excludeIdPengguna?: string
  ): Promise<{ usernameExists: boolean; emailExists: boolean }> {
    const existingUsers = await prisma.pengguna.findMany({
      where: {
        OR: [
          { username: username.trim() },
          { email: email.trim().toLowerCase() },
        ],
        ...(excludeIdPengguna ? { NOT: { idPengguna: excludeIdPengguna } } : {}),
      },
      select: {
        username: true,
        email: true,
      },
    });

    const usernameExists = existingUsers.some(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    return { usernameExists, emailExists };
  }

  public static async findByUsernameOrEmail(identifier: string) {
    const cleanIdentifier = identifier.trim();
    return prisma.pengguna.findFirst({
      where: {
        OR: [
          { username: cleanIdentifier },
          { email: cleanIdentifier.toLowerCase() },
        ],
      },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });
  }

  public static async findProfileById(idPengguna: string) {
    const record = await prisma.pengguna.findUnique({
      where: { idPengguna },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });

    if (!record) return null;

    const { password: _, ...safeProfile } = record;
    return safeProfile;
  }
  public async updateProfilKeDb() {
    const updated = await prisma.pengguna.update({
      where: { idPengguna: this.idPengguna },
      data: {
        namaPengguna: this.namaPengguna,
        nomorTelpon: this.nomorTelepon,
        email: this.email,
        avatarUrl: this.avatarUrl,
      },
      include: {
        pemberiJasa: {
          include: {
            kategoriJasa: true,
          },
        },
        layananPelanggan: true,
      },
    });

    const { password: _, ...safeUpdated } = updated;
    return safeUpdated;
  }

  public toJSON(): Record<string, unknown> {
    return {
      idPengguna: this.idPengguna,
      username: this.username,
      email: this.email,
      namaPengguna: this.namaPengguna,
      nomorTelpon: this.nomorTelepon,
      nomorTelepon: this.nomorTelepon,
      role: this.role,
      avatarUrl: this.avatarUrl,
      akumulasiRating: this.akumulasiRating,
      riwayatRating: this.riwayatRating,
    };
  }



}