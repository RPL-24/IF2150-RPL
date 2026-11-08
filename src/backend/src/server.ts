import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import servicesRoutes from './routes/services.routes';
import { KategoriJasaController } from './controllers/KategoriJasaController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const kategoriJasaController = new KategoriJasaController();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount Route Katalog & Pencarian Jasa
app.use('/api/services', servicesRoutes);

// Alias langsung untuk /api/categories
app.get('/api/categories', kategoriJasaController.getAllCategoriesHandler);
app.get('/api/categories/:id', kategoriJasaController.getCategoryByIdHandler);
app.post('/api/categories', kategoriJasaController.createCategoryAndBindServiceHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Backend running at http://localhost:${port}`);
  });
}

export default app;
