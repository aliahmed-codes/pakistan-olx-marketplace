import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './prisma';

let io: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return io;
}

export function initSocket(server: NetServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // ── Join user room for private notifications ─────────────────────────────
    socket.on('join-user', (userId: string) => {
      socket.join(`user:${userId}`);
    });

    // ── Join / leave conversation rooms ──────────────────────────────────────
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // ── Typing indicators ────────────────────────────────────────────────────
    socket.on('typing', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', { userId });
    });

    socket.on('stop-typing', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user-stop-typing', { userId });
    });

    // ── Seen receipts — persist to DB + broadcast ────────────────────────────
    socket.on('message-seen', async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      try {
        // Persist seen status in the database
        await prisma.message.updateMany({
          where: { id: messageId, isSeen: false },
          data: { isSeen: true, seenAt: new Date() },
        });
        // Broadcast to conversation room so sender sees ✓✓
        socket.to(`conversation:${conversationId}`).emit('message-seen', { messageId });
      } catch (e) {
        console.error('message-seen DB error:', e);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
