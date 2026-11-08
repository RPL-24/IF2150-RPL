/**
 * MahaSehat - DashboardPageTenagaKesehatan.js
 * Logika antarmuka dashboard tenaga kesehatan profesional.
 * Keterlacakan DPPL: UC03 (Dashboard Nakes), C04 (Tenaga Kesehatan)
 */

document.addEventListener('DOMContentLoaded', () => {
    const listPengajuan = document.getElementById('List_Pengajuan');
    const textPengajuanKosong = document.getElementById('Text_PengajuanKosong');
    const listKetersediaan = document.getElementById('List_Ketersediaan');
    const textKetersediaanKosong = document.getElementById('Text_KetersediaanKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');
    const userAvatar = document.getElementById('User_Avatar');
    const avatarNakes = document.getElementById('Avatar_Nakes');

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');

    const data = {
        nama: storedUser.nama || 'Raissa Hadiman, M. Psi.',
        profil: {
            jenis: 'Psikologi Klinis',
            lokasi: 'Rumah Sakit ABC',
            biaya: 'Rp150.000 - Rp250.000 per sesi'
        },
        pengajuan: [
            { pelajar: 'Albert Einstein', waktu: 'Rabu, 11 November 2026 • 10:00 - 11:00 WIB', status: 'Diajukan' },
            { pelajar: 'Marie Curie', waktu: 'Kamis, 12 November 2026 • 13:00 - 14:00 WIB', status: 'Disetujui' },
            { pelajar: 'Isaac Newton', waktu: 'Jumat, 13 November 2026 • 09:00 - 10:00 WIB', status: 'Dijadwal Ulang' }
        ],
        jadwal: [
            { waktu: 'Rabu, 11 November 2026 • 08:00 - 09:00 WIB', status: 'Kosong' },
            { waktu: 'Rabu, 11 November 2026 • 10:00 - 11:00 WIB', status: 'Terisi' },
            { waktu: 'Kamis, 12 November 2026 • 13:00 - 14:00 WIB', status: 'Terisi' },
            { waktu: 'Jumat, 13 November 2026 • 15:00 - 16:00 WIB', status: 'Kosong' }
        ]
    };

    // User Profile
    const textNamaUser = document.getElementById('Text_NamaUser');
    const textRoleUser = document.getElementById('Text_RoleUser');
    if (textNamaUser) textNamaUser.textContent = data.nama;
    if (textRoleUser) textRoleUser.textContent = 'Tenaga Kesehatan';
    if (userAvatar) userAvatar.textContent = (data.nama || 'R').trim().charAt(0).toUpperCase();

    // Profil Banner
    const textNamaNakes = document.getElementById('Text_NamaNakes');
    const textJenisNakes = document.getElementById('Text_JenisNakes');
    const textDetailProfil = document.getElementById('Text_DetailProfil');

    if (textNamaNakes) textNamaNakes.textContent = data.nama;
    if (textJenisNakes) textJenisNakes.textContent = data.profil.jenis;
    if (textDetailProfil) {
        textDetailProfil.textContent = `${data.profil.lokasi} • ${data.profil.biaya}`;
    }
    if (avatarNakes) {
        const initials = data.nama.split(' ').map(n => n.charAt(0)).filter((c, i) => i < 2).join('');
        avatarNakes.textContent = initials || 'RH';
    }

    // Helper Kelas Badge
    function kelasBadge(status) {
        if (status === 'Diajukan') return 'status-badge badge-proses';
        if (status === 'Disetujui') return 'status-badge badge-selesai';
        if (status === 'Dijadwal Ulang') return 'status-badge badge-info';
        if (status === 'Kosong') return 'status-badge badge-selesai';
        return 'status-badge badge-netral';
    }

    function hitungPengajuan(status) {
        return data.pengajuan.filter(p => p.status === status).length;
    }

    // Stat Values
    const elDiajukan = document.getElementById('Value_Diajukan');
    const elDisetujui = document.getElementById('Value_Disetujui');
    const elDijadwalUlang = document.getElementById('Value_DijadwalUlang');
    const elSlotKosong = document.getElementById('Value_SlotKosong');

    if (elDiajukan) elDiajukan.textContent = hitungPengajuan('Diajukan');
    if (elDisetujui) elDisetujui.textContent = hitungPengajuan('Disetujui');
    if (elDijadwalUlang) elDijadwalUlang.textContent = hitungPengajuan('Dijadwal Ulang');
    if (elSlotKosong) elSlotKosong.textContent = data.jadwal.filter(j => j.status === 'Kosong').length;

    // Render Pengajuan Konsultasi Terbaru
    function tampilkanPengajuan() {
        if (!listPengajuan) return;
        if (data.pengajuan.length === 0) {
            listPengajuan.innerHTML = '';
            if (textPengajuanKosong) textPengajuanKosong.style.display = 'block';
            return;
        }

        if (textPengajuanKosong) textPengajuanKosong.style.display = 'none';
        let html = '';
        data.pengajuan.slice(0, 5).forEach((p) => {
            html += `
                <div class="list-item-row">
                    <div class="item-top-line">
                        <span class="item-subject-name">${p.pelajar}</span>
                        <span class="${kelasBadge(p.status)}">${p.status}</span>
                    </div>
                    <span class="item-time-text">${p.waktu}</span>
                </div>`;
        });
        listPengajuan.innerHTML = html;
    }

    // Render Jadwal Ketersediaan
    function tampilkanKetersediaan() {
        if (!listKetersediaan) return;
        if (data.jadwal.length === 0) {
            listKetersediaan.innerHTML = '';
            if (textKetersediaanKosong) textKetersediaanKosong.style.display = 'block';
            return;
        }

        if (textKetersediaanKosong) textKetersediaanKosong.style.display = 'none';
        let html = '';
        data.jadwal.forEach((j) => {
            html += `
                <div class="list-item-row">
                    <div class="item-top-line">
                        <span class="item-time-text" style="font-weight: 500; color: var(--color-ink);">${j.waktu}</span>
                        <span class="${kelasBadge(j.status)}">${j.status}</span>
                    </div>
                </div>`;
        });
        listKetersediaan.innerHTML = html;
    }

    tampilkanPengajuan();
    tampilkanKetersediaan();

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
