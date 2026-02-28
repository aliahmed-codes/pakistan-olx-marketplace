import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/feature-requests - Get all feature requests (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // 'all', 'pending', 'approved', 'rejected'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status === 'pending') {
      where.status = 'PENDING';
    } else if (status === 'approved') {
      where.status = 'APPROVED';
    } else if (status === 'rejected') {
      where.status = 'REJECTED';
    }

    const [requests, total] = await Promise.all([
      prisma.featureRequest.findMany({
        where,
        include: {
          ad: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.featureRequest.count({ where }),
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
    console.error('Get admin feature requests error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feature requests' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/feature-requests - Approve/reject feature request
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { requestId, status, rejectionReason } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the feature request
    const featureRequest = await prisma.featureRequest.findUnique({
      where: { id: requestId },
    });

    if (!featureRequest) {
      return NextResponse.json(
        { success: false, error: 'Feature request not found' },
        { status: 404 }
      );
    }

    if (featureRequest.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'This request has already been processed' },
        { status: 400 }
      );
    }

    // Update feature request
    const updatedRequest = await prisma.featureRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      include: {
        ad: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If approved, update the ad
    if (status === 'APPROVED') {
      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + featureRequest.durationDays);

      await prisma.ad.update({
        where: { id: featureRequest.adId },
        data: {
          isFeatured: true,
          featuredUntil,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: `Feature request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Update feature request status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update feature request status' },
      { status: 500 }
    );
  }
}
