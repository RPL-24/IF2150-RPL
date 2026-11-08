document.addEventListener('DOMContentLoaded', () => {
    const listPengajuan = document.getElementById('List_Pengajuan');
    const textPengajuanKosong = document.getElementById('Text_PengajuanKosong');
    const listKetersediaan = document.getElementById('List_Ketersediaan');
    const textKetersediaanKosong = document.getElementById('Text_KetersediaanKosong');
    const menuKeluar = document.getElementById('Menu_Keluar');

    const data = {
        nama: 'Raissa Hadiman, M. Psi.',
        profil: {
            jenis: 'Psikologi Klinis',
            lokasi: 'Rumah Sakit ABC',
            biaya: 'Rp150.000 - Rp250.000 per sesi'
        },
        pengajuan: [
            { pelajar: 'Albert Einstein', waktu: 'Rabu, 11 November 2026 | 10:00 - 11:00 WIB', status: 'Diajukan' },
            { pelajar: 'Marie Curie', waktu: 'Kamis, 12 November 2026 | 13:00 - 14:00 WIB', status: 'Disetujui' },
            { pelajar: 'Isaac Newton', waktu: 'Jumat, 13 November 2026 | 09:00 - 10:00 WIB', status: 'Dijadwal Ulang' }
        ],
        jadwal: [
            { waktu: 'Rabu, 11 November 2026 | 08:00 - 09:00 WIB', status: 'Kosong' },
            { waktu: 'Rabu, 11 November 2026 | 10:00 - 11:00 WIB', status: 'Terisi' },
            { waktu: 'Kamis, 12 November 2026 | 13:00 - 14:00 WIB', status: 'Terisi' },
            { waktu: 'Jumat, 13 November 2026 | 15:00 - 16:00 WIB', status: 'Kosong' }
        ]
    };

    document.getElementById('Text_NamaUser').innerText = data.nama;
    document.getElementById('Text_RoleUser').innerText = 'Tenaga Kesehatan';

    document.getElementById('Text_NamaNakes').innerText = data.nama;
    document.getElementById('Text_JenisNakes').innerText = data.profil.jenis;
    document.getElementById('Text_DetailProfil').innerText = `${data.profil.lokasi}\n${data.profil.biaya}`;

    function kelasBadge(status) {
        if (status === 'Diajukan') {
            return 'badge badge-proses';
        }
        if (status === 'Disetujui') {
            return 'badge badge-selesai';
        }
        if (status === 'Dijadwal Ulang') {
            return 'badge badge-info';
        }
        if (status === 'Kosong') {
            return 'badge badge-selesai';
        }
        return 'badge badge-netral';
    }

    function hitungPengajuan(status) {
        return data.pengajuan.filter((p) => p.status === status).length;
    }

    document.getElementById('Value_Diajukan').innerText = hitungPengajuan('Diajukan');
    document.getElementById('Value_Disetujui').innerText = hitungPengajuan('Disetujui');
    document.getElementById('Value_DijadwalUlang').innerText = hitungPengajuan('Dijadwal Ulang');
    document.getElementById('Value_SlotKosong').innerText = data.jadwal.filter((j) => j.status === 'Kosong').length;

    function tampilkanPengajuan() {
        if (data.pengajuan.length === 0) {
            listPengajuan.innerHTML = '';
            textPengajuanKosong.hidden = false;
            return;
        }

        textPengajuanKosong.hidden = true;
        let html = '';
        data.pengajuan.slice(0, 5).forEach((p) => {
            html += `
                <div class="list-item">
                    <div class="item-atas">
                        <p class="jadwal-nama">${p.pelajar}</p>
                        <span class="${kelasBadge(p.status)}">${p.status}</span>
                    </div>
                    <p>${p.waktu}</p>
                </div>`;
        });
        listPengajuan.innerHTML = html;
    }

    function tampilkanKetersediaan() {
        if (data.jadwal.length === 0) {
            listKetersediaan.innerHTML = '';
            textKetersediaanKosong.hidden = false;
            return;
        }

        textKetersediaanKosong.hidden = true;
        let html = '';
        data.jadwal.forEach((j) => {
            html += `
                <div class="list-item">
                    <div class="item-atas">
                        <p>${j.waktu}</p>
                        <span class="${kelasBadge(j.status)}">${j.status}</span>
                    </div>
                </div>`;
        });
        listKetersediaan.innerHTML = html;
    }

    tampilkanPengajuan();
    tampilkanKetersediaan();

    menuKeluar.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.confirm('Yakin ingin keluar dari akun?')) {
            localStorage.clear();
            window.location.href = 'LoginPage.html';
        }
    });
});