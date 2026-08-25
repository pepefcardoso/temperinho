'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { UserProfileForm } from '@/components/user-profile/UserProfileForm';
import type { User } from '@/types/user';

interface UserProfileClientProps {
    user: User | null;
}

export function UserProfileClient({ user }: UserProfileClientProps) {
    useEffect(() => {
        document.title = 'Meu Perfil | Temperinho';
    }, []);

    if (!user) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">Não foi possível carregar seu perfil.</h2>
                <p className="text-muted-foreground">
                    Por favor, <Link href="/auth/login" className="text-primary underline">faça o login</Link> novamente.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <UserProfileForm user={user} />
        </div>
    );
}