import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/ads/feed - Get personalized feed based on user interests
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let ads;
    let total;

    if (session?.user) {
      // Get user's interests
      const interests = await prisma.userInterest.findMany({
        where: { userId: session.user.id },
        select: { categoryId: true },
      });

      const interestCategoryIds = interests.map((i) => i.categoryId);

      if (interestCategoryIds.length > 0) {
        // Get ads from interested categories
        [ads, total] = await Promise.all([
          prisma.ad.findMany({
            where: {
              status: 'APPROVED',
              isApproved: true,
              categoryId: { in: interestCategoryIds },
            },
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
            orderBy: [
              { isFeatured: 'desc' },
              { createdAt: 'desc' },
            ],
            skip,
            take: limit,
          }),
          prisma.ad.count({
            where: {
              status: 'APPROVED',
              isApproved: true,
              categoryId: { in: interestCategoryIds },
            },
          }),
        ]);
      } else {
        // No interests, show featured and recent ads
        [ads, total] = await Promise.all([
          prisma.ad.findMany({
            where: {
              status: 'APPROVED',
              isApproved: true,
            },
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
            orderBy: [
              { isFeatured: 'desc' },
              { createdAt: 'desc' },
            ],
            skip,
            take: limit,
          }),
          prisma.ad.count({
            where: {
              status: 'APPROVED',
              isApproved: true,
            },
          }),
        ]);
      }
    } else {
      // Not logged in, show featured and recent ads
      [ads, total] = await Promise.all([
        prisma.ad.findMany({
          where: {
            status: 'APPROVED',
            isApproved: true,
          },
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
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' },
          ],
          skip,
          take: limit,
        }),
        prisma.ad.count({
          where: {
            status: 'APPROVED',
            isApproved: true,
          },
        }),
      ]);
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: ads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
