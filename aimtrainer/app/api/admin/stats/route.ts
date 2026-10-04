import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Get comprehensive system statistics
    const [
      totalUsers,
      adminUsers,
      totalScores,
      totalBestScores,
      recentActivity,
      userActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.score.count(),
      prisma.bestScore.count(),
      prisma.score.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      }),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          _count: {
            select: {
              scores: true
            }
          }
        },
        orderBy: {
          scores: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ]);

    // Calculate average games per user
    const avgGamesPerUser = totalUsers > 0 ? (totalScores / totalUsers).toFixed(1) : 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers,
        totalScores,
        totalBestScores,
        recentActivity,
        avgGamesPerUser: parseFloat(avgGamesPerUser.toString())
      },
      topPlayers: userActivity.map(user => ({
        username: user.username,
        gamesPlayed: user._count.scores
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}
