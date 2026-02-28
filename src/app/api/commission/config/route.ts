import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/commission/config - Get commission configuration
export async function GET() {
  try {
    const enabled = await prisma.siteConfig.findUnique({
      where: { key: "commission_enabled" },
    });

    const percentage = await prisma.siteConfig.findUnique({
      where: { key: "commission_percentage" },
    });

    return NextResponse.json({
      enabled: enabled?.value === "true",
      percentage: parseFloat(percentage?.value || "2"),
    });
  } catch (error) {
    console.error("Error fetching commission config:", error);
    return NextResponse.json(
      { error: "Failed to fetch commission configuration" },
      { status: 500 }
    );
  }
}

// PUT /api/commission/config - Update commission configuration (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enabled, percentage } = await request.json();

    // Update or create commission enabled setting
    await prisma.siteConfig.upsert({
      where: { key: "commission_enabled" },
      update: { value: enabled.toString() },
      create: {
        key: "commission_enabled",
        value: enabled.toString(),
        description: "Enable/disable commission feature",
      },
    });

    // Update or create commission percentage setting
    await prisma.siteConfig.upsert({
      where: { key: "commission_percentage" },
      update: { value: percentage.toString() },
      create: {
        key: "commission_percentage",
        value: percentage.toString(),
        description: "Commission percentage for sold items",
      },
    });

    return NextResponse.json({
      message: "Commission configuration updated successfully",
      enabled,
      percentage,
    });
  } catch (error) {
    console.error("Error updating commission config:", error);
    return NextResponse.json(
      { error: "Failed to update commission configuration" },
      { status: 500 }
    );
  }
}
