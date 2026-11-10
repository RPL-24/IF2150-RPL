/**
 * MahaSehat - ManajemenKonsultasiPage.js
 * Logika Interaktif Manajemen Konsultasi Tenaga Kesehatan
 * Mengikuti Konvensi Desain Anti-Slop & MVC MahaSehat
 */

(function () {
    'use strict';

    // Kunci penyimpanan LocalStorage
    const STORAGE_KEY = 'mahasehat_consultations_data';

    // Data Awal Bawaan (Default Mock Data)
    const DEFAULT_CONSULTATIONS = [
        {
            id: 'konsul-001',
            nama: 'Albert Einstein',
            inisial: 'AE',
            avatarColor: '#78C9C0',
            sekolah: 'Kelas XII · SMAN 1 Bandung',
            nis: '215001',
            status: 'Menunggu',
            jadwal: 'Selasa, 10 Nov 2026 · 10.00 - 11.00 WIB',
            jadwalFull: 'Selasa, 10 November 2026 · 10.00 - 11.00 WIB (60 Menit)',
            metode: 'Daring (Google Meet) · Sesi Mandiri 1 Pelajar',
            keluhan: 'Sering merasa cemas dan kesulitan tidur menjelang ujian akhir semester. Butuh bimbingan manajemen stres dan latihan regulasi emosi.',
            moodRerata: '2.8 / 5.0',
            moodBars: [36, 28, 22, 34, 40, 42, 30],
            tidurRerata: '5.2 Jam',
            tidurBars: [28, 24, 20, 32, 44, 48, 30],
            linkMeet: 'https://meet.google.com/mhs-klsk-nks',
            catatan: 'Mohon persiapkan ringkasan kendala belajar. Sesi dimulai tepat pukul 10.00 WIB.'
        },
        {
            id: 'konsul-002',
            nama: 'Marie Curie',
            inisial: 'MC',
            avatarColor: '#F8C16F',
            sekolah: 'Kelas XI · SMAN 3 Bandung',
            nis: '215002',
            status: 'Disetujui',
            jadwal: 'Kamis, 12 Nov 2026 · 13.00 - 14.00 WIB',
            jadwalFull: 'Kamis, 12 November 2026 · 13.00 - 14.00 WIB (60 Menit)',
            metode: 'Tatap Muka (Klinik Ganesha 2) · Sesi Mandiri',
            keluhan: 'Evaluasi lanjutan teknik pernapasan dan relaksasi untuk menjaga ritme istirahat saat praktikum padat.',
            moodRerata: '3.8 / 5.0',
            moodBars: [40, 42, 44, 38, 46, 48, 44],
            tidurRerata: '7.2 Jam',
            tidurBars: [46, 44, 48, 42, 50, 52, 48],
            linkMeet: '-',
            catatan: 'Konsultasi tatap muka di Ruang Konseling Ganesha 2. Harap membawa lembar catatan evaluasi mandiri.'
        },
        {
            id: 'konsul-003',
            nama: 'Isaac Newton',
            inisial: 'IN',
            avatarColor: '#78C9C0',
            sekolah: 'Kelas X · SMAN 1 Bandung',
            nis: '215003',
            status: 'Menunggu',
            jadwal: 'Jumat, 13 Nov 2026 · 09.00 - 10.00 WIB',
            jadwalFull: 'Jumat, 13 November 2026 · 09.00 - 10.00 WIB (60 Menit)',
            metode: 'Daring (Google Meet) · Sesi Mandiri 1 Pelajar',
            keluhan: 'Penyesuaian jam tidur dan ritme belajar harian akibat beban tugas kelompok yang menumpuk.',
            moodRerata: '3.1 / 5.0',
            moodBars: [32, 30, 26, 38, 42, 40, 34],
            tidurRerata: '5.8 Jam',
            tidurBars: [32, 30, 28, 40, 42, 44, 38],
            linkMeet: 'https://meet.google.com/mhs-klsk-nks',
            catatan: 'Siapkan jadwal aktivitas harian selama seminggu terakhir untuk bahan analisis manajemen waktu.'
        },
        {
            id: 'konsul-004',
            nama: 'Ada Lovelace',
            inisial: 'AL',
            avatarColor: '#E2E8F0',
            sekolah: 'Kelas XII · SMAN 1 Bandung',
            nis: '215004',
            status: 'Selesai',
            jadwal: 'Senin, 02 Nov 2026 · 14.00 - 15.00 WIB',
            jadwalFull: 'Senin, 02 November 2026 · 14.00 - 15.00 WIB (Selesai)',
            metode: 'Daring (Google Meet) · Selesai Dilaksanakan',
            keluhan: 'Konsultasi regulasi fokus belajar dan strategi mengatasi prokrastinasi pada materi kalkulus.',
            moodRerata: '4.2 / 5.0',
            moodBars: [44, 46, 42, 48, 50, 48, 46],
            tidurRerata: '7.5 Jam',
            tidurBars: [48, 50, 48, 52, 54, 52, 50],
            linkMeet: 'https://meet.google.com/mhs-klsk-nks',
            catatan: 'Sesi telah selesai. Rencana aksi regulasi waktu 2 minggu telah diberikan kepada pelajar.'
        }
    ];

    const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    // State Aplikasi
    let consultations = [];
    let selectedId = 'konsul-001';
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
    const modalSub = document.getElementById('Modal_JadwalSub');
    const modalInputTanggal = document.getElementById('Modal_InputTanggal');
    const modalInputWaktu = document.getElementById('Modal_InputWaktu');
    const modalBtnSimpan = document.getElementById('Modal_BtnSimpanJadwal');
    const modalBtnBatal = document.getElementById('Modal_BtnBatalJadwal');

    // Elemen Toast
    const toast = document.getElementById('Toast_Notification');

    /**
     * Inisialisasi Data dari LocalStorage
     */
    function initData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                consultations = JSON.parse(stored);
            } else {
                consultations = DEFAULT_CONSULTATIONS;
                saveData();
            }
        } catch (e) {
            consultations = DEFAULT_CONSULTATIONS;
        }
    }

    /**
     * Simpan Data ke LocalStorage
     */
    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
        } catch (e) {
            console.error('Gagal menyimpan konsultasi ke localStorage', e);
        }
    }

    /**
     * Hitung Jumlah Antrean Per Status
     */
    function updateCounters() {
        const total = consultations.length;
        const menunggu = consultations.filter(c => c.status === 'Menunggu').length;
        const disetujui = consultations.filter(c => c.status === 'Disetujui').length;
        const riwayat = consultations.filter(c => c.status === 'Selesai' || c.status === 'Ditolak').length;

        if (countSemua) countSemua.textContent = total;
        if (countMenunggu) countMenunggu.textContent = menunggu;
        if (countDisetujui) countDisetujui.textContent = disetujui;
        if (countRiwayat) countRiwayat.textContent = riwayat;
        if (badgePendingNav) badgePendingNav.textContent = menunggu;
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
            if (currentFilter === 'Menunggu') matchStatus = item.status === 'Menunggu';
            else if (currentFilter === 'Disetujui') matchStatus = item.status === 'Disetujui';
            else if (currentFilter === 'Riwayat') matchStatus = item.status === 'Selesai' || item.status === 'Ditolak';

            const query = searchQuery.trim().toLowerCase();
            const matchQuery = !query || 
                item.nama.toLowerCase().includes(query) || 
                item.sekolah.toLowerCase().includes(query) ||
                item.keluhan.toLowerCase().includes(query);

            return matchStatus && matchQuery;
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 32px 16px; text-align: center; color: var(--color-muted); font-size: 14px;">
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

            // Format chip status
            let chipClass = 'menunggu';
            if (item.status === 'Disetujui') chipClass = 'disetujui';
            else if (item.status === 'Selesai' || item.status === 'Ditolak') chipClass = 'riwayat';

            card.innerHTML = `
                <div class="queue-card-top">
                    <div class="queue-card-avatar" style="background-color: ${item.avatarColor}">${item.inisial}</div>
                    <div class="queue-card-meta">
                        <h4 class="queue-card-name">${escapeHtml(item.nama)}</h4>
                        <p class="queue-card-sub">${escapeHtml(item.sekolah)}</p>
                    </div>
                    <span class="status-chip ${chipClass}">${escapeHtml(item.status)}</span>
                </div>
                <div class="queue-card-divider"></div>
                <p class="queue-card-schedule">${escapeHtml(item.jadwal)}</p>
                <p class="queue-card-snippet">${escapeHtml(item.keluhan)}</p>
                <span class="queue-card-tag">${item.metode.includes('Tatap Muka') ? 'Tatap Muka (Klinik)' : 'Daring (Google Meet)'}</span>
            `;

            card.addEventListener('click', () => {
                selectConsultation(item.id);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectConsultation(item.id);
                }
            });

            listContainer.appendChild(card);
        });

        updateCounters();
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
        if (detailSubInfo) detailSubInfo.textContent = `${target.sekolah} · NIS: ${target.nis}`;
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
            if (target.status === 'Disetujui') {
                btnSetujui.textContent = 'Telah Disetujui';
                btnSetujui.disabled = true;
                btnSetujui.style.opacity = '0.6';
            } else {
                btnSetujui.textContent = 'Setujui Permohonan';
                btnSetujui.disabled = false;
                btnSetujui.style.opacity = '1';
            }
        }
    }

    /**
     * Tampilkan Toast Feedback Notifikasi
     */
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3500);
    }

    /**
     * Perbarui Status Konsultasi
     */
    function updateStatus(newStatus, feedbackMsg) {
        const item = consultations.find(c => c.id === selectedId);
        if (!item) return;

        item.status = newStatus;
        if (inputMeetLink && newStatus === 'Disetujui') {
            item.linkMeet = inputMeetLink.value.trim();
        }
        if (textareaCatatan) {
            item.catatan = textareaCatatan.value.trim();
        }

        saveData();
        renderQueueList();
        selectConsultation(selectedId);
        showToast(feedbackMsg);
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
                updateStatus('Disetujui', `Permohonan konsultasi ${name} berhasil disetujui. Notifikasi konfirmasi dan tautan sesi telah dikirimkan.`);
            });
        }

        // Tombol Tolak
        if (btnTolak) {
            btnTolak.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                const name = item ? item.nama : 'Pelajar';
                const konfirmasi = confirm(`Apakah Anda yakin ingin menolak permohonan konsultasi dari ${name}?`);
                if (konfirmasi) {
                    updateStatus('Ditolak', `Permohonan konsultasi ${name} telah ditolak.`);
                }
            });
        }

        // Tombol Jadwal Ulang -> Tampilkan Modal
        if (btnJadwalkanUlang) {
            btnJadwalkanUlang.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;
                if (modalSub) modalSub.textContent = `Tentukan tanggal dan waktu baru untuk sesi bersama ${item.nama}.`;
                if (modalJadwal) modalJadwal.style.display = 'flex';
            });
        }

        // Modal Batal
        if (modalBtnBatal && modalJadwal) {
            modalBtnBatal.addEventListener('click', () => {
                modalJadwal.style.display = 'none';
            });
        }

        // Modal Simpan Jadwal Baru
        if (modalBtnSimpan && modalJadwal) {
            modalBtnSimpan.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                if (!item) return;

                const tglVal = modalInputTanggal ? modalInputTanggal.value : '2026-11-12';
                const waktuVal = modalInputWaktu ? modalInputWaktu.value : '13.00 - 14.00 WIB';

                // Format tanggal sederhana
                const d = new Date(tglVal);
                const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
                const tglFormatted = isNaN(d.getTime()) ? tglVal : d.toLocaleDateString('id-ID', options);

                item.jadwal = `${tglFormatted} · ${waktuVal}`;
                item.jadwalFull = `${tglFormatted} · ${waktuVal} (Dijadwal Ulang)`;
                item.status = 'Disetujui';

                modalJadwal.style.display = 'none';
                saveData();
                renderQueueList();
                selectConsultation(selectedId);
                showToast(`Jadwal konsultasi ${item.nama} berhasil diperbarui ke ${item.jadwal}.`);
            });
        }

        // Tombol Hubungi Pelajar
        if (btnHubungiPelajar) {
            btnHubungiPelajar.addEventListener('click', () => {
                const item = consultations.find(c => c.id === selectedId);
                const name = item ? item.nama : 'Pelajar';
                alert(`Membuka kanal komunikasi langsung dengan ${name} (WhatsApp / Pesan Internal MahaSehat).`);
            });
        }
    }

    // Eksekusi Saat Dokumen Siap
    document.addEventListener('DOMContentLoaded', () => {
        initData();
        renderQueueList();
        selectConsultation(selectedId);
        setupEventListeners();
    });

})();

