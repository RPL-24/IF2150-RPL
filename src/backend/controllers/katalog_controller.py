"""KatalogController (C16): UC02 melihat daftar listing, UC03 melihat detail listing.

Kriteria "tersedia" tidak ditulis di sini; semuanya lewat ListingMakanan
(ambilSemuaTersedia / cariById + is_tersedia).
"""
import sqlite3
from typing import Iterator, List

from fastapi import APIRouter, Depends, HTTPException

from ..models import ListingMakanan
from ..routers.auth import require_roles
from ..schemas.katalog import ListingKatalog


def get_conn() -> Iterator[sqlite3.Connection]:
    # Import di dalam fungsi untuk menghindari import melingkar (main.py meng-include router ini)
    from ..main import get_db_connection

    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


# Hanya pembeli yang login (sesi dari P1: cookie session_token / Bearer) yang boleh akses
router = APIRouter(
    prefix="/api/katalog",
    tags=["katalog"],
    dependencies=[Depends(require_roles(["PEMBELI"]))],
)


def ambilListingTersedia(conn: sqlite3.Connection) -> List[ListingMakanan]:
    """Algo-C16-01"""
    return ListingMakanan.ambilSemuaTersedia(conn)


def ambilDetail(conn: sqlite3.Connection, id_listing: int) -> ListingMakanan:
    """Algo-C16-02"""
    listing = ListingMakanan.cariById(conn, id_listing)
    if listing is None or not listing.is_tersedia():
        raise HTTPException(status_code=404, detail="Listing sudah tidak tersedia")
    return listing


@router.get("", response_model=List[ListingKatalog])
def get_daftar_listing(conn: sqlite3.Connection = Depends(get_conn)):
    return ambilListingTersedia(conn)


@router.get("/{id_listing}", response_model=ListingKatalog)
def get_detail_listing(id_listing: int, conn: sqlite3.Connection = Depends(get_conn)):
    return ambilDetail(conn, id_listing)
