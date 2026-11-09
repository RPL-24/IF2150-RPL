// src/app/api/iuran/rekapitulasi/ekspor/route.ts
import { NextResponse } from "next/server";
import type { FormatEkspor } from "@/contracts";
import { GalatAuth } from "@/lib/auth/konteks";
import { wajibPeran } from "@/lib/auth/server";
import { Rekapitulasi } from "@/modules/iuran/internal/Rekapitulasi";
import { repositoriIuran } from "@/modules/iuran/repository";
import { buatIuranService } from "@/modules/iuran/service";
import { responGalat, STATUS_HTTP } from "../../_utils";

export async function GET(req: Request) {
  let sesi;
  try {
    sesi = await wajibPeran("PENGURUS");
  } catch (e) {
    if (e instanceof GalatAuth) {
      return e.kode === "TIDAK_LOGIN"
        ? responGalat("TIDAK_TERAUTENTIKASI", "Silakan masuk terlebih dahulu.")
        : responGalat("TIDAK_BERWENANG", "Akses ditolak.");
    }
    return responGalat("GAGAL_INTERNAL", "Terjadi kesalahan. Coba lagi.");
  }

  const { searchParams } = new URL(req.url);
  const idPeriode = searchParams.get("idPeriode") ?? "";
  const formatRaw = (searchParams.get("format") ?? "CSV").toUpperCase();
  const unduhLangsung = searchParams.get("unduh") === "1";

  if (formatRaw !== "CSV" && formatRaw !== "PDF") {
    return responGalat("VALIDASI_GAGAL", "Format ekspor harus CSV atau PDF.");
  }
  const format = formatRaw as FormatEkspor;

  const service = buatIuranService(sesi, repositoriIuran);

  if (unduhLangsung) {
    const hasilRekap = await service.buatRekapitulasi(idPeriode);
    if (!hasilRekap.ok) {
      return NextResponse.json(hasilRekap, { status: STATUS_HTTP[hasilRekap.kode] });
    }
    const periode = await repositoriIuran.ambilPeriodeById(idPeriode);

    if (format === "CSV") {
      const csv = Rekapitulasi.toCSV(hasilRekap.data);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="rekapitulasi-${idPeriode}.csv"`,
        },
      });
    } else {
      const pdfBuf = Rekapitulasi.toPDFBuffer(hasilRekap.data, periode ?? undefined);
      return new NextResponse(pdfBuf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="rekapitulasi-${idPeriode}.pdf"`,
        },
      });
    }
  }

  const hasil = await service.ekspor(idPeriode, format);
  return NextResponse.json(hasil, { status: hasil.ok ? 200 : STATUS_HTTP[hasil.kode] });
}