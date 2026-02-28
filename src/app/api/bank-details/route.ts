import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bank-details - Get active bank details
export async function GET(req: NextRequest) {
  try {
    const bankDetails = await prisma.bankDetails.findFirst({
      where: { isActive: true },
    });

    if (!bankDetails) {
      return NextResponse.json(
        { success: false, error: 'Bank details not found' },
        { status: 404 }
      );
    }

    // Get featured ad price
    const priceConfig = await prisma.siteConfig.findUnique({
      where: { key: 'featured_ad_price' },
    });

    const durationConfig = await prisma.siteConfig.findUnique({
      where: { key: 'featured_ad_duration' },
    });

    return NextResponse.json({
      success: true,
      data: {
        bankDetails,
        featuredAdPrice: priceConfig ? parseFloat(priceConfig.value) : 2000,
        featuredAdDuration: durationConfig ? parseInt(durationConfig.value) : 7,
      },
    });
  } catch (error) {
    console.error('Get bank details error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank details' },
      { status: 500 }
    );
  }
}
