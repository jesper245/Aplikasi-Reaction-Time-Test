import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [scores, bestScore] = await Promise.all([
      prisma.score.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      }),
      prisma.bestScore.findFirst({
        where: {
          userId: session.user.id,
          gameType: 'AIMTARGET',
        },
      }),
    ]);

    // Calculate some statistics
    const totalGames = scores.length;
    const averageTime = totalGames > 0 ?
      scores.reduce((sum, score) => sum + Number(score.timeTaken), 0) / totalGames / 1000 : 0;

    const improvement = totalGames > 1 ?
      (Number(scores[scores.length - 1].timeTaken) - Number(scores[0].timeTaken)) / 1000 : 0;

    // Convert BigInt values to numbers for JSON serialization
    const serializedScores = scores.map(score => ({
      ...score,
      timeTaken: Number(score.timeTaken)
    }));

    const serializedBestScore = bestScore ? {
      ...bestScore,
      timeTaken: Number(bestScore.timeTaken)
    } : null;

    return NextResponse.json({
      scores: serializedScores,
      bestScore: serializedBestScore,
      stats: {
        totalGames,
        averageTime: Number(averageTime.toFixed(2)),
        improvement: Number(improvement.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
