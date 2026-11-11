import Link from "next/link";
import PageTitle from "@/components/shell/PageTitle";
import { Alert } from "@/components/ui";
import { buatLaporanController } from "@/modules/laporan";
import DaftarLaporan from "@/modules/laporan/ui/DaftarLaporan";
import { sesiLayar } from "@/modules/laporan/ui/sesi";

export default async function LayarI06() {
  const sesi = await sesiLayar("WARGA");
  const hasil = await buatLaporanController(sesi).daftarMilikWarga();

  return (
    <>
      <PageTitle
        judul="Laporan saya"
        deskripsi="Pantau gangguan yang Anda laporkan."
        aksi={
          <Link className="btn primary" href="/dashboard/warga/laporan/baru">
            Laporan baru
          </Link>
        }
      />
      {hasil.ok ? (
        <DaftarLaporan
          judulPanel="Laporan milik Anda"
          satuan="laporan"
          labelAksi="Lihat detail"
          kosong="Belum ada laporan. Laporan gangguan Anda akan muncul di sini setelah tersimpan."
          baris={hasil.data.map((l) => ({
            id: l.idLaporan,
            judul: l.jenisGangguan,
            keterangan: "",
            status: l.status,
            waktu: l.waktuDibuat,
            href: `/dashboard/warga/laporan/${l.idLaporan}`,
          }))}
        />
      ) : (
        <Alert nada="bahaya">Daftar laporan gagal dimuat. Muat ulang halaman ini.</Alert>
      )}
      <div className="note">
        <strong>Hanya laporan Anda</strong>
        <br />
        Daftar ini hanya berisi laporan milik akun yang sedang masuk.
      </div>
    </>
  );
}
