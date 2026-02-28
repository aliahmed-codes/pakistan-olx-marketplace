import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/reports - Get all reports (admin only)
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
    const status = searchParams.get('status'); // 'all', 'pending', 'resolved', 'dismissed'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status === 'pending') {
      where.status = 'PENDING';
    } else if (status === 'resolved') {
      where.status = 'RESOLVED';
    } else if (status === 'dismissed') {
      where.status = 'DISMISSED';
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
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
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Get admin reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/reports - Resolve/dismiss report
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
    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { success: false, error: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    if (!['RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `Report ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Update report status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report status' },
      { status: 500 }
    );
  }
}
