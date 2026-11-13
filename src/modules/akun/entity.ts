/**
 * Entity modul akun (Business Layer): C01 Akun, C02 Warga, C03 Teknisi,
 * C04 Pengurus, C05 CalonPengguna, C06 StatusAkun.
 *
 * Operasi pada Warga/Teknisi/Pengurus yang hanya mendelegasikan ke modul lain
 * (pantauPemantauan, lihatTagihan, kirimLaporan, ubahStatusLaporan,
 * hitungIuran, dst.) tidak diwujudkan di sini; tiap modul memilikinya di
 * controller sendiri. Catat di B.5.
 */
import {
  DASHBOARD_TUJUAN,
  type KonteksSesi,
  type Peran,
} from '@/lib/auth/konteks';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { AkunTidakLengkap, PeranTidakValid } from './galat';

/**
 * C06 StatusAkun. Tabel C06 hanya memuat MENUNGGU dan DISETUJUI, tetapi
 * antarmuka I-01 (skenario A2) menyebut status DITOLAK. Catat di B.1.
 */
export const STATUS_AKUN = ['MENUNGGU', 'DISETUJUI', 'DITOLAK'] as const;
export type StatusAkun = (typeof STATUS_AKUN)[number];

/** Data akun tersimpan. `password` berisi hash scrypt, bukan kata sandi asli. */
export type DataAkun = {
  email: string;
  nama: string;
  password: string;
  peran: Peran;
  statusAkun: StatusAkun;
};

/** Akun tanpa kredensial, aman untuk dikembalikan antarlapisan. */
export type AkunRingkas = Omit<DataAkun, 'password'>;

export type DasarAkun = {
  email: string;
  nama: string;
  password: string;
  statusAkun: StatusAkun;
};
export type ProfilWarga = { idWarga: number; idKomunitas: string; statusTerdaftar: boolean };
export type ProfilTeknisi = { idTeknisi: string; kontak: string };
export type ProfilPengurus = { idPengurus: string };
export type ProfilPeran = ProfilWarga | ProfilTeknisi | ProfilPengurus;

/** C01 Akun (abstrak). Hash kata sandi tidak pernah keluar dari kelas ini. */
export abstract class Akun {
  readonly email: string;
  readonly nama: string;
  protected readonly password: string;
  private status: StatusAkun;

  protected constructor(dasar: DasarAkun) {
    this.email = dasar.email;
    this.nama = dasar.nama;
    this.password = dasar.password;
    this.status = dasar.statusAkun;
  }

  get statusAkun(): StatusAkun {
    return this.status;
  }

  /**
   * Algo-001: membandingkan email dan kata sandi (hash scrypt). Dibuat async
   * karena hash scrypt tidak sinkron. Catat di B.5.
   */
  async cocokKredensial(email: string, password: string): Promise<boolean> {
    if (this.email !== email) return false;
    return verifyPassword(password, this.password);
  }

  sudahDisetujui(): boolean {
    return this.status === 'DISETUJUI';
  }

  /** Dipakai persetujuan akun (UC14). */
  ubahStatus(statusBaru: StatusAkun): void {
    this.status = statusBaru;
  }

  /**
   * Algo-002: membuat Warga/Teknisi/Pengurus sesuai peran. Profil boleh null
   * (misalnya akun yang masih menunggu persetujuan); lihat konteksSesi().
   * Melempar PeranTidakValid untuk peran lain.
   */
  static buatAkun(peran: string, dasar: DasarAkun, profil: ProfilPeran | null): Akun {
    switch (peran.trim().toUpperCase()) {
      case 'WARGA':
        return new Warga(dasar, profil as ProfilWarga | null);
      case 'TEKNISI':
        return new Teknisi(dasar, profil as ProfilTeknisi | null);
      case 'PENGURUS':
        return new Pengurus(dasar, profil as ProfilPengurus | null);
      default:
        throw new PeranTidakValid(peran);
    }
  }

  abstract dashboardTujuan(): string;

