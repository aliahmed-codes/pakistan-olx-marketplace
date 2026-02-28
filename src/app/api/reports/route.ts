import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { reportSchema } from '@/lib/validations';

// POST /api/reports - Create a report
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
    const validatedData = reportSchema.parse(body);

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id: validatedData.adId },
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Prevent reporting your own ad
    if (ad.userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot report your own ad' },
        { status: 400 }
      );
    }

    // Check if already reported
    const existingReport = await prisma.report.findFirst({
      where: {
        adId: validatedData.adId,
        reporterId: session.user.id,
        status: 'PENDING',
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { success: false, error: 'You have already reported this ad' },
        { status: 409 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        adId: validatedData.adId,
        reporterId: session.user.id,
        reason: validatedData.reason,
        description: validatedData.description,
        status: 'PENDING',
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: report,
        message: 'Report submitted successfully. Thank you for helping keep our community safe!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create report error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
