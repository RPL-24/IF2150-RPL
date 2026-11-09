const db = require('../config/db');
const Pelajar = require('../models/Pelajar');
const CheckIn = require('../models/CheckIn');
const AppError = require('../utils/AppError');

exports.submitCheckIn = async (req, res, next) => {
    try {
        
        const idPengguna = req.user.id || req.user.id_pengguna;
        
        const pelajar = await Pelajar.findByIdPengguna(idPengguna);
        if (!pelajar) {
            return res.status(404).json({ status: 'error', message: 'Profil pelajar tidak ditemukan.' });
        }

        const { mood, sleep, meal, triggers, note } = req.body;

        if (mood === undefined || mood === null) {
            return res.status(400).json({ status: 'error', message: 'Skala mood wajib diisi.' });
        }
        const today = new Date().toISOString().split('T')[0];

        const checkInData = CheckIn.createCheckIn({
            tanggalCheckIn: today,
            skalaMood: Number(mood),
            jamTidur: sleep?.bed || '22:30',
            jamBangun: sleep?.wake || '06:00',
            polaMakan: meal || 'Teratur',
            pemicuStres: Array.isArray(triggers) ? triggers.join(', ') : (triggers || ''),
            catatanRefleksi: note ? JSON.stringify(note) : null
        });

        await pelajar.setCheckIn(checkInData);

        return res.status(201).json({
            status: 'success',
            message: 'Daily check-in berhasil disimpan!',
            data: checkInData
        });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.status).json({ status: 'error', message: error.message });
        }
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Gagal memproses daily check-in' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const idPengguna = req.user.id || req.user.id_pengguna;
        const pelajar = await Pelajar.findByIdPengguna(idPengguna);
        if (!pelajar) {
            return res.status(404).json({ status: 'error', message: 'Profil pelajar tidak ditemukan.' });
        }

        const history = await pelajar.getCheckInHistory();

        return res.status(200).json({
            status: 'success',
            data: history
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Gagal mengambil riwayat daily check-in' });
    }
};

exports.getTodayStatus = async (req, res) => {
    try {
        const idPengguna = req.user.id || req.user.id_pengguna;
        const pelajar = await Pelajar.findByIdPengguna(idPengguna);
        if (!pelajar) {
            return res.status(404).json({ status: 'error', message: 'Profil pelajar tidak ditemukan.' });
        }

        const today = new Date().toISOString().split('T')[0];
        const checkInToday = await pelajar.getCheckInSejak(today);
        const hasCheckedIn = checkInToday.length > 0;

        return res.status(200).json({
            status: 'success',
            hasCheckedIn: hasCheckedIn,
            data: hasCheckedIn ? checkInToday[0] : null
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Gagal memeriksa status daily check-in hari ini' });
    }
};