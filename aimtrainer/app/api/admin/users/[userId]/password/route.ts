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
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Update the user's password (using plain text as per current auth setup)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });

    return NextResponse.json({
      message: `Password updated successfully for user ${updatedUser.username}`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user password:', error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 500 });
  }
}
