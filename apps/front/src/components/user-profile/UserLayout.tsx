"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, BookOpen, PlusCircle, Heart, FileText, Menu, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Painel', href: '/usuario/dashboard' },
  { icon: User, label: 'Perfil', href: '/usuario/perfil' },
  { icon: BookOpen, label: 'Minhas Receitas', href: '/usuario/receitas' },
  { icon: PlusCircle, label: 'Nova Receita', href: '/usuario/receitas/nova' },
  { icon: FileText, label: 'Meus Artigos', href: '/usuario/artigos' },
  { icon: PlusCircle, label: 'Novo Artigo', href: '/usuario/artigos/novo' },
  { icon: Heart, label: 'Receitas Favoritas', href: '/usuario/favoritos/receitas' },
  { icon: Heart, label: 'Artigos Favoritos', href: '/usuario/favoritos/artigos' },
  { icon: Building, label: 'Empresa', href: '/usuario/empresa' },
];

function NavigationMenu({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm",
            pathname === item.href
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)]">
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-24 left-4 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 bg-card">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-1">Área do Usuário</h2>
              <p className="text-sm text-muted-foreground">Gerencie seu conteúdo</p>
            </div>
            <NavigationMenu onLinkClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r bg-card">
        <div className="w-full p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-1">Área do Usuário</h2>
            <p className="text-sm text-muted-foreground">Gerencie seu conteúdo</p>
          </div>
          <NavigationMenu />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}