import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ads/latest - Get latest ads
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '12');

    const ads = await prisma.ad.findMany({
      where: {
        isApproved: true,
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
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error('Get latest ads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch latest ads' },
      { status: 500 }
    );
  }
}
