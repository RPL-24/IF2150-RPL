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
# Pastikan seeding mengikuti skema yang dipakai aplikasi utama.
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
    FOREIGN KEY (id_penjual) REFERENCES penjual(id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reward_login (
    id_reward INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pembeli INTEGER UNIQUE NOT NULL,
    poin_terkumpul INTEGER NOT NULL DEFAULT 0 CHECK (poin_terkumpul >= 0),
    tanggal_login_terakhir DATE,
    FOREIGN KEY (id_pembeli) REFERENCES pembeli(id_pengguna) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_session (
    token TEXT PRIMARY KEY,
    id_pengguna INTEGER NOT NULL,
    dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    kedaluwarsa_pada DATETIME NOT NULL,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna) ON DELETE CASCADE
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
    cursor.execute("SELECT COUNT(*) FROM listing_makanan WHERE id_penjual = ?", (id_penjual,))
    jumlah_listing = cursor.fetchone()[0]

    if jumlah_listing == 0:
        cursor.execute(
            """
            INSERT INTO listing_makanan (id_penjual, nama_makanan, deskripsi, porsi, kondisi, harga, stok, batas_kedaluwarsa, foto, aktif)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (id_penjual, "Roti Tawar Penyelamatan", "Roti tawar yang masih enak untuk disantap", "1 Pack", "Sangat Baik", 12000, 5, "2026-12-31T23:59:00", None, 1)
        )
        cursor.execute(
            """
            INSERT INTO listing_makanan (id_penjual, nama_makanan, deskripsi, porsi, kondisi, harga, stok, batas_kedaluwarsa, foto, aktif)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (id_penjual, "Nasi Goreng Spesial Late-Night", "Masih hangat dan siap dinikmati", "1 Porsi", "Hangat", 15000, 3, "2026-12-31T23:59:00", None, 1)
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