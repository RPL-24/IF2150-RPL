/**
 * MahaSehat - SettingPage.js
 * Logika antarmuka halaman Setelan (Profil, Keamanan, Sesi, dan Izin)
 * Keterlacakan DPPL: UC01 (Pengaturan Akun) & Seluruh Peran
 */

document.addEventListener('DOMContentLoaded', () => {
    const HALAMAN_DASHBOARD = {
        pelajar: 'DashboardPagePelajar.html',
        orangtuawali: 'DashboardPageOrangTuaWali.html',
        tenagakesehatan: 'DashboardPageTenagaKesehatan.html'
    };

    const LABEL_ROLE = {
        pelajar: 'Pelajar',
        orangtuawali: 'Orang Tua / Wali',
        tenagakesehatan: 'Tenaga Kesehatan'
    };

    const DATA_DUMMY = {
        pelajar: { nama: 'Albert Einstein', email: 'albert.einstein@gmail.com', nomorTelepon: '081234567890' },
        orangtuawali: { nama: 'Hermann Einstein', email: 'hermann.einstein@gmail.com', nomorTelepon: '081234567890' },
        tenagakesehatan: { nama: 'Raissa Hadiman, M. Psi.', email: 'raissa.hadiman@gmail.com', nomorTelepon: '081234567890' }
    };

    function kanonikRole(role) {
        const r = (role || '').toLowerCase().replace(/[^a-z]/g, '');
        return (r === 'orangtua' || r === 'wali') ? 'orangtuawali' : r;
    }

    const linkKembali = document.getElementById('Link_Kembali');
    const linkBrand = document.getElementById('Link_Brand');
    const menuDashboard = document.getElementById('Menu_Dashboard');
    const menuLaporan = document.getElementById('Menu_Laporan');
    const menuKonsultasi = document.getElementById('Menu_Konsultasi');
    const menuKeluar = document.getElementById('Menu_Keluar');

    const viewProfil = document.getElementById('View_Profil');
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

    // Ambil data akun tersimpan atau default peran
    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const role = kanonikRole(localStorage.getItem('role') || storedUser.role || 'pelajar');

    if (role === 'orangtuawali') {
        window.location.replace('SettingPageOrangTuaWali.html' + window.location.search);
        return;
    }
    if (role === 'tenagakesehatan') {
        window.location.replace('SettingPageTenagaKesehatan.html' + window.location.search);
        return;
    }
    const dummy = DATA_DUMMY[role] || DATA_DUMMY.pelajar;

    const akun = {
        nama: storedUser.nama || dummy.nama,
        email: storedUser.email || dummy.email,
        nomorTelepon: storedUser.nomorTelepon || dummy.nomorTelepon
    };
    const labelRole = LABEL_ROLE[role] || 'Pelajar';

    function tampilkanProfil() {
        const textNamaUser = document.getElementById('Text_NamaUser');
        const textRoleUser = document.getElementById('Text_RoleUser');
        const userAvatar = document.getElementById('User_Avatar');
        const textNama = document.getElementById('Text_Nama');
        const textEmail = document.getElementById('Text_Email');
        const textNomorTelepon = document.getElementById('Text_NomorTelepon');
        const textRole = document.getElementById('Text_Role');

        if (textNamaUser) textNamaUser.innerText = akun.nama;
        if (textRoleUser) textRoleUser.innerText = labelRole;
        if (userAvatar) userAvatar.innerText = (akun.nama || 'A').trim().charAt(0).toUpperCase();

        if (textNama) textNama.innerText = akun.nama;
        if (textEmail) textEmail.innerText = akun.email;
        if (textNomorTelepon) textNomorTelepon.innerText = akun.nomorTelepon;
        if (textRole) textRole.innerText = labelRole;

        if (inputNama) inputNama.value = akun.nama === '-' ? '' : akun.nama;
        if (inputEmail) inputEmail.value = akun.email === '-' ? '' : akun.email;
        if (inputTelepon) inputTelepon.value = akun.nomorTelepon === '-' ? '' : akun.nomorTelepon;
    }
    tampilkanProfil();

    // Sesuaikan navigasi dashboard sesuai peran aktif
    const targetDashboard = HALAMAN_DASHBOARD[role] || 'DashboardPage.html';
    if (linkKembali) linkKembali.href = targetDashboard;
    if (linkBrand) linkBrand.href = targetDashboard;
    if (menuDashboard) menuDashboard.href = targetDashboard;

    // Sesuaikan item navbar peran
    if (role === 'tenagakesehatan') {
        if (menuLaporan) menuLaporan.style.display = 'none';
        if (menuKonsultasi) {
            menuKonsultasi.style.display = 'flex';
            menuKonsultasi.href = 'PengajuanKonsultasiPage.html';
        }
    } else if (role === 'orangtuawali') {
        if (menuLaporan) {
            menuLaporan.style.display = 'flex';
            menuLaporan.href = 'ReportPage.html';
        }
        if (menuKonsultasi) menuKonsultasi.style.display = 'none';
    } else {
        // Pelajar
        if (menuLaporan) {
            menuLaporan.style.display = 'flex';
            menuLaporan.href = 'ReportPage.html';
        }
        if (menuKonsultasi) {
            menuKonsultasi.style.display = 'flex';
            menuKonsultasi.href = 'CariTenagaKesehatanPage.html';
        }
    }

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

    function saveProfile(e) {
        e.preventDefault();
        if (inputNama) akun.nama = inputNama.value.trim() || akun.nama;
        if (inputEmail) akun.email = inputEmail.value.trim() || akun.email;
        if (inputTelepon) akun.nomorTelepon = inputTelepon.value.trim() || akun.nomorTelepon;

        // Simpan ke localStorage
        const userUpdate = Object.assign({}, storedUser, {
            nama: akun.nama,
            email: akun.email,
            nomorTelepon: akun.nomorTelepon,
            role: role
        });
        localStorage.setItem('mahasehat_user', JSON.stringify(userUpdate));

        tampilkanProfil();

        // Umpan balik tombol simpan yang halus
        if (btnSimpanProfil) {
            const originalText = btnSimpanProfil.textContent;
            btnSimpanProfil.textContent = 'Perubahan disimpan ✓';
            btnSimpanProfil.style.backgroundColor = '#78C9C0';
            btnSimpanProfil.style.color = '#2A3A3F';
            setTimeout(() => {
                btnSimpanProfil.textContent = originalText;
                btnSimpanProfil.style.backgroundColor = '';
                btnSimpanProfil.style.color = '';
            }, 1800);
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
        localStorage.clear();
        window.location.replace('LoginPage.html');
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
