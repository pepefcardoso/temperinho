'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, Users } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { toast } from 'sonner';
import { Recipe, RecipeDifficulty, RecipeDifficultyLabels } from '@/types/recipe';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toggleFavoriteRecipe } from '@/lib/api/user';

const StatIcon = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <div className="flex items-center" title={String(children)}>
        <Icon className="h-4 w-4 mr-1.5 text-muted-foreground" />
        <span className="text-sm text-foreground">{children}</span>
    </div>
);

const dietaryTagVariants = cva(
    "inline-block px-2 py-0.5 text-xs font-medium rounded-md border bg-muted/50 text-muted-foreground border-border"
);

const difficultyStyles: Record<RecipeDifficulty, string> = {
    1: 'text-primary',
    2: 'text-primary',
    3: 'text-amber-500',
    4: 'text-destructive',
    5: 'text-destructive',
};

const cardVariants = cva(
    "bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border",
    {
        variants: {
            viewMode: {
                grid: "group flex flex-col hover:-translate-y-1",
                list: "flex flex-row items-center"
            }
        },
        defaultVariants: { viewMode: "grid" }
    }
);

interface RecipeCardProps extends VariantProps<typeof cardVariants> {
    recipe: Recipe;
}

export default function RecipeCard({ recipe, viewMode = 'grid' }: RecipeCardProps) {
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(recipe.is_favorited ?? false);
    const [isLoading, setIsLoading] = useState(false);

    const href = `/receitas/${recipe.id}`;

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Você precisa estar logado para favoritar receitas.");
            return;
        }
        setIsLoading(true);
        const originalState = isFavorited;
        setIsFavorited(!originalState);
        try {
            await toggleFavoriteRecipe(recipe.id);
            toast.success(originalState ? "Receita removida dos favoritos!" : "Receita adicionada aos favoritos!");
        } catch (error) {
            console.error("Erro ao atualizar favorito:", error);
            setIsFavorited(originalState);
            toast.error("Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const imageSizes = viewMode === 'grid'
        ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        : '(max-width: 576px) 33vw, 192px';

    return (
        <div className={cn(cardVariants({ viewMode }))}>
            <div
                className={cn(
                    "relative overflow-hidden flex-shrink-0",
                    viewMode === 'grid' ? 'w-full aspect-video' : 'w-1/3 h-full max-w-48'
                )}
            >
                <Link href={href} aria-label={`Ver receita ${recipe.title}`}>
                    <Image
                        src={recipe.image?.url ?? '/images/placeholder.svg'}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes={imageSizes}
                    />
                </Link>
                <button
                    onClick={handleFavoriteClick}
                    disabled={isLoading}
                    aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className={cn(
                        "absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-card/80 backdrop-blur-sm transition-colors duration-200 hover:bg-card",
                        isFavorited ? "text-destructive" : "text-muted-foreground hover:text-foreground",
                        isLoading && "cursor-not-allowed"
                    )}
                >
                    <Heart className={cn("h-5 w-5 transition-all", isFavorited && "fill-destructive")} />
                </button>
            </div>

            <div className={cn("p-4 flex flex-col", viewMode === 'grid' ? 'flex-grow' : 'flex-1')}>
                {recipe.category && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        {recipe.category.name}
                    </p>
                )}
                <h3 className={cn("font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight",
                    viewMode === 'grid' ? 'text-xl line-clamp-2' : 'text-lg line-clamp-1'
                )}>
                    <Link href={href}>{recipe.title}</Link>
                </h3>
                {viewMode === 'list' && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
                        {recipe.description}
                    </p>
                )}
                <div className="flex-grow" />
                {recipe.diets && recipe.diets.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-border">
                        {recipe.diets.map(diet => (
                            <span key={diet.id} className={dietaryTagVariants()}>{diet.name}</span>
                        ))}
                    </div>
                )}
                <div className={cn("flex items-center justify-between text-sm mt-3",
                    (!recipe.diets || recipe.diets.length === 0) && "pt-3 border-t border-border"
                )}>
                    <div className="flex items-center space-x-4">
                        <StatIcon icon={Clock}>{recipe.time} min</StatIcon>
                        <StatIcon icon={Users}>{recipe.portion} porções</StatIcon>
                    </div>
                    {recipe.difficulty && (
                        <div className={cn("font-bold", difficultyStyles[recipe.difficulty])}>
                            {RecipeDifficultyLabels[recipe.difficulty]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}