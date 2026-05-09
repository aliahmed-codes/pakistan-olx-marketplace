import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeCount = searchParams.get('includeCount') === 'true';
    const showAll      = searchParams.get('all') === 'true';

    const categories = await prisma.category.findMany({
      where: showAll ? undefined : { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { ads: includeCount ? { where: { isApproved: true } } : true } },
      },
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
