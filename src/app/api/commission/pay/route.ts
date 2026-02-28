import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/commission/pay - Pay commission for a sold ad
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adId, transactionId, bankName, accountName } = await request.json();

    if (!adId || !transactionId) {
      return NextResponse.json(
        { error: "Ad ID and transaction ID are required" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Only ad owner can pay commission
    if (ad.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!ad.isSold) {
      return NextResponse.json(
        { error: "Ad must be marked as sold before paying commission" },
        { status: 400 }
      );
    }

    if (ad.commissionPaid) {
      return NextResponse.json(
        { error: "Commission already paid for this ad" },
        { status: 400 }
      );
    }

    // Store payment proof in site config temporarily (admin will verify)
    const paymentProofKey = `commission_payment_${adId}`;
    await prisma.siteConfig.upsert({
      where: { key: paymentProofKey },
      update: {
        value: JSON.stringify({
          transactionId,
          bankName,
          accountName,
          paidAt: new Date().toISOString(),
          amount: ad.commissionAmount?.toString(),
          status: "PENDING_VERIFICATION",
        }),
      },
      create: {
        key: paymentProofKey,
        value: JSON.stringify({
          transactionId,
          bankName,
          accountName,
          paidAt: new Date().toISOString(),
          amount: ad.commissionAmount?.toString(),
          status: "PENDING_VERIFICATION",
        }),
        description: `Commission payment proof for ad ${adId}`,
      },
    });

    return NextResponse.json({
      message:
        "Commission payment submitted successfully. Waiting for admin verification.",
      adId,
      commissionAmount: ad.commissionAmount,
    });
  } catch (error) {
    console.error("Error processing commission payment:", error);
    return NextResponse.json(
      { error: "Failed to process commission payment" },
      { status: 500 }
    );
  }
}
