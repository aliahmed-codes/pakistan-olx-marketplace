import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/chat/conversations - Get user's conversations
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            isSeen: true,
          },
        },
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: session.user.id,
            isSeen: false,
          },
        });

        // Get the other participant
        const otherParticipant = conv.participants.find(
          (p) => p.id !== session.user.id
        );

        return {
          ...conv,
          unreadCount,
          otherParticipant,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/chat/conversations - Create or get conversation
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
    const { participantId, adId } = body;

    if (!participantId) {
      return NextResponse.json(
        { success: false, error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                id: participantId,
              },
            },
          },
        ],
        ...(adId && { adId }),
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
      },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: session.user.id },
              { id: participantId },
            ],
          },
          ...(adId && {
            ad: {
              connect: { id: adId },
            },
          }),
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          ad: {
            select: {
              id: true,
              title: true,
              images: true,
              price: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
