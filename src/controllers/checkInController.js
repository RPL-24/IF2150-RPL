const db = require('../config/db');
const Pelajar = require('../models/Pelajar');
const CheckIn = require('../models/CheckIn');
const AppError = require('../utils/AppError');

exports.validateCheckInFormat = (data) => {
    const moodValue = data.mood !== undefined ? data.mood : data.skalaMood;
    if (moodValue === undefined || moodValue === null) {
        return false;
    }
    const moodNum = Number(moodValue);
    return !isNaN(moodNum) && moodNum >= 1 && moodNum <= 5;
};

exports.encryptJournal = (catatan) => {
    if (!catatan) return null;
    return typeof catatan === 'string' ? catatan : JSON.stringify(catatan);
}

exports.submitCheckIn = async (req, res, next) => {
    try {
        
        const idPengguna = req.user.id || req.user.id_pengguna;
        
        const pelajar = await Pelajar.findByIdPengguna(idPengguna);
        if (!pelajar) {
            return res.status(404).json({ status: 'error', message: 'Profil pelajar tidak ditemukan.' });
        }

        const { mood, sleep, meal, triggers, note } = req.body;

        const finalMood = mood !== undefined ? mood : skalaMood;
        if (!exports.validateCheckInFormat({ mood: finalMood })) {
            return res.status(400).json({ status: 'error', message: 'Skala mood wajib diisi (1-5).' });
        }
        const today = new Date().toISOString().split('T')[0];

        const bedTime = sleep?.bed || jamTidur || '22:30';
        const wakeTime = sleep?.wake || jamBangun || '06:00';
        const dietVal = meal || polaMakan || 'Teratur';
        const triggerVal = triggers || pemicuStres;
        const rawNote = note || catatanRefleksi;

        const formattedTriggers = Array.isArray(triggerVal) ? triggerVal.join(', ') : (triggerVal || '');
        const encryptedNote = exports.encryptJournal(rawNote);

        const checkInData = CheckIn.createCheckIn({
            idPelajar: pelajar.idPelajar || pelajar.id_pelajar,
            tanggalCheckIn: today,
            skalaMood: Number(finalMood),
            jamTidur: bedTime,
            jamBangun: wakeTime,
            polaMakan: dietVal,
            pemicuStres: formattedTriggers,
            catatanRefleksi: encryptedNote
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
        return res.status(500).json({
            status: 'error', message: 'Gagal mengambil riwayat daily check-in' });
    }
};

exports.getTodayStatus = async (req, res) => {
    try {
        const idPengguna = req.user.id || req.user.id_pengguna;
        const pelajar = await Pelajar.findByIdPengguna(idPengguna);
        if (!pelajar) {
            return res.status(404).json({
                status: 'error',
                message: 'Profil pelajar tidak ditemukan.' });
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
        return res.status(500).json({
            status: 'error',
            message: 'Gagal memeriksa status daily check-in hari ini' });
    }
};