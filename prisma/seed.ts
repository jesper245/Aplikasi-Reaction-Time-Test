import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function main() {
  // Create or update users with roles
  const jesper = await prisma.user.upsert({
    where: { username: "jesper" },
    update: { role: "USER" },
    create: {
      username: "jesper",
      password: "password",
      role: "USER",
    }
  });

  const stephan = await prisma.user.upsert({
    where: { username: "stephan" },
    update: { role: "USER" },
    create: {
      username: "stephan",
      password: "password",
      role: "USER",
    }
  });

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { role: "ADMIN" },
    create: {
      username: "admin",
      password: "admin123",
      role: "ADMIN",
    }
  });

  console.log("Users created/updated:");
  console.log(`- ${jesper.username}: ${jesper.role}`);
  console.log(`- ${stephan.username}: ${stephan.role}`);
  console.log(`- ${admin.username}: ${admin.role}`);

  // Create some sample scores for testing
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const twoDaysAgo = now - 172800000;

  // Sample scores for Jesper
  await prisma.score.createMany({
    data: [
      {
        gameType: 'AIMTARGET',
        userId: jesper.id,
        startTime: BigInt(twoDaysAgo),
        endTime: BigInt(twoDaysAgo + 8500),
        timeTaken: BigInt(8500), // 8.5 seconds
      },
      {
        gameType: 'AIMTARGET',
        userId: jesper.id,
        startTime: BigInt(oneHourAgo),
        endTime: BigInt(oneHourAgo + 7200),
        timeTaken: BigInt(7200), // 7.2 seconds (best)
      },
      {
        gameType: 'AIMTARGET',
        userId: jesper.id,
        startTime: BigInt(now - 1800000),
        endTime: BigInt(now - 1800000 + 7800),
        timeTaken: BigInt(7800), // 7.8 seconds
      },
    ]
  });

  // Sample scores for Stephan
  await prisma.score.createMany({
    data: [
      {
        gameType: 'AIMTARGET',
        userId: stephan.id,
        startTime: BigInt(twoDaysAgo),
        endTime: BigInt(twoDaysAgo + 9200),
        timeTaken: BigInt(9200), // 9.2 seconds
      },
      {
        gameType: 'AIMTARGET',
        userId: stephan.id,
        startTime: BigInt(oneHourAgo),
        endTime: BigInt(oneHourAgo + 6800),
        timeTaken: BigInt(6800), // 6.8 seconds (best)
      },
    ]
  });

  // Create best scores
  await prisma.bestScore.createMany({
    data: [
      {
        gameType: 'AIMTARGET',
        userId: jesper.id,
        startTime: BigInt(oneHourAgo),
        endTime: BigInt(oneHourAgo + 7200),
        timeTaken: BigInt(7200), // 7.2 seconds
      },
      {
        gameType: 'AIMTARGET',
        userId: stephan.id,
        startTime: BigInt(oneHourAgo),
        endTime: BigInt(oneHourAgo + 6800),
        timeTaken: BigInt(6800), // 6.8 seconds
      },
    ]
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });