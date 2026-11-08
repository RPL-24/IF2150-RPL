import prisma from '../src/database/prisma';
import { Role } from '@prisma/client';
import { ID_PREFIX, generateEntityId } from '../src/utils/idGenerator';

async function main() {

  const kategoriList = [
    {
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 1), // 005001
      jenisJasa: 'Jasa Kebersihan Rumah',
      deskripsiJasa: 'Layanan bersih-bersih rumah, kos, dan apartemen menyeluruh.',
      tarif: 75000,
      jamKerja: '08:00 - 17:00',
      daerahKerja: 'Coblong, Dago, Bandung Utara',
    },
    {
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 2), // 005002
      jenisJasa: 'Perbaikan Elektronik & AC',
      deskripsiJasa: 'Servis cuci AC, perbaikan kulkas, mesin cuci, dan instalasi listrik.',
      tarif: 120000,
      jamKerja: '09:00 - 20:00',
      daerahKerja: 'Seluruh Kota Bandung',
    },
    {
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 3), // 005003
      jenisJasa: 'Tukang Ledeng & Pipa',
      deskripsiJasa: 'Perbaikan pipa bocor, saluran mampet, dan pemasangan pompa air.',
      tarif: 95000,
      jamKerja: '07:00 - 18:00',
      daerahKerja: 'Buah Batu, Lengkong, Bandung Selatan',
    },
  ];

  for (const kat of kategoriList) {
    await prisma.kategoriJasa.upsert({
      where: { idKategoriJasa: kat.idKategoriJasa },
      update: kat,
      create: kat,
    });
  }

  // 2. Seed Pengguna: Pelanggan (Pola id_pengguna 001XXX)
  const idPelanggan = generateEntityId(ID_PREFIX.PENGGUNA, 1); // 001001
  await prisma.pengguna.upsert({
    where: { username: 'budi_pelanggan' },
    update: {},
    create: {
      idPengguna: idPelanggan,
      namaPengguna: 'Budi Santoso',
      username: 'budi_pelanggan',
      password: 'hashed_password_123',
      email: 'budi@example.com',
      nomorTelpon: '081234567890',
      role: Role.PELANGGAN,
      akumulasiRating: 4.8,
      riwayatRating: [5.0, 4.6],
    },
  });

  // 3. Seed Pengguna & Pemberi Jasa (Pola id_pemberi_jasa 002XXX)
  const providers = [
    {
      idPemberiJasa: generateEntityId(ID_PREFIX.PEMBERI_JASA, 1), // 002001
      namaPengguna: 'Ahmad Teknik',
      username: 'ahmad_teknik',
      email: 'ahmad@cariuang.id',
      nomorTelpon: '081298765431',
      akumulasiRating: 4.9,
      riwayatRating: [5.0, 4.8, 4.9],
      namaToko: 'Ahmad Jaya AC & Elektronik',
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 2), // 005002
      jenisJasa: 'Perbaikan Elektronik & AC',
      latitude: -6.8915, // Sekitar ITB Ganesha / Dago (dekat)
      longitude: 107.6107,
    },
    {
      idPemberiJasa: generateEntityId(ID_PREFIX.PEMBERI_JASA, 2), // 002002
      namaPengguna: 'Siti Bersih',
      username: 'siti_clean',
      email: 'siti@cariuang.id',
      nomorTelpon: '081298765432',
      akumulasiRating: 4.7,
      riwayatRating: [4.7],
      namaToko: 'Kinclong Home Cleaning',
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 1), // 005001
      jenisJasa: 'Jasa Kebersihan Rumah',
      latitude: -6.8850, // Sekitar Cisitu / Coblong
      longitude: 107.6135,
    },
    {
      idPemberiJasa: generateEntityId(ID_PREFIX.PEMBERI_JASA, 3), // 002003
      namaPengguna: 'Kang Dedi Pipa',
      username: 'dedi_ledeng',
      email: 'dedi@cariuang.id',
      nomorTelpon: '081298765433',
      akumulasiRating: 4.5,
      riwayatRating: [4.5],
      namaToko: 'Dedi Plumbing Bandung',
      idKategoriJasa: generateEntityId(ID_PREFIX.KATEGORI_JASA, 3), // 005003
      jenisJasa: 'Tukang Ledeng & Pipa',
      latitude: -6.9430, // Sekitar Buah Batu (lebih jauh)
      longitude: 107.6335,
    },
  ];

  for (const prov of providers) {
    await prisma.pengguna.upsert({
      where: { username: prov.username },
      update: {
        akumulasiRating: prov.akumulasiRating,
        riwayatRating: prov.riwayatRating,
      },
      create: {
        idPengguna: prov.idPemberiJasa,
        namaPengguna: prov.namaPengguna,
        username: prov.username,
        password: 'hashed_password_123',
        email: prov.email,
        nomorTelpon: prov.nomorTelpon,
        role: Role.PEMBERI_JASA,
        akumulasiRating: prov.akumulasiRating,
        riwayatRating: prov.riwayatRating,
      },
    });

    await prisma.pemberiJasa.upsert({
      where: { idPemberiJasa: prov.idPemberiJasa },
      update: {
        namaToko: prov.namaToko,
        idKategoriJasa: prov.idKategoriJasa,
        jenisJasa: prov.jenisJasa,
        latitude: prov.latitude,
        longitude: prov.longitude,
      },
      create: {
        idPemberiJasa: prov.idPemberiJasa,
        namaToko: prov.namaToko,
        idKategoriJasa: prov.idKategoriJasa,
        jenisJasa: prov.jenisJasa,
        latitude: prov.latitude,
        longitude: prov.longitude,
        statusKetersediaan: 'Available',
        isOnline: true,
      },
    });
  }

  // 4. Seed Pengguna & Layanan Pelanggan (Pola id_layanan_pelanggan 004XXX)
  const idLayananPelanggan = generateEntityId(ID_PREFIX.LAYANAN_PELANGGAN, 1); // 004001
  await prisma.pengguna.upsert({
    where: { username: 'cs_cariuang' },
    update: {},
    create: {
      idPengguna: idLayananPelanggan,
      namaPengguna: 'Rina Customer Care',
      username: 'cs_cariuang',
      password: 'hashed_password_123',
      email: 'cs@cariuang.id',
      nomorTelpon: '081100001111',
      role: Role.LAYANAN_PELANGGAN,
    },
  });

  await prisma.layananPelanggan.upsert({
    where: { idLayananPelanggan },
    update: {},
    create: {
      idLayananPelanggan,
      status: 'Available',
      jumlahTiketDipegang: 0,
    },
  });

  console.log('✅ Seeding database CariUang selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
