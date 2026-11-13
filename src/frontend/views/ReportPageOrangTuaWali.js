/**
 * MahaSehat - ReportPageOrangTuaWali.js
 * Laporan ringkas kondisi pelajar untuk orang tua/wali (UC04).
 * Hanya ringkasan, tanpa catatan refleksi pelajar (KNF02).
 */

document.addEventListener('DOMContentLoaded', async () => {
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

    const user = Report.bacaJson('mahasehat_user');
    Report.isiProfil(user.nama || 'Orang Tua / Wali', 'Orang Tua / Wali');

    const LABEL_RISIKO = {
        rendah: { label: 'Rendah', teks: 'Kondisi tampak stabil dan pola check-in berada dalam batas wajar.' },
        sedang: { label: 'Sedang', teks: 'Ada perubahan pola yang perlu diperhatikan. Pertimbangkan untuk berbincang dengan pelajar.' },
        tinggi: { label: 'Tinggi', teks: 'Beberapa indikator di luar batas wajar. Disarankan berbicara dengan pelajar dan mempertimbangkan konsultasi dengan tenaga kesehatan.' }
    };

    const gridLaporan = document.getElementById('Grid_Laporan');
    const alertKosong = document.getElementById('Alert_DataKosong');
    const badgeRisiko = document.getElementById('Badge_Risiko');
    const textSubjudul = document.getElementById('Text_Subjudul');

    let DATA = null;

    function showPage(periode) {
        if (!DATA) return;
        const d = DATA[periode];
        const uji = params.get('risiko');
        const risiko = ['rendah', 'sedang', 'tinggi'].includes(uji) ? uji : d.risiko;

        badgeRisiko.textContent = LABEL_RISIKO[risiko].label;
        badgeRisiko.className = `badge badge--netral risk-badge risk-${risiko}`;
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

    try {
        const token = localStorage.getItem('mahasehat_token');
        const respons = await fetch('/api/reports/summary', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const hasil = await respons.json().catch(() => ({}));
        if (!respons.ok) throw new Error(hasil.message || 'Laporan gagal dimuat.');

        const data = hasil.data || {};
        const seri = data.seri || {};
        const statistik = data.statistik || {};
        const risiko = String(data.indikator_risiko || 'rendah').toLowerCase();

        const buat = (kunci) => {
            const isi = seri[kunci] || {};
            return {
                label: isi.label || [],
                mood: isi.mood || [],
                tidur: isi.tidur || [],
                rerataMood: Number(statistik.rerata_mood) || 0,
                rerataTidur: Number(statistik.rerata_tidur) || 0,
                rerataMakan: Number(data.rerata_pemicu) || 0,
                hariTanpaCheckIn: Number(data.jumlah_hari_tidak_check_in) || 0,
                risiko: ['rendah', 'sedang', 'tinggi'].includes(risiko) ? risiko : 'sedang',
                ringkasan: data.ringkasan_kondisi || 'Belum ada data check-in pada periode ini.'
            };
        };

        DATA = { 7: buat('7'), 30: buat('30'), 90: buat('90') };

        if (textSubjudul) {
            textSubjudul.textContent = `Ringkasan kondisi ${data.nama || 'pelajar'} dari data daily check-in.`;
        }

        const kosong = !DATA[7].label.length;
        gridLaporan.hidden = kosong;
        alertKosong.hidden = !kosong;
        if (params.get('data') === 'kosong') {
            gridLaporan.hidden = true;
            alertKosong.hidden = false;
        }
        if (!kosong) showPage(7);
    } catch (error) {
        gridLaporan.hidden = true;
        alertKosong.hidden = false;
        alertKosong.textContent = error.message || 'Laporan kesehatan gagal dimuat.';
    }
});
