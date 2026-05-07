import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { featureRequestSchema } from '@/lib/validations';

// GET /api/feature-request — Get current user's feature requests
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page  = parseInt(searchParams.get('page')  || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip  = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.featureRequest.findMany({
        where: { userId: session.user.id },
        include: {
          ad: { select: { id: true, title: true, images: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.featureRequest.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasMore: page < Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get feature requests error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feature requests' }, { status: 500 });
  }
}

// POST /api/feature-request — Submit a feature request for an ad
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = featureRequestSchema.parse(body);

    // Check ad exists and belongs to user
    const ad = await prisma.ad.findUnique({ where: { id: validatedData.adId } });
    if (!ad) return NextResponse.json({ success: false, error: 'Ad not found' }, { status: 404 });
    if (ad.userId !== session.user.id) return NextResponse.json({ success: false, error: 'You can only feature your own ads' }, { status: 403 });
    if (ad.isFeatured && ad.featuredUntil && ad.featuredUntil > new Date()) {
      return NextResponse.json({ success: false, error: 'This ad is already featured' }, { status: 409 });
    }

    // Block duplicate pending requests
    const existing = await prisma.featureRequest.findFirst({
      where: { adId: validatedData.adId, userId: session.user.id, status: 'PENDING' },
    });
    if (existing) return NextResponse.json({ success: false, error: 'You already have a pending feature request for this ad' }, { status: 409 });

    // Get config pricing (fallback to defaults)
    const [priceConfig, durationConfig] = await Promise.all([
      prisma.siteConfig.findUnique({ where: { key: 'featured_ad_price' } }),
      prisma.siteConfig.findUnique({ where: { key: 'featured_ad_duration' } }),
    ]);
    const amount       = priceConfig   ? parseFloat(priceConfig.value)   : 2000;
    const durationDays = durationConfig ? parseInt(durationConfig.value)  : 7;

    const featureRequest = await prisma.featureRequest.create({
      data: {
        adId:            validatedData.adId,
        userId:          session.user.id,
        screenshotImage: validatedData.screenshotImage,
        amount,
        durationDays,
        status: 'PENDING',
      },
      include: { ad: { select: { id: true, title: true, images: true } } },
    });

    return NextResponse.json(
      { success: true, data: featureRequest, message: 'Feature request submitted! Our team will review it within 24 hours.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create feature request error:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid input data', details: error }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to submit feature request' }, { status: 500 });
  }
}
