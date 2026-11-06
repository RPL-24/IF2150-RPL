import enum, secrets
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from . import database
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

BATAS_WAKTU_BAYAR = timedelta(minutes=15)

class StatusTransaksi(str, enum.Enum):
    MENUNGGU_BAYAR = "MENUNGGU_BAYAR"
    LUNAS = "LUNAS"
    BATAL = "BATAL"

class Transaksi(Base):
    __tablename__ = "transaksi"
    id_transaksi = Column(Integer, primary_key=True)
    id_pembeli = Column(Integer, ForeignKey("pengguna.id"), nullable=False)  # adjust table name
    tanggal = Column(DateTime, nullable=False, default=datetime.utcnow)
    batas_waktu_bayar = Column(DateTime, nullable=False)
    total_harga = Column(Integer, nullable=False, default=0)
    status = Column(Enum(StatusTransaksi), nullable=False, default=StatusTransaksi.MENUNGGU_BAYAR)
    kode_pengambilan = Column(String, nullable=True)
    items = relationship("ItemTransaksi", back_populates="transaksi", cascade="all, delete-orphan")

    def hitung_total(self) -> int:
        self.total_harga = sum(i.hitung_subtotal() for i in self.items)
        return self.total_harga

    def tandai_lunas(self):
        if self.status != StatusTransaksi.MENUNGGU_BAYAR:
            raise ValueError("Transaksi tidak dapat dilunasi")
        self.status = StatusTransaksi.LUNAS
        self.kode_pengambilan = self.buat_kode()

    def batalkan(self):
        if self.status == StatusTransaksi.LUNAS:
            raise ValueError("Transaksi sudah lunas dan tidak dapat dibatalkan")
        if self.status == StatusTransaksi.MENUNGGU_BAYAR:
            self.status = StatusTransaksi.BATAL

    def is_lewat_batas_waktu(self, waktu: datetime) -> bool:
        return waktu > self.batas_waktu_bayar

    @staticmethod
    def buat_kode() -> str:
        return "SB-" + secrets.token_hex(3).upper()

class ItemTransaksi(Base):
    __tablename__ = "item_transaksi"
    id_item = Column(Integer, primary_key=True)
    id_transaksi = Column(Integer, ForeignKey("transaksi.id_transaksi"), nullable=False)
    id_listing = Column(Integer, ForeignKey("listing_makanan.id_listing"), nullable=False)  # adjust
    jumlah = Column(Integer, nullable=False)
    harga_satuan = Column(Integer, nullable=False)  # copied at checkout, so later price edits don't matter
    transaksi = relationship("Transaksi", back_populates="items")

    def hitung_subtotal(self) -> int:
        return self.jumlah * self.harga_satuan