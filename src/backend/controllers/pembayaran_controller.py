# controllers/pembayaran_controller.py
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import update
from sqlalchemy.orm import Session
from ..models import Transaksi, ItemTransaksi, ListingMakanan, StatusTransaksi, BATAS_WAKTU_BAYAR
from ..adapters.metode_pembayaran import MetodePembayaran

class PembayaranError(HTTPException):
    def __init__(self, detail: str, status_code: int = 400):
        super().__init__(status_code=status_code, detail=detail)

class PembayaranController:
    def __init__(self, metode: MetodePembayaran):
        self.metode = metode

    def checkout(self, db: Session, id_pembeli: int, id_listing: int, jumlah: int):
        if jumlah <= 0:
            raise PembayaranError("Jumlah porsi tidak valid")
        now = datetime.utcnow()
        listing = db.get(ListingMakanan, id_listing)
        if listing is None or not listing.is_tersedia(now):
            raise PembayaranError("Listing tidak tersedia", 404)
        if listing.stok < jumlah:
            raise PembayaranError("Stok tidak mencukupi", 409)
        try:
            trx = Transaksi(id_pembeli=id_pembeli, tanggal=now,
                            batas_waktu_bayar=now + BATAS_WAKTU_BAYAR)
            trx.items.append(ItemTransaksi(id_listing=id_listing, jumlah=jumlah,
                                           harga_satuan=listing.harga))
            trx.hitung_total()
            db.add(trx)
            db.commit()          # Transaksi + Item + total in ONE commit
        except Exception:
            db.rollback()
            raise
        db.refresh(trx)
        return trx, self.metode.buat_tagihan(trx)   # after commit, as in Algo-C18-01