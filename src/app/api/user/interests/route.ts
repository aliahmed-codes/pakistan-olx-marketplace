import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const interestSchema = z.object({
  categoryId: z.string(),
});

// GET /api/user/interests - Get user's interests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const interests = await prisma.userInterest.findMany({
      where: { userId: session.user.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: interests.map((i) => i.category),
    });
  } catch (error) {
    console.error('Get interests error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

// POST /api/user/interests - Add an interest
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
    const { categoryId } = interestSchema.parse(body);

    await prisma.userInterest.upsert({
      where: {
        userId_categoryId: {
          userId: session.user.id,
          categoryId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        categoryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add interest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add interest' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/interests - Remove an interest
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await prisma.userInterest.deleteMany({
      where: {
        userId: session.user.id,
        categoryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove interest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove interest' },
      { status: 500 }
    );
  }
}
