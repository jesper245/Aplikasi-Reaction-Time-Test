import { redirect } from 'next/navigation';

import { auth } from '@/app/auth';
import LoginCard from './LoginCard';

export default async function LoginPage() {
  const session = await auth();

  if (session != null) {
    return redirect('/');
  }

  return (
    <>
      <LoginCard />
    </>
  )
}