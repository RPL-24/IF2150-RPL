import random
from .db import conn

# nama, jenis, lat (latitude), lon (longtitude), kontak, alamat, fasilitas
# fasilitas dipisahkan dengan '|'

LAYANAN = [
    ("RS Contoh Sehat", "rumah_sakit", -6.8920, 107.6130, "02255501001", "Jl. Pemulihan Sehat No. 12, Bandung",
     "Pemeriksaan medis dan visum|Pendampingan psikologis|Ruang pemeriksaan tertutup"),
    ("RS Anggrek Fiktif", "rumah_sakit", -6.9100, 107.6200, "02255501002", "Jl. Anggrek Contoh No. 5, Bandung",
     "Pemeriksaan medis dan visum|Unit gawat darurat"),
    ("Klinik Sehat Bersama", "rumah_sakit", -6.8850, 107.6050, "02255501003", "Jl. Bersama Contoh No. 8, Bandung",
     "Pemeriksaan medis"),
    ("Puskesmas Cicendo Contoh", "rumah_sakit", -6.9000, 107.6000, None, "Jl. Cicendo Contoh No. 3, Bandung",
     "Pemeriksaan medis"),
    ("Konseling Rumah Tenang", "konseling", -6.8930, 107.6090, "02255502001", "Jl. Tenang Contoh No. 2, Bandung",
     "Konseling krisis|Pendampingan hukum"),
    ("Pusat Pendampingan Dahlia", "konseling", -6.9050, 107.6150, "02255502002", "Jl. Dahlia Contoh No. 10, Bandung",
     "Konseling krisis|Pendampingan psikologis"),
    ("Layanan Psikolog Pelita", "konseling", -6.8800, 107.6200, "02255502003", "Jl. Pelita Contoh No. 7, Bandung",
     "Konsultasi psikolog"),
    ("Shelter Perempuan Kenanga", "shelter", -6.9200, 107.6300, "02255503001", "Alamat dirahasiakan, hubungi untuk arahan",
     "Tempat tinggal sementara|Pendampingan"),
    ("Polsek Contoh Sukajadi", "polisi", -6.8890, 107.5950, "02255504001", "Jl. Sukajadi Contoh No. 1, Bandung",
     "Penerimaan laporan"),
    ("Unit PPA Polrestabes Contoh", "polisi", -6.9150, 107.6080, "02255504002", "Jl. Perlindungan Contoh No. 9, Bandung",
     "Penerimaan laporan|Ruang pemeriksaan ramah korban"),
]
POLISI = [("Patroli Contoh A", -6.8900, 107.6100), ("Patroli Contoh B", -6.9020, 107.6180)]

def seed_if_empty():
    with conn() as c:
        if c.execute("SELECT COUNT(*) FROM layanan").fetchone()[0] == 0:
            c.executemany("INSERT INTO layanan(nama,jenis,lat,lon,kontak,alamat,fasilitas) VALUES(?,?,?,?,?,?,?)", LAYANAN)
        for nama, _j, _la, _lo, _k, alamat, fas in LAYANAN: # bikin kolom baru
            c.execute("UPDATE layanan SET alamat=?, fasilitas=? WHERE nama=? AND alamat IS NULL", (alamat, fas, nama))
        if c.execute("SELECT COUNT(*) FROM polisi").fetchone()[0] == 0:
            c.executemany("INSERT INTO polisi(nama,lat,lon) VALUES(?,?,?)", POLISI)

def seed_bulk(n: int, seed=1):
    """Untuk profiling: n layanan acak di area Jawa Barat."""
    rnd = random.Random(seed)
    rows = [(f"Layanan {i}", rnd.choice(["rumah_sakit", "konseling", "shelter", "polisi"]),
             rnd.uniform(-7.6, -6.1), rnd.uniform(106.5, 108.8), f"0220000{i:05d}")
            for i in range(n)]
    with conn() as c:
        c.executemany("INSERT INTO layanan(nama,jenis,lat,lon,kontak) VALUES(?,?,?,?,?)", rows)
