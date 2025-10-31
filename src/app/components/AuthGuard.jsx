// src/components/AuthGuard.jsx
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth() ;
  } , [checkAuth]);
  
  return <>{children}</>;
}
