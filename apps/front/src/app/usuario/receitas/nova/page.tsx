import { RecipeForm } from '@/components/recipe/forms/RecipeForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nova Receita | Temperinho' };

export default function NewRecipePage() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-display font-bold text-foreground">Crie uma Nova Receita</h1>
                    <p className="text-muted-foreground mt-2">Compartilhe sua criação com a nossa comunidade.</p>
                </div>
                <RecipeForm action="create" />
            </div>
        </div>
    );
}
