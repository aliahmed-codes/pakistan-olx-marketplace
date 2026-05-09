/**
 * Standalone Socket.io server — runs on port 3001
 *
 * Dev:  npm run dev:socket  (tsx watch socket-server.ts)
 * Prod: npm run start:socket (tsx socket-server.ts)
 *
 * Next.js API routes emit events via HTTP POST /emit
 * Frontend clients connect directly to this server
 */
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT   = parseInt(process.env.SOCKET_PORT  || '3001', 10);
const SECRET = process.env.SOCKET_SECRET || 'dev-secret-change-in-prod';
const ALLOWED_ORIGINS = process.env.SOCKET_CORS_ORIGIN
  ? process.env.SOCKET_CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

// ── HTTP server (also handles the internal /emit endpoint) ──────────────────

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}

const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-socket-secret');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // ── Health check ─────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', connections: io?.engine.clientsCount ?? 0 }));
    return;
  }

  // ── Internal emit endpoint (Next.js API routes call this) ────────────────
  if (req.method === 'POST' && req.url === '/emit') {
    const secret = req.headers['x-socket-secret'];
    if (secret !== SECRET) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return;
    }

    try {
      const body = await readBody(req);
      const { room, event, data } = JSON.parse(body) as {
        room: string; event: string; data: unknown;
      };

      if (!room || !event) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'room and event are required' }));
        return;
      }

      io.to(room).emit(event, data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
    return;
  }

  res.writeHead(404); res.end();
});

// ── Socket.io ───────────────────────────────────────────────────────────────

const io = new SocketIOServer(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
  pingTimeout:  60000,
  pingInterval: 25000,
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // Join user-specific room for private notifications
  socket.on('join-user', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`[socket] user ${userId} joined their room`);
  });

  // Join / leave conversation rooms
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`[socket] joined conversation: ${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Typing indicators
  socket.on('typing', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${conversationId}`).emit('user-typing', { userId });
  });

  socket.on('stop-typing', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${conversationId}`).emit('user-stop-typing', { userId });
  });

  // Seen receipts — persist to DB + broadcast
  socket.on('message-seen', async ({ conversationId, messageId }: {
    conversationId: string; messageId: string;
  }) => {
    try {
      await prisma.message.updateMany({
        where: { id: messageId, isSeen: false },
        data:  { isSeen: true, seenAt: new Date() },
      });
      socket.to(`conversation:${conversationId}`).emit('message-seen', { messageId });
    } catch (e) {
      console.error('[socket] message-seen DB error:', e);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
  });
});

// ── Start ───────────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.io server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Emit:   POST http://localhost:${PORT}/emit`);
  console.log(`   Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
