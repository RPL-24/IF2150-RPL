import { Router } from 'express';
import { KategoriJasaController } from '../controllers/KategoriJasaController';
import { PemberiJasaController } from '../controllers/PemberiJasaController';

const router = Router();

const pemberiJasaController = new PemberiJasaController();
const kategoriJasaController = new KategoriJasaController(undefined, pemberiJasaController);

/**
 * Endpoint Katalog Kategori Jasa (C13 & C15)
 * - GET  /api/services/categories      -> Daftar seluruh kategori terurut alfabetis (Q-015)
 * - GET  /api/services/categories/:id  -> Detail kategori berdasarkan ID
 * - POST /api/services/categories      -> Simpan kategori baru & kaitkan ke pemberi jasa (Q-014 & Q-004)
 * - POST /api/services/register        -> Alias pendaftaran layanan penyedia jasa (UC01)
 */
router.get('/categories', kategoriJasaController.getAllCategoriesHandler);
router.get('/categories/:id', kategoriJasaController.getCategoryByIdHandler);
router.post('/categories', kategoriJasaController.createCategoryAndBindServiceHandler);
router.post('/register', kategoriJasaController.createCategoryAndBindServiceHandler);

/**
 * Endpoint Pencarian & Filter Terdekat Haversine (UC02, KNF05)
 * - GET /api/services/search?q=...&kategoriId=...&lat=...&long=...&sortBy=nearest|rating|cheapest
 */
router.get('/search', pemberiJasaController.searchServicesHandler);

/**
 * Endpoint Daftar Pemberi Jasa berdasarkan Kategori (ALGO-003 / Q-003)
 * - GET /api/services/category/:kategoriId
 */
router.get('/category/:kategoriId', pemberiJasaController.getServicesByCategoryHandler);

/**
 * Endpoint Detail Profil Pemberi Jasa (ALGO-002 / Q-002)
 * - GET /api/services/:id
 * (Diletakkan paling bawah agar tidak menangkap path statis seperti /search atau /categories)
 */
router.get('/:id', pemberiJasaController.getServiceByIdHandler);

export default router;