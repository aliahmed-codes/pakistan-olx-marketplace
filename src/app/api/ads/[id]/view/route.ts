import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/ads/[id]/view - Track ad view
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Don't count views from the ad owner
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

    // Don't count if viewer is the owner
    if (userId && ad.userId === userId) {
      return NextResponse.json({ success: true, data: { selfView: true } });
    }

    // Increment view count
    await prisma.ad.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    // Track detailed view if user is logged in
    if (userId) {
      // Check if already viewed recently (within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const existingView = await prisma.adView.findFirst({
        where: {
          adId: params.id,
          userId,
          createdAt: { gte: oneHourAgo },
        },
      });

      if (!existingView) {
        await prisma.adView.create({
          data: {
            adId: params.id,
            userId,
          },
        });
      }

      // Update or create recently viewed
      await prisma.recentlyViewed.upsert({
        where: {
          adId_userId: {
            adId: params.id,
            userId,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          adId: params.id,
          userId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
