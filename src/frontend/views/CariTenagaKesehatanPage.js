/**
 * MahaSehat - CariTenagaKesehatanPage.js
 * I-12 Cari Tenaga Kesehatan: pencarian, filter spesialisasi, dan kartu nakes.
 * Keterlacakan DPPL: UC05, C18 (showPage, requestLocationPermission, displayResults).
 */

document.addEventListener('DOMContentLoaded', () => {
    const daftarNakes = [
        {
            id: 'NAKES-RH',
            inisial: 'RH',
            tone: 'tone-teal',
            nama: 'Raissa Hadiman, M.Psi.',
            spesialisasi: 'Psikologi Klinis',
            fasilitas: 'RS ABC',
            alamat: 'Jl. Merdeka No. 12, Bandung',
            lat: -6.9175,
            lng: 107.6191,
            jarakKm: 2.4,
            tarif: 300000,
            keahlian: ['Kecemasan', 'Stres akademik'],
            nomorStr: 'STR-PK-110293',
            deskripsi: 'Mendampingi pelajar yang mengalami kecemasan ujian, tekanan akademik, dan kesulitan menyesuaikan diri di lingkungan kampus.'
        },
        {
            id: 'NAKES-BP',
            inisial: 'BP',
            tone: 'tone-mist',
            nama: 'dr. Bagas Pratama, Sp.KJ',
            spesialisasi: 'Psikiatri',
            fasilitas: 'Klinik Sehat Jiwa',
            alamat: 'Jl. Dago No. 88, Bandung',
            lat: -6.884,
            lng: 107.613,
            jarakKm: 3.1,
            tarif: 350000,
            keahlian: ['Depresi', 'Gangguan tidur'],
            deskripsi: 'Menangani gangguan mood dan tidur pada remaja serta mahasiswa, termasuk penilaian kebutuhan rujukan medis.'
        },
        {
            id: 'NAKES-NK',
            inisial: 'NK',
            tone: 'tone-teal',
            nama: 'Nia Kusuma, M.Psi.',
            spesialisasi: 'Psikologi Pendidikan',
            fasilitas: 'Puskesmas Cendana',
            alamat: 'Jl. Cendana No. 5, Bandung',
            lat: -6.95,
            lng: 107.63,
            jarakKm: 4.8,
            tarif: 250000,
            keahlian: ['Motivasi belajar', 'Relasi'],
            deskripsi: 'Membantu pelajar menyusun strategi belajar, menjaga motivasi, dan memperbaiki relasi dengan teman maupun keluarga.'
        },
        {
            id: 'NAKES-AS',
            inisial: 'AS',
            tone: 'tone-mist',
            nama: 'Alya Siregar, M.Psi.',
            spesialisasi: 'Psikolog Anak dan Remaja',
            fasilitas: 'Klinik Tumbuh',
            alamat: 'Jl. Setiabudi No. 21, Bandung',
            lat: -6.86,
            lng: 107.595,
            jarakKm: 6.2,
            tarif: 275000,
            keahlian: ['Kecemasan', 'Relasi'],
            deskripsi: 'Berpraktik untuk remaja yang mengalami konflik pertemanan, tekanan sekolah, dan perubahan suasana hati.'
        }
    ];

    const inputLokasi = document.getElementById('Input_Lokasi');
    const filterSpesialisasi = document.getElementById('Filter_Spesialisasi');
    const daftarEl = document.getElementById('NakesListContainer');
    const teksJumlah = document.getElementById('Text_JumlahHasil');
    const teksKosong = document.getElementById('Text_Kosong');
    const modalLokasi = document.getElementById('Modal_IzinLokasi');
    const modalDetail = document.getElementById('Modal_Detail');
    const modalJanji = document.getElementById('Modal_Janji');
    const toast = document.getElementById('Toast_Janji');

    let izinLokasi = localStorage.getItem('lokasiAktif') === 'ya';
    let lokasiPengguna = null;
    let nakesDipilih = null;

    const storedUser = JSON.parse(localStorage.getItem('mahasehat_user') || '{}');
    const namaUser = storedUser.nama || 'Budi Pratama';
    document.getElementById('Text_NamaUser').textContent = namaUser;
    document.getElementById('Text_RoleUser').textContent = storedUser.role || 'Pelajar';
    document.getElementById('User_Avatar').textContent = namaUser.trim().charAt(0).toUpperCase();

    document.getElementById('Menu_Keluar').addEventListener('click', () => {
        localStorage.clear();
    });

    function formatRupiah(nilai) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(nilai);
    }

    function formatJarak(km) {
        return `${km.toFixed(1).replace('.', ',')} km`;
    }

    function jarakKe(nakes) {
        if (!izinLokasi || !lokasiPengguna) return nakes.jarakKm;
        const keRad = (derajat) => derajat * Math.PI / 180;
        const dLat = keRad(nakes.lat - lokasiPengguna.lat);
        const dLng = keRad(nakes.lng - lokasiPengguna.lng);
        const a = Math.sin(dLat / 2) ** 2
            + Math.cos(keRad(lokasiPengguna.lat)) * Math.cos(keRad(nakes.lat)) * Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function isiFilter() {
        const unik = [...new Set(daftarNakes.map((item) => item.spesialisasi))];
        unik.forEach((spesialisasi) => {
            const opsi = document.createElement('option');
            opsi.value = spesialisasi;
            opsi.textContent = spesialisasi;
            filterSpesialisasi.appendChild(opsi);
        });
    }

    function yangCocok() {
        const kata = inputLokasi.value.trim().toLowerCase();
        const spesialisasi = filterSpesialisasi.value;
        return daftarNakes
            .filter((item) => {
                const haystack = [item.nama, item.fasilitas, item.alamat, item.spesialisasi, ...item.keahlian]
                    .join(' ')
                    .toLowerCase();
                const lolosKata = !kata || haystack.includes(kata);
                const lolosSpesialisasi = !spesialisasi || item.spesialisasi === spesialisasi;
                return lolosKata && lolosSpesialisasi;
            })
            .sort((a, b) => jarakKe(a) - jarakKe(b));
    }

    function displayResults(listTenagaKesehatan) {
        daftarEl.replaceChildren();
        teksKosong.hidden = listTenagaKesehatan.length > 0;
        teksJumlah.textContent = listTenagaKesehatan.length
            ? `${listTenagaKesehatan.length} tenaga kesehatan${izinLokasi ? ' diurutkan dari yang terdekat' : ''}.`
            : 'Tidak ada hasil.';

        listTenagaKesehatan.forEach((item) => {
            const kartu = document.createElement('article');
            kartu.className = 'nakes-card';
            kartu.id = `Card_NakesItem_${item.id}`;

            const jarak = izinLokasi ? ` · ${formatJarak(jarakKe(item))}` : '';
            kartu.innerHTML = `
                <div class="nakes-main">
                    <div class="nakes-avatar ${item.tone}" aria-hidden="true">${item.inisial}</div>
                    <div class="nakes-identity">
                        <h2 class="nakes-name">${item.nama}</h2>
                        <p class="nakes-specialty">${item.spesialisasi}</p>
                        <p class="nakes-location">${item.fasilitas}${jarak}</p>
                    </div>
                    <p class="nakes-fee">
                        <strong>${formatRupiah(item.tarif)}</strong>
                        <span>per sesi</span>
                    </p>
                </div>
                <div class="nakes-footer">
                    <div class="tag-row">
                        ${item.keahlian.map((tag) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button type="button" class="btn-detail" data-aksi="detail" data-id="${item.id}">Lihat Detail</button>
                        <button type="button" class="btn-amber" data-aksi="janji" data-id="${item.id}">Jadwalkan</button>
                    </div>
                </div>
            `;
            daftarEl.appendChild(kartu);
        });
    }

    function tampilkan() {
        displayResults(yangCocok());
    }

    function bukaDetail(item) {
        nakesDipilih = item;
        document.getElementById('Detail_Avatar').textContent = item.inisial;
        document.getElementById('Detail_Avatar').className = `nakes-avatar ${item.tone}`;
        document.getElementById('Title_Detail').textContent = item.nama;
        document.getElementById('Detail_Spesialisasi').textContent = item.spesialisasi;
        document.getElementById('Detail_Fasilitas').textContent = item.fasilitas;
        document.getElementById('Detail_Alamat').textContent = item.alamat;
        document.getElementById('Detail_Jarak').textContent = izinLokasi
            ? formatJarak(jarakKe(item))
            : 'Lokasi tidak diizinkan';
        document.getElementById('Detail_Tarif').textContent = `${formatRupiah(item.tarif)} per sesi`;
        document.getElementById('Detail_Str').textContent = item.nomorStr;
        document.getElementById('Detail_Deskripsi').textContent = item.deskripsi;
        document.getElementById('Detail_Tags').innerHTML = item.keahlian
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join('');
        modalDetail.hidden = false;
    }

    function bukaJanji(item) {
        nakesDipilih = item;
        modalDetail.hidden = true;
        document.getElementById('Janji_Nama').textContent = `${item.nama} · ${item.fasilitas}`;
        modalJanji.hidden = false;
    }

    function cariById(id) {
        return daftarNakes.find((item) => item.id === id);
    }

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

    document.getElementById('Btn_TutupDetail').addEventListener('click', () => {
        modalDetail.hidden = true;
    });
    document.getElementById('Btn_JadwalkanDariDetail').addEventListener('click', () => {
        if (nakesDipilih) bukaJanji(nakesDipilih);
    });
    document.getElementById('Btn_BatalJanji').addEventListener('click', () => {
        modalJanji.hidden = true;
    });
    document.getElementById('Btn_BuatJanji').addEventListener('click', () => {
        const slot = document.querySelector('input[name="slot"]:checked');
        if (!nakesDipilih || !slot) return;
        sessionStorage.setItem('mahasehat_janji', JSON.stringify({
            idTenagaKesehatan: nakesDipilih.id,
            nama: nakesDipilih.nama,
            fasilitas: nakesDipilih.fasilitas,
            slot: slot.value
        }));
        modalJanji.hidden = true;
        toast.hidden = false;
        toast.textContent = `Janji dengan ${nakesDipilih.nama} diajukan untuk ${slot.value}.`;
        window.setTimeout(() => {
            toast.hidden = true;
        }, 3200);
    });

    function tutupLokasi(diizinkan) {
        izinLokasi = diizinkan;
        localStorage.setItem('lokasiAktif', diizinkan ? 'ya' : 'tidak');
        modalLokasi.hidden = true;
        tampilkan();
    }

    document.getElementById('Btn_JanganIzinkan').addEventListener('click', () => tutupLokasi(false));
    document.getElementById('Btn_Izinkan').addEventListener('click', () => {
        tutupLokasi(true);
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((posisi) => {
            lokasiPengguna = {
                lat: posisi.coords.latitude,
                lng: posisi.coords.longitude
            };
            tampilkan();
        });
    });

    function showPage() {
        isiFilter();
        tampilkan();
        if (localStorage.getItem('lokasiAktif') == null) {
            modalLokasi.hidden = false;
        }
    }

    showPage();
});
