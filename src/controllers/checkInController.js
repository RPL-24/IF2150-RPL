const db = require('../config/db');

exports.submitCheckIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const { kondisi_fisik, gejala, catatan } = req.body;

        if (!kondisi_fisik ) {
            return res.status(400).json({ status: 'error', message: 'Kondisi fisik wajib diisi' });
        }

        const existingCheckIn = await db.query(
            'SELECT * FROM check_ins WHERE user_id = ? AND tanggal = ?',
            [userId, today]
        );

        if (existingCheckIn.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Anda sudah melakukan check-in hari ini!'
            });
        }

        const newCheckIn = await db.query(
            'INSERT INTO check_ins (user_id, tanggal, kondisi_fisik, gejala, catatan) VALUES (?, ?, ?, ?, ?)',
            [userId, today, kondisi_fisik, gejala || '', catatan || '']
        );

        return res.status(201).json({
            status: 'success',
            message: 'Daily check-in berhasil disimpan!',
            data: {
                id: newCheckIn.insertId,
                tanggal: today,
                kondisi_fisik,
                gejala,
                catatan
            }
        });

     } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Gagal memproses daily check-in' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await db.query(
            'SELECT * FROM check_ins WHERE user_id = ? ORDER BY tanggal DESC',
            [userId]
        );

        return res.status(200).json({
            status: 'success',
            data: history
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Gagal mengambil riwayat daily check-in' });
    }
};


exports.getTodayStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const checkInToday = await db.query(
            'SELECT * FROM check_ins WHERE user_id = ? AND tanggal = ?',
            [userId, today]
        );

        const hasCheckedIn = checkInToday.length > 0;

        return res.status(200).json({
            status: 'success',
            hasCheckedIn: hasCheckedIn,
            data: hasCheckedIn ? checkInToday[0] : null
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Gagal memeriksa status daily check-in hari ini' });
    }
};