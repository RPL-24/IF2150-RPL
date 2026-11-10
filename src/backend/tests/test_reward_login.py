"""Model RewardLogin (C07): Algo-C07-01..03 dan Q-C19-01."""
import sqlite3
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from backend.models import CREATE_TABLES_SQL, RewardLogin  # noqa: E402


def test_catat_login_hari_baru_tambah_poin():
    r = RewardLogin(None, 1, poin_terkumpul=0, tanggal_login_terakhir="2026-11-09")
    assert r.catatLogin("2026-11-10") is True
    assert r.poin_terkumpul == 10
    assert r.tanggal_login_terakhir == "2026-11-10"


def test_catat_login_hari_sama_tidak_tambah_poin():
    r = RewardLogin(None, 1, poin_terkumpul=30, tanggal_login_terakhir="2026-11-10")
    assert r.catatLogin("2026-11-10") is False
    assert r.poin_terkumpul == 30


def test_cukup_untuk_klaim():
    assert RewardLogin(None, 1, poin_terkumpul=100).cukupUntukKlaim()
    assert not RewardLogin(None, 1, poin_terkumpul=99).cukupUntukKlaim()


def test_kurangi_poin():
    r = RewardLogin(None, 1, poin_terkumpul=120)
    r.kurangiPoin(100)
    assert r.poin_terkumpul == 20
    with pytest.raises(ValueError):
        r.kurangiPoin(100)  # poin tidak mencukupi
    with pytest.raises(ValueError):
        r.kurangiPoin(0)


def test_cari_by_pembeli():
    conn = sqlite3.connect(":memory:")
    conn.executescript(CREATE_TABLES_SQL)
    conn.execute("INSERT INTO pengguna (id_pengguna, nama, email, password) VALUES (1, 'A', 'a@x.com', 'h')")
    conn.execute("INSERT INTO pembeli (id_pengguna, nama_akun) VALUES (1, 'a')")
    conn.execute("INSERT INTO reward_login (id_pembeli, poin_terkumpul) VALUES (1, 40)")

    r = RewardLogin.cariByPembeli(conn, 1)
    assert r.poin_terkumpul == 40
    assert RewardLogin.cariByPembeli(conn, 999) is None
