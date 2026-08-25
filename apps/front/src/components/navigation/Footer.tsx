'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SITE_NAV_LINKS, SOCIAL_LINKS, LEGAL_LINKS, SocialLink, NavItem } from '@/lib/config/site';
import { isAxiosError } from 'axios';
import { subscribeToNewsletter } from '@/lib/api/customer';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            await subscribeToNewsletter(email);

            setStatus('success');
            setMessage('Inscrição realizada com sucesso!');
            setEmail('');
        } catch (error) {
            setStatus('error');
            if (isAxiosError(error) && error.response) {
                setMessage(error.response.data.message || 'Ocorreu um erro ao se inscrever.');
            } else if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('Um erro inesperado ocorreu.');
            }
        }
    };

    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <h3 className="text-2xl font-display font-bold text-background mb-4">Temperinho</h3>
                        </Link>
                        <p className="text-muted-foreground mb-6 leading-relaxed">Conectando pessoas através da culinária inclusiva.</p>
                        <div className="flex space-x-2">
                            {SOCIAL_LINKS.map((link: SocialLink) => (
                                <Link key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={link.label}>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-background hover:bg-background/20">
                                        <link.icon className="h-5 w-5" />
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-background">Navegação</h4>
                        <ul className="space-y-3">
                            {SITE_NAV_LINKS.map((link: NavItem) => (
                                <li key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-background transition-colors">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-background">Newsletter</h4>
                        <p className="text-muted-foreground mb-4 text-sm">Receba receitas e dicas exclusivas no seu email.</p>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu melhor email"
                                required
                                disabled={status === 'loading'}
                                className="bg-background/20 border-background/30 text-background placeholder:text-muted-foreground/80 pr-12 h-11"
                            />
                            <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-background/20 hover:text-background" disabled={status === 'loading'}>
                                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </form>
                        <div aria-live="polite" className="mt-2 text-sm h-5">
                            {status === 'success' && (
                                <p className="text-green-400 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2" /> {message}
                                </p>
                            )}
                            {status === 'error' && <p className="text-red-400">{message}</p>}
                        </div>
                        <p className="text-muted-foreground mt-3 text-xs">
                            Ao se inscrever, você concorda com nossa{' '}
                            <Link href="/privacidade" className="underline hover:text-background transition-colors">
                                Política de Privacidade
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-background/20 mt-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        © {currentYear} Temperinho. Todos os direitos reservados.
                    </p>
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        Desenvolvido por{' '}
                        <Link
                            href="https://wa.me/5548991155026?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Pedro%20Sistemas."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-background transition-colors font-semibold"
                        >
                            Pedro Sistemas
                        </Link>
                    </p>
                    <div className="flex items-center text-muted-foreground text-sm mb-4 md:mb-0">
                        <span>Feito com</span>
                        <Heart className="h-4 w-4 mx-1.5 text-red-500" fill="currentColor" />
                        <span>para uma cozinha mais inclusiva</span>
                    </div>
                    <div className="flex space-x-6 text-muted-foreground text-sm">
                        {LEGAL_LINKS.map((link: NavItem) => (
                            <Link key={link.href} href={link.href} className="hover:text-background transition-colors">{link.label}</Link>
                        ))}
                        <a
                            href="#"
                            className="cky-banner-revisit hover:text-background transition-colors"
                        >
                            Gerenciar Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};