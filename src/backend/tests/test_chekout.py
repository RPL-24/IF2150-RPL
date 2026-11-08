import sqlite3

def test_checkout_valid(client, stok):
    r = client.post("/api/pembayaran/checkout", json={"id_listing": 1, "jumlah": 2})
    assert r.status_code == 200
    d = r.json()
    assert d["status"] == "MENUNGGU_BAYAR"
    assert d["total_harga"] == 24000
    assert d["items"][0]["nama_makanan"] == "Roti"
    assert stok(1) == 5                       # stock not reduced at checkout

def test_jumlah_tidak_valid(client):
    r = client.post("/api/pembayaran/checkout", json={"id_listing": 1, "jumlah": 0})
    assert r.status_code == 400
    assert r.json()["detail"] == "Jumlah porsi tidak valid"

def test_stok_tidak_cukup(client):
    r = client.post("/api/pembayaran/checkout", json={"id_listing": 1, "jumlah": 99})
    assert r.status_code == 409
    assert r.json()["detail"] == "Stok tidak mencukupi"

def test_listing_tidak_ada(client):
    r = client.post("/api/pembayaran/checkout", json={"id_listing": 999, "jumlah": 1})
    assert r.status_code == 404
    assert r.json()["detail"] == "Listing tidak tersedia"

def test_harga_satuan_disalin(client, db_path):
    t = client.post("/api/pembayaran/checkout", json={"id_listing": 1, "jumlah": 1}).json()
    c = sqlite3.connect(db_path)
    c.execute("UPDATE listing_makanan SET harga = 99999 WHERE id_listing = 1")
    c.commit()
    c.close()
    d = client.get(f"/api/pembayaran/{t['id_transaksi']}").json()
    assert d["items"][0]["harga_satuan"] == 12000

def bayar(client, tid):
    return client.post(f"/api/pembayaran/{tid}/bayar")

def test_bayar_sukses(client, buat_trx, stok):
    tid = buat_trx([(1, 2)])
    d = bayar(client, tid).json()
    assert d["status"] == "LUNAS" and d["kode_pengambilan"].startswith("SB-")
    assert stok(1) == 3

def test_multi_item_rollback(client, buat_trx, stok):
    tid = buat_trx([(1, 2), (2, 3)])            # listing 2 only has stock 1
    r = bayar(client, tid)
    assert r.status_code == 409 and r.json()["detail"] == "Stok tidak mencukupi"
    assert stok(1) == 5 and stok(2) == 1         # nothing changed
    assert client.get(f"/api/pembayaran/{tid}").json()["status"] == "MENUNGGU_BAYAR"

def test_bayar_dua_kali(client, buat_trx, stok):
    tid = buat_trx([(1, 2)])
    bayar(client, tid)
    assert bayar(client, tid).status_code == 409
    assert stok(1) == 3                          # reduced only once

def test_stok_terakhir_hanya_satu_berhasil(client, buat_trx, stok):
    t1, t2 = buat_trx([(2, 1)]), buat_trx([(2, 1)])
    assert bayar(client, t1).status_code == 200
    assert bayar(client, t2).status_code == 409
    assert stok(2) == 0                          # selalu postiif

def test_bayar_kedaluwarsa_jadi_batal(client, buat_trx, stok):
    tid = buat_trx([(1, 2)], batas="2000-01-01 00:00:00")
    r = bayar(client, tid)
    assert r.status_code == 200 and r.json()["status"] == "BATAL"
    assert stok(1) == 5