import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { adSchema, searchSchema } from '@/lib/validations';

// GET /api/ads - Get all ads with search and filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate search params
    const filters = searchSchema.parse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      city: searchParams.get('city') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseInt(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseInt(searchParams.get('maxPrice')!)
        : undefined,
      sortBy: searchParams.get('sortBy') || 'newest',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    });

    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isApproved: true,
    };

    if (filters.search) {
      where.title = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters.category) {
      where.category = {
        slug: filters.category,
      };
    }

    if (filters.city) {
      where.city = {
        equals: filters.city,
        mode: 'insensitive',
      };
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Build order by
    let orderBy: any = {};
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch ads
    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
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
        orderBy: [
          { isFeatured: 'desc' },
          { featuredUntil: 'desc' },
          orderBy,
        ],
        skip,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

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
    console.error('Get ads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

// POST /api/ads - Create a new ad
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is banned
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.isBanned) {
      return NextResponse.json(
        { success: false, error: 'Your account has been banned' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input
    const validatedData = adSchema.parse(body);

    // Create ad
    const ad = await prisma.ad.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        condition: validatedData.condition,
        images: validatedData.images,
        city: validatedData.city,
        area: validatedData.area,
        phone: validatedData.phone,
        userId: session.user.id,
        categoryId: validatedData.categoryId,
        isApproved: false, // Requires admin approval
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            phone: true,
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
    });

    return NextResponse.json(
      {
        success: true,
        data: ad,
        message: 'Ad created successfully! It will be visible after approval.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create ad error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}
