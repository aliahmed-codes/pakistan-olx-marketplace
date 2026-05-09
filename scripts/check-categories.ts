import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const cats = await p.category.findMany({ select: { name: true, icon: true, slug: true, isActive: true } });
  console.log(JSON.stringify(cats, null, 2));
}
main().catch(console.error).finally(() => p.$disconnect());
