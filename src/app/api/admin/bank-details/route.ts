import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { bankDetailsSchema } from '@/lib/validations';

// PUT /api/admin/bank-details - Update bank details
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

    // Validate input
    const validatedData = bankDetailsSchema.parse(body);

    // Update or create bank details
    const existingBank = await prisma.bankDetails.findFirst({
      where: { isActive: true },
    });

    let bankDetails;
    if (existingBank) {
      bankDetails = await prisma.bankDetails.update({
        where: { id: existingBank.id },
        data: validatedData,
      });
    } else {
      bankDetails = await prisma.bankDetails.create({
        data: validatedData,
      });
    }

    return NextResponse.json({
      success: true,
      data: bankDetails,
      message: 'Bank details updated successfully',
    });
  } catch (error) {
    console.error('Update bank details error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update bank details' },
      { status: 500 }
    );
  }
}
