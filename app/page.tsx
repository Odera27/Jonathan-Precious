'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      const redirectPath = role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/student';
      router.push(redirectPath);
    }
  }, [isAuthenticated, role, router]);

  return null;
}
