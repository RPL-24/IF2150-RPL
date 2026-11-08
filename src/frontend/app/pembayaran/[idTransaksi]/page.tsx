"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { ApiError, ambilTransaksi, type TransaksiPembayaran } from "@/lib/api";

const rupiah = (n: number) => `Rp. ${n.toLocaleString("id-ID")}`;

export default function PembayaranPage() {
  const { idTransaksi } = useParams<{ idTransaksi: string }>();
  const [trx, setTrx] = useState<TransaksiPembayaran | null>(null);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    let batal = false;
    ambilTransaksi(idTransaksi)
      .then((t) => { if (!batal) setTrx(t); })
      .catch((e) => { if (!batal) setPesan(e instanceof ApiError ? e.message : "Terjadi kesalahan"); });
    return () => { batal = true; };
  }, [idTransaksi]);

  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="Pembayaran"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      {!trx ? (
        <p className="text-[#5d625b]">{pesan || "Memuat..."}</p>
      ) : (
        <>
          {/* the summary <div> from #14 */}
          <div className="rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-4 shadow-sm">
            {trx.items.map((i) => (
              <div key={i.id_listing} className="flex items-start justify-between gap-3 py-1">
                <div>
                  <p className="font-bold text-[#1b8ca3]">{i.nama_makanan}</p>
                  <p className="text-sm text-[#5d625b]">{i.jumlah} porsi × {rupiah(i.harga_satuan)}</p>
                </div>
                <p className="font-bold">{rupiah(i.jumlah * i.harga_satuan)}</p>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t border-[#d6cebb] pt-3 text-lg font-bold">
              <span>Total</span>
              <span>{rupiah(trx.total_harga)}</span>
            </div>
          </div>

          {/* the QRIS card from #15 */}
          {trx.kode_qris && (
            <div className="mt-4 rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-4 text-center shadow-sm">
              <img src={trx.kode_qris} alt="QRIS dummy" className="mx-auto w-56" />
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}