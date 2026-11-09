import sqlite3
from datetime import datetime, timedelta

from ..errors import PembayaranError
from ..models import ItemTransaksi, ListingMakanan, Transaksi

BATAS_WAKTU_BAYAR = timedelta(minutes=15)   # DPPL names the constant but not the value; confirm with your team
FORMAT_WAKTU = "%Y-%m-%d %H:%M:%S"


def ambil_transaksi(conn: sqlite3.Connection, id_transaksi: int):
    """Returns (Transaksi, [ItemTransaksi], {id_listing: nama_makanan})."""
    baris = conn.execute(
        "SELECT * FROM transaksi WHERE id_transaksi = ?", (id_transaksi,)
    ).fetchone()
    if baris is None:
        return None, [], {}
    rows = conn.execute(
        "SELECT i.*, l.nama_makanan FROM item_transaksi i "
        "JOIN listing_makanan l ON l.id_listing = i.id_listing "
        "WHERE i.id_transaksi = ?", (id_transaksi,)
    ).fetchall()
    items = [ItemTransaksi(r["id_item"], r["id_transaksi"], r["id_listing"],
                           r["jumlah"], r["harga_satuan"]) for r in rows]
    nama = {r["id_listing"]: r["nama_makanan"] for r in rows}
    return Transaksi(**dict(baris)), items, nama


class PembayaranController:
    def checkout(self, conn: sqlite3.Connection, id_pembeli: int, id_listing: int, jumlah: int):
        if jumlah <= 0:
            raise PembayaranError("Jumlah porsi tidak valid")

        sekarang = datetime.now()
        listing = ListingMakanan.cariById(conn, id_listing)
        if listing is None or not listing.is_tersedia(sekarang):   # P3's criteria, not rewritten here
            raise PembayaranError("Listing tidak tersedia", 404)
        if listing.stok < jumlah:
            raise PembayaranError("Stok tidak mencukupi", 409)

        try:
            cur = conn.execute(
                "INSERT INTO transaksi (id_pembeli, tanggal, batas_waktu_bayar) VALUES (?, ?, ?)",
                (id_pembeli, sekarang.strftime(FORMAT_WAKTU),
                 (sekarang + BATAS_WAKTU_BAYAR).strftime(FORMAT_WAKTU)),
            )
            id_transaksi = cur.lastrowid
            item = ItemTransaksi(None, id_transaksi, id_listing, jumlah, listing.harga)
            conn.execute(
                "INSERT INTO item_transaksi (id_transaksi, id_listing, jumlah, harga_satuan) "
                "VALUES (?, ?, ?, ?)",
                (id_transaksi, id_listing, jumlah, item.harga_satuan),
            )
            conn.execute(
                "UPDATE transaksi SET total_harga = ? WHERE id_transaksi = ?",
                (item.hitung_subtotal(), id_transaksi),
            )
            conn.commit()        # Transaksi + Item + total in ONE commit
        except Exception:
            conn.rollback()
            raise

        trx, items, nama = ambil_transaksi(conn, id_transaksi)
        return trx, items, nama, self.metode.buat_tagihan(trx)    # after commit, as in Algo-C18-01
