import { describe, expect, it } from "vitest";
import { gagal, ok } from "@/lib/action-result";

describe("ActionResult", () => {
  it("ok() membungkus data", () => {
    expect(ok("LK-0001")).toEqual({ ok: true, data: "LK-0001" });
  });

  it("gagal() membawa pesan error", () => {
    expect(gagal("Deskripsi wajib diisi")).toEqual({ ok: false, error: "Deskripsi wajib diisi" });
  });
});
