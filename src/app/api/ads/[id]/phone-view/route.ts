import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/ads/[id]/phone-view - Track phone number view
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { conversationId } = await req.json();

    // Don't count if viewer is the owner
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    if (ad.userId === session.user.id) {
      return NextResponse.json({ success: true, data: { selfView: true } });
    }

    // Track phone view
    await prisma.phoneView.create({
      data: {
        adId: params.id,
        userId: session.user.id,
        conversationId: conversationId || null,
      },
    });

    // Increment leads count on the ad
    await prisma.ad.update({
      where: { id: params.id },
      data: { leads: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track phone view error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track phone view' },
      { status: 500 }
    );
  }
}
