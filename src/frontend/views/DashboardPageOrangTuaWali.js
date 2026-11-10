/**
 * MahaSehat - DashboardPageOrangTuaWali.js
 * Logika antarmuka dashboard orang tua / wali.
 * Keterlacakan DPPL: UC03 (Dashboard Wali), C03 (Orang Tua/Wali)
 */

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('role', 'orangtuawali');
    const cardRegistrasi = document.getElementById('Card_Registrasi');
    const textDetailRegistrasi = document.getElementById('Text_DetailRegistrasi');
    const badgeStatusAkun = document.getElementById('Badge_StatusAkun');
    const textRingkasan = document.getElementById('Text_RingkasanKondisi');
    const textRingkasanKosong = document.getElementById('Text_RingkasanKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');
    const userAvatar = document.getElementById('User_Avatar');
    const avatarPelajar = document.getElementById('Avatar_Pelajar');

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const studentStatus = JSON.parse(localStorage.getItem('studentAccountStatus') || '{}');

    const data = {
        nama: storedUser.nama || 'Hermann Einstein',
        pelajar: {
            nama: studentStatus.nama || 'Albert Einstein',
            usia: 16,
            terverifikasi: studentStatus.status === 'APPROVED' ? true : false
        },
        registrasi: studentStatus.status === 'APPROVED' ? null : {
            nama: studentStatus.nama || 'Albert Einstein',
            tanggal: '6 November 2026'
        },
        hariTidakCheckIn: 2,
        rerataMood: 3.2,
        rerataTidur: 7.5,
        risiko: 'Sedang',
        ringkasan: 'Kondisi pelajar cukup stabil, namun durasi tidur sedikit menurun di akhir pekan. Tetap jaga komunikasi hangat.'
    };

    // User Profile
    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    if (textNamaUser) textNamaUser.textContent = data.nama;
    if (textRoleUser) textRoleUser.textContent = 'Orang Tua / Wali';
    if (userAvatar) userAvatar.textContent = (data.nama || 'H').trim().charAt(0).toUpperCase();

    // Pelajar Profile
    const textNamaPelajar = document.getElementById('Text_NamaPelajar');
    const textUsiaPelajar = document.getElementById('Text_UsiaPelajar');
    if (textNamaPelajar) textNamaPelajar.textContent = data.pelajar.nama;
    if (textUsiaPelajar) textUsiaPelajar.textContent = `${data.pelajar.usia} tahun`;
    if (avatarPelajar) avatarPelajar.textContent = (data.pelajar.nama || 'A').trim().charAt(0).toUpperCase();

    // Status Badge Akun Pelajar
    if (badgeStatusAkun) {
        if (data.pelajar.terverifikasi) {
            badgeStatusAkun.textContent = 'Terverifikasi';
            badgeStatusAkun.className = 'badge badge--selesai';
        } else {
            badgeStatusAkun.textContent = 'Belum Terverifikasi';
            badgeStatusAkun.className = 'badge badge--belum';
        }
    }

    // Banner Permintaan Registrasi
    if (cardRegistrasi) {
        if (data.registrasi) {
            if (textDetailRegistrasi) {
                textDetailRegistrasi.textContent = `${data.registrasi.nama} mengajukan registrasi pada ${data.registrasi.tanggal}. Mohon konfirmasi sebagai wali.`;
            }
            cardRegistrasi.style.display = 'flex';
        } else {
            cardRegistrasi.style.display = 'none';
        }
    }

    // Stat Values
    const elHariTidakCheckIn = document.getElementById('Value_HariTidakCheckIn');
    const elMood = document.getElementById('Value_RerataMood');
    const elTidur = document.getElementById('Value_RerataTidur');
    const elRisiko = document.getElementById('Value_Risiko');

    if (elHariTidakCheckIn) elHariTidakCheckIn.textContent = data.hariTidakCheckIn;
    if (elMood) elMood.textContent = data.rerataMood.toFixed(1);
    if (elTidur) elTidur.textContent = data.rerataTidur.toFixed(1);
    if (elRisiko) elRisiko.textContent = data.risiko;

    // Ringkasan Kondisi
    if (textRingkasan) {
        if (data.ringkasan) {
            textRingkasan.textContent = data.ringkasan;
            textRingkasan.style.display = 'block';
            if (textRingkasanKosong) textRingkasanKosong.style.display = 'none';
        } else {
            textRingkasan.style.display = 'none';
            if (textRingkasanKosong) textRingkasanKosong.style.display = 'block';
        }
    }

    // Aksi Keluar Akun
    if (menuKeluar) {
        menuKeluar.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.confirm('Yakin ingin keluar dari akun?')) {
                localStorage.clear();
                window.location.href = 'LoginPage.html';
            }
        });
    }
});
