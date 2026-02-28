import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeCount = searchParams.get('includeCount') === 'true';

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: includeCount
        ? {
            _count: {
              select: { ads: { where: { isApproved: true } } },
            },
          }
        : undefined,
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
