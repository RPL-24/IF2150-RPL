/**
 * [TEMPORARILY UNLINKED] Halaman tidak dirujuk dari navigasi mana pun sampai
 * keputusan desain tim diambil. Logika di bawah tetap utuh dan siap diaktifkan.
 *
 * MahaSehat - PengajuanKonsultasiPage.js
 * Logika antarmuka Pengajuan/Manajemen Konsultasi untuk Tenaga Kesehatan.
 * Keterlacakan DPPL: UC06, UC07 (Mengelola Pengajuan Konsultasi),
 * C21 (PengajuanKonsultasiPage), C23 (KonsultasiController).
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mahasehat_consultations';

    // Data Awal Pengajuan Konsultasi (dummy realistis jika belum ada di localStorage)
    const INITIAL_DATA = [
        {
            id: 'KONSULTASI_001',
            namaPelajar: 'Albert Einstein',
            email: 'albert.einstein@mahasiswa.itb.ac.id',
            tanggal: '2026-11-10',
            waktu: '10:00 - 11:00 WIB',
            lokasi: 'Klinik Psikologi ITB / Daring',
            status: 'Menunggu',
            keluhan: 'Sering merasa cemas dan kesulitan tidur menjelang ujian akhir semester. Butuh bimbingan manajemen stres.',
            metrik: {
                rerataMood: '2.8 / 5',
                rerataTidur: '5.2 Jam',
                pemicuStres: ['Akademik (60%)', 'Relasi (25%)']
            },
            catatanReschedule: '',
            alasanTolak: ''
        },
        {
            id: 'KONSULTASI_002',
            namaPelajar: 'Marie Curie',
            email: 'marie.curie@mahasiswa.itb.ac.id',
            tanggal: '2026-11-12',
            waktu: '13:00 - 14:00 WIB',
            lokasi: 'Ruang Konseling Ganesha 2',
            status: 'Disetujui',
            keluhan: 'Konsultasi lanjutan evaluasi teknik pernapasan dan relaksasi untuk menjaga ritme istirahat.',
            metrik: {
                rerataMood: '3.8 / 5',
                rerataTidur: '7.2 Jam',
                pemicuStres: ['Akademik (40%)', 'Keluarga (20%)']
            },
            catatanReschedule: '',
            alasanTolak: ''
        },
        {
            id: 'KONSULTASI_003',
            namaPelajar: 'Isaac Newton',
            email: 'isaac.newton@mahasiswa.itb.ac.id',
            tanggal: '2026-11-14',
            waktu: '15:30 - 16:30 WIB',
            lokasi: 'Klinik Psikologi ITB',
            status: 'Dijadwal Ulang',
            keluhan: 'Pola tidur berantakan dan penurunan motivasi belajar secara drastis dalam 2 minggu terakhir.',
            metrik: {
                rerataMood: '2.4 / 5',
                rerataTidur: '4.8 Jam',
                pemicuStres: ['Akademik (75%)', 'Lain-lain (25%)']
            },
            catatanReschedule: 'Dijadwalkan ulang karena jadwal praktik pagi bertabrakan dengan rapat koordinasi fakultas.',
            alasanTolak: ''
        },
        {
            id: 'KONSULTASI_004',
            namaPelajar: 'Nikola Tesla',
            email: 'nikola.tesla@mahasiswa.itb.ac.id',
            tanggal: '2026-11-15',
            waktu: '09:00 - 10:00 WIB',
            lokasi: 'Daring (Google Meet)',
            status: 'Menunggu',
            keluhan: 'Overthinking saat malam hari, sering terbangun tiba-tiba dengan detak jantung cepat.',
            metrik: {
                rerataMood: '3.0 / 5',
                rerataTidur: '5.0 Jam',
                pemicuStres: ['Akademik (50%)', 'Relasi (30%)']
            },
            catatanReschedule: '',
            alasanTolak: ''
        }
    ];

    // Kelas badge per status pengajuan
    const BADGE_KELAS = {
        'Menunggu': 'badge--menunggu',
        'Disetujui': 'badge--disetujui',
        'Dijadwal Ulang': 'badge--dijadwal-ulang',
        'Ditolak': 'badge--ditolak'
    };

    // Escape data pengguna sebelum masuk ke innerHTML
    function escapeHtml(nilai) {
        return String(nilai === undefined || nilai === null ? '' : nilai)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // --- Penyimpanan ---------------------------------------------------------
    function getConsultations() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return INITIAL_DATA;
        }
    }

    function saveConsultations(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        syncDashboardStats(data);
    }

    // Sinkronisasi angka ke halaman dashboard nakes
    function syncDashboardStats(data) {
        localStorage.setItem('nakes_stat_menunggu', String(data.filter(d => d.status === 'Menunggu').length));
        localStorage.setItem('nakes_stat_disetujui', String(data.filter(d => d.status === 'Disetujui').length));
        localStorage.setItem('nakes_stat_dijadwalulang', String(data.filter(d => d.status === 'Dijadwal Ulang').length));
    }

    // Format tanggal yang ramah
    function formatTanggal(isoDate) {
        if (!isoDate) return '-';
        const parts = isoDate.split('-');
        if (parts.length !== 3) return isoDate;
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (Number.isNaN(d.getTime())) return isoDate;
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // --- Elemen --------------------------------------------------------------
    const feedPengajuan = document.getElementById('Feed_Pengajuan');
    const boxKosong = document.getElementById('Box_Kosong');
    const searchInput = document.getElementById('Search_Pasien');
    const tabs = document.querySelectorAll('#Group_FilterStatus .seg-btn');

    const modalReschedule = document.getElementById('Modal_Reschedule');
    const formReschedule = document.getElementById('Form_Reschedule');
    const btnTutupReschedule = document.getElementById('Btn_TutupModalReschedule');
    const btnBatalReschedule = document.getElementById('Btn_BatalReschedule');

    const modalTolak = document.getElementById('Modal_Tolak');
    const formTolak = document.getElementById('Form_Tolak');
    const btnTutupTolak = document.getElementById('Btn_TutupModalTolak');
    const btnBatalTolak = document.getElementById('Btn_BatalTolak');

    let activeFilter = 'all';
    let searchQuery = '';

    // --- Umpan balik seragam (menggantikan alert) ---------------------------
    let pesanTimer = null;

    function tampilkanPesan(teks) {
        let kotak = document.getElementById('Pesan_UmpanBalik');
        if (!kotak) {
            kotak = document.createElement('div');
            kotak.id = 'Pesan_UmpanBalik';
            kotak.className = 'alert-box alert-success';
            kotak.setAttribute('role', 'status');
            feedPengajuan.parentNode.insertBefore(kotak, feedPengajuan);
        }
        kotak.textContent = teks;
        kotak.hidden = false;
        clearTimeout(pesanTimer);
        pesanTimer = setTimeout(() => { kotak.hidden = true; }, 4000);
    }

    // --- Render --------------------------------------------------------------
    function updateCounters(data) {
        document.getElementById('Count_Semua').textContent = data.length;
        document.getElementById('Count_Menunggu').textContent = data.filter(d => d.status === 'Menunggu').length;
        document.getElementById('Count_Disetujui').textContent = data.filter(d => d.status === 'Disetujui').length;
        document.getElementById('Count_DijadwalUlang').textContent = data.filter(d => d.status === 'Dijadwal Ulang').length;
        document.getElementById('Count_Ditolak').textContent = data.filter(d => d.status === 'Ditolak').length;
    }

    function tombolAksi(item) {
        const id = escapeHtml(item.id);
        const nama = escapeHtml(item.namaPelajar);
        if (item.status === 'Menunggu') {
            return `
                <button type="button" class="btn btn--sm btn--danger-outline btn-trigger-tolak" data-id="${id}" data-nama="${nama}">Tolak</button>
                <button type="button" class="btn btn--sm btn--secondary btn-trigger-reschedule" data-id="${id}" data-nama="${nama}">Jadwal Ulang</button>
                <button type="button" class="btn btn--sm btn--primary btn-trigger-setujui" data-id="${id}">Setujui Pengajuan</button>
            `;
        }
        if (item.status === 'Dijadwal Ulang') {
            return `
                <span class="action-note">Menunggu konfirmasi waktu dari pelajar (${escapeHtml(item.catatanReschedule || 'Penjadwalan ulang terkirim')})</span>
                <button type="button" class="btn btn--sm btn--secondary btn-trigger-reschedule" data-id="${id}" data-nama="${nama}">Ubah Jadwal</button>
                <button type="button" class="btn btn--sm btn--primary btn-trigger-setujui" data-id="${id}">Setujui Langsung</button>
            `;
        }
        if (item.status === 'Disetujui') {
            return `
                <span class="action-note action-note--ok">✓ Sesi konsultasi terjadwal</span>
                <button type="button" class="btn btn--sm btn--secondary btn-trigger-reschedule" data-id="${id}" data-nama="${nama}">Reschedule</button>
                <button type="button" class="btn btn--sm btn--danger-outline btn-trigger-tolak" data-id="${id}" data-nama="${nama}">Batalkan</button>
            `;
        }
        return `
            <span class="action-note action-note--danger">Ditolak: ${escapeHtml(item.alasanTolak || 'Jadwal tidak memungkinkan')}</span>
            <button type="button" class="btn btn--sm btn--secondary btn-trigger-setujui" data-id="${id}">Pulihkan Pengajuan</button>
        `;
    }

    function renderList() {
        const allData = getConsultations();
        updateCounters(allData);

        let filtered = allData;
        if (activeFilter !== 'all') {
            filtered = filtered.filter(item => item.status === activeFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.namaPelajar.toLowerCase().includes(q));
        }

        feedPengajuan.innerHTML = '';

        if (filtered.length === 0) {
            boxKosong.hidden = false;
            feedPengajuan.hidden = true;
            return;
        }

        boxKosong.hidden = true;
        feedPengajuan.hidden = false;

        filtered.forEach(item => {
            const card = document.createElement('article');
            card.className = 'consultation-card';
            card.id = `Card_Konsultasi_${item.id}`;

            const badgeKelas = BADGE_KELAS[item.status] || 'badge--netral';
            const avatarInitial = item.namaPelajar ? item.namaPelajar.charAt(0).toUpperCase() : 'P';
            const tagsHtml = (item.metrik.pemicuStres || [])
                .map(tag => `<span class="stress-tag">${escapeHtml(tag)}</span>`)
                .join('');

            card.innerHTML = `
                <div class="card-patient-header">
                    <div class="patient-info-group">
                        <div class="patient-avatar" aria-hidden="true">${escapeHtml(avatarInitial)}</div>
                        <div class="patient-meta">
                            <h2 class="patient-name">${escapeHtml(item.namaPelajar)}</h2>
                            <span class="patient-sub">${escapeHtml(item.email)}</span>
                        </div>
                    </div>
                    <span class="badge ${badgeKelas}">${escapeHtml(item.status)}</span>
                </div>

                <div class="card-consult-body">
                    <div class="consult-detail-section">
                        <div class="detail-item">
                            <span class="detail-label">Jadwal Sesi</span>
                            <span class="detail-value">${escapeHtml(formatTanggal(item.tanggal))} • ${escapeHtml(item.waktu)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Lokasi / Media</span>
                            <span class="detail-value">${escapeHtml(item.lokasi)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Keluhan Utama</span>
                            <p class="complaint-box">"${escapeHtml(item.keluhan)}"</p>
                        </div>
                    </div>

                    <!-- Ringkasan kesehatan pelajar (aman privasi KNF02) -->
                    <div class="health-overview-panel">
                        <span class="health-overview-title">Ringkasan Tren Kesehatan (7 Hari)</span>
                        <div class="health-metrics-row">
                            <div class="mini-metric-badge">
                                <div class="mini-metric-num">${escapeHtml(item.metrik.rerataMood)}</div>
                                <div class="mini-metric-lbl">Rerata Mood</div>
                            </div>
                            <div class="mini-metric-badge">
                                <div class="mini-metric-num">${escapeHtml(item.metrik.rerataTidur)}</div>
                                <div class="mini-metric-lbl">Rerata Tidur</div>
                            </div>
                        </div>
                        <span class="detail-label detail-label--spaced">Faktor Dominan Stres</span>
                        <div class="stress-tag-group">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>

                <div class="card-action-bar">
                    ${tombolAksi(item)}
                </div>
            `;

            feedPengajuan.appendChild(card);
        });

        pasangAksiTombol();
    }

    // --- Aksi kartu ----------------------------------------------------------
    function ubahStatus(id, perubahan) {
        const data = getConsultations();
        const target = data.find(d => d.id === id);
        if (!target) return null;
        Object.assign(target, perubahan);
        saveConsultations(data);
        renderList();
        return target;
    }

    function pasangAksiTombol() {
        document.querySelectorAll('.btn-trigger-setujui').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = ubahStatus(btn.dataset.id, { status: 'Disetujui' });
                if (target) tampilkanPesan(`Pengajuan konsultasi ${target.namaPelajar} berhasil disetujui.`);
            });
        });

        document.querySelectorAll('.btn-trigger-reschedule').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('Input_Reschedule_IdJadwal').value = btn.dataset.id;
                document.getElementById('Modal_Reschedule_Pasien').textContent = `Pasien: ${btn.dataset.nama}`;
                modalReschedule.showModal();
            });
        });

        document.querySelectorAll('.btn-trigger-tolak').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('Input_Tolak_IdJadwal').value = btn.dataset.id;
                document.getElementById('Modal_Tolak_Pasien').textContent = `Pasien: ${btn.dataset.nama}`;
                modalTolak.showModal();
            });
        });
    }

    // --- Modal jadwal ulang --------------------------------------------------
    function tutupModalReschedule() {
        modalReschedule.close();
        formReschedule.reset();
    }

    btnTutupReschedule.addEventListener('click', tutupModalReschedule);
    btnBatalReschedule.addEventListener('click', tutupModalReschedule);

    formReschedule.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('Input_Reschedule_IdJadwal').value;
        const tglBaru = document.getElementById('Input_Reschedule_Tanggal').value;
        const waktuBaru = document.getElementById('Input_Reschedule_Waktu').value;
        const catatan = document.getElementById('Input_Reschedule_Catatan').value;

        const target = ubahStatus(id, {
            status: 'Dijadwal Ulang',
            tanggal: tglBaru,
            waktu: waktuBaru,
            catatanReschedule: catatan
        });
        if (target) {
            tutupModalReschedule();
            tampilkanPesan(`Jadwal konsultasi ${target.namaPelajar} berhasil diajukan ulang ke ${formatTanggal(tglBaru)} (${waktuBaru}).`);
        }
    });

    // --- Modal tolak ---------------------------------------------------------
    function tutupModalTolak() {
        modalTolak.close();
        formTolak.reset();
    }

    btnTutupTolak.addEventListener('click', tutupModalTolak);
    btnBatalTolak.addEventListener('click', tutupModalTolak);

    formTolak.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('Input_Tolak_IdJadwal').value;
        const alasan = document.getElementById('Input_Tolak_Alasan').value;

        const target = ubahStatus(id, { status: 'Ditolak', alasanTolak: alasan });
        if (target) {
            tutupModalTolak();
            tampilkanPesan(`Pengajuan konsultasi ${target.namaPelajar} telah ditolak.`);
        }
    });

    // Klik di luar kartu modal menutup dialog
    [modalReschedule, modalTolak].forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
        });
    });

    // --- Filter & pencarian --------------------------------------------------
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            activeFilter = tab.dataset.filter;
            renderList();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderList();
        });
    }

    renderList();
});
