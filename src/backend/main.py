"""Lapisan API (FastAPI). Merealisasikan C02 AntarmukaPolisi (rute /api/polisi/*)
dan menyajikan klien web (C07 AntarmukaTelepon, C12 AntarmukaPetaLayanan)."""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import config
from .db import conn, init_db
from .domain.laporan import LaporanKekerasan
from .domain.layanan import APILayanan, Layanan, ListLayanan, Peta, haversine_km
from .domain.sos import Korban, OneClickSOS, Polisi, Rekaman
from .seed import seed_if_empty

FRONTEND = Path(__file__).resolve().parent.parent / "frontend"


@asynccontextmanager
async def lifespan(app):
    init_db()
    seed_if_empty()
    yield


app = FastAPI(title="SafeShe API", lifespan=lifespan)


# ---------- Skema ----------
class SOSIn(BaseModel):
    client_id: str = Field(min_length=8, max_length=64)
    nama: str | None = Field(default=None, max_length=80)
    lat: float | None = Field(default=None, ge=-90, le=90)
    lon: float | None = Field(default=None, ge=-180, le=180)


class LaporanIn(BaseModel):
    client_id: str = Field(min_length=8, max_length=64)
    deskripsi: str | None = None
    tanggal: str | None = None
    lokasi: str | None = None
    mode: str | None = None
    nama: str | None = None


class ReplyIn(BaseModel):
    status: str = Field(pattern="^(diterima|dalam_perjalanan)$")
    reply: str | None = None
    polisi_id: int | None = None


class TindakIn(BaseModel):
    status: str = Field(pattern="^(baru|ditinjau|ditindaklanjuti|selesai)$")
    catatan: str | None = Field(default=None, max_length=1000)
    pesan_pelapor: str | None = Field(default=None, max_length=500)


def polisi_auth(x_api_key: str = Header(default="")):
    if x_api_key != config.POLICE_KEY:
        raise HTTPException(401, "API key polisi tidak valid")


# ---------- UC01, UC06, UC07: SOS ----------
@app.post("/api/sos", status_code=202)
def buat_sos(body: SOSIn):
    if not OneClickSOS.dapatLokasi(body.lat, body.lon):
        raise HTTPException(422, "Lokasi diperlukan untuk mengirim SOS")
    sid, baru = OneClickSOS.kirimSinyal(body.client_id, Korban(body.nama, body.lat, body.lon))
    return {"sos_id": sid, "baru": baru, "rekam": True}  # rekam=True -> sinyalMikrofon()


@app.post("/api/sos/{sos_id}/recording", status_code=201)
async def unggah_rekaman(sos_id: str, file: UploadFile = File(...)):
    with conn() as c:
        if not c.execute("SELECT 1 FROM sos WHERE id=?", (sos_id,)).fetchone():
            raise HTTPException(404, "SOS tidak ditemukan")
    data = await file.read(config.MAX_UPLOAD_BYTES + 1)
    if len(data) > config.MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Rekaman terlalu besar")
    return {"file": Rekaman.simpanRekamanSuara(sos_id, data)}


@app.get("/api/sos/{sos_id}/status")
def status_sos(sos_id: str):
    r = OneClickSOS.menerimaReply(sos_id)
    if r is None:
        raise HTTPException(404, "SOS tidak ditemukan")
    return r


# ---------- UC05: laporan ----------
@app.post("/api/laporan", status_code=201)
def buat_laporan(body: LaporanIn):
    lap = LaporanKekerasan(body.deskripsi, body.tanggal, body.lokasi, body.mode, body.nama)
    bad = lap.cekKelengkapan()
    if bad:
        return JSONResponse(status_code=422, content={
            "detail": "Formulir belum lengkap atau tidak valid", "kolom": bad})
    token, _ = lap.simpan(body.client_id)
    return {"token": token}


@app.get("/api/laporan/{token}/status")
def status_laporan(token: str):
    r = LaporanKekerasan.status_publik(token)
    if r is None:
        raise HTTPException(404, "Kode laporan tidak ditemukan")
    return r


# ---------- UC02, UC03, UC04: layanan ----------
@app.get("/api/layanan/nearby")
def layanan_terdekat(lat: float, lon: float, radius_km: float = 10, limit: int = 20,
                     jenis: str | None = None):
    peta = Peta()
    peta.lokasiSekitar((lat, lon))
    items = ListLayanan().ambilLayananTersedia(peta, min(radius_km, 50), min(limit, 50), jenis)
    return {"items": [x.to_dict() for x in items], "sumber": APILayanan.urlAPI}


@app.get("/api/layanan/{layanan_id}")
def detail_layanan(layanan_id: int):
    lay = Layanan.ambilDataLayanan(layanan_id)
    if not lay:
        raise HTTPException(404, "Layanan tidak ditemukan")
    d = lay.to_dict()
    d["kontak_tersedia"] = bool(lay.ambilKontak())  # alternatif UC04: kontak kosong
    return d


# ---------- Antarmuka polisi (C02) ----------
@app.get("/api/polisi/sos", dependencies=[Depends(polisi_auth)])
def polisi_daftar_sos():
    out = []
    for s in Polisi.pantauAntarmuka():
        s["unit"] = None
        if s["lat"] is not None and s["lon"] is not None:
            unit = Polisi.terdekat(s["lat"], s["lon"])
            if unit:
                u = unit[0]
                s["unit"] = {"id": u["id"], "nama": u["nama"],
                             "jarak_km": round(haversine_km(s["lat"], s["lon"], u["lat"], u["lon"]), 2)}
        out.append(s)
    return out


@app.post("/api/polisi/sos/{sos_id}/reply", dependencies=[Depends(polisi_auth)])
def polisi_reply(sos_id: str, body: ReplyIn):
    if not Polisi.kirimPasukan(sos_id, body.polisi_id, body.status, body.reply):
        raise HTTPException(404, "SOS tidak ditemukan")
    return {"ok": True}


@app.get("/api/polisi/sos/{sos_id}/recordings", dependencies=[Depends(polisi_auth)])
def polisi_rekaman(sos_id: str):
    with conn() as c:
        rows = c.execute("SELECT id,created_at FROM rekaman WHERE sos_id=? ORDER BY id", (sos_id,)).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/polisi/recordings/{rid}", dependencies=[Depends(polisi_auth)])
def polisi_unduh_rekaman(rid: int):
    with conn() as c:
        r = c.execute("SELECT path FROM rekaman WHERE id=?", (rid,)).fetchone()
    if not r:
        raise HTTPException(404, "Rekaman tidak ditemukan")
    return FileResponse(r["path"], media_type="audio/webm")


@app.get("/api/polisi/laporan", dependencies=[Depends(polisi_auth)])
def polisi_laporan():
    return LaporanKekerasan.daftar_untuk_polisi()


@app.post("/api/polisi/laporan/{token}/tindak", dependencies=[Depends(polisi_auth)])
def polisi_tindak_laporan(token: str, body: TindakIn):
    if not LaporanKekerasan.perbarui_status(token, body.status, (body.catatan or "").strip() or None,
                                        (body.pesan_pelapor or "").strip() or None):
        raise HTTPException(404, "Laporan tidak ditemukan")
    return {"ok": True}


app.mount("/", StaticFiles(directory=FRONTEND, html=True), name="frontend")
