import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ads/featured - Get featured ads
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    const ads = await prisma.ad.findMany({
      where: {
        isApproved: true,
        isFeatured: true,
        featuredUntil: {
          gt: new Date(),
        },
      },
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
            slug: true,
          },
        },
      },
      orderBy: {
        featuredUntil: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error('Get featured ads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured ads' },
      { status: 500 }
    );
  }
}
