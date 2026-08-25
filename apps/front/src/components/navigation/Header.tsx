'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Menu, User, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { SITE_NAV_LINKS } from '@/lib/config/site';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '../theme/ThemeToggle';

function GlobalSearch() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/receitas?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <label htmlFor="global-search" className="sr-only">
                Buscar por receitas
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            <Input
                type="text"
                id="global-search"
                placeholder="Buscar receitas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-9 bg-muted border-border focus:border-primary focus:ring-primary w-full"
            />
        </form>
    );
}

function UserNav() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image?.url} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/usuario/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/usuario/perfil"><User className="mr-2 h-4 w-4" /><span>Meu Perfil</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/usuario/favoritos/receitas"><Heart className="mr-2 h-4 w-4" /><span>Favoritos</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export default function Header() {
    const pathname = usePathname();
    const { user, loading } = useAuth();

    const isActiveRoute = (href: string) => {
        if (href === '/') return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-display font-bold text-primary hover:text-primary/90 transition-colors">
                            Temperinho
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-1">
                        {SITE_NAV_LINKS.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActiveRoute(item.href)
                                        ? 'text-foreground bg-muted'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center flex-1 max-w-xs mx-8">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <ThemeToggle />

                        {loading ? (
                            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                        ) : user ? (
                            <UserNav />
                        ) : (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/auth/login">
                                    <User className="h-5 w-5 mr-0 sm:mr-2" />
                                    <span className="hidden sm:inline">Entrar</span>
                                </Link>
                            </Button>
                        )}

                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /><span className="sr-only">Abrir menu</span></Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full max-w-sm">
                                    <nav className="flex flex-col h-full">
                                        <div className="px-4 mt-8 mb-6"><GlobalSearch /></div>
                                        <div className="flex flex-col space-y-2 flex-grow">
                                            {SITE_NAV_LINKS.map((item) => (
                                                <SheetClose asChild key={item.label}>
                                                    <Link href={item.href} className={cn("block px-4 py-3 rounded-lg text-base", isActiveRoute(item.href) ? 'text-primary bg-primary/10 font-semibold' : 'text-foreground hover:text-primary hover:bg-muted')}>
                                                        {item.label}
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </div>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};