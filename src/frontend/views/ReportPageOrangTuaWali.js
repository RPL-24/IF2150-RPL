/**
 * MahaSehat - ReportPageOrangTuaWali.js
 * Logika halaman Laporan Kesehatan untuk Orang Tua/Wali.
 * Hanya menampilkan data ringkasan, tanpa catatan refleksi pelajar (KNF02).
 * Keterlacakan DPPL: UC04, C16 (ReportPage), C17 (ReportController.applyPrivacyRestriction)
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');

    if (roleParam === 'pelajar') {
        window.location.replace('ReportPagePelajar.html' + window.location.search);
        return;
    }
    if (roleParam === 'tenagakesehatan') {
        window.location.replace('DashboardPageTenagaKesehatan.html');
        return;
    }

    localStorage.setItem('role', 'orangtuawali');

    const profile = Report.bacaJson('mahasehat_ortu_profile');
    const user = Report.bacaJson('mahasehat_user');
    const namaPelajar = Report.bacaJson('studentAccountStatus').nama || 'Albert Einstein';
    Report.isiProfil(profile.nama || user.nama || 'Hermann Einstein', 'Orang Tua / Wali');
    Report.pasangKeluar();
    document.getElementById('Text_Subjudul').textContent = `Ringkasan kondisi ${namaPelajar} dari data daily check-in.`;

    const hariIni = new Date();
    const hari7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hariIni);
        d.setDate(hariIni.getDate() - (6 - i));
        return d.toLocaleDateString('id-ID', { weekday: 'short' });
    });
    const namaBulan = (o) => new Date(hariIni.getFullYear(), hariIni.getMonth() - o, 1)
        .toLocaleDateString('id-ID', { month: 'short' });

    const DATA = {
        7: {
            label: hari7.slice(0, 5), mood: [3, 3, 2, 4, 4], tidur: [7, 7, 6, 8, 9.5],
            rerataMood: 3.2, rerataTidur: 7.5, rerataMakan: 2.0, hariTanpaCheckIn: 2, risiko: 'sedang',
            ringkasan: 'Kondisi pelajar cukup stabil, namun ada dua hari tanpa check-in dan durasi tidur sempat menurun di pertengahan minggu.'
        },
        30: {
            label: ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'], mood: [3.6, 3.2, 4.1, 3.8], tidur: [7.1, 6.5, 7.8, 7.4],
            rerataMood: 3.7, rerataTidur: 7.2, rerataMakan: 2.4, hariTanpaCheckIn: 3, risiko: 'sedang',
            ringkasan: 'Suasana hati sempat menurun pada minggu kedua lalu membaik. Terdapat beberapa hari tanpa check-in.'
        },
        90: {
            label: [namaBulan(2), namaBulan(1), namaBulan(0)], mood: [3.4, 3.7, 3.9], tidur: [6.8, 7.2, 7.5],
            rerataMood: 3.7, rerataTidur: 7.2, rerataMakan: 2.5, hariTanpaCheckIn: 6, risiko: 'rendah',
            ringkasan: 'Suasana hati dan durasi tidur cenderung membaik dari bulan ke bulan.'
        }
    };

    const LABEL_RISIKO = {
        rendah: { label: 'Rendah', teks: 'Kondisi tampak stabil dan pola check-in berada dalam batas wajar.' },
        sedang: { label: 'Sedang', teks: 'Ada perubahan pola yang perlu diperhatikan. Pertimbangkan untuk berbincang dengan pelajar.' },
        tinggi: { label: 'Tinggi', teks: 'Beberapa indikator di luar batas wajar. Disarankan berbicara dengan pelajar dan mempertimbangkan konsultasi dengan tenaga kesehatan.' }
    };

    const gridLaporan = document.getElementById('Grid_Laporan');
    const alertKosong = document.getElementById('Alert_DataKosong');
    const badgeRisiko = document.getElementById('Badge_Risiko');

    function showPage(periode) {
        const d = DATA[periode];
        const uji = params.get('risiko');
        const risiko = ['rendah', 'sedang', 'tinggi'].includes(uji) ? uji : d.risiko;

        badgeRisiko.textContent = LABEL_RISIKO[risiko].label;
        badgeRisiko.className = `status-badge risk-badge risk-${risiko}`;
        document.getElementById('Text_RisikoPenjelasan').textContent = LABEL_RISIKO[risiko].teks;
        document.getElementById('Text_Ringkasan').textContent = d.ringkasan;
        document.getElementById('Value_RerataMood').textContent = d.rerataMood.toFixed(1);
        document.getElementById('Value_RerataTidur').textContent = d.rerataTidur.toFixed(1);
        document.getElementById('Value_RerataMakan').textContent = d.rerataMakan.toFixed(1);
        document.getElementById('Value_HariTanpaCheckIn').textContent = d.hariTanpaCheckIn;

        Report.displayChart(document.getElementById('Chart_Mood'), d.label, d.mood, { min: 1, max: 5, ticks: [1, 2, 3, 4, 5] });
        Report.displayChart(document.getElementById('Chart_Tidur'), d.label, d.tidur, { min: 0, max: 10, ticks: [0, 2, 4, 6, 8, 10] });
    }

    Report.pasangPeriode(showPage);

    if (params.get('data') === 'kosong') {
        gridLaporan.hidden = true;
        alertKosong.hidden = false;
    } else {
        showPage(7);
    }
});