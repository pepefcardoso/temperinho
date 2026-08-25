'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { PostCategory } from '@/types/blog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface BlogFilterControlsProps {
    categories: PostCategory[]
    initialCategoryId?: string
    initialQuery?: string
}

export function BlogFilterControls({
    categories,
    initialCategoryId,
    initialQuery,
}: BlogFilterControlsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(initialQuery || '')

    const updateSearchParam = (key: string, value: string | null) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        if (!value) {
            current.delete(key)
        } else {
            current.set(key, value)
        }

        const search = current.toString()
        const newUrl = search ? `${pathname}?${search}` : pathname
        router.push(newUrl)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateSearchParam('search', query.trim() || null)
    }

    const handleCategoryChange = (categoryId: string) => {
        updateSearchParam('category_id', categoryId === 'todas' ? null : categoryId)
    }

    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-center">
            <form
                onSubmit={handleSearchSubmit}
                className="relative w-full max-w-lg"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    placeholder="Pesquisar artigos por título..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 h-14 rounded-full shadow-md border-2 border-transparent focus:border-primary focus:ring-primary"
                />
            </form>

            <Select
                value={initialCategoryId || 'todas'}
                onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="w-full md:w-[280px] h-14 rounded-full shadow-md border-2 border-transparent focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todas">Todas as Categorias</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}