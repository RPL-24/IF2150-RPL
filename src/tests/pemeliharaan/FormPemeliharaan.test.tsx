/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormPemeliharaan from "@/components/layar/FormPemeliharaan";

const PERANGKAT = [
  { idPerangkat: "BAT-01", nama: "Baterai Komunal" },
  { idPerangkat: "PNL-01", nama: "Panel Atap Balai" },
];

const fetchTiruan = jest.fn<typeof fetch>();

const balasan = (isi: unknown) => ({ json: async () => isi }) as Response;

function isi(label: string | RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

const simpan = () => fireEvent.click(screen.getByRole("button", { name: "Simpan catatan" }));

beforeEach(() => {
  fetchTiruan.mockReset();
  global.fetch = fetchTiruan;
});
afterEach(cleanup);

describe("FormPemeliharaan", () => {
  it("mengirim isian dengan waktu WIB lalu mengosongkan formulir setelah sukses", async () => {
    fetchTiruan.mockResolvedValue(balasan({ ok: true, data: { idCatatan: "CTT-1" } }));
    render(<FormPemeliharaan perangkat={PERANGKAT} />);

    isi("Perangkat", "PNL-01");
    isi(/Waktu pemeliharaan/, "2026-10-28T11:00");
    isi("Tindakan", "Membersihkan panel");
    isi("Hasil pemeliharaan", "Daya normal");
    simpan();

    expect(await screen.findByText("Catatan pemeliharaan berhasil disimpan")).toBeInTheDocument();
    const [url, opsi] = fetchTiruan.mock.calls[0];
    expect(url).toBe("/api/pemeliharaan");
    expect(JSON.parse(opsi?.body as string)).toEqual({
      idPerangkat: "PNL-01",
      waktuPelaksanaan: "2026-10-28T11:00:00+07:00",
      tindakan: "Membersihkan panel",
      catatanHasil: "Daya normal",
    });
    expect(screen.getByLabelText("Tindakan")).toHaveValue("");
  });

  it("UC08 Alt 1: menandai kolom kosong dan mempertahankan isian lain", async () => {
    fetchTiruan.mockResolvedValue(
      balasan({
        ok: false,
        kode: "VALIDASI_GAGAL",
        pesan: "Isian belum lengkap",
        galat: [{ kolom: "catatanHasil", pesan: "Isi hasil pemeliharaan" }],
      }),
    );
    render(<FormPemeliharaan perangkat={PERANGKAT} />);

    isi("Tindakan", "Membersihkan panel");
    simpan();

    expect(await screen.findByText("Isi hasil pemeliharaan")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasil pemeliharaan")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Tindakan")).toHaveValue("Membersihkan panel");
  });

  it("menonaktifkan tombol selama penyimpanan", async () => {
    let selesai!: (r: Response) => void;
    fetchTiruan.mockReturnValue(new Promise((r) => (selesai = r)));
    render(<FormPemeliharaan perangkat={PERANGKAT} />);

    simpan();
    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();

    selesai(balasan({ ok: false, kode: "GAGAL_SIMPAN", pesan: "Penyimpanan gagal" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Penyimpanan gagal");
    await waitFor(() => expect(screen.getByRole("button", { name: "Simpan catatan" })).toBeEnabled());
  });

  it("mempertahankan isian saat jaringan gagal", async () => {
    fetchTiruan.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<FormPemeliharaan perangkat={PERANGKAT} />);

    isi("Tindakan", "Membersihkan panel");
    simpan();

    expect(await screen.findByRole("alert")).toHaveTextContent("Koneksi gagal");
    expect(screen.getByLabelText("Tindakan")).toHaveValue("Membersihkan panel");
  });
});