  /**
   * Membentuk KonteksSesi untuk akun DISETUJUI. Tambahan di luar DPPL (DPPL
   * hanya mengembalikan dashboardTujuan); catat di B.1.
   * Melempar AkunTidakLengkap bila profil peran belum ada.
   */
  abstract konteksSesi(): KonteksSesi;

  protected pastikanDisetujui(): void {
    if (this.status !== 'DISETUJUI') throw new Error('AKUN_BELUM_DISETUJUI');
  }
}

/** C02 Warga */
export class Warga extends Akun {
  private readonly profil: ProfilWarga | null;

  constructor(dasar: DasarAkun, profil: ProfilWarga | null) {
    super(dasar);
    this.profil = profil;
  }

  getIdWarga(): number {
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return this.profil.idWarga;
  }

  /** Algo-003: terdaftar dan berada di komunitas yang sama. */
  validasiKeanggotaan(idKomunitas: string): boolean {
    if (!this.profil || !this.profil.statusTerdaftar) return false;
    return this.profil.idKomunitas === idKomunitas;
  }

  dashboardTujuan(): string {
    return DASHBOARD_TUJUAN.WARGA;
  }

  konteksSesi(): KonteksSesi {
    this.pastikanDisetujui();
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return {
      email: this.email,
      nama: this.nama,
      statusAkun: 'DISETUJUI',
      peran: 'WARGA',
      idWarga: this.profil.idWarga,
      idKomunitas: this.profil.idKomunitas,
    };
  }
}

/** C03 Teknisi */
export class Teknisi extends Akun {
  private readonly profil: ProfilTeknisi | null;

  constructor(dasar: DasarAkun, profil: ProfilTeknisi | null) {
    super(dasar);
    this.profil = profil;
  }

  getIdTeknisi(): string {
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return this.profil.idTeknisi;
  }

  dashboardTujuan(): string {
    return DASHBOARD_TUJUAN.TEKNISI;
  }

  konteksSesi(): KonteksSesi {
    this.pastikanDisetujui();
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return {
      email: this.email,
      nama: this.nama,
      statusAkun: 'DISETUJUI',
      peran: 'TEKNISI',
      idTeknisi: this.profil.idTeknisi,
    };
  }
}

/** C04 Pengurus */
export class Pengurus extends Akun {
  private readonly profil: ProfilPengurus | null;

  constructor(dasar: DasarAkun, profil: ProfilPengurus | null) {
    super(dasar);
    this.profil = profil;
  }

  getIdPengurus(): string {
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return this.profil.idPengurus;
  }

  /** Algo-006: Pengurus dengan status DISETUJUI. */
  verifikasiKewenangan(): boolean {
    return this.sudahDisetujui();
  }

  dashboardTujuan(): string {
    return DASHBOARD_TUJUAN.PENGURUS;
  }

  konteksSesi(): KonteksSesi {
    this.pastikanDisetujui();
    if (!this.profil) throw new AkunTidakLengkap(this.email);
    return {
      email: this.email,
      nama: this.nama,
      statusAkun: 'DISETUJUI',
      peran: 'PENGURUS',
      idPengurus: this.profil.idPengurus,
    };
  }
}

/** C05 CalonPengguna */
export class CalonPengguna {
  private readonly nama: string;
  private readonly email: string;
  private readonly password: string;
  private readonly peranPilihan: Peran;

  constructor(nama: string, email: string, password: string, peranPilihan: Peran) {
    this.nama = nama;
    this.email = email;
    this.password = password;
    this.peranPilihan = peranPilihan;
  }

  /**
   * Algo-008: membuat akun berstatus MENUNGGU dengan kata sandi ter-hash.
   * Peran yang diajukan tidak memberi hak akses sebelum akun disetujui.
   */
  async daftarkan(): Promise<DataAkun> {
    return {
      email: this.email,
      nama: this.nama,
      password: await hashPassword(this.password),
      peran: this.peranPilihan,
      statusAkun: 'MENUNGGU',
    };
  }
}