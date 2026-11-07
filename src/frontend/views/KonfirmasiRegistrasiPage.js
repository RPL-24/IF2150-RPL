document.addEventListener('DOMContentLoaded', function () {
    const dataPelajar = JSON.parse(localStorage.getItem('pendingStudentData')) || {
        nama: "Budi Santoso",
        email: "BudiSantoso89@gmail.com",
        telepon: "081939326802"
    };
    
    document.getElementById('Text_ValNamaPelajar').innerText = dataPelajar.nama;
    document.getElementById('Text_ValEmailPelajar').innerText = dataPelajar.email;
    document.getElementById('Text_ValueNomorTelpPelajar').innerText = dataPelajar.telepon;

    const btnSetuju = document.getElementById('Btn_Setuju');
    const btnTidakSetuju = document.getElementById('Btn_TidakSetuju');

    // Setuju
    btnSetuju.addEventListener('click', function () {
        const konfirmasi = confirm(`Apakah Anda yakin ingin menyetujui pendaftaran akun untuk ${dataPelajar.nama}?`);
        
        if (konfirmasi) {
            setTimeout(() => {
                alert(`Persetujuan berhasil! Akun ${dataPelajar.nama} kini telah aktif.`);
            }, 300);
        }
    });

    // Tidak setuju
    btnTidakSetuju.addEventListener('click', function () {
        const konfirmasi = confirm(`Apakah Anda yakin ingin menolak pengajuan akun untuk ${dataPelajar.nama}?`);
        
        if (konfirmasi) {
            setTimeout(() => {
                alert(`Pengajuan akun ${dataPelajar.nama} telah ditolak.`);
            }, 300);
        }
    });
});