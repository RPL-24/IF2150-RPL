document.addEventListener('DOMContentLoaded', () => {
    const HALAMAN_DASHBOARD = {
        pelajar: 'DashboardPagePelajar.html',
        orangtuawali: 'DashboardPageOrangTuaWali.html',
        tenagakesehatan: 'DashboardPageTenagaKesehatan.html'
    };

    const LABEL_ROLE = {
        pelajar: 'Pelajar',
        orangtuawali: 'Orang Tua/Wali',
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
    const viewProfil = document.getElementById('View_Profil');
    const formEdit = document.getElementById('Form_EditProfil');
    const btnEdit = document.getElementById('Btn_EditProfil');
    const btnBatalEdit = document.getElementById('Btn_BatalEdit');
    const inputNama = document.getElementById('Input_Nama');
    const inputEmail = document.getElementById('Input_Email');
    const inputTelepon = document.getElementById('Input_NomorTelepon');
    const btnKeluar = document.getElementById('Btn_Keluar');
    const popup = document.getElementById('Popup_KonfirmasiKeluar');
    const btnTutup = document.getElementById('Btn_TutupPopup');
    const btnBatal = document.getElementById('Btn_Batal');
    const btnKonfirmasi = document.getElementById('Btn_KonfirmasiKeluar');

    const role = kanonikRole(localStorage.getItem('role'));
    const akun = Object.assign({ nama: '-', email: '-', nomorTelepon: '-' }, DATA_DUMMY[role]);
    const labelRole = LABEL_ROLE[role] || '-';

    function tampilkanProfil() {
        document.getElementById('Text_NamaUser').innerText = akun.nama;
        document.getElementById('Text_RoleUser').innerText = labelRole;
        document.getElementById('Text_Nama').innerText = akun.nama;
        document.getElementById('Text_Email').innerText = akun.email;
        document.getElementById('Text_NomorTelepon').innerText = akun.nomorTelepon;
        document.getElementById('Text_Role').innerText = labelRole;
    }
    tampilkanProfil();

    linkKembali.href = HALAMAN_DASHBOARD[role] || 'DashboardPage.html';

    function showEditForm() {
        inputNama.value = akun.nama === '-' ? '' : akun.nama;
        inputEmail.value = akun.email === '-' ? '' : akun.email;
        inputTelepon.value = akun.nomorTelepon === '-' ? '' : akun.nomorTelepon;
        viewProfil.hidden = true;
        btnEdit.hidden = true;
        formEdit.hidden = false;
        inputNama.focus();
    }

    function closeEditForm() {
        formEdit.hidden = true;
        viewProfil.hidden = false;
        btnEdit.hidden = false;
        btnEdit.focus();
    }

    function saveProfile(e) {
        e.preventDefault();
        akun.nama = inputNama.value.trim() || akun.nama;
        akun.email = inputEmail.value.trim() || akun.email;
        akun.nomorTelepon = inputTelepon.value.trim() || akun.nomorTelepon;
        tampilkanProfil();
        closeEditForm();
    }

    btnEdit.addEventListener('click', showEditForm);
    btnBatalEdit.addEventListener('click', closeEditForm);
    formEdit.addEventListener('submit', saveProfile);

    const switchNotif = document.getElementById('Switch_Notifikasi');
    const textNotifInfo = document.getElementById('Text_NotifInfo');

    if (!('Notification' in window)) {
        switchNotif.disabled = true;
        textNotifInfo.innerText = 'Peramban ini tidak mendukung notifikasi.';
    }
    else {
        switchNotif.checked = Notification.permission === 'granted' && localStorage.getItem('notifAktif') !== 'tidak';

        if (Notification.permission === 'denied') {
            textNotifInfo.innerText = 'Izin diblokir. Aktifkan lewat pengaturan situs di peramban.';
        }
    }

    switchNotif.addEventListener('change', () => {
        if (!switchNotif.checked) {
            localStorage.setItem('notifAktif', 'tidak');
            textNotifInfo.innerText = '';
            return;
        }

        Notification.requestPermission().then((hasil) => {
            if (hasil === 'granted') {
                localStorage.setItem('notifAktif', 'ya');
                textNotifInfo.innerText = '';
            }
            else {
                switchNotif.checked = false;
                textNotifInfo.innerText = 'Izin ditolak. Aktifkan lewat pengaturan situs di peramban.';
            }
        });
    });

    const switchLokasi = document.getElementById('Switch_Lokasi');
    const textLokasiInfo = document.getElementById('Text_LokasiInfo');

    if (!('geolocation' in navigator)) {
        switchLokasi.disabled = true;
        textLokasiInfo.innerText = 'Peramban ini tidak mendukung akses lokasi.';
    }
    else if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((hasil) => {
            switchLokasi.checked = hasil.state === 'granted' && localStorage.getItem('lokasiAktif') !== 'tidak';

            if (hasil.state === 'denied') {
                textLokasiInfo.innerText = 'Izin diblokir. Aktifkan lewat pengaturan situs di peramban.';
            }
        });
    }

    switchLokasi.addEventListener('change', () => {
        if (!switchLokasi.checked) {
            localStorage.setItem('lokasiAktif', 'tidak');
            textLokasiInfo.innerText = '';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => {
                localStorage.setItem('lokasiAktif', 'ya');
                textLokasiInfo.innerText = '';
            },
            () => {
                switchLokasi.checked = false;
                textLokasiInfo.innerText = 'Izin ditolak atau lokasi tidak bisa diakses. Aktifkan lewat pengaturan situs di peramban.';
            }
        );
    });

    function showLogoutConfirmation() {
        if (!popup.open) popup.showModal();
        btnBatal.focus();
    }

    function selectLogout() {
        showLogoutConfirmation();
    }

    function cancelLogout() {
        popup.close();
    }

    function confirmLogout() {
        localStorage.clear();
        window.location.replace('LoginPage.html');
    }

    btnKeluar.addEventListener('click', selectLogout);
    btnTutup.addEventListener('click', cancelLogout);
    btnBatal.addEventListener('click', cancelLogout);
    btnKonfirmasi.addEventListener('click', confirmLogout);

    popup.addEventListener('close', () => {
        try {
            history.replaceState(null, '', window.location.pathname);
        }
        catch (err) {
        }
        btnKeluar.focus();
    });

    if (new URLSearchParams(window.location.search).get('aksi') === 'keluar') {
        showLogoutConfirmation();
    }
});