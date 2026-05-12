import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// POST /api/ads/[id]/reactivate — owner re-lists an expired ad for admin review
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ad = await prisma.ad.findUnique({ where: { id: params.id } });
    if (!ad) {
      return NextResponse.json({ success: false, error: 'Ad not found' }, { status: 404 });
    }
    if (ad.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Check that the ad is actually expired
    const isExpired = ad.expiresAt && ad.expiresAt < new Date();
    const isOwnerDeactivated = !ad.isActiveAd && !isExpired;
    if (!isExpired && !isOwnerDeactivated) {
      return NextResponse.json(
        { success: false, error: 'Ad is still active and does not need reactivation.' },
        { status: 400 },
      );
    }

    // Reset to PENDING for admin re-approval; expiry will be set on approval
    const updated = await prisma.ad.update({
      where: { id: params.id },
      data: {
        status:     'PENDING',
        isApproved: false,
        isActiveAd: false,
        expiresAt:  null,
      },
    });

    return NextResponse.json({
      success: true,
      data:    updated,
      message: 'Your ad has been submitted for review. It will be re-listed once approved.',
    });
  } catch (error) {
    console.error('Reactivate ad error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reactivate ad' }, { status: 500 });
  }
}
