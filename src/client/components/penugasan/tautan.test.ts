import { describe, expect, it } from "vitest";
import { tautanGoogleMaps, tautanHasilPerbaikan } from "@/client/components/penugasan/tautan";

describe("tautanGoogleMaps", () => {
  it("memakai format search Google Maps dengan lat,lng", () => {
    expect(tautanGoogleMaps(-6.9178, 107.6027)).toBe(
      "https://www.google.com/maps/search/?api=1&query=-6.9178,107.6027",
    );
  });
});

describe("tautanHasilPerbaikan", () => {
  it("mengarah ke formulir hasil perbaikan tiket tersebut", () => {
    expect(tautanHasilPerbaikan("LK-0009")).toBe("/tugas/LK-0009/hasil");
  });

  it("meng-encode karakter yang tidak aman untuk URL", () => {
    expect(tautanHasilPerbaikan("LK 1/2")).toBe("/tugas/LK%201%2F2/hasil");
  });
});