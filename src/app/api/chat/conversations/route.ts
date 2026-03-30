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

      },
      include: {
        user: {
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
        const otherParticipant = [conv.user].find(
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


    if (!adId) {
      return NextResponse.json(
        { success: false, error: 'Ad ID is required' },
        { status: 400 }
      );
    }

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Prevent user from messaging themselves
    if (ad.userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot message yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        adId_userId: {
          adId,
          userId: session.user.id,
        },
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists',
      });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        adId,
        userId: session.user.id,
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: conversation,
        message: 'Conversation created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
