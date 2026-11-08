document.addEventListener('DOMContentLoaded', () => {
    const cardRegistrasi = document.getElementById('Card_Registrasi');
    const textDetailRegistrasi = document.getElementById('Text_DetailRegistrasi');
    const badgeStatusAkun = document.getElementById('Badge_StatusAkun');
    const textRingkasan = document.getElementById('Text_RingkasanKondisi');
    const textRingkasanKosong = document.getElementById('Text_RingkasanKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');

    const data = {
        nama: 'Hermann Einstein',
        pelajar: {
            nama: 'Albert Einstein',
            usia: 16,
            terverifikasi: false
        },
        registrasi: {
            nama: 'Albert Einstein',
            tanggal: '6 November 2026'
        },
        hariTidakCheckIn: 2,
        rerataMood: 3.2,
        rerataTidur: 7.5,
        risiko: 'Sedang',
        ringkasan: 'Kondisi pelajar cukup stabil, namun durasi tidur sedikit menurun di akhir pekan.'
    };

    document.getElementById('Text_NamaUser').innerText = data.nama;
    document.getElementById('Text_RoleUser').innerText = 'Orang Tua/Wali';

    document.getElementById('Text_NamaPelajar').innerText = data.pelajar.nama;
    document.getElementById('Text_UsiaPelajar').innerText = `${data.pelajar.usia} tahun`;

    if (data.pelajar.terverifikasi) {
        badgeStatusAkun.innerText = 'Terverifikasi';
        badgeStatusAkun.className = 'badge badge-selesai';
    }
    else {
        badgeStatusAkun.innerText = 'Belum Terverifikasi';
        badgeStatusAkun.className = 'badge badge-belum';
    }

    if (data.registrasi) {
        textDetailRegistrasi.innerText = `${data.registrasi.nama} mengajukan registrasi pada ${data.registrasi.tanggal}. Mohon konfirmasi sebagai wali.`;
        cardRegistrasi.hidden = false;
    }

    document.getElementById('Value_HariTidakCheckIn').innerText = data.hariTidakCheckIn;
    document.getElementById('Value_RerataMood').innerText = data.rerataMood.toFixed(1);
    document.getElementById('Value_RerataTidur').innerText = data.rerataTidur.toFixed(1);
    document.getElementById('Value_Risiko').innerText = data.risiko;

    if (data.ringkasan) {
        textRingkasan.innerText = data.ringkasan;
        textRingkasanKosong.hidden = true;
    }
    else {
        textRingkasan.innerText = '';
        textRingkasanKosong.hidden = false;
    }

    menuKeluar.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.confirm('Yakin ingin keluar dari akun?')) {
            localStorage.clear();
            window.location.href = 'LoginPage.html';
        }
    });
});