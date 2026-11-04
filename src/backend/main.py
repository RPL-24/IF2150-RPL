import sqlite3
from contextlib import asynccontextmanager
from fastapi import FastAPI
from .models import DATABASE_NAME, init_db


def get_db_connection():
    """Helper untuk mendapatkan koneksi basis data SQLite dengan foreign key aktif."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inisialisasi pembuatan skema basis data SQLite saat startup
    init_db(DATABASE_NAME)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"message": "Database SQLite SaveBite berhasil diinisialisasi!"}