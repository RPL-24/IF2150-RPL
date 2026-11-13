"""C04 Peta, C05 ListLayanan, C06 Layanan, C11 APILayanan."""
import math
from dataclasses import dataclass, field
from ..db import conn


def haversine_km(lat1, lon1, lat2, lon2) -> float:
    r = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


@dataclass
class Layanan:  # C06
    id: int
    namalayanan: str
    jenis: str
    lokasiLayanan: tuple
    kontakLayanan: str | None = None
    jarak_km: float | None = None
    alamat: str | None = None
    fasilitas: str | None = None

    def ambilNama(self): return self.namalayanan
    def ambilLokasi(self): return self.lokasiLayanan
    def ambilKontak(self): return self.kontakLayanan

    def to_dict(self):
        return {"id": self.id, "nama": self.namalayanan, "jenis": self.jenis,
                "lat": self.lokasiLayanan[0], "lon": self.lokasiLayanan[1],
                "kontak": self.kontakLayanan,
                "jarak_km": None if self.jarak_km is None else round(self.jarak_km, 2),
                "alamat": self.alamat,
                "fasilitas": [x for x in (self.fasilitas or "").split("|") if x]}

    @staticmethod
    def ambilDataLayanan(layanan_id: int):
        with conn() as c:
            r = c.execute("SELECT * FROM layanan WHERE id=?", (layanan_id,)).fetchone()
        if not r:
            return None
        return Layanan(r["id"], r["nama"], r["jenis"], (r["lat"], r["lon"]), r["kontak"],
                       alamat=r["alamat"], fasilitas=r["fasilitas"])


@dataclass
class Peta:  # C04
    lokasiPeta: tuple = (0.0, 0.0)

    def lokasiPetaSekarang(self): return self.lokasiPeta

    def lokasiSekitar(self, korban_lokasi: tuple):
        self.lokasiPeta = korban_lokasi
        return self.lokasiPeta


class APILayanan:  # C11
    urlAPI = "/api/layanan"

    def ambilDataLayanan(self, peta: Peta, radius_km=10.0, use_index=True):
        lat, lon = peta.lokasiPetaSekarang()
        with conn() as c:
            if use_index:  # bounding box memakai idx_layanan_lat_lon
                dlat = radius_km / 111.0
                dlon = radius_km / (111.0 * max(math.cos(math.radians(lat)), 0.01))
                rows = c.execute(
                    "SELECT * FROM layanan WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?",
                    (lat - dlat, lat + dlat, lon - dlon, lon + dlon)).fetchall()
            else:  # baseline: pindai seluruh tabel
                rows = c.execute("SELECT * FROM layanan").fetchall()
        return rows


@dataclass
class ListLayanan:  # C05
    kumpulanLayanan: list = field(default_factory=list)

    def ambilLayananTersedia(self, peta: Peta, radius_km=10.0, limit=20,
                             jenis=None, use_index=True):
        lat, lon = peta.lokasiPetaSekarang()
        out = []
        for r in APILayanan().ambilDataLayanan(peta, radius_km, use_index):
            d = haversine_km(lat, lon, r["lat"], r["lon"])
            if d <= radius_km and (not jenis or r["jenis"] == jenis):
                out.append(Layanan(r["id"], r["nama"], r["jenis"],
                                   (r["lat"], r["lon"]), r["kontak"], d,
                                   r["alamat"], r["fasilitas"]))
        out.sort(key=lambda x: x.jarak_km)
        self.kumpulanLayanan = out[:limit]
        return self.kumpulanLayanan
