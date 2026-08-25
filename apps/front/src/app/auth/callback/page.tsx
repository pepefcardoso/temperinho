'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { setAuthToken } from '@/app/actions/auth';

function AuthCallbackContent() {
    const { fetchUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            if (typeof window !== 'undefined') {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const token = params.get('token');

                if (token) {
                    await setAuthToken(token);
                }
            }

            await fetchUser();
            router.push('/usuario/dashboard');
        };

        handleOAuthCallback();
    }, [router, fetchUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Autenticando, por favor aguarde...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <AuthCallbackContent />
    );
}