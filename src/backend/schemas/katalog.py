from typing import Optional

from pydantic import BaseModel, ConfigDict


class ListingKatalog(BaseModel):
    """Data listing yang dikirim ke KatalogView (UC02 kartu, UC03 detail)."""

    model_config = ConfigDict(from_attributes=True)

    id_listing: int
    id_penjual: int
    nama_makanan: str
    deskripsi: Optional[str] = None
    porsi: str
    kondisi: str
    # Path relatif, mis. "uploads/listing/<uuid>.jpg". Frontend: NEXT_PUBLIC_API_URL + "/" + foto
    foto: Optional[str] = None
    harga: int
    stok: int
    batas_kedaluwarsa: str
