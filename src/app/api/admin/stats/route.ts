import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/stats - Get admin dashboard stats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [
      totalUsers,
      totalAds,
      pendingAds,
      featuredAds,
      pendingFeatureRequests,
      totalReports,
      recentUsers,
      recentAds,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total ads
      prisma.ad.count(),

      // Pending ads
      prisma.ad.count({
        where: { isApproved: false, status: 'PENDING' },
      }),

      // Featured ads
      prisma.ad.count({
        where: {
          isFeatured: true,
          featuredUntil: { gt: new Date() },
        },
      }),

      // Pending feature requests
      prisma.featureRequest.count({
        where: { status: 'PENDING' },
      }),

      // Total reports
      prisma.report.count({
        where: { status: 'PENDING' },
      }),

      // Recent users
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          createdAt: true,
          role: true,
        },
      }),

      // Recent ads
      prisma.ad.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalAds,
        pendingAds,
        featuredAds,
        pendingFeatureRequests,
        totalReports,
        recentUsers,
        recentAds,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
