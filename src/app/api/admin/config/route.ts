import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/admin/config - Get site configuration
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const configs = await prisma.siteConfig.findMany();

    const configMap: Record<string, string> = {};
    configs.forEach((c) => {
      configMap[c.key] = c.value;
    });

    return NextResponse.json({
      success: true,
      data: {
        featuredAdPrice: parseFloat(configMap.featured_ad_price || '2000'),
        featuredAdDuration: parseInt(configMap.featured_ad_duration || '7'),
        commissionEnabled: configMap.commission_enabled === 'true',
        commissionPercentage: parseFloat(configMap.commission_percentage || '2'),
      },
    });
  } catch (error) {
    console.error('Get config error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/config - Update site configuration
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Update configs
    const updates = [];

    if (body.featuredAdPrice !== undefined) {
      updates.push(
        prisma.siteConfig.upsert({
          where: { key: 'featured_ad_price' },
          update: { value: body.featuredAdPrice.toString() },
          create: {
            key: 'featured_ad_price',
            value: body.featuredAdPrice.toString(),
            description: 'Price for featuring an ad in PKR',
          },
        })
      );
    }

    if (body.featuredAdDuration !== undefined) {
      updates.push(
        prisma.siteConfig.upsert({
          where: { key: 'featured_ad_duration' },
          update: { value: body.featuredAdDuration.toString() },
          create: {
            key: 'featured_ad_duration',
            value: body.featuredAdDuration.toString(),
            description: 'Duration of featured ad in days',
          },
        })
      );
    }

    if (body.commissionEnabled !== undefined) {
      updates.push(
        prisma.siteConfig.upsert({
          where: { key: 'commission_enabled' },
          update: { value: body.commissionEnabled.toString() },
          create: {
            key: 'commission_enabled',
            value: body.commissionEnabled.toString(),
            description: 'Whether commission feature is enabled',
          },
        })
      );
    }

    if (body.commissionPercentage !== undefined) {
      updates.push(
        prisma.siteConfig.upsert({
          where: { key: 'commission_percentage' },
          update: { value: body.commissionPercentage.toString() },
          create: {
            key: 'commission_percentage',
            value: body.commissionPercentage.toString(),
            description: 'Commission percentage for sold items',
          },
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
    });
  } catch (error) {
    console.error('Update config error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
