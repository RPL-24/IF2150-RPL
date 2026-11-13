/**
 * MahaSehat - SettingPageOrangTuaWali.js
 * Logika Antarmuka Halaman Setelan Akun Orang Tua / Wali
 * Keterlacakan DPPL: UC01 (Pengaturan Akun) & UC04 (Pemantauan Laporan)
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mahasehat_ortu_profile_v2';
    const USER_KEY = 'mahasehat_user';

    // Set role kanonikal
    localStorage.setItem('role', 'orangtuawali');

    const formProfil = document.getElementById('Form_EditProfil');
    const inputNama = document.getElementById('Input_Nama');
    const inputEmail = document.getElementById('Input_Email');
    const inputTelepon = document.getElementById('Input_NomorTelepon');
    const btnSimpanProfil = document.getElementById('Btn_SimpanProfil');

    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    const userAvatar = document.getElementById('User_Avatar');

    const switchNotif = document.getElementById('Switch_Notifikasi');
    const textNotifInfo = document.getElementById('Text_NotifInfo');
    const switchLokasi = document.getElementById('Switch_Lokasi');
    const textLokasiInfo = document.getElementById('Text_LokasiInfo');

    const btnKeluar = document.getElementById('Btn_Keluar');
    const menuKeluar = document.getElementById('Menu_Keluar');
    const popup = document.getElementById('Popup_KonfirmasiKeluar');
    const btnTutup = document.getElementById('Btn_TutupPopup');
    const btnBatal = document.getElementById('Btn_Batal');
    const btnKonfirmasi = document.getElementById('Btn_KonfirmasiKeluar');

    // Nilai default jika belum tersimpan
    const DEFAULT_DATA = {
        nama: 'Orang Tua / Wali',
        email: '-',
        nomorTelepon: '-'
    };

    function bacaJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
            return {};
        }
    }

    function muatDataProfil() {
        const profile = bacaJson(STORAGE_KEY);
        const user = bacaJson(USER_KEY);

        const nama = profile.nama || user.nama || DEFAULT_DATA.nama;
        const email = profile.email || user.email || DEFAULT_DATA.email;
        const nomorTelepon = profile.nomorTelepon || user.nomorTelepon || DEFAULT_DATA.nomorTelepon;

        if (inputNama) inputNama.value = nama;
        if (inputEmail) inputEmail.value = email;
        if (inputTelepon) inputTelepon.value = nomorTelepon;

        if (textNamaUser) textNamaUser.textContent = nama;
        if (textRoleUser) textRoleUser.textContent = 'Orang Tua / Wali';
        if (userAvatar) userAvatar.textContent = nama.trim().charAt(0).toUpperCase() || 'H';
    }

    // Simpan Perubahan Profil
    if (formProfil) {
        formProfil.addEventListener('submit', async (e) => {
            e.preventDefault();

            const namaBaru = (inputNama?.value || '').trim();
            const emailBaru = (inputEmail?.value || '').trim();
            const telpBaru = (inputTelepon?.value || '').trim();

            if (btnSimpanProfil) {
                btnSimpanProfil.disabled = true;
                btnSimpanProfil.textContent = 'Menyimpan...';
            }

            try {
                const token = localStorage.getItem('mahasehat_token');
                const respons = await fetch('/api/auth/me', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ nama: namaBaru, email: emailBaru, nomor_telepon: telpBaru })
                });
                const hasil = await respons.json().catch(() => ({}));
                if (!respons.ok) throw new Error(hasil.message || 'Profil gagal disimpan.');

                const profil = hasil.data || {};
                const profilUpdate = {
                    nama: profil.nama,
                    email: profil.email,
                    nomorTelepon: profil.nomor_telepon,
                    role: 'orangtuawali'
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profilUpdate));
                const currentUser = bacaJson(USER_KEY);
                localStorage.setItem(USER_KEY, JSON.stringify({ ...currentUser, ...profilUpdate }));

                if (textNamaUser) textNamaUser.textContent = profil.nama;
                if (userAvatar) userAvatar.textContent = String(profil.nama || 'W').charAt(0).toUpperCase();

                if (btnSimpanProfil) btnSimpanProfil.textContent = 'Simpan Perubahan';
                MahaSehatFeedback.success('Profil Orang Tua / Wali berhasil diperbarui.');
            } catch (error) {
                if (btnSimpanProfil) btnSimpanProfil.textContent = error.message || 'Profil gagal disimpan.';
                MahaSehatFeedback.error(error.message || 'Profil gagal disimpan.');
            } finally {
                if (btnSimpanProfil) {
                    setTimeout(() => {
                        btnSimpanProfil.textContent = 'Simpan Perubahan';
                        btnSimpanProfil.disabled = false;
                    }, 2200);
                }
            }
        });
    }

    // Inisialisasi Izin Notifikasi
    if (switchNotif) {
        if (!('Notification' in window)) {
            switchNotif.disabled = true;
            if (textNotifInfo) textNotifInfo.textContent = 'Peramban tidak mendukung notifikasi.';
        } else {
            switchNotif.checked = Notification.permission === 'granted' && localStorage.getItem('notifAktif') !== 'tidak';
            if (Notification.permission === 'denied' && textNotifInfo) {
                textNotifInfo.textContent = 'Izin diblokir. Aktifkan lewat pengaturan peramban.';
            }
        }

        switchNotif.addEventListener('change', () => {
            if (!switchNotif.checked) {
                localStorage.setItem('notifAktif', 'tidak');
                if (textNotifInfo) textNotifInfo.textContent = '';
                return;
            }

            Notification.requestPermission().then((hasil) => {
                if (hasil === 'granted') {
                    localStorage.setItem('notifAktif', 'ya');
                    if (textNotifInfo) textNotifInfo.textContent = '';
                    MahaSehatFeedback.success('Notifikasi pemantauan diaktifkan.');
                } else {
                    switchNotif.checked = false;
                    if (textNotifInfo) textNotifInfo.textContent = 'Izin ditolak oleh pengguna.';
                }
            });
        });
    }

    // Inisialisasi Izin Lokasi
    if (switchLokasi) {
        if (!('geolocation' in navigator)) {
            switchLokasi.disabled = true;
            if (textLokasiInfo) textLokasiInfo.textContent = 'Peramban tidak mendukung akses lokasi.';
        } else if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((hasil) => {
                switchLokasi.checked = hasil.state === 'granted' && localStorage.getItem('lokasiAktif') !== 'tidak';
                if (hasil.state === 'denied' && textLokasiInfo) {
                    textLokasiInfo.textContent = 'Izin lokasi diblokir di peramban.';
                }
            });
        }

        switchLokasi.addEventListener('change', () => {
            if (!switchLokasi.checked) {
                localStorage.setItem('lokasiAktif', 'tidak');
                if (textLokasiInfo) textLokasiInfo.textContent = '';
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => {
                    localStorage.setItem('lokasiAktif', 'ya');
                    if (textLokasiInfo) textLokasiInfo.textContent = '';
                    MahaSehatFeedback.success('Izin lokasi diaktifkan.');
                },
                () => {
                    switchLokasi.checked = false;
                    if (textLokasiInfo) textLokasiInfo.textContent = 'Akses lokasi ditolak atau tidak tersedia.';
                }
            );
        });
    }

    // Konfirmasi Keluar (Modal Dialog)
    function bukaPopupKeluar() {
        if (popup && !popup.open) {
            popup.showModal();
            if (btnBatal) btnBatal.focus();
        }
    }

    function tutupPopupKeluar() {
        if (popup) popup.close();
    }

    function prosesKeluar() {
        window.MahaSehatSession.logout();
    }

    if (btnKeluar) btnKeluar.addEventListener('click', bukaPopupKeluar);
    if (menuKeluar) {
        menuKeluar.addEventListener('click', (e) => {
            e.preventDefault();
            bukaPopupKeluar();
        });
    }

    if (btnTutup) btnTutup.addEventListener('click', tutupPopupKeluar);
    if (btnBatal) btnBatal.addEventListener('click', tutupPopupKeluar);
    if (btnKonfirmasi) btnKonfirmasi.addEventListener('click', prosesKeluar);

    // Muat data saat halaman dibuka
    muatDataProfil();

    (async () => {
        try {
            const token = localStorage.getItem('mahasehat_token');
            const respons = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            if (!respons.ok) return;
            const hasil = await respons.json();
            const profil = hasil.data || {};
            const simpanan = {
                nama: profil.nama,
                email: profil.email,
                nomorTelepon: profil.nomor_telepon,
                role: 'orangtuawali'
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(simpanan));
            localStorage.setItem(USER_KEY, JSON.stringify({ ...bacaJson(USER_KEY), ...simpanan }));
            muatDataProfil();

            const inputPelajar = document.getElementById('Input_PelajarDidampingi');
            if (inputPelajar) {
                const ringkasan = await fetch('/api/reports/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
                const siswa = ringkasan && ringkasan.data;
                inputPelajar.value = siswa
                    ? `${siswa.nama}${siswa.usia ? ` (${siswa.usia} tahun)` : ''}`
                    : 'Belum terhubung dengan pelajar';
            }
        } catch (error) {
            // Biarkan nilai lokal bila API tidak terjangkau
        }
    })();
});

