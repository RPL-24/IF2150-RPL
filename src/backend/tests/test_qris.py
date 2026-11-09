import sqlite3
from backend.adapters.metode_pembayaran import MetodePembayaran
from backend.adapters.payment_gateway_adapter import PaymentGatewayAdapter
from backend.controllers.pembayaran_controller import PembayaranController

def test_cek_status_selalu_lunas():
    assert PaymentGatewayAdapter().cek_status(1) == "LUNAS"

def test_buat_tagihan_mengembalikan_path_qris():
    assert PaymentGatewayAdapter().buat_tagihan(None) == "/qris-dummy.png"

def test_checkout_dan_detail_punya_kode_qris(client):
    t = client.post("/api/pembayaran/checkout", json={"id_listing": 1, "jumlah": 1}).json()
    assert t["kode_qris"] == "/qris-dummy.png"
    assert client.get(f"/api/pembayaran/{t['id_transaksi']}").json()["kode_qris"] == "/qris-dummy.png"

def test_controller_bergantung_pada_interface(db_path):
    class Palsu(MetodePembayaran):
        def buat_tagihan(self, transaksi): return "palsu.png"
        def cek_status(self, id_transaksi): return "BELUM"
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    _, _, _, qris = PembayaranController(Palsu()).checkout(conn, 2, 1, 1)
    assert qris == "palsu.png"          # proves the adapter is swappable