/**
 * MahaSehat - ReportChart.js
 * Fungsi bersama halaman Laporan Kesehatan (Pelajar dan Orang Tua/Wali).
 * Keterlacakan DPPL: UC04, C16 (ReportPage)
 */

const Report = (() => {
    function kanonikRole(role) {
        const r = String(role || '').toLowerCase().replace(/[^a-z]/g, '');
        return (r === 'orangtua' || r === 'wali') ? 'orangtuawali' : r;
    }

    function bacaJson(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        }
        catch (err) {
            return {};
        }
    }

    function bacaRole(params, bawaan) {
        const user = bacaJson('mahasehat_user');
        return kanonikRole(params.get('role') || user.role || localStorage.getItem('role') || bawaan);
    }

    function isiProfil(nama, labelRole) {
        document.getElementById('Text_NamaUser').textContent = nama;
        document.getElementById('Text_RoleUser').textContent = labelRole;
        document.getElementById('User_Avatar').textContent = nama.trim().charAt(0).toUpperCase();
    }

    function displayChart(el, labels, values, { min, max, ticks }) {
        const pct = (v) => ((v - min) / (max - min)) * 100;
        const kolom = `repeat(${values.length}, 1fr)`;
        el.innerHTML = '';

        const plot = document.createElement('div');
        plot.className = 'plot';
        ticks.forEach((t) => {
            const garis = document.createElement('div');
            garis.className = 'gridline';
            garis.style.bottom = `${pct(t)}%`;
            const angka = document.createElement('span');
            angka.className = 'tick';
            angka.style.bottom = `${pct(t)}%`;
            angka.textContent = t;
            plot.append(garis, angka);
        });

        const bars = document.createElement('div');
        bars.className = 'bars';
        bars.style.gridTemplateColumns = kolom;
        values.forEach((v) => {
            const rasio = (v - min) / (max - min);
            const bar = document.createElement('div');
            bar.className = 'bar ' + (rasio < 0.34 ? 'bar-low' : rasio < 0.7 ? 'bar-mid' : rasio < 0.9 ? 'bar-high' : 'bar-top');
            bar.style.height = `${Math.max(0, Math.min(pct(v), 100))}%`;
            bar.textContent = Number.isInteger(v) ? v : v.toFixed(1);
            bars.append(bar);
        });
        plot.append(bars);

        const sumbuX = document.createElement('div');
        sumbuX.className = 'xlabels';
        sumbuX.style.gridTemplateColumns = kolom;
        labels.forEach((l) => {
            const s = document.createElement('span');
            s.textContent = l;
            sumbuX.append(s);
        });

        el.append(plot, sumbuX);
    }

    function pasangPeriode(onChange) {
        const tombol = document.querySelectorAll('.seg-btn');
        tombol.forEach((btn) => {
            btn.addEventListener('click', () => {
                tombol.forEach((b) => {
                    const aktif = b === btn;
                    b.classList.toggle('active', aktif);
                    b.setAttribute('aria-pressed', String(aktif));
                });
                onChange(Number(btn.dataset.periode));
            });
        });
    }

    return { kanonikRole, bacaJson, bacaRole, isiProfil, displayChart, pasangPeriode };
})();