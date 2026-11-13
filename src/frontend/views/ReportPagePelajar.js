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
    Report.isiProfil(user.nama || 'Pelajar', 'Pelajar');

    const hariIni = new Date();
    const tanggal7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hariIni);
        d.setDate(hariIni.getDate() - (6 - i));
        return d;
    });

    const formatIso = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const token = localStorage.getItem('mahasehat_token');
    let DATA = null;
    let MAP_CATATAN = {};

    const WARNA_STRES = {
        Akademik: 'var(--color-danger)',
        Keluarga: 'var(--color-amber)',
        Relasi: 'var(--color-teal)',
        'Lain-lain': 'var(--color-ink-muted)'
    };

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
        const entri = Object.entries(stres);
        if (!entri.length) {
            const kosong = document.createElement('li');
            kosong.className = 'empty-msg';
            kosong.textContent = 'Belum ada pemicu stres yang dicatat pada periode ini.';
            list.append(kosong);
            return;
        }
        entri.forEach(([nama, persen]) => {
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
        const maksJenis = Math.max(1, ...nilaiJenis.map((nilai) => Number(nilai) || 0));
        const cfgJenis = {
            min: 0,
            max: maksJenis,
            ticks: Array.from({ length: maksJenis + 1 }, (_, i) => i)
        };

        Report.displayChart(document.getElementById('Chart_Mood'), d.label, d.mood, { min: 1, max: 5, ticks: [1, 2, 3, 4, 5] });
        Report.displayChart(document.getElementById('Chart_Tidur'), d.label, d.tidur, { min: 0, max: 10, ticks: [0, 2, 4, 6, 8, 10] });
        const maksFrekuensi = Math.max(1, ...d.frekuensi.map((nilai) => Number(nilai) || 0));
        Report.displayChart(document.getElementById('Chart_FrekuensiMakan'), d.label, d.frekuensi, {
            min: 0,
            max: maksFrekuensi,
            ticks: Array.from({ length: maksFrekuensi + 1 }, (_, i) => i)
        });
        Report.displayChart(document.getElementById('Chart_JenisMakan'), Object.keys(d.jenis), nilaiJenis, cfgJenis);
        displayStres(d.stres);
    }

    Report.pasangPeriode(showPage);

    async function muatLaporan() {
        if (params.get('data') === 'kosong') {
            gridLaporan.hidden = true;
            alertKosong.hidden = false;
            return;
        }
        try {
            const respons = await fetch('/api/reports/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const hasil = await respons.json().catch(() => ({}));
            if (!respons.ok) throw new Error(hasil.message || 'Laporan gagal dimuat.');

            const data = hasil.data || {};
            const seri = data.seri || {};
            const jenis = Object.fromEntries((data.jenis_makan || []).map((item) => [item.nama, item.nilai]));
            const stres = Object.fromEntries((data.stres || []).map((item) => [item.nama, item.persen]));

            const buat = (kunci) => {
                const isi = seri[kunci] || {};
                return {
                    label: isi.label || [],
                    mood: isi.mood || [],
                    tidur: isi.tidur || [],
                    frekuensi: isi.frekuensi || [],
                    jenis,
                    stres
                };
            };

            DATA = { 7: buat('7'), 30: buat('30'), 90: buat('90') };
            MAP_CATATAN = {};
            (data.catatan || []).forEach((item) => {
                if (item.tanggal && item.catatan) MAP_CATATAN[item.tanggal] = item.catatan;
            });

            const kosong = !DATA[7].label.length;
            gridLaporan.hidden = kosong;
            alertKosong.hidden = !kosong;
            if (kosong) return;

            showPage(7);
            displayNotes();
        } catch (error) {
            gridLaporan.hidden = true;
            alertKosong.hidden = false;
            alertKosong.textContent = error.message || 'Laporan kesehatan gagal dimuat.';
        }
    }

    muatLaporan();
});