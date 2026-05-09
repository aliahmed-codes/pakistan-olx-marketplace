import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/notifications — paginated list for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit  = Math.min(parseInt(searchParams.get('limit')  || '20'), 50);
    const cursor = searchParams.get('cursor') || undefined;

    const notifications = await prisma.notification.findMany({
      where:   { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take:    limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    const hasMore = notifications.length > limit;
    if (hasMore) notifications.pop();
    const nextCursor = hasMore ? notifications[notifications.length - 1]?.id : undefined;

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    });

    return NextResponse.json({ success: true, data: notifications, unreadCount, nextCursor });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PUT /api/notifications — mark as read (all or specific IDs)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const ids: string[] = body.ids || [];

    if (ids.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: ids }, userId: session.user.id },
        data:  { isRead: true, readAt: new Date() },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data:  { isRead: true, readAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
