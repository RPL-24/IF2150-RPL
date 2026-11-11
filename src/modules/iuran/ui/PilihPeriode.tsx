"use client";

import { useCallback, useEffect, useState } from "react";
import type { PeriodeDTO } from "@/contracts";
import { Field, Select } from "@/components/ui";
import { labelPeriode } from "../internal/format";
import { panggil } from "./api";

export type StatusMuat = "memuat" | "galat" | "siap";

// Memuat daftar periode dan menyaringnya sesuai layar (mis. hanya yang belum final).
export function useDaftarPeriode(saring: (p: PeriodeDTO) => boolean) {
  const [status, setStatus] = useState<StatusMuat>("memuat");
  const [periode, setPeriode] = useState<PeriodeDTO[]>([]);
  const [versi, setVersi] = useState(0);

  useEffect(() => {
    let batal = false;
    setStatus("memuat");
    panggil<PeriodeDTO[]>("/api/iuran/periode").then((hasil) => {
      if (batal) return;
      if (hasil.ok) {
        setPeriode(hasil.data.filter(saring));
        setStatus("siap");
      } else {
        setStatus("galat");
      }
    });
    return () => {
      batal = true;
    };
    // saring didefinisikan di luar komponen (stabil); versi memicu muat ulang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versi]);

  const muatUlang = useCallback(() => setVersi((v) => v + 1), []);
  return { status, periode, muatUlang };
}

export default function PilihPeriode({
  periode,
  nilai,
  onUbah,
  label = "Periode",
}: {
  periode: PeriodeDTO[];
  nilai: string;
  onUbah: (idPeriode: string) => void;
  label?: string;
}) {
  return (
    <Field label={label}>
      {(p) => (
        <Select {...p} value={nilai} onChange={(e) => onUbah(e.target.value)}>
          <option value="">Pilih periode</option>
          {periode.map((x) => (
            <option key={x.idPeriode} value={x.idPeriode}>
              {labelPeriode(x)}
              {x.statusFinal ? " · FINAL" : ""}
            </option>
          ))}
        </Select>
      )}
    </Field>
  );
}
