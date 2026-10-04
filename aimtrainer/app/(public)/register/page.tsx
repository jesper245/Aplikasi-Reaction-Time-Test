import { redirect } from 'next/navigation';

import { auth } from '@/app/auth';
import { prisma } from "@/app/lib/prisma";

import RegisterCardPage from "./RegisterCard"

export default async function RegisterPage() {
  const session = await auth();

  const doRegister = async (username: string, password: string) => {
    'use server';

    try {
      const createdUser = await prisma.user.create({
        data: {
          username,
          password,
        }
      })

      return { success: true, message: "User registered successfully!" };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, message: "Registration failed. Please try again." };
    }
  }

  if (session != null) {
    return redirect('/');
  }

  return (
    <>
      <RegisterCardPage onSubmit={doRegister} />
    </>
  )
}