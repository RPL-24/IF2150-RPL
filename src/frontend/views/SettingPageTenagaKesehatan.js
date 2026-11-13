/**
 * MahaSehat - SettingPageTenagaKesehatan.js
 * Logika Pengelolaan Profil Praktik, Tempat Kerja, dan Jadwal Tenaga Kesehatan
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mahasehat_nakes_profile_v2';
    const USER_KEY = 'mahasehat_user';

    // Form elements
    const formProfil = document.getElementById('Form_ProfilNakes');
    const formTempat = document.getElementById('Form_TempatKerja');
    const formJadwal = document.getElementById('Form_JadwalPraktik');
    const toggleMenerima = document.getElementById('Toggle_MenerimaPasien');
    const textStatusPenerimaan = document.getElementById('Text_StatusPenerimaan');
    const groupRentang = document.getElementById('Group_RentangJam');
    const btnTambahRentang = document.getElementById('Btn_TambahRentang');
    const selectDurasi = document.getElementById('Select_DurasiSesi');
    const groupSlot = document.getElementById('Group_SlotWaktu');
    const textErrorJam = document.getElementById('Text_ErrorJam');
    const switchNotif = document.getElementById('Switch_Notifikasi');
    const textNotifInfo = document.getElementById('Text_NotifInfo');
    const switchLokasi = document.getElementById('Switch_Lokasi');
    const textLokasiInfo = document.getElementById('Text_LokasiInfo');

    // Rentang jam default 
    const DEFAULT_RENTANG = [
        { mulai: '10:00', selesai: '11:00' },
        { mulai: '13:00', selesai: '14:00' },
        { mulai: '15:30', selesai: '16:30' }
    ];

    // Rentang jam custom
    const toMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const toTime = (min) => String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
    const fmtDot = (min) => toTime(min).replace(':', '.');

    function addRangeRow(mulai = '', selesai = '') {
        const row = document.createElement('div');
        row.className = 'range-row';
        row.innerHTML =
            '<input type="time" class="form-input" name="mulai" aria-label="Jam mulai" value="' + mulai + '">' +
            '<span class="range-sep">sampai</span>' +
            '<input type="time" class="form-input" name="selesai" aria-label="Jam selesai" value="' + selesai + '">' +
            '<button type="button" class="btn btn--icon btn-icon-remove" aria-label="Hapus rentang jam">&times;</button>';
        groupRentang.appendChild(row);
        syncRemoveButtons();
    }

    function setRanges(list) {
        groupRentang.innerHTML = '';
        list.forEach((r) => addRangeRow(r.mulai, r.selesai));
    }

    function syncRemoveButtons() {
        const rows = groupRentang.querySelectorAll('.range-row');
        rows.forEach((row) => {
            row.querySelector('.btn-icon-remove').disabled = rows.length === 1;
        });
    }

    function readRanges() {
        return Array.from(groupRentang.querySelectorAll('.range-row')).map((row) => ({
            mulai: row.querySelector('[name="mulai"]').value,
            selesai: row.querySelector('[name="selesai"]').value
        }));
    }

    // Buat daftar slot dari semua rentang
    function generateSlots(ranges, durasi) {
        const slots = [];
        ranges
            .filter((r) => r.mulai && r.selesai && toMinutes(r.selesai) > toMinutes(r.mulai))
            .sort((a, b) => toMinutes(a.mulai) - toMinutes(b.mulai))
            .forEach((r) => {
                for (let t = toMinutes(r.mulai); t + durasi <= toMinutes(r.selesai); t += durasi) {
                    slots.push(fmtDot(t) + '-' + fmtDot(t + durasi));
                }
            });
        return slots;
    }

    function validateRanges(ranges, durasi) {
        for (const r of ranges) {
            if (!r.mulai || !r.selesai) return 'Lengkapi jam mulai dan jam selesai pada setiap rentang.';
            if (toMinutes(r.selesai) <= toMinutes(r.mulai)) return 'Jam selesai harus lebih besar dari jam mulai.';
            if (toMinutes(r.selesai) - toMinutes(r.mulai) < durasi) {
                return 'Setiap rentang minimal sepanjang durasi sesi (' + durasi + ' menit).';
            }
        }
        const sorted = [...ranges].sort((a, b) => toMinutes(a.mulai) - toMinutes(b.mulai));
        for (let i = 1; i < sorted.length; i++) {
            if (toMinutes(sorted[i].mulai) < toMinutes(sorted[i - 1].selesai)) {
                return 'Rentang jam tidak boleh saling tumpang tindih.';
            }
        }
        return '';
    }

    function showJamError(message) {
        textErrorJam.textContent = message;
        textErrorJam.hidden = !message;
    }

    function renderSlotPreview() {
        const slots = generateSlots(readRanges(), Number(selectDurasi.value));
        groupSlot.innerHTML = '';
        if (slots.length === 0) {
            const note = document.createElement('p');
            note.className = 'field-note';
            note.textContent = 'Belum ada slot. Pastikan rentang jam minimal sepanjang durasi sesi.';
            groupSlot.appendChild(note);
            return;
        }
        slots.forEach((s) => {
            const pill = document.createElement('span');
            pill.className = 'slot-pill';
            pill.textContent = s.replace('-', ' - ') + ' WIB';
            groupSlot.appendChild(pill);
        });
    }

    function initJadwalKustom() {
        if (!groupRentang.children.length) setRanges(DEFAULT_RENTANG);

        btnTambahRentang.addEventListener('click', () => {
            const rows = readRanges();
            const last = rows[rows.length - 1];
            // Usulkan rentang baru 1 jam setelah rentang terakhir
            const start = last && last.selesai ? toMinutes(last.selesai) : 9 * 60;
            addRangeRow(toTime(Math.min(start, 22 * 60 + 59)), toTime(Math.min(start + 60, 23 * 60 + 59)));
            renderSlotPreview();
        });

        groupRentang.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-icon-remove');
            if (!btn || btn.disabled) return;
            btn.closest('.range-row').remove();
            syncRemoveButtons();
            showJamError('');
            renderSlotPreview();
        });

        groupRentang.addEventListener('input', () => { showJamError(''); renderSlotPreview(); });
        selectDurasi.addEventListener('change', () => { showJamError(''); renderSlotPreview(); });

        renderSlotPreview();
    }

    // Load saved profile data if exists
    function loadSavedData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);

            if (data.nama) document.getElementById('Input_Nama').value = data.nama;
            if (data.spesialisasi) document.getElementById('Input_Spesialisasi').value = data.spesialisasi;
            if (data.sip) document.getElementById('Input_SIP').value = data.sip;
            if (data.tarif) document.getElementById('Input_Tarif').value = data.tarif;
            if (data.email) document.getElementById('Input_Email').value = data.email;
            if (data.telepon) document.getElementById('Input_NomorTelepon').value = data.telepon;
            if (data.bio) document.getElementById('Input_Bio').value = data.bio;

            if (data.instansi) document.getElementById('Input_Instansi').value = data.instansi;
            if (data.alamat) document.getElementById('Input_Alamat').value = data.alamat;
            if (typeof data.online === 'boolean') document.getElementById('Check_Online').checked = data.online;
            if (typeof data.offline === 'boolean') document.getElementById('Check_Offline').checked = data.offline;
            if (data.linkMeet) document.getElementById('Input_LinkTelekonsultasi').value = data.linkMeet;

            // Jadwal: rentang jam custom
            if (data.durasiSesi) selectDurasi.value = String(data.durasiSesi);
            if (Array.isArray(data.rentangJam) && data.rentangJam.length) {
                setRanges(data.rentangJam);
            } else if (Array.isArray(data.slots) && data.slots.length) {
                setRanges(data.slots.map((s) => {
                    const [a, b] = s.split('-');
                    return { mulai: a.replace('.', ':'), selesai: b.replace('.', ':') };
                }));
            }
            if (Array.isArray(data.hari)) {
                document.querySelectorAll('input[name="hari"]').forEach((el) => {
                    el.checked = data.hari.includes(el.value);
                });
            }

            if (typeof data.menerimaPasien === 'boolean') {
                toggleMenerima.checked = data.menerimaPasien;
                updateToggleText(data.menerimaPasien);
            }
        } catch (e) {
            console.warn('Gagal memuat profil nakes dari storage:', e);
        }
    }

    function updateToggleText(isActive) {
        if (!textStatusPenerimaan) return;
        if (isActive) {
            textStatusPenerimaan.textContent = 'Saat ini menerima pengajuan konsultasi baru';
            textStatusPenerimaan.style.color = 'var(--color-teal)';
        } else {
            textStatusPenerimaan.textContent = 'Praktik ditutup sementara (tidak menerima permohonan baru)';
            textStatusPenerimaan.style.color = 'var(--color-danger)';
        }
    }

    if (toggleMenerima) {
        toggleMenerima.addEventListener('change', (e) => {
            updateToggleText(e.target.checked);
        });
    }

    // Handler Form Profil
    if (formProfil) {
        formProfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nama = document.getElementById('Input_Nama').value.trim();
            const email = document.getElementById('Input_Email').value.trim();
            const nomorTelepon = document.getElementById('Input_NomorTelepon').value.trim();
            const jenis = document.getElementById('Input_Spesialisasi').value.trim();
            const nomorStr = document.getElementById('Input_SIP').value.trim();

            try {
                const token = localStorage.getItem('mahasehat_token');
                const respons = await fetch('/api/auth/me', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nama,
                        email,
                        nomor_telepon: nomorTelepon,
                        jenis_tenaga_kesehatan: jenis,
                        nomor_str: nomorStr
                    })
                });
                const hasil = await respons.json().catch(() => ({}));
                if (!respons.ok) throw new Error(hasil.message || 'Profil gagal disimpan.');

                // Simpan tarif ke server (sebelumnya hanya tersimpan di localStorage)
                const tarifAngka = Number(
                    document.getElementById('Input_Tarif').value.replace(/[^\d]/g, '')
                );
                if (!Number.isFinite(tarifAngka) || tarifAngka <= 0) {
                    throw new Error('Tarif konsultasi tidak valid.');
                }
                const resTarif = await fetch('/api/tenaga-kesehatan/me/tarif', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ estimasi_biaya: tarifAngka })
                });
                const hasilTarif = await resTarif.json().catch(() => ({}));
                if (!resTarif.ok) throw new Error(hasilTarif.message || 'Tarif gagal disimpan.');
                const tarifTampil = `Rp${tarifAngka.toLocaleString('id-ID')} / sesi`;
                document.getElementById('Input_Tarif').value = tarifTampil;

                const profil = hasil.data || {};
                const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    ...current,
                    nama: profil.nama,
                    email: profil.email,
                    telepon: profil.nomor_telepon,
                    spesialisasi: jenis,
                    sip: nomorStr,
                    tarif: tarifTampil,
                    bio: document.getElementById('Input_Bio').value
                }));

                const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
                localStorage.setItem(USER_KEY, JSON.stringify({
                    ...user,
                    nama: profil.nama,
                    email: profil.email,
                    nomorTelepon: profil.nomor_telepon
                }));

                MahaSehatFeedback.success('Profil profesional berhasil disimpan.');
            } catch (error) {
                MahaSehatFeedback.error(error.message || 'Profil gagal disimpan.');
            }
        });
    }

    // Handler Form Tempat Kerja
    if (formTempat) {
        formTempat.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                instansi: document.getElementById('Input_Instansi').value,
                alamat: document.getElementById('Input_Alamat').value,
                online: document.getElementById('Check_Online').checked,
                offline: document.getElementById('Check_Offline').checked,
                linkMeet: document.getElementById('Input_LinkTelekonsultasi').value
            };
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
            MahaSehatFeedback.success('Informasi tempat kerja dan tautan telekonsultasi berhasil diperbarui.');
        });
    }

    // Handler Form Jadwal
    if (formJadwal) {
        formJadwal.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDays = Array.from(document.querySelectorAll('input[name="hari"]:checked')).map(el => el.value);
            const rentangJam = readRanges();
            const durasiSesi = Number(selectDurasi.value);
            const error = validateRanges(rentangJam, durasiSesi);
            if (error) {
                showJamError(error);
                return;
            }
            showJamError('');
            const data = {
                menerimaPasien: toggleMenerima ? toggleMenerima.checked : true,
                hari: selectedDays,
                rentangJam: rentangJam,
                durasiSesi: durasiSesi,
                slots: generateSlots(rentangJam, durasiSesi)
            };
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
            MahaSehatFeedback.success('Ketersediaan jadwal praktik dan slot konsultasi berhasil disimpan.');
        });
    }

    // Inisialisasi Izin Notifikasi
    if (switchNotif) {
        if (!('Notification' in window)) {
            switchNotif.disabled = true;
            if (textNotifInfo) textNotifInfo.textContent = 'Peramban tidak mendukung notifikasi.';
        } else {
            switchNotif.checked = Notification.permission === 'granted' && localStorage.getItem('notifAktif') !== 'tidak';
            if (Notification.permission === 'denied' && textNotifInfo) {
                textNotifInfo.textContent = 'Izin diblokir. Aktifkan lewat pengaturan peramban.';
            }
        }

        switchNotif.addEventListener('change', () => {
            if (!switchNotif.checked) {
                localStorage.setItem('notifAktif', 'tidak');
                if (textNotifInfo) textNotifInfo.textContent = '';
                return;
            }

            Notification.requestPermission().then((hasil) => {
                if (hasil === 'granted') {
                    localStorage.setItem('notifAktif', 'ya');
                    if (textNotifInfo) textNotifInfo.textContent = '';
                    MahaSehatFeedback.success('Notifikasi pemantauan diaktifkan.');
                } else {
                    switchNotif.checked = false;
                    if (textNotifInfo) textNotifInfo.textContent = 'Izin ditolak oleh pengguna.';
                }
            });
        });
    }

    // Inisialisasi Izin Lokasi
    if (switchLokasi) {
        if (!('geolocation' in navigator)) {
            switchLokasi.disabled = true;
            if (textLokasiInfo) textLokasiInfo.textContent = 'Peramban tidak mendukung akses lokasi.';
        } else if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((hasil) => {
                switchLokasi.checked = hasil.state === 'granted' && localStorage.getItem('lokasiAktif') !== 'tidak';
                if (hasil.state === 'denied' && textLokasiInfo) {
                    textLokasiInfo.textContent = 'Izin lokasi diblokir di peramban.';
                }
            });
        }

        switchLokasi.addEventListener('change', () => {
            if (!switchLokasi.checked) {
                localStorage.setItem('lokasiAktif', 'tidak');
                if (textLokasiInfo) textLokasiInfo.textContent = '';
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => {
                    localStorage.setItem('lokasiAktif', 'ya');
                    if (textLokasiInfo) textLokasiInfo.textContent = '';
                    MahaSehatFeedback.success('Izin lokasi diaktifkan.');
                },
                () => {
                    switchLokasi.checked = false;
                    if (textLokasiInfo) textLokasiInfo.textContent = 'Akses lokasi ditolak atau tidak tersedia.';
                }
            );
        });
    }

    loadSavedData();
    initJadwalKustom();

    // Lengkapi profil dari API supaya nilai di form sama dengan data di server
    (async () => {
        try {
            const token = localStorage.getItem('mahasehat_token');
            const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
            const idProfil = user.id_profil || user.idProfil;
            const [me, detail] = await Promise.all([
                fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
                idProfil
                    ? fetch(`/api/tenaga-kesehatan/${encodeURIComponent(idProfil)}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then((res) => res.json())
                    : Promise.resolve({ data: {} })
            ]);

            const profil = (me && me.data) || {};
            const rincian = (detail && detail.data) || {};
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const tarifFasilitas = Number(rincian.estimasi_biaya);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                ...current,
                nama: profil.nama || current.nama,
                email: profil.email || current.email,
                telepon: profil.nomor_telepon || current.telepon,
                spesialisasi: rincian.jenis_tenaga_kesehatan || current.spesialisasi,
                sip: rincian.nomor_str || current.sip,
                tarif: Number.isFinite(tarifFasilitas) && tarifFasilitas > 0
                    ? `Rp${tarifFasilitas.toLocaleString('id-ID')} / sesi`
                    : current.tarif,
                instansi: rincian.nama_fasilitas || current.instansi,
                alamat: rincian.alamat || current.alamat
            }));
            loadSavedData();

            const namaSaya = profil.nama || 'Tenaga Kesehatan';
            const elNama = document.getElementById('Text_NamaUser');
            const elAvatar = document.getElementById('User_Avatar');
            if (elNama) elNama.textContent = namaSaya;
            if (elAvatar) elAvatar.textContent = namaSaya.trim().charAt(0).toUpperCase();

            const badge = document.getElementById('Badge_PendingCount');
            if (badge) {
                const masuk = await fetch('/api/konsultasi/masuk', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
                const jumlah = ((masuk && masuk.data) || []).filter(
                    (item) => item.status_pengajuan === 'Diajukan'
                ).length;
                badge.textContent = String(jumlah);
                badge.hidden = jumlah === 0;
            }
        } catch (error) {
            // Biarkan nilai lokal bila API tidak terjangkau
        }
    })();

});