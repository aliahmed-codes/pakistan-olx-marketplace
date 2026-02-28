import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/user/recently-viewed - Get user's recently viewed ads
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId: session.user.id },
      include: {
        ad: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: recentlyViewed.map((item) => item.ad),
    });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recently viewed ads' },
      { status: 500 }
    );
  }
}
