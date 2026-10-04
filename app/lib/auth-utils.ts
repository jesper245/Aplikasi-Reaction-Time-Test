import { auth } from "@/app/auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === "ADMIN"
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    throw new Error("Admin privileges required")
  }
  return user
}
