'use client';

import Link from 'next/link';
import type { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '../skeletons/CardSkeleton';

interface FeaturedRecipesProps {
    recipes: Recipe[];
    isLoading?: boolean;
}

const FeaturedRecipes = ({ recipes, isLoading = false }: FeaturedRecipesProps) => {
    const renderMainContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (!recipes || recipes.length === 0) {
            return (
                <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">Nenhuma receita em destaque no momento.</p>
                    <p className="text-sm text-muted-foreground/80 mt-2">Explore todas as nossas receitas abaixo!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        viewMode="grid"
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="py-16 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Receitas em Destaque
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore as nossas receitas mais amadas pela comunidade, todas testadas e aprovadas.
                    </p>
                </div>

                {renderMainContent()}

                {!isLoading && (
                    <div className="text-center mt-12">
                        <Button size="lg" asChild>
                            <Link href="/receitas">Ver Todas as Receitas</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedRecipes;