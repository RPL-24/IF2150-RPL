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

    const CATATAN = ['', 'Presentasi cukup lancar.', '', 'Sulit fokus karena kurang tidur.', '', '', 'Hari ini cukup tenang, tapi tugas besar masih menumpuk.'];
    const WARNA_STRES = { Akademik: '#DC2626', Keluarga: '#F8C16F', Relasi: '#78C9C0', 'Lain-lain': '#2563EB' };

    const gridLaporan = document.getElementById('Grid_Laporan');
    const alertKosong = document.getElementById('Alert_DataKosong');
    const stripTanggal = document.getElementById('Strip_Tanggal');
    const boxCatatan = document.getElementById('Box_Catatan');

    function displayStres(stres) {
        const list = document.getElementById('List_Stres');
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
        stripTanggal.innerHTML = '';
        const pilih = (i) => {
            stripTanggal.querySelectorAll('.date-btn').forEach((b, j) => {
                b.classList.toggle('active', i === j);
                b.setAttribute('aria-pressed', String(i === j));
            });
            boxCatatan.textContent = CATATAN[i] || 'Tidak ada catatan pada tanggal ini.';
        };
        tanggal7.forEach((d, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'date-btn';
            btn.textContent = d.getDate();
            btn.setAttribute('aria-label', d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }));
            btn.addEventListener('click', () => pilih(i));
            stripTanggal.append(btn);
        });
        pilih(tanggal7.length - 1);
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