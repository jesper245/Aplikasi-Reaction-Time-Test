import { Session } from 'next-auth';
import { BestScore, User } from '@prisma/client'

import { auth } from '@/app/auth';
import { prisma } from "@/app/lib/prisma";

import AimTrainerBox from './AimTrainer';
import Leaderboards from './Leaderboard';

const getLeaderboards = async () => {
  try {
    const bestScores = await prisma.bestScore.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        {
          timeTaken: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
      take: 10,
    })

    return bestScores
  } catch (error) {
    return [];
  }
}

export default async function IndexPage() {
  const session = await auth();
  const leaderboards: (BestScore & {
    user: {
      username: string;
    };
  })[] = await getLeaderboards();

  const saveScore = async (session: Session, startTime: number, endTime: number) => {
    'use server';

    const timeTaken = endTime - startTime;

    return prisma.$transaction(async (prisma) => {
      await prisma.score.create({
        data: {
          gameType: 'AIMTARGET',
          userId: session.user.id,
          startTime,
          endTime,
          timeTaken: timeTaken,
        }
      })

      const userBestScore = await prisma.bestScore.findFirst({
        where: {
          gameType: 'AIMTARGET',
          userId: session.user.id,
        }
      })

      if (userBestScore == null) {
        // set new best score
        await prisma.bestScore.create({
          data: {
            gameType: 'AIMTARGET',
            userId: session.user.id,
            startTime,
            endTime,
            timeTaken: timeTaken,
          }
        })
        return;
      }

      // update best score
      if (timeTaken < userBestScore.timeTaken) {
        await prisma.bestScore.update({
          where: {
            id: userBestScore.id,
          },
          data: {
            startTime,
            endTime,
            timeTaken: timeTaken,
          }
        })
      }
    })
  }

  return (
    <>
      <AimTrainerBox session={session} saveScore={saveScore} />
      <Leaderboards leaderboards={leaderboards} />
    </>
  );
}