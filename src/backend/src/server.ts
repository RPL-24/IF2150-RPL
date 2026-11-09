import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import kontrakRoutes from './routes/kontrakRoutes.js';
import { startAutoCancelWorker } from './workers/autoCancelKontrakWorker.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/kontrak', kontrakRoutes);
app.use('/kontrak', kontrakRoutes);

if (process.env.NODE_ENV !== 'test') {
  startAutoCancelWorker();
  app.listen(port, () => {
    console.log(`[server]: Backend running at http://localhost:${port}`);
  });
}

export default app;
