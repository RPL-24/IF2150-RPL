/**
 * MahaSehat - ReportPagePelajar.js
 * Logika halaman Laporan Kesehatan untuk Pelajar.
 * Keterlacakan DPPL: UC04, C16 (ReportPage), C17 (ReportController)
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const role = Report.bacaRole(params, 'pelajar');

    if (role === 'orangtuawali') {
        window.location.replace('ReportPageOrangTuaWali.html' + window.location.search);
        return;
    }
    if (role !== 'pelajar') {
        window.location.replace(role === 'tenagakesehatan' ? 'DashboardPageTenagaKesehatan.html' : 'LoginPage.html');
        return;
    }

    const user = Report.bacaJson('mahasehat_user');
    Report.isiProfil(user.nama || 'Budi Pratama', 'Pelajar');
    Report.pasangKeluar();

    const hariIni = new Date();
    const tanggal7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hariIni);
        d.setDate(hariIni.getDate() - (6 - i));
        return d;
    });
    const namaBulan = (o) => new Date(hariIni.getFullYear(), hariIni.getMonth() - o, 1)
        .toLocaleDateString('id-ID', { month: 'short' });

    const DATA = {
        7: {
            label: tanggal7.map((d) => d.toLocaleDateString('id-ID', { weekday: 'short' })),
            mood: [4, 3, 2, 4, 5, 5, 4],
            tidur: [7, 6, 5, 8, 9, 8, 7],
            frekuensi: [3, 2, 1, 3, 3, 1, 1],
            jenis: { Berat: 4, Sedang: 3, Ringan: 2 },
            stres: { Akademik: 45, Keluarga: 25, Relasi: 20, 'Lain-lain': 10 }
        },
        30: {
            label: ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'],
            mood: [3.6, 3.2, 4.1, 3.8],
            tidur: [7.1, 6.5, 7.8, 7.4],
            frekuensi: [2.4, 2.1, 2.7, 2.5],
            jenis: { Berat: 14, Sedang: 10, Ringan: 6 },
            stres: { Akademik: 50, Keluarga: 20, Relasi: 20, 'Lain-lain': 10 }
        },
        90: {
            label: [namaBulan(2), namaBulan(1), namaBulan(0)],
            mood: [3.4, 3.7, 3.9],
            tidur: [6.8, 7.2, 7.5],
            frekuensi: [2.3, 2.5, 2.6],
            jenis: { Berat: 38, Sedang: 31, Ringan: 21 },
            stres: { Akademik: 48, Keluarga: 22, Relasi: 18, 'Lain-lain': 12 }
        }
    };

    // Database dummy catatan refleksi harian (terindeks berdasarkan format YYYY-MM-DD)
    const formatIso = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    // Peta catatan berdasarkan tanggal ISO
    const MAP_CATATAN = {};
    const DUMMY_NOTES_POOL = [
        "Presentasi kelompok cukup lancar, namun masih perlu revisi bab implementasi.",
        "Sulit fokus belajar karena begadang semalam. Mood agak menurun.",
        "Hari ini cukup tenang dan stabil. Berhasil menyelesaikan target tugas tepat waktu.",
        "Merasa sedikit cemas menjelang jadwal asistensi, tapi diskusi dengan teman membantu.",
        "Pola tidur membaik setelah mengurangi screen-time sebelum tidur."
    ];

    // Isi beberapa tanggal dengan catatan bermakna
    tanggal7.forEach((d, idx) => {
        const iso = formatIso(d);
        if (idx === 1) MAP_CATATAN[iso] = DUMMY_NOTES_POOL[0];
        else if (idx === 3) MAP_CATATAN[iso] = DUMMY_NOTES_POOL[1];
        else if (idx === 6) MAP_CATATAN[iso] = DUMMY_NOTES_POOL[2];
    });

    const WARNA_STRES = { Akademik: '#B5453B', Keluarga: '#F8C16F', Relasi: '#78C9C0', 'Lain-lain': '#64748B' };

    const gridLaporan = document.getElementById('Grid_Laporan');
    const alertKosong = document.getElementById('Alert_DataKosong');
    const stripTanggal = document.getElementById('Picker_TanggalCatatan') || document.getElementById('Strip_Tanggal');
    const boxCatatan = document.getElementById('Text_CatatanRefleksi') || document.getElementById('Box_Catatan');
    const inputKalender = document.getElementById('Input_KalenderCatatan');
    const btnKalender = document.getElementById('Btn_BukaKalender');
    const labelTanggalAktif = document.getElementById('Label_TanggalAktif');

    function displayStres(stres) {
        const list = document.getElementById('List_Stres');
        if (!list) return;
        list.innerHTML = '';
        Object.entries(stres).forEach(([nama, persen]) => {
            const li = document.createElement('li');
            const head = document.createElement('div');
            head.className = 'stres-head';
            const a = document.createElement('span');
            a.textContent = nama;
            const b = document.createElement('span');
            b.textContent = `${persen}%`;
            head.append(a, b);
            const track = document.createElement('div');
            track.className = 'track';
            const fill = document.createElement('div');
            fill.className = 'fill';
            fill.style.width = `${persen}%`;
            fill.style.backgroundColor = WARNA_STRES[nama] || '#2A3A3F';
            track.append(fill);
            li.append(head, track);
            list.append(li);
        });
    }

    function displayNotes() {
        if (!stripTanggal || !boxCatatan) return;
        stripTanggal.innerHTML = '';

        const renderCatatanUntukTanggal = (tanggalObj) => {
            const iso = formatIso(tanggalObj);
            const namaHariLengkap = tanggalObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Update label tanggal aktif
            if (labelTanggalAktif) {
                labelTanggalAktif.textContent = namaHariLengkap;
            }

            // Update input kalender value
            if (inputKalender) {
                inputKalender.value = iso;
            }

            // Periksa kecocokan pada strip 7 hari
            stripTanggal.querySelectorAll('.date-btn').forEach((b) => {
                const isMatch = b.dataset.iso === iso;
                b.classList.toggle('active', isMatch);
                b.setAttribute('aria-pressed', String(isMatch));
            });

            // Tampilkan isi catatan refleksi
            const isi = MAP_CATATAN[iso];
            if (isi) {
                boxCatatan.textContent = isi;
                boxCatatan.style.color = 'var(--color-ink)';
                boxCatatan.style.fontStyle = 'normal';
            } else {
                boxCatatan.textContent = 'Belum ada catatan refleksi untuk tanggal ini.';
                boxCatatan.style.color = 'var(--color-ink-subtle)';
                boxCatatan.style.fontStyle = 'italic';
            }
        };

        // Render tombol 7 hari pada date-strip
        tanggal7.forEach((d) => {
            const iso = formatIso(d);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'date-btn';
            btn.dataset.iso = iso;

            const tglSpan = document.createElement('span');
            tglSpan.textContent = d.getDate();
            btn.append(tglSpan);

            const daySpan = document.createElement('span');
            daySpan.className = 'date-btn-sub';
            daySpan.textContent = d.toLocaleDateString('id-ID', { weekday: 'short' });
            btn.append(daySpan);

            // Jika ada catatan pada tanggal ini, berikan penanda dot aksen
            if (MAP_CATATAN[iso]) {
                const dot = document.createElement('span');
                dot.className = 'date-dot';
                dot.setAttribute('title', 'Ada catatan refleksi');
                btn.append(dot);
            }

            btn.setAttribute('aria-label', d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }));
            btn.addEventListener('click', () => renderCatatanUntukTanggal(d));
            stripTanggal.append(btn);
        });

        // Event listener pemilih kalender
        if (btnKalender && inputKalender) {
            btnKalender.addEventListener('click', () => {
                if (typeof inputKalender.showPicker === 'function') {
                    inputKalender.showPicker();
                } else {
                    inputKalender.click();
                }
            });

            inputKalender.addEventListener('change', (e) => {
                if (!e.target.value) return;
                const [thn, bln, tgl] = e.target.value.split('-').map(Number);
                const dipilih = new Date(thn, bln - 1, tgl);
                renderCatatanUntukTanggal(dipilih);
            });
        }

        // Default pilih hari terakhir (hari ini)
        renderCatatanUntukTanggal(tanggal7[tanggal7.length - 1]);
    }

    function showPage(periode) {
        const d = DATA[periode];
        const nilaiJenis = Object.values(d.jenis);
        const maksJenis = Math.max(5, Math.ceil(Math.max(...nilaiJenis)));
        const cfgJenis = maksJenis <= 5
            ? { min: 1, max: 5, ticks: [1, 2, 3, 4, 5] }
            : { min: 0, max: maksJenis, ticks: [0, Math.round(maksJenis / 2), maksJenis] };

        Report.displayChart(document.getElementById('Chart_Mood'), d.label, d.mood, { min: 1, max: 5, ticks: [1, 2, 3, 4, 5] });
        Report.displayChart(document.getElementById('Chart_Tidur'), d.label, d.tidur, { min: 0, max: 10, ticks: [0, 2, 4, 6, 8, 10] });
        Report.displayChart(document.getElementById('Chart_FrekuensiMakan'), d.label, d.frekuensi, { min: 0, max: 3, ticks: [0, 1, 2, 3] });
        Report.displayChart(document.getElementById('Chart_JenisMakan'), Object.keys(d.jenis), nilaiJenis, cfgJenis);
        displayStres(d.stres);
    }

    Report.pasangPeriode(showPage);

    if (params.get('data') === 'kosong') {
        gridLaporan.hidden = true;
        alertKosong.hidden = false;
    }
    else {
        showPage(7);
        displayNotes();
    }
});