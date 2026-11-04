import re
from typing import List

class Validasi:
    @staticmethod
    def validasiKredensial(email: str, password: str) -> List[str]:
        daftarError = []
        
        if not email:
            daftarError.append("Email wajib diisi")
        elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            daftarError.append("Format email tidak valid")
            
        if not password:
            daftarError.append("Password wajib diisi")
            
        return daftarError