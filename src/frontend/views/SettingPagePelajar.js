/**
 * MahaSehat - SettingPagePelajar.js
 * Logika antarmuka halaman Setelan pelajar (Profil, Keamanan, Sesi, dan Izin)
 * Keterlacakan DPPL: UC01 (Pengaturan Akun)
 */

document.addEventListener('DOMContentLoaded', () => {
    const DASHBOARD_PELAJAR = 'DashboardPagePelajar.html';

    const DATA_DUMMY = {
        nama: 'Pelajar',
        email: '-',
        nomorTelepon: '-'
    };

    localStorage.setItem('role', 'pelajar');

    const linkKembali = document.getElementById('Link_Kembali');
    const linkBrand = document.getElementById('Link_Brand');
    const menuDashboard = document.getElementById('Menu_Dashboard');
    const menuKeluar = document.getElementById('Menu_Keluar');

    const formEdit = document.getElementById('Form_EditProfil');
    const btnEdit = document.getElementById('Btn_EditProfil');
    const btnBatalEdit = document.getElementById('Btn_BatalEdit');
    const inputNama = document.getElementById('Input_Nama');
    const inputEmail = document.getElementById('Input_Email');
    const inputTelepon = document.getElementById('Input_NomorTelepon');
    const btnSimpanProfil = document.getElementById('Btn_SimpanProfil');

    const btnKeluar = document.getElementById('Btn_Keluar');
    const popup = document.getElementById('Popup_KonfirmasiKeluar');
    const btnTutup = document.getElementById('Btn_TutupPopup');
    const btnBatal = document.getElementById('Btn_Batal');
    const btnKonfirmasi = document.getElementById('Btn_KonfirmasiKeluar');

    // Ambil data akun tersimpan atau default
    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const roleMentah = String(localStorage.getItem('role') || storedUser.role || 'pelajar')
        .toLowerCase()
        .replace(/[\s/_-]+/g, '');
    const role = roleMentah.includes('orangtua') || roleMentah === 'wali'
        ? 'orangtuawali'
        : roleMentah.includes('tenagakesehatan')
            ? 'tenagakesehatan'
            : 'pelajar';

    // Halaman ini khusus pelajar: peran lain diarahkan ke halaman setelannya
    if (role === 'orangtuawali') {
        window.location.replace('SettingPageOrangTuaWali.html' + window.location.search);
        return;
    }
    if (role === 'tenagakesehatan') {
        window.location.replace('SettingPageTenagaKesehatan.html' + window.location.search);
        return;
    }

    const akun = {
        nama: storedUser.nama || DATA_DUMMY.nama,
        email: storedUser.email || DATA_DUMMY.email,
        nomorTelepon: storedUser.nomorTelepon || DATA_DUMMY.nomorTelepon
    };

    function tampilkanProfil() {
        const textNamaUser = document.getElementById('Text_NamaUser');
        const textRoleUser = document.getElementById('Text_RoleUser');
        const userAvatar = document.getElementById('User_Avatar');
        const textNama = document.getElementById('Text_Nama');
        const textEmail = document.getElementById('Text_Email');
        const textNomorTelepon = document.getElementById('Text_NomorTelepon');
        const textRole = document.getElementById('Text_Role');

        if (textNamaUser) textNamaUser.innerText = akun.nama;
        if (textRoleUser) textRoleUser.innerText = 'Pelajar';
        if (userAvatar) userAvatar.innerText = (akun.nama || 'A').trim().charAt(0).toUpperCase();

        if (textNama) textNama.innerText = akun.nama;
        if (textEmail) textEmail.innerText = akun.email;
        if (textNomorTelepon) textNomorTelepon.innerText = akun.nomorTelepon;
        if (textRole) textRole.innerText = 'Pelajar';

        if (inputNama) inputNama.value = akun.nama === '-' ? '' : akun.nama;
        if (inputEmail) inputEmail.value = akun.email === '-' ? '' : akun.email;
        if (inputTelepon) inputTelepon.value = akun.nomorTelepon === '-' ? '' : akun.nomorTelepon;
    }
    tampilkanProfil();

    // Sinkronkan nama, email, dan nomor telepon dengan data server
    (async () => {
        try {
            const token = localStorage.getItem('mahasehat_token');
            const respons = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            if (!respons.ok) return;
            const hasil = await respons.json();
            const profil = hasil.data || {};
            akun.nama = profil.nama || akun.nama;
            akun.email = profil.email || akun.email;
            akun.nomorTelepon = profil.nomor_telepon || akun.nomorTelepon;
            localStorage.setItem('mahasehat_user', JSON.stringify(Object.assign({}, storedUser, {
                nama: akun.nama,
                email: akun.email,
                nomorTelepon: akun.nomorTelepon
            })));
            tampilkanProfil();
        } catch (error) {
            // Biarkan nilai lokal bila API tidak terjangkau
        }
    })();

    // Navigasi ke dashboard pelajar
    if (linkKembali) linkKembali.href = DASHBOARD_PELAJAR;
    if (linkBrand) linkBrand.href = DASHBOARD_PELAJAR;
    if (menuDashboard) menuDashboard.href = DASHBOARD_PELAJAR;

    // Formulir Profil Langsung Aktif (Sesuai Node 3872 FigCraft)
    function showEditForm() {
        if (inputNama) inputNama.value = akun.nama === '-' ? '' : akun.nama;
        if (inputEmail) inputEmail.value = akun.email === '-' ? '' : akun.email;
        if (inputTelepon) inputTelepon.value = akun.nomorTelepon === '-' ? '' : akun.nomorTelepon;
        if (inputNama) inputNama.focus();
    }

    function closeEditForm() {
        tampilkanProfil();
    }

    async function saveProfile(e) {
        e.preventDefault();
        const nama = inputNama ? inputNama.value.trim() : akun.nama;
        const email = inputEmail ? inputEmail.value.trim() : akun.email;
        const nomorTelepon = inputTelepon ? inputTelepon.value.trim() : akun.nomorTelepon;
        const token = localStorage.getItem('mahasehat_token');

        if (btnSimpanProfil) {
            btnSimpanProfil.disabled = true;
            btnSimpanProfil.textContent = 'Menyimpan...';
        }

        try {
            const respons = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nama, email, nomor_telepon: nomorTelepon })
            });
            const hasil = await respons.json().catch(() => ({}));
            if (!respons.ok) throw new Error(hasil.message || 'Profil gagal disimpan.');

            const profil = hasil.data || {};
            akun.nama = profil.nama;
            akun.email = profil.email;
            akun.nomorTelepon = profil.nomor_telepon;

            localStorage.setItem('mahasehat_user', JSON.stringify(Object.assign({}, storedUser, {
                nama: akun.nama,
                email: akun.email,
                nomorTelepon: akun.nomorTelepon,
                role
            })));

            tampilkanProfil();

            if (btnSimpanProfil) btnSimpanProfil.textContent = 'Simpan Perubahan';
            MahaSehatFeedback.success('Profil berhasil diperbarui.');
        } catch (error) {
            MahaSehatFeedback.error(error.message || 'Profil gagal disimpan.');
            if (btnSimpanProfil) setTimeout(() => { btnSimpanProfil.textContent = 'Simpan Perubahan'; }, 400);
        } finally {
            if (btnSimpanProfil) btnSimpanProfil.disabled = false;
        }
    }

    if (btnEdit) btnEdit.addEventListener('click', showEditForm);
    if (btnBatalEdit) btnBatalEdit.addEventListener('click', closeEditForm);
    if (formEdit) formEdit.addEventListener('submit', saveProfile);

    // Izin Notifikasi
    const switchNotif = document.getElementById('Switch_Notifikasi');
    const textNotifInfo = document.getElementById('Text_NotifInfo');

    if (switchNotif) {
        if (!('Notification' in window)) {
            switchNotif.disabled = true;
            if (textNotifInfo) textNotifInfo.innerText = 'Peramban ini tidak mendukung notifikasi.';
        } else {
            switchNotif.checked = Notification.permission === 'granted' && localStorage.getItem('notifAktif') !== 'tidak';

            if (Notification.permission === 'denied' && textNotifInfo) {
                textNotifInfo.innerText = 'Izin diblokir. Aktifkan lewat pengaturan situs di peramban.';
            }
        }

        switchNotif.addEventListener('change', () => {
            if (!switchNotif.checked) {
                localStorage.setItem('notifAktif', 'tidak');
                if (textNotifInfo) textNotifInfo.innerText = '';
                return;
            }

            Notification.requestPermission().then((hasil) => {
                if (hasil === 'granted') {
                    localStorage.setItem('notifAktif', 'ya');
                    if (textNotifInfo) textNotifInfo.innerText = '';
                } else {
                    switchNotif.checked = false;
                    if (textNotifInfo) textNotifInfo.innerText = 'Izin ditolak. Aktifkan lewat pengaturan situs di peramban.';
                }
            });
        });
    }

    // Izin Lokasi
    const switchLokasi = document.getElementById('Switch_Lokasi');
    const textLokasiInfo = document.getElementById('Text_LokasiInfo');

    if (switchLokasi) {
        if (!('geolocation' in navigator)) {
            switchLokasi.disabled = true;
            if (textLokasiInfo) textLokasiInfo.innerText = 'Peramban ini tidak mendukung akses lokasi.';
        } else if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((hasil) => {
                switchLokasi.checked = hasil.state === 'granted' && localStorage.getItem('lokasiAktif') !== 'tidak';

                if (hasil.state === 'denied' && textLokasiInfo) {
                    textLokasiInfo.innerText = 'Izin diblokir. Aktifkan lewat pengaturan situs di peramban.';
                }
            });
        }

        switchLokasi.addEventListener('change', () => {
            if (!switchLokasi.checked) {
                localStorage.setItem('lokasiAktif', 'tidak');
                if (textLokasiInfo) textLokasiInfo.innerText = '';
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => {
                    localStorage.setItem('lokasiAktif', 'ya');
                    if (textLokasiInfo) textLokasiInfo.innerText = '';
                },
                () => {
                    switchLokasi.checked = false;
                    if (textLokasiInfo) textLokasiInfo.innerText = 'Izin ditolak atau lokasi tidak bisa diakses.';
                }
            );
        });
    }

    // Konfirmasi Keluar (Modal Dialog)
    function showLogoutConfirmation() {
        if (popup && !popup.open) {
            popup.showModal();
            if (btnBatal) btnBatal.focus();
        }
    }

    function cancelLogout() {
        if (popup) popup.close();
    }

    function confirmLogout() {
        window.MahaSehatSession.logout();
    }

    if (btnKeluar) btnKeluar.addEventListener('click', showLogoutConfirmation);
    if (menuKeluar) {
        menuKeluar.addEventListener('click', (e) => {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }
    if (btnTutup) btnTutup.addEventListener('click', cancelLogout);
    if (btnBatal) btnBatal.addEventListener('click', cancelLogout);
    if (btnKonfirmasi) btnKonfirmasi.addEventListener('click', confirmLogout);

    if (popup) {
        popup.addEventListener('close', () => {
            try {
                history.replaceState(null, '', window.location.pathname);
            } catch (err) {}
            if (btnKeluar) btnKeluar.focus();
        });
    }

    if (new URLSearchParams(window.location.search).get('aksi') === 'keluar') {
        showLogoutConfirmation();
    }
});
