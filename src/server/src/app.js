/**
 * Aplikasi Express (dipisah dari server.js agar bisa diuji dengan supertest).
 * Pemilik: P1.
 */
import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import routes from './routes/index.js';

export function buatApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/uploads', express.static(config.uploadDir, { maxAge: '1h' }));
  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
