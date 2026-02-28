import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/user/stats - Get user statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [totalAds, activeAds, featuredAds, totalViews] = await Promise.all([
      // Total ads
      prisma.ad.count({
        where: { userId: session.user.id },
      }),

      // Active ads (approved)
      prisma.ad.count({
        where: {
          userId: session.user.id,
          isApproved: true,
        },
      }),

      // Featured ads
      prisma.ad.count({
        where: {
          userId: session.user.id,
          isFeatured: true,
          featuredUntil: {
            gt: new Date(),
          },
        },
      }),

      // Total views
      prisma.ad.aggregate({
        where: { userId: session.user.id },
        _sum: { views: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAds,
        activeAds,
        featuredAds,
        totalViews: totalViews._sum.views || 0,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
