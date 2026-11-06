document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Form_Registration');
    const roleInput = document.getElementById('Input_Role');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const groupKontakOrtu = document.getElementById('Group_KontakOrangTua');
    const alertError = document.getElementById('Alert_Error');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedRole = btn.getAttribute('data-role');
        roleInput.value = selectedRole;

        if (selectedRole === 'pelajar') {
            groupKontakOrtu.style.display = 'flex';
        } else {
            groupKontakOrtu.style.display = 'none';
        }
        });
    });

    function isValidDate(day, month, year) {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
        if (m < 1 || m > 12) return false;
        if (y < 1900 || y > new Date().getFullYear()) return false;

        const dateObj = new Date(y, m - 1, d);
        return (
            dateObj.getFullYear() === y &&
            dateObj.getMonth() === m - 1 &&
            dateObj.getDate() === d
        );
    }

    const hintError = document.getElementById('Hint_TglError');

    form.addEventListener('submit', (e) => {
        const tgl = document.getElementById('Input_TanggalLahir').value;
        const bln = document.getElementById('Input_BulanLahir').value;
        const thn = document.getElementById('Input_TahunLahir').value;

        if (!isValidDate(tgl, bln, thn)) {
            e.preventDefault(); 
            hintError.innerText = "Tanggal lahir tidak valid (periksa kembali tanggal, bulan, dan tahun).";
            hintError.style.display = "block";
            return;
        }

        hintError.style.display = "none";
        
        const formattedDate = `${thn}-${bln.padStart(2, '0')}-${tgl.padStart(2, '0')}`;
        console.log("Tanggal: ", formattedDate);

        window.location.href = 'RegistrationSuccessPage.html';

    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertError.style.display = 'none';

        const nama = document.getElementById('Input_Nama').value.trim();
        const email = document.getElementById('Input_Email').value.trim();
        const telepon = document.getElementById('Input_Telepon').value.trim();
        const password = document.getElementById('Input_Password').value;
        const confirmPassword = document.getElementById('Input_ConfirmPassword').value;
        const role = roleInput.value;

        if (password !== confirmPassword) {
        showError("Konfirmasi kata sandi tidak cocok!");
        return;
        }
        if (password.length < 8) {
        showError("Kata sandi minimal harus 8 karakter.");
        return;
        }

        const payload = {
        nama,
        email,
        telepon,
        role,
        tanggal_lahir: `${selectThn.value}-${selectBlnPad(document.getElementById('Select_Bln').value)}-${selectBlnPad(selectTgl.value)}`,
        email_orang_tua: role === 'pelajar' ? document.getElementById('Input_EmailOrangTua').value : null,
        password
        };

        try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registrasi gagal.');
        }

        alert("Registrasi berhasil! Silakan cek email/masuk ke akun Anda.");
        window.location.href = '/views/login.html';

        } catch (err) {
        showError(err.message);
        }
    });

    function showError(msg) {
        alertError.innerText = msg;
        alertError.style.display = 'block';
    }

    function selectBlnPad(val) {
        return val.padStart(2, '0');
    }
});