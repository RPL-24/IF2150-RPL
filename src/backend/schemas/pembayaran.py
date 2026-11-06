from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CheckoutRequest(BaseModel):
    id_listing: int
    jumlah: int            # validated in the controller so you get the DPPL error message

class ItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id_listing: int
    jumlah: int
    harga_satuan: int
    nama_makanan: str

class TransaksiOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id_transaksi: int
    status: str
    total_harga: int
    batas_waktu_bayar: datetime
    kode_pengambilan: str | None = None
    items: list[ItemOut]
    kode_qris: str | None = None