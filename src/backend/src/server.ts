import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { KomunikasiController } from './controllers/KomunikasiController';
import { NotifikasiController, RealtimeEmitter } from './controllers/NotifikasiController';
import authRouter from './routes/auth.routes';
import { createChatsRouter } from './routes/chats.routes';
import { createNotificationsRouter } from './routes/notifications.routes';
import usersRouter from './routes/user.routes';

dotenv.config();

export class SocketIORealtimeEmitter implements RealtimeEmitter {
  constructor(private readonly io: SocketIOServer) {}

  public emitToUser(idPengguna: string, event: string, payload: unknown): void {
    this.io.to(`user:${idPengguna}`).emit(event, payload);
  }
}

export function createApp(): {
  app: Application;
  httpServer: http.Server;
  io: SocketIOServer;
  komunikasiController: KomunikasiController;
  notifikasiController: NotifikasiController;
} {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] },
    transports: ['websocket', 'polling'],
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  io.on('connection', (socket) => {
    const userId =
      (socket.handshake.auth?.userId as string | undefined) ??
      (socket.handshake.query?.userId as string | undefined);
    if (userId && typeof userId === 'string' && userId.trim()) {
      socket.join(`user:${userId.trim()}`);
    }
    socket.on('join:user', (targetUserId: string) => {
      if (targetUserId && typeof targetUserId === 'string' && targetUserId.trim()) {
        socket.join(`user:${targetUserId.trim()}`);
      }
    });
  });

  const realtimeEmitter = new SocketIORealtimeEmitter(io);
  const notifikasiController = new NotifikasiController(undefined, undefined, realtimeEmitter);
  const komunikasiController = new KomunikasiController(
    undefined,
    notifikasiController,
    realtimeEmitter
  );

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/chats', createChatsRouter(komunikasiController));
  app.use('/api/notifications', createNotificationsRouter(notifikasiController));

  return { app, httpServer, io, komunikasiController, notifikasiController };
}

const { app, httpServer, io } = createApp();

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[CariUang Express + Socket.IO Server] Running on http://localhost:${port}`);
  });
}

export { app, httpServer, io };
export default app;
