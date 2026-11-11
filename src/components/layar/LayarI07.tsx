import Link from "next/link";
import PageTitle from "@/components/shell/PageTitle";
import { Alert, Badge, Card } from "@/components/ui";
import { buatLaporanController } from "@/modules/laporan";
import { waktuWib } from "@/modules/laporan/ui/format";
import RiwayatStatus from "@/modules/laporan/ui/RiwayatStatus";
import { sesiLayar } from "@/modules/laporan/ui/sesi";
import StatusBadge from "@/modules/laporan/ui/StatusBadge";

const KE_DAFTAR = (
  <Link className="btn" href="/dashboard/warga/laporan">
    Laporan saya
  </Link>
);

export default async function LayarI07({ id }: { id: string }) {
  const sesi = await sesiLayar("WARGA");
  const controller = buatLaporanController(sesi);
  const [detail, riwayat] = await Promise.all([controller.detailMilikWarga(id), controller.riwayatMilikWarga(id)]);

  if (!detail.ok && detail.kode === "TIDAK_DITEMUKAN") {
    return (
      <>
        <PageTitle judul="Detail laporan" deskripsi="Perkembangan laporan milik Anda, dari awal hingga selesai." aksi={KE_DAFTAR} />
        <Card>
          <p style={{ margin: "0 0 12px" }}>
            <Badge nada="bahaya">Akses dibatasi</Badge>
          </p>
          <h2 style={{ fontSize: 26 }}>Laporan tidak tersedia untuk akun ini</h2>
          <p style={{ margin: "10px 0 20px", color: "var(--muted)" }}>
            Periksa kembali tautan atau pilih laporan dari daftar milik Anda.
          </p>
          <Link className="btn primary" href="/dashboard/warga/laporan">
            Laporan saya
          </Link>
        </Card>
      </>
    );
  }
  if (!detail.ok || !riwayat.ok) return <Alert nada="bahaya">Detail laporan gagal dimuat. Muat ulang halaman ini.</Alert>;

  const l = detail.data;
  return (
    <>
      <PageTitle judul="Detail laporan" deskripsi="Perkembangan laporan milik Anda, dari awal hingga selesai." aksi={KE_DAFTAR} />
      <div className="dua-kolom">
        <Card>
          <h2 style={{ fontSize: 26 }}>{l.jenisGangguan}</h2>
          <p style={{ margin: "14px 0 20px" }}>
            <StatusBadge status={l.status} />
          </p>
          <dl className="facts">
            <div>
              <dt>Nomor laporan</dt>
              <dd>{l.idLaporan}</dd>
            </div>
            <div>
              <dt>Diajukan</dt>
              <dd>{waktuWib(l.waktuDibuat)}</dd>
            </div>
            <div>
              <dt>Jenis gangguan</dt>
              <dd>{l.jenisGangguan}</dd>
            </div>
            <div>
              <dt>Pemilik</dt>
              <dd>{l.namaPemilik} · Akun Anda</dd>
            </div>
          </dl>
          <hr className="garis" />
          <p>{l.deskripsi}</p>
          <small>{l.fotoPendukung.length === 0 ? "Tidak ada foto dilampirkan." : `${l.fotoPendukung.length} foto dilampirkan.`}</small>
        </Card>
        <section aria-labelledby="judul-riwayat">
          <h2 id="judul-riwayat" style={{ marginBottom: 16 }}>
            Perkembangan · waktu menaik
          </h2>
          <RiwayatStatus waktuDibuat={l.waktuDibuat} riwayat={riwayat.data} />
        </section>
      </div>
    </>
  );
}
