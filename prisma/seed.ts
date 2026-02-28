import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { categories } from '../src/lib/categories';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.pk';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const adminName = process.env.ADMIN_NAME || 'System Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        phone: '+92-300-1234567',
        isBanned: false,
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('ℹ️ Admin user already exists:', existingAdmin.email);
  }

  // Create categories and sub-categories
  console.log('\n📁 Creating categories and sub-categories...');
  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    let categoryId: string;
    if (!existingCategory) {
      const createdCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          isActive: true,
        },
      });
      categoryId = createdCategory.id;
      console.log(`  ✅ Created category: ${category.name}`);
    } else {
      categoryId = existingCategory.id;
      console.log(`  ℹ️ Exists: ${category.name}`);
    }

    // Create sub-categories
    for (const subCategory of category.subCategories) {
      const existingSubCategory = await prisma.subCategory.findFirst({
        where: {
          slug: subCategory.slug,
          categoryId: categoryId,
        },
      });

      if (!existingSubCategory) {
        await prisma.subCategory.create({
          data: {
            name: subCategory.name,
            slug: subCategory.slug,
            categoryId: categoryId,
            isActive: true,
          },
        });
        console.log(`    ✅ Created sub-category: ${subCategory.name}`);
      } else {
        console.log(`    ℹ️ Exists: ${subCategory.name}`);
      }
    }
  }

  // Create default bank details
  const existingBank = await prisma.bankDetails.findFirst({
    where: { isActive: true },
  });

  if (!existingBank) {
    await prisma.bankDetails.create({
      data: {
        bankName: 'Habib Bank Limited (HBL)',
        accountTitle: 'Pakistan Marketplace Pvt Ltd',
        accountNumber: '12345678901',
        iban: 'PK36HABB000012345678901',
        branchCode: '0123',
        isActive: true,
      },
    });
    console.log('\n✅ Default bank details created');
  } else {
    console.log('\nℹ️ Bank details already exist');
  }

  // Create site config
  const configs = [
    { key: 'featured_ad_price', value: '2000', description: 'Price for featuring an ad in PKR' },
    { key: 'featured_ad_duration', value: '7', description: 'Duration of featured ad in days' },
    { key: 'max_images_per_ad', value: '8', description: 'Maximum number of images per ad' },
    { key: 'max_ad_title_length', value: '70', description: 'Maximum characters for ad title' },
    { key: 'contact_email', value: 'support@marketplace.pk', description: 'Contact email for support' },
    { key: 'contact_phone', value: '+92-300-1234567', description: 'Contact phone number' },
    { key: 'commission_enabled', value: 'false', description: 'Whether commission feature is enabled' },
    { key: 'commission_percentage', value: '2', description: 'Commission percentage for sold items' },
  ];

  console.log('\n⚙️ Creating site configurations...');
  for (const config of configs) {
    const existing = await prisma.siteConfig.findUnique({
      where: { key: config.key },
    });

    if (!existing) {
      await prisma.siteConfig.create({
        data: config,
      });
      console.log(`  ✅ Created: ${config.key}`);
    } else {
      console.log(`  ℹ️ Exists: ${config.key}`);
    }
  }

  console.log('\n✨ Database seed completed successfully!');
  console.log('\n📋 Default Admin Credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('\n⚠️  Please change the default admin password after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
