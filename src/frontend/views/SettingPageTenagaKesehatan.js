/**
 * MahaSehat - SettingPageTenagaKesehatan.js
 * Logika Pengelolaan Profil Praktik, Tempat Kerja, dan Jadwal Tenaga Kesehatan
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mahasehat_nakes_profile';

    // Form elements
    const formProfil = document.getElementById('Form_ProfilNakes');
    const formTempat = document.getElementById('Form_TempatKerja');
    const formJadwal = document.getElementById('Form_JadwalPraktik');
    const toast = document.getElementById('Feedback_Toast');
    const toggleMenerima = document.getElementById('Toggle_MenerimaPasien');
    const textStatusPenerimaan = document.getElementById('Text_StatusPenerimaan');

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

            if (typeof data.menerimaPasien === 'boolean') {
                toggleMenerima.checked = data.menerimaPasien;
                updateToggleText(data.menerimaPasien);
            }
        } catch (e) {
            console.warn('Gagal memuat profil nakes dari storage:', e);
        }
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3500);
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
        formProfil.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                nama: document.getElementById('Input_Nama').value,
                spesialisasi: document.getElementById('Input_Spesialisasi').value,
                sip: document.getElementById('Input_SIP').value,
                tarif: document.getElementById('Input_Tarif').value,
                email: document.getElementById('Input_Email').value,
                telepon: document.getElementById('Input_NomorTelepon').value,
                bio: document.getElementById('Input_Bio').value
            };
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
            showToast('✓ Profil profesional dan tarif berhasil disimpan.');
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
            showToast('✓ Informasi tempat kerja dan tautan telekonsultasi berhasil diperbarui.');
        });
    }

    // Handler Form Jadwal
    if (formJadwal) {
        formJadwal.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDays = Array.from(document.querySelectorAll('input[name="hari"]:checked')).map(el => el.value);
            const selectedSlots = Array.from(document.querySelectorAll('input[name="slot"]:checked')).map(el => el.value);
            const data = {
                menerimaPasien: toggleMenerima ? toggleMenerima.checked : true,
                hari: selectedDays,
                slots: selectedSlots
            };
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
            showToast('✓ Ketersediaan jadwal praktik dan slot konsultasi berhasil disimpan.');
        });
    }

    loadSavedData();
});

