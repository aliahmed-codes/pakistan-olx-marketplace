import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/ads/[id]/sold - Mark ad as sold
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Only ad owner or admin can mark as sold
    if (ad.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if commission is enabled
    const commissionConfig = await prisma.siteConfig.findUnique({
      where: { key: "commission_enabled" },
    });

    const commissionPercentage = await prisma.siteConfig.findUnique({
      where: { key: "commission_percentage" },
    });

    const isCommissionEnabled = commissionConfig?.value === "true";
    const percentage = parseFloat(commissionPercentage?.value || "2");

    // Calculate commission amount
    const commissionAmount = isCommissionEnabled
      ? (ad.price.toNumber() * percentage) / 100
      : 0;

    // Update ad as sold
    const updatedAd = await prisma.ad.update({
      where: { id: params.id },
      data: {
        isSold: true,
        soldAt: new Date(),
        commissionAmount: commissionAmount,
        commissionPaid: !isCommissionEnabled, // If commission disabled, mark as paid
      },
    });

    return NextResponse.json({
      message: "Ad marked as sold successfully",
      ad: updatedAd,
      commissionAmount,
      commissionRequired: isCommissionEnabled && commissionAmount > 0,
    });
  } catch (error) {
    console.error("Error marking ad as sold:", error);
    return NextResponse.json(
      { error: "Failed to mark ad as sold" },
      { status: 500 }
    );
  }
}
