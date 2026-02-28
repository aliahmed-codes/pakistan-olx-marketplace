import { NextRequest } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET(req: NextRequest) {
  if ((req as any).socket?.server?.io) {
    return new Response('Socket.IO already running', { status: 200 });
  }

  const res = await fetch(`${req.nextUrl.origin}/api/socket/init`);
  return res;
}
