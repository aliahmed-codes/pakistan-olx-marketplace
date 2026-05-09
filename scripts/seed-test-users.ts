import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const p = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hash(pw, 12);

  const users = [
    { name: 'Ali (Seller)',  email: 'seller@test.pk',  password: await hash('test123456') },
    { name: 'Sara (Buyer)',  email: 'buyer@test.pk',   password: await hash('test123456') },
  ];

  for (const u of users) {
    const existing = await p.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log(`Skipped: ${u.email} already exists`);
    } else {
      await p.user.create({ data: u });
      console.log(`Created: ${u.email}`);
    }
  }
}

main().catch(console.error).finally(() => p.$disconnect());
