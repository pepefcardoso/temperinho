import type { Recipe } from '@/types/recipe';
import FeaturedRecipes from './FeaturedRecipes';

interface RecipeSectionProps {
    initialRecipes: Recipe[];
}

export default function RecipeSection({ initialRecipes }: RecipeSectionProps) {
    return (
        <FeaturedRecipes recipes={initialRecipes} isLoading={false} />
    );
}