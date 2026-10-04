import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from "@/app/lib/prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      id: "username-creds",
      name: 'Username Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // validate credentials must be filled
        if (!credentials.username || !credentials.password) {
          return null;
        }

        // Check if the user exists in the database
        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
          select: {
            id: true,
            username: true,
            password: true,
            role: true,
          },
        });

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            username: user.username,
            role: user.role
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object is available (during sign-in)
      if (user) {
        // token.username = user.username;
        token.user = {
          id: user.id || "",
          username: user.username,
          role: user.role,
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.user.id,
          username: token.user.username,
          role: token.user.role,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
});