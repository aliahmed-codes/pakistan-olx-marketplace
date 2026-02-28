import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { featureRequestSchema } from '@/lib/validations';

// GET /api/feature-request - Get user's feature requests
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.featureRequest.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          ad: {
            select: {
              id: true,
              title: true,
              images: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.featureRequest.count({
        where: { userId: session.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Get feature requests error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feature requests' },
      { status: 500 }
    );
  }
}

// POST /api/feature-request - Create a feature request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate input
    const validatedData = featureRequestSchema.parse(body);

    // Check if ad exists and belongs to user
    const ad = await prisma.ad.findUnique({
      where: { id: validatedData.adId },
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    if (ad.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only feature your own ads' },
        { status: 403 }
      );
    }

    // Check if ad is already featured
    if (ad.isFeatured && ad.featuredUntil && ad.featuredUntil > new Date()) {
      return NextResponse.json(
        { success: false, error: 'This ad is already featured' },
        { status: 409 }
      );
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.featureRequest.findFirst({
      where: {
        adId: validatedData.adId,
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending feature request for this ad' },
        { status: 409 }
      );
    }

    // Get featured ad price from config
    const priceConfig = await prisma.siteConfig.findUnique({
      where: { key: 'featured_ad_price' },
    });
    const amount = priceConfig ? parseFloat(priceConfig.value) : 2000;

    const durationConfig = await prisma.siteConfig.findUnique({
      where: { key: 'featured_ad_duration' },
    });
    const durationDays = durationConfig ? parseInt(durationConfig.value) : 7;

    // Create feature request
    const featureRequest = await prisma.featureRequest.create({
      data: {
        adId: validatedData.adId,
        userId: session.user.id,
        screenshotImage: validatedData.screenshotImage,
        amount,
        durationDays,
        status: 'PENDING',
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: featureRequest,
        message: 'Feature request submitted successfully! We will review it shortly.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create feature request error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit feature request' },
      { status: 500 }
    );
  }
}
