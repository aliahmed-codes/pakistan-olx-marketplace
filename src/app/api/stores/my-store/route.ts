import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/stores/my-store - Get current user's store
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { ownerId: session.user.id },
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
        ads: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            category: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found", hasStore: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      store: {
        ...store,
        totalAds: store._count.ads,
      },
      hasStore: true,
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}
