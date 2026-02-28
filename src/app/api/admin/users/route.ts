import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/users - Get all users (admin only)
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
    const status = searchParams.get('status'); // 'all', 'active', 'banned'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status === 'active') {
      where.isBanned = false;
    } else if (status === 'banned') {
      where.isBanned = true;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          role: true,
          isBanned: true,
          createdAt: true,
          _count: {
            select: {
              ads: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Ban/unban user
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
    const { userId, isBanned } = body;

    if (!userId || typeof isBanned !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'User ID and ban status are required' },
        { status: 400 }
      );
    }

    // Prevent banning yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot ban yourself' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
      select: {
        id: true,
        name: true,
        email: true,
        isBanned: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
    });
  } catch (error) {
    console.error('Update user ban status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
