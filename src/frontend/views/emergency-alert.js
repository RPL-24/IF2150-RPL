/**
 * MahaSehat - emergency-alert.js
 * Untuk peran orang tua/wali: cek notifikasi darurat aktif begitu halaman dibuka.
 * Kalau ada, modal peringatan tampil lebih dulu dan menahan interaksi sampai
 * wali menandai "Diterima" atau "Sudah Ditindaklanjuti".
 * Menu Notifikasi di sidebar hanya muncul saat ada notifikasi aktif.
 */

(function () {
    'use strict';

    const TOKEN_KEY = 'mahasehat_token';
    const USER_KEY = 'mahasehat_user';

    function token() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function pengguna() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function isWali() {
        const role = String(pengguna().role || localStorage.getItem('role') || '').toLowerCase();
        return role.includes('orangtua') || role.includes('wali');
    }

    async function api(jalur, opsi = {}) {
        const respons = await fetch(jalur, {
            method: opsi.method || 'GET',
            headers: { Authorization: `Bearer ${token()}` }
        });
        const hasil = await respons.json().catch(() => ({}));
        if (!respons.ok || hasil.success === false) {
            throw new Error(hasil.message || 'Permintaan gagal.');
        }
        return hasil.data;
    }

    function aturMenu(aktif) {
        const menu = document.getElementById('Menu_Notifikasi');
        if (menu) menu.hidden = !aktif;
    }

    function dialogDarurat(notifikasi, { onSelesai } = {}) {
        const dialog = document.createElement('dialog');
        dialog.className = 'modal modal--darurat';
        dialog.setAttribute('aria-labelledby', 'Darurat_Title');
        dialog.setAttribute('aria-describedby', 'Darurat_Desc');

        const body = document.createElement('div');
        body.className = 'modal__body';

        const eyebrow = document.createElement('p');
        eyebrow.className = 'eyebrow';
        eyebrow.textContent = 'Notifikasi darurat';

        const judul = document.createElement('h2');
        judul.className = 'modal__title';
        judul.id = 'Darurat_Title';
        judul.textContent = 'Pelajar butuh perhatian';

        const subjudul = document.createElement('p');
        subjudul.className = 'modal__subtitle';
        subjudul.id = 'Darurat_Desc';
        subjudul.textContent = notifikasi.nama_pelajar
            ? `Peringatan untuk ${notifikasi.nama_pelajar}.`
            : 'Ada peringatan kesehatan yang perlu ditindaklanjuti.';

        const ringkasan = document.createElement('div');
        ringkasan.className = 'alert-box alert-danger';
        ringkasan.textContent = notifikasi.ringkasan_kondisi || 'Pelajar membutuhkan perhatian segera.';

        const catatan = document.createElement('p');
        catatan.className = 'field-hint';
        catatan.textContent = 'Tandai tindakanmu agar status darurat pelajar bisa dipulihkan.';

        const aksi = document.createElement('div');
        aksi.className = 'modal__actions';

        const tombolTerima = document.createElement('button');
        tombolTerima.type = 'button';
        tombolTerima.className = 'btn btn--secondary';
        tombolTerima.textContent = 'Saya sudah menerima';

        const tombolTindak = document.createElement('button');
        tombolTindak.type = 'button';
        tombolTindak.className = 'btn btn--primary';
        tombolTindak.textContent = 'Sudah ditindaklanjuti';

        function kunciSemua() {
            tombolTerima.disabled = true;
            tombolTindak.disabled = true;
        }

        tombolTerima.addEventListener('click', async () => {
            kunciSemua();
            try {
                await api(`/api/emergency/${encodeURIComponent(notifikasi.id)}/confirm`, { method: 'PUT' });
                sessionStorage.setItem(`darurat-diterima:${notifikasi.id}`, '1');
                dialog.close();
                if (window.MahaSehatFeedback) {
                    window.MahaSehatFeedback.success('Notifikasi darurat ditandai sudah diterima.');
                }
                onSelesai && onSelesai(false);
            } catch (error) {
                kunciSemua();
                tombolTerima.disabled = false;
                tombolTindak.disabled = false;
                if (window.MahaSehatFeedback) window.MahaSehatFeedback.error(error.message);
            }
        });

        tombolTindak.addEventListener('click', async () => {
            kunciSemua();
            try {
                await api(`/api/emergency/${encodeURIComponent(notifikasi.id)}/follow-up`, { method: 'PUT' });
                sessionStorage.setItem(`darurat-diterima:${notifikasi.id}`, '1');
                dialog.close();
                if (window.MahaSehatFeedback) {
                    window.MahaSehatFeedback.success('Tindak lanjut dicatat. Status darurat pelajar sudah dipulihkan.');
                }
                onSelesai && onSelesai(true);
            } catch (error) {
                kunciSemua();
                tombolTerima.disabled = false;
                tombolTindak.disabled = false;
                if (window.MahaSehatFeedback) window.MahaSehatFeedback.error(error.message);
            }
        });

        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
        });
        dialog.addEventListener('close', () => dialog.remove());

        aksi.append(tombolTerima, tombolTindak);
        body.append(eyebrow, judul, subjudul, ringkasan, catatan, aksi);
        dialog.append(body);
        document.body.append(dialog);
        dialog.showModal();
        tombolTindak.focus({ preventScroll: true });
    }

    async function periksa() {
        if (!token() || !isWali()) return;
        if (document.body.dataset.emergencyChecked === '1') return;
        document.body.dataset.emergencyChecked = '1';

        try {
            const daftar = await api('/api/emergency/wali');
            const aktif = Array.isArray(daftar) && daftar.length ? daftar : [];
            aturMenu(aktif.length > 0);

            const belumDitampilkan = aktif.find(
                (item) => !sessionStorage.getItem(`darurat-diterima:${item.id}`)
            );
            if (!belumDitampilkan) return;
            if (document.querySelector('dialog[open]')) return;
            if (window.location.pathname.endsWith('NotifikasiDarurat.html')) return;

            dialogDarurat(belumDitampilkan, {
                onSelesai: (sudahTindakLanjut) => {
                    if (sudahTindakLanjut) aturMenu(false);
                }
            });
        } catch (error) {
            // Diamkan: halaman tetap bisa dipakai walau pengecekan gagal.
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', periksa);
    } else {
        periksa();
    }
})();
