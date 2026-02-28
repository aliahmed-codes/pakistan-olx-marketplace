import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/stores/[id]/follow - Follow a store
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }

    // Can't follow your own store
    if (store.ownerId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow your own store' },
        { status: 400 }
      );
    }

    // Create follow relationship
    await prisma.storeFollower.upsert({
      where: {
        storeId_userId: {
          storeId: params.id,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        storeId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Follow store error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to follow store' },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/[id]/follow - Unfollow a store
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.storeFollower.deleteMany({
      where: {
        storeId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unfollow store error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unfollow store' },
      { status: 500 }
    );
  }
}

// GET /api/stores/[id]/follow - Check if user follows a store
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const follow = await prisma.storeFollower.findUnique({
      where: {
        storeId_userId: {
          storeId: params.id,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { isFollowing: !!follow },
    });
  } catch (error) {
    console.error('Check follow status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check follow status' },
      { status: 500 }
    );
  }
}
