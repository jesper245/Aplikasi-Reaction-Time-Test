import { auth } from '@/app/auth';
import { prisma } from "@/app/lib/prisma";
import { redirect } from 'next/navigation';

const getUserStats = async (userId: string) => {
  try {
    const [scores, bestScore] = await Promise.all([
      prisma.score.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20, // Show last 20 games
      }),
      prisma.bestScore.findFirst({
        where: {
          userId: userId,
          gameType: 'AIMTARGET',
        },
      }),
    ]);

    return { scores, bestScore };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { scores: [], bestScore: null };
  }
};

export default async function StatsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { scores, bestScore } = await getUserStats(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Stats</h1>

      {/* Best Score Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Personal Best</h2>
        {bestScore ? (
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {(Number(bestScore.timeTaken) / 1000).toFixed(2)}s
            </div>
            <div className="text-sm opacity-90">
              Achieved on {new Date(bestScore.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="text-center text-lg">
            No best score yet. Play the game to set your record!
          </div>
        )}
      </div>

      {/* Recent Games Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Games</h2>

        {scores.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No games played yet. Start playing to see your statistics!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Game #</th>
                  <th className="px-4 py-2 text-left">Time Taken</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Performance</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => {
                  const timeInSeconds = Number(score.timeTaken) / 1000;
                  const bestTimeInSeconds = bestScore ? Number(bestScore.timeTaken) / 1000 : timeInSeconds;
                  const isBest = bestScore && score.timeTaken === bestScore.timeTaken;

                  return (
                    <tr key={score.id} className={`border-b hover:bg-gray-50 ${isBest ? 'bg-yellow-50' : ''}`}>
                      <td className="px-4 py-2 font-medium">
                        {scores.length - index}
                        {isBest && (
                          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Best
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-mono text-lg">
                          {timeInSeconds.toFixed(2)}s
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {new Date(score.createdAt).toLocaleDateString()} {new Date(score.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">
                        {bestScore && (
                          <div className="flex items-center">
                            {timeInSeconds <= bestTimeInSeconds * 1.1 ? (
                              <span className="text-green-600 text-sm">Excellent</span>
                            ) : timeInSeconds <= bestTimeInSeconds * 1.3 ? (
                              <span className="text-yellow-600 text-sm">Good</span>
                            ) : (
                              <span className="text-red-600 text-sm">Need Practice</span>
                            )}
                            <span className="ml-2 text-xs text-gray-500">
                              (+{(timeInSeconds - bestTimeInSeconds).toFixed(2)}s from best)
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {scores.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {scores.length}
            </div>
            <div className="text-gray-600">Total Games</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {(scores.reduce((sum, score) => sum + Number(score.timeTaken), 0) / scores.length / 1000).toFixed(2)}s
            </div>
            <div className="text-gray-600">Average Time</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {scores.length > 1 ? (
                ((Number(scores[0].timeTaken) - Number(scores[scores.length - 1].timeTaken)) / 1000).toFixed(2)
              ) : (
                '0.00'
              )}s
            </div>
            <div className="text-gray-600">Improvement</div>
            <div className="text-xs text-gray-500">
              (Latest vs First)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
