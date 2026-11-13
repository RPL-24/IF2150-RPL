"""Uji logika inti SafeShe. Jalankan dari folder src/:  python -m pytest tests -v"""
import os
import sqlite3
import tempfile

os.environ["SAFESHE_DATA_DIR"] = tempfile.mkdtemp(prefix="safeshe_test_")

import pytest
from fastapi.testclient import TestClient

from backend import config
from backend.domain.layanan import haversine_km
from backend.main import app

KEY = {"X-API-Key": config.POLICE_KEY}
LAPOR_OK = {"client_id": "lap-0001-aaaa", "deskripsi": "Rahasia deskripsi uji", "tanggal": "2024-01-02",
            "lokasi": "Jalan Contoh 1", "mode": "anonim", "nama": "Tidak Disimpan"}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:  # menjalankan lifespan (init_db + seed)
        yield c


def test_haversine_bandung_jakarta():
    d = haversine_km(-6.9175, 107.6191, -6.2088, 106.8456)
    assert 110 < d < 125


def test_nearby_sorted_and_in_radius(client):
    r = client.get("/api/layanan/nearby", params={"lat": -6.8915, "lon": 107.6107, "radius_km": 5})
    assert r.status_code == 200
    items = r.json()["items"]
    assert items and all(i["jarak_km"] <= 5 for i in items)
    assert [i["jarak_km"] for i in items] == sorted(i["jarak_km"] for i in items)


def test_nearby_filter_jenis(client):
    items = client.get("/api/layanan/nearby", params={"lat": -6.8915, "lon": 107.6107, "jenis": "konseling"}).json()["items"]
    assert items and {i["jenis"] for i in items} == {"konseling"}


def test_detail_layanan_tanpa_kontak(client):  # alternatif UC04
    items = client.get("/api/layanan/nearby", params={"lat": -6.9, "lon": 107.6, "radius_km": 5}).json()["items"]
    tanpa = next(i for i in items if i["kontak"] is None)
    d = client.get(f"/api/layanan/{tanpa['id']}").json()
    assert d["kontak_tersedia"] is False
    assert client.get("/api/layanan/99999").status_code == 404


def test_sos_alur_lengkap(client):
    body = {"client_id": "sos-0001-aaaa", "nama": "Uji", "lat": -6.89, "lon": 107.61}
    r = client.post("/api/sos", json=body)
    assert r.status_code == 202 and r.json()["rekam"] is True
    sid = r.json()["sos_id"]
    # idempoten: kirim ulang dari antrean offline tidak menggandakan
    r2 = client.post("/api/sos", json=body)
    assert r2.json()["sos_id"] == sid and r2.json()["baru"] is False
    # polisi memantau (butuh API key)
    assert client.get("/api/polisi/sos").status_code == 401
    daftar = client.get("/api/polisi/sos", headers=KEY).json()
    assert any(x["id"] == sid for x in daftar)
    # rekaman
    up = client.post(f"/api/sos/{sid}/recording", files={"file": ("a.webm", b"\x1aE\xdf\xa3fake", "audio/webm")})
    assert up.status_code == 201
    assert len(client.get(f"/api/polisi/sos/{sid}/recordings", headers=KEY).json()) == 1
    # reply polisi -> korban menerima teks yang disamarkan
    assert client.get(f"/api/sos/{sid}/status").json()["status"] == "dikirim"
    assert client.post(f"/api/polisi/sos/{sid}/reply", headers=KEY,
                       json={"status": "dalam_perjalanan", "polisi_id": 1}).status_code == 200
    st = client.get(f"/api/sos/{sid}/status").json()
    assert st["status"] == "dalam_perjalanan" and "polisi" not in st["pesan"].lower()


def test_sos_tanpa_lokasi_ditolak(client):
    assert client.post("/api/sos", json={"client_id": "sos-0002-aaaa"}).status_code == 422


def test_sos_tidak_ditemukan(client):
    assert client.get("/api/sos/tidak-ada/status").status_code == 404
    assert client.post("/api/sos/tidak-ada/recording", files={"file": ("a.webm", b"x")}).status_code == 404


def test_laporan_tidak_lengkap(client):  # alternatif UC05
    r = client.post("/api/laporan", json={"client_id": "lap-0002-aaaa", "deskripsi": "x"})
    assert r.status_code == 422
    assert {"tanggalKekerasan", "lokasiKekerasan", "modePelapor"} <= set(r.json()["kolom"])


def test_laporan_validasi_tanggal_dan_identitas(client):
    bad = {**LAPOR_OK, "client_id": "lap-0003-aaaa", "tanggal": "2999-01-01"}
    assert "tanggalKekerasan" in client.post("/api/laporan", json=bad).json()["kolom"]
    bad = {**LAPOR_OK, "client_id": "lap-0004-aaaa", "mode": "identitas", "nama": ""}
    assert "nama" in client.post("/api/laporan", json=bad).json()["kolom"]


