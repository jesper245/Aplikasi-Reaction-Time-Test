import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/app/auth';
import { AlertProvider } from "@/app/context/AlertContext";
import GlobalAlerts from "@/app/components/GlobalAlerts";

import { Navbar } from "./navbar";

export const metadata: Metadata = {
  title: "reaction time test",
  description: "...",
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || "light";
  const session = await auth();

  return (
    <>
      <Navbar
        theme={theme}
        isLoggedIn={session != null}
        userRole={session?.user?.role}
      />
      <AlertProvider>
        <GlobalAlerts />
        {children}
      </AlertProvider>
    </>
  );
}
