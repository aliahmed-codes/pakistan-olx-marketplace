import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const storeSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
});

// GET /api/stores - Get all stores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const verified = searchParams.get("verified");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {
      isActive: true,
    };

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (verified === "true") {
      where.isVerified = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              ads: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.store.count({ where }),
    ]);

    return NextResponse.json({
      stores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

// POST /api/stores - Create a new store
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "You already have a store. You can only create one store." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = storeSchema.parse(body);

    // Generate slug from store name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingSlug = await prisma.store.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "A store with this name already exists" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        ...validatedData,
        slug,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Store created successfully", store },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating store:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
