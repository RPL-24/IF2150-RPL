"""C10 LaporanKekerasan: validasi (cekKelengkapan), enkripsi, penyimpanan."""
import json
import secrets
from datetime import date
from .. import crypto
from ..db import conn
from .sos import now

WAJIB = ["deskripsiKekerasan", "tanggalKekerasan", "lokasiKekerasan", "modePelapor"]
STATUS = ("baru", "ditinjau", "ditindaklanjuti", "selesai")


class LaporanKekerasan:
    def __init__(self, deskripsi=None, tanggal=None, lokasi=None, mode=None, nama=None):
        self.deskripsiKekerasan = (deskripsi or "").strip()
        self.tanggalKekerasan = (tanggal or "").strip()
        self.lokasiKekerasan = (lokasi or "").strip()
        self.modePelapor = (mode or "").strip()
        self.nama = (nama or "").strip()

    def cekKelengkapan(self) -> list[str]:
        """Mengembalikan daftar kolom bermasalah (kosong = lengkap)."""
        bad = [f for f in WAJIB if not getattr(self, f)]
        if self.modePelapor and self.modePelapor not in ("anonim", "identitas"):
            bad.append("modePelapor")
        if self.modePelapor == "identitas" and not self.nama:
            bad.append("nama")
        if self.tanggalKekerasan:
            try:
                if date.fromisoformat(self.tanggalKekerasan) > date.today():
                    bad.append("tanggalKekerasan")
            except ValueError:
                bad.append("tanggalKekerasan")
        return sorted(set(bad))

    def simpan(self, client_id: str) -> tuple[str, bool]:
        with conn() as c:
            ex = c.execute("SELECT token FROM laporan WHERE client_id=?", (client_id,)).fetchone()
            if ex:
                return ex["token"], False
            payload = {"deskripsi": self.deskripsiKekerasan, "tanggal": self.tanggalKekerasan,
                       "lokasi": self.lokasiKekerasan}
            if self.modePelapor == "identitas":  # mode anonim: nama TIDAK disimpan
                payload["nama"] = self.nama
            token = secrets.token_urlsafe(8)
            c.execute("INSERT INTO laporan(token,client_id,mode,payload_enc,created_at) VALUES(?,?,?,?,?)",
                      (token, client_id, self.modePelapor,
                       crypto.encrypt(json.dumps(payload, ensure_ascii=False)), now()))
        return token, True

    @staticmethod
    def daftar_untuk_polisi():
        with conn() as c:
            rows = c.execute("SELECT * FROM laporan ORDER BY id DESC LIMIT 100").fetchall()
        return [{"token": r["token"], "mode": r["mode"], "created_at": r["created_at"],
                 "status": r["status"], "catatan": r["catatan"], "pesan_pelapor": r["pesan_pelapor"],
                 **json.loads(crypto.decrypt(r["payload_enc"]))} for r in rows]

    @staticmethod
    def perbarui_status(token: str, status: str, catatan: str | None, pesan_pelapor: str | None = None) -> bool:
        if status not in STATUS:
            raise ValueError("status tidak dikenal")
        with conn() as c:
            cur = c.execute("UPDATE laporan SET status=?, catatan=?, pesan_pelapor=?, updated_at=? WHERE token=?",
                            (status, catatan, pesan_pelapor, now(), token))
            return cur.rowcount > 0

    @staticmethod
    def status_publik(token: str):
        """Hanya status dan pesan untuk pelapor. Isi laporan, nama, dan catatan internal tidak pernah dikembalikan."""
        with conn() as c:
            r = c.execute("SELECT status, pesan_pelapor, created_at, updated_at FROM laporan WHERE token=?", (token,)).fetchone()
        if not r:
            return None
        return {"status": r["status"], "pesan": r["pesan_pelapor"], "diterima": r["created_at"],
                "diperbarui": r["updated_at"] or r["created_at"]}
