// src/app/(pages)/layout.jsx
'use client';
import AuthGuard from '@/app/components/AuthGuard';

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
