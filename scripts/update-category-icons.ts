import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const EMOJI_MAP: Record<string, string> = {
  'mobiles':    '📱',
  'vehicles':   '🚗',
  'bikes':      '🏍',
  'property':   '🏠',
  'electronics':'💻',
  'jobs':       '💼',
  'services':   '🔧',
  'furniture':  '🛋',
  'fashion':    '👗',
  'books-sports': '📚',
  'kids':       '🧸',
  'animals':    '🐕',
  'business':   '🏭',
};

async function main() {
  for (const [slug, emoji] of Object.entries(EMOJI_MAP)) {
    const result = await p.category.updateMany({
      where: { slug },
      data: { icon: emoji },
    });
    console.log(`Updated ${slug} → ${emoji} (${result.count} row)`);
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => p.$disconnect());