def test_laporan_terenkripsi_dan_anonim(client):
    r = client.post("/api/laporan", json=LAPOR_OK)
    assert r.status_code == 201 and r.json()["token"]
    # idempoten
    assert client.post("/api/laporan", json=LAPOR_OK).json()["token"] == r.json()["token"]
    raw = sqlite3.connect(config.DB_PATH).execute("SELECT payload_enc FROM laporan").fetchall()
    assert raw and all(b"Rahasia" not in bytes(x[0]) for x in raw)  # tidak tersimpan plaintext
    lap = [x for x in client.get("/api/polisi/laporan", headers=KEY).json() if x["token"] == r.json()["token"]][0]
    assert lap["deskripsi"] == "Rahasia deskripsi uji"
    assert "nama" not in lap  # mode anonim: nama tidak disimpan


def test_status_memuat_balasan_dan_waktu(client):
    sid = client.post("/api/sos", json={"client_id": "sos-0003-aaaa", "lat": -6.89, "lon": 107.61}).json()["sos_id"]
    client.post(f"/api/polisi/sos/{sid}/reply", headers=KEY,
                json={"status": "diterima", "reply": "Petugas menuju lokasi.", "polisi_id": 1})
    st = client.get(f"/api/sos/{sid}/status").json()
    assert st["reply"] == "Petugas menuju lokasi." and st["created_at"]


def test_polisi_melihat_unit_terdekat(client):
    daftar = client.get("/api/polisi/sos", headers=KEY).json()
    assert daftar and daftar[0]["unit"]["nama"].startswith("Patroli")


def test_detail_layanan_memuat_alamat_dan_fasilitas(client):
    items = client.get("/api/layanan/nearby", params={"lat": -6.8915, "lon": 107.6107, "radius_km": 3}).json()["items"]
    d = client.get(f"/api/layanan/{items[0]['id']}").json()
    assert d["alamat"] and isinstance(d["fasilitas"], list)


def test_tindak_lanjut_laporan(client):
    tok = client.post("/api/laporan", json={**LAPOR_OK, "client_id": "lap-0010-aaaa"}).json()["token"]
    body = {"status": "ditinjau", "catatan": "Sudah dibaca petugas."}
    assert client.post(f"/api/polisi/laporan/{tok}/tindak", json=body).status_code == 401
    assert client.post(f"/api/polisi/laporan/{tok}/tindak", headers=KEY, json=body).status_code == 200
    lap = [x for x in client.get("/api/polisi/laporan", headers=KEY).json() if x["token"] == tok][0]
    assert lap["status"] == "ditinjau" and lap["catatan"] == "Sudah dibaca petugas."
    assert client.post(f"/api/polisi/laporan/{tok}/tindak", headers=KEY, json={"status": "bebas"}).status_code == 422
    assert client.post("/api/polisi/laporan/tidak-ada/tindak", headers=KEY, json={"status": "selesai"}).status_code == 404


def test_migrasi_database_lama(tmp_path):
    import sqlite3
    from backend import db
    old = tmp_path / "old.db"
    c = sqlite3.connect(old)
    c.executescript("CREATE TABLE laporan(id INTEGER PRIMARY KEY, token TEXT, client_id TEXT, mode TEXT, payload_enc BLOB, created_at TEXT);"
                    "CREATE TABLE layanan(id INTEGER PRIMARY KEY, nama TEXT, jenis TEXT, lat REAL, lon REAL, kontak TEXT);")
    c.commit(); c.close()
    saved = config.DB_PATH
    try:
        config.DB_PATH = old
        db.init_db()
        cols = {r[1] for r in sqlite3.connect(old).execute("PRAGMA table_info(laporan)")}
        assert {"status", "catatan"} <= cols
    finally:
        config.DB_PATH = saved


def test_pelapor_cek_status_lewat_kode(client):
    tok = client.post("/api/laporan", json={**LAPOR_OK, "client_id": "lap-0020-aaaa", "mode": "identitas", "nama": "Rahasia Nama"}).json()["token"]
    st = client.get(f"/api/laporan/{tok}/status").json()          # tanpa API key: boleh, tapi hanya status
    assert st["status"] == "baru" and st["pesan"] is None
    client.post(f"/api/polisi/laporan/{tok}/tindak", headers=KEY,
                json={"status": "ditinjau", "catatan": "INTERNAL", "pesan_pelapor": "Laporan Anda sedang ditinjau."})
    st = client.get(f"/api/laporan/{tok}/status").json()
    assert st["status"] == "ditinjau" and st["pesan"] == "Laporan Anda sedang ditinjau."
    teks = str(st)
    assert "INTERNAL" not in teks and "Rahasia" not in teks and "Nama" not in teks   # tidak bocor
    assert client.get("/api/laporan/kode-ngawur/status").status_code == 404


def test_file_klien_tidak_di_cache_tetapi_api_biasa(client):
    r = client.get("/")
    assert r.status_code == 200 and r.headers["cache-control"] == "no-cache"
    assert "no-cache" not in client.get("/api/layanan/1").headers.get("cache-control", "")


def test_versi_build(client):
    assert client.get("/api/versi").json()["build"]
