import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT   = parseInt(process.env.SOCKET_PORT  || '3001', 10);
const SECRET = process.env.SOCKET_SECRET || 'dev-secret-change-in-prod';
const ALLOWED_ORIGINS = process.env.SOCKET_CORS_ORIGIN
  ? process.env.SOCKET_CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

// ── HTTP helper ──────────────────────────────────────────────────────────────
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

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', connections: io?.engine.clientsCount ?? 0 }));
    return;
  }

  if (req.method === 'POST' && req.url === '/emit') {
    if (req.headers['x-socket-secret'] !== SECRET) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden' }));
      return;
    }
    try {
      const { room, event, data } = JSON.parse(await readBody(req)) as {
        room: string; event: string; data: unknown;
      };
      if (!room || !event) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'room and event required' })); return;
      }
      io.to(room).emit(event, data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch {
      res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }

  res.writeHead(404); res.end();
});

// ── Socket.io ────────────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
  pingTimeout:  60000,
  pingInterval: 25000,
});

// userId → socketId map for tracking online users
const userSockets = new Map<string, string>();

async function setOnline(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data:  { isOnline: true, lastSeen: new Date() },
    });
    // Broadcast presence to everyone (conversations will show green dot)
    io.emit('user-online', { userId });
  } catch (e) {
    console.error('[socket] setOnline error:', e);
  }
}

async function setOffline(userId: string) {
  try {
    const now = new Date();
    await prisma.user.update({
      where: { id: userId },
      data:  { isOnline: false, lastSeen: now },
    });
    io.emit('user-offline', { userId, lastSeen: now.toISOString() });
  } catch (e) {
    console.error('[socket] setOffline error:', e);
  }
}

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  let currentUserId: string | null = null;

  // Join user room + mark online
  socket.on('join-user', async (userId: string) => {
    currentUserId = userId;
    userSockets.set(userId, socket.id);
    socket.join(`user:${userId}`);
    await setOnline(userId);
    console.log(`[socket] user ${userId} online`);
  });

  // Join / leave conversation rooms
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
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
      console.error('[socket] message-seen error:', e);
    }
  });

  // Disconnect → mark offline
  socket.on('disconnect', async (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    if (currentUserId) {
      userSockets.delete(currentUserId);
      await setOffline(currentUserId);
    }
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.io server running on http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/health`);
  console.log(`   Emit:    POST http://localhost:${PORT}/emit`);
  console.log(`   Origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
