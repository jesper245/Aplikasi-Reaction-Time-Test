import { auth } from "@/app/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Check if the user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If not authenticated, redirect to login
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If authenticated but not admin, redirect to home or show unauthorized
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match admin routes
    "/admin/:path*",
  ]
}
