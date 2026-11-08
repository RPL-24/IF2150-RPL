/**
 * MahaSehat - NotifikasiDarurat.js
 * Logika antarmuka pop-up notifikasi darurat (UC08)
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnDiterima = document.getElementById('Btn_Diterima');
    const btnSudahDitindaklanjuti = document.getElementById('Btn_SudahDitindaklanjuti');
    const descDarurat = document.getElementById('Desc_Darurat');
    const cardDarurat = document.getElementById('Card_Darurat');
    const cardSelesai = document.getElementById('Card_Selesai');

    // Dummy ID Notifikasi
    const idNotifikasi = "NOTIF_EMERGENCY_001";

    function loadEmergencyDetail() {
        const emergencyData = JSON.parse(localStorage.getItem('emergencyDetail')) || {
            ringkasanKondisi: "Pelajar tidak melakukan check-in selama 3 hari berturut-turut dan rata-rata mood berada di bawah ambang batas aman. Segera lakukan tindak lanjut dan hubungi pelajar."
        };
        if (descDarurat) descDarurat.innerText = emergencyData.ringkasanKondisi;
    }

    if (btnDiterima) {
        btnDiterima.addEventListener('click', () => {
            btnDiterima.disabled = true;
            btnDiterima.innerText = "Dikonfirmasi ✓";
            btnDiterima.classList.add('btn-confirmed');

            console.log(`[NotifikasiDaruratController] confirmReceived called for idNotifikasi: ${idNotifikasi}`);
            alert("Status notifikasi telah dicatat sebagai 'Diterima'. Silakan hubungi pelajar untuk tindak lanjut.");
        });
    }

    if (btnSudahDitindaklanjuti) {
        btnSudahDitindaklanjuti.addEventListener('click', () => {
            console.log(`[NotifikasiDaruratController] markFollowUp called for idNotifikasi: ${idNotifikasi}`);
            
            alert("Status tindak lanjut berhasil dicatat sebagai 'Sudah Ditindaklanjuti'. Status darurat pelajar kini telah dipulihkan.");

            if (cardDarurat) cardDarurat.style.display = 'none';
            if (cardSelesai) cardSelesai.style.display = 'flex';
        });
    }

    loadEmergencyDetail();
});
