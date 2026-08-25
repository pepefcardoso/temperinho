'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { type Recipe, type RecipeDifficulty, RecipeDifficultyLabels } from '@/types/recipe';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toggleFavoriteRecipe } from '@/lib/api/user';

const difficultyStyles: Record<RecipeDifficulty, string> = {
    1: 'text-primary',
    2: 'text-primary',
    3: 'text-amber-500',
    4: 'text-destructive',
    5: 'text-destructive',
};

interface FavoriteRecipeCardProps {
    recipe: Recipe;
    onRemove: (id: number) => void;
}

export function FavoriteRecipeCard({ recipe, onRemove }: FavoriteRecipeCardProps) {
    const handleRemoveFavorite = async () => {
        toast.loading("Removendo favorito...");
        try {
            await toggleFavoriteRecipe(recipe.id);
            toast.dismiss();
            toast.success("Receita removida dos favoritos!");
            onRemove(recipe.id);
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao remover o favorito. Tente novamente.");
            console.error(error);
        }
    }

    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={recipe.image?.url ?? '/images/placeholder.svg'}
                        alt={recipe.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div>
                        <Badge variant="secondary" className="mb-2">{recipe.category?.name ?? 'Receita'}</Badge>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{recipe.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{recipe.description}</p>
                    </div>
                    <div className="flex items-center flex-wrap text-xs text-muted-foreground gap-x-4 gap-y-2 mt-auto pt-3 border-t">
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.time} min</div>
                        <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {recipe.portion} porções</div>
                        {recipe.difficulty && (
                            <div className={cn("font-medium", difficultyStyles[recipe.difficulty as RecipeDifficulty])}>
                                {RecipeDifficultyLabels[recipe.difficulty as RecipeDifficulty]}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto self-start sm:self-center">
                    <Button variant="default" size="sm" asChild className="w-full">
                        <Link href={`/receitas/${recipe.id}`}>Ver Receita</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleRemoveFavorite} className="w-full">
                        <Heart className="h-4 w-4 mr-2" />Remover
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}