/**
 * MahaSehat - feedback.js
 * Pop-up message (toast) bawaan untuk aksi berhasil/gagal.
 * Satu implementasi, satu gaya: hijau untuk sukses, merah untuk gagal,
 * muncul di kanan bawah dan hilang otomatis.
 */

(function () {
    'use strict';

    let elemen = null;
    let timer = null;

    function pastikanElemen() {
        if (elemen && elemen.isConnected) return elemen;
        elemen = document.createElement('p');
        elemen.className = 'toast-notification';
        elemen.setAttribute('role', 'status');
        elemen.setAttribute('aria-live', 'polite');
        document.body.append(elemen);
        return elemen;
    }

    function show(message, type = 'success', durasi = 4000) {
        const toast = pastikanElemen();
        toast.className = `toast-notification${type === 'danger' ? ' toast-notification--danger' : ''}`;
        toast.textContent = String(message || '');
        toast.hidden = false;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            toast.hidden = true;
        }, durasi);
        return toast;
    }

    window.MahaSehatFeedback = {
        show,
        success: (message, durasi) => show(message, 'success', durasi),
        error: (message, durasi) => show(message, 'danger', durasi)
    };
})();
