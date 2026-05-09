import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// PUT /api/admin/categories/[id] — update
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, slug, description, icon, isActive } = await req.json();

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name:        name?.trim()        || undefined,
        slug:        slug?.trim()        || undefined,
        description: description         ?? undefined,
        icon:        icon                ?? undefined,
        isActive:    isActive            ?? undefined,
      },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const count = await prisma.ad.count({ where: { categoryId: params.id } });
    if (count > 0)
      return NextResponse.json(
        { success: false, error: `Cannot delete: ${count} ads use this category` },
        { status: 409 }
      );

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
