import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

def _load_dotenv():
    f = BASE / ".env"
    if not f.exists():
        return
    for line in f.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

_load_dotenv()

# paths stuffs
DATA_DIR = Path(os.environ.get("SAFESHE_DATA_DIR") or BASE / "data")
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / "safeshe.db"

# nilai default utk demo dan data yg fiktif
POLICE_KEY = os.environ.get("SAFESHE_POLICE_KEY") or "polisi-demo"
MAX_UPLOAD_BYTES = 20 * 1024 * 1024 # 20 MiB (20,971,520 B)