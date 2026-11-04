from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from datetime import date
import bcrypt
from backend.validation import Validasi
from backend.models import DATABASE_NAME

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    # 1. Validasi Format Input
    errors = Validasi.validasiKredensial(req.email, req.password)
    if errors:
        raise HTTPException(status_code=400, detail=", ".join(errors))
    
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        # Q-C15-01: Cari pengguna
        cursor.execute("""
            SELECT p.id_pengguna, p.nama, p.email, p.password, 
            CASE WHEN pb.id_pengguna IS NOT NULL THEN 'PEMBELI' ELSE 'PENJUAL' END AS peran 
            FROM pengguna p 
            LEFT JOIN pembeli pb ON pb.id_pengguna = p.id_pengguna 
            WHERE p.email = ?;
        """, (req.email,))
        user = cursor.fetchone()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail="Sistem gagal memproses login")

    # 2. Verifikasi Kredensial di luar blok try-catch utama agar 401 tidak terdistorsi menjadi 500
    if not user:
        conn.close()
        raise HTTPException(status_code=401, detail="Email atau password salah")

    if not bcrypt.checkpw(req.password.encode('utf-8'), user['password'].encode('utf-8')):
        conn.close()
        raise HTTPException(status_code=401, detail="Email atau password salah")

    peran = user['peran']
    id_pengguna = user['id_pengguna']

    # 3. Transaksi Reward Login khusus Pembeli
    if peran == 'PEMBELI':
        try:
            cursor.execute("SELECT poin_terkumpul, tanggal_login_terakhir FROM reward_login WHERE id_pembeli = ?", (id_pengguna,))
            reward = cursor.fetchone()
            
            today_str = date.today().isoformat()
            if reward:
                last_login = reward['tanggal_login_terakhir']
                if last_login != today_str:
                    new_points = reward['poin_terkumpul'] + 10
                    cursor.execute("""
                        UPDATE reward_login 
                        SET poin_terkumpul = ?, tanggal_login_terakhir = ? 
                        WHERE id_pembeli = ?
                    """, (new_points, today_str, id_pengguna))
                    conn.commit()
        except Exception:
            conn.rollback()
            conn.close()
            raise HTTPException(status_code=500, detail="Sistem gagal memproses reward login")

    conn.close()
    return {"id_pengguna": id_pengguna, "nama": user['nama'], "peran": peran}