'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getSocialRedirectUrl, Provider } from '@/lib/api/socialAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, Loader2, AtSign } from 'lucide-react';
import { isAxiosError } from 'axios';

interface SocialLoginButtonProps {
    provider: Provider;
    isLoading: boolean;
    onClick: (provider: Provider) => void;
}

function SocialLoginButton({ provider, isLoading, onClick }: SocialLoginButtonProps) {
    const Icon = provider === 'google' ? AtSign : null;
    const label = `Entrar com ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;

    if (!Icon) return null;

    return (
        <Button variant="outline" onClick={() => onClick(provider)} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icon className="mr-2 h-5 w-5" />
            )}
            {label}
        </Button>
    );
}

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState<Provider | null>(null);

    const isAnyLoading = isLoading || !!isSocialLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({ email, password });
            toast.success('Login realizado com sucesso! Redirecionando...');
            router.push('/usuario/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            let errorMessage = 'Email ou senha inválidos. Tente novamente.';
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: Provider) => {
        setIsSocialLoading(provider);
        try {
            const { url } = await getSocialRedirectUrl(provider);
            window.location.href = url;
        } catch (error) {
            console.error('Erro ao iniciar login social:', error);
            toast.error(`Não foi possível iniciar o login com ${provider}.`);
            setIsSocialLoading(null);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-warm-900">
                        Entrar na sua conta
                    </CardTitle>
                    <p className="text-center text-warm-600">
                        Escolha sua forma de login preferida
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <SocialLoginButton
                            provider="google"
                            isLoading={isSocialLoading === 'google'}
                            onClick={handleSocialLogin}
                        />
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Ou continue com
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500 h-4 w-4" />
                                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required disabled={isAnyLoading} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500 h-4 w-4" />
                                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required disabled={isAnyLoading} />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}>
                                    {showPassword ? <EyeOff className="h-4 w-4 text-warm-500" /> : <Eye className="h-4 w-4 text-warm-500" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/auth/esqueceu-senha" className="text-sm text-sage-600 hover:text-sage-700 underline">
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" disabled={isAnyLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Entrar
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-warm-600">
                            Não tem uma conta?{' '}
                            <Link href="/auth/criar-conta" className="text-sage-600 hover:text-sage-700 font-medium underline">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}