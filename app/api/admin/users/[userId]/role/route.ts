import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { prisma } from '@/app/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { userId } = await params;
    const { role } = await request.json();

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be USER or ADMIN' },
        { status: 400 }
      );
    }

    // Prevent admins from demoting themselves
    if (userId === admin.id && role === 'USER') {
      return NextResponse.json(
        { error: 'You cannot demote yourself from admin role' },
        { status: 400 }
      );
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });

    return NextResponse.json({
      message: `Role updated successfully for user ${updatedUser.username}`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 500 });
  }
}
