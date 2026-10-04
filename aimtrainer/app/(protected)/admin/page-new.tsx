import { requireAdmin } from "@/app/lib/auth-utils"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import AdminDashboard from "./AdminDashboard"

export default async function IndexAdmin() {
  try {
    const user = await requireAdmin()

    // Fetch all users for admin to manage
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        _count: {
          select: {
            scores: true,
            bestScores: true,
          }
        }
      },
      orderBy: {
        username: 'asc'
      }
    })

    // Get additional stats for dashboard
    const totalScores = await prisma.score.count()
    const totalBestScores = await prisma.bestScore.count()
    const recentActivity = await prisma.score.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    return (
      <AdminDashboard
        user={user}
        users={users}
        stats={{
          totalUsers: users.length,
          adminUsers: users.filter(u => u.role === 'ADMIN').length,
          regularUsers: users.filter(u => u.role === 'USER').length,
          totalScores,
          totalBestScores,
          recentActivity
        }}
      />
    )
  } catch (error) {
    redirect("/")
  }
}
