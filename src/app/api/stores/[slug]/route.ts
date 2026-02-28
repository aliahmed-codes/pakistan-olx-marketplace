import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const storeUpdateSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters").optional(),
  description: z.string().optional(),
  phone: z.string().min(10, "Valid phone number is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "City is required").optional(),
  area: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
});

// GET /api/stores/[slug] - Get store by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
        ads: {
          where: {
            isApproved: true,
            status: "APPROVED",
          },
          include: {
            category: true,
            subCategory: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            ads: {
              where: {
                isApproved: true,
                status: "APPROVED",
              },
            },
            storeFollowers: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({
      store: {
        ...store,
        totalAds: store._count.ads,
      },
      pagination: {
        page,
        limit,
        total: store._count.ads,
        pages: Math.ceil(store._count.ads / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

// PUT /api/stores/[slug] - Update store
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Only store owner or admin can update
    if (store.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = storeUpdateSchema.parse(body);

    // If name is being updated, regenerate slug
    let slug = store.slug;
    if (validatedData.name && validatedData.name !== store.name) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const existingSlug = await prisma.store.findUnique({
        where: { slug },
      });

      if (existingSlug && existingSlug.id !== store.id) {
        return NextResponse.json(
          { error: "A store with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedStore = await prisma.store.update({
      where: { slug: params.slug },
      data: {
        ...validatedData,
        slug,
      },
    });

    return NextResponse.json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

// DELETE /api/stores/[slug] - Delete store
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Only store owner or admin can delete
    if (store.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.store.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
