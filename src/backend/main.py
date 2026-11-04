import sqlite3
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from .models import DATABASE_NAME, init_db
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .api import routes as api_routes
from .controllers.katalog_controller import router as katalog_router


def get_db_connection():
    """Helper untuk mendapatkan koneksi basis data SQLite dengan foreign key aktif."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db(DATABASE_NAME)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(api_routes.router, prefix="/api", tags=["API"])
app.include_router(katalog_router)  # P3: UC02/UC03 katalog

@app.get("/")
def read_root():
    return {"message": "Database SQLite SaveBite berhasil diinisialisasi!"}
