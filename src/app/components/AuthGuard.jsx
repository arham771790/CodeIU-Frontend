// src/components/AuthGuard.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isCheckingAuth, router]);

  if (isCheckingAuth) return <div className="min-h-screen" />; // or your skeleton
  if (!isAuthenticated) return null;

  return children;
}
