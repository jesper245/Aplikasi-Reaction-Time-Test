import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { userId } = await params;

    // Get user details with all their game activity
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        scores: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            gameType: true,
            timeTaken: true,
            createdAt: true,
          }
        },
        bestScores: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            gameType: true,
            timeTaken: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            scores: true,
            bestScores: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate statistics
    const totalGames = user.scores.length;
    const averageTime = totalGames > 0 ?
      user.scores.reduce((sum, score) => sum + Number(score.timeTaken), 0) / totalGames / 1000 : 0;

    const bestTime = user.bestScores.length > 0 ?
      Math.min(...user.bestScores.map(score => Number(score.timeTaken))) / 1000 : null;

    // Convert BigInt values to numbers for JSON serialization
    const serializedUser = {
      ...user,
      scores: user.scores.map(score => ({
        ...score,
        timeTaken: Number(score.timeTaken)
      })),
      bestScores: user.bestScores.map(score => ({
        ...score,
        timeTaken: Number(score.timeTaken)
      })),
      stats: {
        totalGames,
        averageTime: Number(averageTime.toFixed(2)),
        bestTime: bestTime ? Number(bestTime.toFixed(2)) : null,
      }
    };

    return NextResponse.json(serializedUser);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}
