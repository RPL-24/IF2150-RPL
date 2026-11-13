/**
 * MahaSehat - DashboardPageTenagaKesehatan.js
 * Dashboard tenaga kesehatan (UC03). Data diambil dari API, bukan dummy.
 * Keterlacakan DPPL: UC03, C04, C09, C24.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const TOKEN_KEY = 'mahasehat_token';
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.href = 'LoginPage.html';
        return;
    }

    const listPengajuan = document.getElementById('List_Pengajuan');
    const textPengajuanKosong = document.getElementById('Text_PengajuanKosong');
    const listKetersediaan = document.getElementById('List_Ketersediaan');
    const textKetersediaanKosong = document.getElementById('Text_KetersediaanKosong');

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const idProfil = storedUser.id_profil || storedUser.idProfil;

    const STATUS_LABEL = {
        Diajukan: 'Diajukan',
        Disetujui: 'Disetujui',
        Rescheduled: 'Dijadwal Ulang'
    };

    async function api(jalur) {
        const respons = await fetch(jalur, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await respons.json().catch(() => ({}));
        if (respons.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'LoginPage.html';
            throw new Error('Sesi berakhir.');
        }
        if (!respons.ok || data.success === false) {
            throw new Error(data.message || 'Data gagal dimuat.');
        }
        return data.data;
    }

    function formatWaktu(tanggal, waktu) {
        const opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const tgl = new Date(tanggal);
        const teksTanggal = Number.isNaN(tgl.getTime()) ? tanggal : tgl.toLocaleDateString('id-ID', opsi);
        return `${teksTanggal} • ${String(waktu).slice(0, 5)} WIB`;
    }

    function kelasBadge(status) {
        if (status === 'Diajukan') return 'badge badge--proses';
        if (status === 'Disetujui') return 'badge badge--selesai';
        if (status === 'Dijadwal Ulang' || status === 'Rescheduled') return 'badge badge--info';
        if (status === 'Kosong') return 'badge badge--selesai';
        return 'badge badge--netral';
    }

    function renderProfil(profil) {
        const textNamaUser = document.getElementById('Text_NamaUser');
        const textRoleUser = document.getElementById('Text_RoleUser');
        const userAvatar = document.getElementById('User_Avatar');
        const textNamaNakes = document.getElementById('Text_NamaNakes');
        const textJenisNakes = document.getElementById('Text_JenisNakes');
        const textDetailProfil = document.getElementById('Text_DetailProfil');
        const avatarNakes = document.getElementById('Avatar_Nakes');

        const nama = (profil && profil.nama) || storedUser.nama || 'Tenaga Kesehatan';
        if (textNamaUser) textNamaUser.textContent = nama;
        if (textRoleUser) textRoleUser.textContent = 'Tenaga Kesehatan';
        if (userAvatar) userAvatar.textContent = nama.trim().charAt(0).toUpperCase();
        if (textNamaNakes) textNamaNakes.textContent = nama;
        if (textJenisNakes) textJenisNakes.textContent = profil.jenis_tenaga_kesehatan || 'Tenaga Kesehatan';
        if (textDetailProfil) {
            const lokasi = profil.nama_fasilitas || profil.lokasi || '-';
            const biaya = profil.estimasi_biaya
                ? `Rp${Number(profil.estimasi_biaya).toLocaleString('id-ID')} per sesi`
                : 'Tarif belum diisi';
            textDetailProfil.textContent = `${lokasi} • ${biaya}`;
        }
        if (avatarNakes) {
            avatarNakes.textContent = nama.split(' ').map((kata) => kata.charAt(0)).slice(0, 2).join('').toUpperCase() || 'TK';
        }
    }

    function renderRingkasan(pengajuan, jadwal) {
        const hitung = (status) => pengajuan.filter((item) => item.status === status).length;
        const elDiajukan = document.getElementById('Value_Diajukan');
        const elDisetujui = document.getElementById('Value_Disetujui');
        const elDijadwalUlang = document.getElementById('Value_DijadwalUlang');
        const elSlotKosong = document.getElementById('Value_SlotKosong');

        if (elDiajukan) elDiajukan.textContent = hitung('Diajukan');
        if (elDisetujui) elDisetujui.textContent = hitung('Disetujui');
        if (elDijadwalUlang) elDijadwalUlang.textContent = hitung('Dijadwal Ulang');
        if (elSlotKosong) elSlotKosong.textContent = jadwal.filter((slot) => slot.status_ketersediaan).length;
    }

    function tampilkanPengajuan(pengajuan) {
        if (!listPengajuan) return;
        if (pengajuan.length === 0) {
            listPengajuan.innerHTML = '';
            if (textPengajuanKosong) textPengajuanKosong.hidden = false;
            return;
        }
        if (textPengajuanKosong) textPengajuanKosong.hidden = true;

        listPengajuan.innerHTML = pengajuan.slice(0, 5).map((item) => `
            <div class="list-item-row">
                <div class="item-top-line">
                    <span class="item-subject-name">${item.nama_pelajar || 'Pelajar'}</span>
                    <span class="${kelasBadge(item.status)}">${item.status}</span>
                </div>
                <span class="item-time-text">${formatWaktu(item.tanggal, item.waktu)}</span>
            </div>`).join('');
    }

    function tampilkanKetersediaan(jadwal) {
        if (!listKetersediaan) return;
        if (jadwal.length === 0) {
            listKetersediaan.innerHTML = '';
            if (textKetersediaanKosong) textKetersediaanKosong.hidden = false;
            return;
        }
        if (textKetersediaanKosong) textKetersediaanKosong.hidden = true;

        listKetersediaan.innerHTML = jadwal.map((slot) => {
            const status = slot.status_ketersediaan ? 'Kosong' : 'Terisi';
            return `
                <div class="list-item-row">
                    <div class="item-top-line">
                        <span class="item-time-text" style="font-weight: 500; color: var(--color-ink);">${formatWaktu(slot.tanggal, slot.waktu)}</span>
                        <span class="${kelasBadge(status)}">${status}</span>
                    </div>
                </div>`;
        }).join('');
    }

    try {
        const daftarPengajuan = await api('/api/konsultasi/masuk');
        const pengajuan = daftarPengajuan.map((item) => ({
            nama_pelajar: item.nama_pelajar,
            tanggal: item.tanggal,
            waktu: item.waktu,
            status: STATUS_LABEL[item.status_pengajuan] || item.status_pengajuan
        }));

        const jadwal = await api('/api/konsultasi/jadwal');

        let profil = {};
        if (idProfil) {
            try {
                profil = await api(`/api/tenaga-kesehatan/${encodeURIComponent(idProfil)}`);
            } catch (error) {
                profil = {};
            }
        }

        renderProfil(profil);
        renderRingkasan(pengajuan, jadwal);
        tampilkanPengajuan(pengajuan);
        tampilkanKetersediaan(jadwal);
    } catch (error) {
        if (!localStorage.getItem(TOKEN_KEY)) return;
        renderProfil({});
        renderRingkasan([], []);
        tampilkanPengajuan([]);
        tampilkanKetersediaan([]);
        if (textPengajuanKosong) textPengajuanKosong.textContent = error.message || 'Data gagal dimuat.';
    }
});
