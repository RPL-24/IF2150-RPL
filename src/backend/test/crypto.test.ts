import { describe, expect, test } from "vitest";
import { dekripsiAES256GCM, enkripsiAES256GCM, KunciTokenError } from "../src/lib/crypto";
import { KUNCI_UJI } from "./harness";

describe("AES-256-GCM token Google (Algo-001 / Algo-009)", () => {
  test("roundtrip plaintext", async () => {
    const asli = "ya29.access-token-rahasia~!@#";
    const enc = await enkripsiAES256GCM(asli, KUNCI_UJI);

    expect(enc).not.toContain(asli);
    expect(await dekripsiAES256GCM(enc, KUNCI_UJI)).toBe(asli);
  });

  test("ciphertext berbeda tiap enkripsi (IV acak)", async () => {
    const a = await enkripsiAES256GCM("sama", KUNCI_UJI);
    const b = await enkripsiAES256GCM("sama", KUNCI_UJI);

    expect(a).not.toBe(b);
    expect(await dekripsiAES256GCM(a, KUNCI_UJI)).toBe("sama");
    expect(await dekripsiAES256GCM(b, KUNCI_UJI)).toBe("sama");
  });

  test("menolak ciphertext yang diubah (auth tag)", async () => {
    const enc = await enkripsiAES256GCM("token", KUNCI_UJI);
    const bytes = Uint8Array.from(atob(enc), (ch) => ch.charCodeAt(0));
    bytes[bytes.length - 1] ^= 0xff;
    const rusak = btoa(String.fromCharCode(...bytes));

    await expect(dekripsiAES256GCM(rusak, KUNCI_UJI)).rejects.toThrow();
  });

  test("menolak kunci dengan panjang salah", async () => {
    const kunciPendek = Buffer.alloc(16, 1).toString("base64");
    await expect(enkripsiAES256GCM("x", kunciPendek)).rejects.toBeInstanceOf(
      KunciTokenError,
    );
  });

  test("menolak payload terlalu pendek", async () => {
    await expect(dekripsiAES256GCM("AAAA", KUNCI_UJI)).rejects.toBeInstanceOf(
      KunciTokenError,
    );
  });
});
