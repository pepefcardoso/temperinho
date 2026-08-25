"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/lib/types/user';

interface UserSessionProviderProps {
    initialUser: User | null;
    children: React.ReactNode;
}

export function UserSessionProvider({ initialUser, children }: UserSessionProviderProps) {
    const { setUser } = useUserStore();

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser, setUser]);

    return <>{children}</>;
}