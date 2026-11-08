/**
 * MahaSehat - DashboardPagePelajar.js
 * Logika antarmuka dashboard pelajar (Node ID 3319 / 3376)
 * Keterlacakan DPPL: UC03 (Dashboard Pelajar), C02 (Pelajar)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Profil Pengguna
    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    const userAvatar = document.getElementById('User_Avatar');

    // Banner Elemen
    const cardCheckIn = document.getElementById('Card_CheckIn');
    const bannerHeading = document.getElementById('Banner_Heading');
    const textPesan = document.getElementById('Text_PesanCheckIn');
    const iconStatus = document.getElementById('Icon_StatusCheckIn');
    const btnAksiCheckIn = document.getElementById('Btn_AksiCheckIn');

    // Indeks & Jadwal
    const fillIndeks = document.getElementById('Fill_Indeks');
    const valueIndeks = document.getElementById('Value_Indeks');
    const itemJadwal = document.getElementById('Item_Jadwal');
    const textJadwalKosong = document.getElementById('Text_JadwalKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');

    // Model Data Awal Pelajar (Mock & Integrasi Storage)
    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const data = {
        nama: storedUser.nama || 'Budi Pratama',
        role: 'Pelajar',
        sudahCheckIn: false,
        streak: 5,
        rerataMood: 3.2,
        rerataTidur: 8.2,
        polaMakan: 3.2,
        indeks: 78,
        indeksStatus: 'Stabil',
        jadwal: {
            namaNakes: 'Raissa Hadiman, M. Psi.',
            jenisNakes: 'Psikologi Klinis',
            initials: 'RH',
            tanggal: 'Rabu, 28 Oktober 2026',
            jam: '10:00 - 11:00 WIB',
            lokasi: 'Rumah Sakit ABC'
        }
    };

    // Parameter URL Override (misal: ?checkin=sudah atau ?checkin=belum)
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkin') === 'sudah' || localStorage.getItem('checkedInToday') === 'true') {
        data.sudahCheckIn = true;
    }
    if (params.get('checkin') === 'belum') {
        data.sudahCheckIn = false;
    }

    // Set Info Profil
    if (textNamaUser) textNamaUser.textContent = data.nama;
    if (textRoleUser) textRoleUser.textContent = data.role;
    if (userAvatar) userAvatar.textContent = (data.nama || 'B').trim().charAt(0).toUpperCase();

    // Helper Sapaan Berdasarkan Waktu
    function sapaanWaktu() {
        const jam = new Date().getHours();
        if (jam < 11) return 'Selamat Pagi';
        if (jam < 15) return 'Selamat Siang';
        if (jam < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    const namaPanggilan = data.nama.split(' ')[0];
    const sapaan = `${sapaanWaktu()}, ${namaPanggilan}.`;

    // SVG Icons
    const svgCentang = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

    const svgSilang = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;

    // Kondisi Banner Check-In (Sesuai Node 3336 vs 3393 FigCraft)
    if (data.sudahCheckIn) {
        if (cardCheckIn) {
            cardCheckIn.className = 'banner-card banner-success';
        }
        if (iconStatus) iconStatus.innerHTML = svgCentang;
        if (bannerHeading) bannerHeading.textContent = 'Check-in hari ini selesai';
        if (textPesan) {
            textPesan.textContent = `Terima kasih sudah meluangkan waktu untuk mengecek kondisimu. Terus kenali pola dan perkembangan dirimu.`;
        }
        if (btnAksiCheckIn) {
            btnAksiCheckIn.textContent = 'Lihat ringkasan';
            btnAksiCheckIn.href = 'ReportPage.html';
        }
    } else {
        if (cardCheckIn) {
            cardCheckIn.className = 'banner-card banner-warning';
        }
        if (iconStatus) iconStatus.innerHTML = svgSilang;
        if (bannerHeading) bannerHeading.textContent = 'Check-in hari ini belum diisi';
        if (textPesan) {
            textPesan.textContent = `${sapaan} Hari ini kamu belum mengisi refleksi harian. Luangkan 3 menit untuk mencatat kondisimu.`;
        }
        if (btnAksiCheckIn) {
            btnAksiCheckIn.textContent = 'Mulai check-in';
            btnAksiCheckIn.href = 'CheckInPage.html';
        }
    }

    // Nilai Statistik Metrik
    const elStreak = document.getElementById('Value_Streak');
    const elMood = document.getElementById('Value_RerataMood');
    const elTidur = document.getElementById('Value_RerataTidur');
    const elMakan = document.getElementById('Value_PolaMakan');

    if (elStreak) elStreak.textContent = data.streak;
    if (elMood) elMood.textContent = data.rerataMood.toFixed(1);
    if (elTidur) elTidur.textContent = data.rerataTidur.toFixed(1);
    if (elMakan) elMakan.textContent = data.polaMakan.toFixed(1);

    // Indeks Kesehatan Mental
    if (valueIndeks) valueIndeks.textContent = data.indeks;
    if (fillIndeks) fillIndeks.style.width = `${Math.min(Math.max(data.indeks, 0), 100)}%`;

    // Jadwal Konsultasi Terkini
    if (data.jadwal && itemJadwal) {
        itemJadwal.style.display = 'block';
        if (textJadwalKosong) textJadwalKosong.style.display = 'none';

        const elNamaNakes = document.getElementById('Text_NamaNakes');
        const elJenisNakes = document.getElementById('Text_JenisNakes');
        const elAvatarNakes = document.getElementById('Avatar_Nakes');
        const elTgl = document.getElementById('Text_JadwalTanggal');
        const elJam = document.getElementById('Text_JadwalJam');
        const elLokasi = document.getElementById('Text_JadwalLokasi');
        const elDetailLegacy = document.getElementById('Text_DetailJadwal');

        if (elNamaNakes) elNamaNakes.textContent = data.jadwal.namaNakes;
        if (elJenisNakes) elJenisNakes.textContent = data.jadwal.jenisNakes;
        if (elAvatarNakes) elAvatarNakes.textContent = data.jadwal.initials || 'RH';
        if (elTgl) elTgl.textContent = data.jadwal.tanggal;
        if (elJam) elJam.textContent = data.jadwal.jam;
        if (elLokasi) elLokasi.textContent = data.jadwal.lokasi;
        if (elDetailLegacy) {
            elDetailLegacy.textContent = `${data.jadwal.tanggal}\n${data.jadwal.jam}\n${data.jadwal.lokasi}`;
        }
    } else if (textJadwalKosong) {
        if (itemJadwal) itemJadwal.style.display = 'none';
        textJadwalKosong.style.display = 'block';
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
