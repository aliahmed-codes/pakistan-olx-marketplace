import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { messageSchema } from '@/lib/validations';
import { getIO } from '@/lib/socket';

// GET /api/chat/messages - Get messages for a conversation
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Check if user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        ad: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const isParticipant =
      conversation.userId === session.user.id ||
      conversation.ad.userId === session.user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({
        where: { conversationId },
      }),
    ]);

    // Mark messages as seen
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        isSeen: false,
      },
      data: {
        isSeen: true,
        seenAt: new Date(),
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Send a message
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

    // Validate input
    const validatedData = messageSchema.parse(body);

    // Check if conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: validatedData.conversationId },
      include: {
        ad: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Determine receiver
    let receiverId: string;
    if (conversation.userId === session.user.id) {
      receiverId = conversation.ad.userId;
    } else if (conversation.ad.userId === session.user.id) {
      receiverId = conversation.userId;
    } else {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        conversationId: validatedData.conversationId,
        senderId: session.user.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: validatedData.conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit socket event for real-time messaging
    const io = getIO();
    if (io) {
      io.to(`conversation:${validatedData.conversationId}`).emit('new-message', message);
      io.to(`user:${receiverId}`).emit('new-notification', {
        type: 'message',
        conversationId: validatedData.conversationId,
        message: message,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
