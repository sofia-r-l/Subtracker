import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  await prisma.subscription.createMany({
    data: [
      {
        name: 'Spotify',
        price: 9.99,
        currency: 'USD',
        frequency: 'monthly',
        payment_date: new Date('2025-12-01'),
      },
      {
        name: 'Netflix',
        price: 15.99,
        currency: 'USD',
        frequency: 'monthly',
        payment_date: new Date('2025-12-05'),
      },
      {
        name: 'Microsoft 365',
        price: 99.99,
        currency: 'USD',
        frequency: 'yearly',
        payment_date: new Date('2026-03-12'),
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
