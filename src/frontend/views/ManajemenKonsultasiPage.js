/**
 * MahaSehat - ManajemenKonsultasiPage.js
 * Manajemen pengajuan konsultasi tenaga kesehatan (UC07).
 * Data dan aksi diambil dari /api/konsultasi.
 */

(function () {
    'use strict';

    const API = '/api/konsultasi';
    const TOKEN_KEY = 'mahasehat_token';

    const STATUS_LABEL = {
        Diajukan: 'Menunggu',
        Disetujui: 'Disetujui',
        Rescheduled: 'Dijadwal Ulang'
    };

    const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    // State Aplikasi
    let consultations = [];
    let selectedId = null;
    let currentFilter = 'all';
    let searchQuery = '';

    // Elemen DOM
    const listContainer = document.getElementById('List_Permohonan');
    const inputCari = document.getElementById('Input_CariPelajar');
    const filterPills = document.querySelectorAll('.filter-pill');

    // Elemen Panel Detail
    const detailAvatar = document.getElementById('Detail_Avatar');
    const detailNama = document.getElementById('Detail_Nama');
    const detailSubInfo = document.getElementById('Detail_SubInfo');
    const detailWaktuSesi = document.getElementById('Detail_WaktuSesi');
    const detailMetodeSesi = document.getElementById('Detail_MetodeSesi');
    const detailKeluhanUtama = document.getElementById('Detail_KeluhanUtama');
    const statMoodRerata = document.getElementById('Stat_MoodRerata');
    const barsMoodWrap = document.getElementById('Bars_Mood');
    const statTidurRerata = document.getElementById('Stat_TidurRerata');
    const barsTidurWrap = document.getElementById('Bars_Tidur');
    const inputMeetLink = document.getElementById('Input_MeetLink');
    const textareaCatatan = document.getElementById('Textarea_Catatan');
    const btnSetujui = document.getElementById('Btn_Setujui');
    const btnJadwalkanUlang = document.getElementById('Btn_JadwalkanUlang');
    const btnTolak = document.getElementById('Btn_Tolak');
    const btnHubungiPelajar = document.getElementById('Btn_HubungiPelajar');

    // Elemen Counter Tab
    const countSemua = document.getElementById('Count_Semua');
    const countMenunggu = document.getElementById('Count_Menunggu');
    const countDisetujui = document.getElementById('Count_Disetujui');
    const countRiwayat = document.getElementById('Count_Riwayat');
    const badgePendingNav = document.getElementById('Badge_PendingCount');

    // Elemen Modal Jadwal Ulang
    const modalJadwal = document.getElementById('Modal_JadwalUlang');
    const modalTolak = document.getElementById('Modal_KonfirmasiTolak');
    const namaTolak = document.getElementById('Nama_Tolak');
    const btnKonfirmasiTolak = document.getElementById('Btn_KonfirmasiTolak');
    const btnBatalTolak = document.getElementById('Btn_BatalTolak');

    // Drawer detail untuk layar <=1200px: kolom detail yang sama dipindahkan
    const splitView = document.getElementById('SplitView_Konsultasi');
    const detailColumn = document.getElementById('Panel_Detail');
    const dialogDetail = document.getElementById('Dialog_DetailKonsultasi');
    const btnTutupDetail = document.getElementById('Btn_TutupDetail');
    const mqDrawer = window.matchMedia('(max-width: 1200px)');
    let pemicuDetail = null;
    const modalSub = document.getElementById('Modal_JadwalSub');
    const modalInputTanggal = document.getElementById('Modal_InputTanggal');
    const modalInputWaktu = document.getElementById('Modal_InputWaktu');
    const modalBtnSimpan = document.getElementById('Modal_BtnSimpanJadwal');
    const modalBtnBatal = document.getElementById('Modal_BtnBatalJadwal');

    // Elemen Toast

    function token() {
        return localStorage.getItem(TOKEN_KEY);
    }

    async function api(jalur, opsi = {}) {
        const { method = 'GET', body } = opsi;
        const respons = await fetch(`${API}${jalur}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token()}`
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await respons.json().catch(() => ({}));
        if (respons.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'LoginPage.html';
            throw new Error('Sesi kamu sudah berakhir.');
        }
        if (!respons.ok || data.success === false) {
            throw new Error(data.message || 'Permintaan gagal.');
        }
        return data;
    }

    function inisial(nama) {
        return String(nama || 'P')
            .trim()
            .split(/\s+/)
            .map((kata) => kata.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    function formatTanggal(iso, opsi) {
        const tanggal = new Date(iso);
        if (Number.isNaN(tanggal.getTime())) return String(iso || '-');
        return tanggal.toLocaleDateString('id-ID', opsi);
    }

    /** Samakan bentuk data API dengan kartu antrean yang sudah ada. */
    function petakan(baris) {
        const jam = String(baris.waktu || '').slice(0, 5);
        return {
            id: baris.id_jadwal,
            nama: baris.nama_pelajar || 'Pelajar',
            inisial: inisial(baris.nama_pelajar),
            avatarColor: 'var(--color-teal)',
            sekolah: 'Pelajar MahaSehat',
            nis: '-',
            status: STATUS_LABEL[baris.status_pengajuan] || baris.status_pengajuan,
            statusApi: baris.status_pengajuan,
            jadwal: `${formatTanggal(baris.tanggal, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · ${jam} WIB`,
            jadwalFull: `${formatTanggal(baris.tanggal, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${jam} WIB (60 Menit)`,
            metode: 'Sesi konsultasi 60 menit',
            keluhan: baris.keluhan || '-',
            moodRerata: '-',
            moodBars: [],
            tidurRerata: '-',
            tidurBars: [],
            linkMeet: '-',
            catatan: '',
            tanggal: baris.tanggal,
            waktu: jam
        };
    }

    async function muatData() {
        try {
            const hasil = await api('/masuk');
            consultations = (hasil.data || []).map(petakan);
            if (!consultations.some((item) => item.id === selectedId)) {
                selectedId = consultations.length ? consultations[0].id : null;
            }
        } catch (error) {
            consultations = [];
            selectedId = null;
            showToast(error.message || 'Daftar pengajuan gagal dimuat.', 'danger');
        }
        if (detailColumn) detailColumn.hidden = consultations.length === 0;
        renderQueueList();
        if (selectedId) selectConsultation(selectedId);
    }

    /**
     * Hitung Jumlah Antrean Per Status
     */
    function updateCounters() {
        const total = consultations.length;
        const menunggu = consultations.filter(c => c.statusApi === 'Diajukan').length;
        const disetujui = consultations.filter(c => c.statusApi === 'Disetujui').length;
        const riwayat = consultations.filter(c => c.statusApi === 'Rescheduled').length;

        if (countSemua) countSemua.textContent = total;
        if (countMenunggu) countMenunggu.textContent = menunggu;
        if (countDisetujui) countDisetujui.textContent = disetujui;
        if (countRiwayat) countRiwayat.textContent = riwayat;
        if (badgePendingNav) {
            badgePendingNav.textContent = menunggu;
            badgePendingNav.hidden = menunggu === 0;
        }
    }

    /**
     * Render Daftar Antrean di Kolom Kiri
     */
    function renderQueueList() {
        if (!listContainer) return;

        listContainer.innerHTML = '';

        // Filter berdasarkan tab dan pencarian
        const filtered = consultations.filter(item => {
            let matchStatus = true;
            if (currentFilter === 'Menunggu') matchStatus = item.statusApi === 'Diajukan';
            else if (currentFilter === 'Disetujui') matchStatus = item.statusApi === 'Disetujui';
            else if (currentFilter === 'Dijadwal Ulang') matchStatus = item.statusApi === 'Rescheduled';

            const query = searchQuery.trim().toLowerCase();
            const matchQuery = !query || 
                item.nama.toLowerCase().includes(query) || 
                item.sekolah.toLowerCase().includes(query) ||
                item.keluhan.toLowerCase().includes(query);

            return matchStatus && matchQuery;
        });

        if (selectedId && !filtered.some(item => item.id === selectedId)) {
            selectedId = null;
            tutupDetail();
        }

        updateCounters();

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-msg">
                    Tidak ada permohonan konsultasi yang sesuai dengan kriteria.
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const isSelected = item.id === selectedId;
            const card = document.createElement('div');
            card.className = `queue-card-item ${isSelected ? 'selected' : ''}`;
            card.id = `CardItem_${item.id}`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            if (modeDrawer()) card.setAttribute('aria-haspopup', 'dialog');

            // Format chip status
            let chipClass = 'badge--menunggu';
            if (item.statusApi === 'Disetujui') chipClass = 'badge--disetujui';
            else if (item.statusApi === 'Rescheduled') chipClass = 'badge--dijadwal-ulang';

            card.innerHTML = `
                <div class="queue-card-top">
                    <div class="queue-card-avatar" style="background-color: ${item.avatarColor}">${item.inisial}</div>
                    <div class="queue-card-meta">
                        <h4 class="queue-card-name">${escapeHtml(item.nama)}</h4>
                        <p class="queue-card-sub">${escapeHtml(item.sekolah)}</p>
                    </div>
                    <span class="badge ${chipClass}">${escapeHtml(item.status)}</span>
                    <span class="queue-card-chevron" aria-hidden="true">›</span>
                </div>
                <div class="queue-card-divider"></div>
                <p class="queue-card-schedule">${escapeHtml(item.jadwal)}</p>
                <p class="queue-card-snippet">${escapeHtml(item.keluhan)}</p>
                <span class="queue-card-tag">Sesi 60 menit</span>
            `;

            card.addEventListener('click', () => {
                selectConsultation(item.id);
                bukaDetail(card);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectConsultation(item.id);
                    bukaDetail(card);
                }
            });

            listContainer.appendChild(card);
        });
    }

    /**
     * Pilih Permohonan dan Tampilkan Detail di Kolom Kanan
     */
    function selectConsultation(id) {
        selectedId = id;
        const target = consultations.find(c => c.id === id);
        if (!target) return;

        // Render ulang kelas 'selected' pada kartu antrean
        document.querySelectorAll('.queue-card-item').forEach(card => {
            card.classList.toggle('selected', card.id === `CardItem_${id}`);
        });

        // Update Panel Kanan
        if (detailAvatar) {
            detailAvatar.textContent = target.inisial;
            detailAvatar.style.backgroundColor = target.avatarColor;
        }
        if (detailNama) detailNama.textContent = target.nama;
        if (detailSubInfo) detailSubInfo.textContent = `Pengajuan konsultasi · ${target.status}`;
        if (detailWaktuSesi) detailWaktuSesi.textContent = target.jadwalFull;
        if (detailMetodeSesi) detailMetodeSesi.textContent = target.metode;
        if (detailKeluhanUtama) detailKeluhanUtama.textContent = `"${target.keluhan}"`;
        if (statMoodRerata) statMoodRerata.textContent = target.moodRerata;
        if (statTidurRerata) statTidurRerata.textContent = target.tidurRerata;
        if (inputMeetLink) inputMeetLink.value = target.linkMeet;
        if (textareaCatatan) textareaCatatan.value = target.catatan;

        // Render Batang Grafik Mood (7 Hari)
        if (barsMoodWrap) {
            barsMoodWrap.innerHTML = '';
            target.moodBars.forEach((val, idx) => {
                const col = document.createElement('div');
                col.className = 'mini-bar-col';
                col.innerHTML = `
                    <div class="mini-bar-fill" style="height: ${val}px;" title="${DAYS[idx]}: ${val}"></div>
                    <span class="mini-bar-day">${DAYS[idx]}</span>
                `;
                barsMoodWrap.appendChild(col);
            });
        }

        // Render Batang Grafik Tidur (7 Hari)
        if (barsTidurWrap) {
            barsTidurWrap.innerHTML = '';
            target.tidurBars.forEach((val, idx) => {
                const col = document.createElement('div');
                col.className = 'mini-bar-col';
                col.innerHTML = `
                    <div class="mini-bar-fill amber" style="height: ${val}px;" title="${DAYS[idx]}: ${val}"></div>
                    <span class="mini-bar-day">${DAYS[idx]}</span>
                `;
                barsTidurWrap.appendChild(col);
            });
        }

        // Update Status Tombol Tindakan Berdasarkan Status Saat Ini
        if (btnSetujui) {
            const bisaSetujui = target.statusApi === 'Diajukan';
            btnSetujui.textContent = bisaSetujui
                ? 'Setujui Permohonan'
                : (target.statusApi === 'Disetujui' ? 'Telah Disetujui' : 'Sudah Dijadwal Ulang');
            btnSetujui.disabled = !bisaSetujui;
            btnSetujui.style.opacity = bisaSetujui ? '1' : '0.6';
        }
    }

    function showToast(message, type = 'success') {
        window.MahaSehatFeedback.show(message, type);
    }

    /**
     * Perbarui Status Konsultasi lewat API
     */
    async function updateStatus(statusApi, feedbackMsg) {
        const item = consultations.find(c => c.id === selectedId);
        if (!item) return;

        try {
            await api(`/${encodeURIComponent(item.id)}/status`, {
                method: 'PUT',
                body: { status: statusApi }
            });
            item.statusApi = statusApi;
            item.status = STATUS_LABEL[statusApi] || statusApi;
            renderQueueList();
            if (selectedId) selectConsultation(selectedId);
            tutupDetail();
            showToast(feedbackMsg);
        } catch (error) {
            showToast(error.message || 'Status pengajuan gagal diubah.', 'danger');
        }
    }

    /**
     * Drawer detail: di layar <=1200px kolom detail dipindahkan ke <dialog>
     * sehingga tampil sebagai panel di depan dengan latar gelap.
     */
    function modeDrawer() {
        return mqDrawer.matches;
    }

    function pindahkanDetailKeDialog() {
        if (dialogDetail && detailColumn && detailColumn.parentElement !== dialogDetail) {
            dialogDetail.appendChild(detailColumn);
        }
    }

    function pindahkanDetailKeGrid() {
        if (splitView && detailColumn && detailColumn.parentElement !== splitView) {
            splitView.appendChild(detailColumn);
        }
    }

    function bukaDetail(pemicu) {
        if (!modeDrawer() || !dialogDetail) return;
        pemicuDetail = pemicu || null;
        pindahkanDetailKeDialog();
        if (!dialogDetail.open) dialogDetail.showModal();
        document.body.classList.add('body-locked');
    }

    function tutupDetail() {
        if (!dialogDetail) return;
        if (dialogDetail.open) dialogDetail.close();
        document.body.classList.remove('body-locked');
    }

    function sinkronkanModeDetail() {
        if (modeDrawer()) {
            pindahkanDetailKeDialog();
            return;
        }
        tutupDetail();
        pindahkanDetailKeGrid();
    }

    /**
     * Sanitasi Teks HTML
     */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Pemasangan Event Listeners
     */
    function setupEventListeners() {
        // Search Input
        if (inputCari) {
            inputCari.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderQueueList();
            });
        }

        // Filter Pills
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.getAttribute('data-filter');
                renderQueueList();
            });
        });

        // Tombol Setujui
        if (btnSetujui) {
            btnSetujui.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                const name = item ? item.nama : 'Pelajar';
                updateStatus('Disetujui', `Permohonan konsultasi ${name} berhasil disetujui.`);
            });
        }

        // Tombol Tolak -> dialog konfirmasi sesuai design system
        if (btnTolak && modalTolak) {
            btnTolak.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;
                if (namaTolak) namaTolak.textContent = item.nama;
                modalTolak.showModal();
            });
        }

        if (btnBatalTolak && modalTolak) {
            btnBatalTolak.addEventListener('click', () => modalTolak.close());
        }

        if (btnKonfirmasiTolak && modalTolak) {
            btnKonfirmasiTolak.addEventListener('click', async () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;
                const name = item.nama;
                modalTolak.close();
                try {
                    await api(`/${encodeURIComponent(item.id)}/tolak`, { method: 'POST' });
                    await muatData();
                    showToast(`Permohonan konsultasi ${name} ditolak dan slotnya dibuka kembali.`);
                } catch (error) {
                    showToast(error.message || 'Permohonan gagal ditolak.', 'danger');
                }
            });
        }

        // Tombol Jadwal Ulang -> Tampilkan Modal
        if (btnJadwalkanUlang) {
            btnJadwalkanUlang.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;
                if (modalSub) modalSub.textContent = `Tentukan tanggal dan waktu baru untuk sesi bersama ${item.nama}.`;
                if (modalJadwal) modalJadwal.showModal();
            });
        }

        // Modal Batal
        if (modalBtnBatal && modalJadwal) {
            modalBtnBatal.addEventListener('click', () => {
                modalJadwal.close();
            });
        }

        // Modal Simpan Jadwal Baru
        if (modalBtnSimpan && modalJadwal) {
            modalBtnSimpan.addEventListener('click', async () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;

                const tglVal = modalInputTanggal ? modalInputTanggal.value : '';
                const waktuVal = modalInputWaktu ? String(modalInputWaktu.value).slice(0, 5) : '';
                if (!tglVal || !waktuVal) {
                    showToast('Tanggal dan jam baru wajib diisi.', 'danger');
                    return;
                }

                try {
                    await api(`/${encodeURIComponent(item.id)}/jadwal`, {
                        method: 'PUT',
                        body: { tanggal: tglVal, waktu: waktuVal }
                    });
                    modalJadwal.close();
                    await muatData();
                    tutupDetail();
                    showToast(`Jadwal konsultasi ${item.nama} berhasil dipindahkan.`);
                } catch (error) {
                    showToast(error.message || 'Jadwal gagal diperbarui.', 'danger');
                }
            });
        }

        // Tombol Hubungi Pelajar
        if (btnHubungiPelajar) {
            btnHubungiPelajar.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                showToast(`Sesi dengan ${item ? item.nama : 'pelajar'} dijadwalkan lewat jadwal konsultasi.`);
            });
        }
    }

    // Drawer detail: tutup lewat tombol, ESC (native), atau klik backdrop
    if (btnTutupDetail) {
        btnTutupDetail.addEventListener('click', tutupDetail);
    }

    if (dialogDetail) {
        dialogDetail.addEventListener('click', (event) => {
            if (event.target === dialogDetail) tutupDetail();
        });
        dialogDetail.addEventListener('close', () => {
            document.body.classList.remove('body-locked');
            if (pemicuDetail && pemicuDetail.isConnected) pemicuDetail.focus();
            pemicuDetail = null;
        });
    }

    if (mqDrawer.addEventListener) {
        mqDrawer.addEventListener('change', () => {
            sinkronkanModeDetail();
            renderQueueList();
        });
    }

    // Eksekusi Saat Dokumen Siap
    document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
        const namaSaya = user.nama || 'Tenaga Kesehatan';
        const elNama = document.getElementById('Text_NamaUser');
        const elAvatar = document.getElementById('User_Avatar');
        if (elNama) elNama.textContent = namaSaya;
        if (elAvatar) elAvatar.textContent = namaSaya.trim().charAt(0).toUpperCase();

        sinkronkanModeDetail();
        setupEventListeners();
        muatData();
    });

})();

