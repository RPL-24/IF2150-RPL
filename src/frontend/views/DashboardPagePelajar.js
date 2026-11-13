/**
 * MahaSehat - DashboardPagePelajar.js
 * Dashboard pelajar (UC03). Data diambil dari API: ringkasan laporan,
 * status check-in, dan jadwal konsultasi.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const TOKEN_KEY = 'mahasehat_token';
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.href = 'LoginPage.html';
        return;
    }

    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    const userAvatar = document.getElementById('User_Avatar');

    const cardCheckIn = document.getElementById('Card_CheckIn');
    const bannerHeading = document.getElementById('Banner_Heading');
    const textPesan = document.getElementById('Text_PesanCheckIn');
    const iconStatus = document.getElementById('Icon_StatusCheckIn');
    const btnAksiCheckIn = document.getElementById('Btn_AksiCheckIn');

    const fillIndeks = document.getElementById('Fill_Indeks');
    const valueIndeks = document.getElementById('Value_Indeks');
    const badgeIndeks = document.getElementById('Badge_StatusIndeks');
    const noteIndeks = document.getElementById('Text_IndeksNote');
    const textIndeksKosong = document.getElementById('Text_IndeksKosong');
    const cardIndeks = document.getElementById('Card_IndeksKesehatan');

    const itemJadwal = document.getElementById('Item_Jadwal');
    const textJadwalKosong = document.getElementById('Text_JadwalKosong');

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const params = new URLSearchParams(window.location.search);

    const data = {
        nama: storedUser.nama || 'Pelajar',
        role: 'Pelajar',
        sudahCheckIn: false,
        streak: 0,
        rerataMood: 0,
        rerataTidur: 0,
        polaMakan: '-',
        indeks: 0,
        indeksStatus: 'Belum Ada Data',
        jadwal: null
    };

    async function api(jalur) {
        const respons = await fetch(jalur, { headers: { Authorization: `Bearer ${token}` } });
        const hasil = await respons.json().catch(() => ({}));
        if (respons.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'LoginPage.html';
            throw new Error('Sesi berakhir.');
        }
        if (!respons.ok || hasil.success === false) {
            throw new Error(hasil.message || 'Data gagal dimuat.');
        }
        return hasil.data;
    }

    function formatJadwal(tanggal, waktu) {
        const opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const tgl = new Date(tanggal);
        const teksTanggal = Number.isNaN(tgl.getTime()) ? tanggal : tgl.toLocaleDateString('id-ID', opsi);
        return { tanggal: teksTanggal, jam: `${String(waktu).slice(0, 5)} WIB` };
    }

    try {
        const [summary, pengajuan] = await Promise.all([
            api('/api/reports/summary'),
            api('/api/konsultasi/saya')
        ]);

        const statistik = (summary && summary.statistik) || {};
        data.sudahCheckIn = Boolean(summary && summary.sudah_check_in);
        data.streak = Number(statistik.streak) || 0;
        data.rerataMood = Number(statistik.rerata_mood) || 0;
        data.rerataTidur = Number(statistik.rerata_tidur) || 0;
        data.polaMakan = statistik.pola_makan || '-';
        data.indeks = Number(statistik.indeks) || 0;
        data.indeksStatus = statistik.indeks_status || 'Belum Ada Data';

        const aktif = (pengajuan || []).find(
            (item) => item.status_pengajuan === 'Disetujui' || item.status_pengajuan === 'Rescheduled'
        );
        if (aktif) {
            const waktu = formatJadwal(aktif.tanggal, aktif.waktu);
            const namaNakes = aktif.nama_tenaga_kesehatan || 'Tenaga Kesehatan';
            data.jadwal = {
                namaNakes,
                jenisNakes: aktif.jenis_tenaga_kesehatan || 'Konsultasi',
                initials: namaNakes.split(' ').map((kata) => kata.charAt(0)).slice(0, 2).join('').toUpperCase(),
                tanggal: waktu.tanggal,
                jam: waktu.jam,
                lokasi: 'Sesi konsultasi'
            };
        }
    } catch (error) {
        if (!localStorage.getItem(TOKEN_KEY)) return;
        if (textPesan) textPesan.textContent = error.message || 'Data dashboard gagal dimuat.';
    }

    if (params.get('checkin') === 'sudah') data.sudahCheckIn = true;
    if (params.get('checkin') === 'belum') data.sudahCheckIn = false;

    if (textNamaUser) textNamaUser.textContent = data.nama;
    if (textRoleUser) textRoleUser.textContent = data.role;
    if (userAvatar) userAvatar.textContent = (data.nama || 'P').trim().charAt(0).toUpperCase();

    function sapaanWaktu() {
        const jam = new Date().getHours();
        if (jam < 11) return 'Selamat pagi';
        if (jam < 15) return 'Selamat siang';
        if (jam < 18) return 'Selamat sore';
        return 'Selamat malam';
    }

    const sapaan = `${sapaanWaktu()}, ${data.nama.split(' ')[0]}.`;
    const svgCentang = `<img src="../assets/check.png" alt="" class="banner-check">`;
    const svgSilang = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;

    if (data.sudahCheckIn) {
        if (cardCheckIn) cardCheckIn.className = 'banner-card banner-success';
        if (iconStatus) iconStatus.innerHTML = svgCentang;
        if (bannerHeading) bannerHeading.textContent = 'Check-in hari ini selesai';
        if (textPesan) {
            textPesan.textContent = 'Terima kasih sudah meluangkan waktu untuk mengecek kondisimu. Terus kenali pola dan perkembangan dirimu.';
        }
        if (btnAksiCheckIn) {
            btnAksiCheckIn.textContent = 'Lihat ringkasan';
            btnAksiCheckIn.href = 'ReportPagePelajar.html';
        }
    } else {
        if (cardCheckIn) cardCheckIn.className = 'banner-card banner-warning';
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

    const elStreak = document.getElementById('Value_Streak');
    const elMood = document.getElementById('Value_RerataMood');
    const elTidur = document.getElementById('Value_RerataTidur');
    const elMakan = document.getElementById('Value_PolaMakan');

    if (elStreak) elStreak.textContent = data.streak;
    if (elMood) elMood.textContent = data.rerataMood ? data.rerataMood.toFixed(1) : '-';
    if (elTidur) elTidur.textContent = data.rerataTidur ? data.rerataTidur.toFixed(1) : '-';
    if (elMakan) elMakan.textContent = data.polaMakan;

    const adaIndeks = data.indeks > 0;
    if (cardIndeks) cardIndeks.hidden = !adaIndeks;
    if (textIndeksKosong) textIndeksKosong.hidden = adaIndeks;
    if (adaIndeks) {
        if (valueIndeks) valueIndeks.textContent = data.indeks;
        if (fillIndeks) fillIndeks.style.width = `${Math.min(Math.max(data.indeks, 0), 100)}%`;
        if (badgeIndeks) badgeIndeks.textContent = data.indeksStatus;
        if (noteIndeks) noteIndeks.textContent = 'Dihitung dari rata-rata mood dan durasi tidur 90 hari terakhir.';
    }

    if (data.jadwal && itemJadwal) {
        itemJadwal.hidden = false;
        if (textJadwalKosong) textJadwalKosong.hidden = true;

        const elNamaNakes = document.getElementById('Text_NamaNakes');
        const elJenisNakes = document.getElementById('Text_JenisNakes');
        const elAvatarNakes = document.getElementById('Avatar_Nakes');
        const elTgl = document.getElementById('Text_JadwalTanggal');
        const elJam = document.getElementById('Text_JadwalJam');
        const elLokasi = document.getElementById('Text_JadwalLokasi');
        const elDetailLegacy = document.getElementById('Text_DetailJadwal');

        if (elNamaNakes) elNamaNakes.textContent = data.jadwal.namaNakes;
        if (elJenisNakes) elJenisNakes.textContent = data.jadwal.jenisNakes;
        if (elAvatarNakes) elAvatarNakes.textContent = data.jadwal.initials || 'TK';
        if (elTgl) elTgl.textContent = data.jadwal.tanggal;
        if (elJam) elJam.textContent = data.jadwal.jam;
        if (elLokasi) elLokasi.textContent = data.jadwal.lokasi;
        if (elDetailLegacy) {
            elDetailLegacy.textContent = `${data.jadwal.tanggal}\n${data.jadwal.jam}\n${data.jadwal.lokasi}`;
        }
    } else {
        if (itemJadwal) itemJadwal.hidden = true;
        if (textJadwalKosong) textJadwalKosong.hidden = false;
    }

});
