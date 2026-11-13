/**
 * MahaSehat - DashboardPageOrangTuaWali.js
 * Dashboard orang tua/wali (UC03). Ringkasan pelajar dari API, bukan dummy.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const TOKEN_KEY = 'mahasehat_token';
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.href = 'LoginPage.html';
        return;
    }

    localStorage.setItem('role', 'orangtuawali');

    const cardRegistrasi = document.getElementById('Card_Registrasi');
    const textDetailRegistrasi = document.getElementById('Text_DetailRegistrasi');
    const badgeStatusAkun = document.getElementById('Badge_StatusAkun');
    const textRingkasan = document.getElementById('Text_RingkasanKondisi');
    const textRingkasanKosong = document.getElementById('Text_RingkasanKosong');
    const userAvatar = document.getElementById('User_Avatar');
    const avatarPelajar = document.getElementById('Avatar_Pelajar');

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');

    const data = {
        nama: storedUser.nama || 'Orang Tua / Wali',
        pelajar: { nama: 'Pelajar', usia: null, terverifikasi: true },
        registrasi: null,
        hariTidakCheckIn: 0,
        rerataMood: 0,
        rerataTidur: 0,
        risiko: '-',
        ringkasan: ''
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

    const [hasilRingkasan, hasilMenunggu] = await Promise.allSettled([
        api('/api/reports/summary'),
        api('/api/auth/wali/menunggu')
    ]);

    if (hasilRingkasan.status === 'fulfilled') {
        const summary = hasilRingkasan.value;
        data.pelajar.nama = summary.nama || data.pelajar.nama;
        data.pelajar.usia = summary.usia;
        data.hariTidakCheckIn = Number(summary.jumlah_hari_tidak_check_in) || 0;
        const statistik = summary.statistik || {};
        data.rerataMood = Number(statistik.rerata_mood) || 0;
        data.rerataTidur = Number(statistik.rerata_tidur) || 0;
        data.risiko = summary.indikator_risiko || '-';
        data.ringkasan = summary.ringkasan_kondisi || '';
    } else if (hasilRingkasan.reason && hasilRingkasan.reason.message) {
        // Wali yang baru punya anak berstatus menunggu memang belum punya ringkasan.
        data.ringkasanKosongPesan = hasilRingkasan.reason.message;
    }

    if (hasilMenunggu.status === 'fulfilled' && hasilMenunggu.value) {
        const menunggu = hasilMenunggu.value;
        const tanggal = new Date(menunggu.tanggal_daftar);
        const teksTanggal = Number.isNaN(tanggal.getTime())
            ? menunggu.tanggal_daftar
            : tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        data.registrasi = { nama: menunggu.nama, tanggal: teksTanggal };
        data.pelajar.terverifikasi = false;
    }

    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    if (textNamaUser) textNamaUser.textContent = data.nama;
    if (textRoleUser) textRoleUser.textContent = 'Orang Tua / Wali';
    if (userAvatar) userAvatar.textContent = (data.nama || 'W').trim().charAt(0).toUpperCase();

    const textNamaPelajar = document.getElementById('Text_NamaPelajar');
    const textUsiaPelajar = document.getElementById('Text_UsiaPelajar');
    if (textNamaPelajar) textNamaPelajar.textContent = data.pelajar.nama;
    if (textUsiaPelajar) {
        textUsiaPelajar.textContent = data.pelajar.usia === null
            ? 'Usia belum diisi'
            : `${data.pelajar.usia} tahun`;
    }
    if (avatarPelajar) avatarPelajar.textContent = (data.pelajar.nama || 'P').trim().charAt(0).toUpperCase();

    if (badgeStatusAkun) {
        if (data.pelajar.terverifikasi) {
            badgeStatusAkun.textContent = 'Terverifikasi';
            badgeStatusAkun.className = 'badge badge--selesai';
        } else {
            badgeStatusAkun.textContent = 'Belum Terverifikasi';
            badgeStatusAkun.className = 'badge badge--belum';
        }
    }

    if (cardRegistrasi) {
        if (data.registrasi) {
            if (textDetailRegistrasi) {
                textDetailRegistrasi.textContent = `${data.registrasi.nama} mengajukan registrasi pada ${data.registrasi.tanggal}. Buka tautan konfirmasi yang dikirim ke e-mail Anda untuk menyetujui atau menolak.`;
            }
            const linkTinjau = document.getElementById('Link_TinjauRegistrasi');
            if (linkTinjau) {
                linkTinjau.hidden = true;
            }
            cardRegistrasi.hidden = false;
        } else {
            cardRegistrasi.hidden = true;
        }
    }

    const elHariTidakCheckIn = document.getElementById('Value_HariTidakCheckIn');
    const elMood = document.getElementById('Value_RerataMood');
    const elTidur = document.getElementById('Value_RerataTidur');
    const elRisiko = document.getElementById('Value_Risiko');

    if (elHariTidakCheckIn) elHariTidakCheckIn.textContent = data.hariTidakCheckIn;
    if (elMood) elMood.textContent = data.rerataMood.toFixed(1);
    if (elTidur) elTidur.textContent = data.rerataTidur.toFixed(1);
    if (elRisiko) elRisiko.textContent = data.risiko;

    if (textRingkasan) {
        if (data.ringkasan) {
            textRingkasan.textContent = data.ringkasan;
            textRingkasan.hidden = false;
            if (textRingkasanKosong) textRingkasanKosong.hidden = true;
        } else {
            textRingkasan.hidden = true;
            if (textRingkasanKosong) {
                textRingkasanKosong.textContent = data.ringkasanKosongPesan || 'Data ringkasan belum tersedia.';
                textRingkasanKosong.hidden = false;
            }
        }
    }

});
