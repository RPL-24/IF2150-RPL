/**
 * MahaSehat - NotifikasiDarurat.js
 * Notifikasi darurat untuk wali (UC08). Data dan aksi lewat /api/emergency.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const TOKEN_KEY = 'mahasehat_token';
    const token = localStorage.getItem(TOKEN_KEY);

    const btnDiterima = document.getElementById('Btn_Diterima');
    const btnSudahDitindaklanjuti = document.getElementById('Btn_SudahDitindaklanjuti');
    const descDarurat = document.getElementById('Desc_Darurat');
    const cardDarurat = document.getElementById('Card_Darurat');
    const cardSelesai = document.getElementById('Card_Selesai');

    let notifikasi = null;

    async function api(jalur, opsi = {}) {
        const respons = await fetch(jalur, {
            method: opsi.method || 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
        const hasil = await respons.json().catch(() => ({}));
        if (respons.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'LoginPage.html';
            throw new Error('Sesi berakhir.');
        }
        if (!respons.ok || hasil.success === false) {
            throw new Error(hasil.message || 'Permintaan gagal.');
        }
        return hasil.data;
    }

    function tampilkanPesan(teks, tipe = 'success') {
        window.MahaSehatFeedback.show(teks, tipe === 'danger' ? 'danger' : 'success');
    }

    function tampilkanKondisi() {
        if (!notifikasi) {
            if (cardDarurat) cardDarurat.hidden = true;
            if (cardSelesai) cardSelesai.hidden = false;
            return;
        }
        if (cardDarurat) cardDarurat.hidden = false;
        if (cardSelesai) cardSelesai.hidden = true;
        if (descDarurat) {
            const nama = notifikasi.nama_pelajar ? `${notifikasi.nama_pelajar}: ` : '';
            descDarurat.innerText = `${nama}${notifikasi.ringkasan_kondisi || 'Tidak ada ringkasan kondisi.'}`;
        }
    }

    async function muatNotifikasi() {
        try {
            const daftar = await api('/api/emergency/wali');
            notifikasi = Array.isArray(daftar) && daftar.length ? daftar[0] : null;
        } catch (error) {
            tampilkanPesan(error.message || 'Notifikasi darurat gagal dimuat.', 'danger');
        }
        tampilkanKondisi();
    }

    if (btnDiterima) {
        btnDiterima.addEventListener('click', async () => {
            if (!notifikasi) return;
            btnDiterima.disabled = true;
            btnDiterima.innerText = 'Menyimpan...';
            try {
                await api(`/api/emergency/${encodeURIComponent(notifikasi.id)}/confirm`, { method: 'PUT' });
                btnDiterima.innerText = 'Dikonfirmasi';
                tampilkanPesan('Status notifikasi dicatat sebagai "Diterima". Silakan hubungi pelajar untuk tindak lanjut.');
            } catch (error) {
                btnDiterima.disabled = false;
                btnDiterima.innerText = 'Diterima';
                tampilkanPesan(error.message || 'Status gagal disimpan.', 'danger');
            }
        });
    }

    if (btnSudahDitindaklanjuti) {
        btnSudahDitindaklanjuti.addEventListener('click', async () => {
            if (!notifikasi) return;
            btnSudahDitindaklanjuti.disabled = true;
            btnSudahDitindaklanjuti.innerText = 'Menyimpan...';
            try {
                await api(`/api/emergency/${encodeURIComponent(notifikasi.id)}/follow-up`, { method: 'PUT' });
                tampilkanPesan('Status tindak lanjut dicatat. Status darurat pelajar sudah dipulihkan.');
                notifikasi = null;
                if (cardDarurat) cardDarurat.hidden = true;
                if (cardSelesai) cardSelesai.hidden = false;
            } catch (error) {
                btnSudahDitindaklanjuti.disabled = false;
                btnSudahDitindaklanjuti.innerText = 'Sudah Ditindaklanjuti';
                tampilkanPesan(error.message || 'Status gagal disimpan.', 'danger');
            }
        });
    }

    muatNotifikasi();
});
