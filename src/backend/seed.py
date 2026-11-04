import sqlite3
import bcrypt
from models import DATABASE_NAME, init_db

init_db(DATABASE_NAME)

conn = sqlite3.connect(DATABASE_NAME)
cursor = conn.cursor()

salt = bcrypt.gensalt()
hashed = bcrypt.hashpw("password123".encode('utf-8'), salt).decode('utf-8')

try:
    cursor.execute("SELECT id_pengguna FROM pengguna WHERE email = ?", ("pembeli@test.com",))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO pengguna (nama, email, password) VALUES (?, ?, ?)",
            ("Pembeli E2E", "pembeli@test.com", hashed)
        )
        id_user = cursor.lastrowid
        cursor.execute("INSERT INTO pembeli (id_pengguna, nama_akun) VALUES (?, ?)", (id_user, "pembelie2e"))
        cursor.execute("INSERT INTO reward_login (id_pembeli, poin_terkumpul) VALUES (?, ?)", (id_user, 0))
        conn.commit()
        print("Berhasil menambahkan akun pembeli@test.com ke savebite.db")
    else:
        print("Akun pembeli@test.com sudah ada di savebite.db")
except Exception as e:
    print(f"Gagal menyemai data: {e}")
finally:
    conn.close()