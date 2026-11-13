"""C01 OneClickSOS, C03 Korban, C08 Polisi, C09 Rekaman (sisi server)."""
import time
import uuid
from datetime import datetime, timezone
from .. import config
from ..db import conn
from .layanan import haversine_km

DISCREET = {  # teks konfirmasi yang tidak mencurigakan jika terbaca orang lain
    "dikirim": "Pesanan Anda sedang diproses.",
    "diterima": "Pesanan Anda telah diterima penjual.",
    "dalam_perjalanan": "Pesanan Anda sedang dalam pengiriman.",
}


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Korban:  # C03 (data minimal, tanpa akun)
    def __init__(self, nama=None, lat=None, lon=None):
        self.namaKorban, self.lokasiKorban = nama, (lat, lon)

    def lokasiKorbanSekarang(self): return self.lokasiKorban


class OneClickSOS:  # C01
    @staticmethod
    def dapatLokasi(lat, lon) -> bool:
        return lat is not None and lon is not None

    @staticmethod
    def kirimSinyal(client_id: str, korban: Korban) -> tuple[str, bool]:
        """Idempoten terhadap client_id (antrean offline dapat mengirim ulang)."""
        lat, lon = korban.lokasiKorbanSekarang()
        with conn() as c:
            ex = c.execute("SELECT id FROM sos WHERE client_id=?", (client_id,)).fetchone()
            if ex:
                return ex["id"], False
            sid = uuid.uuid4().hex
            c.execute("INSERT INTO sos(id,client_id,nama,lat,lon,created_at) VALUES(?,?,?,?,?,?)",
                      (sid, client_id, korban.namaKorban, lat, lon, now()))
        return sid, True

    @staticmethod
    def menerimaReply(sos_id: str):
        with conn() as c:
            r = c.execute("SELECT status, reply, created_at FROM sos WHERE id=?", (sos_id,)).fetchone()
        if not r:
            return None
        return {"status": r["status"], "pesan": DISCREET.get(r["status"], ""),
                "reply": r["reply"], "created_at": r["created_at"]}


class Rekaman:  # C09
    @staticmethod
    def simpanRekamanSuara(sos_id: str, data: bytes, ext="webm") -> str:
        p = config.UPLOAD_DIR / f"{sos_id}_{int(time.time() * 1000)}.{ext}"
        p.write_bytes(data)
        with conn() as c:
            c.execute("INSERT INTO rekaman(sos_id,path,created_at) VALUES(?,?,?)",
                      (sos_id, str(p), now()))
        return p.name


class Polisi:  # C08
    @staticmethod
    def pantauAntarmuka(limit=50):
        with conn() as c:
            rows = c.execute(
                "SELECT s.*, (SELECT COUNT(*) FROM rekaman r WHERE r.sos_id=s.id) AS n_rekaman "
                "FROM sos s ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]

    @staticmethod
    def kirimPasukan(sos_id: str, polisi_id: int | None, status: str, reply: str | None):
        with conn() as c:
            cur = c.execute("UPDATE sos SET status=?, reply=?, polisi_id=? WHERE id=?",
                            (status, reply, polisi_id, sos_id))
            return cur.rowcount > 0

    @staticmethod
    def terdekat(lat, lon):
        with conn() as c:
            rows = c.execute("SELECT * FROM polisi WHERE tersedia=1").fetchall()
        return sorted(rows, key=lambda r: haversine_km(lat, lon, r["lat"], r["lon"]))
