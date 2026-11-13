/**
 * MahaSehat - session.js
 * Guard sesi dan logout bersama untuk halaman yang butuh login.
 * Dimuat sebelum JS halaman di semua halaman ber-sidebar, CheckIn, dan notifikasi.
 *
 * - Tanpa token: langsung diarahkan ke LoginPage.html.
 * - Logout: panggil POST /api/auth/logout (versi token dinaikkan di server),
 *   lalu bersihkan localStorage dan kembali ke halaman masuk.
 */

(function () {
    'use strict';

    const TOKEN_KEY = 'mahasehat_token';
    const USER_KEY = 'mahasehat_user';
    const ROLE_KEY = 'role';

    function token() {
        return localStorage.getItem(TOKEN_KEY);
    }

    async function logout() {
        const aktif = token();
        if (aktif) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${aktif}` }
                });
            } catch (error) {
                // Server tidak terjangkau: sesi lokal tetap dibersihkan.
            }
        }
        [TOKEN_KEY, USER_KEY, ROLE_KEY, 'lokasiAktif', 'notifAktif'].forEach((kunci) => {
            localStorage.removeItem(kunci);
        });
        window.location.href = 'LoginPage.html';
    }

    function dialogKeluar() {
        const dialog = document.createElement('dialog');
        dialog.className = 'modal';
        dialog.setAttribute('aria-labelledby', 'Logout_Title');
        dialog.setAttribute('aria-describedby', 'Logout_Desc');

        const body = document.createElement('div');
        body.className = 'modal__body';

        const judul = document.createElement('h2');
        judul.className = 'modal__title';
        judul.id = 'Logout_Title';
        judul.textContent = 'Keluar dari akun?';

        const teks = document.createElement('p');
        teks.className = 'modal__subtitle';
        teks.id = 'Logout_Desc';
        teks.textContent = 'Sesi login akan diakhiri dan kamu akan kembali ke halaman masuk.';

        const aksi = document.createElement('div');
        aksi.className = 'modal__actions';

        const batal = document.createElement('button');
        batal.type = 'button';
        batal.className = 'btn btn--secondary';
        batal.textContent = 'Batal';

        const keluar = document.createElement('button');
        keluar.type = 'button';
        keluar.className = 'btn btn--danger';
        keluar.textContent = 'Keluar';

        batal.addEventListener('click', () => dialog.close());
        keluar.addEventListener('click', () => {
            dialog.close();
            logout();
        });
        dialog.addEventListener('close', () => dialog.remove());

        aksi.append(batal, keluar);
        body.append(judul, teks, aksi);
        dialog.append(body);
        document.body.append(dialog);
        dialog.showModal();
        batal.focus({ preventScroll: true });
    }

    function pasangTombolLogout() {
        document.querySelectorAll('#Menu_Keluar, [data-logout]').forEach((tombol) => {
            if (tombol.dataset.logoutBound === '1') return;
            tombol.dataset.logoutBound = '1';
            tombol.addEventListener('click', (event) => {
                event.preventDefault();
                // Halaman setelan sudah punya modal konfirmasi sendiri.
                if (document.getElementById('Popup_KonfirmasiKeluar')) return;
                dialogKeluar();
            });
        });
    }

    function aktifkan() {
        if (!token()) {
            window.location.href = 'LoginPage.html';
            return;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', pasangTombolLogout);
        } else {
            pasangTombolLogout();
        }
    }

    window.MahaSehatSession = { token, logout, requireLogin: aktifkan };
    aktifkan();
})();
