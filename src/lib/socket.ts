/**
 * Server-side socket helper — used by Next.js API routes to emit events
 * to the standalone Socket.io server via its internal HTTP /emit endpoint.
 *
 * The socket server runs on SOCKET_SERVER_URL (default: http://localhost:3001)
 * This module never holds a socket connection itself — it is stateless.
 */

const SOCKET_SERVER  = process.env.SOCKET_SERVER_URL  || 'http://localhost:3001';
const SOCKET_SECRET  = process.env.SOCKET_SECRET      || 'dev-secret-change-in-prod';

/**
 * Emit a Socket.io event to a specific room.
 * Called from Next.js API routes (server-side only).
 *
 * @param room  - Socket.io room name, e.g. `user:abc123` or `conversation:xyz`
 * @param event - Event name, e.g. `new-message`, `new-notification`
 * @param data  - Payload to send
 */
export async function emitToRoom(
  room: string,
  event: string,
  data: unknown,
): Promise<void> {
  try {
    const res = await fetch(`${SOCKET_SERVER}/emit`, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-socket-secret': SOCKET_SECRET,
      },
      body: JSON.stringify({ room, event, data }),
      // Short timeout so a dead socket server never blocks API responses
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn(`[socket] emit failed (${res.status}):`, text);
    }
  } catch (err) {
    // Non-fatal — the API response should still succeed even if socket is down
    console.warn('[socket] emit error (socket server unreachable?):', (err as Error).message);
  }
}
