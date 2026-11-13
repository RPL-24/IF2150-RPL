/**
 * MahaSehat - CariTenagaKesehatanPage.js
 * Pencarian tenaga kesehatan (UC05) dan pengajuan janji konsultasi (UC06).
 * Data tenaga kesehatan diambil dari /api/tenaga-kesehatan; pengajuan disimpan
 * ke localStorage agar langsung terbaca halaman Tenaga Kesehatan.
 */

(function () {
    'use strict';

    const API = '/api/tenaga-kesehatan';
    const STORAGE_KONSULTASI = 'mahasehat_consultations_data';
    const TOKEN_KEY = 'mahasehat_token';
    const USER_KEY = 'mahasehat_user';
    const ROLE_KEY = 'role';
    const LOKASI_KEY = 'lokasiAktif';

    // Data cadangan bila API belum dapat dihubungi (demo tanpa server)
    const NAKES_CADANGAN = [
        { id: 'NAKES-RH', nama: 'Raissa Hadiman, M.Psi.', spesialisasi: 'Psikologi Klinis', fasilitas: 'RS ABC', alamat: 'Jl. Merdeka No. 12, Bandung', lat: -6.9175, lng: 107.6191, tarif: 300000, nomorStr: 'STR-PK-110293', keahlian: ['Kecemasan', 'Stres akademik'] },
        { id: 'NAKES-BP', nama: 'dr. Bagas Pratama, Sp.KJ', spesialisasi: 'Psikiatri', fasilitas: 'Klinik Sehat Jiwa', alamat: 'Jl. Dago No. 88, Bandung', lat: -6.884, lng: 107.613, tarif: 350000, nomorStr: 'STR-PK-110294', keahlian: ['Depresi', 'Gangguan tidur'] },
        { id: 'NAKES-NK', nama: 'Nia Kusuma, M.Psi.', spesialisasi: 'Psikologi Pendidikan', fasilitas: 'Puskesmas Cendana', alamat: 'Jl. Cendana No. 5, Bandung', lat: -6.95, lng: 107.63, tarif: 250000, nomorStr: 'STR-PK-110295', keahlian: ['Motivasi belajar', 'Relasi'] }
    ];

    const SLOT_CADANGAN = [
        { nilai: 'Rabu, 12 November 2026 · 10.00 - 11.00 WIB', label: 'Rabu, 12 November 2026 · 10.00 - 11.00 WIB' },
        { nilai: 'Kamis, 13 November 2026 · 13.00 - 14.00 WIB', label: 'Kamis, 13 November 2026 · 13.00 - 14.00 WIB' },
        { nilai: 'Jumat, 14 November 2026 · 09.00 - 10.00 WIB', label: 'Jumat, 14 November 2026 · 09.00 - 10.00 WIB' }
    ];

    const el = (id) => document.getElementById(id);
    const inputLokasi = el('Input_Lokasi');
    const filterSpesialisasi = el('Filter_Spesialisasi');
    const daftarEl = el('NakesListContainer');
    const teksJumlah = el('Text_JumlahHasil');
    const teksKosong = el('Text_Kosong');
    const modalLokasi = el('Modal_IzinLokasi');
    const modalDetail = el('Modal_Detail');
    const modalJanji = el('Modal_Janji');
    const toast = el('Toast_Janji');
    const badge = el('Badge_Konsultasi');

    const pengguna = bacaJson(USER_KEY) || {};
    const token = localStorage.getItem(TOKEN_KEY);

    let izinLokasi = localStorage.getItem(LOKASI_KEY) === 'ya';
    let lokasiPengguna = null;
    let daftarNakes = [];
    let nakesDipilih = null;
    let slotTersedia = [];

    function bacaJson(kunci) {
        try {
            return JSON.parse(localStorage.getItem(kunci) || 'null');
        } catch (e) {
            return null;
        }
    }

    function inisial(nama) {
        return String(nama || '?')
            .replace(/[^A-Za-z\u00C0-\u024F ]/g, '')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((bagian) => bagian[0].toUpperCase())
            .join('');
    }

    function formatRupiah(nilai) {
        if (nilai === null || nilai === undefined || Number.isNaN(Number(nilai))) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(nilai));
    }

    function formatJarak(km) {
        if (km === null || km === undefined) return 'Jarak belum diketahui';
        return `${Number(km).toFixed(1).replace('.', ',')} km`;
    }

    function formatTanggal(iso) {
        if (!iso) return '';
        const tanggal = new Date(`${iso}T00:00:00`);
        if (Number.isNaN(tanggal.getTime())) return String(iso);
        return tanggal.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    /* ------------------------------ API ---------------------------------- */

    async function panggilApi(jalur, opsi = {}) {
        const { method = 'GET', body } = opsi;
        const respons = await fetch(`${API}${jalur}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await respons.json().catch(() => ({}));
        if (!respons.ok || data.success === false) {
            throw new Error(data.message || 'Permintaan gagal.');
        }
        return data;
    }

    function petakanNakes(baris) {
        const koordinat = String(baris.lokasi || baris.lokasi_kerja || '').split(',').map(Number);
        const valid = koordinat.length === 2 && koordinat.every((angka) => Number.isFinite(angka));
        return {
            id: baris.id_tenaga_kesehatan,
            nama: baris.nama,
            spesialisasi: baris.jenis_tenaga_kesehatan || 'Tenaga Kesehatan',
            fasilitas: baris.nama_fasilitas || 'Praktik Mandiri',
            alamat: baris.alamat || baris.lokasi_kerja || '-',
            lat: valid ? koordinat[0] : null,
            lng: valid ? koordinat[1] : null,
            jarakKm: baris.jarak_km === undefined ? null : baris.jarak_km,
            tarif: baris.estimasi_biaya,
            nomorStr: baris.nomor_str || '-',
            keahlian: [baris.jenis_tenaga_kesehatan].filter(Boolean),
            deskripsi: `Melayani konsultasi ${String(baris.jenis_tenaga_kesehatan || 'kesehatan mental').toLowerCase()} untuk pelajar dan mahasiswa.`
        };
    }

    async function muatDaftar() {
        try {
            const data = (izinLokasi && lokasiPengguna)
                ? await panggilApi('/lokasi-pelajar', { method: 'PUT', body: { latitude: lokasiPengguna.lat, longitude: lokasiPengguna.lng } })
                : await panggilApi('/');
            daftarNakes = (data.data || []).map(petakanNakes);
        } catch (error) {
            daftarNakes = NAKES_CADANGAN.map((item) => ({ ...item, jarakKm: null }));
        }

        isiFilter();
        tampilkan();
    }

    /* --------------------------- Daftar kartu ---------------------------- */

    function isiFilter() {
        const unik = [...new Set(daftarNakes.map((item) => item.spesialisasi).filter(Boolean))];
        const nilaiSekarang = filterSpesialisasi.value;
        filterSpesialisasi.replaceChildren(new Option('Semua spesialisasi', ''));
        unik.forEach((spesialisasi) => filterSpesialisasi.appendChild(new Option(spesialisasi, spesialisasi)));
        if (unik.includes(nilaiSekarang)) filterSpesialisasi.value = nilaiSekarang;
    }

    function yangCocok() {
        const kata = inputLokasi.value.trim().toLowerCase();
        const spesialisasi = filterSpesialisasi.value;
        return daftarNakes
            .filter((item) => {
                const isi = [item.nama, item.fasilitas, item.alamat, item.spesialisasi, ...item.keahlian].join(' ').toLowerCase();
                return (!kata || isi.includes(kata)) && (!spesialisasi || item.spesialisasi === spesialisasi);
            })
            .sort((a, b) => {
                if (a.jarakKm === null) return 1;
                if (b.jarakKm === null) return -1;
                return a.jarakKm - b.jarakKm;
            });
    }

    function tampilkan() {
        const hasil = yangCocok();
        daftarEl.replaceChildren();
        teksKosong.hidden = hasil.length > 0;
        teksJumlah.textContent = hasil.length
            ? `${hasil.length} tenaga kesehatan${izinLokasi ? ' diurutkan dari yang terdekat' : ''}.`
            : 'Tidak ada hasil.';

        hasil.forEach((item) => {
            const kartu = document.createElement('article');
            kartu.className = 'nakes-card';
            kartu.id = `Card_NakesItem_${item.id}`;
            kartu.innerHTML = `
                <div class="nakes-main">
                    <div class="nakes-avatar" aria-hidden="true">${inisial(item.nama)}</div>
                    <div class="nakes-identity">
                        <h2 class="nakes-name">${item.nama}</h2>
                        <p class="nakes-specialty">${item.spesialisasi}</p>
                        <p class="nakes-location">${item.fasilitas}${izinLokasi && item.jarakKm !== null ? ` · ${formatJarak(item.jarakKm)}` : ''}</p>
                    </div>
                    <p class="nakes-fee">
                        <strong>${formatRupiah(item.tarif)}</strong>
                        <span>per sesi</span>
                    </p>
                </div>
                <div class="nakes-footer">
                    <div class="tag-row">
                        ${(item.keahlian || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button type="button" class="btn btn--sm btn--secondary" data-aksi="detail" data-id="${item.id}">Lihat Detail</button>
                        <button type="button" class="btn btn--sm btn--primary" data-aksi="janji" data-id="${item.id}">Jadwalkan</button>
                    </div>
                </div>
            `;
            daftarEl.appendChild(kartu);
        });
    }

    /* ----------------------------- Dialog -------------------------------- */

    function bukaDialog(dialog) {
        if (!dialog || dialog.open) return;
        dialog.showModal();
        document.body.classList.add('body-locked');
    }

    function tutupDialog(dialog) {
        if (!dialog || !dialog.open) return;
        dialog.close();
    }

    function cariById(id) {
        return daftarNakes.find((item) => item.id === id);
    }

    function isiDetail(item) {
        el('Detail_Avatar').textContent = inisial(item.nama);
        el('Title_Detail').textContent = item.nama;
        el('Detail_Spesialisasi').textContent = item.spesialisasi;
        el('Detail_Fasilitas').textContent = item.fasilitas;
        el('Detail_Alamat').textContent = item.alamat;
        el('Detail_Jarak').textContent = izinLokasi ? formatJarak(item.jarakKm) : 'Lokasi tidak diizinkan';
        el('Detail_Tarif').textContent = `${formatRupiah(item.tarif)} per sesi`;
        el('Detail_Str').textContent = item.nomorStr;
        el('Detail_Deskripsi').textContent = item.deskripsi;
        el('Detail_Tags').innerHTML = (item.keahlian || []).map((tag) => `<span class="tag">${tag}</span>`).join('');
    }

    async function muatSlot(item) {
        try {
            const data = await panggilApi(`/${encodeURIComponent(item.id)}`);
            const jadwal = (data.data && data.data.jadwal_tersedia) || [];
            if (jadwal.length) {
                return jadwal.map((slot) => {
                    const label = `${formatTanggal(slot.tanggal)} · ${String(slot.waktu).slice(0, 5)} WIB`;
                    return { nilai: label, label };
                });
            }
        } catch (error) {
            // pakai slot cadangan
        }
        return SLOT_CADANGAN;
    }

    async function bukaDetail(item) {
        nakesDipilih = item;
        slotTersedia = SLOT_CADANGAN;
        isiDetail(item);
        bukaDialog(modalDetail);
        slotTersedia = await muatSlot(item);
    }

    function renderSlot() {
        const wadah = el('Slot_Container');
        wadah.replaceChildren();

        if (!slotTersedia.length) {
            wadah.innerHTML = '<p class="slot-empty">Belum ada slot tersedia. Silakan hubungi tenaga kesehatan.</p>';
            return;
        }

        slotTersedia.forEach((slot, indeks) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'slot';
            radio.value = slot.nilai;
            radio.checked = indeks === 0;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(slot.label));
            wadah.appendChild(label);
        });
    }

    async function bukaJanji(item) {
        nakesDipilih = item;
        tutupDialog(modalDetail);
        el('Janji_Nama').textContent = `${item.nama} · ${item.fasilitas}`;
        el('Error_Slot').textContent = '';
        el('Error_Keluhan').textContent = '';
        el('Input_Keluhan').value = '';
        el('Input_Metode').value = 'Daring (Google Meet)';
        el('Input_Keluhan').classList.remove('is-invalid');

        // Tampilkan slot cadangan lebih dulu, lalu ganti dengan slot sebenarnya bila API tersedia
        slotTersedia = SLOT_CADANGAN;
        renderSlot();
        bukaDialog(modalJanji);

        const slotAsli = await muatSlot(item);
        if (modalJanji.open && nakesDipilih === item) {
            slotTersedia = slotAsli;
            renderSlot();
        }
    }

    /* --------------------------- Pengajuan ------------------------------- */

    function bacaPengajuan() {
        const data = bacaJson(STORAGE_KONSULTASI);
        return Array.isArray(data) ? data : [];
    }

    function simpanPengajuan(item) {
        const data = bacaPengajuan();
        data.unshift(item);
        localStorage.setItem(STORAGE_KONSULTASI, JSON.stringify(data));
        perbaruiBadge();
    }

    function perbaruiBadge() {
        if (!badge) return;
        const jumlah = bacaPengajuan().filter((item) => item.status === 'Menunggu').length;
        badge.textContent = String(jumlah);
        badge.hidden = jumlah === 0;
    }

    function buatPengajuan(slot, metode, keluhan) {
        const nama = pengguna.nama || 'Pelajar';
        return {
            id: `konsul-${Date.now()}`,
            nama,
            inisial: inisial(nama),
            avatarColor: '#78C9C0',
            sekolah: pengguna.sekolah || pengguna.kelas || 'Pelajar MahaSehat',
            nis: pengguna.nis || '-',
            status: 'Menunggu',
            jadwal: slot,
            jadwalFull: `${slot} (60 Menit)`,
            metode: `${metode} · Sesi Mandiri 1 Pelajar`,
            keluhan,
            moodRerata: '-',
            moodBars: [],
            tidurRerata: '-',
            tidurBars: [],
            linkMeet: '-',
            catatan: `Pengajuan untuk ${nakesDipilih.nama} (${nakesDipilih.fasilitas}).`
        };
    }

    function tampilkanToast(pesan) {
        toast.textContent = pesan;
        toast.hidden = false;
        window.clearTimeout(tampilkanToast.timer);
        tampilkanToast.timer = window.setTimeout(() => { toast.hidden = true; }, 4000);
    }

    /* ----------------------------- Peristiwa ----------------------------- */

    daftarEl.addEventListener('click', (event) => {
        const tombol = event.target.closest('button[data-id]');
        if (!tombol) return;
        const item = cariById(tombol.dataset.id);
        if (!item) return;
        if (tombol.dataset.aksi === 'detail') bukaDetail(item);
        if (tombol.dataset.aksi === 'janji') bukaJanji(item);
    });

    inputLokasi.addEventListener('input', tampilkan);
    filterSpesialisasi.addEventListener('change', tampilkan);

    el('Btn_TutupDetail').addEventListener('click', () => tutupDialog(modalDetail));
    el('Btn_JadwalkanDariDetail').addEventListener('click', () => {
        if (nakesDipilih) bukaJanji(nakesDipilih);
    });
    el('Btn_BatalJanji').addEventListener('click', () => tutupDialog(modalJanji));

    el('Form_Janji').addEventListener('submit', (event) => {
        event.preventDefault();
        const slot = document.querySelector('input[name="slot"]:checked');
        const keluhan = el('Input_Keluhan');
        const metode = el('Input_Metode').value;
        let valid = true;

        el('Error_Slot').textContent = '';
        el('Error_Keluhan').textContent = '';
        keluhan.classList.remove('is-invalid');

        if (!slot) {
            el('Error_Slot').textContent = 'Pilih salah satu slot terlebih dahulu.';
            valid = false;
        }
        if (keluhan.value.trim().length < 10) {
            el('Error_Keluhan').textContent = 'Tuliskan keluhan minimal 10 karakter agar tenaga kesehatan dapat mempersiapkan sesi.';
            keluhan.classList.add('is-invalid');
            valid = false;
        }
        if (!valid) return;

        simpanPengajuan(buatPengajuan(slot.value, metode, keluhan.value.trim()));
        tutupDialog(modalJanji);
        tampilkanToast(`Pengajuan konsultasi dengan ${nakesDipilih.nama} terkirim. Tenaga kesehatan akan meninjau permohonanmu.`);
    });

    [modalDetail, modalJanji, modalLokasi].forEach((dialog) => {
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) tutupDialog(dialog);
        });
        dialog.addEventListener('close', () => {
            if (!document.querySelector('dialog[open]')) document.body.classList.remove('body-locked');
        });
    });

    /* ------------------------------ Lokasi -------------------------------- */

    function simpanIzin(diizinkan) {
        izinLokasi = diizinkan;
        localStorage.setItem(LOKASI_KEY, diizinkan ? 'ya' : 'tidak');
        tutupDialog(modalLokasi);
    }

    el('Btn_JanganIzinkan').addEventListener('click', () => {
        simpanIzin(false);
        muatDaftar();
    });

    el('Btn_Izinkan').addEventListener('click', () => {
        simpanIzin(true);
        if (!navigator.geolocation) {
            muatDaftar();
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (posisi) => {
                lokasiPengguna = { lat: posisi.coords.latitude, lng: posisi.coords.longitude };
                muatDaftar();
            },
            () => {
                lokasiPengguna = null;
                muatDaftar();
            },
            { timeout: 8000 }
        );
    });

    /* ------------------------------ Keluar -------------------------------- */

    function keluar() {
        [TOKEN_KEY, USER_KEY, ROLE_KEY].forEach((kunci) => localStorage.removeItem(kunci));
        window.location.href = 'LoginPage.html';
    }

    el('Menu_Keluar').addEventListener('click', (event) => {
        event.preventDefault();
        keluar();
    });

    /* ------------------------------ Inisialisasi -------------------------- */

    const namaPengguna = pengguna.nama || 'Albert Einstein';
    el('Text_NamaUser').textContent = namaPengguna;
    el('Text_RoleUser').textContent = pengguna.role || 'Pelajar';
    el('User_Avatar').textContent = namaPengguna.trim().charAt(0).toUpperCase();

    perbaruiBadge();
    muatDaftar();

    if (localStorage.getItem(LOKASI_KEY) === null) {
        bukaDialog(modalLokasi);
    }
})();
