/**
 * Pakistan Market — Seed Script
 * Creates 5 test users with realistic profiles + 20 dummy ads across categories
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  { name: 'Ali Ahmed',    email: 'ali@pm.test',    phone: '03001234567', password: 'Test1234!', role: 'USER'  as const },
  { name: 'Sara Khan',    email: 'sara@pm.test',   phone: '03111234567', password: 'Test1234!', role: 'USER'  as const },
  { name: 'Hassan Raza',  email: 'hassan@pm.test', phone: '03211234567', password: 'Test1234!', role: 'USER'  as const },
  { name: 'Ayesha Malik', email: 'ayesha@pm.test', phone: '03311234567', password: 'Test1234!', role: 'USER'  as const },
  { name: 'Usman Tariq',  email: 'usman@pm.test',  phone: '03451234567', password: 'Test1234!', role: 'USER'  as const },
  { name: 'Admin User',   email: 'admin@pm.test',  phone: '03001112222', password: 'Admin1234!',role: 'ADMIN' as const },
];

const IMAGE_SETS: Record<string, string[]> = {
  mobiles:     ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600'],
  cars:        ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600'],
  bikes:       ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600'],
  property:    ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'],
  electronics: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
  furniture:   ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'],
  jobs:        ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600'],
  fashion:     ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'],
};

async function main() {
  console.log('🌱 Seeding Pakistan Market database...\n');

  // 1. Create users
  const createdUsers: { id: string; phone: string | null }[] = [];
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone },
      create: { name: u.name, email: u.email, phone: u.phone, password: hash, role: u.role, emailVerified: new Date() },
    });
    createdUsers.push(user);
    console.log(`  ✅ ${u.role} | ${user.name} | ${u.email} | ${u.password}`);
  }

  // 2. Get categories
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  if (!categories.length) { console.log('\n  ⚠️ No categories found. Add categories first.'); return; }
  console.log(`\n  Found ${categories.length} categories\n`);

  const catMap: Record<string, string> = {};
  categories.forEach((c) => { catMap[c.slug] = c.id; });
  const getCatId = (...slugs: string[]) => { for (const s of slugs) if (catMap[s]) return catMap[s]; return categories[0].id; };

  // 3. Create ads
  type AdSeed = { title: string; description: string; price: number; condition: 'NEW' | 'USED'; categorySlug: string[]; images: string[]; city: string; userIdx: number };
  const ADS: AdSeed[] = [
    { title: 'iPhone 15 Pro Max 256GB Natural Titanium Excellent Condition', description: 'Brand new iPhone 15 Pro Max only 2 months used. Original box charger and EarPods. No scratches always kept in case. Battery health 99%. Serious buyers only.', price: 320000, condition: 'USED', categorySlug: ['mobiles','mobile-phones'], images: IMAGE_SETS.mobiles, city: 'Lahore', userIdx: 0 },
    { title: 'Samsung Galaxy S24 Ultra 512GB Phantom Black', description: 'Samsung S24 Ultra 512GB. Snapdragon 8 Gen 3. 6 months warranty remaining. S-Pen and original accessories. Perfect working condition.', price: 280000, condition: 'USED', categorySlug: ['mobiles','mobile-phones'], images: IMAGE_SETS.mobiles, city: 'Karachi', userIdx: 1 },
    { title: 'Xiaomi Redmi Note 13 Pro 8GB 256GB Brand New Sealed', description: 'Xiaomi Redmi Note 13 Pro sealed box. 200MP camera 5000mAh battery 67W fast charging. 1 year official warranty. Cash on delivery available.', price: 65000, condition: 'NEW', categorySlug: ['mobiles','mobile-phones'], images: IMAGE_SETS.mobiles, city: 'Islamabad', userIdx: 2 },
    { title: 'OnePlus 12 16GB 512GB PTA Approved 3 Months Used', description: 'OnePlus 12 with Hasselblad camera. Snapdragon 8 Gen 3 50W wireless charging. PTA approved. All accessories included.', price: 195000, condition: 'USED', categorySlug: ['mobiles','mobile-phones'], images: IMAGE_SETS.mobiles, city: 'Rawalpindi', userIdx: 3 },
    { title: 'Toyota Corolla GLi 2020 1300cc Silver Low Mileage', description: 'Toyota Corolla GLi 2020. Automatic transmission. Original paint no accident history. 42000 km. Power windows ABS airbags. Lahore registered.', price: 4200000, condition: 'USED', categorySlug: ['cars','vehicles'], images: IMAGE_SETS.cars, city: 'Lahore', userIdx: 0 },
    { title: 'Honda Civic 2022 Oriel 1.5 Turbo White 25000 km', description: 'Honda Civic Oriel 2022. 1.5 turbo engine CVT automatic. Honda Sensing safety. Honda Connect infotainment. First owner.', price: 7800000, condition: 'USED', categorySlug: ['cars','vehicles'], images: IMAGE_SETS.cars, city: 'Karachi', userIdx: 1 },
    { title: 'Suzuki Alto AGS 2023 660cc Auto Company Fitted CNG', description: 'Suzuki Alto AGS 2023. 660cc auto gearshift. Company-fitted CNG. First owner 8000 km only. Islamabad registered.', price: 2900000, condition: 'USED', categorySlug: ['cars','vehicles'], images: IMAGE_SETS.cars, city: 'Islamabad', userIdx: 2 },
    { title: 'Honda CB150F 2023 150cc Red Brand New Condition', description: 'Honda CB150F 2023. Electric start only 1200 km. Original tyres no modifications. Original documents.', price: 290000, condition: 'USED', categorySlug: ['bikes','motorcycles'], images: IMAGE_SETS.bikes, city: 'Lahore', userIdx: 4 },
    { title: 'Yamaha YBR125G 2022 Off-Road Blue 18000 km', description: 'Yamaha YBR125G trail bike. 4-stroke 125cc excellent performance. Clean engine no issues.', price: 165000, condition: 'USED', categorySlug: ['bikes','motorcycles'], images: IMAGE_SETS.bikes, city: 'Faisalabad', userIdx: 4 },
    { title: '5 Marla House for Sale DHA Phase 5 Lahore Corner Plot', description: '5 marla house in DHA Phase 5. Ground floor 2 bedrooms drawing room kitchen. First floor 2 bedrooms TV lounge. Fully tiled gas available.', price: 28000000, condition: 'NEW', categorySlug: ['property','property-for-sale'], images: IMAGE_SETS.property, city: 'Lahore', userIdx: 0 },
    { title: '10 Marla Plot Bahria Town Phase 8 Rawalpindi', description: 'Residential plot in Bahria Town Phase 8. 10 marla category street. All utilities available near commercial area.', price: 9500000, condition: 'NEW', categorySlug: ['property','property-for-sale'], images: IMAGE_SETS.property, city: 'Rawalpindi', userIdx: 3 },
    { title: 'Sony Bravia 55 inch 4K OLED Smart TV 3 Months Used', description: 'Sony Bravia XR 55" OLED. Android TV Google TV. Dolby Vision Dolby Atmos. HDMI 2.1 ports. Perfect condition.', price: 280000, condition: 'USED', categorySlug: ['electronics','electronics-home-appliances'], images: IMAGE_SETS.electronics, city: 'Karachi', userIdx: 1 },
    { title: 'MacBook Pro M3 Pro 14 inch 18GB 512GB Space Black 2024', description: 'Apple MacBook Pro 14" M3 Pro chip. 18GB unified memory 512GB SSD. Space Black. Battery cycles 45. Mint condition.', price: 580000, condition: 'USED', categorySlug: ['electronics','electronics-home-appliances'], images: IMAGE_SETS.electronics, city: 'Islamabad', userIdx: 2 },
    { title: 'Haier 1.5 Ton Inverter AC DC Cool Series Brand New Sealed', description: 'Haier 1.5 ton DC inverter AC 2024. Turbo cool self-cleaning WiFi control. 1 year brand warranty. Factory sealed.', price: 145000, condition: 'NEW', categorySlug: ['electronics','electronics-home-appliances'], images: IMAGE_SETS.electronics, city: 'Lahore', userIdx: 0 },
    { title: '7 Seater L-Shape Sofa Set Velvet Brown Slightly Used', description: 'Premium 7-seater L-shape sofa. Chocolate brown velvet. Original foam cushions 6 months old. Moving house must sell.', price: 85000, condition: 'USED', categorySlug: ['furniture','home-appliances-furniture'], images: IMAGE_SETS.furniture, city: 'Lahore', userIdx: 0 },
    { title: 'King Size Bed Set with Wardrobe and Dressing Sheesham Wood', description: 'Complete king bedroom set in sheesham wood. King bed side tables wardrobe 5 doors dressing table. Excellent quality.', price: 135000, condition: 'USED', categorySlug: ['furniture','home-appliances-furniture'], images: IMAGE_SETS.furniture, city: 'Karachi', userIdx: 1 },
    { title: 'Web Developer Needed React Next.js Full Time Lahore Office', description: 'Looking for experienced React.js Next.js developer. 2 plus years experience required. Competitive salary. Gulberg III Lahore.', price: 80000, condition: 'NEW', categorySlug: ['jobs','job-vacancies'], images: IMAGE_SETS.jobs, city: 'Lahore', userIdx: 3 },
    { title: 'Khaadi Winter Collection 2023 Unstitched 3-Piece Suit', description: 'Original Khaadi winter unstitched 3-piece suit. Beautiful embroidery never worn in original bag.', price: 8500, condition: 'NEW', categorySlug: ['fashion','clothing-fashion'], images: IMAGE_SETS.fashion, city: 'Islamabad', userIdx: 2 },
    { title: 'Mens Genuine Leather Jacket Medium Size Black Biker Style', description: 'Genuine cowhide leather jacket medium size. Classic biker style very warm. Purchased from Anarkali Lahore used twice.', price: 15000, condition: 'USED', categorySlug: ['fashion','clothing-fashion'], images: IMAGE_SETS.fashion, city: 'Lahore', userIdx: 4 },
    { title: 'Dell XPS 15 Laptop i7 13th Gen 32GB 1TB OLED Display', description: 'Dell XPS 15 with Intel i7 13th gen 32GB RAM 1TB NVMe SSD. OLED 3.5K display. NVIDIA RTX 4060. Perfect for developers and designers.', price: 520000, condition: 'USED', categorySlug: ['electronics','electronics-home-appliances'], images: IMAGE_SETS.electronics, city: 'Karachi', userIdx: 1 },
  ];

  let count = 0;
  for (const ad of ADS) {
    const user = createdUsers[ad.userIdx];
    const featured = count % 4 === 0; // every 4th ad is featured
    await prisma.ad.create({
      data: {
        title: ad.title, description: ad.description, price: ad.price,
        condition: ad.condition, images: ad.images, city: ad.city,
        phone: user.phone || '03001234567',
        isApproved: true, isFeatured: featured,
        featuredUntil: featured ? new Date(Date.now() + 7 * 864e5) : null,
        views: Math.floor(Math.random() * 500) + 10,
        userId: user.id, categoryId: getCatId(...ad.categorySlug),
      },
    });
    count++;
    console.log(`  ✅ Ad ${count}: ${ad.title.substring(0, 50)}...`);
  }

  console.log(`\n🎉 Done! Created ${USERS.length} users and ${count} ads.\n`);
  console.log('── Login Credentials ──────────────────────────────');
  USERS.forEach((u) => console.log(`  ${u.role.padEnd(5)} | ${u.email.padEnd(20)} | ${u.password}`));
  console.log('───────────────────────────────────────────────────\n');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
