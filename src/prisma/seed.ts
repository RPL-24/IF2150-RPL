// Data seed FIKTIF untuk pengembangan dan uji integrasi. Bukan kredensial asli.
// Aman dijalankan berulang: setiap baris memakai upsert dengan kunci tetap.
// Pemeriksaan: contracts/SchemaReview.md bagian D.
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Peran, type StatusAkun } from "../generated/prisma/client";

const PASSWORD_UJI = process.env.SEED_PASSWORD ?? "uji-fajar-123";

// Format sama dengan hashPassword di lib/auth/password.ts: scrypt$N$r$p$<garam>$<hash>.
function hashPassword(plain: string): string {
  const garam = randomBytes(16);
  const hash = scryptSync(plain.normalize("NFKC"), garam, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${garam.toString("base64")}$${hash.toString("base64")}`;
}

const waktu = (iso: string) => new Date(`${iso}+07:00`);

const akunUji: { id: string; email: string; nama: string; peran: Peran; status: StatusAkun }[] = [
  { id: "AKN-WARGA-1", email: "warga@fajar.test", nama: "Sari Lestari", peran: "WARGA", status: "DISETUJUI" },
  { id: "AKN-WARGA-2", email: "warga2@fajar.test", nama: "Budi Santoso", peran: "WARGA", status: "DISETUJUI" },
  { id: "AKN-TEKNISI-1", email: "teknisi@fajar.test", nama: "Arif Pratama", peran: "TEKNISI", status: "DISETUJUI" },
  { id: "AKN-PENGURUS-1", email: "pengurus@fajar.test", nama: "Dewi Anggraini", peran: "PENGURUS", status: "DISETUJUI" },
  { id: "AKN-CALON-1", email: "calon@fajar.test", nama: "Rudi Hartono", peran: "WARGA", status: "MENUNGGU" }, // uji UC14
];

const perangkatUji = [
  { idPerangkat: "TNK-01", jenisPerangkat: "TANGKI_AIR", nama: "Tangki Utama", lokasi: "Blok A", volumeLiter: 7500, kapasitasLiter: 10000, ambangRendah: 3000, ambangKritis: 1000 },
  { idPerangkat: "BAT-01", jenisPerangkat: "BATERAI", nama: "Baterai Komunal", lokasi: "Rumah Daya", kapasitasPersen: 80, ambangBatasAman: 20 },
  { idPerangkat: "PNL-01", jenisPerangkat: "PANEL_SURYA", nama: "Panel Atap Balai", lokasi: "Balai Warga", dayaWatt: 2400, kapasitas: 5000 },
] as const;

const pembacaanUji = [
  { idPembacaan: "BCA-TNK-01", idPerangkat: "TNK-01", nilai: 7500, satuan: "liter" },
  { idPembacaan: "BCA-BAT-01", idPerangkat: "BAT-01", nilai: 80, satuan: "persen" },
  { idPembacaan: "BCA-PNL-01", idPerangkat: "PNL-01", nilai: 2400, satuan: "watt" },
];

const TARIF = { tarifAirPerM3: 5000, tarifEnergiPerKwh: 1500, biayaTetap: 20000 };

function rincianTagihan(volumeAirM3: number, energiKWh: number) {
  const subtotalAir = volumeAirM3 * TARIF.tarifAirPerM3;
  const subtotalEnergi = energiKWh * TARIF.tarifEnergiPerKwh;
  return {
    jumlahIuran: TARIF.biayaTetap + subtotalAir + subtotalEnergi, // Algo-013
    // Bentuk mengikuti TagihanDTO.rincian di contracts/iuran.ts.
    dataPemakaianDasar: JSON.stringify({ volumeAirM3, energiKWh, biayaTetap: TARIF.biayaTetap, subtotalAir, subtotalEnergi }),
  };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diatur (lihat src/.env.example).");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  try {
    await prisma.$transaction(async (tx) => {
      for (const a of akunUji) {
        const data = { email: a.email, nama: a.nama, peran: a.peran, statusAkun: a.status, password: hashPassword(PASSWORD_UJI) };
        await tx.akun.upsert({ where: { idAkun: a.id }, create: { idAkun: a.id, ...data }, update: data });
      }

      // id_warga berasal dari sequence agar registrasi baru tidak bentrok.
      const wargaData = { idKomunitas: "KOM-01", statusTerdaftar: true };
      const warga1 = await tx.warga.upsert({ where: { idAkun: "AKN-WARGA-1" }, create: { idAkun: "AKN-WARGA-1", ...wargaData }, update: wargaData });
      const warga2 = await tx.warga.upsert({ where: { idAkun: "AKN-WARGA-2" }, create: { idAkun: "AKN-WARGA-2", ...wargaData }, update: wargaData });
      const kontak = "0800-0000-0001";
      await tx.teknisi.upsert({ where: { idAkun: "AKN-TEKNISI-1" }, create: { idTeknisi: "TEK-01", idAkun: "AKN-TEKNISI-1", kontak }, update: { kontak } });
      await tx.pengurus.upsert({ where: { idAkun: "AKN-PENGURUS-1" }, create: { idPengurus: "PGR-01", idAkun: "AKN-PENGURUS-1" }, update: {} });

      for (const p of perangkatUji) {
        await tx.perangkat.upsert({ where: { idPerangkat: p.idPerangkat }, create: p, update: p });
        const data = { idTeknisi: "TEK-01", idPerangkat: p.idPerangkat };
        await tx.penugasanPerangkat.upsert({ where: { idTeknisi_idPerangkat: data }, create: data, update: {} });
      }
      for (const b of pembacaanUji) {
        const data = { ...b, waktu: waktu("2026-10-28T10:20:00") };
        await tx.pembacaanSensor.upsert({ where: { idPembacaan: b.idPembacaan }, create: data, update: data });
      }
      for (const [i, [daya, energi]] of [[900, 0.9], [1800, 1.8], [2400, 2.4], [2100, 2.1], [1200, 1.2]].entries()) {
        const data = { idData: `KNR-${i + 1}`, idPanel: "PNL-01", waktu: waktu(`2026-10-28T${String(8 + i * 2).padStart(2, "0")}:00:00`), dayaDihasilkan: daya, energi };
        await tx.dataHistorisKinerja.upsert({ where: { idData: data.idData }, create: data, update: data });
      }

      // LAP-01 dan LAP-02 ditugaskan ke TEK-01. LAP-03 tidak ditugaskan untuk uji UC07 Alt 1.
      const laporanUji = [
        { idLaporan: "LAP-01", idWarga: warga1.idWarga, jenisGangguan: "Air tidak mengalir", deskripsi: "Keran blok A tidak mengalir sejak pagi.", status: "MENUNGGU", waktuDibuat: waktu("2026-10-28T08:10:00") },
        { idLaporan: "LAP-02", idWarga: warga1.idWarga, jenisGangguan: "Listrik padam", deskripsi: "Lampu jalan blok A mati.", status: "SEDANG_DIPERBAIKI", waktuDibuat: waktu("2026-10-27T19:00:00") },
        { idLaporan: "LAP-03", idWarga: warga2.idWarga, jenisGangguan: "Kebocoran pipa", deskripsi: "Pipa dekat balai warga bocor.", status: "MENUNGGU", waktuDibuat: waktu("2026-10-28T09:30:00") },
      ] as const;
      for (const l of laporanUji) {
        await tx.laporanGangguan.upsert({ where: { idLaporan: l.idLaporan }, create: l, update: l });
      }
      const riwayat = { idRiwayat: "RWY-01", idLaporan: "LAP-02", status: "SEDANG_DIPERBAIKI", timestamp: waktu("2026-10-28T07:00:00") } as const;
      await tx.riwayatStatusLaporan.upsert({ where: { idRiwayat: riwayat.idRiwayat }, create: riwayat, update: riwayat });
      for (const idLaporan of ["LAP-01", "LAP-02"]) {
        const kunci = { idTeknisi: "TEK-01", idLaporan };
        const data = { ...kunci, waktuPenugasan: waktu("2026-10-28T06:30:00") };
        await tx.penugasanLaporan.upsert({ where: { idTeknisi_idLaporan: kunci }, create: data, update: data });
      }

      const peringatan = {
        idNotifikasi: "NTF-01", idTeknisi: "TEK-01", idPerangkat: "BAT-01", pesan: "Kapasitas baterai komunal 15%, di bawah ambang aman 20%.",
        level: "KRITIS", kapasitasSaatIni: 15, statusPengiriman: "PENDING", waktu: waktu("2026-10-28T02:15:00"),
      } as const;
      await tx.notifikasi.upsert({ where: { idNotifikasi: peringatan.idNotifikasi }, create: peringatan, update: peringatan });

      const catatan = {
        idCatatan: "CTT-01", idTeknisi: "TEK-01", idPerangkat: "PNL-01", waktuPelaksanaan: waktu("2026-10-20T09:00:00"),
        tindakan: "Membersihkan permukaan panel.", catatanHasil: "Daya keluaran kembali normal.",
      };
      await tx.catatanPemeliharaan.upsert({ where: { idCatatan: catatan.idCatatan }, create: catatan, update: catatan });

      // PRD-2026-09 sudah FINAL. PRD-2026-10 belum final dan pemakaian warga 2 sengaja tidak lengkap (UC10 Alt 2).
      const periodeUji = [
        { idPeriode: "PRD-2026-09", bulan: 9, tahun: 2026, statusFinal: true },
        { idPeriode: "PRD-2026-10", bulan: 10, tahun: 2026, statusFinal: false },
      ];
      for (const p of periodeUji) {
        await tx.periode.upsert({ where: { idPeriode: p.idPeriode }, create: p, update: p });
        await tx.aturanTarif.upsert({ where: { idPeriode: p.idPeriode }, create: { idAturan: `TRF-${p.idPeriode}`, idPeriode: p.idPeriode, ...TARIF }, update: TARIF });
      }

      const pemakaianUji = [
        { idPemakaian: "PMK-09-1", idWarga: warga1.idWarga, idPeriode: "PRD-2026-09", volumeAirM3: 12.5, energiKwh: 80, waktuCatat: waktu("2026-09-30T23:00:00") },
        { idPemakaian: "PMK-09-2", idWarga: warga2.idWarga, idPeriode: "PRD-2026-09", volumeAirM3: 9, energiKwh: 60, waktuCatat: waktu("2026-09-30T23:00:00") },
        { idPemakaian: "PMK-10-1", idWarga: warga1.idWarga, idPeriode: "PRD-2026-10", volumeAirM3: 11, energiKwh: 75, waktuCatat: waktu("2026-10-31T23:00:00") },
        { idPemakaian: "PMK-10-2", idWarga: warga2.idWarga, idPeriode: "PRD-2026-10", volumeAirM3: 8, energiKwh: null, waktuCatat: null },
      ];
      for (const p of pemakaianUji) {
        await tx.dataPemakaian.upsert({ where: { idPemakaian: p.idPemakaian }, create: p, update: p });
      }

      const tagihanUji = [
        { idTagihan: "TGH-09-1", idWarga: warga1.idWarga, idPeriode: "PRD-2026-09", status: "FINAL", ...rincianTagihan(12.5, 80) },
        { idTagihan: "TGH-09-2", idWarga: warga2.idWarga, idPeriode: "PRD-2026-09", status: "FINAL", ...rincianTagihan(9, 60) },
      ] as const;
      for (const t of tagihanUji) {
        await tx.tagihan.upsert({ where: { idTagihan: t.idTagihan }, create: t, update: t });
      }
    });
    console.log("Seed selesai. Akun uji memakai SEED_PASSWORD atau password bawaan seed.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
