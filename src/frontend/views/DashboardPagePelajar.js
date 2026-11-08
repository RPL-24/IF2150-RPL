document.addEventListener('DOMContentLoaded', () => {
    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    const textPesan = document.getElementById('Text_PesanCheckIn');
    const iconStatus = document.getElementById('Icon_StatusCheckIn');
    const itemJadwal = document.getElementById('Item_Jadwal');
    const textJadwalKosong = document.getElementById('Text_JadwalKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');

    const data = {
        nama: 'Albert Einstein',
        role: 'pelajar',
        sudahCheckIn: false,
        streak: 5,
        rerataMood: 3.2,
        rerataTidur: 8.2,
        polaMakan: 3.2,
        jadwal: {
            namaNakes: 'Raissa Hadiman, M. Psi.',
            jenisNakes: 'Psikologi Klinis',
            tanggal: 'Rabu, 28 Oktober 2026',
            jam: '10:00 - 11:00 WIB',
            lokasi: 'Rumah Sakit ABC'
        }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get('checkin') === 'sudah') {
        data.sudahCheckIn = true;
    }
    if (params.get('checkin') === 'belum') {
        data.sudahCheckIn = false;
    }

    const role = localStorage.getItem('role') || data.role;

    const namaDepan = data.nama.split(' ').slice(-1)[0];
    textNamaUser.innerText = data.nama;
    textRoleUser.innerText = 'Pelajar';

    function sapaanWaktu() {
        const jam = new Date().getHours();
        if (jam < 11) {
            return 'Selamat Pagi';
        }
        if (jam < 15) {
            return 'Selamat Siang';
        }
        if (jam < 18) {
            return 'Selamat Sore';
        }
        return 'Selamat Malam';
    }

    const ikonX = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const ikonCentang = '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>';
    const sapaan = `${sapaanWaktu()}, ${namaDepan}.`;

    if (data.sudahCheckIn) {
        textPesan.innerText = `${sapaan} Terima kasih sudah meluangkan waktu untuk check-in hari ini! Yuk, terus kenali pola dan perkembangan kondisi dirimu.`;
        iconStatus.innerHTML = ikonCentang;
    }
    else {
        textPesan.innerText = `${sapaan} Hari ini kamu belum mengisi daily check-in. Yuk, luangkan 5 menitmu untuk merefleksikan kesehatan mentalmu hari ini.`;
        iconStatus.innerHTML = ikonX;
    }

    document.getElementById('Value_Streak').innerText = data.streak;
    document.getElementById('Value_RerataMood').innerText = data.rerataMood.toFixed(1);
    document.getElementById('Value_RerataTidur').innerText = data.rerataTidur.toFixed(1);
    document.getElementById('Value_PolaMakan').innerText = data.polaMakan.toFixed(1);

    if (data.jadwal) {
        document.getElementById('Text_NamaNakes').innerText = data.jadwal.namaNakes;
        document.getElementById('Text_JenisNakes').innerText = data.jadwal.jenisNakes;
        document.getElementById('Text_DetailJadwal').innerText = `${data.jadwal.tanggal}\n${data.jadwal.jam}\n${data.jadwal.lokasi}`;
        itemJadwal.hidden = false;
        textJadwalKosong.style.display = 'none';
    }

    menuKeluar.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.confirm('Yakin ingin keluar dari akun?')) {
            localStorage.clear();
            window.location.href = 'LoginPage.html';
        }
    });
});