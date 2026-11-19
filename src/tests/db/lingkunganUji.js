// Diarahkan ke basis data uji terpisah agar data pengembangan (DB_NAME) tidak tersentuh.
// Dijalankan sebelum modul aplikasi dimuat; dotenv tidak menimpa variabel yang sudah diisi di sini.
process.env.DB_NAME = process.env.DB_NAME_UJI || 'itbeli_uji';
process.env.DATABASE_URL = '';
