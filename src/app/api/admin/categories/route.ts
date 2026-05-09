import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/categories — list all (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { ads: true } } },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/categories — create
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, slug, description, icon, isActive } = await req.json();
    if (!name?.trim() || !slug?.trim())
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing)
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });

    const category = await prisma.category.create({
      data: { name: name.trim(), slug: slug.trim(), description: description || null, icon: icon || null, isActive: isActive ?? true },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
