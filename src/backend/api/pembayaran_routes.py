from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..adapters.payment_gateway_adapter import PaymentGatewayAdapter
from ..controllers.pembayaran_controller import PembayaranController, PembayaranError
from ..models import Transaksi
from ..schemas.pembayaran import CheckoutRequest, TransaksiOut

router = APIRouter(prefix="/pembayaran", tags=["pembayaran"])

def get_controller() -> PembayaranController:
    return PembayaranController(PaymentGatewayAdapter())

def current_pembeli_id() -> int:
    # TODO: replace with the dependency from the login issue (JWT -> user id, must be role Pembeli)
    return 1

@router.post("/checkout", response_model=TransaksiOut)
def checkout(body: CheckoutRequest, db: Session = Depends(get_db),
             ctl: PembayaranController = Depends(get_controller),
             id_pembeli: int = Depends(current_pembeli_id)):
    trx, kode_qris = ctl.checkout(db, id_pembeli, body.id_listing, body.jumlah)
    out = TransaksiOut.model_validate(trx)
    out.kode_qris = kode_qris
    return out

@router.get("/{id_transaksi}", response_model=TransaksiOut)
def detail(id_transaksi: int, db: Session = Depends(get_db),
           ctl: PembayaranController = Depends(get_controller),
           id_pembeli: int = Depends(current_pembeli_id)):
    trx = db.get(Transaksi, id_transaksi)
    if trx is None or trx.id_pembeli != id_pembeli:
        raise PembayaranError("Transaksi tidak ditemukan", 404)
    out = TransaksiOut.model_validate(trx)
    out.kode_qris = ctl.metode.buat_tagihan(trx)   # dummy QRIS is stateless, safe to regenerate
    return out