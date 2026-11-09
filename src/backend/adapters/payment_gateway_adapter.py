from .metode_pembayaran import MetodePembayaran
from ..errors import PembayaranError


class PaymentGatewayAdapter(MetodePembayaran):
    def __init__(self, url_gateway: str = "dummy://qris"):
        self.url_gateway = url_gateway

    def buat_tagihan(self, transaksi) -> str:
        if not self.url_gateway:
            raise PembayaranError("Gagal membuat tagihan pembayaran", 502)
        return "/qris-dummy.png"

    def cek_status(self, id_transaksi: int) -> str:
        return "LUNAS"