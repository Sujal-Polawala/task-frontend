'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from './auth';

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);
}
