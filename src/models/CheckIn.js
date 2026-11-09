const { randomUUID } = require('crypto');

class CheckIn {
    constructor(baris) {
        this.idCheckIn = baris.id_check_in;
        this.idPelajar = baris.id_pelajar;
        this.tanggalCheckIn = baris.tanggal_check_in;
        this.skalaMood = baris.skala_mood;
        this.jamTidur = baris.jam_tidur;
        this.jamBangun = baris.jam_bangun;
        this.polaMakan = baris.pola_makan;
        this.pemicuStres = baris.pemicu_stres;
        this.catatanRefleksi = baris.catatan_refleksi;
    }

    static createCheckIn(data) {
        return new CheckIn({
            id_check_in: `CHK-${randomUUID()}`,
            id_pelajar: data.idPelajar || null,
            tanggal_check_in: data.tanggalCheckIn,
            skala_mood: data.skalaMood,
            jam_tidur: data.jamTidur,
            jam_bangun: data.jamBangun,
            pola_makan: data.polaMakan,
            pemicu_stres: data.pemicuStres,
            catatan_refleksi: data.catatanRefleksi
        });
    }

    getCheckInData() {
        return {
            idCheckIn: this.idCheckIn,
            tanggalCheckIn: this.tanggalCheckIn,
            skalaMood: this.skalaMood,
            jamTidur: this.jamTidur,
            jamBangun: this.jamBangun,
            polaMakan: this.polaMakan,
            pemicuStres: this.pemicuStres,
            catatanRefleksi: this.catatanRefleksi
        };
    }
}

module.exports = CheckIn;