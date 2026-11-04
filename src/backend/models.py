import sqlite3
from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar, List, Optional
import bcrypt
from pathlib import Path

DATABASE_NAME = str(Path(__file__).resolve().parent.parent / "savebite.db")

CREATE_TABLES_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pengguna (
    id_pengguna INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS penjual (
    id_pengguna INTEGER PRIMARY KEY,
    nama_toko TEXT NOT NULL,
    alamat_toko TEXT NOT NULL,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna (id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pembeli (
    id_pengguna INTEGER PRIMARY KEY,
    nama_akun TEXT NOT NULL,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna (id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_makanan (
    id_listing INTEGER PRIMARY KEY AUTOINCREMENT,
    id_penjual INTEGER NOT NULL,
    nama_makanan TEXT NOT NULL,
    deskripsi TEXT,
    porsi TEXT NOT NULL,
    kondisi TEXT NOT NULL,
    foto TEXT,
    harga INTEGER NOT NULL CHECK (harga >= 0),
    stok INTEGER NOT NULL CHECK (stok >= 0),
    batas_kedaluwarsa DATETIME NOT NULL,
    aktif BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_penjual) REFERENCES penjual (id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transaksi (
    id_transaksi INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pembeli INTEGER NOT NULL,
    tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    batas_waktu_bayar DATETIME NOT NULL,
    total_harga INTEGER NOT NULL DEFAULT 0 CHECK (total_harga >= 0),
    status TEXT NOT NULL CHECK (status IN ('MENUNGGU_BAYAR', 'LUNAS', 'BATAL')) DEFAULT 'MENUNGGU_BAYAR',
    kode_pengambilan TEXT,
    FOREIGN KEY (id_pembeli) REFERENCES pembeli (id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_transaksi (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_transaksi INTEGER NOT NULL,
    id_listing INTEGER NOT NULL,
    jumlah INTEGER NOT NULL CHECK (jumlah > 0),
    harga_satuan INTEGER NOT NULL CHECK (harga_satuan >= 0),
    FOREIGN KEY (id_transaksi) REFERENCES transaksi (id_transaksi) ON DELETE CASCADE,
    FOREIGN KEY (id_listing) REFERENCES listing_makanan (id_listing) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reward_login (
    id_reward INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pembeli INTEGER UNIQUE NOT NULL,
    poin_terkumpul INTEGER NOT NULL DEFAULT 0 CHECK (poin_terkumpul >= 0),
    tanggal_login_terakhir DATE,
    FOREIGN KEY (id_pembeli) REFERENCES pembeli (id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kupon (
    kode_kupon TEXT PRIMARY KEY,
    id_pembeli INTEGER NOT NULL,
    nilai_potongan INTEGER NOT NULL CHECK (nilai_potongan >= 0),
    berlaku_sampai DATE NOT NULL,
    terpakai BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (id_pembeli) REFERENCES pembeli (id_pengguna) ON DELETE CASCADE
);
"""

def init_db(db_path: str = DATABASE_NAME):
    """Menginisialisasi basis data SQLite dan membuat seluruh tabel."""
    with sqlite3.connect(db_path) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.executescript(CREATE_TABLES_SQL)
        conn.commit()

@dataclass
class Pengguna:
    def __init__(self, id_pengguna: int, nama: str, email: str, password_hash: str):
        self.__idPengguna = id_pengguna 
        self.__nama = nama 
        self.__email = email 
        self.__password = password_hash 

    @staticmethod
    def hash_password(password_plain: str) -> str:
        """Menghasilkan hash bcrypt untuk kata sandi baru sebelum disimpan ke basis data"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password_plain.encode('utf-8'), salt).decode('utf-8')

    def verifikasiPassword(self, password: str) -> bool:
        """Mengecek apakah password yang didapat saat login sama dengan hash bcrypt di atribut password"""
        return bcrypt.checkpw(password.encode('utf-8'), self.__password.encode('utf-8'))

    def getPeran(self) -> str:
        """Operasi abstrak untuk mengembalikan peran pengguna"""
        raise NotImplementedError("Metode ini harus diimplementasikan oleh kelas turunan (Penjual/Pembeli)")

    def bukaListing(self):
        """Mengambil listing milik pengguna penjual"""
        pass

@dataclass
class Penjual(Pengguna):
    nama_toko: str = ""
    alamat_toko: str = ""

    def get_peran(self) -> str:
        return "PENJUAL"

    def memiliki_listing(self, id_penjual_listing: int) -> bool:
        return self.id_pengguna == id_penjual_listing

@dataclass
class Pembeli(Pengguna):
    nama_akun: str = ""

    def get_peran(self) -> str:
        return "PEMBELI"

@dataclass
class ListingMakanan:
    id_listing: Optional[int]
    id_penjual: int
    nama_makanan: str
    porsi: str
    kondisi: str
    harga: int
    stok: int
    batas_kedaluwarsa: str
    deskripsi: Optional[str] = None
    foto: Optional[str] = None
    aktif: bool = True

    # Satu-satunya definisi kriteria "tersedia" di level query (UC02, UC04):
    # aktif, stok > 0, dan belum melewati batas kedaluwarsa.
    # datetime() menyamakan format "YYYY-MM-DD HH:MM:SS" dan "YYYY-MM-DDTHH:MM:SS".
    KONDISI_TERSEDIA: ClassVar[str] = (
        "aktif = 1 AND stok > 0 "
        "AND datetime(batas_kedaluwarsa) > datetime(:waktu)"
    )

    def is_tersedia(self, waktu_sekarang: str) -> bool:
        return self.aktif and self.stok > 0 and waktu_sekarang < self.batas_kedaluwarsa

    @staticmethod
    def _waktu_sekarang() -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @classmethod
    def _dari_baris(cls, kolom: List[str], baris: tuple) -> "ListingMakanan":
        data = dict(zip(kolom, baris))
        data["aktif"] = bool(data["aktif"])
        return cls(**data)

    @classmethod
    def ambilSemuaTersedia(
        cls, conn: sqlite3.Connection, waktu: Optional[str] = None
    ) -> List["ListingMakanan"]:
        """Mengambil seluruh listing yang aktif, berstok > 0, dan belum kedaluwarsa (UC02)."""
        return cls.cariDaftar(conn, waktu=waktu)

    @classmethod
    def cariDaftar(
        cls,
        conn: sqlite3.Connection,
        kata_kunci: Optional[str] = None,
        harga_min: Optional[int] = None,
        harga_maks: Optional[int] = None,
        waktu: Optional[str] = None,
    ) -> List["ListingMakanan"]:
        """Mengambil listing tersedia yang namanya memuat kata kunci dan harganya
        berada dalam rentang (UC04). Parameter None berarti filter tidak dipakai."""
        kata_kunci = kata_kunci.strip() if kata_kunci else None
        pola = None
        if kata_kunci:
            # Escape karakter wildcard LIKE agar input pengguna dicari apa adanya
            pola = "%" + kata_kunci.lower().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"

        query = (
            "SELECT id_listing, id_penjual, nama_makanan, porsi, kondisi, harga, stok, "
            "batas_kedaluwarsa, deskripsi, foto, aktif "
            "FROM listing_makanan "
            f"WHERE {cls.KONDISI_TERSEDIA} "
            "AND (:pola IS NULL OR LOWER(nama_makanan) LIKE :pola ESCAPE '\\') "
            "AND (:harga_min IS NULL OR harga >= :harga_min) "
            "AND (:harga_maks IS NULL OR harga <= :harga_maks) "
            "ORDER BY datetime(batas_kedaluwarsa) ASC"
        )
        cursor = conn.execute(
            query,
            {
                "waktu": waktu or cls._waktu_sekarang(),
                "pola": pola,
                "harga_min": harga_min,
                "harga_maks": harga_maks,
            },
        )
        kolom = [d[0] for d in cursor.description]
        return [cls._dari_baris(kolom, baris) for baris in cursor.fetchall()]

@dataclass
class Transaksi:
    id_transaksi: Optional[int]
    id_pembeli: int
    tanggal: str
    batas_waktu_bayar: str
    total_harga: int = 0
    status: str = "MENUNGGU_BAYAR"
    kode_pengambilan: Optional[str] = None

@dataclass
class ItemTransaksi:
    id_item: Optional[int]
    id_transaksi: int
    id_listing: int
    jumlah: int
    harga_satuan: int

    def hitung_subtotal(self) -> int:
        return self.jumlah * self.harga_satuan

@dataclass
class RewardLogin:
    id_reward: Optional[int]
    id_pembeli: int
    poin_terkumpul: int = 0
    tanggal_login_terakhir: Optional[str] = None
    POIN_PER_LOGIN: int = 10
    POIN_PER_KLAIM: int = 100

    def cukup_untuk_klaim(self) -> bool:
        return self.poin_terkumpul >= self.POIN_PER_KLAIM

@dataclass
class Kupon:
    kode_kupon: str
    id_pembeli: int
    nilai_potongan: int
    berlaku_sampai: str
    terpakai: bool = False

    def is_berlaku(self, tanggal_sekarang: str) -> bool:
        return not self.terpakai and tanggal_sekarang <= self.berlaku_sampai