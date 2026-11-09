import Link from "next/link";
import { tautanGoogleMaps, tautanHasilPerbaikan } from "./tautan";
import { DetailLaporan } from "../shared/DetailLaporan";
import { MapView } from "../shared/MapView";
import { formatWaktu } from "@/lib/format";
import type { RincianTugas } from "@/server/entities/ListTugas";
import type { Enums } from "@/types/database";

const KEPUTUSAN_LABEL = {
    selesai: "Selesai",
    belum_selesai: "Belum selesai",
    minta_ulang_bukti: "Minta ulang bukti",
} as const satisfies Record<Enums<"keputusan_evaluasi">, string>;

export function PanelRincianTugas({ rincian }: { rincian: RincianTugas }) {
    const { latitude, longitude } = rincian;

    return (
        <div className="space-y-4">
            {rincian.evaluasiTerakhir && (
                <div role="note" className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                    <p className="font-medium">
                        Dikembalikan Tim Administrasi: {KEPUTUSAN_LABEL[rincian.evaluasiTerakhir.keputusan]} ·{" "}
            {formatWaktu(rincian.evaluasiTerakhir.waktu_evaluasi)}
                    </p>
                    {rincian.evaluasiTerakhir.catatan && 
                    <p className="mt-1">
                        {rincian.evaluasiTerakhir.catatan}
                    </p>
                    }
                </div>
            )}

            {/* I05-06 -- I05-08 */}
            <DetailLaporan laporan={rincian} />

            {/* I05-09 */}
            <section aria-label="Lokasi" className="space-y-2">
                <h3 className="text-sm font-medium">Lokasi</h3>
                <MapView titikTerpilih={{ latitude, longitude}} tinggi="220px"/>
                <p className="text-xs text-gray-500">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)} · {rincian.jumlah_upvote} upvotes
                </p>
            </section>

            <div className="flex flex-col gap-2"></div>
        </div>
    )
}