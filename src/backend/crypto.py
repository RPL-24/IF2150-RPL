import os
from cryptography.fernet import Fernet
from . import config

def _key() -> bytes:
    env = os.environ.get("SAFESHE_DATA_KEY")
    if env:
        return env.encode()
    f = config.DATA_DIR / ".key"
    if not f.exists():
        f.write_bytes(Fernet.generate_key())
    return f.read_bytes()

_fernet = Fernet(_key())

def encrypt(text: str) -> bytes:
    return _fernet.encrypt(text.encode("utf-8"))

def decrypt(blob: bytes) -> str:
    return _fernet.decrypt(blob).decode("utf-8")