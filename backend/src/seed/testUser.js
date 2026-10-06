import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('Netflix123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'sathiyacse1@gmail.com' },
    update: {},
    create: {
      name: 'Sathiya Periyasamy',
      email: 'sathiyacse1@gmail.com',
      phone: '6383035708',
      password: hashedPassword,
    },
  });
  console.log('✅ User successfully created in Amazon RDS PostgreSQL:', user);

  // Add Stranger Things (Movie ID: 101) to Watchlist
  await prisma.watchlist.upsert({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: '101',
      },
    },
    update: {},
    create: {
      userId: user.id,
      movieId: '101',
    },
  });
  console.log('✅ Watchlist item successfully created in Amazon RDS PostgreSQL!');
}

main()
  .catch((err) => {
    console.error('Error creating test data:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
