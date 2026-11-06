const CheckInSchema = {
    id: "INT / UUID (Primary Key)",
    user_id: "INT / UUID (Foreign Key to users table)",
    tanggal: "DATE (YYYY-MM-DD)",
    kondisi_fisik: "STRING (e.g., 'Sehat', 'Sakit')",
    gejala: "TEXT/JSON",
    catatan: "TEXT (opsional)",
    created_at: "TIMESTAMP (default: current timestamp)",
}

module.exports = CheckInSchema;