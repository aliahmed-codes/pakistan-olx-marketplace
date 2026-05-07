import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ads/search - Search and filter ads
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const condition = searchParams.get('condition') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isApproved: true,
    };

    // Full-text search on title and description
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by category id or slug
    if (category) {
      where.category = {
        OR: [{ id: category }, { slug: category }],
      };
    }

    // Filter by city
    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    // Filter by condition (NEW / USED)
    if (condition === 'NEW' || condition === 'USED') {
      where.condition = condition;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Filter featured ads only
    if (featured) {
      where.isFeatured = true;
      where.featuredUntil = { gt: new Date() };
    }

    // Build order by
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'most_viewed':
        orderBy = { views: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, profileImage: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, orderBy],
        skip,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Convert Decimal price to number for JSON serialization
    const serializedAds = ads.map((ad) => ({
      ...ad,
      price: Number(ad.price),
      commissionAmount: ad.commissionAmount ? Number(ad.commissionAmount) : null,
    }));

    return NextResponse.json({
      success: true,
      data: serializedAds,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Search ads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search ads' },
      { status: 500 }
    );
  }
}
