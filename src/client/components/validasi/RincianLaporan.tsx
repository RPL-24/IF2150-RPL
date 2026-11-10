import { DetailLaporan } from "@/client/components/shared/DetailLaporan";
import { MapView } from "@/client/components/shared/MapView";
import type { LaporanRincian } from "@/server/controllers/ValidasiController";

type Props = {
  rincian: LaporanRincian;
  sedangMemproses: boolean;
  onValidClicked: () => void;
  onTolakClicked: () => void;
};

export function RincianLaporan({ rincian, sedangMemproses, onValidClicked, onTolakClicked }: Props) {
  const titik = { latitude: rincian.latitude, longitude: rincian.longitude };

  return (
    <div className="space-y-4">
      <DetailLaporan laporan={rincian}>
        <button
          type="button"
          onClick={onValidClicked}
          disabled={sedangMemproses}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sedangMemproses ? "Memproses..." : "Validasi"}
        </button>
        <button
          type="button"
          onClick={onTolakClicked}
          disabled={sedangMemproses}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Tolak
        </button>
      </DetailLaporan>

      <section className="space-y-2 rounded-md border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-medium">Lokasi</h3>
        <MapView
          markers={[{ id: rincian.id, ...titik, status: rincian.status, label: rincian.id_tiket }]}
          idTerpilih={rincian.id}
          titikTerpilih={titik}
          tinggi="280px"
        />
      </section>
    </div>
  );
}
