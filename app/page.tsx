'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (
        user.role === 'super_admin' ||
        user.role === 'hr_admin' ||
        user.role === 'payroll_admin'
      ) {
        router.push('/admin');
      } else {
        router.push('/ess');
      }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">QuantumHR</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
