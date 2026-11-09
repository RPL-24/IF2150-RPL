import http from 'http';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { KomunikasiController } from './controllers/KomunikasiController';
import { NotifikasiController, RealtimeEmitter } from './controllers/NotifikasiController';
import { createChatsRouter } from './routes/chats.routes';
import { createNotificationsRouter } from './routes/notifications.routes';

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

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const httpServer = http.createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    const userId =
      (socket.handshake.auth?.userId as string | undefined) ??
      (socket.handshake.query?.userId as string | undefined);

    if (userId && typeof userId === 'string' && userId.trim().length > 0) {
      socket.join(`user:${userId.trim()}`);
    }

    socket.on('join:user', (targetUserId: string) => {
      if (targetUserId && typeof targetUserId === 'string' && targetUserId.trim().length > 0) {
        socket.join(`user:${targetUserId.trim()}`);
      }
    });
  });

  const realtimeEmitter = new SocketIORealtimeEmitter(io);
  const notifikasiController = new NotifikasiController(
    undefined,
    undefined,
    realtimeEmitter
  );
  const komunikasiController = new KomunikasiController(
    undefined,
    notifikasiController,
    realtimeEmitter
  );

  app.use('/api/chats', createChatsRouter(komunikasiController));
  app.use('/api/notifications', createNotificationsRouter(notifikasiController));

  return {
    app,
    httpServer,
    io,
    komunikasiController,
    notifikasiController,
  };
}

const { app, httpServer, io } = createApp();

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[CariUang Express + Socket.IO Server] Running on http://0.0.0.0:${PORT}`);
  });
}

export { app, httpServer, io };
export default app;