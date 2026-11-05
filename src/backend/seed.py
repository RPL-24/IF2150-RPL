import sys
from pathlib import Path
import sqlite3
import bcrypt

# 1. Setup Path & Database
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.append(str(BACKEND_DIR))

try:
    from models import DATABASE_NAME, init_db
    init_db(DATABASE_NAME)
except ImportError:
    DATABASE_NAME = "savebite.db"

DB_PATH = BACKEND_DIR / DATABASE_NAME

conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA foreign_keys = ON;")
cursor = conn.cursor()

# 2. Skema Tabel (Pengguna, Penjual, Pembeli, Reward, Listing)
cursor.executescript("""
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
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pembeli (
    id_pengguna INTEGER PRIMARY KEY,
    nama_akun TEXT NOT NULL,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reward_login (
    id_pembeli INTEGER PRIMARY KEY,
    poin_terkumpul INTEGER DEFAULT 0,
    FOREIGN KEY (id_pembeli) REFERENCES pembeli(id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing (
    id_listing INTEGER PRIMARY KEY AUTOINCREMENT,
    id_penjual INTEGER NOT NULL,
    nama_makanan TEXT NOT NULL,
    porsi TEXT NOT NULL,
    kondisi TEXT NOT NULL,
    harga INTEGER NOT NULL,
    stok INTEGER NOT NULL,
    batas_kedaluwarsa TEXT NOT NULL,
    foto TEXT,
    aktif INTEGER DEFAULT 1,
    FOREIGN KEY (id_penjual) REFERENCES penjual(id_pengguna) ON DELETE CASCADE
);
""")

# Hash Password Default untuk Pengujian
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw("password123".encode('utf-8'), salt).decode('utf-8')

try:
    # 3. Seeding Akun Penjual
    cursor.execute("SELECT id_pengguna FROM pengguna WHERE email = ?", ("penjual@test.com",))
    row_penjual = cursor.fetchone()

    if not row_penjual:
        cursor.execute(
            "INSERT INTO pengguna (nama, email, password) VALUES (?, ?, ?)",
            ("Penjual SaveBite", "penjual@test.com", hashed)
        )
        id_penjual = cursor.lastrowid
        cursor.execute(
            "INSERT INTO penjual (id_pengguna, nama_toko, alamat_toko) VALUES (?, ?, ?)",
            (id_penjual, "Toko Roti Berkah", "Jl. Sudirman No. 45")
        )
        print("✓ Akun penjual@test.com berhasil dibuat.")
    else:
        id_penjual = row_penjual[0]
        print("ℹ Akun penjual@test.com sudah ada.")

    # 4. Seeding Akun Pembeli
    cursor.execute("SELECT id_pengguna FROM pengguna WHERE email = ?", ("pembeli@test.com",))
    row_pembeli = cursor.fetchone()

    if not row_pembeli:
        cursor.execute(
            "INSERT INTO pengguna (nama, email, password) VALUES (?, ?, ?)",
            ("Pembeli E2E", "pembeli@test.com", hashed)
        )
        id_pembeli = cursor.lastrowid
        cursor.execute(
            "INSERT INTO pembeli (id_pengguna, nama_akun) VALUES (?, ?)",
            (id_pembeli, "pembelie2e")
        )
        cursor.execute(
            "INSERT INTO reward_login (id_pembeli, poin_terkumpul) VALUES (?, ?)",
            (id_pembeli, 0)
        )
        print("✓ Akun pembeli@test.com berhasil dibuat.")
    else:
        print("ℹ Akun pembeli@test.com sudah ada.")

    # 5. Seeding Data Dummy Listing Makanan
    cursor.execute("SELECT COUNT(*) FROM listing WHERE id_penjual = ?", (id_penjual,))
    jumlah_listing = cursor.fetchone()[0]

    if jumlah_listing == 0:
        cursor.execute(
            """
            INSERT INTO listing (id_penjual, nama_makanan, porsi, kondisi, harga, stok, batas_kedaluwarsa, foto, aktif)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (id_penjual, "Roti Tawar Penyelamatan", "1 Pack", "Sangat Baik", 12000, 5, "2026-12-31T23:59:00", None, 1)
        )
        cursor.execute(
            """
            INSERT INTO listing (id_penjual, nama_makanan, porsi, kondisi, harga, stok, batas_kedaluwarsa, foto, aktif)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (id_penjual, "Nasi Goreng Spesial Late-Night", "1 Porsi", "Hangat", 15000, 3, "2026-12-31T23:59:00", None, 1)
        )
        print("✓ Data dummy listing makanan berhasil ditambahkan.")
    else:
        print("ℹ Listing makanan untuk penjual ini sudah ada.")

    conn.commit()

except Exception as e:
    conn.rollback()
    print(f"❌ Gagal menyemai data: {e}")
finally:
    conn.close()