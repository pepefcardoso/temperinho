'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function HeroSearchForm() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const params = new URLSearchParams();
        params.set('search', query.trim());
        router.push(`/receitas?${params.toString()}`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <form onSubmit={handleFormSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busque por 'bolo de chocolate'"
                    className="w-full pl-12 pr-4 py-3 text-lg bg-card/80 backdrop-blur-sm border-border focus:border-primary focus:ring-primary rounded-xl shadow-lg"
                    style={{ height: 'auto' }}
                />
            </form>
        </div>
    );
}