/**
 * MahaSehat - KonfirmasiRegistrasiPage.js
 * Logika konfirmasi dan persetujuan akun pelajar oleh orang tua / wali.
 * Keterlacakan DPPL: UC02 (Registrasi Akun), C03 (Orang Tua/Wali)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Parameter URL (jika dipanggil via link email) atau fallback dari localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const localData = JSON.parse(localStorage.getItem('pendingStudentData') || '{}');

    const dataPelajar = {
        nama: urlParams.get('nama') || localData.nama || 'Albert Einstein',
        email: urlParams.get('email') || localData.email || 'albert.einstein@gmail.com',
        diminta: urlParams.get('diminta') || localData.diminta || '7 November 2026',
        telepon: urlParams.get('telepon') || localData.telepon || '081939326802'
    };

    // Render Data Pelajar ke Elemen UI
    const elNama = document.getElementById('Text_ValNamaPelajar');
    const elEmail = document.getElementById('Text_ValEmailPelajar');
    const elDiminta = document.getElementById('Text_ValDiminta');
    const elTelepon = document.getElementById('Text_ValueNomorTelpPelajar');
    const alertBox = document.getElementById('Alert_Notif');

    if (elNama) elNama.textContent = dataPelajar.nama;
    if (elEmail) elEmail.textContent = dataPelajar.email;
    if (elDiminta) elDiminta.textContent = dataPelajar.diminta;
    if (elTelepon) elTelepon.textContent = dataPelajar.telepon;

    // Helper Notifikasi
    const showNotification = (message, type = 'success') => {
        if (!alertBox) return;
        alertBox.className = `alert-box alert-${type}`;
        alertBox.textContent = message;
        alertBox.hidden = false;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Tombol Aksi
    const btnSetuju = document.getElementById('Btn_Setuju');
    const btnTidakSetuju = document.getElementById('Btn_TidakSetuju');

    // ==========================================================================
    // 1. Aksi Setujui Akun
    // ==========================================================================
    if (btnSetuju) {
        btnSetuju.addEventListener('click', () => {
            const konfirmasi = confirm(`Apakah Anda yakin ingin menyetujui pendaftaran akun untuk ${dataPelajar.nama}?`);
            if (!konfirmasi) return;

            btnSetuju.disabled = true;
            btnSetuju.textContent = 'Memproses...';
            if (btnTidakSetuju) btnTidakSetuju.disabled = true;

            setTimeout(() => {
                showNotification(`Persetujuan berhasil! Akun pelajar ${dataPelajar.nama} kini telah aktif dan dapat digunakan.`, 'success');
                btnSetuju.textContent = 'Akun Telah Disetujui';
                
                // Simpan status ke localStorage
                localStorage.setItem('studentAccountStatus', JSON.stringify({
                    nama: dataPelajar.nama,
                    status: 'APPROVED',
                    approvedAt: new Date().toISOString()
                }));
            }, 600);
        });
    }

    // ==========================================================================
    // 2. Aksi Tolak Permintaan
    // ==========================================================================
    if (btnTidakSetuju) {
        btnTidakSetuju.addEventListener('click', () => {
            const konfirmasi = confirm(`Apakah Anda yakin ingin menolak pengajuan akun untuk ${dataPelajar.nama}?`);
            if (!konfirmasi) return;

            if (btnSetuju) btnSetuju.disabled = true;
            btnTidakSetuju.disabled = true;
            btnTidakSetuju.textContent = 'Permintaan Ditolak';

            setTimeout(() => {
                showNotification(`Permintaan pendaftaran akun untuk ${dataPelajar.nama} telah ditolak.`, 'danger');
                
                localStorage.setItem('studentAccountStatus', JSON.stringify({
                    nama: dataPelajar.nama,
                    status: 'REJECTED',
                    rejectedAt: new Date().toISOString()
                }));
            }, 400);
        });
    }
});
