'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }) {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // This runs exactly ONCE when the app mounts
        checkAuth();
    }, [checkAuth]);

    return <>{children}</>;
}
