'use client'

import Link from 'next/link'
import { Search, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FavoriteRecipeCard } from './FavoriteRecipeCard'
import { Button } from '../ui/button'
import type { Recipe } from '@/types/recipe'
import { getRecipeCategories } from '@/lib/api/recipe'
import { useFilterableList } from '@/hooks/useFilterableList'

interface UserFavoritesClientProps {
    initialRecipes: Recipe[]
}

export function UserFavoritesRecipesClient({
    initialRecipes,
}: UserFavoritesClientProps) {
    const {
        items: recipes,
        categories,
        isLoadingCategories,
        searchParams,
        debouncedSearch,
        handleFilterChange,
        removeItemById,
    } = useFilterableList<Recipe>({
        initialItems: initialRecipes,
        fetchCategories: getRecipeCategories,
    })

    const handleRecipeRemove = (removedRecipeId: number) => {
        removeItemById(removedRecipeId)
    }

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar nos seus favoritos..."
                                defaultValue={searchParams.get('search') || ''}
                                onChange={(e) => debouncedSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="sm:w-56">
                            {isLoadingCategories ? (
                                <Skeleton className="h-10 w-full" />
                            ) : (
                                <Select
                                    defaultValue={searchParams.get('category_id') || 'todas'}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            'category_id',
                                            value === 'todas' ? null : value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas as Categorias</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 mt-6">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <FavoriteRecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onRemove={() => handleRecipeRemove(recipe.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">
                            Nenhuma receita encontrada
                        </h3>
                        <p className="text-muted-foreground mt-2 mb-6">
                            {searchParams.get('search') || searchParams.get('category_id')
                                ? 'Tente ajustar seus filtros de busca.'
                                : 'Explore nossas receitas e salve as que você mais ama.'}
                        </p>
                        <Button asChild>
                            <Link href="/receitas">Explorar Receitas</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}