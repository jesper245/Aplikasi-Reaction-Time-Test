import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();

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
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}
