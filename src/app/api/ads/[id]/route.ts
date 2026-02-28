import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { adSchema } from '@/lib/validations';

// GET /api/ads/[id] - Get a single ad
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            phone: true,
            createdAt: true,
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

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Check if ad is approved or user is the owner/admin
    const isOwner = session?.user?.id === ad.userId;
    const isAdmin = session?.user?.role === 'ADMIN';

    if (!ad.isApproved && !isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Increment views
    if (!isOwner) {
      await prisma.ad.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    // Get related ads
    const relatedAds = await prisma.ad.findMany({
      where: {
        categoryId: ad.categoryId,
        isApproved: true,
        id: { not: id },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: { ad, relatedAds },
    });
  } catch (error) {
    console.error('Get ad error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ad' },
      { status: 500 }
    );
  }
}

// PUT /api/ads/[id] - Update an ad
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingAd = await prisma.ad.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    const isOwner = session.user.id === existingAd.userId;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input
    const validatedData = adSchema.parse(body);

    // Update ad
    const updatedAd = await prisma.ad.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        condition: validatedData.condition,
        images: validatedData.images,
        city: validatedData.city,
        area: validatedData.area,
        phone: validatedData.phone,
        categoryId: validatedData.categoryId,
        // Reset approval if not admin
        ...(isAdmin
          ? {}
          : {
              isApproved: false,
              status: 'PENDING',
            }),
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
    });

    return NextResponse.json({
      success: true,
      data: updatedAd,
      message: isAdmin
        ? 'Ad updated successfully!'
        : 'Ad updated successfully! It will be visible after approval.',
    });
  } catch (error) {
    console.error('Update ad error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update ad' },
      { status: 500 }
    );
  }
}

// DELETE /api/ads/[id] - Delete an ad
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingAd = await prisma.ad.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    const isOwner = session.user.id === existingAd.userId;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete ad
    await prisma.ad.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully!',
    });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ad' },
      { status: 500 }
    );
  }
}
