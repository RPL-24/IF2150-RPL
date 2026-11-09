import sqlite3
from dataclasses import asdict
from fastapi import APIRouter, Depends

from ..models import DATABASE_NAME
from ..errors import PembayaranError
from ..routers.auth import require_roles
from ..schemas.pembayaran import CheckoutRequest, ItemOut, TransaksiOut
from ..controllers.pembayaran_controller import PembayaranController, ambil_transaksi

router = APIRouter(prefix="/api/pembayaran", tags=["pembayaran"])


def get_conn():
    conn = sqlite3.connect(DATABASE_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
    finally:
        conn.close()


def get_controller() -> PembayaranController:
    return PembayaranController()


def _keluaran(trx, items, nama, kode_qris=None) -> TransaksiOut:
    return TransaksiOut(
        **asdict(trx),
        items=[ItemOut(**asdict(i), nama_makanan=nama.get(i.id_listing, "")) for i in items],
        kode_qris=kode_qris,
    )


@router.post("/checkout", response_model=TransaksiOut)
def checkout(body: CheckoutRequest, conn=Depends(get_conn),
             ctl: PembayaranController = Depends(get_controller),
             user=Depends(require_roles(["PEMBELI"]))):
    trx, items, nama = ctl.checkout(conn, user["id_pengguna"], body.id_listing, body.jumlah)
    return _keluaran(trx, items, nama)


@router.get("/{id_transaksi}", response_model=TransaksiOut)
def detail(id_transaksi: int, conn=Depends(get_conn),
           user=Depends(require_roles(["PEMBELI"]))):
    trx, items, nama = ambil_transaksi(conn, id_transaksi)
    if trx is None or trx.id_pembeli != user["id_pengguna"]:
        raise PembayaranError("Transaksi tidak ditemukan", 404)
    return _keluaran(trx, items, nama)