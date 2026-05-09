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
        OR: [
          { userId: session.user.id },
          { ad: { userId: session.user.id } },
        ],
      },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, content: true, createdAt: true, senderId: true, isSeen: true },
        },
        ad: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            userId: true,           // seller id — needed to determine otherParticipant
            user: {                 // seller profile
              select: { id: true, name: true, profileImage: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Compute otherParticipant correctly for both buyer and seller
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: session.user.id,
            isSeen: false,
          },
        });

        // conv.userId = buyer, conv.ad.userId = seller
        // "other" is whoever the current user is NOT
        const iAmTheBuyer  = conv.userId === session.user.id;
        const otherParticipant = iAmTheBuyer
          ? (conv.ad as any).user   // I'm the buyer, show the seller
          : conv.user;               // I'm the seller, show the buyer

        return {
          id:            conv.id,
          updatedAt:     conv.updatedAt,
          ad: {
            id:     conv.ad.id,
            title:  conv.ad.title,
            images: conv.ad.images,
            price:  Number(conv.ad.price),
            userId: (conv.ad as any).userId,
          },
          user:             otherParticipant,   // always the OTHER user
          lastMessage:      conv.messages[0] ?? null,
          unreadCount,
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

    // Admins cannot start conversations
    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admins cannot initiate conversations' },
        { status: 403 }
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
