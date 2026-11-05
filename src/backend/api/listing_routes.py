from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

router = APIRouter(
    prefix="/api/listing",
    tags=["Listing Penjual"]
)

# Mock Dependency Auth Sementara (Menunggu P1)
def get_current_penjual():
    return {
        "idPengguna": 1,
        "nama": "Penjual Dummy",
        "email": "penjual@example.com",
        "peran": "penjual"
    }

@router.get("/penjual", response_model=List[Dict[str, Any]])
def get_daftar_listing_penjual(current_user: dict = Depends(get_current_penjual)):
    """UC01 / UC06 / UC09: Ambil semua listing milik penjual aktif"""
    return [
        {
            "idListing": 1,
            "idPenjual": current_user["idPengguna"],
            "namaMakanan": "Nasi Goreng Dummy",
            "harga": 15000,
            "stok": 5,
            "aktif": True
        }
    ]

@router.post("/", status_code=status.HTTP_201_CREATED)
def tambah_listing(data: Dict[str, Any], current_user: dict = Depends(get_current_penjual)):
    """UC01: Tambah listing baru (Stub)"""
    return {"message": "Listing berhasil ditambahkan (Stub)", "data": data}