const TenagaKesehatan = require('../models/TenagaKesehatan');
const FasilitasKesehatan = require('../models/FasilitasKesehatan');

class TenagaKesehatanController {
    
    // Memuat daftar tenaga kesehatan lengkap dengan fasilitas (Q-C20-01)
    async loadTenagaKesehatan(req, res) {
        try {
            const { spesialisasi, search } = req.query;
            
            let listNakes = await TenagaKesehatan.findSemuaDenganFasilitas();
            const listFasilitas = await FasilitasKesehatan.findAll();

            if (spesialisasi) {
                listNakes = listNakes.filter(n => n.jenis_tenaga_kesehatan === spesialisasi);
            }
            if (search) {
                const keyword = search.toLowerCase();
                listNakes = listNakes.filter(n => 
                    (n.nama && n.nama.toLowerCase().includes(keyword)) ||
                    (n.nama_fasilitas && n.nama_fasilitas.toLowerCase().includes(keyword)) ||
                    (n.lokasi_kerja && n.lokasi_kerja.toLowerCase().includes(keyword))
                );
            }

            return res.status(200).json({
                status: 'success',
                daftarTenagaKesehatan: listNakes,
                daftarFasilitas: listFasilitas
            });
        } catch (error) {
            console.error('Error loadTenagaKesehatan:', error);
            return res.status(500).json({ status: 'error', message: 'Gagal memuat data tenaga kesehatan.' });
        }
    }

    // Memproses izin lokasi dan menghitung jarak (jika disetujui)
    async processLocationPermission(req, res) {
        try {
            const { izinLokasi, latitude, longitude } = req.body;
            let listNakes = await TenagaKesehatan.findSemuaDenganFasilitas();

            if (izinLokasi && latitude !== undefined && longitude !== undefined) {
                listNakes = listNakes.map(nakes => {
                    let jarakKm = 0;

                    if (nakes.lokasi && nakes.lokasi.includes(',')) {
                        const [nLat, nLng] = nakes.lokasi.split(',').map(Number);
                        jarakKm = this.calculateHaversineDistance(latitude, longitude, nLat, nLng);
                    }
                    return { ...nakes, jarakKm: parseFloat(jarakKm.toFixed(1)) };
                }).sort((a, b) => a.jarakKm - b.jarakKm);
            }

            return res.status(200).json({
                status: 'success',
                izinLokasi: Boolean(izinLokasi),
                data: listNakes
            });
        } catch (error) {
            console.error('Error processLocationPermission:', error);
            return res.status(500).json({ status: 'error', message: 'Gagal memproses izin lokasi.' });
        }
    }

    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
    }

    // Mengambil detail spesifik nakes (Q-C20-02 & Algo-C04-04)
    async selectTenagaKesehatan(req, res) {
        try {
            const { id } = req.params;
            const detailNakes = await TenagaKesehatan.findDetailDenganFasilitas(id);
            
            if (!detailNakes) {
                return res.status(404).json({ status: 'error', message: 'Tenaga kesehatan tidak ditemukan.' });
            }

            const nasehatObj = await TenagaKesehatan.findById(id);
            const jadwalTersedia = nasehatObj ? await nasehatObj.getJadwalTersedia() : [];

            return res.status(200).json({
                status: 'success',
                data: detailNakes,
                jadwalTersedia: jadwalTersedia,
                profilDetail: nasehatObj ? nasehatObj.getProfil() : null
            });
        } catch (error) {
            console.error('Error selectTenagaKesehatan:', error);
            return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail tenaga kesehatan.' });
        }
    }
}

module.exports = new TenagaKesehatanController();