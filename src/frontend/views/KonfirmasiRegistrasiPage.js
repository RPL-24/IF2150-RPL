/**
 * MahaSehat - KonfirmasiRegistrasiPage.js
 * Konfirmasi/persotujuan akun pelajar oleh orang tua/wali (UC02, C03).
 * Data pelajar dan keputusan diambil dari API, bukan dari localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const BASE = '/api/auth';
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const elNama = document.getElementById('Text_ValNamaPelajar');
    const elEmail = document.getElementById('Text_ValEmailPelajar');
    const elDiminta = document.getElementById('Text_ValDiminta');
    const alertBox = document.getElementById('Alert_Notif');
    const btnSetuju = document.getElementById('Btn_Setuju');
    const btnTidakSetuju = document.getElementById('Btn_TidakSetuju');
    const kartuData = document.getElementById('Card_DataPelajar');

    const aturTombol = (aktif) => {
        [btnSetuju, btnTidakSetuju].forEach((btn) => {
            if (!btn) return;
            btn.disabled = !aktif;
            if (aktif) btn.hidden = false;
        });
    };

    // Tombol baru aktif setelah data pendaftaran berhasil dimuat.
    aturTombol(false);

    const tampilPesan = (pesan, tipe = 'success') => {
        if (!alertBox) return;
        alertBox.className = `alert-box alert-${tipe}`;
        alertBox.textContent = pesan;
        alertBox.hidden = false;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const kunciTombol = (alasan) => {
        [btnSetuju, btnTidakSetuju].forEach((btn) => {
            if (!btn) return;
            btn.disabled = true;
            if (alasan) btn.textContent = alasan;
        });
    };

    const formatTanggal = (nilai) => {
        if (!nilai) return '-';
        const tanggal = new Date(nilai);
        if (Number.isNaN(tanggal.getTime())) return String(nilai);
        return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const isiData = (data = {}) => {
        if (elNama) elNama.textContent = data.nama || '-';
        if (elEmail) elEmail.textContent = data.email || '-';
        if (elDiminta) elDiminta.textContent = formatTanggal(data.tanggal_daftar || data.tanggalDaftar);
    };

    if (!token) {
        tampilPesan('Tautan konfirmasi tidak valid: token tidak ditemukan di URL.', 'danger');
        kunciTombol('Tautan tidak valid');
        return;
    }

    async function muatData() {
        try {
            const respons = await fetch(`${BASE}/confirm/${encodeURIComponent(token)}`);
            const hasil = await respons.json().catch(() => ({}));
            if (!respons.ok) {
                tampilPesan(hasil.message || 'Tautan konfirmasi tidak valid atau sudah digunakan.', 'danger');
                kunciTombol('Tautan tidak valid');
                return;
            }
            isiData(hasil.data);
            if (kartuData) kartuData.hidden = false;
            aturTombol(true);
        } catch (err) {
            tampilPesan('Tidak dapat terhubung ke server. Coba muat ulang halaman.', 'danger');
            kunciTombol('Gagal memuat');
        }
    }

    async function putuskan(jalur, labelProses, labelSukses, tipe) {
        kunciTombol();
        const tombolAktif = jalur === 'confirm' ? btnSetuju : btnTidakSetuju;
        const labelAsli = tombolAktif ? tombolAktif.textContent : '';
        if (tombolAktif) tombolAktif.textContent = labelProses;

        try {
            const respons = await fetch(`${BASE}/${jalur}/${encodeURIComponent(token)}`, { method: 'POST' });
            const hasil = await respons.json().catch(() => ({}));
            if (!respons.ok) {
                tampilPesan(hasil.message || 'Permintaan gagal diproses.', 'danger');
                [btnSetuju, btnTidakSetuju].forEach((btn) => { if (btn) btn.disabled = false; });
                if (tombolAktif) tombolAktif.textContent = labelAsli;
                return;
            }
            tampilPesan(hasil.message || labelSukses, tipe);
            kunciTombol();
            if (tombolAktif) tombolAktif.textContent = labelSukses;
            const tombolLain = jalur === 'confirm' ? btnTidakSetuju : btnSetuju;
            if (tombolLain) tombolLain.hidden = true;
        } catch (err) {
            tampilPesan('Tidak dapat terhubung ke server. Coba lagi beberapa saat lagi.', 'danger');
            [btnSetuju, btnTidakSetuju].forEach((btn) => { if (btn) btn.disabled = false; });
            if (tombolAktif) tombolAktif.textContent = labelAsli;
        }
    }

    if (btnSetuju) {
        btnSetuju.addEventListener('click', () => {
            putuskan('confirm', 'Memproses...', 'Akun telah disetujui', 'success');
        });
    }

    if (btnTidakSetuju) {
        btnTidakSetuju.addEventListener('click', () => {
            putuskan('reject', 'Memproses...', 'Permintaan ditolak', 'danger');
        });
    }

    muatData();
});
